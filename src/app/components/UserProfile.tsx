import { User } from "lucide-react";

interface UserProfileProps {
  xp: number;
}

export function UserProfile({ xp }: UserProfileProps) {
  const maxXp = 1000;
  const level = Math.floor(xp / 1000) + 1;
  const currentXp = xp % 1000;
  const xpProgress = Math.min(100, (currentXp / maxXp) * 100);

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md" style={{ background: 'linear-gradient(135deg, var(--light-blue-300), var(--light-blue-400))' }}>
        <div><User size={50} color="purple"/></div>
      </div>
      
      {/* User Info */}
      <div className="text-center">
        <h2 style={{ color: 'var(--black-500)' }}>Leo D.</h2>
        <p className="text-md" style={{ color: 'var(--black-300)' }}>Level {level} · Beginner</p>
      </div>
      
      {/* XP Progress */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2" style={{ color: 'var(--black-400)' }}>
          <span className="text-[16px] font-medium leading-none" style={{ color: 'var(--black-400)' }}>XP progress</span>
          <span className="text-[16px] font-medium leading-none" style={{ color: 'var(--black-400)' }}>{currentXp}/{maxXp}</span>
        </div>
        <div className="relative h-[16px] w-full overflow-hidden rounded-[21px]" style={{ backgroundColor: 'var(--orange-100)', border: '1px solid var(--orange-400)' }}>
          <div
            className="h-full rounded-[21px]"
            style={{
              width: `${xpProgress}%`,
              backgroundColor: 'var(--orange-400)',
            }}
          />
        </div>
      </div>
    </div>
  );
}