import { useEffect, useState } from "react";

export default function WelcomeTextAnimation() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Start text animation immediately when component mounts
    const timer = setTimeout(() => {
      setShowText(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full bg-bg-primary overflow-hidden">
      {/* Background video positioned behind text */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="bg-bg-primary p-6 rounded-lg">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-auto opacity-0 animate-fade-in-smooth"
            style={{
              maxWidth: "600px",
              maxHeight: "500px",
              marginTop: "-180px",
            }}
            onLoadedData={(e) => {
              const video = e.target as HTMLVideoElement;
              video.style.opacity = "0";
            }}
            onCanPlay={(e) => {
              const video = e.target as HTMLVideoElement;
              video.style.opacity = "0";
            }}
          >
            <source src="/videos/welcome.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Welcome text positioned over the video */}
      <div className="relative z-10 flex items-center justify-center w-full h-full px-4 mt-4">
        <div
          className={`text-center space-y-3 max-w-2xl transition-all duration-1000 ${
            showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ marginTop: "100px" }}
        >
          <h1
            className={`text-5xl sm:text-6xl md:text-7xl font-breton font-bold text-accent-primary mb-3 transition-all duration-1000 delay-300 drop-shadow-lg ${
              showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Benvenuto!
          </h1>

          <div
            className={`space-y-2 transition-all duration-1000 delay-600 ${
              showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-xl sm:text-2xl md:text-3xl font-breton text-white leading-relaxed drop-shadow-md">
              Sono la{" "}
              <span className="text-accent-primary font-semibold">
                guida turistica
              </span>
            </p>

            <p className="text-xl sm:text-2xl md:text-3xl font-breton text-white leading-relaxed drop-shadow-md">
              di questo <span className="font-bold">bellissimo borgo</span>
            </p>
          </div>

          <p
            className={`text-2xl sm:text-3xl md:text-4xl font-breton text-white mt-4 leading-relaxed font-medium transition-all duration-1000 delay-1000 drop-shadow-md ${
              showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Come posso aiutarti?
          </p>
        </div>
      </div>
    </div>
  );
}
