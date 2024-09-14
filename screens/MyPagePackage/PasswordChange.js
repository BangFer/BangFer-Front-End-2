import React, { useState } from 'react';
import { 
    ImageBackground, 
    Dimensions, 
    ToastAndroid, 
    ActivityIndicator,
    View
} from 'react-native';
import styled from 'styled-components/native';
import { useMutation } from 'react-query';
import axios from 'axios';
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

const PasswordInput = styled.TextInput`
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

const ChangeButton = styled.TouchableOpacity`
  height: 45px;
  width: 150px;
  background-color: #FFB056;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
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

const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
};

const requestEmailCode = async (email) => {
    try {
        const headers = {
            "Content-type": "application/json; charset=UTF-8",
        };

        const response = await axios.post(
            "http://13.125.14.94:8080/accounts/email/send-email",
            null,
            {
                headers: headers,
                params: {
                    email: email,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error Response : " + error.response);
        throw new Error("Failed to request Email");
    }
};

const verifyEmail = async (email, code) => {
    try {
        const headers = {
            "Content-type": "application/json; charset=UTF-8",
        };

        const data = {
            email: email,
            code: code
        };

        const response = await axios.post(
            "http://13.125.14.94:8080/accounts/email/verify",
            data,
            {
                headers: headers,
            }
        );

        return response.data;
    } catch (error) {
        console.error("Verify Email Error:", error.response);
        throw new Error("Failed to verify Email");
    }
};

const changePassword = async (password, newPassword, passwordCheck) => {
    const Token = await getTokenFromLocal();
    try {
        const headers = {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + Token.accessToken,
        };

        const data = {
            password: password,
            newPassword: newPassword,
            passwordCheck: passwordCheck
        };

        const url = "http://13.125.14.94:8080/accounts/changePw";

        const response = await axios.put(url, data, { headers });
        return response.data;
    } catch (error) {
        console.error("Change Password Error:", error.response);
        throw new Error("Failed to change password");
    }
};

const PasswordChangeComponent = ({ navigation }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [emailCode, setEmailCode] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { mutate: requestEmailMutate } = useMutation(requestEmailCode, {
        onMutate: () => {
            setIsLoading(true);
            showToast("잠시만 기다려주세요... 인증번호가 전송중입니다...");
        },
        onSuccess: (data) => {
            console.log("성공", data);
            showToast("인증 코드가 이메일로 전송되었습니다.");
        },
        onError: (error) => {
            console.error("에러", error);
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
                console.log("Verification Success:", data);
                showToast("이메일 인증 성공");
                setStep(2);
            },
            onError: (error) => {
                console.error("Verification Error:", error);
                showToast("이메일 인증에 실패했습니다.");
            },
        }
    );

    const { mutate: changePasswordMutate } = useMutation(
        () => changePassword(currentPassword, newPassword, confirmPassword),
        {
            onMutate: () => {
                setIsLoading(true);
            },
            onSuccess: (data) => {
                console.log("Password Change Success:", data);
                if (data.code === "OK") {
                    showToast("비밀번호 변경 성공. 다시 로그인해주세요.");
                    handleLogout();
                } else {
                    showToast("비밀번호 변경 실패: " + data.message);
                }
            },
            onError: (error) => {
                console.error("Password Change Error:", error);
                showToast("비밀번호 변경에 실패했습니다.");
            },
            onSettled: () => {
                setIsLoading(false);
            }
        }
    );

    const handleRequestCode = () => {
        requestEmailMutate(email);
    };

    const handleVerify = () => {
        verifyEmailMutate({ email, code: emailCode });
    };

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            showToast("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
            return;
        }
        changePasswordMutate();
    };

    const handleLogout = async () => {
        try {
            await removeTokenFromLocal();
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
            showToast("로그아웃 중 오류가 발생했습니다.");
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
                <VerifyView>
                    <TitleText>{step === 1 ? "이메일 인증" : "비밀번호 변경"}</TitleText>
                    {step === 1 ? (
                        <>
                            <EmailTextInput
                                placeholder="현재 이메일 주소"
                                value={email}
                                onChangeText={setEmail}
                            />
                            <VerifyButton onPress={handleRequestCode}>
                                <ButtonText>인증번호 전송</ButtonText>
                            </VerifyButton>
                            <EmailTextInput
                                placeholder="인증번호"
                                value={emailCode}
                                onChangeText={setEmailCode}
                            />
                            <VerifyButton onPress={handleVerify}>
                                <ButtonText>인증하기</ButtonText>
                            </VerifyButton>
                        </>
                    ) : (
                        <>
                            <PasswordInput
                                placeholder="현재 비밀번호"
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry
                            />
                            <PasswordInput
                                placeholder="새 비밀번호"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry
                            />
                            <PasswordInput
                                placeholder="새 비밀번호 확인"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                            <ChangeButton onPress={handleChangePassword}>
                                <ButtonText>비밀번호 변경</ButtonText>
                            </ChangeButton>
                        </>
                    )}
                </VerifyView>
            </Container>
            {isLoading && (
                <LoadingOverlay>
                    <ActivityIndicator size="large" color="#ffffff" />
                    <LoadingText>처리 중...</LoadingText>
                </LoadingOverlay>
            )}
        </ImageBackground>
    );
};

export default PasswordChangeComponent;