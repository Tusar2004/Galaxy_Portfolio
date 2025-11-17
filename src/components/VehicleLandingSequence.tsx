import { useState, useEffect } from 'react';

interface VehicleLandingProps {
  vehicleType: 'car' | 'rocket' | 'walk';
  planetTheme: {
    color: string;
    bgColor: string;
  };
  onComplete: () => void;
}

type Phase = 'descending' | 'landed' | 'hatch_open' | 'astronaut_exit' | 'complete';

export default function VehicleLandingSequence({ 
  vehicleType, 
  planetTheme, 
  onComplete 
}: VehicleLandingProps) {
  const [phase, setPhase] = useState<Phase>('descending');
  
  useEffect(() => {
    const timeline = [
      { phase: 'descending' as Phase, duration: 1500 },
      { phase: 'landed' as Phase, duration: 500 },
      { phase: 'hatch_open' as Phase, duration: 800 },
      { phase: 'astronaut_exit' as Phase, duration: 1200 },
      { phase: 'complete' as Phase, duration: 0 }
    ];
    
    let currentIndex = 0;
    
    const advancePhase = () => {
      if (currentIndex < timeline.length - 1) {
        currentIndex++;
        setPhase(timeline[currentIndex].phase);
        if (timeline[currentIndex].duration > 0) {
          setTimeout(advancePhase, timeline[currentIndex].duration);
        } else {
          onComplete();
        }
      }
    };
    
    setTimeout(advancePhase, timeline[0].duration);
  }, [onComplete]);
  
  const getVehicleIcon = () => {
    if (vehicleType === 'rocket') return '🚀';
    if (vehicleType === 'car') return '🏎️';
    return '🧑‍🚀';
  };
  
  const getStatusText = () => {
    if (phase === 'descending') return '⬇ LANDING SEQUENCE INITIATED';
    if (phase === 'landed') return '✓ TOUCHDOWN SUCCESSFUL';
    if (phase === 'hatch_open') return '🔓 HATCH OPENING';
    if (phase === 'astronaut_exit') return '👤 ASTRONAUT DEPLOYING';
    return '✓ READY TO EXPLORE';
  };
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${planetTheme.bgColor}ee, ${planetTheme.bgColor}99)`,
      backdropFilter: 'blur(10px)'
    }}>
      {/* Vehicle Model */}
      <div style={{
        position: 'relative',
        animation: phase === 'descending' ? 'vehicleDescend 1.5s ease-out forwards' : 'none',
        transform: phase === 'landed' ? 'translateY(0)' : 'none'
      }}>
        {/* Vehicle Icon */}
        <div style={{
          fontSize: 120,
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
          animation: phase === 'landed' ? 'landingShake 0.3s ease-out' : 'none'
        }}>
          {getVehicleIcon()}
        </div>
        
        {/* Landing Dust */}
        {phase === 'landed' && (
          <div style={{
            position: 'absolute',
            bottom: -40,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 200,
            height: 60,
            background: `radial-gradient(ellipse, ${planetTheme.color}40, transparent)`,
            animation: 'dustCloud 0.8s ease-out forwards'
          }} />
        )}
        
        {/* Hatch Opening Effect */}
        {(phase === 'hatch_open' || phase === 'astronaut_exit' || phase === 'complete') && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 40,
            height: 60,
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))',
            borderRadius: '20px 20px 0 0',
            animation: 'hatchOpen 0.8s ease-out forwards'
          }} />
        )}
        
        {/* Smoke Effect */}
        {(phase === 'hatch_open' || phase === 'astronaut_exit') && (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '30%',
                  left: '50%',
                  width: 20 + Math.random() * 30,
                  height: 20 + Math.random() * 30,
                  background: 'rgba(200, 200, 200, 0.6)',
                  borderRadius: '50%',
                  animation: `smokeRise 1.5s ease-out ${i * 0.1}s forwards`
                }}
              />
            ))}
          </>
        )}
        
        {/* Astronaut Emerging */}
        {(phase === 'astronaut_exit' || phase === 'complete') && (
          <div style={{
            position: 'absolute',
            bottom: -80,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 60,
            animation: 'astronautWalkOut 1.2s ease-out forwards'
          }}>
            🧑‍🚀
          </div>
        )}
      </div>
      
      {/* Status Text */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        left: '50%',
        transform: 'translateX(-50%)',
        color: planetTheme.color,
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: 3,
        textAlign: 'center',
        textShadow: `0 0 20px ${planetTheme.color}`,
        animation: 'textPulse 1.5s ease-in-out infinite'
      }}>
        {getStatusText()}
      </div>
      
      <style>{`
        @keyframes vehicleDescend {
          0% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
          70% { transform: translateY(0) scale(1.05); opacity: 1; }
          85% { transform: translateY(10px) scale(0.98); }
          100% { transform: translateY(0) scale(1); }
        }
        
        @keyframes landingShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes dustCloud {
          0% { transform: translateX(-50%) scale(0); opacity: 1; }
          100% { transform: translateX(-50%) scale(2); opacity: 0; }
        }
        
        @keyframes hatchOpen {
          0% { height: 0; opacity: 0; }
          100% { height: 60px; opacity: 1; }
        }
        
        @keyframes smokeRise {
          0% { 
            transform: translate(-50%, 0) scale(0.5);
            opacity: 0.8;
          }
          100% { 
            transform: translate(-50%, -150px) scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes astronautWalkOut {
          0% {
            transform: translateX(-50%) translateY(100px) scale(0);
            opacity: 0;
          }
          50% {
            transform: translateX(-50%) translateY(0) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) translateY(0) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes textPulse {
          0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.05); }
        }
      `}</style>
    </div>
  );
}