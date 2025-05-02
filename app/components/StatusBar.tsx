// Path: app/components/StatusBar.tsx
import { useState } from 'react';
// import { MAMMOTH_NAME } from '../constants/mammoth'; // Re-comment if needed, or remove if unused
import MenuModal from './MenuModal';
import CareLogPanel from './CareLogPanel';
import SettingsPanel from './SettingsPanel';
import { londrinaSolid } from '../fonts/fonts';
import { useMammothStore } from '../store/mammothStore';

interface StatusBarProps {
  onOpenCloset: () => void;
}

// Helper to generate conic gradient style
const getConicGradientStyle = (percentage: number, progressColor: string, trackColor: string) => {
  // Clamp percentage
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  return {
    // Offset by -90deg to start from top
    backgroundImage: `conic-gradient(from -90deg, ${progressColor} 0% ${clampedPercentage}%, ${trackColor} ${clampedPercentage}% 100%)`,
  };
};

export default function StatusBar({ onOpenCloset }: StatusBarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showCareLog, setShowCareLog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Get stats from the store
  const { hunger, affection, energy, boredom } = useMammothStore();

  const level = 88;
  const coins = 888888;
  // use name from mammoth store
  const name = useMammothStore.getState().name;
  
  // Define colors
  const trackColor = 'rgb(var(--ui-bg-medium))'; // Use CSS variable for track color
  const hungerColor = '#F59E0B'; // amber-500
  const affectionColor = '#EC4899'; // pink-500
  const energyColor = '#3B82F6'; // blue-500
  const boredomColor = '#A855F7'; // purple-500 (represents "not bored" percentage)

  // Calculate percentages for gradients
  const hungerPercent = hunger;
  const affectionPercent = affection;
  const energyPercent = energy;
  const notBoredPercent = 100 - boredom;

  // Ring thickness (adjust as needed)
  const ringThickness = '3px';

  return (
    <div className="w-full">
      <div className="flex justify-between items-start px-4 py-3 relative">
        {/* === Top-Left Structure === */}
        <div className="relative flex flex-col items-center" style={{ marginLeft: '40px'}}>
          
          {/* SVG for Curved Name Text */}
          <svg viewBox="0 0 120 35" width="120" height="35" className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 overflow-visible">
            <path id="nameCurve" d="M10,30 C40,5 80,5 110,30" fill="transparent" />
            <text dy="-2" className={`text-xl font-bold tracking-wider ${londrinaSolid.className}`} fill="rgb(var(--foreground-rgb))">
              <textPath href="#nameCurve" startOffset="50%" textAnchor="middle">
                {name}
              </textPath>
            </text>
          </svg>

          {/* Central Container for Profile Pic and Stat Icons */}
          <div className="relative w-20 h-20 flex items-center justify-center mt-3">
            {/* Profile Picture Placeholder - Use UI vars */} 
            <div 
              className="w-16 h-16 rounded-full shadow-md flex items-center justify-center"
              style={{
                backgroundColor: 'rgb(var(--ui-bg-light))',
                border: `2px solid rgb(var(--ui-border))`
              }}
            >
              <span className="text-2xl">🐘</span> 
            </div>

            {/* Level Badge (commented out by user) */}
            {/* <div className={`absolute bottom-0 left-0 transform translate-x-[-10px] translate-y-[10px] w-6 h-6 bg-zinc-800 rounded-full border-2 border-zinc-500 flex items-center justify-center text-white text-xs font-bold ${londrinaSolid.className}`}> */}
            {/*   {level} */}
            {/* </div> */}

            {/* Stat Icons - Apply conic gradient via ::before - Use UI vars */} 
            {/* Fork (Hunger) - Add data- Fpr CSS */}
            <div 
              className="stat-icon absolute z-10 flex items-center justify-center w-8 h-8 rounded-full shadow-inner overflow-hidden" // Added overflow-hidden
              data-stat="hunger"
              style={{
                transform: 'translate(-32px, -32px)', 
                '--progress-color': hungerColor, 
                '--track-color': trackColor, 
                '--percentage': `${hungerPercent}%`,
                backgroundColor: 'rgb(var(--ui-bg-medium))', // Use UI var
                border: `1px solid rgba(var(--ui-border), 0.5)` // Use UI var with opacity
              } as React.CSSProperties}
            >
              <span className="text-lg relative z-10">🍴</span> 
            </div>
            {/* Heart (Affection) */}
            <div 
              className="stat-icon absolute z-10 flex items-center justify-center w-8 h-8 rounded-full shadow-inner overflow-hidden"
              data-stat="affection"
              style={{
                transform: 'translate(32px, -32px)', 
                '--progress-color': affectionColor, 
                '--track-color': trackColor, 
                '--percentage': `${affectionPercent}%`,
                backgroundColor: 'rgb(var(--ui-bg-medium))', // Use UI var
                border: `1px solid rgba(var(--ui-border), 0.5)` // Use UI var with opacity
              } as React.CSSProperties}
              >
              <span className="text-lg relative z-10">❤️</span>
            </div>
            {/* Lightning (Energy) */}
            <div 
              className="stat-icon absolute z-10 flex items-center justify-center w-8 h-8 rounded-full shadow-inner overflow-hidden"
              data-stat="energy"
              style={{
                transform: 'translate(-32px, 32px)', 
                '--progress-color': energyColor, 
                '--track-color': trackColor, 
                '--percentage': `${energyPercent}%`,
                backgroundColor: 'rgb(var(--ui-bg-medium))', // Use UI var
                border: `1px solid rgba(var(--ui-border), 0.5)` // Use UI var with opacity
              } as React.CSSProperties}
              >
              <span className="text-lg relative z-10">⚡</span>
            </div>
            {/* Zzz (Boredom) */}
            <div 
              className="stat-icon absolute z-10 flex items-center justify-center w-8 h-8 rounded-full shadow-inner overflow-hidden"
              data-stat="boredom"
              style={{
                transform: 'translate(32px, 32px)', 
                '--progress-color': boredomColor, 
                '--track-color': trackColor, 
                '--percentage': `${notBoredPercent}%`,
                backgroundColor: 'rgb(var(--ui-bg-medium))', // Use UI var
                border: `1px solid rgba(var(--ui-border), 0.5)` // Use UI var with opacity
              } as React.CSSProperties}
              >
              <span className="text-lg relative z-10">😴</span>
            </div>
          </div>
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
            <span>🪙</span>
            <span className={`font-medium text-[#FFD700] ${londrinaSolid.className}`}>{coins.toLocaleString()}</span>
          </button>
        </div>
      </div>

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
      
      {/* Add styles for the conic gradient ring using ::before */}
      <style jsx>{`
        .stat-icon {
          position: absolute; /* Ensure it is positioned correctly */
        }
        .stat-icon::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          padding: ${ringThickness}; /* Control ring thickness */
          background: conic-gradient(from -90deg, var(--progress-color) 0% var(--percentage), var(--track-color) var(--percentage) 100%);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude; 
          -webkit-mask-composite: xor; /* For Safari */
          transition: background 0.3s ease-in-out; /* Animate color change */
        }
      `}</style>
    </div>
  );
}