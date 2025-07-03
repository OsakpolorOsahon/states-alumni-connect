
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Award, Star, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const InteractiveTimeline = () => {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const timelineData = [
    {
      year: '1976',
      title: 'Foundation Year',
      description: 'Man O\' War Club established at University of Benin with the first batch of dedicated cadets.',
      icon: Building,
      details: 'The club was founded with a vision to develop leadership skills and character among university students.',
      color: 'bg-blue-500'
    },
    {
      year: '1980',
      title: 'First Leadership Council',
      description: 'Formation of the structured leadership hierarchy and establishment of core traditions.',
      icon: Users,
      details: 'Introduction of formal ranks and positions that would guide the club\'s organizational structure.',
      color: 'bg-green-500'
    },
    {
      year: '1985',
      title: 'Alumni Network Formation',
      description: 'Creation of the first organized alumni network connecting graduates across Nigeria.',
      icon: MapPin,
      details: 'Alumni began forming professional networks that would span multiple industries and sectors.',
      color: 'bg-purple-500'
    },
    {
      year: '1995',
      title: 'National Recognition',
      description: 'Official recognition by national youth and leadership development organizations.',
      icon: Award,
      details: 'The club received formal acknowledgment for its contribution to youth development in Nigeria.',
      color: 'bg-orange-500'
    },
    {
      year: '2005',
      title: 'Digital Evolution',
      description: 'Introduction of digital communication systems and online member management.',
      icon: Star,
      details: 'Modernization efforts began with the adoption of digital tools for member coordination.',
      color: 'bg-red-500'
    },
    {
      year: '2020',
      title: 'SMMOWCUB Portal',
      description: 'Launch of the comprehensive digital platform connecting all Senior Members globally.',
      icon: Calendar,
      details: 'The current portal represents decades of growth and technological advancement.',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-foreground mb-4">
          Our Journey Through Time
        </h2>
        <p className="text-lg text-muted-foreground dark:text-muted-foreground max-w-2xl mx-auto">
          Explore the milestones that shaped SMMOWCUB into the distinguished organization it is today.
        </p>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#E10600] to-[#E10600]/30 rounded-full hidden md:block"></div>

        {/* Timeline Items */}
        <div className="space-y-12">
          {timelineData.map((item, index) => {
            const IconComponent = item.icon;
            const isSelected = selectedYear === item.year;
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-center justify-center md:${isLeft ? 'justify-start' : 'justify-end'}`}
              >
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10 hidden md:block">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedYear(isSelected ? null : item.year)}
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${item.color} flex items-center justify-center shadow-lg border-4 border-background dark:border-background`}
                  >
                    <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </motion.button>
                </div>
                
                {/* Mobile Timeline Node */}
                <div className="block md:hidden mb-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedYear(isSelected ? null : item.year)}
                    className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center shadow-lg mx-auto`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </motion.button>
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-5/12 ${isLeft ? 'md:pr-8' : 'md:pl-8'} px-4 md:px-0`}>
                  <Card className="bg-card dark:bg-card border border-border dark:border-border hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center mb-3">
                        <span className="text-xl md:text-2xl font-bold text-[#E10600] mr-3">
                          {item.year}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-foreground dark:text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground dark:text-muted-foreground mb-4">
                        {item.description}
                      </p>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-border dark:border-border pt-4"
                        >
                          <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                            {item.details}
                          </p>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InteractiveTimeline;
