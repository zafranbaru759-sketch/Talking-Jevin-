import React from 'react';
import { WorldType } from '../types';

interface WorldBackgroundProps {
  world: WorldType;
  isNight: boolean;
  children?: React.ReactNode;
}

export const WorldBackground: React.FC<WorldBackgroundProps> = ({
  world,
  isNight,
  children,
}) => {
  // Determine gradient and background visuals for each world and day/night
  const getBackgroundStyles = () => {
    switch (world) {
      case 'candy':
        return isNight
          ? 'from-purple-950 via-pink-950 to-indigo-950 text-pink-100'
          : 'from-pink-300 via-rose-200 to-amber-100 text-slate-800';

      case 'pirate':
        return isNight
          ? 'from-slate-950 via-blue-950 to-cyan-950 text-cyan-100'
          : 'from-sky-400 via-blue-300 to-amber-200 text-slate-800';

      case 'underwater':
        return isNight
          ? 'from-indigo-950 via-blue-950 to-slate-950 text-cyan-200'
          : 'from-cyan-500 via-teal-400 to-emerald-300 text-teal-950';

      case 'room':
      default:
        return isNight
          ? 'from-slate-950 via-indigo-950 to-blue-950 text-indigo-100'
          : 'from-indigo-200 via-purple-100 to-sky-200 text-slate-800';
    }
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-gradient-to-b transition-colors duration-700 ${getBackgroundStyles()}`}
    >
      {/* CELESTIAL BODY: SUN OR MOON */}
      <div className="absolute top-6 right-8 pointer-events-none transition-all duration-700">
        {isNight ? (
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-amber-100 shadow-[0_0_35px_rgba(254,240,138,0.7)] flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-950/20 absolute -right-1 -top-1" />
            </div>
            {/* Stars */}
            <div className="absolute -left-12 top-4 w-2 h-2 rounded-full bg-white animate-ping" />
            <div className="absolute -left-32 top-12 w-1.5 h-1.5 rounded-full bg-yellow-200 animate-pulse" />
            <div className="absolute left-8 -top-8 w-1 h-1 rounded-full bg-white" />
          </div>
        ) : (
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-amber-300 shadow-[0_0_50px_rgba(251,191,36,0.85)] animate-pulse-soft" />
            <div className="absolute -inset-2 rounded-full border border-amber-200/40 animate-spin" style={{ animationDuration: '30s' }} />
          </div>
        )}
      </div>

      {/* WORLD SCENIC LAYER */}
      {world === 'room' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Cozy Window */}
          <div className="absolute top-16 left-8 w-28 h-36 rounded-t-full border-4 border-amber-800/40 bg-white/20 backdrop-blur-xs flex flex-col justify-center items-center shadow-inner">
            <div className="w-full h-1 bg-amber-800/30" />
            <div className="h-full w-1 bg-amber-800/30 absolute" />
            <span className="text-2xl mt-4 opacity-75">{isNight ? '🌙' : '☁️'}</span>
          </div>
          {/* Hanging Plant / Light */}
          <div className="absolute top-0 right-32 flex flex-col items-center">
            <div className="w-0.5 h-16 bg-amber-700/50" />
            <div className="w-10 h-8 rounded-b-2xl bg-amber-300/80 shadow-[0_0_15px_rgba(252,211,77,0.6)] flex items-center justify-center text-xs">
              💡
            </div>
          </div>
          {/* Floor */}
          <div className="absolute bottom-0 w-full h-32 bg-amber-900/15 border-t border-amber-800/20 flex items-center justify-around">
            <div className="w-48 h-8 rounded-full bg-indigo-500/10 blur-xs" />
          </div>
        </div>
      )}

      {world === 'candy' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Giant Floating Lollipops */}
          <div className="absolute bottom-28 left-6 flex flex-col items-center animate-bounce" style={{ animationDuration: '4s' }}>
            <div className="w-20 h-20 rounded-full bg-radial from-rose-400 via-pink-500 to-amber-300 shadow-lg border-2 border-white/60 flex items-center justify-center text-2xl">
              🍭
            </div>
            <div className="w-2 h-24 bg-white/80 rounded-full" />
          </div>
          <div className="absolute bottom-36 right-6 flex flex-col items-center animate-bounce" style={{ animationDuration: '5s' }}>
            <div className="w-16 h-16 rounded-full bg-radial from-purple-400 via-indigo-500 to-pink-300 shadow-md border-2 border-white/60 flex items-center justify-center text-xl">
              🍬
            </div>
            <div className="w-2 h-20 bg-white/80 rounded-full" />
          </div>
          {/* Floating Candy Clouds */}
          <div className="absolute top-20 left-1/4 px-6 py-2 rounded-full bg-pink-100/40 backdrop-blur-xs text-sm font-bold animate-float-slow">
            🍡 Marshmallow Sky
          </div>
          {/* Sugar ground */}
          <div className="absolute bottom-0 w-full h-28 bg-pink-500/25 border-t-4 border-pink-300/60 flex justify-center items-center">
            <span className="text-3xl opacity-40">🍫 🧁 🍬 🍭 🍩</span>
          </div>
        </div>
      )}

      {world === 'pirate' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Pirate Ship Mast & Rigging */}
          <div className="absolute top-12 left-6 flex flex-col items-center">
            <div className="text-3xl animate-pulse">🏴‍☠️</div>
            <div className="w-1 h-32 bg-amber-900/40" />
          </div>
          {/* Ocean Waves on Horizon */}
          <div className="absolute bottom-28 w-full flex justify-around opacity-60 text-2xl animate-pulse-soft">
            <span>🌊</span><span>⛵</span><span>🌊</span><span>🐬</span><span>🌊</span>
          </div>
          {/* Wooden Deck Planks Floor */}
          <div className="absolute bottom-0 w-full h-28 bg-amber-950/40 border-t-4 border-amber-800/80 flex flex-col justify-around px-4">
            <div className="w-full h-0.5 bg-amber-900/40" />
            <div className="w-full h-0.5 bg-amber-900/40" />
            <div className="w-full h-0.5 bg-amber-900/40" />
          </div>
          {/* Treasure chest decor */}
          <div className="absolute bottom-24 right-8 text-3xl filter drop-shadow-md">
            🪙
          </div>
        </div>
      )}

      {world === 'underwater' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Rising Ocean Bubbles */}
          <div className="absolute bottom-8 left-12 w-4 h-4 rounded-full bg-white/40 border border-white/70 animate-ping" />
          <div className="absolute bottom-16 left-1/3 w-6 h-6 rounded-full bg-cyan-200/50 border border-white/80 animate-bounce" style={{ animationDuration: '3s' }} />
          <div className="absolute bottom-24 right-20 w-8 h-8 rounded-full bg-teal-200/40 border border-white/70 animate-bounce" style={{ animationDuration: '4.5s' }} />
          {/* Corals & Seaweed */}
          <div className="absolute bottom-0 left-4 text-4xl opacity-80">
            🪸 🌿
          </div>
          <div className="absolute bottom-0 right-4 text-4xl opacity-80">
            🌿 🐠 🪸
          </div>
          {/* Sandy Seabed */}
          <div className="absolute bottom-0 w-full h-24 bg-amber-600/20 border-t-2 border-teal-300/40 flex justify-center items-center">
            <span className="text-2xl opacity-50">🐚 🦀 ⭐️</span>
          </div>
        </div>
      )}

      {/* FOREGROUND INTERACTIVE CONTENT */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
