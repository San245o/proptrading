"use client";

import { useState } from "react";
import { CHATBOT_FAQS } from "@/app/data/faq";

interface ChatQuestion {
    q: string;
    a: string;
}

export default function ChatBot() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatbotHovered, setChatbotHovered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<ChatQuestion | null>(null);

  // Helper reset function
  const resetChat = () => {
    setChatbotOpen(false);
    // Optional: delay clearing state to avoid flickering if needed, 
    // but clearing immediately is safer for next open.
    setTimeout(() => {
        setSelectedCategory(null);
        setSelectedQuestion(null);
    }, 200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chatbot Window */}
      <div 
        className={`absolute bottom-20 right-0 w-[340px] sm:w-[380px] transition-all duration-[200ms] ease-[cubic-bezier(0.7,0,0.3,1)] ${
          chatbotOpen 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-90 translate-y-4 pointer-events-none"
        }`}
        style={{
          transformOrigin: 'bottom right',
        }}
      >
        <div 
          className="overflow-hidden rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl"
          style={{ 
            background: 'linear-gradient(145deg, rgba(40,40,40,0.95) 0%, rgba(20,20,20,0.98) 50%, rgba(30,30,30,0.95) 100%)', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.1)' 
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20">
                <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Elite Prop India</h3>
                <p className="text-[10px] text-white/40">Quick Answers</p>
              </div>
            </div>
            <button 
              onClick={resetChat}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[400px] overflow-y-auto p-4">
            {selectedQuestion ? (
              // Show Answer
              <div className="space-y-3">
                <button 
                  onClick={() => setSelectedQuestion(null)}
                  className="flex items-center gap-2 text-xs text-emerald-400 transition hover:text-emerald-300"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to questions
                </button>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-sm font-medium text-white mb-3">{selectedQuestion.q}</p>
                  <p className="text-sm leading-relaxed text-white/70">{selectedQuestion.a}</p>
                </div>
              </div>
            ) : selectedCategory ? (
              // Show Questions for Category
              <div className="space-y-3">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 text-xs text-emerald-400 transition hover:text-emerald-300"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to categories
                </button>
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">{selectedCategory}</p>
                <div className="space-y-2">
                  {CHATBOT_FAQS.find(c => c.category === selectedCategory)?.questions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedQuestion(q)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-left text-sm text-white/80 transition hover:border-emerald-500/30 hover:bg-white/10"
                    >
                      {q.q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Show Categories
              <div className="space-y-3">
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Choose a topic</p>
                <div className="grid grid-cols-2 gap-2">
                  {CHATBOT_FAQS.map((category) => (
                    <button
                      key={category.category}
                      onClick={() => setSelectedCategory(category.category)}
                      className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4 text-center transition hover:border-emerald-500/30 hover:bg-white/10"
                    >
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                        {category.category === "General" && (
                          <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {category.category === "Evaluation" && (
                          <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {category.category === "Trading Rules" && (
                          <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                        )}
                        {category.category === "Payouts" && (
                          <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-white">{category.category}</span>
                      <span className="text-[10px] text-white/40">{category.questions.length} questions</span>
                    </button>
                  ))}
                </div>
                <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3">
                  <p className="text-xs text-emerald-400/80 text-center">
                    Can&apos;t find what you&apos;re looking for? Check our full <a href="#faq" onClick={resetChat} className="underline hover:text-emerald-300">FAQ section</a>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chatbot Trigger Button */}
      <div 
        className="relative"
        onMouseEnter={() => setChatbotHovered(true)}
        onMouseLeave={() => setChatbotHovered(false)}
      >
        {/* "Need help?" tooltip */}
        <div className={`absolute bottom-full right-0 mb-2 whitespace-nowrap transition-all duration-300 ${
          chatbotHovered && !chatbotOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}>
          <div className="rounded-lg border border-white/20 bg-[#1a1a1a] px-3 py-2 text-sm font-medium text-white shadow-xl">
            Need help?
            <div className="absolute -bottom-1 right-4 h-2 w-2 rotate-45 border-b border-r border-white/20 bg-[#1a1a1a]" />
          </div>
        </div>

        <button
          onClick={() => setChatbotOpen(!chatbotOpen)}
          className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            chatbotOpen 
              ? "bg-white/10 rotate-0 scale-90" 
              : "bg-black"
          }`}
        >
          {chatbotOpen ? (
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
