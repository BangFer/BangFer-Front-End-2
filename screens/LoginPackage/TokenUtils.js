import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// storage에서 토큰 갖고오는 메소드
export const getTokenFromLocal = async () => {
  try {
    const value = await AsyncStorage.getItem("Tokens");
    if (value !== null) {
      return JSON.parse(value);
    } else {
      return null;
    }
  } catch (e) {
    console.log(e.message);
  }
};

export const verifyTokens = async (navigation) => {
  await AsyncStorage.clear();
  const Token = await getTokenFromLocal();
  console.log("토큰 확인 : ", Token);
  // 최초 접속
  if (Token === null) {
    console.log("최초 접속입니다.");
    navigation.navigate("Login");
  } else {
    const headers_config = {
      "Content-Type": "application/json; charset=UTF-8",
      "RefreshToken": Token.refreshToken,
    };

    try {
      const res = await axios.get("http://13.125.14.94:8080/accounts/reissue", {
        headers: headers_config,
      });
      console.log(res);
      // accessToken 만료, refreshToken 정상 -> 재발급된 accessToken 저장 후 자동 로그인
      AsyncStorage.setItem(
        "Tokens",
        JSON.stringify({
          ...Token,
          accessToken: res.data.result.accessToken,
        })
      );
      navigation.navigate("MainPage");
    } catch (error) {
      // refresh가 만료됐을 경우 확인 필요
      console.error(error.response);
      // accessToken 만료, refreshToken 만료
      if (error.response && error.response.data.code === "SEC4011") {
        navigation.navigate("Login");
      }

      navigation.navigate("Login");
    }
  }
};
