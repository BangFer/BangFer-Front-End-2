import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { useMutation } from "react-query";
import axios from "axios";
import styled from "styled-components/native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { verifyTokens } from "./TokenUtils";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Loading = ({ navigation }) => {
  useEffect(() => {
    verifyTokens(navigation);
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/loadingpage.png")}
      style={{
        position: "absolute",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      }}
    >
      <Container>
        <ActivityIndicator size="large" />
      </Container>
    </ImageBackground>
  );
};
export default Loading;
