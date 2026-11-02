import React, { useState, useRef } from 'react';
import { VoiceMimic, soundEngine } from '../utils/audio';
import { Mic, MicOff, Volume2, Sparkles, X, Play, Sliders } from 'lucide-react';
import { ActivePet } from '../types';

interface VoiceMimicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTalkingChange: (character: 'jevin' | 'sky' | 'both', isTalking: boolean) => void;
  defaultCharacter?: ActivePet;
}

export const VoiceMimicModal: React.FC<VoiceMimicModalProps> = ({
  isOpen,
  onClose,
  onTalkingChange,
  defaultCharacter = 'jevin',
}) => {
  const [selectedChar, setSelectedChar] = useState<'jevin' | 'sky' | 'both'>(
    defaultCharacter === 'sky' ? 'sky' : 'jevin'
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [pitchRate, setPitchRate] = useState(selectedChar === 'sky' ? 1.6 : 1.4);
  const [statusText, setStatusText] = useState(
    selectedChar === 'sky'
      ? 'Tekan mikrofon & bicara ke Sky si beruang imut!'
      : 'Tekan mikrofon & bicara ke Jevin!'
  );
  const voiceMimicRef = useRef<VoiceMimic>(new VoiceMimic());

  if (!isOpen) return null;

  const handleCharChange = (char: 'jevin' | 'sky' | 'both') => {
    soundEngine.playPop();
    setSelectedChar(char);
    if (char === 'sky') {
      setPitchRate(1.6);
      setStatusText('Katakan sesuatu! Sky akan menirukan dengan suara anak beruang imut.');
    } else if (char === 'both') {
      setPitchRate(1.48);
      setStatusText('Katakan sesuatu! Jevin & Sky akan menirukan bersamaan!');
    } else {
      setPitchRate(1.38);
      setStatusText('Katakan sesuatu! Jevin akan menirukan dengan suara santai chipmunk.');
    }
  };

  const handleStartRecord = async () => {
    soundEngine.playPop();
    setStatusText('Mendengarkan... Katakan sesuatu sekarang!');
    const ok = await voiceMimicRef.current.startListening();
    if (ok) {
      setIsRecording(true);
    } else {
      setStatusText('Izin mikrofon belum aktif. Coba gunakan preset kata-kata di bawah!');
    }
  };

  const handleStopAndPlay = async () => {
    soundEngine.playPop();
    setIsRecording(false);
    setStatusText(
      selectedChar === 'sky'
        ? 'Sky menirukan suaramu dengan nada beruang imut...'
        : selectedChar === 'both'
        ? 'Jevin & Sky kompak menirukan suaramu!'
        : 'Jevin menirukan suaramu dengan nada lucu...'
    );
    setIsPlayingBack(true);
    onTalkingChange(selectedChar, true);

    const ok = await voiceMimicRef.current.stopAndPlayBack(
      pitchRate,
      () => {
        onTalkingChange(selectedChar, true);
      },
      () => {
        setIsPlayingBack(false);
        onTalkingChange(selectedChar, false);
        setStatusText('Lucu banget kan? Mau coba lagi?');
      }
    );

    if (!ok) {
      setIsPlayingBack(false);
      onTalkingChange(selectedChar, false);
      setStatusText('Gagal memutar rekaman. Coba preset suara!');
    }
  };

  const handlePlayPreset = (phrase: string) => {
    soundEngine.playPop();
    setStatusText(
      selectedChar === 'sky' ? `Sky bilang: "${phrase}"` : `Jevin bilang: "${phrase}"`
    );
    setIsPlayingBack(true);
    onTalkingChange(selectedChar, true);

    soundEngine.speakIndonesian(phrase, () => {
      setIsPlayingBack(false);
      onTalkingChange(selectedChar, false);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border-2 border-sky-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-sky-900 to-blue-900 border-b border-sky-500/30">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-sky-300" />
            <h3 className="font-bold text-white text-base">Peniru Suara Lucu</h3>
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
        <div className="flex p-2 gap-1.5 bg-slate-950/60 border-b border-slate-800">
          <button
            onClick={() => handleCharChange('jevin')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              selectedChar === 'jevin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>😴 Jevin</span>
          </button>
          <button
            onClick={() => handleCharChange('sky')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              selectedChar === 'sky'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🐻 Sky</span>
          </button>
          <button
            onClick={() => handleCharChange('both')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              selectedChar === 'both'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>👯 Duet</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col items-center text-center space-y-4">
          <div className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm font-semibold text-sky-200 min-h-[44px] flex items-center justify-center">
            {statusText}
          </div>

          {/* Big Record Button */}
          <div className="relative flex items-center justify-center py-2">
            {isRecording && (
              <div className="absolute w-32 h-32 rounded-full bg-rose-500/30 animate-ping" />
            )}
            <button
              onClick={isRecording ? handleStopAndPlay : handleStartRecord}
              disabled={isPlayingBack}
              className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all active:scale-95 border-4 ${
                isRecording
                  ? 'bg-rose-600 hover:bg-rose-500 border-rose-300 animate-pulse text-white'
                  : selectedChar === 'sky'
                  ? 'bg-gradient-to-br from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 border-cyan-200 text-slate-950 font-black'
                  : 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 border-sky-200 text-white font-black'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-8 h-8 mb-1" />
                  <span className="text-[10px] tracking-wide">SELESAI</span>
                </>
              ) : (
                <>
                  <Mic className="w-8 h-8 mb-1" />
                  <span className="text-[10px] tracking-wide">BICARA</span>
                </>
              )}
            </button>
          </div>

          {/* Pitch Slider */}
          <div className="w-full bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-sky-400" />
                Nada Suara {selectedChar === 'sky' ? 'Sky' : 'Jevin'}:
              </span>
              <span className="text-amber-400">{pitchRate.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="1.1"
              max="1.9"
              step="0.05"
              value={pitchRate}
              onChange={(e) => setPitchRate(parseFloat(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
          </div>

          {/* Preset Buttons */}
          <div className="w-full space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 text-left">
              Preset Kata-kata Lucu:
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                selectedChar === 'sky' ? 'Hai nama aku Sky si beruang!' : 'Halo nama aku Jevin!',
                selectedChar === 'sky' ? 'Jevin ayo bangun yuk!' : 'Lima menit lagi ya...',
                'Donat manis enak banget!',
                'Kita sahabat selamanya!',
              ].map((phrase, i) => (
                <button
                  key={i}
                  onClick={() => handlePlayPreset(phrase)}
                  disabled={isPlayingBack || isRecording}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs text-sky-200 flex items-center justify-between transition-colors disabled:opacity-40"
                >
                  <span className="truncate">{phrase}</span>
                  <Play className="w-3 h-3 text-amber-400 shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
