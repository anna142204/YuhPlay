import { useState, useEffect } from "react";
import { UserProfile } from "./components/UserProfile";
import { Navigation } from "./components/Navigation";
import { LearningPath } from "./components/LearningPath";
import { MissionCard, InvestButton, PortfolioCard, Mascot } from "./components/RightSidebar";
import { LessonModal } from "./components/LessonModal";
import { QuizModal } from "./components/QuizModal";
import { InvestModal } from "./components/InvestModal";
import { CompletionModal } from "./components/CompletionModal";
import { PromoCodeModal } from "./components/PromoCodeModal";

interface UnitProgress {
  unitId: number;
  completed: boolean;
  quizCompleted: boolean;
  lessonCompleted: boolean;
}

export default function App() {
  const [balance, setBalance] = useState(10000);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [portfolioChange, setPortfolioChange] = useState(0);
  const [hasPortfolioData, setHasPortfolioData] = useState(false);
  const [portfolio, setPortfolio] = useState<string[]>([]);
  
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

  const unitTitles: Record<number, string> = {
    1: "First steps",
    2: "Swiss shield",
    3: "Market crash survival",
    4: "Advanced strategies",
  };

  // Get current mission based on progress
  const getCurrentMission = () => {
    const completedUnits = unitsProgress.filter(u => u.completed).length;
    
    // Mission 1: Complete Unit 1
    if (completedUnits === 0) {
      const unit1 = unitsProgress[0];
      
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
      
      if (!unit1.quizCompleted) {
        return {
          number: 1,
          title: "Pass the quiz",
          description: "Show what you've learned",
          progress: 2,
          total: 3,
        };
      }
    }
    
    // Mission 2: Complete Unit 2
    if (completedUnits === 1) {
      const unit2 = unitsProgress[1];
      
      if (!unit2.lessonCompleted) {
        return {
          number: 2,
          title: "Learn diversification",
          description: "Master the Swiss Shield strategy",
          progress: 0,
          total: 3,
        };
      }
      
      if (!unit2.quizCompleted) {
        return {
          number: 2,
          title: "Diversify your portfolio",
          description: "Spread your investments wisely",
          progress: 2,
          total: 3,
        };
      }
    }
    
    // Mission 3: Complete Unit 3
    if (completedUnits === 2) {
      const unit3 = unitsProgress[2];
      
      if (!unit3.lessonCompleted) {
        return {
          number: 3,
          title: "Crash survival training",
          description: "Learn to handle market downturns",
          progress: 0,
          total: 3,
        };
      }
      
      if (!unit3.quizCompleted) {
        return {
          number: 3,
          title: "Master crisis management",
          description: "Complete the crash survival quiz",
          progress: 2,
          total: 3,
        };
      }
    }
    
    // Mission 4: Complete Unit 4
    if (completedUnits === 3) {
      const unit4 = unitsProgress[3];
      
      if (!unit4.lessonCompleted) {
        return {
          number: 4,
          title: "Advanced investor",
          description: "Learn professional strategies",
          progress: 0,
          total: 3,
        };
      }
      
      if (!unit4.quizCompleted) {
        return {
          number: 4,
          title: "Final challenge",
          description: "Prove your mastery",
          progress: 2,
          total: 3,
        };
      }
    }
    
    // All units completed!
    if (completedUnits === 4) {
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

  const getMascotMessage = () => {
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

  const handleUnitClick = (unitId: number) => {
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
    setInvestModalOpen(true);
  };

  const handleInvest = (asset: any, quantity: number) => {
    const totalCost = asset.price * quantity;
    setBalance(balance - totalCost);
    setHasPortfolioData(true);
    setPortfolioChange(2.5);
    
    // Add to portfolio
    if (!portfolio.includes(asset.id)) {
      setPortfolio(prev => [...prev, asset.id]);
    }
    
    setInvestModalOpen(false);
    
    // Mark investment as done
    if (lessonModalOpen && lessonStep === 2) {
      setHasInvestedInLesson(true);
      // Auto advance to step 3 after short delay
      setTimeout(() => {
        if (lessonModalOpen) {
          handleNextLessonStep();
        }
      }, 500);
    }
  };

  const handleQuizComplete = () => {
    // Mark quiz as completed
    setUnitsProgress(prev => prev.map(unit => 
      unit.unitId === currentUnitId 
        ? { ...unit, quizCompleted: true, completed: true }
        : unit
    ));
    
    // Add rewards
    setXp(prev => prev + 250);
    setStreak(prev => prev + 1);
    setQuizModalOpen(false);
    setCompletionModalOpen(true);
  };

  const mission = getCurrentMission();
  const currentUnit = unitsProgress.find(u => u.unitId === currentUnitId);

  return (
    <div className="size-full flex" style={{ backgroundColor: 'var(--blue-50)' }}>
      {/* Left Sidebar */}
      <div className="w-[280px] bg-white flex flex-col" style={{ borderRight: '1px solid var(--black-100)' }}>
        <UserProfile xp={xp} streak={streak} />
        <Navigation onRewardsClick={() => setPromoModalOpen(true)} />
      </div>

      {/* Main Content - Learning Path */}
      <div className="flex-1 overflow-auto" style={{ background: 'linear-gradient(to bottom, var(--light-purple-200), var(--medium-purple-100))' }}>
        <LearningPath 
          onUnitClick={handleUnitClick}
          unitsProgress={unitsProgress}
        />
      </div>

      {/* Right Sidebar */}
      <div className="w-[320px] bg-white p-6 flex flex-col gap-6 relative z-50" style={{ borderLeft: '1px solid var(--black-100)' }}>
        {/* Balance */}
        <div className="text-center pb-4" style={{ borderBottom: '1px solid var(--black-100)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--black-300)' }}>AVAILABLE BALANCE</p>
          <h2 style={{ color: 'var(--black-500)' }}>
            {balance.toLocaleString()} <span className="text-2xl">YC</span>
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
        <PortfolioCard change={portfolioChange} hasData={hasPortfolioData} />

        {/* Mascot */}
        <div className="mt-auto">
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
        onInvest={handleInvest}
        balance={balance}
        currentUnitId={currentUnitId}
        lessonStep={lessonStep}
        currentPortfolio={portfolio}
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