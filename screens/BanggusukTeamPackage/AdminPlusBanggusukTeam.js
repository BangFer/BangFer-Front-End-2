import React, { useState, useEffect, useRef, useCallback } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { StatusBar } from "expo-status-bar";
import styled from "styled-components";
import DropDownPicker from "react-native-dropdown-picker";
import TacticsBack from "../../assets/TacticsBack.png";
import { FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from "react-native-picker-select";
import { useRoute } from "@react-navigation/native";
import { verifyTokens, getTokenFromLocal } from "../LoginPackage/TokenUtils";
import Ionicons from "@expo/vector-icons/Ionicons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useQuery, useMutation } from "react-query";
import { Dropdown } from "react-native-element-dropdown";
import KakaoShareLink from "react-native-kakao-share-link";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  FlatList,
  Keyboard,
  ToastAndroid,
} from "react-native";
import BanggusukTeam from "./BanggusukTeam";

const Container = styled.View`
  flex: 1;
  flex-direction: column;
`;

const ContainerModalView = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const ModalView = styled.View`
  width: 300px;
  height: 170px;
  margin: 30px;
  margin-bottom: 75px;
  border-radius: 10px;
  background-color: white;
  border-width: 3px;
  border-color: black;
`;

const ModalInviteFirstView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ModalInviteSecondView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const TextForNickNameInvite = styled.Text`
  font-weight: bold;
  color: #ff6262;
  font-size: 20px;
  text-align: center;

`;

const TouchForInviteNickName = styled.TouchableOpacity`
  height: 50%;
  width: 70%;
  border-radius: 5px;
  background-color: #FF6262;
  align-items: center;
  justify-content: center;
`;

const TouchForInviteKaKao = styled.TouchableOpacity`
  height: 50%;
  width: 70%;
  border-radius: 5px;
  background-color: #FF6262;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
`;

const TextForInviteNickName = styled.Text`
  font-weight: bold;
  color: white;
  font-size: 15px;
`;

const TextInputNickName = styled.TextInput`
  width: 60%;
  height: 40%;
  font-size: 16px;
  border-width: 2px;
  border-color: black;
  padding-left: 5px;
  margin-bottom: 20px;
`;

const TouchForNicknameInvite = styled.TouchableOpacity`
  width: 20%;
  height: 30%;
  border-radius: 5px;
  background-color: #ff6262;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
`;

const TextForInviteButton = styled.Text`
  font-weight: bold;
  color: white;
  font-size: 12px;
`;

const ViewforModalOutButton = styled.View`
  flex: 2.5;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
`;

const TextForModalPosition = styled.TextInput`
  font-weight: bold;
  color: #ff6262;
  font-size: 20px;
  text-align: center;
`;

const TextForOutModal = styled.Text`
  font-weight: bold;
  color: black;
  font-size: 25px;
  text-align: center;
`;

const TextForRealOutModal = styled.Text`
  font-weight: bold;
  color: black;
  font-size: 15px;
  text-align: center;
`;

const TextForOutButton = styled.Text`
  font-weight: bold;
  color: white;
  font-size: 15px;
  align-items: center;
  justify-content: center;
`;

const TouchForOutButton = styled.TouchableOpacity`
  width: 20%;
  height: 60%;
  border-radius: 5px;
  background-color: #ff6262;
  align-items: center;
  justify-content: center;
`;

const ViewforModalText = styled.View`
  flex: 5;
  align-items: center;
  justify-content: center;
`;

const ViewforModalPosition = styled.View`
  flex: 2.5;
  align-items: center;
  justify-content: center;
`;

const TextInputforModalTactics = styled.TextInput`
  color: red;
  font-size: 15px;
  font-weight: bold;
  margin: 5px;
`;
const ViewForTextBar = styled.View`
  width: 100%;
  height: 55px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ViewForTacticBoard = styled.View`
  width: 90%;
  height: 470px;
  margin-left: 20px;
  margin-top: -5px;
`;

const ViewForBoard = styled.View`
  margin-top: 10px;
  height: 420px;
`;

const ViewForSlideTactic = styled.View`
  width: 100%;
  height: 150px;
  align-items: center;
  margin-top: 5px;
`;

const TacticBox = styled.View`
  border-radius: 10px;
  background-color: ${({ isMain }) => (isMain ? "#FF6262" : "#5182FF")};
  padding: 10px;
  height: 90%; /* 높이 조정 */
  width: ${Dimensions.get("window").width -
  50}px; /* 화면 너비에서 20px를 뺀 값 */
  position: relative;
  margin-top: 5px;
`;

const TextBox = styled.TextInput`
  width: 100%;
  height: 75%;
  font-size: 16px;
  color: white;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
  color: white;
`;

const RegisterButton = styled.TouchableOpacity`
  border-radius: 10px;
  width: 60px;
  height: 40px;
  background-color: #d9d9d9;
  justify-content: center;
  align-items: center;
  margin-right: 25px;
`;

const RegisterText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: black;
`;

const ToggleButton = styled.TouchableOpacity`
  position: absolute; /* 절대 위치 설정 */
  top: 15px; /* 박스의 위쪽으로부터 10px */
  right: 15px; /* 박스의 오른쪽으로부터 10px */
`;

const ViewForListPlayers = styled.View`
  width: 100%;
  height: 370px;
  align-items: center;
`;

const ViewForListPlayersReal = styled.View`
  width: 88%;
  height: 370px;
  align-items: center;
  border-width: 4px;
  border-radius : 10px;
`;

const ViewForFlatList = styled.View`
  width: 100%;
  height: 300px;
`;

const ViewForListPlayersTitle = styled.View`
  width: 100%;
  height: 60px;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`;

const ViewForDropdown = styled.View`
  height: 50px;
  z-index: 1;
  margin-left: 3.5px;
  margin-right: 3.5px;
`;

const TestView = styled.View`
  flex: 1;
`;

const ViewForForward = styled.View`
  width: 100%;
  height: 20%;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;
const ViewForMidfielder = styled.View`
  width: 100%;
  height: 40%;
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
`;

const SecondViewForMidfielder = styled.View`
  width: 100%;
  height: 40%;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
`;

const ViewForDefender = styled.View`
  width: 100%;
  height: 20%;
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
`;
const ViewForGoalkeeper = styled.View`
  width: 100%;
  height: 20%;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ViewForPlayer = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
`;
const ViewForSeparator = styled.View`
  width: 100%;
  height: 2px;
  background-color: black;
`;

const ItemText = styled.Text`
  font-size: 13px;
  margin-left: 8px;
  font-weight: bold;
`;

const ViewForPlayerLeft = styled.View`
  width: 50%;
  height: 100%;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
`;

const ViewForPlayerRight = styled.View`
  width: 50%;
  height: 100%;
  align-items: center;
