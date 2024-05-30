import { StatusBar } from "expo-status-bar";
import BackGround from '../../assets/Back2.png';
import PrivacyButtonImage from "../../assets/Button5.png";
import SettingButtonImage from "../../assets/Button6.png";
import FriendButtonImage from "../../assets/Button7.png";
import HelpButtonImage from "../../assets/Button8.png";
import React from "react";
import styled from "styled-components";

import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

const Container = styled.View`
  flex: 1;
  flex-direction: column;
`;

const BackGroundView = styled.View`
  ${StyleSheet.absoluteFillObject};
  z-index: -1;
`;

const FirstView = styled.View`
  flex: 1;
`;

const SecondView = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 200px;
`;

const ThirdView = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top : 120px;
`;

const FourthView = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const ForButtonInThirdView = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TitleText = styled.Text`
  font-size: 50px;
  font-weight: 900;
  color: black;
  text-decoration-line: underline;
`;

const BackGroundImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const PrivacyAndSettingButton = styled.TouchableOpacity`
  padding-vertical: 15px;
  padding-horizontal: 15px;
  border-radius: 10px;
  width: 150px;
  height: 150px;
  margin: -10px;
`;

const FriendAndSettingButton = styled.TouchableOpacity`
  padding-vertical: 15px;
  padding-horizontal: 15px;
  border-radius: 10px;
  width: 150px;
  height: 150px;
  margin: -10px;
`;
const ButtonsImage = styled.Image`
  width: 100%;
  height: 100%;
  z-index: 1;
`;


const MyPage = ({ navigation }) => {
  return (
    <Container>
    <StatusBar style="auto" />
    <BackGroundView>
      <BackGroundImage source={BackGround} resizeMode={"cover"} />
    </BackGroundView>
    <FirstView></FirstView>
    <SecondView>
      <TitleText>BANGUSUK</TitleText>
      <TitleText>FERGUSON</TitleText>
    </SecondView>
    <ThirdView>
      <ForButtonInThirdView>
        <PrivacyAndSettingButton
          onPress={() => navigation.navigate("Tactics")}
        >
          <ButtonsImage source={PrivacyButtonImage} resizeMode={"contain"} />
        </PrivacyAndSettingButton>
        <PrivacyAndSettingButton
          onPress={() => navigation.navigate("FreeBoard")}
        >
          <ButtonsImage
            source={SettingButtonImage}
            resizeMode={"contain"}
          />
        </PrivacyAndSettingButton>
      </ForButtonInThirdView>
      <ForButtonInThirdView>
        <FriendAndSettingButton
          onPress={() => navigation.navigate("BangusukTeam")}
        >
          <ButtonsImage
            source={FriendButtonImage}
            resizeMode={"contain"}
          />
        </FriendAndSettingButton>
        <FriendAndSettingButton
          onPress={() => navigation.navigate("MyPage")}
        >
          <ButtonsImage source={HelpButtonImage} resizeMode={"contain"} />
        </FriendAndSettingButton>
      </ForButtonInThirdView>
    </ThirdView>
    <FourthView></FourthView>
  </Container>
  );
};

export default MyPage;

