import { StatusBar } from "expo-status-bar";
import BackGround from "../../assets/Back2.png";
import PrivacyButtonImage from "../../assets/Button5.png";
import SettingButtonImage from "../../assets/Button6.png";
import FriendButtonImage from "../../assets/Button7.png";
import HelpButtonImage from "../../assets/Button8.png";
import React, { useState } from "react";
import styled from "styled-components";
import Feather from "@expo/vector-icons/Feather";
import axios from "axios";
import { verifyTokens, getTokenFromLocal, removeTokenFromLocal } from "../LoginPackage/TokenUtils";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useMutation } from "react-query";

import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  Modal,
  FlatList,
  ToastAndroid,
  Alert,
} from "react-native";

const Container = styled.View`
  flex: 1;
`;

const FirstView = styled.View`
  flex: 3;
  margin: 10px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #d0d0d0;
  flex-direction: row;
`;
const SecondView = styled.View`
  flex: 5;
  margin: 10px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #d0d0d0;
`;
const ThirdView = styled.View`
  flex: 3;
  margin: 10px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #d0d0d0;
`;
const FourthView = styled.View`
  flex: 4;
  margin: 10px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #d0d0d0;
`;
const FifthView = styled.View`
  flex: 3;
  margin: 10px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #d0d0d0;
`;

const FirstProfileView = styled.View`
  flex: 2;
  align-items: center;
  justify-content: center;
`;

const SecondProfileView = styled.View`
  flex: 4;
  justify-content: center;
`;

const ThirdProfileView = styled.View`
  flex: 2;
  justify-content: center;
  align-items: center;
`;

const InviteBox = styled.TouchableOpacity`
  width: 29px;
  height: 29px;
  justify-content: center;
  align-items: center;
`;

const ProfileImage = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  background-color: gray;
  border-radius: 30px;
`;

const NickNameShow = styled.Text`
  font-weight: bold;
  color: black;
  font-size: 17px;
`;

const AccountText = styled.Text`
  font-size: 12px;
  color: grey;
`;

const TitleText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
`;

const TitleView = styled.View`
  flex: 1;
  justify-content: center;
`;
const TouchContent = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
`;

const ContentText = styled.Text`
  font-size: 15px;
  margin-left: 10px;
  margin-bottom: 5px;
`;

const ContainerModalView = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const ModalView = styled.View`
  width: 300px;
  height: 220px;
  margin: 30px;
  margin-bottom: 75px;
  border-radius: 15px;
  background-color: white;
  border-width: 2px;
  border-color: black;
`;

const FirstModalView = styled.View`
  flex: 1.5;
  justify-content: center;
  align-items: center;
`;

const SecondModalView = styled.View`
  flex: 5;
  justify-content: center;
  align-items: center;
`;

const TextForTitleInvite = styled.Text`
  font-size: 25px;
  text-decoration: underline;
  font-weight: bold;
`;

const ModalSeparator = styled.View`
  height: 2px;
  width: 100%;
  background-color: black;
`;

const ViewForFlatList = styled.View`
  width: 100%;
  height: 40px;
  flex-direction: row;
`;

const FirstViewForFlatList = styled.View`
  flex: 3;
  justify-content: center;
  margin-left: 10px;
`;

const SecondViewForFlatList = styled.View`
  flex: 2;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
`;

const TextForFlatList = styled.Text`
  font-size: 15px;
  font-weight: bold;
`;

const TouchForAcceptInvite = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 20px;
`;

const showSuccessAccept = () => {
  ToastAndroid.show("✅ 초대 수락", ToastAndroid.LONG);
};

const showSuccessReject = () => {
  ToastAndroid.show("❌ 초대 거절", ToastAndroid.LONG);
};

const InviteReject = async ({ inviteId }) => {
  const Token = await getTokenFromLocal();
  try {
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + Token.accessToken,
    };

    const url = "http://13.125.14.94:8080/" + inviteId + "/reject";
    const response = await axios.post(
      url,
      {},
      {
        headers: headers,
      }
    );

    return response.data; // 반환할 데이터 형식에 맞게 수정
  } catch (error) {
    console.error(error.response);
    throw error.response;
  }
};

