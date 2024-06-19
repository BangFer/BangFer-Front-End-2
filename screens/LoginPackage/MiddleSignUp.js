import React from "react";
import styled from "styled-components";
import { Dimensions, ImageBackground, TouchableOpacity } from "react-native";

const Container = styled.View`
  flex: 1;
`;

const FirstView = styled.View`
  flex: 1;
`;

const SecondView = styled.View`
  flex: 1.1;
  align-items: center;
  justify-content: space-between;
`;

const TitleText = styled.Text`
  font-size: 30px;
  font-weight: bold;
  margin-top: 320px;
  text-align: center;
  text-decoration-line: underline;
`;

const KaKaoSignUpButton = styled.TouchableOpacity`
  width: 240px;
  height: 50px;
  border-radius: 10px;
  margin-bottom: 260px;
`;

const GeneralSignUpButton = styled.TouchableOpacity`
  width: 240px;
  height: 50px;
  border-radius: 10px;
  background-color: #fe6263;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
`;

const GeneralSignUpText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #fff;
`;

const KaKaoSignUpImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;

const MiddleSignUp = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("../../assets/Back2.png")}
      style={{
        position: "absolute",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      }}
    >
      <Container>
        <FirstView>
          <TitleText>회원가입</TitleText>
        </FirstView>
        <SecondView>
          <GeneralSignUpButton onPress={() => navigation.navigate("SignUp")}>
            <GeneralSignUpText>일반 회원가입</GeneralSignUpText>
          </GeneralSignUpButton>
          <KaKaoSignUpButton>
            <KaKaoSignUpImage
              source={require("../../assets/kakaosignup.png")}
            ></KaKaoSignUpImage>
          </KaKaoSignUpButton>
        </SecondView>
      </Container>
    </ImageBackground>
  );
};
export default MiddleSignUp;
