import { StatusBar } from "expo-status-bar";
import BackGround from "../../assets/Back2.png";
import PrivacyButtonImage from "../../assets/Button5.png";
import SettingButtonImage from "../../assets/Button6.png";
import FriendButtonImage from "../../assets/Button7.png";
import HelpButtonImage from "../../assets/Button8.png";
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Feather from "@expo/vector-icons/Feather";
import axios from "axios";
import {
  verifyTokens,
  getTokenFromLocal,
  removeTokenFromLocal,
} from "../LoginPackage/TokenUtils";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useMutation } from "react-query";
import { useFocusEffect } from "@react-navigation/native";
import BlockListModal from "./BlockListModal"; // 새 컴포넌트 import

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
  flex-direction: row;
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

const ViewContent = styled.View`
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

const FirstNotiModalView = styled.View`
  flex: 0.8;
  justify-content: center;
  align-items: center;
`;

const SecondModalView = styled.View`
  flex: 5;
  justify-content: center;
  align-items: center;
`;

const ThirdModalView = styled.View`
  flex: 0.6;
  justify-content: center;
  align-items: center;
`;

const InviteThirdModalView = styled.View`
  flex: 1.3;
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

const NotiSeparator = styled.View`
  width: 2px;
  height: 100%;
  background-color: black;
`;

const ViewForFlatList = styled.View`
  width: 100%;
  height: 40px;
  flex-direction: row;
`;

const ViewForNotiFlatList = styled.View`
  width: 100%;
  height: 80px;
  flex-direction: row;
`;

const NotiFirstViewForFlatList = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const NotiSecondViewForFlatList = styled.View`
  flex: 3;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const NotiThirdViewForFlatList = styled.View`
  flex: 4;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

const NotiFourthViewForFlatList = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
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

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
  width: 80%;
`;

const ModalText = styled.Text`
  font-size: 16px;
  text-align: center;
  margin-bottom: 20px;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 10px;
  background-color: #ffb056;
  border-radius: 5px;
`;

const CloseButtonText = styled.Text`
  color: black;
  font-weight: bold;
