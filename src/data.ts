import { Habit, FishSpecies, ShopItem, MapZone } from './types';

export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'sleep-8-hours',
    title: 'Sleep 8 Hours',
    category: 'Health',
    rewardXp: 50,
    rewardGold: 25,
    bonusText: '+50 XP | +5% Catch Rate',
    completed: false,
    lastUpdated: ''
  },
  {
    id: 'hydration-2l',
    title: 'Hydration (2L)',
    category: 'Health',
    rewardXp: 25,
    rewardGold: 15,
    bonusText: '+25 XP | Boosts Stamina',
    completed: false,
    lastUpdated: ''
  },
  {
    id: 'meditation',
    title: 'Meditation',
    category: 'Mind',
    rewardXp: 40,
    rewardGold: 20,
    bonusText: 'Crit Chance Boost (+10%)',
    completed: false,
    lastUpdated: ''
  },
  {
    id: 'daily-journaling',
    title: 'Daily Journaling',
    category: 'Mind',
    rewardXp: 30,
    rewardGold: 15,
    bonusText: '+30 XP | Focus Clarity',
    completed: false,
    lastUpdated: ''
  },
  {
    id: 'study-session',
    title: 'Study Session (30m)',
    category: 'Knowledge',
    rewardXp: 45,
    rewardGold: 20,
    bonusText: 'Rare Fish Spotting Unlock',
    completed: false,
    lastUpdated: ''
  },
  {
    id: 'pattern-analysis',
    title: 'Pattern Analysis',
    category: 'Knowledge',
    rewardXp: 45,
    rewardGold: 20,
    bonusText: '+45 XP | Prediction Bonus',
    completed: false,
    lastUpdated: ''
  },
  {
    id: 'skill-practice',
    title: 'Skill Practice',
    category: 'Technique',
    rewardXp: 60,
    rewardGold: 30,
    bonusText: '+10% Landing Zone Size',
    completed: false,
    lastUpdated: ''
  }
];

export const ALL_FISH_SPECIES: FishSpecies[] = [
  // --- CALM LAKE ---
  {
    id: 'lazy-carp',
    name: 'Lazy Carp',
    rarity: 'Common',
    levelRequired: 1,
    caught: false,
    count: 0,
    zone: 'Calm Lake',
    image: '/src/assets/images/lazy_carp_1779419420715.png'
  },
  {
    id: 'bluegil-scout',
    name: 'Bluegil Scout',
    rarity: 'Common',
    levelRequired: 2,
    caught: false,
    count: 0,
    zone: 'Calm Lake',
    image: '/src/assets/images/bluegil_scout_1779419437348.png'
  },
  {
    id: 'zig-zag-trout',
    name: 'Zig-Zag Trout',
    rarity: 'Common',
    levelRequired: 4,
    caught: false,
    count: 0,
    zone: 'Calm Lake',
    image: '/src/assets/images/zig_zag_trout_1779419457736.png'
  },
  {
    id: 'river-minnow-swarm',
    name: 'River Minnow Swarm',
    rarity: 'Common',
    levelRequired: 6,
    caught: false,
    count: 0,
    zone: 'Calm Lake',
    image: '/src/assets/images/minnow_swarm_1779419476424.png'
  },

  // --- RESTLESS RIVER ---
  {
    id: 'phantom-eel',
    name: 'Phantom Eel',
    rarity: 'Rare',
    levelRequired: 11,
    caught: false,
    count: 0,
    zone: 'Restless River',
    image: '/src/assets/images/phantom_eel_1779419503847.png'
  },
  {
    id: 'spiked-barracuda',
    name: 'Spiked Barracuda',
    rarity: 'Rare',
    levelRequired: 15,
    caught: false,
    count: 0,
    zone: 'Restless River',
    image: '/src/assets/images/spiked_barracuda_1779419521204.png'
  },
  {
    id: 'stormfin-tuna',
    name: 'Stormfin Tuna',
    rarity: 'Rare',
    levelRequired: 20,
    caught: false,
    count: 0,
    zone: 'Restless River',
    image: '/src/assets/images/stormfin_tuna_1779419541058.png'
  },

  // --- MIRROR LAKE ---
  {
    id: 'ripple-eel',
    name: 'Ripple Eel',
    rarity: 'Epic',
    levelRequired: 26,
    caught: false,
    count: 0,
    zone: 'Mirror Lake',
    image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'tempestfin-tuna',
    name: 'Tempestfin Tuna',
    rarity: 'Epic',
    levelRequired: 32,
    caught: false,
    count: 0,
    zone: 'Mirror Lake',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop'
  },

  // --- DEEP SEA ---
  {
    id: 'abyssal-serpent',
    name: 'Abyssal Serpent',
    rarity: 'Epic',
    levelRequired: 41,
    caught: false,
    count: 0,
    zone: 'Deep Sea',
    image: '/src/assets/images/abyssal_serpent_1779418779643.png'
  },
  {
    id: 'celestial-fury',
    name: 'Celestial Fury',
    rarity: 'Legendary',
    levelRequired: 48,
    caught: false,
    count: 0,
    zone: 'Deep Sea',
    image: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=400&auto=format&fit=crop'
  },

  // --- THE ABYSS ---
  {
    id: 'the-leviathan',
    name: 'The Leviathan',
    rarity: 'Legendary',
    levelRequired: 61,
    caught: false,
    count: 0,
    zone: 'The Abyss',
    image: '/src/assets/images/the_leviathan_1779418712223.png'
  },
  {
    id: 'chrono-fish',
    name: 'Chrono Fish',
    rarity: 'Legendary',
    levelRequired: 75,
    caught: false,
    count: 0,
    zone: 'The Abyss',
    image: '/src/assets/images/chrono_fish_1779418733795.png'
  }
];

