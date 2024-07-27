import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import styled from "styled-components";
import TacticsBack from "../../assets/TacticsBack.png";
import DropDownPicker from "react-native-dropdown-picker";
import { FontAwesome5 } from "@expo/vector-icons";
import { verifyTokens, getTokenFromLocal } from "../LoginPackage/TokenUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useQuery, useMutation } from "react-query";
import { Dropdown } from "react-native-element-dropdown";

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

const TTestView = styled.View`
  flex: 1;
`;
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
  flex: 11;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ViewForTacticBoard = styled.View`
  flex: 94;
  margin-left: 20px;
  margin-right: 20px;
`;

const ViewForBoard = styled.View`
  flex: 42;
`;

const ViewForDropdown = styled.View`
  flex: 5;
  z-index: 1;
  margin-left: 3.5px;
  margin-right: 3.5px;
`;

const ViewForSlideTactic = styled.View`
  flex: 29;
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

const RegisterButtonView = styled.View`
  flex: 10;
  align-items: flex-end;
  justify-content: center;
`;

const RegisterButton = styled.TouchableOpacity`
  border-radius: 8px;
  width: 60px;
  height: 40px;
  background-color: #d9d9d9;
  justify-content: center;
  align-items: center;
  margin-right: 25px;
  margin-bottom: 7px;
`;

const RegisterText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: black;
`;
const showNotChooseTactic = () => {
  ToastAndroid.show("❌ 전술을 선택해주세요.", ToastAndroid.LONG);
};

const showEmptyTeamName = () => {
  ToastAndroid.show("❌ 팀 명을 입력해주세요.", ToastAndroid.LONG);
};

const showSuccessCreateTeam = () => {
  ToastAndroid.show("✅ 팀 생성 성공", ToastAndroid.LONG);
};
const CreateBanggusukTeam = async ({ teamName, tacticId }) => {
  const Token = await getTokenFromLocal();
  try {
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + Token.accessToken,
    };

    const data = {
      teamName: teamName,
      tacticId: tacticId,
    };

    console.log(data);

    const response = await axios.post("http://13.125.14.94:8080/team", data, {
      headers: headers,
    });

    return response.data; // 반환할 데이터 형식에 맞게 수정
  } catch (error) {
    console.error(error.response);
    throw error.response;
  }
};

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

const CheckTactics = async (navigation) => {
  const Token = await getTokenFromLocal();

  const headers_config = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": "Bearer " + Token.accessToken,
  };

  try {
    const res = await axios.get("http://13.125.14.94:8080/team/tactic/list", {
      headers: headers_config,
    });
    console.log(res.data);
    console.log("CheckTatcis의 response는 ", JSON.stringify(res.data)); // JSON.stringify로 객체를 문자열로 변환
    return res;
  } catch (error) {
    console.error("error는 " + error);
  }
};

