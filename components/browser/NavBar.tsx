import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Lock, Search } from 'lucide-react';
import { Tab } from '../../types';

interface NavBarProps {
  activeTab?: Tab;
  onNavigate: (url: string) => void;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({
  activeTab,
  onNavigate,
  onBack,
  onForward,
  onReload,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab) {
      if (activeTab.url === 'about:blank') {
        setInputValue('');
        // Auto-focus input when opening a new tab
        setTimeout(() => {
          inputRef.current?.focus();
        }, 10);
      } else {
        setInputValue(activeTab.url);
      }
    }
  }, [activeTab?.url, activeTab?.id]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onNavigate(inputValue);
      (e.target as HTMLInputElement).blur();
    }
  };

  if (!activeTab) return null;

  return (
    <div className="h-12 bg-surface flex items-center px-2 gap-2 border-b border-black/20 z-20">
      <div className="flex items-center gap-1">
        <button
          onClick={onBack}
          disabled={!activeTab.canGoBack}
          className="p-1.5 rounded-full text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={onForward}
          disabled={!activeTab.canGoForward}
          className="p-1.5 rounded-full text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ArrowRight size={18} />
        </button>
        <button
          onClick={onReload}
          className={`p-1.5 rounded-full text-slate-300 hover:bg-white/10 transition-colors ${activeTab.isLoading ? 'animate-spin' : ''}`}
        >
          <RotateCw size={18} />
        </button>
      </div>

      <div className={`
        flex-1 h-8 bg-background rounded-full flex items-center px-3 gap-2
        border border-transparent transition-all
        ${isFocused ? 'ring-2 ring-primary/50 border-primary/40' : 'hover:bg-black/20'}
      `}>
        {activeTab.url.startsWith('https') && !isFocused ? (
          <Lock size={12} className="text-green-500" />
        ) : (
          <Search size={14} className="text-slate-500" />
        )}
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            // Select all on focus for easier typing
            setTimeout(() => {
                const el = document.activeElement as HTMLInputElement;
                el?.select();
            }, 0);
          }}
          onBlur={() => {
            setIsFocused(false);
            // Reset to actual URL on blur if ignored, unless it's a blank tab
            if (activeTab.url !== 'about:blank') {
                setInputValue(activeTab.url);
            }
          }}
          className="flex-1 bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500"
          placeholder="Search with Google or enter address"
        />
      </div>

      <div className="flex items-center px-2">
         {/* Extensions placeholder */}
         <div className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center cursor-pointer">
             <div className="w-4 h-4 border-2 border-slate-400 rounded-sm"></div>
         </div>
      </div>
    </div>
  );
};
