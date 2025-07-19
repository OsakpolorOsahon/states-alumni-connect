
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed (multiple ways)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone;
    const isInstalled = isStandalone || isInWebAppiOS;
    setIsInstalled(isInstalled);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log('PWA: beforeinstallprompt event triggered');
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA: App installed successfully');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Check if the browser supports the beforeinstallprompt event
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('PWA: Service Worker registered successfully:', registration);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              console.log('PWA: New service worker version available');
            });
          })
          .catch((registrationError) => {
            console.error('PWA: Service Worker registration failed:', registrationError);
          });
      });
    }

    // For development - force installable state after a delay to test
    if (import.meta.env.DEV && !isInstalled) {
      const devTimer = setTimeout(() => {
        if (!deferredPrompt && !isInstalled) {
          console.log('PWA: Development mode - simulating installable state');
          setIsInstallable(true);
        }
      }, 2000);
      
      return () => {
        clearTimeout(devTimer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support the install prompt
      // Show instructions for manual installation
      if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
        alert('To install this app on iOS:\n1. Tap the share button\n2. Select "Add to Home Screen"');
      } else {
        alert('To install this app:\n1. Click the browser menu (⋮)\n2. Select "Install app" or "Add to Home screen"');
      }
      return;
    }

    try {
      console.log('PWA: Prompting user to install');
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('PWA: User choice outcome:', outcome);
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
      }
    } catch (error) {
      console.error('PWA: Error during installation:', error);
    }
  };

  return {
    isInstallable,
    isInstalled,
    installApp
  };
};
