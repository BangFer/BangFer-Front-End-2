import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import styled from "styled-components";
import {
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  Keyboard,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import TacticsBack from "../../assets/TacticsBack.png";
import ProfileImg from "../../assets/profileimg.jpg";
import {
  FontAwesome5,
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  Ionicons,
  Feather,
} from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from "react-native-picker-select";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import axios from "axios";
import { verifyTokens, getTokenFromLocal } from "../LoginPackage/TokenUtils";
import { SafeAreaView } from "react-native-safe-area-context";
import { useActionSheet } from "@expo/react-native-action-sheet";

const handleTacticUpdate = async () => {
  if (!tacticName || !mainText || !subText || positionDetails.some(detail => !detail)) {
    Alert.alert("Error", "모든 필드를 채워주세요.");
    return;
  }

  try {
    const token = await getTokenFromLocal();
    const updatedTacticData = {
      tacticName,
      anonymous,
      mainFormation,
      tacticDetails: mainText,
      subTactic: subText,
      positionDetails: positionDetails.map(description => ({ positionDescription: description })),
    };

    const response = await axios.put(
      `http://13.125.14.94:8080/api/v1/tactics/${tacticId}`,
      updatedTacticData,
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "Bearer " + token.accessToken,
        },
      }
    );

    if (response.data.code === 'OK') {
      Alert.alert("Success", "전술이 성공적으로 수정되었습니다.");
      navigation.goBack();
    } else {
      Alert.alert("Error", "전술 수정에 실패했습니다: " + response.data.message);
    }
  } catch (error) {
    console.error("Error updating tactic:", error);
    Alert.alert("Error", "전술 수정 중 오류가 발생했습니다.");
  }
};


const RegisterButtonView = styled.View`
  flex: 10;
  align-items: flex-end;
  justify-content: center;
`;

const RegisterButton = styled.TouchableOpacity`
  border-radius: 8px;
  width: 60px;
  height: 40px;
  background-color: black;
  justify-content: center;
  align-items: center;
  margin-right: 25px;
  margin-bottom: 7px;
`;

const RegisterText = styled.Text`
  font-size: 20px;

  color: white;
`;

const reportUser = async (reportedUserId, reportActivity) => {
  const token = await getTokenFromLocal();
  try {
    console.log(
      `Reporting user: ${reportedUserId} for activity: ${reportActivity}`
    );
    const response = await axios.post(
      `http://13.125.14.94:8080/report/user/${reportedUserId}?reportActivity=${reportActivity}`,
      {},
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Authorization": "Bearer " + token.accessToken,
        },
      }
    );
    console.log("Report response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error reporting user:", error);
    throw error;
  }
};

const blockUser = async (isBlockedUserId) => {
  if (!isBlockedUserId) {
    console.error("Invalid user ID for blocking:", isBlockedUserId);
    throw new Error("유효하지 않은 사용자 ID입니다.");
  }
  
  const token = await getTokenFromLocal();
  try {
    console.log(`Sending block request for user ID: ${isBlockedUserId}`);
    const response = await axios.post(
      `http://13.125.14.94:8080/api/v1/tactics/block/${isBlockedUserId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Authorization": "Bearer " + token.accessToken,
        },
        timeout: 10000,
      }
    );
    console.log("Block response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in block process:", error);
    if (error.response) {
      console.error("Server responded with error:", error.response.data);
      alert("차단 처리 중 서버 오류가 발생했습니다: " + (error.response.data.message || "알 수 없는 오류"));
    } else if (error.request) {
      console.error("No response received:", error.request);
      alert("서버로부터 응답이 없습니다. 네트워크 연결을 확인해주세요.");
    } else {
      console.error("Error details:", error.message);
      alert("차단 처리 중 오류가 발생했습니다: " + error.message);
    }
  }
}

const createReply = async (tacticId, parentCommentId, commentText) => {
  const token = await getTokenFromLocal();
  try {
    const response = await axios.post(
      `http://13.125.14.94:8080/api/v1/tactics/${tacticId}/comment/${parentCommentId}`,
      { comment: commentText },  // 여기를 수정
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Authorization": "Bearer " + token.accessToken,
        },
      }
    );
    return response.data.result;
  } catch (error) {
    console.error("Error creating reply:", error);
    throw error;
  }
};

