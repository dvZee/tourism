export default function WelcomeTextAnimation() {
  return (
    <svg viewBox="0 0 600 700" className="w-full h-auto max-w-3xl mx-auto">
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
          .sun { animation: sunMove 4s ease-in-out infinite; }
          .sun-rays { animation: sunRays 8s ease-in-out infinite; transform-origin: center; }
          .cloud { animation: cloudFloat 6s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* Clouds - animated */}
      <g className="cloud" style={{ animationDelay: '0s' }}>
        <ellipse cx="320" cy="140" rx="30" ry="18" fill="white"/>
        <ellipse cx="345" cy="145" rx="25" ry="15" fill="white"/>
        <ellipse cx="360" cy="140" rx="20" ry="12" fill="white"/>
      </g>

      <g className="cloud" style={{ animationDelay: '3s' }}>
        <ellipse cx="70" cy="250" rx="35" ry="20" fill="white"/>
        <ellipse cx="100" cy="255" rx="30" ry="18" fill="white"/>
        <ellipse cx="120" cy="250" rx="25" ry="15" fill="white"/>
      </g>

      <g className="cloud" style={{ animationDelay: '1.5s' }}>
        <ellipse cx="480" cy="200" rx="40" ry="22" fill="white"/>
        <ellipse cx="515" cy="205" rx="35" ry="20" fill="white"/>
        <ellipse cx="540" cy="200" rx="30" ry="18" fill="white"/>
      </g>

      {/* Animated Sun */}
      <g className="sun" style={{ transformOrigin: '180px 130px' }}>
        <g className="sun-rays" style={{ transformOrigin: '180px 130px' }}>
          <line x1="180" y1="70" x2="180" y2="45" stroke="#FDB42E" strokeWidth="5" strokeLinecap="round"/>
          <line x1="125" y1="88" x2="107" y2="70" stroke="#FDB42E" strokeWidth="5" strokeLinecap="round"/>
          <line x1="95" y1="130" x2="70" y2="130" stroke="#FDB42E" strokeWidth="5" strokeLinecap="round"/>
          <line x1="107" y1="172" x2="89" y2="190" stroke="#FDB42E" strokeWidth="5" strokeLinecap="round"/>
          <line x1="180" y1="190" x2="180" y2="215" stroke="#FDB42E" strokeWidth="5" strokeLinecap="round"/>
          <line x1="235" y1="172" x2="253" y2="190" stroke="#FDB42E" strokeWidth="5" strokeLinecap="round"/>
          <line x1="265" y1="130" x2="290" y2="130" stroke="#FDB42E" strokeWidth="5" strokeLinecap="round"/>
          <line x1="235" y1="88" x2="253" y2="70" stroke="#FDB42E" strokeWidth="5" strokeLinecap="round"/>
        </g>
        <circle cx="180" cy="130" r="50" fill="#FDB42E"/>
      </g>

      {/* Welcome text */}
      <text x="300" y="380" fontFamily="Breton, serif" fontSize="72" fontWeight="bold" fill="#bb7261" textAnchor="middle">
        Benvenuto!
      </text>

      <text x="300" y="470" fontFamily="Breton, serif" fontSize="42" fill="white" textAnchor="middle">
        <tspan x="300" dy="0">Sono la </tspan>
        <tspan fill="#bb7261" fontWeight="600">guida turistica</tspan>
      </text>

      <text x="300" y="540" fontFamily="Breton, serif" fontSize="42" fill="white" textAnchor="middle">
        <tspan x="300" dy="0">di questo </tspan>
        <tspan fontWeight="700">bellissimo borgo</tspan>
      </text>

      <text x="300" y="630" fontFamily="Breton, serif" fontSize="48" fill="white" textAnchor="middle">
        Come posso aiutarti?
      </text>
    </svg>
  );
}
