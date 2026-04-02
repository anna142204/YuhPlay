import { useEffect, useMemo, useRef, useState } from "react";
import { UserProfile } from "./components/UserProfile";
import { Navigation } from "./components/Navigation";
import { LearningPath } from "./components/LearningPath";
import { MissionCard, InvestButton, PortfolioCard, Mascot } from "./components/RightSidebar";
import { LessonModal } from "./components/LessonModal";
import { QuizModal } from "./components/QuizModal";
import { InvestModal } from "./components/InvestModal";
import { CompletionModal } from "./components/CompletionModal";
import { PromoCodeModal } from "./components/PromoCodeModal";
import { ASSETS, type Asset } from "./data/assets";

interface UnitProgress {
  unitId: number;
  completed: boolean;
  quizCompleted: boolean;
  lessonCompleted: boolean;
}

interface Holding {
  assetId: string;
  name: string;
  sector: string;
  quantity: number;
  averagePrice: number;
}

export default function App() {
  const PORTFOLIO_SAMPLE_INTERVAL_MS = 10000;

  const [balance, setBalance] = useState(10000);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [portfolioChange, setPortfolioChange] = useState(0);
  const [portfolioHistory, setPortfolioHistory] = useState<number[]>([]);
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>(() =>
    ASSETS.reduce<Record<string, number>>((acc, asset) => {
      acc[asset.id] = asset.basePrice;
      return acc;
    }, {}),
  );
  const [holdings, setHoldings] = useState<Record<string, Holding>>({});
  
  // Unit Progress
  const [unitsProgress, setUnitsProgress] = useState<UnitProgress[]>([
    { unitId: 1, completed: false, quizCompleted: false, lessonCompleted: false },
    { unitId: 2, completed: false, quizCompleted: false, lessonCompleted: false },
    { unitId: 3, completed: false, quizCompleted: false, lessonCompleted: false },
    { unitId: 4, completed: false, quizCompleted: false, lessonCompleted: false },
  ]);
  
  // Modal states
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [investModalOpen, setInvestModalOpen] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [lessonStep, setLessonStep] = useState(1);
  const [currentUnitId, setCurrentUnitId] = useState(1);
  const [hasInvestedInLesson, setHasInvestedInLesson] = useState(false);
  const [mascotOverride, setMascotOverride] = useState<string | null>(null);

  const lastActionAtRef = useRef(Date.now());
  const lastNudgeAtRef = useRef(0);
  const lastMarketWarningAtRef = useRef(0);
  const lastPortfolioSampleAtRef = useRef(0);

  const unitTitles: Record<number, string> = {
    1: "First steps",
    2: "Swiss shield",
    3: "Market crash survival",
    4: "Advanced strategies",
  };

  const portfolioValue = useMemo(
    () =>
      Object.values(holdings).reduce((acc, holding) => {
        const livePrice = marketPrices[holding.assetId] ?? holding.averagePrice;
        return acc + livePrice * holding.quantity;
      }, 0),
    [holdings, marketPrices],
  );

  const hasPortfolioData = portfolioValue > 0;

  const holdingQuantities = useMemo(
    () =>
      Object.values(holdings).reduce<Record<string, number>>((acc, holding) => {
        acc[holding.assetId] = holding.quantity;
        return acc;
      }, {}),
    [holdings],
  );

  const setMascotMessage = (message: string, durationMs = 7000) => {
    setMascotOverride(message);
    setTimeout(() => setMascotOverride(null), durationMs);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketPrices((previous) => {
        const next = { ...previous };

        ASSETS.forEach((asset) => {
          const current = previous[asset.id] ?? asset.basePrice;
          const baseVolatility = asset.risk === "High risk" ? 0.06 : asset.risk === "Medium risk" ? 0.03 : 0.015;
          const drift = asset.type === "Savings" ? 0.001 : 0;
          const move = (Math.random() * 2 - 1) * baseVolatility + drift;
          const floor = asset.basePrice * 0.45;
          next[asset.id] = Math.max(floor, current * (1 + move));
        });

        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!hasPortfolioData) {
      return;
    }

    const now = Date.now();
    if (now - lastPortfolioSampleAtRef.current < PORTFOLIO_SAMPLE_INTERVAL_MS) {
      return;
    }
    lastPortfolioSampleAtRef.current = now;

    setPortfolioHistory((previous) => {
      const next = [...previous, portfolioValue].slice(-20);
      if (next.length >= 2) {
        const start = next[0] || 1;
        const pct = ((next[next.length - 1] - start) / start) * 100;
        setPortfolioChange(pct);
      }
      return next;
    });
  }, [portfolioValue, hasPortfolioData]);

  useEffect(() => {
    if (!hasPortfolioData) {
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActionAtRef.current > 25000 && now - lastNudgeAtRef.current > 22000) {
        setMascotMessage("Psst, click INVEST to continue your progress.");
        lastNudgeAtRef.current = now;
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [hasPortfolioData]);

  useEffect(() => {
    if (!hasPortfolioData) {
      return;
    }

    const now = Date.now();
    if (now - lastMarketWarningAtRef.current < 12000) {
      return;
    }

    const majorDrop = Object.values(holdings).some((holding) => {
      const livePrice = marketPrices[holding.assetId] ?? holding.averagePrice;
      const pct = (livePrice - holding.averagePrice) / holding.averagePrice;
      return pct < -0.08;
    });

    if (majorDrop) {
      setMascotMessage("The market is down: breathe. Volatility is normal over the long term.");
      lastMarketWarningAtRef.current = now;
    }
  }, [marketPrices, holdings, hasPortfolioData]);

  // Get current mission based on progress
  const getCurrentMission = () => {
    const unit1 = unitsProgress[0];
    const unit2 = unitsProgress[1];
    const unit3 = unitsProgress[2];
    const unit4 = unitsProgress[3];

    // Mission 1: always first until Unit 1 is fully complete
    if (!unit1.completed) {
      if (lessonModalOpen && currentUnitId === 1 && lessonStep >= 2 && !hasInvestedInLesson) {
        return {
          number: 1,
          title: "Make first investment",
          description: "Buy 100 YC of stocks",
          progress: 1,
          total: 3,
        };
      }

      if (!unit1.lessonCompleted) {
        return {
          number: 1,
          title: "Begin your journey",
          description: "Complete your first lesson",
          progress: 0,
          total: 3,
        };
      }

      if (!hasInvestedInLesson) {
        return {
          number: 1,
          title: "Make first investment",
          description: "Buy 100 YC of stocks",
          progress: 1,
          total: 3,
        };
      }

      return {
        number: 1,
        title: "Pass the quiz",
        description: "Show what you've learned",
        progress: 2,
        total: 3,
      };
    }

    // Mission 2: Unit 2
    if (!unit2.completed) {
      if (!unit2.lessonCompleted) {
        return {
          number: 2,
          title: "Learn diversification",
          description: "Master the Swiss Shield strategy",
          progress: 0,
          total: 3,
        };
      }

      return {
        number: 2,
        title: "Diversify your portfolio",
        description: "Spread your investments wisely",
        progress: 2,
        total: 3,
      };
    }

    // Mission 3: Unit 3
    if (!unit3.completed) {
      if (!unit3.lessonCompleted) {
        return {
          number: 3,
          title: "Crash survival training",
          description: "Learn to handle market downturns",
          progress: 0,
          total: 3,
        };
      }

      return {
        number: 3,
        title: "Master crisis management",
        description: "Complete the crash survival quiz",
        progress: 2,
        total: 3,
      };
    }

    // Mission 4: Unit 4
    if (!unit4.completed) {
      if (!unit4.lessonCompleted) {
        return {
          number: 4,
          title: "Advanced investor",
          description: "Learn professional strategies",
          progress: 0,
          total: 3,
        };
      }

      return {
        number: 4,
        title: "Final challenge",
        description: "Prove your mastery",
        progress: 2,
        total: 3,
      };
    }

    // All units completed!
    if (unit1.completed && unit2.completed && unit3.completed && unit4.completed) {
      return {
        number: 5,
        title: "Master Investor! 🎓",
        description: "You've completed all units!",
        progress: 3,
        total: 3,
      };
    }
    
    return {
      number: 1,
      title: "Keep learning!",
      description: "Continue your journey",
      progress: 0,
      total: 3,
    };
  };

  const getDefaultMascotMessage = () => {
    const unit1 = unitsProgress[0];
    
    if (lessonModalOpen && lessonStep === 2 && !hasInvestedInLesson) {
      return "Click the INVEST button to continue your lesson!";
    }
    
    if (!unit1.lessonCompleted) {
      return "Welcome! Click on Unit 1 to start your learning journey!";
    }
    
    if (!hasInvestedInLesson) {
      return "Great start! Now make your first investment above!";
    }
    
    if (!unit1.quizCompleted) {
      return "Nice investment! Ready for the quiz?";
    }
    
    if (unit1.completed) {
      return "Excellent work! You completed Unit 1! 🎉";
    }
    
    return "I'm here to help you learn about investing!";
  };

  const getMascotMessage = () => mascotOverride ?? getDefaultMascotMessage();

  const handleUnitClick = (unitId: number) => {
    lastActionAtRef.current = Date.now();

    // Check if unit is unlocked
    if (unitId > 1) {
      const previousUnit = unitsProgress[unitId - 2];
      if (!previousUnit.completed) {
        return; // Unit locked
      }
    }
    
    setCurrentUnitId(unitId);
    setLessonStep(1);
    setHasInvestedInLesson(false);
    setLessonModalOpen(true);
  };

  const handleNextLessonStep = () => {
    lastActionAtRef.current = Date.now();

    if (lessonStep === 1) {
      // Move to step 2 - investment step
      setLessonStep(2);
    } else if (lessonStep === 2 && hasInvestedInLesson) {
      // Move to step 3 - quiz intro
      setLessonStep(3);
      // Mark lesson as completed
      setUnitsProgress(prev => prev.map(unit => 
        unit.unitId === currentUnitId 
          ? { ...unit, lessonCompleted: true }
          : unit
      ));
    } else if (lessonStep === 3) {
      // Open quiz
      setLessonModalOpen(false);
      setQuizModalOpen(true);
    }
  };

  const handleOpenInvest = () => {
    lastActionAtRef.current = Date.now();
    setInvestModalOpen(true);
  };

  const handleTrade = (asset: Asset, quantity: number, action: "buy" | "sell", unitPrice: number) => {
    lastActionAtRef.current = Date.now();
    const total = Math.round(unitPrice * quantity);

    if (action === "buy") {
      if (total > balance) {
        return;
      }

      setBalance((prev) => prev - total);
      setHoldings((prev) => {
        const current = prev[asset.id];
        if (!current) {
          return {
            ...prev,
            [asset.id]: {
              assetId: asset.id,
              name: asset.name,
              sector: asset.sector,
              quantity,
              averagePrice: unitPrice,
            },
          };
        }

        const mergedQuantity = current.quantity + quantity;
        const mergedAverage = (current.averagePrice * current.quantity + unitPrice * quantity) / mergedQuantity;

        return {
          ...prev,
          [asset.id]: {
            ...current,
            quantity: mergedQuantity,
            averagePrice: mergedAverage,
          },
        };
      });

      if (lessonModalOpen && lessonStep === 2) {
        setHasInvestedInLesson(true);
      }

      setMascotMessage(`Buy executed: ${asset.name}. Well done.`);
    }

    if (action === "sell") {
      const currentHolding = holdings[asset.id];
      if (!currentHolding || currentHolding.quantity < quantity) {
        return;
      }

      setBalance((prev) => prev + total);
      setHoldings((prev) => {
        const current = prev[asset.id];
        if (!current) {
          return prev;
        }

        const remaining = current.quantity - quantity;
        if (remaining <= 0) {
          const { [asset.id]: _removed, ...rest } = prev;
          return rest;
        }

        return {
          ...prev,
          [asset.id]: {
            ...current,
            quantity: remaining,
          },
        };
      });

      if (unitPrice < currentHolding.averagePrice) {
        setMascotMessage("You sold at a loss. In volatile phases, patience and a long-term plan often help.");
      } else {
        setMascotMessage(`Sell executed on ${asset.name}. Great discipline.`);
      }
    }

    setInvestModalOpen(false);
  };

  const handleQuizComplete = () => {
    lastActionAtRef.current = Date.now();

    // Mark quiz as completed
    setUnitsProgress(prev => prev.map(unit => 
      unit.unitId === currentUnitId 
        ? { ...unit, quizCompleted: true, completed: true }
        : unit
    ));
    
    // Add rewards
    setXp(prev => prev + 250);
    setQuizModalOpen(false);
    setCompletionModalOpen(true);
  };

  const handleChestClick = () => {
    const allUnitsCompleted = unitsProgress.every((unit) => unit.completed);

    if (!allUnitsCompleted) {
      return;
    }

    setPromoModalOpen(true);
  };

  const mission = getCurrentMission();

  return (
    <div className="size-full flex" style={{ backgroundColor: 'var(--blue-50)' }}>
      {/* Left Sidebar */}
      <div className="w-[340px] bg-white flex flex-col" style={{ borderRight: '1px solid var(--black-100)' }}>
        <UserProfile xp={xp} streak={streak} />
        <Navigation onRewardsClick={() => {}} />
      </div>

      {/* Main Content - Learning Path */}
      <div className="flex-1 overflow-auto" style={{ background: 'linear-gradient(to bottom, var(--light-purple-200), var(--medium-purple-100))' }}>
        <LearningPath 
          onUnitClick={handleUnitClick}
          onChestClick={handleChestClick}
          unitsProgress={unitsProgress}
        />
      </div>

      {/* Right Sidebar */}
      <div className="w-[400px] bg-white p-6 flex flex-col gap-6 relative z-50" style={{ borderLeft: '1px solid var(--black-100)' }}>
        {/* Balance */}
        <div className="text-center pb-4" style={{ borderBottom: '1px solid var(--black-100)' }}>
          <p className="text-sm mb-2" style={{ color: 'var(--black-300)' }}>AVAILABLE BALANCE</p>
          <h2 className="text-2xl" style={{ color: 'var(--black-500)' }}>
            {balance.toLocaleString()} <span className="text-xl" style={{ color: 'var(--orange-400)' }}>YC</span>
          </h2>
        </div>

        {/* Mission */}
        <MissionCard
          missionNumber={mission.number}
          title={mission.title}
          description={mission.description}
          progress={mission.progress}
          total={mission.total}
        />

        {/* Invest Button */}
        <InvestButton 
          onClick={() => setInvestModalOpen(true)}
          highlighted={lessonModalOpen && lessonStep === 2 && !hasInvestedInLesson}
        />

        {/* Portfolio */}
        <PortfolioCard change={portfolioChange} hasData={hasPortfolioData} history={portfolioHistory} />

        {/* Mascot */}
        <div className="mt-2">
          <Mascot message={getMascotMessage()} />
        </div>
      </div>

      {/* Modals */}
      <LessonModal
        isOpen={lessonModalOpen}
        onClose={() => setLessonModalOpen(false)}
        onNext={handleNextLessonStep}
        onOpenInvest={handleOpenInvest}
        unitNumber={currentUnitId}
        unitTitle={unitTitles[currentUnitId]}
        lessonStep={lessonStep}
        totalSteps={3}
        hasInvested={hasInvestedInLesson}
      />

      <QuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        onComplete={handleQuizComplete}
        unitNumber={currentUnitId}
      />

      <InvestModal
        isOpen={investModalOpen}
        onClose={() => setInvestModalOpen(false)}
        onTrade={handleTrade}
        balance={balance}
        marketPrices={marketPrices}
        holdings={holdingQuantities}
        currentUnitId={currentUnitId}
        lessonStep={lessonStep}
      />

      <CompletionModal
        isOpen={completionModalOpen}
        onClose={() => setCompletionModalOpen(false)}
        unitNumber={currentUnitId}
        unitTitle={unitTitles[currentUnitId]}
        xpEarned={250}
      />

      <PromoCodeModal 
        isOpen={promoModalOpen}
        onClose={() => setPromoModalOpen(false)}
      />
    </div>
  );
}