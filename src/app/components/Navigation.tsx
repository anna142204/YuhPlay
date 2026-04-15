import { BookOpen, Compass, BookText, Gift } from "lucide-react";
import { cn } from "./ui/utils";

interface NavigationItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface NavigationProps {
  activeTab: "learning" | "sandbox" | "theory" | "rewards";
  onLearningPathClick: () => void;
  onSandboxClick: () => void;
  onTheoryClick: () => void;
  onRewardsClick: () => void;
}

export function Navigation({ activeTab, onLearningPathClick, onSandboxClick, onTheoryClick, onRewardsClick }: NavigationProps) {
  const items: NavigationItem[] = [
    { icon: <BookOpen className="w-5 h-5" />, label: "Learning path", active: activeTab === "learning", onClick: onLearningPathClick },
    { icon: <BookText className="w-5 h-5" />, label: "Theory details", active: activeTab === "theory", onClick: onTheoryClick },
    { icon: <Compass className="w-5 h-5" />, label: "Playground", active: activeTab === "sandbox", onClick: onSandboxClick },
    { icon: <Gift className="w-5 h-5" />, label: "Rewards", active: activeTab === "rewards", onClick: onRewardsClick },
  ];

  return (
    <nav className="flex flex-col gap-2 p-6">
      {items.map((item, index) => (
        <button
          key={index}
          className={cn(
            "flex items-center gap-4 px-4 py-4 rounded-lg text-left text-[17px] transition-colors",
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
          <span className="leading-none">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}