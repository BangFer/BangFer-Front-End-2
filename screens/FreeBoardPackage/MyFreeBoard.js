import React, { useState, useCallback, useMemo } from "react";
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

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: #f5f5f5;
`;

const FirstView = styled.View`
  padding: 1px;
  margin-bottom: 10px;
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
  color: black;
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

const GetBoardData = async ({ page, size }) => {
  const token = await getTokenFromLocal();

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
      "http://13.125.14.94:8080/board/myboards",
      {
        headers: headers,
        params: params,
      }
    );

    // 서버 응답 구조에 맞게 수정
    return response.data.result;
  } catch (error) {
    console.error(error.response);
    throw new Error("Failed to fetch board data");
  }
};

const BoardItem = ({ data, handlePress }) => {
  return (
    <Pressable
      style={styles.itemContainer}
      onPress={() => handlePress(data._id)}
    >
      <Text style={styles.title}>{data.title}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.iconContainer}>
          <View style={styles.commentContainer}>
            <FontAwesome5 name="comment-dots" size={16} color="#fe6263" />
            <Text style={styles.infoText}>{data.comments}</Text>
          </View>
          <View style={styles.likeContainer}>
            <Feather name="thumbs-up" size={16} color="#fe6263" />
            <Text style={styles.infoText}>{data.likes}</Text>
          </View>
        </View>
        {data.director && (
          <Text style={styles.directorText}>{data.director}</Text>
        )}
      </View>
    </Pressable>
  );
};

const MyFreeBoard = ({ navigation }) => {
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [isLoading, setIsLoading] = useState(false);

  // 여기에 useInfiniteQuery 훅을 사용합니다

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
    ["boards", sortBy],
    ({ pageParam = 0 }) => GetBoardData({ page: pageParam, size, sortBy }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (
          !lastPage ||
          typeof lastPage.last !== "boolean" ||
          typeof lastPage.number !== "number"
        ) {
          return undefined;
        }
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
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
    const allData = data.pages.flatMap((page) => page.content || []);
    return sortData(allData, sortBy);
  }, [data, sortBy, sortData]);

  const handlePressGoDetail = useCallback(
    (id) => {
      navigation.navigate("MyFreeBoardDetail", { id });
    },
    [navigation]
  );

  const renderBoardItem = useCallback(
    ({ item }) => (
      <BoardItem
        data={{
          _id: item.id,
          title: item.boardTitle,
          comments: item.commentCount,
          director: item.writerNickName,
          likes: item.likeCount,
        }}
        handlePress={handlePressGoDetail}
      />
    ),
    [handlePressGoDetail]
  );

  if (queryLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <Container>
      <FirstView>
        <IconAndButtonsInFirstView>
          <RankIconInFirstView>
            <FontAwesome6 name="ranking-star" size={24} color="tomato" />
          </RankIconInFirstView>
          <ThumbsRankButton
            onPress={() => handleSort("likes")}
            disabled={isLoading}
          >
            {isLoading && sortBy === "likes" ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <ButtonText>따봉순</ButtonText>
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
        </IconAndButtonsInFirstView>
      </FirstView>

      <FlatList
        style={styles.container}
        data={sortedData}
        renderItem={renderBoardItem}
        keyExtractor={(item) => item.id.toString()}
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
        ListEmptyComponent={<Text>No data available</Text>}
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
    width: 60, // 고정 너비 설정
  },
  infoText: {
    color: "black",
    fontSize: 12,
    marginLeft: 5,
    width: 30, // 고정 너비 설정
    textAlign: "left", // 왼쪽 정렬
  },
  directorText: {
    fontSize: 14,
    color: "#666",
  },
});

export default MyFreeBoard;
