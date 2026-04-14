import { useState } from "react";
import { BookOpenCheck, Shield, TrendingDown, Star, ChevronDown } from "lucide-react";

interface UnitProgress {
  unitId: number;
  completed: boolean;
  quizCompleted: boolean;
  lessonCompleted: boolean;
}

interface TheoryPageProps {
  unitsProgress: UnitProgress[];
}

interface TheorySection {
  unitId: number;
  title: string;
  summary: string;
  coreIdea: string;
  icon: React.ReactNode;
  framework: string[];
  practicalExample: string;
  mistakesToAvoid: string[];
  actionChecklist: string[];
}

const sections: TheorySection[] = [
  {
    unitId: 1,
    title: "Unit 1 - First Steps",
    summary: "Build your investing foundations: ownership, risk, time horizon, and discipline.",
    coreIdea: "Investing is not about perfect predictions. It is about owning quality assets with a clear plan.",
    icon: <BookOpenCheck className="w-6 h-6" style={{ color: 'var(--orange-500)' }} />,
    framework: [
      "Ownership: a stock is a small piece of a business.",
      "Risk and return move together: higher upside usually means larger short-term swings.",
      "Time horizon matters: long-term plans absorb more volatility.",
      "Discipline beats emotion: write simple rules before you invest.",
    ],
    practicalExample:
      "If you invest 100 YQ in a company and the price drops 8% next week, your plan should guide you. If your thesis is still valid and your horizon is long, you do not panic-sell.",
    mistakesToAvoid: [
      "Buying only because a price is rising fast.",
      "Confusing short-term volatility with permanent loss.",
      "Investing without a defined objective.",
    ],
    actionChecklist: [
      "I can explain what owning a stock means.",
      "I can separate short-term noise from long-term goals.",
      "I have a simple rule-set for buy, hold, and review.",
    ],
  },
  {
    unitId: 2,
    title: "Unit 2 - Swiss Shield",
    summary: "Learn smart diversification across sectors, risk profiles, and asset types.",
    coreIdea: "Diversification protects your portfolio from single-point failure.",
    icon: <Shield className="w-6 h-6" style={{ color: 'var(--orange-500)' }} />,
    framework: [
      "Sector diversification: healthcare, finance, consumer, industry, technology.",
      "Risk diversification: combine low, medium, and selective high-risk assets.",
      "Vehicle diversification: stocks, ETFs, and lower-volatility instruments.",
      "Position sizing: avoid oversized bets in one name.",
    ],
    practicalExample:
      "Instead of placing 100% of your capital in one luxury stock, split your exposure across healthcare, banking, and a broad ETF. One weak sector then hurts less.",
    mistakesToAvoid: [
      "Owning many assets that all behave the same way.",
      "Over-diversifying into low-quality positions.",
      "Ignoring correlation between assets.",
    ],
    actionChecklist: [
      "No single position dominates my portfolio risk.",
      "I can explain why each position exists.",
      "My portfolio includes at least two distinct risk buckets.",
    ],
  },
  {
    unitId: 3,
    title: "Unit 3 - Market Crash Survival",
    summary: "Manage drawdowns with calm, process, and long-term perspective.",
    coreIdea: "Crashes are painful but normal. Process and risk control decide survival.",
    icon: <TrendingDown className="w-6 h-6" style={{ color: 'var(--orange-500)' }} />,
    framework: [
      "Drawdown = decline from a recent peak.",
      "Volatility is movement, not automatically danger.",
      "Liquidity and cash buffer create flexibility during stress.",
      "Decision hierarchy: protect process first, performance second.",
    ],
    practicalExample:
      "If your portfolio drops 12%, review your thesis before acting. If fundamentals are intact, a disciplined investor often holds or adds gradually instead of panic-selling.",
    mistakesToAvoid: [
      "Selling only because everyone else is afraid.",
      "Checking prices constantly and reacting to every move.",
      "Using money you may need soon for high-volatility assets.",
    ],
    actionChecklist: [
      "I can define drawdown and explain why it matters.",
      "I have a written rule for what to do during sharp declines.",
      "I keep enough cash to avoid forced selling.",
    ],
  },
  {
    unitId: 4,
    title: "Unit 4 - Advanced Strategies",
    summary: "Level up with position sizing, DCA, and disciplined rebalancing.",
    coreIdea: "Advanced investing is mostly portfolio management, not prediction.",
    icon: <Star className="w-6 h-6" style={{ color: 'var(--orange-500)' }} />,
    framework: [
      "Position sizing: cap exposure per idea based on conviction and risk.",
      "DCA: invest a fixed amount at regular intervals.",
      "Rebalancing: trim winners and top up laggards to keep target allocation.",
      "Review cadence: monthly check, quarterly deep review.",
    ],
    practicalExample:
      "Your target is 60% equities and 40% defensive assets. After a rally, equities become 72%. Rebalancing means reducing equity weight to return to your planned risk profile.",
    mistakesToAvoid: [
      "Letting one winner become an unintended oversized risk.",
      "Changing strategy every week.",
      "Confusing activity with progress.",
    ],
    actionChecklist: [
      "I know my target allocation and tolerance bands.",
      "I can describe how DCA improves consistency.",
      "I have a recurring review schedule and follow it.",
    ],
  },
];

