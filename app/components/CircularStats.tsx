// Path: app/components/CircularStats.tsx
import React from 'react';
import Mammoth from './Mammoth';

interface CircularStatsProps {
  excitement: number;
  happiness: number;
  isGrooming: boolean;
  onGroomComplete: () => void;
  onFeedClick?: () => void;
  onGroomClick?: () => void;
  onPlayClick?: () => void;
  isFeeding?: boolean;
  onMammothLongPress: () => void;
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
  onMammothLongPress
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
    <div className="relative w-full aspect-square max-w-md mx-auto">
      <svg viewBox="-120 -120 240 240" className="w-full h-full">
        {/* Background circle */}
        <circle
          cx="0"
          cy="0"
          r="100"
          fill="none"
          className="stroke-gray-200"
          strokeWidth="12"
        />

        {/* Excitement meter (blue) */}
        <path
          d={excitementPath}
          fill="none"
          className="stroke-blue-500"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Happiness meter (green) */}
        <path
          d={happinessPath}
          fill="none"
          className="stroke-green-500"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Center circle */}
        <circle
          cx="0"
          cy="0"
          r="40"
          className="fill-white stroke-gray-200"
        />

        {/* Centered Foreign Object for Mammoth Component */}
        <foreignObject x="-60" y="-60" width="120" height="120">
          <div className="w-full h-full flex items-center justify-center">
            <Mammoth
              excitement={excitement}
              happiness={happiness}
              isGrooming={isGrooming}
              onGroomComplete={onGroomComplete}
              onLongPress={onMammothLongPress}
            />
          </div>
        </foreignObject>
      </svg>

      {/* Interaction buttons positioned higher */}
      <div className="absolute inset-0 pointer-events-none">
        {onGroomClick && (
          <button
            onClick={onGroomClick}
            disabled={isGrooming || isFeeding}
            className={`absolute left-1/4 top-[5%] transform -translate-x-1/2 -translate-y-1/2 
              w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center
              pointer-events-auto
              ${isGrooming ? 'bg-primary/10' : 'hover:bg-gray-50 active:bg-gray-100'}`}
          >
            <span className="text-xl">🧹</span>
          </button>
        )}

        {onFeedClick && (
          <button
            onClick={onFeedClick}
            disabled={isGrooming || isFeeding}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
              w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center
              pointer-events-auto"
          >
            <span className="text-2xl">🍎</span>
          </button>
        )}

        {onPlayClick && (
          <button
            onClick={onPlayClick}
            disabled={isGrooming || isFeeding}
            className={`absolute right-1/4 top-[5%] transform translate-x-1/2 -translate-y-1/2 
              w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center
              pointer-events-auto
              hover:bg-gray-50 active:bg-gray-100 transition-all`}
          >
            <span className="text-xl">🎮</span>
          </button>
        )}
      </div>

      {/* Bottom stats section with increased margin */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pb-8">
        <div className="text-center">
          <div className="text-sm text-gray-600">{excitement.toFixed(1)}%</div>
          <div className="text-xs text-gray-600">Excitement</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">{happiness.toFixed(1)}%</div>
          <div className="text-xs text-gray-600">Happiness</div>
        </div>
      </div>

      {isGrooming && (
        <div className="absolute bottom-0 left-0 right-0 text-center pb-2 text-gray-600">
          Rub the mammoth to groom!
        </div>
      )}

      {!isGrooming && (
        <div className="absolute bottom-0 left-0 right-0 text-center pb-2 text-gray-600">
          {excitement > 75 || happiness > 75 ? "Your mammoth is very happy!" :
            excitement > 50 || happiness > 50 ? "Your mammoth is content." :
              "Your mammoth needs attention!"}
        </div>
      )}
    </div>
  );
};

export default CircularStats;