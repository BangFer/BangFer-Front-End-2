// index.js
import { registerRootComponent } from 'expo';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

import App from './App';

const debugLog = (message, data) => {
  console.log(`[DEBUG] ${message}`, JSON.stringify(data, null, 2));
};

const onMessageReceived = async (message) => {
  debugLog('Received message in onMessageReceived:', message);

  const notification = message.data || message.notification;

  if (notification) {
    debugLog('Notification data:', notification);

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    debugLog('Created channel with ID:', channelId);

    try {
      await notifee.displayNotification({
        id: 'last_notification',
        title: notification.title,
        body: notification.body,
        android: {
          channelId: channelId,
          smallIcon: 'profileimg',
          importance: AndroidImportance.HIGH,
          tag: 'custom_notification',
          pressAction: {
            id: 'default',
          },
        },
      });
      debugLog('Displayed notification:', {
        title: notification.title,
        body: notification.body,
      });
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  }
};

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  debugLog('Received background message:', remoteMessage);

  // FCM의 기본 알림 생성 방지
  if (remoteMessage.notification) {
    // notification 객체를 data 객체로 이동
    remoteMessage.data = {
      ...remoteMessage.data,
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
    };
    delete remoteMessage.notification;
  }

  await onMessageReceived(remoteMessage);

  debugLog('Finished processing background message');
  return Promise.resolve(true);
});

// FCM 설정
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  debugLog('Received background message:', remoteMessage);
  await onMessageReceived(remoteMessage);
  return Promise.resolve(true);
});

// 앱 등록
registerRootComponent(App);
