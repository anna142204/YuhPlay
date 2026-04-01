import { Progress } from "./ui/progress";
import { Flame } from "lucide-react";

interface UserProfileProps {
  xp: number;
  streak: number;
}

export function UserProfile({ xp, streak }: UserProfileProps) {
  const maxXp = 1000;
  const level = Math.floor(xp / 1000) + 1;
  const currentXp = xp % 1000;

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md" style={{ background: 'linear-gradient(135deg, var(--light-blue-300), var(--light-blue-400))' }}>
        <div className="text-4xl">👨‍💼</div>
      </div>
      
      {/* User Info */}
      <div className="text-center">
        <h2 style={{ color: 'var(--black-500)' }}>Léo D.</h2>
        <p className="text-sm" style={{ color: 'var(--black-300)' }}>Level {level} · Beginner</p>
      </div>
      
      {/* XP Progress */}
      <div className="w-full">
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: 'var(--black-400)' }}>XP progress</span>
          <span style={{ color: 'var(--black-400)' }}>{currentXp}/{maxXp}</span>
        </div>
        <Progress value={(currentXp / maxXp) * 100} className="h-2" />
      </div>
      
      {/* Streak */}
      <div className="w-full rounded-lg p-3 flex items-center gap-2" style={{ backgroundColor: 'var(--orange-50)', border: '1px solid var(--orange-100)' }}>
        <Flame className="w-5 h-5" style={{ color: 'var(--orange-500)' }} />
        <span style={{ color: 'var(--black-500)' }}>{streak} day streak</span>
      </div>
    </div>
  );
}