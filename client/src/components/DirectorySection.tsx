
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Users, Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const DirectorySection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      number: "500+",
      label: "Active Members",
      icon: Users
    },
    {
      number: "15+",
      label: "Countries",
      icon: Globe
    },
    {
      number: "50+",
      label: "Cities",
      icon: MapPin
    }
  ];

  const handleDirectoryClick = () => {
    navigate('/directory');
  };

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Connect with Fellow <span className="text-[#E10600]">Statesmen</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our exclusive member directory connects you with distinguished statesmen across the globe. 
              Network, mentor, and collaborate with fellow statesmen who share your values and heritage.
            </p>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="bg-[#E10600]/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <IconComponent className="h-6 w-6 text-[#E10600]" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>

            <Button 
              onClick={handleDirectoryClick}
              className="bg-[#E10600] hover:bg-[#C10500] group"
            >
              Browse Directory
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="SMMOWCUB members networking at an event"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#E10600]/20 rounded-lg"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DirectorySection;
