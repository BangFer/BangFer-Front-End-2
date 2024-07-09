import React from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { useBoardStore } from "../../store/board";
import { EvilIcons } from "@expo/vector-icons";
import styled from "styled-components";
import { FontAwesome6 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


const Container = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: #F5F5F5
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
`
const RankIconInFirstView = styled.View`
flex-direction: row;
margin-top: 5px;
margin-right: 155px;
`
const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: black;
`;

const HitsRankButton = styled.TouchableOpacity`
padding: 5px 5px; /* 버튼 내부 패딩 설정 */
border-radius: 5px; /* 둥근 사각형 테두리 반지름 설정 */
background-color: tomato; /* 배경색 설정 */
margin-left: 10px; /* 각 버튼 사이의 간격을 설정합니다. */
`;

const ThumbsRankButton = styled.TouchableOpacity`
padding: 5px 5px; /* 버튼 내부 패딩 설정 */
border-radius: 5px; /* 둥근 사각형 테두리 반지름 설정 */
background-color: tomato; /* 배경색 설정 */ 
margin-left: 10px; /* 각 버튼 사이의 간격을 설정합니다. */
`;

const CommentsRankButton = styled.TouchableOpacity`
padding: 5px 5px; /* 버튼 내부 패딩 설정 */
border-radius: 5px; /* 둥근 사각형 테두리 반지름 설정 */
background-color: tomato; /* 배경색 설정 */
margin-left: 10px; /* 각 버튼 사이의 간격을 설정합니다. */
`;

const BoardItem = ({ data, handlePress }) => {
  return (
    <Pressable
      style={styles.itemContainer}
      onPress={() => handlePress(data._id)}
    >
      <View>
        <Text style={styles.title}>{data.title}</Text>
        <Text numberOfLines={2} style={styles.contents}>
          {data.contents}
        </Text>

        {data.files?.length > 0 && (
          <View style={styles.imageBox}>
            {data.files.length > 0 &&
              data.files.map((file, index) => (
                <View key={index}>
                  <Image style={styles.image} source={{ uri: file }} />
                </View>
              ))}
          </View>
        )}


        <View style={styles.buttonBox}>
          <View style={styles.commentContainer}>
            <EvilIcons name="comment" size={16} color="#fe6263" />
            <Text style={styles.commentText}>
              {data.comments?.length}
            </Text>
          </View>
          {data.director && (
            <Text style={styles.directorText}>감독: {data.director}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const FreeBoard = ({ navigation }) => {
  const boards = useBoardStore((state) => state.boards);

  console.log(boards);

  const handlePressGoDetail = (_id) => {
    navigation.navigate("FreeBoardDetail", { _id });
  };

  return (
    <Container>
    <FirstView>
    <IconAndButtonsInFirstView>
    <RankIconInFirstView>
      <FontAwesome6 name="ranking-star" size={24} color="tomato" />
    
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
    
    <FlatList
      style={styles.container}
      data={boards}
      renderItem={({ item }) => (
        <BoardItem data={item} handlePress={handlePressGoDetail} />
      )}      
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
    flexDirection: "column",
    gap: 8,
  },
  categoryBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 8,
  },
  categoryText: {
    fontSize: 12,
  },
  categoryItem: {
    padding: 4,
    backgroundColor: "#f1f1f1",
    borderRadius: 4,
  },
  title: {
    fontSize: 14,
  },
  contents: {
    fontSize: 14,
    lineHeight: 18,
    color: "#666",
    marginTop: 8,
  },
  buttonBox: {
    flexDirection: "row",
    justifyContent: "space-between", // 요소들을 양쪽 끝으로 정렬
    alignItems: "center",
    marginTop: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },

  imageBox: {
    flexDirection: "row",
    gap: 4,
    marginTop: 12,
  },
  image: {
    borderRadius: 12,
    overflow: "hidden",
    width: 80,
    height: 80,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentText: {
    color: "#666",
    fontSize: 12,
    marginLeft: 2,
  },
  directorText: {
    fontSize: 12,
    color: "#666",
  },
});

export default FreeBoard;
