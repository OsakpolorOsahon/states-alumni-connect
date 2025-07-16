import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PushNotifications = () => {
  // Removed broken hooks
  // Removed broken hooks
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: 'Not Supported',
        description: 'Push notifications are not supported in your browser.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Removed broken hooks
      setPermission(permission);

      if (permission === 'granted') {
        toast({
          title: 'Notifications Enabled',
          description: 'You will now receive push notifications for important updates.',
        });

        // Register for push notifications
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          
          // Subscribe to push notifications
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'your-vapid-public-key' // Replace with your VAPID key
          });

          // Send subscription to server
          await fetch('/api/push-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subscription,
              userId: user?.id
            })
          });
        }
      } else {
        toast({
          title: 'Permission Denied',
          description: 'Please enable notifications in your browser settings to receive updates.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: 'Error',
        description: 'Failed to enable notifications. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const disableNotifications = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        // Removed broken hooks
        
        if (subscription) {
          await subscription.unsubscribe();
          
          // Remove subscription from server
          await fetch('/api/push-subscription', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user?.id })
          });
        }
      }

      toast({
        title: 'Notifications Disabled',
        description: 'You will no longer receive push notifications.',
      });
    } catch (error) {
      console.error('Error disabling notifications:', error);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Push Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Stay updated with the latest news, member approvals, and community activities.
          </p>
          
          {permission === 'default' && (
            <Button onClick={requestPermission} className="w-full">
              <Bell className="w-4 h-4 mr-2" />
              Enable Notifications
            </Button>
          )}
          
          {permission === 'granted' && (
            <div className="flex items-center gap-2">
              <div className="flex-1 text-sm text-green-600 font-medium">
                ✓ Notifications enabled
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={disableNotifications}
              >
                <BellOff className="w-4 h-4 mr-2" />
                Disable
              </Button>
            </div>
          )}
          
          {permission === 'denied' && (
            <div className="text-sm text-muted-foreground">
              Notifications blocked. Please enable them in your browser settings to receive updates.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PushNotifications;