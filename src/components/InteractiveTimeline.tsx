
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimelineItem from "./TimelineItem";

const InteractiveTimeline = () => {
  const [activeYear, setActiveYear] = useState(1970);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const timelineData = [
    {
      year: 1970,
      title: "Foundation Era",
      description: "The establishment of SMMOWCUB at the University of Benin, marking the beginning of a legacy of leadership and excellence.",
      image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      year: 1985,
      title: "Growth & Recognition",
      description: "Expansion of programs and national recognition for outstanding contributions to student development and leadership training.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      year: 1995,
      title: "Alumni Network",
      description: "Formation of the first formal alumni association, connecting graduates across various professional fields and industries.",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      year: 2005,
      title: "Digital Transformation",
      description: "Introduction of modern training methods and digital platforms to enhance member engagement and professional development.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      year: 2015,
      title: "Global Outreach",
      description: "Expansion of alumni network internationally, with chapters established in major cities across continents.",
      image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      year: 2025,
      title: "Future Vision",
      description: "Launch of the exclusive SMMOWCUB digital portal, connecting past, present, and future generations of Statesmen.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const scrollToYear = (year: number) => {
    setActiveYear(year);
    const container = scrollContainerRef.current;
    if (container) {
      const yearIndex = timelineData.findIndex(item => item.year === year);
      const scrollPosition = yearIndex * 200; // Approximate width per item
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        const currentIndex = timelineData.findIndex(item => item.year === activeYear);
        if (currentIndex > 0) {
          scrollToYear(timelineData[currentIndex - 1].year);
        }
      } else if (event.key === 'ArrowRight') {
        const currentIndex = timelineData.findIndex(item => item.year === activeYear);
        if (currentIndex < timelineData.length - 1) {
          scrollToYear(timelineData[currentIndex + 1].year);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeYear]);

  return (
    <div className="relative">
      {/* Navigation buttons */}
      <div className="flex justify-between items-center mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={scrollLeft}
          className="border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white"
          aria-label="Scroll timeline left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900">
            Navigate through our history
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Click on timeline markers or use arrow keys
          </p>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={scrollRight}
          className="border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white"
          aria-label="Scroll timeline right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Timeline container */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-300 z-0"></div>
        
        {/* Scrollable timeline items */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide pb-8 relative z-10"
          style={{ scrollSnapType: 'x mandatory' }}
          role="tablist"
          aria-label="Interactive timeline of SMMOWCUB history"
        >
          {timelineData.map((item) => (
            <div
              key={item.year}
              style={{ scrollSnapAlign: 'center' }}
              role="tab"
              aria-selected={activeYear === item.year}
            >
              <TimelineItem
                year={item.year}
                title={item.title}
                description={item.description}
                image={item.image}
                isActive={activeYear === item.year}
                onClick={() => scrollToYear(item.year)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Year indicators for mobile */}
      <div className="flex justify-center mt-8 space-x-2 md:hidden">
        {timelineData.map((item) => (
          <button
            key={item.year}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              activeYear === item.year ? 'bg-[#E10600]' : 'bg-gray-300'
            }`}
            onClick={() => scrollToYear(item.year)}
            aria-label={`Go to year ${item.year}`}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveTimeline;
