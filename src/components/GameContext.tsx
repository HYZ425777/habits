import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PlayerProfile, 
  Habit, 
  FishSpecies, 
  ShopItem, 
  MapZone, 
  AdventureLog 
} from '../types';
import { 
  DEFAULT_HABITS, 
  ALL_FISH_SPECIES, 
  SHOP_ITEMS, 
  MAP_ZONES 
} from '../data';
import { 
  auth as firebaseAuth, 
  db as firebaseDb, 
  googleProvider, 
  isFirebaseConfigured, 
  handleFirestoreError,
  OperationType 
} from '../firebase';
import { 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  onSnapshot, 
  query, 
  increment 
} from 'firebase/firestore';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'loot';
  icon?: string;
}

interface GameContextType {
  profile: PlayerProfile;
  habits: Habit[];
  codex: FishSpecies[];
  shop: ShopItem[];
  zones: MapZone[];
  logs: AdventureLog[];
  user: User | null;
  loading: boolean;
  toasts: ToastMessage[];
  nextFishId: string | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error' | 'loot', icon?: string) => void;
  removeToast: (id: string) => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  toggleHabit: (habitId: string) => Promise<void>;
  buyItem: (itemId: string) => Promise<void>;
  travelToZone: (zoneId: string) => Promise<void>;
  castFishLine: () => Promise<void>; // Simple mini-game catch triggering loot toasts
  instantLevelUp: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Helper to calculate level from cumulative XP
// Level 1: 0-99 XP, Level 2: 100-199 XP, etc.
const getLevelFromXp = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [nextFishId, setNextFishId] = useState<string | null>(null);