const deleteComment = async (commentId) => {
  const token = await getTokenFromLocal();
  try {
    console.log(`Deleting comment with ID: ${commentId}`);
    const response = await axios.delete(
      `http://13.125.14.94:8080/api/v1/tactics/comment/${commentId}`,
      {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      }
    );
    console.log("Delete comment response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data.message || "댓글 삭제 중 오류가 발생했습니다.");
    } else if (error.request) {
      console.error("No response received:", error.request);
      throw new Error("서버로부터 응답이 없습니다. 네트워크 연결을 확인해주세요.");
    } else {
      console.error("Error", error.message);
      throw new Error("댓글 삭제 중 알 수 없는 오류가 발생했습니다.");
    }
  }
};

const UserInfo = ({ nickName }) => {
  return (
    <View style={styles.userInfoBox}>
      <View style={styles.userInfoImageBox}>
        <Image
          style={styles.userInfoImage}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGujC5DzQ77Bi70CpaM3TlK-P_AkLr4ronKg&s",
          }}
        />
      </View>
      <Text style={styles.userInfoText}>{nickName}</Text>
    </View>
  );
};

const toggleLike = async (tacticId, setData) => {
  if (!tacticId) {
    console.error("Invalid tacticId:", tacticId);
    alert("유효하지 않은 전술 ID입니다.");
    return;
  }

  try {
    const token = await getTokenFromLocal();
    const url = `http://13.125.14.94:8080/api/v1/tactics/${tacticId}/like`;
    
    console.log("Sending request to:", url);
    console.log("With tacticId:", tacticId);

    const response = await axios.post(
      url,
      {},
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Authorization": "Bearer " + token.accessToken,
        },
      }
    );

    console.log("Response:", response.data);

    if (response.data.code === "OK") {
      const updatedLikeInfo = await GetTactics(tacticId);
      setData((prevData) => ({
        ...prevData,
        isLiked: updatedLikeInfo.result.isLiked,
        likeCnt: updatedLikeInfo.result.likeCnt,
      }));
    } else {
      console.error("Unexpected response:", response.data);
      alert("좋아요 처리에 실패했습니다. 다시 시도해 주세요.");
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
      alert("좋아요 처리 실패: " + (error.response.data.message || "알 수 없는 오류가 발생했습니다."));
    } else if (error.request) {
      console.error("No response received:", error.request);
      alert("서버로부터 응답이 없습니다. 네트워크 연결을 확인해주세요.");
    } else {
      console.error("Error details:", error.message);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  }
};

// 컴포넌트들


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
  border-color: #ff6262;
`;

const ViewforModalOutButton = styled.View`
  flex: 2.5;
  align-items: center;
  justify-content: center;
`;

const TextForModalPosition = styled.TextInput`
  font-weight: bold;
  color: #ff6262;
  font-size: 20px;
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
`;

const ViewForBoard = styled.View`
  margin-top: 5px;
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
`;

const ViewForFlatList = styled.View`
  width: 100%;
  height: 680px;
`;

const ViewForCommentData = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-left: 35px;
`;

const ViewForListPlayersTitle = styled.View`
  width: 100%;
  height: 60px;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`;

const ViewForDropdown = styled.View`
  heigth: 50px;
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
  background-color: grey;
  margin-left: 10px;
`;

const ViewForPickerContainer = styled.View`
  width: 115px;
  height: 100%;
  justifycontent: center;
  alignitems: center;
  margin-left: 80px;
`;

const SearchView = styled.View`
  flex-direction: row;
  align-items: center;
  border-radius: 10px; /* 둥근 외각선을 위한 속성 */
  border-width: 1px;
  border-color: #cccccc;
  padding: 5px 10px; /* 내부 여백 설정 */
  margin-right: 10px;
  margin-left: 10px;
  bottom: 10px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  height: 30px;
  font-size: 14px;
`;

const SearchText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: gray;
`;

const SubmitButton = styled.TouchableOpacity`
  position: absolute; /* 절대 위치 설정 */
  top: 10px; /* 위쪽 여백 설정 */
  right: 10px; /* 오른쪽 여백 설정 */
