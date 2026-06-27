import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  ThumbsUp, 
  Bookmark, 
  BookmarkCheck, 
  ListTodo, 
  Utensils, 
  Flame, 
  Moon, 
  Droplet, 
  RefreshCw 
} from 'lucide-react';

interface Tip {
  id: string;
  category: 'hydration' | 'nutrition' | 'exercise' | 'sleep';
  title: string;
  description: string;
  details: string;
  likes: number;
}

interface DailyHabit {
  id: string;
  text: string;
  category: 'hydration' | 'nutrition' | 'exercise' | 'sleep';
  completed: boolean;
}

export default function HealthTips() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Tips state
  const [tips, setTips] = useState<Tip[]>(() => {
    const saved = localStorage.getItem('health_tips_likes');
    const baseTips: Tip[] = [
      {
        id: "tip-1",
        category: "hydration",
        title: "The 8x8 Hydration Rule",
        description: "Aim to consume at least eight 250ml glasses of water daily.",
        details: "Water assists with toxin elimination, temperature control, and cognitive functioning. Keep a water container visible on your desk as a silent reminder.",
        likes: 42
      },
      {
        id: "tip-2",
        category: "nutrition",
        title: "Load Up on Soluble Fibres",
        description: "Incorporate soluble fibre items like dry oats, lentils, and fresh fruits.",
        details: "Soluble fibre retains water, forming a gel-like substance that delays digestive processes. This slows down peak insulin spikes and curbs snacking.",
        likes: 38
      },
      {
        id: "tip-3",
        category: "exercise",
        title: "Avoid Sedentary Posture Hours",
        description: "Stand up and walk for 3 minutes for every 45 minutes spent sitting down.",
        details: "Prolonged seating decreases lipase enzymes that metabolise body fat. Gentle standing and stretching resets blood circulation parameters.",
        likes: 29
      },
      {
        id: "tip-4",
        category: "sleep",
        title: "Restrict High-Intensity Blue Lights",
        description: "Power down tablets, notebooks, and mobile screens 1 hour before sleeping.",
        details: "Blue wave spectrums suppress melatonin hormone synthesis, which fools the brain into believing it is daylight. Opt for printed text or calm audio instead.",
        likes: 31
      },
      {
        id: "tip-5",
        category: "nutrition",
        title: "Practise Portion Control",
        description: "Use smaller plates and bowls to naturally regulate food quantities.",
        details: "Visual plate coverage tricks the human mind into feeling content with lower calories. Aim to fill half your plate with non-starchy leafy greens.",
        likes: 48
      },
      {
        id: "tip-6",
        category: "hydration",
        title: "Sip Before You Feel Thirsty",
        description: "Thirst is already a signal of mild systemic dehydration.",
        details: "Sipping water systematically maintains continuous cellular hydration. Keep water cool but not freezing for comfortable gulping.",
        likes: 34
      }
    ];

    if (saved) {
      const parsedLikes = JSON.parse(saved);
      return baseTips.map(t => ({
        ...t,
        likes: parsedLikes[t.id] !== undefined ? parsedLikes[t.id] : t.likes
      }));
    }
    return baseTips;
  });

  // Daily Habits Tick List
  const [habits, setHabits] = useState<DailyHabit[]>(() => {
    const saved = localStorage.getItem('daily_habits');
    if (saved) return JSON.parse(saved);
    return [
      { id: "hab-1", text: "Drank glass of pure water upon waking up", category: "hydration", completed: false },
      { id: "hab-2", text: "Ate 2 portions of fresh fruits or leafy veggies", category: "nutrition", completed: false },
      { id: "hab-3", text: "Stretched or walked for at least 15 continuous minutes", category: "exercise", completed: false },
      { id: "hab-4", text: "No screen usage for 45 minutes before bedtime", category: "sleep", completed: false },
      { id: "hab-5", text: "Maintained a protein-rich lunch choice", category: "nutrition", completed: false }
    ];
  });

  const [bookmarkedTips, setBookmarkedTips] = useState<string[]>(() => {
    const saved = localStorage.getItem('bookmarked_tips');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to local storage
  useEffect(() => {
    const likesMap: Record<string, number> = {};
    tips.forEach(t => {
      likesMap[t.id] = t.likes;
    });
    localStorage.setItem('health_tips_likes', JSON.stringify(likesMap));
  }, [tips]);

  useEffect(() => {
    localStorage.setItem('daily_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('bookmarked_tips', JSON.stringify(bookmarkedTips));
  }, [bookmarkedTips]);

  const handleLikeTip = (id: string) => {
    setTips(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, likes: t.likes + 1 };
      }
      return t;
    }));
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedTips(prev => {
      if (prev.includes(id)) {
        return prev.filter(bId => bId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleToggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        return { ...h, completed: !h.completed };
      }
      return h;
    }));
  };

  const handleResetHabits = () => {
    setHabits(prev => prev.map(h => ({ ...h, completed: false })));
  };

  // Filtered tips
  const filteredTips = tips.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Category Icon components
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hydration': return <Droplet className="w-4.5 h-4.5 text-cyan-500" />;
      case 'nutrition': return <Utensils className="w-4.5 h-4.5 text-orange-500" />;
      case 'exercise': return <Flame className="w-4.5 h-4.5 text-emerald-500" />;
      case 'sleep': return <Moon className="w-4.5 h-4.5 text-indigo-500" />;
      default: return <Sparkles className="w-4.5 h-4.5 text-slate-500" />;
    }
  };

  // Stats for habits
  const completedCount = habits.filter(h => h.completed).length;
  const completionPercentage = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="space-y-6" id="healthtips-view">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-emerald-500" />
            <span>Health & Wellness Tips</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Browse science-backed nutrition hacks and complete your healthy baseline habits daily.
          </p>
        </div>
      </div>

      {/* Main split: left 2/3 tips, right 1/3 daily habit tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tips Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Controls bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search health tips..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
              {['all', 'hydration', 'nutrition', 'exercise', 'sleep'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tips list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTips.length > 0 ? (
              filteredTips.map(tip => {
                const isBookmarked = bookmarkedTips.includes(tip.id);
                return (
                  <div 
                    key={tip.id} 
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md flex items-center gap-1.5">
                          {getCategoryIcon(tip.category)}
                          <span>{tip.category}</span>
                        </span>

                        <button
                          onClick={() => handleToggleBookmark(tip.id)}
                          className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
                            isBookmarked ? 'text-emerald-500' : 'text-slate-400'
                          }`}
                          title={isBookmarked ? "Remove Bookmark" : "Bookmark Tip"}
                        >
                          {isBookmarked ? <BookmarkCheck className="w-4.5 h-4.5" /> : <Bookmark className="w-4.5 h-4.5" />}
                        </button>
                      </div>

                      <h3 className="font-bold text-slate-900 dark:text-white mb-1">{tip.title}</h3>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">{tip.description}</p>
                      <p className="text-[11px] text-slate-450 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-950/20 p-2.5 rounded-xl border border-slate-150/50 dark:border-slate-850/30">
                        {tip.details}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <button
                        onClick={() => handleLikeTip(tip.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{tip.likes} Helpful</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-slate-400 font-semibold">No health tips matched your filters.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} 
                  className="mt-3 text-xs text-emerald-500 hover:underline font-bold"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Habits checklist */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Daily Habits Tracker</h3>
              </div>
              
              <button
                onClick={handleResetHabits}
                title="Reset habits"
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Circular Progress Display */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-150/40 dark:border-slate-850 flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0">
                {/* SVG Ring */}
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-slate-200 dark:stroke-slate-800"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-emerald-500 transition-all duration-500"
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 * (1 - completionPercentage / 100)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-black text-slate-900 dark:text-white">{completionPercentage}%</span>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold text-slate-850 dark:text-slate-200">Daily Completion</p>
                <p className="text-[11px] text-slate-400">{completedCount} of {habits.length} habits completed</p>
                <p className="text-[10px] text-emerald-500 font-bold mt-1">
                  {completionPercentage === 100 ? "🎉 Amazing Job!" : "Keep checking them off!"}
                </p>
              </div>
            </div>

            {/* Habits list */}
            <div className="space-y-2.5">
              {habits.map(habit => (
                <button
                  key={habit.id}
                  onClick={() => handleToggleHabit(habit.id)}
                  className={`w-full text-left p-3.5 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                    habit.completed
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-500/30 text-slate-700 dark:text-slate-250 line-through decoration-slate-400 dark:decoration-slate-600'
                      : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/65 dark:border-slate-800/80 text-slate-700 dark:text-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    habit.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-350 dark:border-slate-600'
                  }`}>
                    {habit.completed && (
                      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs font-medium leading-tight">{habit.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
