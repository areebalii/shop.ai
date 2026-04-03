import React from 'react';

const Loader = () => {
  return (
    <div className='fixed inset-0 z-[10000] bg-white flex flex-col justify-between items-center py-20 px-6'>

      {/* Top: Brand Identity */}
      <div className='animate-pulse'>
        <h1 className='text-2xl md:text-4xl font-black tracking-[0.6em] text-slate-900 uppercase'>
          WEARWELL
        </h1>
        <p className='text-[10px] tracking-[0.3em] text-slate-400 text-center mt-2'>
          AI ENHANCED FASHION
        </p>
      </div>

      {/* Center: Subtle Spinner (Optional, keeps it clean) */}
      <div className='flex-1 flex items-center justify-center'>
        <div className='w-12 h-12 border-2 border-slate-100 border-t-slate-900 rounded-full animate-spin'></div>
      </div>

      {/* Bottom: Progress Bar/Loading Link */}
      <div className='w-full max-w-xs space-y-4 text-center'>
        <div className='w-full h-[2px] bg-slate-100 overflow-hidden rounded-full'>
          <div className='h-full bg-black animate-loading-bar rounded-full'></div>
        </div>
        <p className='text-[10px] font-bold uppercase tracking-widest text-slate-500 animate-bounce'>
          Fetching Collection...
        </p>
      </div>

      {/* Custom Tailwind Animation for the bar */}
      <style jsx>{`
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 50%; transform: translateX(50%); }
          100% { width: 100%; transform: translateX(200%); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Loader;