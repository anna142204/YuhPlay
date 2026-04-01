import { Sprout, Shield, TrendingDown, Star } from "lucide-react";
import TreasureChest from "../../imports/Group5/Group5";

interface UnitProgress {
  unitId: number;
  completed: boolean;
  quizCompleted: boolean;
  lessonCompleted: boolean;
}

interface Unit {
  id: number;
  title: string;
  subtitle: string;
  lessons: number;
  icon: React.ReactNode;
}

interface LearningPathProps {
  onUnitClick: (unitId: number) => void;
  unitsProgress: UnitProgress[];
}

export function LearningPath({ onUnitClick, unitsProgress }: LearningPathProps) {
  const units: Unit[] = [
    {
      id: 1,
      title: "Unit 1",
      subtitle: "First steps",
      lessons: 3,
      icon: <Sprout className="w-8 h-8" style={{ color: 'var(--orange-500)' }} />,
    },
    {
      id: 2,
      title: "Unit 2",
      subtitle: "Swiss shield",
      lessons: 4,
      icon: <Shield className="w-8 h-8" style={{ color: 'var(--orange-500)' }} />,
    },
    {
      id: 3,
      title: "Unit 3",
      subtitle: "Market crash survival",
      lessons: 3,
      icon: <TrendingDown className="w-8 h-8" style={{ color: 'var(--orange-500)' }} />,
    },
    {
      id: 4,
      title: "Unit 4",
      subtitle: "Advanced strategies",
      lessons: 3,
      icon: <Star className="w-8 h-8" style={{ color: 'var(--orange-500)' }} />,
    },
  ];

  const isUnitUnlocked = (unitId: number) => {
    if (unitId === 1) return true;
    const previousUnit = unitsProgress.find(u => u.unitId === unitId - 1);
    return previousUnit?.completed || false;
  };

  const isUnitCompleted = (unitId: number) => {
    const unit = unitsProgress.find(u => u.unitId === unitId);
    return unit?.completed || false;
  };

  return (
    <div className="flex flex-col items-center py-12 px-8 relative min-h-full">
      {/* SVG Path */}
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/2"
        width="400"
        height="100%"
        viewBox="0 0 400 1000"
        preserveAspectRatio="xMidYMid meet"
        style={{ minHeight: '100%' }}
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#C9E8F5', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#CCB1DA', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="pathShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="3" stdDeviation="0" floodOpacity="0.25" />
          </filter>
        </defs>
        <path
          d="M 200 20 
             C 200 20, 80 110, 60 180
             C 40 250, 200 295, 200 295
             C 200 295, 340 335, 340 420
             C 340 505, 200 545, 200 545
             C 200 545, 30 615, 30 685
             C 30 755, 130 770, 200 800
             C 270 830, 270 885, 255 940
             C 240 980, 160 1000, 160 1000"
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="32"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#pathShadow)"
        />
      </svg>

      {/* Units */}
      <div className="flex flex-col gap-24 relative z-10 mt-12">
        {units.map((unit, index) => {
          const unlocked = isUnitUnlocked(unit.id);
          const completed = isUnitCompleted(unit.id);
          
          return (
            <div key={index} className="flex items-center gap-8">
              {/* Icon Circle */}
              <button
                onClick={() => unlocked && onUnitClick(unit.id)}
                disabled={!unlocked}
                className={`relative w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-xl transition-all ${
                  !unlocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'
                }`}
                style={{ 
                  border: `5px solid ${
                    !unlocked ? 'var(--black-200)' : 
                    completed ? 'var(--orange-400)' :
                    'var(--light-blue-400)'
                  }`,
                }}
              >
                {!unlocked ? (
                  <span className="text-4xl">🔒</span>
                ) : completed ? (
                  <>
                    {unit.icon}
                    <div 
                      className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: 'var(--orange-400)' }}
                    >
                      <span className="text-white text-xl">✓</span>
                    </div>
                  </>
                ) : (
                  unit.icon
                )}
              </button>
              
              {/* Unit Info */}
              <div className={index % 2 === 0 ? "text-left" : "text-right order-first"}>
                <p className="text-sm mb-1" style={{ color: 'var(--black-300)' }}>{unit.title}</p>
                <h3 className="text-xl mb-1" style={{ color: 'var(--black-500)' }}>{unit.subtitle}</h3>
                <p className="text-sm" style={{ color: 'var(--black-200)' }}>
                  {unit.lessons} lessons {completed && '· Completed ✓'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Treasure Chest at Bottom */}
      <div className="mt-16 relative z-10 w-32 h-32 hover:scale-110 transition-transform cursor-pointer">
        <TreasureChest />
      </div>
    </div>
  );
}