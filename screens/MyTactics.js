import React from "react";
import { StatusBar } from "expo-status-bar";
import {ScrollView } from "react-native";
 
import { Ionicons } from '@expo/vector-icons';
import {NavigationContainer} from '@react-navigation/native';
import styled from "styled-components";
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// your entry point
import { MenuProvider } from 'react-native-popup-menu';

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


const MyTactics = ({ navigation }) => {
  return (
    <Container>
      <StatusBar style="auto" />
      
      <FirstView>

        <IconAndButtonsInFirstView>
        <RankIconInFirstView>
        <MaterialCommunityIcons name="order-bool-descending" size={26} color="blue" />
        </RankIconInFirstView>
          
        <Menu>
          <MenuTrigger>
          <PublicPrivateButton onPress={() => console.log('commentsrank')}>
            <ButtonText>공/비공</ButtonText>
          </PublicPrivateButton>
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onPress={() => console.log('전체')} text='전체' />
            <MenuOption onPress={() => console.log('공개')} text='공개' />
            <MenuOption onPress={() => console.log('비공개')} text='비공개' />
            </MenuOptions>
          </Menu>

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
      <Line/><Line/>
      </SecondView>

      <ThirdView>
        <ScrollView>
          <ListItemPublic title="Title 1"  description="Description 1"  number="1" formation="4-4-2" name="고민영"/>
          <ListItemPublic title="Title 2"  description="Description 2"  number="2" formation="4-3-3" name="고민영"/>
          <ListItemPublic title="Title 3"  description="Description 3"  number="3" formation="3-5-2" name="고민영"/>
          <ListItemPublic title="Title 3"  description="Description 3"  number="3" formation="3-5-2" name="고민영"/>
          <ListItemPrivate title="Title 3"  description="Description 3"  number="3" formation="3-5-2" name="고민영"/>
          <ListItemPublic title="Title 3"  description="Description 3"  number="3" formation="3-5-2" name="고민영"/>
          <ListItemPublic title="Title 3"  description="Description 3"  number="3" formation="3-5-2" name="고민영"/>
          <ListItemPrivate title="Title 3"  description="Description 3"  number="3" formation="3-5-2" name="고민영"/>
          <ListItemPublic title="Title 3"  description="Description 3"  number="3" formation="3-5-2" name="고민영"/>
          <ListItemPrivate title="Title 3"  description="Description 3"  number="3" formation="3-5-2" name="고민영"/>
          <ListItemPublic title="Title 3"  description="Description 3"  number="3" formation="3-5-2" name="고민영"/>
          <ListItemPublic title="Title 3"  description="Description 3"  number="3" formation="3-5-2" name="고민영"/>
          <ListItemPrivate title="Title 3"  description="Description 3"  number="3" formation="3-5-2" name="고민영"/>
          <ListItemPublic title="Title 3"  description="Description 3"  number="3" formation="3-5-2" name="고민영"/>
          <ListItemPublic title="Title 3"  description="Description 3"  number="3" formation="3-5-2" name="고민영"/>
          <ListItemPublic title="Title Last"  description="Description 3"  number="3" formation="3-5-2" name="고민영"/>
        </ScrollView>
      </ThirdView>
    </Container>
  );
};

const ListItemPublic = ({ title, description, number, formation, name}) => (
  <ItemContainer onPress={() => console.log('Item pressed')}>
    <ItemContent>
      <ItemTitle>{title}</ItemTitle>
      <ItemText>{description}</ItemText>
      <InformationView>
        <ItemIcon name={"chatbubble-outline"} size={14} color="blue" />
        <ItemText>{number}</ItemText>
        <ItemText>{formation}</ItemText>
        <ItemText>{name}</ItemText>
      </InformationView>
      <LineForList />
    </ItemContent>
  </ItemContainer>
);

const ListItemPrivate = ({ title, description, number, formation, name}) => (
  <ItemContainer onPress={() => console.log('Item pressed')}>
    <ItemContent>
      <ItemTitle>{title}</ItemTitle>
      <ItemText>{description}</ItemText>
      <InformationView>
        <ItemText>비공개</ItemText>
        <ItemText>{number}</ItemText>
        <ItemText>{formation}</ItemText>
        <ItemText>{name}</ItemText>
      </InformationView>
      <LineForList />
    </ItemContent>
  </ItemContainer>
);

export default MyTactics;