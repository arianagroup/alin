import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true, className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className={`flex items-center ${showText ? 'space-x-3' : ''} ${className}`}>
      <div className="relative group">
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg transform transition-all duration-700 hover:scale-105 animate-bounce hover:animate-none hover:shadow-2xl`}>
          <span className="text-white font-bold text-lg transition-all duration-300 group-hover:text-yellow-100">N</span>
        </div>

        {/* Animated ring effect */}
        <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-orange-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping group-hover:animate-pulse`}></div>

        {/* Glow effect */}
        <div className={`absolute inset-0 ${sizeClasses[size]} bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-full opacity-0 group-hover:opacity-20 blur-lg transform transition-all duration-500`}></div>
      </div>
      
      {showText && (
        <div>
          <div className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight`}>
            <div className="whitespace-nowrap">Natlin Resto</div>
            <div className="whitespace-nowrap">& Bar</div>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-xs text-gray-500 whitespace-nowrap">Taste the Excellence</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;