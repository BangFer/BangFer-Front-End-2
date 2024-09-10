import React from "react";
import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import {
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import {
  login,
  logout,
  getProfile as getKakaoProfile,
  shippingAddresses as getKakaoShippingAddresses,
  unlink,
} from "@react-native-seoul/kakao-login";
const Container = styled.View`
  flex: 1;
`;

const FirstView = styled.View`
  flex: 1;
  /* background-color: blue; */
`;

const SecondView = styled.View`
  flex: 1.1;
  align-items: center;
  justify-content: space-between;
  /* background-color: red; */
`;

const TitleText = styled.Text`
  font-size: 30px;
  font-weight: bold;
  margin-top: 290px;
  text-align: center;
  text-decoration-line: underline;
`;

const KaKaoSignUpButton = styled.TouchableOpacity`
  width: 240px;
  height: 50px;
  border-radius: 10px;
  margin-bottom: 200px;
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

const requestKaKaoSignup = async (accessToken) => {
  try {
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
    };

    const data = {
      accessToken: accessToken,
    };

    console.log(data);

    const response = await axios.post(
      "http://13.125.14.94:8080/accounts/social/signup/kakao",
      data,
      {
        headers: headers,
      }
    );

    return response.data; // 반환할 데이터 형식에 맞게 수정
  } catch (error) {
    if (error.response) {
      console.log(error.response);
      // 서버가 2xx 범위를 벗어나는 상태 코드로 응답한 경우
      console.error("상태 코드:", error.response.status);
      console.error("응답 데이터:", error.response.data);
      console.error("응답 헤더:", error.response.headers);

      if (error.response.status === 400) {
        console.error("잘못된 요청: 요청 데이터를 확인해주세요.");
      } else if (error.response.status === 401) {
        console.error("인증 실패: 액세스 토큰을 확인해주세요.");
      } else if (error.response.status === 500) {
        console.error("서버 오류: 잠시 후 다시 시도해주세요.");
      }
    } else if (error.request) {
      // 요청이 전송되었지만 응답을 받지 못한 경우
      console.error("응답 없음: 네트워크 연결을 확인해주세요.");
    } else {
      // 요청 설정 중 오류가 발생한 경우
      console.error("요청 설정 오류:", error.message);
    }

    // 에러 객체 자체를 던집니다.
    throw error;
  }
};
const showSuccessSignUp = () => {
  ToastAndroid.show("✅ 카카오 회원가입 성공", ToastAndroid.LONG);
};

const MiddleSignUp = ({ navigation }) => {
  const signInWithKakao = async () => {
    try {
      const token = await login();
      console.log("gg" + JSON.stringify(token));
      console.log(token.accessToken);
      return token.accessToken; // accessToken을 직접 반환
    } catch (err) {
      console.error("login err", err);
      throw err; // 에러를 다시 던져서 호출자가 처리할 수 있게 함
    }
  };

  const handleKaKaoSignUp = async () => {
    try {
      const accessToken = await signInWithKakao();
      await requestKaKaoSignup(accessToken);
      showSuccessSignUp();
      navigation.navigate("Login");
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      ToastAndroid.show(
        "❌ 이미 회원가입한 카카오 계정입니다.",
        ToastAndroid.LONG
      );
      navigation.navigate("Login");
    }
  };

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
          <GeneralSignUpButton
            onPress={() => navigation.navigate("EmailVerify")}
          >
            <GeneralSignUpText>일반 회원가입</GeneralSignUpText>
          </GeneralSignUpButton>
          <KaKaoSignUpButton onPress={handleKaKaoSignUp}>
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
