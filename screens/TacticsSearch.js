import React, { useState } from "react";
import styled from "styled-components/native";
import { Ionicons } from '@expo/vector-icons';

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
  margin-top: 20px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  height: 30px;
  font-size: 14px;
`;

const SearchIcon = styled(Ionicons)`
  margin-right: 10px;
`;

const CancelButton = styled.TouchableOpacity`
  position: absolute; /* 절대 위치 설정 */
  top: 10px; /* 위쪽 여백 설정 */
  right: 10px; /* 오른쪽 여백 설정 */
`;

const CancelButtonText = styled.Text`

`;

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

const TacticsSearch = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    // 추후 검색 기능 구현
    console.log("검색어:", searchText);
  };

  return (
    <Container>

      <SearchView>
        <SearchIcon name="search" size={24} color="black" />
        <SearchInput
          placeholder="전술명, 내용"
          value={searchText}
          onChangeText={setSearchText}
        />
        <CancelButton onPress={() => navigation.goBack()}>
          <CancelButtonText>취소</CancelButtonText>
        </CancelButton>
      </SearchView>

      <CenterView>
        <BigIcon name="search" color="black" />
        <SearchText>전술 검색하기</SearchText>
      </CenterView>

    </Container>
  );
};

export default TacticsSearch;