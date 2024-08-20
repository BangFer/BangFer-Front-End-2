import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import styled from "styled-components";
import DropDownPicker from "react-native-dropdown-picker";
import TacticsBack from "../../assets/TacticsBack.png";
import { FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import ProfileImg from "../../assets/profileimg.jpg";
import { useRoute } from "@react-navigation/native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { verifyTokens, getTokenFromLocal } from "../LoginPackage/TokenUtils";
import axios from "axios";

import { MaterialCommunityIcons } from "@expo/vector-icons";

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
} from "react-native";

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
  border-radius: 15px;
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
`;

const TacticBox = styled.View`
  border-radius: 15px;
  background-color: ${({ isMain }) => (isMain ? "tomato" : "blue")};
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
  font-size: 24px;
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
  color: tomato;
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

const GetTatics = async (taticsId) => {
  const Token = await getTokenFromLocal();

  const headers_config = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": "Bearer " + Token.accessToken,
  };
  const url = "http://13.125.14.94:8080/api/v1/tactics/" + taticsId;
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

const TacticsDetail = ({ navigation }) => {
  const route = useRoute();
  const { tacticId } = route.params;
  const renderItem = ({ item }) => {
    switch (item.type) {
      case "comment":
        return (
          <CommentItem
            username={item.username}
            description={item.description}
            number={item.number}
          />
        );
      case "recomment":
        return (
          <ReCommentItem
            username={item.username}
            description={item.description}
            number={item.number}
          />
        );
      default:
        return null; // 타입이 맞지 않을 경우 null 반환
    }
  };

  const data = [
    {
      type: "comment",
      username: "고민영",
      description: "헉 ㄷㄷ",
      number: "3",
    },
    {
      type: "comment",
      username: "김종우",
      description: "나 같은 경우에는",
      number: "3",
    },
    {
      type: "recomment",
      username: "오우석",
      description: "공감?유해진?",
      number: "2",
    },
    {
      type: "comment",
      username: "김민우",
      description: "그만...",
      number: "1",
    },
    {
      type: "comment",
      username: "김현우",
      description: "헉 ㄷㄷ",
      number: "1",
    },
    {
      type: "recomment",
      username: "김근식",
      description: "헉 ㄷㄷ",
      number: "1",
    },
    {
      type: "recomment",
      username: "고민영",
      description: "헉 ㄷㄷ",
      number: "1",
    },
  ];
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
  const [tacticName, setTacticName] = useState("");
  const [selectedFormation, setSlectedFormation] = useState("");
  const [TacticsNameplaceholder, setTacticsNamePlaceholder] = useState("팀 명");
  const [DetailTacticsplaceholder, setDetailTacticsplaceholder] = useState("");
  const [DetailPositionplaceholder, setDetailPositionplaceholder] =
    useState("");
  const handleFocus = () => {
    setTacticsNamePlaceholder("");
  };
  const handleBlur = () => {
    setTacticsNamePlaceholder("팀 명");
  };

  const [pickerValue, setPickerValue] = useState("1");

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
  const handleFocus2 = () => {
    setDirectorNamePlaceholder("");
  };
  const handleBlur2 = () => {
    setDirectorNamePlaceholder("감독명");
  };

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({ label: "4-4-2", value: "1" });
  const [items, setItems] = useState([
    { label: "내 전술", value: "1" },
    { label: "클롭", value: "2" },
    { label: "사비", value: "3" },
    { label: "알론소", value: "4" },
    { label: "맨시티식", value: "5" },
    { label: "맨유", value: "6" },
    { label: "첼시", value: "7" },
  ]);

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

  const CommentItem = ({ username, description, number }) => (
    <ItemContainer>
      <ItemContent>
        <FirstLineView>
          <ImageContainer>
            <StyledImage source={ProfileImg} />
          </ImageContainer>

          <OtherElements>
            <ItemTitle>{username}</ItemTitle>
            <ButtonContainer>
              <IconButton onPress={() => console.log("Chatbubble pressed")}>
                <FontAwesome5 name="comment-dots" size={14} color="blue" />
              </IconButton>
              <Divider />
              <IconButton onPress={() => console.log("Thumbs-up pressed")}>
                <FontAwesome5 name="thumbs-up" size={14} color="tomato" />
              </IconButton>
            </ButtonContainer>
          </OtherElements>
        </FirstLineView>

        <SecondLineView>
          <ItemText>{description}</ItemText>
        </SecondLineView>
        <ThirdLineView>
          <FontAwesome5 name="thumbs-up" size={14} color="tomato" />
          <ThumbsUpNumber>{number}</ThumbsUpNumber>
        </ThirdLineView>
        <LineForList />
      </ItemContent>
    </ItemContainer>
  );

  const ReCommentItem = ({ username, description, number }) => (
    <ReCommentContainer>
      <ReCommentContent>
        <ReCommentFirstLineView>
          <MaterialCommunityIcons
            name="arrow-right-bottom"
            size={20}
            color="black"
          />
          <ImageContainer>
            <StyledImage source={ProfileImg} />
          </ImageContainer>

          <OtherElements>
            <ItemTitle>{username}</ItemTitle>
            <ReCommentButtonContainer>
              <IconButton onPress={() => console.log("Thumbs-up pressed")}>
                <FontAwesome5 name="thumbs-up" size={14} color="tomato" />
              </IconButton>
            </ReCommentButtonContainer>
          </OtherElements>
        </ReCommentFirstLineView>

        <SecondLineView>
          <ItemText>{description}</ItemText>
        </SecondLineView>
        <ThirdLineView>
          <FontAwesome5 name="thumbs-up" size={14} color="tomato" />
          <ThumbsUpNumber>{number}</ThumbsUpNumber>
        </ThirdLineView>
      </ReCommentContent>
      <LineForList />
    </ReCommentContainer>
  );

  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    // 추후 검색 기능 구현
    console.log("검색어:", searchText);
  };

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

  const handleTacticCall = async (selectedTacticId) => {
    const data = await GetTatics(selectedTacticId);

    setMainText(data.data.result.subTactic);
    setSubText(data.data.result.tacticDetails);

    setSlectedFormation(data.data.result.mainFormation);
    setTacticName(data.data.result.tacticName);
    setannonymous(data.data.result.anonymous);
    console.log(anonymous);
    setOnePositionValue(data.data.result.positionDetail[0].positionDescription);
    setTwoPositionValue(data.data.result.positionDetail[1].positionDescription);
    setThreePositionValue(
      data.data.result.positionDetail[2].positionDescription
    );
    setFourPositionValue(
      data.data.result.positionDetail[3].positionDescription
    );
    setFivePositionValue(
      data.data.result.positionDetail[4].positionDescription
    );
    setSixPositionValue(data.data.result.positionDetail[5].positionDescription);
    setSevenPositionValue(
      data.data.result.positionDetail[6].positionDescription
    );
    setEightPositionValue(
      data.data.result.positionDetail[7].positionDescription
    );
    setNinePositionValue(
      data.data.result.positionDetail[8].positionDescription
    );
    setTenPositionValue(data.data.result.positionDetail[9].positionDescription);
    setElevenPositionValue(
      data.data.result.positionDetail[10].positionDescription
    );
  };

  useEffect(() => {
    const fetchTactics = async () => {
      handleTacticCall(tacticId);
    };

    fetchTactics();
  }, []);
  return (
    <Container>
      <StyledScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        nestedScrollEnabled={true}
      >
        <ViewForTextBar>
          <TaticsName
            value={tacticName}
            editable={false} // TextInput을 수정 불가능하게 설정
            pointerEvents="none" // 모든 터치 이벤트 차단
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
            style={{ marginLeft: 125 }}
            isChecked={anonymous} // 체크박스가 anonymous 값에 따라 체크됨
            onPress={() => {}} // 빈 함수를 전달하여 터치 이벤트 무시
            disableBuiltInState={true} // 내장된 상태 변경 비활성화
            disabled={true} // 체크박스를 비활성화 상태로 만듦
          />
        </ViewForTextBar>
        <ViewForTacticBoard>
          <ViewForDropdown>
            <TacticName
              value={selectedFormation}
              editable={false} // TextInput을 수정 불가능하게 설정
              pointerEvents="none"
            ></TacticName>
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
              editable={false} // TextInput을 수정 불가능하게 설정
              pointerEvents="none" // 모든 터치 이벤트 차단
            />
            <ToggleButton onPress={handleToggleTactic}>
              <FontAwesome5 name="exchange-alt" size={20} color="white" />
            </ToggleButton>
          </TacticBox>
        </ViewForSlideTactic>

        <ViewForCommentData>
          <FontAwesome5 name="thumbs-up" size={16} color="tomato" />
          <ThumbsUpNumber>6</ThumbsUpNumber>
          <FontAwesome5 name="comment-dots" size={16} color="blue" />
          <ChatBubbleNumber>6</ChatBubbleNumber>
          <ThumbsUpButton onPress={() => console.log("thumbsup")}>
            <ThumbsUpIcon name="thumbs-up" size={16} color="white" />
            <ButtonText>따봉</ButtonText>
          </ThumbsUpButton>

          <TakeTacticButton onPress={() => console.log("taketactic")}>
            <ButtonText>가져가기</ButtonText>
          </TakeTacticButton>
        </ViewForCommentData>

        <ViewForLine>
          <Line></Line>
        </ViewForLine>

        <ViewForFlatList>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </ViewForFlatList>
      </StyledScrollView>

      <SearchView>
        <SearchInput
          placeholder="댓글을 입력하세요"
          value={searchText}
          onChangeText={setSearchText}
        />
        <SubmitButton onPress={() => navigation.goBack()}>
          <Entypo name="triangle-right" size={24} color="tomato" />
        </SubmitButton>
      </SearchView>
    </Container>
  );
};

export default TacticsDetail;
