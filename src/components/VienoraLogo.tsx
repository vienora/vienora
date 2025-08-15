import React from 'react';

interface VienoraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

const VienoraLogo: React.FC<VienoraLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = ''
}) => {
  const sizes = {
    sm: { width: 28, height: 28, fontSize: 'text-base' },
    md: { width: 36, height: 36, fontSize: 'text-lg' },
    lg: { width: 48, height: 48, fontSize: 'text-xl' },
    xl: { width: 64, height: 64, fontSize: 'text-3xl' }
  };

  const { width, height, fontSize } = sizes[size];

  if (variant === 'icon') {
    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        <svg
          width={width}
          height={height}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 🔥 THE VIENORA CREST - Bold & Striking with Button Colors */}
          {/* Concept: Powerful, memorable design using exact amber/yellow gradient from site buttons */}

          {/* Bold outer ring - commanding presence */}
          <circle
            cx="50"
            cy="50"
            r="47"
            stroke="#D97706"
            strokeWidth="3"
            fill="none"
            opacity="0.8"
          />

          {/* Main shield form - bold and striking */}
          <path
            d="M50 15 C32 15 20 25 20 38 L20 58 C20 75 32 85 50 85 C68 85 80 75 80 58 L80 38 C80 25 68 15 50 15 Z"
            fill="#1E1B4B"
            stroke="#D97706"
            strokeWidth="3"
          />

          {/* Gradient overlay for depth */}
          <path
            d="M50 15 C32 15 20 25 20 38 L20 48 C20 55 30 62 50 62 C70 62 80 55 80 48 L80 38 C80 25 68 15 50 15 Z"
            fill="url(#amberGradient)"
            opacity="0.2"
          />

          {/* BOLD "V" monogram - striking and memorable */}
          <path
            d="M38 35 L50 68 L62 35"
            stroke="url(#buttonGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Bold crown element - powerful luxury symbol */}
          <path
            d="M35 30 L42 22 L50 26 L58 22 L65 30 L58 35 L50 31 L42 35 Z"
            fill="url(#buttonGradient)"
          />

          {/* Power accent beneath - luxury signature */}
          <path
            d="M40 72 Q50 78 60 72"
            stroke="url(#buttonGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Bold quality markers - unforgettable details */}
          <circle cx="50" cy="24" r="3" fill="#FCD34D" />
          <circle cx="35" cy="78" r="2.5" fill="#F59E0B" />
          <circle cx="65" cy="78" r="2.5" fill="#F59E0B" />

          {/* Powerful side accents */}
          <path
            d="M30 45 Q35 40 40 45"
            stroke="#D97706"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M60 45 Q65 40 70 45"
            stroke="#D97706"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {/* Button-matching gradient definitions */}
          <defs>
            {/* Exact button gradient - from amber-600 to yellow-600 */}
            <linearGradient id="buttonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>

            {/* Amber gradient for depth */}
            <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <span
        className={`font-bold tracking-wide ${fontSize} ${className}`}
        style={{
          fontFamily: '"Playfair Display", serif, system-ui',
          letterSpacing: '0.05em',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #B45309 0%, #A16207 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 4px rgba(180, 83, 9, 0.4)',
          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
        }}
      >
        Vienora
      </span>
    );
  }

  // Full logo with icon + text
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <VienoraLogo size={size} variant="icon" />
      <VienoraLogo size={size} variant="text" />
    </div>
  );
};

export default VienoraLogo;
