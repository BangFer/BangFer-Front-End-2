import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImageLibrary from "react-native-image-picker";
import uuid from "react-native-uuid";
import { useBoardStore } from "../store/board";

const FreeBoardUpdate = ({ navigation, route }) => {
  const boards = useBoardStore((state) => state.boards);
  useEffect(() => {
    if (!route.params?._id) {
      navigation.replace("FreeBoard");
      return;
    }

    if (boards.findIndex((board) => board._id === route.params._id) < 0) {
      navigation.replace("FreeBoard");
      return;
    } else {
      const data = boards.find((board) => board._id === route.params._id);
      setTitle(data.title);
      setContents(data.contents);
      setSelectCategories(data.categories);
      setFiles(data.files);
    }
  }, [boards, route.params?._id]);

  const contentInputRef = React.useRef();

  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [selectCategories, setSelectCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState([]);

  const updateBoard = useBoardStore((state) => state.updateBoard);

  const handlePressSubmitForm = () => {
    const _id = route.params._id;

    if (title.trim() === "") {
      Alert.alert("제목을 입력해주세요.");
      return;
    }

    if (contents.trim() === "") {
      Alert.alert("내용을 입력해주세요.");
      return;
    }

    updateBoard(route.params?._id, {
      _id,
      title,
      contents,
      categories: selectCategories,
      files,
      comments: [],
    });

    navigation.goBack();
  };

  const handleAddSelectCategory = useCallback(
    (e) => {
      if (e.nativeEvent.key === " ") {
        if (category === "") return;

        setSelectCategories([...selectCategories, category]);
        setTimeout(() => {
          setCategory("");
        }, 50);
      }
    },
    [category, setCategory]
  );

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={{ flex: 1 }}>
        <TextInput
          style={styles.title}
          placeholder="제목"
          textAlignVertical="top"
          value={title}
          onChangeText={setTitle}
        />

        <View
          style={styles.contentBox}
          onTouchEnd={() => contentInputRef.current?.focus()}
        >
          <TextInput
            ref={contentInputRef}
            style={styles.contents}
            placeholder="내용을 입력하세요."
            textAlignVertical="top"
            multiline={true}
            value={contents}
            onChangeText={setContents}
          />
        </View>
        <View style={styles.imageBox}>
          {files.length > 0 &&
            files.map((file, index) => (
              <View key={index}>
                <Image
                  style={styles.image}
                  source={{ uri: file }}
                  style={{ width: 80, height: 80 }}
                />
              </View>
            ))}
        </View>
        <View style={styles.bar} />
        <View>
          {selectCategories.length > 0 && (
            <View style={styles.categoryBox}>
              {selectCategories.map((selectCategory, index) => (
                <View style={styles.categoryItem} key={selectCategory}>
                  <Text>{selectCategory}</Text>
                </View>
              ))}
            </View>
          )}
          <TextInput
            style={styles.category}
            placeholder="카테고리를 입력하세요."
            textAlignVertical="top"
            value={category}
            onChangeText={setCategory}
            onKeyPress={handleAddSelectCategory}
          />
        </View>
        <View style={styles.bar} />
        <View style={styles.buttonBox}>
          <Pressable
            style={styles.button}
            onPress={() =>
              ImageLibrary.launchImageLibrary({}, (res) => {
                if (res?.didCancel) return;
                setFiles([...files, res.assets[0].uri]);
              })
            }
          >
            <AntDesign name="picture" size={24} color="#666" />
            <Text style={{ color: "#666" }}>사진</Text>
          </Pressable>
        </View>
      </View>
      <Pressable onPress={handlePressSubmitForm} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>완료</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "bold",
    padding: 12,
    paddingHorizontal: 20,
  },
  contentBox: {
    flex: 1,
  },
  contents: {
    flex: 1,
    paddingHorizontal: 20,
    lineHeight: 18,
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
    paddingVertical: 10,
  },
  categoryBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  categoryItem: {
    padding: 4,
    backgroundColor: "#f1f1f1",
    borderRadius: 4,
  },
  category: {
    padding: 16,
    paddingHorizontal: 20,
    fontSize: 14,
  },
  bar: {
    width: "100%",
    height: 1,
    backgroundColor: "#ddd",
  },
  buttonBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 20,
    paddingVertical: 12,
  },
  image: {
    borderRadius: 12,
    overflow: "hidden",
  },
  submitButton: {
    backgroundColor: "#fe6263",
    alignItems: "center",
    justifyContent: "center",
    height: 64,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  imageBox: {
    flexDirection: "row",
    gap: 8,
    padding: 20,
    paddingVertical: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
});

export default FreeBoardUpdate;
