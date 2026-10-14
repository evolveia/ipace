import React from 'react';

interface IpaceLogoProps {
  variant?: 'horizontal' | 'stacked' | 'icon-only' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  inverted?: boolean;
}

export const IpaceLogo: React.FC<IpaceLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  inverted = false,
}) => {
  // Dimensions based on size
  const iconSizes = {
    sm: 36,
    md: 52,
    lg: 72,
    xl: 104,
  };

  const currentIconSize = iconSizes[size];

  // The rotated emblem SVG
  const LogoIcon = (
    <div
      className="relative flex items-center justify-center shrink-0 transition-transform duration-200"
      style={{ width: currentIconSize, height: currentIconSize }}
      aria-label="IPACE Emblem"
    >
      <svg
        viewBox="0 0 120 120"
        width={currentIconSize}
        height={currentIconSize}
        className="overflow-visible drop-shadow-sm select-none"
      >
        <defs>
          <filter id={`logoShadow-${size}`} x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.14" />
          </filter>
          <linearGradient id={`wcGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E4575E" />
            <stop offset="55%" stopColor="#D2262E" />
            <stop offset="100%" stopColor="#121212" />
          </linearGradient>
        </defs>

        {/* Rotated rounded badge (-6 deg) */}
        <g transform="rotate(-6 60 60)">
          {/* Outer thick crimson red border & creamy light background */}
          <rect
            x="12"
            y="12"
            width="96"
            height="96"
            rx="22"
            ry="22"
            fill="#F7F5F2"
            stroke="#D2262E"
            strokeWidth="8"
            filter={`url(#logoShadow-${size})`}
          />

          {/* Watercolor explosion / splash background */}
          <path
            d="M 28 42 C 20 34, 18 48, 25 54 C 19 62, 24 72, 34 68 C 30 76, 44 82, 48 74 C 54 80, 68 76, 62 66 C 70 60, 64 46, 56 48 C 54 38, 40 36, 36 44 Z"
            fill="#F3BFC3"
            opacity="0.65"
          />
          <path
            d="M 34 46 C 26 40, 24 50, 31 56 C 26 63, 33 71, 42 66 C 40 73, 50 75, 54 68 C 58 72, 66 68, 62 60 C 66 54, 60 46, 52 48 Z"
            fill="#E4575E"
            opacity="0.75"
          />

          {/* Dynamic watercolor spatter dots */}
          <circle cx="23" cy="38" r="2.2" fill="#D2262E" opacity="0.85" />
          <circle cx="18" cy="53" r="3" fill="#E4575E" opacity="0.8" />
          <circle cx="27" cy="74" r="2.5" fill="#D2262E" opacity="0.85" />
          <circle cx="37" cy="81" r="2" fill="#121212" opacity="0.6" />
          <circle cx="58" cy="79" r="2.3" fill="#D2262E" opacity="0.7" />
          <circle cx="68" cy="39" r="1.6" fill="#D2262E" opacity="0.6" />

          {/* Runner figure silhouette */}
          {/* Head */}
          <circle cx="72" cy="38" r="6" fill="#121212" />
          {/* Torso & athletic drive */}
          <path
            d="M 68 44 C 62 48, 52 56, 50 64 C 55 64, 60 62, 65 58 C 70 54, 72 48, 68 44 Z"
            fill={`url(#wcGrad-${size})`}
          />
          {/* Dynamic back splatter ribs */}
          <path d="M 52 52 C 42 50, 34 54, 38 60 C 44 64, 50 62, 54 60 Z" fill="#D2262E" />
          {/* Forward Arm */}
          <path
            d="M 67 48 L 78 52 L 86 44"
            stroke="#121212"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Backward Arm */}
          <path
            d="M 58 50 L 46 54 L 38 62"
            stroke="#121212"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Forward Leg (sprinting knee drive) */}
          <path
            d="M 58 62 L 72 68 L 68 84"
            stroke="#121212"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Forward Foot brush stroke */}
          <path d="M 66 83 L 73 85" stroke="#D2262E" strokeWidth="4" strokeLinecap="round" />
          {/* Trailing Leg (high stride back kick) */}
          <path
            d="M 52 64 L 40 74 L 32 84"
            stroke={`url(#wcGrad-${size})`}
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Trailing Foot toe flick */}
          <path d="M 31 83 L 26 86" stroke="#D2262E" strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center ${className}`}>{LogoIcon}</div>;
  }

  const textColor = inverted
    ? 'text-white'
    : 'text-[var(--ipace-text)]';
  const subtitleColor = inverted
    ? 'text-gray-300'
    : 'text-[var(--ipace-text-2)]';

  const fontSizes = {
    sm: { title: 'text-xl tracking-tight', sub: 'text-[9px] tracking-[0.25em]' },
    md: { title: 'text-2xl tracking-tighter', sub: 'text-[11px] tracking-[0.28em]' },
    lg: { title: 'text-4xl tracking-tighter', sub: 'text-[14px] tracking-[0.32em]' },
    xl: { title: 'text-6xl tracking-tighter', sub: 'text-[18px] tracking-[0.36em]' },
  };

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {LogoIcon}
        <div className="mt-3">
          <div className={`font-black uppercase font-heading ${textColor} ${fontSizes[size].title} leading-none`}>
            IPACE
          </div>
          <div className={`font-bold uppercase font-heading ${subtitleColor} ${fontSizes[size].sub} mt-1`}>
            RUNNING APP
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        {LogoIcon}
        <div className="flex flex-col leading-none">
          <span className={`font-black uppercase font-heading ${textColor} text-xl tracking-tighter`}>
            IPACE
          </span>
          <span className={`font-bold uppercase font-heading ${subtitleColor} text-[8px] tracking-[0.22em] mt-0.5`}>
            RUNNING APP
          </span>
        </div>
      </div>
    );
  }

  // Default: 'horizontal'
  return (
    <div className={`inline-flex items-center gap-3.5 ${className}`}>
      {LogoIcon}
      <div className="flex flex-col justify-center select-none">
        <span className={`font-black uppercase font-heading ${textColor} ${fontSizes[size].title} leading-none`}>
          IPACE
        </span>
        <span className={`font-bold uppercase font-heading ${subtitleColor} ${fontSizes[size].sub} mt-1`}>
          RUNNING APP
        </span>
      </div>
    </div>
  );
};
