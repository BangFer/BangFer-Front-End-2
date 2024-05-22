import React from 'react';
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';
import {NavigationContainer} from '@react-navigation/native';
import styled from "styled-components";
import { FontAwesome6 } from '@expo/vector-icons';
import { FlatList } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';


const Container = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: #F5F5F5;
`;

const FirstView = styled.View`
  padding: 1px;
`;

const SecondView = styled.View`
  height: 1px;
  background-color: black;
  margin-vertical: 10px;
`;

const HitsRankButton = styled.TouchableOpacity`
  padding: 5px 5px;
  border-radius: 5px;
  background-color: blue;
  margin-left: 10px;
`;

const ThumbsRankButton = styled.TouchableOpacity`
  padding: 5px 5px;
  border-radius: 5px;
  background-color: blue;
  margin-left: 10px;
`;

const CommentsRankButton = styled.TouchableOpacity`
  padding: 5px 5px;
  border-radius: 5px;
  background-color: blue;
  margin-left: 10px;
`;

const IconAndButtonsInFirstView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-top: 10px;
  margin-right: 10px;
`;

const RankIconInFirstView = styled.View`
  flex-direction: row;
  margin-top: 5px;
  margin-right: 160px;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: white;
`;

const Line = styled.View`
  flex: 1;
  height: 1px;
  background-color: black;
`;

const LineForList = styled.View`
  flex: 1;
  height: 1px;
  background-color: black;
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
`;

const MyPosts = ({ navigation }) => {
  // 백엔드에서 받아온 데이터를 대체할 샘플 데이터
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
            <MaterialCommunityIcons name="order-bool-descending" size={26} color="blue" />
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
        </IconAndButtonsInFirstView>
      </FirstView>

      <SecondView>
        <Line /><Line />
      </SecondView>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </Container>
  );
};

const ListItem = ({ title, description, number, name, navigation }) => (
  <ItemContainer onPress={() => navigation.navigate('TacticExample')}>
    <ItemContent>
      <ItemTitle>{title}</ItemTitle>
      <ItemText>{description}</ItemText>
      <InformationView>
        <ItemIcon name={"chatbubble-outline"} size={14} color="blue" />
        <ItemText>{number}</ItemText>
        <ItemText>{name}</ItemText>
      </InformationView>
    </ItemContent>
    <LineForList />
  </ItemContainer>
);

export default MyPosts;