import React, { useState } from 'react';
import { GameProvider, useGame } from './components/GameContext';
import { isFirebaseConfigured } from './firebase';
import { HabitCard } from './components/HabitCard';
import { AnglerAvatar } from './components/AnglerAvatar';
import { 
  Compass, 
  BookOpen, 
  ShoppingBag, 
  CheckSquare, 
  LogOut, 
  LogIn, 
  Waves, 
  Lock, 
  Skull, 
  Zap, 
  CloudRain, 
  Award, 
  Coins, 
  Anchor, 
  Info, 
  X,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HabitCategory, ShopCategory } from './types';

function MainApp() {
  const {
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
    removeToast,
    login,
    logout,
    toggleHabit,
    buyItem,
    travelToZone,
    castFishLine,
    showToast,
    instantLevelUp
  } = useGame();

  const [activeTab, setActiveTab] = useState<'home' | 'habits' | 'codex' | 'map' | 'shop'>('home');
  const [activeShopCategory, setActiveShopCategory] = useState<ShopCategory>('RODS');
  const [isQuestsOpen, setIsQuestsOpen] = useState(false);

  // Derive active game values for current zone to pass to first-page UI
  const currentZone = zones.find(z => z.id === profile.selectedZone);
  const zoneFish = currentZone ? codex.filter(f => f.zone === currentZone.name) : [];
  const nextTargetFish = codex.find(f => f.id === nextFishId) || zoneFish[0];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-[#94a3b8] bg-slate-800/60 border-slate-750/50';
      case 'Rare': return 'text-[#38bdf8] bg-sky-950/40 border-sky-850/40';
      case 'Epic': return 'text-[#c084fc] bg-purple-950/40 border-purple-850/40';
      case 'Legendary': return 'text-[#facc15] bg-amber-950/40 border-amber-850/40';
      default: return 'text-white bg-slate-850 border-slate-750';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'Rare': return 'shadow-[0_0_15px_rgba(56,189,248,0.2)] border-sky-500/30';
      case 'Epic': return 'shadow-[0_0_18px_rgba(192,132,252,0.25)] border-purple-500/30';
      case 'Legendary': return 'shadow-[0_0_22px_rgba(250,204,21,0.3)] border-amber-500/30';
      default: return 'border-slate-800';
    }
  };

  // Cast fishing line states
  const [isCasting, setIsCasting] = useState(false);

  const handleCastLine = async () => {
    if (isCasting) return;
    setIsCasting(true);
    await castFishLine();
    setTimeout(() => {
      setIsCasting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#070e1d] flex flex-col items-center justify-center relative select-none md:p-6 p-0">
      {/* Dynamic atmospheric background canvas for desktop views */}
      <div className="fixed inset-0 z-0 opacity-15 pointer-events-none hidden md:block" style={{
        backgroundImage: 'radial-gradient(circle at 50% 10%, #173b54 0%, transparent 60%), url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath fill=\'%2344E2CD\' d=\'M40,-50C50,-40,55,-25,58,-8C60,8,60,25,52,38C45,50,30,58,15,62C0,66,-15,66,-30,60C-45,54,-60,42,-64,27C-68,12,-61,-6,-53,-20C-45,-34,-36,-44,-25,-53C-14,-62,0,-70,13,-68C26,-66,35,-59,40,-50Z\' transform=\'translate(100 100)\' /%3E%3C/svg%3E")',
        backgroundSize: '800px',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }} />

      {/* Main smartphone device outer container for high fidelity presentation */}
      <div className="w-full max-w-md h-screen md:h-[840px] md:rounded-[36px] md:border-[10px] md:border-[#1a243a] md:shadow-[0_24px_50px_rgba(0,0,0,0.8)] bg-[#0c1322] relative flex flex-col overflow-hidden z-10">
        
        {/* Bioluminescent Top App Bar (Pinned Header) */}
        <header className="absolute top-0 left-0 right-0 h-18 z-40 bg-[#121a2e]/90 backdrop-blur-xl border-b border-[#44e2cd]/20 px-6 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl border-2 border-[#44e2cd] overflow-hidden bg-[#141b2b] shadow-inner flex-shrink-0">
              <img 
                className="w-full h-full object-cover" 
                src={user ? (user.photoURL || profile.photoURL) : profile.photoURL} 
                alt="Anglers Hero Profile Picture" 
                referrerPolicy="no-referrer"
              />
              <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0c1322] ${isFirebaseConfigured ? 'bg-emerald-500' : 'bg-[#f4bd22]'}`} />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-serif font-bold text-sm text-white max-w-[140px] truncate">
                  {user ? (user.displayName || 'Hero Angler') : profile.displayName}
                </span>
                {user && (
                  <span className="bg-[#44e2cd]/20 border border-[#44e2cd]/30 text-[9px] text-[#44e2cd] font-semibold px-1 rounded uppercase tracking-[0.05em] scale-90">
                    Cloud
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] uppercase font-bold text-[#44e2cd] tracking-wider font-sans">
                  LV.{profile.level} {profile.level > 10 ? 'Veteran' : 'Novice'}
                </span>
                <span className="text-[9px] text-[#c5c6cd]">
                  {profile.xp % 100}/100 XP
                </span>
              </div>
              <div className="w-28 h-1 bg-[#1c2438] rounded-full overflow-hidden mt-0.5">
                <div 
                  className="bg-[#44e2cd] h-full transition-all duration-300" 
                  style={{ width: `${profile.xp % 100}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#0a192f]/50 px-3 py-1.5 rounded-full border border-[#44e2cd]/20">
              <Coins className="w-3.5 h-3.5 text-[#f9bd22] animate-bounce" />
              <span className="font-serif font-bold text-[#f9bd22] text-xs">
                {profile.gold.toLocaleString()}g
              </span>
            </div>

            {/* Google Authentication Trigger */}
            {isFirebaseConfigured ? (
              user ? (
                <button 
                  onClick={logout} 
                  className="w-8 h-8 rounded-lg bg-[#232a3a] border border-[#ff4a4a]/20 hover:border-[#ff4a4a]/50 text-[#ff4a4a] flex items-center justify-center active-tap transition-colors"
                  title="Sign Out Account"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={login} 
                  className="w-8 h-8 rounded-lg bg-[#44e2cd]/10 border border-[#44e2cd]/40 text-[#44e2cd] flex items-center justify-center active-tap hover:bg-[#44e2cd]/20 transition-colors"
                  title="Link Google Account"
                >
                  <LogIn className="w-4 h-4" />
                </button>
              )
            ) : (
              <button 
                onClick={() => showToast("Operate as guest. Accept Firebase terms inside top setup banner to enable cloud sync!", "info")}
                className="w-8 h-8 rounded-lg bg-[#2e3545]/40 border border-amber-500/20 text-amber-500 flex items-center justify-center active-tap"
                title="Guest Mode Only"
              >
                <Info className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Display Firebase Unset Warning Notice Banner */}
        {!isFirebaseConfigured && (
          <div className="absolute top-18 left-0 right-0 z-35 bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 text-center">
            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
              🎮 Playing in Sandbox Offline Mode. Tap Accept in Google panel to link database!
            </p>
          </div>
        )}

        {/* Core Scrollable Layout Section */}
        <main className={`flex-1 overflow-y-auto px-6 pt-22 pb-28 relative z-10 ${!isFirebaseConfigured ? 'pt-28' : 'pt-22'}`}>
          <AnimatePresence mode="wait">
            
            {/* 1. HOME VIEW */}
            {activeTab === 'home' && (
              <motion.div 
                key="home_view" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                {/* Dynamic Weather & Streak Header Grid */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="glass-card rounded-2xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#44e2cd]/10 flex items-center justify-center border border-[#44e2cd]/20">
                      <CloudRain className="w-5 h-5 text-[#44e2cd] animate-pulse" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-wider text-[#c5c6cd]">Weather</p>
                      <p className="font-serif font-bold text-xs text-white">Rain: +25% Rare</p>
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f9bd22]/10 flex items-center justify-center border border-[#f9bd22]/20">
                      <Zap className="w-5 h-5 text-[#f9bd22]" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-wider text-[#c5c6cd]">Water Streak</p>
                      <p className="font-serif font-bold text-xs text-white">{profile.streak} Day Hunt</p>
                    </div>
                  </div>
                </div>

                {/* Cinematic Sage Advice Card */}
                <div className="glass-card rounded-2xl p-4 flex items-center gap-4 border-l-4 border-[#f9bd22]">
                  <img 
                    className="w-11 h-11 rounded-full border border-amber-500/30 object-cover flex-shrink-0" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsZkEaXyciXhP35LEGB2OunyUAYUl5a7Nc3H6M_zolzS650DEpwfBLgIiLGR2Y9Yl8nDu1mkC8Nbqx-dtC63vIlmNHoVBgWa9bIphAT0v99vvSN3BirFDscr4okZXOoAg7yvNN2gOdgwpS-vwviqUyurbtailIvg6p2BOIMRqeuDx2jUywIa-8DLUgYAVsCLSeba1QFmI0sWQLaqKtIhzlPcqWg5K30HGyZxZOmmVSKmmMwGJOuphPOWxvwz1idAxRzu3q6hwVbVk" 
                    alt="Sage Fisherman S" 
                  />
                  <div>
                    <h4 className="text-[10px] font-bold uppercase text-amber-500">Mentees Guidance</h4>
                    <p className="text-xs text-white italic">"Stay consistent, Angler. The Abyssal Dragon only bites for those with perfect focus."</p>
                  </div>
                </div>

                {/* Developer Debug / Testing Tools */}
                <div className="glass-card bg-[#8b5cf6]/5 border border-[#8b5cf6]/20 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="text-left">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#a78bfa] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">build</span> Dev QA Sandbox Tools
                    </h4>
                    <p className="text-[11px] text-[#c5c6cd] mt-1">
                      Instantly advance levels and receive <b>+500 gold</b> to test areas, unlocking maps (Lake, River, Ocean, Abyss) & item requirements!
                    </p>
                  </div>
                  <button
                    onClick={instantLevelUp}
                    className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] hover:from-[#7c3aed] hover:to-[#4f46e5] active:scale-95 text-white font-serif text-xs px-4 py-2.5 rounded-xl border border-[#a78bfa]/30 shadow-lg shadow-purple-500/10 transition-all font-bold"
                  >
                    <span className="material-symbols-outlined text-sm">upgrade</span>
                    Instant Level Up!
                  </button>
                </div>

                {/* Interactive Angler Growth Avatar Module */}
                <AnglerAvatar profile={profile} />

                {/* Targeted Legendary Challenge Card */}
                <div className="glass-card bg-gradient-to-b from-[#191f2f]/90 to-[#121826]/90 rounded-2xl p-5 border-2 border-[#44e2cd]/30 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#44e2cd]/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <span className="text-[9px] font-bold text-[#44e2cd] bg-[#44e2cd]/10 border border-[#44e2cd]/20 px-2.5 py-0.5 rounded-full uppercase tracking-widest font-sans">
                        Target Prey Species
                      </span>
                      <h3 className="font-serif text-2xl text-white mt-2 font-bold tracking-tight text-left">
                        {nextTargetFish ? nextTargetFish.name : 'Abyssal Serpent'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${nextTargetFish ? getRarityColor(nextTargetFish.rarity) : 'text-slate-400 border-slate-700'}`}>
                          {nextTargetFish ? nextTargetFish.rarity : 'Epic'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {currentZone ? currentZone.name : 'Unknown Waters'}
                        </span>
                      </div>
                    </div>
                    
                    {nextTargetFish?.image ? (
                      <div className={`w-20 h-20 rounded-2xl overflow-hidden bg-slate-950 border flex items-center justify-center flex-shrink-0 relative ${getRarityGlow(nextTargetFish.rarity)}`}>
                        <img 
                          src={nextTargetFish.image} 
                          alt={nextTargetFish.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-4xl text-[#44e2cd] animate-pulse">sailing</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-[#c5c6cd] mt-3 leading-relaxed text-left">
                    {nextTargetFish?.rarity === 'Legendary' && `A mythical creature of the high seas. Practice extreme focus to secure this legendary master fish.`}
                    {nextTargetFish?.rarity === 'Epic' && `An elusive, highly intelligent species. Study patterns or upgrade tackle to ensure its secure landing.`}
                    {nextTargetFish?.rarity === 'Rare' && `A majestic and nimble dweller in these depths. Requires good reel grip and steady hands.`}
                    {nextTargetFish?.rarity === 'Common' && `A reliable practitioner fish. Perfect for training and standard XP harvesting.`}
                    {!nextTargetFish && `Eerily gliding inside the cold pitch-black currents. Practice daily study to crack its tracking patterns.`}
                  </p>

                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-[10px] bg-[#232a3a] px-2.5 py-1 rounded text-[#c5c6cd] border border-slate-700 font-medium font-mono uppercase">
                      Lvl. Required: {nextTargetFish ? nextTargetFish.levelRequired : 1}
                    </span>
                    <span className="text-[10px] bg-[#232a3a] px-2.5 py-1 rounded text-[#c5c6cd] border border-slate-700 font-medium">
                      {nextTargetFish?.rarity === 'Legendary' ? '💀 ELITE BOSS' : nextTargetFish?.rarity === 'Epic' ? '⚡ FAST' : '⚓ HUNTABLE'}
                    </span>
                  </div>

                  {/* Active Casting Deck */}
                  <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col gap-3">
                    <p className="text-[10px] text-[#c5c6cd] italic text-left">
                      Equipped Rod: <span className="text-white font-bold uppercase">{profile.equippedRod.replace(/-/g, ' ')}</span>
                    </p>
                    <button 
                      onClick={handleCastLine}
                      disabled={isCasting}
                      className="w-full active-tap h-12 bg-gradient-to-r from-[#44e2cd] to-[#03c6b2] rounded-xl font-serif text-sm text-[#003731] font-bold shadow-[0_4px_20px_rgba(68,226,205,0.4)] flex items-center justify-center gap-2 select-none justify-center"
                    >
                      {isCasting ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-[#003731] border-t-transparent animate-spin" />
                          <span>Reeling in current...</span>
                        </>
                      ) : (
                        <>
                          <Anchor className="w-4 h-4 ring-1 ring-offset-2 ring-transparent" />
                          <span>Cast Fishing Line (+XP/Gold)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Species in these Waters (Prey/Enemies List) */}
                <div className="glass-card rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Area Species (Prey)</h4>
                      <p className="text-[10px] text-slate-500 font-medium font-sans">Enemies icons in the active currents</p>
                    </div>
                    <span className="text-[10px] uppercase font-mono font-bold text-[#44e2cd] bg-[#44e2cd]/10 px-2 py-0.5 rounded border border-[#44e2cd]/20">
                      {zoneFish.length} Species
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {zoneFish.map((fish) => {
                      const isNextTarget = nextTargetFish?.id === fish.id;
                      return (
                        <div 
                          key={fish.id}
                          className={`p-2 rounded-xl flex items-center gap-2 border transition-all ${
                            isNextTarget 
                              ? 'bg-[#44e2cd]/15 border-[#44e2cd]/40 ring-1 ring-[#44e2cd]/30' 
                              : 'bg-[#151d30]/50 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0 relative">
                            {fish.image ? (
                              <img 
                                src={fish.image} 
                                alt={fish.name} 
                                referrerPolicy="no-referrer"
                                className={`w-full h-full object-cover ${fish.caught ? '' : 'brightness-50 grayscale contrast-125'}`}
                              />
                            ) : (
                              <span className="material-symbols-outlined text-slate-500 text-lg flex items-center justify-center h-full">sailing</span>
                            )}
                            {isNextTarget && (
                              <span className="absolute inset-0 bg-[#44e2cd]/20 flex items-center justify-center">
                                <span className="w-2 h-2 rounded-full bg-[#44e2cd] animate-ping" />
                              </span>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-[11px] font-bold text-white truncate">{fish.name}</p>
                            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                              <span className={fish.caught ? "text-emerald-400" : "text-amber-500/70"}>
                                {fish.caught ? `Caught (${fish.count})` : 'Uncaught'}
                              </span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shortcuts & Action Boards */}
                <div className="grid grid-cols-2 gap-3 pb-4">
                  <button 
                    onClick={() => setIsQuestsOpen(true)}
                    className="h-14 glass-card rounded-xl flex items-center justify-center gap-2 text-white bg-slate-800/25 border border-slate-700/50 hover:border-[#44e2cd]/50 transition-all select-none active-tap text-xs uppercase font-bold tracking-wider"
                  >
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>View Quests</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab('habits')}
                    className="h-14 bg-[#44e2cd]/10 border border-[#44e2cd]/30 text-[#44e2cd] hover:border-[#44e2cd]/50 rounded-xl flex items-center justify-center gap-2 transition-all select-none active-tap text-xs uppercase font-bold tracking-wider"
                  >
                    <CheckSquare className="w-4 h-4 text-[#44e2cd]" />
                    <span>Daily Habits</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* 2. HABITS LIST VIEW */}
            {activeTab === 'habits' && (
              <motion.div 
                key="habits_view" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="mt-2 flex justify-between items-center">
                  <div>
                    <h2 className="font-serif text-2xl text-white font-bold">Daily Habits</h2>
                    <p className="text-[10px] text-[#c5c6cd] uppercase tracking-wider mt-0.5">Strengthen stats through consistency</p>
                  </div>
                  <span className="text-xs bg-[#44e2cd]/15 border border-[#44e2cd]/20 px-3 py-1 text-[#44e2cd] font-semibold rounded-full">
                    {habits.filter(h => h.completed).length}/{habits.length} Complete
                  </span>
                </div>

                {/* Dynamic Synergies Status Indicators */}
                {['Health', 'Mind', 'Knowledge', 'Technique'].map((cat) => {
                  const catHabits = habits.filter(h => h.category === cat);
                  const allCatCompleted = catHabits.length > 0 && catHabits.every(h => h.completed);

                  return (
                    <div key={cat} className="glass-card rounded-2xl p-4 relative overflow-hidden">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-[#44e2cd] w-5 h-5 flex items-center justify-center">
                          {cat === 'Health' ? 'water_drop' : cat === 'Mind' ? 'waves' : cat === 'Knowledge' ? 'explore' : 'chips'}
                        </span>
                        <h3 className="font-serif font-bold text-base text-white">{cat}</h3>
                      </div>

                      <div className="space-y-3">
                        {catHabits.map((habit) => (
                          <HabitCard
                            key={habit.id}
                            habit={habit}
                            toggleHabit={toggleHabit}
                            showToast={showToast}
                          />
                        ))}
                      </div>

                      {allCatCompleted && (
                        <div className="mt-3.5 py-1.5 bg-[#f9bd22]/10 border border-[#f9bd22]/20 flex justify-center rounded">
                          <p className="text-[10px] font-bold text-[#f9bd22] tracking-[0.15em] uppercase font-sans">
                            🏆 SYNERGY: PERFECT {cat.toUpperCase()} Active
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* 3. CODEX COMPLETION VIEW */}
            {activeTab === 'codex' && (
              <motion.div 
                key="codex_view" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div className="mt-2">
                  <h2 className="font-serif text-2xl text-white font-bold">The Codex</h2>
                  <p className="text-[10px] text-[#c5c6cd] uppercase tracking-wider mt-0.5">Discover and complete your collection</p>
                </div>

                {/* Progress bar */}
                <div className="glass-card rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#44e2cd] font-sans">
                      COLLECTION PROGRESS
                    </span>
                    <span className="font-serif text-base font-bold text-white">
                      {codex.filter(f => f.caught).length} / {codex.length} SPECIES
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#44e2cd] to-[#f9bd22] h-full transition-all duration-300"
                      style={{ width: `${(codex.filter(f => f.caught).length / codex.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Grid of caught and locked species */}
                <div className="grid grid-cols-2 gap-3">
                  {codex.map((fish) => {
                    const isUnlocked = profile.level >= fish.levelRequired;

                    return (
                      <div 
                        key={fish.id}
                        className={`glass-card rounded-xl p-3 flex flex-col items-center justify-between text-center relative overflow-hidden border min-h-[160px] ${
                          fish.caught 
                            ? 'border-[#44e2cd]/30 bg-[#121a2e]/60' 
                            : 'border-[#2e3545]/40 opacity-75 grayscale bg-[#0a0f1d]/80'
                        }`}
                      >
                        {fish.caught ? (
                          <>
                            <div className="w-full h-20 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center relative shadow-inner">
                              <img className="w-full h-full object-cover" src={fish.image} alt={fish.name} />
                              <span className="absolute top-1 right-1 text-[8px] bg-[#44e2cd]/20 border border-[#44e2cd]/30 text-white font-bold px-1.5 rounded uppercase">
                                LV. {fish.levelRequired}
                              </span>
                            </div>
                            <div className="mt-2">
                              <span className={`text-[8px] font-bold uppercase tracking-wider bg-slate-800 px-1.5 py-0.5 rounded ${
                                fish.rarity === 'Legendary' ? 'text-amber-500' : 
                                fish.rarity === 'Epic' ? 'text-fuchsia-400' : 'text-[#44e2cd]'
                              }`}>
                                {fish.rarity}
                              </span>
                              <h4 className="font-serif text-xs font-bold text-white mt-1">{fish.name}</h4>
                              <p className="text-[9px] text-[#c5c6cd] mt-0.5">{fish.count} Caught</p>
                            </div>
                          </>
                        ) : (
                          <div className="flex-1 flex flex-[#c5c6cd] flex-col items-center justify-center py-6">
                            <Lock className="w-8 h-8 text-slate-600 mb-2" />
                            <h4 className="font-serif text-xs font-bold text-slate-500">???</h4>
                            <p className="text-[8.5px] text-amber-500/80 font-bold mt-1 uppercase tracking-wider">
                              {isUnlocked ? `Catch inside ${fish.zone}` : `Unlock at LV. ${fish.levelRequired}`}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 4. MAP ZONES TRAIL VIEW */}
            {activeTab === 'map' && (
              <motion.div 
                key="map_view" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 relative"
              >
                <div className="mt-2 relative z-10">
                  <h2 className="font-serif text-2xl text-white font-bold">The World Map</h2>
                  <p className="text-[10px] text-[#c5c6cd] uppercase tracking-wider mt-0.5">Traverse zones to uncover mystical caches</p>
                </div>

                {/* Animated connectors */}
                <div className="absolute top-16 left-1/2 -translate-x-1/2 w-1.5 h-[90%] water-trail opacity-35" />

                <div className="space-y-4 relative z-10">
                  {zones.map((zone) => {
                    const isLocked = zone.status === 'LOCKED' || zone.status === 'MYSTERIOUS';
                    const glowClass = zone.glowType === 'calm' ? 'zone-glow-calm' : 
                                      zone.glowType === 'river' ? 'zone-glow-river' : 
                                      zone.glowType === 'mirror' ? 'zone-glow-mirror' : '';

                    return (
                      <div 
                        key={zone.id}
                        onClick={() => !isLocked && travelToZone(zone.id)}
                        className={`glass-card rounded-2xl p-4 flex items-center gap-4 transition-all duration-150 border select-none min-h-[105px] ${
                          isLocked 
                            ? 'bg-[#0a0e1c]/70 border-[#2e3545]/30 opacity-70 cursor-not-allowed' 
                            : zone.status === 'CURRENTLY HERE'
                              ? 'border-2 border-[#44e2cd] bg-[#121c2e] shadow-[0_0_15px_rgba(68,226,205,0.25)] ring-1 ring-[#44e2cd]/30 cursor-pointer active-tap'
                              : 'cursor-pointer active-tap hover:border-slate-700 hover:shadow-lg'
                        } ${glowClass}`}
                      >
                        {isLocked ? (
                          <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                            {zone.status === 'MYSTERIOUS' ? <Skull className="w-6 h-6 text-[#ff4a4a]/40" /> : <Lock className="w-6 h-6 text-slate-600" />}
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-800 flex-shrink-0 relative bg-slate-900 flex items-center justify-center">
                            <img className="w-full h-full object-cover" src={zone.image} alt={zone.name} />
                            {zone.status === 'CURRENTLY HERE' && (
                              <div className="absolute inset-0 bg-[#44e2cd]/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[#44e2cd] text-3xl animate-pulse">location_on</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-serif text-base font-bold text-white">{zone.name}</h3>
                            <span className="text-[8.5px] uppercase font-bold font-sans bg-[#232a3a] px-2 py-0.5 rounded text-slate-300 border border-slate-700">
                              LV. {zone.minLevel}-{zone.maxLevel}
                            </span>
                          </div>

                          <p className="text-[10px] text-[#c5c6cd] mt-1 leading-normal line-clamp-2">
                            {zone.description}
                          </p>

                          {!isLocked && (
                            <div className="mt-2.5 flex justify-between items-center bg-slate-950/40 px-2 py-1 rounded">
                              <span className="text-[9px] uppercase font-bold text-[#44e2cd]">
                                {zone.status}
                              </span>
                              <span className="text-[9px] text-white">
                                {zone.caughtSpecies} / {zone.totalSpecies} SPECIES
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 5. SHOP VIEW */}
            {activeTab === 'shop' && (
              <motion.div 
                key="shop_view" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div className="mt-2 flex justify-between items-end">
                  <div>
                    <h2 className="font-serif text-2xl text-white font-bold">The Arsenal Shop</h2>
                    <p className="text-[10px] text-[#c5c6cd] uppercase tracking-wider mt-0.5">Secure advanced tackle to optimize yields</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                    <Coins className="w-3.5 h-3.5 text-[#f9bd22]" />
                    <span>Balance: {profile.gold}</span>
                  </div>
                </div>

                {/* Categories Tab selector */}
                <div className="flex justify-between items-center bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
                  {['RODS', 'BAIT', 'GEAR', 'ACCESSORIES', 'BOAT'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveShopCategory(cat as ShopCategory)}
                      className={`flex-1 active-tap h-8 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all select-none ${
                        activeShopCategory === cat 
                          ? 'bg-[#44e2cd] text-[#003731] shadow' 
                          : 'text-[#c5c6cd] hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* List of category items */}
                <div className="space-y-4">
                  {shop.filter(i => i.category === activeShopCategory).map((item) => {
                    const isPurchased = profile.purchasedRods.includes(item.id);

                    return (
                      <div 
                        key={item.id}
                        className="glass-card rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden"
                      >
                        <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover animate-fade-in"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-[#44e2cd] text-3xl">
                              {activeShopCategory === 'RODS' ? 'phishing' : 
                               activeShopCategory === 'BAIT' ? 'opacity' : 
                               activeShopCategory === 'GEAR' ? 'build' : 
                               activeShopCategory === 'ACCESSORIES' ? 'radar' : 'sailing'}
                            </span>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-serif text-sm font-bold text-white">{item.name}</h3>
                              <span className={`text-[8px] font-bold uppercase tracking-widest ${
                                item.rarity === 'Legendary' ? 'text-amber-500' : 'text-[#44e2cd]'
                              }`}>
                                {item.rarity}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 bg-[#0a192f] border border-[#f9bd22]/20 px-2.5 py-1 rounded">
                              <Coins className="w-3 text-[#f9bd22]" />
                              <span className="font-serif text-[10px] font-bold text-[#f9bd22]">
                                {item.price}g
                              </span>
                            </div>
                          </div>

                          <p className="text-[10px] text-[#c5c6cd] mt-2 mb-3 leading-normal">
                            {item.description}
                          </p>

                          <div className="flex justify-between items-center pt-2.5 border-t border-slate-950">
                            <span className="text-[9px] uppercase font-bold text-amber-500 tracking-wider">
                              {item.statModifier}
                            </span>

                            {isPurchased ? (
                              <span className="bg-[#44e2cd]/10 border border-[#44e2cd]/30 text-[#44e2cd] text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider scale-95">
                                Secured
                              </span>
                            ) : (
                              <button 
                                onClick={() => buyItem(item.id)}
                                className="px-4 py-1.5 active-tap bg-[#44e2cd] hover:bg-[#32c2af] text-[#003731] text-[10px] font-bold rounded-lg uppercase tracking-wider"
                              >
                                Buy Item
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* Quest/Stats modal panel */}
        <AnimatePresence>
          {isQuestsOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#070e1d]/90 backdrop-blur-md z-50 flex flex-col justify-end"
            >
              <div className="bg-[#0c1322] border-t-2 border-[#44e2cd]/20 rounded-t-[28px] p-6 max-h-[80%] overflow-y-auto space-y-6">
                
                <div className="flex justify-between items-center border-b border-slate-950 pb-3">
                  <h3 className="font-serif text-xl font-bold text-white">Adventure Log & Milestones</h3>
                  <button 
                    onClick={() => setIsQuestsOpen(false)}
                    className="w-8 h-8 rounded-full bg-[#1b253b] flex items-center justify-center text-[#c5c6cd] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Adventure logs chronological */}
                <div className="space-y-4">
                  {logs.length === 0 ? (
                    <div className="text-center py-10 opacity-60">
                      <p className="text-sm">Your log book is clean. Complete habits or catch fish to fill your journey logs!</p>
                    </div>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className="glass-card rounded-xl p-3 flex gap-3">
                        <span className="material-symbols-outlined text-[#44e2cd] flex-shrink-0">
                          {log.type === 'habit' ? 'checklist' : log.type === 'catch' ? 'phishing' : log.type === 'purchase' ? 'payments' : 'explore'}
                        </span>
                        <div>
                          <p className="text-xs text-white leading-normal">{log.message}</p>
                          <span className="text-[8px] font-mono text-[#c5c6cd] block mt-1">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Glassmorphic Toast Notification Overlay */}
        <div className="absolute top-20 left-4 right-4 z-50 pointer-events-none flex flex-col gap-2">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="pointer-events-auto w-full glass-card bg-[#121a2e]/95 backdrop-blur-xl border border-[#44e2cd]/50 shadow-[0_10px_35px_rgba(0,0,0,0.5)] p-4 rounded-xl flex items-center justify-between gap-3 relative overflow-hidden"
              >
                {/* Visual side glow marker representation */}
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#44e2cd] shadow-[0_0_8px_#44e2cd]" />
                
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#44e2cd]">
                    {toast.icon || (toast.type === 'success' ? 'check_circle' : toast.type === 'loot' ? 'star_half' : 'info')}
                  </span>
                  <p className="text-xs text-white font-medium pr-2">
                    {toast.message}
                  </p>
                </div>

                <button 
                  onClick={() => removeToast(toast.id)} 
                  className="text-slate-500 hover:text-[#44e2cd] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Tactile Application Navigation Bottom Menu Bar (pinned at bottom with Safe Area protection) */}
        <nav className="absolute bottom-0 left-0 right-0 h-22 bg-[#0c1322]/95 backdrop-blur-2xl border-t border-[#44e2cd]/15 flex justify-around items-stretch select-none pb-4 z-40">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex-1 flex flex-col items-center justify-center transition-all ${
              activeTab === 'home' ? 'text-[#44e2cd] bg-[#44e2cd]/5 border-t-2 border-[#44e2cd]' : 'text-[#c5c6cd] hover:text-[#44e2cd]/80'
            }`}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <span className="material-symbols-outlined text-2xl">home</span>
            <span className="text-[9px] uppercase font-bold tracking-wider mt-1">Home</span>
          </button>

          <button 
            onClick={() => setActiveTab('habits')}
            className={`flex-1 flex flex-col items-center justify-center transition-all ${
              activeTab === 'habits' ? 'text-[#44e2cd] bg-[#44e2cd]/5 border-t-2 border-[#44e2cd]' : 'text-[#c5c6cd] hover:text-[#44e2cd]/80'
            }`}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <span className="material-symbols-outlined text-2xl">checklist</span>
            <span className="text-[9px] uppercase font-bold tracking-wider mt-1">Habits</span>
          </button>

          <button 
            onClick={() => setActiveTab('codex')}
            className={`flex-1 flex flex-col items-center justify-center transition-all ${
              activeTab === 'codex' ? 'text-[#44e2cd] bg-[#44e2cd]/5 border-t-2 border-[#44e2cd]' : 'text-[#c5c6cd] hover:text-[#44e2cd]/80'
            }`}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <span className="material-symbols-outlined text-2xl">menu_book</span>
            <span className="text-[9px] uppercase font-bold tracking-wider mt-1">Codex</span>
          </button>

          <button 
            onClick={() => setActiveTab('map')}
            className={`flex-1 flex flex-col items-center justify-center transition-all ${
              activeTab === 'map' ? 'text-[#44e2cd] bg-[#44e2cd]/5 border-t-2 border-[#44e2cd]' : 'text-[#c5c6cd] hover:text-[#44e2cd]/80'
            }`}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <span className="material-symbols-outlined text-2xl">explore</span>
            <span className="text-[9px] uppercase font-bold tracking-wider mt-1">Map</span>
          </button>

          <button 
            onClick={() => setActiveTab('shop')}
            className={`flex-1 flex flex-col items-center justify-center transition-all ${
              activeTab === 'shop' ? 'text-[#44e2cd] bg-[#44e2cd]/5 border-t-2 border-[#44e2cd]' : 'text-[#c5c6cd] hover:text-[#44e2cd]/80'
            }`}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
            <span className="text-[9px] uppercase font-bold tracking-wider mt-1">Shop</span>
          </button>
        </nav>

      </div>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <MainApp />
    </GameProvider>
  );
}
