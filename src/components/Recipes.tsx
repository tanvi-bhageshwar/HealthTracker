import React, { useState } from 'react';
import { ChefHat, Plus, Heart, ScrollText, Flame, BookOpen } from 'lucide-react';
import { Recipe, UserProfile } from '../types';

interface RecipesProps {
  recipes: Recipe[];
  profile: UserProfile;
  onAddRecipe: (recipe: Omit<Recipe, 'id' | 'likes' | 'likedByMe' | 'creator'>) => void;
  onLikeRecipe: (id: string) => void;
}

export default function Recipes({ recipes, profile, onAddRecipe, onLikeRecipe }: RecipesProps) {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [calories, setCalories] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ingredients || !instructions || !calories) return;

    onAddRecipe({
      name,
      ingredients,
      instructions,
      calories: Math.max(0, parseInt(calories) || 0)
    });

    // Reset
    setName('');
    setIngredients('');
    setInstructions('');
    setCalories('');
    setShowAddForm(false);
  };

  return (
    <div id="recipes-view" className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ChefHat className="text-emerald-500 w-6 h-6" />
            Healthy Community Recipes
          </h2>
          <p className="text-sm text-slate-400 mt-1">Share dietary formulas, meal recipes, and save community culinary creations.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer max-w-max self-center"
        >
          {showAddForm ? 'View Catalog' : 'Share a Recipe'}
        </button>
      </div>

      {showAddForm ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm max-w-2xl mx-auto">
          <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1.5">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            Add New Community Formula
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Recipe Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Avocado Toast with Poached Egg" 
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Calories (kcal)</label>
                <input 
                  type="number" 
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="e.g. 350" 
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Creator Name</label>
                <input 
                  type="text" 
                  value={profile.name}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed text-sm"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Ingredients</label>
              <textarea 
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="List ingredients separated by commas (e.g. 1 slice sourdough bread, 1/2 ripe avocado, 1 poached egg, sea salt)" 
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                rows={3}
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Instructions</label>
              <textarea 
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Describe preparation steps (e.g. 1. Toast sourdough. 2. Mash avocado and spread evenly. 3. Top with warm poached egg. 4. Season to taste.)" 
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                rows={4}
                required
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/15 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-sm"
            >
              <Plus className="w-5 h-5" />
              Publish Recipe To Feed
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recipes.map((recipe) => (
            <div 
              key={recipe.id} 
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 line-clamp-1 leading-snug">
                    {recipe.name}
                  </h3>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-500 text-[10px] font-bold tracking-wider uppercase shrink-0">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{recipe.calories} kcal</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  Shared by <span className="text-emerald-500">{recipe.creator}</span>
                </p>

                {/* Ingredients */}
                <div className="space-y-1 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Ingredients</span>
                  <p className="text-xs text-slate-600 dark:text-slate-350 line-clamp-2">
                    {recipe.ingredients}
                  </p>
                </div>

                {/* Instructions */}
                <div className="space-y-1">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <ScrollText className="w-3 h-3 text-slate-400" />
                    Preparation steps
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                    {recipe.instructions}
                  </p>
                </div>
              </div>

              {/* Like Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <button
                  onClick={() => onLikeRecipe(recipe.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    recipe.likedByMe 
                      ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-500 font-bold' 
                      : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50/40 dark:hover:bg-rose-950/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${recipe.likedByMe ? 'fill-rose-500 text-rose-500 animate-pulse' : ''}`} />
                  <span>{recipe.likes} Likes</span>
                </button>

                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-850">
                  Community Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
