import { Collectible } from '../types';

import { BATCH_ORIGINAL_18 } from './cards/batch_original_18';
import { BATCH_NEON_JOY } from './cards/batch_neon_joy';

export const GACHA_COST = 100;
export const BONUS_CREDITS = 33;

export const COLLECTIBLES: Collectible[] = [
  ...BATCH_ORIGINAL_18,
  ...BATCH_NEON_JOY,
  // --- LEGENDARY (3) ---
  { 
    id: 'hdn_nazuna', name: 'Nazuna Nanakusa', 
    description: 'Vampira noturna. Adora piadas sujas, cerveja e a liberdade da noite.', 
    rarity: 'legendary', collection: 'historias-da-noite', icon: '🦷',
    image: '/cards/historias-da-noite/cotn_nazuna.jpg',
    stats: { str: 9, int: 6, agi: 10 }
  },
  { 
    id: 'hdn_kou', name: 'Kou Yamori', 
    description: 'O insone. Finge dormir para enganar o mundo, mas vive de verdade quando o sol se põe.', 
    rarity: 'legendary', collection: 'historias-da-noite', icon: '🌙',
    image: '/cards/historias-da-noite/cotn_kou.jpg',
    stats: { str: 6, int: 9, agi: 8 }
  },
  {
    id: 'hn_l_01', name: 'O Regente de Neon',
    description: 'Senhor dos vampiros do distrito central. Governa das sombras.',
    rarity: 'legendary', collection: 'historias-da-noite', icon: '🧛',
    image: '/cards/historias-da-noite/hn_l_01.jpg',
    stats: { str: 9, int: 8, agi: 9 }
  },

  // --- EPIC (3) ---
  {
    id: 'hn_e_01', name: 'Lâmina do Crepúsculo',
    description: 'Um katana vibratória capaz de cortar até ligas de titânio reforçado.',
    rarity: 'epic', collection: 'historias-da-noite', icon: '🗡️',
    image: '/cards/historias-da-noite/hn_l_02.jpg', // Using l_02 as placeholder for epic weapon/char
    stats: { str: 8, int: 2, agi: 6 }
  },
  {
    id: 'hn_e_02', name: 'Chipset Proibido',
    description: 'Hardware ilegal contendo algoritmos de descodificação militar.',
    rarity: 'epic', collection: 'historias-da-noite', icon: '💾',
    image: '/cards/historias-da-noite/hn_l_03.jpg', // Placeholder
    stats: { str: 1, int: 9, agi: 3 }
  },
  {
    id: 'hn_e_03', name: 'Barman Alquimista',
    description: 'Serve drinks que curam o corpo ou envenenam a mente.',
    rarity: 'epic', collection: 'historias-da-noite', icon: '🍸',
    image: '/cards/historias-da-noite/cotn_yumi.jpg', // Reusing yumi as she fits barman/shop vibe
    stats: { str: 5, int: 7, agi: 5 }
  },

  // --- RARE (5) ---
  { 
    id: 'hdn_akira', name: 'Akira, Neon Drifter', 
    description: 'Um entregador que corre pelas ruas iluminadas apenas por neon.', 
    rarity: 'rare', collection: 'historias-da-noite', icon: '🏍️',
    image: '/cards/historias-da-noite/cotn_akira.jpg',
    stats: { str: 4, int: 5, agi: 9 }
  },
  { 
    id: 'hdn_yumi_shop', name: 'Yumi da Loja 24h', 
    description: 'Vê tudo o que acontece no distrito comercial às 3 da manhã.', 
    rarity: 'rare', collection: 'historias-da-noite', icon: '🏪',
    image: '/cards/historias-da-noite/cotn_yumi.jpg',
    stats: { str: 3, int: 8, agi: 4 }
  },
  { 
    id: 'hdn_kenshin', name: 'Kenshin, o Detetive', 
    description: 'Investiga casos que a polícia diurna ignora. Fuma demais.', 
    rarity: 'rare', collection: 'historias-da-noite', icon: '🕵️',
    image: '/cards/historias-da-noite/hn_r_07.jpg',
    stats: { str: 6, int: 7, agi: 3 }
  },
  {
    id: 'hn_r_01', name: 'Turno da noite',
    description: 'Sempre acordado, vendo o que a noite esconde.',
    rarity: 'rare', collection: 'historias-da-noite', icon: '🔦',
    image: '/cards/historias-da-noite/hn_r_01.jpg',
    stats: { str: 2, int: 5, agi: 3 }
  },
  {
    id: 'hn_r_02', name: 'Gato de Neon',
    description: 'Um guia silencioso pelas ruas chuvosas.',
    rarity: 'rare', collection: 'historias-da-noite', icon: '🐈',
    image: '/cards/historias-da-noite/hn_r_02.jpg',
    stats: { str: 1, int: 3, agi: 9 }
  },

  // --- COMMON (7) ---
  { 
    id: 'hdn_c1', name: 'Lata de Cerveja', 
    description: 'Resto de uma conversa profunda em cima de um viaduto.', 
    rarity: 'common', collection: 'historias-da-noite', icon: '🍺',
    image: '/cards/historias-da-noite/hn_c_02.jpg',
    stats: { str: 1, int: 1, agi: 1 }
  },
  { 
    id: 'hdn_c2', name: 'Walkman Retrô', 
    description: 'Tocando City Pop enquanto o mundo dorme.', 
    rarity: 'common', collection: 'historias-da-noite', icon: '🎧',
    image: '/cards/historias-da-noite/hn_r_03.jpg', // Using r_03 walkman
    stats: { str: 1, int: 3, agi: 2 }
  },
  { 
    id: 'hdn_c3', name: 'Gato de Rua', 
    description: 'O único que te julga silenciosamente no beco.', 
    rarity: 'common', collection: 'historias-da-noite', icon: '🐈',
    image: '/cards/historias-da-noite/hn_c_03.jpg', // Using c_03 as generic night object
    stats: { str: 1, int: 2, agi: 4 }
  },
  { 
    id: 'hdn_c4', name: 'Máquina de Vendas', 
    description: 'O farol dos insones. Sua luz zumbindo é reconfortante.', 
    rarity: 'common', collection: 'historias-da-noite', icon: '💡',
    image: '/cards/historias-da-noite/hn_r_06.jpg', // Machine
    stats: { str: 0, int: 0, agi: 5 }
  },
  { 
    id: 'hdn_c5', name: 'Salaryman Bêbado', 
    description: 'Perdeu o último trem. De novo.', 
    rarity: 'common', collection: 'historias-da-noite', icon: '👔',
    image: '/cards/historias-da-noite/hn_c_01.jpg', // Bench as symbol
    stats: { str: 2, int: 0, agi: 0 }
  },
  {
    id: 'hn_c_01', name: 'Banco Solitário',
    description: 'Testemunha silenciosa de muitas histórias.',
    rarity: 'common', collection: 'historias-da-noite', icon: '🪑',
    image: '/cards/historias-da-noite/hn_c_01.jpg',
    stats: { str: 1, int: 1, agi: 0 }
  },
  {
    id: 'hn_c_03', name: 'Poste Piscando',
    description: 'A luz que falha, mas insiste em iluminar.',
    rarity: 'common', collection: 'historias-da-noite', icon: '💡',
    image: '/cards/historias-da-noite/hn_c_03.jpg',
    stats: { str: 0, int: 0, agi: 2 }
  }
];

export const pullGacha = (): Collectible => {
  const rand = Math.random();
  let pool: Collectible[] = [];

  // Probabilities:
  // Legendary: 5% (0.95 - 1.0)
  // Epic: 15% (0.80 - 0.95)
  // Rare: 30% (0.50 - 0.80)
  // Common: 50% (0.00 - 0.50)

  if (rand < 0.50) {
    pool = COLLECTIBLES.filter(c => c.rarity === 'common');
  } else if (rand < 0.80) {
    pool = COLLECTIBLES.filter(c => c.rarity === 'rare');
  } else if (rand < 0.95) {
    pool = COLLECTIBLES.filter(c => c.rarity === 'epic');
    if (pool.length === 0) pool = COLLECTIBLES.filter(c => c.rarity === 'rare');
  } else {
    pool = COLLECTIBLES.filter(c => c.rarity === 'legendary');
    if (pool.length === 0) pool = COLLECTIBLES.filter(c => c.rarity === 'epic');
  }

  // Fallback safe
  if (pool.length === 0) {
    pool = COLLECTIBLES.filter(c => c.rarity === 'common');
  }

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
};