`;

const Item = ({ title }) => {
  const [pickerValue, setPickerValue] = useState("12"); // 초기값 설정

  return (
    <ViewForPlayer>
      <ViewForPlayerLeft>
        <TouchForPlayerImage></TouchForPlayerImage>
        <ItemText>{title}</ItemText>
      </ViewForPlayerLeft>
      <ViewForPlayerRight>
        <ViewForPickerContainer>
          <RNPickerSelect
            placeholder={{
              label: "후보",
              value: "12",
            }}
            fixAndroidTouchableBug={true}
            selectedValue={pickerValue}
            onValueChange={(itemValue, itemIndex) => setPickerValue(itemValue)}
            items={[
              { label: "ST", value: "1" },
              { label: "RS", value: "2" },
              { label: "LS", value: "3" },
              { label: "CAM", value: "4" },
              { label: "CDM", value: "5" },
              { label: "CM", value: "6" },
              { label: "RCB", value: "7" },
              { label: "LCB", value: "8" },
              { label: "CB", value: "9" },
              { label: "RB", value: "10" },
              { label: "GK", value: "11" },
            ]}
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

const StyledScrollView = styled.ScrollView`
  flex: 1;
  margin-bottom: 10px; /* 입력창 높이와 동일하게 설정 */
`;

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
  height: 40px;
  width: 120px;
  border-width: 4px;
  margin-left: 24px;
  border-radius: 10px;
  padding-left: 10px;
  font-size: 17px;
  font-weight: bold;
`;

const DirectorName = styled.TextInput`
  height: 40px;
  width: 120px;
  border-width: 4px;
  margin-right: 24px;
  border-radius: 10px;
  padding-left: 10px;
  font-size: 17px;
  font-weight: bold;
`;

const TacticsBackImage = styled.Image`
  width: 100%;
  height: 100%;
  ${StyleSheet.absoluteFillObject};
  z-index: -1;
`;
const TextForListPlayersTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  text-decoration-line: underline;
  margin-left: 10px;
`;

const Line = styled.View`
  width: calc(100% - 20px); /* 전체 너비에서 좌우 여백의 크기를 뺀 값 */
  height: 1px;
  background-color: black;
  margin-vertical: 10px; /* 선 위아래 여백 설정 */
  margin-horizontal: 10px; /* 좌우 여백 설정 */
`;
const LineForList = styled.View`
  flex: 1;
  height: 1px; /* 직선의 높이를 설정합니다. */
  background-color: black; /* 검은색으로 설정합니다. */
  margin-top: 5px;
  margin-bottom: 5px;
`;

const ViewForLine = styled.View`
  height: 20px;
  margin-left: 20px;
  margin-right: 20px;
`;

const ItemContainer = styled.View`
  margin-left: 20px;
  margin-right: 30px;
`;
const ReCommentContainer = styled.View`
  margin-left: 20px;
  margin-right: 30px;
`;

const ReCommentContent = styled.View`
  flex-direction: column;
  margin-left: 40px;
`;

const ReCommentFirstLineView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-left: -25px;
`;

const ReCommentButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 7px;
  border-radius: 5px;
  background-color: lightgray;
  margin-left: 188px;
  top: -12px;
`;

const ItemContent = styled.View`
  flex-direction: column;
  margin-left: 5px;
`;

const ItemTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;
  margin-right: 5px;
  margin-top: -15px;
`;

const ThumbsUpNumber = styled.Text`
  font-size: 14px;
  margin-right: 10px;
  color: #FF6262;
  margin-right: 5px;
  margin-left: 5px;
`;

const ChatBubbleNumber = styled.Text`
  font-size: 16px;
  margin-left: 5px;
  margin-right: 10px;
  color: blue;
`;

const ChatBubbleIcon = styled(Ionicons)`
  margin-top: 2px;
  margin-right: 2px;
  margin-right: 5px;
`;

const ThumbsUpIcon = styled(Feather)`
  margin-top: 2px;
  margin-right: 2px;
  margin-right: 5px;
`;

const FirstLineView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const OtherElements = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 15px;
`;

const SecondLineView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-left: -2px;
`;
const ThirdLineView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-left: 8px;
`;

const ThumbsUpButton = styled.TouchableOpacity`
  padding: 4px 4px; /* 버튼 내부 패딩 설정 */
  border-radius: 5px; /* 둥근 사각형 테두리 반지름 설정 */
  background-color: gray; /* 배경색 설정 */
  margin-left: 10px; /* 각 버튼 사이의 간격을 설정합니다. */
  flex-direction: row; /* 아이콘과 텍스트를 한 줄에 배치 */
  align-items: center; /* 아이콘과 텍스트를 수직으로 중앙 정렬 */
