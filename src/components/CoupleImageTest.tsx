import Image from 'next/image';

export function CoupleImageTest() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-center">Romantic Couple Images Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test all romantic couple images */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Romantic Couple 1</h3>
          <Image
            src="/images/couples/romantic-couple-1.svg"
            alt="Romantic couple connecting"
            width={300}
            height={200}
            className="mx-auto border rounded-lg"
          />
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Romantic Couple 2</h3>
          <Image
            src="/images/couples/romantic-couple-2.svg"
            alt="Intimate embrace"
            width={300}
            height={200}
            className="mx-auto border rounded-lg"
          />
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Romantic Couple 3</h3>
          <Image
            src="/images/couples/romantic-couple-3.svg"
            alt="Dancing couple"
            width={300}
            height={200}
            className="mx-auto border rounded-lg"
          />
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Couple Silhouette</h3>
          <Image
            src="/images/couples/couple-silhouette.svg"
            alt="Couple silhouette"
            width={120}
            height={80}
            className="mx-auto border rounded-lg"
          />
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Meditation Couple</h3>
          <Image
            src="/images/couples/couple-meditation.svg"
            alt="Couple meditating"
            width={280}
            height={180}
            className="mx-auto border rounded-lg"
          />
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Voice Communication</h3>
          <Image
            src="/images/couples/couple-voice-communication.svg"
            alt="Couple communicating"
            width={240}
            height={160}
            className="mx-auto border rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}