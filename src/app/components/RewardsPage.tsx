interface UnitProgress {
  unitId: number;
  completed: boolean;
  quizCompleted: boolean;
  lessonCompleted: boolean;
}

interface RewardsPageProps {
  unitsProgress: UnitProgress[];
  balance: number;
  xp: number;
  holdingsCount: number;
  sectorCount: number;
  claimedRewards: string[];
  unlockedCosmetics: string[];
  onClaimReward: (rewardId: string, yc: number, xp: number) => void;
  onPurchaseCosmetic: (itemId: string, cost: number) => void;
  onOpenPromo: () => void;
}

interface AchievementReward {
  id: string;
  title: string;
  description: string;
  ycReward: number;
  xpReward: number;
  unlocked: boolean;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
}

const SHOP_ITEMS: ShopItem[] = [
  { id: "theme-arctic", name: "Arctic Theme", description: "A clean blue profile theme.", cost: 250 },
  { id: "title-patient", name: "Profile Title: Patient Investor", description: "Unlock a long-term mindset title.", cost: 180 },
  { id: "mascot-neo", name: "Mascot Skin: Neo Owl", description: "A fresh mascot skin for your dashboard.", cost: 320 },
];

export function RewardsPage({
  unitsProgress,
  balance,
  xp,
  holdingsCount,
  sectorCount,
  claimedRewards,
  unlockedCosmetics,
  onClaimReward,
  onPurchaseCosmetic,
  onOpenPromo,
}: RewardsPageProps) {
  const achievements: AchievementReward[] = [
    {
      id: "first-investment",
      title: "First Investment",
      description: "Open your first market position.",
      ycReward: 120,
      xpReward: 90,
      unlocked: holdingsCount > 0,
    },
    {
      id: "smart-diversifier",
      title: "Smart Diversifier",
      description: "Hold positions in at least 2 different sectors.",
      ycReward: 180,
      xpReward: 120,
      unlocked: sectorCount >= 2,
    },
    {
      id: "crash-survivor",
      title: "Crash Survivor",
      description: "Complete Unit 3 and pass the crash mindset challenge.",
      ycReward: 240,
      xpReward: 180,
      unlocked: Boolean(unitsProgress.find((u) => u.unitId === 3)?.completed),
    },
  ];

  const unitRewards = unitsProgress.map((unit) => ({
    id: `unit-${unit.unitId}-completion`,
    unitId: unit.unitId,
    title: `Unit ${unit.unitId} Completion Reward`,
    ycReward: 100 + unit.unitId * 40,
    xpReward: 80 + unit.unitId * 35,
    unlocked: unit.completed,
  }));

  const completedUnits = unitsProgress.filter((unit) => unit.completed).length;
  const allUnitsCompleted = completedUnits === unitsProgress.length;
  const remainingUnits = Math.max(0, unitsProgress.length - completedUnits);

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <header className="mb-8 rounded-2xl p-6" style={{ backgroundColor: 'rgba(255,255,255,0.72)', border: '1px solid var(--light-blue-300)' }}>
        <h2 className="text-2xl mb-2" style={{ color: 'var(--black-500)' }}>Rewards Center</h2>
        <p style={{ color: 'var(--black-400)' }}>
          Claim achievement rewards, unlock unit bonuses, and spend YQ on cosmetics to personalize your journey.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--light-blue-100)', color: 'var(--black-500)' }}>
            Wallet: {Math.round(balance).toLocaleString()} YQ
          </span>
          <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--orange-50)', color: 'var(--black-500)' }}>
            XP: {xp.toLocaleString()}
          </span>
          <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--blue-50)', color: 'var(--black-500)' }}>
            Units completed: {completedUnits}/4
          </span>
        </div>
      </header>

      <section className="rounded-xl p-5 mb-6" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
        <h3 className="mb-4" style={{ color: 'var(--black-500)' }}>Achievement Rewards</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {achievements.map((achievement) => {
            const claimed = claimedRewards.includes(achievement.id);
            const state = claimed ? "claimed" : achievement.unlocked ? "claimable" : "locked";
            return (
              <article key={achievement.id} className="rounded-xl p-4" style={{ backgroundColor: 'var(--blue-50)', border: '1px solid var(--black-100)' }}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 style={{ color: 'var(--black-500)' }}>{achievement.title}</h4>
                  <span
                    className="text-xs px-2 py-1 rounded-full whitespace-nowrap"
                    style={{
                      backgroundColor:
                        state === "claimed"
                          ? 'var(--orange-100)'
                           : state === "claimable"
                           ? 'var(--orange-50)'
                          : 'var(--light-blue-100)',
                      color: state === "locked" ? 'var(--black-400)' : 'var(--black-500)',
                    }}
                  >
                    {state === "claimed" ? "Claimed" : state === "claimable" ? "Ready" : "Locked"}
                  </span>
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--black-400)' }}>{achievement.description}</p>
                <p className="text-xs mb-3" style={{ color: 'var(--black-400)' }}>
                  Reward: +{achievement.ycReward} YQ and +{achievement.xpReward} XP
                </p>
                <button
                  type="button"
                  disabled={!achievement.unlocked || claimed}
                  onClick={() => onClaimReward(achievement.id, achievement.ycReward, achievement.xpReward)}
                  className="w-full rounded-lg px-3 py-2 text-sm transition-all cursor-pointer disabled:cursor-not-allowed"
                  style={{
                    backgroundColor:
                      state === "claimed"
                        ? 'var(--orange-200)'
                         : state === "claimable"
                         ? 'var(--orange-400)'
                        : 'var(--light-blue-200)',
                    color: state === "claimable" ? 'white' : 'var(--black-500)',
                     border:
                       state === "claimed"
                        ? '1px solid var(--orange-300)'
                         : state === "locked"
                        ? '1px solid var(--light-blue-300)'
                        : '1px solid var(--orange-500)',
                  }}
                >
                  {state === "claimed" ? "Claimed ✓" : state === "claimable" ? "Claim reward" : "Locked - complete objective"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl p-5 mb-6" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
        <h3 className="mb-4" style={{ color: 'var(--black-500)' }}>Unit Completion Rewards</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {unitRewards.map((reward) => {
            const claimed = claimedRewards.includes(reward.id);
            const state = claimed ? "claimed" : reward.unlocked ? "claimable" : "locked";
            return (
              <article key={reward.id} className="rounded-xl p-4" style={{ backgroundColor: 'var(--blue-50)', border: '1px solid var(--black-100)' }}>
                <div className="flex items-center justify-between mb-2">
                  <h4 style={{ color: 'var(--black-500)' }}>{reward.title}</h4>
                  <span
                    className="text-xs px-2 py-1 rounded-full whitespace-nowrap"
                    style={{
                      backgroundColor:
                        state === "claimed"
                          ? 'var(--orange-100)'
                          : state === "claimable"
                          ? 'var(--orange-50)'
                          : 'var(--light-blue-100)',
                      color: state === "locked" ? 'var(--black-400)' : 'var(--black-500)',
                    }}
                  >
                    {state === "claimed" ? "Claimed ✓" : state === "claimable" ? "Ready" : "Locked"}
                  </span>
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--black-400)' }}>
                  Complete Unit {reward.unitId} and claim your progression bonus.
                </p>
                <button
                  type="button"
                  disabled={!reward.unlocked || claimed}
                  onClick={() => onClaimReward(reward.id, reward.ycReward, reward.xpReward)}
                  className="rounded-lg px-3 py-2 text-sm transition-all cursor-pointer disabled:cursor-not-allowed"
                  style={{
                    backgroundColor:
                      state === "claimed"
                        ? 'var(--orange-200)'
                        : state === "claimable"
                        ? 'var(--orange-400)'
                        : 'var(--light-blue-200)',
                    color: state === "claimable" ? 'white' : 'var(--black-500)',
                    border:
                      state === "claimed"
                        ? '1px solid var(--orange-300)'
                        : state === "locked"
                        ? '1px solid var(--light-blue-300)'
                        : '1px solid var(--orange-500)',
                  }}
                >
                  {state === "claimed" ? "Claimed ✓" : state === "claimable" ? `Claim +${reward.ycReward} YQ / +${reward.xpReward} XP` : "Locked - complete unit"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl p-5" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
          <h3 className="mb-4" style={{ color: 'var(--black-500)' }}>Reward Shop</h3>
          <div className="space-y-3">
            {SHOP_ITEMS.map((item) => {
              const owned = unlockedCosmetics.includes(item.id);
              return (
                <article key={item.id} className="rounded-lg p-3" style={{ backgroundColor: 'var(--blue-50)', border: '1px solid var(--black-100)' }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 style={{ color: 'var(--black-500)' }}>{item.name}</h4>
                      <p className="text-sm" style={{ color: 'var(--black-400)' }}>{item.description}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--orange-50)', color: 'var(--black-500)' }}>
                      {item.cost} YQ
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={owned || balance < item.cost}
                    onClick={() => onPurchaseCosmetic(item.id, item.cost)}
                    className="rounded-lg px-3 py-2 text-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ backgroundColor: 'var(--light-blue-400)', color: 'white' }}
                  >
                    {owned ? "Owned" : balance < item.cost ? "Not enough YQ" : "Purchase"}
                  </button>
                </article>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ backgroundColor: 'white', border: '1px solid var(--black-100)' }}>
          <h3 className="mb-2" style={{ color: 'var(--black-500)' }}>Promo & Referral</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--black-400)' }}>
            {allUnitsCompleted
              ? "Have a promo code? Claim extra YQ and unlock exclusive cosmetic rewards."
              : `Finish ${remainingUnits} more unit${remainingUnits > 1 ? "s" : ""} to unlock promo rewards.`}
          </p>
          {allUnitsCompleted ? (
            <button
              type="button"
              onClick={onOpenPromo}
              className="rounded-lg px-4 py-2 text-sm cursor-pointer"
              style={{ backgroundColor: 'var(--orange-400)', color: 'white' }}
            >
              Open promo code
            </button>
          ) : (
            <div className="rounded-lg px-4 py-3" style={{ backgroundColor: 'var(--blue-50)', border: '1px solid var(--black-100)' }}>
              <p className="text-sm" style={{ color: 'var(--black-500)' }}>
                Promo code locked until the learning path is complete.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}