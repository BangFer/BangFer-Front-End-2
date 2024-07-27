import React, { useState, useMemo } from "react";
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
import profileImage from "../../assets/profileimg.jpg";
import { launchImageLibrary } from "react-native-image-picker";
import { verifyTokens, getTokenFromLocal } from "../LoginPackage/TokenUtils";
import { RadioGroup } from "react-native-radio-buttons-group";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
`;

const ViewForProfileImg = styled.View`
  flex: 2;
`;

const ViewForUploadImg = styled.View`
  flex: 1;
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

const ProfileImage = styled.Image`
  width: 110px;
  height: 110px;
  border-radius: 55px;
  border-width: 2px;
  ${({ uri }) =>
    !uri &&
    `
    background-color: #ccc;
  `}
`;

const UploadImgButton = styled.TouchableOpacity`
  width: 100px;
  height: 40px;
  border-radius: 2px;
  border-width: 2px;
  border-color: black;
  justify-content: center;
  align-items: center;
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
  margin-top: 20px;
`;

const EnrollProfileText = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
`;

const showDuplicateNickname = () => {
  ToastAndroid.show("❌ 중복된 닉네임입니다.", ToastAndroid.LONG);
};

const showEmptyCreateProfile = () => {
  ToastAndroid.show("❌ 입력이 올바르지 않습니다.", ToastAndroid.LONG);
};

const showWrongBirthValue = () => {
  ToastAndroid.show(
    "❌ 생년월일을 형식에 맞게 입력해주세요.",
    ToastAndroid.LONG
  );
};

const showSuccessCreateProfile = () => {
  ToastAndroid.show("✅ 프로필 생성 성공", ToastAndroid.LONG);
};

const showChooseGender = () => {
  ToastAndroid.show("❌ 성별을 선택해주세요.", ToastAndroid.LONG);
};
const CreateProfileRequest = async ({
  nickname,
  description,
  dateOfBirth,
  gender,
  ProfileImage,
}) => {
  const Token = await getTokenFromLocal();
  try {
    const headers = {
      "Content-Type": "multipart/form-data",
      "Authorization": "Bearer " + Token.accessToken,
    };

    const formData = new FormData();

    // JSON 데이터를 문자열로 변환하여 추가
    const requestDto = {
      nickname: nickname,
      description: description,
      dateOfBirth: dateOfBirth,
      gender: gender,
    };

    formData.append("request", JSON.stringify(requestDto));

    formData.append("profileImage", {
      uri: ProfileImage.uri,
      name: ProfileImage.name,
      type: ProfileImage.type,
    });

    const response = await axios.post(
      "http://13.125.14.94:8080/accounts/profile",
      formData,
      {
        headers: headers,
      }
    );
    console.log(response.data);
    const profileId = response.data.result.profileId;
    try {
      AsyncStorage.setItem("profileId", String(profileId));
    } catch (error) {
      console.error("프로필 Id 저장 중 오류 발생");
    }
    return response;
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === "PROFILE401"
    ) {
      showDuplicateNickname();
    }
  }
};

const CreateProfile = ({ navigation }) => {
  const [response, setResponse] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const onSelectImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: true,
      },
      (response) => {
        console.log(response);
        // console.log(response.assets[0].base64)
        if (response.didCancel) {
          return;
        } else if (response.errorCode) {
          console.log("Image Error : " + response.errorCode);
        } else {
          setResponse(response);
          setImageFile({
            uri: response.assets[0].uri,
            name: response.assets[0].fileName,
            type: response.assets[0].type,
          });
          setImageUri(response.assets[0].uri);
        }
      }
    );
  };
  const { mutate: requestCreateProfile } = useMutation(CreateProfileRequest, {
    onSuccess: (data) => {
      console.log(data);
      // console.log("성공", data);
      // 성공 시 필요한 처리 추가
      showSuccessCreateProfile();
      navigation.navigate("EnrollBanggusukTeam");
    },
    onError: (error) => {
      console.error("에러", error);
      //에러 시 필요한 처리 추가
    },
  });

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

  const [selectedId, setSelectedId] = useState();
  const [NickNameValue, setNickName] = useState("");
  const [BirthValue, setBirth] = useState("");
  const [DescriptionValue, setDiscription] = useState("");

  const onChangeNickName = (payload) => setNickName(payload);
  const onChangeBirth = (payload) => setBirth(payload);
  const onChangeDescription = (payload) => setDiscription(payload);

  const ChangeFormBirthDay = (input) => {
    const year = input.slice(0, 4);
    const month = input.slice(4, 6);
    const day = input.slice(6, 8);
    return year + "-" + month + "-" + day;
  };

  const handlerequestSignup = () => {
    if (!NickNameValue || !DescriptionValue || !BirthValue) {
      showEmptyCreateProfile();
      return;
    }

    if (BirthValue.length !== 8) {
      showWrongBirthValue();
      return;
    }

    let gender = "";
    if (selectedId === "1") {
      gender = "MALE";
    } else if (selectedId === "2") {
      gender = "FEMALE";
    } else {
      showChooseGender();
      return;
    }
    console.log("이름 " + NickNameValue);
    console.log("자기소개 " + DescriptionValue);
    console.log("생일 " + ChangeFormBirthDay(BirthValue));
    console.log("성별 " + gender);
    console.log("이미지 파일 uri" + imageFile.uri);
    console.log("이미지 파일 name" + imageFile.name);
    console.log("이미지 파일 type" + imageFile.type);

    requestCreateProfile({
      nickname: NickNameValue,
      description: DescriptionValue,
      dateOfBirth: ChangeFormBirthDay(BirthValue),
      gender: gender,
      ProfileImage: imageFile,
    });
  };
  return (
    <Container>
      <FirstView>
        <ViewForTitle>
          <TitleText>프로필 생성</TitleText>
        </ViewForTitle>
        <ViewForProfileImg>
          <ProfileImage
            uri={imageUri}
            source={imageUri ? { uri: imageUri } : null}
          ></ProfileImage>
        </ViewForProfileImg>
        <ViewForUploadImg>
          <UploadImgButton onPress={onSelectImage}>
            <TextForImgUpload>사진 업로드</TextForImgUpload>
          </UploadImgButton>
        </ViewForUploadImg>
      </FirstView>
      <SecondView>
        <Text style={{ marginBottom: 5, marginRight: 195 }}>닉네임</Text>
        <ProfileTextInput
          placeholder="닉네임을 입력하세요. (20자 이내)"
          value={NickNameValue}
          onChangeText={onChangeNickName}
          maxLength={20}
        ></ProfileTextInput>
        <Text style={{ marginTop: 5, marginRight: 210 }}>생일</Text>
        <ProfileTextInput
          style={{ marginTop: 5 }}
          placeholder="생일을 입력하세요. (YYYYMMDD)"
          value={BirthValue}
          onChangeText={onChangeBirth}
          maxLength={8}
        ></ProfileTextInput>
        <Text style={{ marginTop: 5, marginRight: 180 }}>자기소개</Text>
        <ProfileTextInput
          style={{ marginTop: 5, height: 150 }}
          placeholder="자기소개를 입력하세요."
          value={DescriptionValue}
          onChangeText={onChangeDescription}
          maxLength={100}
          multiline={true}
        ></ProfileTextInput>
        <Text style={{ marginTop: 5, marginRight: 210 }}>성별</Text>
        <RadioGroup
          radioButtons={radioButtons}
          onPress={setSelectedId}
          selectedId={selectedId}
          layout="row"
        ></RadioGroup>
        <EnrollProfileButton onPress={handlerequestSignup}>
          <EnrollProfileText>생성</EnrollProfileText>
        </EnrollProfileButton>
      </SecondView>
    </Container>
  );
};
export default CreateProfile;
