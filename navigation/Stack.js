import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native-stack';
import MainPage from '../screens/MainPage';
import FreeBoard from '../screens/FreeBoard';
import MyPage from '../screens/MyPage';
import BanggusukTeam from '../screens/BanggusukTeam';
import Tactics from '../screens/Tactics';
import PlusBanggusukTeam from '../screens/PlusBanggusukTeam';
import styled from 'styled-components';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="MainPage">
      <Stack.Screen
        name="MainPage"
        component={MainPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="FreeBoard" component={FreeBoard} />
      <Stack.Screen name="Tactics" component={Tactics} />
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
      <Stack.Screen name="MyPage" component={MyPage} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