const InviteAccept = async ({ inviteId }) => {
  const Token = await getTokenFromLocal();
  try {
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + Token.accessToken,
    };

    const url = "http://13.125.14.94:8080/" + inviteId + "/accept";
    console.log("what" + url);
    const response = await axios.post(
      url,
      {},
      {
        headers: headers,
      }
    );

    return response.data; // 반환할 데이터 형식에 맞게 수정
  } catch (error) {
    console.error(error.response);
    throw error.response;
  }
};

const GetMyInvitation = async () => {
  const Token = await getTokenFromLocal();

  const headers_config = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": "Bearer " + Token.accessToken,
  };

  try {
    const res = await axios.get("http://13.125.14.94:8080/myinvitation", {
      headers: headers_config,
    });
    console.log("GetMyInvitation의 response는", JSON.stringify(res.data)); // JSON.stringify로 객체를 문자열로 변환
    return res.data.result;
  } catch (error) {
    if (error.response) {
      // 서버가 응답했지만 상태 코드가 2xx가 아닌 경우
      console.error(
        "GetMyInvitation의 error 응답 데이터:",
        error.response.data
      );
      console.error(
        "GetMyInvitation의 error 상태 코드:",
        error.response.status
      );
      console.error("GetMyInvitation의 error 헤더:", error.response.headers);
    } else if (error.request) {
      // 요청이 이루어졌지만 응답을 받지 못한 경우
      console.error("GetMyInvitation의 error 요청:", error.request);
    } else {
      // 요청을 설정하는 도중에 발생한 에러
      console.error("GetMyInvitation의 error 메시지:", error.message);
    }
    console.error("GetMyInvitation의 error config:", error.config);
  }
};

const Item = ({ nickName, inviteId, onAccept, onReject }) => {
  return (
    <ViewForFlatList>
      <FirstViewForFlatList>
        <TextForFlatList>{nickName}님의 초대</TextForFlatList>
      </FirstViewForFlatList>
      <SecondViewForFlatList>
        <TouchForAcceptInvite onPress={() => onAccept({ inviteId })}>
          <AntDesign name="checkcircle" size={20} color="green" />
        </TouchForAcceptInvite>
        <TouchForAcceptInvite onPress={() => onReject({ inviteId })}>
          <AntDesign name="closecircle" size={20} color="red" />
        </TouchForAcceptInvite>
      </SecondViewForFlatList>
    </ViewForFlatList>
  );
};

