import React, { useState, useEffect, useRef } from 'react';
import { WorldType, ActivePet } from '../../types';
import { soundEngine } from '../../utils/audio';
import { Play, RotateCcw, X, ChevronUp } from 'lucide-react';

interface AdventureRunProps {
  isOpen: boolean;
  onClose: () => void;
  world: WorldType;
  onAddCoins: (amount: number) => void;
  defaultCharacter?: ActivePet;
}

interface Obstacle {
  x: number;
  width: number;
  height: number;
  type: 'alarm' | 'spike' | 'anchor';
}

interface Collectible {
  x: number;
  y: number;
  collected: boolean;
  type: 'coin' | 'star' | 'donut';
}

export const AdventureRun: React.FC<AdventureRunProps> = ({
  isOpen,
  onClose,
  world,
  onAddCoins,
  defaultCharacter = 'jevin',
}) => {
  const [runnerChar, setRunnerChar] = useState<'jevin' | 'sky' | 'duo'>(
    defaultCharacter === 'sky' ? 'sky' : 'jevin'
  );
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('jevin_high_run') || '0', 10);
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  // Player physics
  const playerRef = useRef({
    x: 60,
    y: 190,
    vy: 0,
    width: 44,
    height: 52,
    isGrounded: true,
  });

  const obstaclesRef = useRef<Obstacle[]>([]);
  const collectiblesRef = useRef<Collectible[]>([]);
  const frameRef = useRef(0);
  const speedRef = useRef(3.8);

  const triggerJump = () => {
    const p = playerRef.current;
    if (p.isGrounded) {
      soundEngine.playPop();
      p.vy = -12.5;
      p.isGrounded = false;
    }
  };

  const startGame = () => {
    soundEngine.playPop();
    playerRef.current = {
      x: 60,
      y: 190,
      vy: 0,
      width: 44,
      height: 52,
      isGrounded: true,
    };
    obstaclesRef.current = [];
    collectiblesRef.current = [];
    frameRef.current = 0;
    speedRef.current = 3.8;
    setScore(0);
    setCoinsCollected(0);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const loop = () => {
      if (!isRunning) return;
      frameRef.current++;

      if (frameRef.current % 10 === 0) {
        setScore((s) => s + 1);
      }

      if (frameRef.current % 600 === 0) {
        speedRef.current += 0.3;
      }

      const p = playerRef.current;
      const groundY = 190;

      p.vy += 0.65;
      p.y += p.vy;

      if (p.y >= groundY) {
        p.y = groundY;
        p.vy = 0;
        p.isGrounded = true;
      }

      // Obstacles
      if (frameRef.current % 110 === 0) {
        const types: ('alarm' | 'spike' | 'anchor')[] = ['alarm', 'spike', 'anchor'];
        obstaclesRef.current.push({
          x: canvas.width + 40,
          width: 34,
          height: 38,
          type: types[Math.floor(Math.random() * types.length)],
        });
      }

      // Collectibles
      if (frameRef.current % 70 === 0) {
        collectiblesRef.current.push({
          x: canvas.width + 20,
          y: groundY - 20 - Math.random() * 65,
          collected: false,
          type: Math.random() > 0.3 ? 'coin' : 'star',
        });
      }

      // Move obstacles
      for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
        const obs = obstaclesRef.current[i];
        obs.x -= speedRef.current;

        if (
          p.x + p.width * 0.7 > obs.x &&
          p.x + p.width * 0.3 < obs.x + obs.width &&
          p.y + p.height > groundY - obs.height + 10
        ) {
          soundEngine.playSurprise();
          isRunning = false;
          setGameState('gameover');
          return;
        }

        if (obs.x < -60) {
          obstaclesRef.current.splice(i, 1);
        }
      }

      // Move collectibles
      for (let i = collectiblesRef.current.length - 1; i >= 0; i--) {
        const col = collectiblesRef.current[i];
        col.x -= speedRef.current;

        if (!col.collected) {
          const dx = p.x + p.width / 2 - col.x;
          const dy = p.y + p.height / 2 - col.y;
          if (Math.hypot(dx, dy) < 32) {
            col.collected = true;
            soundEngine.playCoin();
            const gain = col.type === 'star' ? 5 : 2;
            setCoinsCollected((c) => c + gain);
            onAddCoins(gain);
          }
        }

        if (col.x < -40) {
          collectiblesRef.current.splice(i, 1);
        }
      }

      // Render
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle =
        world === 'candy'
          ? '#f472b6'
          : world === 'pirate'
          ? '#78350f'
          : world === 'underwater'
          ? '#0f766e'
          : '#334155';
      ctx.fillRect(0, groundY + 50, canvas.width, canvas.height - (groundY + 50));
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, groundY + 48, canvas.width, 3);

      collectiblesRef.current.forEach((col) => {
        if (col.collected) return;
        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        ctx.fillText(col.type === 'coin' ? '🪙' : '⭐', col.x, col.y);
      });

      obstaclesRef.current.forEach((obs) => {
        ctx.font = '28px serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          obs.type === 'alarm' ? '⏰' : obs.type === 'anchor' ? '⚓' : '🌵',
          obs.x + obs.width / 2,
          groundY + 46
        );
      });

      // DRAW RUNNER CHARACTER (JEVIN OR SKY OR DUO)
      const drawCharacterSprite = (
        charType: 'jevin' | 'sky',
        offsetX: number,
        offsetY: number
      ) => {
        ctx.save();
        ctx.translate(p.x + p.width / 2 + offsetX, p.y + p.height / 2 + offsetY);
        ctx.rotate(p.isGrounded ? Math.sin(frameRef.current * 0.2) * 0.1 : -0.15);

        if (charType === 'jevin') {
          // Jevin Sprite
          ctx.fillStyle = '#1e3a8a';
          ctx.beginPath();
          ctx.arc(0, -6, 20, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#4f46e5';
          ctx.beginPath();
          ctx.arc(0, -4, 15, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(-5, -6, 4, 0, Math.PI);
          ctx.arc(5, -6, 4, 0, Math.PI);
          ctx.stroke();

          ctx.fillStyle = '#3b82f6';
          ctx.beginPath();
          ctx.moveTo(-10, 10);
          ctx.lineTo(10, 10);
          ctx.lineTo(14, 26);
          ctx.lineTo(-14, 26);
          ctx.closePath();
          ctx.fill();
        } else {
          // Sky Sprite (Bear ears & cyan color)
          ctx.fillStyle = '#38bdf8';
          // Ears
          ctx.beginPath();
          ctx.arc(-14, -20, 8, 0, Math.PI * 2);
          ctx.arc(14, -20, 8, 0, Math.PI * 2);
          ctx.fill();

          // Head
          ctx.beginPath();
          ctx.arc(0, -6, 20, 0, Math.PI * 2);
          ctx.fill();

          // Face
          ctx.fillStyle = '#7dd3fc';
          ctx.beginPath();
          ctx.arc(0, -4, 15, 0, Math.PI * 2);
          ctx.fill();

          // Sleepy Eyes
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(-5, -6, 4, 0, Math.PI);
          ctx.arc(5, -6, 4, 0, Math.PI);
          ctx.stroke();

          // Body
          ctx.fillStyle = '#0ea5e9';
          ctx.beginPath();
          ctx.moveTo(-10, 10);
          ctx.lineTo(10, 10);
          ctx.lineTo(13, 26);
          ctx.lineTo(-13, 26);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      };

      if (runnerChar === 'duo') {
        drawCharacterSprite('jevin', -16, 0);
        drawCharacterSprite('sky', 16, 4);
      } else {
        drawCharacterSprite(runnerChar, 0, 0);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [gameState, world, runnerChar, onAddCoins]);

  useEffect(() => {
    if (gameState === 'gameover' && score > highScore) {
      setHighScore(score);
      localStorage.setItem('jevin_high_run', score.toString());
    }
  }, [gameState, score, highScore]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-emerald-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 border-b border-emerald-500/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏃</span>
            <h3 className="font-bold text-white text-base">
              Jalan-jalan {runnerChar === 'sky' ? 'Sky' : runnerChar === 'duo' ? 'Jevin & Sky' : 'Jevin'}
            </h3>
          </div>
          <button
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Character Pick Pills */}
        {gameState !== 'playing' && (
          <div className="flex p-2 gap-1.5 bg-slate-950/70 border-b border-slate-800">
            <button
              onClick={() => {
                soundEngine.playPop();
                setRunnerChar('jevin');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                runnerChar === 'jevin'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              😴 Jevin Lari
            </button>
            <button
              onClick={() => {
                soundEngine.playPop();
                setRunnerChar('sky');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                runnerChar === 'sky'
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🐻 Sky Lari
            </button>
            <button
              onClick={() => {
                soundEngine.playPop();
                setRunnerChar('duo');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                runnerChar === 'duo'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              👯 Lari Bareng
            </button>
          </div>
        )}

        {/* HUD Info */}
        <div className="flex justify-between items-center px-5 py-2.5 bg-slate-950/70 border-b border-slate-800 text-xs font-bold text-white">
          <div className="flex items-center gap-2">
            <span>Jarak: <span className="text-emerald-400">{score}m</span></span>
            <span className="text-slate-500">|</span>
            <span>Koin: <span className="text-amber-400">+{coinsCollected} 🪙</span></span>
          </div>
          <div className="text-slate-400">
            Terbaik: <span className="text-amber-300">{highScore}m</span>
          </div>
        </div>

        {/* Game Canvas */}
        <div
          onClick={triggerJump}
          className="relative w-full h-[280px] bg-slate-950 cursor-pointer overflow-hidden select-none"
        >
          <canvas
            ref={canvasRef}
            width={480}
            height={280}
            className="w-full h-full block"
          />

          {gameState === 'ready' && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-center p-4 space-y-4">
              <div className="text-5xl animate-bounce">
                {runnerChar === 'sky' ? '🐻' : '👟'}
              </div>
              <h4 className="text-lg font-black text-white">
                Mulai Lari Bersama {runnerChar === 'sky' ? 'Sky' : runnerChar === 'duo' ? 'Jevin & Sky' : 'Jevin'}!
              </h4>
              <p className="text-xs text-slate-300 max-w-xs">
                Ketuk layar untuk melompati jam weker ⏰ dan raih koin emas berlimpah 🪙!
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-xl active:scale-95 flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                Mulai Petualangan
              </button>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center text-center p-4 space-y-3">
              <div className="text-4xl animate-pulse">🥱</div>
              <h4 className="text-lg font-black text-rose-400">
                {runnerChar === 'sky' ? 'Sky Tertabrak!' : 'Jevin Tertabrak & Tertidur!'}
              </h4>
              <p className="text-xs text-slate-200">
                Jarak: <b className="text-emerald-400">{score}m</b> | Total koin: <b className="text-amber-400">+{coinsCollected} 🪙</b>
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startGame();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Main Lagi
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700"
                >
                  Kembali
                </button>
              </div>
            </div>
          )}
        </div>

        {gameState === 'playing' && (
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-center">
            <button
              onClick={triggerJump}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <ChevronUp className="w-5 h-5" />
              LONCAT (KETUK)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
