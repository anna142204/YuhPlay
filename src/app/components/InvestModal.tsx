import { X, Search, ArrowLeft, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { ASSETS, type Asset, type AssetType } from "../data/assets";

interface InvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrade: (asset: Asset, amount: number, action: "buy" | "sell", unitPrice: number) => void;
  balance: number;
  marketPrices: Record<string, number>;
  holdings: Record<string, number>;
  currentUnitId?: number;
  lessonStep?: number;
}

export function InvestModal({ 
  isOpen, 
  onClose, 
  onTrade,
  balance,
  marketPrices,
  holdings,
  currentUnitId = 1,
  lessonStep = 1
}: InvestModalProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<AssetType>("Stocks");
  const [tradeAction, setTradeAction] = useState<"buy" | "sell">("buy");
  const [showValidation, setShowValidation] = useState(false);

  const getLivePrice = (asset: Asset) => marketPrices[asset.id] ?? asset.basePrice;
  const heldQuantity = selectedAsset ? holdings[selectedAsset.id] ?? 0 : 0;

  const maxQuantity = selectedAsset
    ? tradeAction === "buy"
      ? Math.max(0, Math.floor(balance / getLivePrice(selectedAsset)))
      : heldQuantity
    : 0;

  const effectiveQuantity = Math.min(quantity, Math.max(1, maxQuantity || 1));
  const unitPrice = selectedAsset ? getLivePrice(selectedAsset) : 0;
  const totalCost = selectedAsset ? Math.round(unitPrice * effectiveQuantity) : 0;
  const remainingBalance = tradeAction === "buy" ? balance - totalCost : balance + totalCost;

  const handleConfirmInvestment = () => {
    if (selectedAsset && maxQuantity > 0) {
      setShowValidation(true);
      setTimeout(() => {
        onTrade(selectedAsset, effectiveQuantity, tradeAction, unitPrice);
        setSelectedAsset(null);
        setQuantity(1);
        setTradeAction("buy");
        setShowValidation(false);
      }, 1500);
    }
  };

  const ownedAssets = useMemo(
    () => Object.entries(holdings).filter(([, qty]) => qty > 0).map(([id]) => id),
    [holdings],
  );

  // Smart recommendations based on lesson context
  const getRecommendation = (asset: Asset) => {
    // Unit 1: First investment - any Swiss stock
    if (currentUnitId === 1 && ownedAssets.length === 0) {
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
    if (currentUnitId === 2 && ownedAssets.length > 0) {
      const hasSector = ownedAssets.some(p => {
        const existing = ASSETS.find(a => a.id === p);
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
      const isDiscounted = getLivePrice(asset) < asset.basePrice;
      if (asset.risk === "High risk" || isDiscounted) {
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

  const filteredAssets = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return ASSETS.filter((asset) => {
      if (asset.type !== activeTab) {
        return false;
      }
      if (!query) {
        return true;
      }
      const haystack = `${asset.name} ${asset.tagline} ${asset.category} ${asset.sector}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [activeTab, searchTerm]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-end pointer-events-none">
      <div
        className="pointer-events-auto relative w-full max-w-[400px] h-full bg-white shadow-2xl flex flex-col"
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
              {currentUnitId === 1 && ownedAssets.length === 0 && (
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

              {currentUnitId === 2 && ownedAssets.length > 0 && (
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                    onClick={() => {
                      setActiveTab(tab);
                      setSelectedAsset(null);
                    }}
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
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">{selectedAsset.icon}</div>
                <h3 className="text-xl mb-1" style={{ color: 'var(--black-500)' }}>
                  {selectedAsset.name}
                </h3>
                <p className="text-sm mb-1" style={{ color: 'var(--black-400)' }}>
                  {selectedAsset.tagline}
                </p>
                <span 
                  className="inline-block px-3 py-1 rounded-full text-xs mb-2"
                  style={{ 
                    backgroundColor: getRiskColor(selectedAsset.risk),
                    color: 'white'
                  }}
                >
                  {selectedAsset.risk}
                </span>
                <p className="text-2xl mb-2" style={{ color: 'var(--black-500)' }}>
                  {unitPrice.toFixed(0)} <span className="text-lg">YQ</span> / unit
                </p>
                <p 
                  className="text-sm"
                  style={{ 
                    color: unitPrice < selectedAsset.basePrice ? 'var(--red-400)' : 'var(--green-400)'
                  }}
                >
                  {((unitPrice - selectedAsset.basePrice) / selectedAsset.basePrice * 100).toFixed(1)}% vs base
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => setTradeAction("buy")}
                  className="rounded-lg py-2 cursor-pointer hover:brightness-95"
                  style={{
                    backgroundColor: tradeAction === "buy" ? 'var(--light-blue-300)' : 'var(--black-50)',
                    color: 'var(--black-500)'
                  }}
                >
                  Buy
                </button>
                <button
                  onClick={() => setTradeAction("sell")}
                  disabled={heldQuantity <= 0}
                  className="rounded-lg py-2 cursor-pointer hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
                  style={{
                    backgroundColor: tradeAction === "sell" ? 'var(--orange-300)' : 'var(--black-50)',
                    color: 'var(--black-500)'
                  }}
                >
                  Sell ({heldQuantity})
                </button>
              </div>

              {/* Description */}
              <div 
                className="p-3 rounded-lg mb-3"
                style={{ backgroundColor: 'var(--blue-50)' }}
              >
                <p className="text-sm" style={{ color: 'var(--black-400)' }}>
                  {selectedAsset.description}
                </p>
              </div>

              {/* Smart Validation */}
              {validation && (
                <div 
                  className="p-3 rounded-lg mb-3 flex items-start gap-3"
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
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm" style={{ color: 'var(--black-400)' }}>
                    Quantity
                  </label>
                  <span style={{ color: 'var(--black-500)' }}>{quantity} share{quantity > 1 ? 's' : ''}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={Math.max(1, maxQuantity)}
                  value={effectiveQuantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                  disabled={maxQuantity <= 0}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--orange-400) 0%, var(--orange-400) ${
                      (effectiveQuantity / Math.max(1, maxQuantity)) * 100
                    }%, var(--black-100) ${(effectiveQuantity / Math.max(1, maxQuantity)) * 100}%, var(--black-100) 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--black-300)' }}>
                  <span>1</span>
                  <span>Max: {maxQuantity}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2 mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--blue-50)' }}>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--black-300)' }}>{tradeAction === "buy" ? 'Total cost' : 'Total receive'}</span>
                  <span className="font-semibold" style={{ color: 'var(--black-500)' }}>{totalCost} YQ</span>
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
                    {remainingBalance} YQ
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
                  className="mb-3 p-3 rounded-lg text-center"
                  style={{ backgroundColor: 'var(--light-blue-200)', border: '2px solid var(--light-blue-400)' }}
                >
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--light-blue-500)' }} />
                  <p className="font-semibold" style={{ color: 'var(--black-500)' }}>
                    Investment Confirmed!
                  </p>
                </div>
              )}

            </div>
          ) : (
            <div className="space-y-3">
              {/* Asset List */}
              {filteredAssets.map((asset) => {
                const owned = (holdings[asset.id] ?? 0) > 0;
                const recommendation = getRecommendation(asset);
                const livePrice = getLivePrice(asset);
                const perf = ((livePrice - asset.basePrice) / asset.basePrice) * 100;
                
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
                    
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center text-sm"
                      style={{ backgroundColor: 'var(--blue-100)', color: 'var(--black-500)' }}
                    >
                      {asset.icon}
                    </div>
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
                        {asset.tagline}
                      </p>
                      <p 
                        className="text-xs"
                        style={{ 
                          color: perf < 0 ? 'var(--red-400)' : 'var(--green-400)'
                        }}
                      >
                        {perf >= 0 ? '+' : ''}{perf.toFixed(1)}% vs base
                      </p>
                    </div>
                    <div className="text-right">
                      <p style={{ color: 'var(--black-500)' }}>{livePrice.toFixed(0)}</p>
                      <p className="text-xs" style={{ color: 'var(--black-300)' }}>YQ</p>
                    </div>
                  </button>
                );
              })}

              {filteredAssets.length === 0 && (
                <div className="text-center py-10 rounded-xl" style={{ backgroundColor: 'var(--blue-50)' }}>
                  <p style={{ color: 'var(--black-300)' }}>No assets match your search.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {selectedAsset && (
          <div
            className="shrink-0 bg-white p-4"
            style={{ borderTop: '1px solid var(--black-100)' }}
          >
            <button
              onClick={handleConfirmInvestment}
              disabled={(tradeAction === "buy" && totalCost > balance) || maxQuantity <= 0 || showValidation}
              className="w-full py-3 rounded-xl transition-colors disabled:opacity-50 cursor-pointer hover:brightness-95"
              style={{
                backgroundColor: tradeAction === "sell" ? 'var(--orange-400) ' : validation?.type === "good" ? 'var(--light-blue-400)' : 'var(--purple-400)',
                color: 'white',
              }}
            >
              {showValidation ? 'Processing...' : tradeAction === "buy" ? `Confirm investment (${totalCost} YQ)` : `Confirm sale (+${totalCost} YQ)`}
            </button>

            {tradeAction === "buy" && totalCost > balance && (
              <p className="text-xs text-center mt-2" style={{ color: 'var(--orange-400)' }}>
                Insufficient balance
              </p>
            )}
            {tradeAction === "sell" && maxQuantity <= 0 && (
              <p className="text-xs text-center mt-2" style={{ color: 'var(--orange-400)' }}>
                You do not own this asset yet
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
