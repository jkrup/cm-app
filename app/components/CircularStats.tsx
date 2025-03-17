// Path: app/components/CircularStats.tsx
import React from 'react';
import Mammoth from './Mammoth';
import { MAMMOTH_NAME } from '../constants/mammoth';
import { happyMonkey } from '../fonts/fonts';

interface CircularStatsProps {
  excitement: number;
  happiness: number;
  isGrooming: boolean;
  onGroomComplete: () => void;
  onFeedClick?: () => void;
  onGroomClick?: () => void;
  onPlayClick?: () => void;
  isFeeding?: boolean;
  hideMammothDuringFeeding?: boolean;
  onMammothLongPress: () => void;
  showMoodText?: boolean;
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
  showMoodText = true
}) => {
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

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Circular Stats Component */}
      <div className="relative w-full aspect-square">
        <svg viewBox="-120 -120 240 240" className="w-full h-full">
          {/* Background circle */}
          <circle
            cx="0"
            cy="0"
            r="100"
            fill="none"
            className="stroke-[#1A2845]"
            strokeWidth="12"
          />

          {/* Excitement meter (blue) */}
          <path
            d={excitementPath}
            fill="none"
            className="stroke-[#3498db]"
            strokeWidth="12"
            strokeLinecap="round"
            filter="drop-shadow(0 0 3px #3498db80)"
          />

          {/* Happiness meter (green) */}
          <path
            d={happinessPath}
            fill="none"
            className="stroke-[#2ecc71]"
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
            />
          )}
        </div>

        {/* Status text - only show if showMoodText is true */}
        {showMoodText && (
          <div className="absolute bottom-5 left-0 right-0 text-center">
            <div className={`font-medium text-lg text-[#D6ECF0] ${happyMonkey.className}`}>
              {getMoodText(excitement, happiness)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper to determine mood text
const getMoodText = (excitement: number, happiness: number) => {
  const avgMood = (excitement + happiness) / 2;
  
  if (avgMood > 75) return `${MAMMOTH_NAME} is very happy!`;
  if (avgMood > 50) return `${MAMMOTH_NAME} is content.`;
  if (avgMood > 25) return `${MAMMOTH_NAME} is a bit bored.`;
  return `${MAMMOTH_NAME} needs attention!`;
};

export default CircularStats;