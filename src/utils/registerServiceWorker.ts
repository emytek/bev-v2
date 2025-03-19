

const VAPID_PUBLIC_KEY = "YOUR_GENERATED_PUBLIC_KEY"; // Replace with your actual key

// export function registerSW() {
//   if ('serviceWorker' in navigator) {
//     // Unregister any previous registrations (to avoid conflicts)
//     navigator.serviceWorker.getRegistrations().then((registrations) => {
//       registrations.forEach((registration) => registration.unregister());
//     });

//     window.addEventListener('load', () => {
//       navigator.serviceWorker
//         .register('/sw.js', { scope: '/' })
//         .then((registration) => {
//           console.log('Service Worker registered with scope:', registration.scope);
//         })
//         .catch((error) => {
//           console.error('Service Worker registration failed:', error);
//         });
//     });
//   }
// }

export function registerSW(): Promise<ServiceWorkerRegistration | null> {
  if ("serviceWorker" in navigator) {
    return new Promise((resolve, reject) => {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            console.log("Service Worker registered with scope:", registration.scope);
            resolve(registration); // Return the registration
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
            reject(null); // Reject with null
          });
      });
    });
  }
  return Promise.resolve(null); // If service worker not supported, return null
}


export const askNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.error("This browser does not support notifications.");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Notification permission granted.");
    return true;
  } else {
    console.error("Notification permission denied.");
    return false;
  }
};

export const subscribeToPushNotifications = async () => {
  const registration = await registerSW();
  if (!registration) {
    console.error("Service Worker registration failed or not supported.");
    return;
  }

  const permission = await askNotificationPermission();
  if (!permission) return;

  let existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) {
    console.log("Already subscribed:", existingSubscription);
    return existingSubscription;
  }

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: "YOUR_VAPID_PUBLIC_KEY", // Replace with your actual VAPID key
    });

    console.log("Push Subscription:", subscription);
    return subscription;
  } catch (error) {
    console.error("Push Subscription Failed:", error);
  }
};





