import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Collectible } from '../types';

interface GachaRevealProps {
  card: Collectible | null;
  onComplete: () => void;
}

const GachaReveal: React.FC<GachaRevealProps> = ({ card, onComplete }) => {
  const [stage, setStage] = useState<'enter' | 'locked' | 'flip' | 'reveal'>('enter');

  useEffect(() => {
    // Stage Management
    let t1: NodeJS.Timeout;

    if (stage === 'enter') {
        // Enter -> Locked (smoke starts)
        t1 = setTimeout(() => setStage('locked'), 800);
    }

    return () => {
        clearTimeout(t1);
    };
  }, [stage]);

  const handleCardClick = () => {
      if (stage === 'locked') {
          setStage('flip');
          // Sound effect would go here
      } else if (stage === 'reveal') {
          onComplete();
      }
  };

  // Determine smoke color based on known rarity (even before reveal, for the effect)
  const getRarityColor = () => {
      switch (card?.rarity) {
          case 'legendary': return '#f97316'; // Orange-500
          case 'epic': return '#a855f7'; // Purple-500
          case 'rare': return '#3b82f6'; // Blue-500
          default: return '#6b7280'; // Gray-500
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl">
        <AnimatePresence mode='wait'>
            {/* CARD CONTAINER */}
            <div className="relative w-80 h-[30rem] perspective-1000 cursor-pointer" onClick={handleCardClick}>
                {(!card && stage !== 'reveal') ? (
                    <motion.div
                        className="text-white text-2xl font-bold animate-pulse text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        Sintonizando...
                    </motion.div>
                ) : (
                    <motion.div
                        className="w-full h-full relative"
                        initial={{ scale: 0, y: 500, rotateX: 60 }}
                        animate={{ 
                            scale: stage === 'enter' ? 0.8 : 1,
                            y: stage === 'enter' ? 200 : 0,
                            rotateX: stage === 'enter' ? 45 : 0,
                            rotateY: (stage === 'flip' || stage === 'reveal') ? 180 : 0,
                        }}
                        transition={{
                            type: 'spring', damping: 20
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                        onAnimationComplete={() => {
                            if (stage === 'flip') setStage('reveal');
                        }}
                    >
                        {/* === FRONT (CARD BACK) === */}
                        <div 
                            className={`
                                absolute inset-0 backface-hidden rounded-2xl overflow-hidden
                                ${stage === 'locked' ? 'animate-smoke' : ''}
                            `}
                            style={{ 
                                backfaceVisibility: 'hidden', 
                                background: '#0f172a', // Slate-900 base
                                color: getRarityColor() 
                            }}
                        >
                            {/* === NEW CARD BACK DESIGN (Night Stories Theme) === */}
                            
                            {/* 1. Base Gradient & Grid */}
                            <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-black"></div>
                            <div 
                                className="absolute inset-0 z-0 opacity-20" 
                                style={{ 
                                    backgroundImage: `linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)`, 
                                    backgroundSize: '30px 30px' 
                                }} 
                            />
                            
                            {/* 2. Glow Effects */}
                            <div className="absolute inset-0 z-0 opacity-50" style={{ background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.4) 0%, transparent 70%)' }} />
                            
                            {/* 3. Border Glow */}
                            <div className="absolute inset-0 z-10 border-[3px] border-purple-500/30 rounded-2xl shadow-[inset_0_0_20px_rgba(168,85,247,0.2)]"></div>

                            {/* 4. Center Content */}
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6">
                                
                                {/* Orbiting Moon Emblem */}
                                <div className="relative">
                                    {/* Rotating Rings */}
                                    <motion.div 
                                        className="absolute -inset-4 rounded-full border border-cyan-500/30 border-t-transparent"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    />
                                    <motion.div 
                                        className="absolute -inset-2 rounded-full border border-purple-500/30 border-b-transparent"
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                    />

                                    {/* The Moon */}
                                    <motion.div
                                        animate={stage === 'locked' ? { scale: [1, 1.1, 1], filter: ['drop-shadow(0 0 10px rgba(168,85,247,0.5))', 'drop-shadow(0 0 20px rgba(168,85,247,0.8))', 'drop-shadow(0 0 10px rgba(168,85,247,0.5))'] } : {}}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="w-24 h-24 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center relative overflow-hidden"
                                    >
                                        <div className="w-12 h-12 rounded-full shadow-[inset_-10px_-4px_0_0_#e879f9] rotate-[-20deg] filter drop-shadow-[0_0_5px_rgba(232,121,249,0.5)]"></div>
                                        
                                        {/* Stars inside the emblem */}
                                        <div className="absolute top-4 right-6 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                                        <div className="absolute bottom-6 left-6 w-1 h-1 bg-white rounded-full animate-pulse delay-75"></div>
                                    </motion.div>
                                </div>

                                {/* Text Label */}
                                <div className="text-center">
                                    <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-cyan-200 font-extrabold text-xl tracking-[0.2em] uppercase filter drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
                                        NIGHT
                                    </h3>
                                    <h3 className="text-purple-400/80 font-medium text-[10px] tracking-[0.5em] uppercase mt-1">
                                        STORIES
                                    </h3>
                                </div>
                            </div>

                            {/* 5. Footer CTA */}
                            <motion.div 
                                className="absolute bottom-8 inset-x-0 text-center z-20"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <p className="text-[9px] text-cyan-300/60 uppercase tracking-[0.3em]">
                                    Sinal Detectado
                                </p>
                            </motion.div>
                            
                            {/* Flash effect on flip */}
                            {stage === 'flip' && (
                                <motion.div 
                                    className="absolute inset-0 bg-white z-50"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </div>

                        {/* === BACK (REVEALED CARD) === */}
                        <div 
                            className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border-2 border-white/10"
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        >
                             <div className={`absolute inset-0 z-0 opacity-60 ${
                                card?.rarity === 'legendary' ? 'bg-gradient-to-t from-orange-900/80 to-black' : 
                                card?.rarity === 'epic' ? 'bg-gradient-to-t from-purple-900/80 to-black' : 'bg-gradient-to-t from-gray-900 to-black'
                             }`} />

                             <img src={card?.image} alt={card?.name} className="w-full h-full object-cover relative z-10" />

                             <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/90 to-transparent p-8 z-20 pt-20">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className={`
                                        inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase mb-3
                                        ${
                                            card?.rarity === 'legendary' ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/50' : 
                                            card?.rarity === 'epic' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50' : 
                                            card?.rarity === 'rare' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
                                        }
                                    `}>
                                        {card?.rarity}
                                    </div>
                                    <h2 className="text-3xl font-black italic text-white leading-none mb-4">{card?.name}</h2>
                                    
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="bg-white/5 rounded-lg p-2 flex flex-col items-center border border-white/10">
                                            <span className="text-[9px] font-bold text-red-400 uppercase mb-1">STR</span>
                                            <span className="text-xl text-white font-black leading-none">{card?.stats.str}</span>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-2 flex flex-col items-center border border-white/10">
                                            <span className="text-[9px] font-bold text-blue-400 uppercase mb-1">INT</span>
                                            <span className="text-xl text-white font-black leading-none">{card?.stats.int}</span>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-2 flex flex-col items-center border border-white/10">
                                            <span className="text-[9px] font-bold text-green-400 uppercase mb-1">AGI</span>
                                            <span className="text-xl text-white font-black leading-none">{card?.stats.agi}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 text-center">
                                         <span className="text-[10px] text-white/30 uppercase tracking-widest animate-pulse">Toque para fechar</span>
                                    </div>
                                </motion.div>
                             </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </AnimatePresence>

        {/* PARTICLES / REFLECTIONS (Optional polish) */}
        {card?.rarity === 'legendary' && (
             <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                 {[...Array(20)].map((_, i) => (
                     <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-orange-500 rounded-full"
                        initial={{ 
                            x: Math.random() * window.innerWidth, 
                            y: window.innerHeight 
                        }}
                        animate={{ 
                            y: -100,
                            x: (Math.random() - 0.5) * 500 + window.innerWidth / 2,
                            opacity: [0, 1, 0]
                        }}
                        transition={{ 
                            duration: 3 + Math.random() * 2, 
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeOut"
                        }}
                     />
                 ))}
             </div>
        )}
    </div>
  );
};

export default GachaReveal;
