import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  User, 
  Mail, 
  Target, 
  Flame, 
  Droplet, 
  Scale, 
  Ruler, 
  Calendar, 
  Edit3, 
  Save, 
  CheckCircle,
  TrendingUp,
  Activity
} from 'lucide-react';

interface ProfileProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export default function Profile({ profile, onUpdateProfile }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleGoalPreset = (type: 'loss' | 'maintenance' | 'gain') => {
    let calorieGoal = 1900;
    if (type === 'loss') {
      calorieGoal = Math.round(profile.weight * 22 * 1.2 - 500); // Simple deficit formula
    } else if (type === 'maintenance') {
      calorieGoal = Math.round(profile.weight * 22 * 1.2);
    } else if (type === 'gain') {
      calorieGoal = Math.round(profile.weight * 22 * 1.2 + 400);
    }
    
    setFormData(prev => ({
      ...prev,
      dailyCalorieGoal: calorieGoal,
      dailyWaterGoal: type === 'loss' ? 3200 : 3000
    }));
  };

  // Calculate BMI
  const heightM = profile.height / 100;
  const bmi = profile.weight / (heightM * heightM);
  
  let bmiCategory = "Normal";
  let bmiColor = "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30";
  if (bmi < 18.5) {
    bmiCategory = "Underweight";
    bmiColor = "text-amber-500 bg-amber-50 dark:bg-amber-950/30";
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = "Overweight";
    bmiColor = "text-orange-500 bg-orange-50 dark:bg-orange-950/30";
  } else if (bmi >= 30) {
    bmiCategory = "Obese";
    bmiColor = "text-rose-500 bg-rose-50 dark:bg-rose-950/30";
  }

  return (
    <div className="space-y-6" id="profile-view">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-7 h-7 text-emerald-500" />
            <span>My Health Profile</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your personal metrics, dietary targets, and dynamic calorie estimations.
          </p>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => {
              setFormData({ ...profile });
              setIsEditing(true);
            }}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile Info</span>
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-2xl flex items-center gap-2.5 border border-emerald-100 dark:border-emerald-900/50 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="text-sm font-semibold">Profile details and health goals updated successfully!</span>
        </div>
      )}

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Basic Summary */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full mx-auto flex items-center justify-center mb-3">
              <User className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{profile.name}</h3>
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{profile.email}</span>
            </p>
            <div className="inline-block px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 rounded-full mt-3">
              Practice Student
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Joined On</span>
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.joinDate}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>Gender Identity</span>
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.gender}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400 flex items-center gap-2">
                <Scale className="w-4 h-4" />
                <span>Current Weight</span>
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.weight} kg</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400 flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                <span>Static Height</span>
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.height} cm</span>
            </div>
          </div>

          {/* Quick Body Mass index Card */}
          <div className={`p-4 rounded-2xl ${bmiColor} border border-transparent`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">Computed BMI</span>
              <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/45 dark:bg-black/30">
                {bmiCategory}
              </span>
            </div>
            <p className="text-2xl font-black">{bmi.toFixed(1)}</p>
            <p className="text-[11px] opacity-75 mt-1">
              Your BMI suggests a {bmiCategory.toLowerCase()} weight range relative to your height.
            </p>
          </div>
        </div>

        {/* Middle/Right: Details Edit Form or Static display */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Modify Personal Metrics</h3>
                <p className="text-xs text-slate-400">Update goals and indicators below.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Age (Years)</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    min="1"
                    max="120"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Height (cm)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={e => setFormData({ ...formData, height: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    min="50"
                    max="250"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Weight (kg)</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    min="10"
                    max="300"
                    required
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health Goals & Targets</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Customize daily calorie caps and hydration aims directly, or click a preset below.</p>
                </div>

                {/* Preset helpers */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleGoalPreset('loss')}
                    className="px-3 py-1.5 text-xs font-semibold bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30 rounded-lg cursor-pointer"
                  >
                    📉 Weight Loss Deficit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGoalPreset('maintenance')}
                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30 rounded-lg cursor-pointer"
                  >
                    ⚖️ Balanced Maintenance
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGoalPreset('gain')}
                    className="px-3 py-1.5 text-xs font-semibold bg-cyan-50 dark:bg-cyan-950/20 hover:bg-cyan-100 text-cyan-600 dark:text-cyan-400 border border-cyan-200/50 dark:border-cyan-900/30 rounded-lg cursor-pointer"
                  >
                    📈 Muscle Bulking Gain
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-500 inline mr-1" />
                      <span>Daily Calories Goal (kcal)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.dailyCalorieGoal}
                      onChange={e => setFormData({ ...formData, dailyCalorieGoal: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      min="500"
                      max="8000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      <Droplet className="w-3.5 h-3.5 text-cyan-500 inline mr-1" />
                      <span>Daily Water Goal (ml)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.dailyWaterGoal}
                      onChange={e => setFormData({ ...formData, dailyWaterGoal: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      min="500"
                      max="10000"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Nutritional Milestones</h3>
                <p className="text-xs text-slate-400">Target metrics designed dynamically for your body structure.</p>
              </div>

              {/* Targets Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-100/30 dark:border-orange-950/20 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded-xl">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Caloric Threshold</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{profile.dailyCalorieGoal} kcal</p>
                    <p className="text-xs text-slate-500">Daily calorie energy budget</p>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-100/30 dark:border-cyan-950/20 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 rounded-xl">
                    <Droplet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hydration Targets</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{(profile.dailyWaterGoal / 1000).toFixed(1)} Litres</p>
                    <p className="text-xs text-slate-500">{profile.dailyWaterGoal} ml pure water intake</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-900 space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Healthy Projections</span>
                </div>
                
                <p className="text-xs text-slate-500 leading-relaxed">
                  Based on your age ({profile.age} years) and height/weight values, the dynamic resting metabolic rate calculates to approximately <strong>{(profile.weight * 21).toFixed(0)} kcal</strong>. 
                  Maintaining hydration levels of {profile.dailyWaterGoal} ml boosts tissue oxygenation, and keeping calories near {profile.dailyCalorieGoal} kcal supports healthy weight maintenance.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setFormData({ ...profile });
                      setIsEditing(true);
                    }}
                    className="text-xs text-emerald-500 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    Adjust targets manually &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
