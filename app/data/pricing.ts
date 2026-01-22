export const ACCOUNT_SIZES = [
  { label: "₹50K", value: "50000", fee: "₹1,000" },
  { label: "₹1L", value: "100000", fee: "₹2,000" },
  { label: "₹5L", value: "500000", fee: "₹5,000", popular: true },
  { label: "₹10L", value: "1000000", fee: "₹10,000" },
  { label: "₹25L", value: "2500000", fee: "₹25,000" },
  { label: "₹50L", value: "5000000", fee: "₹50,000" },
  { label: "₹1Cr", value: "10000000", fee: "₹1,00,000" },
];

export const PRICING_DATA: Record<string, { oneStep: Record<string, string>; twoStep: Record<string, string> }> = {
  "50000": {
    oneStep: { profitShare: "80%", profitTarget: "₹5,000 (10%)", step2Goal: "—", dailyLoss: "₹2,000 (4%)", maxDrawdown: "₹3,000 (6%)" },
    twoStep: { profitShare: "80%", profitTarget: "₹4,000 (8%)", step2Goal: "₹3,000 (6%)", dailyLoss: "₹2,000 (4%)", maxDrawdown: "₹4,000 (8%)" }
  },
  "100000": {
    oneStep: { profitShare: "80%", profitTarget: "₹10,000 (10%)", step2Goal: "—", dailyLoss: "₹4,000 (4%)", maxDrawdown: "₹6,000 (6%)" },
    twoStep: { profitShare: "80%", profitTarget: "₹8,000 (8%)", step2Goal: "₹6,000 (6%)", dailyLoss: "₹4,000 (4%)", maxDrawdown: "₹8,000 (8%)" }
  },
  "500000": {
    oneStep: { profitShare: "80%", profitTarget: "₹50,000 (10%)", step2Goal: "—", dailyLoss: "₹20,000 (4%)", maxDrawdown: "₹30,000 (6%)" },
    twoStep: { profitShare: "80%", profitTarget: "₹40,000 (8%)", step2Goal: "₹30,000 (6%)", dailyLoss: "₹20,000 (4%)", maxDrawdown: "₹40,000 (8%)" }
  },
  "1000000": {
    oneStep: { profitShare: "80%", profitTarget: "₹1,00,000 (10%)", step2Goal: "—", dailyLoss: "₹40,000 (4%)", maxDrawdown: "₹60,000 (6%)" },
    twoStep: { profitShare: "80%", profitTarget: "₹80,000 (8%)", step2Goal: "₹60,000 (6%)", dailyLoss: "₹40,000 (4%)", maxDrawdown: "₹80,000 (8%)" }
  },
  "2500000": {
    oneStep: { profitShare: "80%", profitTarget: "₹2,50,000 (10%)", step2Goal: "—", dailyLoss: "₹1,00,000 (4%)", maxDrawdown: "₹1,50,000 (6%)" },
    twoStep: { profitShare: "80%", profitTarget: "₹2,00,000 (8%)", step2Goal: "₹1,50,000 (6%)", dailyLoss: "₹1,00,000 (4%)", maxDrawdown: "₹2,00,000 (8%)" }
  },
  "5000000": {
    oneStep: { profitShare: "80%", profitTarget: "₹5,00,000 (10%)", step2Goal: "—", dailyLoss: "₹2,00,000 (4%)", maxDrawdown: "₹3,00,000 (6%)" },
    twoStep: { profitShare: "80%", profitTarget: "₹4,00,000 (8%)", step2Goal: "₹3,00,000 (6%)", dailyLoss: "₹2,00,000 (4%)", maxDrawdown: "₹4,00,000 (8%)" }
  },
  "10000000": {
    oneStep: { profitShare: "80%", profitTarget: "₹10,00,000 (10%)", step2Goal: "—", dailyLoss: "₹4,00,000 (4%)", maxDrawdown: "₹6,00,000 (6%)" },
    twoStep: { profitShare: "80%", profitTarget: "₹8,00,000 (8%)", step2Goal: "₹6,00,000 (6%)", dailyLoss: "₹4,00,000 (4%)", maxDrawdown: "₹8,00,000 (8%)" }
  }
};

export const PRICING_TOOLTIPS: Record<string, string> = {
  profitShare: "The percentage of profits you keep from your funded account. You earn 80% of all profits generated.",
  profitTarget: "The profit goal you need to achieve to pass the evaluation and get funded.",
  step2Goal: "The profit target for Step 2 in the 2-Step evaluation model.",
  dailyLoss: "Maximum loss allowed in a single trading day. Exceeding this limit will breach your account.",
  maxDrawdown: "Maximum overall loss allowed from your peak balance. This protects your account from excessive losses.",
  minDays: "Minimum number of trading days required. A trading day is when at least one trade is executed.",
  maxRisk: "Maximum risk allowed per individual trade as a percentage of account balance.",
  timeLimit: "Time allowed to complete the evaluation challenge."
};
