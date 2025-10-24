export default function WelcomeTextAnimation() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 space-y-8">
      {/* Sky scene with sun and clouds - no background */}
      <svg viewBox="0 0 400 200" className="w-full h-auto" style={{ maxWidth: '320px', maxHeight: '160px' }}>
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
            .sun-group { animation: sunMove 3s ease-in-out infinite; }
            .sun-rays { animation: sunRays 20s linear infinite; }
            .cloud { animation: cloudFloat 4s ease-in-out infinite; }
          `}</style>
        </defs>

        {/* Animated Clouds */}
        <g className="cloud" style={{ animationDelay: '0s' }}>
          <ellipse cx="250" cy="80" rx="24" ry="14" fill="white"/>
          <ellipse cx="270" cy="84" rx="20" ry="12" fill="white"/>
          <ellipse cx="284" cy="80" rx="16" ry="10" fill="white"/>
        </g>

        <g className="cloud" style={{ animationDelay: '2.5s' }}>
          <ellipse cx="50" cy="140" rx="28" ry="16" fill="white"/>
          <ellipse cx="72" cy="144" rx="24" ry="14" fill="white"/>
          <ellipse cx="90" cy="140" rx="18" ry="12" fill="white"/>
        </g>

        <g className="cloud" style={{ animationDelay: '1.2s' }}>
          <ellipse cx="320" cy="110" rx="30" ry="18" fill="white"/>
          <ellipse cx="345" cy="114" rx="26" ry="16" fill="white"/>
          <ellipse cx="364" cy="110" rx="20" ry="13" fill="white"/>
        </g>

        {/* Animated Sun */}
        <g className="sun-group" style={{ transformOrigin: '120px 80px' }}>
          <g className="sun-rays" style={{ transformOrigin: '120px 80px' }}>
            <line x1="120" y1="38" x2="120" y2="20" stroke="#F5C544" strokeWidth="4" strokeLinecap="round"/>
            <line x1="85" y1="52" x2="73" y2="40" stroke="#F5C544" strokeWidth="4" strokeLinecap="round"/>
            <line x1="65" y1="80" x2="47" y2="80" stroke="#F5C544" strokeWidth="4" strokeLinecap="round"/>
            <line x1="73" y1="108" x2="61" y2="120" stroke="#F5C544" strokeWidth="4" strokeLinecap="round"/>
            <line x1="120" y1="122" x2="120" y2="140" stroke="#F5C544" strokeWidth="4" strokeLinecap="round"/>
            <line x1="155" y1="108" x2="167" y2="120" stroke="#F5C544" strokeWidth="4" strokeLinecap="round"/>
            <line x1="175" y1="80" x2="193" y2="80" stroke="#F5C544" strokeWidth="4" strokeLinecap="round"/>
            <line x1="155" y1="52" x2="167" y2="40" stroke="#F5C544" strokeWidth="4" strokeLinecap="round"/>
          </g>
          <circle cx="120" cy="80" r="36" fill="#F5C544"/>
        </g>
      </svg>

      {/* Welcome text - beautifully arranged */}
      <div className="text-center space-y-4 max-w-2xl animate-fade-in">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-breton font-bold text-accent-primary mb-4">
          Benvenuto!
        </h1>

        <div className="space-y-2">
          <p className="text-xl sm:text-2xl md:text-3xl font-breton text-white leading-relaxed">
            Sono la <span className="text-accent-primary font-semibold">guida turistica</span>
          </p>

          <p className="text-xl sm:text-2xl md:text-3xl font-breton text-white leading-relaxed">
            di questo <span className="font-bold">bellissimo borgo</span>
          </p>
        </div>

        <p className="text-2xl sm:text-3xl md:text-4xl font-breton text-white mt-6 leading-relaxed font-medium">
          Come posso aiutarti?
        </p>
      </div>
    </div>
  );
}
