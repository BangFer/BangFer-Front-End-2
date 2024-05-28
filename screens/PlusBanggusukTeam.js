import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import styled from "styled-components";
import DropDownPicker from "react-native-dropdown-picker";
import TacticsBack from "../assets/TacticsBack.png";
import { FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from "react-native-picker-select";
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

const DATA = [
  {
    id: "1",
    title: "오우석",
  },
  {
    id: "2",
    title: "오우석",
  },
  {
    id: "3",
    title: "김민우",
  },
  {
    id: "4",
    title: "김종우",
  },
  {
    id: "5",
    title: "고민영",
  },
  {
    id: "6",
    title: "김근식",
  },
  {
    id: "7",
    title: "김현우",
  },
  {
    id: "8",
    title: "김근식",
  },
  {
    id: "9",
    title: "김근식",
  },
  {
    id: "10",
    title: "김근식",
  },
];

const PlusBanggusukTeam = ({ navigation }) => {
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

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        nestedScrollEnabled={true}
      >
        <ViewForTextBar>
          <TaticsName
            placeholder={TacticsNameplaceholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <DirectorName
            placeholder={DirectorNameplaceholder}
            onFocus={handleFocus2}
            onBlur={handleBlur2}
          ></DirectorName>
        </ViewForTextBar>
        <ViewForTacticBoard>
          <ViewForDropdown>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              placeholder="내 전술"
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
              visible={isAttackerModalVisible}
              transparent={true}
            >
              <ContainerModalView
                onPress={() => setIsAttackerModalVisible(false)}
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
            {currentValue === 1 && (
              <TestView>
                <ViewForForward>
                  <Forward
                    style={{ marginTop: 70 }}
                    onPress={() => setIsAttackerModalVisible(true)}
                  ></Forward>
                  <Forward
                    style={{ marginTop: 70 }}
                    onPress={() => setIsAttackerModalVisible(true)}
                  ></Forward>
                </ViewForForward>
                <ViewForMidfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                  ></Midfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginTop: 25 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginTop: 25 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                  ></Midfielder>
                </ViewForMidfielder>
                <ViewForDefender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                  ></Defender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginTop: 25 }}
                  ></Defender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginTop: 25 }}
                  ></Defender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                  ></Defender>
                </ViewForDefender>
                <ViewForGoalkeeper>
                  <Goalkeeper
                    onPress={() => setIsGKModalVisible(true)}
                    style={{ marginTop: 25 }}
                  ></Goalkeeper>
                </ViewForGoalkeeper>
              </TestView>
            )}
            {currentValue === 2 && (
              <TestView>
                <ViewForForward style={{ justifyContent: "space-around" }}>
                  <Forward
                    onPress={() => setIsAttackerModalVisible(true)}
                    style={{ marginTop: 80 }}
                  ></Forward>
                  <Forward
                    onPress={() => setIsAttackerModalVisible(true)}
                    style={{ marginBottom: 60 }}
                  ></Forward>
                  <Forward
                    onPress={() => setIsAttackerModalVisible(true)}
                    style={{ marginTop: 80 }}
                  ></Forward>
                </ViewForForward>
                <ViewForMidfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginLeft: 45 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginTop: 50 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginRight: 45 }}
                  ></Midfielder>
                </ViewForMidfielder>
                <ViewForDefender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginTop: 15 }}
                  ></Defender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginTop: 35 }}
                  ></Defender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginTop: 35 }}
                  ></Defender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginTop: 15 }}
                  ></Defender>
                </ViewForDefender>
                <ViewForGoalkeeper>
                  <Goalkeeper
                    onPress={() => setIsGKModalVisible(true)}
                    style={{ marginTop: 30 }}
                  ></Goalkeeper>
                </ViewForGoalkeeper>
              </TestView>
            )}
            {currentValue === 3 && (
              <TestView>
                <ViewForForward>
                  <Forward
                    onPress={() => setIsAttackerModalVisible(true)}
                    style={{ marginBottom: 60 }}
                  ></Forward>
                </ViewForForward>
                <SecondViewForMidfielder style={{ height: "20%" }}>
                  <Midfielder
                    style={{ marginBottom: 20, marginLeft: 60 }}
                    onPress={() => setIsMidfielderModalVisible(true)}
                  ></Midfielder>
                  <Midfielder
                    style={{ marginBottom: 20, marginRight: 60 }}
                    onPress={() => setIsMidfielderModalVisible(true)}
                  ></Midfielder>
                </SecondViewForMidfielder>
                <ViewForMidfielder style={{ height: "20%" }}>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginLeft: 15 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{}}
                  ></Midfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginRight: 15 }}
                  ></Midfielder>
                </ViewForMidfielder>
                <ViewForDefender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginTop: 30 }}
                  ></Defender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginTop: 50 }}
                  ></Defender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginTop: 50 }}
                  ></Defender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginTop: 30 }}
                  ></Defender>
                </ViewForDefender>
                <ViewForGoalkeeper>
                  <Goalkeeper
                    onPress={() => setIsGKModalVisible(true)}
                    style={{ marginTop: 25 }}
                  ></Goalkeeper>
                </ViewForGoalkeeper>
              </TestView>
            )}
            {currentValue === 4 && (
              <TestView>
                <ViewForForward>
                  <Forward
                    onPress={() => setIsAttackerModalVisible(true)}
                    style={{ marginBottom: 60 }}
                  ></Forward>
                </ViewForForward>
                <SecondViewForMidfielder style={{ height: "20%" }}>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginBottom: 10, marginLeft: 5 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginBottom: 10 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginBottom: 10, marginRight: 5 }}
                  ></Midfielder>
                </SecondViewForMidfielder>
                <ViewForMidfielder style={{ height: "20%" }}>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginLeft: 55 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginRight: 55 }}
                  ></Midfielder>
                </ViewForMidfielder>
                <ViewForDefender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginTop: 15 }}
                  ></Defender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginTop: 35 }}
                  ></Defender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginTop: 35 }}
                  ></Defender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginTop: 15 }}
                  ></Defender>
                </ViewForDefender>
                <ViewForGoalkeeper>
                  <Goalkeeper
                    onPress={() => setIsGKModalVisible(true)}
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
                    onPress={() => setIsAttackerModalVisible(true)}
                  ></Forward>
                  <Forward
                    onPress={() => setIsAttackerModalVisible(true)}
                    style={{ marginTop: 20 }}
                  ></Forward>
                  <Forward
                    style={{ marginTop: 80 }}
                    onPress={() => setIsAttackerModalVisible(true)}
                  ></Forward>
                </ViewForForward>
                <ViewForMidfielder>
                  <Midfielder
                    style={{ marginTop: 25 }}
                    onPress={() => setIsMidfielderModalVisible(true)}
                  ></Midfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginTop: 45 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginTop: 45 }}
                  ></Midfielder>
                  <Midfielder
                    style={{ marginTop: 25 }}
                    onPress={() => setIsMidfielderModalVisible(true)}
                  ></Midfielder>
                </ViewForMidfielder>
                <ViewForDefender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginLeft: 25, marginBottom: 15 }}
                  ></Defender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{}}
                  ></Defender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginRight: 25, marginBottom: 15 }}
                  ></Defender>
                </ViewForDefender>
                <ViewForGoalkeeper>
                  <Goalkeeper
                    onPress={() => setIsGKModalVisible(true)}
                    style={{ marginTop: 25 }}
                  ></Goalkeeper>
                </ViewForGoalkeeper>
              </TestView>
            )}
            {currentValue === 6 && (
              <TestView>
                <ViewForForward>
                  <Forward
                    onPress={() => setIsAttackerModalVisible(true)}
                  ></Forward>
                  <Forward
                    onPress={() => setIsAttackerModalVisible(true)}
                  ></Forward>
                </ViewForForward>
                <SecondViewForMidfielder
                  style={{ justifyContent: "space-between", height: "20%" }}
                >
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginLeft: 20, marginTop: 70 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginTop: 10 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginRight: 20, marginTop: 70 }}
                  ></Midfielder>
                </SecondViewForMidfielder>
                <ViewForMidfielder style={{ height: "20%" }}>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginLeft: 60 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginRight: 60 }}
                  ></Midfielder>
                </ViewForMidfielder>
                <ViewForDefender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginLeft: 25, marginBottom: 15 }}
                  ></Defender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{}}
                  ></Defender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginRight: 25, marginBottom: 15 }}
                  ></Defender>
                </ViewForDefender>
                <ViewForGoalkeeper>
                  <Goalkeeper
                    onPress={() => setIsGKModalVisible(true)}
                    style={{ marginTop: 25 }}
                  ></Goalkeeper>
                </ViewForGoalkeeper>
              </TestView>
            )}
            {currentValue === 7 && (
              <TestView>
                <ViewForForward>
                  <Forward
                    onPress={() => setIsAttackerModalVisible(true)}
                    style={{ marginBottom: 60 }}
                  ></Forward>
                </ViewForForward>
                <SecondViewForMidfielder style={{ height: "20%" }}>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginBottom: 15 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginBottom: 15 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginBottom: 15 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginBottom: 15 }}
                  ></Midfielder>
                </SecondViewForMidfielder>
                <ViewForMidfielder style={{ height: "20%" }}>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginLeft: 75 }}
                  ></Midfielder>
                  <Midfielder
                    onPress={() => setIsMidfielderModalVisible(true)}
                    style={{ marginRight: 75 }}
                  ></Midfielder>
                </ViewForMidfielder>
                <ViewForDefender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginLeft: 25, marginBottom: 15 }}
                  ></Defender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginTop: 15 }}
                  ></Defender>
                  <Defender
                    onPress={() => setIsDefenderModalVisible(true)}
                    style={{ marginRight: 25, marginBottom: 15 }}
                  ></Defender>
                </ViewForDefender>
                <ViewForGoalkeeper>
                  <Goalkeeper
                    onPress={() => setIsGKModalVisible(true)}
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
        <ViewForListPlayers>
          <ViewForListPlayersReal>
            <ViewForListPlayersTitle>
              <TextForListPlayersTitle>선수 목록</TextForListPlayersTitle>
              <TouchForPlusPlayer>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  팀원 추가+
                </Text>
              </TouchForPlusPlayer>
            </ViewForListPlayersTitle>
            <ViewForFlatList>
              <FlatList
                data={DATA}
                renderItem={({ item }) => <Item title={item.title} />}
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
        <View style={{ width: "100%", height: 30 }}></View>
      </ScrollView>
    </Container>
  );
};

export default PlusBanggusukTeam;
