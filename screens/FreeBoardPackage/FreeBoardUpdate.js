import React, { useState, useEffect } from "react";
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
import { useBoardStore } from "../../store/board";
import axios from 'axios';
import { getTokenFromLocal } from "../LoginPackage/TokenUtils";
import FormData from 'form-data';

const FreeBoardUpdate = ({ navigation, route }) => {
  const boards = useBoardStore((state) => state.boards);

  useEffect(() => {
    const fetchBoardData = async () => {
      if (!route.params?.id) {
        navigation.replace("FreeBoard");
        return;
      }

      try {
        const token = await getTokenFromLocal();
        const response = await axios.get(
          `http://13.125.14.94:8080/board/${route.params.id}`,
          {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              "Authorization": "Bearer " + token.accessToken,
            },
          }
        );

        if (response.data.code === 'OK') {
          const data = response.data.result;
          setTitle(data.boardTitle);
          setContents(data.boardContent);
          setFiles(data.images?.map(img => img.boardImageUrl) || []);
        } else {
          alert("게시글 정보를 불러오는데 실패했습니다.");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error fetching board data:", error);
        alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
        navigation.goBack();
      }
    };

    fetchBoardData();
  }, [route.params?.id]);

  const contentInputRef = React.useRef();

  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [files, setFiles] = useState([]);

  const updateBoard = useBoardStore((state) => state.updateBoard);

  const handlePressSubmitForm = async () => {
    if (title.trim() === "") {
      Alert.alert("제목을 입력해주세요.");
      return;
    }
  
    if (contents.trim() === "") {
      Alert.alert("내용을 입력해주세요.");
      return;
    }
  
    try {
      const token = await getTokenFromLocal();
      const formData = new FormData();
  
      // 요청 DTO 생성
      const requestDto = {
        boardTitle: title,
        boardContent: contents,
      };
  
      // 요청 DTO를 JSON 문자열로 변환하여 추가
      formData.append("request", JSON.stringify(requestDto));
  
      // 파일 추가
      files.forEach((file, index) => {
        formData.append("image", {
          uri: file,
          type: 'image/jpeg', // 실제 파일 타입에 맞게 조정
          name: `image${index}.jpg`
        });
      });
  
      console.log('FormData contents:', { boardTitle: title, boardContent: contents });
      if (files.length > 0) {
        console.log('Images count:', files.length);
      }
  
      const response = await axios.put(
        `http://13.125.14.94:8080/board/${route.params.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': "Bearer " + token.accessToken,
          },
        }
      );
  
      if (response.data.code === 'OK') {
        Alert.alert("게시글이 성공적으로 수정되었습니다.");
        navigation.goBack();
      } else {
        Alert.alert("게시글 수정에 실패했습니다: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating board:", error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        Alert.alert(`서버 오류: ${error.response.status} - ${error.response.data.message}`);
      } else if (error.request) {
        console.error('Request:', error.request);
        Alert.alert("서버로부터 응답이 없습니다. 네트워크 연결을 확인해주세요.");
      } else {
        console.error('Error message:', error.message);
        Alert.alert(`요청 오류: ${error.message}`);
      }
    }
  };

  const handleRemoveImage = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

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
              <View key={index} style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={{ uri: file }}
                />
                <Pressable style={styles.removeButton} onPress={() => handleRemoveImage(index)}>
                  <AntDesign name="closecircle" size={24} color="tomato" />
                </Pressable>
              </View>
            ))}
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
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
  },
  imageBox: {
    flexDirection: "row",
    gap: 8,
    padding: 20,
    paddingVertical: 12,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
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
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
});

export default FreeBoardUpdate;
