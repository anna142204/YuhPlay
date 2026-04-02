export type AssetType = "Stocks" | "Crypto" | "ETF" | "Savings";
export type RiskLevel = "Low risk" | "Medium risk" | "High risk";

export interface Asset {
  id: string;
  name: string;
  tagline: string;
  category: string;
  type: AssetType;
  sector: string;
  basePrice: number;
  risk: RiskLevel;
  icon: string;
  description: string;
}

export const ASSETS: Asset[] = [
  {
    id: "nestle",
    name: "Nestle",
    tagline: "Swiss chocolate giant",
    category: "Food & Beverage",
    type: "Stocks",
    sector: "Consumer Goods",
    basePrice: 100,
    risk: "Low risk",
    icon: "CH",
    description: "Defensive business with stable cashflows and resilient demand."
  },
  {
    id: "novartis",
    name: "Novartis",
    tagline: "Health innovation lab",
    category: "Pharmaceutical",
    type: "Stocks",
    sector: "Healthcare",
    basePrice: 280,
    risk: "Low risk",
    icon: "NV",
    description: "Global healthcare player with long-term R&D driven growth."
  },
  {
    id: "roche",
    name: "Roche",
    tagline: "Biotech and diagnostics",
    category: "Biotechnology",
    type: "Stocks",
    sector: "Healthcare",
    basePrice: 320,
    risk: "Low risk",
    icon: "RC",
    description: "Known for resilient earnings and strong diagnostics franchise."
  },
  {
    id: "richemont",
    name: "Richemont",
    tagline: "Luxury watches and jewelry",
    category: "Luxury goods",
    type: "Stocks",
    sector: "Luxury",
    basePrice: 250,
    risk: "Medium risk",
    icon: "RM",
    description: "Global luxury group exposed to consumer cycles."
  },
  {
    id: "ubs",
    name: "UBS",
    tagline: "Swiss private banking",
    category: "Banking",
    type: "Stocks",
    sector: "Finance",
    basePrice: 360,
    risk: "Medium risk",
    icon: "UB",
    description: "Large banking institution with wealth management focus."
  },
  {
    id: "swatch",
    name: "Swatch Group",
    tagline: "Timekeeping pioneer",
    category: "Watches",
    type: "Stocks",
    sector: "Luxury",
    basePrice: 180,
    risk: "Medium risk",
    icon: "SW",
    description: "Watchmaker exposed to exports and discretionary demand."
  },
  {
    id: "abb",
    name: "ABB",
    tagline: "Automation and electrification",
    category: "Industrial Tech",
    type: "Stocks",
    sector: "Industry",
    basePrice: 150,
    risk: "Medium risk",
    icon: "AB",
    description: "Industrial automation leader with cyclical but strategic demand."
  },
  {
    id: "credit-suisse",
    name: "Credit Suisse",
    tagline: "High-volatility turnaround",
    category: "Banking",
    type: "Stocks",
    sector: "Finance",
    basePrice: 80,
    risk: "High risk",
    icon: "CS",
    description: "Turnaround profile with elevated volatility and event risk."
  },
  {
    id: "btc",
    name: "Bitcoin",
    tagline: "Digital reserve asset",
    category: "Crypto",
    type: "Crypto",
    sector: "Digital Assets",
    basePrice: 620,
    risk: "High risk",
    icon: "BT",
    description: "Highly volatile asset class, useful for risk awareness training."
  },
  {
    id: "ch-etf",
    name: "Swiss Market ETF",
    tagline: "Broad market diversification",
    category: "ETF",
    type: "ETF",
    sector: "Index",
    basePrice: 140,
    risk: "Low risk",
    icon: "EF",
    description: "Tracks a diversified basket of Swiss companies."
  },
  {
    id: "cash-plus",
    name: "Cash Plus",
    tagline: "Low volatility reserve",
    category: "Savings",
    type: "Savings",
    sector: "Cash",
    basePrice: 100,
    risk: "Low risk",
    icon: "SV",
    description: "Stable pocket for conservative allocation practice."
  }
];

export const ASSET_BY_ID = ASSETS.reduce<Record<string, Asset>>((acc, asset) => {
  acc[asset.id] = asset;
  return acc;
}, {});
