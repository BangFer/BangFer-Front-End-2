import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import StackNavigation from './navigation/Stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import { MenuProvider } from 'react-native-popup-menu';

const queryClient = new QueryClient();

const App = () => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <MenuProvider>
          <NavigationContainer>
            <SafeAreaProvider>
              <ActionSheetProvider>
                <StackNavigation />
              </ActionSheetProvider>
            </SafeAreaProvider>
          </NavigationContainer>
        </MenuProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;

