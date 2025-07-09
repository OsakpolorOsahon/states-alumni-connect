
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import InteractiveMap from "@/components/InteractiveMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Globe } from "lucide-react";

const Map = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Member Network Map</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover SMMOWCUB members across Nigeria and beyond. Connect with fellow alumni 
            in your area and expand your professional network.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center animate-fade-in hover-scale">
            <CardContent className="p-6">
              <Globe className="h-8 w-8 text-[#E10600] mx-auto mb-3" />
              <h3 className="text-2xl font-bold">1,247</h3>
              <p className="text-muted-foreground">Total Members</p>
            </CardContent>
          </Card>
          
          <Card className="text-center animate-fade-in hover-scale">
            <CardContent className="p-6">
              <MapPin className="h-8 w-8 text-[#E10600] mx-auto mb-3" />
              <h3 className="text-2xl font-bold">36</h3>
              <p className="text-muted-foreground">States Covered</p>
            </CardContent>
          </Card>
          
          <Card className="text-center animate-fade-in hover-scale">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-[#E10600] mx-auto mb-3" />
              <h3 className="text-2xl font-bold">15</h3>
              <p className="text-muted-foreground">Countries</p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Interactive Member Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InteractiveMap />
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>How to Use the Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">🔍 Explore</h4>
                <p className="text-sm text-muted-foreground">
                  Click and drag to navigate the map. Use the zoom controls to get a closer look at member clusters.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📍 Member Info</h4>
                <p className="text-sm text-muted-foreground">
                  Click on any red marker to see member information and contact details.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🌐 Global View</h4>
                <p className="text-sm text-muted-foreground">
                  Switch between different map styles and projections using the controls.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🤝 Connect</h4>
                <p className="text-sm text-muted-foreground">
                  Find members in your area and reach out through the platform's messaging system.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Map;
