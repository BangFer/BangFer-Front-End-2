import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import { useBoardStore } from "../store/board";
import { EvilIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import uuid from "react-native-uuid";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Entypo } from "@expo/vector-icons";
import ProfileImg from "../assets/profileimg.jpg";

const UserInfo = () => {
  return (
    <View style={styles.userInfoBox}>
      <View style={styles.userInfoImageBox}>
        <Image
          style={styles.userInfoImage}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGujC5DzQ77Bi70CpaM3TlK-P_AkLr4ronKg&s",
          }}
        />
      </View>
      <Text style={styles.userInfoText}>감독명</Text>
    </View>
  );
};

const CommentItem = ({ data }) => {
  return (
    <View style={styles.commentBox}>
      <UserInfo />
      <View style={{ marginTop: 8 }}>
        <Text style={styles.contents}>{data.contents}</Text>
      </View>
      <View style={styles.buttonBox}>
        <Pressable style={styles.button}>
          <AntDesign name="like2" size={16} color="#fe6263" />
          <Text style={{ color: "#666", fontSize: 12 }}>0</Text>
        </Pressable>
      </View>
    </View>
  );
};

const FreeBoardDetail = ({ navigation, route }) => {
  const boards = useBoardStore((state) => state.boards);
  const addComment = useBoardStore((state) => state.addComment);
  const removeBoard = useBoardStore((state) => state.removeBoard);

  const [data, setData] = React.useState(null);

  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = () => {
    const options = ["수정", "삭제", "취소"];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex) => {
        console.log(data);

        switch (selectedIndex) {
          case 0:
            navigation.navigate("FreeBoardUpdate", { _id: data._id });
            break;

          case destructiveButtonIndex:
            removeBoard(data?._id);
            navigation.goBack();
            break;

          case cancelButtonIndex:
          // Canceled
        }
      }
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={onPress}>
          <Entypo name="dots-three-vertical" size={16} color="black" />
        </Pressable>
      ),
    });
  }, [data, onPress]);

  useEffect(() => {
    if (!route.params?._id) {
      navigation.replace("FreeBoard");
      return;
    }

    if (boards.findIndex((board) => board._id === route.params._id) < 0) {
      navigation.replace("FreeBoard");
      return;
    } else {
      setData(boards.find((board) => board._id === route.params._id));
    }
  }, [boards, route.params?._id]);

  const [commentText, setCommentText] = React.useState("");

  const handlePressSendComment = () => {
    if (!commentText) {
      alert("댓글을 입력해주세요.");
      return;
    }

    addComment(data._id, {
      _id: uuid.v4(),
      contents: commentText,
    });
    setCommentText("");
  };

  if (!data) return <></>;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["bottom", "right", "left"]}
    >
      <FlatList
        style={{ flex: 1 }}
        ListHeaderComponent={
          <View style={styles.itemContainer}>
            <UserInfo />
            <View style={{ marginTop: 12 }}>
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

              {data.categories.length > 0 && (
                <View style={styles.categoryBox}>
                  {data.categories.map((category, index) => (
                    <View style={styles.categoryItem} key={category}>
                      <Text style={styles.categoryText}>{category}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={[styles.bar, { marginTop: 20 }]} />
              <View style={styles.buttonBox}>
                <Pressable style={styles.button}>
                  <EvilIcons name="comment" size={16} color="#fe6263" />
                  <Text style={{ color: "#666", fontSize: 12 }}>
                    {data.comments?.length}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        }
        data={data.comments}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text>댓글이 없습니다.</Text>
          </View>
        }
        renderItem={({ item }) => <CommentItem data={item} />}
      />
      <View
        style={{
          backgroundColor: "#fff",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          borderTopColor: "#ddd",
          borderTopWidth: 1,
        }}
      >
        <TextInput
          placeholder="댓글을 입력하세요."
          style={styles.commentInput}
          value={commentText}
          onChangeText={setCommentText}
        />

        <Pressable style={{ padding: 20 }} onPress={handlePressSendComment}>
          <Entypo name="triangle-right" size={24} color="tomato" />
        </Pressable>
      </View>
    </SafeAreaView>
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
    marginTop: 12,
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
    justifyContent: "flex-start",
    marginTop: 12,
  },
  bar: {
    width: "100%",
    height: 1,
    backgroundColor: "#ddd",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
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

  userInfoBox: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  userInfoImageBox: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    borderColor: "#ddd",
  },
  userInfoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  userInfoText: {
    fontSize: 14,
  },
  commentBox: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    borderRadius: 10,
  },
  commentInput: {
    backgroundColor: "#fff",
    padding: 20,
    fontSize: 14,
    flex: 1,
    borderColor: "black",
  },
});

export default FreeBoardDetail;