export function TheoryPage({ unitsProgress }: TheoryPageProps) {
  const completedUnits = unitsProgress.filter((unit) => unit.completed).length;
  const [openUnitId, setOpenUnitId] = useState<number | null>(null);

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <header className="mb-8 rounded-2xl p-6" style={{ backgroundColor: 'rgba(255,255,255,0.72)', border: '1px solid var(--light-blue-300)' }}>
        <h2 className="text-2xl mb-2" style={{ color: 'var(--black-500)' }}>Theory Hub</h2>
        <p style={{ color: 'var(--black-400)' }}>
          Deep-dive reference for each unit. Use this page to review concepts, avoid common mistakes, and prepare for quizzes with a practical investor mindset.
        </p>
        <div className="mt-4 inline-flex items-center rounded-full px-3 py-1 text-sm" style={{ backgroundColor: 'var(--light-blue-100)', color: 'var(--black-500)' }}>
          Progress: {completedUnits}/4 units completed
        </div>
      </header>

      <div className="flex flex-col gap-4">
        {sections.map((section) => {
          const progress = unitsProgress.find((unit) => unit.unitId === section.unitId);
          const status = progress?.completed
            ? "Completed"
            : progress?.lessonCompleted
              ? "Lesson done"
              : "Not started";
          const isOpen = openUnitId === section.unitId;

          return (
            <article
              key={section.unitId}
              className="rounded-2xl p-5 w-full"
              style={{ backgroundColor: 'white', border: '1px solid var(--black-100)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}
            >
              <button
                type="button"
                onClick={() => setOpenUnitId((current) => (current === section.unitId ? null : section.unitId))}
                className="w-full flex items-center justify-between gap-3 text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--orange-50)' }}>
                    {section.icon}
                  </div>
                  <div>
                    <h3 style={{ color: 'var(--black-500)' }}>{section.title}</h3>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--black-400)' }}>{section.summary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: progress?.completed ? 'var(--orange-100)' : 'var(--light-blue-200)',
                      color: 'var(--black-500)',
                    }}
                  >
                    {status}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    style={{ color: 'var(--black-400)' }}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--black-100)' }}>
                  <div className="mb-4 rounded-xl p-3" style={{ backgroundColor: 'var(--orange-50)', border: '1px solid var(--orange-100)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--black-400)' }}>Core idea</p>
                    <p className="text-sm" style={{ color: 'var(--black-500)' }}>{section.coreIdea}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm mb-2" style={{ color: 'var(--black-500)' }}>Mental model</h4>
                    <ul className="space-y-1 text-sm" style={{ color: 'var(--black-400)' }}>
                      {section.framework.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm mb-2" style={{ color: 'var(--black-500)' }}>Practical example</h4>
                    <p className="text-sm" style={{ color: 'var(--black-400)' }}>{section.practicalExample}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm mb-2" style={{ color: 'var(--black-500)' }}>Common mistakes to avoid</h4>
                    <ul className="space-y-1 text-sm" style={{ color: 'var(--black-400)' }}>
                      {section.mistakesToAvoid.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm mb-2" style={{ color: 'var(--black-500)' }}>Self-check before quiz</h4>
                    <ul className="space-y-1 text-sm" style={{ color: 'var(--black-400)' }}>
                      {section.actionChecklist.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}