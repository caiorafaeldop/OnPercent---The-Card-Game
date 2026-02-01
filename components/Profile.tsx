import React, { useState, useEffect } from 'react';
import { UserState, Collectible } from '../types';
import { ACHIEVEMENTS_LIST, LEVEL_THRESHOLDS } from '../services/gamification';
import { pullGacha, COLLECTIBLES, GACHA_COST, BONUS_CREDITS } from '../services/gacha';
import { exportData, saveUser } from '../services/storage';
import { BookIcon, TrophyIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';
import CollectionModal from './CollectionModal';
import GachaReveal from './GachaReveal';
import HolographicCard from './HolographicCard';

interface ProfileProps {
  user: UserState;
  unlockedAchievements: string[];
  onAddCredits: (amount: number) => void;
  onPullGacha: (newItemId: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, unlockedAchievements, onAddCredits, onPullGacha }) => {
  const [lastReward, setLastReward] = useState<string | null>(null);
  const [viewCard, setViewCard] = useState<Collectible | null>(null);
  const [showBackupAlert, setShowBackupAlert] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [revealedCard, setRevealedCard] = useState<Collectible | null>(null);
  const [showReveal, setShowReveal] = useState(false);

  const nextLevelXP = LEVEL_THRESHOLDS[user.level] || 100000;
  const currentLevelXP = LEVEL_THRESHOLDS[user.level - 1] || 0;
  const progress = Math.min(100, Math.max(0, ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100));

  // Check for backup days (Sunday=0, Wednesday=3)
  useEffect(() => {
    const day = new Date().getDay();
    if (day === 0 || day === 3) {
      const last = user.lastBackupDate ? new Date(user.lastBackupDate).toDateString() : '';
      const today = new Date().toDateString();
      if (last !== today) {
        setShowBackupAlert(true);
      }
    }
  }, [user.lastBackupDate]);

  const handlePull = () => {
    if (user.credits < GACHA_COST) return;
    
    // Find the result immediately for the reveal component
    const result = pullGacha();
    if (result) {
        const card = COLLECTIBLES.find(c => c.id === result.id);
        if (card) {
            setRevealedCard(card);
            setShowReveal(true);
        }
    }
  };

  const handleRevealComplete = () => {
      if (revealedCard) {
          onPullGacha(revealedCard.id);
          setLastReward(revealedCard.id);
          setShowReveal(false);
          setRevealedCard(null);
          // Highlight
          setTimeout(() => setLastReward(null), 5000);
      }
  };

  const handleBackup = () => {
    const data = exportData();
    navigator.clipboard.writeText(data).then(() => {
      alert("Dados copiados! O app de email abrirá. Cole o conteúdo e envie para você mesmo.");
      window.location.href = "mailto:?subject=Onpercent%20Backup&body=COLE%20OS%20DADOS%20AQUI";
      const updatedUser = { ...user, lastBackupDate: new Date().toISOString() };
      saveUser(updatedUser);
      setShowBackupAlert(false);
    });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar pb-32">
       
       <div className="px-1 pt-4">
            {showBackupAlert && (
                <div className="bg-red-500 text-white p-4 rounded-xl shadow-lg animate-pulse mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold uppercase text-xs">⚠️ Backup Necessário</h3>
                    <span className="text-[10px] opacity-80">Domingo/Quarta</span>
                </div>
                <p className="text-xs mb-3">Não confie na sorte. Seus dados estão apenas neste dispositivo.</p>
                <button onClick={handleBackup} className="w-full bg-white text-red-500 font-bold text-xs py-2 rounded-lg uppercase tracking-wider">Gerar & Enviar Email</button>
                </div>
            )}

            <div className="space-y-2 mb-8">
                <div className="flex justify-between text-xs font-bold uppercase opacity-60">
                <span>Nível {user.level}</span>
                <span>{user.xp} / {nextLevelXP} XP</span>
                </div>
                <div className="h-4 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                <div className="h-full bg-black dark:bg-white transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {/* Histórias da Noite Section - Widget Interativo */}
            <div 
                onClick={handlePull}
                className={`
                    relative group overflow-hidden rounded-[2.5rem] p-1 
                    bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 shadow-2xl
                    mb-12 shrink-0 z-10 select-none
                    ${user.credits >= GACHA_COST ? 'cursor-pointer active:scale-[0.98] hover:shadow-purple-500/20' : 'opacity-80 grayscale'}
                `}
            >
                <div className="bg-black/95 dark:bg-gray-950 backdrop-blur-xl rounded-[2.2rem] p-8 relative overflow-hidden transition-colors group-active:bg-black/90">
                    {/* Urban Grid Background Effect */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#4c1d95 1px, transparent 1px), linear-gradient(90deg, #4c1d95 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full delay-700 animate-pulse"></div>
                    
                    <div className="relative z-10 text-center space-y-6">
                        <header className="space-y-1">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400 opacity-80">Edição Especial</h3>
                            <h2 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-indigo-200 tracking-tighter uppercase leading-none">
                                Histórias da Noite
                            </h2>
                        </header>

                        <div className="flex flex-col items-center">
                            <div className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]">
                                {Math.floor(user.credits)}
                            </div>
                            <span className="text-[10px] uppercase font-bold text-purple-300/60 tracking-[0.2em] mt-1">Fragmentos de Memória</span>
                        </div>
                        
                        {/* Interactive Prompt - Substitui o Botão */}
                        <div className="mt-8 text-center relative z-20">
                            <div className={`
                                inline-block px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px] border border-white/10
                                ${user.credits >= GACHA_COST 
                                    ? 'bg-white text-black animate-pulse shadow-[0_0_20px_rgba(255,255,255,0.5)]' 
                                    : 'bg-gray-800 text-gray-500'}
                            `}>
                                {user.credits >= GACHA_COST ? 'Toque para Nova Carta (100)' : 'Fragmentos Insuficientes'}
                            </div>
                             <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-2 opacity-50">
                                Sintonize o rádio para encontrar
                            </p>
                        </div>

                        {lastReward && (
                            <div className="animate-bounce-in pt-6 mt-8 border-t border-white/5 relative" onClick={(e) => e.stopPropagation() /* Prevent double trigger if clicking reward */}>
                                <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 mb-4">Captado Recentemente</p>
                                
                                <div className="flex justify-center">
                                    <div className="w-24 h-32 rounded-xl border-2 border-purple-500/50 shadow-[0_0_30px_rgba(167,139,250,0.3)] overflow-hidden transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                        <img src={COLLECTIBLES.find(c => c.id === lastReward)?.image} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <h2 className="mt-4 text-sm font-black italic text-white uppercase tracking-tight">
                                    {COLLECTIBLES.find(c => c.id === lastReward)?.name}
                                </h2>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showReveal && (
                <GachaReveal 
                    card={revealedCard} 
                    onComplete={handleRevealComplete} 
                />
            )}

            {/* Inventário Section */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-8 relative z-0">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-bold uppercase opacity-50">Inventário de Cartas</h3>
                    <button 
                        onClick={() => setShowCollection(true)}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    >
                        <BookIcon className="w-3 h-3" />
                        Ver Todas
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {COLLECTIBLES.filter(c => user.inventory.includes(c.id)).map(item => {
                    const isLegendary = item.rarity === 'legendary';
                    const isEpic = item.rarity === 'epic';
                    const isRare = item.rarity === 'rare';
                    
                    // Rarity Styles & Duplicates
                    const duplicateCount = user.inventory.filter(id => id === item.id).length;
                    const isDiamond = duplicateCount >= 5;
                    const isGold = duplicateCount >= 2 && duplicateCount < 5;

                    let borderColor = 'border-gray-500';
                    let shadowColor = 'shadow-gray-500/20';
                    let bgColor = 'bg-gray-900';
                    
                    if (isDiamond) {
                        borderColor = 'border-transparent bg-gradient-to-r from-cyan-400 to-purple-500'; 
                        shadowColor = 'shadow-cyan-500/50';
                        bgColor = 'bg-slate-900';
                    } else if (isGold) {
                        borderColor = 'border-yellow-400';
                        shadowColor = 'shadow-yellow-500/40';
                        bgColor = 'bg-neutral-900';
                    } else if (isLegendary) {
                        borderColor = 'border-orange-500';
                        shadowColor = 'shadow-orange-500/40';
                        bgColor = 'bg-orange-950';
                    } else if (isEpic) {
                        borderColor = 'border-purple-500';
                        shadowColor = 'shadow-purple-500/40';
                        bgColor = 'bg-purple-950';
                    } else if (isRare) {
                        borderColor = 'border-blue-500';
                        shadowColor = 'shadow-blue-500/40';
                        bgColor = 'bg-blue-950';
                    }

                    return (
                    <div 
                        key={item.id} 
                        onClick={() => setViewCard(item)}
                        className={`
                        relative rounded-xl border-2 overflow-hidden flex flex-col shadow-lg transition-transform hover:scale-105 cursor-pointer hover:shadow-2xl
                        ${borderColor} ${shadowColor} ${bgColor}
                        ${isDiamond ? 'animate-pulse' : ''}
                        `}
                    >
                        {/* Image Area */}
                        <div className="w-full aspect-[2/3] relative">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl bg-black/50">
                                    {item.icon}
                                </div>
                            )}
                            {/* Gradient overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                            
                            <div className="absolute top-1 right-1 flex flex-col items-end gap-1">
                                {isDiamond && <span className="text-xs">💎</span>}
                                {isGold && <span className="text-xs">👑</span>}
                                {duplicateCount > 1 && (
                                    <span className="text-[9px] font-black bg-black text-white px-1 rounded shadow-md border border-white/20">x{duplicateCount}</span>
                                )}
                            </div>

                            <div className="absolute bottom-2 left-2 right-2">
                                <h4 className="font-bold text-white text-xs leading-tight mb-1 drop-shadow-md">{item.name}</h4>
                                <div className="flex gap-1">
                                    <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded text-white bg-black/50 backdrop-blur-md border border-white/20`}>{item.rarity}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Footer */}
                        <div className="p-2 bg-black/40 text-[9px] font-mono text-white flex justify-between border-t border-white/10">
                            <div className="flex flex-col items-center">
                                <span className="text-red-400 font-bold">STR</span>
                                <span>{item.stats.str}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-blue-400 font-bold">INT</span>
                                <span>{item.stats.int}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-green-400 font-bold">AGI</span>
                                <span>{item.stats.agi}</span>
                            </div>
                        </div>
                    </div>
                    )
                })}
                {user.inventory.length === 0 && (
                    <div className="col-span-full text-center py-8 opacity-30 text-sm">Nenhuma carta coletada.</div>
                )}
                </div>
            </div>
            
            <div className="mt-8 pt-8 border-t dark:border-gray-800">
                <button onClick={handleBackup} className="text-xs uppercase font-bold text-gray-400 hover:text-black dark:hover:text-white underline">Forçar Backup Manual</button>
            </div>
      </div>

      {/* Card Modal */}
      {viewCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setViewCard(null)}>
             <div className="relative max-w-sm w-full bg-gray-900 rounded-3xl border-4 border-gray-800 p-6 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

                 <div className="relative z-10 flex flex-col items-center text-white w-full">
                    <div className="w-64 h-80 mb-6 perspective-1000">
                        <HolographicCard 
                            image={viewCard.image || ''} 
                            name={viewCard.name} 
                            rarity={viewCard.rarity} 
                            stats={viewCard.stats}
                            className="w-full h-full"
                            count={user.inventory.filter(id => id === viewCard.id).length}
                        />
                    </div>

                    <p className="text-sm opacity-70 text-center leading-relaxed mb-6 italic max-w-[250px]">"{viewCard.description}"</p>
                    
                    <button onClick={() => setViewCard(null)} className="mt-2 text-xs uppercase font-bold text-gray-400 hover:text-white">Fechar</button>
                </div>
             </div>
          </div>
      )}

      {/* Collection Modal */}
      <CollectionModal 
        isOpen={showCollection} 
        onClose={() => setShowCollection(false)} 
        userInventory={user.inventory} 
      />
    </div>
  );
};

export default Profile;