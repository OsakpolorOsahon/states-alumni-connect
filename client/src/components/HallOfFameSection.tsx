
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Star, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const HallOfFameSection = () => {
  const categories = [
    {
      title: "Academic Excellence",
      description: "Distinguished scholars and researchers",
      icon: Award,
      count: "25+"
    },
    {
      title: "Leadership",
      description: "Visionary leaders in various fields",
      icon: Star,
      count: "40+"
    },
    {
      title: "Innovation",
      description: "Pioneers and entrepreneurs",
      icon: Trophy,
      count: "30+"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Hall of <span className="text-[#E10600]">Fame</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Celebrating the extraordinary achievements of our distinguished statesmen who have made 
            significant contributions to society and brought honor to our Organisation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-[#E10600] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-center mb-3">{category.title}</h3>
                <p className="text-muted-foreground text-center mb-4">{category.description}</p>
                <div className="text-center">
                  <span className="text-2xl font-bold text-[#E10600]">{category.count}</span>
                  <span className="text-sm text-muted-foreground ml-1">Honorees</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/hall-of-fame">
            <Button 
              variant="outline" 
              className="border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white group"
            >
              View All Honorees
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HallOfFameSection;
