import React, { useState } from 'react';
import { FoodItem, PetStats, ActivePet } from '../types';
import { soundEngine } from '../utils/audio';
import { Utensils, Sparkles, Moon, X, Droplets, Plus } from 'lucide-react';

interface CareModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PetStats;
  coins: number;
  onUpdateStats: (newStats: Partial<PetStats>) => void;
  onSpendCoins: (amount: number) => boolean;
  onTriggerEat: (target: 'jevin' | 'sky' | 'both', food: FoodItem) => void;
  onTriggerBath: (target: 'jevin' | 'sky' | 'both') => void;
  onToggleSleep: () => void;
  isSleeping: boolean;
  defaultCharacter?: ActivePet;
}

const DEFAULT_FOODS: FoodItem[] = [
  { id: 'f-donut', name: 'Donat Gula', icon: '🍩', hungerBoost: 25, happinessBoost: 15, energyBoost: 5, price: 10, count: 3 },
  { id: 'f-milk', name: 'Susu Hangat', icon: '🥛', hungerBoost: 20, happinessBoost: 10, energyBoost: 25, price: 8, count: 2 },
  { id: 'f-honey', name: 'Madu Beruang Manis', icon: '🍯', hungerBoost: 28, happinessBoost: 20, energyBoost: 15, price: 12, count: 3 },
  { id: 'f-fish', name: 'Ikan Panggang Segar', icon: '🐟', hungerBoost: 40, happinessBoost: 18, energyBoost: 10, price: 18, count: 2 },
  { id: 'f-banana', name: 'Pisang Manis', icon: '🍌', hungerBoost: 18, happinessBoost: 8, energyBoost: 15, price: 6, count: 4 },
  { id: 'f-candy', name: 'Permen Bintang', icon: '🍬', hungerBoost: 10, happinessBoost: 30, energyBoost: 10, price: 12, count: 2 },
];

