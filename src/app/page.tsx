import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-base-100">
      <div className="max-w-2xl space-y-8">
        <h1 className="text-6xl font-bold text-base-content mb-4 font-title">
          <em>Fetch</em>tasticMatch
        </h1>
        
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-medium animate-pulse text-base-content font-title">
              Finding your furry soulmate
            </span>
            <span className="animate-bounce delay-100 text-3xl">🐕</span>
          </div>
        </div>

        <p className="text-xl text-base-content/80 mb-8 text-justify">
          Every dog deserves a loving home, and every home deserves the perfect dog. 
          Let's help you find your ideal companion among thousands of adorable pups 
          waiting to meet you.
        </p>

        <div className="flex flex-col items-center space-y-4">
          <Link 
            href="/login" 
            className="btn btn-primary btn-lg text-lg font-medium gap-2 min-w-64 shadow-lg"
          >
            Start Your Journey
            <span className="text-2xl" aria-hidden="true">✨</span>
          </Link>
          
          <p className="text-base-content text-sm italic animate-pulse">
            Your new best friend is just a few clicks away...
          </p>
        </div>
      </div>

      <div className="mt-12 text-base-content text-sm">
        Powered by modern tech, driven by love for dogs 🐾
      </div>
    </div>
  );
}
