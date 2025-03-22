'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Dog } from '@/lib/actions/dogs';
import { Location } from '@/models/location';
import { LINKEDIN_URL, GITHUB_URL } from '@/data/links';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { clientLogout } from '@/lib/client/auth';
import Image from 'next/image';

interface MatchAnimationProps {
  matchedDog: Dog;
  location: Location;
}

// Move phaseMessages outside the component
const phaseMessages = {
    phase1: [
        "You looked long and hard, far and wide...",
        "Searching through countless wagging tails...",
        "Sniffing out the perfect companion...",
        "Pawing through endless possibilities...",
    ],
    phase2: [
        "We are finding the perfect match for you...",
        "Our tails are wagging with excitement...",
        "Getting closer to your furry soulmate...",
        "The stars are aligning for this match...",
    ],
    phase3: [
        "I think this one is choosing YOU!",
        "Look who's ready to meet you!",
        "This pup can't wait to say hello!",
        "A perfect match is about to happen!",
        "Someone special has picked you!"
    ]
} as const;

export function MatchAnimation({ matchedDog, location }: MatchAnimationProps) {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<string[]>(['', '', '']); // Initialize with empty strings
  const router = useRouter();

  const getRandomMessage = useCallback((phase: number) => {
    const messages = phase === 0 ? phaseMessages.phase1 : 
                    phase === 1 ? phaseMessages.phase2 : 
                    phaseMessages.phase3;
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }, []);

  useEffect(() => {
    // Generate messages on the client side only
    setMessages([
      getRandomMessage(0),
      getRandomMessage(1),
      getRandomMessage(2)
    ]);
  }, [matchedDog.id, getRandomMessage]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  useEffect(() => {
    const timeouts = [
      setTimeout(() => setStep(1), 2000),
      setTimeout(() => setStep(2), 5000),
      setTimeout(() => setStep(3), 8000),
      setTimeout(() => setStep(4), 9000)
    ];

    setStep(0);
    return () => timeouts.forEach(clearTimeout);
  }, [matchedDog.id, getRandomMessage]);

  if (step < 4) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-base-100 p-4">
        <div className="text-center space-y-4 h-[120px]">
          <motion.div 
            className="text-4xl mb-8 h-12 relative w-full"
          >
            <motion.span
              className="absolute transform -translate-x-1/2 inline-block"
              initial={{ 
                x: step === 0 ? "-150%" : step === 1 ? "120%" : "-150%",
                scaleX: step === 0 ? -1 : step === 1 ? 1 : -1
              }}
              animate={{ 
                x: step === 0 ? "120%" : 
                   step === 1 ? "-150%" : 
                   step === 2 ? "120%" :
                   "120%",
                y: [0, -8, 0],
                scaleX: step === 0 ? -1 : 
                        step === 1 ? 1 : 
                        -1
              }}
              transition={{
                x: { duration: 2, ease: "easeInOut", delay: 0.25 },
                y: { duration: 0.5, repeat: Infinity, repeatType: "reverse" },
                scaleX: { duration: 0.3, delay: 0.25 }
              }}
            >
              🐕
            </motion.span>
          </motion.div>

          <AnimatePresence mode="wait">
            {step < 3 && (  // Only show text for steps 0-2
              <motion.div 
                key={step}
                className="text-2xl font-medium text-base-content overflow-hidden min-h-[48px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  y: step === 2 ? 50 : 0,  // Only move down when exiting phase 3
                  transition: {
                    duration: 1,
                    ease: "easeInOut"
                  }
                }}
                transition={{
                  opacity: { duration: 1 }
                }}
              >
                {messages[step].split('').map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.035,  // Was 0.05
                      delay: index * 0.035,  // Was 0.05
                      ease: "easeOut"
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex flex-col items-center justify-center bg-base-100 p-4"
    >
      <motion.div 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="aspect-square w-full relative rounded-xl overflow-hidden shadow-xl"
        >
          <Image 
            src={matchedDog.img} 
            alt={matchedDog.name}
            width={500}
            height={500}
            className="object-cover w-full h-full"
            priority
          />
        </motion.div>
        
        <div className="text-center space-y-4">
          <motion.h1 
            className="text-5xl font-bold text-base-content font-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {["Meet", " ", matchedDog.name, "!"].map((part, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: index === 0 ? 1.5 : 1 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1
                }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.3
                }}
                className={index === 0 ? "text-primary" : ""}
              >
                {part}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.p 
            className="text-xl text-base-content/80 font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            {`${matchedDog.breed} • ${matchedDog.age} years old`}
          </motion.p>
          
          <motion.div 
            className="text-lg text-base-content/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            <p>{location.city}, {location.state}</p>
            <p className="text-sm">{location.county} County</p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-6 items-center pt-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              triggerConfetti();
              setTimeout(() => {
                const modal = document.getElementById('contact_modal') as HTMLDialogElement;
                if (modal) modal.showModal();
              }, 500);
            }}
            className="btn btn-primary btn-lg gap-2 w-full text-lg font-bold relative"
          >
            {matchedDog.name}, I choose you too! 
            <motion.span 
              className="text-3xl"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
                filter: [
                  'brightness(1)',
                  'brightness(1.5)',
                  'brightness(1)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              ✨
            </motion.span>
          </motion.button>
          
          <div className="flex gap-4">
            <Link 
              href="/app"
              className="btn btn-outline text-base-content border-base-content"
            >
              Back to Search
            </Link>
            <button 
              onClick={async () => {
                const stored = localStorage.getItem('dog-favorites');
                if (stored) {
                  const favoriteIds = JSON.parse(stored);
                  try {
                    const response = await fetch('/api/matchmake', {
                      method: 'POST',
                      body: JSON.stringify({ favorites: favoriteIds }),
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      redirect: 'follow', // Ensure we follow redirects
                    });
                    
                    // The browser will automatically follow the redirect
                    window.location.href = response.url;
                  } catch (error) {
                    console.error('Error generating match:', error);
                    router.push('/app');
                  }
                } else {
                  router.push('/app');
                }
              }}
              className="btn btn-primary"
            >
              Try Another Match
            </button>
          </div>
        </motion.div>
      </motion.div>

      <dialog id="contact_modal" className="modal">
        <div className="modal-box text-base-content">
          <h3 className="font-bold text-lg mb-4">👋 Hi there!</h3>
          <p className="py-2">
            I&apos;m glad you enjoyed this sample project! I built it to showcase modern Next.js and React patterns, as well as user experience design.
          </p>
          <p className="py-2">
            If you&apos;d like to connect or discuss opportunities, you can find me here:
          </p>
          <div className="flex flex-col gap-2 my-4">
            <a 
              href={LINKEDIN_URL}
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary gap-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Connect on LinkedIn
            </a>
            <a 
              href={GITHUB_URL}
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline text-base-content gap-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Check out my GitHub
            </a>
          </div>
          <div className="modal-action flex justify-between items-center">
            <form action={async () => {
              try {
                const result = await clientLogout();
                if (result.success) {
                  router.push('/');
                }
              } catch (error) {
                console.error('Logout failed:', error);
              }
            }}>
              <button 
                type="submit"
                className="btn btn-error btn-outline"
              >
                Sign Out & Start Over
              </button>
            </form>
            <form method="dialog">
              <button className="btn text-base-content">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </motion.div>
  );
} 