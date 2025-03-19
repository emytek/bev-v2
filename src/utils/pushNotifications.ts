export const subscribeToPushNotifications = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.error("Push messaging is not supported.");
      return;
    }
  
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered:", registration);
  
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.error("Notification permission denied.");
        return;
      }
  
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log("Already subscribed:", existingSubscription);
        return existingSubscription;
      }
  
      const applicationServerKey = "YOUR_VAPID_PUBLIC_KEY"; // Replace with your VAPID key
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      });
  
      console.log("Push Subscription:", subscription);
  
      // Send subscription to your backend
      await fetch("/api/save-subscription", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: { "Content-Type": "application/json" },
      });
  
      return subscription;
    } catch (error) {
      console.error("Push Subscription Failed:", error);
    }
  };
  