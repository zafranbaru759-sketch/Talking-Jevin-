import React, { useState, useEffect, useRef } from 'react';
import { Trick, ActivePet } from '../../types';
import { soundEngine } from '../../utils/audio';
import { Award, Zap, Trophy, X, Star } from 'lucide-react';

interface TrickMasterProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardCoins: (amount: number) => void;
  onPerformTrickAnimation: (character: 'jevin' | 'sky' | 'duo', trickId: string) => void;
  defaultCharacter?: ActivePet;
}

const ALL_TRICKS: Trick[] = [
  { id: 't_spin', title: 'Tidur Akrobatik 360°', description: 'Jevin berputar di udara sambil tetap tidur santai!', level: 1, xp: 0, xpMax: 100, icon: '🌀', character: 'jevin' },
  { id: 't_sing', title: 'Nyanyi Nada Tinggi Imut', description: 'Jevin menyanyikan opera pendek dengan suara anak ayam.', level: 1, xp: 20, xpMax: 100, icon: '🎶', character: 'jevin' },
  { id: 't_magic', title: 'Sulap Koin Ajaib', description: 'Menghilangkan koin di telinga dan memunculkan bintang!', level: 1, xp: 40, xpMax: 100, icon: '✨', character: 'jevin' },
  { id: 't_ears', title: 'Goyang Telinga Beruang', description: 'Sky menggoyangkan kedua telinga imutnya mengikuti irama musik!', level: 1, xp: 15, xpMax: 100, icon: '🐻', character: 'sky' },
  { id: 't_cloud', title: 'Lompatan Awan Bintang', description: 'Sky melompat tinggi dan menangkap bintang jatuh di langit!', level: 1, xp: 30, xpMax: 100, icon: '🌟', character: 'sky' },
  { id: 't_dance', title: 'Tarian Ombak Bareng Sahabat', description: 'Duet kompak Jevin dan Sky menggoyangkan badan bersama!', level: 1, xp: 0, xpMax: 100, icon: '👯', character: 'duo' },
];

