
import { gsap } from 'gsap';

// Attack animation with Final Fantasy style
export const playAttackAnimation = (
  attackerElement: HTMLElement | null,
  targetElement: HTMLElement | null,
  callback?: () => void
) => {
  if (!attackerElement || !targetElement) return;
  
  // Create a timeline
  const tl = gsap.timeline({ 
    onComplete: () => {
      if (callback) callback();
    }
  });
  
  // Attack sequence with temporary flash effect
  tl.to(attackerElement, {
    x: 30,
    duration: 0.15,
    ease: 'power1.out'
  })
  .to(targetElement, {
    backgroundColor: 'rgba(255, 255, 255, 0)', // No permanent background change
    duration: 0.1,
    ease: 'power1.in',
    onStart: () => {
      // Create flash effect that's temporary
      const flash = document.createElement('div');
      flash.className = 'absolute inset-0 bg-white z-10 opacity-0';
      targetElement.appendChild(flash);
      
      gsap.to(flash, {
        opacity: 0.7, // Slightly less intense flash
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          if (flash.parentNode) flash.parentNode.removeChild(flash);
        }
      });
    }
  })
  .to(attackerElement, {
    x: 0,
    duration: 0.15,
    ease: 'power1.in'
  })
  .to(targetElement, {
    x: -10,
    duration: 0.07,
    ease: 'power1.out'
  })
  .to(targetElement, {
    x: 10,
    duration: 0.07,
    ease: 'power1.out'
  })
  .to(targetElement, {
    x: -5,
    duration: 0.07,
    ease: 'power1.out'
  })
  .to(targetElement, {
    x: 0,
    duration: 0.07,
    ease: 'power1.out'
  });
};

// Enhanced damage number animation with FF-style
export const showDamageNumber = (
  element: HTMLElement | null,
  damage: number,
  isHealing = false
) => {
  if (!element) return;
  
  // Create multiple damage numbers for epic effect
  for (let i = 0; i < 3; i++) {
    const damageEl = document.createElement('div');
    damageEl.className = `absolute font-pixel text-3xl font-bold ${isHealing ? 'text-game-success' : 'text-game-damage'}`;
    damageEl.style.textShadow = '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000';
    damageEl.style.zIndex = '50';
    
    // Show the actual damage on the middle number
    damageEl.textContent = i === 1 ? (isHealing ? `+${damage}` : `-${damage}`) : '';
    
    element.appendChild(damageEl);
    
    // Position the damage numbers randomly around the character
    const xOffset = Math.random() * 60 - 30;
    const yOffset = Math.random() * 20;
    damageEl.style.top = `${20 - yOffset}px`;
    damageEl.style.left = `calc(50% + ${xOffset}px)`;
    
    // Animate each damage number differently
    gsap.to(damageEl, {
      y: -80 - (i * 15),
      x: xOffset * (i === 1 ? -1 : 1),
      opacity: 0,
      scale: i === 1 ? 1.5 : 0.8,
      duration: 1.2,
      ease: 'power1.out',
      delay: i * 0.1,
      onComplete: () => {
        if (damageEl.parentNode) {
          damageEl.parentNode.removeChild(damageEl);
        }
      }
    });
  }
};

// Enhanced health bar animation with FF-style
export const animateHealthBar = (
  element: HTMLElement | null,
  newPercentage: number
) => {
  if (!element) return;
  
  // Create a flash overlay
  const parent = element.parentElement;
  if (parent) {
    const flash = document.createElement('div');
    flash.className = 'absolute inset-0 bg-white z-10 opacity-0';
    parent.appendChild(flash);
    
    gsap.to(flash, {
      opacity: 0.6,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        if (flash.parentNode) flash.parentNode.removeChild(flash);
      }
    });
  }
  
  gsap.to(element, {
    width: `${newPercentage}%`,
    duration: 0.5,
    ease: 'power2.out'
  });
};

