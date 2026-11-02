import React, { useState } from 'react';
import { AccessoryItem } from '../types';
import { soundEngine } from '../utils/audio';
import { Sparkles, Gift, X, RotateCw } from 'lucide-react';

interface GachaModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  onSpendCoins: (amount: number) => boolean;
  onUnlockAccessory: (item: AccessoryItem) => void;
  onAddCoins: (amount: number) => void;
  unlockedItemIds: string[];
}

export const GACHA_ITEMS: AccessoryItem[] = [
  { id: 'hat_pirate', name: 'Topi Bajak Laut Samudra', category: 'hat', icon: '🏴‍☠️', price: 100, unlocked: false, description: 'Cocok untuk berlayar di pulau bajak laut!' },
  { id: 'hat_sleep', name: 'Topi Tidur Bintang Nyenyak', category: 'hat', icon: '🌙', price: 80, unlocked: false, description: 'Bikin tidur Jevin makin pulas dan anti-gangguan.' },
  { id: 'hat_crown', name: 'Mahkota Raja Permen', category: 'hat', icon: '👑', price: 150, unlocked: false, description: 'Mahkota berlapis emas permen manis!' },
  { id: 'hat_cat', name: 'Bando Telinga Kucing', category: 'hat', icon: '🐱', price: 90, unlocked: false, description: 'Bikin Jevin terlihat super imut dan gemoy.' },
  { id: 'hat_snorkel', name: 'Helm Selam Bawah Laut', category: 'hat', icon: '🤿', price: 120, unlocked: false, description: 'Perlengkapan wajib menyelam bareng ubur-ubur!' },
  { id: 'glasses_cool', name: 'Kacamata Hitam Santai', category: 'glasses', icon: '😎', price: 70, unlocked: false, description: 'Gaya keren maksimal sambil tetap ngantuk.' },
  { id: 'glasses_nerd', name: 'Kacamata Kutu Buku', category: 'glasses', icon: '🤓', price: 65, unlocked: false, description: 'Kelihatan pintar padahal lagi mikirin bantal.' },
  { id: 'glasses_sleep', name: 'Masker Tidur Sutra', category: 'glasses', icon: '😴', price: 75, unlocked: false, description: 'Blokir semua cahaya agar mimpi lebih indah.' },
];

export const GachaModal: React.FC<GachaModalProps> = ({
  isOpen,
  onClose,
  coins,
  onSpendCoins,
  onUnlockAccessory,
  onAddCoins,
  unlockedItemIds,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [capsuleStage, setCapsuleStage] = useState<'idle' | 'dropped' | 'opened'>('idle');
  const [reward, setReward] = useState<{ item?: AccessoryItem; coinReward?: number } | null>(null);

  if (!isOpen) return null;

  const SPIN_COST = 30;

  const handleSpin = () => {
    if (coins < SPIN_COST) {
      soundEngine.playSurprise();
      return;
    }

    if (!onSpendCoins(SPIN_COST)) return;

    soundEngine.playPop();
    setIsSpinning(true);
    setCapsuleStage('idle');
    setReward(null);

    // Roll gacha machine
    setTimeout(() => {
      setIsSpinning(false);
      setCapsuleStage('dropped');
      soundEngine.playPop();

      // Determine prize
      const rand = Math.random();
      if (rand < 0.25) {
        // Coin jackpot
        setReward({ coinReward: 80 });
      } else {
        // Filter accessories that might be new or give duplicate compensation
        const picked = GACHA_ITEMS[Math.floor(Math.random() * GACHA_ITEMS.length)];
        setReward({ item: picked });
      }
    }, 1200);
  };

  const handleOpenCapsule = () => {
    if (capsuleStage !== 'dropped' || !reward) return;

    soundEngine.playGachaWin();
    setCapsuleStage('opened');

    if (reward.coinReward) {
      onAddCoins(reward.coinReward);
    } else if (reward.item) {
      if (!unlockedItemIds.includes(reward.item.id)) {
        onUnlockAccessory(reward.item);
      } else {
        // Duplicate compensation
        onAddCoins(25);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border-2 border-purple-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-center">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-purple-900 via-pink-900 to-indigo-900 border-b border-purple-500/30">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-300" />
            <h3 className="font-bold text-white text-base">Mesin Kapsul Gacha Ajaib</h3>
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

        {/* Machine Display */}
        <div className="p-6 flex flex-col items-center space-y-4">
          {/* Glass Dome */}
          <div className="relative w-44 h-44 rounded-full bg-gradient-to-b from-sky-300/20 via-purple-400/10 to-indigo-500/30 border-4 border-purple-400/50 shadow-inner flex items-center justify-center overflow-hidden">
            {/* Colorful floating balls */}
            <div className={`absolute inset-0 flex flex-wrap gap-2 p-4 justify-center items-center ${isSpinning ? 'animate-spin' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-rose-500 border border-white shadow-md" />
              <div className="w-8 h-8 rounded-full bg-amber-400 border border-white shadow-md" />
              <div className="w-8 h-8 rounded-full bg-cyan-400 border border-white shadow-md" />
              <div className="w-8 h-8 rounded-full bg-purple-500 border border-white shadow-md" />
              <div className="w-8 h-8 rounded-full bg-emerald-400 border border-white shadow-md" />
            </div>

            {isSpinning && (
              <div className="absolute inset-0 bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl font-black text-amber-300 animate-pulse">
                SPIN!
              </div>
            )}
          </div>

          {/* Dropped Capsule ready to open */}
          {capsuleStage === 'dropped' && (
            <div
              onClick={handleOpenCapsule}
              className="cursor-pointer p-4 rounded-3xl bg-purple-900/40 border-2 border-pink-400 flex flex-col items-center animate-bounce shadow-xl active:scale-95"
            >
              <div className="text-5xl mb-2">🎁</div>
              <div className="text-sm font-black text-pink-300">
                KETUK UNTUK MEMBUKA KAPSUL!
              </div>
            </div>
          )}

          {/* Opened Reward Revealed */}
          {capsuleStage === 'opened' && reward && (
            <div className="p-4 rounded-3xl bg-slate-800 border-2 border-amber-400/80 flex flex-col items-center animate-fade-in w-full shadow-xl">
              <div className="text-4xl mb-1 animate-pulse">
                {reward.coinReward ? '🪙' : reward.item?.icon}
              </div>
              <div className="text-base font-black text-white">
                {reward.coinReward ? `Bonus Jackpot +${reward.coinReward} Koin!` : reward.item?.name}
              </div>
              <div className="text-xs text-slate-300 mt-1 max-w-[220px]">
                {reward.coinReward
                  ? 'Koin langsung dimasukkan ke dompetmu!'
                  : unlockedItemIds.includes(reward.item!.id)
                  ? 'Item sudah dimiliki! Mendapatkan kompensasi +25 Koin.'
                  : reward.item?.description}
              </div>
            </div>
          )}

          {/* Crank & Spin Action */}
          {capsuleStage === 'idle' && (
            <button
              onClick={handleSpin}
              disabled={isSpinning || coins < SPIN_COST}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 disabled:opacity-40 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              PUTAR GACHA (30 🪙)
            </button>
          )}

          <div className="text-xs text-slate-400">
            Koinmu sekarang: <b className="text-amber-400">{coins} 🪙</b>
          </div>
        </div>
      </div>
    </div>
  );
};
