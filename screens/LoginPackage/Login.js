import React from "react";
import { useState } from "react";

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
} from "react-native";

const Login = ({ navigation }) => {
  const [idValue, setId] = useState("");
  const [pwValue, setPw] = useState("");
  const [toDos, setToDos] = useState({});
  const saveUserId = (event) => {
    setId(event.target.value);
  };
  const saveUserPw = (event) => {
    setPw(event.target.value);
    // console.log(event.target.value);
  };
  const onChangeText = (payload) => setId(payload);

  const onLoginPress = () => {
    setId("");
    setPw("");
    console.log(idValue);
    console.log(pwValue);
    alert(idValue);
  };

  const onFbLoginPress = async () => {
    Alert.alert("아직 개발중입니다.");
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
                style={styles.loginPWTextInput}
                secureTextEntry={true}
              />
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate("MainPage")}
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
                onPress={() => navigation.navigate("FindPw")}
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
