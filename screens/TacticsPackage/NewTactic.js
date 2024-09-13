import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import styled from "styled-components";
import DropDownPicker from "react-native-dropdown-picker";
import TacticsBack from "../../assets/TacticsBack.png";
import { FontAwesome5 } from "@expo/vector-icons";
import { useMutation } from "react-query";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { getTokenFromLocal } from "../LoginPackage/TokenUtils";
import BouncyCheckbox from "react-native-bouncy-checkbox";

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
  Alert,
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
  background-color: ${({ isMain }) => (isMain ? "#ff6262" : "#5182FF")};
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

const NewTactic = ({ navigation }) => {
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

  const handleAttackerPositionPress = (PositionText) => {
    setDetailPositionplaceholder(PositionText);
  };

  const handleMidfielderPositionPress = (PositionText) => {
    setDetailPositionplaceholder(PositionText);
  };

  const handleDefenderPositionPress = (PositionText) => {
    setDetailPositionplaceholder(PositionText);
  };
  const handleGoalkeeperPositionPress = (PositionText) => {
    setDetailPositionplaceholder(PositionText);
  };

  return (
    <Container>
      <ViewForTextBar>
        <TaticsName
          placeholder={TacticsNameplaceholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={TacticNameValue}
          onChangeText={setTacticNameValue}
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
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            placeholder="포메이션"
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            onChangeValue={onChange}
            maxHeight={400}
            style={{
              backgroundColor: "#000",
            }}
            textStyle={{
              color: "#fff",
              fontWeight: "bold",
            }}
            dropDownContainerStyle={{
              backgroundColor: "#000",
            }}
            arrowIconStyle={{
              tintColor: "white",
              borderWidth: 13,
            }}
            nestedScrollEnabled={true}
          />
        </ViewForDropdown>
        <ViewForBoard>
          <TacticsBackImage source={TacticsBack} resizeMode={"stretch"} />
          <Modal // 공격수 1 모달
            animationType="slide"
            visible={isAttackerModalVisible1}
            transparent={true}
          >
            <ContainerModalView
              onPress={() => setIsAttackerModalVisible1(false)}
            >
              <ModalView>
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
                    editable
                    multiline
                    numberOfLines={3}
                    value={PositionDetailsValue1}
                    maxLength={100}
                    placeholder="세부 전술을 입력하세요."
                    onChangeText={(newText) =>
                      setPositionDetailsValue1(newText)
                    }
                    placeholderTextColor="#ff6262"
                  ></TextInputforModalTactics>
                </ViewforModalText>
                <ViewforModalOutButton>
                  <TouchForOutButton
                    style={{ backgroundColor: "#ff6262" }}
                    onPress={() => setIsAttackerModalVisible1(false)}
                  >
                    <TextForOutButton>확인</TextForOutButton>
                  </TouchForOutButton>
                </ViewforModalOutButton>
              </ModalView>
            </ContainerModalView>
          </Modal>
          <Modal // 공격수 2 모달
            animationType="slide"
            visible={isAttackerModalVisible2}
            transparent={true}
          >
            <ContainerModalView
              onPress={() => setIsAttackerModalVisible2(false)}
            >
              <ModalView>
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
                    editable
                    multiline
                    numberOfLines={3}
                    value={PositionDetailsValue2}
                    maxLength={100}
                    placeholder="세부 전술을 입력하세요."
                    onChangeText={(newText) =>
                      setPositionDetailsValue2(newText)
                    }
                    placeholderTextColor="#ff6262"
                  ></TextInputforModalTactics>
                </ViewforModalText>
                <ViewforModalOutButton>
                  <TouchForOutButton
                    style={{ backgroundColor: "#ff6262" }}
                    onPress={() => setIsAttackerModalVisible2(false)}
                  >
                    <TextForOutButton>확인</TextForOutButton>
                  </TouchForOutButton>
                </ViewforModalOutButton>
              </ModalView>
            </ContainerModalView>
          </Modal>
          <Modal // 공격수 3 모달
            animationType="slide"
            visible={isAttackerModalVisible3}
            transparent={true}
          >
            <ContainerModalView
              onPress={() => setIsAttackerModalVisible3(false)}
            >
              <ModalView>
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
                    editable
                    multiline
                    numberOfLines={3}
                    value={PositionDetailsValue3}
                    maxLength={100}
                    placeholder="세부 전술을 입력하세요."
                    onChangeText={(newText) =>
                      setPositionDetailsValue3(newText)
                    }
                    placeholderTextColor="#ff6262"
                  ></TextInputforModalTactics>
                </ViewforModalText>
                <ViewforModalOutButton>
                  <TouchForOutButton
                    style={{ backgroundColor: "#ff6262" }}
                    onPress={() => setIsAttackerModalVisible3(false)}
                  >
                    <TextForOutButton>확인</TextForOutButton>
                  </TouchForOutButton>
                </ViewforModalOutButton>
              </ModalView>
            </ContainerModalView>
          </Modal>
          <Modal // 미드필더 1 모달
            animationType="slide"
            visible={isMidfielderModalVisible1}
            transparent={true}
          >
            <ContainerModalView
              onPress={() => setIsMidfielderModalVisible1(false)}
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
                    editable
                    multiline
                    numberOfLines={3}
                    value={PositionDetailsValue3}
                    maxLength={100}
                    placeholder="세부 전술을 입력하세요."
                    onChangeText={(newText) =>
                      setPositionDetailsValue3(newText)
                    }
                    placeholderTextColor="#5182FF"
                    style={{ color: "#5182FF" }}
                  ></TextInputforModalTactics>
                </ViewforModalText>
                <ViewforModalOutButton>
                  <TouchForOutButton
                    style={{ backgroundColor: "#5182FF" }}
                    onPress={() => setIsMidfielderModalVisible1(false)}
                  >
                    <TextForOutButton>확인</TextForOutButton>
                  </TouchForOutButton>
                </ViewforModalOutButton>
              </ModalView>
            </ContainerModalView>
          </Modal>
          <Modal // 미드필더 2 모달
            animationType="slide"
            visible={isMidfielderModalVisible2}
            transparent={true}
          >
            <ContainerModalView
              onPress={() => setIsMidfielderModalVisible2(false)}
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
                    editable
                    multiline
                    numberOfLines={3}
                    value={PositionDetailsValue4}
                    maxLength={100}
                    placeholder="세부 전술을 입력하세요."
                    onChangeText={(newText) =>
                      setPositionDetailsValue4(newText)
                    }
                    placeholderTextColor="#5182FF"
                    style={{ color: "#5182FF" }}
                  ></TextInputforModalTactics>
                </ViewforModalText>
                <ViewforModalOutButton>
                  <TouchForOutButton
                    style={{ backgroundColor: "#5182FF" }}
                    onPress={() => setIsMidfielderModalVisible2(false)}
                  >
                    <TextForOutButton>확인</TextForOutButton>
                  </TouchForOutButton>
                </ViewforModalOutButton>
              </ModalView>
            </ContainerModalView>
          </Modal>
          <Modal // 미드필더 3 모달
            animationType="slide"
            visible={isMidfielderModalVisible3}
            transparent={true}
          >
            <ContainerModalView
              onPress={() => setIsMidfielderModalVisible3(false)}
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
                    editable
                    multiline
                    numberOfLines={3}
                    value={PositionDetailsValue5}
                    maxLength={100}
                    placeholder="세부 전술을 입력하세요."
                    onChangeText={(newText) =>
                      setPositionDetailsValue5(newText)
                    }
                    placeholderTextColor="#5182FF"
                    style={{ color: "#5182FF" }}
                  ></TextInputforModalTactics>
                </ViewforModalText>
                <ViewforModalOutButton>
                  <TouchForOutButton
                    style={{ backgroundColor: "#5182FF" }}
                    onPress={() => setIsMidfielderModalVisible3(false)}
                  >
                    <TextForOutButton>확인</TextForOutButton>
                  </TouchForOutButton>
                </ViewforModalOutButton>
              </ModalView>
            </ContainerModalView>
          </Modal>
          <Modal // 미드필더 4 모달
            animationType="slide"
            visible={isMidfielderModalVisible4}
            transparent={true}
          >
            <ContainerModalView
              onPress={() => setIsMidfielderModalVisible4(false)}
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
                    editable
                    multiline
                    numberOfLines={3}
                    value={PositionDetailsValue6}
                    maxLength={100}
                    placeholder="세부 전술을 입력하세요."
                    onChangeText={(newText) =>
                      setPositionDetailsValue6(newText)
                    }
                    placeholderTextColor="#5182FF"
                    style={{ color: "#5182FF" }}
                  ></TextInputforModalTactics>
                </ViewforModalText>
                <ViewforModalOutButton>
                  <TouchForOutButton
                    style={{ backgroundColor: "#5182FF" }}
                    onPress={() => setIsMidfielderModalVisible4(false)}
                  >
                    <TextForOutButton>확인</TextForOutButton>
                  </TouchForOutButton>
                </ViewforModalOutButton>
              </ModalView>
            </ContainerModalView>
          </Modal>
          <Modal // 미드필더 5 모달
            animationType="slide"
            visible={isMidfielderModalVisible5}
            transparent={true}
          >
            <ContainerModalView
              onPress={() => setIsMidfielderModalVisible5(false)}
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
                    editable
                    multiline
                    numberOfLines={3}
                    value={PositionDetailsValue2}
                    maxLength={100}
                    placeholder="세부 전술을 입력하세요."
                    onChangeText={(newText) =>
                      setPositionDetailsValue2(newText)
                    }
                    placeholderTextColor="#5182FF"
                    style={{ color: "#5182FF" }}
                  ></TextInputforModalTactics>
                </ViewforModalText>
                <ViewforModalOutButton>
                  <TouchForOutButton
                    style={{ backgroundColor: "#5182FF" }}
                    onPress={() => setIsMidfielderModalVisible5(false)}
                  >
                    <TextForOutButton>확인</TextForOutButton>
                  </TouchForOutButton>
                </ViewforModalOutButton>
              </ModalView>
            </ContainerModalView>
          </Modal>
          <Modal // 미드필더 6 모달
            animationType="slide"
            visible={isMidfielderModalVisible6}
            transparent={true}
          >
            <ContainerModalView
              onPress={() => setIsMidfielderModalVisible6(false)}
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
                    editable
                    multiline
                    numberOfLines={3}
                    value={PositionDetailsValue7}
                    maxLength={100}
                    placeholder="세부 전술을 입력하세요."
                    onChangeText={(newText) =>
                      setPositionDetailsValue7(newText)
                    }
                    placeholderTextColor="#5182FF"
                    style={{ color: "#5182FF" }}
                  ></TextInputforModalTactics>
                </ViewforModalText>
                <ViewforModalOutButton>
                  <TouchForOutButton
                    style={{ backgroundColor: "#5182FF" }}
                    onPress={() => setIsMidfielderModalVisible6(false)}
                  >
                    <TextForOutButton>확인</TextForOutButton>
                  </TouchForOutButton>
                </ViewforModalOutButton>
              </ModalView>
            </ContainerModalView>
          </Modal>
          <Modal // 수비수 1 모달
            animationType="slide"
            visible={isDefenderModalVisible1}
            transparent={true}
          >
            <ContainerModalView
              onPress={() => setIsDefenderModalVisible1(false)}
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
                    editable
                    multiline
                    numberOfLines={3}
                    value={PositionDetailsValue7}
                    maxLength={100}
                    placeholder="세부 전술을 입력하세요."
                    onChangeText={(newText) =>
                      setPositionDetailsValue7(newText)
                    }
                    placeholderTextColor="#6CD163"
                    style={{ color: "#6CD163" }}
                  ></TextInputforModalTactics>
                </ViewforModalText>
                <ViewforModalOutButton>
                  <TouchForOutButton
                    style={{ backgroundColor: "#6CD163" }}
                    onPress={() => setIsDefenderModalVisible1(false)}
                  >
                    <TextForOutButton>확인</TextForOutButton>
                  </TouchForOutButton>
                </ViewforModalOutButton>
              </ModalView>
            </ContainerModalView>
          </Modal>
          <Modal // 수비수 2 모달
            animationType="slide"
            visible={isDefenderModalVisible2}
            transparent={true}
          >
            <ContainerModalView
              onPress={() => setIsDefenderModalVisible2(false)}
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
                    editable
                    multiline
                    numberOfLines={3}
                    value={PositionDetailsValue8}
                    maxLength={100}
                    placeholder="세부 전술을 입력하세요."
                    onChangeText={(newText) =>
                      setPositionDetailsValue8(newText)
                    }
                    placeholderTextColor="#6CD163"
                    style={{ color: "#6CD163" }}
                  ></TextInputforModalTactics>
                </ViewforModalText>
                <ViewforModalOutButton>
                  <TouchForOutButton
                    style={{ backgroundColor: "#6CD163" }}
                    onPress={() => setIsDefenderModalVisible2(false)}
                  >
                    <TextForOutButton>확인</TextForOutButton>
                  </TouchForOutButton>
                </ViewforModalOutButton>
              </ModalView>
            </ContainerModalView>
          </Modal>
          <Modal // 수비수 3 모달
            animationType="slide"
            visible={isDefenderModalVisible3}
            transparent={true}
          >
            <ContainerModalView
              onPress={() => setIsDefenderModalVisible3(false)}
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
                    editable
                    multiline
                    numberOfLines={3}
                    value={PositionDetailsValue9}
                    maxLength={100}
                    placeholder="세부 전술을 입력하세요."
                    onChangeText={(newText) =>
                      setPositionDetailsValue9(newText)
                    }
                    placeholderTextColor="#6CD163"
                    style={{ color: "#6CD163" }}
                  ></TextInputforModalTactics>
                </ViewforModalText>
                <ViewforModalOutButton>
                  <TouchForOutButton
                    style={{ backgroundColor: "#6CD163" }}
                    onPress={() => setIsDefenderModalVisible3(false)}
                  >
                    <TextForOutButton>확인</TextForOutButton>
                  </TouchForOutButton>
                </ViewforModalOutButton>
              </ModalView>
            </ContainerModalView>
          </Modal>
          <Modal // 수비수 4 모달
            animationType="slide"
            visible={isDefenderModalVisible4}
            transparent={true}
          >
            <ContainerModalView
              onPress={() => setIsDefenderModalVisible4(false)}
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
                    editable
                    multiline
                    numberOfLines={3}
                    value={PositionDetailsValue10}
                    maxLength={100}
                    placeholder="세부 전술을 입력하세요."
                    onChangeText={(newText) =>
                      setPositionDetailsValue10(newText)
                    }
                    placeholderTextColor="#6CD163"
                    style={{ color: "#6CD163" }}
                  ></TextInputforModalTactics>
                </ViewforModalText>
                <ViewforModalOutButton>
                  <TouchForOutButton
                    style={{ backgroundColor: "#6CD163" }}
                    onPress={() => setIsDefenderModalVisible4(false)}
                  >
                    <TextForOutButton>확인</TextForOutButton>
                  </TouchForOutButton>
                </ViewforModalOutButton>
              </ModalView>
            </ContainerModalView>
          </Modal>

          <Modal // 골키퍼 모달
            animationType="slide"
            visible={isGKModalVisible1}
            transparent={true}
          >
            <ContainerModalView onPress={() => setIsGKModalVisible1(false)}>
              <ModalView style={{ borderColor: "#FFB056" }}>
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
                    placeholderTextColor="#FFB056"
                    style={{ color: "#FFB056" }}
                  ></TextForModalPosition>
                </ViewforModalPosition>

                <ViewforModalText>
                  <TextInputforModalTactics
                    editable
                    multiline
                    numberOfLines={3}
                    value={PositionDetailsValue11}
                    maxLength={100}
                    placeholder="세부 전술을 입력하세요."
                    onChangeText={(newText) =>
                      setPositionDetailsValue11(newText)
                    }
                    placeholderTextColor="#FFB056"
                    style={{ color: "#FFB056" }}
                  ></TextInputforModalTactics>
                </ViewforModalText>
                <ViewforModalOutButton>
                  <TouchForOutButton
                    style={{ backgroundColor: "#FFB056" }}
                    onPress={() => setIsGKModalVisible1(false)}
                  >
                    <TextForOutButton>확인</TextForOutButton>
                  </TouchForOutButton>
                </ViewforModalOutButton>
              </ModalView>
            </ContainerModalView>
          </Modal>
          {currentValue === 1 && (
            <TestView>
              <ViewForForward>
                <Forward
                  style={{ marginTop: 70 }}
                  onPress={() => {
                    handleAttackerPositionPress("LS");
                    setIsAttackerModalVisible1(true);
                  }}
                ></Forward>
                <Forward
                  style={{ marginTop: 70 }}
                  onPress={() => {
                    handleAttackerPositionPress("RS");
                    setIsAttackerModalVisible2(true);
                  }}
                ></Forward>
              </ViewForForward>
              <ViewForMidfielder>
                <Midfielder
                  onPress={() => {
                    handleMidfielderPositionPress("LM");
                    setIsMidfielderModalVisible1(true);
                  }}
                ></Midfielder>
                <Midfielder
                  onPress={() => {
                    handleMidfielderPositionPress("LCM");
                    setIsMidfielderModalVisible2(true);
                  }}
                  style={{ marginTop: 25 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => {
                    handleMidfielderPositionPress("RCM");
                    setIsMidfielderModalVisible3(true);
                  }}
                  style={{ marginTop: 25 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => {
                    handleMidfielderPositionPress("RM");
                    setIsMidfielderModalVisible4(true);
                  }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("LB");
                    setIsDefenderModalVisible1(true);
                  }}
                ></Defender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("LCB");
                    setIsDefenderModalVisible2(true);
                  }}
                  style={{ marginTop: 25 }}
                ></Defender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("RCB");
                    setIsDefenderModalVisible3(true);
                  }}
                  style={{ marginTop: 25 }}
                ></Defender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("RB");
                    setIsDefenderModalVisible4(true);
                  }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper
                  onPress={() => {
                    handleAttackerPositionPress("GK");
                    setIsGKModalVisible1(true);
                  }}
                  style={{ marginTop: 25 }}
                ></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 2 && (
            <TestView>
              <ViewForForward style={{ justifyContent: "space-around" }}>
                <Forward
                  onPress={() => {
                    handleAttackerPositionPress("LW");
                    setIsAttackerModalVisible1(true);
                  }}
                  style={{ marginTop: 80 }}
                ></Forward>
                <Forward
                  onPress={() => {
                    handleAttackerPositionPress("ST");
                    setIsAttackerModalVisible2(true);
                  }}
                  style={{ marginBottom: 60 }}
                ></Forward>
                <Forward
                  onPress={() => {
                    handleAttackerPositionPress("RW");
                    setIsAttackerModalVisible3(true);
                  }}
                  style={{ marginTop: 80 }}
                ></Forward>
              </ViewForForward>
              <ViewForMidfielder>
                <Midfielder
                  onPress={() => {
                    handleMidfielderPositionPress("LCM");
                    setIsMidfielderModalVisible2(true);
                  }}
                  style={{ marginLeft: 45 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => {
                    handleMidfielderPositionPress("CM");
                    setIsMidfielderModalVisible3(true);
                  }}
                  style={{ marginTop: 50 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => {
                    handleMidfielderPositionPress("RCM");
                    setIsMidfielderModalVisible4(true);
                  }}
                  style={{ marginRight: 45 }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("LB");
                    setIsDefenderModalVisible1(true);
                  }}
                  style={{ marginTop: 15 }}
                ></Defender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("LCB");
                    setIsDefenderModalVisible2(true);
                  }}
                  style={{ marginTop: 35 }}
                ></Defender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("RCB");
                    setIsDefenderModalVisible3(true);
                  }}
                  style={{ marginTop: 35 }}
                ></Defender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("RB");
                    setIsDefenderModalVisible4(true);
                  }}
                  style={{ marginTop: 15 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper
                  onPress={() => {
                    handleAttackerPositionPress("GK");
                    setIsGKModalVisible1(true);
                  }}
                  style={{ marginTop: 30 }}
                ></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 3 && (
            <TestView>
              <ViewForForward>
                <Forward
                  onPress={() => {
                    handleAttackerPositionPress("ST");
                    setIsAttackerModalVisible1(true);
                  }}
                  style={{ marginBottom: 60 }}
                ></Forward>
              </ViewForForward>
              <SecondViewForMidfielder style={{ height: "20%" }}>
                <Midfielder
                  style={{ marginBottom: 20, marginLeft: 60 }}
                  onPress={() => {
                    handleMidfielderPositionPress("LAM");
                    setIsMidfielderModalVisible5(true);
                  }}
                ></Midfielder>
                <Midfielder
                  style={{ marginBottom: 20, marginRight: 60 }}
                  onPress={() => {
                    handleMidfielderPositionPress("RAM");
                    setIsMidfielderModalVisible1(true);
                  }}
                ></Midfielder>
              </SecondViewForMidfielder>
              <ViewForMidfielder style={{ height: "20%" }}>
                <Midfielder
                  onPress={() => {
                    handleMidfielderPositionPress("LCM");
                    setIsMidfielderModalVisible2(true);
                  }}
                  style={{ marginLeft: 15 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => {
                    handleMidfielderPositionPress("CM");
                    setIsMidfielderModalVisible3(true);
                  }}
                  style={{}}
                ></Midfielder>
                <Midfielder
                  onPress={() => {
                    handleMidfielderPositionPress("RCM");
                    setIsMidfielderModalVisible4(true);
                  }}
                  style={{ marginRight: 15 }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  onPress={() => {
                    handleMidfielderPositionPress("LB");
                    setIsDefenderModalVisible1(true);
                  }}
                  style={{ marginTop: 30 }}
                ></Defender>
                <Defender
                  onPress={() => {
                    handleMidfielderPositionPress("LCB");
                    setIsDefenderModalVisible2(true);
                  }}
                  style={{ marginTop: 50 }}
                ></Defender>
                <Defender
                  onPress={() => {
                    handleMidfielderPositionPress("RCB");
                    setIsDefenderModalVisible3(true);
                  }}
                  style={{ marginTop: 50 }}
                ></Defender>
                <Defender
                  onPress={() => {
                    handleMidfielderPositionPress("RB");
                    setIsDefenderModalVisible4(true);
                  }}
                  style={{ marginTop: 30 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper
                  onPress={() => {
                    handleAttackerPositionPress("GK");
                    setIsGKModalVisible1(true);
                  }}
                  style={{ marginTop: 25 }}
                ></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 4 && (
            <TestView>
              <ViewForForward>
                <Forward
                  onPress={() => {
                    handleAttackerPositionPress("ST");
                    setIsAttackerModalVisible1(true);
                  }}
                  style={{ marginBottom: 60 }}
                ></Forward>
              </ViewForForward>
              <SecondViewForMidfielder style={{ height: "20%" }}>
                <Midfielder
                  onPress={() => {
                    handleAttackerPositionPress("LAM");
                    setIsMidfielderModalVisible5(true);
                  }}
                  style={{ marginBottom: 10, marginLeft: 5 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => {
                    handleAttackerPositionPress("CAM");
                    setIsMidfielderModalVisible1(true);
                  }}
                  style={{ marginBottom: 10 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => {
                    handleAttackerPositionPress("RAM");
                    setIsMidfielderModalVisible2(true);
                  }}
                  style={{ marginBottom: 10, marginRight: 5 }}
                ></Midfielder>
              </SecondViewForMidfielder>
              <ViewForMidfielder style={{ height: "20%" }}>
                <Midfielder
                  onPress={() => {
                    handleAttackerPositionPress("LDM");
                    setIsMidfielderModalVisible3(true);
                  }}
                  style={{ marginLeft: 55 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => {
                    handleAttackerPositionPress("RDM");
                    setIsMidfielderModalVisible4(true);
                  }}
                  style={{ marginRight: 55 }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("LB");
                    setIsDefenderModalVisible1(true);
                  }}
                  style={{ marginTop: 15 }}
                ></Defender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("LCB");
                    setIsDefenderModalVisible2(true);
                  }}
                  style={{ marginTop: 35 }}
                ></Defender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("RCB");
                    setIsDefenderModalVisible3(true);
                  }}
                  style={{ marginTop: 35 }}
                ></Defender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("RB");
                    setIsDefenderModalVisible4(true);
                  }}
                  style={{ marginTop: 15 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper
                  onPress={() => {
                    handleAttackerPositionPress("GK");
                    setIsGKModalVisible1();
                  }}
                  style={{ marginTop: 25 }}
                ></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 5 && (
            <TestView>
              <ViewForForward style={{ justifyContent: "space-around" }}>
                <Forward
                  style={{ marginTop: 80 }}
                  onPress={() => {
                    handleAttackerPositionPress("LW");
                    setIsAttackerModalVisible1();
                  }}
                ></Forward>
                <Forward
                  onPress={() => {
                    handleAttackerPositionPress("ST");
                    setIsAttackerModalVisible2();
                  }}
                  style={{ marginTop: 20 }}
                ></Forward>
                <Forward
                  style={{ marginTop: 80 }}
                  onPress={() => {
                    handleAttackerPositionPress("RW");
                    setIsAttackerModalVisible3();
                  }}
                ></Forward>
              </ViewForForward>
              <ViewForMidfielder>
                <Midfielder
                  style={{ marginTop: 25 }}
                  onPress={() => {
                    handleAttackerPositionPress("LM");
                    setIsMidfielderModalVisible2();
                  }}
                ></Midfielder>
                <Midfielder
                  onPress={() => {
                    handleAttackerPositionPress("LCM");
                    setIsMidfielderModalVisible3();
                  }}
                  style={{ marginTop: 45 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => {
                    handleAttackerPositionPress("RCM");
                    setIsMidfielderModalVisible4();
                  }}
                  style={{ marginTop: 45 }}
                ></Midfielder>
                <Midfielder
                  style={{ marginTop: 25 }}
                  onPress={() => {
                    handleAttackerPositionPress("RM");
                    setIsMidfielderModalVisible6();
                  }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("LCB");
                    setIsDefenderModalVisible2();
                  }}
                  style={{ marginLeft: 25, marginBottom: 15 }}
                ></Defender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("CB");
                    setIsDefenderModalVisible3();
                  }}
                  style={{}}
                ></Defender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("RCB");
                    setIsDefenderModalVisible4();
                  }}
                  style={{ marginRight: 25, marginBottom: 15 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper
                  onPress={() => {
                    handleAttackerPositionPress("GK");
                    setIsGKModalVisible1();
                  }}
                  style={{ marginTop: 25 }}
                ></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 6 && (
            <TestView>
              <ViewForForward>
                <Forward
                  onPress={() => {
                    handleAttackerPositionPress("LS");
                    setIsAttackerModalVisible1();
                  }}
                ></Forward>
                <Forward
                  onPress={() => {
                    handleAttackerPositionPress("RS");
                    setIsAttackerModalVisible2();
                  }}
                ></Forward>
              </ViewForForward>
              <SecondViewForMidfielder
                style={{ justifyContent: "space-between", height: "20%" }}
              >
                <Midfielder
                  onPress={() => {
                    handleAttackerPositionPress("CAM");
                    setIsMidfielderModalVisible1();
                  }}
                  style={{ marginLeft: 20, marginTop: 70 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => {
                    handleAttackerPositionPress("LM");
                    setIsMidfielderModalVisible2();
                  }}
                  style={{ marginTop: 10 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => {
                    handleAttackerPositionPress("RM");
                    setIsMidfielderModalVisible3();
                  }}
                  style={{ marginRight: 20, marginTop: 70 }}
                ></Midfielder>
              </SecondViewForMidfielder>
              <ViewForMidfielder style={{ height: "20%" }}>
                <Midfielder
                  onPress={() => {
                    handleAttackerPositionPress("RCM");
                    setIsMidfielderModalVisible4();
                  }}
                  style={{ marginLeft: 60 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => {
                    handleAttackerPositionPress("LCM");
                    setIsMidfielderModalVisible6();
                  }}
                  style={{ marginRight: 60 }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("LCB");
                    setIsDefenderModalVisible2();
                  }}
                  style={{ marginLeft: 25, marginBottom: 15 }}
                ></Defender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("CB");
                    setIsDefenderModalVisible3();
                  }}
                  style={{}}
                ></Defender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("RCB");
                    setIsDefenderModalVisible4();
                  }}
                  style={{ marginRight: 25, marginBottom: 15 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper
                  onPress={() => {
                    handleAttackerPositionPress("GK");
                    setIsGKModalVisible1();
                  }}
                  style={{ marginTop: 25 }}
                ></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 7 && (
            <TestView>
              <ViewForForward>
                <Forward
                  onPress={() => {
                    handleAttackerPositionPress("ST");
                    setIsAttackerModalVisible1();
                  }}
                  style={{ marginBottom: 60 }}
                ></Forward>
              </ViewForForward>
              <SecondViewForMidfielder style={{ height: "20%" }}>
                <Midfielder
                  onPress={() => {
                    handleAttackerPositionPress("LM");
                    setIsMidfielderModalVisible5();
                  }}
                  style={{ marginBottom: 15 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => {
                    handleAttackerPositionPress("LAM");
                    setIsMidfielderModalVisible1();
                  }}
                  style={{ marginBottom: 15 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => {
                    handleAttackerPositionPress("RAM");
                    setIsMidfielderModalVisible2();
                  }}
                  style={{ marginBottom: 15 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => {
                    handleAttackerPositionPress("RM");
                    setIsMidfielderModalVisible3();
                  }}
                  style={{ marginBottom: 15 }}
                ></Midfielder>
              </SecondViewForMidfielder>
              <ViewForMidfielder style={{ height: "20%" }}>
                <Midfielder
                  onPress={() => {
                    handleAttackerPositionPress("RDM");
                    setIsMidfielderModalVisible4();
                  }}
                  style={{ marginLeft: 75 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => {
                    handleAttackerPositionPress("LDM");
                    setIsMidfielderModalVisible6();
                  }}
                  style={{ marginRight: 75 }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("LCB");
                    setIsDefenderModalVisible2();
                  }}
                  style={{ marginLeft: 25, marginBottom: 15 }}
                ></Defender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("CB");
                    setIsDefenderModalVisible3();
                  }}
                  style={{ marginTop: 15 }}
                ></Defender>
                <Defender
                  onPress={() => {
                    handleAttackerPositionPress("RCB");
                    setIsDefenderModalVisible4();
                  }}
                  style={{ marginRight: 25, marginBottom: 15 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper
                  onPress={() => {
                    handleAttackerPositionPress("GK");
                    setIsGKModalVisible1();
                  }}
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
          />
          <ToggleButton onPress={handleToggleTactic}>
            <FontAwesome5 name="exchange-alt" size={20} color="white" />
          </ToggleButton>
        </TacticBox>
      </ViewForSlideTactic>
      <RegisterButtonView>
        <RegisterButton onPress={() => handleTacticRegister()}>
          <RegisterText>등록</RegisterText>
        </RegisterButton>
      </RegisterButtonView>
    </Container>
  );
};

export default NewTactic;
