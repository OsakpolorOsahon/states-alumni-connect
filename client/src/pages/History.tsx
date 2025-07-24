
import Navigation from "@/components/Navigation";
import InteractiveTimeline from "@/components/InteractiveTimeline";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const History = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Navigation />
      <main className="container mx-auto py-12 px-4">
        {/* Header Section */}
        <section className="relative bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 py-16 rounded-lg mb-8">
          <div className="absolute inset-0 bg-[url('/attached_assets/IMG-20250724-WA0008(1)_1753347494716.jpg')] bg-cover bg-center opacity-20 rounded-lg"></div>
          <div className="absolute inset-0 bg-[#E10600] opacity-10 rounded-lg"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 mb-8"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Our Journey Through the Years
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
                Explore the milestones that shaped SMMOWCUB into the distinguished organization it is today.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 lg:py-24 bg-muted/30 dark:bg-muted/10 rounded-lg mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <InteractiveTimeline />
          </div>
        </section>

        {/* Legacy Section */}
        <section className="py-16 lg:py-24 bg-card dark:bg-card rounded-lg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-foreground mb-8">
              A Legacy of Excellence
            </h2>
            <p className="text-lg text-muted-foreground dark:text-muted-foreground leading-relaxed mb-8">
              From our humble beginnings in 1976 to our current status as a premier alumni network, 
              SMMOWCUB has consistently upheld the highest standards of leadership, integrity, and service. 
              Our journey reflects not just institutional growth, but the collective achievements of 
              hundreds of Statesmen who have carried our values into every corner of society.
            </p>
            <p className="text-lg text-muted-foreground dark:text-muted-foreground leading-relaxed">
              As we look toward the future, we remain committed to fostering the next generation of leaders 
              while honoring the traditions that have made us who we are. The spirit of Man O' War lives on 
              in every statesman, every achievement, and every act of service to humanity.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default History;