export const SHOP_ITEMS: ShopItem[] = [
  // --- RODS (Image 2) ---
  {
    id: 'basic-driftwood-rod',
    name: 'Basic Driftwood Rod',
    category: 'RODS',
    rarity: 'Common',
    price: 150,
    description: 'Your very first humble wooden fishing rod.',
    statModifier: '+0% Catch Rate',
    unlocked: true,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013620/screen_hwu4rt.png'
  },
  {
    id: 'steel-reinforced-rod',
    name: 'Steel Reinforced Rod',
    category: 'RODS',
    rarity: 'Common',
    price: 600,
    description: 'Heavy steel reinforced spine dependable in rough currents.',
    statModifier: '+10% Area Size',
    unlocked: false,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013620/screen_hwu4rt.png'
  },
  {
    id: 'deep-sea-whisperer',
    name: 'Deep Sea Whisperer',
    category: 'RODS',
    rarity: 'Rare',
    price: 1850,
    description: 'An advanced turquoise graphite carbon fiber high depth rod.',
    statModifier: '+30% Catch Rate',
    unlocked: false,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013620/screen_hwu4rt.png'
  },
  {
    id: 'mythic-celestial-rod',
    name: 'Mythic Celestial Rod',
    category: 'RODS',
    rarity: 'Legendary',
    price: 5500,
    description: 'Pulsing with raw celestial energy. Attracts legendary leviathans.',
    statModifier: '+45% Catch Rate',
    unlocked: false,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013620/screen_hwu4rt.png'
  },

  // --- BAITS (Image 1) ---
  {
    id: 'worm-bait',
    name: 'Worm Bait',
    category: 'BAIT',
    rarity: 'Common',
    price: 80,
    description: 'Fresh juicy earthworms irresistible to shallow lake species.',
    statModifier: '+5% Catch Rate',
    unlocked: false,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013628/screen_lglgm8.png'
  },
  {
    id: 'seahorse-lure',
    name: 'Seahorse Lure',
    category: 'BAIT',
    rarity: 'Rare',
    price: 350,
    description: 'A glowing seahorse decoy that mimics bioluminescent deep-sea food.',
    statModifier: '+15% Rare Chance',
    unlocked: false,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013628/screen_lglgm8.png'
  },

  // --- GEAR (Image 3 & 4) ---
  {
    id: 'basic-vest',
    name: 'Basic Vest',
    category: 'GEAR',
    rarity: 'Common',
    price: 250,
    description: 'Comfortable tan pocketed vest designed for starting out.',
    statModifier: '+5% XP Gains',
    unlocked: false,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013565/screen_amatbs.png'
  },
  {
    id: 'utility-vest',
    name: 'Utility Vest',
    category: 'GEAR',
    rarity: 'Common',
    price: 800,
    description: 'A canvas army green vest with deep double-stitched pockets.',
    statModifier: '+10% XP Gains',
    unlocked: false,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013565/screen_amatbs.png'
  },
  {
    id: 'elite-vest',
    name: 'Elite Vest',
    category: 'GEAR',
    rarity: 'Epic',
    price: 2200,
    description: 'High-tech navy polymer composite vest tailored for veterans.',
    statModifier: '+20% XP Gains',
    unlocked: false,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013565/screen_amatbs.png'
  },
  {
    id: 'straw-hat-e2c17',
    name: 'Straw Hat E2C17',
    category: 'GEAR',
    rarity: 'Common',
    price: 200,
    description: 'Classic rustic woven straw hat offering perfect sun protection.',
    statModifier: '+5% Stamina Recover',
    unlocked: false,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013565/screen_amatbs.png'
  },
  {
    id: 'angler-cap',
    name: 'Angler Cap',
    category: 'GEAR',
    rarity: 'Common',
    price: 500,
    description: 'A sturdy athletic blue baseball cap with custom fish logotype.',
    statModifier: '+10% Zone Size',
    unlocked: false,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013565/screen_amatbs.png'
  },
  {
    id: 'legendary-hat',
    name: 'Legendary Hat',
    category: 'GEAR',
    rarity: 'Legendary',
    price: 3500,
    description: 'Intricately stitched felt fedora pulsing with a cyan aura.',
    statModifier: '+25% Reel Control',
    unlocked: false,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013565/screen_amatbs.png'
  },

  // --- ACCESSORIES (Image 1 & 4) ---
  {
    id: 'fishing-gloves',
    name: 'Fishing Gloves',
    category: 'ACCESSORIES',
    rarity: 'Common',
    price: 450,
    description: 'Grip-reinforced dark leather fingerless gear protecting hands.',
    statModifier: '+10% Reel Grip',
    unlocked: false,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013540/screen_alvczh.png'
  },
  {
    id: 'tackle-backpack',
    name: 'Tackle Backpack',
    category: 'ACCESSORIES',
    rarity: 'Common',
    price: 1000,
    description: 'Durable brown heavy oil-skin rucksack with triple gear straps.',
    statModifier: '+10% Bag Space',
    unlocked: false,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013540/screen_alvczh.png'
  },
  {
    id: 'golden-fish-charm',
    name: 'Golden Fish Charm',
    category: 'ACCESSORIES',
    rarity: 'Epic',
    price: 2000,
    description: 'A legendary minted gold fish charm pulsing with deep ocean luck.',
    statModifier: '+25% Gold gains',
    unlocked: false,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013540/screen_alvczh.png'
  },
  {
    id: 'crystal-core',
    name: 'Crystal Core',
    category: 'ACCESSORIES',
    rarity: 'Epic',
    price: 1500,
    description: 'A hovering high-tech bioluminescent core with floating nodes.',
    statModifier: 'Scan Hidden Caches',
    unlocked: false,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013540/screen_alvczh.png'
  },
  {
    id: 'planet-orb',
    name: 'Astral Planet Sphere',
    category: 'ACCESSORIES',
    rarity: 'Legendary',
    price: 4000,
    description: 'Exquisite brass planetarium ring enclosing a spinning cosmos sphere.',
    statModifier: 'Double Habit Luck',
    unlocked: false,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013540/screen_alvczh.png'
  },

  // --- BOATS (Image 5) ---
  {
    id: 'wooden-boat',
    name: 'Wooden Boat',
    category: 'BOAT',
    rarity: 'Common',
    price: 100,
    description: 'A classic timber skip with standard retro cloth sail rig.',
    statModifier: 'Explore Calm Lakes',
    unlocked: true,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013527/screen_dvgoaf.png'
  },
  {
    id: 'river-boat',
    name: 'River Boat',
    category: 'BOAT',
    rarity: 'Common',
    price: 1200,
    description: 'Flat-bottom wooden skipper with canvas awning designed for rivers.',
    statModifier: 'Traverse Rocky Rivers',
    unlocked: false,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013527/screen_dvgoaf.png'
  },
  {
    id: 'deep-sea-vessel',
    name: 'Deep Sea Vessel',
    category: 'BOAT',
    rarity: 'Epic',
    price: 4500,
    description: 'Commercial steel-hulled trawler equipped with radio mast and sonars.',
    statModifier: 'Access Blue Open Ocean',
    unlocked: false,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013527/screen_dvgoaf.png'
  },
  {
    id: 'abyss-submarine',
    name: 'Abyss Submarine',
    category: 'BOAT',
    rarity: 'Legendary',
    price: 8000,
    description: 'Reinforced naval dark submarine with bioluminescent circular windows.',
    statModifier: 'Dive Core Abyssal Void',
    unlocked: false,
    image: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780013527/screen_dvgoaf.png'
  },
];

