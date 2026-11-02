import React, { useState } from 'react';
import { AccessoryItem } from '../types';
import { GACHA_ITEMS } from './GachaModal';
import { soundEngine } from '../utils/audio';
import { Shirt, X } from 'lucide-react';

interface WardrobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedIds: string[];
  equippedHatJevin: AccessoryItem | null;
  equippedGlassesJevin: AccessoryItem | null;
  equippedHatSky: AccessoryItem | null;
  equippedGlassesSky: AccessoryItem | null;
  onEquipHatJevin: (item: AccessoryItem | null) => void;
  onEquipGlassesJevin: (item: AccessoryItem | null) => void;
  onEquipHatSky: (item: AccessoryItem | null) => void;
  onEquipGlassesSky: (item: AccessoryItem | null) => void;
}

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  isOpen,
  onClose,
  unlockedIds,
  equippedHatJevin,
  equippedGlassesJevin,
  equippedHatSky,
  equippedGlassesSky,
  onEquipHatJevin,
  onEquipGlassesJevin,
  onEquipHatSky,
  onEquipGlassesSky,
}) => {
  const [selectedPet, setSelectedPet] = useState<'jevin' | 'sky'>('jevin');

  if (!isOpen) return null;

  const hats = GACHA_ITEMS.filter((i) => i.category === 'hat');
  const glasses = GACHA_ITEMS.filter((i) => i.category === 'glasses');

  const currentHat = selectedPet === 'jevin' ? equippedHatJevin : equippedHatSky;
  const currentGlasses = selectedPet === 'jevin' ? equippedGlassesJevin : equippedGlassesSky;

  const handleEquipHat = (hat: AccessoryItem | null) => {
    soundEngine.playPop();
    if (selectedPet === 'jevin') {
      onEquipHatJevin(hat);
    } else {
      onEquipHatSky(hat);
    }
  };

  const handleEquipGlasses = (glass: AccessoryItem | null) => {
    soundEngine.playPop();
    if (selectedPet === 'jevin') {
      onEquipGlassesJevin(glass);
    } else {
      onEquipGlassesSky(glass);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-indigo-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-indigo-900 to-purple-900 border-b border-indigo-500/30">
          <div className="flex items-center gap-2">
            <Shirt className="w-5 h-5 text-indigo-300" />
            <h3 className="font-bold text-white text-base">Lemari Kostum & Aksesoris</h3>
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

        {/* Pet Switcher Bar */}
        <div className="flex p-2 gap-1.5 bg-slate-950/70 border-b border-slate-800">
          <button
            onClick={() => {
              soundEngine.playPop();
              setSelectedPet('jevin');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              selectedPet === 'jevin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>😴 Dandani Jevin</span>
          </button>
          <button
            onClick={() => {
              soundEngine.playPop();
              setSelectedPet('sky');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              selectedPet === 'sky'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🐻 Dandani Sky</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-5 overflow-y-auto max-h-[360px]">
          {/* Hats Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Topi untuk {selectedPet === 'sky' ? 'Sky' : 'Jevin'}
              </h4>
              {currentHat && (
                <button
                  onClick={() => handleEquipHat(null)}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-bold"
                >
                  Lepas Topi
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {hats.map((hat) => {
                const isUnlocked = unlockedIds.includes(hat.id);
                const isEquipped = currentHat?.id === hat.id;

                return (
                  <button
                    key={hat.id}
                    disabled={!isUnlocked}
                    onClick={() => handleEquipHat(isEquipped ? null : hat)}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all relative border ${
                      !isUnlocked
                        ? 'bg-slate-800/40 border-slate-700/50 opacity-40 grayscale cursor-not-allowed'
                        : isEquipped
                        ? 'bg-indigo-600/40 border-amber-400 shadow-md scale-102'
                        : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {isEquipped && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-[10px] text-slate-950 font-black">
                        ✓
                      </span>
                    )}
                    <span className="text-3xl mb-1">{hat.icon}</span>
                    <span className="text-[11px] font-bold text-white text-center leading-tight line-clamp-2">
                      {hat.name}
                    </span>
                    {!isUnlocked && (
                      <span className="text-[9px] text-slate-400 mt-1">🔒 Dari Gacha</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Glasses Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Kacamata & Masker untuk {selectedPet === 'sky' ? 'Sky' : 'Jevin'}
              </h4>
              {currentGlasses && (
                <button
                  onClick={() => handleEquipGlasses(null)}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-bold"
                >
                  Lepas Kacamata
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {glasses.map((glass) => {
                const isUnlocked = unlockedIds.includes(glass.id);
                const isEquipped = currentGlasses?.id === glass.id;

                return (
                  <button
                    key={glass.id}
                    disabled={!isUnlocked}
                    onClick={() => handleEquipGlasses(isEquipped ? null : glass)}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all relative border ${
                      !isUnlocked
                        ? 'bg-slate-800/40 border-slate-700/50 opacity-40 grayscale cursor-not-allowed'
                        : isEquipped
                        ? 'bg-indigo-600/40 border-amber-400 shadow-md scale-102'
                        : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {isEquipped && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-[10px] text-slate-950 font-black">
                        ✓
                      </span>
                    )}
                    <span className="text-3xl mb-1">{glass.icon}</span>
                    <span className="text-[11px] font-bold text-white text-center leading-tight line-clamp-2">
                      {glass.name}
                    </span>
                    {!isUnlocked && (
                      <span className="text-[9px] text-slate-400 mt-1">🔒 Dari Gacha</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
