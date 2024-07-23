import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

import MainPage from '../screens/MainPage';
import FreeBoard from '../screens/FreeBoardPackage/FreeBoard';
import FreeBoardDetail from '../screens/FreeBoardPackage/FreeBoardDetail';
import FreeBoardWrite from '../screens/FreeBoardPackage/FreeBoardWrite';
import FreeBoardUpdate from '../screens/FreeBoardPackage/FreeBoardUpdate';
import FreeBoardSearch from '../screens/FreeBoardPackage/FreeBoardSearch';
import MyFreeBoard from '../screens/FreeBoardPackage/MyFreeBoard';
import MyPage from '../screens/MyPagePackage/MyPage';
import BanggusukTeam from '../screens/BanggusukTeamPackage/BanggusukTeam';
import UserPlusBanggusukTeam from '../screens/BanggusukTeamPackage/UserPlusBanggusukTeam';
import Tactics from '../screens/TacticsPackage/Tactics';
import TacticsSearch from '../screens/TacticsPackage/TacticsSearch';
import NewTactic from '../screens/TacticsPackage/NewTactic';
import MyTactics from '../screens/TacticsPackage/MyTactics';
import TacticExample from '../screens/TacticsPackage/TacticExample';
import MyPosts from '../screens/MyPosts';
import NewPost from '../screens/NewPost';
import PostExample from '../screens/PostExample';
import Login from '../screens/LoginPackage/Login';
import SignUp from '../screens/LoginPackage/SignUp';
import FindPwEmail from '../screens/LoginPackage/FindPwEmail';
import EnrollBanggusukTeam from '../screens/BanggusukTeamPackage/EnrollBanggusukTeam';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import AntDesign from '@expo/vector-icons/AntDesign';
import MiddleSignUp from '../screens/LoginPackage/MiddleSignUp';
import Web from '../screens/LoginPackage/Web';
import KaKaoLoginRedirect from '../screens/LoginPackage/KaKaoLoginRedirect';
import styled from 'styled-components';
import EmailVerify from '../screens/LoginPackage/EmailVerify';
import Loading from '../screens/LoginPackage/Loading';
import Toast from 'react-native-toast-message';
import FindPw from '../screens/LoginPackage/FindPw';
import CreateProfile from '../screens/MyPagePackage/CreateProfile';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  Modal,
  ToastAndroid,
} from 'react-native';
import axios from 'axios';
import { getTokenFromLocal } from '../screens/LoginPackage/TokenUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

// your entry point
import { MenuProvider } from 'react-native-popup-menu';

export const App = () => (
  <MenuProvider>
    <YourApp />
  </MenuProvider>
);

// somewhere in your app
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

