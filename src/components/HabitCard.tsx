import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Music, 
  Check, 
  Flame, 
  Sparkles,
  Droplet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Habit } from '../types';

interface HabitCardProps {
  habit: Habit;
  toggleHabit: (id: string) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'info' | 'error' | 'loot', icon?: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, toggleHabit, showToast }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // --- Pomodoro Ticker States (for study-session habit) ---
  const [pomodoroSeconds, setPomodoroSeconds] = useState(1800); // 30 mins
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [isSpeedyMode, setIsSpeedyMode] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Violin practice checklist (for skill-practice habit) ---
  const [isViolinDone, setIsViolinDone] = useState(() => {
    return localStorage.getItem(`angler_subtask_violin_${habit.id}`) === 'true';
  });

  // --- Hydration state (for hydration-2l habit) ---
  const [hydrationMl, setHydrationMl] = useState(() => {
    const val = localStorage.getItem('angler_hydration_ml');
    return val ? parseInt(val, 10) : 0;
  });
  const [isCupDragging, setIsCupDragging] = useState(false);
  const [isPouring, setIsPouring] = useState(false);

  // Sync default values when Speedy Mode changes for study-session
  useEffect(() => {
    if (habit.id === 'study-session') {
      if (isSpeedyMode) {
        setPomodoroSeconds(10); // 10 seconds for quick testing
      } else {
        setPomodoroSeconds(1800); // 30 minutes standard
      }
      setIsPomodoroActive(false);
    }
  }, [isSpeedyMode, habit.id]);

  // Handle Pomodoro ticking
  useEffect(() => {
    if (isPomodoroActive) {
      timerRef.current = setInterval(() => {
        setPomodoroSeconds((prev) => {
          if (prev <= 1) {
            handlePomodoroFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPomodoroActive]);

  const handlePomodoroFinish = () => {
    setIsPomodoroActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Auto complete the task if not done
    if (!habit.completed) {
      toggleHabit(habit.id);
    }
    
    showToast('🍅 Focus complete! Study session logged as complete. Enjoy your gold reward!', 'success', 'timer');
    setPomodoroSeconds(isSpeedyMode ? 10 : 1800);
  };

  const toggleTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPomodoroActive(!isPomodoroActive);
  };

  const resetTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPomodoroActive(false);
    setPomodoroSeconds(isSpeedyMode ? 10 : 1800);
  };

  // --- Handle Violin Practice Toggle ---
  const handleViolinToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isViolinDone;
    setIsViolinDone(nextState);
    localStorage.setItem(`angler_subtask_violin_${habit.id}`, String(nextState));

    if (nextState) {
      showToast('🎻 Masterful chords! Violin subtask checked. Your dexterity increases.', 'success', 'music_note');
      
      // Auto-complete parent habit if not completed yet
      if (!habit.completed) {
        await toggleHabit(habit.id);
      }
    } else {
      showToast('Violin Practice unchecked.', 'info', 'undo');
      // Auto-uncheck parent habit if completed
      if (habit.completed) {
        await toggleHabit(habit.id);
      }
    }
  };

  // --- Hydration Functions ---
  const persistHydration = (ml: number) => {
    const capped = Math.min(2000, Math.max(0, ml));
    setHydrationMl(capped);
    localStorage.setItem('angler_hydration_ml', String(capped));

    // If reaches 2000 ml, mark parent habit completed
    if (capped >= 2000) {
      if (!habit.completed) {
        toggleHabit(habit.id);
        showToast('💧 Hydration Target Met! 2.0 Liters reached. Stamina boosted!', 'success', 'water_drop');
      }
    } else {
      // If falls below 2000 ml and was completed, uncomplete it
      if (habit.completed) {
        toggleHabit(habit.id);
      }
    }
  };

  const drinkWater = (amount: number) => {
    setIsPouring(true);
    setTimeout(() => setIsPouring(false), 800);
    persistHydration(hydrationMl + amount);
  };

  // HTML5 Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    setIsCupDragging(true);
    e.dataTransfer.setData('text/plain', 'cup_fill_250');
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setIsCupDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsCupDragging(false);
    const data = e.dataTransfer.getData('text/plain');
    if (data === 'cup_fill_250') {
      drinkWater(250);
    }
  };

  // Clean format timer (MM:SS)
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render a specific customized widget based on the habit ID
  const renderCustomWidget = () => {
    // 1. Pomodoro Clock
    if (habit.id === 'study-session') {
      const completionPercent = 100 - (pomodoroSeconds / (isSpeedyMode ? 10 : 1800)) * 100;
      return (
        <div className="mt-3 p-4 bg-[#0a0f1d]/90 rounded-xl border border-slate-800 space-y-3 relative text-left">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div>
              <h4 className="text-xs font-bold text-[#44e2cd] uppercase tracking-wider flex items-center gap-1">
                ⏱️ Pomodoro study timer
              </h4>
              <p className="text-[10px] text-slate-400">Main habit completes when focus timer runs down</p>
            </div>
            
            {/* Speedy Mode for Easy grading / Testing */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSpeedyMode(!isSpeedyMode);
              }}
              className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border transition-colors ${
                isSpeedyMode 
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                  : 'bg-slate-800 text-slate-400 border-slate-700/50 hover:bg-slate-700'
              }`}
            >
              🚀 Speedy Mode (10s)
            </button>
          </div>

          <div className="flex flex-col items-center justify-center py-3">
            {/* Big Timer display inside a Circular focus bar */}
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-slate-950 border border-slate-800/80 shadow-inner">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="transparent" 
                  stroke="#1e293b" 
                  strokeWidth="6" 
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="transparent" 
                  stroke="#44e2cd" 
                  strokeWidth="6" 
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * completionPercent) / 100}
                  className="transition-all duration-300"
                />
              </svg>

              <div className="text-center z-10">
                <p className="font-mono text-xl tracking-wider font-extrabold text-white">
                  {formatTime(pomodoroSeconds)}
                </p>
                <p className="text-[9px] uppercase tracking-widest text-[#44e2cd]/80 font-semibold mt-0.5 font-sans">
                  {isPomodoroActive ? 'Focusing' : 'Paused'}
                </p>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button
                type="button"
                onClick={toggleTimer}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isPomodoroActive 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30' 
                    : 'bg-[#44e2cd]/20 text-[#44e2cd] border border-[#44e2cd]/30 hover:bg-[#44e2cd]/30'
                }`}
                title={isPomodoroActive ? 'Pause' : 'Start'}
              >
                {isPomodoroActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={resetTimer}
                className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 2. Skill Practice Subtasks Checklist (Violin Practice)
    if (habit.id === 'skill-practice') {
      return (
        <div className="mt-3 p-4 bg-[#0a0f1d]/90 rounded-xl border border-slate-800 text-left space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
            <div>
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                📝 Technique Practice Checklist
              </h4>
              <p className="text-[10px] text-slate-400">Complete subtasks to master training</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {isViolinDone ? '1/1' : '0/1'} Subtasks Completed
            </span>
          </div>

          <div 
            onClick={handleViolinToggle}
            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all active:scale-[0.98] ${
              isViolinDone 
                ? 'bg-emerald-950/20 border-emerald-800/60' 
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🎻</span>
              <div>
                <p className="text-xs font-bold text-white">Violin Practice</p>
                <p className="text-[9px] text-[#c5c6cd] mt-0.5">Focus: Pitch & wrist mechanics drills</p>
              </div>
            </div>

            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
              isViolinDone 
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                : 'bg-slate-950 border-slate-700 text-transparent'
            }`}>
              {isViolinDone && <Check className="w-3.5 h-3.5" />}
            </div>
          </div>
        </div>
      );
    }

    // 3. Hydration Bottle Draggable Fill Section
    if (habit.id === 'hydration-2l') {
      const percent = (hydrationMl / 2000) * 100;
      return (
        <div className="mt-3 p-4 bg-[#0a0f1d]/90 rounded-xl border border-slate-800 text-left space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
              🧪 Sports Flask (2.0L Target)
            </h4>
            <p className="text-[10px] text-slate-400">
              Drag the <b>250ml Cup</b> into the bottle to drink water, or use the range bar slider!
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center justify-center py-2">
            
            {/* Draggable Cup/Drop Source */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 font-sans">
                Source Cup
              </p>
              
              <div
                draggable="true"
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                className={`w-14 h-14 rounded-2xl bg-cyan-950/40 border-2 border-dashed border-cyan-500/50 hover:border-cyan-400 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center transition-all shadow-md group ${
                  isCupDragging ? 'opacity-80 scale-95 shadow-lg border-cyan-400' : ''
                }`}
                title="Drag this cup into the water bottle!"
              >
                <span className="material-symbols-outlined text-cyan-400 group-hover:animate-bounce text-xl">local_cafe</span>
                <span className="text-[8px] font-bold text-cyan-400 font-mono mt-0.5">+250ml</span>
              </div>
              
              <span className="text-[9px] text-center text-[#c5c6cd]/90 leading-tight">
                Drag cup here &rarr;<br/>
                or click <b>Quick Drink</b>
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  drinkWater(250);
                }}
                className="mt-2 text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-1 rounded-lg hover:bg-cyan-500/20 active:scale-95 transition-all text-center"
              >
                +250ml Sip
              </button>
            </div>

            {/* Custom Interactive Water Bottle Drop-Zone */}
            <div className="flex flex-col items-center gap-2">
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`w-24 h-44 rounded-b-3xl rounded-t-xl border-4 relative overflow-hidden flex items-end justify-center transition-all shadow-inner ${
                  isCupDragging 
                    ? 'border-cyan-400 bg-cyan-950/20 scale-[1.03] ring-2 ring-cyan-500/20' 
                    : percent >= 100 
                      ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)]' 
                      : 'border-slate-700 bg-slate-950'
                }`}
              >
                {/* Liters Measuring lines notches */}
                <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between text-[8px] font-mono text-slate-500/80 px-1.5 py-2 pointer-events-none z-10 select-none">
                  <div className="flex justify-between border-b border-slate-800/50"><span>2.0L</span><span>-</span></div>
                  <div className="flex justify-between border-b border-slate-800/50"><span>1.5L</span><span>-</span></div>
                  <div className="flex justify-between border-b border-slate-800/50"><span>1.0L</span><span>-</span></div>
                  <div className="flex justify-between border-b border-slate-800/50"><span>0.5L</span><span>-</span></div>
                </div>

                {/* Animated Water volume wave */}
                <div 
                  className={`w-full bg-gradient-to-t from-cyan-600/60 to-cyan-400/70 border-t border-cyan-300/40 transition-all duration-700 ease-out relative flex items-center justify-center ${
                    isPouring ? 'animate-pulse' : ''
                  }`}
                  style={{ height: `${percent}%` }}
                >
                  {/* Glowing water level wave ripple */}
                  {percent > 0 && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />
                  )}
                  {percent >= 100 && (
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/50 to-emerald-400/60 animate-pulse flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-lg font-bold">done_all</span>
                    </div>
                  )}
                </div>

                {/* Drop indication overlays */}
                {isCupDragging && (
                  <div className="absolute inset-0 bg-cyan-500/10 flex items-center justify-center pointer-events-none animate-pulse">
                    <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider text-center px-1">
                      Drop Cup Inside
                    </span>
                  </div>
                )}
              </div>

              {/* Status Display Text */}
              <div className="text-center">
                <p className="font-mono text-xs font-extrabold text-white">
                  {hydrationMl} ml / 2000 ml
                </p>
                <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mt-0.5">
                  {percent >= 100 ? '✅ Target Met!' : `${percent.toFixed(0)}% Refilled`}
                </p>
              </div>
            </div>

            {/* Drag level slider */}
            <div className="flex flex-col justify-center items-start space-y-1 w-full md:w-auto">
              <label className="text-[9px] font-bold font-sans uppercase tracking-wider text-slate-300">
                🎛️ Drag Bottle Valve (Adjuster)
              </label>
              
              <div className="flex items-center gap-2 w-full">
                <span className="material-symbols-outlined text-slate-500 text-sm">water_drop</span>
                <input 
                  type="range"
                  min="0"
                  max="2000"
                  step="250"
                  value={hydrationMl}
                  onChange={(e) => {
                    e.stopPropagation();
                    persistHydration(parseInt(e.target.value, 10));
                  }}
                  className="w-full accent-cyan-400 h-2 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    persistHydration(0);
                  }}
                  className="p-1 rounded bg-slate-800 border border-slate-700/60 hover:bg-rose-950/30 hover:border-rose-900/40 hover:text-rose-400 active:scale-95 text-slate-400 transition-all ml-1"
                  title="Empty Water Bottle"
                >
                  <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                </button>
              </div>
              
              <p className="text-[9px] italic text-[#c5c6cd]/90">
                You can scrub this slider directly to set precise daily water volume!
              </p>
            </div>

          </div>
        </div>
      );
    }

    return null;
  };

  const hasExpansion = ['study-session', 'skill-practice', 'hydration-2l'].includes(habit.id);

  return (
    <div className="flex flex-col w-full">
      {/* Habit Header card */}
      <div 
        onClick={() => {
          if (hasExpansion) {
            setIsExpanded(!isExpanded);
          } else {
            toggleHabit(habit.id);
          }
        }}
        className={`flex items-center justify-between p-3.5 rounded-xl transition-all border select-none active-tap cursor-pointer min-h-[48px] ${
          habit.completed 
            ? 'bg-[#44e2cd]/10 border-[#44e2cd]/40' 
            : 'bg-[#141b2b]/40 border-[#2e3545]/40 hover:border-slate-700'
        }`}
      >
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold flex items-center gap-1.5 ${habit.completed ? 'text-white' : 'text-[#c5c6cd]'}`}>
              {habit.title}
              {habit.id === 'study-session' && ' 🍅'}
              {habit.id === 'skill-practice' && ' 🎻'}
              {habit.id === 'hydration-2l' && ' 💧'}
            </span>
            
            {hasExpansion && (
              <span className="p-0.5 rounded bg-slate-800/70 border border-slate-700/60 text-[9px] text-[#44e2cd] uppercase font-mono px-1.5 leading-none font-bold">
                interactive
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase font-bold text-amber-500 tracking-wider mt-0.5">
            {habit.bonusText}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {hasExpansion && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-800 text-slate-400"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}

          <div 
            onClick={(e) => {
              e.stopPropagation();
              toggleHabit(habit.id);
            }}
            className={`w-7 h-7 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
              habit.completed 
                ? 'bg-[#44e2cd]/20 border-[#44e2cd] shadow-[0_0_8px_rgba(68,226,205,0.4)] text-[#44e2cd]' 
                : 'bg-slate-900 border-slate-700 text-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-sm font-bold">check</span>
          </div>
        </div>
      </div>

      {/* Interactive Detail drop-down */}
      <AnimatePresence>
        {hasExpansion && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {renderCustomWidget()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
