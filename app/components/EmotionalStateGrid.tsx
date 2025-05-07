import React from 'react';
import { useMammothStore, EmotionalState } from '@/app/store/mammothStore';

// Icons for each state
const EMOTION_ICONS = {
  'playful': '🎮',    // High Energy + High Happiness
  'agitated': '😤',   // High Energy + Low Happiness
  'content': '😌',    // Low Energy + High Happiness
  'lethargic': '😔'   // Low Energy + Low Happiness
};

const EMOTION_LABELS = {
  'playful': 'Playful',
  'agitated': 'Agitated',
  'content': 'Content',
  'lethargic': 'Lethargic'
};

const EMOTION_DESCRIPTIONS = {
  'playful': 'Full of energy and very happy',
  'agitated': 'Energetic but unhappy',
  'content': 'Relaxed and happy',
  'lethargic': 'Low energy and unhappy'
};

interface EmotionalStateGridProps {
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const EmotionalStateGrid = ({ 
  showLabels = true, 
  size = 'md',
  className = '' 
}: EmotionalStateGridProps) => {
  // Get state values from store
  const { energy, getHappiness, getEmotionalState } = useMammothStore(state => ({
    energy: state.energy,
    getHappiness: state.getHappiness,
    getEmotionalState: state.getEmotionalState
  }));
  
  const happiness = getHappiness();
  const currentState = getEmotionalState();
  
  // Convert energy and happiness to grid coordinates (0-100)
  const dotPositionX = happiness; // X-axis is happiness
  const dotPositionY = 100 - energy; // Y-axis is energy (inverted as higher is up)
  
  // Determine size
  const dimensions = {
    sm: { size: 120, fontSize: 'text-xs', dot: 6 },
    md: { size: 180, fontSize: 'text-sm', dot: 8 },
    lg: { size: 240, fontSize: 'text-base', dot: 10 }
  }[size];
  
  return (
    <div className={`relative ${className}`}>
      <div 
        className="relative bg-slate-100 rounded-md shadow-md overflow-hidden"
        style={{ width: `${dimensions.size}px`, height: `${dimensions.size}px` }}
      >
        {/* Grid quadrants */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          {/* Playful - Top Right */}
          <div 
            className={`row-start-1 col-start-2 bg-yellow-100 border-b border-l border-slate-300 flex items-center justify-center ${currentState === 'playful' ? 'ring-2 ring-yellow-400' : ''}`}
          >
            <span className="text-2xl">{EMOTION_ICONS.playful}</span>
          </div>
          
          {/* Content - Bottom Right */}
          <div 
            className={`row-start-2 col-start-2 bg-green-100 border-l border-t border-slate-300 flex items-center justify-center ${currentState === 'content' ? 'ring-2 ring-green-400' : ''}`}
          >
            <span className="text-2xl">{EMOTION_ICONS.content}</span>
          </div>
          
          {/* Agitated - Top Left */}
          <div 
            className={`row-start-1 col-start-1 bg-red-100 border-b border-r border-slate-300 flex items-center justify-center ${currentState === 'agitated' ? 'ring-2 ring-red-400' : ''}`}
          >
            <span className="text-2xl">{EMOTION_ICONS.agitated}</span>
          </div>
          
          {/* Lethargic - Bottom Left */}
          <div 
            className={`row-start-2 col-start-1 bg-slate-200 border-t border-r border-slate-300 flex items-center justify-center ${currentState === 'lethargic' ? 'ring-2 ring-slate-400' : ''}`}
          >
            <span className="text-2xl">{EMOTION_ICONS.lethargic}</span>
          </div>
        </div>
        
        {/* Axes labels */}
        {showLabels && (
          <>
            {/* X-axis label (Happiness) */}
            <div className="absolute bottom-1 left-0 right-0 text-center text-slate-500 font-medium">
              <span className={dimensions.fontSize}>Happiness</span>
            </div>
            
            {/* Y-axis label (Energy) */}
            <div 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90"
            >
              <span className={`${dimensions.fontSize} text-slate-500 font-medium whitespace-nowrap`}>
                Energy
              </span>
            </div>
          </>
        )}
        
        {/* Current state indicator dot */}
        <div 
          className="absolute rounded-full bg-purple-500 shadow-sm z-10"
          style={{
            width: `${dimensions.dot}px`,
            height: `${dimensions.dot}px`,
            left: `${dotPositionX}%`,
            top: `${dotPositionY}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
      
      {/* Current state label */}
      {showLabels && (
        <div className="mt-2 text-center">
          <div className={`font-medium ${dimensions.fontSize}`}>
            {EMOTION_LABELS[currentState]} {EMOTION_ICONS[currentState]}
          </div>
          <div className={`text-slate-500 ${dimensions.fontSize === 'text-xs' ? 'text-xs' : 'text-xs'}`}>
            {EMOTION_DESCRIPTIONS[currentState]}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionalStateGrid; 