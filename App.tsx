import React, { useState, useEffect } from 'react';
import { useBrowser } from './hooks/useBrowser';
import { TabGroup } from './components/browser/TabGroup';
import { NavBar } from './components/browser/NavBar';
import { BrowserView } from './components/browser/BrowserView';
import { ElectronGuide } from './components/modals/ElectronGuide';
import { Info } from 'lucide-react';

const App: React.FC = () => {
  const {
    tabs,
    activeTabId,
    setActiveTabId,
    createTab,
    closeTab,
    navigate,
    goBack,
    goForward,
    reload,
    getActiveTab,
    updateTab
  } = useBrowser();

  const [showGuide, setShowGuide] = useState(false);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + T = New Tab
      if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault();
        createTab();
      }
      // Ctrl/Cmd + W = Close Tab
      if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
        e.preventDefault();
        closeTab(activeTabId);
      }
      // Ctrl/Cmd + R = Reload
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault();
        reload();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createTab, closeTab, reload, activeTabId]);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden relative">
      {/* Mac-style Traffic Lights Area (Drag Region) */}
      <div className="h-8 flex items-center px-4 w-full select-none" style={{ WebkitAppRegion: 'drag' } as any}>
         <div className="flex gap-2 mr-4">
             <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
             <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
             <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
         </div>
         <span className="text-xs text-slate-500 font-medium ml-2 opacity-50">Neutron Browser</span>
         
         <div className="ml-auto">
             <button 
                onClick={() => setShowGuide(true)}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover px-2 py-1 rounded hover:bg-white/5 transition-colors no-drag"
                style={{ WebkitAppRegion: 'no-drag' } as any}
             >
                <Info size={14} />
                <span>Build for Mac/Win</span>
             </button>
         </div>
      </div>

      {/* Tabs */}
      <div className="w-full">
        <TabGroup
          tabs={tabs}
          activeTabId={activeTabId}
          onTabClick={setActiveTabId}
          onTabClose={closeTab}
          onNewTab={createTab}
        />
      </div>

      {/* Navigation & Address Bar */}
      <NavBar
        activeTab={getActiveTab()}
        onNavigate={navigate}
        onBack={goBack}
        onForward={goForward}
        onReload={reload}
      />

      {/* Main Content Area */}
      <div className="flex-1 relative bg-surface">
        {tabs.map((tab) => (
          <BrowserView
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onLoadStart={() => updateTab(tab.id, { isLoading: true })}
            onLoadEnd={() => updateTab(tab.id, { isLoading: false })}
            onNavigate={(url) => navigate(url, tab.id)}
          />
        ))}

        {/* Empty State / All tabs closed */}
        {tabs.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
             <p className="mb-4">All tabs closed.</p>
             <button 
                onClick={createTab}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors"
             >
                Open New Tab
             </button>
          </div>
        )}
      </div>

      {/* Build Instructions Modal */}
      <ElectronGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </div>
  );
};

export default App;
