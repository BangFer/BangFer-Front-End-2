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
const FindPw = ({ navigation }) => {
  const [EmailValue, setEmail] = useState("");

  const onChangeText = (payload) => setEmail(payload);

  const onLoginPress = () => {
    setEmail("");

    console.log(EmailValue);
    alert(EmailValue);
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
            <View style={styles.FindPwContainer}>
              <View style={styles.FindPwView}>
                <Text style={styles.logoText}>비밀번호 찾기</Text>
                <Text>이메일</Text>
                <TextInput
                  className="setEmail"
                  type="text"
                  placeholder="email"
                  value={EmailValue}
                  onChangeText={onChangeText}
                  style={styles.FindPwTextInput}
                />

                <View style={{}}>
                  <TouchableOpacity
                    style={styles.FindPwButton}
                    onPress={() => onLoginPress()}
                  >
                    <Text style={styles.FindPwButtonText}>Send Code</Text>
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
export default FindPw;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 200,
  },
  FindPwContainer: {
    flex: 1,
    marginTop: -200,
  },
  logoText: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 300,
    marginBottom: 40,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  FindPwView: {
    flex: 1,
  },
  FindPwTextInput: {
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
  FindPwButton: {
    backgroundColor: "#fe6263",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  FindPwButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