const EnrollBanggusukTeam = ({ navigation }) => {
  const [tactics, setTactics] = useState([]);
  const [open, setOpen] = useState(false);
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

  const onChangeName = (payload) => setName(payload);
  useEffect(() => {
    const fetchTactics = async () => {
      const data = await CheckTactics(navigation);
      if (data) {
        const transformedItems = data.data.result.map((tactic) => ({
          label: tactic.title,
          value: tactic.tacticId,
          formation: tactic.formation,
        }));
        setItems(transformedItems); // result 속성 설정
        console.log("Transformed items:", transformedItems); // 콘솔에 출력
      }
    };

    fetchTactics();
  }, [navigation]);

  const handleTacticChange = async (selectedTacticId) => {
    const data = await GetTatics(selectedTacticId);
    handleChangeMainText(data.data.result.subTactic);
    handleChangeSubText(data.data.result.tacticDetails);
    const selectedTactic = items.find(
      (item) => item.value === selectedTacticId
    );
    setSelectedFormation(selectedTactic.formation);

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

  const [DetailPositionplaceholder, setDetailPositionplaceholder] =
    useState("");
  const [TacticsNameplaceholder, setTacticsNamePlaceholder] = useState("팀 명");
  const [DetailTacticsplaceholder, setDetailTacticsplaceholder] = useState("");

  const handleFocus = () => {
    setTacticsNamePlaceholder("");
  };
  const handleBlur = () => {
    setTacticsNamePlaceholder("팀 명");
  };

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

  const [isAttackerModalVisible, setIsAttackerModalVisible] = useState(false);
  const [isMidfielderModalVisible, setIsMidfielderModalVisible] =
    useState(false);
  const [isDefenderModalVisible, setIsDefenderModalVisible] = useState(false);
  const [isGKModalVisible, setIsGKModalVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState();
  const onChange = (value) => {
    setCurrentValue(value);
    handleTacticChange(value);
  };

  const { mutate: requestEmailMutate } = useMutation(CreateBanggusukTeam, {
    onSuccess: (data) => {
      console.log("성공", data);
      // 성공 시 필요한 처리 추가
      showSuccessCreateTeam();
      navigation.navigate("BanggusukTeam");
    },
    onError: (error) => {
      console.error("에러", error);
      // 에러 시 필요한 처리 추가
    },
  });

  const handleCreateTeam = () => {
    if (!nameValue) {
      showEmptyTeamName();
      return;
    }
    if (!selectedFormation) {
      showNotChooseTactic();
      return;
    }
    requestEmailMutate({
      teamName: nameValue,
      tacticId: value,
    });
  };

  return (
    <Container>
      <ViewForTextBar>
        <TaticsName
          placeholder={TacticsNameplaceholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="setName"
          type="text"
          value={nameValue}
          onChangeText={onChangeName}
        />
      </ViewForTextBar>
      <ViewForTacticBoard>
        <ViewForDropdown>
          <Dropdown
            style={{
              backgroundColor: "#000", // 드롭다운 버튼 배경색
              borderRadius: 5,
              borderColor: "#fff",
              borderWidth: 1,
              marginBottom: 10,
              height: 50,
              width: "100%",
            }}
            placeholderStyle={{
              color: "#fff", // 플레이스홀더 텍스트 색상
              fontWeight: "bold",
              paddingLeft: 15,
            }}
            selectedTextStyle={{
              color: "#fff",
              fontWeight: "bold",
              paddingLeft: 15,
            }}
            itemContainerStyle={{
              backgroundColor: "#000", // 목록 항목의 배경색을 검은색으로 변경
              borderBottomWidth: 2, // 구분선 두께
              borderBottomColor: "#fff", // 구분선 색상
              fontWeight: "bold",
            }}
            itemTextStyle={{
              color: "#fff",
              // 목록 항목의 텍스트 색상
              fontWeight: "bold",
            }}
            data={items}
            labelField="label"
            valueField="value"
            placeholder="전술 선택"
            value={value}
            onChange={(item) => {
              onChange(item.value);
              // 선택된 항목에 따라 동작
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
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
              <ModalView>
                <ViewforModalPosition>
                  <TextForModalPosition
                    editable={false} // TextInput을 수정 불가능하게 설정
                    pointerEvents="none" // 모든 터치 이벤트 차단
                    numberOfLines={1}
                    value={DetailPositionplaceholder}
                    maxLenth={10}
                    placeholderTextColor="#ff6262"
                  ></TextForModalPosition>
                </ViewforModalPosition>

                <ViewforModalText>
                  <TextInputforModalTactics
                    multiline
                    numberOfLines={3}
                    value={DetailTacticsplaceholder}
                    maxLength={100}
                    placeholderTextColor="#ff6262"
                    editable={false} // TextInput을 수정 불가능하게 설정
                    pointerEvents="none" // 모든 터치 이벤트 차단
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
                    placeholderTextColor="#6CD163"
                    style={{ color: "#6CD163" }}
                  ></TextForModalPosition>
                </ViewforModalPosition>

                <ViewforModalText>
                  <TextInputforModalTactics
                    editable={false} // TextInput을 수정 불가능하게 설정
                    pointerEvents="none" // 모든 터치 이벤트 차단
                    numberOfLines={3}
                    value={DetailTacticsplaceholder}
                    maxLength={100}
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
                    editable={false} // TextInput을 수정 불가능하게 설정
                    pointerEvents="none" // 모든 터치 이벤트 차단
                    numberOfLines={1}
                    value={DetailPositionplaceholder}
                    maxLenth={10}
                    placeholderTextColor="#FFB056"
                    style={{ color: "#FFB056" }}
                  ></TextForModalPosition>
                </ViewforModalPosition>

                <ViewforModalText>
                  <TextInputforModalTactics
                    editable={false} // TextInput을 수정 불가능하게 설정
                    pointerEvents="none" // 모든 터치 이벤트 차단
                    numberOfLines={3}
                    value={DetailTacticsplaceholder}
                    maxLength={100}
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
      <RegisterButtonView>
        <RegisterButton onPress={handleCreateTeam}>
          <RegisterText>등록</RegisterText>
        </RegisterButton>
      </RegisterButtonView>
    </Container>
  );
};

export default EnrollBanggusukTeam;