`;

const TouchForPlayerImage = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 50px;
  background-color: ${(props) => (props.hasImage ? "transparent" : "grey")};
  margin-left: 10px;
  overflow: hidden;
`;
const ProfileImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const ViewForPickerContainer = styled.View`
  width: 115px;
  height: 100%;
  justifycontent: center;
  alignitems: center;
  margin-left: 80px;
`;

const XTouchForPlayer = styled.TouchableOpacity`
  width: 15px;
  height: 15px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  margin-left: 3px;
`;

const Item = ({
  title,
  mainFormation,
  teamId,
  memberId,
  position,
  userId,
  navigation,
  setoutplayervisible,
  setKickOutmemberId,
  role,
}) => {
  const [pickerValue, setPickerValue] = useState("");
  const [pickerItems, setPickerItems] = useState([]);
  const isInitialMount = useRef(true);
  const previousPosition = useRef(position);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await GetProfile(userId);
        setProfileImage(profileData.data.result.profileImageUrl);
      } catch (error) {
        console.error("프로필 가져오기 오류:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  const updatePickerValue = useCallback(() => {
    const positionMap = {
      Position1: "1",
      Position2: "2",
      Position3: "3",
      Position4: "4",
      Position5: "5",
      Position6: "6",
      Position7: "7",
      Position8: "8",
      Position9: "9",
      Position10: "10",
      Position11: "11",
      Position12: "12",
    };
    const value = position === null ? "12" : positionMap[position] || "12";
    setPickerValue(value);
  }, [position]);

  useEffect(() => {
    updatePickerValue();
  }, [updatePickerValue]);

  useEffect(() => {
    let items;

    switch (mainFormation) {
      case "4-4-2":
        items = [
          { label: "LS", value: "1" },
          { label: "RS", value: "2" },
          { label: "LM", value: "3" },
          { label: "LCM", value: "4" },
          { label: "RCM", value: "5" },
          { label: "RM", value: "6" },
          { label: "LB", value: "7" },
          { label: "LCB", value: "8" },
          { label: "RCB", value: "9" },
          { label: "RB", value: "10" },
          { label: "GK", value: "11" },
        ];
        break;
      case "4-3-3":
        items = [
          { label: "LW", value: "1" },
          { label: "ST", value: "2" },
          { label: "RW", value: "3" },
          { label: "LCM", value: "4" },
          { label: "CM", value: "5" },
          { label: "RCM", value: "6" },
          { label: "LB", value: "7" },
          { label: "LCB", value: "8" },
          { label: "RCB", value: "9" },
          { label: "RB", value: "10" },
          { label: "GK", value: "11" },
        ];
        break;
      case "4-3-2-1":
        items = [
          { label: "ST", value: "1" },
          { label: "LAM", value: "2" },
          { label: "CAM", value: "3" },
          { label: "RAM", value: "4" },
          { label: "LDM", value: "5" },
          { label: "RDM", value: "6" },
          { label: "LB", value: "7" },
          { label: "LCB", value: "8" },
          { label: "RCB", value: "9" },
          { label: "RB", value: "10" },
          { label: "GK", value: "11" },
        ];
        break;
      case "3-4-3":
        items = [
          { label: "LW", value: "1" },
          { label: "ST", value: "2" },
          { label: "RW", value: "3" },
          { label: "LM", value: "4" },
          { label: "LCM", value: "5" },
          { label: "RCM", value: "6" },
          { label: "RM", value: "7" },
          { label: "LCB", value: "8" },
          { label: "CB", value: "9" },
          { label: "RCB", value: "10" },
          { label: "GK", value: "11" },
        ];
        break;
      case "3-5-2":
        items = [
          { label: "LS", value: "1" },
          { label: "RS", value: "2" },
          { label: "CAM", value: "3" },
          { label: "LM", value: "4" },
          { label: "RM", value: "5" },
          { label: "RCM", value: "6" },
          { label: "LCM", value: "7" },
          { label: "LCB", value: "8" },
          { label: "CB", value: "9" },
          { label: "RCB", value: "10" },
          { label: "GK", value: "11" },
        ];
        break;
      case "3-2-4-1":
        items = [
          { label: "ST", value: "1" },
          { label: "LM", value: "2" },
          { label: "LAM", value: "3" },
          { label: "RAM", value: "4" },
          { label: "RM", value: "5" },
          { label: "RDM", value: "6" },
          { label: "LDM", value: "7" },
          { label: "LCB", value: "8" },
          { label: "CB", value: "9" },
          { label: "RCB", value: "10" },
          { label: "GK", value: "11" },
        ];
        break;
      default:
        items = [];
    }
    // items.push({ label: "후보", value: "12" });

    setPickerItems(items);
  }, [mainFormation]);

  const handleValueChange = useCallback(
    async (itemValue) => {
      if (isInitialMount.current || itemValue === pickerValue) {
        return;
      }

      setPickerValue(itemValue);

      const positionMap = {
        1: "Position1",
        2: "Position2",
        3: "Position3",
        4: "Position4",
        5: "Position5",
        6: "Position6",
        7: "Position7",
        8: "Position8",
        9: "Position9",
        10: "Position10",
        11: "Position11",
      };

      try {
        if (itemValue === "12") {
          await UnAssignPosition({ teamId, memberId });
        } else {
          const positionLabel = positionMap[itemValue] || null;
          console.log("Assigning position:", positionLabel);
          await AssignPosition({ teamId, memberId, position: positionLabel });
        }
      } catch (error) {
        console.error("Error in position assignment/unassignment:", error);
      }
    },
    [teamId, memberId, pickerValue]
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else if (previousPosition.current !== position) {
      handleValueChange(pickerValue);
    }
    previousPosition.current = position;
  }, [position, pickerValue, handleValueChange]);

  return (
    <ViewForPlayer>
      <ViewForPlayerLeft>
        {role !== "LEADER" && (
          <XTouchForPlayer
            onPress={() => {
              setoutplayervisible(true);
              setKickOutmemberId(memberId);
            }}
          >
            <Ionicons name="close-circle-outline" size={15} color="red" />
          </XTouchForPlayer>
        )}
        <TouchForPlayerImage
          style={role === "LEADER" ? { marginLeft: 27 } : {}}
          hasImage={!!profileImage}
          onPress={() => navigation.navigate("ShowProfile", { userId })}
        >
          {profileImage && <ProfileImage source={{ uri: profileImage }} />}
        </TouchForPlayerImage>
        <ItemText style={role === "LEADER" ? { marginLeft: 7 } : {}}>
          {title}
        </ItemText>
      </ViewForPlayerLeft>
      <ViewForPlayerRight>
        <ViewForPickerContainer>
          <RNPickerSelect
            placeholder={{ label: "후보", value: "12" }}
            fixAndroidTouchableBug={true}
            value={pickerValue}
            onValueChange={handleValueChange}
            items={pickerItems}
            style={{
              placeholder: { color: "black" },
              inputAndroid: styles.input,
              inputAndroidContainer: styles.inputContainer,
              inputIOS: styles.input,
              inputIOSContainer: styles.inputContainer,
            }}
          />
        </ViewForPickerContainer>
      </ViewForPlayerRight>
    </ViewForPlayer>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 17,
    height: 30,
    fontWeight: "bold",
  },
  inputContainer: {
    width: "30%",
    alignItems: "center",
  },
});

