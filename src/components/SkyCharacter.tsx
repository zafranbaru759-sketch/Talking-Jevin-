import React, { useState, useEffect } from 'react';
import { MoodState, AccessoryItem } from '../types';

interface SkyProps {
  mood?: MoodState;
  isSleeping?: boolean;
  isEating?: boolean;
  isBathing?: boolean;
  isTalking?: boolean;
  isTickled?: boolean;
  isPoked?: boolean;
  isCrying?: boolean;
  equippedHat?: AccessoryItem | null;
  equippedGlasses?: AccessoryItem | null;
  onPoke?: () => void;
  scale?: number;
  usePhotoModel?: boolean;
  dialogue?: string | null;
}

export const SkyCharacter: React.FC<SkyProps> = ({
  mood = 'happy',
  isSleeping = false,
  isEating = false,
  isBathing = false,
  isTalking = false,
  isTickled = false,
  isPoked = false,
  isCrying = false,
  equippedHat,
  equippedGlasses,
  onPoke,
  scale = 1,
  usePhotoModel = false,
  dialogue,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [mouthPhase, setMouthPhase] = useState(0);

  useEffect(() => {
    if (isSleeping) return;
    const blinkTimer = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 240);
    }, 4000);
    return () => clearInterval(blinkTimer);
  }, [isSleeping]);

  // Talking / Eating mouth motion
  useEffect(() => {
    if (!isTalking && !isEating) return;
    const interval = setInterval(() => {
      setMouthPhase((p) => (p + 1) % 4);
    }, 130);
    return () => clearInterval(interval);
  }, [isTalking, isEating]);

  const renderEyes = () => {
    if (isSleeping) {
      return (
        <g className="transition-all duration-300">
          <path d="M 54 130 Q 78 144 102 130" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M 118 130 Q 142 144 166 130" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" fill="none" />
        </g>
      );
    }

    if (isBlinking) {
      return (
        <g className="transition-all duration-150">
          <line x1="52" y1="126" x2="102" y2="126" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
          <line x1="116" y1="126" x2="166" y2="126" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
        </g>
      );
    }

    if (mood === 'laughing' || isTickled) {
      return (
        <g className="transition-all duration-200">
          <path d="M 52 132 Q 77 106 102 132" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M 116 132 Q 141 106 166 132" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" fill="none" />
        </g>
      );
    }

    if (isCrying || mood === 'crying') {
      return (
        <g>
          {/* Squeezed sad eyes > < */}
          <path d="M 54 122 L 77 132 L 54 142" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 100 122 L 77 132 L 100 142" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          <path d="M 118 122 L 141 132 L 118 142" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 164 122 L 141 132 L 164 142" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* Left Tear Waterfall */}
          <path
            d="M 77 135 C 65 160, 32 170, 24 205 C 18 230, 32 255, 36 270"
            stroke="#0ea5e9"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            opacity="0.88"
          />
          <path
            d="M 77 135 C 65 160, 32 170, 24 205 C 18 230, 32 255, 36 270"
            stroke="#e0f2fe"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
          {/* Left Splash drops */}
          <circle cx="20" cy="215" r="4.5" fill="#38bdf8" />
          <circle cx="30" cy="245" r="3.5" fill="#7dd3fc" />
          <circle cx="14" cy="255" r="5" fill="#0284c7" />

          {/* Right Tear Waterfall */}
          <path
            d="M 141 135 C 153 160, 186 170, 194 205 C 200 230, 186 255, 182 270"
            stroke="#0ea5e9"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            opacity="0.88"
          />
          <path
            d="M 141 135 C 153 160, 186 170, 194 205 C 200 230, 186 255, 182 270"
            stroke="#e0f2fe"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
          {/* Right Splash drops */}
          <circle cx="198" cy="215" r="4.5" fill="#38bdf8" />
          <circle cx="188" cy="245" r="3.5" fill="#7dd3fc" />
          <circle cx="204" cy="255" r="5" fill="#0284c7" />
        </g>
      );
    }

    if (mood === 'surprised' || isPoked) {
      return (
        <g className="transition-all duration-150">
          <circle cx="77" cy="126" r="20" fill="#ffffff" />
          <circle cx="77" cy="126" r="8" fill="#145973" />
          <circle cx="141" cy="126" r="20" fill="#ffffff" />
          <circle cx="141" cy="126" r="8" fill="#145973" />
        </g>
      );
    }

    // Default ICONIC DROWSY U-SHAPED EYES (Reference match)
    return (
      <g>
        {/* Left Eye */}
        <path
          d="M 52 110 L 102 110 C 102 142, 52 142, 52 110 Z"
          fill="#ffffff"
        />
        <path
          d="M 60 112 L 94 112 C 94 135, 60 135, 60 112 Z"
          fill="#186782"
        />
        <line x1="50" y1="110" x2="104" y2="110" stroke="#175f79" strokeWidth="3" strokeLinecap="round" />

        {/* Right Eye */}
        <path
          d="M 114 110 L 164 110 C 164 142, 114 142, 114 110 Z"
          fill="#ffffff"
        />
        <path
          d="M 122 112 L 156 112 C 156 135, 122 135, 122 112 Z"
          fill="#186782"
        />
        <line x1="112" y1="110" x2="166" y2="110" stroke="#175f79" strokeWidth="3" strokeLinecap="round" />
      </g>
    );
  };

  const renderMouth = () => {
    if (isTalking) {
      const heights = [8, 18, 12, 22];
      const h = heights[mouthPhase];
      return (
        <ellipse cx="110" cy="162" rx="12" ry={h / 2} fill="#145973" stroke="#ffffff" strokeWidth="2" />
      );
    }

    if (isEating) {
      const h = mouthPhase % 2 === 0 ? 10 : 4;
      return (
        <ellipse cx="110" cy="162" rx="14" ry={h} fill="#145973" />
      );
    }

    if (mood === 'laughing' || isTickled) {
      return (
        <path
          d="M 98 158 Q 110 174 122 158 Z"
          fill="#145973"
          stroke="#ffffff"
          strokeWidth="2"
        />
      );
    }

    if (isCrying || mood === 'crying') {
      return (
        <g>
          <path
            d="M 96 156 Q 110 146 124 156 Q 126 178 110 180 Q 94 178 96 156 Z"
            fill="#145973"
            stroke="#ffffff"
            strokeWidth="2.5"
          />
          <ellipse cx="110" cy="172" rx="7.5" ry="4" fill="#fb7185" />
        </g>
      );
    }

    if (mood === 'surprised' || isPoked) {
      return (
        <ellipse cx="110" cy="162" rx="8" ry="12" fill="#145973" stroke="#ffffff" strokeWidth="2" />
      );
    }

    // Default cute bear mouth `^`
    return (
      <path
        d="M 103 160 Q 110 156 117 160"
        stroke="#195973"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    );
  };

  // Hat rendering for Sky
  const renderHat = () => {
    if (!equippedHat) return null;
    switch (equippedHat.id) {
      case 'hat_pirate':
        return (
          <g transform="translate(30, -5)">
            <path
              d="M 5 60 C 20 20, 150 20, 165 60 C 130 50, 40 50, 5 60 Z"
              fill="#18181b"
              stroke="#fbbf24"
              strokeWidth="3"
            />
            <path d="M 25 45 C 50 10, 120 10, 145 45 Z" fill="#27272a" />
            <circle cx="85" cy="36" r="7" fill="#ffffff" />
            <line x1="77" y1="45" x2="93" y2="39" stroke="#ffffff" strokeWidth="2.5" />
            <line x1="77" y1="39" x2="93" y2="45" stroke="#ffffff" strokeWidth="2.5" />
          </g>
        );
      case 'hat_sleep':
        return (
          <g transform="translate(35, 0)">
            <path
              d="M 20 55 C 50 10, 110 5, 145 35 C 160 50, 175 80, 168 95"
              fill="#0ea5e9"
              stroke="#38bdf8"
              strokeWidth="3"
            />
            <path d="M 15 50 Q 80 40 145 50 Q 80 62 15 50 Z" fill="#ffffff" />
            <circle cx="168" cy="98" r="14" fill="#ffffff" />
          </g>
        );
      case 'hat_crown':
        return (
          <g transform="translate(45, 5)">
            <path
              d="M 10 45 L 20 15 L 45 30 L 65 10 L 85 30 L 110 15 L 120 45 Z"
              fill="#f59e0b"
              stroke="#b45309"
              strokeWidth="2.5"
            />
            <circle cx="20" cy="15" r="4" fill="#ef4444" />
            <circle cx="65" cy="10" r="5" fill="#3b82f6" />
            <circle cx="110" cy="15" r="4" fill="#10b981" />
          </g>
        );
      case 'hat_cat':
        return (
          <g transform="translate(45, 10)">
            <path d="M 10 40 C 40 25, 100 25, 130 40" stroke="#f43f5e" strokeWidth="5" fill="none" strokeLinecap="round" />
            <polygon points="20,35 40,5 55,30" fill="#fb7185" stroke="#f43f5e" strokeWidth="2" />
            <polygon points="85,30 100,5 120,35" fill="#fb7185" stroke="#f43f5e" strokeWidth="2" />
          </g>
        );
      case 'hat_snorkel':
        return (
          <g transform="translate(35, 18)">
            <rect x="25" y="30" width="100" height="40" rx="14" fill="#06b6d4" opacity="0.4" stroke="#0891b2" strokeWidth="4" />
            <path d="M 125 50 L 140 50 L 140 10 L 146 10" stroke="#facc15" strokeWidth="7" fill="none" strokeLinecap="round" />
          </g>
        );
      default:
        return null;
    }
  };

  const renderGlasses = () => {
    if (!equippedGlasses) return null;
    switch (equippedGlasses.id) {
      case 'glasses_cool':
        return (
          <g transform="translate(48, 108)">
            <polygon points="8,10 56,10 48,30 14,30" fill="#09090b" stroke="#27272a" strokeWidth="2" />
            <polygon points="68,10 116,10 108,30 76,30" fill="#09090b" stroke="#27272a" strokeWidth="2" />
            <line x1="54" y1="15" x2="70" y2="15" stroke="#09090b" strokeWidth="4" />
          </g>
        );
      case 'glasses_nerd':
        return (
          <g transform="translate(48, 106)">
            <circle cx="32" cy="22" r="20" stroke="#d97706" strokeWidth="4" fill="rgba(255,255,255,0.2)" />
            <circle cx="92" cy="22" r="20" stroke="#d97706" strokeWidth="4" fill="rgba(255,255,255,0.2)" />
            <line x1="52" y1="22" x2="72" y2="22" stroke="#d97706" strokeWidth="4" />
          </g>
        );
      case 'glasses_sleep':
        return (
          <g transform="translate(44, 102)">
            <rect x="10" y="8" width="112" height="38" rx="18" fill="#a855f7" stroke="#9333ea" strokeWidth="3" />
            <path d="M 32 26 Q 45 32 58 26" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 74 26 Q 87 32 100 26" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onPoke}
      className="relative flex flex-col items-center justify-center select-none cursor-pointer group"
      style={{
        transform: `scale(${scale})`,
        transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Speech bubble */}
      {dialogue && (
        <div className="absolute -top-14 bg-white/95 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-2xl shadow-lg border border-sky-300 animate-bounce whitespace-nowrap z-30">
          {dialogue}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-sky-300 rotate-45" />
        </div>
      )}

      {/* Sleeping Zzz */}
      {isSleeping && (
        <div className="absolute -top-12 right-0 flex flex-col items-center pointer-events-none z-30">
          <span className="text-xl font-bold text-sky-200 animate-bounce" style={{ animationDelay: '0ms' }}>Z</span>
          <span className="text-2xl font-black text-cyan-300 animate-bounce" style={{ animationDelay: '250ms' }}>z</span>
          <span className="text-3xl font-black text-blue-300 animate-bounce" style={{ animationDelay: '500ms' }}>z</span>
        </div>
      )}

      {/* Bathing bubbles */}
      {isBathing && (
        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-cyan-200/60 backdrop-blur-sm animate-ping absolute -top-3 -right-3" />
          <div className="w-10 h-10 rounded-full bg-white/70 animate-bounce absolute -bottom-1 -left-2" />
        </div>
      )}

      {usePhotoModel ? (
        <div className="relative w-48 h-60 flex items-center justify-center">
          <img
            src="/assets/aistudio/IMG_20261022_171225_c90a6ee4.jpg"
            alt="Sky Companion"
            className={`w-44 h-56 object-contain drop-shadow-xl transition-transform duration-300 ${
              isCrying || mood === 'crying'
                ? 'animate-sob brightness-95'
                : isTickled
                ? 'scale-110 rotate-3'
                : isPoked
                ? 'scale-90 -rotate-2'
                : 'animate-breathe'
            }`}
          />
          {/* Crying tears overlay over reference photo */}
          {(isCrying || mood === 'crying') && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <svg width="200" height="240" viewBox="0 0 200 240" className="overflow-visible">
                {/* Squeezed sad eyes */}
                <path d="M 50 110 L 70 120 L 50 130" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 90 110 L 70 120 L 90 130" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 110 110 L 130 120 L 110 130" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 150 110 L 130 120 L 150 130" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />
                {/* Tear waterfalls */}
                <path d="M 70 125 C 58 145, 30 160, 24 195 C 20 215, 30 235, 35 250" stroke="#0ea5e9" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.9" />
                <path d="M 70 125 C 58 145, 30 160, 24 195 C 20 215, 30 235, 35 250" stroke="#bae6fd" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M 130 125 C 142 145, 170 160, 176 195 C 180 215, 170 235, 165 250" stroke="#0ea5e9" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.9" />
                <path d="M 130 125 C 142 145, 170 160, 176 195 C 180 215, 170 235, 165 250" stroke="#bae6fd" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                {/* Wailing mouth */}
                <ellipse cx="100" cy="150" rx="9" ry="12" fill="#145973" stroke="#ffffff" strokeWidth="2" />
                <ellipse cx="100" cy="156" rx="6" ry="3.5" fill="#fb7185" />
              </svg>
            </div>
          )}
          {/* Overlay hat on photo */}
          <div className="absolute top-0 w-full flex justify-center pointer-events-none">
            <svg width="220" height="120" viewBox="0 0 220 120" className="overflow-visible">
              {renderHat()}
            </svg>
          </div>
        </div>
      ) : (
        /* PROCEDURAL VECTOR SVG FOR SKY */
        <div
          className={`w-52 h-68 flex items-center justify-center filter drop-shadow-[0_12px_22px_rgba(14,165,233,0.35)] transition-transform duration-200 ${
            isCrying || mood === 'crying'
              ? 'animate-sob'
              : isTickled
              ? 'animate-bounce rotate-2 scale-105'
              : isPoked
              ? 'scale-95 -rotate-3'
              : 'animate-breathe'
          }`}
        >
          <svg
            width="220"
            height="270"
            viewBox="0 0 220 270"
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="skyBodyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7ee0ff" />
                <stop offset="100%" stopColor="#5bc6f5" />
              </linearGradient>

              <linearGradient id="skyHeadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8be5ff" />
                <stop offset="100%" stopColor="#67d1fa" />
              </linearGradient>
            </defs>

            {/* BODY: light cyan tapered torso */}
            <path
              d="M 85 190 L 78 250 C 78 256, 142 256, 142 250 L 135 190 Z"
              fill="url(#skyBodyGrad)"
            />

            {/* BEAR EARS */}
            <circle cx="52" cy="74" r="30" fill="url(#skyHeadGrad)" />
            <circle cx="54" cy="74" r="16" fill="#c3f3ff" />

            <circle cx="168" cy="74" r="30" fill="url(#skyHeadGrad)" />
            <circle cx="166" cy="74" r="16" fill="#c3f3ff" />

            {/* TOP HAIR TUFT / CURL */}
            <path
              d="M 110 52 C 112 28, 126 18, 134 22 C 122 32, 120 46, 118 54 Z"
              fill="#76dcfd"
            />

            {/* ROUND CYAN BEAR HEAD */}
            <ellipse
              cx="110"
              cy="124"
              rx="76"
              ry="74"
              fill="url(#skyHeadGrad)"
            />

            {/* SUBTLE EYEBROW */}
            <path
              d="M 118 90 Q 130 94 138 96"
              stroke="#1b6480"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* SOFT CYAN BLUSH WITH HATCH MARKS */}
            <g id="skyBlush">
              <ellipse cx="62" cy="144" rx="14" ry="10" fill="#52c1ee" opacity={mood === 'happy' || isTickled ? 0.95 : 0.75} />
              <line x1="57" y1="138" x2="57" y2="148" stroke="#1d6683" strokeWidth="2" strokeLinecap="round" />
              <line x1="63" y1="138" x2="63" y2="148" stroke="#1d6683" strokeWidth="2" strokeLinecap="round" />

              <ellipse cx="158" cy="144" rx="14" ry="10" fill="#52c1ee" opacity={mood === 'happy' || isTickled ? 0.95 : 0.75} />
              <line x1="153" y1="138" x2="153" y2="148" stroke="#1d6683" strokeWidth="2" strokeLinecap="round" />
              <line x1="159" y1="138" x2="159" y2="148" stroke="#1d6683" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* EYES */}
            {renderEyes()}

            {/* MOUTH */}
            {renderMouth()}

            {/* GLASSES */}
            {renderGlasses()}

            {/* HAT */}
            {renderHat()}
          </svg>
        </div>
      )}

      {/* Shadow */}
      <div className="w-28 h-3 bg-slate-900/30 rounded-full blur-sm mt-1" />
    </div>
  );
};
