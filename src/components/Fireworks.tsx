import React, { useEffect, useState } from 'react';

type Confetti = {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  velocityX: number;
  velocityY: number;
  size: number;
};

export default function Fireworks() {
  const [confetti, setConfetti] = useState<Confetti[]>([]);

  useEffect(() => {
    const colors = ['#D4B3FF', '#A8E6CF', '#FFD5C8', '#C8E5FF', '#FFC4B3', '#E8D5FF'];
    const newConfetti: Confetti[] = [];
    
    // Create 3 firework explosions
    const fireworkPositions = [
      { x: 25, y: 25, delay: 0 },
      { x: 50, y: 30, delay: 400 },
      { x: 75, y: 25, delay: 800 },
    ];

    fireworkPositions.forEach((fw, fwIndex) => {
      // Each firework creates 40-50 confetti pieces
      const pieces = 40 + Math.floor(Math.random() * 10);
      
      for (let i = 0; i < pieces; i++) {
        const angle = (Math.PI * 2 * i) / pieces;
        const velocity = 3 + Math.random() * 4;
        
        newConfetti.push({
          id: fwIndex * 100 + i,
          x: fw.x,
          y: fw.y,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          velocityX: Math.cos(angle) * velocity,
          velocityY: Math.sin(angle) * velocity - 2, // Add upward bias
          size: 6 + Math.random() * 6,
        });
      }
    });

    // Stagger the fireworks
    fireworkPositions.forEach((fw, index) => {
      setTimeout(() => {
        const start = index * 100;
        const end = start + 50;
        setConfetti(prev => [...prev, ...newConfetti.slice(start, end)]);
      }, fw.delay);
    });

    return () => setConfetti([]);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            '--velocity-x': piece.velocityX,
            '--velocity-y': piece.velocityY,
            '--rotation': piece.rotation,
          } as React.CSSProperties}
        />
      ))}
      
      <style jsx>{`
        .confetti-piece {
          position: absolute;
          animation: confetti-fall 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
          border-radius: 2px;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(var(--velocity-x) * 80px),
              calc(var(--velocity-y) * 80px + 200px)
            ) rotate(calc(var(--rotation) * 3deg));
            opacity: 0;
          }
        }
        
        .confetti-piece:nth-child(3n) {
          animation-duration: 2.3s;
        }
        
        .confetti-piece:nth-child(3n+1) {
          animation-duration: 2.7s;
        }
        
        .confetti-piece:nth-child(2n) {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}

