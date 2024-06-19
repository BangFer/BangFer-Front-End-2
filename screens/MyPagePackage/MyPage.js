import { StatusBar } from "expo-status-bar";
import BackGround from "../../assets/Back2.png";
import PrivacyButtonImage from "../../assets/Button5.png";
import SettingButtonImage from "../../assets/Button6.png";
import FriendButtonImage from "../../assets/Button7.png";
import HelpButtonImage from "../../assets/Button8.png";
import React, { useState } from "react";
import styled from "styled-components";

import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
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
  flex: 5;
  justify-content: center;
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

const MyPage = ({ navigation }) => {
  const [isInformEnabled, setIsInformEnabled] = useState(false);
  const InformtoggleSwitch = () =>
    setIsInformEnabled((previousState) => !previousState);

  const [isDarkEnabled, setIsDarkEnabled] = useState(false);
  const DarktoggleSwitch = () =>
    setIsDarkEnabled((previousState) => !previousState);
  return (
    <Container>
      <FirstView>
        <FirstProfileView>
          <ProfileImage></ProfileImage>
        </FirstProfileView>
        <SecondProfileView>
          <NickNameShow>닉네임</NickNameShow>
          <AccountText>카카오 계정</AccountText>
          <AccountText>이메일 계정</AccountText>
        </SecondProfileView>
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
        <TouchContent>
          <ContentText>로그아웃</ContentText>
        </TouchContent>
      </FifthView>
    </Container>
  );
};

export default MyPage;
