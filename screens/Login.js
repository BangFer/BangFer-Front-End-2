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
      source={require("../assets/Back2.png")}
      style={{
        position: "absolute",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      }}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.loginScreenContainer}>
            <View style={styles.loginFormView}>
              <Text style={styles.logoText}>LOGIN</Text>
              <TextInput
                className="setId"
                type="text"
                placeholder="Id"
                value={idValue}
                onChangeText={onChangeText}
                style={styles.loginTextInput}
              />

              <TextInput
                placeholder="Password"
                style={styles.loginTextInput}
                secureTextEntry={true}
              />
              <View style={{}}>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => navigation.navigate("MainPage")}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.loginOther}
                  onPress={() => onFbLoginPress()}
                >
                  <Text
                    style={{
                      marginBottom: 10,
                      color: "grey",
                      fontSize: 18,
                      fontWeight: "700",
                    }}
                  >
                    Login with KakaoTalk
                  </Text>
                  <View style={styles.Other}>
                    <TouchableOpacity
                      style={styles.SignUpButton}
                      onPress={() => navigation.navigate("FindPw")}
                    >
                      <Text style={styles.FindPwButtonText}>비밀번호찾기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.SignUpButton}
                      onPress={() => navigation.navigate("SignUp")}
                    >
                      <Text style={styles.SignUpButtonText}>회원가입</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loginOther}
                  onPress={() => onLoginPress()}
                >
                  <Text
                    style={{
                      color: "gray",
                      fontSize: 10,
                      fontWeight: "bold",
                      marginTop: 40,
                    }}
                  >
                    Confirm
                  </Text>
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
    marginTop: 300,
  },
  loginScreenContainer: {
    flex: 1,
    marginTop: -200,
  },
  logoText: {
    fontSize: 38,
    fontWeight: "bold",
    marginTop: 190,
    marginBottom: 20,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  loginFormView: {
    flex: 1,
  },
  loginTextInput: {
    height: 50,
    width: 240,
    fontSize: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  loginButton: {
    backgroundColor: "#fe6263",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  loginOther: {
    marginTop: "40",
    backgroundColor: "transparent",
    alignItems: "center",
  },
  Other: {
    marginTop: "40",

    flexDirection: "row",
    alignContent: "space-around",
  },
  FindPwButtonText: {
    color: "gray",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 15,
  },
  SignUpButton: {
    color: "grey",
  },
  SignUpButtonText: {
    color: "gray",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 70,
  },
});
