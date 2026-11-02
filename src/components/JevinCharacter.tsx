import React, { useEffect, useState } from 'react';
import { MoodState, AccessoryItem } from '../types';

interface JevinProps {
  mood: MoodState;
  isSleeping: boolean;
  isEating: boolean;
  isBathing: boolean;
  isTalking: boolean;
  isTickled: boolean;
  isPoked: boolean;
  isCrying?: boolean;
  equippedHat?: AccessoryItem | null;
  equippedGlasses?: AccessoryItem | null;
  usePhotoModel?: boolean;
  scale?: number;
}

export const JevinCharacter: React.FC<JevinProps> = ({
  mood,
  isSleeping,
  isEating,
  isBathing,
  isTalking,
  isTickled,
  isPoked,
  isCrying = false,
  equippedHat,
  equippedGlasses,
  usePhotoModel = false,
  scale = 1,
}) => {
  // Blinking cycle: sleepy blink every 3.5 seconds
  const [isBlinking, setIsBlinking] = useState(false);
  const [mouthPhase, setMouthPhase] = useState(0);

  useEffect(() => {
    if (isSleeping) return;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 260);
    }, 3800);
    return () => clearInterval(interval);
  }, [isSleeping]);

  // Mouth animation during talking or eating
  useEffect(() => {
    if (!isTalking && !isEating) return;
    const interval = setInterval(() => {
      setMouthPhase((p) => (p + 1) % 4);
    }, 130);
    return () => clearInterval(interval);
  }, [isTalking, isEating]);

  // Determine eye expression
  const renderEyes = () => {
    if (isSleeping) {
      // Sleeping curved peaceful lines
      return (
        <g className="transition-all duration-300">
          <path d="M 68 152 Q 95 168 122 152" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M 138 152 Q 165 168 192 152" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" fill="none" />
        </g>
      );
    }

    if (isBlinking) {
      // Sleepy closed blink slits
      return (
        <g className="transition-all duration-150">
          <line x1="68" y1="150" x2="122" y2="150" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
          <line x1="138" y1="150" x2="192" y2="150" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
        </g>
      );
    }

    if (mood === 'laughing' || isTickled) {
      // Happy arcs
      return (
        <g className="transition-all duration-200">
          <path d="M 68 156 Q 95 130 122 156" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M 138 156 Q 165 130 192 156" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" fill="none" />
        </g>
      );
    }

    if (isCrying || mood === 'crying') {
      // Squeezed crying eyes with cartoon waterfall tear streams
      return (
        <g>
          {/* Squeezed eyes > < */}
          <path d="M 68 142 L 95 152 L 68 162" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 122 142 L 95 152 L 122 162" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          <path d="M 138 142 L 165 152 L 138 162" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 192 142 L 165 152 L 192 162" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* Left Waterfall Tear Stream */}
          <path
            d="M 95 158 C 82 185, 45 195, 38 235 C 32 260, 44 290, 48 315"
            stroke="#38bdf8"
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
            opacity="0.88"
          />
          <path
            d="M 95 158 C 82 185, 45 195, 38 235 C 32 260, 44 290, 48 315"
            stroke="#bae6fd"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
          {/* Left splash drops */}
          <circle cx="32" cy="245" r="5" fill="#38bdf8" />
          <circle cx="44" cy="275" r="4" fill="#7dd3fc" />
          <circle cx="24" cy="290" r="6" fill="#0284c7" />

          {/* Right Waterfall Tear Stream */}
          <path
            d="M 165 158 C 178 185, 215 195, 222 235 C 228 260, 216 290, 212 315"
            stroke="#38bdf8"
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
            opacity="0.88"
          />
          <path
            d="M 165 158 C 178 185, 215 195, 222 235 C 228 260, 216 290, 212 315"
            stroke="#bae6fd"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
          {/* Right splash drops */}
          <circle cx="228" cy="245" r="5" fill="#38bdf8" />
          <circle cx="216" cy="275" r="4" fill="#7dd3fc" />
          <circle cx="236" cy="290" r="6" fill="#0284c7" />
        </g>
      );
    }

    if (mood === 'surprised' || isPoked) {
      // Wide open surprised round eyes
      return (
        <g className="transition-all duration-150">
          <circle cx="95" cy="148" r="22" fill="#ffffff" />
          <circle cx="95" cy="148" r="9" fill="#1b2a8d" />
          <circle cx="165" cy="148" r="22" fill="#ffffff" />
          <circle cx="165" cy="148" r="9" fill="#1b2a8d" />
        </g>
      );
    }

    // Default ICONIC SLEEPY U-SHAPED EYES (Exact match to reference image)
    // Thick white border, straight horizontal top eyelid line, curved bottom U outline
    return (
      <g>
        {/* Left Eye */}
        <g>
          {/* Outer white thick U-rim */}
          <path
            d="M 66 130 L 124 130 C 124 165, 66 165, 66 130 Z"
            fill="#ffffff"
          />
          {/* Inner pupil / face matching dusk tone */}
          <path
            d="M 74 132 L 116 132 C 116 157, 74 157, 74 132 Z"
            fill="#3043a5"
          />
          {/* Sleepy straight eyelid line on top */}
          <line x1="64" y1="130" x2="126" y2="130" stroke="#1d2e9e" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Right Eye */}
        <g>
          {/* Outer white thick U-rim */}
          <path
            d="M 136 130 L 194 130 C 194 165, 136 165, 136 130 Z"
            fill="#ffffff"
          />
          {/* Inner pupil / face matching dusk tone */}
          <path
            d="M 144 132 L 186 132 C 186 157, 144 157, 144 132 Z"
            fill="#3043a5"
          />
          {/* Sleepy straight eyelid line on top */}
          <line x1="134" y1="130" x2="196" y2="130" stroke="#1d2e9e" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
    );
  };

  // Determine mouth expression
  const renderMouth = () => {
    if (isTalking) {
      // Dynamic mouth speaking
      const mouthHeights = [10, 22, 16, 26];
      const h = mouthHeights[mouthPhase];
      return (
        <ellipse cx="130" cy="180" rx="14" ry={h / 2} fill="#142168" stroke="#ffffff" strokeWidth="2" />
      );
    }

    if (isEating) {
      // Chewing animation
      const h = mouthPhase % 2 === 0 ? 12 : 5;
      return (
        <g>
          <ellipse cx="130" cy="180" rx="15" ry={h} fill="#18236d" />
          <path d="M 122 176 Q 130 182 138 176" stroke="#ffffff" strokeWidth="2" fill="none" />
        </g>
      );
    }

    if (mood === 'laughing' || isTickled) {
      return (
        <path
          d="M 115 178 Q 130 196 145 178 Z"
          fill="#1b2875"
          stroke="#ffffff"
          strokeWidth="2"
        />
      );
    }

    if (mood === 'sleepy' || isSleeping) {
      // Small relaxed sleepy mouth
      return (
        <ellipse cx="130" cy="182" rx="6" ry="8" fill="#1b2875" opacity="0.9" />
      );
    }

    if (isCrying || mood === 'crying') {
      // Open wailing sobbing mouth with cute pink tongue
      return (
        <g>
          <path
            d="M 112 174 Q 130 162 148 174 Q 150 198 130 200 Q 110 198 112 174 Z"
            fill="#121d58"
            stroke="#ffffff"
            strokeWidth="2.5"
          />
          <ellipse cx="130" cy="192" rx="9" ry="5" fill="#f43f5e" />
        </g>
      );
    }

    if (mood === 'surprised' || isPoked) {
      return (
        <ellipse cx="130" cy="182" rx="9" ry="14" fill="#142168" stroke="#ffffff" strokeWidth="2" />
      );
    }

    // Default minimalist dark bar / tiny curve (exact match to reference)
    return (
      <line x1="123" y1="180" x2="137" y2="180" stroke="#1b297b" strokeWidth="4.5" strokeLinecap="round" />
    );
  };

  // Equipped Hat rendering
  const renderHat = () => {
    if (!equippedHat) return null;
    switch (equippedHat.id) {
      case 'hat_pirate':
        return (
          <g transform="translate(45, 10)">
            {/* Pirate Tricorne Hat */}
            <path
              d="M 5 60 C 20 20, 150 20, 165 60 C 130 50, 40 50, 5 60 Z"
              fill="#18181b"
              stroke="#fbbf24"
              strokeWidth="3"
            />
            <path
              d="M 25 45 C 50 10, 120 10, 145 45 Z"
              fill="#27272a"
            />
            {/* Skull mark */}
            <circle cx="85" cy="36" r="7" fill="#ffffff" />
            <line x1="77" y1="45" x2="93" y2="39" stroke="#ffffff" strokeWidth="2.5" />
            <line x1="77" y1="39" x2="93" y2="45" stroke="#ffffff" strokeWidth="2.5" />
          </g>
        );
      case 'hat_sleep':
        return (
          <g transform="translate(50, 15)">
            {/* Nightcap / Sleep cap */}
            <path
              d="M 20 55 C 50 10, 110 5, 145 35 C 160 50, 175 80, 168 95"
              fill="#3b82f6"
              stroke="#60a5fa"
              strokeWidth="3"
            />
            <path
              d="M 15 50 Q 80 40 145 50 Q 80 62 15 50 Z"
              fill="#ffffff"
            />
            {/* Fluffy pompom */}
            <circle cx="168" cy="98" r="14" fill="#ffffff" />
            <circle cx="75" cy="30" r="3" fill="#fef08a" />
            <circle cx="110" cy="22" r="3" fill="#fef08a" />
          </g>
        );
      case 'hat_crown':
        return (
          <g transform="translate(65, 20)">
            {/* Golden Royal Crown */}
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
          <g transform="translate(60, 22)">
            {/* Cute Cat Ears Headband */}
            <path d="M 10 40 C 40 25, 100 25, 130 40" stroke="#f43f5e" strokeWidth="5" fill="none" strokeLinecap="round" />
            <polygon points="20,35 40,5 55,30" fill="#fb7185" stroke="#f43f5e" strokeWidth="2" />
            <polygon points="25,32 40,14 49,28" fill="#ffe4e6" />
            <polygon points="85,30 100,5 120,35" fill="#fb7185" stroke="#f43f5e" strokeWidth="2" />
            <polygon points="91,28 100,14 115,32" fill="#ffe4e6" />
          </g>
        );
      case 'hat_snorkel':
        return (
          <g transform="translate(55, 30)">
            {/* Diving Mask / Snorkel */}
            <rect x="25" y="30" width="100" height="40" rx="14" fill="#06b6d4" opacity="0.4" stroke="#0891b2" strokeWidth="4" />
            {/* Snorkel tube */}
            <path d="M 125 50 L 140 50 L 140 10 L 146 10" stroke="#facc15" strokeWidth="7" fill="none" strokeLinecap="round" />
          </g>
        );
      default:
        return null;
    }
  };

  // Equipped Glasses rendering
  const renderGlasses = () => {
    if (!equippedGlasses) return null;
    switch (equippedGlasses.id) {
      case 'glasses_cool':
        return (
          <g transform="translate(60, 126)">
            {/* Thug / Cool Black Sunglasses */}
            <polygon points="8,10 60,10 52,32 16,32" fill="#09090b" stroke="#27272a" strokeWidth="2" />
            <polygon points="76,10 128,10 120,32 84,32" fill="#09090b" stroke="#27272a" strokeWidth="2" />
            <line x1="58" y1="15" x2="78" y2="15" stroke="#09090b" strokeWidth="4" />
            {/* Lens Glare */}
            <line x1="18" y1="14" x2="32" y2="28" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
            <line x1="86" y1="14" x2="100" y2="28" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
          </g>
        );
      case 'glasses_nerd':
        return (
          <g transform="translate(60, 124)">
            {/* Round Nerd Glasses */}
            <circle cx="34" cy="22" r="22" stroke="#d97706" strokeWidth="4" fill="rgba(255,255,255,0.2)" />
            <circle cx="102" cy="22" r="22" stroke="#d97706" strokeWidth="4" fill="rgba(255,255,255,0.2)" />
            <line x1="56" y1="22" x2="80" y2="22" stroke="#d97706" strokeWidth="4" />
          </g>
        );
      case 'glasses_sleep':
        return (
          <g transform="translate(56, 120)">
            {/* Sleep Eye Mask */}
            <rect x="10" y="8" width="128" height="42" rx="20" fill="#a855f7" stroke="#9333ea" strokeWidth="3" />
            <path d="M 35 28 Q 50 36 65 28" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 85 28 Q 100 36 115 28" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none cursor-pointer"
      style={{
        transform: `scale(${scale})`,
        transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Floating Zzz when sleeping */}
      {isSleeping && (
        <div className="absolute -top-12 right-2 flex flex-col items-center pointer-events-none z-30">
          <span className="text-xl font-bold text-sky-200 animate-bounce" style={{ animationDelay: '0ms' }}>Z</span>
          <span className="text-2xl font-black text-indigo-300 animate-bounce" style={{ animationDelay: '300ms' }}>z</span>
          <span className="text-3xl font-black text-blue-200 animate-bounce" style={{ animationDelay: '600ms' }}>z</span>
        </div>
      )}

      {/* Bubble / Bath foam effect overlay */}
      {isBathing && (
        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-cyan-200/50 backdrop-blur-sm animate-ping absolute -top-4 -left-4" />
          <div className="w-12 h-12 rounded-full bg-sky-200/60 backdrop-blur-sm animate-pulse absolute -bottom-2 -right-2" />
          <div className="w-8 h-8 rounded-full bg-white/70 animate-bounce absolute top-12 -right-6" />
        </div>
      )}

      {/* IF USER PREFERS THE RAW ORIGINAL REFERENCE PHOTO */}
      {usePhotoModel ? (
        <div className="relative w-64 h-72 flex items-center justify-center">
          <img
            src="/assets/aistudio/IMG_20261020_172647_6e3fff8b.webp"
            alt="Jevin Original Reference"
            className={`w-60 h-68 object-contain drop-shadow-2xl transition-all duration-300 ${
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
              <svg width="240" height="260" viewBox="0 0 240 260" className="overflow-visible">
                {/* Squeezed sad eyes */}
                <path d="M 60 110 L 85 120 L 60 130" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 110 110 L 85 120 L 110 130" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 130 110 L 155 120 L 130 130" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 180 110 L 155 120 L 180 130" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />
                {/* Waterfall tears */}
                <path d="M 85 125 C 70 150, 40 170, 32 205 C 28 225, 40 250, 45 270" stroke="#38bdf8" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.9" />
                <path d="M 85 125 C 70 150, 40 170, 32 205 C 28 225, 40 250, 45 270" stroke="#bae6fd" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M 155 125 C 170 150, 200 170, 208 205 C 212 225, 200 250, 195 270" stroke="#38bdf8" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.9" />
                <path d="M 155 125 C 170 150, 200 170, 208 205 C 212 225, 200 250, 195 270" stroke="#bae6fd" strokeWidth="4" strokeLinecap="round" fill="none" />
                {/* Wailing mouth */}
                <ellipse cx="120" cy="155" rx="10" ry="14" fill="#121d58" stroke="#ffffff" strokeWidth="2" />
                <ellipse cx="120" cy="162" rx="7" ry="4" fill="#f43f5e" />
              </svg>
            </div>
          )}
          {/* Accessories overlay over reference photo */}
          <div className="absolute top-2 w-full flex justify-center pointer-events-none">
            <svg width="260" height="120" viewBox="0 0 260 120" className="overflow-visible">
              {renderHat()}
            </svg>
          </div>
        </div>
      ) : (
        /* PROCEDURAL 60-FPS ANIMATED VECTOR SVG - EXACT MATCH TO REFERENCE */
        <div
          className={`w-64 h-80 flex items-center justify-center filter drop-shadow-[0_15px_25px_rgba(15,23,42,0.45)] transition-transform duration-200 ${
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
            width="260"
            height="320"
            viewBox="0 0 260 320"
            className="w-full h-full overflow-visible"
          >
            <defs>
              {/* Outer Head Gradient / Hood Shadow */}
              <radialGradient id="hoodGrad" cx="50%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#253dc9" />
                <stop offset="75%" stopColor="#192fa2" />
                <stop offset="100%" stopColor="#12217c" />
              </radialGradient>

              {/* Inner Face Shading (Darker top half, periwinkle bottom half) */}
              <linearGradient id="faceTwoTone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3d4fa9" />
                <stop offset="47%" stopColor="#3c4ea7" />
                <stop offset="49%" stopColor="#4e65cb" />
                <stop offset="100%" stopColor="#5d7beb" />
              </linearGradient>

              {/* Body Gradient */}
              <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5270e5" />
                <stop offset="100%" stopColor="#3d58ca" />
              </linearGradient>
            </defs>

            {/* LOWER BODY: Tapered conical/trapezoidal torso (Exact match to ref image) */}
            <g id="bodyGroup">
              <path
                d="M 98 226 L 90 298 C 90 304, 168 304, 168 298 L 160 226 Z"
                fill="url(#bodyGrad)"
              />
              {/* Body highlight */}
              <path
                d="M 104 235 L 98 290 C 115 296, 140 296, 156 290 L 152 235 Z"
                fill="#617ff2"
                opacity="0.3"
              />
            </g>

            {/* DARK BLUE BOWTIE / NECK FLAP COLLAR (Exact match to ref) */}
            <g id="collarGroup">
              <path
                d="M 92 216 L 129 238 L 129 258 L 92 238 Z"
                fill="#162582"
              />
              <path
                d="M 166 216 L 129 238 L 129 258 L 166 238 Z"
                fill="#162582"
              />
              <polygon points="123,230 135,230 133,244 125,244" fill="#0f1a63" />
            </g>

            {/* OUTER HOODED HEAD RING (Dark royal blue hood from reference) */}
            <ellipse
              cx="130"
              cy="150"
              rx="96"
              ry="104"
              fill="url(#hoodGrad)"
            />

            {/* INNER ROUND FACE (Periwinkle circle with dark top shade) */}
            <ellipse
              cx="130"
              cy="155"
              rx="78"
              ry="84"
              fill="url(#faceTwoTone)"
            />

            {/* SOFT BLUSH OVALS ON CHEEKS (Exact match to reference) */}
            <g id="blush">
              {/* Left Cheek Blush */}
              <ellipse
                cx="74"
                cy="176"
                rx="14"
                ry="10"
                fill="#3245a4"
                opacity={mood === 'happy' || isTickled ? 0.95 : 0.65}
              />
              {/* Right Cheek Blush */}
              <ellipse
                cx="186"
                cy="176"
                rx="14"
                ry="10"
                fill="#3245a4"
                opacity={mood === 'happy' || isTickled ? 0.95 : 0.65}
              />
            </g>

            {/* EYES (ICONIC U-SHAPED DROWSY EYES) */}
            <g id="eyesGroup">
              {renderEyes()}
            </g>

            {/* MOUTH (MINIMALIST DASH / DYNAMIC SPEAKING / EATING / YAWNING) */}
            <g id="mouthGroup">
              {renderMouth()}
            </g>

            {/* ACCESSORIES: GLASSES */}
            <g id="glassesGroup">
              {renderGlasses()}
            </g>

            {/* ACCESSORIES: HAT */}
            <g id="hatGroup">
              {renderHat()}
            </g>
          </svg>
        </div>
      )}

      {/* Gentle Soft Shadow Underneath */}
      <div className="w-36 h-4 bg-slate-900/40 rounded-full blur-sm mt-1 transform scale-y-75" />
    </div>
  );
};
