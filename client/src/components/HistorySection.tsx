
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const HistorySection = () => {
  const milestones = [
    {
      year: "1976",
      title: "Foundation",
      description: "Man O' War Club established at University of Benin",
      icon: Users
    },
    {
      year: "1985",
      title: "First Alumni Network",
      description: "Formation of the first organized alumni network",
      icon: Calendar
    },
    {
      year: "2025",
      title: "Digital Transformation",
      description: "Launch of online platform for member connectivity",
      icon: Trophy
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Rich History
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Decades of excellence, leadership, and brotherhood spanning generations of distinguished alumni.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {milestones.map((milestone, index) => {
            const IconComponent = milestone.icon;
            return (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="bg-[#E10600] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#E10600] mb-2">{milestone.year}</h3>
                <h4 className="text-xl font-semibold mb-3">{milestone.title}</h4>
                <p className="text-muted-foreground">{milestone.description}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mt-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
              <img
                src="/attached_assets/IMG-20250724-WA0008(1)_1753347494716.jpg"
                alt="SMMOWCUB distinguished elder addressing the community"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center lg:text-left"
          >
            <h3 className="text-2xl font-bold mb-4">Leadership Legacy</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Our distinguished statesmen continue to lead and inspire new generations, 
              sharing wisdom and maintaining the traditions that have shaped our organization for decades.
            </p>
            <Link to="/history">
              <Button 
                variant="outline" 
                className="border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white group"
              >
                Explore Full History
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
