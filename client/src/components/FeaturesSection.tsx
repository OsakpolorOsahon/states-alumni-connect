
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Award } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Users,
      title: "Networking",
      description: "Connect with fellow Statesmen in a private, secure environment designed specifically for our community. Access member-only resources, networking opportunities, and maintain lifelong bonds with fellow Statesmen."
    },
    {
      icon: BookOpen,
      title: "Empowerment & Resources",
      description: "Access professional development opportunities, mentorship programs, and resources to advance your career and personal growth. Benefit from workshops, seminars, and educational content curated for our distinguished network."
    },
    {
      icon: Award,
      title: "Recognition & Impact",
      description: "Celebrate achievements, share success stories, and contribute to the legacy of excellence that defines our network. Showcase your accomplishments and inspire the next generation of Man O' War leaders through this platform."
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Member Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our exclusive statesmen network
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="text-center hover:shadow-lg transition-all duration-300 border-border dark:bg-card dark:border-border dark:hover:shadow-lg"
                role="article"
                aria-labelledby={`feature-title-${index}`}
              >
                <CardHeader className="pb-4">
                  <div className="mx-auto w-16 h-16 bg-[#E10600]/10 dark:bg-[#E10600]/20 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-[#E10600]" aria-hidden="true" />
                  </div>
                  <CardTitle 
                    id={`feature-title-${index}`}
                    className="text-xl font-bold text-foreground dark:text-foreground"
                  >
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground dark:text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
