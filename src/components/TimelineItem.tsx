
import { useState } from "react";

interface TimelineItemProps {
  year: number;
  title: string;
  description: string;
  image: string;
  isActive: boolean;
  onClick: () => void;
}

const TimelineItem = ({ year, title, description, image, isActive, onClick }: TimelineItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex flex-col items-center min-w-[200px] px-4">
      {/* Timeline marker */}
      <button
        className={`w-6 h-6 rounded-full border-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#E10600] focus:ring-offset-2 ${
          isActive 
            ? 'bg-[#E10600] border-[#E10600] scale-125' 
            : 'bg-white border-gray-400 hover:border-[#E10600] hover:scale-110'
        }`}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`View timeline event for ${year}`}
        aria-expanded={isActive}
      />
      
      {/* Year label */}
      <div className={`mt-3 mb-6 font-bold text-lg transition-colors duration-300 ${
        isActive ? 'text-[#E10600]' : 'text-gray-600'
      }`}>
        {year}
      </div>

      {/* Expandable content */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
        isActive || isHovered 
          ? 'max-h-96 opacity-100 transform translate-y-0' 
          : 'max-h-0 opacity-0 transform translate-y-4'
      }`}>
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-64">
          <img
            src={image}
            alt={`${title} - ${year}`}
            className="w-full h-32 object-cover rounded-md mb-3"
          />
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
