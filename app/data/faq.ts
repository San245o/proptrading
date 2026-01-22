export const GUIDELINES = [
  {
    id: "general",
    title: "What is Elite Prop India?",
    content: "Elite Prop India is an India-focused proprietary trading evaluation platform created by traders, for traders. We evaluate trading skill using <strong>simulated trading accounts only</strong>. Traders who demonstrate consistency, proper risk management, and rule adherence may become eligible for performance-based rewards. We are <strong>NOT a broker</strong>, investment provider, or capital management service."
  },
  {
    id: "legal",
    title: "Is Elite Prop India legal in India?",
    content: "Yes. We operate in alignment with Indian regulatory expectations. We only offer <strong>SEBI-approved instruments</strong>: NSE-listed stocks, Nifty Futures & Options, Bank Nifty Futures & Options. We do not accept, hold, or manage client funds. We do not provide investment advice or guaranteed returns. Elite Prop India is <strong>not a broker, PMS, or AIF</strong>."
  },
  {
    id: "evaluation",
    title: "What are the evaluation models?",
    content: "<strong>One-Step Evaluation:</strong> 10% profit target, 4% daily drawdown, 6% trailing max drawdown, minimum 3 trading days. <strong>Two-Step Evaluation:</strong> Step 1 is 8% target, Step 2 is 6% target, 4% daily drawdown, 8% static max drawdown, minimum 3 trading days. <strong>No time limit</strong> for both models."
  },
  {
    id: "drawdown",
    title: "How does trailing drawdown work?",
    content: "Trailing drawdown increases as your account balance increases, protecting unrealized gains. <strong>Example:</strong> Starting balance ₹1,00,000 with 10% trailing drawdown = floor at ₹90,000. If balance grows to ₹1,10,000, floor moves to ₹1,00,000. Once the floor reaches starting balance, it <strong>locks and stops trailing</strong>. Touching the floor terminates the account."
  },
  {
    id: "trading-rules",
    title: "What trading rules apply?",
    content: "<strong>Allowed:</strong> News trading, Expert Advisors (EAs), manual/systematic strategies. <strong>Prohibited:</strong> Overnight holding, weekend holding, hedging across multiple accounts, HFT, account sharing, copy trading from external sources. <strong>Limits:</strong> Max 3% risk per trade, 20% total exposure."
  },
  {
    id: "funded-rules",
    title: "What are the funded account rules?",
    content: "<strong>80% profit split</strong> to trader. 8% trailing drawdown based on daily close balance. Max 3% risk per trade, 20% total exposure. <strong>No consistency rule applies.</strong> Scaling available after 3 profitable months with 10%+ profit each."
  },
  {
    id: "payouts",
    title: "How do payouts work?",
    content: "<strong>Standard payout cycle: 30 days</strong> (14-day add-on available). Supported methods: <strong>UPI, Bank Transfer, and Crypto</strong>. KYC mandatory before payouts. Evaluation fees are non-refundable."
  },
  {
    id: "scaling",
    title: "What is the scaling plan?",
    content: "Eligibility: 3 profitable months, 3 successful payouts, minimum 10% monthly profit for 3 consecutive months. <strong>Scaling path:</strong> ₹1 Crore → ₹2 Crore → ₹4 Crore → ₹5 Crore (maximum allocation)."
  },
  {
    id: "violations",
    title: "What causes account termination?",
    content: "<strong>Hard rule violations:</strong> Breach of daily/overall drawdown, copy trading from others, account sharing, system exploitation, exceeding risk limits, HFT, gambling behavior, market manipulation. Profits after violation are subject to review. Appeals are permitted."
  },
  {
    id: "platforms",
    title: "What platforms are supported?",
    content: "Trade using <strong>MetaTrader 5 (MT5)</strong>. All execution occurs in a simulated environment designed to reflect real market conditions. Trade <strong>Indian equities and F&O</strong> instruments."
  },
  {
    id: "support",
    title: "How can I get support?",
    content: "Support available via <strong>Official Email and Live Chat</strong>. In case of disputes, Elite Prop India's decision after review is <strong>final and binding</strong>."
  },
];

export const CHATBOT_FAQS = [
  {
    category: "General",
    questions: [
      {
        q: "What is Elite Prop India?",
        a: "Elite Prop India is an India-focused proprietary trading evaluation platform. We evaluate trading skill using simulated accounts. We are NOT a broker, investment provider, or capital management service."
      },
      {
        q: "Is Elite Prop India legal in India?",
        a: "Yes! We only offer SEBI-approved instruments (NSE stocks, Nifty & Bank Nifty F&O). We don't hold client funds, provide investment advice, or offer guaranteed returns."
      },
      {
        q: "Do you provide real capital?",
        a: "No. All accounts are simulated. Rewards are paid based on performance in the simulated environment."
      }
    ]
  },
  {
    category: "Evaluation",
    questions: [
      {
        q: "What account types do you offer?",
        a: "One-Step Evaluation (10% target, 6% trailing drawdown) and Two-Step Evaluation (8% + 6% targets, 8% static drawdown). Both have no time limits."
      },
      {
        q: "Is there a time limit?",
        a: "No! Trade at your own pace. We don't impose time pressure to promote responsible trading."
      },
      {
        q: "What's the minimum trading days?",
        a: "3 trading days minimum. A trading day is when at least one trade is executed."
      }
    ]
  },
  {
    category: "Trading Rules",
    questions: [
      {
        q: "Is news trading allowed?",
        a: "Yes, news trading is fully allowed."
      },
      {
        q: "Are EAs/bots allowed?",
        a: "Yes, Expert Advisors and automated strategies are allowed."
      },
      {
        q: "Can I hold overnight?",
        a: "No. Overnight and weekend holding is not allowed. Positions auto-close at market close."
      },
      {
        q: "What's the max risk per trade?",
        a: "Maximum 3% risk per trade and 20% total exposure of account balance."
      }
    ]
  },
  {
    category: "Payouts",
    questions: [
      {
        q: "What's the profit split?",
        a: "80% to you, 20% to Elite Prop India."
      },
      {
        q: "How often are payouts?",
        a: "Standard: 30 days. Optional add-on: 14 days. Methods: UPI, Bank Transfer, Crypto."
      },
      {
        q: "What's the scaling plan?",
        a: "After 3 profitable months with 10%+ profit each: ₹1Cr → ₹2Cr → ₹4Cr → ₹5Cr max."
      }
    ]
  }
];
