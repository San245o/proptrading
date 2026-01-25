import React from 'react';

export default function ProfilePage() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="bg-[#1a1d24] p-6 rounded-xl max-w-md border border-white/5">
         <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
              JD
            </div>
            <div>
               <h2 className="text-xl font-bold">John Doe</h2>
               <p className="text-gray-400">trader@example.com</p>
            </div>
         </div>
         <button className="w-full py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10">
            Log Out
         </button>
      </div>
    </div>
  );
}
