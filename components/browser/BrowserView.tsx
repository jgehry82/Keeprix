import React, { useRef, useEffect } from 'react';
import { Tab } from '../../types';
import { NewTabPage } from './NewTabPage';

interface BrowserViewProps {
  tab: Tab;
  isActive: boolean;
  onLoadStart: () => void;
  onLoadEnd: () => void;
  onNavigate?: (url: string) => void; // Added for internal navigation
}

export const BrowserView: React.FC<BrowserViewProps> = ({
  tab,
  isActive,
  onLoadStart,
  onLoadEnd,
  onNavigate,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handling iframe load events
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      onLoadEnd();
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, [onLoadEnd, tab.url]);

  // If we change URL, trigger load start logic if needed
  useEffect(() => {
    // Only if it's not internal page
    if (tab.url !== 'about:blank' && tab.isLoading) {
        // Visual sync logic if needed
    }
  }, [tab.isLoading, tab.url]);

  // Handle Internal New Tab Page
  if (tab.url === 'about:blank') {
      return (
        <div className={`absolute inset-0 bg-background ${isActive ? 'z-10 visible' : 'z-0 invisible'}`}>
             <NewTabPage 
                tabId={tab.id} 
                isActive={isActive}
                onNavigate={(url) => {
                 // We need to trigger navigation. Since this component doesn't have direct access
                 // to the 'navigate' function from useBrowser (it only receives onNavigate prop if passed),
                 // we rely on the parent passing it down.
                 if (onNavigate) onNavigate(url);
                 else window.location.href = url; // Fallback, though not ideal for SPA
             }} />
        </div>
      );
  }

  return (
    <div 
      className={`absolute inset-0 bg-white flex flex-col ${isActive ? 'z-10 visible' : 'z-0 invisible'}`}
    >
      <iframe
        ref={iframeRef}
        src={tab.url}
        className="flex-1 w-full h-full border-none bg-white"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        title={`view-${tab.id}`}
      />
    </div>
  );
};