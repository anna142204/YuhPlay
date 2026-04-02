import { X, ArrowRight, Sprout, Shield, TrendingDown, Star } from "lucide-react";
import { Progress } from "./ui/progress";

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onOpenInvest: () => void;
  unitNumber: number;
  unitTitle: string;
  lessonStep: number;
  totalSteps: number;
  hasInvested: boolean;
}

const lessonContent: Record<number, any[]> = {
  1: [
    {
      step: 1,
      title: "Hey Léo ! Ready to start your empire?",
      content: "To grow your money, you buy 'shares' of companies.\nIt's like owning a tiny piece of their success!\n\nWhen the company does well, your shares become more valuable. When it struggles, they can lose value.",
      buttonText: "Let's go !",
    },
    {
      step: 2,
      title: "Time for your first investment!",
      content: "Look at the INVEST button on the right sidebar.\n\nYour mission: Buy 100 YC of any stock from a Swiss company.\nThese are real companies like Nestlé, Novartis, and more!\n\nStart small, learn as you grow.",
      buttonText: "Open Invest Panel",
      requiresInvestAction: true,
    },
    {
      step: 3,
      title: "Yuh did it! You now own a piece of a Swiss Giant.",
      content: "Congratulations! You're now a shareholder. 🎉\n\nYour money is now working for you. The value will fluctuate daily based on market conditions.\n\nReady for your first quiz to test what you learned?",
      buttonText: "Start Quiz",
      isQuizStep: true,
    },
  ],
  2: [
    {
      step: 1,
      title: "Welcome to the Swiss Shield Strategy",
      content: "Swiss companies are famous for their stability and quality.\n\nBut even the best companies have risks. That's why smart investors DIVERSIFY.\n\nNever put all your eggs in one basket!",
      buttonText: "Tell me more",
    },
    {
      step: 2,
      title: "Time to diversify your portfolio",
      content: "You already own one stock. Great start!\n\nNow invest in a DIFFERENT sector:\n• Healthcare (Novartis, Roche)\n• Banking (UBS, Credit Suisse)\n• Luxury (Richemont, Swatch)\n\nThis protects you if one sector struggles.",
      buttonText: "Diversify Now",
      requiresInvestAction: true,
    },
    {
      step: 3,
      title: "Your portfolio is getting stronger!",
      content: "You now own stocks in multiple sectors. Smart move!\n\nIf one industry has a bad year, your other investments can balance it out.\n\nThis is the foundation of safe, long-term investing.",
      buttonText: "Start Quiz",
      isQuizStep: true,
    },
  ],
  3: [
    {
      step: 1,
      title: "When Markets Crash: Stay Calm",
      content: "Stock prices go up AND down. That's normal!\n\nA 'market crash' is when prices drop suddenly and sharply.\n\nScary? Yes. The end? Absolutely not.\n\nHistory shows markets ALWAYS recover over time.",
      buttonText: "How do I survive?",
    },
    {
      step: 2,
      title: "The Golden Rule: Don't Panic Sell",
      content: "When prices drop, new investors panic and sell at a loss.\n\nSmart investors? They see opportunity.\n\nLow prices = discount shopping! Time to buy more shares of quality companies.\n\nLet's practice: Make another investment during this 'dip'.",
      buttonText: "Buy the Dip",
      requiresInvestAction: true,
    },
    {
      step: 3,
      title: "You're thinking like a pro investor!",
      content: "Warren Buffett says: 'Be fearful when others are greedy, and greedy when others are fearful.'\n\nYou just bought during a crash. When markets recover, your profits will be even bigger.\n\nTime to test your crash survival skills!",
      buttonText: "Start Quiz",
      isQuizStep: true,
    },
  ],
  4: [
    {
      step: 1,
      title: "Advanced Strategies: Level Up Your Game",
      content: "You've mastered the basics. Now let's get sophisticated.\n\nProfessional investors use strategies like:\n• Dollar-cost averaging\n• Rebalancing\n• Asset allocation\n• Risk-adjusted returns",
      buttonText: "Show me how",
    },
    {
      step: 2,
      title: "Dollar-Cost Averaging: The Time Machine",
      content: "Instead of investing all at once, invest REGULARLY.\n\nEvery week or month, buy the same amount.\n\nWhen prices are high, you buy less shares.\nWhen prices are low, you buy more shares.\n\nResult? Your average cost is optimized over time.\n\nLet's add to your portfolio strategically.",
      buttonText: "Strategic Investment",
      requiresInvestAction: true,
    },
    {
      step: 3,
      title: "You're now an advanced investor!",
      content: "You understand:\n✓ Basic investing principles\n✓ Diversification strategies\n✓ Crisis management\n✓ Advanced techniques\n\nYou have the knowledge to build real wealth over time.\n\nFinal quiz - let's see what you've mastered!",
      buttonText: "Final Challenge",
      isQuizStep: true,
    },
  ],
};

