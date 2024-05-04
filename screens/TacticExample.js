import React, { useState } from "react";
import {ScrollView } from "react-native";
import styled from 'styled-components';
import Entypo from '@expo/vector-icons/Entypo';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import ProfileImg from '../assets/profileimg.jpg'


const Container = styled.View`
  flex: 1;
  padding: 10px;
  background-color: #FFFFFF;
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

  return (
    <Container>
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
      <Line />
      <ThirdView>
        <ScrollView>
          <ListItem username="고민영"  description="헉 ㄷㄷ"  number="4"/>
          <ListItem username="고민영"  description="헉 ㄷㄷ 헉 ㄷㄷ"  number="4"/>
          <ListItem username="고민영"  description="헉 ㄷㄷ 헉 ㄷㄷ 헉 ㄷㄷ"  number="4"/>
          <ListItem username="고민영"  description="헉 ㄷㄷ 헉 ㄷㄷ"  number="4"/>
          <ListItem username="고민영"  description="헉 ㄷㄷㄷㄷㄷㄷㄷ"  number="4"/>
          <ListItem username="고민영"  description="헉 ㄷㄷㄷㄷㄷㄷㄷ"  number="4"/>
        
        </ScrollView>
      </ThirdView>

      <SearchView>
        <SearchInput
          placeholder="댓글을 입력하세요"
          value={searchText}
          onChangeText={setSearchText}
        />
        <CancelButton onPress={() => navigation.goBack()}>
        <Entypo name="triangle-right" size={24} color="tomato" />
        </CancelButton>
      </SearchView>


    </Container>
  )
};

const ListItem = ({ username, description, number}) => (
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