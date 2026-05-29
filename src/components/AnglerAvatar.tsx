import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Award, Lock, HelpCircle } from 'lucide-react';
import { PlayerProfile } from '../types';

interface AnglerAvatarProps {
  profile: PlayerProfile;
}

export interface AvatarStage {
  rank: string;
  title: string;
  minLevel: number;
  description: string;
  traits: string[];
  imagePath: string;
}

export const AVATAR_STAGES: AvatarStage[] = [
  {
    rank: 'CHILD',
    title: 'Novice Kitten Angler',
    minLevel: 1,
    description: 'Just dipping your paws in tracking basics. Features a ridiculously oversized bucket hat, a wide-eyed curious expression, and a small training rod.',
    traits: ['Oversized Hat', 'Curious Expression', 'Small Rod'],
    imagePath: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780015697/screen_ojoryn.png'
  },
  {
    rank: 'TEEN',
    title: 'Adolescent Swift Angler',
    minLevel: 11,
    description: 'Developing reflexes to battle heavy river currents. Features a lanky teenage build, a slightly awkward determined pose, and scuffed beginner gear.',
    traits: ['Lanky Build', 'Awkward Pose', 'Scuffed Gear'],
    imagePath: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780015703/screen_lw6moi.png'
  },
  {
    rank: 'ADULT',
    title: 'Rugged Coastal Angler',
    minLevel: 26,
    description: 'Unlocking mirror lakes and ocean shallows with steady focus. Features a full rugged build, grizzled orange fur, weathered gear, and a sharp gaze.',
    traits: ['Rugged Build', 'Grizzled Fur', 'Weathered Gear'],
    imagePath: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780015693/screen_idcd8a.png'
  },
  {
    rank: 'MASTER',
    title: 'Abyssal Grandmaster Cat',
    minLevel: 41,
    description: 'The supreme angler lord who commands the terrifying depths. Majestic posture seated on a heavy wooden crate, surrounded by multiple baskets brimming with fish catches, holding a massive professional deep-sea rod.',
    traits: ['Grizzled Legend', 'Titan Build', 'Bountiful Catches', 'Heavy Tackle'],
    imagePath: 'https://res.cloudinary.com/drykhiodx/image/upload/v1780015253/screen_jtmdqs.png'
  }
];

export const AnglerAvatar: React.FC<AnglerAvatarProps> = ({ profile }) => {
  const [showMilestones, setShowMilestones] = useState(false);

  // Dynamic derivation of active avatar stage based on level
  const getCurrentStage = (): AvatarStage => {
    let active = AVATAR_STAGES[0];
    for (const stage of AVATAR_STAGES) {
      if (profile.level >= stage.minLevel) {
        active = stage;
      }
    }
    return active;
  };

  const currentStage = getCurrentStage();

  return (
    <div className="glass-card bg-gradient-to-b from-[#151c2d]/90 to-[#0e1422]/95 border border-[#44e2cd]/20 rounded-2xl p-4 shadow-xl relative overflow-hidden text-left">
      {/* Bioluminous background detail */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-[#44e2cd]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex gap-4 items-center">
        {/* Rounded interactive Avatar image frame */}
        <div className="relative w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0 overflow-hidden group shadow-md">
          <img 
            src={currentStage.imagePath} 
            alt={currentStage.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Rank Badge overlay */}
          <span className="absolute bottom-1 right-1 bg-slate-900/95 border border-amber-500/40 text-[#f9bd22] text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase leading-none scale-90">
            {currentStage.rank}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest leading-none">
              Level Milestone Growth
            </span>
            <button
              onClick={() => setShowMilestones(!showMilestones)}
              className="text-[10px] text-[#44e2cd] hover:underline font-bold flex items-center gap-1 leading-none cursor-pointer"
            >
              <HelpCircle className="w-3 h-3" />
              {showMilestones ? 'Hide Ranks' : 'View Ranks'}
            </button>
          </div>

          <h3 className="font-serif text-lg font-bold text-white mt-1.5 truncate flex items-center gap-1.5 leading-none">
            {currentStage.title}
            <Sparkles className="w-3.5 h-3.5 text-[#44e2cd] animate-pulse" />
          </h3>

          <p className="text-[11px] text-[#c5c6cd] mt-2 line-clamp-2 leading-relaxed">
            {currentStage.description}
          </p>
        </div>
      </div>

      {/* Trait Tags Row */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-800/80">
        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wide">Active Traits:</span>
        {currentStage.traits.map((trait, idx) => (
          <span 
            key={idx}
            className="text-[9px] font-semibold text-slate-300 bg-slate-850 border border-slate-750/75 px-2 py-0.5 rounded-full"
          >
            🐾 {trait}
          </span>
        ))}
      </div>

      {/* Expandable Growth Stages / Milestones List */}
      <AnimatePresence>
        {showMilestones && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 pt-3 border-t border-slate-800 space-y-2.5 overflow-hidden"
          >
            <p className="text-[10px] text-[#44e2cd] uppercase font-bold tracking-wider font-mono">
              📈 Journey Milestones progression
            </p>

            <div className="grid grid-cols-1 gap-2">
              {AVATAR_STAGES.map((stage) => {
                const isCurrent = currentStage.rank === stage.rank;
                const isUnlocked = profile.level >= stage.minLevel;

                return (
                  <div 
                    key={stage.rank}
                    className={`p-2.5 rounded-xl border flex gap-3 transition-colors ${
                      isCurrent 
                        ? 'bg-[#44e2cd]/10 border-[#44e2cd]/40 ring-1 ring-[#44e2cd]/20' 
                        : isUnlocked 
                          ? 'bg-[#151d30]/30 border-slate-800' 
                          : 'bg-slate-950/30 border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-950 border border-slate-850 flex-shrink-0 relative">
                      <img 
                        src={stage.imagePath} 
                        alt={stage.rank}
                        className={`w-full h-full object-cover ${isUnlocked ? '' : 'brightness-50 grayscale contrast-125 blur-[1px]'}`}
                      />
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                          <Lock className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex justify-between items-baseline">
                        <p className="text-xs font-bold text-white truncate">{stage.title}</p>
                        <span className="text-[8px] font-mono text-[#f9bd22] font-bold">
                          LVL {stage.minLevel}+
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 leading-normal">
                        {stage.traits.join(' • ')}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1">
                        {isCurrent ? (
                          <span className="text-[8px] uppercase font-bold text-[#44e2cd] flex items-center gap-0.5 leading-none bg-[#44e2cd]/10 px-1.5 py-0.5 rounded">
                            <Award className="w-2.5 h-2.5" /> Active Stage
                          </span>
                        ) : isUnlocked ? (
                          <span className="text-[8px] uppercase font-bold text-emerald-400 flex items-center gap-0.5 leading-none bg-emerald-500/10 px-1.5 py-0.5 rouded">
                            <Trophy className="w-2.5 h-2.5" /> Unlocked
                          </span>
                        ) : (
                          <span className="text-[8px] uppercase font-bold text-slate-500 flex items-center gap-0.5 leading-none bg-slate-900 px-1.5 py-0.5 rounded">
                            Locked (Requires Lvl {stage.minLevel})
                          </span>
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
    </div>
  );
};
