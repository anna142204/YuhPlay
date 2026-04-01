import { BookOpen, Briefcase, Trophy, Gift } from "lucide-react";
import { cn } from "./ui/utils";

interface NavigationItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface NavigationProps {
  onRewardsClick: () => void;
}

export function Navigation({ onRewardsClick }: NavigationProps) {
  const items: NavigationItem[] = [
    { icon: <BookOpen className="w-5 h-5" />, label: "Learning path", active: true },
    { icon: <Briefcase className="w-5 h-5" />, label: "My portfolio" },
    { icon: <Trophy className="w-5 h-5" />, label: "League ranking" },
    { icon: <Gift className="w-5 h-5" />, label: "Rewards", onClick: onRewardsClick },
  ];

  return (
    <nav className="flex flex-col gap-2 p-6">
      {items.map((item, index) => (
        <button
          key={index}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
            item.active
              ? ""
              : "hover:bg-gray-100"
          )}
          style={item.active ? {
            backgroundColor: 'var(--light-purple-400)',
            color: 'var(--black-500)'
          } : {
            color: 'var(--black-400)'
          }}
          onClick={item.onClick}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}