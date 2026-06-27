import { useState } from 'react';
import { UtensilsCrossed, Sparkles, Flame, Apple, RefreshCw, Layers } from 'lucide-react';
import { UserProfile, MealPlanDay } from '../types';

interface MealPlannerProps {
  profile: UserProfile;
}

export default function MealPlanner({ profile }: MealPlannerProps) {
  const [dietaryPref, setDietaryPref] = useState<'Balanced' | 'Vegetarian' | 'Vegan' | 'Low Carb' | 'High Protein' | 'Keto'>('Balanced');
  const [calorieTarget, setCalorieTarget] = useState(profile.dailyCalorieGoal.toString());
  const [loading, setLoading] = useState(false);
  const [activePlan, setActivePlan] = useState<{
    breakfast: string;
    lunch: string;
    snack: string;
    dinner: string;
    summary: {
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    }
  }>({
    breakfast: "Oatmeal with sliced strawberries, chia seeds, and dynamic whey protein (approx. 400 kcal)",
    lunch: "Power quinoa plate with grilled chicken, diced avocado, black beans, and vinaigrette (approx. 600 kcal)",
    snack: "1 medium red apple and 2 tablespoons of raw almonds (approx. 180 kcal)",
    dinner: "Seared lemon-herb salmon fillet, roasted sweet potato wedges, and asparagus (approx. 520 kcal)",
    summary: {
      calories: 1700,
      protein: 85,
      carbs: 220,
      fats: 55
    }
  });

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          calories: parseInt(calorieTarget) || profile.dailyCalorieGoal,
          preference: dietaryPref,
          age: profile.age,
          gender: profile.gender,
          height: profile.height,
          weight: profile.weight
        })
      });

      if (!response.ok) {
        throw new Error('Server returned error status');
      }

      const data = await response.json();
      if (data.plan) {
        setActivePlan(data.plan);
      }
    } catch (error) {
      console.error('Failed to generate plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="meal-planner-view" className="space-y-6 animate-fade-in">
      <div className="text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center md:justify-start gap-2">
            <UtensilsCrossed className="text-cyan-500 w-6 h-6" />
            Clinical Meal Planner
          </h2>
          <p className="text-sm text-slate-400 mt-1">Design customizable healthy calorie budgets and diets with AI-powered generator.</p>
        </div>

        <div className="px-3 py-1 bg-cyan-50 dark:bg-cyan-950/45 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max mx-auto md:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
          AI Generation Integration
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Preferences selection */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-500" />
            Plan Objectives
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Dietary Profile</label>
              <select 
                value={dietaryPref}
                onChange={(e) => setDietaryPref(e.target.value as any)}
                className="w-full px-3 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-cyan-500 transition-all text-sm"
              >
                <option value="Balanced">Balanced (Standard Mixed)</option>
                <option value="Vegetarian">Vegetarian (No meat/fish)</option>
                <option value="Vegan">Vegan (Plant-based only)</option>
                <option value="Low Carb">Low Carb (Reduce carbs, high fiber)</option>
                <option value="High Protein">High Protein (Athletic repair)</option>
                <option value="Keto">Keto (High fats, ultra-low carbs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Daily Calorie Target (kcal)</label>
              <input 
                type="number" 
                value={calorieTarget}
                onChange={(e) => setCalorieTarget(e.target.value)}
                placeholder="e.g. 2000" 
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm font-semibold"
                min="1000"
                max="5000"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Your profile recommended baseline goal is {profile.dailyCalorieGoal} kcal.
              </p>
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/15 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  Generate Diet via Gemini
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Active Meal Plan representation */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100">Recommended 1-Day Schedule</h3>
            <span className="text-xs bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 px-3 py-1 rounded-full font-semibold">
              {dietaryPref} · {activePlan.summary.calories} kcal
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Breakfast */}
            <div className="p-4 border border-slate-100 dark:border-slate-800/80 rounded-2xl bg-slate-5/50 dark:bg-slate-950/30 space-y-1 hover:border-cyan-400 transition-all">
              <span className="text-xs text-cyan-500 font-bold uppercase tracking-wider">🌅 Breakfast</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                {activePlan.breakfast}
              </p>
            </div>

            {/* Lunch */}
            <div className="p-4 border border-slate-100 dark:border-slate-800/80 rounded-2xl bg-slate-5/50 dark:bg-slate-950/30 space-y-1 hover:border-cyan-400 transition-all">
              <span className="text-xs text-cyan-500 font-bold uppercase tracking-wider">☀ Lunch</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                {activePlan.lunch}
              </p>
            </div>

            {/* Snack */}
            <div className="p-4 border border-slate-100 dark:border-slate-800/80 rounded-2xl bg-slate-5/50 dark:bg-slate-950/30 space-y-1 hover:border-cyan-400 transition-all">
              <span className="text-xs text-cyan-500 font-bold uppercase tracking-wider">🌇 Evening Snack</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                {activePlan.snack}
              </p>
            </div>

            {/* Dinner */}
            <div className="p-4 border border-slate-100 dark:border-slate-800/80 rounded-2xl bg-slate-5/50 dark:bg-slate-950/30 space-y-1 hover:border-cyan-400 transition-all">
              <span className="text-xs text-cyan-500 font-bold uppercase tracking-wider">🌙 Dinner</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                {activePlan.dinner}
              </p>
            </div>
          </div>

          {/* Macro Breakdown */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400">Nutrients Macro-distribution Estimate</h4>
            
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/30">
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Calories</span>
                <span className="font-display font-bold text-sm text-orange-500">{activePlan.summary.calories} kcal</span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Protein</span>
                <span className="font-display font-bold text-sm text-emerald-500">{activePlan.summary.protein}g</span>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30">
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Carbs</span>
                <span className="font-display font-bold text-sm text-blue-500">{activePlan.summary.carbs}g</span>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30">
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Fats</span>
                <span className="font-display font-bold text-sm text-purple-500">{activePlan.summary.fats}g</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
