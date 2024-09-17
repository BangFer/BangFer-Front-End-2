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
  ToastAndroid,
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
    return res;
  } catch (error) {
    console.error("전체 오류 객체:", error.toJSON());
    throw error; // 에러를 던져서 호출하는 쪽에서 처리할 수 있게 합니다.
  }
};

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
      alert(
        "차단 처리 중 서버 오류가 발생했습니다: " +
          (error.response.data.message || "알 수 없는 오류")
      );
    } else if (error.request) {
      console.error("No response received:", error.request);
      alert("서버로부터 응답이 없습니다. 네트워크 연결을 확인해주세요.");
    } else {
      console.error("Error details:", error.message);
      alert("차단 처리 중 오류가 발생했습니다: " + error.message);
    }
  }
};

const createReply = async (tacticId, parentCommentId, commentText) => {
  const token = await getTokenFromLocal();
  try {
    const response = await axios.post(
      `http://13.125.14.94:8080/api/v1/tactics/${tacticId}/comment/${parentCommentId}`,
      { comment: commentText }, // 여기를 수정
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
      throw new Error(
        error.response.data.message || "댓글 삭제 중 오류가 발생했습니다."
      );
    } else if (error.request) {
      console.error("No response received:", error.request);
      throw new Error(
        "서버로부터 응답이 없습니다. 네트워크 연결을 확인해주세요."
      );
    } else {
      console.error("Error", error.message);
      throw new Error("댓글 삭제 중 알 수 없는 오류가 발생했습니다.");
    }
  }
};

const UserInfo = ({ nickName, profileImage }) => {
  return (
    <View style={styles.userInfoBox}>
      <View style={styles.userInfoImageBox}>
        <Image
          style={styles.userInfoImage}
          source={
            profileImage
              ? { uri: profileImage }
              : require("../../assets/profileimg.jpg") // 기본 이미지 경로를 지정해주세요
          }
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
      alert(
        "좋아요 처리 실패: " +
          (error.response.data.message || "알 수 없는 오류가 발생했습니다.")
      );
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
const CommentItem = ({
  data,
  onReply,
  onDelete,
  isOwnComment,
  tacticId,
  showActionSheetWithOptions,
  token,
  profileImage
}) => {
  console.log("CommentItem data:", JSON.stringify(data, null, 2));

  const getCommentId = () => {
    return data.commentId || data.tacticCommentId || data.id;
  };

  const handleReplyPress = () => {
    const commentId = getCommentId();
    if (commentId === undefined) {
      console.error(
        "Comment ID is undefined. Full data:",
        JSON.stringify(data, null, 2)
      );
      return;
    }

    Alert.alert(
      "대댓글 작성",
      "대댓글을 작성하시겠습니까?",
      [
        {
          text: "아니오",
          style: "cancel",
        },
        {
          text: "예",
          onPress: () => onReply(commentId, data.nickName || data.nickname),
        },
      ],
      { cancelable: false }
    );
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      onReply(data.commentId, replyText);
      setReplyText("");
      setShowReplyInput(false);
    }
  };

  const handleMorePress = () => {
    const commentId = getCommentId();
    if (commentId === undefined) {
      console.error("Comment ID is undefined. Cannot perform actions.");
      return;
    }

    const reportOptions = [
      "욕설/비하",
      "음란물/불건전한 만남 및 대화",
      "정치적 발언",
      "사칭",
      "상업적 광고 및 판매",
    ];

    const reportActivities = [
      "CURSING",
      "OBSCENE",
      "POLITICAL",
      "IMPOSTOR",
      "COMMERCIAL",
    ];

    const options = ["신고", "차단"];
    if (isOwnComment(data.userId)) {
      options.push("삭제");
    }
    options.push("취소");

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        destructiveButtonIndex: isOwnComment(data.userId) ? 2 : -1,
      },
      async (selectedIndex) => {
        switch (selectedIndex) {
          case 0: // 신고
            showActionSheetWithOptions(
              {
                options: [...reportOptions, "취소"],
                cancelButtonIndex: reportOptions.length,
              },
              async (reportIndex) => {
                if (reportIndex !== reportOptions.length) {
                  try {
                    const result = await reportUser(
                      data.userId,
                      reportActivities[reportIndex]
                    );
                    alert("신고가 접수되었습니다.");
                  } catch (error) {
                    alert("신고 처리 중 오류가 발생했습니다.");
                  }
                }
              }
            );
            break;
          case 1: // 차단
            try {
              console.log("Attempting to block user. Comment data:", data);
              if (!data.userId) {
                throw new Error("User ID is missing from comment data");
              }
              console.log("Blocking user with ID:", data.userId);
              const result = await blockUser(data.userId);
              console.log("Block result:", result);
              alert("사용자가 차단되었습니다.");
            } catch (error) {
              console.error("Error in block process:", error);
              alert("차단 처리 중 오류가 발생했습니다: " + error.message);
            }
            break;
          case 2: // 삭제
            if (isOwnComment(data.userId)) {
              console.log(`Calling onDelete with commentId: ${commentId}`);
              onDelete(commentId);
            }
            break;
        }
      }
    );
  };

  return (
    <View style={styles.commentBox}>
      <View style={styles.commentHeader}>
      <UserInfo nickName={data.nickName || data.nickname} profileImage={profileImage} />
        <View style={styles.commentButtons}>
          <Pressable onPress={handleReplyPress} style={styles.replyButton}>
            <FontAwesome5 name="comment-dots" size={16} color="#fe6263" />
          </Pressable>
          <Pressable onPress={handleMorePress} style={styles.moreButton}>
            <Entypo name="dots-three-vertical" size={16} color="black" />
          </Pressable>
        </View>
      </View>
      <View style={{ marginTop: 8 }}>
        <Text style={styles.contents}>{data.commentText || data.comment}</Text>
      </View>
      {data.children &&
        data.children.map((reply) => (
          <ReCommentItem
            key={`reply-${reply.commentId || reply.tacticCommentId}`}
            data={reply}
            onDelete={onDelete}
            isOwnComment={isOwnComment}
            showActionSheetWithOptions={showActionSheetWithOptions}
            token={token}
            profileImage={profileImage}
          />
        ))}
    </View>
  );
};

