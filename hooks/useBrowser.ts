import React, { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Assumption: UUID library is available or we use random string
import { Tab, TabHistory, BrowserState } from '../types';
import { DEFAULT_URL, NEW_TAB_URL } from '../constants';
import { formatUrl, getDisplayTitle } from '../utils/urlUtils';

// Simple UUID generator fallback
const generateId = () => Math.random().toString(36).substring(2, 15);

export const useBrowser = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'default-tab',
      title: 'New Tab',
      url: DEFAULT_URL,
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      lastAccessed: Date.now(),
    },
  ]);

  const [activeTabId, setActiveTabId] = useState<string>('default-tab');

  // History tracking per tab
  const [history, setHistory] = useState<Record<string, TabHistory>>({
    'default-tab': {
      past: [],
      current: DEFAULT_URL,
      future: [],
    },
  });

  const getActiveTab = useCallback(() => {
    return tabs.find((t) => t.id === activeTabId);
  }, [tabs, activeTabId]);

  const createTab = useCallback(() => {
    const newId = generateId();
    const initialUrl = NEW_TAB_URL;
    
    setHistory((prev) => ({
      ...prev,
      [newId]: { past: [], current: initialUrl, future: [] },
    }));

    const newTab: Tab = {
      id: newId,
      title: 'New Tab',
      url: initialUrl,
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      lastAccessed: Date.now(),
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
  }, []);

  const closeTab = useCallback((id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    setTabs((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      if (filtered.length === 0) {
        // If closing last tab, create a new one
        setTimeout(createTab, 0); 
        return [];
      }
      return filtered;
    });
    
    setHistory((prev) => {
      const newHistory = { ...prev };
      delete newHistory[id];
      return newHistory;
    });

    if (activeTabId === id) {
      setTabs((prev) => {
        const index = prev.findIndex((t) => t.id === id);
        // Switch to the tab to the right, or the last one if closing the last
        // Since we are inside the updater, we need to access the *previous* state to find the neighbor
        // But for simplicity in this logic block, let's use a side effect to update active ID
        return prev; // Tab removal handled above
      });
      // Logic for determining next active tab is slightly complex inside setState
      // Simplified:
      setActiveTabId((prevId) => {
        if (prevId !== id) return prevId; // Shouldn't happen based on if check
        // Find adjacent
        const currentIndex = tabs.findIndex(t => t.id === id);
        if (currentIndex > 0) return tabs[currentIndex - 1].id;
        if (tabs.length > 1) return tabs[currentIndex + 1].id;
        return ''; // Will be reset by createTab
      });
    }
  }, [activeTabId, tabs, createTab]);

  const updateTab = useCallback((id: string, updates: Partial<Tab>) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === id ? { ...tab, ...updates } : tab))
    );
  }, []);

  const navigate = useCallback((url: string, id: string = activeTabId) => {
    const formattedUrl = formatUrl(url);
    
    setHistory((prev) => {
      const tabHist = prev[id];
      if (!tabHist) return prev;

      // If navigating to the same URL, just reload (handled by component), but don't push history
      if (tabHist.current === formattedUrl) return prev;

      return {
        ...prev,
        [id]: {
          past: [...tabHist.past, tabHist.current],
          current: formattedUrl,
          future: [],
        },
      };
    });

    updateTab(id, {
      url: formattedUrl,
      title: getDisplayTitle(formattedUrl),
      isLoading: true,
      canGoBack: true, // Simplified assumption
      canGoForward: false,
    });
  }, [activeTabId, updateTab]);

  const goBack = useCallback(() => {
    const tabHist = history[activeTabId];
    if (!tabHist || tabHist.past.length === 0) return;

    const previousUrl = tabHist.past[tabHist.past.length - 1];
    const newPast = tabHist.past.slice(0, -1);

    setHistory((prev) => ({
      ...prev,
      [activeTabId]: {
        past: newPast,
        current: previousUrl,
        future: [tabHist.current, ...tabHist.future],
      },
    }));

    updateTab(activeTabId, {
      url: previousUrl,
      title: getDisplayTitle(previousUrl),
      canGoBack: newPast.length > 0,
      canGoForward: true,
    });
  }, [activeTabId, history, updateTab]);

  const goForward = useCallback(() => {
    const tabHist = history[activeTabId];
    if (!tabHist || tabHist.future.length === 0) return;

    const nextUrl = tabHist.future[0];
    const newFuture = tabHist.future.slice(1);

    setHistory((prev) => ({
      ...prev,
      [activeTabId]: {
        past: [...tabHist.past, tabHist.current],
        current: nextUrl,
        future: newFuture,
      },
    }));

    updateTab(activeTabId, {
      url: nextUrl,
      title: getDisplayTitle(nextUrl),
      canGoBack: true,
      canGoForward: newFuture.length > 0,
    });
  }, [activeTabId, history, updateTab]);

  const reload = useCallback(() => {
    updateTab(activeTabId, { isLoading: true });
    // In a real Electron app, this would trigger webContents.reload()
    // Here we toggle a dummy state or re-set the URL in the iframe
    const currentUrl = tabs.find(t => t.id === activeTabId)?.url;
    if (currentUrl) {
        // Force React to re-mount iframe or re-trigger load by appending hash or similar? 
        // For simplicity, we just set loading state. The Iframe component will listen to this.
        setTimeout(() => updateTab(activeTabId, { isLoading: false }), 800);
    }
  }, [activeTabId, tabs, updateTab]);

  return {
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
    history,
    updateTab
  };
};