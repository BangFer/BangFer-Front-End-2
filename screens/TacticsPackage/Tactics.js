import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useInfiniteQuery, useMutation } from "react-query";
import styled from "styled-components";
import { EvilIcons, FontAwesome6 } from "@expo/vector-icons";
import { getTokenFromLocal } from "../LoginPackage/TokenUtils";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { refreshToken } from "../LoginPackage/TokenUtils"; // refreshToken 함수를 import합니다

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: #f5f5f5;
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
  background-color: #ff6262;
  margin-left: 10px;

  align-items: center;
  justify-content: center;
`;

const CommentsRankButton = styled.TouchableOpacity`
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #ff6262;
  margin-left: 10px;

  align-items: center;
  justify-content: center;
`;

const FormationButton = styled.View`
  padding: 5px 5px;
  border-radius: 5px;
  background-color: #ff6262;
  margin-left: 10px;
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
      size: size,
    };

    console.log(params);

    const response = await axios.get(
      "http://13.125.14.94:8080/api/v1/tactics",
      {
        headers: headers,
        params: params,
      }
    );
    console.log(response.data.result);
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
            params: { page, size },
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

const BoardItem = ({ data, handlePress, userId }) => {
  const isTitleRed = data.userId === userId;
  console.log(data.userId);
  console.log(userId);
  return (
    <Pressable
      style={styles.itemContainer}
      onPress={() => handlePress(data.tacticId)}
    >
      <Text style={[styles.title, isTitleRed && { color: "#FF6262" }]}>
        {data.tacticName}
      </Text>
      <View style={styles.infoContainer}>
        <View style={styles.iconContainer}>
          <View style={styles.commentContainer}>
            <FontAwesome5 name="comment-dots" size={16} color="#FF6262" />
            <Text style={styles.infoText}>{data.commentCnt}</Text>
          </View>
          <View style={styles.likeContainer}>
            <FontAwesome5 name="thumbs-up" size={16} color="#FF6262" />
            <Text style={styles.infoText}>{data.likeCnt}</Text>
          </View>
          <View style={styles.formationContainer}>
            <FontAwesome5 name="futbol" size={16} color="#FF6262" />
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

const Tactics = ({ navigation }) => {
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const getUserIdFromToken = async () => {
      try {
        const token = await getTokenFromLocal();
        if (token && token.userId) {
          setUserId(token.userId);
          console.log("User ID set:", token.userId);
        } else {
          console.log("User ID not found in token");
        }
      } catch (error) {
        console.error("Error getting user ID from token:", error);
      }
    };

    getUserIdFromToken();
  }, []);
  const filterByFormation = useCallback((formation) => {
    setSelectedFormation(formation);
  }, []);

  const handleSort = useCallback(
    async (type) => {
      setIsLoading(true);
      setSortBy(type);
      await refetch();
      setIsLoading(false);
    },
    [refetch]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading: queryLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery(
    ["boards", sortBy], // selectedFormation 제거
    ({ pageParam = 0 }) => GetBoardData({ page: pageParam, size }),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
      onError: (error) => {
        Alert.alert("Error", error.message);
      },
    }
  );

  const sortData = useCallback((data, sortBy) => {
    if (!data) return [];
    const sortedData = [...data];
    switch (sortBy) {
      case "id":
        sortedData.sort((a, b) => a.id - b.id);
        break;
      case "comments":
        sortedData.sort((a, b) => b.commentCount - a.commentCount);
        break;
      case "likes":
        sortedData.sort((a, b) => b.likeCount - a.likeCount);
        break;
      default:
        break;
    }
    return sortedData;
  }, []);

  const sortedData = useMemo(() => {
    if (!data || !data.pages) return [];
    let filteredData = data.pages.flatMap((page) => page.content || []);

    if (selectedFormation) {
      filteredData = filteredData.filter(
        (item) => item.mainFormation === selectedFormation
      );
    }

    return sortData(filteredData, sortBy);
  }, [data, selectedFormation, sortBy, sortData]);

  const handlePressGoDetail = useCallback(
    (tacticId) => {
      navigation.navigate("TacticsDetail", { tacticId });
    },
    [navigation]
  );

  const renderBoardItem = useCallback(
    ({ item }) => (
      <BoardItem
        data={item}
        handlePress={handlePressGoDetail}
        userId={userId}
      />
    ),
    [handlePressGoDetail, userId]
  );

  if (queryLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6262" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Container>
      <FirstView>
        <RankIconInFirstView>
          <FontAwesome6 name="ranking-star" size={24} color="#FF6262" />
        </RankIconInFirstView>
        <IconAndButtonsInFirstView>
          <ThumbsRankButton
            onPress={() => handleSort("likes")}
            disabled={isLoading}
          >
            {isLoading && sortBy === "likes" ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <ButtonText>공감순</ButtonText>
            )}
          </ThumbsRankButton>
          <CommentsRankButton
            onPress={() => handleSort("comments")}
            disabled={isLoading}
          >
            {isLoading && sortBy === "comments" ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <ButtonText>댓글순</ButtonText>
            )}
          </CommentsRankButton>
          <Menu>
            <MenuTrigger>
              <FormationButton>
                <ButtonText>{selectedFormation || "포메이션"}</ButtonText>
              </FormationButton>
            </MenuTrigger>
            <MenuOptions
              customStyles={{
                optionsContainer: { width: 100, maxHeight: 250 },
              }}
            >
              <MenuOption
                onSelect={() => filterByFormation(null)}
                text="모든 포메이션"
              />
              <MenuOption
                onSelect={() => filterByFormation("4-4-2")}
                text="4-4-2"
              />
              <MenuOption
                onSelect={() => filterByFormation("4-3-3")}
                text="4-3-3"
              />
              <MenuOption
                onSelect={() => filterByFormation("4-3-2-1")}
                text="4-3-2-1"
              />
              <MenuOption
                onSelect={() => filterByFormation("4-2-3-1")}
                text="4-2-3-1"
              />
              <MenuOption
                onSelect={() => filterByFormation("3-4-3")}
                text="3-4-3"
              />
              <MenuOption
                onSelect={() => filterByFormation("3-5-2")}
                text="3-5-2"
              />
              <MenuOption
                onSelect={() => filterByFormation("3-2-4-1")}
                text="3-2-4-1"
              />
            </MenuOptions>
          </Menu>
        </IconAndButtonsInFirstView>
      </FirstView>

      <FlatList
        style={styles.container}
        data={sortedData}
        renderItem={renderBoardItem}
        keyExtractor={(item) =>
          item.tacticId?.toString() || Math.random().toString()
        }
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.1}
        onRefresh={() => {
          setSortBy("id");
          refetch();
        }}
        refreshing={isLoading}
        ListEmptyComponent={
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              {selectedFormation
                ? `${selectedFormation} 포메이션의 전술이 없습니다.`
                : "데이터가 없습니다."}
            </Text>
          </View>
        }
      />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 20,
  },
  iconContainer: {
    flexDirection: "row",
    width: 120, // 고정 너비 설정
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 50, // 고정 너비 설정
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 50, // 고정 너비 설정
  },
  infoText: {
    color: "black",
    fontSize: 12,
    marginLeft: 5,
    width: 40, // 고정 너비 설정
    textAlign: "left", // 왼쪽 정렬
  },
  directorText: {
    fontSize: 14,
    color: "#666",
  },
  formationContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 80, // 적절한 너비로 조정
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#FF6262",
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default Tactics;
