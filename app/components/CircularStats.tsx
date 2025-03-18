// Path: app/components/CircularStats.tsx
import React, { useState, useEffect, useRef } from 'react';
import Mammoth from './Mammoth';
import { happyMonkey } from '../fonts/fonts';
import { getMammothMood } from '@/app/utils/getMood';
import { useMammothStore } from '@/app/store/mammothStore';

// Define costume types
type CostumeType = null | 'angel' | 'devil' | 'magician' | 'bday-hat' | 'beach' | 
                  'bucket' | 'cowboy' | 'pirate' | 'sailor' | 'winter' | 
                  'wizard' | 'viking';

interface CircularStatsProps {
  excitement: number;
  happiness: number;
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
  excitement,
  happiness,
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
  // Track previous values to detect changes
  const prevExcitementRef = useRef(excitement);
  const prevHappinessRef = useRef(happiness);
  
  // State to track when stats have changed
  const [excitementChanged, setExcitementChanged] = useState(false);
  const [happinessChanged, setHappinessChanged] = useState(false);

  // Force re-render on store changes
  const [, forceUpdate] = useState({});

  // Detect changes in stats
  useEffect(() => {
    if (excitement > prevExcitementRef.current) {
      setExcitementChanged(true);
      const timer = setTimeout(() => setExcitementChanged(false), 6000); // Animation duration doubled to 6s
      prevExcitementRef.current = excitement;
      return () => clearTimeout(timer);
    } else if (excitement !== prevExcitementRef.current) {
      // Just update the ref without animation if decreasing
      prevExcitementRef.current = excitement;
    }
  }, [excitement]);

  useEffect(() => {
    if (happiness > prevHappinessRef.current) {
      setHappinessChanged(true);
      const timer = setTimeout(() => setHappinessChanged(false), 6000); // Animation duration doubled to 6s
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
  const excitementAngle = (excitement / 100) * 120;
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

  // Excitement arc (blue): starts at -135° (top left), extends clockwise
  const excitementStart = -155;
  const excitementEnd = excitementStart + excitementAngle;
  const excitementPath = describeArc(0, 0, 100, excitementStart, excitementEnd);

  // Happiness arc (green): starts at -45° (top right), extends counterclockwise
  const happinessStart = 155;
  const happinessEnd = happinessStart - happinessAngle;
  const happinessPath = describeArc(0, 0, 100, happinessStart, happinessEnd, true);

  // Get all status from the store
  const { hunger, energy, boredom, affection } = useMammothStore.getState();

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Circular Stats Component */}
      <div className="relative w-full aspect-square">
        <svg viewBox="-120 -120 240 240" className="w-full h-full">
          {/* Background circle */}
          {/* <circle
            cx="0"
            cy="0"
            r="100"
            fill="none"
            className="stroke-[#1A2845]"
            strokeWidth="12"
          /> */}

          {/* Excitement meter (blue) */}
          <path
            d={excitementPath}
            fill="none"
            className={`stroke-[#3498db] ${excitementChanged ? 'animate-stat-pulse' : 'opacity-20'}`}
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
        </svg>

        {/* Center content (mammoth) */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          {isGrooming && <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse z-10"></div>}
          {!hideMammothDuringFeeding && (
            <Mammoth 
              excitement={excitement} 
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
                excitement, 
                happiness, 
                hunger, 
                energy, 
                boredom, 
                affection,
                isFeeding
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