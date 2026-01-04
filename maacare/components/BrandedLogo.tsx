
import React from 'react';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  onClick?: () => void;
}

const BrandedLogo: React.FC<Props> = ({ className = '', size = 'md', showText = true, onClick }) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
    xl: 'w-56 h-56'
  };

  const textMap = {
    sm: 'text-base',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`} onClick={onClick}>
      <div className={`${sizeMap[size]} relative group cursor-pointer transition-transform duration-500 hover:scale-105`}>
        {/* Animated Glow Backdrop */}
        <div className="absolute inset-0 bg-rose-200/20 rounded-full blur-2xl group-hover:bg-rose-300/30 transition-colors duration-700"></div>
        
        {/* Main Logo Frame */}
        <div className="w-full h-full rounded-full bg-white shadow-[0_10px_40px_-10px_rgba(225,150,150,0.3)] overflow-hidden flex items-center justify-center border-[3px] border-rose-100 relative z-10">
          <svg 
            viewBox="0 0 100 100" 
            className="w-[85%] h-[85%] fill-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Rose Gold Circle */}
            <circle cx="50" cy="50" r="48" stroke="url(#roseGoldGradient)" strokeWidth="0.5" />
            
            <defs>
              <linearGradient id="roseGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f3e8ff" />
                <stop offset="50%" stopColor="#fda4af" />
                <stop offset="100%" stopColor="#e0a1a1" />
              </linearGradient>
              <linearGradient id="textGold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#b8860b" />
              </linearGradient>
            </defs>

            {/* Mother and Child Stylized Silhouette */}
            <path 
              d="M50 85 C30 85 15 70 15 50 C15 35 25 20 45 15 C48 14 52 14 55 15 C65 18 70 25 70 35 C70 45 60 55 50 65" 
              stroke="url(#roseGoldGradient)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            <path 
              d="M45 40 C45 35 50 32 55 35 C60 38 58 45 52 48" 
              stroke="url(#roseGoldGradient)" 
              strokeWidth="2" 
              strokeLinecap="round" 
            />
            
            {/* Heart Shape Integration */}
            <path 
              d="M50 35 C60 20 85 30 85 50 C85 70 50 90 50 90 C50 90 15 70 15 50 C15 30 40 20 50 35" 
              stroke="url(#roseGoldGradient)" 
              strokeWidth="1.5" 
              strokeDasharray="2 2"
              opacity="0.4"
            />

            {/* The Branded "M" */}
            <path 
              d="M40 70 L40 45 L50 60 L60 45 L60 70" 
              stroke="url(#textGold)" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>
      </div>
      
      {showText && (
        <h1 className={`${textMap[size]} font-serif font-medium tracking-tight text-[#b8860b] drop-shadow-sm select-none`}>
          Maacare
        </h1>
      )}
    </div>
  );
};

export default BrandedLogo;