const getUnitIcon = (unitNumber: number) => {
  const icons: Record<number, React.ReactNode> = {
    1: <Sprout className="w-8 h-8" style={{ color: 'var(--orange-500)' }} />,
    2: <Shield className="w-8 h-8" style={{ color: 'var(--orange-500)' }} />,
    3: <TrendingDown className="w-8 h-8" style={{ color: 'var(--orange-500)' }} />,
    4: <Star className="w-8 h-8" style={{ color: 'var(--orange-500)' }} />,
  };
  return icons[unitNumber] || icons[1];
};

export function LessonModal({
  isOpen,
  onClose,
  onNext,
  onOpenInvest,
  unitNumber,
  unitTitle,
  lessonStep,
  totalSteps,
  hasInvested,
}: LessonModalProps) {
  if (!isOpen) return null;

  const unitContent = lessonContent[unitNumber] || lessonContent[1];
  const content = unitContent[lessonStep - 1];
  const progress = (lessonStep / totalSteps) * 100;

  const handleButtonClick = () => {
    if (content.isQuizStep) {
      onNext(); // This will trigger quiz
    } else if (content.requiresInvestAction && !hasInvested) {
      onOpenInvest();
    } else {
      onNext();
    }
  };

  const canProceed = !content.requiresInvestAction || hasInvested;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4 sm:p-6 pointer-events-none">
      <div className="pointer-events-auto relative w-full max-w-[720px] bg-white rounded-2xl shadow-2xl p-8 -translate-x-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" style={{ color: 'var(--black-400)' }} />
        </button>

        {/* Header with Icon */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--orange-50)' }}
          >
            {getUnitIcon(unitNumber)}
          </div>
          <div>
            <h2 className="text-2xl" style={{ color: 'var(--black-500)' }}>
              Unit {unitNumber} : {unitTitle}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h3 className="text-xl mb-4" style={{ color: 'var(--black-500)' }}>
            {content.title}
          </h3>
          <p className="text-lg whitespace-pre-line" style={{ color: 'var(--black-400)' }}>
            {content.content}
          </p>
        </div>

        {/* Investment status message */}
        {content.requiresInvestAction && hasInvested && (
          <div 
            className="mb-6 p-4 rounded-xl flex items-center gap-3"
            style={{ backgroundColor: 'var(--light-blue-100)', border: '1px solid var(--light-blue-300)' }}
          >
            <span className="text-2xl">✓</span>
            <span style={{ color: 'var(--black-500)' }}>Investment complete! Click Next to continue.</span>
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleButtonClick}
          disabled={!canProceed}
          className="w-full py-4 rounded-xl mb-6 flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: content.isQuizStep ? 'var(--light-purple-400)' : canProceed ? 'var(--purple-300)' : 'var(--black-100)',
            color: 'var(--black-500)',
            border: content.isQuizStep ? '2px solid var(--light-purple-500)' : 'none',
          }}
        >
          {content.requiresInvestAction && hasInvested ? 'Next' : content.buttonText}
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <Progress value={progress} className="h-2 flex-1" />
          <span className="text-sm" style={{ color: 'var(--black-400)' }}>
            {lessonStep}/{totalSteps}
          </span>
        </div>
      </div>
    </div>
  );
}