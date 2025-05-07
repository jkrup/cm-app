// Path: app/components/CircularStats.tsx
import React, { useState, useEffect, useRef } from 'react';
import Mammoth from './Mammoth';
import { happyMonkey } from '../fonts/fonts';
import { getMammothMood } from '@/app/utils/getMood';
import { useMammothStore } from '@/app/store/mammothStore';
import EmotionalStateGrid from './EmotionalStateGrid';

// Define costume types
type CostumeType = null | 'angel' | 'devil' | 'magician' | 'bday-hat' | 'beach' | 
                  'bucket' | 'cowboy' | 'pirate' | 'sailor' | 'winter' | 
                  'wizard' | 'viking';

interface CircularStatsProps {
  isGrooming: boolean;
  onGroomComplete: () => void;
  onFeedClick: () => void;
  onGroomClick: () => void;
  onPlayClick: () => void;
  isFeeding: boolean;
  hideMammothDuringFeeding: boolean;
  onMammothLongPress: () => void;
  showMoodText: boolean;
  currentCostume: CostumeType | null;
}

const CircularStats: React.FC<CircularStatsProps> = ({
  isGrooming,
  onGroomComplete,
  onFeedClick,
  onGroomClick,
  onPlayClick,
  isFeeding,
  hideMammothDuringFeeding,
  onMammothLongPress,
  showMoodText = true,
  currentCostume = null
}) => {
  // Track animation states for energy and happiness
  const [energyChanged, setEnergyChanged] = useState(false);
  const [happinessChanged, setHappinessChanged] = useState(false);
  const [showEmotionalGrid, setShowEmotionalGrid] = useState(false);

  // Force re-render on store changes
  const [, forceUpdate] = useState({});

  // Get current metrics from store
  const { energy, getHappiness, getEmotionalState } = useMammothStore(state => ({
    energy: state.energy,
    getHappiness: state.getHappiness,
    getEmotionalState: state.getEmotionalState
  }));
  
  const happiness = getHappiness();
  const emotionalState = getEmotionalState();
  
  // Track previous values to detect changes
  const prevEnergyRef = useRef(energy);
  const prevHappinessRef = useRef(happiness);

  // Detect changes in energy
  useEffect(() => {
    if (energy > prevEnergyRef.current) {
      setEnergyChanged(true);
      const timer = setTimeout(() => setEnergyChanged(false), 6000); // Animation duration 6s
      prevEnergyRef.current = energy;
      return () => clearTimeout(timer);
    } else if (energy !== prevEnergyRef.current) {
      // Just update the ref without animation if decreasing
      prevEnergyRef.current = energy;
    }
  }, [energy]);

  // Detect changes in happiness
  useEffect(() => {
    if (happiness > prevHappinessRef.current) {
      setHappinessChanged(true);
      const timer = setTimeout(() => setHappinessChanged(false), 6000); // Animation duration 6s
      prevHappinessRef.current = happiness;
      return () => clearTimeout(timer);
    } else if (happiness !== prevHappinessRef.current) {
      // Just update the ref without animation if decreasing
      prevHappinessRef.current = happiness;
    }
  }, [happiness]);

  // Subscribe to store changes to keep UI in sync
  useEffect(() => {
    const unsubscribe = useMammothStore.subscribe(() => {
      forceUpdate({});
    });
    
    return () => unsubscribe();
  }, []);

  // Convert percentage to angle for the arcs
  const energyAngle = (energy / 100) * 120;
  const happinessAngle = (happiness / 100) * 120;

  // Calculate SVG arc paths
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise = false) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? "0" : "1";
    const sweepFlag = anticlockwise ? "1" : "0";

    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y
    ].join(" ");
  };

  // Energy arc (blue): starts at -135° (top left), extends clockwise
  const energyStart = -155;
  const energyEnd = energyStart + energyAngle;
  const energyPath = describeArc(0, 0, 100, energyStart, energyEnd);

  // Happiness arc (green): starts at -45° (top right), extends counterclockwise
  const happinessStart = 155;
  const happinessEnd = happinessStart - happinessAngle;
  const happinessPath = describeArc(0, 0, 100, happinessStart, happinessEnd, true);

  // Get all status from the store
  const { hunger, boredom, affection } = useMammothStore(state => ({
    hunger: state.hunger,
    boredom: state.boredom,
    affection: state.affection
  }));

  // Toggle emotional grid visibility
  const toggleEmotionalGrid = () => {
    setShowEmotionalGrid(!showEmotionalGrid);
  };

  // Get mood class based on emotional state
  const getMoodClass = () => {
    if (isFeeding) return 'mood-hungry';
    if (energy < 15) return 'mood-sleepy';
    
    switch (emotionalState) {
      case 'playful': return 'mood-playful';
      case 'agitated': return 'mood-agitated';
      case 'content': return 'mood-content';
      case 'lethargic': return 'mood-lethargic';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Circular Stats Component */}
      <div className={`relative w-full aspect-square ${getMoodClass()}`}>
        <svg viewBox="-120 -120 240 240" className="w-full h-full">
          {/* Energy meter (blue) */}
          <path
            d={energyPath}
            fill="none"
            className={`stroke-[#3498db] ${energyChanged ? 'animate-stat-pulse' : 'opacity-20'}`}
            strokeWidth="12"
            strokeLinecap="round"
            filter="drop-shadow(0 0 3px #3498db80)"
          />

          {/* Happiness meter (green) */}
          <path
            d={happinessPath}
            fill="none"
            className={`stroke-[#2ecc71] ${happinessChanged ? 'animate-stat-pulse' : 'opacity-20'}`}
            strokeWidth="12"
            strokeLinecap="round"
            filter="drop-shadow(0 0 3px #2ecc7180)"
          />
          
          {/* Energy and Happiness labels */}
          <text x="-110" y="-75" className="fill-[#3498db] text-[10px] font-medium">ENERGY</text>
          <text x="75" y="-75" className="fill-[#2ecc71] text-[10px] font-medium">HAPPINESS</text>
        </svg>

        {/* Center content (mammoth) */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          {isGrooming && <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse z-10"></div>}
          {!hideMammothDuringFeeding && (
            <Mammoth 
              happiness={happiness} 
              isGrooming={isGrooming}
              onGroomComplete={onGroomComplete}
              onLongPress={onMammothLongPress}
              currentCostume={currentCostume}
              isFeeding={isFeeding}
            />
          )}
        </div>
        
        {/* Emotional State Grid Button (top right) */}
        <button 
          onClick={toggleEmotionalGrid}
          className="absolute top-2 right-2 bg-[#1A2845]/30 hover:bg-[#1A2845]/50 p-2 rounded-full z-30"
        >
          <span role="img" aria-label="Emotional Grid">📊</span>
        </button>
        
        {/* Emotional State Grid (pop-up) */}
        {showEmotionalGrid && (
          <div className="absolute top-[10%] right-[10%] z-40 bg-[#1A2845]/90 p-4 rounded-xl shadow-lg border border-[#3498db]/50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[#D6ECF0] font-medium">Emotional State</h3>
              <button 
                onClick={toggleEmotionalGrid}
                className="text-[#D6ECF0] opacity-70 hover:opacity-100"
              >
                ×
              </button>
            </div>
            <EmotionalStateGrid size="md" />
          </div>
        )}

        {/* Status text - only show if showMoodText is true */}
        {showMoodText && (
          <div className="absolute bottom-5 left-0 right-0 text-center">
            <div className={`font-medium text-lg text-[#D6ECF0] ${happyMonkey.className}`}>
              {getMammothMood({
                energy, 
                happiness, 
                hunger, 
                boredom, 
                affection,
                isFeeding,
                emotionalState
              }).text}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes statPulse {
          0% { opacity: 1; }
          20% { opacity: 0.9; }
          40% { opacity: 0.8; }
          60% { opacity: 0.6; }
          80% { opacity: 0.4; }
          100% { opacity: 0.2; }
        }
        
        .animate-stat-pulse {
          animation: statPulse 6s cubic-bezier(0.2, 0, 0.1, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default CircularStats;