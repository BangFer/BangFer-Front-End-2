import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import styled from "styled-components";
import DropDownPicker from "react-native-dropdown-picker";
import TacticsBack from "../assets/TacticsBack.png";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

const Container = styled.KeyboardAvoidingView`
  flex: 1;
  flex-direction: column;
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
const PlusBanggusukTeam = ({ navigation }) => {
  const [TacticsNameplaceholder, setTacticsNamePlaceholder] = useState("팀 명");
  const handleFocus = () => {
    setTacticsNamePlaceholder("");
  };
  const handleBlur = () => {
    setTacticsNamePlaceholder("팀 명");
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
    { label: "4-4-2", value: "1" },
    { label: "4-3-3", value: "2" },
    { label: "4-3-2-1", value: "3" },
    { label: "4-2-3-1", value: "4" },
    { label: "3-4-3", value: "5" },
    { label: "3-5-2", value: "6" },
    { label: "3-2-4-1", value: "7" },
  ]);

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
            placeholder="4-4-2"
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

          {currentValue === 1 && (
            <TestView>
              <ViewForForward>
                <Forward></Forward>
                <Forward></Forward>
              </ViewForForward>
              <ViewForMidfielder>
                <Midfielder></Midfielder>
                <Midfielder style={{ marginTop: 25 }}></Midfielder>
                <Midfielder style={{ marginTop: 25 }}></Midfielder>
                <Midfielder></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender></Defender>
                <Defender style={{ marginTop: 25 }}></Defender>
                <Defender style={{ marginTop: 25 }}></Defender>
                <Defender></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper style={{ marginBottom: 15 }}></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 2 && (
            <TestView>
              <ViewForForward style={{ justifyContent: "space-around" }}>
                <Forward></Forward>
                <Forward style={{ marginBottom: 100 }}></Forward>
                <Forward></Forward>
              </ViewForForward>
              <ViewForMidfielder>
                <Midfielder style={{ marginLeft: 45 }}></Midfielder>
                <Midfielder style={{ marginTop: 50 }}></Midfielder>
                <Midfielder style={{ marginRight: 45 }}></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender></Defender>
                <Defender style={{ marginTop: 25 }}></Defender>
                <Defender style={{ marginTop: 25 }}></Defender>
                <Defender></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper style={{ marginBottom: 15 }}></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 3 && (
            <TestView>
              <ViewForForward>
                <Forward style={{ marginBottom: 70 }}></Forward>
              </ViewForForward>
              <SecondViewForMidfielder>
                <Midfielder
                  style={{ marginBottom: 60, marginLeft: 50 }}
                ></Midfielder>
                <Midfielder
                  style={{ marginBottom: 60, marginRight: 50 }}
                ></Midfielder>
              </SecondViewForMidfielder>
              <ViewForMidfielder>
                <Midfielder
                  style={{ marginLeft: 15, marginBottom: 50 }}
                ></Midfielder>
                <Midfielder style={{ marginBottom: 50 }}></Midfielder>
                <Midfielder
                  style={{ marginRight: 15, marginBottom: 50 }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender style={{ marginBottom: 50 }}></Defender>
                <Defender style={{ marginBottom: 30 }}></Defender>
                <Defender style={{ marginBottom: 30 }}></Defender>
                <Defender style={{ marginBottom: 50 }}></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper style={{ marginBottom: 30 }}></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 4 && (
            <TestView>
              <ViewForForward>
                <Forward style={{ marginBottom: 70 }}></Forward>
              </ViewForForward>
              <SecondViewForMidfielder>
                <Midfielder
                  style={{ marginBottom: 50, marginLeft: 5 }}
                ></Midfielder>
                <Midfielder style={{ marginBottom: 50 }}></Midfielder>
                <Midfielder
                  style={{ marginBottom: 50, marginRight: 5 }}
                ></Midfielder>
              </SecondViewForMidfielder>
              <ViewForMidfielder>
                <Midfielder
                  style={{ marginBottom: 40, marginLeft: 35 }}
                ></Midfielder>
                <Midfielder
                  style={{ marginBottom: 40, marginRight: 35 }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender style={{ marginBottom: 50 }}></Defender>
                <Defender style={{ marginBottom: 30 }}></Defender>
                <Defender style={{ marginBottom: 30 }}></Defender>
                <Defender style={{ marginBottom: 50 }}></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper style={{ marginBottom: 30 }}></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 5 && (
            <TestView>
              <ViewForForward style={{ justifyContent: "space-around" }}>
                <Forward></Forward>
                <Forward style={{ marginBottom: 100 }}></Forward>
                <Forward></Forward>
              </ViewForForward>
              <ViewForMidfielder>
                <Midfielder style={{}}></Midfielder>
                <Midfielder style={{ marginTop: 30 }}></Midfielder>
                <Midfielder style={{ marginTop: 30 }}></Midfielder>
                <Midfielder style={{}}></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  style={{ marginLeft: 25, marginBottom: 25 }}
                ></Defender>
                <Defender style={{ marginBottom: 15 }}></Defender>
                <Defender
                  style={{ marginRight: 25, marginBottom: 25 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper style={{ marginBottom: 15 }}></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 6 && (
            <TestView>
              <ViewForForward>
                <Forward style={{}}></Forward>
                <Forward style={{}}></Forward>
              </ViewForForward>
              <SecondViewForMidfielder
                style={{ justifyContent: "space-between" }}
              >
                <Midfielder
                  style={{ marginLeft: 20, marginTop: 70 }}
                ></Midfielder>
                <Midfielder style={{ marginTop: 10 }}></Midfielder>
                <Midfielder
                  style={{ marginRight: 20, marginTop: 70 }}
                ></Midfielder>
              </SecondViewForMidfielder>
              <ViewForMidfielder>
                <Midfielder
                  style={{ marginBottom: 40, marginLeft: 50 }}
                ></Midfielder>
                <Midfielder
                  style={{ marginBottom: 40, marginRight: 50 }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  style={{ marginBottom: 70, marginLeft: 25 }}
                ></Defender>
                <Defender style={{ marginBottom: 60 }}></Defender>
                <Defender
                  style={{ marginBottom: 70, marginRight: 25 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper style={{ marginBottom: 30 }}></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
          {currentValue === 7 && (
            <TestView>
              <ViewForForward>
                <Forward style={{ marginBottom: 70 }}></Forward>
              </ViewForForward>
              <SecondViewForMidfielder>
                <Midfielder style={{ marginBottom: 50 }}></Midfielder>
                <Midfielder style={{ marginBottom: 50 }}></Midfielder>
                <Midfielder style={{ marginBottom: 50 }}></Midfielder>
                <Midfielder style={{ marginBottom: 50 }}></Midfielder>
              </SecondViewForMidfielder>
              <ViewForMidfielder>
                <Midfielder
                  style={{ marginLeft: 75, marginBottom: 60 }}
                ></Midfielder>
                <Midfielder
                  style={{ marginRight: 75, marginBottom: 60 }}
                ></Midfielder>
              </ViewForMidfielder>
              <ViewForDefender>
                <Defender
                  style={{ marginBottom: 80, marginLeft: 25 }}
                ></Defender>
                <Defender style={{ marginBottom: 70 }}></Defender>
                <Defender
                  style={{ marginBottom: 80, marginRight: 25 }}
                ></Defender>
              </ViewForDefender>
              <ViewForGoalkeeper>
                <Goalkeeper style={{ marginBottom: 30 }}></Goalkeeper>
              </ViewForGoalkeeper>
            </TestView>
          )}
        </ViewForBoard>
      </ViewForTacticBoard>
      <ViewForSlideTactic></ViewForSlideTactic>
    </Container>
  );
};

export default PlusBanggusukTeam;
