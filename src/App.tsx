import React, { useState, useEffect, useRef } from 'react';
import { MoodState, WorldType, PetStats, AccessoryItem, FoodItem, ActivePet } from './types';
import { soundEngine } from './utils/audio';
import { JevinCharacter } from './components/JevinCharacter';
import { SkyCharacter } from './components/SkyCharacter';
import { WorldBackground } from './components/WorldBackground';
import { InteractionCanvas } from './components/InteractionCanvas';
import { ChatModal } from './components/ChatModal';
import { VoiceMimicModal } from './components/VoiceMimicModal';
import { CareModal } from './components/CareModal';
import { TrickMaster } from './components/MiniGames/TrickMaster';
import { AdventureRun } from './components/MiniGames/AdventureRun';
import { GachaModal } from './components/GachaModal';
import { WardrobeModal } from './components/WardrobeModal';
import {
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Mic,
  MessageCircle,
  Utensils,
  Award,
  Compass,
  Gift,
  Shirt,
  Image as ImageIcon,
} from 'lucide-react';

export default function App() {
  // Active character state: 'jevin' | 'sky' | 'duo'
  const [activePet, setActivePet] = useState<ActivePet>(() => {
    return (localStorage.getItem('jevin_active_pet') as ActivePet) || 'duo';
  });

  const [coins, setCoins] = useState<number>(() => {
    return parseInt(localStorage.getItem('jevin_coins') || '150', 10);
  });

  const [stats, setStats] = useState<PetStats>(() => {
    const saved = localStorage.getItem('jevin_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return { hunger: 80, energy: 85, happiness: 90, cleanliness: 90 };
  });

  const [world, setWorld] = useState<WorldType>('room');
  const [isNight, setIsNight] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [usePhotoModel, setUsePhotoModel] = useState(false);

  // Jevin interactive states
  const [moodJevin, setMoodJevin] = useState<MoodState>('happy');
  const [isSleepingJevin, setIsSleepingJevin] = useState(false);
  const [isEatingJevin, setIsEatingJevin] = useState(false);
  const [isBathingJevin, setIsBathingJevin] = useState(false);
  const [isTalkingJevin, setIsTalkingJevin] = useState(false);
  const [isTickledJevin, setIsTickledJevin] = useState(false);
  const [isPokedJevin, setIsPokedJevin] = useState(false);
  const [jevinBubbleText, setJevinBubbleText] = useState<string | null>(
    'Hooaam... Halo! Mau main bareng aku atau Sky?'
  );

  // Sky interactive states
  const [moodSky, setMoodSky] = useState<MoodState>('happy');
  const [isSleepingSky, setIsSleepingSky] = useState(false);
  const [isEatingSky, setIsEatingSky] = useState(false);
  const [isBathingSky, setIsBathingSky] = useState(false);
  const [isTalkingSky, setIsTalkingSky] = useState(false);
  const [isTickledSky, setIsTickledSky] = useState(false);
  const [isPokedSky, setIsPokedSky] = useState(false);
  const [skyDialogue, setSkyDialogue] = useState<string | null>('Hai sahabat! Ayo kita seru-seruan bareng!');

  // Wardrobe & accessories for both Jevin and Sky
  const [unlockedItemIds, setUnlockedItemIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('jevin_unlocked');
    return saved ? JSON.parse(saved) : ['hat_sleep', 'hat_cat'];
  });
  const [equippedHatJevin, setEquippedHatJevin] = useState<AccessoryItem | null>(null);
  const [equippedGlassesJevin, setEquippedGlassesJevin] = useState<AccessoryItem | null>(null);
  const [equippedHatSky, setEquippedHatSky] = useState<AccessoryItem | null>(null);
  const [equippedGlassesSky, setEquippedGlassesSky] = useState<AccessoryItem | null>(null);

  // Modals
  const [activeModal, setActiveModal] = useState<
    'chat' | 'voice' | 'care' | 'tricks' | 'adventure' | 'gacha' | 'wardrobe' | 'crying' | null
  >(null);

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('jevin_active_pet', activePet);
  }, [activePet]);

  useEffect(() => {
    localStorage.setItem('jevin_coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('jevin_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('jevin_unlocked', JSON.stringify(unlockedItemIds));
  }, [unlockedItemIds]);

  const handleUserFirstGesture = () => {
    soundEngine.startBGM();
  };

  const [lastFocusedPet, setLastFocusedPet] = useState<'jevin' | 'sky'>('jevin');
  const petCounterRef = useRef<number>(0);

  // Passive decay
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        const isAnySleeping = isSleepingJevin || isSleepingSky;
        const hunger = Math.max(0, prev.hunger - 0.7);
        const energy = isAnySleeping ? Math.min(100, prev.energy + 3) : Math.max(0, prev.energy - 0.5);
        const cleanliness = Math.max(0, prev.cleanliness - 0.35);
        const happiness = Math.max(0, prev.happiness - 0.5);

        if (moodJevin !== 'crying' && !isSleepingJevin && !isTickledJevin && !isPokedJevin && !isTalkingJevin && !isEatingJevin) {
          if (hunger < 25) setMoodJevin('hungry');
          else if (energy < 25) setMoodJevin('sleepy');
          else if (happiness < 30) setMoodJevin('bored');
          else if (cleanliness < 30) setMoodJevin('dirty');
          else setMoodJevin('happy');
        }

        if (moodSky !== 'crying' && !isSleepingSky && !isTickledSky && !isPokedSky && !isTalkingSky && !isEatingSky) {
          if (hunger < 25) setMoodSky('hungry');
          else if (energy < 25) setMoodSky('sleepy');
          else if (happiness < 30) setMoodSky('bored');
          else if (cleanliness < 30) setMoodSky('dirty');
          else setMoodSky('happy');
        }

        return { hunger, energy, happiness, cleanliness };
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isSleepingJevin, isSleepingSky, isTickledJevin, isTickledSky, isPokedJevin, isPokedSky, moodJevin, moodSky]);

  // Inactivity yawn
  const resetInactivity = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      if (!isSleepingJevin && moodJevin !== 'crying') {
        soundEngine.playYawn();
        setMoodJevin('sleepy');
        setJevinBubbleText('Hooaaammm... (menguap santai)');
        setTimeout(() => setJevinBubbleText(null), 3000);
      }
    }, 18000);
  };

  useEffect(() => {
    resetInactivity();
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [isSleepingJevin, moodJevin]);

  // Poke Jevin
  const handlePokeJevin = () => {
    resetInactivity();
    handleUserFirstGesture();
    setLastFocusedPet('jevin');

    // If crying, tapping makes Jevin sob and play cry sound without canceling!
    if (moodJevin === 'crying') {
      soundEngine.playCry();
      const cryingQuotes = [
        'Huwaaaa... Jevin masih sedih... uwaaa!',
        'Hiks hiks... jangan colek, mataku banjir air mata...',
        'Uwaaa... donat kesayanganku jatuh ke lantai...',
        'Hiks... Sky, tolong hibur aku lagi...',
      ];
      setJevinBubbleText(cryingQuotes[Math.floor(Math.random() * cryingQuotes.length)]);
      return;
    }

    soundEngine.playSurprise();
    setIsPokedJevin(true);
    setMoodJevin('surprised');

    const pokePhrases = [
      'Aduh! Jangan kenceng-kenceng hehe...',
      'Kaget tau! Mataku hampir kebuka lebar...',
      'Hehe geli! Mau ajak aku ngapain?',
      'Colek lagi dapat donat ga nih?',
    ];
    setJevinBubbleText(pokePhrases[Math.floor(Math.random() * pokePhrases.length)]);

    setTimeout(() => {
      setIsPokedJevin(false);
      setMoodJevin((curr) => (curr === 'surprised' ? 'happy' : curr));
    }, 700);

    setTimeout(() => setJevinBubbleText(null), 3000);
  };

  // Poke Sky
  const handlePokeSky = () => {
    resetInactivity();
    handleUserFirstGesture();
    setLastFocusedPet('sky');

    // If crying, tapping makes Sky sob and play bear crying sound without canceling!
    if (moodSky === 'crying') {
      soundEngine.playSkyCry();
      const skyCryingQuotes = [
        'Huwaaaa... telinga beruang Sky masih banjir air mata... uwaaa!',
        'Hiks hiks... madu manisku tumpah, Sky sedih banget...',
        'Uwaaaa... jangan tinggalin Sky sendirian...',
        'Hiks... Jevin sahabatku, jangan biarkan aku sedih...',
      ];
      setSkyDialogue(skyCryingQuotes[Math.floor(Math.random() * skyCryingQuotes.length)]);
      return;
    }

    soundEngine.playGiggle();
    setIsPokedSky(true);
    setMoodSky('surprised');

    const skyPhrases = [
      'Hiyaaa! Telinga beruangku geli tau hehe!',
      'Halo! Aku Sky, siap berpetualang!',
      'Jevin, bangun yuk! Teman kita lagi main sama aku nih!',
      'Yeeay! Colek aku lagi dong!',
    ];
    setSkyDialogue(skyPhrases[Math.floor(Math.random() * skyPhrases.length)]);

    setTimeout(() => {
      setIsPokedSky(false);
      setMoodSky((curr) => (curr === 'surprised' ? 'happy' : curr));
    }, 700);

    setTimeout(() => setSkyDialogue(null), 3000);
  };

  // General Screen Tap
  const handleTap = (x: number, y: number) => {
    if (activePet === 'sky') {
      handlePokeSky();
    } else if (activePet === 'jevin') {
      handlePokeJevin();
    } else {
      // Duo: check click position
      if (x < window.innerWidth / 2) {
        handlePokeSky();
      } else {
        handlePokeJevin();
      }
    }
  };

  // Crying Sky Trigger (Only Sky cries, Jevin comforts)
  const handleTriggerCryingSky = () => {
    resetInactivity();
    handleUserFirstGesture();
    setLastFocusedPet('sky');
    // Ensure Jevin is not crying so both NEVER cry together!
    setMoodJevin((curr) => (curr === 'crying' ? 'happy' : curr));

    soundEngine.playSkyCry();
    setMoodSky('crying');

    const cryPhrases = [
      'Huwaaaaa... hiks hiks... Madu manisku tumpah... uwaaa!',
      'Jangan galak-galak dong, telinga beruangku sedih nih...',
      'Uwaaaa... Sky mau dipeluk sahabat!',
      'Huwaaa... aku ga mau ditinggal sendirian!',
    ];
    setSkyDialogue(cryPhrases[Math.floor(Math.random() * cryPhrases.length)]);

    if (activePet === 'duo' || activePet === 'jevin') {
      setJevinBubbleText('Sky, jangan nangis kawan! Ini bantal dan donatku buat kamu!');
    }

    setTimeout(() => {
      setMoodSky((curr) => {
        if (curr === 'crying') {
          setSkyDialogue('Hiks... makasih Jevin & sahabatku.');
          setTimeout(() => setSkyDialogue(null), 2500);
          return 'happy';
        }
        return curr;
      });
    }, 12000);
  };

  // Crying Jevin Trigger (Only Jevin cries, Sky comforts)
  const handleTriggerCryingJevin = () => {
    resetInactivity();
    handleUserFirstGesture();
    setLastFocusedPet('jevin');
    // Ensure Sky is not crying so both NEVER cry together!
    setMoodSky((curr) => (curr === 'crying' ? 'happy' : curr));

    soundEngine.playCry();
    setMoodJevin('crying');

    const cryPhrases = [
      'Uwaaaa... hiks hiks... Jangan jahat dong, bantal kesayanganku mana...',
      'Huwaaaa... aku sedih banget! Hiks hiks...',
      'Uwaaa... jangan tinggalin aku sendirian... uwaaa!',
      'Huwaaa... donat gulaku jatuh ke lantai... uwaaa!',
    ];
    setJevinBubbleText(cryPhrases[Math.floor(Math.random() * cryPhrases.length)]);

    if (activePet === 'duo' || activePet === 'sky') {
      setSkyDialogue('Cup cup cup Jevin, jangan nangis ya sahabatku! Ini aku peluk!');
    }

    setTimeout(() => {
      setMoodJevin((curr) => {
        if (curr === 'crying') {
          setJevinBubbleText('Hiks... makasih sahabatku, jangan bikin aku sedih lagi ya...');
          setTimeout(() => setJevinBubbleText(null), 2500);
          return 'happy';
        }
        return curr;
      });
    }, 12000);
  };

  // Stop all crying immediately
  const handleStopAllCrying = () => {
    soundEngine.playPop();
    setMoodJevin('happy');
    setMoodSky('happy');
    setJevinBubbleText('Horeee! Senyum lagi, Jevin ga sedih!');
    setSkyDialogue('Yeeay! Semuanya ceria dan bahagia kembali!');
    setTimeout(() => {
      setJevinBubbleText(null);
      setSkyDialogue(null);
    }, 3000);
  };

  // Single Crying handler (Never both crying together!)
  const handleTriggerCrying = () => {
    if (moodJevin === 'crying' || moodSky === 'crying') {
      handleStopAllCrying();
      return;
    }

    if (activePet === 'sky') {
      handleTriggerCryingSky();
    } else if (activePet === 'jevin') {
      handleTriggerCryingJevin();
    } else {
      // In Duo mode: only one cries! Alternates based on focus or triggers Jevin first
      if (lastFocusedPet === 'sky') {
        handleTriggerCryingSky();
      } else {
        handleTriggerCryingJevin();
      }
    }
  };

  // Petting (Usap) - Calms crying upon repeated gentle petting
  const handlePet = () => {
    resetInactivity();
    handleUserFirstGesture();
    petCounterRef.current += 1;

    // Only calm crying if user intentionally pets multiple times
    if (petCounterRef.current >= 4) {
      petCounterRef.current = 0;
      if (moodJevin === 'crying') {
        soundEngine.playPop();
        setMoodJevin('happy');
        setJevinBubbleText('Horeee... makasih udah ngelus air mataku, aku ga nangis lagi!');
        setStats((prev) => ({
          ...prev,
          happiness: Math.min(100, prev.happiness + 20),
        }));
        setTimeout(() => setJevinBubbleText(null), 3000);
        return;
      }

      if (moodSky === 'crying') {
        soundEngine.playPop();
        setMoodSky('happy');
        setSkyDialogue('Hihihi! Makasih udah elus telingaku, Sky ga nangis lagi!');
        setStats((prev) => ({
          ...prev,
          happiness: Math.min(100, prev.happiness + 20),
        }));
        setTimeout(() => setSkyDialogue(null), 3000);
        return;
      }
    }

    setStats((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 0.35),
    }));

    if (Math.random() < 0.15) {
      soundEngine.playPop();
      if (activePet === 'sky') {
        if (moodSky !== 'crying') {
          setSkyDialogue('Dielus beruang rasanya hangat banget!');
          setTimeout(() => setSkyDialogue(null), 2500);
        }
      } else {
        if (moodJevin !== 'crying') {
          setJevinBubbleText('Purrr... dielus enak banget, jadi makin ngantuk...');
          setTimeout(() => setJevinBubbleText(null), 2500);
        }
      }
    }
  };

  // Tickle (Colek Cepat)
  const handleTickle = () => {
    resetInactivity();
    handleUserFirstGesture();
    soundEngine.playGiggle();
    setCoins((c) => c + 1);
    setStats((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 4),
    }));

    if (activePet === 'sky') {
      setIsTickledSky(true);
      setMoodSky('laughing');
      setSkyDialogue('Hahaha! Geli banget hihihi!');
      setTimeout(() => {
        setIsTickledSky(false);
        setMoodSky('happy');
        setSkyDialogue(null);
      }, 1200);
    } else if (activePet === 'jevin') {
      setIsTickledJevin(true);
      setMoodJevin('laughing');
      setJevinBubbleText('Hahaha! Geli banget ampuun hahaha!');
      setTimeout(() => {
        setIsTickledJevin(false);
        setMoodJevin('happy');
        setJevinBubbleText(null);
      }, 1200);
    } else {
      setIsTickledJevin(true);
      setIsTickledSky(true);
      setMoodJevin('laughing');
      setMoodSky('laughing');
      setJevinBubbleText('Hahaha seru banget!');
      setSkyDialogue('Geli barengan hihihi!');
      setTimeout(() => {
        setIsTickledJevin(false);
        setIsTickledSky(false);
        setMoodJevin('happy');
        setMoodSky('happy');
        setJevinBubbleText(null);
        setSkyDialogue(null);
      }, 1200);
    }
  };

  // Swipe gesture
  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    resetInactivity();
    handleUserFirstGesture();
    soundEngine.playPop();

    if (direction === 'up') {
      soundEngine.playSurprise();
      if (activePet === 'sky') setSkyDialogue('Lompat tinggi ke awan!');
      else setJevinBubbleText('Wuiii loncat terbang!');
    } else if (direction === 'down') {
      soundEngine.playYawn();
      if (activePet === 'sky') setSkyDialogue('Duduk manis di lantai...');
      else setJevinBubbleText('Rebahan lebih nikmat...');
    } else {
      soundEngine.playGiggle();
      if (activePet === 'sky') setSkyDialogue('Berputar seperti gasing!');
      else setJevinBubbleText('Berputar guling-guling!');
    }

    setTimeout(() => {
      setJevinBubbleText(null);
      setSkyDialogue(null);
    }, 2500);
  };

  // Eating handler
  const handleTriggerEat = (target: 'jevin' | 'sky' | 'both', food: FoodItem) => {
    if (target === 'sky' || target === 'both') {
      setIsEatingSky(true);
      if (moodSky === 'crying') setMoodSky('happy');
      setSkyDialogue(`Nyam nyam! Enak banget ${food.name}!`);
      setTimeout(() => {
        setIsEatingSky(false);
        setSkyDialogue(null);
      }, 2000);
    }

    if (target === 'jevin' || target === 'both') {
      setIsEatingJevin(true);
      if (moodJevin === 'crying') setMoodJevin('happy');
      setJevinBubbleText(`Nyam nyam! Lezat sekali ${food.name}!`);
      setTimeout(() => {
        setIsEatingJevin(false);
        setJevinBubbleText(null);
      }, 2000);
    }
  };

  // Bath handler
  const handleTriggerBath = (target: 'jevin' | 'sky' | 'both') => {
    if (target === 'sky' || target === 'both') {
      setIsBathingSky(true);
      setSkyDialogue('Segar! Bulu Sky jadi wangi dan berkilau!');
      setTimeout(() => {
        setIsBathingSky(false);
        setSkyDialogue(null);
      }, 2500);
    }

    if (target === 'jevin' || target === 'both') {
      setIsBathingJevin(true);
      setJevinBubbleText('Segar banget! Jevin wangi semerbak!');
      setTimeout(() => {
        setIsBathingJevin(false);
        setJevinBubbleText(null);
      }, 2500);
    }
  };

  // Sleep toggle
  const handleToggleSleep = () => {
    const nextState = !isSleepingJevin;
    setIsSleepingJevin(nextState);
    setIsSleepingSky(nextState);

    if (nextState) {
      soundEngine.playYawn();
      setJevinBubbleText('Selamat tidur... Zzz...');
      setSkyDialogue('Mimpi indah... Zzz...');
    } else {
      soundEngine.playPop();
      setJevinBubbleText('Hooam... Pagi dunia!');
      setSkyDialogue('Pagi cerah! Semangat!');
    }
    setTimeout(() => {
      setJevinBubbleText(null);
      setSkyDialogue(null);
    }, 3000);
  };

  const handleSpendCoins = (amount: number): boolean => {
    if (coins >= amount) {
      setCoins((c) => c - amount);
      return true;
    }
    soundEngine.playSurprise();
    setJevinBubbleText('Koinmu kurang! Ayo main jalan-jalan atau trik!');
    setTimeout(() => setJevinBubbleText(null), 3000);
    return false;
  };

  const handleMuteToggle = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  return (
    <div
      onClick={handleUserFirstGesture}
      className="relative w-screen h-screen overflow-hidden flex flex-col font-sans select-none touch-none"
    >
      <WorldBackground world={world} isNight={isNight}>
        {/* TOP STATUS & CHARACTER SELECTOR BAR */}
        <header className="relative z-30 w-full px-3 pt-2.5 pb-2 flex flex-col gap-2 pointer-events-auto">
          <div className="flex items-center justify-between">
            {/* Coins Display */}
            <div className="px-3 py-1.5 rounded-full bg-slate-900/75 backdrop-blur-md border border-amber-400/50 shadow-lg flex items-center gap-1.5">
              <span className="text-xl">🪙</span>
              <span className="text-amber-300 font-black text-sm tracking-wide">
                {coins}
              </span>
            </div>

            {/* CHARACTER SELECTOR: JEVIN, SKY, DUO */}
            <div className="flex bg-slate-900/80 backdrop-blur-md p-1 rounded-2xl border border-indigo-400/40 shadow-xl">
              <button
                onClick={() => {
                  soundEngine.playPop();
                  setActivePet('jevin');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                  activePet === 'jevin'
                    ? 'bg-blue-600 text-white shadow-md scale-102'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>😴 Jevin</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playPop();
                  setActivePet('sky');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                  activePet === 'sky'
                    ? 'bg-cyan-500 text-slate-950 shadow-md scale-102'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>🐻 Sky</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playPop();
                  setActivePet('duo');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                  activePet === 'duo'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md scale-102'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>👯 Duo</span>
              </button>
            </div>

            {/* Settings Quick Buttons */}
            <div className="flex items-center gap-1.5">
              {/* World Selector */}
              <div className="flex bg-slate-900/70 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-md">
                <button
                  onClick={() => {
                    soundEngine.playPop();
                    setWorld('room');
                  }}
                  title="Kamar Santai"
                  className={`p-1.5 rounded-full text-xs transition-all ${
                    world === 'room' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  🏠
                </button>
                <button
                  onClick={() => {
                    soundEngine.playPop();
                    setWorld('candy');
                  }}
                  title="Dunia Permen"
                  className={`p-1.5 rounded-full text-xs transition-all ${
                    world === 'candy' ? 'bg-pink-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  🍭
                </button>
                <button
                  onClick={() => {
                    soundEngine.playPop();
                    setWorld('pirate');
                  }}
                  title="Bajak Laut"
                  className={`p-1.5 rounded-full text-xs transition-all ${
                    world === 'pirate' ? 'bg-amber-700 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  🏴‍☠️
                </button>
                <button
                  onClick={() => {
                    soundEngine.playPop();
                    setWorld('underwater');
                  }}
                  title="Bawah Laut"
                  className={`p-1.5 rounded-full text-xs transition-all ${
                    world === 'underwater' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  🌊
                </button>
              </div>

              {/* Day / Night Toggle */}
              <button
                onClick={() => {
                  soundEngine.playPop();
                  setIsNight(!isNight);
                }}
                className="w-8 h-8 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/20 text-amber-300 flex items-center justify-center shadow-md active:scale-90"
              >
                {isNight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              {/* Mute Toggle */}
              <button
                onClick={handleMuteToggle}
                className="w-8 h-8 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-md active:scale-90"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Photo Mode Toggle */}
              <button
                onClick={() => {
                  soundEngine.playPop();
                  setUsePhotoModel(!usePhotoModel);
                }}
                className={`w-8 h-8 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-md active:scale-90 ${
                  usePhotoModel ? 'text-amber-300 border-amber-400' : 'text-slate-300'
                }`}
                title="Foto Asli / Vektor"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              {/* Single Clean Crying / Calming Control */}
              <button
                onClick={() => {
                  soundEngine.playPop();
                  setActiveModal('crying');
                }}
                className={`px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-black flex items-center gap-1.5 shadow-md active:scale-90 transition-all ${
                  moodJevin === 'crying' || moodSky === 'crying'
                    ? 'bg-rose-600/90 border-rose-300 text-white animate-pulse'
                    : 'bg-slate-900/80 hover:bg-slate-800 border-sky-400/50 text-sky-200'
                }`}
                title="Buka Menu Tombol Crying"
              >
                <span className="text-sm">
                  {moodJevin === 'crying' || moodSky === 'crying' ? '😭' : '😢'}
                </span>
                <span>
                  {moodJevin === 'crying'
                    ? 'Jevin Nangis'
                    : moodSky === 'crying'
                    ? 'Sky Nangis'
                    : 'Tombol Crying'}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN STAGE (CHARACTERS & GESTURES) */}
        <main className="relative flex-1 w-full flex items-center justify-center">
          <InteractionCanvas
            onTap={handleTap}
            onPet={handlePet}
            onSwipe={handleSwipe}
          />

          {/* FLOATING PROMINENT "TOMBOL CRYING" BUTTON */}
          <div className="absolute top-4 right-4 sm:right-8 z-30 pointer-events-auto">
            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveModal('crying');
              }}
              className={`px-3.5 py-2 rounded-2xl backdrop-blur-xl border-2 shadow-2xl flex items-center gap-2.5 font-black text-xs transition-all active:scale-95 ${
                moodJevin === 'crying' || moodSky === 'crying'
                  ? 'bg-rose-600/95 border-rose-300 text-white animate-pulse shadow-rose-500/50'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-sky-400 text-sky-200 hover:scale-105 shadow-sky-500/20'
              }`}
            >
              <span className="text-2xl animate-bounce">😭</span>
              <div className="flex flex-col text-left">
                <span className="leading-tight text-white font-extrabold text-xs">Tombol Crying</span>
                <span className="text-[10px] text-sky-300 font-medium">
                  {moodJevin === 'crying'
                    ? 'Jevin Menangis 😭'
                    : moodSky === 'crying'
                    ? 'Sky Menangis 😭'
                    : 'Klik Untuk Crying'}
                </span>
              </div>
            </button>
          </div>

          {/* Jevin Speech Bubble */}
          {(activePet === 'jevin' || activePet === 'duo') && jevinBubbleText && (
            <div className="absolute top-10 right-4 sm:right-1/4 z-30 max-w-[200px] sm:max-w-xs px-3.5 py-2 rounded-2xl bg-white/95 text-slate-900 text-xs font-bold shadow-2xl border-2 border-indigo-200 animate-bounce text-center">
              {jevinBubbleText}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-indigo-200 rotate-45" />
            </div>
          )}

          {/* Sky Speech Bubble */}
          {(activePet === 'sky' || activePet === 'duo') && skyDialogue && (
            <div className="absolute top-10 left-4 sm:left-1/4 z-30 max-w-[200px] sm:max-w-xs px-3.5 py-2 rounded-2xl bg-white/95 text-slate-900 text-xs font-bold shadow-2xl border-2 border-cyan-300 animate-bounce text-center">
              {skyDialogue}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-cyan-300 rotate-45" />
            </div>
          )}

          {/* Characters Container */}
          <div className="relative z-20 flex items-end justify-center gap-4 sm:gap-12 pb-4">
            {/* SKY CHARACTER (if Sky or Duo) */}
            {(activePet === 'sky' || activePet === 'duo') && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handlePokeSky();
                }}
                className="animate-fade-in transition-all cursor-pointer"
              >
                <SkyCharacter
                  mood={moodSky}
                  isSleeping={isSleepingSky}
                  isEating={isEatingSky}
                  isBathing={isBathingSky}
                  isTalking={isTalkingSky}
                  isTickled={isTickledSky}
                  isPoked={isPokedSky}
                  isCrying={moodSky === 'crying'}
                  equippedHat={equippedHatSky}
                  equippedGlasses={equippedGlassesSky}
                  onPoke={handlePokeSky}
                  scale={activePet === 'sky' ? 1.05 : 0.88}
                  usePhotoModel={usePhotoModel}
                  dialogue={null}
                />
              </div>
            )}

            {/* JEVIN CHARACTER (if Jevin or Duo) */}
            {(activePet === 'jevin' || activePet === 'duo') && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handlePokeJevin();
                }}
                className="animate-fade-in transition-all cursor-pointer"
              >
                <JevinCharacter
                  mood={moodJevin}
                  isSleeping={isSleepingJevin}
                  isEating={isEatingJevin}
                  isBathing={isBathingJevin}
                  isTalking={isTalkingJevin}
                  isTickled={isTickledJevin}
                  isPoked={isPokedJevin}
                  isCrying={moodJevin === 'crying'}
                  equippedHat={equippedHatJevin}
                  equippedGlasses={equippedGlassesJevin}
                  usePhotoModel={usePhotoModel}
                  scale={activePet === 'jevin' ? 1.05 : 0.95}
                />
              </div>
            )}
          </div>
        </main>

        {/* BOTTOM ACTION DOCK */}
        <footer className="relative z-30 w-full px-3 pb-4 pt-1 flex justify-center pointer-events-auto">
          <div className="w-full max-w-lg bg-slate-900/85 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-2 shadow-2xl flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
            {/* 1. Voice Mimic */}
            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveModal('voice');
              }}
              className="flex-1 min-w-[58px] py-2 px-1 rounded-2xl bg-gradient-to-b from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 transition-all"
            >
              <Mic className="w-5 h-5" />
              <span className="text-[10px] font-black tracking-tight">Suara</span>
            </button>

            {/* 2. Chatbot */}
            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveModal('chat');
              }}
              className="flex-1 min-w-[58px] py-2 px-1 rounded-2xl bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-[10px] font-black tracking-tight">Ngobrol</span>
            </button>

            {/* 3. Care / Kitchen / Bath */}
            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveModal('care');
              }}
              className="flex-1 min-w-[58px] py-2 px-1 rounded-2xl bg-gradient-to-b from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 transition-all"
            >
              <Utensils className="w-5 h-5" />
              <span className="text-[10px] font-black tracking-tight">Rawat</span>
            </button>

            {/* 4. Tricks */}
            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveModal('tricks');
              }}
              className="flex-1 min-w-[58px] py-2 px-1 rounded-2xl bg-gradient-to-b from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 transition-all"
            >
              <Award className="w-5 h-5" />
              <span className="text-[10px] font-black tracking-tight">Trik</span>
            </button>

            {/* 5. Adventure Walk */}
            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveModal('adventure');
              }}
              className="flex-1 min-w-[58px] py-2 px-1 rounded-2xl bg-gradient-to-b from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 transition-all"
            >
              <Compass className="w-5 h-5" />
              <span className="text-[10px] font-black tracking-tight">Jalan</span>
            </button>

            {/* 6. Gacha Machine */}
            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveModal('gacha');
              }}
              className="flex-1 min-w-[58px] py-2 px-1 rounded-2xl bg-gradient-to-b from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 transition-all"
            >
              <Gift className="w-5 h-5" />
              <span className="text-[10px] font-black tracking-tight">Gacha</span>
            </button>

            {/* 7. Wardrobe */}
            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveModal('wardrobe');
              }}
              className="flex-1 min-w-[58px] py-2 px-1 rounded-2xl bg-gradient-to-b from-violet-600 to-purple-800 hover:from-violet-500 hover:to-purple-700 text-white flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 transition-all"
            >
              <Shirt className="w-5 h-5" />
              <span className="text-[10px] font-black tracking-tight">Lemari</span>
            </button>
          </div>
        </footer>
      </WorldBackground>

      {/* MODALS */}
      {/* 1. Chat Modal */}
      <ChatModal
        isOpen={activeModal === 'chat'}
        onClose={() => setActiveModal(null)}
        defaultCharacter={activePet}
        onCharacterSpeak={(character, text) => {
          if (character === 'sky') {
            setIsTalkingSky(true);
            setSkyDialogue(text);
            setTimeout(() => {
              setIsTalkingSky(false);
              setSkyDialogue(null);
            }, 4500);
          } else {
            setIsTalkingJevin(true);
            setJevinBubbleText(text);
            setTimeout(() => {
              setIsTalkingJevin(false);
              setJevinBubbleText(null);
            }, 4500);
          }
        }}
      />

      {/* 2. Voice Mimic Modal */}
      <VoiceMimicModal
        isOpen={activeModal === 'voice'}
        onClose={() => setActiveModal(null)}
        defaultCharacter={activePet}
        onTalkingChange={(character, talking) => {
          if (character === 'sky' || character === 'both') {
            setIsTalkingSky(talking);
          }
          if (character === 'jevin' || character === 'both') {
            setIsTalkingJevin(talking);
          }
        }}
      />

      {/* 3. Care Modal */}
      <CareModal
        isOpen={activeModal === 'care'}
        onClose={() => setActiveModal(null)}
        stats={stats}
        coins={coins}
        defaultCharacter={activePet}
        onUpdateStats={(newStats) => setStats((prev) => ({ ...prev, ...newStats }))}
        onSpendCoins={handleSpendCoins}
        onTriggerEat={handleTriggerEat}
        onTriggerBath={handleTriggerBath}
        onToggleSleep={handleToggleSleep}
        isSleeping={isSleepingJevin || isSleepingSky}
      />

      {/* 4. Trick Master Modal */}
      <TrickMaster
        isOpen={activeModal === 'tricks'}
        onClose={() => setActiveModal(null)}
        defaultCharacter={activePet}
        onRewardCoins={(reward) => setCoins((c) => c + reward)}
        onPerformTrickAnimation={(character, trickId) => {
          if (character === 'sky' || character === 'duo') {
            setIsTickledSky(true);
            setSkyDialogue('Lihat trik beruangku! Hebat kan?');
            setTimeout(() => {
              setIsTickledSky(false);
              setSkyDialogue(null);
            }, 2000);
          }
          if (character === 'jevin' || character === 'duo') {
            setIsTickledJevin(true);
            setJevinBubbleText('Lihat aksiku! Keren kan? Hehe!');
            setTimeout(() => {
              setIsTickledJevin(false);
              setJevinBubbleText(null);
            }, 2000);
          }
        }}
      />

      {/* 5. Adventure Run Modal */}
      <AdventureRun
        isOpen={activeModal === 'adventure'}
        onClose={() => setActiveModal(null)}
        world={world}
        defaultCharacter={activePet}
        onAddCoins={(reward) => setCoins((c) => c + reward)}
      />

      {/* 6. Gacha Modal */}
      <GachaModal
        isOpen={activeModal === 'gacha'}
        onClose={() => setActiveModal(null)}
        coins={coins}
        onSpendCoins={handleSpendCoins}
        onUnlockAccessory={(item) => {
          if (!unlockedItemIds.includes(item.id)) {
            setUnlockedItemIds((prev) => [...prev, item.id]);
          }
        }}
        onAddCoins={(amount) => setCoins((c) => c + amount)}
        unlockedItemIds={unlockedItemIds}
      />

      {/* 7. Wardrobe Modal */}
      <WardrobeModal
        isOpen={activeModal === 'wardrobe'}
        onClose={() => setActiveModal(null)}
        unlockedIds={unlockedItemIds}
        equippedHatJevin={equippedHatJevin}
        equippedGlassesJevin={equippedGlassesJevin}
        equippedHatSky={equippedHatSky}
        equippedGlassesSky={equippedGlassesSky}
        onEquipHatJevin={setEquippedHatJevin}
        onEquipGlassesJevin={setEquippedGlassesJevin}
        onEquipHatSky={setEquippedHatSky}
        onEquipGlassesSky={setEquippedGlassesSky}
      />

      {/* 8. Dedicated Tombol Crying Modal */}
      {activeModal === 'crying' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-indigo-950 border-2 border-sky-400/50 rounded-3xl p-5 shadow-2xl text-white">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-bounce">😭</span>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white">Tombol Crying</h3>
                  <p className="text-xs text-sky-300">Pilih karakter yang ingin menangis</p>
                </div>
              </div>
              <button
                onClick={() => {
                  soundEngine.playPop();
                  setActiveModal(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* Note badge */}
            <div className="my-3 px-3 py-2 rounded-xl bg-blue-950/70 border border-sky-500/30 text-[11px] text-sky-200 text-center">
              💡 <strong>Aturan:</strong> Hanya 1 karakter yang menangis bergantian. Sahabatnya akan otomatis datang menghibur!
            </div>

            {/* Crying Options Grid */}
            <div className="flex flex-col gap-2.5 my-4">
              {/* Crying Jevin */}
              <button
                onClick={() => {
                  handleTriggerCryingJevin();
                  setActiveModal(null);
                }}
                className={`w-full p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all active:scale-95 ${
                  moodJevin === 'crying'
                    ? 'bg-blue-600/40 border-blue-400 shadow-lg shadow-blue-500/30 ring-2 ring-blue-400'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-blue-500/40 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-blue-700/60 border border-blue-400 flex items-center justify-center text-2xl shadow-inner">
                    😭
                  </div>
                  <div>
                    <div className="font-black text-sm text-white flex items-center gap-1.5">
                      <span>Crying Jevin</span>
                      {moodJevin === 'crying' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500 text-white animate-pulse">
                          Aktif
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Air mata deras & suara tangisan sedih
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-sky-300 bg-blue-900/60 px-2.5 py-1 rounded-lg">
                  {moodJevin === 'crying' ? 'Menangis 😭' : 'Pilih'}
                </span>
              </button>

              {/* Crying Sky */}
              <button
                onClick={() => {
                  handleTriggerCryingSky();
                  setActiveModal(null);
                }}
                className={`w-full p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all active:scale-95 ${
                  moodSky === 'crying'
                    ? 'bg-cyan-600/40 border-cyan-400 shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-cyan-500/40 hover:border-cyan-400'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-700/60 border border-cyan-300 flex items-center justify-center text-2xl shadow-inner">
                    🐻😭
                  </div>
                  <div>
                    <div className="font-black text-sm text-white flex items-center gap-1.5">
                      <span>Crying Sky</span>
                      {moodSky === 'crying' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500 text-white animate-pulse">
                          Aktif
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Anak beruang menangis uwaaa sedih
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-cyan-200 bg-cyan-900/60 px-2.5 py-1 rounded-lg">
                  {moodSky === 'crying' ? 'Menangis 😭' : 'Pilih'}
                </span>
              </button>

              {/* Tenangkan Semua / Hapus Air Mata */}
              <button
                onClick={() => {
                  handleStopAllCrying();
                  setActiveModal(null);
                }}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-2 border-emerald-300 text-white flex items-center justify-center gap-2 font-black text-sm shadow-xl active:scale-95 transition-all mt-1"
              >
                <span className="text-xl">😊</span>
                <span>Hapus Air Mata / Tenangkan Semua</span>
              </button>
            </div>

            {/* Close button at bottom */}
            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveModal(null);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all text-center"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
