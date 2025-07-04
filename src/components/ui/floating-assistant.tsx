import React from 'react';
import { Brain } from 'lucide-react';

const FloatingAssistant: React.FC = () => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative">
        {/* Main Avatar */}
        <div className="glass-card rounded-full p-4 neon-glow floating-animation">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        
        {/* Pulse Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping"></div>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl"></div>
      </div>
    </div>
  );
};

export default FloatingAssistant;