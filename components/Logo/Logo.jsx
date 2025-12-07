'use client';

/**
 * Logo Sorokid - Thiết kế độc đáo nhận diện thương hiệu
 * 
 * Ý nghĩa thiết kế:
 * - Hình tròn gradient: Đại diện cho sự hoàn thiện và phát triển toàn diện
 * - Bàn tính cách điệu: 5 hạt đại diện cho 5 ngón tay và phương pháp Soroban
 * - Màu gradient xanh-tím: Sự kết hợp giữa logic (xanh) và sáng tạo (tím)
 */

export default function Logo({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    xs: { icon: 24, text: 'text-sm' },
    sm: { icon: 32, text: 'text-base' },
    md: { icon: 40, text: 'text-xl' },
    lg: { icon: 56, text: 'text-2xl' },
    xl: { icon: 72, text: 'text-3xl' },
    '2xl': { icon: 96, text: 'text-4xl' },
  };

  const { icon: iconSize, text: textSize } = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon - Bàn tính cách điệu */}
      <div 
        className="relative flex-shrink-0"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background Circle với Gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="beadGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="beadGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F87171" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>
          
          {/* Main Circle Background */}
          <circle cx="50" cy="50" r="46" fill="url(#logoGradient)" filter="url(#shadow)" />
          
          {/* Inner glow */}
          <circle cx="50" cy="50" r="40" fill="white" fillOpacity="0.15" />
          
          {/* Soroban Frame - Khung bàn tính */}
          <rect x="22" y="25" width="56" height="50" rx="6" fill="white" fillOpacity="0.95" />
          
          {/* Divider Bar - Thanh chia */}
          <rect x="22" y="42" width="56" height="4" fill="url(#logoGradient)" />
          
          {/* Rods - 5 cột */}
          {[30, 40, 50, 60, 70].map((x, i) => (
            <line key={i} x1={x} y1="28" x2={x} y2="72" stroke="#E5E7EB" strokeWidth="2" />
          ))}
          
          {/* Top Beads - Hạt trên (hạt 5) - Một số active */}
          {[30, 40, 50, 60, 70].map((x, i) => (
            <circle 
              key={`top-${i}`} 
              cx={x} 
              cy={i % 2 === 0 ? 34 : 38} 
              r="5" 
              fill={i % 2 === 0 ? "url(#beadGradient2)" : "#E5E7EB"}
              stroke={i % 2 === 0 ? "#B91C1C" : "#D1D5DB"}
              strokeWidth="1"
            />
          ))}
          
          {/* Bottom Beads - Hạt dưới (hạt 1) - Pattern khác nhau */}
          {[30, 40, 50, 60, 70].map((x, i) => {
            const beadPositions = [
              [52, 58, 64, 70], // Column 1: 2 beads up
              [52, 58, 64, 70], // Column 2: 1 bead up  
              [52, 58, 64, 70], // Column 3: 3 beads up
              [52, 58, 64, 70], // Column 4: 4 beads up
              [52, 58, 64, 70], // Column 5: 0 beads up
            ];
            const activeCount = [2, 1, 3, 4, 0][i];
            
            return beadPositions[i].map((y, j) => (
              <circle
                key={`bottom-${i}-${j}`}
                cx={x}
                cy={j < activeCount ? y - 4 : y}
                r="5"
                fill={j < activeCount ? "url(#beadGradient1)" : "#E5E7EB"}
                stroke={j < activeCount ? "#D97706" : "#D1D5DB"}
                strokeWidth="1"
              />
            ));
          })}
          
          {/* Sparkle effects */}
          <circle cx="75" cy="20" r="3" fill="white" fillOpacity="0.8" />
          <circle cx="82" cy="28" r="2" fill="white" fillOpacity="0.6" />
          <circle cx="20" cy="75" r="2" fill="white" fillOpacity="0.5" />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className={`font-black ${textSize}`}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            Soro
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            kid
          </span>
        </div>
      )}
    </div>
  );
}

// Logo chỉ có icon (không có text)
export function LogoIcon({ size = 40, className = '' }) {
  return <Logo size="md" showText={false} className={className} />;
}

// Logo với tagline
export function LogoWithTagline({ size = 'lg', tagline = 'Học Soroban thật vui!' }) {
  return (
    <div className="text-center">
      <Logo size={size} className="justify-center" />
      <p className="mt-2 text-sm text-gray-500 font-medium">{tagline}</p>
    </div>
  );
}