export const TrickMaster: React.FC<TrickMasterProps> = ({
  isOpen,
  onClose,
  onRewardCoins,
  onPerformTrickAnimation,
  defaultCharacter = 'jevin',
}) => {
  const [filterChar, setFilterChar] = useState<'all' | 'jevin' | 'sky'>(
    defaultCharacter === 'sky' ? 'sky' : 'all'
  );
  const [tricks, setTricks] = useState<Trick[]>(ALL_TRICKS);
  const [selectedTrick, setSelectedTrick] = useState<Trick>(ALL_TRICKS[0]);
  const [isPlayingTraining, setIsPlayingTraining] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const directionRef = useRef<number>(1);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlayingTraining) return;

    let pos = 0;
    directionRef.current = 1;

    const loop = () => {
      pos += directionRef.current * 1.8;
      if (pos >= 100) {
        pos = 100;
        directionRef.current = -1;
      } else if (pos <= 0) {
        pos = 0;
        directionRef.current = 1;
      }
      setCursorPos(pos);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlayingTraining]);

  if (!isOpen) return null;

  const filteredTricks =
    filterChar === 'all'
      ? tricks
      : tricks.filter((t) => t.character === filterChar || t.character === 'duo');

  const handleStartTraining = (trick: Trick) => {
    soundEngine.playPop();
    setSelectedTrick(trick);
    setIsPlayingTraining(true);
    setFeedback(null);
  };

  const handleAttemptTap = () => {
    if (!isPlayingTraining) return;
    setIsPlayingTraining(false);

    const inSweetSpot = cursorPos >= 42 && cursorPos <= 58;
    const isGood = cursorPos >= 30 && cursorPos <= 70;

    if (inSweetSpot || isGood) {
      soundEngine.playGachaWin();
      const xpGained = inSweetSpot ? 50 : 30;
      const coinsEarned = inSweetSpot ? 35 : 20;

      setFeedback(inSweetSpot ? '🌟 SEMPURNA! Trik Berhasil!' : '✨ BAGUS SEKALI!');
      onRewardCoins(coinsEarned);
      onPerformTrickAnimation(selectedTrick.character, selectedTrick.id);

      setTricks((prev) =>
        prev.map((t) => {
          if (t.id === selectedTrick.id) {
            let nextXp = t.xp + xpGained;
            let nextLvl = t.level;
            let nextMax = t.xpMax;
            if (nextXp >= nextMax) {
              nextXp -= nextMax;
              nextLvl += 1;
              nextMax = Math.round(nextMax * 1.4);
            }
            return { ...t, xp: nextXp, level: nextLvl, xpMax: nextMax };
          }
          return t;
        })
      );
    } else {
      soundEngine.playSurprise();
      setFeedback('😅 Kurang pas! Coba lagi ya!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-amber-900 via-orange-900 to-yellow-900 border-b border-amber-500/30">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-white text-base">Ajari Trik & Bakat</h3>
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

        {/* Character Filter Bar */}
        {!isPlayingTraining && (
          <div className="flex p-2 gap-1.5 bg-slate-950/70 border-b border-slate-800">
            <button
              onClick={() => {
                soundEngine.playPop();
                setFilterChar('all');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterChar === 'all'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua Trik
            </button>
            <button
              onClick={() => {
                soundEngine.playPop();
                setFilterChar('jevin');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterChar === 'jevin'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              😴 Trik Jevin
            </button>
            <button
              onClick={() => {
                soundEngine.playPop();
                setFilterChar('sky');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterChar === 'sky'
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🐻 Trik Sky
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-4">
          {!isPlayingTraining ? (
            <>
              <div className="text-xs text-slate-300 text-center">
                Pilih trik untuk dilatih & dapatkan hadiah koin!
              </div>

              {feedback && (
                <div className="p-2.5 rounded-2xl bg-amber-950/60 border border-amber-600 text-amber-200 text-center font-bold text-xs animate-bounce">
                  {feedback}
                </div>
              )}

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
                {filteredTricks.map((trick) => (
                  <div
                    key={trick.id}
                    className="p-3 bg-slate-800/80 hover:bg-slate-750 border border-slate-700 rounded-2xl flex items-center justify-between transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
                        {trick.icon}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-1.5">
                          {trick.title}
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-md font-extrabold">
                            Lv.{trick.level}
                          </span>
                          <span className="text-[9px] bg-slate-700 text-slate-300 px-1 rounded">
                            {trick.character === 'sky' ? 'Sky 🐻' : trick.character === 'duo' ? 'Duet 👯' : 'Jevin 😴'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 max-w-[200px]">
                          {trick.description}
                        </div>
                        <div className="w-32 bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="bg-amber-400 h-full"
                            style={{ width: `${(trick.xp / trick.xpMax) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartTraining(trick)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md active:scale-95"
                    >
                      Latih
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-6 flex flex-col items-center text-center space-y-6">
              <div className="text-4xl animate-bounce">{selectedTrick.icon}</div>
              <div>
                <h4 className="text-base font-bold text-white">{selectedTrick.title}</h4>
                <p className="text-xs text-slate-300">
                  Tekan tombol tepat saat bintang berada di kotak hijau TARGET!
                </p>
              </div>

              <div className="w-full relative h-10 bg-slate-800 rounded-2xl border-2 border-slate-700 overflow-hidden flex items-center">
                <div className="absolute left-[40%] w-[20%] h-full bg-emerald-500/40 border-x-2 border-emerald-400 flex items-center justify-center">
                  <span className="text-[10px] font-black text-emerald-200">TARGET</span>
                </div>

                <div
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-amber-400 border-2 border-white shadow-lg flex items-center justify-center text-xs"
                  style={{ left: `calc(${cursorPos}% - 12px)` }}
                >
                  ⭐
                </div>
              </div>

              <button
                onClick={handleAttemptTap}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 font-black text-base shadow-xl active:scale-95 transition-all tracking-wider"
              >
                EKSEKUSI TRIK!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