const ReCommentItem = ({
  data,
  onDelete,
  isOwnComment,
  showActionSheetWithOptions,
  token,
  profileImage,
}) => {
  const getCommentId = () => {
    return data.commentId || data.tacticCommentId || data.id;
  };

  const handleMorePress = () => {
    const commentId = getCommentId();
    if (commentId === undefined) {
      console.error("Comment ID is undefined. Cannot perform actions.");
      return;
    }

    const reportOptions = [
      "욕설/비하",
      "음란물/불건전한 만남 및 대화",
      "정치적 발언",
      "사칭",
      "상업적 광고 및 판매",
    ];

    const reportActivities = [
      "CURSING",
      "OBSCENE",
      "POLITICAL",
      "IMPOSTOR",
      "COMMERCIAL",
    ];

    const options = ["신고", "차단"];
    if (isOwnComment(data.userId)) {
      options.push("삭제");
    }
    options.push("취소");

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        destructiveButtonIndex: isOwnComment(data.userId) ? 2 : -1,
      },
      async (selectedIndex) => {
        switch (selectedIndex) {
          case 0: // 신고
            showActionSheetWithOptions(
              {
                options: [...reportOptions, "취소"],
                cancelButtonIndex: reportOptions.length,
              },
              async (reportIndex) => {
                if (reportIndex !== reportOptions.length) {
                  try {
                    const result = await reportUser(
                      data.userId,
                      reportActivities[reportIndex]
                    );
                    alert("신고가 접수되었습니다.");
                  } catch (error) {
                    alert("신고 처리 중 오류가 발생했습니다.");
                  }
                }
              }
            );
            break;
          case 1: // 차단
            try {
              console.log("Attempting to block user. Comment data:", data);
              if (!data.userId) {
                throw new Error("User ID is missing from comment data");
              }
              console.log("Blocking user with ID:", data.userId);
              const result = await blockUser(data.userId);
              console.log("Block result:", result);
              alert("사용자가 차단되었습니다.");
            } catch (error) {
              console.error("Error in block process:", error);
              alert("차단 처리 중 오류가 발생했습니다: " + error.message);
            }
            break;
          case 2: // 삭제
            if (isOwnComment(data.userId)) {
              console.log(`Calling onDelete with commentId: ${commentId}`);
              onDelete(commentId);
            }
            break;
        }
      }
    );
  };

  return (
    <View style={[styles.commentBox, styles.reCommentBox]}>
      <View style={styles.commentHeader}>
      <UserInfo nickName={data.nickName || data.nickname} profileImage={profileImage} />
        <Pressable onPress={handleMorePress} style={styles.replymoreButton}>
          <Entypo name="dots-three-vertical" size={16} color="black" />
        </Pressable>
      </View>
      <View style={{ marginTop: 8 }}>
        <Text style={styles.contents}>{data.commentText || data.comment}</Text>
      </View>
    </View>
  );
};

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

