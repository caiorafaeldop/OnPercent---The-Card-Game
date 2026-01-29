import { Collectible } from '../types';

export const GACHA_COST = 100;
export const BONUS_CREDITS = 33; // 1/3 of a pull

export const COLLECTIBLES: Collectible[] = [
  // --- CORE COLLECTION ---
  { 
    id: 'c1', name: 'O Aprendiz', description: 'O começo de tudo. Humilde, mas necessário.', 
    rarity: 'common', collection: 'core', icon: '♟️',
    stats: { str: 2, int: 2, agi: 2 }
  },
  { 
    id: 'c2', name: 'Relógio Quebrado', description: 'O tempo passa, você querendo ou não.', 
    rarity: 'common', collection: 'core', icon: '⏰',
    stats: { str: 1, int: 4, agi: 1 }
  },
  { 
    id: 'c3', name: 'Café Preto', description: 'Combustível amargo para noites longas.', 
    rarity: 'common', collection: 'core', icon: '☕',
    stats: { str: 3, int: 3, agi: 5 }
  },
  { 
    id: 'r1', name: 'O Estrategista', description: 'Vence batalhas antes de começarem.', 
    rarity: 'rare', collection: 'core', icon: '🧠',
    stats: { str: 2, int: 8, agi: 3 }
  },
  { 
    id: 'l1', name: 'O Imperador', description: 'Soberania absoluta sobre seus impulsos.', 
    rarity: 'legendary', collection: 'core', icon: '👑',
    stats: { str: 10, int: 9, agi: 8 }
  },

  // --- CALL OF THE NIGHT COLLECTION (Yofukashi no Uta) ---
  
  // Legendaries
  { 
    id: 'cotn_nazuna', name: 'Nazuna Nanakusa', 
    description: 'Vampira noturna. Adora piadas sujas, cerveja e a liberdade da noite. "Satisfeito?"', 
    rarity: 'legendary', collection: 'call_of_the_night', icon: '🦷',
    stats: { str: 9, int: 6, agi: 10 }
  },
  { 
    id: 'cotn_kou', name: 'Kou Yamori', 
    description: 'O insone. Finge dormir para enganar o mundo, mas vive de verdade quando o sol se põe.', 
    rarity: 'legendary', collection: 'call_of_the_night', icon: '🌙',
    stats: { str: 6, int: 9, agi: 8 }
  },

  // Rares (Original Characters fitting the lore)
  { 
    id: 'cotn_akira', name: 'Akira, Neon Drifter', 
    description: 'Um entregador que corre pelas ruas iluminadas apenas por neon. Nunca para.', 
    rarity: 'rare', collection: 'call_of_the_night', icon: '🏍️',
    stats: { str: 4, int: 5, agi: 9 }
  },
  { 
    id: 'cotn_yumi', name: 'Yumi da Loja 24h', 
    description: 'Vê tudo o que acontece no distrito comercial às 3 da manhã. Nada a surpreende.', 
    rarity: 'rare', collection: 'call_of_the_night', icon: '🏪',
    stats: { str: 3, int: 8, agi: 4 }
  },
  { 
    id: 'cotn_kenshin', name: 'Kenshin, o Detetive', 
    description: 'Investiga casos que a polícia diurna ignora. Fuma demais.', 
    rarity: 'rare', collection: 'call_of_the_night', icon: '🕵️',
    stats: { str: 6, int: 7, agi: 3 }
  },

  // Commons (Atmosphere builders)
  { 
    id: 'cotn_c1', name: 'Lata de Cerveja Vazia', 
    description: 'Resto de uma conversa profunda em cima de um viaduto.', 
    rarity: 'common', collection: 'call_of_the_night', icon: '🍺',
    stats: { str: 1, int: 1, agi: 1 }
  },
  { 
    id: 'cotn_c2', name: 'Walkman Retrô', 
    description: 'Tocando City Pop enquanto o mundo dorme.', 
    rarity: 'common', collection: 'call_of_the_night', icon: '🎧',
    stats: { str: 1, int: 3, agi: 2 }
  },
  { 
    id: 'cotn_c3', name: 'Gato de Rua', 
    description: 'O único que te julga silenciosamente no beco.', 
    rarity: 'common', collection: 'call_of_the_night', icon: '🐈',
    stats: { str: 1, int: 2, agi: 4 }
  },
  { 
    id: 'cotn_c4', name: 'Máquina de Vendas', 
    description: 'O farol dos insones. Sua luz zumbindo é reconfortante.', 
    rarity: 'common', collection: 'call_of_the_night', icon: '💡',
    stats: { str: 0, int: 0, agi: 5 }
  },
  { 
    id: 'cotn_c5', name: 'O Salaryman Bêbado', 
    description: 'Perdeu o último trem. De novo.', 
    rarity: 'common', collection: 'call_of_the_night', icon: '👔',
    stats: { str: 2, int: 0, agi: 0 }
  },
];

export const pullGacha = (): Collectible => {
  const rand = Math.random();
  let pool: Collectible[] = [];

  if (rand < 0.6) {
    // 60% Common
    pool = COLLECTIBLES.filter(c => c.rarity === 'common');
  } else if (rand < 0.9) {
    // 30% Rare
    pool = COLLECTIBLES.filter(c => c.rarity === 'rare');
  } else {
    // 10% Legendary
    pool = COLLECTIBLES.filter(c => c.rarity === 'legendary');
  }

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
};