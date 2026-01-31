import { Collectible } from '../../types';

export const BATCH_NEON_JOY: Collectible[] = [
  // --- EPIC (2) ---
  {
    id: 'hn_e_hina',
    name: 'Hina, a Idol Holográfica',
    description: 'A luz que nunca apaga. Seus shows espontâneos param o trânsito.',
    rarity: 'epic',
    collection: 'historias-da-noite',
    icon: '🎤',
    image: '/cards/historias-da-noite/hn_e_hina.jpg',
    stats: { str: 2, int: 7, agi: 10 }
  },
  {
    id: 'hn_e_kaito',
    name: 'DJ "Voltage" Kaito',
    description: 'O mestre da euforia. Controla as batidas do coração da cidade.',
    rarity: 'epic',
    collection: 'historias-da-noite',
    icon: '🎧',
    image: '/cards/historias-da-noite/hn_e_kaito.jpg',
    stats: { str: 4, int: 9, agi: 8 }
  },

  // --- RARE (4) ---
  {
    id: 'hn_r_horizon',
    name: 'Skater "Horizon"',
    description: 'Deslizando pelos trilhos de neon com um sorriso desafiador.',
    rarity: 'rare',
    collection: 'historias-da-noite',
    icon: '🛹',
    image: '/cards/historias-da-noite/hn_r_horizon.jpg',
    stats: { str: 5, int: 4, agi: 9 }
  },
  {
    id: 'hn_r_karaoke',
    name: 'Rainha do Karaoke',
    description: 'Não precisa de afinação quando se tem alma e amigos gritando junto.',
    rarity: 'rare',
    collection: 'historias-da-noite',
    icon: '🎵',
    image: '/cards/historias-da-noite/hn_r_karaoke.jpg',
    stats: { str: 3, int: 6, agi: 7 }
  },
  {
    id: 'hn_r_barista',
    name: 'Barista Speedster',
    description: 'Serve expressos e conselhos amorosos na velocidade da luz.',
    rarity: 'rare',
    collection: 'historias-da-noite',
    icon: '☕',
    image: '/cards/historias-da-noite/hn_r_barista.jpg',
    stats: { str: 2, int: 8, agi: 6 }
  },
  {
    id: 'hn_r_gamer',
    name: 'Gamer Pro "Pixel"',
    description: 'Campeã invicta do fliperama da esquina.',
    rarity: 'rare',
    collection: 'historias-da-noite',
    icon: '🎮',
    image: '/cards/historias-da-noite/hn_r_gamer.jpg',
    stats: { str: 1, int: 10, agi: 5 }
  },

  // --- COMMON (3) ---
  {
    id: 'hn_c_photobooth',
    name: 'Casal no Photobooth',
    description: 'Caretas, risadas e memórias impressas em adesivos.',
    rarity: 'common',
    collection: 'historias-da-noite',
    icon: '📸',
    image: '/cards/historias-da-noite/hn_c_photobooth.jpg',
    stats: { str: 1, int: 1, agi: 1 }
  },
  {
    id: 'hn_c_friends',
    name: 'Grupo de Ramen',
    description: 'Nada como macarrão quente e piadas internas às 3 da manhã.',
    rarity: 'common',
    collection: 'historias-da-noite',
    icon: '🍜',
    image: '/cards/historias-da-noite/hn_c_friends.jpg',
    stats: { str: 2, int: 1, agi: 1 }
  },
  {
    id: 'hn_c_dancer',
    name: 'Dançarino de Rua',
    description: 'Transformando a calçada em palco. A plateia adora.',
    rarity: 'common',
    collection: 'historias-da-noite',
    icon: '👟',
    image: '/cards/historias-da-noite/hn_c_dancer.jpg',
    stats: { str: 3, int: 2, agi: 4 }
  }
];
