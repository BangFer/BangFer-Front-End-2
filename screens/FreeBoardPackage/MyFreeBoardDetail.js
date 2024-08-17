import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
  Keyboard,
  Modal, // 모달 추가
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import axios from 'axios';
import { getTokenFromLocal } from "../LoginPackage/TokenUtils";
import { FontAwesome5 } from "@expo/vector-icons";
import { Alert } from 'react-native';

// 신고 함수
const reportUser = async (reportedUserId, reportActivity) => {
  const token = await getTokenFromLocal();
  try {
    console.log(`Reporting user: ${reportedUserId} for activity: ${reportActivity}`);
    const response = await axios.post(
      `http://13.125.14.94:8080/report/user/${reportedUserId}?reportActivity=${reportActivity}`,
      {},  // 빈 객체를 body로 전송
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Authorization": "Bearer " + token.accessToken,
        },
      }
    );
    console.log("Report response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error reporting user:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

// 차단 함수
const blockUser = async (isBlockedUserId) => {
  const token = await getTokenFromLocal();
  try {
    const response = await axios.post(
      `http://13.125.14.94:8080/board/block/${isBlockedUserId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Authorization": "Bearer " + token.accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error blocking user:", error);
    throw error;
  }
};

const createReply = async (boardId, parentCommentId, commentText) => {
  const token = await getTokenFromLocal();
  try {
    const response = await axios.post(
      `http://13.125.14.94:8080/board/${boardId}/comment/${parentCommentId}`,
      { commentText },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Authorization": "Bearer " + token.accessToken,
        },
      }
    );
    return response.data.result;
  } catch (error) {
    console.error("Error creating reply:", error);
    throw error;
  }
};