`;

const TakeTacticButton = styled.TouchableOpacity`
  padding: 4px 4px; /* 버튼 내부 패딩 설정 */
  border-radius: 5px; /* 둥근 사각형 테두리 반지름 설정 */
  background-color: gray; /* 배경색 설정 */
  margin-left: 10px; /* 각 버튼 사이의 간격을 설정합니다. */
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: white;
`;

const ImageContainer = styled.View`
  width: 45px; /* 이미지 컨테이너의 너비 */
  height: 45px; /* 이미지 컨테이너의 높이 */
  border-radius: 25px; /* 반지름을 너비 또는 높이의 절반으로 설정하여 원 모양으로 만듭니다. */
  overflow: hidden; /* 컨테이너 내부에서 벗어나는 이미지를 숨깁니다. */
  margin-left: 2px;
`;

const StyledImage = styled.Image`
  width: 100%; /* 이미지의 너비를 100%로 설정하여 이미지 컨테이너에 맞춥니다. */
  height: 100%; /* 이미지의 높이를 100%로 설정하여 이미지 컨테이너에 맞춥니다. */
  resize-mode: cover; /* 이미지를 늘리거나 축소하여 이미지 컨테이너에 꽉 차도록 설정합니다. */
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 7px;
  border-radius: 5px;
  background-color: lightgray;
  margin-left: 180px;
  top: -12px;
`;

const Divider = styled.View`
  width: 1px;
  height: 20px;
  background-color: gray;
  margin: 0 10px;
`;

const IconButton = styled.TouchableOpacity`
  padding: 2px;
  border-radius: 5px;
  background-color: light-gray;
  align-items: center;
  justify-content: center;
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

const GetTactics = async (tacticId) => {
  const Token = await getTokenFromLocal();
  const headers_config = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": "Bearer " + Token.accessToken,
  };
  const url = "http://13.125.14.94:8080/api/v1/tactics/" + tacticId;

  try {
    const response = await axios.get(url, { headers: headers_config });
    console.log("GetTactics response:", JSON.stringify(response.data));

    if (response.data && response.data.result) {
      const structuredComments = (response.data.result.comments || [])
        .map(comment => ({
          ...comment,
          replies: (comment.children || []),
        }));
    
      return {
        ...response.data,
        result: {
          ...response.data.result,
          comments: structuredComments,
        },
      };
    } else {
      console.error("Invalid data structure in GetTactics response");
      return null;
    }
  } catch (error) {
    console.error("Error fetching tactic detail:", error);
    throw error;
  }
};

const handleTacticCall = async (selectedTacticId, setters) => {
  try {
    const response = await GetTactics(selectedTacticId);
    console.log("Fetched tactic data:", response);

    if (response.code !== "OK" || !response.result) {
      console.error("Invalid response:", response);
      throw new Error("서버에서 유효한 응답을 받지 못했습니다.");
    }

    const tacticData = response.result;

    if (!tacticData || !tacticData.tacticId) {
      console.error("Invalid tactic data received:", tacticData);
      throw new Error("유효하지 않은 전술 데이터입니다.");
    }

    // 댓글 데이터 구조 일관성 유지
    const formattedComments = (tacticData.comments || []).map(comment => ({
      ...comment,
      nickName: comment.nickName || comment.nickname,
      commentText: comment.commentText || comment.comment,
      replies: (comment.replies || comment.children || []).map(reply => ({
        ...reply,
        nickName: reply.nickName || reply.nickname,
        commentText: reply.commentText || reply.comment,
      }))
    }));

    const formattedTacticData = {
      ...tacticData,
      comments: formattedComments,
      isLiked: tacticData.isLiked || false,
      likeCnt: tacticData.likeCnt || 0,
      commentCnt: tacticData.commentCnt || formattedComments.length,
    };

    setters.setData(formattedTacticData);
    setters.setMainText(tacticData.subTactic || '');
    setters.setSubText(tacticData.tacticDetails || '');
    setters.setSlectedFormation(tacticData.mainFormation || '');
    setters.setTacticName(tacticData.tacticName || '');
    setters.setannonymous(tacticData.anonymous || false);

    if (tacticData.positionDetail && Array.isArray(tacticData.positionDetail)) {
      tacticData.positionDetail.forEach((detail, index) => {
        if (detail && detail.positionDescription) {
          const setter = setters[`set${index + 1}PositionValue`];
          if (setter) {
            setter(detail.positionDescription);
          }
        }
      });
    }

    console.log("Formatted tactic data:", formattedTacticData);
    return formattedTacticData;
  } catch (error) {
    console.error("Error in handleTacticCall:", error);
    throw error;
  }
};

