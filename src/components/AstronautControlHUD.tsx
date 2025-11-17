import { useState, useEffect } from 'react';

interface AstronautControlHUDProps {
  planetName: string;
}

export default function AstronautControlHUD({ planetName }: AstronautControlHUDProps) {
  const [showControls, setShowControls] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 8000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 30,
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '20px 30px',
      background: 'rgba(0, 0, 0, 0.85)',
      border: '2px solid rgba(0, 212, 255, 0.5)',
      borderRadius: 16,
      color: 'white',
      fontFamily: 'Inter, sans-serif',
      zIndex: 1000,
      animation: showControls ? 'slideUp 0.5s ease-out' : 'slideDown 0.5s ease-out forwards',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        fontSize: 16,
        fontWeight: 700,
        color: '#00d4ff',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: 2
      }}>
        🧑‍🚀 ASTRONAUT MODE ACTIVE
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        fontSize: 13
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#00d4ff', fontWeight: 700, marginBottom: 4 }}>WASD</div>
          <div style={{ color: '#94a3b8', fontSize: 11 }}>Movement</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#00d4ff', fontWeight: 700, marginBottom: 4 }}>SHIFT</div>
          <div style={{ color: '#94a3b8', fontSize: 11 }}>Sprint</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#00d4ff', fontWeight: 700, marginBottom: 4 }}>SPACE</div>
          <div style={{ color: '#94a3b8', fontSize: 11 }}>Hop</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#00d4ff', fontWeight: 700, marginBottom: 4 }}>MOUSE</div>
          <div style={{ color: '#94a3b8', fontSize: 11 }}>Look</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#00d4ff', fontWeight: 700, marginBottom: 4 }}>E</div>
          <div style={{ color: '#94a3b8', fontSize: 11 }}>Interact</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#00d4ff', fontWeight: 700, marginBottom: 4 }}>ESC</div>
          <div style={{ color: '#94a3b8', fontSize: 11 }}>Exit</div>
        </div>
      </div>
      
      <div style={{
        marginTop: 12,
        paddingTop: 12,
        borderTop: '1px solid rgba(0, 212, 255, 0.2)',
        textAlign: 'center',
        fontSize: 11,
        color: '#94a3b8'
      }}>
        Exploring: <span style={{ color: '#00d4ff', fontWeight: 700 }}>{planetName}</span>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { 
            transform: translateX(-50%) translateY(100px);
            opacity: 0;
          }
          to { 
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes slideDown {
          from { 
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
          to { 
            transform: translateX(-50%) translateY(100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}