import axios from "axios";
import React, { useEffect } from "react";
import { Text } from "react-native";

const KaKaoLoginRedirect = ({ navigation, route }) => {
  const code = route.params.token;
  console.log(code);
  useEffect(() => {});
  return <Text>로딩중...</Text>;
};
export default KaKaoLoginRedirect;
