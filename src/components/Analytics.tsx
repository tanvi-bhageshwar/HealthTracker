import { TrendingUp, Flame, Droplet, Star, Medal } from 'lucide-react';
import { MealLog, WaterLog, ActivityLog, UserProfile } from '../types';

interface AnalyticsProps {
  profile: UserProfile;
  meals: MealLog[];
  waterLogs: WaterLog[];
  activities: ActivityLog[];
}

export default function Analytics({ profile, meals, waterLogs, activities }: AnalyticsProps) {
  // Generate stats for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  }).reverse();

  // Aggregate values per day
  const dailyData = last7Days.map(date => {
    const dateStr = date.toDateString();
    const dayLabel = date.toLocaleDateString([], { weekday: 'short' });
    
    // Calorie sum
    const dayMeals = meals.filter(m => new Date(m.timestamp).toDateString() === dateStr);
    const calories = dayMeals.reduce((sum, m) => sum + m.calories, 0);

    // Water sum
    const dayWater = waterLogs.filter(w => new Date(w.timestamp).toDateString() === dateStr);
    const water = dayWater.reduce((sum, w) => sum + w.amount, 0);

    // Workout duration
    const dayWorkouts = activities.filter(a => new Date(a.timestamp).toDateString() === dateStr);
    const workoutMins = dayWorkouts.reduce((sum, a) => sum + a.duration, 0);

    return {
      dayLabel,
      calories,
      water: water / 1000, // L
      workoutMins
    };
  });

  // Calculate high-level summary metrics
  const avgCalories = Math.round(dailyData.reduce((sum, d) => sum + d.calories, 0) / 7);
  const avgWater = (dailyData.reduce((sum, d) => sum + d.water, 0) / 7).toFixed(1);
  const totalWorkouts = activities.length;

  // Health score calculation out of 100
  let healthScore = 75;
  if (avgCalories > 1500 && avgCalories < 2500) healthScore += 10;
  if (parseFloat(avgWater) >= 2.0) healthScore += 10;
  if (totalWorkouts >= 3) healthScore += 5;
  healthScore = Math.min(100, healthScore);

  // SVG dimensions for chart
  const svgWidth = 500;
  const svgHeight = 200;
  const padding = 30;
  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 2;

  // Calorie chart calculations
  const maxCalorieVal = Math.max(profile.dailyCalorieGoal * 1.2, ...dailyData.map(d => d.calories), 2000);
  const caloriePoints = dailyData.map((d, index) => {
    const x = padding + (index * (chartWidth / 6));
    const y = padding + chartHeight - ((d.calories / maxCalorieVal) * chartHeight);
    return { x, y, label: d.dayLabel, value: d.calories };
  });

  // Water chart calculations
  const maxWaterVal = Math.max((profile.dailyWaterGoal / 1000) * 1.2, ...dailyData.map(d => d.water), 3);
  const waterBars = dailyData.map((d, index) => {
    const x = padding + (index * (chartWidth / 6)) - 10; // width of bar is 20
    const barHeight = (d.water / maxWaterVal) * chartHeight;
    const y = padding + chartHeight - barHeight;
    return { x, y, width: 20, height: Math.max(4, barHeight), label: d.dayLabel, value: d.water };
  });

  return (
    <div id="analytics-view" className="space-y-6 animate-fade-in">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center md:justify-start gap-2">
          <TrendingUp className="text-indigo-500 w-6 h-6" />
          Core Wellness Analytics & Metrics
        </h2>
        <p className="text-sm text-slate-400 mt-1">Review weekly intake charts, target balances, and dynamic health quotients.</p>
      </div>

      {/* High-level stats panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-500">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-semibold uppercase">Weekly Avg Calories</span>
            <span className="text-lg font-display font-bold text-slate-850 dark:text-slate-150">{avgCalories} kcal</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-500">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-semibold uppercase">Weekly Avg Hydration</span>
            <span className="text-lg font-display font-bold text-slate-850 dark:text-slate-150">{avgWater} Liters</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500">
            <Medal className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-semibold uppercase">Workout Sessions</span>
            <span className="text-lg font-display font-bold text-slate-850 dark:text-slate-150">{totalWorkouts} logged</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500">
            <Star className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-semibold uppercase">Overall Health Score</span>
            <span className="text-lg font-display font-bold text-slate-850 dark:text-slate-150">{healthScore}% score</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calorie Progression Chart */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
          <div>
            <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Flame className="w-5 h-5 text-orange-500" />
              Weekly Calorie Progression
            </h3>
            <p className="text-xs text-slate-400">Progression versus target limit: {profile.dailyCalorieGoal} kcal</p>
          </div>

          <div className="relative">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#f1f5f9" className="dark:stroke-slate-800" strokeDasharray="4" />
              <line x1={padding} y1={padding + chartHeight/2} x2={svgWidth - padding} y2={padding + chartHeight/2} stroke="#f1f5f9" className="dark:stroke-slate-800" strokeDasharray="4" />
              <line x1={padding} y1={padding + chartHeight} x2={svgWidth - padding} y2={padding + chartHeight} stroke="#e2e8f0" className="dark:stroke-slate-700" />

              {/* Target Limit Line */}
              {(() => {
                const targetY = padding + chartHeight - ((profile.dailyCalorieGoal / maxCalorieVal) * chartHeight);
                return (
                  <line 
                    x1={padding} 
                    y1={targetY} 
                    x2={svgWidth - padding} 
                    y2={targetY} 
                    stroke="#f97316" 
                    strokeWidth="1.5" 
                    strokeDasharray="5,3" 
                  />
                );
              })()}

              {/* Line Area Gradient */}
              {(() => {
                const pathData = caloriePoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
                const closedPath = `${pathData} L ${caloriePoints[caloriePoints.length-1].x} ${padding + chartHeight} L ${caloriePoints[0].x} ${padding + chartHeight} Z`;
                return (
                  <>
                    <defs>
                      <linearGradient id="calorieGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={closedPath} fill="url(#calorieGrad)" />
                    <path d={pathData} fill="none" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                );
              })()}

              {/* Interaction dots and labels */}
              {caloriePoints.map((pt, index) => (
                <g key={index} className="group">
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r="5" 
                    fill="#ea580c" 
                    stroke="#ffffff" 
                    strokeWidth="1.5" 
                    className="hover:scale-150 transition-transform duration-200 cursor-pointer"
                  />
                  {/* Tooltip on hover */}
                  <text 
                    x={pt.x} 
                    y={pt.y - 12} 
                    textAnchor="middle" 
                    className="text-[10px] font-bold fill-slate-700 dark:fill-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    {pt.value} kcal
                  </text>
                  {/* Bottom Day Axis Labels */}
                  <text 
                    x={pt.x} 
                    y={padding + chartHeight + 15} 
                    textAnchor="middle" 
                    className="text-[10px] font-bold fill-slate-400"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Water Progression Chart */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
          <div>
            <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Droplet className="w-5 h-5 text-cyan-500" />
              Weekly Water Intakes
            </h3>
            <p className="text-xs text-slate-400">Intakes plotted against goal: {(profile.dailyWaterGoal / 1000).toFixed(1)} Liters</p>
          </div>

          <div className="relative">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#f1f5f9" className="dark:stroke-slate-800" strokeDasharray="4" />
              <line x1={padding} y1={padding + chartHeight/2} x2={svgWidth - padding} y2={padding + chartHeight/2} stroke="#f1f5f9" className="dark:stroke-slate-800" strokeDasharray="4" />
              <line x1={padding} y1={padding + chartHeight} x2={svgWidth - padding} y2={padding + chartHeight} stroke="#e2e8f0" className="dark:stroke-slate-700" />

              {/* Target Limit Line */}
              {(() => {
                const targetY = padding + chartHeight - (((profile.dailyWaterGoal / 1000) / maxWaterVal) * chartHeight);
                return (
                  <line 
                    x1={padding} 
                    y1={targetY} 
                    x2={svgWidth - padding} 
                    y2={targetY} 
                    stroke="#06b6d4" 
                    strokeWidth="1.5" 
                    strokeDasharray="5,3" 
                  />
                );
              })()}

              {/* Columns bars */}
              {waterBars.map((bar, index) => (
                <g key={index} className="group cursor-pointer">
                  <rect 
                    x={bar.x} 
                    y={bar.y} 
                    width={bar.width} 
                    height={bar.height} 
                    fill="#22d3ee" 
                    rx="4"
                    className="hover:fill-cyan-500 transition-colors duration-200"
                  />
                  {/* Tooltip on hover */}
                  <text 
                    x={bar.x + 10} 
                    y={bar.y - 10} 
                    textAnchor="middle" 
                    className="text-[10px] font-bold fill-slate-700 dark:fill-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    {bar.value.toFixed(1)} L
                  </text>
                  {/* Bottom axis label */}
                  <text 
                    x={bar.x + 10} 
                    y={padding + chartHeight + 15} 
                    textAnchor="middle" 
                    className="text-[10px] font-bold fill-slate-400"
                  >
                    {bar.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
