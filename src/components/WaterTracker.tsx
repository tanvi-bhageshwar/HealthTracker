import { Droplet, GlassWater, Plus, History } from 'lucide-react';
import { WaterLog, UserProfile } from '../types';

interface WaterTrackerProps {
  waterLogs: WaterLog[];
  profile: UserProfile;
  onAddWater: (amount: number) => void;
}

export default function WaterTracker({ waterLogs, profile, onAddWater }: WaterTrackerProps) {
  // Filter logs for today
  const todayStr = new Date().toDateString();
  const todayLogs = waterLogs.filter(w => new Date(w.timestamp).toDateString() === todayStr);
  const totalWaterToday = todayLogs.reduce((sum, w) => sum + w.amount, 0);
  const waterPercent = Math.min(100, Math.round((totalWaterToday / profile.dailyWaterGoal) * 100));

  // Determine glass fill animation heights
  const glassHeightPercent = `${waterPercent}%`;

  return (
    <div id="water-tracker-view" className="space-y-6 animate-fade-in">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center md:justify-start gap-2">
          <Droplet className="text-cyan-500 w-6 h-6 animate-pulse" />
          Hydration & Water Monitor
        </h2>
        <p className="text-sm text-slate-400 mt-1">Sustain standard fluid levels. Log intakes and complete your daily water targets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Glass Visualizer */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center space-y-6 text-center">
          <h3 className="font-display font-bold text-slate-700 dark:text-slate-300">Hydration Progress</h3>
          
          {/* Custom Animated Liquid Glass */}
          <div className="relative w-36 h-56 border-4 border-slate-300 dark:border-slate-700 rounded-b-3xl rounded-t-lg overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col justify-end shadow-inner">
            {/* Liquid level */}
            <div 
              className="w-full bg-gradient-to-t from-cyan-600 via-cyan-400 to-sky-300 transition-all duration-700 relative ease-out"
              style={{ height: glassHeightPercent }}
            >
              {/* Waves representation */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-sky-200/40 animate-pulse"></div>
            </div>

            {/* Float percentage display */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-3xl font-display font-extrabold text-slate-800 dark:text-white drop-shadow-[0_2px_4px_rgba(255,255,255,0.7)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {waterPercent}%
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">
              {(totalWaterToday / 1000).toFixed(2)} L <span className="text-xs text-slate-400">/ {(profile.dailyWaterGoal / 1000).toFixed(1)} L Goal</span>
            </p>
            <p className="text-xs text-slate-400">
              {totalWaterToday >= profile.dailyWaterGoal 
                ? "🎉 Target reached! You're perfectly hydrated." 
                : `Aim for ${((profile.dailyWaterGoal - totalWaterToday) / 1000).toFixed(2)} Liters more today.`}
            </p>
          </div>
        </div>

        {/* Middle Column: Log Addition Tools */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-1.5">
              <GlassWater className="w-5 h-5 text-cyan-500" />
              Water Intake Log
            </h3>
            <p className="text-xs text-slate-400">Select an amount to append to your record. Try standard glasses or containers.</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onAddWater(250)}
              className="w-full p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 hover:bg-cyan-50/40 hover:border-cyan-400 dark:bg-slate-950 dark:hover:bg-cyan-950/20 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="text-left">
                <span className="block font-bold text-slate-700 dark:text-slate-200">Standard Cup</span>
                <span className="text-xs text-slate-400">Regular tea or water glass</span>
              </div>
              <span className="px-3 py-1.5 bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 rounded-lg text-sm font-bold group-hover:scale-105 transition-transform">
                +250 ml
              </span>
            </button>

            <button
              onClick={() => onAddWater(500)}
              className="w-full p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 hover:bg-cyan-50/40 hover:border-cyan-400 dark:bg-slate-950 dark:hover:bg-cyan-950/20 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="text-left">
                <span className="block font-bold text-slate-700 dark:text-slate-200">Sports Bottle</span>
                <span className="text-xs text-slate-400">Medium active hydration</span>
              </div>
              <span className="px-3 py-1.5 bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 rounded-lg text-sm font-bold group-hover:scale-105 transition-transform">
                +500 ml
              </span>
            </button>

            <button
              onClick={() => onAddWater(750)}
              className="w-full p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 hover:bg-cyan-50/40 hover:border-cyan-400 dark:bg-slate-950 dark:hover:bg-cyan-950/20 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="text-left">
                <span className="block font-bold text-slate-700 dark:text-slate-200">Large Flask</span>
                <span className="text-xs text-slate-400">Workdesk thermos flask</span>
              </div>
              <span className="px-3 py-1.5 bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 rounded-lg text-sm font-bold group-hover:scale-105 transition-transform">
                +750 ml
              </span>
            </button>

            <button
              onClick={() => onAddWater(1000)}
              className="w-full p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 hover:bg-cyan-50/40 hover:border-cyan-400 dark:bg-slate-950 dark:hover:bg-cyan-950/20 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="text-left">
                <span className="block font-bold text-slate-700 dark:text-slate-200">1.0 Liter Growler</span>
                <span className="text-xs text-slate-400">Whole table pitcher bottle</span>
              </div>
              <span className="px-3 py-1.5 bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 rounded-lg text-sm font-bold group-hover:scale-105 transition-transform">
                +1000 ml
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: History table */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <History className="w-5 h-5 text-cyan-500" />
              <h3 className="font-display font-bold text-slate-800 dark:text-slate-100">Intake Log Ledger</h3>
            </div>

            {todayLogs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xs text-slate-400">No fluid logs reported for today yet. Drink up!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[300px] overflow-y-auto pr-1">
                {todayLogs.map((log) => (
                  <div key={log.id} className="py-2.5 flex justify-between items-center text-sm">
                    <span className="text-slate-400 text-xs">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      +{log.amount} ml
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between text-sm">
            <span className="text-slate-500">Accumulated</span>
            <span className="font-display font-bold text-cyan-600 dark:text-cyan-400">{totalWaterToday} ml</span>
          </div>
        </div>
      </div>
    </div>
  );
}
