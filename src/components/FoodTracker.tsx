import React, { useState } from 'react';
import { Apple, Plus, Trash2, Calendar, ChefHat } from 'lucide-react';
import { MealLog, UserProfile } from '../types';

interface FoodTrackerProps {
  meals: MealLog[];
  profile: UserProfile;
  onAddMeal: (meal: Omit<MealLog, 'id' | 'timestamp'>) => void;
  onDeleteMeal: (id: string) => void;
}

export default function FoodTracker({ meals, profile, onAddMeal, onDeleteMeal }: FoodTrackerProps) {
  const [foodName, setFoodName] = useState('');
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('Breakfast');
  const [quantity, setQuantity] = useState('');
  const [calories, setCalories] = useState('');

  // Handle addition
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !quantity || !calories) return;

    onAddMeal({
      name: foodName,
      mealType,
      quantity,
      calories: Math.max(0, parseInt(calories) || 0)
    });

    // Reset fields
    setFoodName('');
    setQuantity('');
    setCalories('');
  };

  // Filter logs for today
  const todayStr = new Date().toDateString();
  const todayMeals = meals.filter(m => new Date(m.timestamp).toDateString() === todayStr);
  const totalCaloriesToday = todayMeals.reduce((sum, m) => sum + m.calories, 0);
  const remainingCalories = Math.max(0, profile.dailyCalorieGoal - totalCaloriesToday);

  // Suggested item helper to quick-fill common food items (very interactive feature!)
  const commonFoods = [
    { name: "Scrambled Eggs (2)", type: "Breakfast", quantity: "1 plate", calories: 140 },
    { name: "Whole-wheat Oatmeal", type: "Breakfast", quantity: "1 bowl", calories: 150 },
    { name: "Grilled Chicken Breast", type: "Lunch", quantity: "150g", calories: 220 },
    { name: "Quinoa Salad", type: "Lunch", quantity: "1 bowl", calories: 290 },
    { name: "Protein Smoothie", type: "Snacks", quantity: "1 glass", calories: 250 },
    { name: "Mixed Almonds & Walnuts", type: "Snacks", quantity: "1 handful", calories: 160 },
    { name: "Baked Salmon Fillet", type: "Dinner", quantity: "1 fillet", calories: 280 },
    { name: "Sautéed Broccoli & Garlic", type: "Dinner", quantity: "1 plate", calories: 85 }
  ];

  const handleQuickAdd = (food: typeof commonFoods[0]) => {
    setFoodName(food.name);
    setMealType(food.type as any);
    setQuantity(food.quantity);
    setCalories(food.calories.toString());
  };

  return (
    <div id="food-tracker-view" className="space-y-6 animate-fade-in">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center md:justify-start gap-2">
          <Apple className="text-orange-500 w-6 h-6" />
          Nutritional Food Tracker
        </h2>
        <p className="text-sm text-slate-400 mt-1">Keep tabs on calorie logs, diet divisions, and track nutrient energy budgets.</p>
      </div>

      {/* Stats Summary Bento Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-5 text-white shadow-md">
          <p className="text-xs font-semibold text-orange-100 uppercase">Daily Goal</p>
          <p className="text-3xl font-display font-bold mt-1">{profile.dailyCalorieGoal} <span className="text-sm">kcal</span></p>
          <p className="text-xs text-orange-100/80 mt-2">Recommended basic energy target</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Logged Today</p>
          <p className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100 mt-1">{totalCaloriesToday} <span className="text-sm">kcal</span></p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-orange-500 h-1.5 rounded-full" 
              style={{ width: `${Math.min(100, (totalCaloriesToday / profile.dailyCalorieGoal) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Remaining Budget</p>
          <p className="text-3xl font-display font-bold text-emerald-500 mt-1">{remainingCalories} <span className="text-sm">kcal</span></p>
          <p className="text-xs text-slate-400 mt-2">
            {totalCaloriesToday >= profile.dailyCalorieGoal ? "Daily calorie limit reached!" : "Keep eating clean, nutritious foods!"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Suggestions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1.5">
              <ChefHat className="w-5 h-5 text-orange-500" />
              Add Meal Log
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Food Name</label>
                <input 
                  type="text" 
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Avocado Toast" 
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Meal Type</label>
                  <select 
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as any)}
                    className="w-full px-3 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-orange-500 transition-all text-sm"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snacks">Snacks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Quantity</label>
                  <input 
                    type="text" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 1 plate, 200g" 
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Calories (kcal)</label>
                <input 
                  type="number" 
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="e.g. 350" 
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm"
                  min="0"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/15 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-sm"
              >
                <Plus className="w-5 h-5" />
                Add Log Entry
              </button>
            </form>
          </div>

          {/* Quick suggestions bento */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
              <span>💡</span> Quick Autofill Recommendations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {commonFoods.map((food, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAdd(food)}
                  className="p-2.5 border border-slate-100 dark:border-slate-800 hover:border-orange-400 rounded-xl text-left hover:bg-orange-50/20 dark:hover:bg-orange-950/10 transition-all group cursor-pointer text-xs"
                >
                  <p className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-orange-500">{food.name}</p>
                  <p className="text-slate-400 mt-0.5">{food.quantity} · {food.calories} kcal</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Meal Log list */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                Today's Meal Ledger
              </h3>
              <span className="text-xs bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-full font-semibold">
                {todayMeals.length} records
              </span>
            </div>

            {todayMeals.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="text-4xl">🥗</div>
                <h4 className="text-slate-700 dark:text-slate-300 font-semibold">No Meals Tracked Today</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">Maintain your daily focus. Log a healthy breakfast, lunch, snack, or dinner to start calculating metrics.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-850 max-h-[400px] overflow-y-auto pr-1">
                {todayMeals.map((meal) => (
                  <div key={meal.id} className="py-3 flex items-center justify-between group">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{meal.name}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {meal.mealType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{meal.quantity} · {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold text-sm text-orange-500">{meal.calories} kcal</span>
                      <button 
                        onClick={() => onDeleteMeal(meal.id)}
                        className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                        title="Delete entry"
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
            <span className="font-medium text-slate-500">Daily Accumulation</span>
            <span className="font-display font-bold text-base text-orange-500">{totalCaloriesToday} kcal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
