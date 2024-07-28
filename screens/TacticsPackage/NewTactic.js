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

const positionDetails = [
  {
    position: "Position1",
    positionDescription: "Description1"
  },  {
    position: "Position2",
    positionDescription: "Description2"
  },
  {
    position: "Position3",
    positionDescription: "Description3"
  },
  {
    position: "Position4",
    positionDescription: "Description4"
  },
  {
    position: "Position5",
    positionDescription: "Description5"
  },
  {
    position: "Position6",
    positionDescription: "Description6"
  },
  {
    position: "Position7",
    positionDescription: "Description7"
  },
  {
    position: "Position8",
    positionDescription: "Description8"
  },
  {
    position: "Position9",
    positionDescription: "Description9"
  },
  {
    position: "Position10",
    positionDescription: "Description10"
  },
  {
    position: "Position11",
    positionDescription: "Description11"
  }
];



const RegisterTactic = async ({ tacticName, famousCoachName, mainFormation, tacticDetails, attackDetails, defenseDetails, positionDetails}) => {

  const token = await getTokenFromLocal();

  try {
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + token.accessToken,
    };

    const data = {
      tacticName: tacticName,
      anonymous: true,
      famousCoachName: famousCoachName,
      mainFormation: mainFormation,
      tacticDetails: tacticDetails,
      attackDetails: attackDetails,
      defenseDetails: defenseDetails,
      positionDetails: positionDetails,
    };

    console.log(data);

    const response = await axios.post(
      "http://13.125.14.94:8080/api/v1/tactics",
      data,
      {
        headers: headers,
      }
    );

    return response.data; // 반환할 데이터 형식에 맞게 수정
  } catch (error) {
    console.error(error.response);
    throw new Error("Failed to register Tactic");
  }
}; 


