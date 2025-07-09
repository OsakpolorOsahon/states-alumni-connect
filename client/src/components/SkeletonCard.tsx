
import { motion } from 'framer-motion';

interface SkeletonCardProps {
  className?: string;
}

const SkeletonCard = ({ className = "" }: SkeletonCardProps) => {
  return (
    <div className={`bg-card border rounded-lg p-6 ${className}`}>
      <div className="animate-pulse space-y-4">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-muted h-12 w-12"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
          <div className="h-4 bg-muted rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
