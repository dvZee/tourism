export default function VillageAnimation() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <svg viewBox="0 0 500 500" className="w-full h-auto" style={{ maxWidth: '350px', maxHeight: '350px' }}>
        <defs>
          <style>{`
            @keyframes sunMove {
              0%, 100% { transform: translate(0, 0); }
              50% { transform: translate(0, -8px); }
            }
            @keyframes sunRays {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes cloudFloat {
              0%, 100% { transform: translateX(0); }
              50% { transform: translateX(8px); }
            }
            @keyframes duckBob {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-3px); }
            }
            .sun-group { animation: sunMove 3s ease-in-out infinite; }
            .sun-rays { animation: sunRays 20s linear infinite; }
            .cloud { animation: cloudFloat 4s ease-in-out infinite; }
            .duck { animation: duckBob 2s ease-in-out infinite; }
          `}</style>
        </defs>

        {/* Animated Sun */}
        <g className="sun-group" style={{ transformOrigin: '200px 100px' }}>
          <g className="sun-rays" style={{ transformOrigin: '200px 100px' }}>
            <line x1="200" y1="50" x2="200" y2="30" stroke="#F5C544" strokeWidth="4" strokeLinecap="round"/>
            <line x1="160" y1="65" x2="150" y2="50" stroke="#F5C544" strokeWidth="4" strokeLinecap="round"/>
            <line x1="135" y1="100" x2="115" y2="100" stroke="#F5C544" strokeWidth="4" strokeLinecap="round"/>
            <line x1="150" y1="135" x2="135" y2="150" stroke="#F5C544" strokeWidth="4" strokeLinecap="round"/>
            <line x1="200" y1="150" x2="200" y2="170" stroke="#F5C544" strokeWidth="4" strokeLinecap="round"/>
            <line x1="240" y1="135" x2="255" y2="150" stroke="#F5C544" strokeWidth="4" strokeLinecap="round"/>
            <line x1="265" y1="100" x2="285" y2="100" stroke="#F5C544" strokeWidth="4" strokeLinecap="round"/>
            <line x1="240" y1="65" x2="250" y2="50" stroke="#F5C544" strokeWidth="4" strokeLinecap="round"/>
          </g>
          <circle cx="200" cy="100" r="35" fill="#F5C544"/>
        </g>

        {/* Animated Clouds */}
        <g className="cloud" style={{ animationDelay: '0s' }}>
          <ellipse cx="320" cy="110" rx="22" ry="14" fill="white"/>
          <ellipse cx="340" cy="115" rx="18" ry="12" fill="white"/>
          <ellipse cx="350" cy="110" rx="14" ry="10" fill="white"/>
        </g>

        <g className="cloud" style={{ animationDelay: '2s' }}>
          <ellipse cx="400" cy="155" rx="25" ry="15" fill="white"/>
          <ellipse cx="420" cy="160" rx="20" ry="13" fill="white"/>
          <ellipse cx="432" cy="155" rx="16" ry="11" fill="white"/>
        </g>

        <g className="cloud" style={{ animationDelay: '1s' }}>
          <ellipse cx="60" cy="180" rx="20" ry="12" fill="white"/>
          <ellipse cx="78" cy="184" rx="16" ry="10" fill="white"/>
          <ellipse cx="88" cy="180" rx="12" ry="8" fill="white"/>
        </g>

        {/* Island circle base - water */}
        <circle cx="250" cy="320" r="180" fill="#5DADA6"/>
        <ellipse cx="250" cy="320" rx="180" ry="40" fill="#4A9B95" opacity="0.4"/>

        {/* Animated Ducks in water */}
        <g className="duck" style={{ animationDelay: '0s' }}>
          <g transform="translate(200, 380)">
            <ellipse cx="0" cy="0" rx="10" ry="6" fill="white"/>
            <circle cx="-4" cy="-3" r="5" fill="white"/>
            <path d="M -7 -3 Q -10 -3 -10 0" stroke="#F5C544" strokeWidth="1.5" fill="none"/>
          </g>
        </g>

        <g className="duck" style={{ animationDelay: '0.5s' }}>
          <g transform="translate(290, 385)">
            <ellipse cx="0" cy="0" rx="10" ry="6" fill="white"/>
            <circle cx="-4" cy="-3" r="5" fill="white"/>
            <path d="M -7 -3 Q -10 -3 -10 0" stroke="#F5C544" strokeWidth="1.5" fill="none"/>
          </g>
        </g>

        {/* Baby ducks */}
        <g className="duck" style={{ animationDelay: '0.3s' }}>
          <ellipse cx="315" cy="390" rx="5" ry="3" fill="white"/>
          <circle cx="313" cy="388" r="3" fill="white"/>
        </g>
        <g className="duck" style={{ animationDelay: '0.6s' }}>
          <ellipse cx="330" cy="392" rx="5" ry="3" fill="white"/>
          <circle cx="328" cy="390" r="3" fill="white"/>
        </g>
        <g className="duck" style={{ animationDelay: '0.9s' }}>
          <ellipse cx="345" cy="394" rx="5" ry="3" fill="white"/>
          <circle cx="343" cy="392" r="3" fill="white"/>
        </g>

        {/* Background mountain */}
        <path d="M 140 220 Q 180 160 220 200 Q 240 170 260 200 Q 280 160 320 220 L 320 320 L 140 320 Z" fill="#B87B6E"/>
        <path d="M 220 180 Q 235 165 250 185 L 245 200 L 225 200 Z" fill="#E8DDD1"/>

        {/* Buildings */}
        {/* Left tower with arched windows */}
        <rect x="130" y="240" width="50" height="80" fill="#E8DDD1" rx="3"/>
        <path d="M 155 215 L 130 240 L 180 240 Z" fill="#B87B6E"/>
        <rect x="140" y="255" width="12" height="18" fill="#5A7C88" rx="6" ry="6"/>
        <rect x="158" y="255" width="12" height="18" fill="#5A7C88" rx="6" ry="6"/>
        <rect x="140" y="280" width="12" height="18" fill="#5A7C88" rx="6" ry="6"/>
        <rect x="158" y="280" width="12" height="18" fill="#5A7C88" rx="6" ry="6"/>

        {/* Center church with round window */}
        <rect x="195" y="250" width="45" height="70" fill="white" rx="3"/>
        <path d="M 217.5 230 L 195 250 L 240 250 Z" fill="#E8DDD1"/>
        <circle cx="217.5" cy="275" r="10" fill="#5A7C88"/>
        <rect x="210" y="290" width="15" height="30" fill="#8B7355"/>

        {/* Dark tall building */}
        <rect x="250" y="245" width="38" height="75" fill="#5A7C88" rx="3"/>
        <rect x="258" y="258" width="6" height="9" fill="#3f5b66" rx="1"/>
        <rect x="270" y="258" width="6" height="9" fill="#3f5b66" rx="1"/>
        <rect x="258" y="275" width="6" height="9" fill="#3f5b66" rx="1"/>
        <rect x="270" y="275" width="6" height="9" fill="#3f5b66" rx="1"/>
        <rect x="258" y="292" width="6" height="9" fill="#3f5b66" rx="1"/>
        <rect x="270" y="292" width="6" height="9" fill="#3f5b66" rx="1"/>

        {/* Dome building */}
        <rect x="295" y="260" width="35" height="60" fill="#E8DDD1" rx="3"/>
        <ellipse cx="312.5" cy="260" rx="20" ry="12" fill="#B87B6E"/>
        <rect x="303" y="272" width="7" height="10" fill="#5A7C88" rx="1"/>
        <rect x="315" y="272" width="7" height="10" fill="#5A7C88" rx="1"/>

        {/* Far right buildings */}
        <rect x="335" y="265" width="28" height="55" fill="white" rx="3"/>
        <path d="M 349 250 L 335 265 L 363 265 Z" fill="#B87B6E"/>
        <rect x="342" y="275" width="6" height="9" fill="#5A7C88" rx="1"/>
        <rect x="352" y="275" width="6" height="9" fill="#5A7C88" rx="1"/>

        <rect x="365" y="258" width="32" height="62" fill="white" rx="3"/>
        <path d="M 381 243 L 365 258 L 397 258 Z" fill="#B87B6E"/>
        <rect x="372" y="268" width="6" height="9" fill="#5A7C88" rx="1"/>
        <rect x="384" y="268" width="6" height="9" fill="#5A7C88" rx="1"/>

        {/* Trees - green */}
        <ellipse cx="110" cy="300" rx="12" ry="16" fill="#2D5F3F"/>
        <rect x="106" y="300" width="8" height="20" fill="#8B7355"/>

        <ellipse cx="185" cy="290" rx="10" ry="14" fill="#2D5F3F"/>
        <rect x="182" y="290" width="6" height="16" fill="#8B7355"/>

        <ellipse cx="330" cy="295" rx="12" ry="16" fill="#2D5F3F"/>
        <rect x="326" y="295" width="8" height="20" fill="#8B7355"/>

        <ellipse cx="410" cy="288" rx="10" ry="14" fill="#2D5F3F"/>
        <rect x="407" y="288" width="6" height="16" fill="#8B7355"/>

        {/* Red/terracotta trees */}
        <path d="M 120 285 L 115 295 L 125 295 Z" fill="#B87B6E"/>
        <rect x="118" y="295" width="4" height="8" fill="#8B7355"/>

        <path d="M 240 268 L 235 278 L 245 278 Z" fill="#B87B6E"/>
        <rect x="238" y="278" width="4" height="8" fill="#8B7355"/>

        <path d="M 360 280 L 355 290 L 365 290 Z" fill="#B87B6E"/>
        <rect x="358" y="290" width="4" height="8" fill="#8B7355"/>

        <path d="M 425 275 L 420 285 L 430 285 Z" fill="#B87B6E"/>
        <rect x="423" y="285" width="4" height="8" fill="#8B7355"/>

        {/* Birds */}
        <path d="M 170 210 Q 177 207 184 210" stroke="#E8DDD1" strokeWidth="1.5" fill="none"/>
        <path d="M 177 210 Q 184 207 191 210" stroke="#E8DDD1" strokeWidth="1.5" fill="none"/>

        <path d="M 300 190 Q 307 187 314 190" stroke="#E8DDD1" strokeWidth="1.5" fill="none"/>
        <path d="M 307 190 Q 314 187 321 190" stroke="#E8DDD1" strokeWidth="1.5" fill="none"/>

        <path d="M 380 200 Q 387 197 394 200" stroke="#E8DDD1" strokeWidth="1.5" fill="none"/>
        <path d="M 387 200 Q 394 197 401 200" stroke="#E8DDD1" strokeWidth="1.5" fill="none"/>
      </svg>
    </div>
  );
}
