import React, { useState, useCallback, useMemo, useEffect } from "react";
import { View, Text, Pressable, FlatList, StyleSheet, ActivityIndicator, Alert } from "react-native";
import styled from "styled-components/native";
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import axios from "axios";
import { getTokenFromLocal } from "../LoginPackage/TokenUtils";
import { useInfiniteQuery } from 'react-query';

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: #F5F5F5;
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
  margin-right: 200px;
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

const GetBoardData = async ({ page, size, sortBy, searchText }) => {
  const token = await getTokenFromLocal();

  try {
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + token.accessToken,
    };

    const params = {
      title: searchText,
      page: page,
      size: size,
      sortBy: sortBy
    };

    const response = await axios.get(
      "http://13.125.14.94:8080/board/search",
      {
        headers: headers,
        params: params
      }
    );

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
            <FontAwesome5 name="thumbs-up" size={16} color="#fe6263" />
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

const FreeBoardSearchResult = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const params = navigation.getState().routes.find(route => route.name === 'FreeBoardSearchResult')?.params;
      if (params) {
        setSearchText(params.searchText);
        refetch();
      }
    });

    return unsubscribe;
  }, [navigation]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading: queryLoading,
    isError,
    error,
    refetch
  } = useInfiniteQuery(
    ['boards', sortBy, searchText],
    ({ pageParam = 0 }) => GetBoardData({ page: pageParam, size, sortBy, searchText }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (!lastPage || typeof lastPage.last !== 'boolean' || typeof lastPage.number !== 'number') {
          return undefined;
        }
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
      enabled: !!searchText,
    }
  );

  const handleSort = useCallback((type) => {
    setSortBy(type);
    refetch();
  }, [refetch]);

  const sortedData = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap(page => page.content || []);
  }, [data]);

  const handlePressGoDetail = useCallback((id) => {
    navigation.navigate("FreeBoardDetail", { id });
  }, [navigation]);

  const renderBoardItem = useCallback(({ item }) => (
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
  ), [handlePressGoDetail]);

  if (queryLoading) {
    return <ActivityIndicator size="large" color="tomato" />;
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
          <ThumbsRankButton onPress={() => handleSort('likes')}>
            <ButtonText>따봉순</ButtonText>
          </ThumbsRankButton>
          <CommentsRankButton onPress={() => handleSort('comments')}>
            <ButtonText>댓글순</ButtonText>
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
        ListEmptyComponent={<Text>검색 결과가 없습니다.</Text>}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    width: 120,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 50,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  infoText: {
    color: "black",
    fontSize: 12,
    marginLeft: 5,
    width: 30,
    textAlign: 'left',
  },
  directorText: {
    fontSize: 14,
    color: "#666",
  },
});

export default FreeBoardSearchResult;
