import { Collectible } from '../../types';

export const BATCH_AG17: Collectible[] = [
  // --- COMMON (4) ---
  { 
    id: 'hn_ag17_common1', 
    name: 'Arcade Retro', 
    description: 'Uma máquina de arcade antiga brilhando suavemente em um canto escuro.', 
    rarity: 'common', 
    collection: 'historias-da-noite', 
    icon: '🕹️',
    image: '/cards/historias-da-noite/hn_ag17_common_1.jpg',
    stats: { str: 0, int: 2, agi: 2 }
  },
  { 
    id: 'hn_ag17_common2', 
    name: 'Bento da Meia-Noite', 
    description: 'Um bento de loja de conveniência esquecido em um banco de parque.', 
    rarity: 'common', 
    collection: 'historias-da-noite', 
    icon: '🍱',
    image: '/cards/historias-da-noite/hn_ag17_common_2.jpg',
    stats: { str: 1, int: 1, agi: 1 }
  },
  { 
    id: 'hn_ag17_common3', 
    name: 'Guarda-Chuva Esquecido', 
    description: 'Guarda-chuva de plástico transparente encostado em uma parede molhada.', 
    rarity: 'common', 
    collection: 'historias-da-noite', 
    icon: '☂️',
    image: '/cards/historias-da-noite/hn_ag17_common_3.jpg',
    stats: { str: 0, int: 1, agi: 2 }
  },
  { 
    id: 'hn_ag17_common4', 
    name: 'Grafite Neon', 
    description: 'Pichação brilhante em um muro de concreto em um beco.', 
    rarity: 'common', 
    collection: 'historias-da-noite', 
    icon: '🎨',
    image: '/cards/historias-da-noite/hn_ag17_common_4.jpg',
    stats: { str: 2, int: 2, agi: 1 }
  },

  // --- RARE (2) ---
  { 
    id: 'hn_ag17_rare1', 
    name: 'Táxi Fantasma', 
    description: 'Um táxi que aparece apenas para quem precisa escapar da realidade.', 
    rarity: 'rare', 
    collection: 'historias-da-noite', 
    icon: '🚕',
    image: '/cards/historias-da-noite/hn_ag17_rare_1.jpg',
    stats: { str: 4, int: 4, agi: 8 }
  },
  { 
    id: 'hn_ag17_rare2', 
    name: 'DJ do Subsolo', 
    description: 'Toca músicas que hipnotizam a multidão até o amanhecer.', 
    rarity: 'rare', 
    collection: 'historias-da-noite', 
    icon: '🎧',
    image: '/cards/historias-da-noite/hn_ag17_rare_2.jpg',
    stats: { str: 3, int: 8, agi: 5 }
  },

  // --- EPIC (1) ---
  { 
    id: 'hn_ag17_epic1', 
    name: 'Fantasma Digital', 
    description: 'Uma entidade que vive nos servidores abandonados da cidade.', 
    rarity: 'epic', 
    collection: 'historias-da-noite', 
    icon: '👾',
    image: '/cards/historias-da-noite/hn_ag17_epic_1.jpg',
    stats: { str: 5, int: 12, agi: 8 }
  }
];
