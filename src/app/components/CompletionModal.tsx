import { X, Trophy, Star, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitNumber: number;
  unitTitle: string;
  xpEarned: number;
}

export function CompletionModal({ isOpen, onClose, unitNumber, unitTitle, xpEarned }: CompletionModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                backgroundColor: [
                  'var(--orange-400)',
                  'var(--light-blue-400)',
                  'var(--purple-400)',
                  'var(--pink-400)',
                  'var(--light-purple-400)',
                ][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative w-full max-w-[540px] bg-white rounded-2xl shadow-2xl p-8 text-center">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" style={{ color: 'var(--black-400)' }} />
        </button>

        {/* Trophy Icon */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'var(--orange-50)' }}
        >
          <Trophy className="w-12 h-12" style={{ color: 'var(--orange-500)' }} />
        </div>

        {/* Title */}
        <h2 className="text-3xl mb-2" style={{ color: 'var(--black-500)' }}>
          Congratulations!
        </h2>
        <p className="text-lg mb-6" style={{ color: 'var(--black-400)' }}>
          You completed Unit {unitNumber}: {unitTitle}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: 'var(--light-blue-100)', border: '1px solid var(--light-blue-300)' }}
          >
            <Star className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--orange-400)' }} />
            <p className="text-2xl mb-1" style={{ color: 'var(--black-500)' }}>
              +{xpEarned}
            </p>
            <p className="text-xs" style={{ color: 'var(--black-300)' }}>
              XP
            </p>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: 'var(--orange-50)', border: '1px solid var(--orange-200)' }}
          >
            <TrendingUp className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--orange-500)' }} />
            <p className="text-2xl mb-1" style={{ color: 'var(--black-500)' }}>
              100%
            </p>
            <p className="text-xs" style={{ color: 'var(--black-300)' }}>
              Complete
            </p>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: 'var(--orange-50)', border: '1px solid var(--orange-200)' }}
          >
            <Trophy className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--orange-500)' }} />
            <p className="text-2xl mb-1" style={{ color: 'var(--black-500)' }}>
              1
            </p>
            <p className="text-xs" style={{ color: 'var(--black-300)' }}>
              Unit
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onClose}
          className="w-full py-4 rounded-xl transition-colors"
          style={{
            backgroundColor: 'var(--purple-300)',
            color: 'var(--black-500)',
          }}
        >
          Continue Learning
        </button>
      </div>

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
}
