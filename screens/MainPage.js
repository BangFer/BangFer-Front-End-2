import { StatusBar } from "expo-status-bar";
import BackGround from "../assets/Back2.png";
import TatcticsButtonImage from "../assets/Button1.png";
import BangusukTeamButtonImage from "../assets/Button2.png";
import FreeBoardButtonImage from "../assets/Button3.png";
import MypageButtonImage from "../assets/Button4.png";
import React from "react";
import styled from "styled-components";
import { useFocusEffect } from "@react-navigation/native";

import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  BackHandler,
  Alert,
} from "react-native";

const TitleTextBANGUSUK = styled.Text`
  font-size: 48px;
  font-weight: 700;
  color: black;
  text-decoration-line: underline;
  margin-top: -5px;
  font-family: LexendDeca-Bold;
`;

const TitleTextFERGUSON = styled.Text`
  font-size: 48px;
  font-weight: 700;
  color: #ff6262;
  text-decoration-line: underline;
  margin-bottom: 50px;
  font-family: LexendDeca-Bold;
`;

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
  flex: 1.3;
  flex-direction: column;
  justify-content: center;
`;

const ThirdViewForTitleText = styled.View`
  flex: 1.2;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FourthViewForButtons = styled.View`
  flex: 3;
  flex-direction: row;
  justify-content: center;
`;

const ForSortInFourthView = styled.View`
  align-items: center;
  justify-content: center;
`;

const ForSortInFourthView1 = styled.View`
  align-items: center;
  justify-content: center;
`;

const BackGroundImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const TacticsButton = styled.TouchableOpacity`
  border-radius: 10px;
  width: 130px;
  height: 130px;
  margin-bottom: 10px;
  margin-right: 5px;
`;

const BanggsukTeamButton = styled.TouchableOpacity`
  border-radius: 10px;
  width: 130px;
  height: 130px;
  margin-bottom: 60px;
  margin-right: 5px;
`;
const FreeBoardButton = styled.TouchableOpacity`
  border-radius: 10px;
  width: 130px;
  height: 130px;
  margin-bottom: 10px;
  margin-left: 5px;
`;

const MyPageButton = styled.TouchableOpacity`
  border-radius: 10px;
  width: 130px;
  height: 130px;
  margin-bottom: 60px;
  margin-left: 5px;
`;

const ButtonsImage = styled.Image`
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const MainPage = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "앱 종료",
          "정말로 앱을 종료하시겠습니까?",
          [
            {
              text: "취소",
              onPress: () => null,
              style: "cancel",
            },
            {
              text: "예",
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: false }
        );
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  return (
    <ImageBackground
      source={require("../assets/Back2.png")}
      style={{
        position: "absolute",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      }}
    >
      <Container>
        <FirstView></FirstView>
        <SecondView>
          <ThirdViewForTitleText>
            <TitleTextBANGUSUK>BANGUSUK</TitleTextBANGUSUK>
            <TitleTextFERGUSON>FERGUSON</TitleTextFERGUSON>
          </ThirdViewForTitleText>
          <FourthViewForButtons>
            <ForSortInFourthView>
              <TacticsButton onPress={() => navigation.navigate("Tactics")}>
                <ButtonsImage
                  source={TatcticsButtonImage}
                  resizeMode={"contain"}
                />
              </TacticsButton>
              <BanggsukTeamButton
                onPress={() => navigation.navigate("BanggusukTeam")}
              >
                <ButtonsImage
                  source={BangusukTeamButtonImage}
                  resizeMode={"contain"}
                />
              </BanggsukTeamButton>
            </ForSortInFourthView>
            <ForSortInFourthView1>
              <FreeBoardButton onPress={() => navigation.navigate("FreeBoard")}>
                <ButtonsImage
                  source={FreeBoardButtonImage}
                  resizeMode={"contain"}
                />
              </FreeBoardButton>
              <MyPageButton onPress={() => navigation.navigate("MyPage")}>
                <ButtonsImage
                  source={MypageButtonImage}
                  resizeMode={"contain"}
                />
              </MyPageButton>
            </ForSortInFourthView1>
          </FourthViewForButtons>
        </SecondView>
      </Container>
    </ImageBackground>
  );
};

export default MainPage;