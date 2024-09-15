import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ToastAndroid,
  StyleSheet,
  Alert
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { getTokenFromLocal } from '../LoginPackage/TokenUtils';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ProfileImage = styled.Image`
  width: 110px;
  height: 110px;
  border-radius: 55px;
  border-width: 2px;
  ${({ uri }) =>
    !uri &&
    `
    background-color: #ccc;
  `}
`;

const ChangeImageButton = styled.TouchableOpacity`
  background-color: #FFB056;
  padding: 10px 20px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const ChangeImageText = styled.Text`
  color: black;
  font-size: 16px;
  font-weight: bold;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: #FFB056;
  padding: 10px 20px;
  border-radius: 5px;
`;

const SaveButtonText = styled.Text`
  color: black;
  font-size: 16px;
  font-weight: bold;
`;

const ProfileImageChange = ({ navigation }) => {
    const [imageFile, setImageFile] = useState(null);
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

    const handleImagePick = useCallback(() => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: false,
                maxWidth: 512,
                maxHeight: 512,
                quality: 0.7,
            },
            (response) => {
                if (response.didCancel) {
                    return;
                } else if (response.errorCode) {
                    console.log('Image Error: ' + response.errorCode);
                    Alert.alert('Error', '이미지를 선택하는 중 오류가 발생했습니다.');
                } else {
                    setImageFile({
                        uri: response.assets[0].uri,
                        name: response.assets[0].fileName,
                        type: response.assets[0].type,
                    });
                }
            }
        );
    }, []);

    const handleSave = useCallback(async () => {
        if (!imageFile) {
            ToastAndroid.show('새 이미지를 선택해주세요.', ToastAndroid.SHORT);
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
            formData.append('profileImage', imageFile);

            const profileDataJson = JSON.stringify({
                nickname: profileData.nickName,
                name: profileData.name,
                description: profileData.description,
                dateOfBirth: profileData.dateOfBirth,
                gender: profileData.gender,
            });
            formData.append('request', profileDataJson);

            console.log('Sending request to:', `http://13.125.14.94:8080/accounts/profile/${profileData.profileId}`);

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
                ToastAndroid.show('프로필 이미지가 업데이트되었습니다.', ToastAndroid.SHORT);
                navigation.goBack();
            } else {
                throw new Error('서버에서 오류 응답을 받았습니다.');
            }
        } catch (error) {
            console.error('Error updating profile image:', error);
            
            let errorMessage = '프로필 이미지 업데이트 중 오류가 발생했습니다.';
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
    }, [imageFile, profileData, navigation]);

    if (!profileData) {
        return (
            <Container>
                <Text>프로필 정보를 불러오는 중...</Text>
            </Container>
        );
    }

    return (
        <Container>
            <Title>프로필 이미지 변경</Title>
            <ProfileImage
                source={{ uri: imageFile ? imageFile.uri : profileData.ProfileImageUrl }}
            />
            <ChangeImageButton onPress={handleImagePick} disabled={isLoading}>
                <ChangeImageText>이미지 선택</ChangeImageText>
            </ChangeImageButton>
            <SaveButton onPress={handleSave} disabled={isLoading}>
                <SaveButtonText>{isLoading ? '저장 중...' : '저장'}</SaveButtonText>
            </SaveButton>
        </Container>
    );
};

export default ProfileImageChange;