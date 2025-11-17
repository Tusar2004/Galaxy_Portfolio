import { useEffect } from 'react';

interface HyperjumpTransitionProps {
  active: boolean;
  planetColor: string;
  onComplete: () => void;
}

export default function HyperjumpTransition({ 
  active, 
  planetColor, 
  onComplete 
}: HyperjumpTransitionProps) {
  
  useEffect(() => {
    if (active) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);
  
  if (!active) return null;
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      pointerEvents: 'none',
      animation: 'hyperjumpSequence 2s ease-out forwards'
    }}>
      {/* Radial Blur Effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at center, transparent 0%, ${planetColor}20 40%, white 100%)`,
        animation: 'radialBlur 1.5s ease-out forwards'
      }} />
      
      {/* Speed Lines */}
      <svg style={{ 
        position: 'absolute', 
        inset: 0, 
        width: '100%', 
        height: '100%' 
      }}>
        {Array.from({ length: 50 }).map((_, i) => {
          const angle = (i / 50) * Math.PI * 2;
          const endR = 150;
          return (
            <line
              key={i}
              x1="50%"
              y1="50%"
              x2={`${50 + Math.cos(angle) * endR}%`}
              y2={`${50 + Math.sin(angle) * endR}%`}
              stroke={planetColor}
              strokeWidth="2"
              opacity="0"
              style={{
                animation: `speedLine 0.8s ease-out ${i * 0.01}s forwards`
              }}
            />
          );
        })}
      </svg>
      
      {/* Center Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 100,
        height: 100,
        background: `radial-gradient(circle, ${planetColor} 0%, transparent 70%)`,
        animation: 'centerGlow 1.2s ease-out forwards'
      }} />
      
      {/* White Flash */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'white',
        animation: 'whiteFlash 1.5s ease-out forwards'
      }} />
      
      <style>{`
        @keyframes hyperjumpSequence {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        @keyframes radialBlur {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(3); opacity: 0; }
        }
        
        @keyframes speedLine {
          0% { opacity: 0; stroke-dasharray: 0 1000; }
          50% { opacity: 0.8; }
          100% { opacity: 0; stroke-dasharray: 1000 0; }
        }
        
        @keyframes centerGlow {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(3); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(10); opacity: 0; }
        }
        
        @keyframes whiteFlash {
          0% { opacity: 0; }
          40% { opacity: 0; }
          60% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}