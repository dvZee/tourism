export default function CiaoAnimation() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="text-center animate-fade-in">
        <h1 className="text-8xl md:text-9xl font-breton font-bold text-accent-primary animate-scale-in">
          CIAO
        </h1>
      </div>
      <style>{`
        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