const NewTactic = ({ navigation }) => {
  const [TacticsNameplaceholder, setTacticsNamePlaceholder] = useState("전술명");
  const [DetailTacticsplaceholder, setDetailTacticsplaceholder] = useState("");
  const [DetailPositionplaceholder, setDetailPositionplaceholder] =
    useState("");
  const handleFocus = () => {
    setTacticsNamePlaceholder("");
  };
  const handleBlur = () => {
    setTacticsNamePlaceholder("전술명");
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
  const [isAttackerModalVisible4, setIsAttackerModalVisible4] = useState(false);
  const [isAttackerModalVisible5, setIsAttackerModalVisible5] = useState(false);
  const [isAttackerModalVisible6, setIsAttackerModalVisible6] = useState(false);
  const [isAttackerModalVisible7, setIsAttackerModalVisible7] = useState(false);
  const [isAttackerModalVisible8, setIsAttackerModalVisible8] = useState(false);
  const [isAttackerModalVisible9, setIsAttackerModalVisible9] = useState(false);
  const [isAttackerModalVisible10, setIsAttackerModalVisible10] = useState(false);
  const [isAttackerModalVisible11, setIsAttackerModalVisible11] = useState(false);
  const [isAttackerModalVisible12, setIsAttackerModalVisible12] = useState(false);
  const [isAttackerModalVisible13, setIsAttackerModalVisible13] = useState(false);

  const [isMidfielderModalVisible1, setIsMidfielderModalVisible1] = useState(false);
  const [isMidfielderModalVisible2, setIsMidfielderModalVisible2] = useState(false);
  const [isMidfielderModalVisible3, setIsMidfielderModalVisible3] = useState(false);
  const [isMidfielderModalVisible4, setIsMidfielderModalVisible4] = useState(false);
  const [isMidfielderModalVisible5, setIsMidfielderModalVisible5] = useState(false);
  const [isMidfielderModalVisible6, setIsMidfielderModalVisible6] = useState(false);
  const [isMidfielderModalVisible7, setIsMidfielderModalVisible7] = useState(false);
  const [isMidfielderModalVisible8, setIsMidfielderModalVisible8] = useState(false);
  const [isMidfielderModalVisible9, setIsMidfielderModalVisible9] = useState(false);
  const [isMidfielderModalVisible10, setIsMidfielderModalVisible10] = useState(false);
  const [isMidfielderModalVisible11, setIsMidfielderModalVisible11] = useState(false);
  const [isMidfielderModalVisible12, setIsMidfielderModalVisible12] = useState(false);
  const [isMidfielderModalVisible13, setIsMidfielderModalVisible13] = useState(false);
  const [isMidfielderModalVisible14, setIsMidfielderModalVisible14] = useState(false);
  const [isMidfielderModalVisible15, setIsMidfielderModalVisible15] = useState(false);
  const [isMidfielderModalVisible16, setIsMidfielderModalVisible16] = useState(false);
  const [isMidfielderModalVisible17, setIsMidfielderModalVisible17] = useState(false);
  const [isMidfielderModalVisible18, setIsMidfielderModalVisible18] = useState(false);
  const [isMidfielderModalVisible19, setIsMidfielderModalVisible19] = useState(false);
  const [isMidfielderModalVisible20, setIsMidfielderModalVisible20] = useState(false);
  const [isMidfielderModalVisible21, setIsMidfielderModalVisible21] = useState(false);
  const [isMidfielderModalVisible22, setIsMidfielderModalVisible22] = useState(false);
  const [isMidfielderModalVisible23, setIsMidfielderModalVisible23] = useState(false);
  const [isMidfielderModalVisible24, setIsMidfielderModalVisible24] = useState(false);
  const [isMidfielderModalVisible25, setIsMidfielderModalVisible25] = useState(false);
  const [isMidfielderModalVisible26, setIsMidfielderModalVisible26] = useState(false);
  const [isMidfielderModalVisible27, setIsMidfielderModalVisible27] = useState(false);
  const [isMidfielderModalVisible28, setIsMidfielderModalVisible28] = useState(false);
  const [isMidfielderModalVisible29, setIsMidfielderModalVisible29] = useState(false);
  const [isMidfielderModalVisible30, setIsMidfielderModalVisible30] = useState(false);
  const [isMidfielderModalVisible31, setIsMidfielderModalVisible31] = useState(false);
  const [isMidfielderModalVisible32, setIsMidfielderModalVisible32] = useState(false);
  
  const [isDefenderModalVisible1, setIsDefenderModalVisible1] = useState(false);
  const [isDefenderModalVisible2, setIsDefenderModalVisible2] = useState(false);
  const [isDefenderModalVisible3, setIsDefenderModalVisible3] = useState(false);
  const [isDefenderModalVisible4, setIsDefenderModalVisible4] = useState(false);
  const [isDefenderModalVisible5, setIsDefenderModalVisible5] = useState(false);
  const [isDefenderModalVisible6, setIsDefenderModalVisible6] = useState(false);
  const [isDefenderModalVisible7, setIsDefenderModalVisible7] = useState(false);
  const [isDefenderModalVisible8, setIsDefenderModalVisible8] = useState(false);
  const [isDefenderModalVisible9, setIsDefenderModalVisible9] = useState(false);
  const [isDefenderModalVisible10, setIsDefenderModalVisible10] = useState(false);
  const [isDefenderModalVisible11, setIsDefenderModalVisible11] = useState(false);
  const [isDefenderModalVisible12, setIsDefenderModalVisible12] = useState(false);
  const [isDefenderModalVisible13, setIsDefenderModalVisible13] = useState(false);
  const [isDefenderModalVisible14, setIsDefenderModalVisible14] = useState(false);
  const [isDefenderModalVisible15, setIsDefenderModalVisible15] = useState(false);
  const [isDefenderModalVisible16, setIsDefenderModalVisible16] = useState(false);
  const [isDefenderModalVisible17, setIsDefenderModalVisible17] = useState(false);
  const [isDefenderModalVisible18, setIsDefenderModalVisible18] = useState(false);
  const [isDefenderModalVisible19, setIsDefenderModalVisible19] = useState(false);
  const [isDefenderModalVisible20, setIsDefenderModalVisible20] = useState(false);
  const [isDefenderModalVisible21, setIsDefenderModalVisible21] = useState(false);
  const [isDefenderModalVisible22, setIsDefenderModalVisible22] = useState(false);
  const [isDefenderModalVisible23, setIsDefenderModalVisible23] = useState(false);
  const [isDefenderModalVisible24, setIsDefenderModalVisible24] = useState(false);
  const [isDefenderModalVisible25, setIsDefenderModalVisible25] = useState(false);
  
  const [isGKModalVisible1, setIsGKModalVisible1] = useState(false);
  const [isGKModalVisible2, setIsGKModalVisible2] = useState(false);
  const [isGKModalVisible3, setIsGKModalVisible3] = useState(false);
  const [isGKModalVisible4, setIsGKModalVisible4] = useState(false);
  const [isGKModalVisible5, setIsGKModalVisible5] = useState(false);
  const [isGKModalVisible6, setIsGKModalVisible6] = useState(false);
  const [isGKModalVisible7, setIsGKModalVisible7] = useState(false);
  const [isGKModalVisible8, setIsGKModalVisible8] = useState(false);
  const [isGKModalVisible9, setIsGKModalVisible9] = useState(false);
  const [isGKModalVisible10, setIsGKModalVisible10] = useState(false);
  const [isGKModalVisible11, setIsGKModalVisible11] = useState(false);
  
  const [currentValue, setCurrentValue] = useState(1);
  const onChange = (value, index) => {
    setMainFormationValue(value);
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



  const { mutate: RegisterTacticMutate } = useMutation(RegisterTactic, {
    onSuccess: (data) => {
      console.log("성공", data);
      // 성공 시 필요한 처리 추가
      Alert.alert("전술이 등록되었습니다");
      
    },
    onError: (error) => {
      console.error("에러", error);
      // 에러 시 필요한 처리 추가
      Alert.alert("등록 실패");
    },
  });



  const handleTacticRegister = () => {
      RegisterTacticMutate({
        tacticName : TacticNameValue, 
        mainFormation : MainFormationValue, 
        tacticDetails : TacticDetailsValue,
        attackDetails : AttackDetailsValue, 
        defenseDetails : DefenseDetailsValue, 
        positionDetails : PositionDetailsValue
      });
  };

  const [TacticNameValue, setTacticNameValue] = useState("");
  const [MainFormationValue, setMainFormationValue] = useState("");
  const [TacticDetailsValue, setTacticDetailsValue] = useState("");
  const [AttackDetailsValue, setAttackDetailsValue] = useState("");
  const [DefenseDetailsValue, setDefenseDetailsValue] = useState("");
  const [PositionDetailsValue, setPositionDetailsValue] = useState("");


  return (
    <Container>
      <ViewForTextBar>
        <TaticsName
          placeholder={TacticsNameplaceholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value = {TacticNameValue}
          onChangeText = {setTacticNameValue}
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
          <Modal // 공격수 모달
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
                    editable
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
  onPress={() => {
    setIsAttackerModalVisible1(false);
    setPositionDetailsValue([...PositionDetailsValue, {
      position: DetailPositionplaceholder,
      positionDescription: DetailTacticsplaceholder
    }]);
    setDetailPositionplaceholder("");
    setDetailTacticsplaceholder("");
  }}
>
  <TextForOutButton>확인</TextForOutButton>
</TouchForOutButton>
                </ViewforModalOutButton>
              </ModalView>
            </ContainerModalView>
          </Modal>
          <Modal // 미드필더 모달
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
                    editable
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
                    onPress={() => setIsMidfielderModalVisible1(false)}
                  >
                    <TextForOutButton>확인</TextForOutButton>
                  </TouchForOutButton>
                </ViewforModalOutButton>
              </ModalView>
            </ContainerModalView>
          </Modal>
          <Modal // 수비수 모달
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
                    editable
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
                    onPress={() => setIsDefenderModalVisible1(false)}
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
                    onPress={() => setIsGKModalVisible2(false)}
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
                  onPress={() => setIsAttackerModalVisible1(true)}
                ></Forward>
                <Forward
                  style={{ marginTop: 70 }}
                  onPress={() => setIsAttackerModalVisible2(true)}
                ></Forward>
              </ViewForForward>
              <ViewForMidfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible1(true)}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible2(true)}
                  style={{ marginTop: 25 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible3(true)}
                  style={{ marginTop: 25 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible4(true)}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  onPress={() => setIsDefenderModalVisible1(true)}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible2(true)}
                  style={{ marginTop: 25 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible3(true)}
                  style={{ marginTop: 25 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible4(true)}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper
                  onPress={() => setIsGKModalVisible1(true)}
                  style={{ marginTop: 25 }}
                ></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 2 && (
            <TestView>
              <ViewForForward style={{ justifyContent: "space-around" }}>
                <Forward
                  onPress={() => setIsAttackerModalVisible3(true)}
                  style={{ marginTop: 80 }}
                ></Forward>
                <Forward
                  onPress={() => setIsAttackerModalVisible4(true)}
                  style={{ marginBottom: 60 }}
                ></Forward>
                <Forward
                  onPress={() => setIsAttackerModalVisible5(true)}
                  style={{ marginTop: 80 }}
                ></Forward>
              </ViewForForward>
              <ViewForMidfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible5(true)}
                  style={{ marginLeft: 45 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible6(true)}
                  style={{ marginTop: 50 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible7(true)}
                  style={{ marginRight: 45 }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  onPress={() => setIsDefenderModalVisible5(true)}
                  style={{ marginTop: 15 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible6(true)}
                  style={{ marginTop: 35 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible7(true)}
                  style={{ marginTop: 35 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible8(true)}
                  style={{ marginTop: 15 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper
                  onPress={() => setIsGKModalVisible2(true)}
                  style={{ marginTop: 30 }}
                ></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 3 && (
            <TestView>
              <ViewForForward>
                <Forward
                  onPress={() => setIsAttackerModalVisible6(true)}
                  style={{ marginBottom: 60 }}
                ></Forward>
              </ViewForForward>
              <SecondViewForMidfielder style={{ height: "20%" }}>
                <Midfielder
                  style={{ marginBottom: 20, marginLeft: 60 }}
                  onPress={() => setIsMidfielderModalVisible8(true)}
                ></Midfielder>
                <Midfielder
                  style={{ marginBottom: 20, marginRight: 60 }}
                  onPress={() => setIsMidfielderModalVisible9(true)}
                ></Midfielder>
              </SecondViewForMidfielder>
              <ViewForMidfielder style={{ height: "20%" }}>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible10(true)}
                  style={{ marginLeft: 15 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible11(true)}
                  style={{}}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible12(true)}
                  style={{ marginRight: 15 }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  onPress={() => setIsDefenderModalVisible9(true)}
                  style={{ marginTop: 30 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible10(true)}
                  style={{ marginTop: 50 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible11(true)}
                  style={{ marginTop: 50 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible12(true)}
                  style={{ marginTop: 30 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper
                  onPress={() => setIsGKModalVisible3(true)}
                  style={{ marginTop: 25 }}
                ></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 4 && (
            <TestView>
              <ViewForForward>
                <Forward
                  onPress={() => setIsAttackerModalVisible7(true)}
                  style={{ marginBottom: 60 }}
                ></Forward>
              </ViewForForward>
              <SecondViewForMidfielder style={{ height: "20%" }}>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible13(true)}
                  style={{ marginBottom: 10, marginLeft: 5 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible14(true)}
                  style={{ marginBottom: 10 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible15(true)}
                  style={{ marginBottom: 10, marginRight: 5 }}
                ></Midfielder>
              </SecondViewForMidfielder>
              <ViewForMidfielder style={{ height: "20%" }}>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible16(true)}
                  style={{ marginLeft: 55 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible17(true)}
                  style={{ marginRight: 55 }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  onPress={() => setIsDefenderModalVisible13(true)}
                  style={{ marginTop: 15 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible14(true)}
                  style={{ marginTop: 35 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible15(true)}
                  style={{ marginTop: 35 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible16(true)}
                  style={{ marginTop: 15 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper
                  onPress={() => setIsGKModalVisible4(true)}
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
                  onPress={() => setIsAttackerModalVisible8(true)}
                ></Forward>
                <Forward
                  onPress={() => setIsAttackerModalVisible9(true)}
                  style={{ marginTop: 20 }}
                ></Forward>
                <Forward
                  style={{ marginTop: 80 }}
                  onPress={() => setIsAttackerModalVisible10(true)}
                ></Forward>
              </ViewForForward>
              <ViewForMidfielder>
                <Midfielder
                  style={{ marginTop: 25 }}
                  onPress={() => setIsMidfielderModalVisible18(true)}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible19(true)}
                  style={{ marginTop: 45 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible20(true)}
                  style={{ marginTop: 45 }}
                ></Midfielder>
                <Midfielder
                  style={{ marginTop: 25 }}
                  onPress={() => setIsMidfielderModalVisible21(true)}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  onPress={() => setIsDefenderModalVisible17(true)}
                  style={{ marginLeft: 25, marginBottom: 15 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible18(true)}
                  style={{}}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible19(true)}
                  style={{ marginRight: 25, marginBottom: 15 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper
                  onPress={() => setIsGKModalVisible5(true)}
                  style={{ marginTop: 25 }}
                ></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 6 && (
            <TestView>
              <ViewForForward>
                <Forward
                  onPress={() => setIsAttackerModalVisible11(true)}
                ></Forward>
                <Forward
                  onPress={() => setIsAttackerModalVisible12(true)}
                ></Forward>
              </ViewForForward>
              <SecondViewForMidfielder
                style={{ justifyContent: "space-between", height: "20%" }}
              >
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible22(true)}
                  style={{ marginLeft: 20, marginTop: 70 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible23(true)}
                  style={{ marginTop: 10 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible24(true)}
                  style={{ marginRight: 20, marginTop: 70 }}
                ></Midfielder>
              </SecondViewForMidfielder>
              <ViewForMidfielder style={{ height: "20%" }}>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible25(true)}
                  style={{ marginLeft: 60 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible26(true)}
                  style={{ marginRight: 60 }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  onPress={() => setIsDefenderModalVisible20(true)}
                  style={{ marginLeft: 25, marginBottom: 15 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible21(true)}
                  style={{}}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible22(true)}
                  style={{ marginRight: 25, marginBottom: 15 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper
                  onPress={() => setIsGKModalVisible6(true)}
                  style={{ marginTop: 25 }}
                ></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 7 && (
            <TestView>
              <ViewForForward>
                <Forward
                  onPress={() => setIsAttackerModalVisible13(true)}
                  style={{ marginBottom: 60 }}
                ></Forward>
              </ViewForForward>
              <SecondViewForMidfielder style={{ height: "20%" }}>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible27(true)}
                  style={{ marginBottom: 15 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible28(true)}
                  style={{ marginBottom: 15 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible29(true)}
                  style={{ marginBottom: 15 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible30(true)}
                  style={{ marginBottom: 15 }}
                ></Midfielder>
              </SecondViewForMidfielder>
              <ViewForMidfielder style={{ height: "20%" }}>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible31(true)}
                  style={{ marginLeft: 75 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible32(true)}
                  style={{ marginRight: 75 }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  onPress={() => setIsDefenderModalVisible23(true)}
                  style={{ marginLeft: 25, marginBottom: 15 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible24(true)}
                  style={{ marginTop: 15 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible25(true)}
                  style={{ marginRight: 25, marginBottom: 15 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper
                  onPress={() => setIsGKModalVisible7(true)}
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
        <RegisterButton onPress={handleTacticRegister}>
          <RegisterText>등록</RegisterText>
        </RegisterButton>
      </RegisterButtonView>
    </Container>
  );
};

export default NewTactic;