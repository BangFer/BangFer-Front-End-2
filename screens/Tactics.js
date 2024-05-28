import React from "react";
import { StatusBar } from "expo-status-bar"; 
import { Ionicons } from '@expo/vector-icons';
import {NavigationContainer} from '@react-navigation/native';
import styled from "styled-components";
import { FontAwesome6 } from '@expo/vector-icons';
import { MenuProvider } from 'react-native-popup-menu';
import { FlatList } from "react-native";


export const App = () => (
  <MenuProvider>
    <YourApp />
  </MenuProvider>
);

// somewhere in your app
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';


const Container = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: #F5F5F5
`;


const FirstView = styled.View`
  padding: 1px;
`;

const SecondView = styled.View`
  height: 1px;
  background-color: black;
  margin-vertical: 10px;
  margin-horizontal: 10px;
`;

const HitsRankButton = styled.TouchableOpacity`
padding: 5px 5px; /* 버튼 내부 패딩 설정 */
border-radius: 5px; /* 둥근 사각형 테두리 반지름 설정 */
background-color: tomato; /* 배경색 설정 */
margin-left: 10px; /* 각 버튼 사이의 간격을 설정합니다. */
`;

const ThumbsRankButton = styled.TouchableOpacity`
padding: 5px 5px; /* 버튼 내부 패딩 설정 */
border-radius: 5px; /* 둥근 사각형 테두리 반지름 설정 */
background-color: tomato; /* 배경색 설정 */ 
margin-left: 10px; /* 각 버튼 사이의 간격을 설정합니다. */
`;

const CommentsRankButton = styled.TouchableOpacity`
padding: 5px 5px; /* 버튼 내부 패딩 설정 */
border-radius: 5px; /* 둥근 사각형 테두리 반지름 설정 */
background-color: tomato; /* 배경색 설정 */
margin-left: 10px; /* 각 버튼 사이의 간격을 설정합니다. */
`;
const FormationButton = styled.View`
padding: 5px 5px; /* 버튼 내부 패딩 설정 */
border-radius: 5px; /* 둥근 사각형 테두리 반지름 설정 */
background-color: tomato; /* 배경색 설정 */
margin-left: 10px; /* 각 버튼 사이의 간격을 설정합니다. */
`;

const IconAndButtonsInFirstView = styled.View`
flex-direction: row;
align-items: center;
justify-content: flex-end;
margin-top: 10px;
margin-right: 10px;
`
const RankIconInFirstView = styled.View`
flex-direction: row;
margin-top: 5px;
margin-right: 85px;
`
const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: black;
`;

const Line = styled.View`
  flex: 1;
  height: 1px; /* 직선의 높이를 설정합니다. */
  background-color: black; /* 검은색으로 설정합니다. */
  margin-horizontal: 5px; /* 양 끝에 5px의 여백을 추가합니다. */
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
  font-size: 18px;
  font-weight: bold;
`;

const ItemText = styled.Text`
  font-size: 16px;
  margin-right: 10px;
`;

const ItemIcon = styled(Ionicons)`
  margin-top: 2px;
  margin-right: 2px;
`;

const InformationView = styled.View`
flex-direction: row;
align-items: center;
justify-content: flex-start;
`


const Tactics = ({ navigation }) => {

  const data = [
    { id: '1', title: 'Title 1', description: 'Description 1', number: '1', formation: '4-4-2', name: '고민영' },
    { id: '2', title: 'Title 2', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '3', title: 'Title 3', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '4', title: 'Title 4', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '5', title: 'Title 5', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '6', title: 'Title 6', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '7', title: 'Title 7', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '8', title: 'Title 8', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '9', title: 'Title 9', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '10', title: 'Title 10', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '11', title: 'Title 11', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '12', title: 'Title 12', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '13', title: 'Title 13', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
  
  ];

  const renderItem = ({ item }) => (
    <ListItem
      title={item.title}
      description={item.description}
      number={item.number}
      formation={item.formation}
      name={item.name}
      navigation={navigation}
    />
  );
  return (
    <Container>
      <StatusBar style="auto" />
      
      <FirstView>

        <IconAndButtonsInFirstView>
        <RankIconInFirstView>
          <FontAwesome6 name="ranking-star" size={24} color="tomato" />
        
        </RankIconInFirstView>
          <HitsRankButton onPress={() => console.log('hitrank')}>
            <ButtonText>조회순</ButtonText>
          </HitsRankButton>
          
          <ThumbsRankButton onPress={() => console.log('thumbrank')}>
            <ButtonText>따봉순</ButtonText>
          </ThumbsRankButton>
          
          <CommentsRankButton onPress={() => console.log('commentsrank')}>
            <ButtonText>댓글순</ButtonText>
          </CommentsRankButton>

        <Menu>
          <MenuTrigger>
            <FormationButton>
              <ButtonText>포메이션</ButtonText>
            </FormationButton>
          </MenuTrigger>
            <MenuOptions>
            <MenuOption onPress={() => console.log('4-4-2')} text='4-4-2' />
            <MenuOption onPress={() => console.log('4-3-3')} text='4-3-3' />
            <MenuOption onPress={() => console.log('4-3-2-1')} text='4-3-2-1' />
            <MenuOption onPress={() => console.log('4-2-3-1')} text='4-2-3-1' />
            <MenuOption onPress={() => console.log('3-4-3')} text='3-4-3' />
            <MenuOption onPress={() => console.log('3-5-2')} text='3-5-2' />
            <MenuOption onPress={() => console.log('3-2-4-1')} text='3-2-4-1' />
            </MenuOptions>
          </Menu>
        </IconAndButtonsInFirstView>
      </FirstView>

      <SecondView>
      <Line />
      </SecondView>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </Container>
  );
};

const ListItem = ({ title, description, number, formation, name, navigation}) => (
  <ItemContainer onPress={() => navigation.navigate('TacticExample')}>
    <ItemContent>
      <ItemTitle>{title}</ItemTitle>
      <ItemText>{description}</ItemText>
      <InformationView>
        <ItemIcon name={"chatbubble-outline"} size={14} color="blue" />
        <ItemText>{number}</ItemText>
        <ItemText>{formation}</ItemText>
        <ItemText>{name}</ItemText>
      </InformationView>
    </ItemContent>
    <LineForList />
  </ItemContainer>
);

export default Tactics;