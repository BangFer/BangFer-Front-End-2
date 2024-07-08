import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Alert,
  ToastAndroid,
} from "react-native";
import { useMutation } from "react-query";
import axios from "axios";
import styled from "styled-components/native";
import { useRoute } from "@react-navigation/native";

const showPassword = () => {
  ToastAndroid.show(
    "비밀번호는 8자 이상, 특수문자 한 개 이상 포함해야 합니다.",
    ToastAndroid.SHORT,
    ToastAndroid.TOP
  );
};

const showErrorPassword = () => {
  ToastAndroid.show(
    "❌ 비밀번호는 8자 이상, 특수문자 한 개 이상 포함해야 합니다.",
    ToastAndroid.LONG
  );
};

const showEmptyFindPassword = () => {
  ToastAndroid.show("❌ 입력이 올바르지 않습니다.", ToastAndroid.LONG);
};

const showPasswordCheck = () => {
  ToastAndroid.show("❌ 비밀번호가 일치하지 않습니다.", ToastAndroid.LONG);
};
const showSuccessFindPassword = () => {
  ToastAndroid.show("✅ 비밀번호 변경이 완료되었습니다.", ToastAndroid.LONG);
};

const FindPassword = async ({ email, password, passwordCheck }) => {
  try {
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
    };

    const data = {
      email: email,
      password: password,
      passwordCheck: passwordCheck,
    };

    console.log("request Body : ", data);

    const response = await axios.post(
      "http://13.125.14.94:8080/accounts/forgotPw",
      data,
      {
        headers: headers,
      }
    );

    return response.data; // 반환할 데이터 형식에 맞게 수정
  } catch (error) {
    console.log(error.response);
    if (error.response && error.response.data.code === "ERROR4000") {
      showErrorPassword();
    }
    throw new Error("Failed to verify Email");
  }
};
const Container = styled.View`
  flex: 1;
`;

const FirstView = styled.View`
  flex: 1;
`;

const SecondView = styled.View`
  flex: 1.1;
  align-items: center;
`;

const ThirdView = styled.View`
  flex: 1;
`;

const FourthView = styled.View`
  flex: 4;
`;

const TitleText = styled.Text`
  font-size: 30px;
  font-weight: bold;
  margin-top: 300px;
  text-align: center;
  text-decoration-line: underline;
`;

const PasswordTextInput = styled.TextInput`
  height: 50px;
  width: 240px;
  font-size: 14px;
  border-radius: 10px;
  border-width: 1px;
  border-color: black;
  background-color: #fafafa;
  padding-left: 5px;
`;

const ChangePasswordButton = styled.TouchableOpacity`
  background-color: #fe6263;
  width: 180px;
  height: 50px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
  margin-left: 30px;
`;

const ChangePasswordButtonText = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
`;

const FindPw = ({ navigation }) => {
  const route = useRoute();
  const { idValue } = route.params;

  const { mutate: FindPasswordMutate } = useMutation(FindPassword, {
    onSuccess: (data) => {
      console.log("성공", data);
      // 성공 시 필요한 처리 추가
      showSuccessFindPassword();
      navigation.navigate("Login");
    },
    onError: (error) => {
      console.error("에러", error);
      // 에러 시 필요한 처리 추가
    },
  });
  const [repwValue, setrePw] = useState("");
  const [pwValue, setPw] = useState("");

  const onChangePw = (payload) => setPw(payload);
  const onChangerePw = (payload) => setrePw(payload);
  const handFindPassword = () => {
    if (!pwValue || !repwValue) {
      showEmptyFindPassword();
      return;
    }

    if (pwValue != repwValue) {
      showPasswordCheck();
      return;
    }
    FindPasswordMutate({
      email: idValue,
      password: pwValue,
      passwordCheck: repwValue,
    });
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
          <TitleText>비밀번호 찾기</TitleText>
        </FirstView>
        <SecondView>
          <ThirdView>
            <Text style={{ marginBottom: 10, marginLeft: 3 }}>
              새 비밀번호 입력
            </Text>
            <PasswordTextInput
              onFocus={showPassword}
              placeholder="Password"
              value={pwValue}
              onChangeText={onChangePw}
              secureTextEntry={true}
            ></PasswordTextInput>
          </ThirdView>
          <FourthView>
            <Text style={{ marginTop: 10, marginLeft: 3 }}>
              새 비밀번호 재입력
            </Text>
            <PasswordTextInput
              placeholder="re.Password"
              value={repwValue}
              onChangeText={onChangerePw}
              secureTextEntry={true}
              style={{ marginTop: 10 }}
            ></PasswordTextInput>
            <ChangePasswordButton onPress={handFindPassword}>
              <ChangePasswordButtonText>비밀번호 변경</ChangePasswordButtonText>
            </ChangePasswordButton>
          </FourthView>
        </SecondView>
      </Container>
    </ImageBackground>
  );
};
export default FindPw;
