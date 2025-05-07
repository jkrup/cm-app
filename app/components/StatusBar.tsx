// Path: app/components/StatusBar.tsx
import { useState } from 'react';
import { MAMMOTH_NAME } from '../constants/mammoth';
import MenuModal from './MenuModal';
import CareLogPanel from './CareLogPanel';
import SettingsPanel from './SettingsPanel';

interface StatusBarProps {
  onOpenCloset: () => void;
}

export default function StatusBar({ onOpenCloset }: StatusBarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showCareLog, setShowCareLog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const level = 5;
  const coins = 250;

  return (
    <div className="w-full bg-[#0D1425] shadow-lg border-b border-[#2A3A60]">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex flex-col">
          <h1 
            className="text-xl font-bold cursor-pointer" 
            style={{
              background: "linear-gradient(to bottom, rgb(110, 203, 220), rgb(56, 152, 184))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textShadow: "0 2px 4px rgba(40, 180, 220, 0.3)"
            }}
            onClick={() => setShowMenu(true)}
          >
            {MAMMOTH_NAME}
          </h1>
          <div className="text-sm text-[#6ECBDC]">Level {level}</div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Settings button */}
          <button 
            onClick={() => setShowSettings(true)}
            className="text-[#6ECBDC] hover:text-white"
            aria-label="Settings"
          >
            ⚙️
          </button>
          
          {/* Care Log button */}
          <button 
            onClick={() => setShowCareLog(true)}
            className="relative p-2 text-[#6ECBDC] hover:text-white"
            aria-label="Care Log"
          >
            📖
          </button>
          
          {/* Coins button (closet) */}
          <button 
            onClick={onOpenCloset}
            className="flex items-center gap-2 bg-[#1A2845] p-2 rounded-full px-3 shadow-inner 
                      hover:bg-[#1F3258] active:bg-[#1A2845] transition-colors cursor-pointer"
          >
            <span>💰</span>
            <span className="font-medium text-[#FFD700]">{coins}</span>
          </button>
        </div>
      </div>

      {/* Menu Modal */}
      <MenuModal isOpen={showMenu} onClose={() => setShowMenu(false)} />
      
      {/* Care Log Panel */}
      <CareLogPanel 
        isOpen={showCareLog} 
        onClose={() => setShowCareLog(false)} 
      />
      
      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}