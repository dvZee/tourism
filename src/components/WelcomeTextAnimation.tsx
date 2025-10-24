export default function WelcomeTextAnimation() {
  return (
    <div className="flex items-center justify-center w-full h-full py-8">
      <div className="w-full max-w-3xl mx-auto px-4">
        <svg viewBox="0 0 600 300" className="w-full h-auto mb-8" style={{ maxWidth: '500px', maxHeight: '250px', margin: '0 auto' }}>
          <defs>
            <style>{`
              @keyframes sunMove {
                0%, 100% { transform: translate(0, 0); }
                50% { transform: translate(0, -10px); }
              }
              @keyframes sunRays {
                0%, 100% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes cloudFloat {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(10px); }
              }
              .sun-group { animation: sunMove 3s ease-in-out infinite; }
              .sun-rays { animation: sunRays 20s linear infinite; }
              .cloud { animation: cloudFloat 5s ease-in-out infinite; }
            `}</style>
          </defs>

          {/* Sky background */}
          <rect width="600" height="300" fill="#5A7C88"/>

          {/* Clouds */}
          <g className="cloud" style={{ animationDelay: '0s' }}>
            <ellipse cx="300" cy="100" rx="28" ry="16" fill="white"/>
            <ellipse cx="325" cy="105" rx="24" ry="14" fill="white"/>
            <ellipse cx="342" cy="100" rx="18" ry="12" fill="white"/>
          </g>

          <g className="cloud" style={{ animationDelay: '3s' }}>
            <ellipse cx="70" cy="170" rx="32" ry="18" fill="white"/>
            <ellipse cx="98" cy="175" rx="28" ry="16" fill="white"/>
            <ellipse cx="118" cy="170" rx="22" ry="14" fill="white"/>
          </g>

          <g className="cloud" style={{ animationDelay: '1.5s' }}>
            <ellipse cx="480" cy="130" rx="35" ry="20" fill="white"/>
            <ellipse cx="510" cy="135" rx="30" ry="18" fill="white"/>
            <ellipse cx="532" cy="130" rx="24" ry="15" fill="white"/>
          </g>

          {/* Animated Sun */}
          <g className="sun-group" style={{ transformOrigin: '150px 100px' }}>
            <g className="sun-rays" style={{ transformOrigin: '150px 100px' }}>
              <line x1="150" y1="50" x2="150" y2="28" stroke="#F5C544" strokeWidth="5" strokeLinecap="round"/>
              <line x1="108" y1="66" x2="92" y2="50" stroke="#F5C544" strokeWidth="5" strokeLinecap="round"/>
              <line x1="85" y1="100" x2="63" y2="100" stroke="#F5C544" strokeWidth="5" strokeLinecap="round"/>
              <line x1="92" y1="134" x2="76" y2="150" stroke="#F5C544" strokeWidth="5" strokeLinecap="round"/>
              <line x1="150" y1="150" x2="150" y2="172" stroke="#F5C544" strokeWidth="5" strokeLinecap="round"/>
              <line x1="192" y1="134" x2="208" y2="150" stroke="#F5C544" strokeWidth="5" strokeLinecap="round"/>
              <line x1="215" y1="100" x2="237" y2="100" stroke="#F5C544" strokeWidth="5" strokeLinecap="round"/>
              <line x1="192" y1="66" x2="208" y2="50" stroke="#F5C544" strokeWidth="5" strokeLinecap="round"/>
            </g>
            <circle cx="150" cy="100" r="42" fill="#F5C544"/>
          </g>
        </svg>

        <div className="text-center space-y-3 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-breton font-bold text-accent-primary mb-6">
            Benvenuto!
          </h1>

          <p className="text-2xl md:text-4xl font-breton text-white leading-relaxed">
            Sono la <span className="text-accent-primary font-semibold">guida turistica</span>
          </p>

          <p className="text-2xl md:text-4xl font-breton text-white leading-relaxed">
            di questo <span className="font-bold">bellissimo borgo</span>
          </p>

          <p className="text-3xl md:text-5xl font-breton text-white mt-6 leading-relaxed">
            Come posso aiutarti?
          </p>
        </div>
      </div>
    </div>
  );
}
