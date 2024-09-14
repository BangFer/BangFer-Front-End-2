import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  TouchableOpacity, 
  ToastAndroid,
  Alert
} from 'react-native';
import axios from 'axios';
import { getTokenFromLocal } from '../LoginPackage/TokenUtils';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const NicknameInput = styled.TextInput`
  width: 80%;
  height: 40px;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: #FFB056;
  padding: 10px 20px;
  border-radius: 5px;
`;

const SaveButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const NicknameChange = ({ navigation }) => {
    const [newNickname, setNewNickname] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const tokenData = await getTokenFromLocal();
                if (!tokenData || !tokenData.accessToken) {
                    throw new Error('인증 토큰을 찾을 수 없습니다.');
                }

                const response = await axios.get(
                    'http://13.125.14.94:8080/accounts/profile/myProfile',
                    {
                        headers: {
                            "Content-type": "application/json; charset=UTF-8",
                            "Authorization": "Bearer " + tokenData.accessToken,
                        },
                    }
                );

                if (response.data && response.data.result) {
                    setProfileData(response.data.result);
                    setNewNickname(response.data.result.nickName);
                } else {
                    throw new Error('프로필 데이터를 가져올 수 없습니다.');
                }
            } catch (error) {
                console.error('프로필 데이터 가져오기 오류:', error);
                Alert.alert('오류', '프로필 정보를 가져올 수 없습니다.');
            }
        };

        fetchProfileData();
    }, [navigation]);

    const handleSave = useCallback(async () => {
        if (!newNickname.trim()) {
            ToastAndroid.show('새 닉네임을 입력해주세요.', ToastAndroid.SHORT);
            return;
        }

        if (!profileData || !profileData.profileId) {
            Alert.alert('오류', '프로필 정보를 찾을 수 없습니다.');
            return;
        }

        setIsLoading(true);

        try {
            const tokenData = await getTokenFromLocal();
            if (!tokenData || !tokenData.accessToken) {
                throw new Error('인증 토큰을 찾을 수 없습니다.');
            }

            const formData = new FormData();

            // 'request' 필드에 JSON 문자열로 변환된 데이터 추가
            const requestData = JSON.stringify({
                nickname: newNickname,
                name: profileData.name,
                description: profileData.description,
                dateOfBirth: profileData.dateOfBirth,
                gender: profileData.gender,
            });
            formData.append('request', requestData);

            console.log('Sending request to:', `http://13.125.14.94:8080/accounts/profile/${profileData.profileId}`);
            console.log('FormData:', formData);

            const response = await axios.put(
                `http://13.125.14.94:8080/accounts/profile/${profileData.profileId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${tokenData.accessToken}`,
                    },
                    timeout: 10000,
                }
            );

            if (response.status === 200) {
                ToastAndroid.show('닉네임이 업데이트되었습니다.', ToastAndroid.SHORT);
                navigation.goBack();
            } else {
                throw new Error('서버에서 오류 응답을 받았습니다.');
            }
        } catch (error) {
            console.error('Error updating nickname:', error);
            
            let errorMessage = '닉네임 업데이트 중 오류가 발생했습니다.';
            if (error.response) {
                console.error('Error response:', error.response.data);
                errorMessage += ` (${error.response.status})`;
            } else if (error.request) {
                console.error('Error request:', error.request);
                errorMessage = '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.';
            } else {
                console.error('Error message:', error.message);
            }
            
            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [newNickname, profileData, navigation]);

    if (!profileData) {
        return (
            <Container>
                <Text>프로필 정보를 불러오는 중...</Text>
            </Container>
        );
    }

    return (
        <Container>
            <Title>닉네임 변경</Title>
            <NicknameInput
                value={newNickname}
                onChangeText={setNewNickname}
                placeholder="새 닉네임 입력"
            />
            <SaveButton onPress={handleSave} disabled={isLoading}>
                <SaveButtonText>{isLoading ? '저장 중...' : '저장'}</SaveButtonText>
            </SaveButton>
        </Container>
    );
};

export default NicknameChange;