const showEmptyRegisterTactic = () => {
  ToastAndroid.show(
    "❌ 전술명, 메인전술, 세부전술, 포지션별 세부 전술을 입력해주세요.",
    ToastAndroid.LONG
  );
};

const RegisterTactic = async ({
  tacticName,
  annonymous,
  mainFormation,
  tacticDetails,
  subTactic,
  PositionDetailsValue1,
  PositionDetailsValue2,
  PositionDetailsValue3,
  PositionDetailsValue4,
  PositionDetailsValue5,
  PositionDetailsValue6,
  PositionDetailsValue7,
  PositionDetailsValue8,
  PositionDetailsValue9,
  PositionDetailsValue10,
  PositionDetailsValue11,
  navigation,
}) => {
  const token = await getTokenFromLocal();

  try {
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + token.accessToken,
    };

    const positionDetails = [
      { positionDescription: PositionDetailsValue1 },
      { positionDescription: PositionDetailsValue2 },
      { positionDescription: PositionDetailsValue3 },
      { positionDescription: PositionDetailsValue4 },
      { positionDescription: PositionDetailsValue5 },
      { positionDescription: PositionDetailsValue6 },
      { positionDescription: PositionDetailsValue7 },
      { positionDescription: PositionDetailsValue8 },
      { positionDescription: PositionDetailsValue9 },
      { positionDescription: PositionDetailsValue10 },
      { positionDescription: PositionDetailsValue11 },
    ];

    const data = {
      tacticName: tacticName,
      anonymous: annonymous,
      mainFormation: mainFormation,
      tacticDetails: tacticDetails,
      subTactic: subTactic,
      positionDetails: positionDetails,
    };

    const response = await axios.post(
      "http://13.125.14.94:8080/api/v1/tactics",
      data,
      {
        headers: headers,
      }
    );

    console.log(response.data);

    navigation.navigate("TacticsDetail", {
      tacticId: response.data.result.tacticId,
    });
    return response.data; // 반환할 데이터 형식에 맞게 수정
  } catch (error) {
    console.error(error.response);
    throw new Error("Failed to register Tactic");
  }
};


