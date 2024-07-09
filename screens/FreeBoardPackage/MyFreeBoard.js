import React from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';
import {NavigationContainer} from '@react-navigation/native';
import styled from "styled-components";
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
  margin-top : 10px;
`;

const SecondView = styled.View`
  height: 1px;
  margin-vertical: 10px;
  margin-horizontal: 10px;
`;

const ThirdView = styled.ScrollView`
  flex: 1;
`;


const PublicPrivateButton = styled.View`
padding: 5px 5px; /* 버튼 내부 패딩 설정 */
border-radius: 5px; /* 둥근 사각형 테두리 반지름 설정 */
background-color: blue; /* 배경색 설정 */
margin-left: 10px; /* 각 버튼 사이의 간격을 설정합니다. */
`;
const FormationButton = styled.View`
padding: 5px 5px; /* 버튼 내부 패딩 설정 */
border-radius: 5px; /* 둥근 사각형 테두리 반지름 설정 */
background-color: blue; /* 배경색 설정 */
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
margin-right: 210px;
`
const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: white;
`;

const Line = styled.View`
  flex: 1;
  height: 1px; /* 직선의 높이를 설정합니다. */
  background-color: black; /* 검은색으로 설정합니다. */
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


const MyFreeBoard = ({ navigation }) => {
  
  const data = [
    { id: '1', type: 'Public', title: 'Title 1', description: 'Description 1', number: '1', formation: '4-4-2', name: '고민영' },
    { id: '2', type: 'Public', title: 'Title 2', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '3', type: 'Private', title: 'Title 3', description: 'Description 2', formation: '4-3-3', name: '고민영' },
    { id: '4', type: 'Public', title: 'Title 4', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '5', type: 'Private', title: 'Title 5', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '6', type: 'Private', title: 'Title 6', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '7', type: 'Private', title: 'Title 7', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '8', type: 'Private', title: 'Title 8', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '9', type: 'Public', title: 'Title 9', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '10', type: 'Public', title: 'Title 10', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '11', type: 'Public', title: 'Title 11', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '12', type: 'Private', title: 'Title 12', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
    { id: '13', type: 'Private', title: 'Title 13', description: 'Description 2', number: '2', formation: '4-3-3', name: '고민영' },
  
  ];

  const renderItem = ({ item }) => {
        return(
          <ListItem
            title={item.title}
            description={item.description}
            number={item.number}
            name={item.name}
            navigation={navigation}
          />
        );
    }
  

  return (
    <Container>
      <StatusBar style="auto" />



      <FirstView>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </FirstView>
    </Container>
  );
};

const ListItem = ({ title, description, number, name}) => (
  <ItemContainer onPress={() => console.log('Item pressed')}>
    <ItemContent>
      <ItemTitle>{title}</ItemTitle>
      <ItemText>{description}</ItemText>
      <InformationView>
        <ItemIcon name={"chatbubble-outline"} size={14} color="blue" />
        <ItemText>{number}</ItemText>
        <ItemText>{name}</ItemText>
      </InformationView>
      <LineForList />
    </ItemContent>
  </ItemContainer>
);

export default MyFreeBoard;