const handleReply = async (parentCommentId, replyText) => {
  try {
    const newReply = await createReply(route.params.id, parentCommentId, replyText);
    setData(prevData => {
      const updatedComments = prevData.commentList.map(comment => {
        if (comment.commentId === parentCommentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        return comment;
      });
      return {
        ...prevData,
        commentList: updatedComments,
        commentCount: prevData.commentCount + 1
      };
    });
  } catch (error) {
    alert("대댓글 작성에 실패했습니다.");
  }
};

const deleteComment = async (commentId) => {
  const token = await getTokenFromLocal();
  try {
    const response = await axios.delete(
      `http://13.125.14.94:8080/board/comment/${commentId}`,
      {
        headers: {
          "Authorization": "Bearer " + token.accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

const GetBoardDetail = async (boardId) => {
  const token = await getTokenFromLocal();

  try {
    console.log("Requesting board detail for ID:", boardId);
    const response = await axios.get(
      `http://13.125.14.94:8080/board/${boardId}`,
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "Bearer " + token.accessToken,
        },
      }
    );

    console.log("Board detail response:", response.data);
    
    // 댓글과 대댓글 구조화
    const structuredComments = response.data.result.commentList.filter(comment => !comment.deleted).map(comment => ({
      ...comment,
      replies: comment.children.filter(reply => !reply.deleted)
    }));

    return {
      ...response.data.result,
      commentList: structuredComments
    };
  } catch (error) {
    console.error("Error fetching board detail:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    throw error;
  }
};

const UserInfo = ({ nickName }) => {
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
      <Text style={styles.userInfoText}>{nickName}</Text>
    </View>
  );
};

const toggleLike = async (boardId, setData) => {
  try {
    const token = await getTokenFromLocal();
    const response = await axios.post(
      `http://13.125.14.94:8080/board/${boardId}/like`,
      {},
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Authorization": "Bearer " + token.accessToken,
        },
      }
    );
    console.log(response.data.code)
    console.log(response.data.message)
    if (response.data.code == 'OK') {
      // 서버로부터 업데이트된 좋아요 정보를 받아옵니다
      const updatedLikeInfo = await GetBoardDetail(boardId);

      // 상태를 업데이트합니다
      setData(prevData => ({
        ...prevData,
        isLiked: updatedLikeInfo.isLiked,
        likeCount: updatedLikeInfo.likeCount
      }));

      // 게시글 데이터를 다시 받아와서 상태를 업데이트합니다
      // const updatedBoardData = await GetBoardDetail(boardId);
      // setData(updatedBoardData);
      
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    if (error.response) {
      alert("좋아요 처리 실패: " + error.response.data.message);
    } else if (error.request) {
      alert("서버로부터 응답이 없습니다. 네트워크 연결을 확인해주세요.");
    } else {
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  }
};



const CommentItem = ({ data, onReply, onDelete, isOwnComment, boardId, showActionSheetWithOptions, setReplyingTo, token }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReplyPress = () => {
    Alert.alert(
      "대댓글",
      "대댓글을 다시겠습니까?",
      [
        {
          text: "아니오",
          style: "cancel"
        },
        { 
          text: "예", 
          onPress: () => {
            setReplyingTo(data.commentId);
          }
        }
      ]
    );
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      onReply(data.commentId, replyText);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  const handleMorePress = () => {
    const reportOptions = [
      "욕설/비하",
      "음란물/불건전한 만남 및 대화",
      "정치적 발언",
      "사칭",
      "상업적 광고 및 판매",
    ];

    const reportActivities = [
      "CURSING",
      "OBSCENE",
      "POLITICAL",
      "IMPOSTOR",
      "COMMERCIAL",
    ];

    const options = ["신고", "차단"];
    if (isOwnComment(data.userId)) {
      options.push("삭제");
    }
    options.push("취소");

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        destructiveButtonIndex: isOwnComment(data.userId) ? 2 : -1,
      },
      async (selectedIndex) => {
        switch (selectedIndex) {
          case 0: // 신고
            showActionSheetWithOptions(
              {
                options: [...reportOptions, "취소"],
                cancelButtonIndex: reportOptions.length,
              },
              async (reportIndex) => {
                if (reportIndex !== reportOptions.length) {
                  try {
                    const result = await reportUser(data.userId, reportActivities[reportIndex]);
                    alert("신고가 접수되었습니다.");
                  } catch (error) {
                    alert("신고 처리 중 오류가 발생했습니다.");
                  }
                }
              }
            );
            break;
          case 1: // 차단
            try {
              const result = await blockUser(data.userId);
              alert("사용자가 차단되었습니다.");
            } catch (error) {
              alert("차단 처리 중 오류가 발생했습니다.");
            }
            break;
          case 2: // 삭제
            if (isOwnComment(data.userId)) {
              onDelete(data.commentId);
            }
            break;
        }
      }
    );
  };

  return (
    <View style={styles.commentBox}>
      <View style={styles.commentHeader}>
        <UserInfo nickName={data.nickName} />
        <View style={styles.commentButtons}>
          <Pressable onPress={handleReplyPress} style={styles.replyButton}>
            <FontAwesome5 name="comment-dots" size={16} color="#fe6263" />
          </Pressable>
          <Pressable onPress={handleMorePress} style={styles.moreButton}>
            <Entypo name="dots-three-vertical" size={16} color="black" />
          </Pressable>
        </View>
      </View>
      <View style={{ marginTop: 8 }}>
        <Text style={styles.contents}>{data.commentText}</Text>
      </View>
      {showReplyInput && (
        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.replyInput}
            value={replyText}
            onChangeText={setReplyText}
            placeholder="대댓글을 입력하세요"
          />
          <Pressable onPress={handleSendReply} style={styles.sendReplyButton}>
            <Text>보내기</Text>
          </Pressable>
        </View>
      )}
      {data.replies && data.replies.map(reply => (
        <ReCommentItem
          key={`reply-${reply.commentId}`}
          data={reply}
          onDelete={onDelete}
          isOwnComment={isOwnComment}
          showActionSheetWithOptions={showActionSheetWithOptions}
          token={token}
        />
      ))}
    </View>
  );
};

const ReCommentItem = ({ data, onDelete, isOwnComment, showActionSheetWithOptions, token }) => {
  const handleMorePress = () => {
    const reportOptions = [
      "욕설/비하",
      "음란물/불건전한 만남 및 대화",
      "정치적 발언",
      "사칭",
      "상업적 광고 및 판매",
    ];

    const reportActivities = [
      "CURSING",
      "OBSCENE",
      "POLITICAL",
      "IMPOSTOR",
      "COMMERCIAL",
    ];

    const options = ["신고", "차단"];
    if (isOwnComment(data.userId)) {
      options.push("삭제");
    }
    options.push("취소");

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        destructiveButtonIndex: isOwnComment(data.userId) ? 2 : -1,
      },
      async (selectedIndex) => {
        switch (selectedIndex) {
          case 0: // 신고
            showActionSheetWithOptions(
              {
                options: [...reportOptions, "취소"],
                cancelButtonIndex: reportOptions.length,
              },
              async (reportIndex) => {
                if (reportIndex !== reportOptions.length) {
                  try {
                    const result = await reportUser(data.userId, reportActivities[reportIndex]);
                    alert("신고가 접수되었습니다.");
                  } catch (error) {
                    alert("신고 처리 중 오류가 발생했습니다.");
                  }
                }
              }
            );
            break;
          case 1: // 차단
            try {
              const result = await blockUser(data.userId);
              alert("사용자가 차단되었습니다.");
            } catch (error) {
              alert("차단 처리 중 오류가 발생했습니다.");
            }
            break;
          case 2: // 삭제
            if (isOwnComment(data.userId)) {
              onDelete(data.commentId);
            }
            break;
        }
      }
    );
  };

  return (
    <View style={[styles.commentBox, styles.reCommentBox]}>
      <View style={styles.commentHeader}>
        <UserInfo nickName={data.nickName} />
        <Pressable onPress={handleMorePress} style={styles.replymoreButton}>
          <Entypo name="dots-three-vertical" size={16} color="black" />
        </Pressable>
      </View>
      <View style={{ marginTop: 8 }}>
        <Text style={styles.contents}>{data.commentText}</Text>
      </View>
    </View>
  );
};