const TacticEdit = ({ navigation, route }) => {
  const [data, setData] = useState({
    comments: [],
    commentCnt: 0,
    likeCnt: 0,
    isLiked: false
  });
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태 추가
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 상태 추가
  const [token, setToken] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [anonymous, setannonymous] = useState("");
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
  const { showActionSheetWithOptions } = useActionSheet();
  const [tacticName, setTacticName] = useState("");
  const [selectedFormation, setSlectedFormation] = useState("");


  const [pickerValue, setPickerValue] = useState("1");




  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await getTokenFromLocal();
      setToken(fetchedToken);
    };
    fetchToken();
  }, []);


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
  

  useEffect(() => {
    const fetchTacticDetail = async () => {
      try {
        setLoading(true);
        console.log("Fetching tactic detail for ID:", route.params.tacticId);
        
        const tacticData = await handleTacticCall(route.params.tacticId, {
          setData,
          setMainText,
          setSubText,
          setSlectedFormation,
          setTacticName,
          setannonymous,
          setOnePositionValue,
          setTwoPositionValue,
          setThreePositionValue,
          setFourPositionValue,
          setFivePositionValue,
          setSixPositionValue,
          setSevenPositionValue,
          setEightPositionValue,
          setNinePositionValue,
          setTenPositionValue,
          setElevenPositionValue,
        });
        
        console.log("Fetched tactic data:", JSON.stringify(tacticData, null, 2));
        
        setOnePositionValue(tacticData.positionDetail[0].positionDescription);
        setTwoPositionValue(tacticData.positionDetail[1].positionDescription);
        setThreePositionValue(tacticData.positionDetail[2].positionDescription);
        setFourPositionValue(tacticData.positionDetail[3].positionDescription);
        setFivePositionValue(tacticData.positionDetail[4].positionDescription);
        setSixPositionValue(tacticData.positionDetail[5].positionDescription);
        setSevenPositionValue(tacticData.positionDetail[6].positionDescription);
        setEightPositionValue(tacticData.positionDetail[7].positionDescription);
        setNinePositionValue(tacticData.positionDetail[8].positionDescription);
        setTenPositionValue(tacticData.positionDetail[9].positionDescription);
        setElevenPositionValue(
          tacticData.positionDetail[10].positionDescription
        );

        // 댓글 데이터 구조 확인
        if (tacticData.comments && tacticData.comments.length > 0) {
          console.log("First comment data:", JSON.stringify(tacticData.comments[0], null, 2));
        }
        
      } catch (error) {
        console.error("Error fetching tactic detail:", error);
        alert("전술 데이터를 불러오는 데 실패했습니다: " + error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTacticDetail();
  }, [route.params.tacticId]);

 

  const [tacticData, setTacticData] = useState(null);
  
  useEffect(() => {
    const fetchTacticDetail = async () => {
      try {
        console.log("Fetching tactic detail for ID:", route.params.tacticId);
        await handleTacticCall(route.params.tacticId, {
          setData: setTacticData,
          setMainText,
          setSubText,
          setSlectedFormation,
          setTacticName,
          setannonymous,
          setOnePositionValue,
          setTwoPositionValue,
          setThreePositionValue,
          setFourPositionValue,
          setFivePositionValue,
          setSixPositionValue,
          setSevenPositionValue,
          setEightPositionValue,
          setNinePositionValue,
          setTenPositionValue,
          setElevenPositionValue,
        });
      } catch (error) {
        console.error("Error fetching tactic detail:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTacticDetail();
  }, [route.params.tacticId]);
  
  const [TacticsNameplaceholder, setTacticsNamePlaceholder] =
  useState("전술명");
const [DetailTacticsplaceholder, setDetailTacticsplaceholder] = useState("");
const [DetailPositionplaceholder, setDetailPositionplaceholder] =
  useState("");
const handleFocus = () => {
  setTacticsNamePlaceholder("");
};
const handleBlur = () => {
  setTacticsNamePlaceholder("전술명");
};
const [annonymous, setAnnonymous] = useState(false);

const [isMainTactic, setIsMainTactic] = useState(true);
const [mainText, setMainText] = useState("");
const [subText, setSubText] = useState("");

const handleToggleTactic = () => {
  setIsMainTactic(!isMainTactic);
  Keyboard.dismiss();
};

const handleChangeMainText = (inputText) => {
  setMainText(inputText);
  setTacticDetailsValue(inputText);
};

const handleChangeSubText = (inputText) => {
  setSubText(inputText);
  if (isMainTactic) {
    setAttackDetailsValue(inputText);
  } else {
    setDefenseDetailsValue(inputText);
  }
};
const [DirectorNameplaceholder, setDirectorNamePlaceholder] =
  useState("감독명");
const handleFocus2 = () => {
  setDirectorNamePlaceholder("");
};
const handleBlur2 = () => {
  setDirectorNamePlaceholder("감독명");
};

const [open, setOpen] = useState(false);
const [value, setValue] = useState({ label: "4-4-2", value: "1" });
const [items, setItems] = useState([
  { label: "4-4-2(기본)", value: "1" },
  { label: "4-3-3", value: "2" },
  { label: "4-3-2-1", value: "3" },
  { label: "4-2-3-1", value: "4" },
  { label: "3-4-3", value: "5" },
  { label: "3-5-2", value: "6" },
  { label: "3-2-4-1", value: "7" },
]);

const [isAttackerModalVisible1, setIsAttackerModalVisible1] = useState(false);
const [isAttackerModalVisible2, setIsAttackerModalVisible2] = useState(false);
const [isAttackerModalVisible3, setIsAttackerModalVisible3] = useState(false);

const [isMidfielderModalVisible1, setIsMidfielderModalVisible1] =
  useState(false);
const [isMidfielderModalVisible2, setIsMidfielderModalVisible2] =
  useState(false);
const [isMidfielderModalVisible3, setIsMidfielderModalVisible3] =
  useState(false);
const [isMidfielderModalVisible4, setIsMidfielderModalVisible4] =
  useState(false);
const [isMidfielderModalVisible5, setIsMidfielderModalVisible5] =
  useState(false);
const [isMidfielderModalVisible6, setIsMidfielderModalVisible6] =
  useState(false);

const [isDefenderModalVisible1, setIsDefenderModalVisible1] = useState(false);
const [isDefenderModalVisible2, setIsDefenderModalVisible2] = useState(false);
const [isDefenderModalVisible3, setIsDefenderModalVisible3] = useState(false);
const [isDefenderModalVisible4, setIsDefenderModalVisible4] = useState(false);

const [isGKModalVisible1, setIsGKModalVisible1] = useState(false);

const [currentValue, setCurrentValue] = useState(1);
const onChange = (value, index) => {
  switch (value) {
    case "1":
      setCurrentValue(1);
      setMainFormationValue("4-4-2");
      break;
    case "2":
      setCurrentValue(2);
      setMainFormationValue("4-3-3");
      break;
    case "3":
      setCurrentValue(3);
      setMainFormationValue("4-3-2-1");
      break;
    case "4":
      setCurrentValue(4);
      setMainFormationValue("4-2-3-1");

      break;
    case "5":
      setCurrentValue(5);
      setMainFormationValue("3-4-3");

      break;
    case "6":
      setCurrentValue(6);
      setMainFormationValue("3-5-2");

      break;
    case "7":
      setCurrentValue(7);
      setMainFormationValue("3-2-4-1");
      break;
    default:
      setCurrentValue(1);
      setMainFormationValue("4-4-2");
  }
};

const handleTacticRegister = () => {
  if (
    !TacticNameValue ||
    !PositionDetailsValue1 ||
    !PositionDetailsValue2 ||
    !PositionDetailsValue3 ||
    !PositionDetailsValue4 ||
    !PositionDetailsValue5 ||
    !PositionDetailsValue6 ||
    !PositionDetailsValue7 ||
    !PositionDetailsValue8 ||
    !PositionDetailsValue9 ||
    !PositionDetailsValue10 ||
    !PositionDetailsValue11 ||
    !mainText ||
    !subText
  ) {
    showEmptyRegisterTactic();
    return;
  }
  RegisterTactic({
    tacticName: TacticNameValue,
    annonymous: annonymous,
    mainFormation: MainFormationValue,
    tacticDetails: mainText,
    subTactic: subText,
    PositionDetailsValue1: PositionDetailsValue1,
    PositionDetailsValue2: PositionDetailsValue2,
    PositionDetailsValue3: PositionDetailsValue3,
    PositionDetailsValue4: PositionDetailsValue4,
    PositionDetailsValue5: PositionDetailsValue5,
    PositionDetailsValue6: PositionDetailsValue6,
    PositionDetailsValue7: PositionDetailsValue7,
    PositionDetailsValue8: PositionDetailsValue8,
    PositionDetailsValue9: PositionDetailsValue9,
    PositionDetailsValue10: PositionDetailsValue10,
    PositionDetailsValue11: PositionDetailsValue11,
    navigation,
  });
};
  
  const handleTacticNameChange = (text) => {
    setTacticName(text);
    setTacticNameValue(text);
  };


  const [TacticNameValue, setTacticNameValue] = useState("");
  const [MainFormationValue, setMainFormationValue] = useState("");
  const [TacticDetailsValue, setTacticDetailsValue] = useState("");
  const [AttackDetailsValue, setAttackDetailsValue] = useState("");
  const [DefenseDetailsValue, setDefenseDetailsValue] = useState("");
  const [PositionDetailsValue, setPositionDetailsValue] = useState("");
  const [PositionDetailsValue1, setPositionDetailsValue1] = useState("");
  const [PositionDetailsValue2, setPositionDetailsValue2] = useState("");
  const [PositionDetailsValue3, setPositionDetailsValue3] = useState("");
  const [PositionDetailsValue4, setPositionDetailsValue4] = useState("");
  const [PositionDetailsValue5, setPositionDetailsValue5] = useState("");
  const [PositionDetailsValue6, setPositionDetailsValue6] = useState("");
  const [PositionDetailsValue7, setPositionDetailsValue7] = useState("");
  const [PositionDetailsValue8, setPositionDetailsValue8] = useState("");
  const [PositionDetailsValue9, setPositionDetailsValue9] = useState("");
  const [PositionDetailsValue10, setPositionDetailsValue10] = useState("");
  const [PositionDetailsValue11, setPositionDetailsValue11] = useState("");


  useEffect(() => {
    if (tacticData) {
      setCommentData({
        comments: tacticData.comments || [],
        commentCnt: tacticData.commentCnt || 0,
      });
    }
  }, [tacticData]);
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6262" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6262" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["bottom", "right", "left"]}
    >
    <ViewForTextBar>
      <TaticsName
        value={tacticName}
        editable={true}
        pointerEvents="none"
        color="black"
        placeholder={TacticsNameplaceholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={handleTacticNameChange}
  />
          <BouncyCheckbox
          size={20}
          fillColor="black"
          unfillColor="#FFFFFF"
          text="익명"
          iconStyle={{ borderColor: "black" }}
          textStyle={{
            fontFamily: "JosefinSans-Regular",
            textDecorationLine: "none",
          }}
          style={{ marginLeft: 170 }}
          onPress={(isChecked) => setAnnonymous(isChecked)}
        />
            </ViewForTextBar>
            <ViewForTacticBoard>
            <ViewForDropdown>
                <TacticName
                  value={selectedFormation}
                  editable={false}
                  pointerEvents="none"
                />
              </ViewForDropdown>
              <ViewForBoard>
          <TacticsBackImage source={TacticsBack} resizeMode={"stretch"} />
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
                    editable={true} // TextInput을 수정 불가능하게 설정
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
                    editable={true} // TextInput을 수정 불가능하게 설정
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
                    editable={true} // TextInput을 수정 불가능하게 설정
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
                    editable={true} // TextInput을 수정 불가능하게 설정
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
                    editable={true} // TextInput을 수정 불가능하게 설정
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
                    editable={true} // TextInput을 수정 불가능하게 설정
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
                  editable={true}
                  pointerEvents="none"
                />
                <ToggleButton onPress={handleToggleTactic}>
                  <FontAwesome5 name="exchange-alt" size={20} color="white" />
                </ToggleButton>
              </TacticBox>
            </ViewForSlideTactic>
            <RegisterButtonView>
        <RegisterButton onPress={handleTacticUpdate}>
          <RegisterText>수정</RegisterText>
        </RegisterButton>
      </RegisterButtonView>
  </SafeAreaView>
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
  commentBox: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    borderRadius: 10,
  },
  reCommentBox: {
    marginLeft: 20,
    borderLeftWidth: 1,
    borderLeftColor: "#ddd",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentButtons: {
    flexDirection: "row",
  },
  replyButton: {
    padding: 5,
    marginRight: 5,
  },
  moreButton: {
    padding: 5,
  },
  replymoreButton: {
    padding: 5,
    marginRight: -20,
  },
  replyInputContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 5,
  },
  sendReplyButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    marginLeft: 5,
    backgroundColor: "#fe6263",
    borderRadius: 5,
  },
  contents: {
    fontSize: 14,
    lineHeight: 18,
    color: "#666",
    marginTop: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "column",
    gap: 8,
  },
  categoryBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 12,
  },
  categoryText: {
    fontSize: 12,
  },
  categoryItem: {
    padding: 4,
    backgroundColor: "#f1f1f1",
    borderRadius: 4,
  },
  title: {
    fontSize: 14,
  },
  buttonBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 12,
  },
  bar: {
    height: 1,
    backgroundColor: "#ddd",
  },
  barContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  imageBox: {
    flexDirection: "row",
    gap: 4,
    marginTop: 12,
  },
  image: {
    borderRadius: 12,
    overflow: "hidden",
    width: 160,
    height: 160,
  },
  userInfoBox: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  userInfoImageBox: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    borderColor: "#ddd",
  },
  userInfoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  userInfoText: {
    fontSize: 14,
  },
  commentInput: {
    backgroundColor: "#fff",
    padding: 20,
    fontSize: 14,
    flex: 1,
    borderColor: "black",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  commentInputContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopColor: "#ddd",
    borderTopWidth: 1,
    paddingHorizontal: 10,
  },
  sendButton: {
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)", // 배경을 어둡게 설정
  },
  modalImage: {
    width: "90%",
    height: "80%",
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FF6262",
    borderRadius: 5,
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 18,
  },
  cancelReplyButton: {
    padding: 10,
    marginLeft: 10,
  },
  cancelReplyText: {
    color: "#FF6262",
  },
  commentInputContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopColor: "#ddd",
    borderTopWidth: 1,
    paddingHorizontal: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    fontSize: 14,
  },
  sendButton: {
    padding: 10,
  },
  cancelReplyButton: {
    padding: 10,
  },
  cancelReplyText: {
    color: "#FF6262",
  },
});

export default TacticEdit;