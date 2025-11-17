import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  progress: number;
  planetTheme: {
    color: string;
    bgColor: string;
    icon: string;
    label: string;
  };
}

export default function AdvancedLoadingScreen({ 
  progress, 
  planetTheme 
}: LoadingScreenProps) {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
    return () => clearInterval(interval);
  }, []);
  
  const getStatus = () => {
    if (progress < 30) return 'LOADING ASSETS';
    if (progress < 60) return 'BUILDING ENVIRONMENT';
    if (progress < 90) return 'PREPARING SYSTEMS';
    return 'READY TO DEPLOY';
  };
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      background: `linear-gradient(135deg, ${planetTheme.bgColor}, #000)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Animated Background Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridMove 20s linear infinite',
        opacity: 0.3
      }} />
      
      {/* Central Loading Display */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center'
      }}>
        {/* Planet Icon */}
        <div style={{
          fontSize: 100,
          marginBottom: 30,
          filter: `drop-shadow(0 0 40px ${planetTheme.color})`,
          animation: 'planetFloat 3s ease-in-out infinite'
        }}>
          {planetTheme.icon}
        </div>
        
        {/* Loading Ring */}
        <div style={{
          position: 'relative',
          width: 150,
          height: 150,
          margin: '0 auto 30px'
        }}>
          <svg width="150" height="150" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background Circle */}
            <circle
              cx="75"
              cy="75"
              r="65"
              fill="none"
              stroke="rgba(14, 165, 233, 0.2)"
              strokeWidth="8"
            />
            {/* Progress Circle */}
            <circle
              cx="75"
              cy="75"
              r="65"
              fill="none"
              stroke={planetTheme.color}
              strokeWidth="8"
              strokeDasharray={`${(progress / 100) * 408} 408`}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dasharray 0.3s ease',
                filter: `drop-shadow(0 0 10px ${planetTheme.color})`
              }}
            />
          </svg>
          
          {/* Progress Percentage */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 32,
            fontWeight: 900,
            color: planetTheme.color,
            textShadow: `0 0 20px ${planetTheme.color}`
          }}>
            {progress}%
          </div>
        </div>
        
        {/* Status Text */}
        <div style={{
          fontSize: 20,
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: 3,
          marginBottom: 10
        }}>
          INITIALIZING{dots}
        </div>
        
        {/* Sub Status */}
        <div style={{
          fontSize: 13,
          color: '#94a3b8',
          letterSpacing: 2
        }}>
          {getStatus()}
        </div>
        
        {/* Loading Particles */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          height: 300,
          pointerEvents: 'none'
        }}>
          {Array.from({ length: 12 }).map((_, i) => {
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: 8,
                  height: 8,
                  background: planetTheme.color,
                  borderRadius: '50%',
                  top: '50%',
                  left: '50%',
                  animation: `orbit${i} 3s linear infinite`,
                  animationDelay: `${i * 0.1}s`,
                  boxShadow: `0 0 10px ${planetTheme.color}`
                }}
              />
            );
          })}
        </div>
      </div>
      
      {/* Bottom Info Bar */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        color: '#94a3b8',
        fontSize: 12
      }}>
        <div style={{ 
          width: 60, 
          height: 1, 
          background: 'linear-gradient(90deg, transparent, #0ea5e9, transparent)' 
        }} />
        <div style={{ letterSpacing: 2 }}>
          ENTERING {planetTheme.label}
        </div>
        <div style={{ 
          width: 60, 
          height: 1, 
          background: 'linear-gradient(90deg, transparent, #0ea5e9, transparent)' 
        }} />
      </div>
      
      <style>{`
        @keyframes gridMove {
          from { transform: translateY(0); }
          to { transform: translateY(50px); }
        }
        
        @keyframes planetFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        ${Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 100;
          return `
            @keyframes orbit${i} {
              0% {
                transform: translate(-50%, -50%) translate(0, 0) scale(0);
                opacity: 0;
              }
              50% {
                opacity: 1;
              }
              100% {
                transform: translate(-50%, -50%) translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px) scale(1);
                opacity: 0;
              }
            }
          `;
        }).join('\n')}
      `}</style>
    </div>
  );
}