const MyFreeBoardDetail = ({ navigation, route }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태 추가
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 상태 추가
  const [token, setToken] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);


  const { showActionSheetWithOptions } = useActionSheet();

  const handleReport = async (reportActivity) => {
    try {
      const result = await reportUser(data.writerId, reportActivity);
      alert("신고가 접수되었습니다.");
    } catch (error) {
      alert("신고 처리 중 오류가 발생했습니다.");
    }
  };
  
  const handleBlock = async () => {
    try {
      const result = await blockUser(data.writerId);
      alert("사용자가 차단되었습니다.");
    } catch (error) {
      alert("차단 처리 중 오류가 발생했습니다.");
    }
  };
  
  const onPress = useCallback(() => {
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
        switch (selectedIndex) {
          case 0:
            handleEdit(data.id);
            break;
          case destructiveButtonIndex:
            handleDelete(data.id);
            break;
          case cancelButtonIndex:
            // Canceled
            break;
        }
      }
    );
  }, [data, handleEdit, handleDelete, showActionSheetWithOptions]);


  const handleEdit = useCallback((boardId) => {
    navigation.navigate("FreeBoardUpdate", { id: boardId });
  }, [navigation]);

 const handleDelete = useCallback(async (boardId) => {
    try {
      const token = await getTokenFromLocal();
      const response = await axios.delete(
        `http://13.125.14.94:8080/board/${boardId}`,
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + token.accessToken,
          },
        }
      );

      if (response.data.code === 'No Content') {
        alert("게시글이 삭제되었습니다.");
        navigation.navigate("MyFreeBoard");
      } else {
        alert("게시글 삭제에 실패했습니다: " + response.data.message);
      }
    } catch (error) {
      console.error("Error deleting board:", error);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={onPress}>
          <Entypo name="dots-three-vertical" size={16} color="black" />
        </Pressable>
      ),
    });
  }, [navigation, onPress]);

  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await getTokenFromLocal();
      setToken(fetchedToken);
    };
    fetchToken();
  }, []);

  const isOwnComment = (commentUserId) => {
    return token && commentUserId === token.userId;
  };

  const renderCommentItem = ({ item }) => (
    <CommentItem
      data={item}
      onReply={handleReply}
      onDelete={handleDeleteComment}
      isOwnComment={isOwnComment}
      boardId={route.params.id}
      showActionSheetWithOptions={showActionSheetWithOptions}
      setReplyingTo={setReplyingTo}
      token={token}
    />
  );

  const handlePressSendComment = async () => {
    if (!commentText.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }
  
    try {
      const token = await getTokenFromLocal();
      let response;
      
      if (replyingTo) {
        // 대댓글 작성
        response = await axios.post(
          `http://13.125.14.94:8080/board/${route.params.id}/comment/${replyingTo}`,
          { commentText: commentText.trim() },
          {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              "Authorization": "Bearer " + token.accessToken,
            },
          }
        );
      } else {
        // 일반 댓글 작성
        response = await axios.post(
          `http://13.125.14.94:8080/board/${route.params.id}/comment`,
          { commentText: commentText.trim() },
          {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              "Authorization": "Bearer " + token.accessToken,
            },
          }
        );
      }
  
      if (response.data.code === 'OK') {
        const newComment = response.data.result;
        setData(prevData => {
          let updatedCommentList;
          if (replyingTo) {
            // 대댓글 추가
            updatedCommentList = prevData.commentList.map(comment => 
              comment.commentId === replyingTo
                ? { 
                    ...comment, 
                    replies: [
                      ...(comment.replies || []), 
                      {...newComment, parentCommentId: replyingTo}
                    ] 
                  }
                : comment
            );
          } else {
            // 일반 댓글 추가
            updatedCommentList = [...prevData.commentList, {...newComment, replies: []}];
          }
          return {
            ...prevData,
            commentList: updatedCommentList,
            commentCount: prevData.commentCount + 1
          };
        });
  
        setCommentText("");
        setReplyingTo(null);
        Keyboard.dismiss();
      } else {
        alert("댓글 등록에 실패했습니다: " + response.data.message);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      // 에러 처리 로직...
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setData(prevData => {
        const updatedComments = prevData.commentList.map(comment => {
          if (comment.commentId === commentId) {
            return { ...comment, deleted: true, commentText: "삭제된 댓글입니다." };
          }
          if (comment.replies) {
            const updatedReplies = comment.replies.map(reply => {
              if (reply.commentId === commentId) {
                return { ...reply, deleted: true, commentText: "삭제된 댓글입니다." };
              }
              return reply;
            });
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        });
        return {
          ...prevData,
          commentList: updatedComments,
        };
      });
      alert("댓글이 삭제되었습니다.");
    } catch (error) {
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        console.log("Fetching board detail for ID:", route.params.id);
        const boardData = await GetBoardDetail(route.params.id);
        console.log("Fetched board data:", boardData);
        setData(boardData);
      } catch (error) {
        console.error("Error fetching board detail:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBoardDetail();
  }, [route.params.id]);

  // 이미지 클릭 핸들러 추가
  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
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

  const handleReplyPress = (commentId) => {
    Alert.alert(
      "대댓글",
      "대댓글을 다시겠습니까?",
      [
        {
          text: "아니오",
          style: "cancel"
        },
        { 
          text: "예", 
          onPress: () => {
            setReplyingTo(commentId);
            setCommentText(`@${data.nickName} `);
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  }

  if (!data) return <Text>데이터를 불러오는데 실패했습니다.</Text>;

  const handleToggleLike = () => {
    toggleLike(data.id, setData);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["bottom", "right", "left"]}
    >
      <FlatList
        style={{ flex: 1 }}
        ListHeaderComponent={
          <View style={styles.itemContainer}>
            <UserInfo nickName={data.writerNickName} />
            <View style={{ marginTop: 12 }}>
              <Text style={styles.title}>{data.boardTitle}</Text>
              <Text style={styles.contents}>{data.boardContent}</Text>

              {data.images?.length > 0 && (
                <View style={styles.imageBox}>
                  {data.images.map((image, index) => (
                    <Pressable key={image.imageId} onPress={() => handleImagePress(image.boardImageUrl)}>
                      <Image
                        style={styles.image}
                        source={{ uri: image.boardImageUrl }}
                      />
                    </Pressable>
                  ))}
                </View>
              )}

              <View style={[styles.bar, { marginTop: 20 }]} />
              <View style={styles.buttonBox}>
                  <FontAwesome5 name="comment-dots" size={16} color="#fe6263" marginRight={5}/>
                  <Text style={{ color: "#666", fontSize: 14 }}>
                    {data.commentCount}
                  </Text>
                <View style={styles.button}>
                  <FontAwesome5 name="thumbs-up" size={16} color="#fe6263" marginLeft={15} />
                  <Text style={{ color: "#666", fontSize: 14 }}>
                    {data.likeCount}
                  </Text>
                </View>
                <Pressable
                  style={[styles.button, styles.likeButton]}
                  onPress={handleToggleLike}
                >
                  <AntDesign
                    name={data.isLiked ? "heart" : "hearto"}
                    size={16}
                    color={data.isLiked ? "#fe6263" : "#666"}
                    marginLeft={235}
                  />
                  <Text style={{ color: "#666", fontSize: 12, marginLeft: 0 }}>
                    좋아요
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        }
        data={data.commentList}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text>댓글이 없습니다.</Text>
          </View>
        }
        renderItem={renderCommentItem}
        keyExtractor={(item) => `comment-${item.commentId}`}
        />
   <View style={styles.commentInputContainer}>
  <TextInput
    placeholder={replyingTo ? "대댓글을 입력하세요." : "댓글을 입력하세요."}
    style={styles.commentInput}
    value={commentText}
    onChangeText={setCommentText}
  />
  <Pressable style={styles.sendButton} onPress={handlePressSendComment}>
    <Entypo name="triangle-right" size={24} color="tomato" />
  </Pressable>
  {replyingTo && (
    <Pressable style={styles.cancelReplyButton} onPress={() => {
      setReplyingTo(null);
      setCommentText("");
    }}>
      <Text style={styles.cancelReplyText}>취소</Text>
    </Pressable>
  )}
</View>

      {/* 이미지 확대를 위한 모달 추가 */}
      {selectedImage && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Image
              style={styles.modalImage}
              source={{ uri: selectedImage }}
              resizeMode="contain"
            />
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>닫기</Text>
            </Pressable>
          </View>
        </Modal>
      )}
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
    width: 160, // 이미지의 너비를 160으로 설정
    height: 160, // 이미지의 높이를 160으로 설정
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
  reCommentBox: {
    marginLeft: 20,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentButtons: {
    flexDirection: 'row',
  },
  replyButton: {
    padding: 5,
    marginRight: 5,
  },
  moreButton: {
    padding: 5,
  },
  replymoreButton: {
    padding: 5,
    marginRight: -20,
  },
  replyInputContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 5,
  },
  sendReplyButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginLeft: 5,
    backgroundColor: '#fe6263',
    borderRadius: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentInputContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderTopColor: "#ddd",
    borderTopWidth: 1,
  },
  sendButton: {
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)", // 배경을 어둡게 설정
  },
  modalImage: {
    width: "90%",
    height: "80%",
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "tomato",
    borderRadius: 8,
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 18,
  },
  cancelReplyButton: {
    padding: 10,
    marginLeft: 10,
  },
  cancelReplyText: {
    color: 'tomato',
  },
});

export default MyFreeBoardDetail;
