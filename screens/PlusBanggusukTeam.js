import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import styled from "styled-components";
import DropDownPicker from "react-native-dropdown-picker";
import TacticsBack from "../assets/TacticsBack.png";
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
  flex: 0.6;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ViewForTacticBoard = styled.View`
  flex: 5;
  margin-left: 20px;
  margin-right: 20px;
`;

const ViewForSlideTactic = styled.View`
  flex: 2;
`;

const ViewForDropdown = styled.View`
  flex: 1;
`;

const ViewForBoard = styled.View`
  flex: 8;
`;

const TestView = styled.View`
  flex: 1;
`;

const ViewForForward = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;
const ViewForMidfielder = styled.View`
  flex: 3;
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
`;

const SecondViewForMidfielder = styled.View`
  flex: 3;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const ViewForDefender = styled.View`
  flex: 3;
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
`;
const ViewForGoalkeeper = styled.View`
  flex: 1.5;
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
  margin-left: 20px;
  border-radius: 10px;
  padding-left: 10px;
  font-size: 17px;
  font-weight: bold;
`;

const DirectorName = styled.TextInput`
  height: 40px;
  width: 120px;
  border-width: 4px;
  margin-right: 20px;
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
const MainTacticBox = styled.View`
  border-radius: 15px;
  background-color: #ff6262;
  padding: 10px;
  height: 120px; /* 높이 조정 */
  width: ${Dimensions.get("window").width -
  40}px; /* 화면 너비에서 20px를 뺀 값 */
  margin-right: 10px; /* 각 박스 간격 조정 */
  margin-left: 20px;
`;

const SubTacticBox = styled.View`
  border-radius: 15px;
  background-color: #5182ff;
  padding: 10px;
  height: 120px; /* 높이 조정 */
  width: ${Dimensions.get("window").width -
  40}px; /* 화면 너비에서 20px를 뺀 값 */
  margin-right: 10px; /* 각 박스 간격 조정 */
`;

const MainTaticTextBox = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: white;
`;

const MainTacticTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
  color: white;
`;

const RegisterButtonView = styled.View`
  flex: 0.58;
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
  margin-right: 20px;
`;