  // Core RPG States
  const [profile, setProfile] = useState<PlayerProfile>({
    uid: 'local_user',
    displayName: 'Guest Angler',
    photoURL: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780015697/screen_ojoryn.png',
    gold: 1250,
    xp: 150,
    level: 2,
    streak: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
    equippedRod: 'basic-driftwood-rod',
    purchasedRods: ['basic-driftwood-rod'],
    selectedZone: 'restless-river',
    weather: 'Rainy'
  });

  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);
  const [codex, setCodex] = useState<FishSpecies[]>(ALL_FISH_SPECIES);
  const [shop, setShop] = useState<ShopItem[]>(SHOP_ITEMS);
  const [zones, setZones] = useState<MapZone[]>(MAP_ZONES);
  const [logs, setLogs] = useState<AdventureLog[]>([]);

  // Trigger Toast alerts
  const showToast = (message: string, type: 'success' | 'info' | 'error' | 'loot' = 'success', icon?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    setToasts(prev => [...prev, { id, message, type, icon }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Google Sign-In Action
  const login = async () => {
    if (!isFirebaseConfigured || !firebaseAuth || !googleProvider) {
      showToast("Firebase isn't configured in the cloud panel. Operating in pristine offline local mode!", 'info');
      return;
    }
    try {
      const res = await signInWithPopup(firebaseAuth, googleProvider);
      if (res.user) {
        showToast(`Welcome back, Hero Angler ${res.user.displayName}!`, 'success', 'sailing');
      }
    } catch (err) {
      showToast("Sign in failed. Falling back to local state.", 'error');
    }
  };

  // Logout Action
  const logout = async () => {
    if (isFirebaseConfigured && firebaseAuth) {
      try {
        await fbSignOut(firebaseAuth);
        showToast("Signed out. Switched back to local guest state.", 'info');
      } catch (err) {
        console.error(err);
      }
    } else {
      showToast("Local Guest Profile reset.", 'info');
    }
    // Clear back to guest
    setUser(null);
    setProfile({
      uid: 'local_user',
      displayName: 'Guest Angler',
      photoURL: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780015697/screen_ojoryn.png',
      gold: 1250,
      xp: 150,
      level: 2,
      streak: 3,
      lastActiveDate: new Date().toISOString().split('T')[0],
      equippedRod: 'basic-driftwood-rod',
      purchasedRods: ['basic-driftwood-rod'],
      selectedZone: 'restless-river',
      weather: 'Rainy'
    });
    setHabits(DEFAULT_HABITS);
    setCodex(ALL_FISH_SPECIES);
    setShop(SHOP_ITEMS);
    setLogs([]);
  };

  // Handle Firebase Login Status Listener
  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      setLoading(false);
      // Load local caching if available
      const localProfile = localStorage.getItem('angler_profile');
      const localHabits = localStorage.getItem('angler_habits');
      const localCodex = localStorage.getItem('angler_codex');
      const localShop = localStorage.getItem('angler_shop');
      const localLogs = localStorage.getItem('angler_logs');

      if (localProfile) setProfile(JSON.parse(localProfile));
      if (localHabits) setHabits(JSON.parse(localHabits));
      if (localCodex) setCodex(JSON.parse(localCodex));
      if (localShop) setShop(JSON.parse(localShop));
      if (localLogs) setLogs(JSON.parse(localLogs));
      const localNextFishId = localStorage.getItem('angler_next_fish_id');
      if (localNextFishId) setNextFishId(localNextFishId);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const profileRef = doc(firebaseDb!, 'profiles', currentUser.uid);
        
        try {
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            const data = profileSnap.data() as PlayerProfile;
            setProfile({ ...data, uid: currentUser.uid, isFirebase: true });
          } else {
            // New User Setup
            const defaultProf: PlayerProfile = {
              uid: currentUser.uid,
              displayName: currentUser.displayName || 'Legendary Fisherman',
              photoURL: currentUser.photoURL || 'https://res.cloudinary.com/drykhiodx/image/upload/v1780015697/screen_ojoryn.png',
              gold: 1250,
              xp: 0,
              level: 1,
              streak: 1,
              lastActiveDate: new Date().toISOString().split('T')[0],
              equippedRod: 'basic-driftwood-rod',
              purchasedRods: ['basic-driftwood-rod'],
              selectedZone: 'calm-lake',
              weather: 'Sunny'
            };
            await setDoc(profileRef, defaultProf);
            setProfile({ ...defaultProf, isFirebase: true });

            // Initialize habits subcollection
            for (const habit of DEFAULT_HABITS) {
              await setDoc(doc(firebaseDb!, 'profiles', currentUser.uid, 'habits', habit.id), habit);
            }

            // Initialize codex subcollection
            for (const fish of ALL_FISH_SPECIES) {
              await setDoc(doc(firebaseDb!, 'profiles', currentUser.uid, 'codex', fish.id), fish);
            }
          }

          // Set up listeners for updates so it persists in real-time
          onSnapshot(profileRef, (snap) => {
            if (snap.exists()) {
              setProfile(prev => ({ ...(snap.data() as PlayerProfile), uid: currentUser.uid, isFirebase: true }));
            }
          });

          onSnapshot(collection(firebaseDb!, 'profiles', currentUser.uid, 'habits'), (snap) => {
            const list: Habit[] = [];
            snap.forEach(d => list.push(d.data() as Habit));
            if (list.length > 0) setHabits(list.sort((a,b) => a.id.localeCompare(b.id)));
          });

          onSnapshot(collection(firebaseDb!, 'profiles', currentUser.uid, 'codex'), (snap) => {
            const list: FishSpecies[] = [];
            snap.forEach(d => list.push(d.data() as FishSpecies));
            if (list.length > 0) setCodex(list.sort((a,b) => a.id.localeCompare(b.id)));
          });

          onSnapshot(collection(firebaseDb!, 'profiles', currentUser.uid, 'logs'), (snap) => {
            const list: AdventureLog[] = [];
            snap.forEach(d => list.push({ ...(d.data() as AdventureLog), id: d.id }));
            setLogs(list.sort((a,b) => b.timestamp.localeCompare(a.timestamp)));
          });

        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `profiles/${currentUser.uid}`);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync to localStorage as offline mechanism
  useEffect(() => {
    if (!user) {
      localStorage.setItem('angler_profile', JSON.stringify(profile));
      localStorage.setItem('angler_habits', JSON.stringify(habits));
      localStorage.setItem('angler_codex', JSON.stringify(codex));
      localStorage.setItem('angler_shop', JSON.stringify(shop));
      localStorage.setItem('angler_logs', JSON.stringify(logs));
      if (nextFishId) {
        localStorage.setItem('angler_next_fish_id', nextFishId);
      }
    }
  }, [profile, habits, codex, shop, logs, user, nextFishId]);

  // Pre-roll a target fish when the zone or codex changes
  useEffect(() => {
    const currentZone = MAP_ZONES.find(z => z.id === profile.selectedZone);
    if (currentZone) {
      const zoneFishSpecies = codex.filter(f => f.zone === currentZone.name);
      if (zoneFishSpecies.length > 0) {
        const currentNextFish = codex.find(f => f.id === nextFishId);
        if (!currentNextFish || currentNextFish.zone !== currentZone.name) {
          const randIdx = Math.floor(Math.random() * zoneFishSpecies.length);
          setNextFishId(zoneFishSpecies[randIdx].id);
        }
      }
    }
  }, [profile.selectedZone, codex, nextFishId]);

  // Adjust map zones statuses dynamically based on the current profile level
  useEffect(() => {
    const currentLevel = profile.level;
    const currentZone = profile.selectedZone;

    const updatedZones = MAP_ZONES.map(z => {
      const isCurrentlyHere = z.id === currentZone;
      let status: 'COMPLETE' | 'CURRENTLY HERE' | 'UNLOCKED' | 'LOCKED' | 'MYSTERIOUS' = 'LOCKED';

      if (currentLevel >= z.minLevel) {
        status = 'UNLOCKED';
      }
      if (isCurrentlyHere) {
        status = 'CURRENTLY HERE';
      }
      
      // Look up species metrics specifically
      const zoneFish = codex.filter(f => f.zone === z.name);
      const caughtCount = zoneFish.filter(f => f.caught).length;
      const totalCount = zoneFish.length;

      if (totalCount > 0 && caughtCount === totalCount) {
        status = isCurrentlyHere ? 'CURRENTLY HERE' : 'COMPLETE';
      }

      if (z.id === 'the-abyss' && currentLevel < z.minLevel) {
        status = 'MYSTERIOUS';
      } else if (currentLevel < z.minLevel) {
        status = 'LOCKED';
      }

      return {
        ...z,
        status,
        totalSpecies: totalCount,
        caughtSpecies: caughtCount
      };
    });

    setZones(updatedZones);
  }, [profile.level, profile.selectedZone, codex]);


  // Completing a Habit Action
  const toggleHabit = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const newCompletedState = !habit.completed;
    const goldBonus = newCompletedState ? habit.rewardGold : -habit.rewardGold;
    const xpBonus = newCompletedState ? habit.rewardXp : -habit.rewardXp;

    // Instantly update client visual state for micro-interactions feedback
    const updatedHabits = habits.map(h => h.id === habitId ? { ...h, completed: newCompletedState, lastUpdated: new Date().toISOString() } : h);
    setHabits(updatedHabits);

    // Update Profile Metrics
    const nextXp = Math.max(0, profile.xp + xpBonus);
    const nextLevel = getLevelFromXp(nextXp);
    const nextGold = Math.max(0, profile.gold + goldBonus);

    const goldMultiplier = profile.purchasedRods.includes('golden-reel') ? 1.2 : 1.0;
    const actualGoldPayout = Math.round(goldBonus * (goldBonus > 0 ? goldMultiplier : 1.0));

    // Experience leveling alerts
    if (nextLevel > profile.level) {
      showToast(`🏆 LEVEL UP! You reached Player Level ${nextLevel}!`, 'loot', 'arrow_upward');
    }

    if (newCompletedState) {
      showToast(`Completed "${habit.title}"! Got +${habit.rewardXp} XP and +${actualGoldPayout}g!`, 'success', 'check_circle');
    } else {
      showToast(`Unchecked "${habit.title}". Rewards removed.`, 'info', 'undo');
    }

    const nextProfile = {
      ...profile,
      xp: nextXp,
      level: nextLevel,
      gold: Math.max(0, profile.gold + actualGoldPayout)
    };
    setProfile(nextProfile);

    // Logging chronological accomplishments
    if (newCompletedState) {
      const message = `Completed daily routine: ${habit.title}. Claimed gold & experience.`;
      const newLog: AdventureLog = {
        id: Date.now().toString(),
        type: 'habit',
        message,
        timestamp: new Date().toISOString()
      };
      setLogs(prev => [newLog, ...prev]);
    }

    // Persist to Firebase if online
    if (user && isFirebaseConfigured && firebaseDb) {
      try {
        const batchRef = doc(firebaseDb, 'profiles', user.uid);
        await updateDoc(batchRef, {
          xp: nextXp,
          level: nextLevel,
          gold: Math.max(0, profile.gold + actualGoldPayout)
        });

        const habitRef = doc(firebaseDb, 'profiles', user.uid, 'habits', habitId);
        await updateDoc(habitRef, {
          completed: newCompletedState,
          lastUpdated: new Date().toISOString()
        });

        if (newCompletedState) {
          const logRef = doc(collection(firebaseDb, 'profiles', user.uid, 'logs'));
          await setDoc(logRef, {
            type: 'habit',
            message: `Completed daily routine: ${habit.title}. Claimed gold & experience.`,
            timestamp: new Date().toISOString()
          });
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `profiles/${user.uid}/habits/${habitId}`);
      }
    }
  };

  // Buying items from Codex/Shop
  const buyItem = async (itemId: string) => {
    const item = shop.find(i => i.id === itemId);
    if (!item) return;

    if (item.price > profile.gold) {
      showToast(`Not enough gold! You need ${item.price}g to secure this item.`, 'error', 'lock');
      return;
    }

    if (profile.purchasedRods.includes(itemId)) {
      showToast(`You already own the ${item.name}!`, 'info');
      return;
    }

    const nextGold = profile.gold - item.price;
    const isRod = item.category === 'RODS';

    // Locally update items
    const updatedProfile: PlayerProfile = {
      ...profile,
      gold: nextGold,
      purchasedRods: [...profile.purchasedRods, itemId],
      equippedRod: isRod ? itemId : profile.equippedRod
    };

    setProfile(updatedProfile);
    setShop(prev => prev.map(i => i.id === itemId ? { ...i, unlocked: true } : i));

    showToast(`Successfully purchased ${item.name} for ${item.price}g!`, 'loot', 'payments');

    // Logs purchase
    const newLog: AdventureLog = {
      id: Date.now().toString(),
      type: 'purchase',
      message: `Purchased and obtained ${item.name} from item shop.`,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);

    // Firestore Integration
    if (user && isFirebaseConfigured && firebaseDb) {
      try {
        const profileRef = doc(firebaseDb, 'profiles', user.uid);
        await updateDoc(profileRef, {
          gold: nextGold,
          purchasedRods: [...profile.purchasedRods, itemId],
          equippedRod: isRod ? itemId : profile.equippedRod
        });

        const logRef = doc(collection(firebaseDb, 'profiles', user.uid, 'logs'));
        await setDoc(logRef, {
          type: 'purchase',
          message: `Purchased and obtained ${item.name} from item shop.`,
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `profiles/${user.uid}`);
      }
    }
  };

  // Traveling between unlocked zones
  const travelToZone = async (zoneId: string) => {
    const zone = MAP_ZONES.find(z => z.id === zoneId);
    if (!zone) return;

    if (profile.level < zone.minLevel) {
      showToast(`Zone Locked! Reach Level ${zone.minLevel} to travel here.`, 'error', 'lock');
      return;
    }

    if (profile.selectedZone === zoneId) {
      showToast(`You are already practicing at ${zone.name}!`, 'info');
      return;
    }

    setProfile(prev => ({ ...prev, selectedZone: zoneId }));
    showToast(`Set sail to ${zone.name}! Cast your line when ready.`, 'info', 'explore');

    // Log travel
    const newLog: AdventureLog = {
      id: Date.now().toString(),
      type: 'travel',
      message: `Traveled and set camp at ${zone.name} waters.`,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);

    if (user && isFirebaseConfigured && firebaseDb) {
      try {
        const profileRef = doc(firebaseDb, 'profiles', user.uid);
        await updateDoc(profileRef, {
          selectedZone: zoneId
        });

        const logRef = doc(collection(firebaseDb, 'profiles', user.uid, 'logs'));
        await setDoc(logRef, {
          type: 'travel',
          message: `Traveled and set camp at ${zone.name} waters.`,
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `profiles/${user.uid}`);
      }
    }
  };

  // Cast fishing line mini-game logic matching RPG design
  const castFishLine = async () => {
    const currentZone = zones.find(z => z.id === profile.selectedZone);
    if (!currentZone) return;

    showToast("Casting line... Waiting for a bite...", 'info', 'phishing');

    setTimeout(async () => {
      // Pick matching zone species
      const zoneFishSpecies = codex.filter(f => f.zone === currentZone.name);
      if (zoneFishSpecies.length === 0) {
        showToast("The currents are empty here. Choose another zone!", 'error');
        return;
      }

      // Add a random fish catching mechanic with rod multipliers or use next pre-roll
      let chosenFish = codex.find(f => f.id === nextFishId && f.zone === currentZone.name);
      if (!chosenFish) {
        const randIdx = Math.floor(Math.random() * zoneFishSpecies.length);
        chosenFish = zoneFishSpecies[randIdx];
      }
      if (!chosenFish) return;

      // Mark fish caught
      const updatedCodex = codex.map(f => {
        if (f.id === chosenFish!.id) {
          return {
            ...f,
            caught: true,
            count: f.count + 1
          };
        }
        return f;
      });
      setCodex(updatedCodex);

      // Roll new next fish from the zone species for subsequent cast
      if (zoneFishSpecies.length > 1) {
        const filtered = zoneFishSpecies.filter(f => f.id !== chosenFish!.id);
        const nextList = filtered.length > 0 ? filtered : zoneFishSpecies;
        const nextIdx = Math.floor(Math.random() * nextList.length);
        setNextFishId(nextList[nextIdx].id);
      } else if (zoneFishSpecies.length === 1) {
        setNextFishId(zoneFishSpecies[0].id);
      }

      // Gold cache reward
      const baseGoldReward = chosenFish.rarity === 'Common' ? 50 : 
                             chosenFish.rarity === 'Rare' ? 120 :
                             chosenFish.rarity === 'Epic' ? 250 : 500;

      const goldMultiplier = profile.purchasedRods.includes('golden-reel') ? 1.2 : 1.0;
      const parsedGold = Math.round(baseGoldReward * goldMultiplier);

      const nextGold = profile.gold + parsedGold;
      const nextXp = profile.xp + 20;
      const nextLevel = getLevelFromXp(nextXp);

      setProfile(prev => ({ ...prev, gold: nextGold, xp: nextXp, level: nextLevel }));

      showToast(`🎉 CAUGHT A FISH! Obtained a ${chosenFish.rarity} [${chosenFish.name}] (+${parsedGold}g, +20 XP!)`, 'loot', 'catching');

      if (nextLevel > profile.level) {
        showToast(`🏆 LEVEL UP! You reached Player Level ${nextLevel}!`, 'loot', 'arrow_upward');
      }

      // Log catching
      const newLog: AdventureLog = {
        id: Date.now().toString(),
        type: 'catch',
        message: `Angled and caught legendary ${chosenFish.rarity} ${chosenFish.name} at ${currentZone.name}.`,
        timestamp: new Date().toISOString()
      };
      setLogs(prev => [newLog, ...prev]);

      // Firebase replication
      if (user && isFirebaseConfigured && firebaseDb) {
        try {
          const profileRef = doc(firebaseDb, 'profiles', user.uid);
          await updateDoc(profileRef, {
            gold: nextGold,
            xp: nextXp,
            level: nextLevel
          });

          // update subcollection codex
          const fishRef = doc(firebaseDb, 'profiles', user.uid, 'codex', chosenFish.id);
          await updateDoc(fishRef, {
            caught: true,
            count: increment(1)
          });

          const logRef = doc(collection(firebaseDb, 'profiles', user.uid, 'logs'));
          await setDoc(logRef, {
            type: 'catch',
            message: `Angled and caught legendary ${chosenFish.rarity} ${chosenFish.name} at ${currentZone.name}.`,
            timestamp: new Date().toISOString()
          });
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, `profiles/${user.uid}/codex/${chosenFish.id}`);
        }
      }
    }, 1500);
  };

  const instantLevelUp = async () => {
    const nextLevel = profile.level + 1;
    const nextXp = (nextLevel - 1) * 100;
    const nextGold = profile.gold + 500; // Testing bonus gold!

    const nextProfile = {
      ...profile,
      xp: nextXp,
      level: nextLevel,
      gold: nextGold
    };

    setProfile(nextProfile);

    showToast(`🏆 INSTANT LEVEL UP! Reached level ${nextLevel}! +500g granted for testing.`, 'loot', 'arrow_upward');

    const newLog: AdventureLog = {
      id: Date.now().toString(),
      type: 'travel',
      message: `Triggered testing Instant Level Up. Reached Player Level ${nextLevel}.`,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);

    // Persist to Firebase if online
    if (user && isFirebaseConfigured && firebaseDb) {
      try {
        const profileRef = doc(firebaseDb, 'profiles', user.uid);
        await updateDoc(profileRef, {
          xp: nextXp,
          level: nextLevel,
          gold: nextGold
        });

        const logRef = doc(collection(firebaseDb, 'profiles', user.uid, 'logs'));
        await setDoc(logRef, {
          type: 'travel',
          message: `Triggered testing Instant Level Up. Reached Player Level ${nextLevel}.`,
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `profiles/${user.uid}`);
      }
    }
  };

  return (
    <GameContext.Provider value={{
      profile,
      habits,
      codex,
      shop,
      zones,
      logs,
      user,
      loading,
      toasts,
      nextFishId,
      showToast,
      removeToast,
      login,
      logout,
      toggleHabit,
      buyItem,
      travelToZone,
      castFishLine,
      instantLevelUp
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used inside a GameProvider');
  return context;
};
