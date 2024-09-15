import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { getTokenFromLocal } from "../LoginPackage/TokenUtils";

const BlockListModal = ({ isVisible, onClose }) => {
    const [blockedUsers, setBlockedUsers] = useState([]);

    useEffect(() => {
        if (isVisible) {
            fetchBlockedUsers();
        }
    }, [isVisible]);

    const fetchBlockedUsers = async () => {
        const Token = await getTokenFromLocal();
        try {
            const response = await axios.get('http://13.125.14.94:8080/board/blocked-users', {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": "Bearer " + Token.accessToken,
                }
            });

            console.log('API Response:', response.data);

            if (response.data && Array.isArray(response.data.result)) {
                const users = response.data.result;
                const usersWithImages = await Promise.all(users.map(async (user) => {
                    if (!user.id) {
                        console.error('유효하지 않은 사용자 ID:', user);
                        return { ...user, profileImageUrl: null };
                    }
                    try {
                        const profileResponse = await axios.get(`http://13.125.14.94:8080/accounts/profile/${user.isBlockedUser}`, {
                            headers: {
                                "Content-type": "application/json; charset=UTF-8",
                                "Authorization": "Bearer " + Token.accessToken,
                            }
                        });
                        return { ...user, profileImageUrl: profileResponse.data.result?.profileImageUrl || null };
                    } catch (error) {
                        console.error('프로필 이미지를 가져오는 중 오류 발생:', error.response?.data || error.message);
                        return { ...user, profileImageUrl: null };
                    }
                }));
                setBlockedUsers(usersWithImages);
            } else {
                console.error('유효하지 않은 응답 데이터:', response.data);
                Alert.alert('오류', '차단된 사용자 목록을 가져오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('차단된 사용자 목록을 가져오는 중 오류 발생:', error.response?.data || error.message);
            Alert.alert('오류', '차단된 사용자 목록을 가져오는데 실패했습니다.');
        }
    };

    const handleUnblock = async (userId) => {
        const Token = await getTokenFromLocal();
        try {
            if (!userId) {
                console.error('유효하지 않은 사용자 ID:', userId);
                return;
            }
            await axios.delete(`http://13.125.14.94:8080/board/block/${userId}`, {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": "Bearer " + Token.accessToken,
                }
            });
            fetchBlockedUsers(); // 차단 해제 후 목록 새로고침
        } catch (error) {
            console.error('사용자 차단 해제 중 오류 발생:', error.response?.data || error.message);
            Alert.alert('오류', '사용자 차단 해제에 실패했습니다.');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image
                source={item.profileImageUrl ? { uri: item.profileImageUrl } : require('../../assets/profileimg.jpg')}
                style={styles.profileImage}
            />
            <Text style={styles.nickName}>{item.nickName}</Text>
            <TouchableOpacity onPress={() => handleUnblock(item.isBlockedUser)} style={styles.unblockButton}>
                <Text style={styles.unblockButtonText}>차단 해제</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>차단된 사용자</Text>
                    {blockedUsers.length > 0 ? (
                        <FlatList
                            data={blockedUsers}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                            style={styles.list}
                        />
                    ) : (
                        <Text style={styles.noUsersText}>차단된 사용자가 없습니다.</Text>
                    )}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: '80%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    list: {
        maxHeight: 300,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    nickName: {
        flex: 1,
        fontSize: 16,
    },
    unblockButton: {
        backgroundColor: '#FFB056',
        padding: 8,
        borderRadius: 5,
    },
    unblockButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#FFB056',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'center',
    },
    closeButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    noUsersText: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16,
    },
});

export default BlockListModal;