const Forward = styled.TouchableOpacity`
  border-radius: 15px;
  width: 30px;
  height: 30px;
  background-color: #ff6262;
  margin: 30px;
  margin-top: 50px;
`;

const Midfielder = styled.TouchableOpacity`
  border-radius: 15px;
  width: 30px;
  height: 30px;
  background-color: #5182ff;
  margin-top: 5px;
`;

const Defender = styled.TouchableOpacity`
  border-radius: 15px;
  width: 30px;
  height: 30px;
  background-color: #6cd163;
  margin-top: 5px;
`;

const Goalkeeper = styled.TouchableOpacity`
  border-radius: 15px;
  width: 30px;
  height: 30px;
  background-color: #ffaf51;
  margin-top: 20px;
`;

const TouchForPlusPlayer = styled.TouchableOpacity`
  width: 20%;
  height: 20px;
  align-items: center;
  margin-right: 10px;
  flex-direction: row;
`;

const TaticsName = styled.TextInput`
  height: 35px;
  width: 165px;
  border-width: 4px;
  margin-left: 24px;
  border-radius: 10px;
  padding-left: 10px;
  font-size: 17px;
  font-weight: bold;
  color: black;
`;

const DirectorName = styled.TextInput`
  height: 35px;
  width: 100px;
  border-width: 4px;
  margin-right: 24px;
  border-radius: 10px;
  padding-left: 10px;
  font-size: 17px;
  font-weight: bold;
  color: black;
  text-align: left;  
`;

const TacticName = styled.TextInput`
  height: 50px;
  width: 100%;
  background-color: black;
  border-radius: 10px;
  margin-top: 3px;
  color: white;
  font-weight: bold;
  padding-left: 10px;
`;

const TacticsBackImage = styled.Image`
  width: 100%;
  height: 100%;
  ${StyleSheet.absoluteFillObject};
  z-index: -1;
`;
const TextForListPlayersTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-left: 10px;
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
    return res;
  } catch (error) {
    // 공통 오류 메시지 출력 (추가 디버깅 정보)
    console.error("전체 오류 객체:", error.toJSON());
  }
};

const InviteKaKao = async () => {
  try {
    const response = await KakaoShareLink.sendFeed({
      content: {
        title: "방구석퍼거슨",
        imageUrl:
          "http://t1.daumcdn.net/friends/prod/editor/dc8b3d02-a15a-4afa-a88b-989cf2a50476.jpg",
        link: {
          webUrl: "https://http://localhost:8080.kakao.com/",
          mobileWebUrl: "https://http://localhost:8080.kakao.com/",
        },
        description: "앱 설치 후 친구들과 함께 즐겨보세요!",
      },
      // social: {
      //   commentCount: 10,
      //   likeCount: 5,
      // },
      buttons: [
        {
          title: "앱에서 보기",
          link: {
            androidExecutionParams: [{ key: "key1", value: "value1" }],
            iosExecutionParams: [
              { key: "key1", value: "value1" },
              { key: "key2", value: "value2" },
            ],
          },
        },
      ],
    });
    console.log(response);
  } catch (e) {
    console.error(e);
    console.error(e.message);
  }
};

const GetTeam = async (teamId) => {
  const Token = await getTokenFromLocal();

  const headers_config = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": "Bearer " + Token.accessToken,
  };

  const url = "http://13.125.14.94:8080/team/" + teamId;

  try {
    const res = await axios.get(url, {
      headers: headers_config,
    });
    console.log("GetTeam의 response는", JSON.stringify(res.data));
    // JSON.stringify로 객체를 문자열로 변환
    return res.data.result;
  } catch (error) {
    console.error("Get Team의 error는 " + error);
  }
};

const GetTatics = async (taticsId) => {
  const Token = await getTokenFromLocal();

  const headers_config = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": "Bearer " + Token.accessToken,
  };
  const url = "http://13.125.14.94:8080/team/" + taticsId;
  console.log("url :" + url);
  try {
    const res = await axios.get(url, {
      headers: headers_config,
    });
    console.log("GetTactics의 response는", JSON.stringify(res.data)); // JSON.stringify로 객체를 문자열로 변환
    return res;
  } catch (error) {
    console.error("Get Tactic의 error는 " + error);
  }
};

const InviteMember = async ({ teamId, NickNameText }) => {
  const Token = await getTokenFromLocal();
  try {
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + Token.accessToken,
    };

    const data = {
      nickName: NickNameText,
      teamId: teamId,
    };

    console.log(data);

    const response = await axios.post("http://13.125.14.94:8080/invite", data, {
      headers: headers,
    });

    return response.data; // 반환할 데이터 형식에 맞게 수정
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400 && data.code === "TEAMMEMBER417") {
        console.log("이미 초대가 보내졌습니다:", data.message);
        showAlreadyInvite();
      } else {
        console.log("서버 에러:", status, data);
        showCorrectNickname();
      }
    }
    throw error.response;
  }
};

const UnAssignPosition = async ({ teamId, memberId }) => {
  const Token = await getTokenFromLocal();
  try {
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + Token.accessToken,
    };

    const url =
      "http://13.125.14.94:8080/team/members/position" +
      "/" +
      teamId +
      "/" +
      memberId;

    console.log("what member " + memberId);
    console.log("what Team" + teamId);

    const response = await axios.delete(
      url,

      {
        headers: headers,
      }
    );

    return response.data; // 반환할 데이터 형식에 맞게 수정
  } catch (error) {
    console.error(error.response);
  }
};

const KickOutMember = async ({ KickOutMemberId, teamId }) => {
  const Token = await getTokenFromLocal();
  try {
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + Token.accessToken,
    };

    const url =
      "http://13.125.14.94:8080/kickout" + "/" + teamId + "/" + KickOutMemberId;

    console.log("what member " + KickOutMemberId);
    console.log("what Team" + teamId);

    const response = await axios.delete(
      url,

      {
        headers: headers,
      }
    );

    return response.data; // 반환할 데이터 형식에 맞게 수정
  } catch (error) {
    console.error(error.response);
  }
};

