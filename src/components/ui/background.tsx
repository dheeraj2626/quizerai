import React from 'react';

const Background: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background-secondary to-background" />
      
      {/* Floating Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-blue/10 rounded-full blur-3xl floating-animation" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-cyber-cyan/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '-2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-neon-purple/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '-4s' }} />
      </div>
      
      {/* Grid Pattern */}
      <div className="fixed inset-0 opacity-[0.03]">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(hsl(var(--glass-border)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--glass-border)) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Background;