// Enhanced victory animation with FF fanfare style
export const playVictoryAnimation = (
  element: HTMLElement | null,
  callback?: () => void
) => {
  if (!element) return;
  
  // Create particles
  createVictoryParticles(element);
  
  const tl = gsap.timeline({
    onComplete: () => {
      if (callback) callback();
    }
  });
  
  tl.to(element, {
    y: -30,
    duration: 0.4,
    ease: 'power2.out'
  })
  .to(element, {
    y: 0,
    duration: 0.3,
    ease: 'bounce.out'
  })
  .to(element, {
    scale: 1.2,
    duration: 0.3,
    ease: 'power1.out'
  })
  .to(element, {
    rotate: 10,
    duration: 0.2,
    ease: 'power1.out'
  })
  .to(element, {
    rotate: -10,
    duration: 0.2,
    ease: 'power1.out'
  })
  .to(element, {
    rotate: 0,
    scale: 1,
    duration: 0.2,
    ease: 'power1.out'
  });
};

// Create victory particles
const createVictoryParticles = (element: HTMLElement) => {
  const container = element.parentElement;
  if (!container) return;
  
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 10 + 5;
    const color = i % 3 === 0 ? '#FFC107' : i % 3 === 1 ? '#8B5CF6' : '#F97316';
    
    particle.className = 'absolute rounded-full z-10';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    
    const startX = element.offsetWidth / 2;
    const startY = element.offsetHeight / 2;
    
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    
    container.appendChild(particle);
    
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 150 + 50;
    const destX = startX + Math.cos(angle) * distance;
    const destY = startY + Math.sin(angle) * distance;
    
    gsap.to(particle, {
      x: destX - startX,
      y: destY - startY,
      opacity: 0,
      duration: 1 + Math.random(),
      ease: 'power2.out',
      onComplete: () => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }
    });
  }
};

// Enhanced defeat animation with dramatic fall
export const playDefeatAnimation = (
  element: HTMLElement | null,
  callback?: () => void
) => {
  if (!element) return;
  
  const tl = gsap.timeline({
    onComplete: () => {
      if (callback) callback();
    }
  });
  
  // Flash the element red
  tl.to(element, {
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    duration: 0.2,
    repeat: 1,
    yoyo: true
  })
  .to(element, {
    y: 10,
    duration: 0.3,
    ease: 'power2.in'
  })
  .to(element, {
    rotate: 90,
    y: 50,
    opacity: 0.3,
    duration: 0.5,
    ease: 'power2.in'
  });
};

// Enhanced table row selection animation with glow
export const animateRowSelection = (
  element: HTMLElement | null,
  isSelected: boolean
) => {
  if (!element) return;
  
  if (isSelected) {
    gsap.fromTo(element, 
      { backgroundColor: 'rgba(139, 92, 246, 0)' },
      { 
        backgroundColor: 'rgba(139, 92, 246, 0.3)', 
        boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)', 
        duration: 0.3,
        ease: 'power1.out'
      }
    );
  } else {
    gsap.to(element, { 
      backgroundColor: 'rgba(139, 92, 246, 0)', 
      boxShadow: 'none',
      duration: 0.3,
      ease: 'power1.out'
    });
  }
};

// Enhanced entrance animations with FF-style
export const fadeInElement = (element: HTMLElement | null, delay = 0) => {
  if (!element) return;
  
  gsap.fromTo(element,
    { opacity: 0, y: 30, scale: 0.95 },
    { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      duration: 0.5, 
      delay, 
      ease: 'back.out(1.7)'
    }
  );
};

