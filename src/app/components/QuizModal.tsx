import { X, Heart } from "lucide-react";
import { useState } from "react";
import { Progress } from "./ui/progress";

interface Answer {
  id: string;
  text: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  unitNumber: number;
}

const MAX_LIVES = 3;

const quizQuestions: Record<number, Question[]> = {
  1: [
    {
      id: 1,
      question: "What does owning a stock mean?",
      options: [
        "You own a piece of the company",
        "You lend money to the company",
        "You work for the company",
        "You control the company's decisions",
      ],
      correctAnswer: 0,
      explanation: "When you buy stock, you become a shareholder - you own a tiny piece of that company and share in its success (or losses).",
    },
    {
      id: 2,
      question: "Why do stock prices change?",
      options: [
        "Because of company performance and investor sentiment",
        "Randomly, with no reason",
        "Only when the CEO decides",
        "They never change",
      ],
      correctAnswer: 0,
      explanation: "Stock prices reflect what investors think the company is worth. Good news pushes prices up, bad news pushes them down.",
    },
    {
      id: 3,
      question: "What's the best strategy for a beginner investor?",
      options: [
        "Invest everything in one hot stock",
        "Wait until you understand everything perfectly",
        "Start small and learn as you grow",
        "Only invest when the market is at its lowest",
      ],
      correctAnswer: 2,
      explanation: "Starting small lets you learn with real money without risking too much. You'll gain experience and confidence over time.",
    },
    {
      id: 4,
      question: "If a stock's price drops, does that mean you lose money?",
      options: [
        "Yes, immediately",
        "Only if you sell at that lower price",
        "No, stock prices never affect your money",
        "Only on weekends",
      ],
      correctAnswer: 1,
      explanation: "You only 'lock in' a loss when you sell. If you hold the stock, you still own the same shares and the price can recover.",
    },
    {
      id: 5,
      question: "What makes Swiss companies attractive to investors?",
      options: [
        "They're always the cheapest option",
        "Stability, quality, and strong reputation",
        "They guarantee profits",
        "They never lose value",
      ],
      correctAnswer: 1,
      explanation: "Swiss companies like Nestlé and Novartis are known for stability and quality, making them good choices for conservative investors - though no investment is risk-free!",
    },
  ],
  2: [
    {
      id: 1,
      question: "What is diversification?",
      options: [
        "Investing all your money in your favorite company",
        "Spreading investments across different sectors and companies",
        "Only investing in Swiss companies",
        "Selling all your stocks quickly",
      ],
      correctAnswer: 1,
      explanation: "Diversification means spreading your money across different investments. If one fails, you don't lose everything.",
    },
    {
      id: 2,
      question: "Why shouldn't you put all your eggs in one basket?",
      options: [
        "It's more fun to own multiple stocks",
        "If that one investment fails, you lose everything",
        "You need at least 100 different stocks",
        "The law requires diversification",
      ],
      correctAnswer: 1,
      explanation: "If you invest everything in one company and it struggles, your entire portfolio suffers. Diversification protects you.",
    },
    {
      id: 3,
      question: "What does sector diversification mean?",
      options: [
        "Investing in companies from different industries",
        "Only buying technology stocks",
        "Selling stocks every month",
        "Investing in your local area only",
      ],
      correctAnswer: 0,
      explanation: "Different sectors (healthcare, banking, luxury, food) perform differently. Owning multiple sectors reduces risk.",
    },
    {
      id: 4,
      question: "If the healthcare sector crashes, how does diversification help?",
      options: [
        "It prevents any crashes from happening",
        "Your other sector investments can balance the loss",
        "It automatically sells your healthcare stocks",
        "It doesn't help at all",
      ],
      correctAnswer: 1,
      explanation: "When one sector struggles, others might do well. Your banking or food stocks can offset healthcare losses.",
    },
    {
      id: 5,
      question: "How many different investments do beginners need?",
      options: [
        "Just 1 is enough",
        "Exactly 100",
        "5-10 is a good start",
        "You need 1000+",
      ],
      correctAnswer: 2,
      explanation: "Experts suggest 5-10 different investments for beginners. Enough diversity to reduce risk, but not too many to manage.",
    },
  ],
  3: [
    {
      id: 1,
      question: "What is a market crash?",
      options: [
        "When one company goes bankrupt",
        "When stock prices drop suddenly and sharply across the market",
        "When the stock exchange closes",
        "When you lose your password",
      ],
      correctAnswer: 1,
      explanation: "A market crash is when many stocks lose value rapidly at the same time, usually due to economic fear or crisis.",
    },
    {
      id: 2,
      question: "What should you do during a market crash?",
      options: [
        "Panic and sell everything immediately",
        "Stay calm, hold your investments, and consider buying more",
        "Stop checking your portfolio forever",
        "Invest all your remaining money at once",
      ],
      correctAnswer: 1,
      explanation: "History shows markets always recover. Selling during a crash locks in losses. Staying calm (or buying) positions you for recovery.",
    },
    {
      id: 3,
      question: "What does 'buy the dip' mean?",
      options: [
        "Only invest when prices are high",
        "Purchase stocks when prices have temporarily dropped",
        "Buy food during a crash",
        "Sell everything during a downturn",
      ],
      correctAnswer: 1,
      explanation: "A 'dip' is a temporary price drop. Buying quality companies at discount prices can lead to bigger profits when they recover.",
    },
    {
      id: 4,
      question: "What did Warren Buffett mean: 'Be fearful when others are greedy, greedy when others are fearful'?",
      options: [
        "Always do the opposite of everyone else",
        "When markets crash (fear), it's often a buying opportunity",
        "Fear is good, greed is bad",
        "Never invest in popular companies",
      ],
      correctAnswer: 1,
      explanation: "When everyone panics and sells (fear), prices drop - creating buying opportunities for patient investors.",
    },
    {
      id: 5,
      question: "Have stock markets historically recovered from crashes?",
      options: [
        "No, crashes are permanent",
        "Yes, markets have always recovered over time",
        "Only sometimes",
        "Nobody knows",
      ],
      correctAnswer: 1,
      explanation: "Every major crash in history (1929, 2000, 2008, 2020) has been followed by recovery and new highs. Patience is key.",
    },
  ],
  4: [
    {
      id: 1,
      question: "What is dollar-cost averaging?",
      options: [
        "Investing all your money at once",
        "Only investing in US dollars",
        "Investing fixed amounts regularly over time",
        "Averaging your investment returns",
      ],
      correctAnswer: 2,
      explanation: "Dollar-cost averaging means investing the same amount regularly (weekly, monthly). This smooths out price fluctuations over time.",
    },
    {
      id: 2,
      question: "How does dollar-cost averaging help with market volatility?",
      options: [
        "It eliminates all risk",
        "You buy more shares when prices are low, fewer when high",
        "It guarantees profits",
        "It only works in bull markets",
      ],
      correctAnswer: 1,
      explanation: "Regular fixed investments mean you automatically buy more shares when prices dip and fewer when prices spike - optimizing your average cost.",
    },
    {
      id: 3,
      question: "What is portfolio rebalancing?",
      options: [
        "Selling all your stocks and starting over",
        "Adjusting your portfolio to maintain your target allocation",
        "Only buying new stocks",
        "Checking your portfolio daily",
      ],
      correctAnswer: 1,
      explanation: "Over time, some investments grow more than others. Rebalancing means selling some winners and buying underweighted assets to maintain your strategy.",
    },
    {
      id: 4,
      question: "What's the main benefit of long-term investing?",
      options: [
        "You can get rich overnight",
        "Compound growth and time to recover from downturns",
        "You never have to check your portfolio",
        "It's less work than short-term trading",
      ],
      correctAnswer: 1,
      explanation: "Long-term investing (10+ years) lets your returns compound and gives you time to ride out market crashes. Patience builds wealth.",
    },
    {
      id: 5,
      question: "What defines a successful investor?",
      options: [
        "Someone who never loses money on any trade",
        "Someone with discipline, patience, and a long-term strategy",
        "Someone who trades every day",
        "Someone who only invests in winners",
      ],
      correctAnswer: 1,
      explanation: "Even the best investors have losses. Success comes from discipline, learning from mistakes, and sticking to a sound long-term strategy.",
    },
  ],
};

