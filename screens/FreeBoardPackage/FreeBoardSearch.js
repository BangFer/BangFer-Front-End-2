import React, { useState } from "react";
import styled from "styled-components/native";
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { getTokenFromLocal } from "../LoginPackage/TokenUtils";
import { Alert } from 'react-native';

const Container = styled.View`
  flex: 1;
  padding: 10px;
  background-color: #FFFFFF;
`;

const SearchView = styled.View`
  flex-direction: row;
  align-items: center;
  border-radius: 10px; /* 둥근 외각선을 위한 속성 */
  border-width: 1px;
  border-color: #CCCCCC;
  padding: 5px 10px; /* 내부 여백 설정 */
  margin-top: 5px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  height: 30px;
  font-size: 14px;
`;

const SearchIcon = styled(Ionicons)`
  margin-right: 10px;
`;

const SearchButton = styled.TouchableOpacity`
  position: absolute; /* 절대 위치 설정 */
  top: 10px; /* 위쪽 여백 설정 */
  right: 10px; /* 오른쪽 여백 설정 */
`;

const SearchButtonText = styled.Text``;

const CenterView = styled.View`
  align-items: center;
  margin-top: 320px;
`;

const BigIcon = styled(Ionicons)`
  font-size: 72px;
  color: gray;
`;

const SearchText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: gray;
`;

const FreeBoardSearch = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = async () => {
    try {
      const token = await getTokenFromLocal();
      const response = await axios.get(`http://13.125.14.94:8080/board/search`, {
        params: {
          title: searchText,
          page: 0,
          size: 10
        },
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token.accessToken
        }
      });

      if (response.data.code === 'OK') {
        navigation.navigate('FreeBoardSearchResult', { 
          searchResults: response.data.result,
          searchText: searchText
        });
      } else {
        Alert.alert("검색에 실패했습니다: " + response.data.message);
      }
    } catch (error) {
      console.error("Error searching board:", error);
      Alert.alert("검색 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <SearchView>
        <SearchIcon name="search" size={24} color="black" />
        <SearchInput
          placeholder="글 제목, 내용"
          value={searchText}
          onChangeText={setSearchText}
        />
        <SearchButton onPress={handleSearch}>
          <SearchButtonText>검색</SearchButtonText>
        </SearchButton>
      </SearchView>

      <CenterView>
        <BigIcon name="search" color="black" />
        <SearchText>게시글 검색하기</SearchText>
      </CenterView>
    </Container>
  );
};

export default FreeBoardSearch;