export const MAP_ZONES: MapZone[] = [
  {
    id: 'calm-lake',
    name: 'Calm Lake',
    minLevel: 1,
    maxLevel: 10,
    description: 'Cozy, sun-drenched shallow waters. Perfect environment to learn tracking basics.',
    totalSpecies: 4,
    caughtSpecies: 0,
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=400&auto=format&fit=crop',
    status: 'COMPLETE',
    glowType: 'calm'
  },
  {
    id: 'restless-river',
    name: 'Restless River',
    minLevel: 11,
    maxLevel: 25,
    description: 'Gushing rocky rapids and thick currents. Demands excellent rod stamina.',
    totalSpecies: 3,
    caughtSpecies: 0,
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=400&auto=format&fit=crop',
    status: 'CURRENTLY HERE',
    glowType: 'river'
  },
  {
    id: 'mirror-lake',
    name: 'Mirror Lake',
    minLevel: 26,
    maxLevel: 40,
    description: 'Stunning crystal mirror waters where high sky meets reflection. Magical things lie beneath.',
    totalSpecies: 2,
    caughtSpecies: 0,
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=400&auto=format&fit=crop',
    status: 'UNLOCKED',
    glowType: 'mirror'
  },
  {
    id: 'deep-sea',
    name: 'Deep Sea',
    minLevel: 41,
    maxLevel: 60,
    description: 'Immense depths under heavy winds. Requires a professional steel vessel trawler configuration.',
    totalSpecies: 2,
    caughtSpecies: 0,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=400&auto=format&fit=crop',
    status: 'LOCKED',
    glowType: 'none'
  },
  {
    id: 'the-abyss',
    name: 'The Abyss',
    minLevel: 61,
    maxLevel: 100,
    description: 'A completely dark oceanic void. Only pressure-shielded submersibles can dive here.',
    totalSpecies: 2,
    caughtSpecies: 0,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop',
    status: 'MYSTERIOUS',
    glowType: 'none'
  }
];
