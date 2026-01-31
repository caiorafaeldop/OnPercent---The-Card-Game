import React, { useState, useEffect } from 'react';
import { UserState, Collectible } from '../types';
import { ACHIEVEMENTS_LIST, LEVEL_THRESHOLDS } from '../services/gamification';
import { pullGacha, COLLECTIBLES, GACHA_COST, BONUS_CREDITS } from '../services/gacha';
import { exportData, saveUser } from '../services/storage';
import { TrophyIcon } from './Icons';

interface ProfileProps {
  user: UserState;
  unlockedAchievements: string[];
  onAddCredits: (amount: number) => void;
  onPullGacha: (newItemId: string) => void;
  onRecordMeal: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, unlockedAchievements, onAddCredits, onPullGacha, onRecordMeal }) => {
  const [pulling, setPulling] = useState(false);
  const [lastReward, setLastReward] = useState<string | null>(null);
  const [viewCard, setViewCard] = useState<Collectible | null>(null);
  const [showBackupAlert, setShowBackupAlert] = useState(false);

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
    
    setPulling(true);
    setTimeout(() => {
      const result = pullGacha();
      if (result) {
        onPullGacha(result.id);
        setLastReward(result.id);
      } else {
        // Fallback for insufficient funds or error
      }
      setPulling(false);
      setTimeout(() => setLastReward(null), 3000);
    }, 1000);
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
    <div className="flex flex-col h-full space-y-8 pb-20 overflow-y-auto no-scrollbar">
       
       <header className="text-center mt-4">
        <div className="w-24 h-24 bg-black dark:bg-white text-white dark:text-black mx-auto rounded-full flex items-center justify-center text-3xl font-black mb-4 shadow-xl relative">
          {user.level}
          <div className="absolute -bottom-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white text-[10px] px-2 py-1 rounded-full border border-white dark:border-black font-bold uppercase">
             {user.name}
          </div>
        </div>
      </header>

      {showBackupAlert && (
        <div className="bg-red-500 text-white p-4 rounded-xl shadow-lg animate-pulse">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold uppercase text-xs">⚠️ Backup Necessário</h3>
            <span className="text-[10px] opacity-80">Domingo/Quarta</span>
          </div>
          <p className="text-xs mb-3">Não confie na sorte. Seus dados estão apenas neste dispositivo.</p>
          <button onClick={handleBackup} className="w-full bg-white text-red-500 font-bold text-xs py-2 rounded-lg uppercase tracking-wider">Gerar & Enviar Email</button>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold uppercase opacity-60">
          <span>Nível {user.level}</span>
          <span>{user.xp} / {nextLevelXP} XP</span>
        </div>
        <div className="h-4 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-black dark:bg-white transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 text-center space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest flex justify-center items-center gap-2"><span>🎰 Gacha</span></h3>
        <div className="text-4xl font-black">{Math.floor(user.credits)} <span className="text-sm font-medium opacity-50">Fichas</span></div>
        
        {lastReward ? (
           <div className="animate-bounce-in py-6 bg-gray-900 text-white rounded-3xl border-4 border-yellow-400 relative overflow-hidden shadow-2xl">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-yellow-500/20 animate-pulse"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300 mb-2 drop-shadow-md">Nova Descoberta</p>
                
                {(() => {
                  const card = COLLECTIBLES.find(c => c.id === lastReward);
                  return card ? (
                    <>
                       <div className="w-48 h-64 rounded-xl border-4 border-white/20 shadow-2xl overflow-hidden mb-4 relative transform hover:scale-105 transition-transform duration-300">
                          {card.image ? (
                            <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-6xl">{card.icon}</div>
                          )}
                          {/* Rarity Tag */}
                          <div className={`
                            absolute bottom-0 w-full py-1 text-center text-[10px] font-bold uppercase
                            ${card.rarity === 'legendary' ? 'bg-yellow-500 text-black' : ''}
                            ${card.rarity === 'epic' ? 'bg-purple-500 text-white' : ''}
                            ${card.rarity === 'rare' ? 'bg-blue-500 text-white' : ''}
                            ${card.rarity === 'common' ? 'bg-gray-500 text-white' : ''}
                          `}>
                            {card.rarity}
                          </div>
                       </div>

                       <h2 className="text-2xl font-black italic tracking-tighter mb-1">{card.name}</h2>
                       <p className="text-xs opacity-70 max-w-[200px] leading-relaxed mb-4">"{card.description}"</p>

                       <div className="flex justify-center gap-4 text-xs font-mono bg-black/50 p-2 rounded-lg backdrop-blur-sm">
                         <span className="text-red-400 font-bold">STR {card.stats.str}</span>
                         <span className="text-blue-400 font-bold">INT {card.stats.int}</span>
                         <span className="text-green-400 font-bold">AGI {card.stats.agi}</span>
                       </div>
                    </>
                  ) : <p>Erro ao carregar carta...</p>;
                })()}
              </div>
           </div>
        ) : (
          <button 
            onClick={handlePull}
            disabled={user.credits < GACHA_COST || pulling}
            className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${user.credits >= GACHA_COST ? 'bg-black text-white dark:bg-white dark:text-black active:scale-95 shadow-lg' : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'}`}
          >
            {pulling ? 'Abrindo...' : `Tentar a Sorte (${GACHA_COST})`}
          </button>
        )}
      </div>

      <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 text-center space-y-4 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest mb-2 flex flex-col items-center">
             <span>🍱 Nutrition Feed</span>
             <span className="text-[10px] text-gray-400 font-normal mt-1">Refeições de Hoje</span>
          </h3>

          <div className="flex justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${i < (user.mealsToday || 0) ? 'bg-green-500 scale-110 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-200 dark:bg-gray-800'}`}
                  />
              ))}
          </div>

          <button 
            onClick={onRecordMeal}
            disabled={(user.mealsToday || 0) >= 5}
            className={`
               w-full py-4 rounded-2xl font-black uppercase tracking-widest text-lg transition-all relative overflow-hidden group
               ${(user.mealsToday || 0) >= 5 
                  ? 'bg-green-500 text-white cursor-default shadow-lg shadow-green-500/20' 
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 active:scale-95'}
            `}
          >
             {(user.mealsToday || 0) >= 5 ? 'COMBO COMPLETO!' : 'Registrar Refeição (+20)'}
             
             {/* Progress Fill Background Effect */}
             {(user.mealsToday || 0) < 5 && (
               <div className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-300" style={{ width: `${((user.mealsToday || 0) / 5) * 100}%` }} />
             )}
          </button>
          <p className="text-[10px] opacity-40 uppercase font-bold tracking-wide">
             {(user.mealsToday || 0)}/5 Registradas • Reset à meia-noite
          </p>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase mb-4 opacity-50">Inventário de Cartas</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {COLLECTIBLES.filter(c => user.inventory.includes(c.id)).map(item => {
            const isLegendary = item.rarity === 'legendary';
            const isEpic = item.rarity === 'epic';
            const isRare = item.rarity === 'rare';
            
            // Rarity Styles
            let borderColor = 'border-gray-500';
            let shadowColor = 'shadow-gray-500/20';
            let bgColor = 'bg-gray-900';
            
            if (isLegendary) {
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
      {/* Card Modal */}
      {viewCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setViewCard(null)}>
             <div className="relative max-w-sm w-full bg-gray-900 rounded-3xl border-4 border-gray-800 p-6 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Glow */}
                <div className={`absolute inset-0 ${
                    viewCard.rarity === 'legendary' ? 'bg-orange-500/20' : 
                    viewCard.rarity === 'epic' ? 'bg-purple-500/20' : 
                    viewCard.rarity === 'rare' ? 'bg-blue-500/20' : 'bg-gray-500/20'
                } animate-pulse blur-xl`}></div>

                <div className="relative z-10 flex flex-col items-center text-white">
                   <div className={`w-64 h-80 rounded-xl border-4 ${
                       viewCard.rarity === 'legendary' ? 'border-orange-500' : 
                       viewCard.rarity === 'epic' ? 'border-purple-500' : 
                       viewCard.rarity === 'rare' ? 'border-blue-500' : 'border-gray-500'
                   } shadow-2xl overflow-hidden mb-6 relative`}>
                      <img src={viewCard.image} alt={viewCard.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 w-full bg-black/60 text-center py-1 text-[10px] font-bold uppercase">{viewCard.rarity}</div>
                   </div>

                   <h2 className="text-3xl font-black italic tracking-tighter mb-2 text-center">{viewCard.name}</h2>
                   <p className="text-sm opacity-70 text-center leading-relaxed mb-6 italic">"{viewCard.description}"</p>

                   <div className="flex gap-4 w-full justify-center">
                      <div className="bg-black/50 p-2 rounded flex flex-col items-center min-w-[60px]">
                         <span className="text-red-400 font-bold text-xs">STR</span>
                         <span className="text-xl font-mono">{viewCard.stats.str}</span>
                      </div>
                      <div className="bg-black/50 p-2 rounded flex flex-col items-center min-w-[60px]">
                         <span className="text-blue-400 font-bold text-xs">INT</span>
                         <span className="text-xl font-mono">{viewCard.stats.int}</span>
                      </div>
                      <div className="bg-black/50 p-2 rounded flex flex-col items-center min-w-[60px]">
                         <span className="text-green-400 font-bold text-xs">AGI</span>
                         <span className="text-xl font-mono">{viewCard.stats.agi}</span>
                      </div>
                   </div>
                   
                   <button onClick={() => setViewCard(null)} className="mt-8 text-xs uppercase font-bold text-gray-400 hover:text-white">Fechar</button>
                </div>
             </div>
          </div>
      )}
    </div>
  );
};

export default Profile;