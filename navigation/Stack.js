import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

import MainPage from '../screens/MainPage';
import FreeBoard from '../screens/FreeBoard';
import MyPage from '../screens/MyPage';
import BanggusukTeam from '../screens/BanggusukTeam';
import PlusBanggusukTeam from '../screens/PlusBanggusukTeam';
import Tactics from '../screens/Tactics';
import TacticsSearch from '../screens/TacticsSearch';
import NewTactic from '../screens/NewTactic';
import MyTactics from '../screens/MyTactics';
import TacticExample from '../screens/TacticExample';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import FindPw from '../screens/FindPw';

import styled from 'styled-components';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';

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

const Stack = createNativeStackNavigator();

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

const StackNavigation = () => {
  return (
    <MenuProvider>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="FindPw" component={FindPw} />

        <Stack.Screen
          name="MainPage"
          component={MainPage}
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
          name="PlusBanggusukTeam"
          component={PlusBanggusukTeam}
          options={({ navigation }) => ({
            title: '새 팀',
            headerTitleAlign: 'center',
          })}
        />

        <Stack.Screen
          name="BanggusukTeam"
          component={BanggusukTeam}
          options={({ navigation }) => ({
            title: '방구석 팀',
            headerTitleAlign: 'center',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('PlusBanggusukTeam')}
              >
                <Text style={{ fontSize: 25 }}>+</Text>
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen name="FreeBoard" component={FreeBoard} />

        <Stack.Screen
          name="MyPage"
          component={MyPage}
          options={{ headerShown: false, headerTitleAlign: 'center' }}
        />
      </Stack.Navigator>
    </MenuProvider>
  );
};

export default StackNavigation;
