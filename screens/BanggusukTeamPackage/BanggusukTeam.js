import React from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import TacticsBack from "../../assets/TacticsBack.png";
import UserPlusBanggusukTeam from "./UserPlusBanggusukTeam";
import { MenuProvider } from "react-native-popup-menu";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
const Container = styled.View`
  width: 100%;
  height: 100%;
`;

const ViewForFlatListTitle = styled.View`
  width: 100%;
  height: 40%;
  flex-direction: row;
  justify-content: space-between;
`;

const ViewForFlatListMiddle = styled.View`
  width: 100%;
  height: 30%;
`;

const TouchForFlatList = styled.TouchableOpacity`
  width: 100%;
  height: 60px;
`;

const ViewForFlatListBottom = styled.View`
  width: 100%;
  height: 30%;
  flex-direction: row;
`;

const TextForFlatListTitle = styled.Text`
  font-weight: bold;
  color: black;
  font-size: 16px;
`;

const TextForFlatListTaticsName = styled.Text`
  color: black;
  font-size: 14px;
`;

const TextForFlatListBottom = styled.Text`
  color: grey;
  font-size: 12px;
`;

const ViewForSeparator = styled.View`
  width: 100%;
  height: 2px;
  background-color: black;
`;

const navigateToPlusBanggusukTeam = (navigation) => {
  navigation.navigate("UserPlusBanggusukTeam");
};

const Item = ({
  title,
  TaticsName,
  DirecterName,
  Formation,
  Member,
  navigation,
}) => {
  return (
    <TouchForFlatList
      onPress={() => navigation.navigate("UserPlusBanggusukTeam")}
    >
      <ViewForFlatListTitle>
        <TextForFlatListTitle>{title}</TextForFlatListTitle>
        <Menu>
          <MenuTrigger>
            <Feather name="more-vertical" size={20} color="black" />
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: { width: 40, height: 60 },
            }}
          >
            <MenuOption
              onSelect={() => navigateToPlusBanggusukTeam(navigation)}
            >
              <Text>수정</Text>
            </MenuOption>
            <MenuOption>
              <Text>삭제</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </ViewForFlatListTitle>
      <ViewForFlatListMiddle>
        <TextForFlatListTaticsName>{TaticsName}</TextForFlatListTaticsName>
      </ViewForFlatListMiddle>
      <ViewForFlatListBottom>
        <TextForFlatListBottom>{DirecterName}</TextForFlatListBottom>
        <TextForFlatListBottom>|</TextForFlatListBottom>
        <TextForFlatListBottom>{Formation}</TextForFlatListBottom>
        <TextForFlatListBottom>|</TextForFlatListBottom>
        <TextForFlatListBottom>{Member}</TextForFlatListBottom>
      </ViewForFlatListBottom>
    </TouchForFlatList>
  );
};

const DATA = [
  {
    id: "1",
    title: "스뮤니티",
    TaticsName: "전술1",
    DirecterName: "오우석",
    Formation: "4-4-2",
    Member: "14명",
  },
  {
    id: "2",
    title: "스뮤니티",
    TaticsName: "전술1",
    DirecterName: "오우석",
    Formation: "4-4-2",
    Member: "14명",
  },
  {
    id: "3",
    title: "스뮤니티",
    TaticsName: "전술1",
    DirecterName: "오우석",
    Formation: "4-4-2",
    Member: "14명",
  },
  {
    id: "4",
    title: "스뮤니티",
    TaticsName: "전술1",
    DirecterName: "오우석",
    Formation: "4-4-2",
    Member: "14명",
  },
  {
    id: "5",
    title: "스뮤니티",
    TaticsName: "전술1",
    DirecterName: "오우석",
    Formation: "4-4-2",
    Member: "14명",
  },
  {
    id: "6",
    title: "스뮤니티",
    TaticsName: "전술1",
    DirecterName: "오우석",
    Formation: "4-4-2",
    Member: "14명",
  },
  {
    id: "7",
    title: "스뮤니티",
    TaticsName: "전술1",
    DirecterName: "오우석",
    Formation: "4-4-2",
    Member: "14명",
  },
  {
    id: "8",
    title: "스뮤니티",
    TaticsName: "전술1",
    DirecterName: "오우석",
    Formation: "4-4-2",
    Member: "14명",
  },
  {
    id: "9",
    title: "스뮤니티",
    TaticsName: "전술1",
    DirecterName: "오우석",
    Formation: "4-4-2",
    Member: "14명",
  },
  {
    id: "10",
    title: "스뮤니티",
    TaticsName: "전술1",
    DirecterName: "오우석",
    Formation: "4-4-2",
    Member: "14명",
  },
  {
    id: "11",
    title: "스뮤니티",
    TaticsName: "전술1",
    DirecterName: "오우석",
    Formation: "4-4-2",
    Member: "14명",
  },
  {
    id: "12",
    title: "스뮤니티",
    TaticsName: "전술1",
    DirecterName: "오우석",
    Formation: "4-4-2",
    Member: "14명",
  },
  {
    id: "13",
    title: "스뮤니티",
    TaticsName: "전술1",
    DirecterName: "오우석",
    Formation: "4-4-2",
    Member: "14명",
  },
];

const BanggusukTeam = ({ navigation }) => {
  return (
    <Container>
      <View style={{ width: "100%", height: "100%" }}>
        <FlatList
          data={DATA}
          renderItem={({ item }) => (
            <Item
              title={item.title}
              TaticsName={item.TaticsName}
              DirecterName={item.DirecterName}
              Formation={item.Formation}
              Member={item.Member}
              navigation={navigation}
            />
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={ViewForSeparator}
          initialNumToRender={10}
          nestedScrollEnabled={true}
          maxToRenderPerBatch={10}
          removeClippedSubview="true"
        />
      </View>
    </Container>
  );
};

export default BanggusukTeam;