export function QuizModal({ isOpen, onClose, onComplete, unitNumber }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  if (!isOpen) return null;

  const questions = (quizQuestions[unitNumber] || quizQuestions[1]).slice(0, 3);
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const resetQuizState = () => {
    setCurrentQuestion(0);
    setLives(MAX_LIVES);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setIsFailed(false);
  };

  const handleClose = () => {
    resetQuizState();
    onClose();
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback || isFailed) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === question.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (!correct) {
      const nextLives = Math.max(0, lives - 1);
      setLives(nextLives);
      if (nextLives === 0) {
        setIsFailed(true);
      }
    }
  };

  const handleNext = () => {
    if (isFailed) {
      resetQuizState();
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      onComplete();
      // Reset quiz state
      resetQuizState();
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4 sm:p-6 pointer-events-none">
      <div className="pointer-events-auto relative w-full max-w-[720px] bg-white rounded-2xl shadow-2xl p-8 -translate-x-8">
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" style={{ color: 'var(--black-400)' }} />
        </button>

        {/* Lives */}
        <div className="flex gap-2 mb-6">
          {[...Array(MAX_LIVES)].map((_, i) => (
            <Heart
              key={i}
              className="w-8 h-8"
              fill={i < lives ? 'var(--orange-400)' : 'transparent'}
              style={{ 
                color: i < lives ? 'var(--orange-400)' : 'var(--black-100)',
                stroke: i < lives ? 'var(--orange-400)' : 'var(--black-100)'
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm" style={{ color: 'var(--black-300)' }}>Unit {unitNumber} Quiz</h3>
          <span className="text-sm" style={{ color: 'var(--black-300)' }}>
            Question {currentQuestion + 1}/{questions.length}
          </span>
        </div>

        {/* Question */}
        <h2 className="text-2xl mb-6" style={{ color: 'var(--black-500)' }}>
          {question.question}
        </h2>

        {/* Answers */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === question.correctAnswer;
            const showAsCorrect = showFeedback && isCorrectAnswer;
            const showAsWrong = showFeedback && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
                className="w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 group cursor-pointer"
                style={{
                  backgroundColor: showAsCorrect
                    ? 'var(--light-blue-200)'
                    : showAsWrong
                    ? 'var(--orange-100)'
                    : isSelected
                    ? 'var(--light-purple-200)'
                    : 'white',
                  border: `2px solid ${
                    showAsCorrect
                      ? 'var(--light-blue-500)'
                      : showAsWrong
                      ? 'var(--orange-400)'
                      : isSelected
                      ? 'var(--light-purple-400)'
                      : 'var(--black-100)'
                  }`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: showAsCorrect
                      ? 'var(--light-blue-500)'
                      : showAsWrong
                      ? 'var(--orange-400)'
                      : 'var(--black-50)',
                    color: showAsCorrect || showAsWrong ? 'white' : 'var(--black-400)',
                  }}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span style={{ color: 'var(--black-500)' }}>{option}</span>
                {showAsCorrect && (
                  <span className="ml-auto text-xl">✓</span>
                )}
                {showAsWrong && (
                  <span className="ml-auto text-xl">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div
            className="p-4 rounded-xl mb-6"
            style={{
              backgroundColor: isCorrect ? 'var(--light-blue-100)' : 'var(--orange-50)',
              border: `1px solid ${isCorrect ? 'var(--light-blue-300)' : 'var(--orange-200)'}`,
            }}
          >
            <div className="flex items-start gap-2">
              <span className="text-xl flex-shrink-0">
                {isCorrect ? '✓' : '✗'}
              </span>
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--black-500)' }}>
                  {isFailed ? 'No lives left!' : isCorrect ? 'Correct!' : 'Not quite!'}
                </p>
                <p className="text-sm" style={{ color: 'var(--black-400)' }}>
                  {isFailed
                    ? 'You made 3 mistakes. The quiz restarts from question 1 with 3 new lives.'
                    : question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="mb-4">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Next Button */}
        {showFeedback && (
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl transition-colors cursor-pointer"
            style={{
              backgroundColor: isFailed ? 'var(--orange-300)' : 'var(--purple-300)',
              color: 'var(--black-500)',
            }}
          >
            {isFailed
              ? 'Retry Quiz'
              : currentQuestion < questions.length - 1
              ? 'Next Question'
              : 'Complete Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}