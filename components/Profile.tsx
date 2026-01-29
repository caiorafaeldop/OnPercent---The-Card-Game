import React, { useState, useEffect } from 'react';
import { UserState } from '../types';
import { ACHIEVEMENTS_LIST, LEVEL_THRESHOLDS } from '../services/gamification';
import { pullGacha, COLLECTIBLES, GACHA_COST, BONUS_CREDITS } from '../services/gacha';
import { exportData, saveUser } from '../services/storage';
import { TrophyIcon } from './Icons';

interface ProfileProps {
  user: UserState;
  unlockedAchievements: string[];
  onAddCredits: (amount: number) => void;
  onPullGacha: (newItemId: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, unlockedAchievements, onAddCredits, onPullGacha }) => {
  const [pulling, setPulling] = useState(false);
  const [lastReward, setLastReward] = useState<string | null>(null);
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
      const item = pullGacha();
      onPullGacha(item.id);
      setLastReward(item.id);
      setPulling(false);
      setTimeout(() => setLastReward(null), 3000);
    }, 1000);
  };

  const handleBonus = (type: string) => {
    onAddCredits(BONUS_CREDITS);
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
           <div className="animate-fade-in py-4 bg-black text-white dark:bg-white dark:text-black rounded-xl border-2 border-yellow-400">
              <p className="text-xs uppercase opacity-70 mb-1">Você invocou</p>
              <p className="font-bold text-lg">{COLLECTIBLES.find(c => c.id === lastReward)?.name}</p>
              <div className="flex justify-center gap-4 mt-2 text-xs">
                 <span>STR: {COLLECTIBLES.find(c => c.id === lastReward)?.stats.str}</span>
                 <span>INT: {COLLECTIBLES.find(c => c.id === lastReward)?.stats.int}</span>
                 <span>AGI: {COLLECTIBLES.find(c => c.id === lastReward)?.stats.agi}</span>
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
        <div className="grid grid-cols-2 gap-2 pt-2 opacity-50 hover:opacity-100 transition-opacity">
           <button onClick={() => handleBonus('meal')} className="text-[10px] uppercase border p-2 rounded">Refeição (+33)</button>
           <button onClick={() => handleBonus('interval')} className="text-[10px] uppercase border p-2 rounded">Sem Vícios (+33)</button>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase mb-4 opacity-50">Inventário de Cartas</h3>
        <div className="grid grid-cols-1 gap-4">
          {COLLECTIBLES.filter(c => user.inventory.includes(c.id)).map(item => {
            const isLegendary = item.rarity === 'legendary';
            const isRare = item.rarity === 'rare';
            const isCOTN = item.collection === 'call_of_the_night';

            return (
              <div 
                key={item.id} 
                className={`
                  relative overflow-hidden rounded-xl border-l-4 shadow-sm p-4 flex gap-4 items-center transition-all duration-300
                  ${isLegendary ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' : ''}
                  ${isRare ? 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/10' : ''}
                  ${!isLegendary && !isRare ? 'border-l-gray-300 bg-white dark:bg-gray-900' : ''}
                `}
              >
                  <div className="text-4xl">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm truncate">{item.name}</h4>
                        {isCOTN && <span className="text-[8px] px-1 bg-indigo-500 text-white rounded">COTN</span>}
                      </div>
                      <p className="text-[10px] opacity-70 line-clamp-2 italic">{item.description}</p>
                      
                      {/* Stats Display */}
                      <div className="flex gap-3 mt-2 text-[10px] font-mono opacity-80">
                         <span className="font-bold text-red-600 dark:text-red-400">STR {item.stats.str}</span>
                         <span className="font-bold text-blue-600 dark:text-blue-400">INT {item.stats.int}</span>
                         <span className="font-bold text-green-600 dark:text-green-400">AGI {item.stats.agi}</span>
                       </div>
                  </div>
              </div>
            )
          })}
          {user.inventory.length === 0 && (
            <div className="text-center py-8 opacity-30 text-sm">Nenhuma carta coletada.</div>
          )}
        </div>
      </div>
      
      <div className="mt-8 pt-8 border-t dark:border-gray-800">
        <button onClick={handleBackup} className="text-xs uppercase font-bold text-gray-400 hover:text-black dark:hover:text-white underline">Forçar Backup Manual</button>
      </div>
    </div>
  );
};

export default Profile;