import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Alert,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { useMutation } from "react-query";
import axios from "axios";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const showFailVerifyEmail = () => {
  ToastAndroid.show(
    "❌ 올바른 형식의 이메일을 입력해주세요.",
    ToastAndroid.LONG
  );
};

const showFailVerifyCode = () => {
  ToastAndroid.show("❌ 인증번호가 올바르지 않습니다.", ToastAndroid.LONG);
};
const showSuccessVerify = () => {
  ToastAndroid.show("✅ 인증성공", ToastAndroid.LONG);
};

const showEmailCode = () => {
  ToastAndroid.show(
    "✅ 이메일로 전송된 인증번호를 아래에 입력해주세요.",
    ToastAndroid.LONG
  );
};
const Container = styled.View`
  flex: 1;
`;

const EmailVerifyFirstView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const EmailVerifySecondView = styled.View`
  flex: 1.1;
  align-items: center;
`;

const TitleText = styled.Text`
  font-size: 38px;
  font-weight: bold;
  margin-top: 260px;
`;

const EmailTextInput = styled.TextInput`
  height: 50px;
  width: 240px;
  font-size: 14px;
  border-radius: 10px;
  border-width: 1px;
  border-color: black;
  background-color: white;
  padding-left: 5px;
`;

const VerifyCodeTextInput = styled.TextInput`
  height: 50px;
  width: 240px;
  font-size: 14px;
  border-radius: 10px;
  border-width: 1px;
  border-color: black;
  background-color: white;
  margin-top: 20px;
  padding-left: 5px;
`;

const RequestVerifyCodeButton = styled.TouchableOpacity`
  height: 45px;
  width: 150px;
  background-color: #fe6263;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const RequestVerifyCodeText = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
`;

const LoadingOverlay = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const LoadingText = styled.Text`
  color: white;
  font-size: 16px;
  margin-top: 10px;
`;

const CheckEmail = async (IdValue) => {
  const headers_config = {
    "Content-Type": "application/json; charset=UTF-8",
  };

  console.log("아아" + IdValue);
  const url = `http://13.125.14.94:8080/accounts/checkEmail?email=${encodeURIComponent(
    IdValue
  )}`;

  try {
    const res = await axios.get(url, {
      headers: headers_config,
    });
    console.log("CheckEmail의 response는", JSON.stringify(res.data));
    // JSON.stringify로 객체를 문자열로 변환
    return res;
  } catch (error) {
    console.error("에러 발생:", error.message);
    if (error.response) {
      console.error("서버 응답 상태:", error.response.status);
      console.error("서버 응답 헤더:", error.response.headers);
      console.error("서버 응답 데이터:", error.response.data);

      // USER417 에러 코드 확인
      if (error.response.data && error.response.data.code === "USER417") {
        throw new Error("USER417");
      }
    } else if (error.request) {
      console.error("요청 정보:", error.request);
    } else {
      console.error("에러 설정:", error.config);
    }
    throw error;
  }
};

const RequestEmail = async (email) => {
  console.log(email);
  try {
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
      // "accessToken" 추가 필요
    };

    const response = await axios.post(
      "http://13.125.14.94:8080/accounts/email/send-email", // url 주소
      null, // request body
      {
        // header, parameter
        headers: headers,
        params: {
          email: email,
        },
      }
    );

    return response.data; // 반환할 데이터 형식에 맞게 수정
  } catch (error) {
    console.error("Error Response : " + error.response);
    throw new Error("Failed to request Email");
  }
};

const VerifyEmail = async ({ email, code }) => {
  try {
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
    };

    const data = {
      email: email,
      code: code,
    };

    console.log(data);

    const response = await axios.post(
      "http://13.125.14.94:8080/accounts/email/verify",
      data,
      {
        headers: headers,
      }
    );

    return response.data; // 반환할 데이터 형식에 맞게 수정
  } catch (error) {
    console.error(error.response);
    throw new Error("Failed to verify Email");
  }
};

const EmailVerify = ({ navigation }) => {
  const [idValue, setIdValue] = useState("");
  const [codeValue, setCodeValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: requestEmailMutate } = useMutation(RequestEmail, {
    onMutate: () => {
      setIsLoading(true);
      ToastAndroid.show(
        "잠시만 기다려주세요... 인증번호가 전송중입니다...",
        ToastAndroid.LONG
      );
    },
    onSuccess: (data) => {
      console.log("성공", data);
      showEmailCode();
    },
    onError: (error) => {
      console.error("에러", error);
      showFailVerifyEmail();
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const { mutate: verifyEmailMutate } = useMutation(VerifyEmail, {
    onSuccess: (data) => {
      console.log("성공", data);
      showSuccessVerify();
      navigation.navigate("SignUp", { idValue });
    },
    onError: (error) => {
      console.error("에러", error);
      showFailVerifyCode();
    },
  });

  const handleVerifyCode = () => {
    verifyEmailMutate({ email: idValue, code: codeValue });
  };

  const handleRequestVerifyCode = async () => {
    try {
      await CheckEmail(idValue);
      // CheckEmail이 성공적으로 완료되면 requestEmailMutate 실행
      requestEmailMutate(idValue);
    } catch (error) {
      if (error.message === "USER417") {
        console.log("USER417 에러 발생: 이미 존재하는 이메일입니다.");
        ToastAndroid.show("❌ 이미 가입된 이메일입니다.", ToastAndroid.SHORT);
        // 예: 사용자에게 알림을 표시하거나, UI를 업데이트하는 등
      } else {
        console.log("기타 에러 발생:", error);
        // 다른 종류의 에러에 대한 처리
      }
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
        <EmailVerifyFirstView>
          <TitleText>이메일 인증</TitleText>
        </EmailVerifyFirstView>
        <EmailVerifySecondView>
          <EmailTextInput
            type="text"
            placeholder="Email을 입력해주세요"
            value={idValue}
            onChangeText={setIdValue}
          />
          <RequestVerifyCodeButton onPress={handleRequestVerifyCode}>
            <RequestVerifyCodeText>인증번호 전송</RequestVerifyCodeText>
          </RequestVerifyCodeButton>
          <VerifyCodeTextInput
            type="text"
            placeholder="인증번호를 입력해주세요"
            value={codeValue}
            onChangeText={setCodeValue}
          />
          <RequestVerifyCodeButton onPress={handleVerifyCode}>
            <RequestVerifyCodeText>인증하기</RequestVerifyCodeText>
          </RequestVerifyCodeButton>
        </EmailVerifySecondView>
      </Container>
      {isLoading && (
        <LoadingOverlay>
          <ActivityIndicator size="large" color="#ffffff" />
          <LoadingText>잠시만 기다려주세요...</LoadingText>
        </LoadingOverlay>
      )}
    </ImageBackground>
  );
};

export default EmailVerify;
