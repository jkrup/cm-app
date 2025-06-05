// Path: app/components/StatusBar.tsx
import { useMammothStore } from '../store/mammothStore';
import Image from 'next/image';
import { londrinaSolid } from '../fonts/fonts';

interface StatusBarProps {
  onOpenCloset: () => void;
}

interface StatDisplayProps {
  percentage: number;
  icon: string;
  progressColor: string;
}

const StatDisplay: React.FC<StatDisplayProps> = ({ percentage, icon, progressColor }) => {
  const trackColor = 'rgba(0, 0, 0, 0.2)';
  const ringThickness = '4px';

  return (
    <div className="flex items-center gap-2">
      <div
        className="relative w-12 h-12 rounded-full flex items-center justify-center"
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            padding: ringThickness,
            background: `conic-gradient(from -90deg, ${progressColor} 0% ${percentage}%, ${trackColor} ${percentage}% 100%)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
        <Image src={icon} alt="stat" width={24} height={24} className="z-10" />
      </div>
    </div>
  );
};

export default function StatusBar({ onOpenCloset }: StatusBarProps) {
  const { energy, getHappiness } = useMammothStore();
  const happiness = getHappiness();
  const coins = 888888;

  return (
    <div className="w-full flex justify-between items-center px-4 py-2">
      <div className="flex items-center gap-4">
        <StatDisplay
          percentage={energy}
          icon="/energy-icon.webp"
          progressColor="#F59E0B"
        />
        <StatDisplay
          percentage={happiness}
          icon="/mood.webp"
          progressColor="#8B5CF6"
        />
      </div>
      <button
        onClick={onOpenCloset}
        className="flex items-center gap-2 bg-white/90 p-2 rounded-full px-4 shadow-md"
      >
        <span className="text-2xl">⭐</span>
        <span className={`text-2xl font-bold text-gray-800 ${londrinaSolid.className}`}>{coins.toLocaleString()}</span>
      </button>
    </div>
  );
}