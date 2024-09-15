import React, { useState } from "react";
import {
  ImageBackground,
  Dimensions,
  ToastAndroid,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useMutation } from "react-query";
import axios from "axios";
import styled from "styled-components/native";
import { getTokenFromLocal, removeTokenFromLocal } from "../LoginPackage/TokenUtils";

const Container = styled.View`
  flex: 1;
`;

const VerifyView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const TitleText = styled.Text`
  font-size: 30px;
  font-weight: bold;
  margin-top: 260px;
  text-decoration-line: underline;
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
  margin-top: 20px;
`;

const VerifyButton = styled.TouchableOpacity`
  height: 45px;
  width: 150px;
  background-color: #FFB056;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const ButtonText = styled.Text`
  color: black;
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

const showToast = (message) => {
  ToastAndroid.show(message, ToastAndroid.LONG);
};

const requestEmailCode = async (email) => {
  console.log("Requesting email code for:", email);
  try {
    const Token = await getTokenFromLocal();
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": `Bearer ${Token.accessToken}`,
    };

    const response = await axios.post(
      "http://13.125.14.94:8080/accounts/email/send-email",
      null,
      {
        headers: headers,
        params: { email },
      }
    );

    console.log("Email code request response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in requestEmailCode:", error.response || error);
    throw error;
  }
};

const verifyEmail = async (email, code) => {
  console.log("Verifying email:", email, "with code:", code);
  try {
    const Token = await getTokenFromLocal();
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": `Bearer ${Token.accessToken}`,
    };

    const data = { email, code };

    const response = await axios.post(
      "http://13.125.14.94:8080/accounts/email/verify",
      data,
      { headers }
    );

    console.log("Email verification response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in verifyEmail:", error.response || error);
    throw error;
  }
};

const deleteMember = async (email) => {
  console.log("Deleting member with email:", email);
  try {
    const Token = await getTokenFromLocal();
    const response = await axios.delete(
      `http://13.125.14.94:8080/accounts/delete/${email}`,
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": `Bearer ${Token.accessToken}`,
        },
      }
    );
    console.log("Delete member response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in deleteMember:", error.response || error);
    throw error;
  }
};

const MemberOut = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: requestEmailMutate } = useMutation(requestEmailCode, {
    onMutate: () => {
      setIsLoading(true);
      showToast("잠시만 기다려주세요... 인증번호가 전송중입니다...");
    },
    onSuccess: (data) => {
      console.log("Email code request success:", data);
      showToast("인증 코드가 이메일로 전송되었습니다.");
    },
    onError: (error) => {
      console.error("Email code request error:", error);
      showToast("인증 코드 전송에 실패했습니다.");
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const { mutate: verifyEmailMutate } = useMutation(
    ({ email, code }) => verifyEmail(email, code),
    {
      onSuccess: (data) => {
        console.log("Email verification success:", data);
        if (data.code === 'OK') {
          setIsVerified(true);
          showToast("✅ 인증성공");
        } else {
          showToast("❌ 인증번호가 올바르지 않습니다.");
        }
      },
      onError: (error) => {
        console.error("Email verification error:", error);
        showToast("❌ 인증에 실패했습니다.");
      },
    }
  );

  const { mutate: deleteMemberMutate } = useMutation(deleteMember, {
    onSuccess: async (data) => {
      console.log("Delete member success:", data);
      if (data.code === 'OK') {
        await removeTokenFromLocal();
        showToast('회원 탈퇴가 완료되었습니다.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        showToast('회원 탈퇴에 실패했습니다.');
      }
    },
    onError: (error) => {
      console.error("Delete member error:", error);
      showToast('회원 탈퇴 중 오류가 발생했습니다.');
    },
  });

  const handleRequestVerifyCode = () => {
    requestEmailMutate(email);
  };

  const handleVerifyCode = () => {
    verifyEmailMutate({ email, code: verificationCode });
  };

  const handleMemberOut = () => {
    Alert.alert(
      "회원 탈퇴",
      "정말로 탈퇴하시겠습니까? (30일 안에 계정 복구가 가능합니다.)",
      [
        { text: "취소", style: "cancel" },
        { text: "확인", onPress: () => deleteMemberMutate(email) }
      ]
    );
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
        <VerifyView>
          <TitleText>회원 탈퇴</TitleText>
          <EmailTextInput
            placeholder="현재 Email을 입력해주세요"
            value={email}
            onChangeText={setEmail}
          />
          <VerifyButton onPress={handleRequestVerifyCode}>
            <ButtonText>인증번호 전송</ButtonText>
          </VerifyButton>
          <EmailTextInput
            placeholder="인증번호를 입력해주세요"
            value={verificationCode}
            onChangeText={setVerificationCode}
          />
          <VerifyButton onPress={handleVerifyCode}>
            <ButtonText>인증하기</ButtonText>
          </VerifyButton>
          {isVerified && (
            <VerifyButton onPress={handleMemberOut}>
              <ButtonText>회원 탈퇴</ButtonText>
            </VerifyButton>
          )}
        </VerifyView>
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

export default MemberOut;