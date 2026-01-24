"use client";

import BackToHome from "@/components/ui/BackToHome";

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] text-white/80 font-sans selection:bg-emerald-500/30">
      {/* Dark Dot Matrix Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundColor: '#0a0a0a',
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),
            radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
          imageRendering: 'pixelated' as const,
        }}
      />
      
      <BackToHome />
      <main className="relative z-10 container mx-auto px-6 py-32 max-w-4xl">
        <div className="space-y-12">
            
          <section className="space-y-6">
            <h1 className="text-4xl font-bold text-white mb-8">Elite Prop India – Privacy Policy</h1>
            <p className="text-lg">
                Your privacy is important to us. This Privacy Policy explains how Elite Prop India collects, uses, and protects your personal information.
            </p>

            <div className="space-y-8">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
                <p>
                  We collect information that you provide directly to us when you register for an account, 
                  purchase an evaluation, or communicate with us. This may include your name, email address, 
                  phone number, and payment information.
                </p>
                <p>
                    We may also automatically collect technical information about your device and usage of our 
                    platform, such as IP address, browser type, and operating system.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-white">2. How We Use Your Information</h2>
                <p>
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Provide, maintain, and improve our services.</li>
                    <li>Process transactions and send related information.</li>
                    <li>Monitor and analyze trends, usage, and activities.</li>
                    <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities.</li>
                    <li>Communicate with you about products, services, offers, and events.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-white">3. Information Sharing</h2>
                <p>
                  We do not share your personal information with third parties except as described in this policy 
                  or with your consent. We may share information with vendors, consultants, and other service 
                  providers who need access to such information to carry out work on our behalf.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-white">4. Data Security</h2>
                <p>
                  We take reasonable measures to help protect information about you from loss, theft, misuse, 
                  and unauthorized access, disclosure, alteration, and destruction.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-white">5. Cookies</h2>
                <p>
                  We use cookies and similar tracking technologies to track the activity on our service and 
                  hold certain information. You can instruct your browser to refuse all cookies or to indicate 
                  when a cookie is being sent.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-white">6. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. If we make changes, we will notify you 
                  by revising the date at the top of the policy and, in some cases, we may provide you with 
                  additional notice.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-white">7. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at support@elitepropindia.com.
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>

    </div>
  );
}
