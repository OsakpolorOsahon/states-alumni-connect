
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Star, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
// Removed useScrollAnimation hook

const HallOfFameSection = () => {
  const stats = { hallOfFameCount: 0 };
  const loading = false;
  const titleRef = null;
  
  const totalHallOfFame = stats.hallOfFameCount || 0;
  const academicCount = Math.floor(totalHallOfFame * 0.3);
  const leadershipCount = Math.floor(totalHallOfFame * 0.4);
  const innovationCount = totalHallOfFame - academicCount - leadershipCount;

  const categories = [
    {
      title: "Academic Excellence",
      description: "Distinguished scholars and researchers",
      icon: Award,
      count: loading ? "..." : (academicCount || "0")
    },
    {
      title: "Leadership",
      description: "Visionary leaders in various fields",
      icon: Star,
      count: loading ? "..." : (leadershipCount || "0")
    },
    {
      title: "Innovation",
      description: "Pioneers and entrepreneurs",
      icon: Trophy,
      count: loading ? "..." : (innovationCount || "0")
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 gradient-animate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className="text-center mb-16 fade-in-scroll"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 bounce-in">
            Hall of <span className="text-[#E10600] glitch-hover">Fame</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto slide-in-left">
            Celebrating the extraordinary achievements of our distinguished statesmen who have made 
            significant contributions to society and brought honor to our Organisation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.title}
                className="bg-white dark:bg-slate-800 rounded-lg p-8 card-hover interactive-shadow stagger-animate tilt-hover"
              >
                <div className="bg-[#E10600] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 pulse-gentle">
                  <IconComponent className="h-8 w-8 text-white icon-hover" />
                </div>
                <h3 className="text-xl font-bold text-center mb-3 bounce-in">{category.title}</h3>
                <p className="text-muted-foreground text-center mb-4 fade-in-scroll">{category.description}</p>
                <div className="text-center">
                  <span className="text-2xl font-bold text-[#E10600] float-animation">{category.count}</span>
                  <span className="text-sm text-muted-foreground ml-1">Honorees</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center fade-in-scroll progressive-load">
          <Link to="/hall-of-fame">
            <Button 
              variant="outline" 
              className="border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white group btn-animated ripple-effect tilt-hover"
            >
              View All Honorees
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform icon-hover" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HallOfFameSection;
