import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, BrainCircuit, Play } from 'lucide-react';
import { ChatMessage } from '../types';

interface AICoachProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  loading: boolean;
}

export default function AICoach({ chatHistory, onSendMessage, loading }: AICoachProps) {
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || loading) return;

    onSendMessage(userInput.trim());
    setUserInput('');
  };

  // Quick suggestions chips (fully interactive!)
  const suggestions = [
    "What are some nutrient-dense foods rich in protein?",
    "How do I safely calculate a sustainable calorie deficit?",
    "What is the recommended daily water intake for active adults?",
    "Give me a quick, healthy breakfast recommendation."
  ];

  const handleChipClick = (suggestion: string) => {
    if (loading) return;
    onSendMessage(suggestion);
  };

  return (
    <div id="ai-coach-view" className="space-y-6 animate-fade-in">
      <div className="text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center md:justify-start gap-2">
            <BrainCircuit className="text-indigo-500 w-6 h-6 animate-pulse" />
            AI Health Coach & Nutritionist
          </h2>
          <p className="text-sm text-slate-400 mt-1">Ask questions about calories, BMI, protein alternatives, and optimal nutrition.</p>
        </div>
        
        <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max mx-auto md:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
          Powered by Gemini AI 3.5
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[600px]">
        {/* Left column: Suggestions panel */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>💡</span> Suggested Consultation Prompts
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click any chip below to directly consult our advanced Gemini model about clinical nutrition, active weight targets, or food structures.
            </p>
          </div>

          <div className="space-y-2.5">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(suggestion)}
                className="w-full p-3 border border-slate-100 dark:border-slate-800 hover:border-indigo-400 rounded-xl text-left bg-slate-50 hover:bg-indigo-50/20 dark:bg-slate-950 dark:hover:bg-indigo-950/10 text-xs font-medium text-slate-600 dark:text-slate-300 transition-all flex items-start gap-2 group cursor-pointer"
                disabled={loading}
              >
                <Play className="w-3 h-3 text-indigo-500 shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>

          <div className="p-3 bg-indigo-500/10 border border-indigo-500/10 rounded-xl text-[10px] text-slate-400 leading-relaxed text-center font-semibold uppercase tracking-wider">
            3rd Year final College project AI core
          </div>
        </div>

        {/* Right column: Interactive Chat window */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[500px]">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-950/40">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">AI Assistant Coach</h4>
                <p className="text-[10px] text-slate-400 font-medium">Ready to discuss your lifestyle habits</p>
              </div>
            </div>
            <MessageSquare className="w-4 h-4 text-slate-400" />
          </div>

          {/* Messages Logs Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {chatHistory.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div 
                  key={msg.id} 
                  className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                      isBot 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none' 
                        : 'bg-indigo-500 text-white rounded-tr-none'
                    }`}
                  >
                    {/* Render message formatting lines correctly */}
                    <div className="space-y-1 whitespace-pre-wrap">
                      {msg.text}
                    </div>
                    
                    <p className={`text-[9px] text-right mt-1.5 ${isBot ? 'text-slate-400' : 'text-indigo-200'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none p-4 space-y-2 max-w-[200px]">
                  <div className="flex gap-1 justify-center py-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form Input Area */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex gap-3">
            <input 
              type="text" 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask anything (e.g. 'Is cottage cheese high protein?')"
              className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition-all"
              disabled={loading}
              required
            />
            <button 
              type="submit"
              className="p-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 hover:shadow-md hover:shadow-indigo-500/15 active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer"
              disabled={loading || !userInput.trim()}
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
