import React, { useState } from 'react';
import { View, TextInput, Keyboard, ScrollView, Dimensions } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  padding: 10px;
`;

const TacticContainer = styled.View`
  margin-bottom: 10px;
`;

const MainTacticBox = styled.View`
  border-radius: 15px;
  background-color: tomato;
  padding: 10px;
  height: 200px; /* 높이 조정 */
  width: ${Dimensions.get('window').width - 40}px; /* 화면 너비에서 20px를 뺀 값 */
  margin-right: 10px; /* 각 박스 간격 조정 */
`;

const SubTacticBox = styled.View`
  border-radius: 15px;
  background-color: blue;
  padding: 10px;
  height: 200px; /* 높이 조정 */
  width: ${Dimensions.get('window').width - 40}px; /* 화면 너비에서 20px를 뺀 값 */
  margin-right: 10px; /* 각 박스 간격 조정 */
  
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
  color: white;
`;

const TextBox = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: white;
  placeholderTextColor: white; /* 흰색으로 placeholder 텍스트 색상 설정 */
`;

const ButtonContainer = styled.View`
  position: absolute;
  top: 750px;
  right: 20px;

`;

const Button = styled.TouchableOpacity`
  background-color: black;
  border-radius: 10px;
  padding: 10px 20px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
`;

const NewTactic = ({ navigation }) => {
  const [text1, setText1] = useState('');

  const handleChangeText1 = (inputText) => {
    setText1(inputText);
  };

  const [text2, setText2] = useState('');

  const handleChangeText2 = (inputText) => {
    setText2(inputText);
  };


  const handleContainerPress = () => {
    Keyboard.dismiss(); // 박스 외부를 터치하면 입력 마무리
  };

  return (
    <Container>
      <TacticContainer>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
      >
    
        <MainTacticBox>
          <Title>메인전술</Title>
          <TextBox
            multiline={true}
            onChangeText={handleChangeText1}
            value={text1}
            placeholder="내용을 입력하세요..."
            textAlignVertical="top"
            style={{ paddingTop: 10 }}
            placeholderTextColor="white"
            autoFocus={false}
          />
        </MainTacticBox>

        <SubTacticBox>
          <Title>세부전술</Title>
          <TextBox
            multiline={true}
            onChangeText={handleChangeText2}
            value={text2}
            placeholder="내용을 입력하세요..."
            textAlignVertical="top"
            style={{ paddingTop: 10 }}
            placeholderTextColor="white"
            autoFocus={false}
          />
        </SubTacticBox>
      </ScrollView>
      </TacticContainer>
      
      <ButtonContainer>
        <Button onPress={() => console.log('register')}>
          <ButtonText>등록</ButtonText>
        </Button>
      </ButtonContainer>

    </Container>
  );
};

export default NewTactic;


