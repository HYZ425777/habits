export type HabitCategory = 'Health' | 'Mind' | 'Knowledge' | 'Technique';
export type FishRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type ShopCategory = 'RODS' | 'BAIT' | 'GEAR' | 'ACCESSORIES' | 'BOAT';

export interface PlayerProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  gold: number;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  equippedRod: string;
  purchasedRods: string[];
  selectedZone: string;
  weather: string;
  isFirebase?: boolean;
}

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  rewardXp: number;
  rewardGold: number;
  bonusText: string;
  completed: boolean;
  lastUpdated: string;
}

export interface FishSpecies {
  id: string;
  name: string;
  rarity: FishRarity;
  levelRequired: number;
  caught: boolean;
  count: number;
  zone: string;
  image: string;
}

export interface ShopItem {
  id: string;
  name: string;
  category: ShopCategory;
  rarity: FishRarity;
  price: number;
  description: string;
  statModifier: string;
  unlocked: boolean;
  image: string;
}

export interface MapZone {
  id: string;
  name: string;
  minLevel: number;
  maxLevel: number;
  description: string;
  totalSpecies: number;
  caughtSpecies: number;
  image: string;
  status: 'COMPLETE' | 'CURRENTLY HERE' | 'UNLOCKED' | 'LOCKED' | 'MYSTERIOUS';
  glowType: 'calm' | 'river' | 'mirror' | 'none';
}

export interface AdventureLog {
  id: string;
  type: 'habit' | 'catch' | 'purchase' | 'travel';
  message: string;
  timestamp: string;
}
