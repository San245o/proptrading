import React from 'react';

export default function NewChallengePage() {
  return (
    <div className="animate-fade-in p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-3xl font-bold mb-4">Start New Challenge</h1>
      <p className="text-gray-400 max-w-md mb-8">
        Select your account size and type to begin your evaluation.
      </p>
      <button className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 font-bold transition-colors">
        Configure Challenge
      </button>
    </div>
  );
}
