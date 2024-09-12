import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import StackNavigation from './navigation/Stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import { TeamProvider } from './screens/TeamContext';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

const queryClient = new QueryClient();

const App = () => {
  // 백그라운드에서 알림 처리 핸들러 설정
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    console.log('Background event:', type, detail);

    // 알림이 눌렸을 때의 처리 예시 (필요 시 주석 해제)
    // if (type === notifee.EventType.PRESS) {
    //   console.log('Notification pressed:', detail.notification);
    // }
  });

  useEffect(() => {
    // Firebase 기본 알림 비활성화
    messaging().setAutoInitEnabled(false); // 자동 알림 초기화를 비활성화합니다.

    // 포그라운드 메시지 수신 핸들러 설정
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message received:', remoteMessage);

      // 메시지 수신 시 notifee를 사용해 알림 표시
      if (remoteMessage.notification) {
        // 알림 채널 생성
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });

        // 알림 표시
        await notifee.displayNotification({
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          android: {
            channelId: channelId,
            smallIcon: 'profileimg',
          },
        });
      }
    });

    return unsubscribe;
  }, []);

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
