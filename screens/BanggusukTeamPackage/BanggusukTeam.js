import React, { useState, useEffect, useCallback } from "react";
import { Text, View, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { Ionicons, FontAwesome, FontAwesome5, FontAwesome6, Feather,MaterialCommunityIcons  } from "@expo/vector-icons";
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import { verifyTokens, getTokenFromLocal } from "../LoginPackage/TokenUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { useTeam } from "../TeamContext";

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: #F5F5F5;
`;

const FirstView = styled.View`
  padding: 1px;
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
`;

const IconAndButtonsInFirstView = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-top: 10px;
  margin-right: 10px;
`;

const RankIconInFirstView = styled.View`
  position: absolute;
  left: 15px;
  top: 13px;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: white;
`;

const SortButton = styled.TouchableOpacity`
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #5182FF;
  margin-left: 10px;
  align-items: center;
  justify-content: center;
`;

const FormationButton = styled.View`
  padding: 5px 5px;
  border-radius: 5px;
  background-color: #5182FF;
  margin-left: 10px;
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
    return res.data.result;
  } catch (error) {
    console.error("Get Team의 error는 " + error);
  }
};

const DeleteTeam = async ({ teamId }) => {
  const Token = await getTokenFromLocal();

  const headers_config = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": "Bearer " + Token.accessToken,
  };

  const url = "http://13.125.14.94:8080/team/" + teamId;
  try {
    const res = await axios.delete(url, {
      headers: headers_config,
    });
    return res.data.result;
  } catch (error) {
    console.error(error.response);
  }
};

const Item = ({ item, navigation, fetchTeamData, userId }) => {
  const { letsetTeamId } = useTeam();

  const handlePress = () => {
    letsetTeamId(item.teamId);
    if (userId === item.leaderId) {
      navigation.navigate("AdminPlusBanggusukTeam", { teamId: item.teamId });
    } else {
      navigation.navigate("UserPlusBanggusukTeam", { teamId: item.teamId });
    }
  };

  const handleDelete = async () => {
    try {
      await DeleteTeam({ teamId: item.teamId });
      fetchTeamData();
    } catch (error) {
      console.error("Failed to delete team", error);
    }
  };

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={handlePress}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{item.title}</Text>
        {userId === item.leaderId && (
          <Menu>
            <MenuTrigger>
              <Feather name="more-vertical" size={20} color="black" marginRight={-10} />
            </MenuTrigger>
            <MenuOptions customStyles={{
              optionsContainer: { width: 50, maxHeight: 250 },
            }}>
              <MenuOption onSelect={() => navigation.navigate("ModifyBanggusukTeam", { teamId: item.teamId })}>
                <Text>수정</Text>
              </MenuOption>
              <MenuOption onSelect={handleDelete}>
                <Text>삭제</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
      </View>
      <Text style={styles.tacticsName}>{item.TaticsName}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.iconContainer}>
          <View style={styles.infoItem}>
            <FontAwesome5 name="users" size={16} color="#5182FF" />
            <Text style={styles.infoText}>{item.Member}</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome5 name="futbol" size={16} color="#5182FF" />
            <Text style={styles.infoText}>{item.Formation}</Text>
          </View>
        </View>
        {item.DirecterName && (
          <Text style={styles.directorText}>{item.DirecterName}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};


const BanggusukTeam = ({ navigation }) => {
  const [teamData, setTeamData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('id');
  const [selectedFormation, setSelectedFormation] = useState(null);

  const fetchTeamData = async () => {
    setIsLoading(true);
    const data = await GetTeam();

    const transformedData = data.map((item, index) => ({
      id: (index + 1).toString(),
      title: item.teamName,
      TaticsName: item.tacticName,
      DirecterName: item.leaderNickName,
      Formation: item.mainFormation,
      Member: item.memberCount,
      leaderId: item.teamMembers[0].userId,
      teamId: item.teamId,
    }));
    setTeamData(transformedData);
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const Tokens = await getTokenFromLocal();
        setUserId(Tokens.userId);
      } catch (error) {
        console.error("Failed to fetch userId from AsyncStorage", error);
      }
    };

    fetchUserId();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchTeamData();
    }, [])
  );

  const handleSort = useCallback((type) => {
    setSortBy(type);
    let sortedData = [...teamData];
    switch (type) {
      case 'members':
        sortedData.sort((a, b) => b.Member - a.Member);
        break;
      case 'formation':
        sortedData.sort((a, b) => a.Formation.localeCompare(b.Formation));
        break;
      default:
        sortedData.sort((a, b) => a.id - b.id);
    }
    setTeamData(sortedData);
  }, [teamData]);

  const filterByFormation = useCallback((formation) => {
    setSelectedFormation(formation);
  }, []);

  const filteredData = selectedFormation
    ? teamData.filter(item => item.Formation === selectedFormation)
    : teamData;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5182FF" />
      </View>
    );
  }

  return (
    <Container>
      <FirstView>
        <RankIconInFirstView>
        <MaterialCommunityIcons name="clipboard-list" size={32} color="#5182FF" />
          {/* <FontAwesome6 name="ranking-star" size={24} color="#5182FF" /> */}
        </RankIconInFirstView>
        <IconAndButtonsInFirstView>
          <Menu>
            <MenuTrigger>
              <FormationButton>
                <ButtonText>{selectedFormation || '포메이션'}</ButtonText>
              </FormationButton>
            </MenuTrigger>
            <MenuOptions customStyles={{
              optionsContainer: { width: 100, maxHeight: 250 },
            }}>
              <MenuOption onSelect={() => filterByFormation(null)} text='모든 포메이션' />
              <MenuOption onSelect={() => filterByFormation("4-4-2")} text="4-4-2" />
              <MenuOption onSelect={() => filterByFormation("4-3-3")} text="4-3-3" />
              <MenuOption onSelect={() => filterByFormation("4-3-2-1")} text="4-3-2-1" />
              <MenuOption onSelect={() => filterByFormation("4-2-3-1")} text="4-2-3-1" />
              <MenuOption onSelect={() => filterByFormation("3-4-3")} text="3-4-3" />
              <MenuOption onSelect={() => filterByFormation("3-5-2")} text="3-5-2" />
              <MenuOption onSelect={() => filterByFormation("3-2-4-1")} text="3-2-4-1" />
            </MenuOptions>
          </Menu>
        </IconAndButtonsInFirstView>
      </FirstView>
      
      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <Item
            item={item}
            navigation={navigation}
            fetchTeamData={fetchTeamData}
            userId={userId}
          />
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              {selectedFormation 
                ? `${selectedFormation} 포메이션의 팀이 없습니다.` 
                : "데이터가 없습니다."}
            </Text>
          </View>
        }
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tacticsName: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  infoText: {
    color: "black",
    fontSize: 12,
    marginLeft: 5,
  },
  directorText: {
    fontSize: 14,
    color: "#666",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default BanggusukTeam;