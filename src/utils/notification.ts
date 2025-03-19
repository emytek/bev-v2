export const requestNotificationPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      console.error("This browser does not support notifications.");
      return false;
    }
  
    const permission = await Notification.requestPermission();
    return permission === "granted";
  };
  
  export const showLocalNotification = (title: string, body: string) => {
    if (!("Notification" in window)) {
      console.error("This browser does not support notifications.");
      return;
    }
  
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, {
          body,
          icon: "/icon.png", // Change this to your app's icon
        } as NotificationOptions & { vibrate?: number[] });
      }
    });
  };
  
  
  export const sendNotificationToSW = (title: string, body: string) => {
    navigator.serviceWorker.ready.then((registration) => {
      registration.active?.postMessage({
        type: "LOCAL_NOTIFICATION",
        title,
        body,
      });
    });
  };
  