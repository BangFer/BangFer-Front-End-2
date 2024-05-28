import React, { useState } from "react";
import styled from 'styled-components';
import Entypo from '@expo/vector-icons/Entypo';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import ProfileImg from '../assets/profileimg.jpg'
import { FontAwesome5 } from '@expo/vector-icons';
import DropDownPicker from "react-native-dropdown-picker";
import TacticsBack from "../assets/TacticsBack.png";
import { FlatList } from "react-native";


import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  Keyboard,
  SafeAreaView,
  Platform,
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
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top : -60px;
`;

const ViewForTacticBoard = styled.View`
  flex: 3;
  margin-left: 20px;
  margin-right: 20px;
  margin-top : -65px;
`;

const ViewForDropdown = styled.View`
  flex: 1;
  margin-left: 3.5px;
  margin-right: 3.5px;
`;

const ViewForBoard = styled.View`
  flex: 8;
  margin-top: -20px;
  top : -10px;
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
  width: 165px;
  border-width: 4px;
  margin-left: 25px;
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

const TacticContainer = styled.View`
  flex : 1;
  margin-bottom: 10px;
  justifyContent: center;
   alignItems: center;
`;

const TacticBox = styled.View`
  border-radius: 15px;
  background-color: ${({ isMain }) => (isMain ? 'tomato' : 'blue')};
  padding: 10px;
  height: 150px; /* 높이 조정 */
  width: ${Dimensions.get('window').width - 50}px; /* 화면 너비에서 20px를 뺀 값 */
  position: relative;
  margin-top: -55px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
  color: white;
`;

const TextBox = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: white;
  placeholderTextColor: white; /* 흰색으로 placeholder 텍스트 색상 설정 */
`;

const ButtonContainer = styled.View`
  flex: 1;
  position: absolute;
  top: 750px;
  right: 25px;
  margin-top: 12.5px;
`;

const Button = styled.TouchableOpacity`
  background-color: black;
  border-radius: 10px;
  padding: 10px 20px;
`;
const ToggleButton = styled.TouchableOpacity`
  position: absolute; /* 절대 위치 설정 */
  top: 15px; /* 박스의 위쪽으로부터 10px */
  right: 15px; /* 박스의 오른쪽으로부터 10px */
`;


const FirstView = styled.View`
flex-direction: row;
align-items: center;
justify-content: flex-start;
padding-left: 15px; /* 맨 좌측 요소의 좌측 여백 설정 */
margin-vertical: 5px; /* 상하 여백 설정 */
`;

const SecondView = styled.View`
  height: 1px;
  background-color: black;
  margin-vertical: 10px;
`;

const ThirdView = styled.ScrollView`
  flex: 1;
`;

const SearchView = styled.View`
  flex-direction: row;
  align-items: center;
  border-radius: 10px; /* 둥근 외각선을 위한 속성 */
  border-width: 1px;
  border-color: #CCCCCC;
  padding: 5px 10px; /* 내부 여백 설정 */
  margin-top: 20px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  height: 30px;
  font-size: 14px;
`;

const CancelButton = styled.TouchableOpacity`
  position: absolute; /* 절대 위치 설정 */
  top: 10px; /* 위쪽 여백 설정 */
  right: 10px; /* 오른쪽 여백 설정 */
`;

const CancelButtonText = styled.Text``;


const SearchText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: gray;
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
`;


const ItemContainer = styled.TouchableOpacity`
  padding-horizontal: 10px;
`;

const ItemContent = styled.View`
  flex-direction: column;
  margin-left: 5px;
`;

const ItemTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-right: 5px;
`;

const ItemText = styled.Text`
  font-size: 16px;
  margin-right: 10px;
`;

const ThumbsUpNumber = styled.Text`
  font-size: 16px;
  margin-right: 10px;
  color: tomato;
  margin-right: 5px;
`;

const ChatBubbleNumber = styled.Text`
  font-size: 16px;
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
`

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
margin-right: 10px;
`
const ThumbsUpButton = styled.TouchableOpacity`
padding: 4px 4px; /* 버튼 내부 패딩 설정 */
border-radius: 5px; /* 둥근 사각형 테두리 반지름 설정 */
background-color: gray; /* 배경색 설정 */
margin-left: 10px; /* 각 버튼 사이의 간격을 설정합니다. */
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
  width: 50px; /* 이미지 컨테이너의 너비 */
  height: 50px; /* 이미지 컨테이너의 높이 */
  border-radius: 25px; /* 반지름을 너비 또는 높이의 절반으로 설정하여 원 모양으로 만듭니다. */
  overflow: hidden; /* 컨테이너 내부에서 벗어나는 이미지를 숨깁니다. */
`;

