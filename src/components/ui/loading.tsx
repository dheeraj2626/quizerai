import React from 'react';
import { Brain } from 'lucide-react';

const LoadingScreen: React.FC<{ message?: string }> = ({ 
  message = "Generating your quiz..." 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        {/* AI Brain Animation */}
        <div className="relative mb-8">
          <Brain className="w-20 h-20 mx-auto text-primary floating-animation" />
          <div className="absolute inset-0 w-20 h-20 mx-auto neon-glow rounded-full opacity-50 pulse-glow"></div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold mb-4 gradient-text">
          {message}
        </h2>

        {/* Shimmer Effect */}
        <div className="w-64 h-3 mx-auto rounded-full glass-card overflow-hidden">
          <div className="h-full bg-gradient-primary shimmer"></div>
        </div>

        {/* Additional Text */}
        <p className="text-muted-foreground mt-4 text-sm">
          AI is crafting personalized questions just for you...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;