const AssignPosition = async ({ teamId, memberId, position }) => {
  const Token = await getTokenFromLocal();
  try {
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + Token.accessToken,
    };

    const url =
      "http://13.125.14.94:8080/team/members/" +
      teamId +
      "/" +
      memberId +
      "/" +
      "position";

    const data = {
      position: position,
    };

    const response = await axios.post(url, data, {
      headers: headers,
    });

    return response.data; // 반환할 데이터 형식에 맞게 수정
  } catch (error) {
    console.error(error.response);
  }
};
const showSuccessInviteMember = () => {
  ToastAndroid.show("✅ 초대 성공", ToastAndroid.LONG);
};

const showCorrectNickname = () => {
  ToastAndroid.show("❌ 닉네임을 확인해주세요", ToastAndroid.LONG);
};

const showAlreadyInvite = () => {
  ToastAndroid.show("❌ 이미 초대요청이 보내진 회원입니다", ToastAndroid.LONG);
};

const AdminPlusBanggusukTeam = ({ navigation }) => {
  const route = useRoute();
  const { teamId } = route.params;
  const [teamData, setTeamData] = useState([]);
  const [mainformation, setmainformation] = useState("");
  const fetchTeamMemberData = async (teamId) => {
    try {
      const data = await GetTeam(teamId);
      console.log("data는" + JSON.stringify(data));

      setmainformation(data.tactic.mainFormation);
      const transformedData = data.teamMembers.map((item, index) => ({
        id: (index + 1).toString(),
        title: item.memberNickName,
        memberId: item.memberId,
        position: item.position,
        userId: item.userId,
        role: item.role,
      }));

      setTeamData(transformedData);
    } catch (error) {
      console.error(error);
    }
  };

  const [tacticName, setTacticName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedFormation, setSelectedFormation] = useState("");
  const [nameValue, setName] = useState("");
  const [OnePositionValue, setOnePositionValue] = useState("");
  const [TwoPositionValue, setTwoPositionValue] = useState("");
  const [ThreePositionValue, setThreePositionValue] = useState("");
  const [FourPositionValue, setFourPositionValue] = useState("");
  const [FivePositionValue, setFivePositionValue] = useState("");
  const [SixPositionValue, setSixPositionValue] = useState("");
  const [SevenPositionValue, setSevenPositionValue] = useState("");
  const [EightPositionValue, setEightPositionValue] = useState("");
  const [NinePositionValue, setNinePositionValue] = useState("");
  const [TenPositionValue, setTenPositionValue] = useState("");
  const [ElevenPositionValue, setElevenPositionValue] = useState("");
  const [NickNameText, setNickNameText] = useState("");
  const [KickOutMemberId, setKickOutmemberId] = useState("");
  const [TacticsNameplaceholder, setTacticsNamePlaceholder] = useState("팀 명");
  const [DetailTacticsplaceholder, setDetailTacticsplaceholder] = useState("");
  const [DetailPositionplaceholder, setDetailPositionplaceholder] =
    useState("");

  console.log("하하" + KickOutMemberId);
  const [isMainTactic, setIsMainTactic] = useState(true);
  const [mainText, setMainText] = useState("");
  const [subText, setSubText] = useState("");

  const handleToggleTactic = () => {
    setIsMainTactic(!isMainTactic);
    Keyboard.dismiss();
  };

  const handleChangeMainText = (inputText) => {
    setMainText(inputText);
  };

  const handleChangeSubText = (inputText) => {
    setSubText(inputText);
  };
  const [DirectorNameplaceholder, setDirectorNamePlaceholder] =
    useState("감독명");

  const handleTacticCall = async (selectedTacticId) => {
    const data = await GetTatics(selectedTacticId);

    handleChangeMainText(data.data.result.tactic.subTactic);
    handleChangeSubText(data.data.result.tactic.tacticDetails);

    setSelectedFormation(data.data.result.tactic.mainFormation);
    setTeamName(data.data.result.teamName);
    setLeaderName(data.data.result.leaderNickName);
    setTacticName(data.data.result.tactic.tacticName);

    setOnePositionValue(data.data.result.tacticDto[0].positionDescription);
    setTwoPositionValue(data.data.result.tacticDto[1].positionDescription);
    setThreePositionValue(data.data.result.tacticDto[2].positionDescription);
    setFourPositionValue(data.data.result.tacticDto[3].positionDescription);
    setFivePositionValue(data.data.result.tacticDto[4].positionDescription);
    setSixPositionValue(data.data.result.tacticDto[5].positionDescription);
    setSevenPositionValue(data.data.result.tacticDto[6].positionDescription);
    setEightPositionValue(data.data.result.tacticDto[7].positionDescription);
    setNinePositionValue(data.data.result.tacticDto[8].positionDescription);
    setTenPositionValue(data.data.result.tacticDto[9].positionDescription);
    setElevenPositionValue(data.data.result.tacticDto[10].positionDescription);
  };

  const handleAttackerPositionPress = (DetailText, PositionText) => {
    setDetailTacticsplaceholder(DetailText);
    setDetailPositionplaceholder(PositionText);
    setIsAttackerModalVisible(true);
  };

  const handleMidfielderPositionPress = (DetailText, PositionText) => {
    setDetailTacticsplaceholder(DetailText);
    setDetailPositionplaceholder(PositionText);

    setIsMidfielderModalVisible(true);
  };

  const handleDefenderPositionPress = (DetailText, PositionText) => {
    setDetailTacticsplaceholder(DetailText);
    setDetailPositionplaceholder(PositionText);

    setIsDefenderModalVisible(true);
  };
  const handleGoalkeeperPositionPress = (DetailText, PositionText) => {
    setDetailTacticsplaceholder(DetailText);
    setDetailPositionplaceholder(PositionText);

    setIsGKModalVisible(true);
  };
  const [isAttackerModalVisible, setIsAttackerModalVisible] = useState(false);
  const [isMidfielderModalVisible, setIsMidfielderModalVisible] =
    useState(false);
  const [isDefenderModalVisible, setIsDefenderModalVisible] = useState(false);
  const [isGKModalVisible, setIsGKModalVisible] = useState(false);
  const [inviteFriendVisible, setinviteFriendVisible] = useState(false);
  const [inviteNicknameVisible, setinviteNickNameVisible] = useState(false);
  const [OutPlayerVisible, setoutplayervisible] = useState(false);

  const { mutate: requestInviteMember } = useMutation(InviteMember, {
    onSuccess: (data) => {
      console.log(data);

      showSuccessInviteMember();
      setinviteNickNameVisible(false);
    },
    onError: (error) => {
      console.error("에러", error);
      //에러 시 필요한 처리 추가
    },
  });
  useEffect(() => {
    const fetchTactics = async () => {
      handleTacticCall(teamId);
    };

    fetchTactics();
  }, []);

  useEffect(() => {
    fetchTeamMemberData(teamId);
    console.log("teamData는 " + JSON.stringify(teamData));
  }, []);
  const TouchNickName = () => {
    setinviteFriendVisible(false);
    setinviteNickNameVisible(true);
  };

  const handleKickOutMember = async () => {
    try {
      setoutplayervisible(false);

      await KickOutMember({ KickOutMemberId, teamId });
      await fetchTeamMemberData(teamId);
    } catch (error) {
      console.error("Error kicking out member:", error);
    }
  };

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        nestedScrollEnabled={true}
      >
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ marginLeft: 25, marginTop:5, marginBottom: -5 }}>팀명</Text>
          <Text style={{ marginRight: 25, marginTop:5, marginBottom: -5 }}>리더명</Text>
        </View>
        <ViewForTextBar>
          <TaticsName
            value={teamName}
            editable={false} // TextInput을 수정 불가능하게 설정
            pointerEvents="none" // 모든 터치 이벤트 차단
          />
          <DirectorName
            value={leaderName}
            editable={false} // TextInput을 수정 불가능하게 설정
            pointerEvents="none" // 모든 터치 이벤트 차단
          ></DirectorName>
        </ViewForTextBar>
        <ViewForTacticBoard>
          <ViewForDropdown>
            <TacticName
              value={tacticName}
              editable={false} // TextInput을 수정 불가능하게 설정
              pointerEvents="none"
            ></TacticName>
          </ViewForDropdown>
          <ViewForBoard>
            <TacticsBackImage source={TacticsBack} resizeMode={"stretch"} />
            <Modal // 친구 초대 모달
              animationType="slide"
              visible={inviteFriendVisible}
              transparent={true}
            >
              <ContainerModalView onPress={() => setinviteFriendVisible(false)}>
                <ModalView>
                  <ModalInviteFirstView>
                    <TouchForInviteKaKao onPress={() => InviteKaKao()}>
                      <TextForInviteNickName>
                        카카오톡으로 초대
                      </TextForInviteNickName>
                    </TouchForInviteKaKao>
                  </ModalInviteFirstView>

                  <ModalInviteSecondView>
                    <TouchForInviteNickName onPress={() => TouchNickName()}>
                      <TextForInviteNickName>
                        닉네임으로 초대
                      </TextForInviteNickName>
                    </TouchForInviteNickName>
                  </ModalInviteSecondView>
                </ModalView>
              </ContainerModalView>
            </Modal>
            <Modal // 닉네임 초대 모달
              animationType="slide"
              visible={inviteNicknameVisible}
              transparent={true}
            >
              <ContainerModalView
                onPress={() => setinviteNickNameVisible(false)}
              >
                <ModalView>
                  <ModalInviteFirstView style={{ flex: 0.5 }}>
                    <TextForNickNameInvite>
                      닉네임으로 초대
                    </TextForNickNameInvite>
                  </ModalInviteFirstView>
                  <ModalInviteSecondView>
                    <TextInputNickName
                      value={NickNameText}
                      placeholder="닉네임 입력"
                      onChangeText={(newText) => setNickNameText(newText)}
                    ></TextInputNickName>
                    <TouchForNicknameInvite
                      onPress={() =>
                        requestInviteMember({ teamId, NickNameText })
                      }
                    >
                      <TextForInviteButton>초대하기</TextForInviteButton>
                    </TouchForNicknameInvite>
                  </ModalInviteSecondView>
                </ModalView>
              </ContainerModalView>
            </Modal>
            <Modal // 멤버 강퇴 모달
              animationType="slide"
              visible={OutPlayerVisible}
              transparent={true}
            >
              <ContainerModalView onPress={() => setoutplayervisible(false)}>
                <ModalView style={{ borderColor: "black" }}>
                  <ViewforModalPosition>
                    <TextForOutModal>추방하기</TextForOutModal>
                  </ViewforModalPosition>

                  <ViewforModalText>
                    <TextForRealOutModal>
                      해당 유저를 추방하시겠습니까?
                    </TextForRealOutModal>
                  </ViewforModalText>
                  <ViewforModalOutButton>
                    <TouchForOutButton
                      style={{ backgroundColor: "black" }}
                      onPress={handleKickOutMember}
                    >
                      <TextForOutButton>예</TextForOutButton>
                    </TouchForOutButton>
                    <TouchForOutButton
                      style={{ backgroundColor: "black" }}
                      onPress={() => setoutplayervisible(false)}
                    >
                      <TextForOutButton>아니오</TextForOutButton>
                    </TouchForOutButton>
                  </ViewforModalOutButton>
                </ModalView>
              </ContainerModalView>
            </Modal>
            <Modal // 공격수 모달
              animationType="slide"
              visible={isAttackerModalVisible}
              transparent={true}
            >
              <ContainerModalView
                onPress={() => setIsAttackerModalVisible(false)}
              >
                <ModalView style={{ borderColor: "#ff6262" }}>
                  <ViewforModalPosition>
                    <TextForModalPosition
                      editable={false} // TextInput을 수정 불가능하게 설정
                      pointerEvents="none" // 모든 터치 이벤트 차단
                      numberOfLines={1}
                      value={DetailPositionplaceholder}
                      maxLenth={10}
                      placeholder="포지션 입력"
                      onChangeText={(newText) =>
                        setDetailPositionplaceholder(newText)
                      }
                      placeholderTextColor="#ff6262"
                    ></TextForModalPosition>
                  </ViewforModalPosition>

                  <ViewforModalText>
                    <TextInputforModalTactics
                      editable={false} // TextInput을 수정 불가능하게 설정
                      pointerEvents="none" // 모든 터치 이벤트 차단
                      multiline
                      numberOfLines={3}
                      value={DetailTacticsplaceholder}
                      maxLength={100}
                      placeholder="세부 전술을 입력하세요."
                      onChangeText={(newText) =>
                        setDetailTacticsplaceholder(newText)
                      }
                      placeholderTextColor="#ff6262"
                    ></TextInputforModalTactics>
                  </ViewforModalText>
                  <ViewforModalOutButton>
                    <TouchForOutButton
                      onPress={() => setIsAttackerModalVisible(false)}
                    >
                      <TextForOutButton>확인</TextForOutButton>
                    </TouchForOutButton>
                  </ViewforModalOutButton>
                </ModalView>
              </ContainerModalView>
            </Modal>
            <Modal // 미드필더 모달
              animationType="slide"
              visible={isMidfielderModalVisible}
              transparent={true}
            >
              <ContainerModalView
                onPress={() => setIsMidfielderModalVisible(false)}
              >
                <ModalView style={{ borderColor: "#5182FF" }}>
                  <ViewforModalPosition>
                    <TextForModalPosition
                      editable={false} // TextInput을 수정 불가능하게 설정
                      pointerEvents="none" // 모든 터치 이벤트 차단
                      numberOfLines={1}
                      value={DetailPositionplaceholder}
                      maxLenth={10}
                      placeholder="포지션 입력"
                      onChangeText={(newText) =>
                        setDetailPositionplaceholder(newText)
                      }
                      placeholderTextColor="#5182FF"
                      style={{ color: "#5182FF" }}
                    ></TextForModalPosition>
                  </ViewforModalPosition>

                  <ViewforModalText>
                    <TextInputforModalTactics
                      editable={false} // TextInput을 수정 불가능하게 설정
                      pointerEvents="none" // 모든 터치 이벤트 차단
                      multiline
                      numberOfLines={3}
                      value={DetailTacticsplaceholder}
                      maxLength={100}
                      placeholder="세부 전술을 입력하세요."
                      onChangeText={(newText) =>
                        setDetailTacticsplaceholder(newText)
                      }
                      placeholderTextColor="#5182FF"
                      style={{ color: "#5182FF" }}
                    ></TextInputforModalTactics>
                  </ViewforModalText>
                  <ViewforModalOutButton>
                    <TouchForOutButton
                      style={{ backgroundColor: "#5182FF" }}
                      onPress={() => setIsMidfielderModalVisible(false)}
                    >
                      <TextForOutButton>확인</TextForOutButton>
                    </TouchForOutButton>
                  </ViewforModalOutButton>
                </ModalView>
              </ContainerModalView>
            </Modal>
            <Modal // 수비수 모달
              animationType="slide"
              visible={isDefenderModalVisible}
              transparent={true}
            >
              <ContainerModalView
                onPress={() => setIsDefenderModalVisible(false)}
              >
                <ModalView style={{ borderColor: "#6CD163" }}>
                  <ViewforModalPosition>
                    <TextForModalPosition
                      editable={false} // TextInput을 수정 불가능하게 설정
                      pointerEvents="none" // 모든 터치 이벤트 차단
                      numberOfLines={1}
                      value={DetailPositionplaceholder}
                      maxLenth={10}
                      placeholder="포지션 입력"
                      onChangeText={(newText) =>
                        setDetailPositionplaceholder(newText)
                      }
                      placeholderTextColor="#6CD163"
                      style={{ color: "#6CD163" }}
                    ></TextForModalPosition>
                  </ViewforModalPosition>

                  <ViewforModalText>
                    <TextInputforModalTactics
                      editable={false} // TextInput을 수정 불가능하게 설정
                      pointerEvents="none" // 모든 터치 이벤트 차단
                      multiline
                      numberOfLines={3}
                      value={DetailTacticsplaceholder}
                      maxLength={100}
                      placeholder="세부 전술을 입력하세요."
                      onChangeText={(newText) =>
                        setDetailTacticsplaceholder(newText)
                      }
                      placeholderTextColor="#6CD163"
                      style={{ color: "#6CD163" }}
                    ></TextInputforModalTactics>
                  </ViewforModalText>
                  <ViewforModalOutButton>
                    <TouchForOutButton
                      style={{ backgroundColor: "#6CD163" }}
                      onPress={() => setIsDefenderModalVisible(false)}
                    >
                      <TextForOutButton>확인</TextForOutButton>
                    </TouchForOutButton>
                  </ViewforModalOutButton>
                </ModalView>
              </ContainerModalView>
            </Modal>
            <Modal // 골키퍼 모달
              animationType="slide"
              visible={isGKModalVisible}
              transparent={true}
            >
              <ContainerModalView onPress={() => setIsGKModalVisible(false)}>
                <ModalView style={{ borderColor: "#FFB056" }}>
                  <ViewforModalPosition>
                    <TextForModalPosition
                      editable
                      numberOfLines={1}
                      value={DetailPositionplaceholder}
                      maxLenth={10}
                      placeholder="포지션 입력"
                      onChangeText={(newText) =>
                        setDetailPositionplaceholder(newText)
                      }
                      placeholderTextColor="#FFB056"
                      style={{ color: "#FFB056" }}
                    ></TextForModalPosition>
                  </ViewforModalPosition>

                  <ViewforModalText>
                    <TextInputforModalTactics
                      editable
                      multiline
                      numberOfLines={3}
                      value={DetailTacticsplaceholder}
                      maxLength={100}
                      placeholder="세부 전술을 입력하세요."
                      onChangeText={(newText) =>
                        setDetailTacticsplaceholder(newText)
                      }
                      placeholderTextColor="#FFB056"
                      style={{ color: "#FFB056" }}
                    ></TextInputforModalTactics>
                  </ViewforModalText>
                  <ViewforModalOutButton>
                    <TouchForOutButton
                      style={{ backgroundColor: "#FFB056" }}
                      onPress={() => setIsGKModalVisible(false)}
                    >
                      <TextForOutButton>확인</TextForOutButton>
                    </TouchForOutButton>
                  </ViewforModalOutButton>
                </ModalView>
              </ContainerModalView>
            </Modal>
            {selectedFormation === "4-4-2" && (
              <TestView>
                <ViewForForward>
                  <Forward
                    style={{ marginTop: 70 }}
                    onPress={() =>
                      handleAttackerPositionPress(OnePositionValue, "LS")
                    }
                  ></Forward>
                  <Forward
                    style={{ marginTop: 70 }}
                    onPress={() =>
                      handleAttackerPositionPress(TwoPositionValue, "RS")
                    }
                  ></Forward>
                </ViewForForward>
                <ViewForMidfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(ThreePositionValue, "LM")
                    }
                  ></Midfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(FourPositionValue, "LCM")
                    }
                    style={{ marginTop: 25 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(FivePositionValue, "RCM")
                    }
                    style={{ marginTop: 25 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(SixPositionValue, "RM")
                    }
                  ></Midfielder>
                </ViewForMidfielder>
                <ViewForDefender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(SevenPositionValue, "LB")
                    }
                  ></Defender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(EightPositionValue, "LCB")
                    }
                    style={{ marginTop: 25 }}
                  ></Defender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(NinePositionValue, "RCB")
                    }
                    style={{ marginTop: 25 }}
                  ></Defender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(TenPositionValue, "RB")
                    }
                  ></Defender>
                </ViewForDefender>
                <ViewForGoalkeeper>
                  <Goalkeeper
                    onPress={() =>
                      handleGoalkeeperPositionPress(ElevenPositionValue, "GK")
                    }
                    style={{ marginTop: 25 }}
                  ></Goalkeeper>
                </ViewForGoalkeeper>
              </TestView>
            )}
            {selectedFormation === "4-3-3" && (
              <TestView>
                <ViewForForward style={{ justifyContent: "space-around" }}>
                  <Forward
                    onPress={() =>
                      handleAttackerPositionPress(OnePositionValue, "LW")
                    }
                    style={{ marginTop: 80 }}
                  ></Forward>
                  <Forward
                    onPress={() =>
                      handleAttackerPositionPress(TwoPositionValue, "ST")
                    }
                    style={{ marginBottom: 60 }}
                  ></Forward>
                  <Forward
                    onPress={() =>
                      handleAttackerPositionPress(ThreePositionValue, "RW")
                    }
                    style={{ marginTop: 80 }}
                  ></Forward>
                </ViewForForward>
                <ViewForMidfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(FourPositionValue, "LCM")
                    }
                    style={{ marginLeft: 45 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(FivePositionValue, "CM")
                    }
                    style={{ marginTop: 50 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(SixPositionValue, "RCM")
                    }
                    style={{ marginRight: 45 }}
                  ></Midfielder>
                </ViewForMidfielder>
                <ViewForDefender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(SevenPositionValue, "LB")
                    }
                    style={{ marginTop: 15 }}
                  ></Defender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(EightPositionValue, "LCB")
                    }
                    style={{ marginTop: 35 }}
                  ></Defender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(NinePositionValue, "RCB")
                    }
                    style={{ marginTop: 35 }}
                  ></Defender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(TenPositionValue, "RB")
                    }
                    style={{ marginTop: 15 }}
                  ></Defender>
                </ViewForDefender>
                <ViewForGoalkeeper>
                  <Goalkeeper
                    onPress={() =>
                      handleGoalkeeperPositionPress(ElevenPositionValue, "GK")
                    }
                    style={{ marginTop: 30 }}
                  ></Goalkeeper>
                </ViewForGoalkeeper>
              </TestView>
            )}
            {selectedFormation === "4-3-2-1" && (
              <TestView>
                <ViewForForward>
                  <Forward
                    onPress={() =>
                      handleAttackerPositionPress(OnePositionValue, "ST")
                    }
                    style={{ marginBottom: 60 }}
                  ></Forward>
                </ViewForForward>
                <SecondViewForMidfielder style={{ height: "20%" }}>
                  <Midfielder
                    style={{ marginBottom: 20, marginLeft: 60 }}
                    onPress={() =>
                      handleMidfielderPositionPress(TwoPositionValue, "LAM")
                    }
                  ></Midfielder>
                  <Midfielder
                    style={{ marginBottom: 20, marginRight: 60 }}
                    onPress={() =>
                      handleMidfielderPositionPress(ThreePositionValue, "RAM")
                    }
                  ></Midfielder>
                </SecondViewForMidfielder>
                <ViewForMidfielder style={{ height: "20%" }}>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(FourPositionValue, "LCM")
                    }
                    style={{ marginLeft: 15 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(FivePositionValue, "CM")
                    }
                    style={{}}
                  ></Midfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(SixPositionValue, "RCM")
                    }
                    style={{ marginRight: 15 }}
                  ></Midfielder>
                </ViewForMidfielder>
                <ViewForDefender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(SevenPositionValue, "LB")
                    }
                    style={{ marginTop: 30 }}
                  ></Defender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(EightPositionValue, "LCB")
                    }
                    style={{ marginTop: 50 }}
                  ></Defender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(NinePositionValue, "RCB")
                    }
                    style={{ marginTop: 50 }}
                  ></Defender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(TenPositionValue, "RB")
                    }
                    style={{ marginTop: 30 }}
                  ></Defender>
                </ViewForDefender>
                <ViewForGoalkeeper>
                  <Goalkeeper
                    onPress={() =>
                      handleGoalkeeperPositionPress(ElevenPositionValue, "GK")
                    }
                    style={{ marginTop: 25 }}
                  ></Goalkeeper>
                </ViewForGoalkeeper>
              </TestView>
            )}
            {selectedFormation === "4-2-3-1" && (
              <TestView>
                <ViewForForward>
                  <Forward
                    onPress={() =>
                      handleAttackerPositionPress(OnePositionValue, "ST")
                    }
                    style={{ marginBottom: 60 }}
                  ></Forward>
                </ViewForForward>
                <SecondViewForMidfielder style={{ height: "20%" }}>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(TwoPositionValue, "LAM")
                    }
                    style={{ marginBottom: 10, marginLeft: 5 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(ThreePositionValue, "CAM")
                    }
                    style={{ marginBottom: 10 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(FourPositionValue, "RAM")
                    }
                    style={{ marginBottom: 10, marginRight: 5 }}
                  ></Midfielder>
                </SecondViewForMidfielder>
                <ViewForMidfielder style={{ height: "20%" }}>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(FivePositionValue, "LDM")
                    }
                    style={{ marginLeft: 55 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(SixPositionValue, "RDM")
                    }
                    style={{ marginRight: 55 }}
                  ></Midfielder>
                </ViewForMidfielder>
                <ViewForDefender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(SevenPositionValue, "LB")
                    }
                    style={{ marginTop: 15 }}
                  ></Defender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(EightPositionValue, "LCB")
                    }
                    style={{ marginTop: 35 }}
                  ></Defender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(NinePositionValue, "RCB")
                    }
                    style={{ marginTop: 35 }}
                  ></Defender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(TenPositionValue, "RB")
                    }
                    style={{ marginTop: 15 }}
                  ></Defender>
                </ViewForDefender>
                <ViewForGoalkeeper>
                  <Goalkeeper
                    onPress={() =>
                      handleGoalkeeperPositionPress(ElevenPositionValue, "GK")
                    }
                    style={{ marginTop: 25 }}
                  ></Goalkeeper>
                </ViewForGoalkeeper>
              </TestView>
            )}
            {selectedFormation === "3-4-3" && (
              <TestView>
                <ViewForForward style={{ justifyContent: "space-around" }}>
                  <Forward
                    style={{ marginTop: 80 }}
                    onPress={() =>
                      handleAttackerPositionPress(OnePositionValue, "LW")
                    }
                  ></Forward>
                  <Forward
                    onPress={() =>
                      handleAttackerPositionPress(TwoPositionValue, "ST")
                    }
                    style={{ marginTop: 20 }}
                  ></Forward>
                  <Forward
                    style={{ marginTop: 80 }}
                    onPress={() =>
                      handleAttackerPositionPress(ThreePositionValue, "RW")
                    }
                  ></Forward>
                </ViewForForward>
                <ViewForMidfielder>
                  <Midfielder
                    style={{ marginTop: 25 }}
                    onPress={() =>
                      handleMidfielderPositionPress(FourPositionValue, "LM")
                    }
                  ></Midfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(FivePositionValue, "LCM")
                    }
                    style={{ marginTop: 45 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(SixPositionValue, "RCM")
                    }
                    style={{ marginTop: 45 }}
                  ></Midfielder>
                  <Midfielder
                    style={{ marginTop: 25 }}
                    onPress={() =>
                      handleMidfielderPositionPress(SevenPositionValue, "RM")
                    }
                  ></Midfielder>
                </ViewForMidfielder>
                <ViewForDefender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(EightPositionValue, "LCB")
                    }
                    style={{ marginLeft: 25, marginBottom: 15 }}
                  ></Defender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(NinePositionValue, "CB")
                    }
                    style={{}}
                  ></Defender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(TenPositionValue, "RCB")
                    }
                    style={{ marginRight: 25, marginBottom: 15 }}
                  ></Defender>
                </ViewForDefender>
                <ViewForGoalkeeper>
                  <Goalkeeper
                    onPress={() =>
                      handleGoalkeeperPositionPress(ElevenPositionValue, "GK")
                    }
                    style={{ marginTop: 25 }}
                  ></Goalkeeper>
                </ViewForGoalkeeper>
              </TestView>
            )}
            {selectedFormation === "3-5-2" && (
              <TestView>
                <ViewForForward>
                  <Forward
                    onPress={() =>
                      handleAttackerPositionPress(OnePositionValue, "LS")
                    }
                  ></Forward>
                  <Forward
                    onPress={() =>
                      handleAttackerPositionPress(TwoPositionValue, "RS")
                    }
                  ></Forward>
                </ViewForForward>
                <SecondViewForMidfielder
                  style={{ justifyContent: "space-between", height: "20%" }}
                >
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(ThreePositionValue, "CAM")
                    }
                    style={{ marginLeft: 20, marginTop: 70 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(FourPositionValue, "LM")
                    }
                    style={{ marginTop: 10 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(FivePositionValue, "RM")
                    }
                    style={{ marginRight: 20, marginTop: 70 }}
                  ></Midfielder>
                </SecondViewForMidfielder>
                <ViewForMidfielder style={{ height: "20%" }}>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(SixPositionValue, "RCM")
                    }
                    style={{ marginLeft: 60 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(SevenPositionValue, "LCM")
                    }
                    style={{ marginRight: 60 }}
                  ></Midfielder>
                </ViewForMidfielder>
                <ViewForDefender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(EightPositionValue, "LCB")
                    }
                    style={{ marginLeft: 25, marginBottom: 15 }}
                  ></Defender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(NinePositionValue, "CB")
                    }
                    style={{}}
                  ></Defender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(TenPositionValue, "RCB")
                    }
                    style={{ marginRight: 25, marginBottom: 15 }}
                  ></Defender>
                </ViewForDefender>
                <ViewForGoalkeeper>
                  <Goalkeeper
                    onPress={() =>
                      handleGoalkeeperPositionPress(ElevenPositionValue, "GK")
                    }
                    style={{ marginTop: 25 }}
                  ></Goalkeeper>
                </ViewForGoalkeeper>
              </TestView>
            )}
            {selectedFormation === "3-2-4-1" && (
              <TestView>
                <ViewForForward>
                  <Forward
                    onPress={() =>
                      handleAttackerPositionPress(OnePositionValue, "ST")
                    }
                    style={{ marginBottom: 60 }}
                  ></Forward>
                </ViewForForward>
                <SecondViewForMidfielder style={{ height: "20%" }}>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(TwoPositionValue, "LM")
                    }
                    style={{ marginBottom: 15 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(ThreePositionValue, "LAM")
                    }
                    style={{ marginBottom: 15 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(FourPositionValue, "RAM")
                    }
                    style={{ marginBottom: 15 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(FivePositionValue, "RM")
                    }
                    style={{ marginBottom: 15 }}
                  ></Midfielder>
                </SecondViewForMidfielder>
                <ViewForMidfielder style={{ height: "20%" }}>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(SixPositionValue, "RDM")
                    }
                    style={{ marginLeft: 75 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() =>
                      handleMidfielderPositionPress(SevenPositionValue, "LDM")
                    }
                    style={{ marginRight: 75 }}
                  ></Midfielder>
                </ViewForMidfielder>
                <ViewForDefender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(EightPositionValue, "LCB")
                    }
                    style={{ marginLeft: 25, marginBottom: 15 }}
                  ></Defender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(NinePositionValue, "CB")
                    }
                    style={{ marginTop: 15 }}
                  ></Defender>
                  <Defender
                    onPress={() =>
                      handleDefenderPositionPress(TenPositionValue, "RCB")
                    }
                    style={{ marginRight: 25, marginBottom: 15 }}
                  ></Defender>
                </ViewForDefender>
                <ViewForGoalkeeper>
                  <Goalkeeper
                    onPress={() =>
                      handleGoalkeeperPositionPress(ElevenPositionValue, "GK")
                    }
                    style={{ marginTop: 25 }}
                  ></Goalkeeper>
                </ViewForGoalkeeper>
              </TestView>
            )}
          </ViewForBoard>
        </ViewForTacticBoard>
        <ViewForSlideTactic>
          <TacticBox isMain={isMainTactic}>
            <Title>{isMainTactic ? "메인전술" : "세부전술"}</Title>
            <TextBox
              multiline={true}
              onChangeText={
                isMainTactic ? handleChangeMainText : handleChangeSubText
              }
              value={isMainTactic ? mainText : subText}
              placeholder="내용을 입력하세요..."
              textAlignVertical="top"
              style={{ paddingTop: 10 }}
              placeholderTextColor="white"
              autoFocus={false}
              editable={false} // TextInput을 수정 불가능하게 설정
              pointerEvents="none" // 모든 터치 이벤트 차단
            />
            <ToggleButton onPress={handleToggleTactic}>
              <FontAwesome5 name="exchange-alt" size={20} color="white" />
            </ToggleButton>
          </TacticBox>
        </ViewForSlideTactic>
        <ViewForListPlayers>
          <ViewForListPlayersReal>
            <ViewForListPlayersTitle>
              <TextForListPlayersTitle>선수 목록</TextForListPlayersTitle>
              <TouchForPlusPlayer onPress={() => setinviteFriendVisible(true)}>
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                  팀원추가 +
                </Text>
              </TouchForPlusPlayer>
            </ViewForListPlayersTitle>
            <ViewForFlatList>
              <FlatList
                data={teamData}
                renderItem={({ item }) => (
                  <Item
                    title={item.title}
                    mainFormation={mainformation}
                    teamId={teamId}
                    memberId={item.memberId}
                    position={item.position}
                    userId={item.userId}
                    navigation={navigation}
                    setoutplayervisible={setoutplayervisible}
                    setKickOutmemberId={setKickOutmemberId}
                    role={item.role}
                  />
                )}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={ViewForSeparator}
                initialNumToRender={5}
                nestedScrollEnabled={true}
                maxToRenderPerBatch={5}
                removeClippedSubview="true"
              />
            </ViewForFlatList>
          </ViewForListPlayersReal>
        </ViewForListPlayers>
        <View
          style={{
            width: "100%",
            height: 20,
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          {/* <RegisterButton onPress={() => navigation.navigate(BanggusukTeam)}>
            <RegisterText>확인</RegisterText>
          </RegisterButton> */}
        </View>
      </ScrollView>
    </Container>
  );
};

export default AdminPlusBanggusukTeam;
