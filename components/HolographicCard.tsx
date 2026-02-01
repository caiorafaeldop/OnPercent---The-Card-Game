import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface HolographicCardProps {
  image: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  stats?: { str: number; int: number; agi: number };
  className?: string;
  onClick?: () => void;
  count?: number;
}

const HolographicCard: React.FC<HolographicCardProps> = ({ image, name, rarity, stats, className, onClick, count = 1 }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Upgrade Tiers
  const isDiamond = count >= 5;
  const isGold = count >= 2 && count < 5;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 200 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 200 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [20, -20]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  
  // Glare position moves opposite
  const glareX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Normalize coordinates -0.5 to 0.5
    const width = rect.width;
    const height = rect.height;
    
    const mouseXVal = e.clientX - rect.left;
    const mouseYVal = e.clientY - rect.top;
    
    const xPct = (mouseXVal / width) - 0.5;
    const yPct = (mouseYVal / height) - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Styles based on rarity and tier
  const getBorderColor = () => {
      if (isDiamond) return 'border-transparent bg-gradient-to-r from-cyan-400 via-white to-purple-400 animate-gradient-xy'; // Prismatic
      if (isGold) return 'border-yellow-400 shadow-yellow-500/50';
      
      switch (rarity) {
          case 'legendary': return 'border-orange-500 shadow-orange-500/50';
          case 'epic': return 'border-purple-500 shadow-purple-500/50';
          case 'rare': return 'border-blue-500 shadow-blue-500/50';
          default: return 'border-gray-500 shadow-gray-500/50';
      }
  };

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden border-4 bg-black shadow-2xl transition-all duration-300 ${getBorderColor()} ${className}`}
    >
      {/* Prismatic Border Effect Container (for Diamond) */}
      {isDiamond && (
          <div className="absolute inset-[-4px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-spin-slow opacity-50 blur-md -z-10"></div>
      )}
      <div style={{ transform: "translateZ(50px)" }} className="relative z-10 w-full h-full">
         <img src={image} alt={name} className="w-full h-full object-cover pointer-events-none" />
      </div>

      {/* Holographic Overlay - Enhanced for Tiers */}
      <motion.div
        className={`absolute inset-0 z-20 pointer-events-none mix-blend-overlay ${isDiamond ? 'opacity-80' : isGold ? 'opacity-60' : 'opacity-50'}`}
        style={{
          background: isDiamond 
            ? `linear-gradient(115deg, transparent 20%, rgba(0,255,255,0.8) 40%, rgba(255,0,255,0.8) 60%, transparent 80%)` // Rainbow for Diamond
            : isGold
            ? `linear-gradient(115deg, transparent 20%, rgba(255,215,0,0.6) 40%, rgba(255,255,255,0.8) 50%, rgba(255,215,0,0.6) 60%, transparent 80%)` // Gold for Gold
            : `linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.4) 60%, transparent 80%)`,
          backgroundSize: '200% 200%',
          backgroundPositionX: useTransform(glareX, v => `${v}%`),
          backgroundPositionY: useTransform(glareY, v => `${v}%`),
        }}
      />
      
      {/* Texture Overlays */}
      {(rarity !== 'common' || isGold || isDiamond) && (
         <div className={`absolute inset-0 z-10 pointer-events-none opacity-20 mix-blend-color-dodge ${isDiamond ? "bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" : "bg-[url('https://www.transparenttextures.com/patterns/foil.png')]"}`}></div>
      )}

      {/* Gold Dust particles for Gold Tier */}
      {isGold && !isDiamond && (
         <div className="absolute inset-0 z-10 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      )}

      {/* Content Overlay */}
      <div className="absolute bottom-0 inset-x-0 z-30 p-4 bg-gradient-to-t from-black via-black/80 to-transparent translate-z-20 transform-style-3d">
         <div style={{ transform: "translateZ(30px)" }}>
             <h3 className="text-white font-black italic text-lg leading-none mb-2 drop-shadow-md">{name}</h3>
             
             {stats && (
                 <div className="flex gap-2 text-[10px] font-mono">
                    <div className="bg-black/60 px-2 py-1 rounded backdrop-blur-md border border-white/10">
                        <span className="text-red-400 font-bold block">STR</span>
                        <span className="text-white">{stats.str}</span>
                    </div>
                    <div className="bg-black/60 px-2 py-1 rounded backdrop-blur-md border border-white/10">
                        <span className="text-blue-400 font-bold block">INT</span>
                        <span className="text-white">{stats.int}</span>
                    </div>
                    <div className="bg-black/60 px-2 py-1 rounded backdrop-blur-md border border-white/10">
                        <span className="text-green-400 font-bold block">AGI</span>
                        <span className="text-white">{stats.agi}</span>
                    </div>
                 </div>
             )}
         </div>
      </div>
      
      {/* Rarity/Tier Badge */}
      <div className="absolute top-2 right-2 z-30 transform-style-3d flex items-center gap-1">
          {isDiamond && <span className="text-lg animate-pulse" title="Diamond Tier (5+ copies)">💎</span>}
          {isGold && <span className="text-lg animate-bounce" title="Gold Tier (2+ copies)">👑</span>}
          
          <div style={{ transform: "translateZ(40px)" }} className={`
            text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-lg
            ${isDiamond ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white' : 
              isGold ? 'bg-yellow-400 text-black' :
              rarity === 'legendary' ? 'bg-orange-500 text-black' : 
              rarity === 'epic' ? 'bg-purple-500 text-white' :
              rarity === 'rare' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-200'}
          `}>
             {rarity} {count > 1 && `x${count}`}
          </div>
      </div>

    </motion.div>
  );
};

export default HolographicCard;
