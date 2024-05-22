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
import styled from "styled-components";

const TitleTextBANGUSUK = styled.Text`
  font-size: 48px;
  font-weight: 700;
  color: black;
  text-decoration-line: underline;
  margin-top: -5px;
`;

const TitleTextFERGUSON = styled.Text`
  font-size: 48px;
  font-weight: 700;
  color: black;
  text-decoration-line: underline;
  margin-bottom: 50px;
`;

const FirstView = styled.View`
  flex: 1;
`;

const SecondView = styled.View`
  flex: 1.3;
  flex-direction: column;
  justify-content: center;
`;

const ThirdViewForTitleText = styled.View`
  flex: 1.2;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SignUp = ({ navigation }) => {
  const [idValue, setId] = useState("");
  const [pwValue, setPw] = useState("");

  const onChangeText = (payload) => setId(payload);

  const onLoginPress = () => {
    setId("");
    setPw("");
    console.log(idValue);
    console.log(pwValue);
    alert(idValue);
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
      <SecondView>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.SignUpScreenContainer}>
              <View style={styles.SignUpFormView}>
                <Text style={styles.logoText}>회원가입</Text>
                <Text>이메일</Text>
                <TextInput
                  className="setId"
                  type="text"
                  placeholder="email"
                  value={idValue}
                  onChangeText={onChangeText}
                  style={styles.SignUpTextInput}
                />
                <Text>비밀번호</Text>
                <TextInput
                  placeholder="Password"
                  style={styles.SignUpTextInput}
                  secureTextEntry={true}
                />
                <Text>비밀번호 재입력</Text>
                <TextInput
                  placeholder="re.Password"
                  style={styles.SignUpTextInput}
                  secureTextEntry={true}
                />
                <View style={{}}>
                  <TouchableOpacity style={styles.SignUpButton}>
                    <Text style={styles.SignUpButtonText}>SignUp</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SecondView>
    </ImageBackground>
  );
};
export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 300,
  },
  SignUpScreenContainer: {
    flex: 1,
    marginTop: -200,
  },
  logoText: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 160,
    marginBottom: 10,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  SignUpFormView: {
    flex: 1,
  },
  SignUpTextInput: {
    height: 50,
    width: 240,
    fontSize: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  SignUpButton: {
    backgroundColor: "#fe6263",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  SignUpButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  SignUpOther: {
    backgroundColor: "transparent",
    alignItems: "center",
  },
});
