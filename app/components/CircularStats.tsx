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