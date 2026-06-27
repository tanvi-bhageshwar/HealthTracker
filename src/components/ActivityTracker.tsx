import React, { useState } from 'react';
import { Activity, Plus, Trash2, Dumbbell, Timer, Flame, Calendar } from 'lucide-react';
import { ActivityLog } from '../types';

interface ActivityTrackerProps {
  activities: ActivityLog[];
  onAddActivity: (activity: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  onDeleteActivity: (id: string) => void;
}

export default function ActivityTracker({ activities, onAddActivity, onDeleteActivity }: ActivityTrackerProps) {
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');

  // Handle addition
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity || !duration || !caloriesBurned) return;

    onAddActivity({
      activity,
      duration: Math.max(1, parseInt(duration) || 0),
      caloriesBurned: Math.max(0, parseInt(caloriesBurned) || 0)
    });

    setActivity('');
    setDuration('');
    setCaloriesBurned('');
  };

  // Filter logs for today
  const todayStr = new Date().toDateString();
  const todayActivities = activities.filter(a => new Date(a.timestamp).toDateString() === todayStr);

  const totalWorkouts = todayActivities.length;
  const totalDuration = todayActivities.reduce((sum, a) => sum + a.duration, 0);
  const totalCaloriesBurned = todayActivities.reduce((sum, a) => sum + a.caloriesBurned, 0);

  // Quick activity catalog (highly interactive!)
  const catalog = [
    { name: "Walking (brisk)", duration: 30, calories: 120 },
    { name: "Outdoor Running", duration: 25, calories: 280 },
    { name: "Cycling (tempo)", duration: 30, calories: 240 },
    { name: "Power Yoga Flow", duration: 45, calories: 180 },
    { name: "Gym Strength Training", duration: 40, calories: 210 },
    { name: "Swimming laps", duration: 30, calories: 260 }
  ];

  const handleQuickAdd = (item: typeof catalog[0]) => {
    setActivity(item.name);
    setDuration(item.duration.toString());
    setCaloriesBurned(item.calories.toString());
  };

  return (
    <div id="activity-tracker-view" className="space-y-6 animate-fade-in">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center md:justify-start gap-2">
          <Activity className="text-emerald-500 w-6 h-6 animate-bounce" />
          Fitness & Exercise Logger
        </h2>
        <p className="text-sm text-slate-400 mt-1">Record physical sessions, active durations, and log mechanical energy burns.</p>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm text-center">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-full w-max mx-auto mb-2">
            <Dumbbell className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase">Sessions Completed</p>
          <p className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 mt-1">{totalWorkouts}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm text-center">
          <div className="p-2 bg-cyan-50 dark:bg-cyan-950/30 text-cyan-500 rounded-full w-max mx-auto mb-2">
            <Timer className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase">Active Time</p>
          <p className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 mt-1">{totalDuration} mins</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm text-center">
          <div className="p-2 bg-orange-50 dark:bg-orange-950/30 text-orange-500 rounded-full w-max mx-auto mb-2">
            <Flame className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase">Energy Deficit Burn</p>
          <p className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 mt-1">{totalCaloriesBurned} kcal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Add activity form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 mb-4">Log Physical Session</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Exercise Type</label>
                <input 
                  type="text"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  placeholder="e.g. Morning Jog, Weightlifting"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Duration (Mins)</label>
                  <input 
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 30"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Calories Burned</label>
                  <input 
                    type="number"
                    value={caloriesBurned}
                    onChange={(e) => setCaloriesBurned(e.target.value)}
                    placeholder="e.g. 240"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                    min="0"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/15 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-sm"
              >
                <Plus className="w-5 h-5" />
                Add Active Session
              </button>
            </form>
          </div>

          {/* Quick presets */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
              <span>⚡</span> Standard Dynamic Catalog Presets
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {catalog.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAdd(item)}
                  className="p-3 border border-slate-100 dark:border-slate-800 hover:border-emerald-400 rounded-xl text-left hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10 transition-all group cursor-pointer text-xs"
                >
                  <p className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-emerald-500">{item.name}</p>
                  <p className="text-slate-400 mt-1">{item.duration}m · {item.calories} kcal</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Active history */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                Exercise Log Ledger
              </h3>
              <span className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-semibold">
                {todayActivities.length} logs
              </span>
            </div>

            {todayActivities.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <div className="text-4xl">🏃</div>
                <h4 className="text-slate-700 dark:text-slate-300 font-semibold">No Workouts Recorded</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">Get up and break a sweat! Select a standard preset from the catalog or input customized active logs.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-850 max-h-[420px] overflow-y-auto pr-1">
                {todayActivities.map((a) => (
                  <div key={a.id} className="py-3 flex items-center justify-between group">
                    <div className="space-y-1">
                      <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{a.activity}</p>
                      <p className="text-xs text-slate-400">{a.duration} minutes · {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold text-sm text-emerald-500">-{a.caloriesBurned} kcal</span>
                      <button 
                        onClick={() => onDeleteActivity(a.id)}
                        className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                        title="Delete log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-500 font-sans">Today's Caloric Offset</span>
            <span className="font-display font-bold text-base text-emerald-500">{totalCaloriesBurned} kcal burned</span>
          </div>
        </div>
      </div>
    </div>
  );
}