LocaleConfig.locales['fr'] = {
  monthNames: [
    '01월',
    '02월',
    '03월',
    '04월',
    '05월',
    '06월',
    '07월',
    '08월',
    '09월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '01월',
    '02월',
    '03월',
    '04월',
    '05월',
    '06월',
    '07월',
    '08월',
    '09월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';

const Stack = createNativeStackNavigator();

const TouchCalander = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
`;

const CalanderEnrollButton = styled.TouchableOpacity`
  width: 70px;
  height: 30px;
  border-radius: 8px;
  background-color: red;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  margin-left: 240px;
`;

const SearchButton = styled.TouchableOpacity`
  margin-right: 10px;
`;

const OptionsButton = styled.TouchableOpacity`
  margin-right: 10px;
`;

const NavigationButtonView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const navigateToNewTactic = (navigation) => {
  navigation.navigate('NewTactic');
};

const navigateToMyTactics = (navigation) => {
  navigation.navigate('MyTactics');
};

const navigateToMyPosts = (navigation) => {
  navigation.navigate('MyPosts');
};

const navigateToNewPost = (navigation) => {
  navigation.navigate('NewPost');
};

const navigateToFreeBoardWrite = (navigation) => {
  navigation.navigate('FreeBoardWrite');
};

const navigateToMyFreeBoard = (navigation) => {
  navigation.navigate('MyFreeBoard');
};

const showCreateProfile = () => {
  ToastAndroid.show(
    '⚠️ 팀 생성 전 프로필 생성은 필수입니다.',
    ToastAndroid.LONG
  );
};

const CheckProfile = async (navigation) => {
  const TokenString = await AsyncStorage.getItem('Tokens');
  const Token = JSON.parse(TokenString);

  const headers_config = {
    'Content-Type': 'application/json; charset=UTF-8',
    Authorization: 'Bearer ' + Token.accessToken,
  };

  try {
    const res = await axios.get(
      'http://13.125.14.94:8080/accounts/profile/myProfile',
      {
        headers: headers_config,
      }
    );
    navigation.navigate('EnrollBanggusukTeam');
  } catch (error) {
    console.log(error.response);
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === 'PROFILE403'
    ) {
      showCreateProfile();
      navigation.navigate('CreateProfile');
    }
  }
};
const StackNavigation = (navigation) => {
  const [isCallendarVisible, setIsCallendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [matchRegistered, setMatchRegistered] = useState(false); // 1. 매치 등록 상태 추가
  const markSelectedDate = () => {
    if (selectedDate) {
      if (markedDates[selectedDate]) {
        // 이미 선택된 날짜를 클릭한 경우
        setMarkedDates((prevMarkedDates) => {
          const updatedMarkedDates = { ...prevMarkedDates };
          delete updatedMarkedDates[selectedDate]; // 선택된 날짜의 마킹을 제거
          return updatedMarkedDates;
        });
        setMatchRegistered(false); // 매치 취소 상태로 변경
      } else {
        setMarkedDates({
          ...markedDates,
          [selectedDate]: {
            selected: true,
            selectedColor: 'red',
          },
        });
        setMatchRegistered(true);
      }
    }
  };

  return (
    <MenuProvider>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Loading"
          component={Loading}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="FindPwEmail" component={FindPwEmail} />

        <Stack.Screen
          name="MainPage"
          component={MainPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateProfile"
          component={CreateProfile}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Tactics"
          component={Tactics}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitleAlign: 'center',
            headerRight: () => (
              <View>
                <NavigationButtonView>
                  <SearchButton
                    onPress={() => navigation.navigate('TacticsSearch')}
                  >
                    <FontAwesome name="search" size={20} color="black" />
                  </SearchButton>
                  <Menu>
                    <MenuTrigger>
                      <Feather name="more-vertical" size={24} color="black" />
                    </MenuTrigger>
                    <MenuOptions>
                      <MenuOption
                        onSelect={() => navigateToNewTactic(navigation)}
                        text="새 전술 생성"
                      />
                      <MenuOption
                        onSelect={() => navigateToMyTactics(navigation)}
                      >
                        <Text style={{ color: 'red' }}>내 전술 보기</Text>
                      </MenuOption>
                    </MenuOptions>
                  </Menu>
                </NavigationButtonView>
              </View>
            ),
          })}
        />

        <Stack.Screen
          name="TacticsSearch"
          component={TacticsSearch}
          options={{ headerShown: false, headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="NewTactic"
          component={NewTactic}
          options={{ headerShown: true, headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="MyTactics"
          component={MyTactics}
          options={{ headerShown: true, headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="TacticExample"
          component={TacticExample}
          options={{ headerShown: true, headerTitleAlign: 'center' }}
        />

        <Stack.Screen
          name="UserPlusBanggusukTeam"
          component={UserPlusBanggusukTeam}
          options={({ navigation }) => ({
            title: '새 팀',
            headerTitleAlign: 'center',
            headerShown: true,

            headerRight: () => (
              <TouchCalander onPress={() => setIsCallendarVisible(true)}>
                <AntDesign name="calendar" size={32} color="black" />
              </TouchCalander>
            ),
          })}
        />
        <Stack.Screen
          name="EnrollBanggusukTeam"
          component={EnrollBanggusukTeam}
          options={() => ({
            title: '방구석 팀 등록',
            headerTitleAlign: 'center',
            headerShown: true,
          })}
        />
        <Stack.Screen
          name="BanggusukTeam"
          component={BanggusukTeam}
          options={({ navigation }) => ({
            title: '방구석 팀',
            headerShown: true,
            headerTitleAlign: 'center',
            headerRight: () => (
              <TouchableOpacity onPress={() => CheckProfile(navigation)}>
                <Text style={{ fontSize: 25 }}>+</Text>
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="FreeBoard"
          component={FreeBoard}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitleAlign: 'center',
            headerRight: () => (
              <View>
                <NavigationButtonView>
                  <SearchButton
                    onPress={() => navigation.navigate('FreeBoardSearch')}
                  >
                    <FontAwesome name="search" size={20} color="black" />
                  </SearchButton>
                  <Menu>
                    <MenuTrigger>
                      <Feather name="more-vertical" size={24} color="black" />
                    </MenuTrigger>
                    <MenuOptions>
                      <MenuOption
                        onSelect={() => navigateToFreeBoardWrite(navigation)}
                        text="글 쓰기"
                      />
                      <MenuOption
                        onSelect={() => navigateToMyFreeBoard(navigation)}
                      >
                        <Text style={{ color: 'red' }}>내가 쓴 글</Text>
                      </MenuOption>
                    </MenuOptions>
                  </Menu>
                </NavigationButtonView>
              </View>
            ),
          })}
        />

        <Stack.Screen
          name="FreeBoardDetail"
          component={FreeBoardDetail}
          options={({ navigation }) => ({
            headerShown: true,
            title: '자유 게시판',
          })}
        />

        <Stack.Screen
          name="FreeBoardUpdate"
          component={FreeBoardUpdate}
          options={({ navigation }) => ({
            headerShown: true,
            title: '글 수정',
          })}
        />

        <Stack.Screen
          name="FreeBoardWrite"
          component={FreeBoardWrite}
          options={({ navigation }) => ({
            headerShown: true,
            title: '글쓰기',
          })}
        />

        <Stack.Screen
          name="FreeBoardSearch"
          component={FreeBoardSearch}
          options={({ navigation }) => ({
            headerShown: true,
            title: '게시글 검색',
          })}
        />

        <Stack.Screen
          name="MyFreeBoard"
          component={MyFreeBoard}
          options={({ navigation }) => ({
            headerShown: true,
            title: '내 글',
          })}
        />

        <Stack.Screen
          name="MyPosts"
          component={MyPosts}
          options={{ headerShown: true, headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="NewPost"
          component={NewPost}
          options={{ headerShown: true, headerTitleAlign: 'center' }}
        />

        <Stack.Screen
          name="MyPage"
          component={MyPage}
          options={{
            headerShown: true,
            title: '마이 페이지',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="PostExample"
          component={PostExample}
          options={{ headerShown: false, headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="MiddleSignUp"
          component={MiddleSignUp}
          options={{ headerShown: false, headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="Web"
          component={Web}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="KaKaoLoginRedirect"
          component={KaKaoLoginRedirect}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmailVerify"
          component={EmailVerify}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FindPw"
          component={FindPw}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      {isCallendarVisible && ( // isCallendarVisible 상태가 true일 때 모달이 보이도록 설정합니다.
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCallendarVisible}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => setIsCallendarVisible(false)}
          >
            <View
              style={{
                flex: 0.46,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                borderWidth: 4,
                backgroundColor: 'white',
              }}
            >
              <Calendar
                style={{ borderRadius: 8, width: 350, hight: 80 }}
                current={'2024-05-01'}
                markedDates={{
                  ...markedDates,
                  [selectedDate]: {
                    selected: true,
                    selectedColor: 'red',
                  },
                }}
                onDayPress={(day) => {
                  console.log('선택된 날', day);
                  setSelectedDate(day.dateString);
                }}
                monthFormat={'yyyy.MM'}
                hideExtraDays={true}
                firstDay={1}
                theme={{
                  'stylesheet.calendar.main': {
                    selectedDay: {
                      backgroundColor: 'red',
                    },
                  },
                  'stylesheet.calendar.header': {
                    dayTextAtIndex0: {
                      color: '#FF0000',
                    },
                    dayTextAtIndex6: {
                      color: '#007BA4',
                    },
                  },
                  backgroundColor: '#ffffff',
                  arrowColor: '#5B5B5B',
                }}
              ></Calendar>
              <CalanderEnrollButton onPress={markSelectedDate}>
                <Text
                  style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}
                >
                  {markedDates[selectedDate] ? '매치 취소' : '매치 등록'}
                </Text>
              </CalanderEnrollButton>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </MenuProvider>
  );
};

export default StackNavigation;
