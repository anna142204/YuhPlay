import { Fragment, useState } from "react";

interface SandboxPageProps {
  selectedScenario: "balanced" | "bull" | "bear" | "volatile";
  onScenarioChange: (scenario: "balanced" | "bull" | "bear" | "volatile") => void;
  onResetSession: () => void;
  onSetSandboxBudget: (amount: number) => void;
  onOpenInvest: () => void;
  onDirectTrade: (assetId: string, action: "buy" | "sell", quantity?: number) => void;
  onSetSellLimit: (assetId: string, limitPrice: number | null) => void;
  onSetBuyLimit: (assetId: string, limitPrice: number | null) => void;
  totalAccountValue: number;
  balance: number;
  portfolioValue: number;
  portfolioChange: number;
  diversificationScore: number;
  maxDrawdown: number;
  sessionStartValue: number;
  actionLog: string[];
  marketPrices: Record<string, number>;
  holdings: Array<{
    assetId: string;
    name: string;
    sector: string;
    quantity: number;
    averagePrice: number;
    sellLimitPrice?: number | null;
    buyLimitPrice?: number | null;
  }>;
}

const SCENARIOS: Array<{ id: "balanced" | "bull" | "bear" | "volatile"; label: string; description: string }> = [
  {
    id: "balanced",
    label: "Balanced",
    description: "Neutral market with moderate random moves.",
  },
  {
    id: "bull",
    label: "Bull market",
    description: "Upward drift with smoother pullbacks.",
  },
  {
    id: "bear",
    label: "Bear market",
    description: "Downward pressure and tougher recoveries.",
  },
  {
    id: "volatile",
    label: "High volatility",
    description: "Fast and larger swings in both directions.",
  },
];

const SCENARIO_GUIDE: Record<"balanced" | "bull" | "bear" | "volatile", { purpose: string; testFocus: string; beginnerTip: string }> = {
  balanced: {
    purpose: "Learn the basics with normal market behavior.",
    testFocus: "Portfolio construction and steady position management.",
    beginnerTip: "Start here first. Build habits before testing extreme conditions.",
  },
  bull: {
    purpose: "Simulate a mostly rising market.",
    testFocus: "Taking profits, avoiding overconfidence, and keeping allocation discipline.",
    beginnerTip: "Do not chase winners too aggressively. Keep diversification.",
  },
  bear: {
    purpose: "Simulate a mostly declining market.",
    testFocus: "Risk control, cash management, and emotional discipline.",
    beginnerTip: "Protect downside first. Smaller positions and more cash help.",
  },
  volatile: {
    purpose: "Simulate fast and larger price swings.",
    testFocus: "Stress-test your plan under uncertainty.",
    beginnerTip: "Reduce position size and avoid impulsive trades.",
  },
};

