import React from "react";
import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import axios from "axios";
import messaging from "@react-native-firebase/messaging";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  login,
  logout,
  getProfile as getKakaoProfile,
  shippingAddresses as getKakaoShippingAddresses,
  unlink,
} from "@react-native-seoul/kakao-login";
import EmailVerifyRecover from "./EmailVerifyRecover";
import styled from "styled-components";

const logoText = styled.Text`
  font-size: 38px;
  marginTop: 270,
  font-weight: 700;
  color: black;
  text-decoration-line: underline;
  margin-bottom: 50px;
  font-family: LexendDeca-Bold;
  textAlign: center;
`;

const showFailLogin = () => {
  ToastAndroid.show(
    "❌ 등록되지 않은 이메일이거나 비밀번호가 일치하지 않습니다.",
    ToastAndroid.LONG
  );
};
const LoginRequest = async ({ email, password, fcmToken }) => {
  const token = "string";
  try {
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
    };

    const data = {
      email: email,
      password: password,
      fcmToken: fcmToken,
    };

    console.log(email);
    console.log(password);

    console.log(data);

    const response = await axios.post(
      "http://13.125.14.94:8080/accounts/login",
      data,
      {
        headers: headers,
      }
    );
    console.log(response.data);
    return response.data; // 반환할 데이터 형식에 맞게 수정
  } catch (error) {
    showFailLogin();
    console.error(error.response);
    throw new Error("Failed to Login");
  }
};

const checkProfile = async (accessToken) => {
  try {
    const response = await axios.get(
      "http://13.125.14.94:8080/accounts/profile/myProfile",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return true; // 프로필이 존재함
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === "PROFILE403"
    ) {
      return false; // 프로필이 존재하지 않음
    }
    throw error; // 다른 에러의 경우 그대로 던짐
  }
};

const showToken = async () => {
  try {
    const value = await AsyncStorage.getItem("profileId");
    console.log(value);
  } catch (e) {
    console.log("에러");
  }
};

