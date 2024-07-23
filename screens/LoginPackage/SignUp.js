import React from "react";
import { useState } from "react";
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

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
  ToastAndroid,
} from "react-native";
import styled from "styled-components";

const requestSignup = async ({ name, email, password, passwordCheck }) => {
  try {
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
    };

    const data = {
      name: name,
      email: email,
      password: password,
      passwordCheck: passwordCheck,
    };

    console.log(data);

    const response = await axios.post(
      "http://13.125.14.94:8080/accounts/signup",
      data,
      {
        headers: headers,
      }
    );

    return response.data; // 반환할 데이터 형식에 맞게 수정
  } catch (error) {
    console.error(error.response);
    throw error.response;
  }
};

const showPasswordCheck = () => {
  ToastAndroid.show("❌ 비밀번호가 일치하지 않습니다.", ToastAndroid.LONG);
};

const showEmptySignUp = () => {
  ToastAndroid.show("❌ 입력이 올바르지 않습니다.", ToastAndroid.LONG);
};

const showSuccessSignUp = () => {
  ToastAndroid.show("✅ 회원가입 성공", ToastAndroid.LONG);
};

const showErrorEmail = () => {
  ToastAndroid.show("❌ 올바른 이메일 형식이 아닙니다.", ToastAndroid.LONG);
};

const showErrorPassword = () => {
  ToastAndroid.show(
    "❌ 비밀번호는 8자 이상, 특수문자 한 개 이상 포함해야 합니다.",
    ToastAndroid.LONG
  );
};

const SignUp = ({ navigation }) => {
  const route = useRoute();
  const { idValue } = route.params;

  const [pwValue, setPw] = useState("");
  const [nameValue, setName] = useState("");
  const [repwValue, setrePw] = useState("");
  const onChangeName = (payload) => setName(payload);
  const onChangePw = (payload) => setPw(payload);
  const onChangerePw = (payload) => setrePw(payload);

  const showPassword = () => {
    ToastAndroid.show(
      "비밀번호는 8자 이상, 특수문자 한 개 이상 포함해야 합니다.",
      ToastAndroid.SHORT,
      ToastAndroid.TOP
    );
  };
  const { mutate: requestEmailMutate } = useMutation(requestSignup, {
    onSuccess: (data) => {
      console.log("성공", data);
      // 성공 시 필요한 처리 추가
      showSuccessSignUp();
      navigation.navigate("Login");
    },
    onError: (error) => {
      console.error("에러", error);
      // 에러 시 필요한 처리 추가
      const errorMessage = error.data?.message || "Something went wrong";
      const errorResult = error.data?.result;

      if (errorResult && errorResult.email) {
        showErrorEmail();
      } else if (errorResult && errorResult.password) {
        showErrorPassword();
      } else {
        Alert.alert("Error", errorMessage);
      }
    },
  });

  const handlerequestSignup = () => {
    if (!pwValue || !nameValue || !repwValue) {
      showEmptySignUp();
      return;
    }

    if (pwValue != repwValue) {
      showPasswordCheck();
      return;
    }
    requestEmailMutate({
      name: nameValue,
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
      <View style={styles.container}>
        <View style={styles.SignUpFirstView}>
          <Text style={styles.logoText}>회원가입</Text>
        </View>
        <View style={styles.SignUpSecondView}>
          <Text>이름</Text>
          <TextInput
            className="setName"
            type="text"
            placeholder="name"
            value={nameValue}
            onChangeText={onChangeName}
            style={styles.SignUpTextInput}
          />

          <Text>비밀번호</Text>
          <TextInput
            onFocus={showPassword}
            placeholder="Password"
            value={pwValue}
            onChangeText={onChangePw}
            style={styles.SignUpTextInput}
            secureTextEntry={true}
          />
          <Text>비밀번호 재입력</Text>
          <TextInput
            placeholder="re.Password"
            value={repwValue}
            onChangeText={onChangerePw}
            style={styles.SignUpTextInput}
            secureTextEntry={true}
          />
          <TouchableOpacity
            style={styles.SignUpButton}
            onPress={handlerequestSignup}
          >
            <Text style={styles.SignUpButtonText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};
export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  SignUpFirstView: {
    flex: 1,
  },
  SignUpSecondView: {
    flex: 1.1,
  },

  logoText: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 320,
    textAlign: "center",
    textDecorationLine: "underline",
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
    marginBottom: 20,
    alignItems: "center",
    marginTop: 10,
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
