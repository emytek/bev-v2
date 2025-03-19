import { useEffect } from "react";
import { subscribeToPushNotifications } from "../utils/pushNotifications";

export const usePushNotifications = () => {
  useEffect(() => {
    const initPushNotifications = async () => {
      await subscribeToPushNotifications();
    };

    initPushNotifications();
  }, []);
};
