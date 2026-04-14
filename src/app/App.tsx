import { useEffect, useMemo, useRef, useState } from "react";
import { UserProfile } from "./components/UserProfile";
import { Navigation } from "./components/Navigation";
import { LearningPath } from "./components/LearningPath";
import { TheoryPage } from "./components/TheoryPage";
import { RewardsPage } from "./components/RewardsPage";
import { SandboxPage } from "./components/SandboxPage";
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
  sellLimitPrice?: number | null;
  buyLimitPrice?: number | null;
}

export default function App() {
  const APP_STATE_STORAGE_KEY = "yuhlearn-app-state-v1";
  const PORTFOLIO_SAMPLE_INTERVAL_MS = 15000;
  const MARKET_TICK_MS = 5000;
  const UNIT_1_INVEST_TARGET_YC = 100;

  const [balance, setBalance] = useState(10000);
  const [xp, setXp] = useState(0);
  const [portfolioChange, setPortfolioChange] = useState(0);
  const [portfolioHistory, setPortfolioHistory] = useState<number[]>([]);
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>(() =>
    ASSETS.reduce<Record<string, number>>((acc, asset) => {
      acc[asset.id] = asset.basePrice;
      return acc;
    }, {}),
  );
  const [holdings, setHoldings] = useState<Record<string, Holding>>({});
  const [activeTab, setActiveTab] = useState<"learning" | "sandbox" | "theory" | "rewards">("learning");
  const [marketScenario, setMarketScenario] = useState<"balanced" | "bull" | "bear" | "volatile">("balanced");
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);
  const [unlockedCosmetics, setUnlockedCosmetics] = useState<string[]>([]);
  const [accountValueHistory, setAccountValueHistory] = useState<number[]>([]);
  const [sandboxSessionStartValue, setSandboxSessionStartValue] = useState(10000);
  const [sandboxActionLog, setSandboxActionLog] = useState<string[]>([]);
  const [sandboxBalance, setSandboxBalance] = useState(10000);
  const [sandboxHoldings, setSandboxHoldings] = useState<Record<string, Holding>>({});
  const [tradeContext, setTradeContext] = useState<"learning" | "sandbox">("learning");
  
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
  const [lessonInvestmentAmount, setLessonInvestmentAmount] = useState(0);
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

  const totalAccountValue = balance + portfolioValue;

  const hasPortfolioData = portfolioValue > 0;

  const sandboxPortfolioValue = useMemo(
    () =>
      Object.values(sandboxHoldings).reduce((acc, holding) => {
        const livePrice = marketPrices[holding.assetId] ?? holding.averagePrice;
        return acc + livePrice * holding.quantity;
      }, 0),
    [sandboxHoldings, marketPrices],
  );

  const sandboxInvestedCostBasis = useMemo(
    () =>
      Object.values(sandboxHoldings).reduce((acc, holding) => {
        return acc + holding.averagePrice * holding.quantity;
      }, 0),
    [sandboxHoldings],
  );

  const sandboxPortfolioChange = useMemo(() => {
    if (sandboxInvestedCostBasis <= 0) {
      return 0;
    }
    return ((sandboxPortfolioValue - sandboxInvestedCostBasis) / sandboxInvestedCostBasis) * 100;
  }, [sandboxPortfolioValue, sandboxInvestedCostBasis]);

  const sandboxHoldingQuantities = useMemo(
    () =>
      Object.values(sandboxHoldings).reduce<Record<string, number>>((acc, holding) => {
        acc[holding.assetId] = holding.quantity;
        return acc;
      }, {}),
    [sandboxHoldings],
  );

  const investedCostBasis = useMemo(
    () =>
      Object.values(holdings).reduce((acc, holding) => {
        return acc + holding.averagePrice * holding.quantity;
      }, 0),
    [holdings],
  );

  const holdingQuantities = useMemo(
    () =>
      Object.values(holdings).reduce<Record<string, number>>((acc, holding) => {
        acc[holding.assetId] = holding.quantity;
        return acc;
      }, {}),
    [holdings],
  );

  const holdingsList = useMemo(() => Object.values(holdings), [holdings]);
  const sandboxHoldingsList = useMemo(() => Object.values(sandboxHoldings), [sandboxHoldings]);

  const holdingsSectorCount = useMemo(() => {
    const sectors = new Set(holdingsList.map((holding) => holding.sector));
    return sectors.size;
  }, [holdingsList]);

  const sandboxHoldingsSectorCount = useMemo(() => {
    const sectors = new Set(sandboxHoldingsList.map((holding) => holding.sector));
    return sectors.size;
  }, [sandboxHoldingsList]);

  const completedUnitsCount = useMemo(
    () => unitsProgress.filter((unit) => unit.completed).length,
    [unitsProgress],
  );

  const completedQuizzesCount = useMemo(
    () => unitsProgress.filter((unit) => unit.quizCompleted).length,
    [unitsProgress],
  );

  const nextTheoryUnit = useMemo(
    () => unitsProgress.find((unit) => !unit.completed)?.unitId ?? 4,
    [unitsProgress],
  );

  const diversificationScore = useMemo(() => {
    if (sandboxPortfolioValue <= 0 || sandboxHoldingsList.length === 0) {
      return 0;
    }

    const sectorValue = sandboxHoldingsList.reduce<Record<string, number>>((acc, holding) => {
      const value = (marketPrices[holding.assetId] ?? holding.averagePrice) * holding.quantity;
      acc[holding.sector] = (acc[holding.sector] ?? 0) + value;
      return acc;
    }, {});

    const weights = Object.values(sectorValue).map((value) => value / sandboxPortfolioValue);
    const hhi = weights.reduce((sum, weight) => sum + weight * weight, 0);
    const normalized = Math.max(0, Math.min(1, (1 - hhi) / 0.8));
    const countBonus = Math.min(1, sandboxHoldingsList.length / 6);
    return Math.round((normalized * 0.75 + countBonus * 0.25) * 100);
  }, [sandboxHoldingsList, sandboxPortfolioValue, marketPrices]);

  const maxDrawdown = useMemo(() => {
    if (accountValueHistory.length < 2) {
      return 0;
    }

    let peak = accountValueHistory[0];
    let worstDrawdown = 0;

    accountValueHistory.forEach((value) => {
      peak = Math.max(peak, value);
      if (peak > 0) {
        const dd = ((peak - value) / peak) * 100;
        worstDrawdown = Math.max(worstDrawdown, dd);
      }
    });

    return worstDrawdown;
  }, [accountValueHistory]);

  const setMascotMessage = (message: string, durationMs = 7000) => {
    setMascotOverride(message);
    setTimeout(() => setMascotOverride(null), durationMs);
  };

  const pushSandboxAction = (message: string) => {
    setSandboxActionLog((prev) => [
      `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${message}`,
      ...prev,
    ].slice(0, 14));
  };

  const handleScenarioChange = (scenario: "balanced" | "bull" | "bear" | "volatile") => {
    setMarketScenario(scenario);
    const labels: Record<"balanced" | "bull" | "bear" | "volatile", string> = {
      balanced: "Balanced",
      bull: "Bull market",
      bear: "Bear market",
      volatile: "High volatility",
    };
    pushSandboxAction(`Switched scenario to ${labels[scenario]}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketPrices((previous) => {
        const next = { ...previous };

        const scenarioDriftByType: Record<"balanced" | "bull" | "bear" | "volatile", number> = {
          balanced: 0,
          bull: 0.004,
          bear: -0.005,
          volatile: 0,
        };

        const scenarioVolatilityMultiplier: Record<"balanced" | "bull" | "bear" | "volatile", number> = {
          balanced: 1,
          bull: 1.1,
          bear: 1.2,
          volatile: 1.9,
        };

        ASSETS.forEach((asset) => {
          const current = previous[asset.id] ?? asset.basePrice;
          const baseVolatility = asset.risk === "High risk" ? 0.03 : asset.risk === "Medium risk" ? 0.015 : 0.008;
          const drift = (asset.type === "Savings" ? 0.001 : 0) + scenarioDriftByType[marketScenario];
          const adjustedVolatility = baseVolatility * scenarioVolatilityMultiplier[marketScenario];
          const move = (Math.random() * 2 - 1) * adjustedVolatility + drift;
          const floor = asset.basePrice * 0.45;
          next[asset.id] = Math.max(floor, current * (1 + move));
        });

        return next;
      });
    }, MARKET_TICK_MS);

    return () => clearInterval(interval);
  }, [marketScenario]);

  const sandboxTotalAccountValue = sandboxBalance + sandboxPortfolioValue;

  useEffect(() => {
    setAccountValueHistory((prev) => [...prev, sandboxTotalAccountValue].slice(-180));
  }, [sandboxTotalAccountValue]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(APP_STATE_STORAGE_KEY);
      if (!raw) {
        return;
      }

      const saved = JSON.parse(raw) as Partial<{
        activeTab: "learning" | "sandbox" | "theory" | "rewards";
        balance: number;
        xp: number;
        holdings: Record<string, Holding>;
        unitsProgress: UnitProgress[];
        claimedRewards: string[];
        unlockedCosmetics: string[];
        sandboxBalance: number;
        sandboxHoldings: Record<string, Holding>;
        marketScenario: "balanced" | "bull" | "bear" | "volatile";
        sandboxSessionStartValue: number;
        sandboxActionLog: string[];
      }>;

      if (saved.activeTab) setActiveTab(saved.activeTab);
      if (typeof saved.balance === "number") setBalance(saved.balance);
      if (typeof saved.xp === "number") setXp(saved.xp);
      if (saved.holdings) setHoldings(saved.holdings);
      if (saved.unitsProgress) setUnitsProgress(saved.unitsProgress);
      if (saved.claimedRewards) setClaimedRewards(saved.claimedRewards);
      if (saved.unlockedCosmetics) setUnlockedCosmetics(saved.unlockedCosmetics);
      if (typeof saved.sandboxBalance === "number") setSandboxBalance(saved.sandboxBalance);
      if (saved.sandboxHoldings) setSandboxHoldings(saved.sandboxHoldings);
      if (saved.marketScenario) setMarketScenario(saved.marketScenario);
      if (typeof saved.sandboxSessionStartValue === "number") setSandboxSessionStartValue(saved.sandboxSessionStartValue);
      if (saved.sandboxActionLog) setSandboxActionLog(saved.sandboxActionLog);
    } catch {
      // Ignore corrupted local storage payload.
    }
  }, []);

  useEffect(() => {
    const payload = {
      activeTab,
      balance,
      xp,
      holdings,
      unitsProgress,
      claimedRewards,
      unlockedCosmetics,
      sandboxBalance,
      sandboxHoldings,
      marketScenario,
      sandboxSessionStartValue,
      sandboxActionLog,
    };

    localStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(payload));
  }, [
    activeTab,
    balance,
    xp,
    holdings,
    unitsProgress,
    claimedRewards,
    unlockedCosmetics,
    sandboxBalance,
    sandboxHoldings,
    marketScenario,
    sandboxSessionStartValue,
    sandboxActionLog,
  ]);

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

      const targetPct = investedCostBasis > 0
        ? ((portfolioValue - investedCostBasis) / investedCostBasis) * 100
        : 0;
      setPortfolioChange((prev) => prev * 0.75 + targetPct * 0.25);

      return next;
    });
  }, [portfolioValue, investedCostBasis, hasPortfolioData]);

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

  useEffect(() => {
    const autoSellOrders = Object.values(sandboxHoldings).filter((holding) => {
      if (holding.sellLimitPrice == null) {
        return false;
      }

      const livePrice = marketPrices[holding.assetId] ?? holding.averagePrice;
      return livePrice >= holding.sellLimitPrice;
    });

    if (autoSellOrders.length === 0) {
      return;
    }

    let proceeds = 0;
    const soldLabels: string[] = [];

    setSandboxHoldings((previous) => {
      const next = { ...previous };

      autoSellOrders.forEach((holding) => {
        const executionPrice = Math.round(holding.sellLimitPrice ?? marketPrices[holding.assetId] ?? holding.averagePrice);
        proceeds += executionPrice * holding.quantity;
        soldLabels.push(`${holding.quantity.toFixed(2)} ${holding.name} at ${executionPrice} YQ`);
        delete next[holding.assetId];
      });

      return next;
    });

    if (proceeds > 0) {
      setSandboxBalance((previous) => previous + proceeds);
    }

    soldLabels.forEach((label) => {
      pushSandboxAction(`Auto-sold ${label} (limit reached)`);
    });

    if (soldLabels.length > 0) {
      setMascotMessage("A sell limit was reached. The Sandbox position was sold automatically.");
    }
  }, [marketPrices, sandboxHoldings]);

  useEffect(() => {
    const autoBuyOrders = Object.values(sandboxHoldings).filter((holding) => {
      if (holding.buyLimitPrice == null) {
        return false;
      }

      const livePrice = marketPrices[holding.assetId] ?? holding.averagePrice;
      return livePrice <= holding.buyLimitPrice;
    });

    if (autoBuyOrders.length === 0) {
      return;
    }

    let spent = 0;
    const boughtLabels: string[] = [];

    setSandboxHoldings((previous) => {
      const next = { ...previous };

      autoBuyOrders.forEach((holding) => {
        const current = next[holding.assetId];
        if (!current) {
          return;
        }

        const executionPrice = Math.round(holding.buyLimitPrice ?? marketPrices[holding.assetId] ?? holding.averagePrice);
        if (sandboxBalance - spent < executionPrice) {
          return;
        }

        const newQuantity = current.quantity + 1;
        const newAverage = (current.averagePrice * current.quantity + executionPrice) / newQuantity;

        next[holding.assetId] = {
          ...current,
          quantity: newQuantity,
          averagePrice: newAverage,
          buyLimitPrice: null,
        };

        spent += executionPrice;
        boughtLabels.push(`1 ${current.name} at ${executionPrice} YQ`);
      });

      return next;
    });

    if (spent > 0) {
      setSandboxBalance((previous) => previous - spent);
    }

    boughtLabels.forEach((label) => {
      pushSandboxAction(`Auto-bought ${label} (limit reached)`);
    });

    if (boughtLabels.length > 0) {
      setMascotMessage("An auto-buy limit was reached. The Sandbox position was bought automatically.");
    }
  }, [marketPrices, sandboxBalance, sandboxHoldings]);

  // Get current mission based on progress
  const getCurrentMission = () => {
    const unit1 = unitsProgress[0];
    const unit2 = unitsProgress[1];
    const unit3 = unitsProgress[2];
    const unit4 = unitsProgress[3];

    // Mission 1: always first until Unit 1 is fully complete
    if (!unit1.completed) {
      if (lessonModalOpen && currentUnitId === 1 && lessonStep >= 3 && !hasInvestedInLesson) {
        const remainingToInvest = Math.max(0, UNIT_1_INVEST_TARGET_YC - lessonInvestmentAmount);
        return {
          number: 1,
          title: "Make first investment",
          description: remainingToInvest > 0
            ? `Invest ${remainingToInvest} YQ more`
            : `Invest at least ${UNIT_1_INVEST_TARGET_YC} YQ in stocks`,
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
        const remainingToInvest = Math.max(0, UNIT_1_INVEST_TARGET_YC - lessonInvestmentAmount);
        return {
          number: 1,
          title: "Make first investment",
          description: remainingToInvest > 0
            ? `Invest ${remainingToInvest} YQ more`
            : `Invest at least ${UNIT_1_INVEST_TARGET_YC} YQ in stocks`,
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
        title: "Master Investor!",
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
    
    if (lessonModalOpen && lessonStep === 3 && !hasInvestedInLesson) {
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
      return "Excellent work! You completed Unit 1!";
    }
    
    return "I'm here to help you learn about investing!";
  };

  const getMascotMessage = () => mascotOverride ?? getDefaultMascotMessage();

  // Check if investment is currently allowed in Learning
  const isInvestmentAllowedInLearning = () => {
    if (!lessonModalOpen) return false; // Not in lesson = no investment allowed
    if (lessonStep !== 3) return false; // Investment only allowed at step 3
    
    // Check if current unit and step requires investment
    const unitContent: Record<number, Record<number, {requiresInvestAction?: boolean}>> = {
      1: {
        3: { requiresInvestAction: true }, // Unit 1, Step 3 requires investment
      },
      2: {
        3: { requiresInvestAction: true }, // Unit 2, Step 3 requires investment
      },
      3: {
        3: { requiresInvestAction: true }, // Unit 3, Step 3 requires investment
      },
      4: {
        3: { requiresInvestAction: true }, // Unit 4, Step 3 requires investment
      },
    };
    
    return unitContent[currentUnitId]?.[lessonStep]?.requiresInvestAction ?? false;
  };

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
    setLessonInvestmentAmount(0);
    setLessonModalOpen(true);
  };

  const handleNextLessonStep = () => {
    lastActionAtRef.current = Date.now();

    if (lessonStep === 1) {
      // Move to step 2 - theory step
      setLessonStep(2);
    } else if (lessonStep === 2) {
      // Move to step 3 - investment step
      setLessonStep(3);
    } else if (lessonStep === 3 && hasInvestedInLesson) {
      // Move to step 4 - quiz intro
      setLessonStep(4);
      // Mark lesson as completed
      setUnitsProgress(prev => prev.map(unit => 
        unit.unitId === currentUnitId 
          ? { ...unit, lessonCompleted: true }
          : unit
      ));
    } else if (lessonStep === 4) {
      // Open quiz
      setLessonModalOpen(false);
      setQuizModalOpen(true);
    }
  };

  const handleOpenInvest = () => {
    lastActionAtRef.current = Date.now();
    setTradeContext("learning");
    setInvestModalOpen(true);
  };

  const handleSandboxTrade = (asset: Asset, quantity: number, action: "buy" | "sell", unitPrice: number) => {
    const total = Math.round(unitPrice * quantity);

    if (action === "buy") {
      if (total > sandboxBalance) {
        return;
      }

      setSandboxBalance((prev) => prev - total);
      setSandboxHoldings((prev) => {
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

      setMascotMessage(`Sandbox buy executed: ${asset.name}.`);
      pushSandboxAction(`Bought ${quantity} ${asset.name} at ${Math.round(unitPrice)} YQ`);
      return;
    }

    const currentHolding = sandboxHoldings[asset.id];
    if (!currentHolding || currentHolding.quantity < quantity) {
      return;
    }

    setSandboxBalance((prev) => prev + total);
    setSandboxHoldings((prev) => {
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

    setMascotMessage(`Sandbox sell executed on ${asset.name}.`);
    pushSandboxAction(`Sold ${quantity} ${asset.name} at ${Math.round(unitPrice)} YQ`);
  };

  const handleSandboxDirectTrade = (assetId: string, action: "buy" | "sell", quantity = 1) => {
    const asset = ASSETS.find((item) => item.id === assetId);
    if (!asset) {
      return;
    }

    const livePrice = marketPrices[asset.id] ?? asset.basePrice;
    handleSandboxTrade(asset, quantity, action, livePrice);
  };

  const handleSetSandboxSellLimit = (assetId: string, limitPrice: number | null) => {
    const asset = ASSETS.find((item) => item.id === assetId);

    setSandboxHoldings((prev) => {
      const current = prev[assetId];
      if (!current) {
        return prev;
      }

      if (limitPrice == null) {
        const { sellLimitPrice: _removed, ...rest } = current;
        return {
          ...prev,
          [assetId]: rest,
        };
      }

      return {
        ...prev,
        [assetId]: {
          ...current,
          sellLimitPrice: limitPrice,
        },
      };
    });

    if (asset) {
      if (limitPrice == null) {
        pushSandboxAction(`Removed auto-sell limit for ${asset.name}`);
      } else {
        pushSandboxAction(`Set auto-sell limit for ${asset.name} at ${Math.round(limitPrice)} YQ`);
      }
    }
  };

  const handleSetSandboxBuyLimit = (assetId: string, limitPrice: number | null) => {
    const asset = ASSETS.find((item) => item.id === assetId);

    setSandboxHoldings((prev) => {
      const current = prev[assetId];
      if (!current) {
        return prev;
      }

      if (limitPrice == null) {
        const { buyLimitPrice: _removed, ...rest } = current;
        return {
          ...prev,
          [assetId]: rest,
        };
      }

      return {
        ...prev,
        [assetId]: {
          ...current,
          buyLimitPrice: limitPrice,
        },
      };
    });

    if (asset) {
      if (limitPrice == null) {
        pushSandboxAction(`Removed auto-buy limit for ${asset.name}`);
      } else {
        pushSandboxAction(`Set auto-buy limit for ${asset.name} at ${Math.round(limitPrice)} YQ`);
      }
    }
  };

  const handleTrade = (asset: Asset, quantity: number, action: "buy" | "sell", unitPrice: number) => {
    lastActionAtRef.current = Date.now();

    if (tradeContext === "sandbox") {
      handleSandboxTrade(asset, quantity, action, unitPrice);
      return;
    }

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

      let handledLessonProgress = false;
      if (lessonModalOpen && lessonStep === 3) {
        if (currentUnitId === 1) {
          handledLessonProgress = true;
          setLessonInvestmentAmount((prev) => {
            const next = Math.min(UNIT_1_INVEST_TARGET_YC, prev + total);
            const remaining = Math.max(0, UNIT_1_INVEST_TARGET_YC - next);

            if (remaining === 0) {
              setHasInvestedInLesson(true);
              setMascotMessage(`Great! You invested at least ${UNIT_1_INVEST_TARGET_YC} YQ. Click Next to continue.`);
            } else {
              setHasInvestedInLesson(false);
              setMascotMessage(`Good start. Invest ${remaining} YQ more to complete this step.`);
            }

            return next;
          });
        } else {
          handledLessonProgress = true;
          setHasInvestedInLesson(true);
          setMascotMessage("Great! Investment objective completed. Click Next to continue.");
        }
      }

      if (!handledLessonProgress) {
        setMascotMessage(`Buy executed: ${asset.name}. Well done.`);
      }
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

  const handleClaimReward = (rewardId: string, yc: number, xpAmount: number) => {
    if (claimedRewards.includes(rewardId)) {
      return;
    }

    setClaimedRewards((prev) => [...prev, rewardId]);
    setBalance((prev) => prev + yc);
    setXp((prev) => prev + xpAmount);
    setMascotMessage(`Reward claimed! +${yc} YQ and +${xpAmount} XP.`);
  };

  const handlePurchaseCosmetic = (itemId: string, cost: number) => {
    if (unlockedCosmetics.includes(itemId) || balance < cost) {
      return;
    }

    setBalance((prev) => prev - cost);
    setUnlockedCosmetics((prev) => [...prev, itemId]);
    setMascotMessage("Cosmetic unlocked. Nice choice!");
  };

  const handleResetSandboxSession = () => {
    setSandboxBalance(10000);
    setSandboxHoldings({});
    setAccountValueHistory([]);
    setSandboxSessionStartValue(10000);
    setSandboxActionLog([]);
    setMascotMessage("Sandbox reset complete. Fresh start!");
    pushSandboxAction("Sandbox session reset to 10,000 YQ");
  };

  const handleSetSandboxBudget = (amount: number) => {
    setSandboxBalance(amount);
    setSandboxHoldings({});
    setAccountValueHistory([]);
    setSandboxSessionStartValue(amount);
    setSandboxActionLog([]);
    setMascotMessage(`Sandbox budget set to ${amount.toLocaleString()} YQ.`);
    pushSandboxAction(`Sandbox budget configured to ${amount.toLocaleString()} YQ`);
  };

  const mission = getCurrentMission();
  const unrealizedPnl = portfolioValue - investedCostBasis;

  const scenarioLabel: Record<"balanced" | "bull" | "bear" | "volatile", string> = {
    balanced: "Balanced",
    bull: "Bull market",
    bear: "Bear market",
    volatile: "High volatility",
  };

  const sandboxCoachMessage = useMemo(() => {
    if (sandboxPortfolioValue <= 0) {
      return "Pick a scenario, open INVEST, and place your first sandbox trade.";
    }
    if (maxDrawdown > 8) {
      return "Drawdown is getting high. Reduce risk or keep more cash buffer.";
    }
    if (diversificationScore < 40) {
      return "Your portfolio is concentrated. Add other sectors to stabilize results.";
    }
    if (sandboxPortfolioChange > 5 && diversificationScore < 55) {
      return "Nice gains, but stay disciplined: avoid over-concentration.";
    }
    if (marketScenario === "bear") {
      return "Bear mode: prioritize downside control and smaller entries.";
    }
    if (marketScenario === "volatile") {
      return "Volatile mode: keep position sizes small and avoid impulse trades.";
    }
    return "Good balance so far. Keep testing and compare outcomes by scenario.";
  }, [
    sandboxPortfolioValue,
    maxDrawdown,
    diversificationScore,
    sandboxPortfolioChange,
    marketScenario,
  ]);

  const rightPanelTheme: Record<"learning" | "sandbox" | "theory" | "rewards", { border: string; bg: string; label: string }> = {
    learning: { border: 'var(--black-100)', bg: 'white', label: 'Learning controls' },
    sandbox: { border: 'var(--orange-200)', bg: 'var(--orange-50)', label: 'Sandbox tools' },
    theory: { border: 'var(--light-blue-300)', bg: 'var(--light-blue-100)', label: 'Theory tools' },
    rewards: { border: 'var(--orange-200)', bg: 'var(--orange-50)', label: 'Rewards tools' },
  };

  const activeRightTheme = rightPanelTheme[activeTab];

  return (
    <div className="h-screen w-full flex overflow-hidden" style={{ backgroundColor: 'var(--blue-50)' }}>
      {/* Left Sidebar */}
      <div className="w-[340px] h-full shrink-0 bg-white flex flex-col overflow-hidden" style={{ borderRight: '1px solid var(--black-100)' }}>
        <UserProfile xp={xp} />
        <Navigation
          activeTab={activeTab}
          onLearningPathClick={() => setActiveTab("learning")}
          onSandboxClick={() => setActiveTab("sandbox")}
          onTheoryClick={() => setActiveTab("theory")}
          onRewardsClick={() => setActiveTab("rewards")}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full overflow-auto" style={{ background: 'linear-gradient(to bottom, var(--light-purple-200), var(--medium-purple-100))' }}>
        {activeTab === "learning" ? (
          <LearningPath
            onUnitClick={handleUnitClick}
            onChestClick={handleChestClick}
            unitsProgress={unitsProgress}
          />
        ) : activeTab === "sandbox" ? (
          <SandboxPage
            selectedScenario={marketScenario}
            onScenarioChange={handleScenarioChange}
            onResetSession={handleResetSandboxSession}
            onSetSandboxBudget={handleSetSandboxBudget}
            onDirectTrade={handleSandboxDirectTrade}
            onSetSellLimit={handleSetSandboxSellLimit}
            onSetBuyLimit={handleSetSandboxBuyLimit}
            onOpenInvest={() => {
              setTradeContext("sandbox");
              setInvestModalOpen(true);
            }}
            totalAccountValue={sandboxTotalAccountValue}
            balance={sandboxBalance}
            portfolioValue={sandboxPortfolioValue}
            portfolioChange={sandboxPortfolioChange}
            diversificationScore={diversificationScore}
            maxDrawdown={maxDrawdown}
            sessionStartValue={sandboxSessionStartValue}
            actionLog={sandboxActionLog}
            marketPrices={marketPrices}
            holdings={sandboxHoldingsList}
          />
        ) : activeTab === "rewards" ? (
          <RewardsPage
            unitsProgress={unitsProgress}
            balance={balance}
            xp={xp}
            holdingsCount={holdingsList.length}
            sectorCount={holdingsSectorCount}
            claimedRewards={claimedRewards}
            unlockedCosmetics={unlockedCosmetics}
            onClaimReward={handleClaimReward}
            onPurchaseCosmetic={handlePurchaseCosmetic}
            onOpenPromo={() => setPromoModalOpen(true)}
          />
        ) : (
          <TheoryPage unitsProgress={unitsProgress} />
        )}
      </div>

      {/* Right Sidebar */}
      <div
        className="w-[400px] h-full shrink-0 overflow-hidden p-8 flex flex-col gap-4 relative z-50 transition-colors duration-300"
        style={{
          borderLeft: `2px solid ${activeRightTheme.border}`,
          backgroundColor: activeRightTheme.bg,
        }}
      >
        {activeTab !== "learning" && (
          <div className="rounded-full px-3 py-1 w-fit text-xs" style={{ backgroundColor: 'white', border: `1px solid ${activeRightTheme.border}`, color: 'var(--black-400)' }}>
            {activeRightTheme.label}
          </div>
        )}

        {activeTab === "learning" ? (
          <>
            {/* Balance */}
            <div className="text-center pb-4" style={{ borderBottom: '1px solid var(--black-100)' }}>
              <p className="text-sm mb-2" style={{ color: 'var(--black-300)' }}>AVAILABLE BALANCE</p>
              <h2 className="text-2xl" style={{ color: 'var(--black-500)' }}>
                {balance.toLocaleString()} <span className="text-xl" style={{ color: 'var(--orange-400)' }}>YQ</span>
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
              onClick={() => {
                setTradeContext("learning");
                setInvestModalOpen(true);
              }}
              highlighted={lessonModalOpen && lessonStep === 3 && !hasInvestedInLesson}
              disabled={!isInvestmentAllowedInLearning()}
            />

            {/* Portfolio */}
            <PortfolioCard change={portfolioChange} hasData={hasPortfolioData} history={portfolioHistory} />

            {/* Mascot */}
            <div className="mt-auto pt-2">
              <Mascot message={getMascotMessage()} />
            </div>
          </>
        ) : activeTab === "theory" ? (
          <>
            <div className="rounded-xl p-4" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
              <p style={{ color: 'var(--black-500)' }}>Completed units: {completedUnitsCount}/4</p>
              <p style={{ color: 'var(--black-500)' }}>Completed quizzes: {completedQuizzesCount}/4</p>
              <p className="mt-2" style={{ color: 'var(--black-400)' }}>
                Suggested focus: Unit {nextTheoryUnit}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("learning")}
              className="rounded-xl px-4 py-3 text-center font-medium transition-all cursor-pointer hover:brightness-95"
              style={{ backgroundColor: 'var(--light-blue-400)', color: 'white' , border: '2px solid var(--light-blue-500)'}}
            >
              Back to learning path
            </button>
          </>
        ) : activeTab === "rewards" ? (
          <>
            <div className="rounded-xl p-4" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
              <p style={{ color: 'var(--black-500)' }}>Wallet: {Math.round(balance).toLocaleString()} YQ</p>
              <p style={{ color: 'var(--black-500)' }}>XP: {xp.toLocaleString()}</p>
              <p style={{ color: 'var(--black-500)' }}>Rewards claimed: {claimedRewards.length}</p>
              <p style={{ color: 'var(--black-500)' }}>Cosmetics unlocked: {unlockedCosmetics.length}</p>
            </div>

            {completedUnitsCount === unitsProgress.length ? (
              <button
                type="button"
                onClick={() => setPromoModalOpen(true)}
                className="rounded-xl px-4 py-3 text-left cursor-pointer"
                style={{ backgroundColor: 'var(--orange-400)', color: 'white' }}
              >
                Open promo code
              </button>
            ) : (
              <div className="rounded-xl p-4" style={{ backgroundColor: 'white', border: '1px dashed var(--black-200)' }}>
                <p className="text-sm" style={{ color: 'var(--black-400)' }}>
                  Promo code unlocks after completing all units.
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--black-300)' }}>
                  Remaining: {Math.max(0, unitsProgress.length - completedUnitsCount)} unit{Math.max(0, unitsProgress.length - completedUnitsCount) === 1 ? '' : 's'}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="rounded-xl p-4" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
              <p style={{ color: 'var(--black-500)' }}>Scenario: {scenarioLabel[marketScenario]}</p>
              <p style={{ color: 'var(--black-500)' }}>Sandbox cash: {Math.round(sandboxBalance).toLocaleString()} YQ</p>
              <p style={{ color: 'var(--black-500)' }}>Sandbox invested value: {Math.round(sandboxPortfolioValue).toLocaleString()} YQ</p>
              <p style={{ color: 'var(--black-500)' }}>Diversification score: {diversificationScore}/100</p>
              <p style={{ color: 'var(--black-500)' }}>Max drawdown: {maxDrawdown.toFixed(2)}%</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setTradeContext("sandbox");
                setInvestModalOpen(true);
              }}
              className="w-full rounded-xl px-4 py-3 text-center font-medium transition-all cursor-pointer hover:brightness-95"
              style={{
                backgroundColor: 'var(--orange-400)',
                border: '2px solid var(--orange-500)',
                color: 'white',
              }}
            >
              Open invest panel
            </button>

            <div className="mt-auto pt-2">
              <Mascot message={sandboxCoachMessage} />
            </div>
          </>
        )}

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
        totalSteps={4}
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
        balance={tradeContext === "sandbox" ? sandboxBalance : balance}
        marketPrices={marketPrices}
        holdings={tradeContext === "sandbox" ? sandboxHoldingQuantities : holdingQuantities}
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