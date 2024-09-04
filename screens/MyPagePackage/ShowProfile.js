import React, { useState, useMemo, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Alert,
  ToastAndroid,
} from "react-native";
import { useMutation } from "react-query";
import axios from "axios";
import styled from "styled-components/native";
import { launchImageLibrary } from "react-native-image-picker";
import { verifyTokens, getTokenFromLocal } from "../LoginPackage/TokenUtils";
import { RadioGroup } from "react-native-radio-buttons-group";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";

const Container = styled.View`
  flex: 1;
`;

const FirstView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ViewForTitle = styled.View`
  flex: 1;
  justify-content: center;
`;

const ViewForProfileImg = styled.View`
  flex: 2;
`;

const SecondView = styled.View`
  flex: 1.8;
  align-items: center;
`;

const TitleText = styled.Text`
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  text-decoration-line: underline;
`;

const TouchForPlayerImage = styled.TouchableOpacity`
  width: 130px;
  height: 130px;
  border-radius: 65px;
  border-width: 2px;
  background-color: ${(props) => (props.hasImage ? "transparent" : "grey")};
  margin-left: 10px;
  overflow: hidden;
`;
const ProfileImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const TextForImgUpload = styled.Text`
  font-size: 14px;
`;

const ProfileTextInput = styled.TextInput`
  height: 50px;
  width: 240px;
  font-size: 14px;
  border-radius: 10px;
  border-width: 1px;
  border-color: black;
  background-color: #fafafa;
  padding-left: 5px;
`;

const EnrollProfileButton = styled.TouchableOpacity`
  background-color: #fe6263;
  width: 120px;
  height: 50px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
`;

const EnrollProfileText = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
`;

const GetProfile = async (userId) => {
  const Token = await getTokenFromLocal();

  const headers_config = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": "Bearer " + Token.accessToken,
  };

  const url = "http://13.125.14.94:8080/accounts/profile/" + userId;

  try {
    const res = await axios.get(url, {
      headers: headers_config,
    });
    console.log("GetProfile의 response는", JSON.stringify(res.data));
    // JSON.stringify로 객체를 문자열로 변환
    return res.data.result;
  } catch (error) {
    console.error("Get Profile의 error는 " + error);
  }
};

const ShowProfile = ({ navigation }) => {
  const route = useRoute();
  const { userId } = route.params;
  console.log("전달된 userId : " + userId);
  const [response, setResponse] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [selectedId, setSelectedId] = useState();
  const [NickNameValue, setNickName] = useState("");
  const [DescriptionValue, setDiscription] = useState("");
  const [GenderValue, setGenderValue] = useState("");

  const [ProfileData, setProfileData] = useState([]);

  const fetchProfileData = async (userId) => {
    const data = await GetProfile(userId);
    console.log("what" + JSON.stringify(data));
    const transformedData = {
      id: "1", // 인덱스를 따로 설정할 필요가 없으므로 고정된 값을 사용하거나 상황에 맞게 수정하세요
      nickName: data.nickName,
      description: data.description,
      gender: data.gender,
      profileImageUrl: data.profileImageUrl,
    };
    setProfileData(transformedData);
  };

  useEffect(() => {
    fetchProfileData(userId);
  }, [userId]);

  useEffect(() => {
    if (ProfileData) {
      setDiscription(ProfileData.description);
      setNickName(ProfileData.nickName);
      setImageUri(ProfileData.profileImageUrl);
      setGenderValue(ProfileData.gender);
      if (ProfileData.gender === "MALE") {
        setSelectedId("1"); // "남자"를 선택
      } else if (ProfileData.gender === "FEMALE") {
        setSelectedId("2"); // "여자"를 선택
      }
    }
  }, [ProfileData]);

  const radioButtons = useMemo(
    () => [
      {
        id: "1", // acts as primary key, should be unique and non-empty string
        label: "남자",
        value: "Male",
      },
      {
        id: "2",
        label: "여자",
        value: "Female",
      },
    ],
    []
  );

  const onChangeNickName = (payload) => setNickName(payload);
  const onChangeDescription = (payload) => setDiscription(payload);

  return (
    <Container>
      <FirstView>
        <ViewForTitle>
          <TitleText>{NickNameValue}님의 프로필</TitleText>
        </ViewForTitle>
        <ViewForProfileImg style={{ pointerEvents: "none" }}>
          <TouchForPlayerImage hasImage={!!imageUri}>
            {imageUri && <ProfileImage source={{ uri: imageUri }} />}
          </TouchForPlayerImage>
        </ViewForProfileImg>
      </FirstView>
      <SecondView style={{ pointerEvents: "none" }}>
        <Text style={{ marginBottom: 5, marginRight: 195 }}>닉네임</Text>
        <ProfileTextInput
          placeholder="닉네임을 입력하세요. (20자 이내)"
          value={NickNameValue}
          onChangeText={onChangeNickName}
          maxLength={20}
          pointerEvents="none" // 모든 터치 이벤트 차단
        ></ProfileTextInput>

        <Text style={{ marginTop: 5, marginRight: 180 }}>자기소개</Text>
        <ProfileTextInput
          style={{ marginTop: 5, height: 150 }}
          placeholder="자기소개를 입력하세요."
          value={DescriptionValue}
          onChangeText={onChangeDescription}
          maxLength={100}
          multiline={true}
          pointerEvents="none" // 모든 터치 이벤트 차단
        ></ProfileTextInput>
        <Text style={{ marginTop: 5, marginRight: 210 }}>성별</Text>
        <RadioGroup
          radioButtons={radioButtons}
          onPress={setSelectedId}
          selectedId={selectedId}
          layout="row"
        ></RadioGroup>
      </SecondView>
    </Container>
  );
};
export default ShowProfile;
