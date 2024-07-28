import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { FlatList, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { useInfiniteQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import { tacticsFilterState } from './atom'
import { fetchTactics } from './api';
import { saveFilter, loadFilter } from './storage';

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: #F5F5F5;
`;

const FirstView = styled.View`
  padding: 1px;
`;

const SecondView = styled.View`
  height: 1px;
  background-color: black;
  margin-vertical: 10px;
  margin-horizontal: 10px;
`;

const HitsRankButton = styled.TouchableOpacity`
  padding: 5px 5px;
  border-radius: 5px;
  background-color: tomato;
  margin-left: 10px;
`;

const ThumbsRankButton = styled.TouchableOpacity`
  padding: 5px 5px;
  border-radius: 5px;
  background-color: tomato;
  margin-left: 10px;
`;

const CommentsRankButton = styled.TouchableOpacity`
  padding: 5px 5px;
  border-radius: 5px;
  background-color: tomato;
  margin-left: 10px;
`;

const FormationButton = styled.View`
  padding: 5px 5px;
  border-radius: 5px;
  background-color: tomato;
  margin-left: 10px;
`;

const IconAndButtonsInFirstView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-top: 10px;
  margin-right: 10px;
`;

const RankIconInFirstView = styled.View`
  flex-direction: row;
  margin-top: 5px;
  margin-right: 85px;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: black;
`;

const Line = styled.View`
  flex: 1;
  height: 1px;
  background-color: black;
  margin-horizontal: 5px;
`;

const LineForList = styled.View`
  flex: 1;
  height: 1px;
  background-color: black;
  margin-top: 5px;
`;

const ItemContainer = styled.TouchableOpacity`
  padding-horizontal: 10px;
`;

const ItemContent = styled.View`
  flex-direction: column;
  margin-left: 5px;
`;

const ItemTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const ItemText = styled.Text`
  font-size: 16px;
  margin-right: 10px;
`;

const ItemIcon = styled(Ionicons)`
  margin-top: 2px;
  margin-right: 2px;
`;

const InformationView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const LoadingIndicator = styled(ActivityIndicator)`
  margin-vertical: 20px;
`;

const Tactics = ({ navigation }) => {
  const [filter, setFilter] = useRecoilState(tacticsFilterState);

  useEffect(() => {
    loadFilter().then(savedFilter => {
      if (savedFilter) setFilter(savedFilter);
    });
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    refetch,
    isError
  } = useInfiniteQuery({
    queryKey: ['tactics', filter],
    queryFn: ({ pageParam = 0 }) => fetchTactics({ ...filter, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.number < lastPage.totalPages - 1) return lastPage.number + 1;
      return undefined;
    },
  });

  const loadMore = () => {
    if (hasNextPage) fetchNextPage();
  };

  const tactics = data ? data.pages.flatMap(page => page.content) : [];

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return <ErrorMessage message="데이터를 불러오는 데 실패했습니다." />;
  }

  if (tactics.length === 0) {
    return <EmptyState message="아직 게시된 전술이 없습니다." />;
  }

  const updateFilter = (newFilter) => {
    setFilter(newFilter);
    saveFilter(newFilter);
    refetch();
  };

  const sortByHits = () => updateFilter({ ...filter, sort: 'hits,desc' });
  const sortByLikes = () => updateFilter({ ...filter, sort: 'likes,desc' });
  const sortByComments = () => updateFilter({ ...filter, sort: 'comments,desc' });
  const filterByFormation = (formation) => updateFilter({ ...filter, formation });

  const renderItem = ({ item }) => (
    <ListItem
      title={item.tacticName}
      description={item.famousCoachName}
      number={item.tacticId}
      formation={item.mainFormation}
      name={item.nickname}
      onPress={() => navigation.navigate('TacticDetail', { tacticId: item.tacticId })}
    />
  );

  return (
    <Container>
      <StatusBar style="auto" />
      
      <FirstView>
        <IconAndButtonsInFirstView>
          <RankIconInFirstView>
            <FontAwesome6 name="ranking-star" size={24} color="tomato" />
          </RankIconInFirstView>
          <HitsRankButton onPress={sortByHits}>
            <ButtonText>조회순</ButtonText>
          </HitsRankButton>
          <ThumbsRankButton onPress={sortByLikes}>
            <ButtonText>좋아요순</ButtonText>
          </ThumbsRankButton>
          <CommentsRankButton onPress={sortByComments}>
            <ButtonText>댓글순</ButtonText>
          </CommentsRankButton>
          <Menu>
            <MenuTrigger>
              <FormationButton>
                <ButtonText>포메이션</ButtonText>
              </FormationButton>
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onPress={() => filterByFormation('4-4-2')} text='4-4-2' />
              <MenuOption onPress={() => filterByFormation('4-3-3')} text='4-3-3' />
              <MenuOption onPress={() => filterByFormation('4-3-2-1')} text='4-3-2-1' />
              <MenuOption onPress={() => filterByFormation('4-2-3-1')} text='4-2-3-1' />
              <MenuOption onPress={() => filterByFormation('3-4-3')} text='3-4-3' />
              <MenuOption onPress={() => filterByFormation('3-5-2')} text='3-5-2' />
              <MenuOption onPress={() => filterByFormation('3-2-4-1')} text='3-2-4-1' />
            </MenuOptions>
          </Menu>
        </IconAndButtonsInFirstView>
      </FirstView>

      <SecondView>
        <Line />
      </SecondView>

      <FlatList
        data={tactics}
        renderItem={renderItem}
        keyExtractor={item => item.tacticId.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={isFetching && <LoadingIndicator />}
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </Container>
  );
};

const ListItem = ({ title, description, number, formation, name, onPress }) => (
  <ItemContainer onPress={onPress}>
    <ItemContent>
      <ItemTitle>{title}</ItemTitle>
      <ItemText>{description}</ItemText>
      <InformationView>
        <ItemIcon name={"chatbubble-outline"} size={14} color="blue" />
        <ItemText>{number}</ItemText>
        <ItemText>{formation}</ItemText>
        <ItemText>{name}</ItemText>
      </InformationView>
    </ItemContent>
    <LineForList />
  </ItemContainer>
);

export default Tactics;
