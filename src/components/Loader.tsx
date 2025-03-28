
import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { Star, Shield, Sword } from 'lucide-react';

interface LoaderProps {
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create loading simulation
    const duration = 3000; // 3 seconds total
    const interval = 30; // Update every 30ms
    const steps = duration / interval;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      // Ease-out effect for progress
      const newProgress = Math.min(100, Math.floor((currentStep / steps) * 100));
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(timer);
        
        // Play completion animation before calling onComplete
        setIsComplete(true);
        
        // After animations complete, notify parent
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1200);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [onComplete]);
  
  // Initialize animations
  useEffect(() => {
    if (containerRef.current && progressBarRef.current && progressTextRef.current && logoRef.current) {
      // Initial entrance animation for the container
      gsap.from(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
      
      // Logo animation
      gsap.from(logoRef.current, {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        delay: 0.2
      });
      
      // Create floating particles
      createParticles();
    }
  }, []);
  
  // Update progress bar animation
  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${progress}%`,
        duration: 0.3,
        ease: "power1.out"
      });
    }
    
    if (progressTextRef.current) {
      gsap.to(progressTextRef.current, {
        textContent: `${progress}%`,
        duration: 0.3,
        ease: "power1.out",
        snap: { textContent: 1 },
        stagger: 0.02
      });
    }
  }, [progress]);
  
  // Create interactive particles
  const createParticles = () => {
    if (!containerRef.current) return;
    
    // Add larger shapes in the background
    for (let i = 0; i < 8; i++) {
      const shape = document.createElement('div');
      const size = Math.random() * 100 + 50;
      
      shape.className = 'absolute rounded-full blur-xl opacity-5 z-0';
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
      shape.style.backgroundColor = i % 3 === 0 ? '#8B5CF6' : 
                                  i % 3 === 1 ? '#D946EF' : 
                                  '#F97316';
      
      // Position shapes around the center
      const angle = Math.random() * Math.PI * 2;
      const radius = 100 + Math.random() * 150;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      shape.style.left = `calc(50% + ${x}px)`;
      shape.style.top = `calc(50% + ${y}px)`;
      
      containerRef.current.appendChild(shape);
      
      // Animate the shapes
      gsap.to(shape, {
        x: Math.random() * 50 - 25,
        y: Math.random() * 50 - 25,
        scale: 0.8 + Math.random() * 0.5,
        opacity: 0.03 + Math.random() * 0.05,
        duration: 5 + Math.random() * 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
    
    // Add small particles in the foreground
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 6 + 2;
      
      particle.className = 'absolute rounded-full z-10';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = i % 4 === 0 ? '#8B5CF6' : 
                                     i % 4 === 1 ? '#D946EF' : 
                                     i % 4 === 2 ? '#F97316' :
                                     '#22c55e';
      particle.style.boxShadow = `0 0 ${size/2}px ${i % 4 === 0 ? '#8B5CF6' : 
                               i % 4 === 1 ? '#D946EF' : 
                               i % 4 === 2 ? '#F97316' :
                               '#22c55e'}`;
      
      // Position randomly
      const angle = Math.random() * Math.PI * 2;
      const radius = 150 + Math.random() * 100;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      particle.style.left = `calc(50% + ${x}px)`;
      particle.style.top = `calc(50% + ${y}px)`;
      
      containerRef.current.appendChild(particle);
      
      // Animate the particle
      gsap.to(particle, {
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        opacity: Math.random() * 0.7 + 0.3,
        duration: 2 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  };
  
  // Play completion animation
  useEffect(() => {
    if (isComplete && containerRef.current) {
      // Create final burst effect
      const burstContainer = document.createElement('div');
      burstContainer.className = 'absolute inset-0 flex items-center justify-center pointer-events-none';
      containerRef.current.appendChild(burstContainer);
      
      // Create burst particles
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 10 + 4;
        
        particle.className = 'absolute rounded-full';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = i % 5 === 0 ? '#8B5CF6' : 
                                       i % 5 === 1 ? '#D946EF' : 
                                       i % 5 === 2 ? '#F97316' :
                                       i % 5 === 3 ? '#22c55e' :
                                       '#60a5fa';
        particle.style.boxShadow = `0 0 ${size}px ${particle.style.backgroundColor}`;
        
        burstContainer.appendChild(particle);
        
        // Calculate random direction
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 300;
        const destX = Math.cos(angle) * distance;
        const destY = Math.sin(angle) * distance;
        
        // Animate particle outward
        gsap.fromTo(particle,
          { x: 0, y: 0, scale: 0.2, opacity: 1 },
          { 
            x: destX, 
            y: destY, 
            scale: 1 + Math.random(),
            opacity: 0,
            duration: 0.8 + Math.random() * 0.5,
            ease: "power2.out"
          }
        );
      }
      
      // Flash effect
      const flash = document.createElement('div');
      flash.className = 'absolute inset-0 bg-white rounded-full opacity-0';
      burstContainer.appendChild(flash);
      
      gsap.to(flash, {
        opacity: 0.8,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        onComplete: () => {
          if (flash.parentNode) {
            flash.parentNode.removeChild(flash);
          }
        }
      });
      
      // Fade out the container
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.1,
        duration: 0.8,
        delay: 0.4,
        ease: "power2.inOut"
      });
    }
  }, [isComplete]);
  
  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-game-background to-black z-50 overflow-hidden"
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-5 pointer-events-none"></div>
      
      {/* Logo and main content */}
      <div 
        ref={logoRef}
        className="relative flex flex-col items-center justify-center mb-8"
      >
        {/* Outer glow ring */}
        <div className="absolute w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-r from-game-primary via-game-secondary to-game-accent opacity-20 blur-xl"></div>
        
        {/* Main hexagon container */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
          {/* Rotating border */}
          <div className="absolute inset-0 rounded-xl border-2 border-dashed border-game-primary opacity-60 animate-rotate-slow"></div>
          
          {/* Glowing background */}
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-game-primary/20 via-transparent to-game-accent/20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0%,transparent_70%)]"></div>
          </div>
          
          {/* Logo content */}
          <div className="relative z-10 flex flex-col items-center justify-center p-4">
            <div className="text-2xl md:text-3xl font-pixel font-bold text-white mb-1">
              <span className="text-game-primary">Math</span>
              <span className="text-game-secondary">Battle</span>
            </div>
            
            {/* Animated icons */}
            <div className="flex items-center justify-center gap-3 mt-2">
              <Sword className="text-game-primary w-5 h-5 md:w-6 md:h-6 animate-pulse" />
              <Shield className="text-game-secondary w-5 h-5 md:w-6 md:h-6 animate-pulse" style={{ animationDelay: '0.3s' }} />
              <Star className="text-game-accent w-5 h-5 md:w-6 md:h-6 animate-pulse" style={{ animationDelay: '0.6s' }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="relative z-10 w-64 md:w-80 flex flex-col items-center">
        {/* Progress text */}
        <div 
          ref={progressTextRef}
          className="text-3xl md:text-4xl font-pixel font-bold text-game-primary mb-2"
        >
          0%
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-white/10">
          <div 
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-game-primary via-game-secondary to-game-accent"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Bottom decoration */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="relative h-px w-40 md:w-60">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-game-primary/50 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