`;

const EmailText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
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

    return response.data;
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

    return response.data;
  } catch (error) {
    console.error(error.response);
    throw error.response;
  }
};

const GetMyNotification = async () => {
  const Token = await getTokenFromLocal();
  const headers_config = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": "Bearer " + Token.accessToken,
  };

  try {
    const res = await axios.post(
      "http://13.125.14.94:8080/fcm/notification",
      {},
      {
        headers: headers_config,
      }
    );
    console.log("GetMyNotification의 response는", JSON.stringify(res.data));
    return res.data.result;
  } catch (error) {
    console.error("GetMyNotification error:", error);

    if (error.response) {
      // 서버가 2xx 범위를 벗어나는 상태 코드로 응답한 경우
      console.error(
        "서버 응답 오류:",
        error.response.status,
        error.response.data
      );
      throw new Error(`서버 응답 오류: ${error.response.status}`);
    } else if (error.request) {
      // 요청이 전송되었지만 응답을 받지 못한 경우
      console.error("서버로부터 응답이 없습니다.");
      throw new Error("서버와의 통신 실패");
    } else {
      // 요청 설정 중 오류가 발생한 경우
      console.error("요청 설정 오류:", error.message);
      throw new Error("요청 설정 중 오류 발생");
    }
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
    console.log("GetMyInvitation의 response는", JSON.stringify(res.data));
    return res.data.result;
  } catch (error) {
    console.error("GetMyInvitation error:", error);
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

const NotificationItem = ({ title, body, createdAt }) => {
  return (
    <ViewForNotiFlatList>
      <NotiFirstViewForFlatList>
        <TextForFlatList>{title}</TextForFlatList>
      </NotiFirstViewForFlatList>
      <NotiSeparator></NotiSeparator>
      <NotiSecondViewForFlatList>
        <NotiThirdViewForFlatList>
          <TextForFlatList style={{ fontSize: 12 }}>{body}</TextForFlatList>
        </NotiThirdViewForFlatList>
        <NotiFourthViewForFlatList>
          <TextForFlatList style={{ fontSize: 8, marginRight: 10 }}>
            {createdAt}
          </TextForFlatList>
        </NotiFourthViewForFlatList>
      </NotiSecondViewForFlatList>
    </ViewForNotiFlatList>
  );
};

const MyPage = ({ navigation }) => {
  const [profileData, setProfileData] = useState(null);
  const [inviteData, setInviteData] = useState([]);
  const [notificationData, setNotificationData] = useState([]);
  const [isNotificationModalVisible, setIsNotificationModalVisible] =
    useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInquiryModalVisible, setIsInquiryModalVisible] = useState(false);
  const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);
  const [isBlockListModalVisible, setIsBlockListModalVisible] = useState(false);

  const fetchProfileData = useCallback(async () => {
    try {
      const Token = await getTokenFromLocal();
      const response = await axios.get(
        "http://13.125.14.94:8080/accounts/profile/myProfile",
        {
          headers: {
            Authorization: `Bearer ${Token.accessToken}`,
          },
        }
      );
      setProfileData(response.data.result);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [fetchProfileData])
  );

  const handleImageChange = () => {
    navigation.navigate("ProfileImageChange", { profileData });
  };

  const handleInquiryPress = () => {
    setIsInquiryModalVisible(true);
  };

  const handleHelpPress = () => {
    setIsHelpModalVisible(true);
  };

  const handleBlockListPress = () => {
    setIsBlockListModalVisible(true);
  };

  const handleLogout = async () => {
    Alert.alert("로그아웃", "정말로 로그아웃 하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "확인",
        onPress: async () => {
          try {
            await removeTokenFromLocal();
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
            ToastAndroid.show("로그아웃 되었습니다.", ToastAndroid.SHORT);
          } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
            ToastAndroid.show(
              "로그아웃 중 오류가 발생했습니다.",
              ToastAndroid.SHORT
            );
          }
        },
      },
    ]);
  };

  const { mutate: InviteAcceptMutate } = useMutation(InviteAccept, {
    onSuccess: (data) => {
      showSuccessAccept();
      setIsModalVisible(false);
    },
    onError: (error) => {
      console.error("에러", error);
    },
  });

  const { mutate: InviteRejectMutate } = useMutation(InviteReject, {
    onSuccess: (data) => {
      showSuccessReject();
      setIsModalVisible(false);
    },
    onError: (error) => {
      console.error("에러", error);
    },
  });

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

  const fetchNotificationData = async () => {
    const data = await GetMyNotification();
    console.log(data);
    const transformedData = data.map((item, index) => {
      // createdAt 문자열을 Date 객체로 변환
      const date = new Date(item.createdAt);

      // 날짜와 시간을 원하는 형식으로 포맷팅
      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(
        date.getHours()
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

      console.log(formattedDate);
      return {
        id: (index + 1).toString(),
        title: item.title,
        body: item.body,
        createdAt: formattedDate, // 새로 포맷팅된 날짜 추가
      };
    });
    setNotificationData(transformedData);
  };

  const handleEmailChange = () => {
    navigation.navigate("EmailChange");
  };

  const handlePasswordChange = () => {
    navigation.navigate("PasswordChange");
  };

  const handleMemberOut = () => {
    navigation.navigate("MemberOut");
  };

  const ClickInviteBox = () => {
    setIsModalVisible(true);
    fetchInviteData();
  };

  const ClickNotificationBox = () => {
    setIsNotificationModalVisible(true);
    fetchNotificationData();
  };

  return (
    <Container>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isInquiryModalVisible}
        onRequestClose={() => setIsInquiryModalVisible(false)}
      >
        <ModalContainer>
          <ModalContent>
            <EmailText>bangfer2019@gmail.com</EmailText>
            <ModalText>
              서비스를 이용하면서 발생하는 모든 문의사항은 위의 메일을 통해 저희
              팀으로 연락해 주시기 바랍니다.{"\n\n"}
              방구석퍼거슨은 여러분의 목소리에 귀 기울이고 신속하고 충분한
              답변을 드릴 수 있도록 최선을 다하겠습니다.
            </ModalText>
            <CloseButton onPress={() => setIsInquiryModalVisible(false)}>
              <CloseButtonText>닫기</CloseButtonText>
            </CloseButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isHelpModalVisible}
        onRequestClose={() => setIsHelpModalVisible(false)}
      >
        <ModalContainer>
          <ModalContent>
            <ModalText>
              1. 마이페이지에서는 자신의 계정정보관리 및 추가 기능을 수행할 수
              있습니다.{"\n\n"}
              2. 계정정보관리에는 계정 및 프로필 정보 수정, 회원탈퇴, 로그아웃이
              있습니다.{"\n\n"}
              3. 추가 기능에는 차단 관리, 문의하기 기능이 있습니다.
            </ModalText>
            <CloseButton onPress={() => setIsHelpModalVisible(false)}>
              <CloseButtonText>닫기</CloseButtonText>
            </CloseButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
      <BlockListModal
        isVisible={isBlockListModalVisible}
        onClose={() => setIsBlockListModalVisible(false)}
      />
      <Modal
        animationType="slide"
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <ContainerModalView onPress={() => setIsModalVisible(false)}>
          <ModalView style={{ height: "40%" }}>
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
            <ModalSeparator></ModalSeparator>
            <InviteThirdModalView>
              <CloseButton onPress={() => setIsModalVisible(false)}>
                <CloseButtonText>닫기</CloseButtonText>
              </CloseButton>
            </InviteThirdModalView>
          </ModalView>
        </ContainerModalView>
      </Modal>
      <Modal
        animationType="slide"
        visible={isNotificationModalVisible}
        transparent={true}
        onRequestClose={() => setIsNotificationModalVisible(false)}
      >
        <ContainerModalView>
          <ModalView style={{ height: "70%" }}>
            <FirstNotiModalView>
              <TextForTitleInvite>알림목록</TextForTitleInvite>
            </FirstNotiModalView>
            <ModalSeparator></ModalSeparator>
            <SecondModalView>
              <FlatList
                data={notificationData}
                renderItem={({ item }) => (
                  <NotificationItem
                    title={item.title}
                    body={item.body}
                    createdAt={item.createdAt}
                  />
                )}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={ModalSeparator}
                ListFooterComponent={ModalSeparator}
                initialNumToRender={5}
                nestedScrollEnabled={true}
                maxToRenderPerBatch={10}
                style={{ width: "100%", height: "100%" }}
                removeClippedSubview="true"
              />
            </SecondModalView>
            <ModalSeparator></ModalSeparator>
            <ThirdModalView>
              <CloseButton onPress={() => setIsNotificationModalVisible(false)}>
                <CloseButtonText>닫기</CloseButtonText>
              </CloseButton>
            </ThirdModalView>
          </ModalView>
        </ContainerModalView>
      </Modal>
      <FirstView>
        <FirstProfileView>
          <ProfileImage onPress={handleImageChange}>
            {profileData && profileData.ProfileImageUrl && (
              <Image
                source={{ uri: profileData.ProfileImageUrl }}
                style={{ width: 60, height: 60, borderRadius: 30 }}
              />
            )}
          </ProfileImage>
        </FirstProfileView>
        <SecondProfileView>
          <NickNameShow>
            {profileData ? profileData.nickName : "로딩 중..."}
          </NickNameShow>
          <AccountText>
            {profileData ? profileData.name : "로딩 중..."}
          </AccountText>
          <AccountText>
            {profileData ? profileData.email : "로딩 중..."}
          </AccountText>
        </SecondProfileView>
        <ThirdProfileView>
          <InviteBox
            style={{ marginRight: 10 }}
            onPress={() => ClickNotificationBox()}
          >
            <Feather name="bell" size={30} color="black" />
          </InviteBox>
          <InviteBox onPress={() => ClickInviteBox()}>
            <Feather name="mail" size={30} color="black" />
          </InviteBox>
        </ThirdProfileView>
      </FirstView>
      <SecondView>
        <TitleView>
          <TitleText>계정</TitleText>
        </TitleView>
        <TouchContent onPress={() => navigation.navigate("NicknameChange")}>
          <ContentText>닉네임 변경</ContentText>
        </TouchContent>
        <TouchContent onPress={handleImageChange}>
          <ContentText>프로필 이미지 변경</ContentText>
        </TouchContent>
        <TouchContent onPress={handleEmailChange}>
          <ContentText>이메일 변경</ContentText>
        </TouchContent>
        <TouchContent onPress={handlePasswordChange}>
          <ContentText>비밀번호 변경</ContentText>
        </TouchContent>
      </SecondView>
      <ThirdView>
        <TitleView>
          <TitleText>차단 관리</TitleText>
        </TitleView>
        <TouchContent onPress={handleBlockListPress}>
          <ContentText>차단 목록</ContentText>
        </TouchContent>
      </ThirdView>
      <FourthView>
        <TitleView>
          <TitleText>이용 안내</TitleText>
        </TitleView>
        <ViewContent
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
        </ViewContent>
        <TouchContent onPress={handleInquiryPress}>
          <ContentText>문의하기</ContentText>
        </TouchContent>
        <TouchContent onPress={handleHelpPress}>
          <ContentText>도움말</ContentText>
        </TouchContent>
      </FourthView>
      <FifthView>
        <TitleView>
          <TitleText>기타</TitleText>
        </TitleView>
        <TouchContent onPress={handleMemberOut}>
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
