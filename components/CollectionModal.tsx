import React, { useLayoutEffect } from 'react';
import { COLLECTIBLES } from '../services/gacha';
import { Collectible } from '../types';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInventory: string[]; // List of owned card IDs
}

const CollectionModal: React.FC<CollectionModalProps> = ({ isOpen, onClose, userInventory }) => {
  if (!isOpen) return null;

  // Group cards by rarity
  const cardsByRarity = {
    legendary: COLLECTIBLES.filter(c => c.rarity === 'legendary'),
    epic: COLLECTIBLES.filter(c => c.rarity === 'epic'),
    rare: COLLECTIBLES.filter(c => c.rarity === 'rare'),
    common: COLLECTIBLES.filter(c => c.rarity === 'common'),
  };

  const rarityColors = {
    legendary: 'text-yellow-500 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    epic: 'text-purple-500 border-purple-500 bg-purple-50 dark:bg-purple-900/20',
    rare: 'text-blue-500 border-blue-500 bg-blue-50 dark:bg-blue-900/20',
    common: 'text-gray-500 border-gray-500 bg-gray-50 dark:bg-gray-900/20',
  };

  const [viewCard, setViewCard] = React.useState<Collectible | null>(null);
  
  // Preload images immediately when modal opens
  useLayoutEffect(() => {
     COLLECTIBLES.forEach(card => {
         if (card.image) {
             const img = new Image();
             img.src = card.image;
         }
     });
  }, []);

  const renderSection = (title: string, cards: Collectible[], rarity: keyof typeof rarityColors) => {
      if (cards.length === 0) return null;
      return (
          <div className="mb-8">
              <h3 className={`text-xl font-bold uppercase mb-4 border-b-2 pb-2 ${rarityColors[rarity].split(' ')[0]} ${rarityColors[rarity].split(' ')[1]}`}>
                  {title} <span className="text-sm opacity-60 ml-2">({cards.filter(c => userInventory.includes(c.id)).length}/{cards.length})</span>
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {cards.map(card => {
                      const isOwned = userInventory.includes(card.id);
                      return (
                          <div 
                            key={card.id} 
                            onClick={() => setViewCard(card)}
                            className={`relative aspect-[2/3] rounded-xl overflow-hidden border cursor-pointer transform hover:scale-105 transition-all ${isOwned ? 'border-transparent shadow-lg' : 'border-gray-200 dark:border-gray-800'}`}
                           >
                               <img 
                                  src={card.image} 
                                  alt={card.name}
                                  className={`w-full h-full object-cover transition-all ${isOwned ? '' : 'grayscale opacity-40 blur-[1px]'}`}
                               />
                               {!isOwned && (
                                   <div className="absolute inset-0 flex items-center justify-center">
                                       <div className="bg-black/50 text-white text-[10px] uppercase font-bold px-2 py-1 rounded backdrop-blur-sm">Bloqueado</div>
                                   </div>
                               )}
                               
                               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-8 opacity-0 hover:opacity-100 transition-opacity">
                                   <p className="text-white text-[10px] font-bold text-center truncate">{card.name}</p>
                                   <p className="text-white text-[8px] uppercase text-center opacity-70">Ver Detalhes</p>
                               </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-black w-full max-w-4xl h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-gray-200 dark:border-gray-800">
        <header className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-black z-10">
            <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Albúm de Cartas</h2>
                <div className="text-sm opacity-60 font-medium">
                    Progresso Total: {userInventory.length} / {COLLECTIBLES.length}
                </div>
            </div>
            <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
                ✕
            </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
            {renderSection('Lendárias', cardsByRarity.legendary, 'legendary')}
            {renderSection('Épicas', cardsByRarity.epic, 'epic')}
            {renderSection('Raras', cardsByRarity.rare, 'rare')}
            {renderSection('Comuns', cardsByRarity.common, 'common')}
        </div>
      </div>

      {/* Detail Modal Overlay */}
      {viewCard && (() => {
         const isOwned = userInventory.includes(viewCard.id);
         const isLegendary = viewCard.rarity === 'legendary';
         const isEpic = viewCard.rarity === 'epic';
         const isRare = viewCard.rarity === 'rare';
         
         let borderColor = 'border-gray-500';
         let glowColor = 'bg-gray-500/20';
         
         if (isLegendary) { borderColor = 'border-orange-500'; glowColor = 'bg-orange-500/20'; }
         else if (isEpic) { borderColor = 'border-purple-500'; glowColor = 'bg-purple-500/20'; }
         else if (isRare) { borderColor = 'border-blue-500'; glowColor = 'bg-blue-500/20'; }

         return (
            <div className="absolute inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setViewCard(null)}>
                 <div className="relative max-w-sm w-full bg-gray-900 rounded-3xl border-4 border-gray-800 p-6 shadow-2xl overflow-hidden transform scale-100 transition-transform" onClick={e => e.stopPropagation()}>
                    {/* Glow */}
                    <div className={`absolute inset-0 ${glowColor} animate-pulse blur-xl ${!isOwned ? 'opacity-20 grayscale' : ''}`}></div>

                    <div className="relative z-10 flex flex-col items-center text-white">
                       <div className={`w-64 h-80 rounded-xl border-4 ${borderColor} ${!isOwned ? 'border-gray-600' : ''} shadow-2xl overflow-hidden mb-6 relative`}>
                          <img 
                            src={viewCard.image} 
                            alt={viewCard.name} 
                            className={`w-full h-full object-cover ${!isOwned ? 'grayscale opacity-50 blur-[1px]' : ''}`} 
                          />
                          <div className={`absolute bottom-0 w-full ${!isOwned ? 'bg-gray-800' : 'bg-black/60'} text-center py-1 text-[10px] font-bold uppercase`}>
                            {isOwned ? viewCard.rarity : 'Não Adquirido'}
                          </div>
                       </div>

                       <h2 className={`text-3xl font-black italic tracking-tighter mb-2 text-center ${!isOwned ? 'text-gray-500' : ''}`}>{viewCard.name}</h2>
                       <p className="text-sm opacity-70 text-center leading-relaxed mb-6 italic">"{viewCard.description}"</p>

                       <div className={`flex gap-4 w-full justify-center ${!isOwned ? 'opacity-50 grayscale' : ''}`}>
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
                       
                       <button 
                            onClick={() => setViewCard(null)} 
                            className="mt-8 text-xs uppercase font-bold text-gray-400 hover:text-white hover:scale-110 transition-transform"
                        >
                            Fechar
                        </button>
                    </div>
                 </div>
            </div>
         )
      })()}
    </div>
  );
};

export default CollectionModal;
