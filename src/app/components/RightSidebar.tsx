import { Progress } from "./ui/progress";
import { ArrowRight } from "lucide-react";

const mascotImages = {
  positive: new URL("../../assets/yuh-mascot-1.png", import.meta.url).href,
  negative: new URL("../../assets/yuh-mascot-2.png", import.meta.url).href,
  welcoming: new URL("../../assets/yuh-mascot-3.png", import.meta.url).href,
};

function getMascotImage(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("drawdown") ||
    normalized.includes("loss") ||
    normalized.includes("risk") ||
    normalized.includes("volatile") ||
    normalized.includes("caution") ||
    normalized.includes("low liquidity") ||
    normalized.includes("reduce") ||
    normalized.includes("patience") ||
    normalized.includes("down")
  ) {
    return mascotImages.negative;
  }

  if (
    normalized.includes("welcome") ||
    normalized.includes("start here") ||
    normalized.includes("here to help") ||
    normalized.includes("pick a scenario") ||
    normalized.includes("open invest") ||
    normalized.includes("click the invest") ||
    normalized.includes("good start") ||
    normalized.includes("fresh start") ||
    normalized.includes("guide")
  ) {
    return mascotImages.welcoming;
  }

  return mascotImages.positive;
}

interface MissionCardProps {
  missionNumber: number;
  title: string;
  description: string;
  progress: number;
  total: number;
}

export function MissionCard({ missionNumber, title, description, progress, total }: MissionCardProps) {
  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--blue-100)', border: '2px solid var(--blue-300)' }}>
      <p className="text-xs mb-1" style={{ color: 'var(--black-300)' }}>MISSION {missionNumber}</p>
      <h3 style={{ color: 'var(--black-500)' }}>{title}</h3>
      <p className="text-sm mb-3" style={{ color: 'var(--black-300)' }}>{description}</p>
      <div className="flex items-center justify-between mb-2">
        <Progress value={(progress / total) * 100} className="h-2 flex-1 mr-2" />
        <span className="text-xs" style={{ color: 'var(--black-300)' }}>{progress}/{total}</span>
      </div>
    </div>
  );
}

interface InvestButtonProps {
  onClick: () => void;
  highlighted?: boolean;
  disabled?: boolean;
}

export function InvestButton({ onClick, highlighted = false, disabled = false }: InvestButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl py-3 flex items-center justify-center gap-2 transition-all ${
        highlighted ? 'ring-4 ring-orange-400 animate-pulse' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{ 
        backgroundColor: highlighted ? 'var(--orange-400)' : disabled ? 'var(--black-50)' : 'white',
        border: `2px solid ${highlighted ? 'var(--orange-500)' : disabled ? 'var(--black-100)' : 'var(--black-100)'}`,
        color: highlighted ? 'white' : disabled ? 'var(--black-400)' : 'var(--black-500)',
      }}
    >
      INVEST
      <ArrowRight className="w-5 h-5" />
    </button>
  );
}

interface PortfolioCardProps {
  change: number;
  hasData: boolean;
  history: number[];
}

export function PortfolioCard({ change, hasData, history }: PortfolioCardProps) {
  const chartPoints = history.length > 1 ? history : [0, 0.2, 0.1, 0.5, 0.8, 1.2, 1.4];
  const min = Math.min(...chartPoints);
  const max = Math.max(...chartPoints);
  const range = max - min || 1;
  const width = 200;
  const height = 80;
  const stepX = width / Math.max(1, chartPoints.length - 1);
  const path = chartPoints
    .map((point, index) => {
      const x = index * stepX;
      const normalized = (point - min) / range;
      const y = height - normalized * 50 - 10;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="bg-white rounded-xl p-5" style={{ border: '1px solid var(--black-100)' }}>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm" style={{ color: 'var(--black-300)' }}>PORTFOLIO (24H)</span>
        <span className="text-sm" style={{ color: change >= 0 ? 'var(--light-blue-500)' : 'var(--orange-500)' }}>
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </span>
      </div>
      {hasData ? (
        <div className="h-24 relative">
          <svg width="100%" height="100%" viewBox="0 0 200 80">
            <defs>
              <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--light-blue-300)', stopOpacity: 0.5 }} />
                <stop offset="100%" style={{ stopColor: 'var(--light-blue-300)', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <path
              d={`${path} L 200 80 L 0 80 Z`}
              fill="url(#portfolioGradient)"
              stroke="none"
            />
            <path
              d={path}
              fill="none"
              stroke="var(--light-blue-500)"
              strokeWidth="2"
            />
          </svg>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm" style={{ color: 'var(--black-200)' }}>NO DATA</p>
        </div>
      )}
    </div>
  );
}

interface MascotProps {
  message: string;
}

export function Mascot({ message }: MascotProps) {
  const mascotImg = getMascotImage(message);

  return (
    <div className="relative h-[210px] w-full max-w-[290px] overflow-visible">
      <div
        className="absolute left-3 top-0 max-w-[195px] rounded-[28px] rounded-br-md px-4 py-4"
        style={{
          background: 'white',
          border: '2px solid var(--light-blue-300)',
        }}
      >
        <p className="text-sm leading-relaxed" style={{ color: 'var(--black-500)' }}>
          {message}
        </p>
      </div>

      <img
        src={mascotImg}
        alt="Mascot"
        className="absolute bottom-0 right-[-70px] h-50 w-50 select-none"
      />
    </div>
  );
}