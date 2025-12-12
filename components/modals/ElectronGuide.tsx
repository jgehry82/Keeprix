import React from 'react';
import { X, Terminal, FileCode, Package } from 'lucide-react';

interface ElectronGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ElectronGuide: React.FC<ElectronGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-slate-600 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-black/20">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="text-primary" /> 
            Deployment to Electron
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-slate-300 space-y-6">
          <p className="text-lg">
            This React application acts as the <strong>Renderer Process</strong>. To turn this into a native app for Mac and Windows (like Chrome), follow these steps:
          </p>

          <section>
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2">
              <Terminal size={18} /> 1. Install Electron
            </h3>
            <div className="bg-black/50 p-3 rounded font-mono text-sm border border-slate-700">
              npm install electron electron-builder wait-on concurrently cross-env --save-dev<br/>
              npm install electron-is-dev
            </div>
          </section>

          <section>
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2">
              <FileCode size={18} /> 2. Create `public/electron.js` (Main Process)
            </h3>
            <p className="text-sm mb-2 text-slate-400">This file controls the native window.</p>
            <pre className="bg-black/50 p-3 rounded font-mono text-xs border border-slate-700 overflow-x-auto text-green-400">
{`const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: 'hiddenInset', // Mac-like traffic lights
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // For simple demos
      webviewTag: true, // IMPORTANT: Enables <webview>
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : \`file://\${path.join(__dirname, '../build/index.html')}\`
  );
  
  // Open links in external browser if target="_blank"
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});`}
            </pre>
          </section>

          <section>
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2">
               3. Update `package.json` for Build
            </h3>
            <pre className="bg-black/50 p-3 rounded font-mono text-xs border border-slate-700 overflow-x-auto text-yellow-400">
{`"main": "public/electron.js",
"homepage": "./",
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "electron:dev": "concurrently \"cross-env BROWSER=none npm start\" \"wait-on http://localhost:3000 && electron .\"",
  "electron:pack": "npm run build && electron-builder -c.extraMetadata.main=build/electron.js"
},
"build": {
  "appId": "com.neutron.browser",
  "mac": { "category": "public.app-category.utilities" },
  "win": { "target": "nsis" }
}`}
            </pre>
          </section>

          <section>
             <h3 className="text-white font-semibold flex items-center gap-2 mb-2">
              <AlertCircle size={18} className="text-yellow-500"/> Important Note
            </h3>
            <p className="text-sm">
               In this web preview, we use <code>&lt;iframe&gt;</code>. Real websites (Google, YouTube) block iframes. 
               In the Electron build, replace the <code>iframe</code> in <code>BrowserView.tsx</code> with <code>&lt;webview&gt;</code> to bypass these restrictions and get a full browser engine.
            </p>
          </section>
        </div>
        
        <div className="p-4 border-t border-slate-700 bg-surface flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper for icon
function AlertCircle({ size, className }: { size: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
    )
}
