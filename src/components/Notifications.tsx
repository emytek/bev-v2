import { useEffect } from "react";
import { subscribeToPushNotifications } from "../utils/registerServiceWorker";

const Notifications = () => {
  useEffect(() => {
    const initNotifications = async () => {
      try {
        await subscribeToPushNotifications();
      } catch (error) {
        console.error("Error initializing notifications:", error);
      }
    };

    initNotifications();
  }, []);

  return null; // No UI needed
};

export default Notifications;
