import Link from "next/link";

export default function BackToHome() {
  return (
    <div className="fixed top-6 left-6 z-50">
      <Link 
        href="/"
        className="group flex items-center gap-2 text-white/50 transition-colors hover:text-white"
      >
        <div className="p-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="transition-transform duration-300 group-hover:-translate-x-1"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </div>
        <span className="text-sm font-medium">Back to Home</span>
      </Link>
    </div>
  );
}
