import React, { useState, useEffect } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import TacticsBack from "../../assets/TacticsBack.png";
import UserPlusBanggusukTeam from "./UserPlusBanggusukTeam";
import { MenuProvider } from "react-native-popup-menu";
import { verifyTokens, getTokenFromLocal } from "../LoginPackage/TokenUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { useTeam } from "../TeamContext";
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
  height: 30%;
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
  font-size: 13px;
`;

const ViewForSeparator = styled.View`
  width: 100%;
  height: 2px;
  background-color: black;
`;

const GetTeam = async () => {
  const Token = await getTokenFromLocal();

  const headers_config = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": "Bearer " + Token.accessToken,
  };

  try {
    const res = await axios.get("http://13.125.14.94:8080/team/list", {
      headers: headers_config,
    });
    console.log("GetTeam의 response는", JSON.stringify(res.data));
    // JSON.stringify로 객체를 문자열로 변환
    return res.data.result;
  } catch (error) {
    console.error("Get Team의 error는 " + error);
  }
};

const DeleteTeam = async ({ teamId }) => {
  const Token = await getTokenFromLocal();
  console.log(teamId);

  const headers_config = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": "Bearer " + Token.accessToken,
  };

  const url = "http://13.125.14.94:8080/team/" + teamId;
  try {
    const res = await axios.delete(url, {
      headers: headers_config,
    });
    console.log("DeleteTeam의 response는", JSON.stringify(res.data));
    // JSON.stringify로 객체를 문자열로 변환
    return res.data.result;
  } catch (error) {
    console.error(error.response);
  }
};

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
  leaderId,
  teamId,
  fetchTeamData,
}) => {
  const [userId, setUserId] = useState(null);
  const { letsetTeamId } = useTeam();
  useEffect(() => {
    // AsyncStorage에서 userId를 읽어오는 함수
    const fetchUserId = async () => {
      try {
        const Tokens = await getTokenFromLocal();
        const storedUserId = Tokens.userId;
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error("Failed to fetch userId from AsyncStorage", error);
      }
    };

    fetchUserId();
  }, []);

  const handlePress = () => {
    letsetTeamId(teamId);
    if (userId === leaderId) {
      navigation.navigate("AdminPlusBanggusukTeam", { teamId });
    } else {
      navigation.navigate("UserPlusBanggusukTeam", { teamId });
    }
  };

  const handleDelete = async () => {
    try {
      await DeleteTeam({ teamId });
      fetchTeamData();
    } catch (error) {
      console.error("Failed to delete team", error);
    }
  };

  return (
    <TouchForFlatList onPress={handlePress}>
      <ViewForFlatListTitle>
        <TextForFlatListTitle>{title}</TextForFlatListTitle>
        {userId === leaderId && (
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
                onSelect={() =>
                  navigation.navigate("ModifyBanggusukTeam", { teamId })
                }
              >
                <Text>수정</Text>
              </MenuOption>
              <MenuOption onSelect={() => handleDelete({ teamId })}>
                <Text>삭제</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
      </ViewForFlatListTitle>
      <ViewForFlatListMiddle>
        <TextForFlatListTaticsName>{TaticsName}</TextForFlatListTaticsName>
      </ViewForFlatListMiddle>
      <ViewForFlatListBottom>
        <TextForFlatListBottom>{DirecterName}</TextForFlatListBottom>
        <TextForFlatListBottom>|</TextForFlatListBottom>
        <TextForFlatListBottom>{Formation}</TextForFlatListBottom>
        <TextForFlatListBottom>|</TextForFlatListBottom>
        <TextForFlatListBottom>{Member}명</TextForFlatListBottom>
      </ViewForFlatListBottom>
    </TouchForFlatList>
  );
};

const BanggusukTeam = ({ navigation }) => {
  const [teamData, setTeamData] = useState([]);

  const fetchTeamData = async () => {
    const data = await GetTeam();

    const transformedData = data.map((item, index) => ({
      id: (index + 1).toString(),
      title: item.teamName,
      TaticsName: item.tacticName,
      DirecterName: item.leaderNickName,
      Formation: item.mainFormation,
      Member: item.memberCount, // 멤버 수가 명확하지 않아서 임의로 설정
      leaderId: item.teamMembers[0].userId,
      teamId: item.teamId,
    }));
    setTeamData(transformedData);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchTeamData();
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <Container>
      <View style={{ width: "100%", height: "100%" }}>
        <FlatList
          data={teamData}
          renderItem={({ item }) => (
            <Item
              title={item.title}
              TaticsName={item.TaticsName}
              DirecterName={item.DirecterName}
              Formation={item.Formation}
              Member={item.Member}
              navigation={navigation}
              leaderId={item.leaderId}
              teamId={item.teamId}
              fetchTeamData={fetchTeamData}
            />
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={ViewForSeparator}
          ListFooterComponent={ViewForSeparator}
          initialNumToRender={12}
          nestedScrollEnabled={true}
          maxToRenderPerBatch={10}
          removeClippedSubview="true"
        />
      </View>
    </Container>
  );
};

export default BanggusukTeam;
