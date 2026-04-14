import { ASSET_BY_ID } from "../data/assets";

interface Holding {
  assetId: string;
  name: string;
  sector: string;
  quantity: number;
  averagePrice: number;
}

interface PortfolioPageProps {
  balance: number;
  holdings: Holding[];
  marketPrices: Record<string, number>;
  portfolioValue: number;
  investedCostBasis: number;
  portfolioChange: number;
}

const formatCurrency = (value: number) => `${Math.round(value).toLocaleString()} YQ`;

export function PortfolioPage({
  balance,
  holdings,
  marketPrices,
  portfolioValue,
  investedCostBasis,
  portfolioChange,
}: PortfolioPageProps) {
  const totalAccountValue = balance + portfolioValue;
  const absolutePnL = portfolioValue - investedCostBasis;
  const hasPositions = holdings.length > 0;

  const sectorAllocation = holdings.reduce<Record<string, number>>((acc, holding) => {
    const value = (marketPrices[holding.assetId] ?? holding.averagePrice) * holding.quantity;
    acc[holding.sector] = (acc[holding.sector] ?? 0) + value;
    return acc;
  }, {});

  const topSectors = Object.entries(sectorAllocation)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const riskExposure = holdings.reduce<Record<string, number>>((acc, holding) => {
    const asset = ASSET_BY_ID[holding.assetId];
    const bucket = asset?.risk ?? "Unknown";
    const value = (marketPrices[holding.assetId] ?? holding.averagePrice) * holding.quantity;
    acc[bucket] = (acc[bucket] ?? 0) + value;
    return acc;
  }, {});

  const riskRows = Object.entries(riskExposure).sort((a, b) => b[1] - a[1]);

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <header className="mb-8 rounded-2xl p-6" style={{ backgroundColor: 'rgba(255,255,255,0.72)', border: '1px solid var(--light-blue-300)' }}>
        <h2 className="text-2xl mb-2" style={{ color: 'var(--black-500)' }}>Portfolio Overview</h2>
        <p style={{ color: 'var(--black-400)' }}>
          Track your live positions, monitor allocation quality, and review risk concentration in one place.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="rounded-xl p-4" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--black-300)' }}>Total account value</p>
          <p className="text-xl" style={{ color: 'var(--black-500)' }}>{formatCurrency(totalAccountValue)}</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--black-300)' }}>Cash balance</p>
          <p className="text-xl" style={{ color: 'var(--black-500)' }}>{formatCurrency(balance)}</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--black-300)' }}>Invested market value</p>
          <p className="text-xl" style={{ color: 'var(--black-500)' }}>{formatCurrency(portfolioValue)}</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--black-300)' }}>Portfolio return</p>
          <p className="text-xl" style={{ color: absolutePnL >= 0 ? 'var(--light-blue-400)' : 'var(--orange-400)' }}>
            {portfolioChange >= 0 ? "+" : ""}{portfolioChange.toFixed(2)}%
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="rounded-xl p-5" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
          <h3 className="mb-3" style={{ color: 'var(--black-500)' }}>Top sector allocation</h3>
          {hasPositions ? (
            <div className="space-y-3">
              {topSectors.map(([sector, value]) => {
                const pct = portfolioValue > 0 ? (value / portfolioValue) * 100 : 0;
                return (
                  <div key={sector}>
                    <div className="flex justify-between text-sm mb-1" style={{ color: 'var(--black-400)' }}>
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
              })}
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--black-400)' }}>
              No positions yet. Open INVEST to build your first allocation.
            </p>
          )}
        </div>

        <div className="rounded-xl p-5" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
          <h3 className="mb-3" style={{ color: 'var(--black-500)' }}>Risk exposure</h3>
          {hasPositions ? (
            <div className="space-y-2">
              {riskRows.map(([bucket, value]) => {
                const pct = portfolioValue > 0 ? (value / portfolioValue) * 100 : 0;
                return (
                  <div key={bucket} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: 'var(--blue-50)' }}>
                    <span className="text-sm" style={{ color: 'var(--black-500)' }}>{bucket}</span>
                    <span className="text-sm" style={{ color: 'var(--black-400)' }}>{pct.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--black-400)' }}>
              Add assets to visualize your risk buckets.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-xl p-5" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ color: 'var(--black-500)' }}>Open positions</h3>
          <span className="text-sm" style={{ color: 'var(--black-400)' }}>{holdings.length} assets</span>
        </div>

        {hasPositions ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="text-left text-sm" style={{ color: 'var(--black-400)' }}>
                  <th className="pb-3">Asset</th>
                  <th className="pb-3">Quantity</th>
                  <th className="pb-3">Avg. price</th>
                  <th className="pb-3">Live price</th>
                  <th className="pb-3">Market value</th>
                  <th className="pb-3">Unrealized P/L</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding) => {
                  const livePrice = marketPrices[holding.assetId] ?? holding.averagePrice;
                  const marketValue = livePrice * holding.quantity;
                  const costBasis = holding.averagePrice * holding.quantity;
                  const pnl = marketValue - costBasis;
                  const pnlPct = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

                  return (
                    <tr key={holding.assetId} style={{ borderTop: '1px solid var(--black-100)' }}>
                      <td className="py-3">
                        <div>
                          <p style={{ color: 'var(--black-500)' }}>{holding.name}</p>
                          <p className="text-xs" style={{ color: 'var(--black-300)' }}>{holding.sector}</p>
                        </div>
                      </td>
                      <td className="py-3" style={{ color: 'var(--black-400)' }}>{holding.quantity.toFixed(2)}</td>
                      <td className="py-3" style={{ color: 'var(--black-400)' }}>{formatCurrency(holding.averagePrice)}</td>
                      <td className="py-3" style={{ color: 'var(--black-400)' }}>{formatCurrency(livePrice)}</td>
                      <td className="py-3" style={{ color: 'var(--black-500)' }}>{formatCurrency(marketValue)}</td>
                      <td className="py-3" style={{ color: pnl >= 0 ? 'var(--light-blue-400)' : 'var(--orange-400)' }}>
                        {pnl >= 0 ? "+" : ""}{formatCurrency(pnl)} ({pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(2)}%)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--black-400)' }}>
            You currently have no open positions. Click INVEST to place your first order.
          </p>
        )}
      </section>
    </div>
  );
}