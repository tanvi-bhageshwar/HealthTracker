import { 
  Flame, 
  Droplet, 
  Activity, 
  Heart, 
  Sparkles, 
  Apple, 
  UtensilsCrossed, 
  MessageSquareHeart, 
  Plus, 
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { UserProfile, MealLog, WaterLog, ActivityLog } from '../types';

interface DashboardProps {
  profile: UserProfile;
  meals: MealLog[];
  waterLogs: WaterLog[];
  activities: ActivityLog[];
  onNavigate: (tab: string) => void;
  onQuickAddWater: (amount: number) => void;
}

export default function Dashboard({ 
  profile, 
  meals, 
  waterLogs, 
  activities, 
  onNavigate,
  onQuickAddWater 
}: DashboardProps) {
  
  // Calculate today's totals
  const todayStr = new Date().toDateString();
  
  const todayMeals = meals.filter(m => new Date(m.timestamp).toDateString() === todayStr);
  const totalCaloriesToday = todayMeals.reduce((sum, m) => sum + m.calories, 0);
  
  const todayWater = waterLogs.filter(w => new Date(w.timestamp).toDateString() === todayStr);
  const totalWaterToday = todayWater.reduce((sum, w) => sum + w.amount, 0);
  
  const todayActivities = activities.filter(a => new Date(a.timestamp).toDateString() === todayStr);
  const totalActivityDuration = todayActivities.reduce((sum, a) => sum + a.duration, 0);
  const totalCaloriesBurned = todayActivities.reduce((sum, a) => sum + a.caloriesBurned, 0);

  // Calorie Progress Percentage
  const caloriePercent = Math.min(100, Math.round((totalCaloriesToday / profile.dailyCalorieGoal) * 100));
  // Water Progress Percentage
  const waterPercent = Math.min(100, Math.round((totalWaterToday / profile.dailyWaterGoal) * 100));

  // Compute BMI
  const heightM = profile.height / 100;
  const bmi = (profile.weight / (heightM * heightM)).toFixed(1);
  let bmiCategory = 'Normal';
  let bmiColor = 'text-emerald-500';
  const bmiVal = parseFloat(bmi);
  if (bmiVal < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-amber-500';
  } else if (bmiVal >= 25 && bmiVal < 30) {
    bmiCategory = 'Overweight';
    bmiColor = 'text-orange-500';
  } else if (bmiVal >= 30) {
    bmiCategory = 'Obese';
    bmiColor = 'text-rose-500';
  }

  // Quick motivational quotes
  const quotes = [
    "Your health is an investment, not an expense.",
    "Small daily improvements over time lead to stunning results.",
    "Eat to nourish your body, not to feed your feelings.",
    "The only bad workout is the one that didn't happen.",
    "Hydrate yourself! Your skin, muscles, and brain will thank you."
  ];
  const activeQuoteIndex = Math.floor((new Date().getDate()) % quotes.length);
  const dailyQuote = quotes[activeQuoteIndex];

  return (
    <div id="dashboard-view" className="space-y-8 animate-fade-in">
      {/* Welcome Hero Panel */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase backdrop-blur-sm max-w-max">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              Final Year Core Project Showcase
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
              Welcome back, {profile.name}! 👋
            </h1>
            <p className="text-emerald-50 max-w-xl text-sm md:text-base leading-relaxed">
              Track your nutrition, activity, water intake, and discuss wellness with your peers in real-time.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 max-w-md">
            <p className="text-xs font-semibold tracking-wider text-teal-200 uppercase mb-1">Coach's Daily Thought</p>
            <p className="text-sm italic font-medium">"{dailyQuote}"</p>
          </div>
        </div>
      </div>

      {/* Main Core Stat Rings/Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Calorie Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Calories Consumed</span>
            <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-orange-500">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">{totalCaloriesToday}</span>
              <span className="text-sm text-slate-400">/ {profile.dailyCalorieGoal} kcal</span>
            </div>
            {/* Progress bar */}
            <div className="mt-4">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${caloriePercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-right text-orange-600 dark:text-orange-400 font-medium mt-1.5">{caloriePercent}% of daily limit</p>
            </div>
          </div>
        </div>

        {/* Water Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Water Hydration</span>
            <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 text-cyan-500">
              <Droplet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">{(totalWaterToday / 1000).toFixed(2)}</span>
              <span className="text-sm text-slate-400">/ {(profile.dailyWaterGoal / 1000).toFixed(1)} Liters</span>
            </div>
            {/* Progress bar */}
            <div className="mt-4">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${waterPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-right text-cyan-600 dark:text-cyan-400 font-medium mt-1.5">{waterPercent}% of target</p>
            </div>
          </div>
        </div>

        {/* Workouts Burned Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Exercise & Burn</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">{totalCaloriesBurned}</span>
              <span className="text-sm text-slate-400">kcal burned</span>
            </div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              {totalActivityDuration} active mins today
            </p>
          </div>
        </div>

        {/* BMI Health Quotient Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">BMI Quotient</span>
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-500">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">{bmi}</span>
              <span className={`text-sm font-semibold ${bmiColor}`}>{bmiCategory}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Based on height: {profile.height}cm, weight: {profile.weight}kg
            </p>
          </div>
        </div>
      </div>

      {/* Grid: 2 columns (Hydration Quick Addition & Quick Actions Bento) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Hydration Tracker widget */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-cyan-500" />
              Quick Hydrate
            </h3>
            <p className="text-xs text-slate-400 mt-1">Easily log popular container volumes with one click.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onQuickAddWater(250)}
              className="p-3 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-cyan-500 dark:hover:border-cyan-500 bg-slate-50 hover:bg-cyan-50/50 dark:bg-slate-950 dark:hover:bg-cyan-950/10 transition-all text-center group cursor-pointer"
            >
              <span className="block text-xs text-slate-400 group-hover:text-cyan-500">Cup</span>
              <span className="block text-base font-bold text-slate-700 dark:text-slate-200 group-hover:text-cyan-600">+250 ml</span>
            </button>
            <button 
              onClick={() => onQuickAddWater(500)}
              className="p-3 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-cyan-500 dark:hover:border-cyan-500 bg-slate-50 hover:bg-cyan-50/50 dark:bg-slate-950 dark:hover:bg-cyan-950/10 transition-all text-center group cursor-pointer"
            >
              <span className="block text-xs text-slate-400 group-hover:text-cyan-500">Medium Bottle</span>
              <span className="block text-base font-bold text-slate-700 dark:text-slate-200 group-hover:text-cyan-600">+500 ml</span>
            </button>
            <button 
              onClick={() => onQuickAddWater(750)}
              className="p-3 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-cyan-500 dark:hover:border-cyan-500 bg-slate-50 hover:bg-cyan-50/50 dark:bg-slate-950 dark:hover:bg-cyan-950/10 transition-all text-center group cursor-pointer"
            >
              <span className="block text-xs text-slate-400 group-hover:text-cyan-500">Large Flask</span>
              <span className="block text-base font-bold text-slate-700 dark:text-slate-200 group-hover:text-cyan-600">+750 ml</span>
            </button>
            <button 
              onClick={() => onQuickAddWater(1000)}
              className="p-3 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-cyan-500 dark:hover:border-cyan-500 bg-slate-50 hover:bg-cyan-50/50 dark:bg-slate-950 dark:hover:bg-cyan-950/10 transition-all text-center group cursor-pointer"
            >
              <span className="block text-xs text-slate-400 group-hover:text-cyan-500">Jumbo Bottle</span>
              <span className="block text-base font-bold text-slate-700 dark:text-slate-200 group-hover:text-cyan-600">+1.0 Liter</span>
            </button>
          </div>

          <button 
            onClick={() => onNavigate('water')}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl text-xs font-semibold tracking-wide shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all cursor-pointer text-center"
          >
            Manage Hydration History
          </button>
        </div>

        {/* Quick Action Bento Grid */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Core Academic Modules
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate('food')}
              className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-950 dark:to-slate-900/60 border border-orange-100 dark:border-slate-800 hover:border-orange-300 dark:hover:border-slate-700 transition-all flex flex-col text-left space-y-2 group cursor-pointer"
            >
              <div className="p-2.5 rounded-xl bg-orange-500 text-white w-max group-hover:scale-110 transition-transform">
                <Apple className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Meal Logging</h4>
                <p className="text-xs text-slate-400 mt-1">Record items, quantities, and track energy intake.</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('activity')}
              className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-950 dark:to-slate-900/60 border border-emerald-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-slate-700 transition-all flex flex-col text-left space-y-2 group cursor-pointer"
            >
              <div className="p-2.5 rounded-xl bg-emerald-500 text-white w-max group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Activity Tracker</h4>
                <p className="text-xs text-slate-400 mt-1">Log workouts, minutes, and caloric output metrics.</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('bmi')}
              className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-slate-950 dark:to-slate-900/60 border border-rose-100 dark:border-slate-800 hover:border-rose-300 dark:hover:border-slate-700 transition-all flex flex-col text-left space-y-2 group cursor-pointer"
            >
              <div className="p-2.5 rounded-xl bg-rose-500 text-white w-max group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">BMI Calculator</h4>
                <p className="text-xs text-slate-400 mt-1">Examine body mass index relative heights & logs.</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('coach')}
              className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-slate-950 dark:to-slate-900/60 border border-indigo-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 transition-all flex flex-col text-left space-y-2 group cursor-pointer"
            >
              <div className="p-2.5 rounded-xl bg-indigo-500 text-white w-max group-hover:scale-110 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">AI Nutritionist</h4>
                <p className="text-xs text-slate-400 mt-1">Consult custom Coach intelligence powered by Gemini.</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('planner')}
              className="p-4 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-950 dark:to-slate-900/60 border border-cyan-100 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-slate-700 transition-all flex flex-col text-left space-y-2 group cursor-pointer"
            >
              <div className="p-2.5 rounded-xl bg-cyan-500 text-white w-max group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Meal Planner</h4>
                <p className="text-xs text-slate-400 mt-1">Design customizable diets and smart weekly grids.</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('forum')}
              className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-slate-950 dark:to-slate-900/60 border border-teal-100 dark:border-slate-800 hover:border-teal-300 dark:hover:border-slate-700 transition-all flex flex-col text-left space-y-2 group cursor-pointer"
            >
              <div className="p-2.5 rounded-xl bg-teal-500 text-white w-max group-hover:scale-110 transition-transform">
                <MessageSquareHeart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Health Forum</h4>
                <p className="text-xs text-slate-400 mt-1">Post public tips, recipe reviews, and notes.</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
