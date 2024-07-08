import React from "react";
import { useState } from "react";
import { useMutation } from "react-query";
import axios from "axios";
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

const showFailLogin = () => {
  ToastAndroid.show(
    "❌ 등록되지 않은 이메일이거나 비밀번호가 일치하지 않습니다.",
    ToastAndroid.LONG
  );
};
const LoginRequest = async ({ email, password }) => {
  const token = "string";
  try {
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
    };

    const data = {
      email: email,
      password: password,
      fcmToken: token,
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

const showToken = async () => {
  try {
    const value = await AsyncStorage.getItem("Tokens");
    console.log(value);
  } catch (e) {
    console.log("에러");
  }
};

const Login = ({ navigation }) => {
  const { mutate: Loginmutate } = useMutation(LoginRequest, {
    onSuccess: (data) => {
      console.log("성공", data);
      AsyncStorage.setItem(
        "Tokens",
        JSON.stringify({
          accessToken: data.result.accessToken,
          refreshToken: data.result.refreshToken,
          userId: data.result.userId,
        })
      );
      navigation.navigate("MainPage");
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
    Loginmutate({ email: idValue, password: pwValue });
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
              <Text style={styles.logoText}>LOGIN</Text>
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
              <TouchableOpacity style={styles.KaKaoLoginButton}>
                <Image
                  source={require("../../assets/Kakao.png")}
                  style={styles.KaKaoImage}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.loginThirdView}>
              <TouchableOpacity
                style={styles.FindPWButton}
                onPress={() => navigation.navigate("FindPwEmail")}
              >
                <Text style={styles.FindPwButtonText}>비밀번호 찾기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.SignUpButton}
                onPress={() => navigation.navigate("MiddleSignUp")}
              >
                <Text style={styles.SignUpButtonText}>회원가입</Text>
              </TouchableOpacity>
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
  loginScreenContainer: {
    width: "100%",
    height: "100%",
  },
  logoText: {
    fontSize: 38,
    marginTop: 270,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline",
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
