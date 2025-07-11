
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner = ({ size = 'md', text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center progressive-load">
      <div className="spinner-smooth">
        <Loader2 className={`${sizeClasses[size]} text-[#E10600]`} />
      </div>
      {text && (
        <p className="mt-2 text-sm text-muted-foreground fade-in-scroll pulse-gentle">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
