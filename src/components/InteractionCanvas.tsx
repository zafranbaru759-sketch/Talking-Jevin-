import React, { useRef, useEffect } from 'react';
import { soundEngine } from '../utils/audio';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  shape: 'star' | 'heart' | 'bubble' | 'confetti';
  rotation: number;
  rotationSpeed: number;
}

interface InteractionCanvasProps {
  onTap: (x: number, y: number) => void;
  onPet: () => void;
  onSwipe: (dir: 'left' | 'right' | 'up' | 'down') => void;
  className?: string;
}

export const InteractionCanvas: React.FC<InteractionCanvasProps> = ({
  onTap,
  onPet,
  onSwipe,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const dragDistanceRef = useRef<number>(0);
  const lastPetTimeRef = useRef<number>(0);

  // Spawn particle helper (can be triggered externally or via events)
  const addParticles = (x: number, y: number, count: number, type: 'star' | 'heart' | 'bubble' | 'confetti' = 'heart') => {
    const colors = ['#f43f5e', '#ec4899', '#a855f7', '#38bdf8', '#fbbf24', '#34d399'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 10 + Math.random() * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.015 + Math.random() * 0.02,
        shape: type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
      });
    }
  };

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.shape === 'bubble') {
          p.vy -= 0.05; // float upwards
        } else {
          p.vy += 0.08; // gentle gravity
        }

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === 'heart') {
          ctx.fillStyle = p.color;
          const s = p.size / 2;
          ctx.beginPath();
          ctx.moveTo(0, s * 0.3);
          ctx.bezierCurveTo(-s, -s * 0.5, -s * 1.2, s * 0.6, 0, s * 1.2);
          ctx.bezierCurveTo(s * 1.2, s * 0.6, s, -s * 0.5, 0, s * 0.3);
          ctx.fill();
        } else if (p.shape === 'star') {
          ctx.fillStyle = p.color;
          const r = p.size;
          ctx.beginPath();
          for (let j = 0; j < 5; j++) {
            ctx.lineTo(
              Math.cos(((18 + j * 72) * Math.PI) / 180) * r,
              -Math.sin(((18 + j * 72) * Math.PI) / 180) * r
            );
            ctx.lineTo(
              Math.cos(((54 + j * 72) * Math.PI) / 180) * (r / 2),
              -Math.sin(((54 + j * 72) * Math.PI) / 180) * (r / 2)
            );
          }
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === 'bubble') {
          ctx.strokeStyle = '#ffffff';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fill();
          // Bubble shine
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-p.size * 0.15, -p.size * 0.15, p.size * 0.1, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Confetti rectangle
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Pointer event handlers for cross-device mobile + desktop support
  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    touchStartRef.current = { x, y, time: Date.now() };
    dragDistanceRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!touchStartRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - touchStartRef.current.x;
    const dy = y - touchStartRef.current.y;
    const dist = Math.hypot(dx, dy);
    dragDistanceRef.current += dist;

    // Petting / Usap gesture (continuous gentle dragging)
    const now = Date.now();
    if (dist > 8 && now - lastPetTimeRef.current > 120) {
      lastPetTimeRef.current = now;
      addParticles(x, y, 2, 'heart');
      onPet();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!touchStartRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - touchStartRef.current.x;
    const dy = y - touchStartRef.current.y;
    const duration = Date.now() - touchStartRef.current.time;

    // Fast swipe gesture (Geser)
    if (Math.abs(dx) > 60 && duration < 350) {
      soundEngine.playPop();
      addParticles(x, y, 12, 'star');
      onSwipe(dx > 0 ? 'right' : 'left');
    } else if (Math.abs(dy) > 60 && duration < 350) {
      soundEngine.playPop();
      addParticles(x, y, 12, 'star');
      onSwipe(dy > 0 ? 'down' : 'up');
    } else if (dragDistanceRef.current < 15) {
      // Tap / Poke / Colek
      addParticles(x, y, 8, 'star');
      onTap(x, y);
    }

    touchStartRef.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => (touchStartRef.current = null)}
      className={`absolute inset-0 z-20 touch-none ${className}`}
    />
  );
};
