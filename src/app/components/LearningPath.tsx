import { MoveDownRight, Shield, Sprout, Star, Lock} from "lucide-react";
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
  onChestClick: () => void;
  unitsProgress: UnitProgress[];
}

export function LearningPath({ onUnitClick, onChestClick, unitsProgress }: LearningPathProps) {
  const pathShape = "M115.201 16C115.201 16 39.9997 90.4839 29.9995 159.484C19.9993 228.484 115.201 273.984 115.201 273.984C115.201 273.984 203.499 309.984 203.499 380.984C203.499 451.984 115.201 487.484 115.201 487.484C115.201 487.484 16.0001 553.984 16 614.484C15.9999 674.984 75.9015 684.484 115.201 708.984C154.5 733.484 155 779.484 147.5 822.984C140 866.484 90.4999 936.984 90.4999 936.984";

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
      icon: <MoveDownRight className="w-8 h-8" style={{ color: 'var(--orange-500)' }} />,
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

  const rows = [
    { top: 2.8, side: "left", textWidth: 30.0, gap: 3.5 },
    { top: 18.1, side: "right", textWidth: 30.0, gap: 3.5 },
    { top: 33.4, side: "left", textWidth: 40.0, gap: 3.5 },
    { top: 48.8, side: "right", textWidth: 40.0, gap: 3.5 },
  ] as const;

  const highlightedSegments = [
    { fromUnit: 1, start: 7, end: 28 },
    { fromUnit: 2, start: 30, end: 50 },
    { fromUnit: 3, start: 56, end: 80 },
    { fromUnit: 4, start: 80, end: 97 },
  ] as const;

  return (
    <div className="px-4 py-2">
      <div className="relative mx-auto w-full max-w-[580px] aspect-[723/1254]">
      {/* SVG Path from Figma node 6:4 */}
      <svg
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        width="220.499"
        height="955.985"
        viewBox="0 0 220.499 955.985"
        preserveAspectRatio="none"
        style={{
          top: "4.8%",
          width: "25.93%",
          height: "68.5%",
        }}
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#C9E8F5', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#CCB1DA', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path
          d={pathShape}
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {highlightedSegments.map((segment) => {
          const fromUnitProgress = unitsProgress.find((u) => u.unitId === segment.fromUnit);
          if (!fromUnitProgress?.completed) {
            return null;
          }

          const segmentLength = segment.end - segment.start;

          return (
            <path
              key={segment.fromUnit}
              d={pathShape}
              fill="none"
              stroke="var(--orange-400)"
              strokeWidth="28"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={100}
              strokeDasharray={`${segmentLength} 100`}
              strokeDashoffset={-segment.start}
            />
          );
        })}
      </svg>

      {/* Units */}
      <div className="absolute inset-0 z-10">
        {units.map((unit, index) => {
          const unlocked = isUnitUnlocked(unit.id);
          const completed = isUnitCompleted(unit.id);
          const row = rows[index];
          const borderColor = !unlocked
            ? 'var(--black-200)'
            : completed
              ? 'var(--orange-400)'
              : 'var(--light-blue-400)';
          
          return (
            <div key={unit.id}>
              <div
                className={row.side === "left" ? "absolute text-right" : "absolute text-left"}
                style={
                  row.side === "left"
                    ? {
                        top: `calc(${row.top}% + 4.4%)`,
                        right: `calc(50% + 8.30% + ${row.gap}%)`,
                        width: `${row.textWidth}%`,
                        transform: 'translateY(-50%)',
                      }
                    : {
                        top: `calc(${row.top}% + 4.4%)`,
                        left: `calc(50% + 8.30% + ${row.gap}%)`,
                        width: `${row.textWidth}%`,
                        transform: 'translateY(-50%)',
                      }
                }
              >
                <p className="mb-0.5 text-[clamp(10px,1.25vw,13px)] leading-tight" style={{ color: 'var(--black-300)' }}>{unit.title}</p>
                <h3 className="mb-0.5 text-[clamp(16px,2vw,21px)] leading-tight" style={{ color: 'var(--black-500)' }}>{unit.subtitle}</h3>
                <p className="text-[clamp(10px,1.25vw,13px)] leading-tight" style={{ color: 'var(--black-300)' }}>
                  {unit.lessons} lessons {completed && '· Completed ✓'}
                </p>
              </div>

              {/* Icon Circle */}
              <button
                onClick={() => unlocked && onUnitClick(unit.id)}
                disabled={!unlocked}
                className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-[var(--light-blue-100)] flex items-center justify-center shadow-xl transition-all ${
                  !unlocked ? 'cursor-not-allowed' : 'hover:scale-110 cursor-pointer'
                }`}
                style={{ 
                  top: `${row.top}%`,
                  width: '15.4%',
                  aspectRatio: '1 / 1',
                  backgroundColor: '#dfe6ea',
                  border: `4px solid ${borderColor}`,
                }}
              >
                {!unlocked ? (
                  <span className="text-[clamp(20px,3.4vw,34px)]"><Lock color="var(--black-300)"/></span>
                ) : completed ? (
                  <>
                    {unit.icon}
                    <div 
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: 'var(--orange-400)' }}
                    >
                      <span className="text-white text-sm">✓</span>
                    </div>
                  </>
                ) : (
                  unit.icon
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Treasure Chest at Bottom */}
      <button
        type="button"
        onClick={onChestClick}
        className="absolute left-1/2 -translate-x-1/2 z-10 w-[17.36%] aspect-square hover:scale-110 transition-transform cursor-pointer"
        style={{ top: '65%' }}
      >
        <TreasureChest />
      </button>
      </div>
    </div>
  );
}