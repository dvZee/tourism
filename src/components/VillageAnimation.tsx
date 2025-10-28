export default function VillageAnimation() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-bg-primary">
      <div className="w-full max-w-xl mx-auto px-4">
        <div className="bg-bg-primary p-4 rounded-lg">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-auto opacity-0 animate-fade-in-smooth bg-bg-primary"
            style={{ maxWidth: "650px", maxHeight: "650px" }}
            onLoadedData={(e) => {
              const video = e.target as HTMLVideoElement;
              video.style.opacity = "1";
            }}
            onCanPlay={(e) => {
              const video = e.target as HTMLVideoElement;
              video.style.opacity = "1";
            }}
          >
            <source src="/videos/village.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
