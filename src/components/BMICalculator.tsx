import React, { useState } from 'react';
import { Heart, Scale, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import { UserProfile } from '../types';

interface BMICalculatorProps {
  profile: UserProfile;
  onUpdateMetrics: (weight: number, height: number) => void;
}

export default function BMICalculator({ profile, onUpdateMetrics }: BMICalculatorProps) {
  const [weight, setWeight] = useState(profile.weight.toString());
  const [height, setHeight] = useState(profile.height.toString());
  const [updated, setUpdated] = useState(false);

  // Compute values
  const wNum = parseFloat(weight) || 0;
  const hNum = parseFloat(height) || 0;
  const hM = hNum / 100;
  const bmiVal = hM > 0 ? (wNum / (hM * hM)) : 0;
  const bmiStr = bmiVal > 0 ? bmiVal.toFixed(1) : '0.0';

  // Categorize
  let category = 'Unknown';
  let categoryColor = 'text-slate-400 bg-slate-100 dark:bg-slate-800';
  let indicatorPosition = '0%'; // For visual scale
  let advice = '';

  if (bmiVal > 0) {
    if (bmiVal < 18.5) {
      category = 'Underweight';
      categoryColor = 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400';
      indicatorPosition = '15%';
      advice = 'A calorie-dense nutritional approach with clean proteins and complex carbs is advised. Focus on muscle hypertrophy workouts.';
    } else if (bmiVal >= 18.5 && bmiVal < 25) {
      category = 'Normal Weight';
      categoryColor = 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400';
      indicatorPosition = '40%';
      advice = 'Fantastic status! Your mechanical mass is well balanced relative to vertical height. Keep up your active lifestyle and nutritious eating patterns.';
    } else if (bmiVal >= 25 && bmiVal < 30) {
      category = 'Overweight';
      categoryColor = 'text-orange-600 bg-orange-50 dark:bg-orange-950/40 dark:text-orange-400';
      indicatorPosition = '65%';
      advice = 'Consider a moderate caloric deficit (300-500 kcal below TDEE) combined with cardiovascular routines and a dense protein diet to lose body fat.';
    } else {
      category = 'Obese';
      categoryColor = 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400';
      indicatorPosition = '90%';
      advice = 'We recommend checking in with a qualified dietician. Focus on low-impact exercise (walking, swimming) and fiber-rich, portion-controlled meals.';
    }
  }

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (wNum > 0 && hNum > 0) {
      onUpdateMetrics(wNum, hNum);
      setUpdated(true);
      setTimeout(() => setUpdated(false), 3000);
    }
  };

  return (
    <div id="bmi-calculator-view" className="space-y-6 animate-fade-in">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center md:justify-start gap-2">
          <Scale className="text-rose-500 w-6 h-6" />
          Clinical Body Mass Index (BMI)
        </h2>
        <p className="text-sm text-slate-400 mt-1">Check weight relative to height, visualizes weight standing, and save changes to your profile.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Indicators */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1.5">
              <Scale className="w-5 h-5 text-rose-500" />
              Recalculate BMI
            </h3>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 70" 
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Height (cm)</label>
                <input 
                  type="number" 
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 175" 
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-rose-500/15 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-sm"
              >
                Apply & Save Profile Metrics
              </button>

              {updated && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Height and weight successfully updated in profile database!
                </div>
              )}
            </form>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
            <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Body Mass Index is a general heuristic formula checking weight mass versus heights. Muscle mass is not directly distinguished from adipose tissues.
            </p>
          </div>
        </div>

        {/* Right Column: Visualizer Gauge & Clinical Tips */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100">Physical Health Assessment</h3>

          <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="text-center md:text-left space-y-1">
              <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Estimated Score</span>
              <p className="text-5xl font-display font-extrabold text-slate-800 dark:text-slate-100">{bmiStr}</p>
              <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${categoryColor}`}>
                {category}
              </div>
            </div>

            <div className="text-xs text-slate-400 border-l border-slate-200 dark:border-slate-800 pl-4 py-1 max-w-sm space-y-2">
              <h4 className="font-bold text-slate-700 dark:text-slate-300">Nutritionist Prescription</h4>
              <p className="leading-relaxed italic">"{advice}"</p>
            </div>
          </div>

          {/* Graphical slider scale */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">BMI Visual Scale Indicator</h4>
            
            {/* Visual Bar representation */}
            <div className="relative pt-6 pb-2">
              {/* Target indicator pin */}
              <div 
                className="absolute top-0 transition-all duration-700 -ml-3 flex flex-col items-center"
                style={{ left: indicatorPosition }}
              >
                <div className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-md">
                  You: {bmiStr}
                </div>
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-0.5"></div>
              </div>

              {/* Bar ranges */}
              <div className="w-full h-3 rounded-full flex overflow-hidden">
                <div className="w-[18.5%] bg-amber-400" title="Underweight (< 18.5)"></div>
                <div className="w-[6.5%] bg-emerald-500" title="Normal Range Lower (18.5 - 24.9)"></div>
                <div className="w-[20%] bg-emerald-500 border-l border-emerald-600/20" title="Normal Range Upper"></div>
                <div className="w-[25%] bg-orange-400" title="Overweight (25 - 29.9)"></div>
                <div className="w-[30%] bg-rose-500" title="Obese (>= 30)"></div>
              </div>

              {/* Range Labels */}
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-2.5">
                <span>Underweight (&lt;18.5)</span>
                <span>Normal (18.5-24.9)</span>
                <span>Overweight (25-29.9)</span>
                <span>Obese (&gt;30)</span>
              </div>
            </div>
          </div>

          {/* Table ranges catalog */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950">
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="py-2.5 px-4 text-left font-bold text-slate-500 uppercase">BMI Range</th>
                  <th className="py-2.5 px-4 text-left font-bold text-slate-500 uppercase">Category</th>
                  <th className="py-2.5 px-4 text-left font-bold text-slate-500 uppercase">Implication</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-700 dark:text-slate-300">Below 18.5</td>
                  <td className="py-2.5 px-4 text-amber-500 font-medium">Underweight</td>
                  <td className="py-2.5 px-4 text-slate-400">Nutritional deficit danger</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-700 dark:text-slate-300">18.5 – 24.9</td>
                  <td className="py-2.5 px-4 text-emerald-500 font-medium">Normal Weight</td>
                  <td className="py-2.5 px-4 text-slate-400">Optimal chemical balance</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-700 dark:text-slate-300">25.0 – 29.9</td>
                  <td className="py-2.5 px-4 text-orange-500 font-medium">Overweight</td>
                  <td className="py-2.5 px-4 text-slate-400">Increased risk load</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-700 dark:text-slate-300">30.0 and Above</td>
                  <td className="py-2.5 px-4 text-rose-500 font-medium">Obese</td>
                  <td className="py-2.5 px-4 text-slate-400">Clinical intervention advised</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