const RegisterText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: black;
`;

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

  const [MainTacticText, setMainTacticText] = useState("");

  const handleChangeMainTacticText = (inputText) => {
    setMainTacticText(inputText);
  };

  const [SubTacticText, setSubTacticText] = useState("");

  const handleChangeSubTacticText = (inputText) => {
    setSubTacticText(inputText);
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
                  onPress={() => setIsAttackerModalVisible(true)}
                ></Forward>
                <Forward
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
                  style={{ marginBottom: 15 }}
                ></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 2 && (
            <TestView>
              <ViewForForward style={{ justifyContent: "space-around" }}>
                <Forward
                  onPress={() => setIsAttackerModalVisible(true)}
                ></Forward>
                <Forward
                  onPress={() => setIsAttackerModalVisible(true)}
                  style={{ marginBottom: 100 }}
                ></Forward>
                <Forward
                  onPress={() => setIsAttackerModalVisible(true)}
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
                  style={{ marginBottom: 15 }}
                ></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 3 && (
            <TestView>
              <ViewForForward>
                <Forward
                  onPress={() => setIsAttackerModalVisible(true)}
                  style={{ marginBottom: 70 }}
                ></Forward>
              </ViewForForward>
              <SecondViewForMidfielder>
                <Midfielder
                  style={{ marginBottom: 60, marginLeft: 50 }}
                  onPress={() => setIsMidfielderModalVisible(true)}
                ></Midfielder>
                <Midfielder
                  style={{ marginBottom: 60, marginRight: 50 }}
                  onPress={() => setIsMidfielderModalVisible(true)}
                ></Midfielder>
              </SecondViewForMidfielder>
              <ViewForMidfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                  style={{ marginLeft: 15, marginBottom: 50 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                  style={{ marginBottom: 50 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                  style={{ marginRight: 15, marginBottom: 50 }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  onPress={() => setIsDefenderModalVisible(true)}
                  style={{ marginBottom: 50 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible(true)}
                  style={{ marginBottom: 30 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible(true)}
                  style={{ marginBottom: 30 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible(true)}
                  style={{ marginBottom: 50 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper
                  onPress={() => setIsGKModalVisible(true)}
                  style={{ marginBottom: 30 }}
                ></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 4 && (
            <TestView>
              <ViewForForward>
                <Forward
                  onPress={() => setIsAttackerModalVisible(true)}
                  style={{ marginBottom: 70 }}
                ></Forward>
              </ViewForForward>
              <SecondViewForMidfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                  style={{ marginBottom: 50, marginLeft: 5 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                  style={{ marginBottom: 50 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                  style={{ marginBottom: 50, marginRight: 5 }}
                ></Midfielder>
              </SecondViewForMidfielder>
              <ViewForMidfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                  style={{ marginBottom: 40, marginLeft: 35 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                  style={{ marginBottom: 40, marginRight: 35 }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  onPress={() => setIsDefenderModalVisible(true)}
                  style={{ marginBottom: 50 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible(true)}
                  style={{ marginBottom: 30 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible(true)}
                  style={{ marginBottom: 30 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible(true)}
                  style={{ marginBottom: 50 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper
                  onPress={() => setIsGKModalVisible(true)}
                  style={{ marginBottom: 30 }}
                ></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 5 && (
            <TestView>
              <ViewForForward style={{ justifyContent: "space-around" }}>
                <Forward
                  onPress={() => setIsAttackerModalVisible(true)}
                ></Forward>
                <Forward
                  onPress={() => setIsAttackerModalVisible(true)}
                  style={{ marginBottom: 100 }}
                ></Forward>
                <Forward
                  onPress={() => setIsAttackerModalVisible(true)}
                ></Forward>
              </ViewForForward>
              <ViewForMidfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                  style={{ marginTop: 30 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                  style={{ marginTop: 30 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  onPress={() => setIsDefenderModalVisible(true)}
                  style={{ marginLeft: 25, marginBottom: 25 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible(true)}
                  style={{ marginBottom: 15 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible(true)}
                  style={{ marginRight: 25, marginBottom: 25 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper
                  onPress={() => setIsGKModalVisible(true)}
                  style={{ marginBottom: 15 }}
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
                style={{ justifyContent: "space-between" }}
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
              <ViewForMidfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                  style={{ marginBottom: 40, marginLeft: 50 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                  style={{ marginBottom: 40, marginRight: 50 }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  onPress={() => setIsDefenderModalVisible(true)}
                  style={{ marginBottom: 70, marginLeft: 25 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible(true)}
                  style={{ marginBottom: 60 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible(true)}
                  style={{ marginBottom: 70, marginRight: 25 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper
                  onPress={() => setIsGKModalVisible(true)}
                  style={{ marginBottom: 30 }}
                ></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 7 && (
            <TestView>
              <ViewForForward>
                <Forward
                  onPress={() => setIsAttackerModalVisible(true)}
                  style={{ marginBottom: 70 }}
                ></Forward>
              </ViewForForward>
              <SecondViewForMidfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                  style={{ marginBottom: 50 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                  style={{ marginBottom: 50 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                  style={{ marginBottom: 50 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                  style={{ marginBottom: 50 }}
                ></Midfielder>
              </SecondViewForMidfielder>
              <ViewForMidfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                  style={{ marginLeft: 75, marginBottom: 60 }}
                ></Midfielder>
                <Midfielder
                  onPress={() => setIsMidfielderModalVisible(true)}
                  style={{ marginRight: 75, marginBottom: 60 }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  onPress={() => setIsDefenderModalVisible(true)}
                  style={{ marginBottom: 80, marginLeft: 25 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible(true)}
                  style={{ marginBottom: 70 }}
                ></Defender>
                <Defender
                  onPress={() => setIsDefenderModalVisible(true)}
                  style={{ marginBottom: 80, marginRight: 25 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper
                  onPress={() => setIsGKModalVisible(true)}
                  style={{ marginBottom: 30 }}
                ></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
        </ViewForBoard>
      </ViewForTacticBoard>
      <ViewForSlideTactic>
        <ScrollView
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flex: 2 }}
        >
          <MainTacticBox>
            <MainTacticTitle>메인전술</MainTacticTitle>
            <MainTaticTextBox
              multiline={true}
              onChangeText={handleChangeMainTacticText}
              value={MainTacticText}
              placeholder="내용을 입력하세요..."
              textAlignVertical="top"
              style={{ paddingTop: 10 }}
              placeholderTextColor="white"
              autoFocus={false}
            ></MainTaticTextBox>
          </MainTacticBox>
          <SubTacticBox>
            <MainTacticTitle>세부전술</MainTacticTitle>
            <MainTaticTextBox
              multiline={true}
              onChangeText={handleChangeSubTacticText}
              value={SubTacticText}
              placeholder="내용을 입력하세요..."
              textAlignVertical="top"
              style={{ paddingTop: 10 }}
              placeholderTextColor="white"
              autoFocus={false}
            ></MainTaticTextBox>
          </SubTacticBox>
        </ScrollView>
        <RegisterButtonView>
          <RegisterButton onPress={() => navigation.navigate("BanggusukTeam")}>
            <RegisterText>등록</RegisterText>
          </RegisterButton>
        </RegisterButtonView>
      </ViewForSlideTactic>
    </Container>
  );
};

export default PlusBanggusukTeam;
