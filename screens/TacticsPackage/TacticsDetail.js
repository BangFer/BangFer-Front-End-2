import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchTacticDetail } from './api';
import styled from 'styled-components/native';

const Container = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const DetailText = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
`;

const TacticDetail = ({ route }) => {
  const { tacticId } = route.params;
  
  const { data: tactic, isLoading, isError } = useQuery({
    queryKey: ['tacticDetail', tacticId],
    queryFn: () => fetchTacticDetail(tacticId),
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading tactic details</Text>;

  return (
    <Container>
      <Title>{tactic.tacticName}</Title>
      <DetailText>Coach: {tactic.famousCoachName}</DetailText>
      <DetailText>Formation: {tactic.mainFormation}</DetailText>
      <DetailText>Author: {tactic.nickname}</DetailText>
      {/* 여기에 전술 상세 정보를 더 추가할 수 있습니다 */}
    </Container>
  );
};

export default TacticDetail;
