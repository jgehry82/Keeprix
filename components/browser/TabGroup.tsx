import React from 'react';
import { X, Plus, LayoutGrid } from 'lucide-react';
import { Tab } from '../../types';

interface TabGroupProps {
  tabs: Tab[];
  activeTabId: string;
  onTabClick: (id: string) => void;
  onTabClose: (id: string, e: React.MouseEvent) => void;
  onNewTab: () => void;
}

export const TabGroup: React.FC<TabGroupProps> = ({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onNewTab,
}) => {
  return (
    <div className="flex items-end h-10 w-full overflow-x-auto bg-background px-2 scrollbar-hide pt-1">
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTabId;
        const isLast = index === tabs.length - 1;
        const nextIsActive = tabs[index + 1]?.id === activeTabId;
        const isNewTab = tab.url === 'about:blank';

        return (
          <div
            key={tab.id}
            onClick={() => onTabClick(tab.id)}
            className={`
              group relative flex items-center justify-between
              min-w-[140px] max-w-[240px] px-3 transition-all duration-200
              text-sm cursor-default select-none
              ${isActive 
                ? 'h-full bg-surface text-white z-10 shadow-sm' 
                : 'h-[85%] text-slate-400 hover:bg-white/5 hover:text-slate-200 z-0'
              }
            `}
            style={{
                // Standard Chrome: rounded top corners
                borderRadius: '10px 10px 0 0', 
                marginRight: '1px', 
                marginBottom: 0
            }}
          >
            {/* Divider Line (Standard Browser Style) */}
            {/* Show divider only if: Not active, Next is not active, and Not hovering this tab */}
            {!isActive && !nextIsActive && (
              <div className="absolute right-0 h-4 w-[1px] bg-slate-700 top-1/2 -translate-y-1/2 group-hover:hidden" />
            )}

            <div className="flex items-center gap-2 overflow-hidden w-full relative z-10">
              {/* Icon / Spinner Container */}
              <div className="relative w-4 h-4 flex-shrink-0 flex items-center justify-center">
                  {tab.isLoading ? (
                     <div className="w-3.5 h-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  ) : (
                    // Logic for Point 3: Use a clean LayoutGrid icon for New Tabs instead of attempting to fetch a favicon
                    isNewTab ? (
                        <LayoutGrid size={16} className={`transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                    ) : (
                        <img 
                            src={`https://www.google.com/s2/favicons?domain=${tab.url}`} 
                            alt="icon" 
                            className={`
                                w-full h-full object-contain transition-opacity duration-200 
                                ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}
                            `}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'about:blank';
                                (e.target as HTMLImageElement).style.opacity = '0';
                            }}
                        />
                    )
                  )}
              </div>

              <span className={`truncate flex-1 font-medium text-[13px] ${isActive ? 'text-slate-100' : 'text-slate-400'}`}>
                  {tab.title}
              </span>
            </div>

            <button
              onClick={(e) => onTabClose(tab.id, e)}
              className={`
                ml-1 p-0.5 rounded-full 
                hover:bg-slate-600/50 hover:text-white
                transition-all z-10
                ${isActive ? 'opacity-100 text-slate-300' : 'opacity-0 group-hover:opacity-100 text-slate-500'}
              `}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
      
      <button
        onClick={onNewTab}
        className="ml-1 p-1.5 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mb-1"
      >
        <Plus size={18} />
      </button>
    </div>
  );
};
