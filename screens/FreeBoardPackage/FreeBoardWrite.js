import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImageLibrary from "react-native-image-picker";
import uuid from "react-native-uuid";
import { useBoardStore } from "../../store/board";
import axios from 'axios';
import { getTokenFromLocal } from "../LoginPackage/TokenUtils";
import { useMutation } from 'react-query';

const MAX_TITLE_LENGTH = 100;
const MAX_CONTENT_LENGTH = 1000;



const requestWrite = async ({ title, contents, images }) => {
  
  const token = await getTokenFromLocal();

  try {
    const headers = {
      "Content-Type": "multipart/form-data",
      "Authorization": "Bearer " + token.accessToken,
    };

    let formData = new FormData();
    const requestDto = {
      boardTitle : title,
      boardContent : contents,
    }
    formData.append("request", JSON.stringify(requestDto))

    if (images && images.length > 0) {
      images.forEach((image, index) => {
        formData.append("image", {
          uri: image.uri,
          name: `image${index}.jpg`,
          type: image.type || "image/jpeg",
        });
      });
    }

    console.log('FormData contents:', { boardTitle: title, boardContent: contents });
    if (images && images.length > 0) {
      console.log('Images count:', images.length);
    }

    const response = await axios.post(
      "http://13.125.14.94:8080/board", 
      formData, 
      { 
        headers : headers,
      }
      );
    
      return response.data;
  } catch (error) {
    console.error("Error details:", error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      throw new Error(`서버 오류: ${error.response.status} - ${error.response.data.message}`);
    } else if (error.request) {
      console.error('Request:', error.request);
      throw new Error("서버로부터 응답이 없습니다. 네트워크 연결을 확인해주세요.");
    } else {
      console.error('Error message:', error.message);
      throw new Error(`요청 오류: ${error.message}`);
    }
  }
};

const FreeBoardWrite = ({ navigation }) => {
  const contentInputRef = useRef();
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const addBoard = useBoardStore((state) => state.addBoard);

  const { mutate: requestWriteMutate } = useMutation(requestWrite, {
    onSuccess: (data) => {
      console.log("성공", data);
      const boardId = data.result.id; 
      addBoard({
        _id: boardId,
        title,
        contents,
        categories: [],
        files,
        comments: [],
      });
      navigation.replace("FreeBoardDetail", { id: boardId }); 
    },
    onError: (error) => {
      console.error("Error in mutation:", error);
      Alert.alert("오류", error.message || "알 수 없는 오류가 발생했습니다.");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handlePressSubmitForm = () => {
    if (!title.trim()) {
      Alert.alert("오류", "제목을 입력해주세요.");
      return;
    }
    if (!contents.trim()) {
      Alert.alert("오류", "내용을 입력해주세요.");
      return;
    }

    requestWriteMutate({
      title: title.trim(),
      contents: contents.trim(),
      images: files,
    });
  };

  const handleImagePicker = useCallback(() => {
    ImageLibrary.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else if (response.assets && response.assets.length > 0) {
        setFiles(prevFiles => [...prevFiles, response.assets[0]]);
      }
    });
  }, []);

  const removeImage = useCallback((index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={{ flex: 1 }}>
        <TextInput
          style={styles.title}
          placeholder="제목"
          textAlignVertical="top"
          value={title}
          onChangeText={setTitle}
          maxLength={MAX_TITLE_LENGTH}
          accessibilityLabel="제목 입력"
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
            multiline
            value={contents}
            onChangeText={setContents}
            maxLength={MAX_CONTENT_LENGTH}
            accessibilityLabel="내용 입력"
          />
        </View>
        <View style={styles.imageBox}>
          {files.map((file, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{ uri: file.uri }}
                accessibilityLabel={`선택된 이미지 ${index + 1}`}
              />
              <Pressable
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
                accessibilityLabel={`이미지 ${index + 1} 삭제`}
              >
                <AntDesign name="close" size={20} color="#fff" />
              </Pressable>
            </View>
          ))}
        </View>
        <View style={styles.bar} />
        <View style={styles.buttonBox}>
          <Pressable
            style={styles.button}
            onPress={handleImagePicker}
            accessibilityLabel="이미지 추가"
          >
            <AntDesign name="picture" size={24} color="#666" />
            <Text style={styles.buttonText}>사진</Text>
          </Pressable>
        </View>
      </View>
      <Pressable
        onPress={handlePressSubmitForm}
        style={styles.submitButton}
        disabled={isLoading}
        accessibilityLabel="게시글 작성 완료"
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>완료</Text>
        )}
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
  imageBox: {
    flexDirection: "row",
    gap: 8,
    padding: 20,
    paddingVertical: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  buttonText: {
    color: "#666",
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
  imageContainer: {
    position: 'relative',
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FreeBoardWrite;