const MyPage = ({ navigation }) => {
  const { mutate: InviteAcceptMutate } = useMutation(InviteAccept, {
    onSuccess: (data) => {
      // 성공 시 필요한 처리 추가
      showSuccessAccept();
      setIsModalVisible(false);
    },
    onError: (error) => {
      console.error("에러", error);
      // 에러 시 필요한 처리 추가
    },
  });

  const handleLogout = async () => {
    Alert.alert(
      "로그아웃",
      "정말로 로그아웃 하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel"
        },
        {
          text: "확인",
          onPress: async () => {
            try {
              // 1. 로컬 저장소에서 토큰 삭제
              await removeTokenFromLocal();
              
              // 2. 전역 상태 초기화 (React Context나 Redux를 사용중이라면 여기서 처리)
              // 예: dispatch({ type: 'RESET_USER_STATE' });

              // 3. 로그인 화면으로 네비게이션
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });

              // 로그아웃 성공 메시지 표시
              ToastAndroid.show("로그아웃 되었습니다.", ToastAndroid.SHORT);
            } catch (error) {
              console.error("로그아웃 중 오류 발생:", error);
              ToastAndroid.show("로그아웃 중 오류가 발생했습니다.", ToastAndroid.SHORT);
            }
          }
        }
      ]
    );
  };

  const { mutate: InviteRejectMutate } = useMutation(InviteReject, {
    onSuccess: (data) => {
      // 성공 시 필요한 처리 추가
      showSuccessReject();
      setIsModalVisible(false);
    },
    onError: (error) => {
      console.error("에러", error);
      // 에러 시 필요한 처리 추가
    },
  });
  const [inviteData, setInviteData] = useState([]);

  const fetchInviteData = async () => {
    const data = await GetMyInvitation();
    console.log(data);
    const transformedData = data.map((item, index) => ({
      id: (index + 1).toString(),
      nickName: item.nickName,
      inviteId: item.inviteId,
    }));
    setInviteData(transformedData);
  };

  const ClickInviteBox = () => {
    setIsModalVisible(true);
    fetchInviteData();
  };
  const [isInformEnabled, setIsInformEnabled] = useState(false);
  const InformtoggleSwitch = () =>
    setIsInformEnabled((previousState) => !previousState);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isDarkEnabled, setIsDarkEnabled] = useState(false);
  const DarktoggleSwitch = () =>
    setIsDarkEnabled((previousState) => !previousState);
  return (
    <Container>
      <Modal // 친구 초대 모달
        animationType="slide"
        visible={isModalVisible}
        transparent={true}
      >
        <ContainerModalView onPress={() => setIsModalVisible(false)}>
          <ModalView>
            <FirstModalView>
              <TextForTitleInvite>초대목록</TextForTitleInvite>
            </FirstModalView>
            <ModalSeparator></ModalSeparator>
            <SecondModalView>
              <FlatList
                data={inviteData}
                renderItem={({ item }) => (
                  <Item
                    nickName={item.nickName}
                    inviteId={item.inviteId}
                    onAccept={InviteAcceptMutate}
                    onReject={InviteRejectMutate}
                  />
                )}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={ModalSeparator}
                ListFooterComponent={ModalSeparator}
                initialNumToRender={12}
                nestedScrollEnabled={true}
                maxToRenderPerBatch={10}
                style={{ width: "100%", height: "100%" }}
                removeClippedSubview="true"
              />
            </SecondModalView>
          </ModalView>
        </ContainerModalView>
      </Modal>
      <FirstView>
        <FirstProfileView>
          <ProfileImage></ProfileImage>
        </FirstProfileView>
        <SecondProfileView>
          <NickNameShow>닉네임</NickNameShow>
          <AccountText>카카오 계정</AccountText>
          <AccountText>이메일 계정</AccountText>
        </SecondProfileView>
        <ThirdProfileView>
          <InviteBox onPress={() => ClickInviteBox()}>
            <Feather name="mail" size={30} color="black" />
          </InviteBox>
        </ThirdProfileView>
      </FirstView>
      <SecondView>
        <TitleView>
          <TitleText>계정</TitleText>
        </TitleView>
        <TouchContent>
          <ContentText>닉네임 설정</ContentText>
        </TouchContent>
        <TouchContent>
          <ContentText>프로필 이미지 변경</ContentText>
        </TouchContent>
        <TouchContent>
          <ContentText>이메일 변경</ContentText>
        </TouchContent>
        <TouchContent>
          <ContentText>비밀번호 변경</ContentText>
        </TouchContent>
      </SecondView>
      <ThirdView>
        <TitleView>
          <TitleText>앱 설정</TitleText>
        </TitleView>
        <TouchContent
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ContentText>알림 설정</ContentText>
          <Switch
            trackColor={{ false: "#767577", true: "#F7E11A" }}
            thumbColor={isInformEnabled ? "#f4f3f4" : "#f4f3f4"}
            onValueChange={InformtoggleSwitch}
            value={isInformEnabled}
            style={{ marginRight: 5, marginBottom: 5 }}
          />
        </TouchContent>
        <TouchContent
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ContentText>다크 모드</ContentText>
          <Switch
            trackColor={{ false: "#767577", true: "#F7E11A" }}
            thumbColor={isDarkEnabled ? "#f4f3f4" : "#f4f3f4"}
            onValueChange={DarktoggleSwitch}
            value={isDarkEnabled}
            style={{ marginRight: 5, marginBottom: 5 }}
          />
        </TouchContent>
      </ThirdView>
      <FourthView>
        <TitleView>
          <TitleText>이용 안내</TitleText>
        </TitleView>
        <TouchContent
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ContentText>앱 버전</ContentText>
          <ContentText style={{ color: "grey", marginRight: 10 }}>
            1.0.0
          </ContentText>
        </TouchContent>
        <TouchContent>
          <ContentText>문의하기</ContentText>
        </TouchContent>
        <TouchContent>
          <ContentText>도움말</ContentText>
        </TouchContent>
      </FourthView>
      <FifthView>
        <TitleView>
          <TitleText>기타</TitleText>
        </TitleView>
        <TouchContent>
          <ContentText>회원 탈퇴</ContentText>
        </TouchContent>
        <TouchContent onPress={handleLogout}>
          <ContentText>로그아웃</ContentText>
        </TouchContent>
      </FifthView>
    </Container>
  );
};

export default MyPage;