const StyledImage = styled.Image`
  width: 100%; /* 이미지의 너비를 100%로 설정하여 이미지 컨테이너에 맞춥니다. */
  height: 100%; /* 이미지의 높이를 100%로 설정하여 이미지 컨테이너에 맞춥니다. */
  resize-mode: cover; /* 이미지를 늘리거나 축소하여 이미지 컨테이너에 꽉 차도록 설정합니다. */
`;



const TacticExample = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    // 추후 검색 기능 구현
    console.log("검색어:", searchText);
  };

  const [TacticsNameplaceholder, setTacticsNamePlaceholder] = useState("전술명을 입력하세요");
  const [DetailTacticsplaceholder, setDetailTacticsplaceholder] = useState("");
  const [DetailPositionplaceholder, setDetailPositionplaceholder] =
    useState("");
  const handleFocus = () => {
    setTacticsNamePlaceholder("");
  };
  const handleBlur = () => {
    setTacticsNamePlaceholder("전술명을 입력하세요");
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
    { label: "4-4-2", value: "1" },
    { label: "4-3-3", value: "2" },
    { label: "4-3-2-1", value: "3" },
    { label: "4-2-3-1", value: "4" },
    { label: "3-4-3", value: "5" },
    { label: "3-5-2", value: "6" },
    { label: "3-2-4-1", value: "7" },
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
  
  const [isMainTactic, setIsMainTactic] = useState(true);
  const [mainText, setMainText] = useState('');
  const [subText, setSubText] = useState('');

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

  const renderItem = ({ item }) => {
    switch(item.type){
      case 'Tactic' :
        return(
          <TacticNameBoard/>
        );
      case 'Formation' :
        return(
          <FormationBoard/>
        );
      case 'CommentData' :
        return(
          <CommentData/>
        );
      case 'Comment':
        return(
          <CommentItem
            username={item.username}
            description={item.description}
            number={item.number}
          />
        );
      default:
        return null;
    }
  };

  const data = [
    { id: '1', type: 'Tactic'},
    { id: '2', type: 'Formation'},
    { id: '3', type: 'CommentData'},
    { id: '4', type: 'Comment', username: '고민영', description: '헉 ㄷㄷ', number: '3'},
    { id: '5', type: 'Comment', username: '김종우', description: '나 같은 경우에는', number: '3'},
    { id: '6', type: 'Comment', username: '오우석', description: '공감?유해진?', number: '2'},
    { id: '7', type: 'Comment', username: '김민우', description: '그만...', number: '1'},
    { id: '8', type: 'Comment', username: '김현우', description: '헉 ㄷㄷ', number: '1'},  
  ];

  return (
    <Container>
              <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </Container>
  )
};

const TacticNameBoard = ({}) => (
  <ViewForTextBar>
        <TacticName
          placeholder={TacticsNameplaceholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
  </ViewForTextBar>
);

const FormationBoard = ({}) => (
  <ViewForTacticBoard>
        <ViewForDropdown>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            placeholder="포메이션(Default)"
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
            pressableProps={{
              android_ripple: { color: "transparent" }, // Android ripple effect 제거
              style: { backgroundColor: "#000" }, // 기본 배경색 유지
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
);

const TacticBoxes = ({}) => (
<TacticContainer>
        <TacticBox isMain={isMainTactic}>
          <Title>{isMainTactic ? '메인전술' : '세부전술'}</Title>
          <TextBox
            multiline={true}
            onChangeText={isMainTactic ? handleChangeMainText : handleChangeSubText}
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
      </TacticContainer>
);

const CommentData = ({}) => (
  <FirstView>
  <ThumbsUpIcon name="thumbs-up" size={16} color="tomato" />
  <ThumbsUpNumber>6</ThumbsUpNumber>
  <ChatBubbleIcon name={"chatbubble-outline"} size={14} color="blue" />
  <ChatBubbleNumber>6</ChatBubbleNumber>
  <ThumbsUpButton onPress={() => console.log('thumbsup')}>
      <ButtonText>좋아요</ButtonText>
    </ThumbsUpButton>
    
    <TakeTacticButton onPress={() => console.log('taketactic')}>
      <ButtonText>가져가기</ButtonText>
    </TakeTacticButton>
  </FirstView>
);

const CommentItem = ({ username, description, number}) => (
  <ItemContainer>
    <ItemContent>
      <FirstLineView>
      <ImageContainer> 
          <StyledImage source={ProfileImg} />
        </ImageContainer>
      <OtherElements>
      <ItemTitle>{username}</ItemTitle>
      <ThumbsUpIcon name="thumbs-up" size={16} color="tomato" />
      <ThumbsUpNumber>{number}</ThumbsUpNumber>
      </OtherElements>
      </FirstLineView>

      <SecondLineView>
        <ItemText>{description}</ItemText>
        <ChatBubbleIcon name={"chatbubble-outline"} size={14} color="blue" />
        <ThumbsUpIcon name="thumbs-up" size={16} color="tomato" />
      </SecondLineView>
      <LineForList />
    </ItemContent>
  </ItemContainer>
);

export default TacticExample;