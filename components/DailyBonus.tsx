import React from 'react';
import { useDailyBonus } from '../hooks/useDailyBonus';
import { motion, AnimatePresence } from 'framer-motion';

interface DailyBonusProps {
    onAddCredits: (amount: number) => void;
}

const DailyBonus: React.FC<DailyBonusProps> = ({ onAddCredits }) => {
    const { canClaim, statusMessage, claimBonus } = useDailyBonus();

    const handleClaim = () => {
        claimBonus(onAddCredits);
    };

    // If not claimable and message indicates it's passed or too early, we might want to show it discreetly or not at all.
    // The requirement says: "Se passar do horário, o botão desaparece ou fica inativo com a mensagem"
    
    return (
        <div className="w-full mb-6">
            <AnimatePresence>
                {canClaim && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="p-1 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-lg shadow-orange-500/20"
                    >
                        <div className="bg-zinc-900 rounded-xl p-6 flex flex-col items-center text-center relative overflow-hidden">
                            {/* Background effects */}
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,165,0,0.1),transparent)]" />
                            
                            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-2 relative z-10">
                                🌅 BÔNUS MATINAL ATIVO
                            </h3>
                            <p className="text-gray-300 mb-4 text-sm relative z-10">
                                Você acordou na hora certa! Recompensa exclusiva das 06:00 às 07:00.
                            </p>
                            
                            <button
                                onClick={handleClaim}
                                className="relative group px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full font-bold text-white shadow-lg transform transition-all hover:scale-105 active:scale-95 hover:shadow-orange-500/50"
                            >
                                <span className="flex items-center gap-2">
                                    <span>✨ Resgatar +100 Créditos</span>
                                </span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!canClaim && statusMessage && (
                <div className="text-center py-4 px-6 rounded-xl bg-zinc-800/50 border border-zinc-700/50 mt-4 mx-4">
                    <p className="text-zinc-500 text-sm italic flex items-center justify-center gap-2">
                        <span className="text-lg">🕰️</span> {statusMessage}
                    </p>
                </div>
            )}
        </div>
    );
};

export default DailyBonus;
