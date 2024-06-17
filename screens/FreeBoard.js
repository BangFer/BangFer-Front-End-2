import React from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { useBoardStore } from "../store/board";
import { EvilIcons } from "@expo/vector-icons";

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

        {data.categories.length > 0 && (
          <View style={styles.categoryBox}>
            {data.categories.map((category, index) => (
              <View style={styles.categoryItem} key={category}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.buttonBox}>
          <Pressable style={styles.button}>
            <EvilIcons name="comment" size={16} color="#fe6263" />
            <Text style={{ color: "#666", fontSize: 12 }}>
              {data.comments?.length}
            </Text>
          </Pressable>
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
    <FlatList
      style={styles.container}
      data={boards}
      renderItem={({ item }) => (
        <BoardItem data={item} handlePress={handlePressGoDetail} />
      )}
    />
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
    justifyContent: "flex-start",
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
});

export default FreeBoard;
