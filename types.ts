export interface Tab {
  id: string;
  title: string;
  url: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  favicon?: string;
  lastAccessed: number;
}

export interface TabHistory {
  past: string[];
  current: string;
  future: string[];
}

export type Theme = 'dark' | 'light';

export interface BrowserState {
  tabs: Tab[];
  activeTabId: string;
  history: Record<string, TabHistory>;
  theme: Theme;
}