// Spell cast animation for correct answers
export const playCastAnimation = (element: HTMLElement | null) => {
  if (!element) return;
  
  // Create magical circle
  const circle = document.createElement('div');
  circle.className = 'absolute inset-0 rounded-full border-4 border-game-primary opacity-0 z-0';
  element.appendChild(circle);
  
  // Create magical runes (actually just small divs)
  for (let i = 0; i < 6; i++) {
    const rune = document.createElement('div');
    const size = Math.random() * 10 + 5;
    const angle = (i / 6) * Math.PI * 2;
    const radius = element.offsetWidth * 0.6;
    
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    rune.className = 'absolute bg-game-primary rounded-sm z-0';
    rune.style.width = `${size}px`;
    rune.style.height = `${size * 1.5}px`;
    rune.style.left = `calc(50% + ${x}px - ${size/2}px)`;
    rune.style.top = `calc(50% + ${y}px - ${size/2}px)`;
    rune.style.opacity = '0';
    rune.style.transform = `rotate(${angle + Math.PI/2}rad)`;
    
    element.appendChild(rune);
    
    gsap.to(rune, {
      opacity: 0.8,
      duration: 0.3,
      delay: i * 0.05,
      ease: 'power1.out',
      onComplete: () => {
        gsap.to(rune, {
          opacity: 0,
          scale: 1.5,
          duration: 0.5,
          delay: 0.3,
          ease: 'power1.in',
          onComplete: () => {
            if (rune.parentNode) rune.parentNode.removeChild(rune);
          }
        });
      }
    });
  }
  
  // Animate the circle
  gsap.to(circle, {
    opacity: 0.8,
    scale: 1.2,
    duration: 0.5,
    ease: 'power1.out',
    onComplete: () => {
      gsap.to(circle, {
        opacity: 0,
        scale: 1.8,
        duration: 0.5,
        ease: 'power1.in',
        onComplete: () => {
          if (circle.parentNode) circle.parentNode.removeChild(circle);
        }
      });
    }
  });
  
  // Add a flash to the character
  gsap.to(element, {
    boxShadow: '0 0 15px rgba(139, 92, 246, 0.8)',
    duration: 0.3,
    ease: 'power1.out',
    onComplete: () => {
      gsap.to(element, {
        boxShadow: '0 0 0 rgba(139, 92, 246, 0)',
        duration: 0.5,
        ease: 'power1.in'
      });
    }
  });
};

// Number highlight animation for the multiplication table
export const highlightNumber = (element: HTMLElement | null) => {
  if (!element) return;
  
  gsap.fromTo(element,
    { scale: 1, textShadow: '0 0 0 rgba(255,255,255,0)' },
    { 
      scale: 1.2, 
      textShadow: '0 0 10px rgba(255,255,255,0.8)',
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power1.out'
    }
  );
};

// Limit break charging animation
export const playLimitBreakCharge = (element: HTMLElement | null, onComplete?: () => void) => {
  if (!element) return;
  
  // Create aura effect
  const aura = document.createElement('div');
  aura.className = 'absolute inset-0 rounded-lg opacity-0 z-0';
  aura.style.background = 'radial-gradient(circle, rgba(139, 92, 246, 0.7) 0%, rgba(139, 92, 246, 0) 70%)';
  element.appendChild(aura);
  
  // Create energy particles
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 8 + 3;
    
    particle.className = 'absolute bg-white rounded-full z-0 opacity-0';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    const angle = Math.random() * Math.PI * 2;
    const distance = element.offsetWidth * 2;
    const startX = Math.cos(angle) * distance;
    const startY = Math.sin(angle) * distance;
    
    particle.style.left = `calc(50% + ${startX}px)`;
    particle.style.top = `calc(50% + ${startY}px)`;
    
    element.appendChild(particle);
    
    // Animate particles flowing into the character
    gsap.to(particle, {
      x: -startX,
      y: -startY,
      opacity: 0.8,
      duration: 0.8 + Math.random() * 0.5,
      delay: Math.random() * 0.5,
      ease: 'power1.in',
      onComplete: () => {
        if (particle.parentNode) particle.parentNode.removeChild(particle);
      }
    });
  }
  
  // Animate the aura
  gsap.to(aura, {
    opacity: 1,
    scale: 1.5,
    duration: 1,
    ease: 'power1.out',
    onComplete: () => {
      gsap.to(aura, {
        opacity: 0,
        scale: 0.5,
        duration: 0.5,
        ease: 'power1.in',
        onComplete: () => {
          if (aura.parentNode) aura.parentNode.removeChild(aura);
          if (onComplete) onComplete();
        }
      });
    }
  });
  
  // Make the character pulse
  gsap.to(element, {
    scale: 1.1,
    boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)',
    duration: 1,
    ease: 'power1.inOut',
    onComplete: () => {
      gsap.to(element, {
        scale: 1,
        boxShadow: '0 0 0 rgba(139, 92, 246, 0)',
        duration: 0.5,
        ease: 'power1.out'
      });
    }
  });
};
