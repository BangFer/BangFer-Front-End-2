import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const MyPage = ({ navigation }) => {
  return (
    <Container>
      <Text>MyPage</Text>
    </Container>
  );
};

export default MyPage;
