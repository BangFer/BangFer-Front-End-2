import React from "react";
import { View, Dimensions } from "react-native";
import { WebView } from "react-native-webview";

const Web = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        style={{
          flex: 1,
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
        source={{
          uri: "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=4dbcb6576cb9e895c6419116dd540374&redirect_uri=http://13.125.14.94/:8080/oauth/kakao/redirect",
        }}
        onNavigationStateChange={(e) => {
          if (e.url.includes("code=")) {
            console.log("인증 코드가 포함된 URL:", e.url);
            navigation.navigate("KaKaoLoginRedirect", {
              token: e.url.split("code=")[1],
            });
          }
        }}
      ></WebView>
    </View>
  );
};
export default Web;