export function SandboxPage({
  selectedScenario,
  onScenarioChange,
  onResetSession,
  onSetSandboxBudget,
  onOpenInvest,
  onDirectTrade,
  onSetSellLimit,
  onSetBuyLimit,
  totalAccountValue,
  balance,
  portfolioValue,
  portfolioChange,
  diversificationScore,
  maxDrawdown,
  sessionStartValue,
  actionLog,
  marketPrices,
  holdings,
}: SandboxPageProps) {
  const [limitDrafts, setLimitDrafts] = useState<Record<string, string>>({});
  const [buyLimitDrafts, setBuyLimitDrafts] = useState<Record<string, string>>({});
  const [tradeQtyDrafts, setTradeQtyDrafts] = useState<Record<string, string>>({});
  const [expandedAssetId, setExpandedAssetId] = useState<string | null>(null);
  const cashRatio = totalAccountValue > 0 ? (balance / totalAccountValue) * 100 : 0;
  const sessionReturnPct = sessionStartValue > 0
    ? ((totalAccountValue - sessionStartValue) / sessionStartValue) * 100
    : 0;

  const missions = [
    {
      id: "mission-diversification",
      title: "Build a diversified portfolio",
      target: "Reach diversification score >= 60",
      completed: diversificationScore >= 60,
    },
    {
      id: "mission-drawdown",
      title: "Protect downside",
      target: "Keep max drawdown below 8%",
      completed: maxDrawdown <= 8,
    },
    {
      id: "mission-return",
      title: "Grow the account",
      target: "Reach session return above +3%",
      completed: sessionReturnPct >= 3,
    },
  ];

  const coachInsights: string[] = [];
  if (diversificationScore < 40 && portfolioValue > 0) {
    coachInsights.push("Concentration risk is high. Add exposure to different sectors.");
  }
  if (maxDrawdown > 8) {
    coachInsights.push("Drawdown is elevated. Consider reducing high-risk positions or increasing cash.");
  }
  if (cashRatio < 10 && portfolioValue > 0) {
    coachInsights.push("Cash buffer is low. Keeping some liquidity helps during volatile phases.");
  }
  if (portfolioChange > 5 && diversificationScore < 50) {
    coachInsights.push("Good return so far, but risk is concentrated. Lock in discipline before scaling.");
  }
  if (coachInsights.length === 0) {
    coachInsights.push("Your setup looks balanced. Keep testing and compare outcomes across scenarios.");
  }

  const nextCoachDecision = (() => {
    if (holdings.length === 0) {
      return "Open invest panel and start with 2 assets from different sectors.";
    }
    if (diversificationScore < 50) {
      return "Add one position in a missing sector to reduce concentration risk.";
    }
    if (maxDrawdown > 8) {
      return "Reduce exposure on your riskiest position and rebuild a cash buffer.";
    }
    if (cashRatio < 12) {
      return "Raise cash to at least 12% to handle volatility more comfortably.";
    }
    if (sessionReturnPct < 0 && selectedScenario !== "bull") {
      return "Pause new trades, review recent entries, and wait for cleaner setups.";
    }
    return "Hold your plan, log your rationale, and compare this scenario with another one.";
  })();

  const quickCoachActions: string[] = [];
  if (diversificationScore < 50) {
    quickCoachActions.push("Add diversification before increasing size.");
  }
  if (maxDrawdown > 8) {
    quickCoachActions.push("Cut downside risk first, then optimize returns.");
  }
  if (cashRatio < 12) {
    quickCoachActions.push("Keep at least 12% cash for flexibility.");
  }
  if (quickCoachActions.length === 0) {
    quickCoachActions.push("Current setup is healthy. Keep discipline and track decisions.");
  }

  const activeGuide = SCENARIO_GUIDE[selectedScenario];

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <header className="mb-8 rounded-2xl p-6" style={{ backgroundColor: 'rgba(255,255,255,0.72)', border: '1px solid var(--light-blue-300)' }}>
        <h2 className="text-2xl mb-2" style={{ color: 'var(--black-500)' }}>Playground Lab</h2>
        <p style={{ color: 'var(--black-400)' }}>
          Practice freely: choose a market scenario, place trades, and compare results.
        </p>
        <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: 'var(--blue-50)', border: '1px solid var(--black-100)' }}>
          <p className="text-sm" style={{ color: 'var(--black-500)' }}>
            How to use Playground:
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--black-400)' }}>1. Pick a scenario.</p>
          <p className="text-sm" style={{ color: 'var(--black-400)' }}>2. Open invest panel and build a portfolio.</p>
          <p className="text-sm" style={{ color: 'var(--black-400)' }}>3. Check return, diversification, and drawdown.</p>
        </div>

        <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: 'white', border: '1px dashed var(--black-200)' }}>
          <p className="text-xs" style={{ color: 'var(--black-300)' }}>Current scenario</p>
          <p className="text-sm" style={{ color: 'var(--black-500)' }}>
            {SCENARIOS.find((scenario) => scenario.id === selectedScenario)?.label}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--black-400)' }}>
            You can change this in Playground settings below.
          </p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="rounded-xl p-4" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--black-300)' }}>Total account value</p>
          <p className="text-lg font-medium" style={{ color: 'var(--black-500)' }}>{Math.round(totalAccountValue).toLocaleString()} YQ</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--black-300)' }}>Session return</p>
          <p className="text-lg font-medium" style={{ color: sessionReturnPct >= 0 ? 'var(--green-400)' : 'var(--red-400)' }}>
            {sessionReturnPct >= 0 ? "+" : ""}{sessionReturnPct.toFixed(2)}%
          </p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--black-300)' }}>Diversification score</p>
          <p className="text-lg font-medium" style={{ color: 'var(--black-500)' }}>{diversificationScore}/100</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--black-300)' }}>Max drawdown</p>
          <p className="text-lg font-medium" style={{ color: maxDrawdown > 10 ? 'var(--orange-400)' : 'var(--light-blue-400)' }}>
            {maxDrawdown.toFixed(2)}%
          </p>
        </div>
      </section>


      {/* Portfolio Section */}
      <section className="rounded-xl p-6 mb-6" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
        <h3 className="text-lg mb-4 font-medium" style={{ color: 'var(--black-500)' }}>Portfolio</h3>

        <div className="rounded-xl px-4 py-3 mb-5" style={{ backgroundColor: 'var(--blue-50)', border: '1px solid var(--black-100)' }}>
          <p className="text-sm" style={{ color: 'var(--black-500)' }}>
            Trade directly from the table or set auto-sell / auto-buy limits that trigger automatically.
          </p>
        </div>
        
        {/* Portfolio KPIs */}
        <div className="grid gap-3 md:grid-cols-4 mb-6">
          <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--blue-50)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--black-300)' }}>Cash</p>
            <p className="font-medium" style={{ color: 'var(--black-500)' }}>{Math.round(balance).toLocaleString()} YQ</p>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--blue-50)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--black-300)' }}>Invested value</p>
            <p className="font-medium" style={{ color: 'var(--black-500)' }}>{Math.round(portfolioValue).toLocaleString()} YQ</p>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--blue-50)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--black-300)' }}>Portfolio return</p>
            <p className="font-medium" style={{ color: portfolioChange >= 0 ? 'var(--green-400)' : 'var(--red-400)' }}>
              {portfolioChange >= 0 ? "+" : ""}{portfolioChange.toFixed(2)}%
            </p>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--blue-50)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--black-300)' }}>Holdings</p>
            <p className="font-medium" style={{ color: 'var(--black-500)' }}>{holdings.length} assets</p>
          </div>
        </div>

        {/* Sector Allocation & Cash Ratio */}
        {holdings.length > 0 && (
          <div className="grid gap-4 mb-6 md:grid-cols-2">
            <div>
              <p className="text-sm mb-3 font-medium" style={{ color: 'var(--black-400)' }}>Sector allocation</p>
              {(() => {
                const sectors = holdings.reduce<Record<string, number>>((acc, h) => {
                  const val = (marketPrices[h.assetId] ?? h.averagePrice) * h.quantity;
                  acc[h.sector] = (acc[h.sector] ?? 0) + val;
                  return acc;
                }, {});
                return Object.entries(sectors)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 4)
                  .map(([sector, value]) => {
                    const pct = portfolioValue > 0 ? (value / portfolioValue) * 100 : 0;
                    return (
                      <div key={sector} className="mb-3">
                        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--black-400)' }}>
                          <span>{sector}</span>
                          <span>{pct.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--black-100)' }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${Math.min(100, pct)}%`, backgroundColor: 'var(--light-blue-400)' }}
                          />
                        </div>
                      </div>
                    );
                  });
              })()}
            </div>
            <div>
              <p className="text-sm mb-3 font-medium" style={{ color: 'var(--black-400)' }}>Cash buffer</p>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--black-400)' }}>
                  <span>Liquidity</span>
                  <span>{cashRatio.toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--black-100)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(100, cashRatio)}%`, backgroundColor: cashRatio < 10 ? 'var(--orange-400)' : 'var(--light-blue-400)' }}
                  />
                </div>
              </div>
              <p className="text-xs" style={{ color: 'var(--black-300)' }}>
                {cashRatio < 10 ? '⚠️ Low liquidity buffer' : '✓ Good cash buffer'}
              </p>
            </div>
          </div>
        )}

        {/* Positions */}
        {holdings.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--black-400)' }}>
            No positions yet. Click "Open invest panel" above to start building your portfolio.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl" style={{ border: '1px solid var(--black-100)' }}>
            <table className="w-full table-fixed">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide" style={{ color: 'var(--black-300)', backgroundColor: 'var(--blue-50)', borderBottom: '1px solid var(--black-100)' }}>
                  <th className="px-2 py-2 w-[22%]">Asset</th>
                  <th className="px-2 py-2 w-[10%]">Qty</th>
                  <th className="px-2 py-2 w-[14%]">Avg</th>
                  <th className="px-2 py-2 w-[14%]">Live</th>
                  <th className="px-2 py-2 w-[14%]">Value</th>
                  <th className="px-2 py-2 w-[16%]">P/L</th>
                  <th className="px-2 py-2 w-[10%]">Open</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding) => {
                  const livePrice = marketPrices[holding.assetId] ?? holding.averagePrice;
                  const marketValue = livePrice * holding.quantity;
                  const costBasis = holding.averagePrice * holding.quantity;
                  const pnl = marketValue - costBasis;
                  const pnlPct = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
                  const currentLimit = holding.sellLimitPrice ?? null;
                  const draftValue = limitDrafts[holding.assetId] ?? (currentLimit != null ? String(Math.round(currentLimit)) : "");
                  const currentBuyLimit = holding.buyLimitPrice ?? null;
                  const buyDraftValue = buyLimitDrafts[holding.assetId] ?? (currentBuyLimit != null ? String(Math.round(currentBuyLimit)) : "");
                  const qtyDraft = tradeQtyDrafts[holding.assetId] ?? "1";
                  const parsedQty = Number.parseFloat(qtyDraft);
                  const safeQty = Number.isFinite(parsedQty) && parsedQty > 0 ? parsedQty : 1;
                  const isOpen = expandedAssetId === holding.assetId;

                  return (
                    <Fragment key={holding.assetId}>
                      <tr style={{ borderTop: '1px solid var(--black-50)' }}>
                        <td className="px-2 py-3 text-xs truncate" style={{ color: 'var(--black-500)' }}>{holding.name}</td>
                        <td className="px-2 py-3 text-xs" style={{ color: 'var(--black-400)' }}>{holding.quantity.toFixed(2)}</td>
                        <td className="px-2 py-3 text-xs" style={{ color: 'var(--black-400)' }}>{Math.round(holding.averagePrice).toLocaleString()}</td>
                        <td className="px-2 py-3 text-xs" style={{ color: 'var(--black-400)' }}>{Math.round(livePrice).toLocaleString()}</td>
                        <td className="px-2 py-3 text-xs" style={{ color: 'var(--black-500)' }}>{Math.round(marketValue).toLocaleString()}</td>
                        <td className="px-2 py-3 text-xs" style={{ color: pnl >= 0 ? 'var(--green-400)' : 'var(--red-400)' }}>
                          {pnl >= 0 ? "+" : ""}{Math.round(pnl).toLocaleString()} ({pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(1)}%)
                        </td>
                        <td className="px-2 py-3">
                          <button
                            type="button"
                            onClick={() => setExpandedAssetId(isOpen ? null : holding.assetId)}
                            className="rounded-lg px-2 py-1.5 text-xs font-medium cursor-pointer transition-all hover:brightness-95 whitespace-nowrap"
                            style={{ backgroundColor: isOpen ? 'var(--orange-100)' : 'white', color: 'var(--black-500)', border: '1px solid var(--black-100)' }}
                          >
                            {isOpen ? "Close" : "Open"}
                          </button>
                        </td>
                      </tr>

                      {isOpen && (
                        <tr style={{ backgroundColor: 'var(--blue-50)', borderTop: '1px solid var(--black-50)' }}>
                          <td colSpan={7} className="px-3 py-3">
                            <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_270px] items-start">
                              <div>
                                <p className="text-xs mb-2" style={{ color: 'var(--black-400)' }}>Trade quantity</p>
                                <div className="flex items-center gap-1 mb-3 overflow-x-auto whitespace-nowrap">
                                  <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={qtyDraft}
                                    onChange={(event) => {
                                      const nextValue = event.target.value.replace(/^-+/, "");
                                      setTradeQtyDrafts((prev) => ({ ...prev, [holding.assetId]: nextValue }));
                                    }}
                                    className="w-16 rounded-lg px-2 py-1.5 text-xs"
                                    style={{ backgroundColor: 'white', border: '1px solid var(--black-100)', color: 'var(--black-500)' }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => onDirectTrade(holding.assetId, "buy", safeQty)}
                                    className="rounded-lg px-2 py-1.5 text-xs font-medium cursor-pointer transition-all hover:brightness-95"
                                    style={{ backgroundColor: 'var(--orange-400)', color: 'white', border: '1px solid var(--orange-500)' }}
                                  >
                                    Buy
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onDirectTrade(holding.assetId, "sell", Math.min(safeQty, holding.quantity))}
                                    className="rounded-lg px-2 py-1.5 text-xs font-medium cursor-pointer transition-all hover:brightness-95"
                                    style={{ backgroundColor: 'white', color: 'var(--black-500)', border: '1px solid var(--black-100)' }}
                                  >
                                    Sell
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onDirectTrade(holding.assetId, "sell", Math.max(1, Math.ceil(holding.quantity / 3)))}
                                    className="rounded-lg px-2 py-1.5 text-xs font-medium cursor-pointer transition-all hover:brightness-95"
                                    style={{ backgroundColor: 'white', color: 'var(--black-500)', border: '1px solid var(--black-100)' }}
                                  >
                                    Sell 33%
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onDirectTrade(holding.assetId, "sell", Math.max(1, Math.ceil((holding.quantity * 2) / 3)))}
                                    className="rounded-lg px-2 py-1.5 text-xs font-medium cursor-pointer transition-all hover:brightness-95"
                                    style={{ backgroundColor: 'white', color: 'var(--black-500)', border: '1px solid var(--black-100)' }}
                                  >
                                    Sell 67%
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onDirectTrade(holding.assetId, "sell", holding.quantity)}
                                    className="rounded-lg px-2 py-1.5 text-xs font-medium cursor-pointer transition-all hover:brightness-95"
                                    style={{ backgroundColor: 'var(--orange-50)', color: 'var(--black-500)', border: '1px solid var(--orange-200)' }}
                                  >
                                    Sell all
                                  </button>
                                </div>

                                <div className="grid gap-2 md:grid-cols-2">
                                  <div>
                                    <p className="text-xs mb-2" style={{ color: 'var(--black-400)' }}>Auto-sell limit</p>
                                    <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap">
                                      <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={draftValue}
                                        onChange={(event) => {
                                          const nextValue = event.target.value.replace(/^-+/, "");
                                          setLimitDrafts((prev) => ({ ...prev, [holding.assetId]: nextValue }));
                                        }}
                                        placeholder="Target YQ"
                                        className="w-18 rounded-lg px-2 py-1.5 text-xs"
                                        style={{ backgroundColor: 'white', border: '1px solid var(--black-100)', color: 'var(--black-500)' }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const parsed = Number.parseFloat(limitDrafts[holding.assetId] ?? draftValue);
                                          if (Number.isFinite(parsed) && parsed > 0) {
                                            onSetSellLimit(holding.assetId, parsed);
                                          }
                                        }}
                                        className="rounded-lg px-2 py-1.5 text-xs font-medium cursor-pointer transition-all hover:brightness-95"
                                        style={{ backgroundColor: 'var(--light-blue-100)', color: 'var(--black-500)', border: '1px solid var(--light-blue-300)' }}
                                      >
                                        Save
                                      </button>
                                      {currentLimit != null && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            onSetSellLimit(holding.assetId, null);
                                            setLimitDrafts((prev) => ({ ...prev, [holding.assetId]: "" }));
                                          }}
                                          className="rounded-lg px-2 py-1.5 text-xs font-medium cursor-pointer transition-all hover:brightness-95"
                                          style={{ backgroundColor: 'var(--orange-50)', color: 'var(--black-500)', border: '1px solid var(--orange-200)' }}
                                        >
                                          Clear
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-xs mb-2" style={{ color: 'var(--black-400)' }}>Auto-buy limit</p>
                                    <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap">
                                      <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={buyDraftValue}
                                        onChange={(event) => {
                                          const nextValue = event.target.value.replace(/^-+/, "");
                                          setBuyLimitDrafts((prev) => ({ ...prev, [holding.assetId]: nextValue }));
                                        }}
                                        placeholder="Target YQ"
                                        className="w-18 rounded-lg px-2 py-1.5 text-xs"
                                        style={{ backgroundColor: 'white', border: '1px solid var(--black-100)', color: 'var(--black-500)' }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const parsed = Number.parseFloat(buyLimitDrafts[holding.assetId] ?? buyDraftValue);
                                          if (Number.isFinite(parsed) && parsed > 0) {
                                            onSetBuyLimit(holding.assetId, parsed);
                                          }
                                        }}
                                        className="rounded-lg px-2 py-1.5 text-xs font-medium cursor-pointer transition-all hover:brightness-95"
                                        style={{ backgroundColor: 'var(--light-blue-100)', color: 'var(--black-500)', border: '1px solid var(--light-blue-300)' }}
                                      >
                                        Save
                                      </button>
                                      {currentBuyLimit != null && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            onSetBuyLimit(holding.assetId, null);
                                            setBuyLimitDrafts((prev) => ({ ...prev, [holding.assetId]: "" }));
                                          }}
                                          className="rounded-lg px-2 py-1.5 text-xs font-medium cursor-pointer transition-all hover:brightness-95"
                                          style={{ backgroundColor: 'var(--orange-50)', color: 'var(--black-500)', border: '1px solid var(--orange-200)' }}
                                        >
                                          Clear
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="rounded-lg p-2" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <p className="text-[11px] mb-1" style={{ color: 'var(--black-300)' }}>Sell limit</p>
                                    <p className="text-xs" style={{ color: 'var(--black-500)' }}>
                                      {currentLimit != null ? `${Math.round(currentLimit).toLocaleString()} YQ` : "No limit"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[11px] mb-1" style={{ color: 'var(--black-300)' }}>Buy limit</p>
                                    <p className="text-xs" style={{ color: 'var(--black-500)' }}>
                                      {currentBuyLimit != null ? `${Math.round(currentBuyLimit).toLocaleString()} YQ` : "No limit"}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-[11px] mt-2" style={{ color: 'var(--black-400)' }}>
                                  Sell triggers above target, buy below target.
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Settings - Collapsible */}
      <details className="rounded-xl p-5 mb-6" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
        <summary className="cursor-pointer text-md " style={{ color: 'var(--black-500)' }}>
          Playground settings
        </summary>
        <div className="mt-4">
          <p className="text-xs mb-3" style={{ color: 'var(--black-400)' }}>SCENARIO</p>
          <div className="grid gap-2 md:grid-cols-2 mb-4">
            {SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                onClick={() => onScenarioChange(scenario.id)}
                className="rounded-lg px-3 py-2 text-left text-xs transition-all cursor-pointer"
                style={{
                  border: scenario.id === selectedScenario ? '2px solid var(--light-blue-400)' : '1px solid var(--black-100)',
                  backgroundColor: scenario.id === selectedScenario ? 'var(--light-blue-100)' : 'white',
                  color: 'var(--black-500)',
                }}
              >
                {scenario.label}
              </button>
            ))}
          </div>

          <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: 'var(--orange-50)', border: '1px solid var(--orange-100)' }}>
            <p className="text-xs" style={{ color: 'var(--black-500)' }}>
              {activeGuide.purpose}
            </p>
          </div>

          <p className="text-xs mb-3" style={{ color: 'var(--black-400)' }}>PRESET BUDGETS</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              onClick={() => onSetSandboxBudget(5000)}
              className="rounded-lg px-3 py-2 text-xs font-medium cursor-pointer"
              style={{ backgroundColor: 'var(--blue-50)', color: 'var(--black-500)', border: '1px solid var(--black-100)' }}
            >
              5,000 YQ
            </button>
            <button
              type="button"
              onClick={() => onSetSandboxBudget(10000)}
              className="rounded-lg px-3 py-2 text-xs font-medium cursor-pointer"
              style={{ backgroundColor: 'var(--blue-50)', color: 'var(--black-500)', border: '1px solid var(--black-100)' }}
            >
              10,000 YQ
            </button>
            <button
              type="button"
              onClick={() => onSetSandboxBudget(20000)}
              className="rounded-lg px-3 py-2 text-xs font-medium cursor-pointer"
              style={{ backgroundColor: 'var(--blue-50)', color: 'var(--black-500)', border: '1px solid var(--black-100)' }}
            >
              20,000 YQ
            </button>
          </div>
          <button
            type="button"
            onClick={onResetSession}
            className="rounded-lg px-3 py-2 text-xs font-medium cursor-pointer"
            style={{ backgroundColor: 'var(--orange-300)', color: 'var(--orange-600)', border: '1px solid var(--orange-500)' }}
          >
            Reset playground session
          </button>
        </div>
      </details>

      <details className="mt-6 rounded-xl p-5" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
        <summary className="cursor-pointer" style={{ color: 'var(--black-500)' }}>
          Advanced tools (optional)
        </summary>

        <section className="rounded-xl p-4 mt-4" style={{ backgroundColor: 'var(--blue-50)', border: '1px solid var(--black-100)' }}>
          <h3 className="mb-3" style={{ color: 'var(--black-500)' }}>Playground missions</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {missions.map((mission) => (
              <article
                key={mission.id}
                className="rounded-xl p-4 h-full flex flex-col justify-between"
                style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm leading-snug pr-1" style={{ color: 'var(--black-500)' }}>
                    {mission.title}
                  </p>
                  <span
                    className="text-xs px-2 py-1 rounded-full whitespace-nowrap shrink-0"
                    style={{ backgroundColor: mission.completed ? 'var(--orange-100)' : 'var(--light-blue-200)', color: 'var(--black-500)' }}
                  >
                    {mission.completed ? "Done" : "In progress"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--black-400)' }}>
                  {mission.target}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 mt-4">
          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--blue-50)', border: '1px solid var(--black-100)' }}>
            <h3 className="mb-3" style={{ color: 'var(--black-500)' }}>Coach decision</h3>
            <div className="rounded-lg p-3 mb-3" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
              <p className="text-xs mb-1" style={{ color: 'var(--black-300)' }}>Next best action</p>
              <p className="text-sm" style={{ color: 'var(--black-500)' }}>{nextCoachDecision}</p>
            </div>
            <div className="space-y-1">
              {quickCoachActions.map((item) => (
                <p key={item} className="text-sm" style={{ color: 'var(--black-400)' }}>
                  • {item}
                </p>
              ))}
            </div>
            <div className="mt-3 pt-3" style={{ borderTop: '1px dashed var(--black-100)' }}>
              {coachInsights.map((insight) => (
                <p key={insight} className="text-xs mb-1" style={{ color: 'var(--black-400)' }}>
                  {insight}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--blue-50)', border: '1px solid var(--black-100)' }}>
            <h3 className="mb-3" style={{ color: 'var(--black-500)' }}>Session summary</h3>
            <p className="text-sm mb-1" style={{ color: 'var(--black-400)' }}>
              Start value: {Math.round(sessionStartValue).toLocaleString()} YQ
            </p>
            <p className="text-sm mb-1" style={{ color: 'var(--black-400)' }}>
              Current value: {Math.round(totalAccountValue).toLocaleString()} YQ
            </p>
            <p className="text-sm" style={{ color: sessionReturnPct >= 0 ? 'var(--green-400)' : 'var(--red-400)' }}>
              Session return: {sessionReturnPct >= 0 ? "+" : ""}{sessionReturnPct.toFixed(2)}%
            </p>
          </div>
        </section>

        <section className="rounded-xl p-5 mt-4" style={{ backgroundColor: 'var(--blue-50)', border: '1px solid var(--black-100)' }}>
          <h3 className="mb-3" style={{ color: 'var(--black-500)' }}>Decision journal</h3>
          <p className="text-xs mb-3" style={{ color: 'var(--black-300)' }}>
            Tip: after each trade, note "why now" to improve future decisions.
          </p>
          {actionLog.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--black-400)' }}>
              No actions yet. Place a trade, switch a scenario, or reset to start your session log.
            </p>
          ) : (
            <div className="space-y-2">
              {actionLog.slice(0, 8).map((entry, index) => (
                <p key={`${entry}-${index}`} className="text-sm" style={{ color: 'var(--black-400)' }}>
                  {entry}
                </p>
              ))}
            </div>
          )}
        </section>
      </details>
    </div>
  );
}