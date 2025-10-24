export default function VillageAnimation() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-full max-w-md mx-auto px-4">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto"
          style={{ maxWidth: '500px', maxHeight: '500px' }}
        >
          <source src="/videos/village.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