const requestKaKaoLogin = async ({ accessToken, fcmToken }) => {
  try {
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
    };

    const data = {
      accessToken: accessToken,
      fcmToken: fcmToken,
    };

    console.log(data);

    const response = await axios.post(
      "http://13.125.14.94:8080/accounts/social/login/kakao",
      data,
      {
        headers: headers,
      }
    );
    console.log("로그인 " + JSON.stringify(response.data));
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

const showSuccessLogin = () => {
  ToastAndroid.show("✅ 카카오 로그인 성공", ToastAndroid.LONG);
};

const Login = ({ navigation }) => {
  const [accessToken, setAccessToken] = useState("");
  const [fcmToken, setFcmToken] = useState("");

  const getFcmToken = async () => {
    const fcm = await messaging().getToken();
    console.log("[+] FCM Token :: ", fcm);
    setFcmToken(fcm);
  };
  useEffect(() => {
    const fetchFcmToken = async () => {
      await getFcmToken();
    };

    fetchFcmToken();
  }, []);
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

  const handleKaKaoLogin = async () => {
    try {
      const accessToken = await signInWithKakao(); // 반환된 accessToken을 사용
      console.log("ggg" + accessToken);
      const fcmm = await messaging().getToken();
      console.log("ff" + fcmm);
      const data = await requestKaKaoLogin({ accessToken, fcmToken });
      await AsyncStorage.setItem(
        "Tokens",
        JSON.stringify({
          accessToken: data.result.accessToken,
          refreshToken: data.result.refreshToken,
          userId: data.result.userId,
        })
      );
      showSuccessLogin();

      try {
        const hasProfile = await checkProfile(data.result.accessToken);
        if (hasProfile) {
          navigation.navigate("MainPage");
        } else {
          navigation.navigate("CreateProfile");
        }
      } catch (profileError) {
        console.error("프로필 확인 중 오류 발생:", profileError);
        // 프로필 확인 중 오류 발생 시 기본적으로 MainPage로 이동
        navigation.navigate("MainPage");
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      ToastAndroid.show(
        "❌ 회원가입이 되지않은 카카오 계정입니다.",
        ToastAndroid.LONG
      );
      navigation.navigate("Login");
    }
  };

  const { mutate: Loginmutate } = useMutation(LoginRequest, {
    onSuccess: async (data) => {
      console.log("성공", data);
      await AsyncStorage.setItem(
        "Tokens",
        JSON.stringify({
          accessToken: data.result.accessToken,
          refreshToken: data.result.refreshToken,
          userId: data.result.userId,
        })
      );

      try {
        const hasProfile = await checkProfile(data.result.accessToken);
        if (hasProfile) {
          navigation.navigate("MainPage");
        } else {
          navigation.navigate("CreateProfile");
        }
      } catch (error) {
        console.error("프로필 확인 중 에러 발생:", error);
        // 에러 발생 시 기본적으로 MainPage로 이동
        navigation.navigate("MainPage");
      }
    },
    onError: (error) => {
      console.error("에러", error);
      // 에러 시 필요한 처리 추가
    },
  });

  const [idValue, setId] = useState("");
  const [pwValue, setPw] = useState("");
  const [toDos, setToDos] = useState({});

  const onChangeText = (payload) => setId(payload);
  const onChangePw = (payload) => setPw(payload);
  const onLoginPress = () => {
    setId("");
    setPw("");
    console.log(idValue);
    console.log(pwValue);
    alert(idValue);
  };

  const handleLogin = () => {
    Loginmutate({ email: idValue, password: pwValue, fcmToken: fcmToken });
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
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.loginScreenContainer}>
            <View style={styles.loginFirstView}>
              <logoText>LOGIN</logoText>
            </View>
            <View style={styles.loginSecondView}>
              <TextInput
                className="setId"
                type="text"
                placeholder="Id"
                value={idValue}
                onChangeText={onChangeText}
                style={styles.loginIDTextInput}
              />

              <TextInput
                placeholder="Password"
                type="text"
                value={pwValue}
                onChangeText={onChangePw}
                style={styles.loginPWTextInput}
                secureTextEntry={true}
              />
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.KaKaoLoginButton}
                onPress={handleKaKaoLogin}
              >
                <Image
                  source={require("../../assets/Kakao.png")}
                  style={styles.KaKaoImage}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.loginThirdView}>
              <View styles={styles.loginFourthView}>
                <TouchableOpacity
                  style={styles.FindPWButton}
                  onPress={() => navigation.navigate("FindPwEmail")}
                >
                  <Text style={styles.FindPwButtonText}>비밀번호 찾기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.FindPWButton}
                  onPress={() => navigation.navigate(EmailVerifyRecover)}
                >
                  <Text style={styles.FindPwButtonText}>탈퇴회원 복구</Text>
                </TouchableOpacity>
              </View>
              <View styles={styles.loginFivthView}>
                <TouchableOpacity
                  style={styles.SignUpButton}
                  onPress={() => navigation.navigate("MiddleSignUp")}
                >
                  <Text style={styles.SignUpButtonText}>회원가입</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </ImageBackground>
  );
};
export default Login;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  loginFirstView: {
    flex: 1.9,
    alignItems: "center",
    justifyContent: "center",
  },
  loginSecondView: {
    flex: 1.25,
    alignItems: "center",
    justifyContent: "space-between",
  },
  loginThirdView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  loginFourthView: {
    flex: 1,
    backgroundColor: "red",
  },
  loginFivthView: {
    flex: 1,
    backgroundColor: "red",
  },
  loginScreenContainer: {
    width: "100%",
    height: "100%",
  },
  loginFormView: {
    flex: 1,
    backgroundColor: "blue",
  },
  loginIDTextInput: {
    height: "21%",
    width: "60%",
    fontSize: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
  },
  loginPWTextInput: {
    height: "21%",
    width: "60%",
    fontSize: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
  },
  KaKaoLoginButton: {
    width: "60%",
    height: "21%",
    borderRadius: 10,
    backgroundColor: "black",
  },
  loginButton: {
    backgroundColor: "#fe6263",
    width: "60%",
    height: "21%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  FindPWButton: {
    width: 100,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 75,
    marginTop: 10,
  },
  FindPwButtonText: {
    color: "gray",
    fontSize: 16,
    fontWeight: "bold",
  },
  SignUpButton: {
    width: 60,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 75,
    marginTop: 10,
  },
  SignUpButtonText: {
    color: "gray",
    fontSize: 16,
    fontWeight: "bold",
  },
  KaKaoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});