const TacticCopyButton = styled.TouchableOpacity`
  width: 100px;
  height: 22px;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
`;

const TacticCopyText = styled.Text`
  color: grey;
  font-size: 16px;
  font-weight: bold;
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
  color: #ff6262;
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

const TouchCalander = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
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

const TacticCopy = async (tacticId) => {
  const Token = await getTokenFromLocal();
  console.log(tacticId);
  console.log("Token" + JSON.stringify(Token));
  const headers_config = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": "Bearer " + Token.accessToken,
  };

  const url = "http://13.125.14.94:8080/api/v1/tactics/" + tacticId;
  console.log(url);
  try {
    const res = await axios.post(url, null, {
      headers: headers_config,
    });
    console.log("TacticCopy의 response는", JSON.stringify(res.data));
    // JSON.stringify로 객체를 문자열로 변환
    return res;
  } catch (error) {
    // 공통 오류 메시지 출력 (추가 디버깅 정보)
    console.error("전체 오류 객체:", error.toJSON());
  }
};

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
      const structuredComments = (response.data.result.comments || []).map(
        (comment) => ({
          ...comment,
          replies: comment.children || [],
        })
      );

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
    const formattedComments = (tacticData.comments || []).map((comment) => ({
      ...comment,
      nickName: comment.nickName || comment.nickname,
      commentText: comment.commentText || comment.comment,
      replies: (comment.replies || comment.children || []).map((reply) => ({
        ...reply,
        nickName: reply.nickName || reply.nickname,
        commentText: reply.commentText || reply.comment,
      })),
    }));

    const formattedTacticData = {
      ...tacticData,
      comments: formattedComments,
      isLiked: tacticData.isLiked || false,
      likeCnt: tacticData.likeCnt || 0,
      commentCnt: tacticData.commentCnt || formattedComments.length,
    };

    setters.setData(formattedTacticData);
    setters.setMainText(tacticData.subTactic || "");
    setters.setSubText(tacticData.tacticDetails || "");
    setters.setSlectedFormation(tacticData.mainFormation || "");
    setters.setTacticName(tacticData.tacticName || "");
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

const TacticsDetail = ({ navigation, route }) => {
  const [data, setData] = useState({
    comments: [],
    commentCnt: 0,
    likeCnt: 0,
    isLiked: false,
  });

  const handleTacticCopy = async () => {
    try {
      await TacticCopy(route.params.tacticId);
      ToastAndroid.show(
        "✅ 전술을 가져오는데 성공했습니다. 내 전술에서 확인하세요!",
        ToastAndroid.SHORT
      );
      navigation.navigate("MyTactics");
    } catch (error) {
      console.log(error);
    }
  };
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
  const [TacticsNameplaceholder, setTacticsNamePlaceholder] = useState("팀 명");
  const [DetailTacticsplaceholder, setDetailTacticsplaceholder] = useState("");
  const [DetailPositionplaceholder, setDetailPositionplaceholder] =
    useState("");

  const [pickerValue, setPickerValue] = useState("1");

  const [isMainTactic, setIsMainTactic] = useState(true);
  const [mainText, setMainText] = useState("");
  const [subText, setSubText] = useState("");

  const handleReport = async (reportActivity) => {
    try {
      const result = await reportUser(data.userId, reportActivity);
      alert("신고가 접수되었습니다.");
    } catch (error) {
      alert("신고 처리 중 오류가 발생했습니다.");
    }
  };

  const handleBlock = async () => {
    try {
      const result = await blockUser(data.userId);
      alert("사용자가 차단되었습니다.");
    } catch (error) {
      alert("차단 처리 중 오류가 발생했습니다.");
    }
  };

  const onPress = () => {
    const reportOptions = [
      "욕설/비하",
      "음란물/불건전한 만남 및 대화",
      "정치적 발언",
      "사칭",
      "상업적 광고 및 판매",
    ];

    const reportActivities = [
      "CURSING",
      "OBSCENE",
      "POLITICAL",
      "IMPOSTOR",
      "COMMERCIAL",
    ];

    const options = ["신고", "차단", "취소"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex: -1,
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0: // 신고
            showActionSheetWithOptions(
              {
                options: [...reportOptions, "취소"],
                cancelButtonIndex: reportOptions.length,
              },
              async (reportIndex) => {
                if (reportIndex !== reportOptions.length) {
                  try {
                    const selectedReportActivity =
                      reportActivities[reportIndex];
                    console.log(
                      `Selected report option: ${reportOptions[reportIndex]}`
                    );
                    console.log(
                      `Corresponding report activity: ${selectedReportActivity}`
                    );
                    const result = await reportUser(
                      data.userId,
                      selectedReportActivity
                    );
                    console.log("Report result:", result);
                    alert("신고가 접수되었습니다.");
                  } catch (error) {
                    console.error("Error in report process:", error);
                    alert(
                      "신고 처리 중 오류가 발생했습니다. 다시 시도해 주세요."
                    );
                  }
                }
              }
            );
            break;

          case 1: // 차단
            handleBlock();
            break;
          case cancelButtonIndex:
            console.log("취소됨");
            break;
        }
      }
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={onPress}>
          <Entypo name="dots-three-vertical" size={20} color="black" />
        </Pressable>
      ),
    });
  }, [data, onPress]);

  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await getTokenFromLocal();
      setToken(fetchedToken);
    };
    fetchToken();
  }, []);

  const isOwnComment = (commentUserId) => {
    return token && commentUserId === token.userId;
  };

  const renderCommentItem = ({ item }) => (
    <CommentItem
      data={item}
      onReply={handleReply}
      onDelete={handleDeleteComment}
      isOwnComment={isOwnComment}
      tacticId={route.params.tacticId}
      showActionSheetWithOptions={showActionSheetWithOptions}
      token={token}
      profileImage={profileImage}
    />
  );

  const handlePressSendComment = async () => {
    if (!commentText.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    try {
      const token = await getTokenFromLocal();
      let url;
      let requestData;

      console.log("Current replyingTo state:", replyingTo);

      if (replyingTo && replyingTo.id !== undefined) {
        url = `http://13.125.14.94:8080/api/v1/tactics/${route.params.tacticId}/comment/${replyingTo.id}`;
        requestData = {
          comment: commentText.trim().replace(`@${replyingTo.nickName} `, ""),
        };
        console.log("Replying to comment:", replyingTo.id);
      } else {
        url = `http://13.125.14.94:8080/api/v1/tactics/${route.params.tacticId}/comment`;
        requestData = { comment: commentText.trim() };
        console.log("Posting new comment");
      }

      console.log("Sending request to URL:", url);
      console.log("Request data:", requestData);

      const response = await axios.post(url, requestData, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Authorization": "Bearer " + token.accessToken,
        },
      });

      console.log("Response:", response.data);

      if (response.data.code === "OK") {
        const newComment = {
          ...response.data.result,
          nickname: response.data.result.nickname || token.nickname,
          comment: requestData.comment,
          children: [],
        };

        setData((prevData) => {
          let updatedComments = prevData.comments ? [...prevData.comments] : [];
          if (replyingTo && replyingTo.id !== undefined) {
            updatedComments = updatedComments.map((comment) => {
              if (
                comment.commentId === replyingTo.id ||
                comment.tacticCommentId === replyingTo.id
              ) {
                return {
                  ...comment,
                  children: [...(comment.children || []), newComment],
                };
              }
              return comment;
            });
          } else {
            updatedComments.push(newComment);
          }
          return {
            ...prevData,
            comments: updatedComments,
            commentCnt: (prevData.commentCnt || 0) + 1,
          };
        });

        setCommentText("");
        setReplyingTo(null);
        Keyboard.dismiss();
      } else {
        alert("댓글 등록에 실패했습니다: " + response.data.message);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        alert(
          "댓글 등록 실패: " +
            (error.response.data.message || "알 수 없는 오류가 발생했습니다.")
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("서버로부터 응답이 없습니다. 네트워크 연결을 확인해주세요.");
      } else {
        console.error("Error details:", error.message);
        alert("댓글 등록 중 오류가 발생했습니다.");
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    console.log(`handleDeleteComment called with commentId: ${commentId}`);
    if (!commentId) {
      console.error("Invalid comment ID:", commentId);
      Alert.alert("오류", "유효하지 않은 댓글 ID입니다.");
      return;
    }

    Alert.alert(
      "댓글 삭제",
      "정말로 이 댓글을 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "삭제",
          onPress: async () => {
            try {
              const response = await deleteComment(commentId);
              if (response.code === "OK") {
                // 서버에서 업데이트된 댓글 목록을 가져옵니다.
                const updatedData = await GetTactics(route.params.tacticId);
                setData(updatedData.result);
                Alert.alert("성공", "댓글이 삭제되었습니다.");
              } else {
                throw new Error(
                  response.message || "댓글 삭제에 실패했습니다."
                );
              }
            } catch (error) {
              console.error("Error in handleDeleteComment:", error);
              Alert.alert("오류", error.message || "댓글 삭제에 실패했습니다.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchCalander
            onPress={() =>
              Alert.alert(
                "도움말",
                "1. 세부 전술 확인 페이지입니다. \n\n2. 포지션 별 세부 전술 확인 가능합니다. \n\n3. 메인 전술 및 세부 전술 확인 가능합니다.\n\n4. 공감 및 전술 가져오기를 할 수 있습니다.(가져온 전술은 내 전술에 등록됩니다)\n\n5. 댓글 및 대댓글을 이용하여 다른 유저들과 자유롭게 의견을 교환할 수 있습니다."
              )
            }
          >
            <AntDesign name="questioncircleo" size={24} color="black" />
          </TouchCalander>
          <Pressable onPress={onPress}>
            <Entypo name="dots-three-vertical" size={20} color="black" />
          </Pressable>
        </View>
      ),
    });
  }, [data, onPress]);

  const handleReplyPress = (commentId, commentNickName) => {
    setReplyingTo({ id: commentId, nickName: commentNickName });
    setCommentText(`@${commentNickName} `);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setCommentText("");
  };

  const handleToggleLike = () => {
    if (!data || !data.tacticId) {
      console.error("Invalid data or data.tacticId:", data);
      alert("전술 정보가 유효하지 않습니다.");
      return;
    }
    toggleLike(data.tacticId, setData);
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

  const [isAttackerModalVisible, setIsAttackerModalVisible] = useState(false);
  const [isMidfielderModalVisible, setIsMidfielderModalVisible] =
    useState(false);
  const [isDefenderModalVisible, setIsDefenderModalVisible] = useState(false);
  const [isGKModalVisible, setIsGKModalVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState(1);
  const onChange = (value, index) => {
    switch (value) {
      case "1":
        setCurrentValue(1);
        break;
      case "2":
        setCurrentValue(2);
        break;
      case "3":
        setCurrentValue(3);
        break;
      case "4":
        setCurrentValue(4);
        break;
      case "5":
        setCurrentValue(5);
        break;
      case "6":
        setCurrentValue(6);
        break;
      case "7":
        setCurrentValue(7);
        break;
      default:
        setCurrentValue(1);
    }
  };

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

        console.log(
          "Fetched tactic data11:",
          JSON.stringify(tacticData, null, 2)
        );

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
          console.log(
            "First comment data:",
            JSON.stringify(tacticData.comments[0], null, 2)
          );
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

  const handleReply = (commentId, nickName) => {
    console.log(`Setting up reply to comment ${commentId} by ${nickName}`);
    if (commentId === undefined) {
      console.error("Comment ID is undefined");
      return;
    }
    setReplyingTo({ id: commentId, nickName: nickName });
    setCommentText("");
  };

  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    // 추후 검색 기능 구현
    console.log("검색어:", searchText);
  };

  const [tacticData, setTacticData] = useState(null);
  const [commentData, setCommentData] = useState({
    comments: [],
    commentCnt: 0,
  });

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

  useEffect(() => {
    if (tacticData) {
      setCommentData({
        comments: tacticData.comments || [],
        commentCnt: tacticData.commentCnt || 0,
      });
    }
  }, [tacticData]);

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (data && data.userId) {
          const profileData = await GetProfile(data.userId);
          setProfileImage(profileData.data.result.profileImageUrl);
        }
      } catch (error) {
        console.error("프로필 가져오기 오류:", error);
      }
    };

    fetchProfile();
  }, [data]);

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
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6262" />
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          ListHeaderComponent={
            <>
              <ViewForTextBar>
                <TaticsName
                  value={tacticName}
                  editable={false}
                  pointerEvents="none"
                  color="black"
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
                  <TacticsBackImage
                    source={TacticsBack}
                    resizeMode={"stretch"}
                  />
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
                    <ContainerModalView
                      onPress={() => setIsGKModalVisible(false)}
                    >
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
                            handleMidfielderPositionPress(
                              ThreePositionValue,
                              "LM"
                            )
                          }
                        ></Midfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              FourPositionValue,
                              "LCM"
                            )
                          }
                          style={{ marginTop: 25 }}
                        ></Midfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              FivePositionValue,
                              "RCM"
                            )
                          }
                          style={{ marginTop: 25 }}
                        ></Midfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              SixPositionValue,
                              "RM"
                            )
                          }
                        ></Midfielder>
                      </ViewForMidfielder>
                      <ViewForDefender>
                        <Defender
                          onPress={() =>
                            handleDefenderPositionPress(
                              SevenPositionValue,
                              "LB"
                            )
                          }
                        ></Defender>
                        <Defender
                          onPress={() =>
                            handleDefenderPositionPress(
                              EightPositionValue,
                              "LCB"
                            )
                          }
                          style={{ marginTop: 25 }}
                        ></Defender>
                        <Defender
                          onPress={() =>
                            handleDefenderPositionPress(
                              NinePositionValue,
                              "RCB"
                            )
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
                            handleGoalkeeperPositionPress(
                              ElevenPositionValue,
                              "GK"
                            )
                          }
                          style={{ marginTop: 25 }}
                        ></Goalkeeper>
                      </ViewForGoalkeeper>
                    </TestView>
                  )}
                  {selectedFormation === "4-3-3" && (
                    <TestView>
                      <ViewForForward
                        style={{ justifyContent: "space-around" }}
                      >
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
                            handleAttackerPositionPress(
                              ThreePositionValue,
                              "RW"
                            )
                          }
                          style={{ marginTop: 80 }}
                        ></Forward>
                      </ViewForForward>
                      <ViewForMidfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              FourPositionValue,
                              "LCM"
                            )
                          }
                          style={{ marginLeft: 45 }}
                        ></Midfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              FivePositionValue,
                              "CM"
                            )
                          }
                          style={{ marginTop: 50 }}
                        ></Midfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              SixPositionValue,
                              "RCM"
                            )
                          }
                          style={{ marginRight: 45 }}
                        ></Midfielder>
                      </ViewForMidfielder>
                      <ViewForDefender>
                        <Defender
                          onPress={() =>
                            handleDefenderPositionPress(
                              SevenPositionValue,
                              "LB"
                            )
                          }
                          style={{ marginTop: 15 }}
                        ></Defender>
                        <Defender
                          onPress={() =>
                            handleDefenderPositionPress(
                              EightPositionValue,
                              "LCB"
                            )
                          }
                          style={{ marginTop: 35 }}
                        ></Defender>
                        <Defender
                          onPress={() =>
                            handleDefenderPositionPress(
                              NinePositionValue,
                              "RCB"
                            )
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
                            handleGoalkeeperPositionPress(
                              ElevenPositionValue,
                              "GK"
                            )
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
                            handleMidfielderPositionPress(
                              TwoPositionValue,
                              "LAM"
                            )
                          }
                        ></Midfielder>
                        <Midfielder
                          style={{ marginBottom: 20, marginRight: 60 }}
                          onPress={() =>
                            handleMidfielderPositionPress(
                              ThreePositionValue,
                              "RAM"
                            )
                          }
                        ></Midfielder>
                      </SecondViewForMidfielder>
                      <ViewForMidfielder style={{ height: "20%" }}>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              FourPositionValue,
                              "LCM"
                            )
                          }
                          style={{ marginLeft: 15 }}
                        ></Midfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              FivePositionValue,
                              "CM"
                            )
                          }
                          style={{}}
                        ></Midfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              SixPositionValue,
                              "RCM"
                            )
                          }
                          style={{ marginRight: 15 }}
                        ></Midfielder>
                      </ViewForMidfielder>
                      <ViewForDefender>
                        <Defender
                          onPress={() =>
                            handleDefenderPositionPress(
                              SevenPositionValue,
                              "LB"
                            )
                          }
                          style={{ marginTop: 30 }}
                        ></Defender>
                        <Defender
                          onPress={() =>
                            handleDefenderPositionPress(
                              EightPositionValue,
                              "LCB"
                            )
                          }
                          style={{ marginTop: 50 }}
                        ></Defender>
                        <Defender
                          onPress={() =>
                            handleDefenderPositionPress(
                              NinePositionValue,
                              "RCB"
                            )
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
                            handleGoalkeeperPositionPress(
                              ElevenPositionValue,
                              "GK"
                            )
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
                            handleMidfielderPositionPress(
                              TwoPositionValue,
                              "LAM"
                            )
                          }
                          style={{ marginBottom: 10, marginLeft: 5 }}
                        ></Midfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              ThreePositionValue,
                              "CAM"
                            )
                          }
                          style={{ marginBottom: 10 }}
                        ></Midfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              FourPositionValue,
                              "RAM"
                            )
                          }
                          style={{ marginBottom: 10, marginRight: 5 }}
                        ></Midfielder>
                      </SecondViewForMidfielder>
                      <ViewForMidfielder style={{ height: "20%" }}>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              FivePositionValue,
                              "LDM"
                            )
                          }
                          style={{ marginLeft: 55 }}
                        ></Midfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              SixPositionValue,
                              "RDM"
                            )
                          }
                          style={{ marginRight: 55 }}
                        ></Midfielder>
                      </ViewForMidfielder>
                      <ViewForDefender>
                        <Defender
                          onPress={() =>
                            handleDefenderPositionPress(
                              SevenPositionValue,
                              "LB"
                            )
                          }
                          style={{ marginTop: 15 }}
                        ></Defender>
                        <Defender
                          onPress={() =>
                            handleDefenderPositionPress(
                              EightPositionValue,
                              "LCB"
                            )
                          }
                          style={{ marginTop: 35 }}
                        ></Defender>
                        <Defender
                          onPress={() =>
                            handleDefenderPositionPress(
                              NinePositionValue,
                              "RCB"
                            )
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
                            handleGoalkeeperPositionPress(
                              ElevenPositionValue,
                              "GK"
                            )
                          }
                          style={{ marginTop: 25 }}
                        ></Goalkeeper>
                      </ViewForGoalkeeper>
                    </TestView>
                  )}
                  {selectedFormation === "3-4-3" && (
                    <TestView>
                      <ViewForForward
                        style={{ justifyContent: "space-around" }}
                      >
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
                            handleAttackerPositionPress(
                              ThreePositionValue,
                              "RW"
                            )
                          }
                        ></Forward>
                      </ViewForForward>
                      <ViewForMidfielder>
                        <Midfielder
                          style={{ marginTop: 25 }}
                          onPress={() =>
                            handleMidfielderPositionPress(
                              FourPositionValue,
                              "LM"
                            )
                          }
                        ></Midfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              FivePositionValue,
                              "LCM"
                            )
                          }
                          style={{ marginTop: 45 }}
                        ></Midfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              SixPositionValue,
                              "RCM"
                            )
                          }
                          style={{ marginTop: 45 }}
                        ></Midfielder>
                        <Midfielder
                          style={{ marginTop: 25 }}
                          onPress={() =>
                            handleMidfielderPositionPress(
                              SevenPositionValue,
                              "RM"
                            )
                          }
                        ></Midfielder>
                      </ViewForMidfielder>
                      <ViewForDefender>
                        <Defender
                          onPress={() =>
                            handleDefenderPositionPress(
                              EightPositionValue,
                              "LCB"
                            )
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
                            handleGoalkeeperPositionPress(
                              ElevenPositionValue,
                              "GK"
                            )
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
                        style={{
                          justifyContent: "space-between",
                          height: "20%",
                        }}
                      >
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              ThreePositionValue,
                              "CAM"
                            )
                          }
                          style={{ marginLeft: 20, marginTop: 70 }}
                        ></Midfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              FourPositionValue,
                              "LM"
                            )
                          }
                          style={{ marginTop: 10 }}
                        ></Midfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              FivePositionValue,
                              "RM"
                            )
                          }
                          style={{ marginRight: 20, marginTop: 70 }}
                        ></Midfielder>
                      </SecondViewForMidfielder>
                      <ViewForMidfielder style={{ height: "20%" }}>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              SixPositionValue,
                              "RCM"
                            )
                          }
                          style={{ marginLeft: 60 }}
                        ></Midfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              SevenPositionValue,
                              "LCM"
                            )
                          }
                          style={{ marginRight: 60 }}
                        ></Midfielder>
                      </ViewForMidfielder>
                      <ViewForDefender>
                        <Defender
                          onPress={() =>
                            handleDefenderPositionPress(
                              EightPositionValue,
                              "LCB"
                            )
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
                            handleGoalkeeperPositionPress(
                              ElevenPositionValue,
                              "GK"
                            )
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
                            handleMidfielderPositionPress(
                              TwoPositionValue,
                              "LM"
                            )
                          }
                          style={{ marginBottom: 15 }}
                        ></Midfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              ThreePositionValue,
                              "LAM"
                            )
                          }
                          style={{ marginBottom: 15 }}
                        ></Midfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              FourPositionValue,
                              "RAM"
                            )
                          }
                          style={{ marginBottom: 15 }}
                        ></Midfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              FivePositionValue,
                              "RM"
                            )
                          }
                          style={{ marginBottom: 15 }}
                        ></Midfielder>
                      </SecondViewForMidfielder>
                      <ViewForMidfielder style={{ height: "20%" }}>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              SixPositionValue,
                              "RDM"
                            )
                          }
                          style={{ marginLeft: 75 }}
                        ></Midfielder>
                        <Midfielder
                          onPress={() =>
                            handleMidfielderPositionPress(
                              SevenPositionValue,
                              "LDM"
                            )
                          }
                          style={{ marginRight: 75 }}
                        ></Midfielder>
                      </ViewForMidfielder>
                      <ViewForDefender>
                        <Defender
                          onPress={() =>
                            handleDefenderPositionPress(
                              EightPositionValue,
                              "LCB"
                            )
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
                            handleGoalkeeperPositionPress(
                              ElevenPositionValue,
                              "GK"
                            )
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
                    editable={false}
                    pointerEvents="none"
                  />
                  <ToggleButton onPress={handleToggleTactic}>
                    <FontAwesome5 name="exchange-alt" size={20} color="white" />
                  </ToggleButton>
                </TacticBox>
              </ViewForSlideTactic>
              <View style={styles.barContainer}>
                <View style={[styles.bar, { marginTop: 5, width: "85%" }]} />
              </View>
              <View style={[styles.buttonBox, { marginLeft: 30 }]}>
                <FontAwesome5
                  name="comment-dots"
                  size={16}
                  color="#fe6263"
                  marginRight={5}
                />
                <Text style={{ color: "#666", fontSize: 14 }}>
                  {data?.commentCnt ?? 0}
                </Text>
                <View style={styles.button}>
                  <FontAwesome5
                    name="thumbs-up"
                    size={16}
                    color="#fe6263"
                    marginLeft={15}
                  />
                  <Text style={{ color: "#666", fontSize: 14 }}>
                    {data?.likeCnt ?? 0}
                  </Text>
                  <TacticCopyButton onPress={handleTacticCopy}>
                    <TacticCopyText>전술 가져오기</TacticCopyText>
                  </TacticCopyButton>
                </View>
                <Pressable
                  style={[
                    styles.button,
                    styles.likeButton,
                    { marginLeft: -10 },
                  ]}
                  onPress={handleToggleLike}
                >
                  <AntDesign
                    name={data?.isLiked ? "heart" : "hearto"}
                    size={16}
                    color={data?.isLiked ? "#fe6263" : "#666"}
                    marginLeft={70}
                  />
                  <Text style={{ color: "#666", fontSize: 12, marginLeft: 0 }}>
                    좋아요
                  </Text>
                </Pressable>
              </View>
              <View style={styles.barContainer}>
                <View style={[styles.bar, { marginTop: 15, width: "100%" }]} />
              </View>
            </>
          }
          data={data?.comments ?? []}
          ListEmptyComponent={
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text>댓글이 없습니다.</Text>
            </View>
          }
          renderItem={renderCommentItem}
          keyExtractor={(item, index) => {
            if (item.commentId) {
              return `comment-${item.commentId}`;
            }
            return `comment-index-${index}`;
          }}
        />
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.commentInputContainer}>
          <TextInput
            placeholder={
              replyingTo ? `대댓글을 입력하세요` : "댓글을 입력하세요"
            }
            style={styles.commentInput}
            value={commentText}
            onChangeText={setCommentText}
          />
          {replyingTo && (
            <Pressable
              style={styles.cancelReplyButton}
              onPress={() => {
                setReplyingTo(null);
                setCommentText("");
              }}
            >
              <Text style={styles.cancelReplyText}>취소</Text>
            </Pressable>
          )}
          <Pressable style={styles.sendButton} onPress={handlePressSendComment}>
            <Entypo name="triangle-right" size={28} color="#FF6262" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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

export default TacticsDetail;
