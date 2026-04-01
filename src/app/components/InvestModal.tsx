import { X, Search, ArrowLeft, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import { useState } from "react";

interface Asset {
  id: string;
  name: string;
  category: string;
  sector: string;
  price: number;
  risk: "Low risk" | "Medium risk" | "High risk";
  icon: string;
  description: string;
  performance: string;
}

interface InvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvest: (asset: Asset, amount: number) => void;
  balance: number;
  currentUnitId?: number;
  lessonStep?: number;
  currentPortfolio?: string[];
}

const assets: Asset[] = [
  { 
    id: "1", 
    name: "Nestlé", 
    category: "Food & Beverage", 
    sector: "Consumer Goods",
    price: 100, 
    risk: "Low risk", 
    icon: "🍫",
    description: "World's largest food company. Stable, defensive stock with consistent dividends.",
    performance: "+5.2% this year"
  },
  { 
    id: "2", 
    name: "Novartis", 
    category: "Pharmaceutical", 
    sector: "Healthcare",
    price: 280, 
    risk: "Low risk", 
    icon: "💊",
    description: "Global healthcare leader. Strong R&D pipeline and reliable performance.",
    performance: "+8.1% this year"
  },
  { 
    id: "3", 
    name: "Roche", 
    category: "Biotechnology", 
    sector: "Healthcare",
    price: 320, 
    risk: "Low risk", 
    icon: "🧬",
    description: "Pioneer in diagnostics and pharmaceuticals. Long-term stability.",
    performance: "+6.7% this year"
  },
  { 
    id: "4", 
    name: "Richemont", 
    category: "Luxury goods", 
    sector: "Luxury",
    price: 250, 
    risk: "Medium risk", 
    icon: "⌚",
    description: "Cartier, IWC owner. Benefits from global luxury demand.",
    performance: "+12.3% this year"
  },
  { 
    id: "5", 
    name: "UBS", 
    category: "Banking", 
    sector: "Finance",
    price: 360, 
    risk: "Medium risk", 
    icon: "🏦",
    description: "Switzerland's largest bank. Strong wealth management division.",
    performance: "+15.4% this year"
  },
  { 
    id: "6", 
    name: "Swatch Group", 
    category: "Watches", 
    sector: "Luxury",
    price: 180, 
    risk: "Medium risk", 
    icon: "⏱️",
    description: "Owner of Omega, Longines. Exposed to Asian market trends.",
    performance: "+9.8% this year"
  },
  { 
    id: "7", 
    name: "ABB", 
    category: "Industrial Tech", 
    sector: "Industry",
    price: 150, 
    risk: "Medium risk", 
    icon: "⚡",
    description: "Robotics and automation leader. Green energy transition beneficiary.",
    performance: "+18.2% this year"
  },
  { 
    id: "8", 
    name: "Credit Suisse", 
    category: "Banking", 
    sector: "Finance",
    price: 80, 
    risk: "High risk", 
    icon: "🏛️",
    description: "Major bank undergoing restructuring. High risk, potential upside.",
    performance: "-23.5% this year"
  },
];

