export default function WelcomeTextAnimation() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 space-y-8">
      {/* Video with sun and clouds */}
      <div className="w-full max-w-lg mx-auto">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto"
          style={{ maxWidth: '500px', maxHeight: '300px' }}
        >
          <source src="/videos/welcome.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

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
