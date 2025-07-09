
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

const PWAInstallBanner = () => {
  const { isInstallable, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isDismissed) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 z-50 animate-slide-up shadow-lg border-[#E10600]">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#E10600]/10 rounded-lg">
            <Download className="h-5 w-5 text-[#E10600]" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">Install SMMOWCUB App</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Get quick access to your alumni network with our mobile app.
            </p>
            <div className="flex gap-2 mt-3">
              <Button 
                size="sm" 
                onClick={installApp}
                className="bg-[#E10600] hover:bg-[#C10500] h-8 text-xs"
              >
                Install
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setIsDismissed(true)}
                className="h-8 text-xs"
              >
                Not now
              </Button>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsDismissed(true)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PWAInstallBanner;
