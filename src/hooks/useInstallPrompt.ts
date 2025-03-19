import { useEffect, useState } from 'react';

interface InstallPrompt {
  deferredPrompt: Event | null;
  promptVisible: boolean;
  showInstallPrompt: () => void;
}

const useInstallPrompt = (): InstallPrompt => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [promptVisible, setPromptVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setPromptVisible(true);
    };

    const handleAppInstalled = () => {
      setPromptVisible(false);  // Hide the install button if the app is already installed
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const showInstallPrompt = () => {
    if (deferredPrompt) {
      (deferredPrompt as any).prompt();
      (deferredPrompt as any).userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          setPromptVisible(false);
        }
        setDeferredPrompt(null);
      });
    }
  };

  return {
    deferredPrompt,
    promptVisible,
    showInstallPrompt,
  };
};

export default useInstallPrompt;

