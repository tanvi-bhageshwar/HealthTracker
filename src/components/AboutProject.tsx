import React, { useState } from 'react';
import { 
  HeartPulse, 
  BookOpen, 
  Terminal, 
  Database, 
  Users, 
  Cpu, 
  Award,
  ShieldCheck
} from 'lucide-react';

export default function AboutProject() {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'tech' | 'database' | 'credits'>('overview');

  return (
    <div className="space-y-6" id="about-view">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
          <HeartPulse className="w-7 h-7 text-emerald-500 animate-pulse" />
          <span>About NutriTracker</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Academics Case Study & Project Specifications for CS-3009 Final Year submission.
        </p>
      </div>

      {/* Selector Subtabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Project Overview', icon: BookOpen },
          { id: 'tech', label: 'Technical Stack', icon: Cpu },
          { id: 'database', label: 'Schema Blueprint', icon: Database },
          { id: 'credits', label: 'Academics & Credits', icon: Award }
        ].map((sub) => {
          const Icon = sub.icon;
          const active = activeSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id as any)}
              className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                active 
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                  : 'border-transparent text-slate-455 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Render Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {activeSubTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Project Scope & Objectives</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>NutriTracker</strong> is a full-featured community nutrition, meal recommendation, and exercise auditing platform. 
                Designed as a responsive workspace tool, it targets key obstacles in nutritional accountability: non-structured food tracking, 
                poor dietary diversity, static metabolic calculators, and lack of expert support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                <h4 className="font-bold text-slate-850 dark:text-slate-200 text-sm flex items-center gap-2">
                  <Users className="w-4.5 h-4.5 text-emerald-500" />
                  <span>Interactive Community Hub</span>
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Allows students and wellness practitioners to exchange healthy meal recipes, upvote nutritious preparation methods, and log tips in a unified Wellness Forum.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                <h4 className="font-bold text-slate-850 dark:text-slate-200 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
                  <span>Clinical Weight Verification</span>
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Integrates real-time Body Mass Index (BMI) assessment coupled with medical reference indicators (WHO Standard guidelines) instead of unverified social media estimations.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Primary Core Deliverables:</h4>
              <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                <li><strong>Log-Level Auditing</strong>: High-fidelity journals for breakfasts, calorie breakdowns, fluids, and exercise routines.</li>
                <li><strong>Gemini AI Intelligence</strong>: Conversational guidance on macro-nutrition ratios, medical protein values, and healthy caloric deficits.</li>
                <li><strong>Modular UI Architecture</strong>: Segmented desktop grids with clean, eye-safe typography designed using modern design tokens.</li>
              </ul>
            </div>
          </div>
        )}

        {activeSubTab === 'tech' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Technical Architecture Blueprint</h3>
            
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The application uses a full-stack design utilizing modern compiler tools to ensure high scalability, rapid cold-starts, and strict data type consistency.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-500 rounded-xl">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">TypeScript & React SPA</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    Powered by React 18, Vite compile tooling, and Tailwind CSS. Avoids heavy styling frames by writing native responsive layout classes directly in components.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 rounded-xl">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Google Gemini Gen AI SDK Integration</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    Accesses server-side endpoints configured to interface with the modern `@google/genai` model engine, keeping secrets secure from browser DevTools inspect panels.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl font-mono text-xs text-slate-500 dark:text-slate-400 space-y-1 border border-slate-200 dark:border-slate-800">
              <p className="font-bold text-emerald-500">// System Dependency Map</p>
              <p>&quot;dependencies&quot;: &#123;</p>
              <p>&nbsp;&nbsp;&quot;react&quot;: &quot;^18.2.0&quot;,</p>
              <p>&nbsp;&nbsp;&quot;vite&quot;: &quot;^5.0.0&quot;,</p>
              <p>&nbsp;&nbsp;&quot;@google/genai&quot;: &quot;^0.1.1&quot;,</p>
              <p>&nbsp;&nbsp;&quot;lucide-react&quot;: &quot;^0.300.0&quot;,</p>
              <p>&nbsp;&nbsp;&quot;motion&quot;: &quot;^11.0.0&quot;,</p>
              <p>&nbsp;&nbsp;&quot;recharts&quot;: &quot;^2.10.0&quot;</p>
              <p>&#125;</p>
            </div>
          </div>
        )}

        {activeSubTab === 'database' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Database Entities Blueprint</h3>
            
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Below is the structured relational mapping of application variables. The platform implements structured persistence in browser localStorage to retain metrics seamlessly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* User Profile Table */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <h4 className="font-mono text-xs font-bold text-emerald-500">Table: UserProfile</h4>
                <div className="space-y-1 font-mono text-[10px] text-slate-450 dark:text-slate-450">
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">name</span>: varchar(100)</p>
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">email</span>: varchar(255)</p>
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">age</span>: integer</p>
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">gender</span>: varchar(50)</p>
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">height</span>: integer (cm)</p>
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">weight</span>: integer (kg)</p>
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">dailyCalorieGoal</span>: integer</p>
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">dailyWaterGoal</span>: integer</p>
                </div>
              </div>

              {/* MealLog Table */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <h4 className="font-mono text-xs font-bold text-orange-500">Table: MealLog</h4>
                <div className="space-y-1 font-mono text-[10px] text-slate-450 dark:text-slate-450">
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">id</span>: varchar(50) [PK]</p>
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">name</span>: text</p>
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">mealType</span>: enum(types)</p>
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">quantity</span>: varchar(80)</p>
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">calories</span>: integer</p>
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">timestamp</span>: timestamp</p>
                </div>
              </div>

              {/* Community Recipes */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <h4 className="font-mono text-xs font-bold text-teal-500">Table: Recipe</h4>
                <div className="space-y-1 font-mono text-[10px] text-slate-450 dark:text-slate-450">
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">id</span>: varchar(50) [PK]</p>
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">name</span>: text</p>
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">ingredients</span>: text</p>
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">instructions</span>: text</p>
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">calories</span>: integer</p>
                  <p><span className="text-slate-700 dark:text-slate-350 font-bold">creator</span>: varchar(100)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'credits' && (
          <div className="space-y-6 animate-fade-in text-center py-6">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950 text-emerald-500 rounded-full mx-auto flex items-center justify-center mb-3">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Academic Course Project Submission</h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-extrabold tracking-wider uppercase">CS-3009 Final Submission</p>
              <p className="text-xs text-slate-450">Course Title: Advanced Community Nutrition and Tech Solutions</p>
            </div>

            <div className="max-w-md mx-auto p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-2xl text-left text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Student Name:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Persia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Practitioner Level:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Level 3 Core Practitioner</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Submission Date:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">June 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Project Status:</span>
                <span className="font-bold text-emerald-500">100% Verified, Compiled & Live</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
