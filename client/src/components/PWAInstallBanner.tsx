import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed the banner
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
    
    console.log('PWA Banner: Checking install conditions', {
      isInstallable,
      isInstalled,
      dismissedTime: new Date(dismissedTime).toISOString(),
      oneDayAgo: new Date(oneDayAgo).toISOString(),
      shouldShow: isInstallable && !isInstalled && dismissedTime < oneDayAgo
    });
    
    // Show banner if it's installable, not installed, not recently dismissed
    if (isInstallable && !isInstalled && dismissedTime < oneDayAgo) {
      // Delay showing the banner by 3 seconds for better UX
      const timer = setTimeout(() => {
        console.log('PWA Banner: Showing install banner');
        setShowBanner(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    try {
      await installApp();
      setShowBanner(false);
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const handleDismiss = () => {
    console.log('PWA Banner: User dismissed banner');
    setIsDismissed(true);
    setShowBanner(false);
    // Remember dismissal for 24 hours
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
  };

  // Debug function for development
  const resetBannerState = () => {
    localStorage.removeItem('pwa-banner-dismissed');
    setIsDismissed(false);
    setShowBanner(false);
    window.location.reload();
  };

  // Don't show if dismissed, not installable, or already installed
  if (!showBanner || isDismissed || !isInstallable || isInstalled) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
        <Card className="shadow-lg border-2 border-[#E10600]/20 bg-white dark:bg-gray-900">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-[#E10600]/10 rounded-full flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-[#E10600]" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  Install SMMOWCUB App
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  Get faster access and work offline. Add to your home screen for the best experience.
                </p>
                
                <div className="flex gap-2 mt-3">
                  <Button
                    onClick={handleInstall}
                    size="sm"
                    className="bg-[#E10600] hover:bg-[#E10600]/90 text-white text-xs px-3 py-1.5 h-auto"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Install
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xs px-2 py-1.5 h-auto"
                  >
                    Maybe later
                  </Button>
                </div>
              </div>
              
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="flex-shrink-0 p-1 h-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Development helper - only show in development mode */}
      {import.meta.env.DEV && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={resetBannerState}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            Reset PWA Banner
          </Button>
        </div>
      )}
    </>
  );
};

export default PWAInstallBanner;