import React, { useState, useCallback, useMemo } from "react";
import { View, Text, Pressable, FlatList, StyleSheet, Image, Alert, ActivityIndicator } from "react-native";
import { useInfiniteQuery, useMutation } from 'react-query';
import styled from "styled-components";
import { EvilIcons, FontAwesome6 } from '@expo/vector-icons';
import { getTokenFromLocal } from "../LoginPackage/TokenUtils";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { refreshToken } from "../LoginPackage/TokenUtils"; // refreshToken 함수를 import합니다
import TacticsSearch from "./TacticsSearch";
import { Ionicons } from '@expo/vector-icons';




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
  left: 20px;
  top: 50%;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: white;
`;



const ThumbsRankButton = styled.TouchableOpacity`
  padding: 5px 10px;
  border-radius: 5px;
  background-color: tomato;
  margin-left: 10px;
  
  align-items: center;
  justify-content: center;
`;

const CommentsRankButton = styled.TouchableOpacity`
  padding: 5px 10px;
  border-radius: 5px;
  background-color: tomato;
  margin-left: 10px;
  
  align-items: center;
  justify-content: center;
`;

const FormationButton = styled.View`
  padding: 5px 5px;
  border-radius: 5px;
  background-color: tomato;
  margin-left: 10px;
`;

const SearchView = styled.View`
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  border-width: 1px;
  border-color: #CCCCCC;
  padding: 5px 10px;
  margin: 10px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  height: 30px;
  font-size: 14px;
`;

const SearchIcon = styled(Ionicons)`
  margin-right: 10px;
`;

const SearchButton = styled.TouchableOpacity`
  padding: 5px 10px;
`;

const GetBoardData = async ({ page, size }) => {
  let token = await getTokenFromLocal();

  try {
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + token.accessToken,
    };

    const params = {
      page: page,
      size: size
    };

    console.log(params);

    const response = await axios.get(
      "http://13.125.14.94:8080/api/v1/tactics",
      {
        headers: headers,
        params: params
      }
    );

    return response.data.result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // 토큰이 만료되었을 경우, 토큰을 갱신하고 다시 시도합니다
      try {
        const newToken = await refreshToken();
        token = newToken;
        
        const newHeaders = {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "Bearer " + newToken.accessToken,
        };
        
        const response = await axios.get(
          "http://13.125.14.94:8080/api/v1/tactics",
          {
            headers: newHeaders,
            params: { page, size }
          }
        );

        return response.data.result;
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        throw new Error("Authentication failed. Please log in again.");
      }
    }
    console.error("API request failed:", error);
    throw new Error("Failed to fetch board data");
  }
};

const BoardItem = ({ data, handlePress }) => {
  return (
    <Pressable
      style={styles.itemContainer}
      onPress={() => handlePress(data.tacticId)}
    >
      <Text style={styles.title}>{data.tacticName}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.iconContainer}>
          <View style={styles.formationContainer}>
            <FontAwesome5 name="futbol" size={16} color="#fe6263" />
            <Text style={styles.infoText}>{data.mainFormation}</Text>
          </View>
        </View>
        {data.nickname && (
          <Text style={styles.directorText}>{data.nickname}</Text>
        )}
      </View>
    </Pressable>
  );
};

const TacticsSearchResult = ({ route, navigation }) => {
  const { searchResults, searchText: initialSearchText, totalElements } = route.params;
  const [sortedData, setSortedData] = useState(searchResults);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState(initialSearchText);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const token = await getTokenFromLocal();
      const response = await axios.get(`http://13.125.14.94:8080/api/v1/tactics/search`, {
        params: {
          title: searchText,
          page: 0,
          size: 10
        },
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token.accessToken
        }
      });

      if (response.data.code === 'OK') {
        setSortedData(response.data.result.content);
      } else {
        Alert.alert("검색에 실패했습니다", response.data.message);
      }
    } catch (error) {
      console.error("Error searching tactics:", error);
      Alert.alert("검색 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = useCallback((type) => {
    setIsLoading(true);
    // 정렬 로직 구현 (필요한 경우)
    setIsLoading(false);
  }, []);

  const handlePressGoDetail = useCallback((tacticId) => {
    navigation.navigate("TacticsDetail", { tacticId });
  }, [navigation]);

  const renderBoardItem = useCallback(({ item }) => (
    <BoardItem
      data={item}
      handlePress={handlePressGoDetail}
    />
  ), [handlePressGoDetail]);

  const filterByFormation = useCallback((formation) => {
    // 포메이션 필터링 로직 구현
  }, []);

  return (
    <Container>
      {/* <SearchView>
        <SearchIcon name="search" size={24} color="black" />
        <SearchInput
          placeholder="전술명"
          value={searchText}
          onChangeText={setSearchText}
        />
        <SearchButton onPress={handleSearch}>
          <Text>검색</Text>
        </SearchButton>
      </SearchView> */}

      <FirstView>
          <RankIconInFirstView>
            <FontAwesome6 name="ranking-star" size={24} color="tomato" />
          </RankIconInFirstView>
          <IconAndButtonsInFirstView>
          <ThumbsRankButton onPress={() => handleSort('likes')} disabled={isLoading}>
            <ButtonText>공감순</ButtonText>
          </ThumbsRankButton>
          <CommentsRankButton onPress={() => handleSort('comments')} disabled={isLoading}>
            <ButtonText>댓글순</ButtonText>
          </CommentsRankButton>
          <Menu>
            <MenuTrigger>
              <FormationButton>
                <ButtonText>포메이션</ButtonText>
              </FormationButton>
            </MenuTrigger>
            <MenuOptions customStyles={{
              optionsContainer: { width: 60, height: 200 },
            }}>
              <MenuOption onPress={() => filterByFormation('4-4-2')} text='4-4-2' />
              <MenuOption onPress={() => filterByFormation('4-3-3')} text='4-3-3' />
              <MenuOption onPress={() => filterByFormation('4-3-2-1')} text='4-3-2-1' />
              <MenuOption onPress={() => filterByFormation('4-2-3-1')} text='4-2-3-1' />
              <MenuOption onPress={() => filterByFormation('3-4-3')} text='3-4-3' />
              <MenuOption onPress={() => filterByFormation('3-5-2')} text='3-5-2' />
              <MenuOption onPress={() => filterByFormation('3-2-4-1')} text='3-2-4-1' />
            </MenuOptions>
          </Menu>
        </IconAndButtonsInFirstView>
      </FirstView>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fe6263" />
        </View>
      ) : sortedData.length > 0 ? (
        <FlatList
          style={styles.container}
          data={sortedData}
          renderItem={renderBoardItem}
          keyExtractor={(item) => item.tacticId?.toString() || Math.random().toString()}
          // ListHeaderComponent={
          //   <Text style={styles.resultCountText}>검색 결과: {sortedData.length}개</Text>
          // }
        />
      ) : (
        <View style={styles.noResultContainer}>
          <Text style={styles.noResultText}>검색 결과가 없습니다.</Text>
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    width: 120, // 고정 너비 설정
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 50, // 고정 너비 설정
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60, // 고정 너비 설정
  },
  infoText: {
    color: "black",
    fontSize: 12,
    marginLeft: 5,
    width: 30, // 고정 너비 설정
    textAlign: 'left', // 왼쪽 정렬
  },
  directorText: {
    fontSize: 14,
    color: "#666",
  },
  formationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80, // 적절한 너비로 조정
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#fe6263',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  searchResultText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
  noResultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultText: {
    fontSize: 16,
    color: '#666',
  },
  resultCountText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    marginBottom: 10,
  },
});

export default TacticsSearchResult;