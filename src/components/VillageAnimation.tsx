export default function VillageAnimation() {
  return (
    <svg viewBox="0 0 600 600" className="w-full h-auto max-w-2xl mx-auto">
      <defs>
        <style>{`
          @keyframes sunMove {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          @keyframes sunRays {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(30deg); }
          }
          @keyframes cloudFloat {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(15px); }
          }
          @keyframes waterRipple {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          .sun { animation: sunMove 4s ease-in-out infinite; }
          .sun-rays { animation: sunRays 8s ease-in-out infinite; transform-origin: center; }
          .cloud { animation: cloudFloat 6s ease-in-out infinite; }
          .water-ripple { animation: waterRipple 3s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* Background Circle */}
      <circle cx="300" cy="380" r="220" fill="#5DADA6" opacity="0.3"/>

      {/* Water/Base */}
      <ellipse cx="300" cy="530" rx="220" ry="70" fill="#5DADA6"/>
      <ellipse cx="280" cy="530" rx="180" ry="50" fill="#4A9B95" opacity="0.5" className="water-ripple"/>

      {/* Ducks in water */}
      <g>
        <ellipse cx="250" cy="515" rx="12" ry="8" fill="white"/>
        <circle cx="245" cy="512" r="6" fill="white"/>
        <path d="M 242 512 Q 238 512 238 515" stroke="#FDB42E" strokeWidth="2" fill="none"/>
      </g>
      <g>
        <ellipse cx="340" cy="520" rx="12" ry="8" fill="white"/>
        <circle cx="335" cy="517" r="6" fill="white"/>
        <path d="M 332 517 Q 328 517 328 520" stroke="#FDB42E" strokeWidth="2" fill="none"/>
      </g>

      {/* Main buildings base */}
      <g>
        {/* Left church/tower */}
        <rect x="140" y="260" width="70" height="190" fill="#E8DDD1" rx="5"/>
        <rect x="150" y="280" width="15" height="25" fill="#3f5b66" rx="3"/>
        <rect x="175" y="280" width="15" height="25" fill="#3f5b66" rx="3"/>
        <rect x="150" y="320" width="15" height="25" fill="#3f5b66" rx="3"/>
        <rect x="175" y="320" width="15" height="25" fill="#3f5b66" rx="3"/>
        <rect x="150" y="360" width="15" height="25" fill="#3f5b66" rx="3"/>
        <rect x="175" y="360" width="15" height="25" fill="#3f5b66" rx="3"/>
        <path d="M 175 235 L 140 260 L 210 260 Z" fill="#bb7261"/>
        <circle cx="175" cy="225" r="8" fill="#bb7261"/>

        {/* Center church */}
        <rect x="240" y="320" width="60" height="130" fill="#FFFFFF" rx="5"/>
        <circle cx="270" cy="380" r="15" fill="#3f5b66"/>
        <rect x="260" y="400" width="20" height="50" fill="#8B7355"/>
        <path d="M 270 290 L 240 320 L 300 320 Z" fill="#EAEAEA"/>
        <circle cx="270" cy="280" r="5" fill="#bb7261"/>

        {/* Right tall building */}
        <rect x="310" y="280" width="50" height="170" fill="#bb7261" rx="5"/>
        <rect x="320" y="300" width="8" height="12" fill="#3f5b66" rx="1"/>
        <rect x="335" y="300" width="8" height="12" fill="#3f5b66" rx="1"/>
        <rect x="320" y="325" width="8" height="12" fill="#3f5b66" rx="1"/>
        <rect x="335" y="325" width="8" height="12" fill="#3f5b66" rx="1"/>
        <rect x="320" y="350" width="8" height="12" fill="#3f5b66" rx="1"/>
        <rect x="335" y="350" width="8" height="12" fill="#3f5b66" rx="1"/>
        <rect x="320" y="375" width="8" height="12" fill="#3f5b66" rx="1"/>
        <rect x="335" y="375" width="8" height="12" fill="#3f5b66" rx="1"/>

        {/* Far right buildings */}
        <rect x="380" y="310" width="35" height="140" fill="#E8DDD1" rx="5"/>
        <rect x="388" y="325" width="8" height="12" fill="#3f5b66" rx="1"/>
        <rect x="400" y="325" width="8" height="12" fill="#3f5b66" rx="1"/>
        <rect x="388" y="350" width="8" height="12" fill="#3f5b66" rx="1"/>
        <rect x="400" y="350" width="8" height="12" fill="#3f5b66" rx="1"/>
        <path d="M 397 295 L 380 310 L 415 310 Z" fill="#bb7261"/>

        <rect x="425" y="300" width="40" height="150" fill="#E8DDD1" rx="5"/>
        <rect x="433" y="315" width="8" height="12" fill="#3f5b66" rx="1"/>
        <rect x="447" y="315" width="8" height="12" fill="#3f5b66" rx="1"/>
        <rect x="433" y="340" width="8" height="12" fill="#3f5b66" rx="1"/>
        <rect x="447" y="340" width="8" height="12" fill="#3f5b66" rx="1"/>
        <path d="M 445 285 L 425 300 L 465 300 Z" fill="#bb7261"/>

        {/* Mountain behind */}
        <path d="M 200 200 Q 250 150 300 200 Q 350 150 400 250 L 400 450 L 200 450 Z" fill="#bb7261"/>
        <path d="M 250 180 Q 270 160 290 180 L 280 200 L 260 200 Z" fill="#EAEAEA"/>
      </g>

      {/* Trees */}
      <g>
        <ellipse cx="120" cy="430" rx="15" ry="20" fill="#2D5F3F"/>
        <rect x="115" y="430" width="10" height="20" fill="#8B7355"/>

        <ellipse cx="195" cy="410" rx="12" ry="18" fill="#2D5F3F"/>
        <rect x="191" y="410" width="8" height="18" fill="#8B7355"/>

        <ellipse cx="360" cy="425" rx="15" ry="20" fill="#2D5F3F"/>
        <rect x="355" y="425" width="10" height="20" fill="#8B7355"/>

        <ellipse cx="470" cy="415" rx="12" ry="18" fill="#2D5F3F"/>
        <rect x="466" y="415" width="8" height="18" fill="#8B7355"/>
      </g>

      {/* Small red trees */}
      <g>
        <path d="M 130 400 L 125 410 L 135 410 Z" fill="#bb7261"/>
        <rect x="128" y="410" width="4" height="10" fill="#8B7355"/>

        <path d="M 220 390 L 215 400 L 225 400 Z" fill="#bb7261"/>
        <rect x="218" y="400" width="4" height="10" fill="#8B7355"/>

        <path d="M 410 405 L 405 415 L 415 415 Z" fill="#bb7261"/>
        <rect x="408" y="415" width="4" height="10" fill="#8B7355"/>

        <path d="M 485 395 L 480 405 L 490 405 Z" fill="#bb7261"/>
        <rect x="483" y="405" width="4" height="10" fill="#8B7355"/>
      </g>

      {/* Birds */}
      <path d="M 200 230 Q 210 225 220 230" stroke="#E8DDD1" strokeWidth="2" fill="none"/>
      <path d="M 210 230 Q 220 225 230 230" stroke="#E8DDD1" strokeWidth="2" fill="none"/>

      <path d="M 320 200 Q 330 195 340 200" stroke="#E8DDD1" strokeWidth="2" fill="none"/>
      <path d="M 330 200 Q 340 195 350 200" stroke="#E8DDD1" strokeWidth="2" fill="none"/>

      <path d="M 440 220 Q 450 215 460 220" stroke="#E8DDD1" strokeWidth="2" fill="none"/>
      <path d="M 450 220 Q 460 215 470 220" stroke="#E8DDD1" strokeWidth="2" fill="none"/>

      {/* Clouds - animated */}
      <g className="cloud" style={{ animationDelay: '0s' }}>
        <ellipse cx="370" cy="130" rx="25" ry="15" fill="white"/>
        <ellipse cx="390" cy="135" rx="20" ry="12" fill="white"/>
        <ellipse cx="400" cy="130" rx="15" ry="10" fill="white"/>
      </g>

      <g className="cloud" style={{ animationDelay: '2s' }}>
        <ellipse cx="500" cy="170" rx="30" ry="18" fill="white"/>
        <ellipse cx="525" cy="175" rx="25" ry="15" fill="white"/>
        <ellipse cx="540" cy="170" rx="20" ry="12" fill="white"/>
      </g>

      <g className="cloud" style={{ animationDelay: '4s' }}>
        <ellipse cx="60" cy="250" rx="20" ry="12" fill="white"/>
        <ellipse cx="75" cy="255" rx="18" ry="10" fill="white"/>
        <ellipse cx="85" cy="250" rx="15" ry="10" fill="white"/>
      </g>

      {/* Animated Sun */}
      <g className="sun" style={{ transformOrigin: '240px 120px' }}>
        <g className="sun-rays" style={{ transformOrigin: '240px 120px' }}>
          <line x1="240" y1="70" x2="240" y2="50" stroke="#FDB42E" strokeWidth="4" strokeLinecap="round"/>
          <line x1="195" y1="85" x2="182" y2="72" stroke="#FDB42E" strokeWidth="4" strokeLinecap="round"/>
          <line x1="170" y1="120" x2="150" y2="120" stroke="#FDB42E" strokeWidth="4" strokeLinecap="round"/>
          <line x1="185" y1="155" x2="172" y2="168" stroke="#FDB42E" strokeWidth="4" strokeLinecap="round"/>
          <line x1="240" y1="170" x2="240" y2="190" stroke="#FDB42E" strokeWidth="4" strokeLinecap="round"/>
          <line x1="285" y1="155" x2="298" y2="168" stroke="#FDB42E" strokeWidth="4" strokeLinecap="round"/>
          <line x1="310" y1="120" x2="330" y2="120" stroke="#FDB42E" strokeWidth="4" strokeLinecap="round"/>
          <line x1="285" y1="85" x2="298" y2="72" stroke="#FDB42E" strokeWidth="4" strokeLinecap="round"/>
        </g>
        <circle cx="240" cy="120" r="40" fill="#FDB42E"/>
      </g>
    </svg>
  );
}