export const CareModal: React.FC<CareModalProps> = ({
  isOpen,
  onClose,
  stats,
  coins,
  onUpdateStats,
  onSpendCoins,
  onTriggerEat,
  onTriggerBath,
  onToggleSleep,
  isSleeping,
  defaultCharacter = 'jevin',
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'bath' | 'sleep'>('feed');
  const [careTarget, setCareTarget] = useState<'jevin' | 'sky' | 'both'>(
    defaultCharacter === 'sky' ? 'sky' : 'jevin'
  );
  const [foods, setFoods] = useState<FoodItem[]>(DEFAULT_FOODS);
  const [spongeProgress, setSpongeProgress] = useState(0);

  if (!isOpen) return null;

  const handleFeed = (food: FoodItem) => {
    if (food.count <= 0) {
      if (onSpendCoins(food.price)) {
        soundEngine.playCoin();
        setFoods((prev) =>
          prev.map((f) => (f.id === food.id ? { ...f, count: f.count + 2 } : f))
        );
      }
      return;
    }

    soundEngine.playMunch();
    setFoods((prev) =>
      prev.map((f) => (f.id === food.id ? { ...f, count: f.count - 1 } : f))
    );

    onUpdateStats({
      hunger: Math.min(100, stats.hunger + food.hungerBoost),
      happiness: Math.min(100, stats.happiness + food.happinessBoost),
      energy: Math.min(100, stats.energy + food.energyBoost),
    });

    onTriggerEat(careTarget, food);
  };

  const handleSpongeRub = () => {
    soundEngine.playSplash();
    setSpongeProgress((p) => {
      const next = p + 25;
      if (next >= 100) {
        onUpdateStats({
          cleanliness: 100,
          happiness: Math.min(100, stats.happiness + 20),
        });
        onTriggerBath(careTarget);
        return 100;
      }
      return next;
    });
  };

  const handleRinseShower = () => {
    soundEngine.playSplash();
    setSpongeProgress(0);
    onUpdateStats({
      cleanliness: 100,
      happiness: Math.min(100, stats.happiness + 15),
    });
    onTriggerBath(careTarget);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-indigo-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 border-b border-indigo-500/30">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-white text-base">
              Perawatan Virtual {careTarget === 'sky' ? 'Sky' : careTarget === 'both' ? 'Jevin & Sky' : 'Jevin'}
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

        {/* Pet Selection Pills */}
        <div className="flex p-2 gap-1.5 bg-slate-950/60 border-b border-slate-800">
          <button
            onClick={() => {
              soundEngine.playPop();
              setCareTarget('jevin');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              careTarget === 'jevin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            😴 Rawat Jevin
          </button>
          <button
            onClick={() => {
              soundEngine.playPop();
              setCareTarget('sky');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              careTarget === 'sky'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🐻 Rawat Sky
          </button>
          <button
            onClick={() => {
              soundEngine.playPop();
              setCareTarget('both');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              careTarget === 'both'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            👯 Keduanya
          </button>
        </div>

        {/* Current Stats Bar */}
        <div className="grid grid-cols-4 gap-2 px-4 py-2.5 bg-slate-950/40 border-b border-slate-800 text-xs">
          <div className="bg-slate-800/80 p-2 rounded-xl text-center">
            <div className="text-amber-400 font-bold mb-1">🍗 Kenyang</div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full transition-all"
                style={{ width: `${stats.hunger}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-300">{Math.round(stats.hunger)}%</span>
          </div>

          <div className="bg-slate-800/80 p-2 rounded-xl text-center">
            <div className="text-cyan-400 font-bold mb-1">🧼 Bersih</div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-400 h-full transition-all"
                style={{ width: `${stats.cleanliness}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-300">{Math.round(stats.cleanliness)}%</span>
          </div>

          <div className="bg-slate-800/80 p-2 rounded-xl text-center">
            <div className="text-rose-400 font-bold mb-1">💖 Senang</div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-rose-400 h-full transition-all"
                style={{ width: `${stats.happiness}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-300">{Math.round(stats.happiness)}%</span>
          </div>

          <div className="bg-slate-800/80 p-2 rounded-xl text-center">
            <div className="text-emerald-400 font-bold mb-1">⚡ Energi</div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full transition-all"
                style={{ width: `${stats.energy}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-300">{Math.round(stats.energy)}%</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-900">
          <button
            onClick={() => {
              soundEngine.playPop();
              setActiveTab('feed');
            }}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'feed'
                ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🍩</span> Beri Snack
          </button>
          <button
            onClick={() => {
              soundEngine.playPop();
              setActiveTab('bath');
            }}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'bath'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" /> Mandi Sabun
          </button>
          <button
            onClick={() => {
              soundEngine.playPop();
              setActiveTab('sleep');
            }}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'sleep'
                ? 'border-indigo-400 text-indigo-300 bg-indigo-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" /> Tempat Tidur
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 flex-1 overflow-y-auto max-h-[320px]">
          {activeTab === 'feed' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 text-center">
                Pilih snack untuk disuapkan ke{' '}
                <b className="text-amber-300">
                  {careTarget === 'sky' ? 'Sky' : careTarget === 'both' ? 'Jevin & Sky' : 'Jevin'}
                </b>
                !
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {foods.map((food) => (
                  <div
                    key={food.id}
                    className="bg-slate-800/80 hover:bg-slate-750 border border-slate-700 rounded-2xl p-3 flex flex-col justify-between transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl">{food.icon}</span>
                      <div className="text-left">
                        <div className="text-sm font-bold text-white leading-tight">
                          {food.name}
                        </div>
                        <div className="text-[10px] text-amber-300 font-semibold">
                          +{food.hungerBoost} Kenyang
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-700/60">
                      <span className="text-xs text-slate-300 font-medium">
                        Stok: <b className="text-white">{food.count}</b>
                      </span>

                      {food.count > 0 ? (
                        <button
                          onClick={() => handleFeed(food)}
                          className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold shadow-md active:scale-95"
                        >
                          Suap
                        </button>
                      ) : (
                        <button
                          onClick={() => handleFeed(food)}
                          className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 shadow-md active:scale-95"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{food.price} 🪙</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bath' && (
            <div className="flex flex-col items-center text-center space-y-4 py-3">
              <div className="text-sm text-slate-300">
                Gosok spons busa ke {careTarget === 'sky' ? 'Sky' : careTarget === 'both' ? 'Jevin & Sky' : 'Jevin'} agar bersih dan wangi!
              </div>

              {/* Sponge Progress */}
              <div className="w-full max-w-xs space-y-1">
                <div className="flex justify-between text-xs font-bold text-cyan-300">
                  <span>Busa Sabun:</span>
                  <span>{spongeProgress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="bg-cyan-400 h-full transition-all duration-300"
                    style={{ width: `${spongeProgress}%` }}
                  />
                </div>
              </div>

              {/* Interactive Tools */}
              <div className="flex gap-4 justify-center pt-2">
                <button
                  onClick={handleSpongeRub}
                  className="w-28 h-28 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 flex flex-col items-center justify-center font-bold shadow-lg active:scale-95 border-2 border-yellow-200"
                >
                  <span className="text-4xl mb-1 animate-pulse">🧽</span>
                  <span className="text-xs font-black">GOSOK SPONS</span>
                </button>

                <button
                  onClick={handleRinseShower}
                  className="w-28 h-28 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white flex flex-col items-center justify-center font-bold shadow-lg active:scale-95 border-2 border-cyan-200"
                >
                  <span className="text-4xl mb-1 animate-bounce">🚿</span>
                  <span className="text-xs font-black">BILAS AIR</span>
                </button>
              </div>

              {stats.cleanliness >= 95 && (
                <div className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-700 px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Bersih & Wangi 100%!
                </div>
              )}
            </div>
          )}

          {activeTab === 'sleep' && (
            <div className="flex flex-col items-center text-center space-y-4 py-4">
              <div className="text-5xl animate-float-slow">
                {isSleeping ? '🛌' : '🥱'}
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">
                  {isSleeping ? 'Sedang Tertidur Pulas...' : 'Waktunya Istirahat & Tidur?'}
                </h4>
                <p className="text-xs text-slate-300 max-w-xs">
                  {isSleeping
                    ? 'Tidur nyenyak memulihkan energi hingga 100%!'
                    : `Tidurkan ${careTarget === 'sky' ? 'Sky' : 'Jevin'} dengan selimut hangat!`}
                </p>
              </div>

              <button
                onClick={() => {
                  soundEngine.playPop();
                  onToggleSleep();
                  if (!isSleeping) {
                    onUpdateStats({ energy: 100 });
                  }
                }}
                className={`px-6 py-3 rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 active:scale-95 transition-all ${
                  isSleeping
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                <Moon className="w-4 h-4" />
                {isSleeping ? 'Bangunkan Semua' : 'Tidurkan Sekarang'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
