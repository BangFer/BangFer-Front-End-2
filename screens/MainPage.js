import { StatusBar } from 'expo-status-bar';
import BackGround from '../assets/Back1.png';
import TatcticsButtonImage from '../assets/Button1.png';
import BangusukTeamButtonImage from '../assets/Button2.png';
import FreeBoardButtonImage from '../assets/Button3.png';
import MypageButtonImage from '../assets/Button4.png';
import React from 'react';
import styled from 'styled-components';

import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Container = styled.View`
  flex: 1;
  flex-direction: column;
`;

const BackGroundView = styled.View`
  ${StyleSheet.absoluteFillObject};
  z-index: -1;
`;

const FirstView = styled.View`
  flex: 1;
`;

const SecondView = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ThirdView = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const FourthView = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const ForButtonInThirdView = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TitleText = styled.Text`
  font-size: 45px;
  font-weight: 600;
  color: black;
  text-decoration-line: underline;
`;

const BackGroundImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const TacticsAndBangusukTeamButton = styled.TouchableOpacity`
  padding-vertical: 15px;
  padding-horizontal: 15px;
  border-radius: 10px;
  width: 120px;
  height: 120px;
  margin: -5px;
`;

const FreeBoardAndMyPageButton = styled.TouchableOpacity`
  padding-vertical: 15px;
  padding-horizontal: 15px;
  border-radius: 10px;
  width: 120px;
  height: 120px;
  margin: -5px;
`;

const ButtonsImage = styled.Image`
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const MainPage = ({ navigation }) => {
  return (
    <Container>
      <StatusBar style="auto" />
      <BackGroundView>
        <BackGroundImage source={BackGround} resizeMode={'stretch'} />
      </BackGroundView>
      <FirstView></FirstView>
      <SecondView>
        <TitleText>BANGUSUK</TitleText>
        <TitleText>FERGUSON</TitleText>
      </SecondView>
      <ThirdView>
        <ForButtonInThirdView>
          <TacticsAndBangusukTeamButton
            onPress={() => navigation.navigate('Tactics')}
          >
            <ButtonsImage source={TatcticsButtonImage} resizeMode={'contain'} />
          </TacticsAndBangusukTeamButton>
          <TacticsAndBangusukTeamButton
            onPress={() => navigation.navigate('BanggusukTeam')}
          >
            <ButtonsImage
              source={BangusukTeamButtonImage}
              resizeMode={'contain'}
            />
          </TacticsAndBangusukTeamButton>
        </ForButtonInThirdView>
        <ForButtonInThirdView>
          <FreeBoardAndMyPageButton
            onPress={() => navigation.navigate('FreeBoard')}
          >
            <ButtonsImage
              source={FreeBoardButtonImage}
              resizeMode={'contain'}
            />
          </FreeBoardAndMyPageButton>
          <FreeBoardAndMyPageButton
            onPress={() => navigation.navigate('MyPage')}
          >
            <ButtonsImage source={MypageButtonImage} resizeMode={'contain'} />
          </FreeBoardAndMyPageButton>
        </ForButtonInThirdView>
      </ThirdView>
      <FourthView></FourthView>
    </Container>
  );
};

export default MainPage;
