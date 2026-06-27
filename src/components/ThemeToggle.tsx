import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ darkMode, onToggle }: ThemeToggleProps) {
  return (
    <button
      id="theme-toggle"
      onClick={onToggle}
      className="p-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center border border-slate-200 dark:border-slate-700 cursor-pointer"
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" id="sun-icon" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-500" id="moon-icon" />
      )}
    </button>
  );
}
