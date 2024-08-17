import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import StackNavigation from './navigation/Stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import { TeamProvider } from './screens/TeamContext';
const queryClient = new QueryClient();

const App = () => {
  return (
    <TeamProvider>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <SafeAreaProvider>
              <ActionSheetProvider>
                <StackNavigation />
              </ActionSheetProvider>
            </SafeAreaProvider>
          </NavigationContainer>
        </QueryClientProvider>
      </RecoilRoot>
    </TeamProvider>
  );
};

export default App;
