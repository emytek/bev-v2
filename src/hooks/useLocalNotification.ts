import { useEffect } from "react";
import { requestNotificationPermission, sendNotificationToSW } from ".././utils/notification";

export const useLocalNotification = () => {
  useEffect(() => {
    const initNotifications = async () => {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        sendNotificationToSW("Hello!", "This is a local notification.");
      }
    };

    initNotifications();
  }, []);
};
