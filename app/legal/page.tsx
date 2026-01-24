"use client";


export default function LegalPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] text-white/80 font-sans selection:bg-emerald-500/30">
      <main className="container mx-auto px-6 py-32 max-w-4xl">
        <div className="space-y-12">
            
          {/* Legal Disclaimer Section */}
          <section className="space-y-6">
            <h1 className="text-4xl font-bold text-white mb-8">Elite Prop India – Legal Disclaimer</h1>
            
            <div className="space-y-6 text-base text-white/70 leading-relaxed">
              <p>
                Elite Prop India operates solely as a proprietary trading evaluation and performance assessment platform.
              </p>
              <p>
                Elite Prop India does not act as a broker, investment advisor, portfolio manager, asset manager, 
                or financial intermediary of any kind. We do not provide investment advice, trading recommendations, 
                or guaranteed returns.
              </p>
              <p>
                All accounts offered by Elite Prop India are simulated trading accounts. Traders do not trade with 
                real money, client funds, or live market capital belonging to Elite Prop India or any third party.
              </p>
              <p>
                Any references to “funded accounts,” “capital,” “profits,” or similar terms are purely notional 
                and relate only to simulated performance metrics.
              </p>
              <p>
                Performance-based rewards offered by Elite Prop India are discretionary and are issued solely based 
                on compliance with predefined trading rules, risk parameters, and behavioral standards within a 
                simulated environment.
              </p>
              <p>
                Trading involves substantial risk and is not suitable for everyone. Past performance, simulated or otherwise, 
                does not guarantee future results.
              </p>
              <p>
                Elite Prop India does not accept deposits, manage investor funds, pool capital, or execute trades 
                on behalf of users.
              </p>
              <p>
                Users are solely responsible for their trading decisions, strategies, and risk management practices.
              </p>
              <p>
                Elite Prop India shall not be liable for any financial loss, opportunity cost, emotional distress, 
                or indirect damages arising from the use of its platform.
              </p>
              <p>
                Access to Elite Prop India services may be restricted in certain jurisdictions. Users are responsible 
                for ensuring compliance with local laws.
              </p>
              <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="font-semibold text-white">
                    By using Elite Prop India, you acknowledge that you have read, understood, and agreed to this disclaimer.
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>

    </div>
  );
}
