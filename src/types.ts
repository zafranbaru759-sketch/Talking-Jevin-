export type ActivePet = 'jevin' | 'sky' | 'duo';

export type MoodState = 'happy' | 'sleepy' | 'hungry' | 'bored' | 'dirty' | 'laughing' | 'surprised' | 'talking' | 'crying';

export type WorldType = 'room' | 'candy' | 'pirate' | 'underwater';

export interface PetStats {
  hunger: number; // 0 - 100 (100 = full)
  energy: number; // 0 - 100 (100 = energetic, 0 = very sleepy)
  happiness: number; // 0 - 100 (100 = super happy)
  cleanliness: number; // 0 - 100 (100 = clean)
}

export interface AccessoryItem {
  id: string;
  name: string;
  category: 'hat' | 'glasses' | 'outfit' | 'hand';
  icon: string;
  price: number;
  unlocked: boolean;
  description: string;
}

export interface FoodItem {
  id: string;
  name: string;
  icon: string;
  hungerBoost: number;
  happinessBoost: number;
  energyBoost: number;
  price: number;
  count: number;
}

export interface Trick {
  id: string;
  title: string;
  description: string;
  level: number;
  xp: number;
  xpMax: number;
  icon: string;
  character: 'jevin' | 'sky' | 'duo';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jevin' | 'sky';
  text: string;
  timestamp: number;
}
