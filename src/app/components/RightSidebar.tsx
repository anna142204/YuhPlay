import { Progress } from "./ui/progress";
import { ArrowRight } from "lucide-react";
import mascotImg from "figma:asset/160b9e358a268764c5321a85b6cb2558abeea8c9.png";

interface MissionCardProps {
  missionNumber: number;
  title: string;
  description: string;
  progress: number;
  total: number;
}

export function MissionCard({ missionNumber, title, description, progress, total }: MissionCardProps) {
  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--light-purple-300)', border: '1px solid var(--light-purple-400)' }}>
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
}

export function InvestButton({ onClick, highlighted = false }: InvestButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`w-full rounded-xl py-4 flex items-center justify-center gap-2 transition-all ${
        highlighted ? 'ring-4 ring-orange-400 animate-pulse' : ''
      }`}
      style={{ 
        backgroundColor: highlighted ? 'var(--orange-400)' : 'white',
        border: `2px solid ${highlighted ? 'var(--orange-500)' : 'var(--black-100)'}`,
        color: highlighted ? 'white' : 'var(--black-500)',
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
}

export function PortfolioCard({ change, hasData }: PortfolioCardProps) {
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
              d="M 0 60 Q 50 50, 100 40 T 200 30"
              fill="url(#portfolioGradient)"
              stroke="none"
            />
            <path
              d="M 0 60 Q 50 50, 100 40 T 200 30"
              fill="none"
              stroke="var(--light-blue-500)"
              strokeWidth="2"
            />
          </svg>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm" style={{ color: 'var(--black-200)' }}>AUCUNE DONNÉE</p>
        </div>
      )}
    </div>
  );
}

interface MascotProps {
  message: string;
}

export function Mascot({ message }: MascotProps) {
  return (
    <div className="flex items-end gap-3">
      <div className="rounded-2xl rounded-bl-none p-4 max-w-[200px]" style={{ backgroundColor: 'var(--light-purple-300)', border: '2px solid var(--light-purple-400)' }}>
        <p className="text-sm" style={{ color: 'var(--black-500)' }}>
          {message}
        </p>
      </div>
      <img src={mascotImg} alt="Mascot" className="w-16 h-16 mb-[-10px]" />
    </div>
  );
}