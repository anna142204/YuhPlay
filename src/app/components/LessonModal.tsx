import { X, ArrowRight, Sprout, Shield, TrendingDown, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

interface HelpItem {
  label: string;
  title: string;
  body: string;
}

interface LessonStep {
  step: number;
  title: string;
  content: string;
  buttonText: string;
  requiresInvestAction?: boolean;
  isQuizStep?: boolean;
  glossary?: HelpItem[];
  featureTips?: HelpItem[];
}

const lessonContent: Record<number, LessonStep[]> = {
  1: [
    {
      step: 1,
      title: "Hey Léo ! Ready to start your empire?",
      content: "To grow your money, you buy 'shares' of companies.\nIt's like owning a tiny piece of their success!\n\nWhen the company does well, your shares become more valuable. When it struggles, they can lose value.",
      buttonText: "Let's go !",
      glossary: [
        {
          label: "Share",
          title: "What is a share?",
          body: "A share is a tiny ownership piece of a company. If the company grows, your share can gain value."
        },
        {
          label: "Stock price",
          title: "What is stock price?",
          body: "It is the current market value of one share. It moves up and down based on news and demand."
        },
        {
          label: "Volatility",
          title: "What is volatility?",
          body: "Volatility is how much prices move. High volatility means bigger and faster swings."
        },
      ],
      featureTips: [
        {
          label: "Mission card",
          title: "How to use the Mission card",
          body: "The mission card in the right sidebar tells you your current objective and progress. Follow it step by step."
        },
      ],
    },
    {
      step: 2,
      title: "Mini Theory: Risk, Time, and Discipline",
      content: "Three fundamentals before you invest:\n\n• Risk vs Return: higher potential return usually means higher volatility.\n• Time Horizon: short-term prices move a lot, long-term trends are smoother.\n• Discipline: follow a plan, avoid emotional decisions.\n\nYou don't need to be perfect. You need to be consistent.",
      buttonText: "I got it",
      glossary: [
        {
          label: "Risk vs Return",
          title: "Risk vs Return",
          body: "Usually, safer assets grow slower. Higher-return opportunities often come with higher short-term uncertainty."
        },
        {
          label: "Time horizon",
          title: "Time horizon",
          body: "This is how long you plan to invest. The longer the horizon, the easier it is to absorb short-term noise."
        },
      ],
    },
    {
      step: 3,
      title: "Time for your first investment!",
      content: "Look at the INVEST button on the right sidebar.\n\nYour mission: Invest at least 100 YQ in any Swiss stock.\nThese are real companies like Nestlé, Novartis, and more!\n\nStart small, learn as you grow.",
      buttonText: "Open Invest Panel",
      requiresInvestAction: true,
      featureTips: [
        {
          label: "INVEST button",
          title: "What does INVEST do?",
          body: "It opens the investment panel where you can pick an asset, choose quantity, and confirm your order."
        },
        {
          label: "Confirm button",
          title: "Why confirm?",
          body: "Your order is only executed after you click Confirm investment. Always review total cost first."
        },
      ],
    },
    {
      step: 4,
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
      glossary: [
        {
          label: "Diversification",
          title: "What is diversification?",
          body: "Spreading money across different assets so one bad position hurts less."
        },
      ],
    },
    {
      step: 2,
      title: "Mini Theory: Diversification Done Right",
      content: "Diversification works best when assets are not all moving the same way.\n\nThink in layers:\n• Sectors (healthcare, finance, luxury, consumer)\n• Risk levels (low/medium/high)\n• Asset types (stocks, ETFs, crypto)\n\nGoal: reduce concentration risk, not dilute quality.",
      buttonText: "Understood",
    },
    {
      step: 3,
      title: "Time to diversify your portfolio",
      content: "You already own one stock. Great start!\n\nNow invest in a DIFFERENT sector:\n• Healthcare (Novartis, Roche)\n• Banking (UBS)\n• Luxury (Richemont, Swatch)\n\nThis protects you if one sector struggles.",
      buttonText: "Diversify Now",
      requiresInvestAction: true,
    },
    {
      step: 4,
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
      glossary: [
        {
          label: "Market crash",
          title: "What is a market crash?",
          body: "A rapid drop across many assets. It feels intense, but it is a known phase in market cycles."
        },
        {
          label: "Drawdown",
          title: "What is drawdown?",
          body: "The decline from a previous high. It measures how deep a temporary fall is."
        },
      ],
    },
    {
      step: 2,
      title: "Mini Theory: Volatility and Drawdowns",
      content: "A loss on screen is not always a permanent loss.\n\nKey concepts:\n• Volatility = price fluctuation, not automatically bad\n• Drawdown = decline from a recent peak\n• Recovery time matters more than one bad day\n\nRisk management means staying invested with a plan.",
      buttonText: "Makes sense",
    },
    {
      step: 3,
      title: "The Golden Rule: Don't Panic Sell",
      content: "When prices drop, new investors panic and sell at a loss.\n\nSmart investors? They see opportunity.\n\nLow prices = discount shopping! Time to buy more shares of quality companies.\n\nLet's practice: Make another investment during this 'dip'.",
      buttonText: "Buy the Dip",
      requiresInvestAction: true,
    },
    {
      step: 4,
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
      glossary: [
        {
          label: "Asset allocation",
          title: "What is asset allocation?",
          body: "How you split your portfolio between categories like stocks, ETFs, and crypto."
        },
      ],
    },
    {
      step: 2,
      title: "Mini Theory: Position Sizing and Rebalancing",
      content: "Advanced investing is mostly position management:\n\n• Position sizing: avoid oversized bets\n• Rebalancing: trim winners, top up laggards\n• Process over prediction: decisions from rules, not guesses\n\nSmall, repeatable actions beat one big perfect move.",
      buttonText: "Continue",
    },
    {
      step: 3,
      title: "Dollar-Cost Averaging: The Time Machine",
      content: "Instead of investing all at once, invest REGULARLY.\n\nEvery week or month, buy the same amount.\n\nWhen prices are high, you buy less shares.\nWhen prices are low, you buy more shares.\n\nResult? Your average cost is optimized over time.\n\nLet's add to your portfolio strategically.",
      buttonText: "Strategic Investment",
      requiresInvestAction: true,
    },
    {
      step: 4,
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
  const [activeHelpItem, setActiveHelpItem] = useState<HelpItem | null>(null);
  const unitContent = lessonContent[unitNumber] || lessonContent[1];
  const safeStepIndex = Math.min(Math.max(lessonStep - 1, 0), unitContent.length - 1);
  const content = unitContent[safeStepIndex];
  const progress = (lessonStep / totalSteps) * 100;
  const helpItems = useMemo(
    () => [...(content?.glossary ?? []), ...(content?.featureTips ?? [])],
    [content],
  );

  useEffect(() => {
    setActiveHelpItem(null);
  }, [unitNumber, lessonStep, isOpen]);

  if (!isOpen || !content) return null;

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
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
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

          {helpItems.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {helpItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveHelpItem(item)}
                  className="px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer"
                  style={{
                    backgroundColor: 'var(--light-blue-100)',
                    border: '1px solid var(--light-blue-300)',
                    color: 'var(--black-500)',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {activeHelpItem && (
          <div
            className="absolute right-6 bottom-24 w-[280px] rounded-xl p-4 shadow-xl"
            style={{
              backgroundColor: 'white',
              border: '1px solid var(--light-blue-300)',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveHelpItem(null)}
              className="absolute right-2 top-2 p-1 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-4 h-4" style={{ color: 'var(--black-400)' }} />
            </button>
            <p className="text-sm mb-2 pr-5" style={{ color: 'var(--black-500)' }}>
              {activeHelpItem.title}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--black-400)' }}>
              {activeHelpItem.body}
            </p>
          </div>
        )}

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
          className="w-full py-4 rounded-xl mb-6 flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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