import { X, Gift, Copy, Check } from "lucide-react";
import { useState } from "react";

interface PromoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PromoCodeModal({ isOpen, onClose }: PromoCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const promoCode = "LEARNINVEST50";

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" style={{ color: 'var(--black-400)' }} />
        </button>

        {/* Icon */}
        <div 
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ backgroundColor: 'var(--purple-200)' }}
        >
          <Gift className="w-10 h-10" style={{ color: 'var(--purple-400)' }} />
        </div>

        {/* Title */}
        <h2 className="text-2xl text-center mb-2" style={{ color: 'var(--black-500)' }}>
          Congratulations! 🎉
        </h2>
        <p className="text-center mb-6" style={{ color: 'var(--black-400)' }}>
          You unlocked your exclusive reward
        </p>

        {/* Promo Details */}
        <div 
          className="p-6 rounded-xl mb-6"
          style={{ 
            backgroundColor: 'var(--light-purple-100)',
            border: '2px solid var(--purple-300)'
          }}
        >
          <div className="text-center mb-4">
            <p className="text-sm mb-2" style={{ color: 'var(--black-400)' }}>
              Receive
            </p>
            <p className="text-4xl font-bold" style={{ color: 'var(--purple-500)' }}>
              50 CHF
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--black-400)' }}>
              when opening your Yuh account
            </p>
          </div>

          {/* Promo Code */}
          <div className="relative">
            <div 
              className="p-4 rounded-lg text-center font-mono text-xl tracking-wider"
              style={{ 
                backgroundColor: 'white',
                border: '2px dashed var(--purple-400)',
                color: 'var(--purple-500)'
              }}
            >
              {promoCode}
            </div>
            <button
              onClick={handleCopyCode}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors"
              style={{ 
                backgroundColor: copied ? 'var(--light-blue-200)' : 'var(--purple-200)',
                color: copied ? 'var(--light-blue-500)' : 'var(--purple-500)'
              }}
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--light-blue-200)', color: 'var(--light-blue-500)' }}
            >
              1
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--black-500)' }}>
                Download the Yuh app
              </p>
              <p className="text-xs" style={{ color: 'var(--black-400)' }}>
                Available on iOS and Android
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--light-blue-200)', color: 'var(--light-blue-500)' }}
            >
              2
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--black-500)' }}>
                Create your account
              </p>
              <p className="text-xs" style={{ color: 'var(--black-400)' }}>
                Enter the promo code during signup
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--light-blue-200)', color: 'var(--light-blue-500)' }}
            >
              3
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--black-500)' }}>
                Get 50 CHF
              </p>
              <p className="text-xs" style={{ color: 'var(--black-400)' }}>
                Credited directly to your account
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl transition-colors"
          style={{
            backgroundColor: 'var(--purple-400)',
            color: 'white',
          }}
        >
          Got it!
        </button>

        {/* Terms */}
        <p className="text-xs text-center mt-4" style={{ color: 'var(--black-300)' }}>
          Offer valid for new accounts only. Terms and conditions apply.
        </p>
      </div>
    </div>
  );
}