export function InvestModal({ 
  isOpen, 
  onClose, 
  onInvest, 
  balance,
  currentUnitId = 1,
  lessonStep = 1,
  currentPortfolio = []
}: InvestModalProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"Stocks" | "Crypto" | "ETF" | "Savings">("Stocks");
  const [showValidation, setShowValidation] = useState(false);

  if (!isOpen) return null;

  const handleConfirmInvestment = () => {
    if (selectedAsset) {
      setShowValidation(true);
      setTimeout(() => {
        onInvest(selectedAsset, quantity);
        setSelectedAsset(null);
        setQuantity(1);
        setShowValidation(false);
      }, 1500);
    }
  };

  const totalCost = selectedAsset ? selectedAsset.price * quantity : 0;
  const remainingBalance = balance - totalCost;
  const maxQuantity = selectedAsset ? Math.floor(balance / selectedAsset.price) : 1;

  // Smart recommendations based on lesson context
  const getRecommendation = (asset: Asset) => {
    // Unit 1: First investment - any Swiss stock
    if (currentUnitId === 1 && currentPortfolio.length === 0) {
      if (asset.risk === "Low risk") {
        return {
          type: "good",
          message: "Excellent choice for your first investment! Low risk and stable."
        };
      }
      return {
        type: "warning",
        message: "Consider starting with a lower risk option for your first investment."
      };
    }

    // Unit 2: Diversification - different sector
    if (currentUnitId === 2 && currentPortfolio.length > 0) {
      const hasSector = currentPortfolio.some(p => {
        const existing = assets.find(a => a.id === p);
        return existing?.sector === asset.sector;
      });
      
      if (!hasSector) {
        return {
          type: "good",
          message: "Perfect! This is a different sector - great diversification!"
        };
      }
      return {
        type: "warning",
        message: "You already have this sector. Try diversifying into healthcare, finance, or luxury."
      };
    }

    // Unit 3: Buy the dip - look for value
    if (currentUnitId === 3) {
      if (asset.risk === "High risk" || asset.performance.includes("-")) {
        return {
          type: "good",
          message: "Good eye! This stock is down - potential 'buy the dip' opportunity."
        };
      }
      return {
        type: "neutral",
        message: "This stock is performing well. For crisis lessons, consider undervalued stocks."
      };
    }

    // Unit 4: Advanced strategies
    if (currentUnitId === 4) {
      const portfolioValue = totalCost / balance;
      if (portfolioValue < 0.3 && portfolioValue > 0.1) {
        return {
          type: "good",
          message: "Smart allocation! You're applying dollar-cost averaging principles."
        };
      }
    }

    return {
      type: "neutral",
      message: "This is a solid Swiss company with a strong track record."
    };
  };

  const validation = selectedAsset ? getRecommendation(selectedAsset) : null;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low risk":
        return "var(--light-blue-300)";
      case "Medium risk":
        return "var(--blue-300)";
      case "High risk":
        return "var(--orange-300)";
      default:
        return "var(--black-100)";
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-end pointer-events-none">
      <div
        className="pointer-events-auto relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
        style={{ maxHeight: "100vh" }}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--black-100)' }}>
          <div className="flex items-center justify-between mb-4">
            {selectedAsset ? (
              <button
                onClick={() => setSelectedAsset(null)}
                className="flex items-center gap-2 text-sm"
                style={{ color: 'var(--black-400)' }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <h2 className="text-2xl" style={{ color: 'var(--black-500)' }}>
                Invest
              </h2>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" style={{ color: 'var(--black-400)' }} />
            </button>
          </div>

          {!selectedAsset && (
            <>
              {/* Context Hint */}
              {currentUnitId === 1 && currentPortfolio.length === 0 && (
                <div 
                  className="mb-4 p-3 rounded-lg flex items-start gap-2"
                  style={{ backgroundColor: 'var(--light-blue-100)', border: '1px solid var(--light-blue-300)' }}
                >
                  <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--light-blue-500)' }} />
                  <p className="text-xs" style={{ color: 'var(--black-500)' }}>
                    <strong>First investment tip:</strong> Start with a low-risk Swiss company like Nestlé or Novartis.
                  </p>
                </div>
              )}

              {currentUnitId === 2 && currentPortfolio.length > 0 && (
                <div 
                  className="mb-4 p-3 rounded-lg flex items-start gap-2"
                  style={{ backgroundColor: 'var(--purple-100)', border: '1px solid var(--purple-300)' }}
                >
                  <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--purple-400)' }} />
                  <p className="text-xs" style={{ color: 'var(--black-500)' }}>
                    <strong>Diversification tip:</strong> Choose a stock from a DIFFERENT sector than your current holdings.
                  </p>
                </div>
              )}

              {currentUnitId === 3 && (
                <div 
                  className="mb-4 p-3 rounded-lg flex items-start gap-2"
                  style={{ backgroundColor: 'var(--orange-100)', border: '1px solid var(--orange-300)' }}
                >
                  <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--orange-400)' }} />
                  <p className="text-xs" style={{ color: 'var(--black-500)' }}>
                    <strong>Crisis strategy:</strong> Look for stocks that are down (negative %). Buy quality companies at a discount!
                  </p>
                </div>
              )}

              {/* Search */}
              <div className="relative mb-4">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'var(--black-300)' }}
                />
                <input
                  type="text"
                  placeholder="Search Swiss companies..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: 'var(--blue-50)',
                    border: '1px solid var(--black-100)',
                    color: 'var(--black-500)',
                  }}
                />
              </div>

              {/* Tabs */}
              <div className="flex gap-2">
                {(["Stocks", "Crypto", "ETF", "Savings"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="px-4 py-2 rounded-lg text-sm transition-colors"
                    style={{
                      backgroundColor:
                        activeTab === tab ? 'var(--light-purple-400)' : 'var(--black-50)',
                      color: 'var(--black-500)',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedAsset ? (
            <div>
              {/* Selected Asset Details */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{selectedAsset.icon}</div>
                <h3 className="text-xl mb-1" style={{ color: 'var(--black-500)' }}>
                  {selectedAsset.name}
                </h3>
                <p className="text-sm mb-1" style={{ color: 'var(--black-400)' }}>
                  {selectedAsset.category}
                </p>
                <span 
                  className="inline-block px-3 py-1 rounded-full text-xs mb-3"
                  style={{ 
                    backgroundColor: getRiskColor(selectedAsset.risk),
                    color: 'white'
                  }}
                >
                  {selectedAsset.risk}
                </span>
                <p className="text-2xl mb-2" style={{ color: 'var(--black-500)' }}>
                  {selectedAsset.price} <span className="text-lg">YC</span> / share
                </p>
                <p 
                  className="text-sm"
                  style={{ 
                    color: selectedAsset.performance.includes("-") ? 'var(--orange-400)' : 'var(--light-blue-500)'
                  }}
                >
                  {selectedAsset.performance}
                </p>
              </div>

              {/* Description */}
              <div 
                className="p-4 rounded-lg mb-4"
                style={{ backgroundColor: 'var(--blue-50)' }}
              >
                <p className="text-sm" style={{ color: 'var(--black-400)' }}>
                  {selectedAsset.description}
                </p>
              </div>

              {/* Smart Validation */}
              {validation && (
                <div 
                  className="p-4 rounded-lg mb-4 flex items-start gap-3"
                  style={{ 
                    backgroundColor: validation.type === "good" 
                      ? 'var(--light-blue-100)' 
                      : validation.type === "warning"
                      ? 'var(--orange-100)'
                      : 'var(--purple-100)',
                    border: `1px solid ${
                      validation.type === "good" 
                        ? 'var(--light-blue-300)' 
                        : validation.type === "warning"
                        ? 'var(--orange-300)'
                        : 'var(--purple-300)'
                    }`
                  }}
                >
                  {validation.type === "good" ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--light-blue-500)' }} />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: validation.type === "warning" ? 'var(--orange-400)' : 'var(--purple-400)' }} />
                  )}
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--black-500)' }}>
                      {validation.type === "good" ? "Smart Choice! ✓" : validation.type === "warning" ? "Consider This:" : "Analysis:"}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--black-400)' }}>
                      {validation.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Quantity Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm" style={{ color: 'var(--black-400)' }}>
                    Quantity
                  </label>
                  <span style={{ color: 'var(--black-500)' }}>{quantity} share{quantity > 1 ? 's' : ''}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--orange-400) 0%, var(--orange-400) ${
                      (quantity / maxQuantity) * 100
                    }%, var(--black-100) ${(quantity / maxQuantity) * 100}%, var(--black-100) 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--black-300)' }}>
                  <span>1</span>
                  <span>Max: {maxQuantity}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-3 mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--blue-50)' }}>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--black-300)' }}>Total cost</span>
                  <span className="font-semibold" style={{ color: 'var(--black-500)' }}>{totalCost} YC</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--black-300)' }}>Portfolio impact</span>
                  <span style={{ color: 'var(--light-blue-500)' }}>
                    {((totalCost / balance) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--black-300)' }}>Remaining balance</span>
                  <span style={{ color: remainingBalance < balance * 0.2 ? 'var(--orange-400)' : 'var(--black-500)' }}>
                    {remainingBalance} YC
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--black-300)' }}>Sector</span>
                  <span style={{ color: 'var(--black-500)' }}>{selectedAsset.sector}</span>
                </div>
              </div>

              {/* Success Animation */}
              {showValidation && (
                <div 
                  className="mb-4 p-4 rounded-lg text-center"
                  style={{ backgroundColor: 'var(--light-blue-200)', border: '2px solid var(--light-blue-400)' }}
                >
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--light-blue-500)' }} />
                  <p className="font-semibold" style={{ color: 'var(--black-500)' }}>
                    Investment Confirmed! 🎉
                  </p>
                </div>
              )}

              {/* Confirm Button */}
              <button
                onClick={handleConfirmInvestment}
                disabled={totalCost > balance || showValidation}
                className="w-full py-3 rounded-xl transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: validation?.type === "good" ? 'var(--light-blue-400)' : 'var(--purple-400)',
                  color: 'white',
                }}
              >
                {showValidation ? 'Processing...' : `Invest ${totalCost} YC`}
              </button>

              {totalCost > balance && (
                <p className="text-xs text-center mt-2" style={{ color: 'var(--orange-400)' }}>
                  Insufficient balance
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Asset List */}
              {assets.map((asset) => {
                const owned = currentPortfolio.includes(asset.id);
                const recommendation = getRecommendation(asset);
                
                return (
                  <button
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className="w-full p-4 rounded-xl flex items-center gap-4 hover:shadow-md transition-all relative"
                    style={{
                      backgroundColor: owned ? 'var(--light-purple-100)' : 'white',
                      border: `2px solid ${
                        recommendation.type === "good" 
                          ? 'var(--light-blue-300)' 
                          : 'var(--black-100)'
                      }`,
                    }}
                  >
                    {recommendation.type === "good" && (
                      <div 
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--light-blue-400)' }}
                      >
                        <CheckCircle className="w-4 h-4" style={{ color: 'white' }} />
                      </div>
                    )}
                    
                    <div className="text-4xl">{asset.icon}</div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 style={{ color: 'var(--black-500)' }}>{asset.name}</h4>
                        {owned && (
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: 'var(--purple-300)', color: 'var(--black-500)' }}
                          >
                            Owned
                          </span>
                        )}
                      </div>
                      <p className="text-xs mb-1" style={{ color: 'var(--black-300)' }}>
                        {asset.category} • {asset.sector}
                      </p>
                      <p 
                        className="text-xs"
                        style={{ 
                          color: asset.performance.includes("-") ? 'var(--orange-400)' : 'var(--light-blue-500)'
                        }}
                      >
                        {asset.performance}
                      </p>
                    </div>
                    <div className="text-right">
                      <p style={{ color: 'var(--black-500)' }}>{asset.price}</p>
                      <p className="text-xs" style={{ color: 'var(--black-300)' }}>YC</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
