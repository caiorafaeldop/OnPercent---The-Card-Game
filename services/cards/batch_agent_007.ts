import { Collectible } from '../../types';

export const batch_agent_007: Collectible[] = [
  // --- COMMON (4) ---
  {
    id: 'hn_x401_common',
    name: 'Noren do Ramen',
    description: 'A cortina que separa o frio da rua do calor da sopa.',
    rarity: 'common',
    collection: 'historias-da-noite',
    icon: '🍜',
    image: '/cards/historias-da-noite/hn_x401_common.jpg',
    stats: { str: 1, int: 1, agi: 2 } // Total: 4
  },
  {
    id: 'hn_x402_common',
    name: 'Bicicleta Esquecida',
    description: 'Encostada na grade há dias, esperando seu dono voltar.',
    rarity: 'common',
    collection: 'historias-da-noite',
    icon: '🚲',
    image: '/cards/historias-da-noite/hn_x402_common.jpg',
    stats: { str: 2, int: 1, agi: 2 } // Total: 5
  },
  {
    id: 'hn_x403_common',
    name: 'Reflexo na Poça',
    description: 'Onde o neon brilha mais forte que no céu.',
    rarity: 'common',
    collection: 'historias-da-noite',
    icon: '💧',
    image: '/cards/historias-da-noite/hn_x403_common.jpg',
    stats: { str: 0, int: 3, agi: 2 } // Total: 5
  },
  {
    id: 'hn_x404_common',
    name: 'Balanço Vazio',
    description: 'Rangendo suavemente com o vento da madrugada.',
    rarity: 'common',
    collection: 'historias-da-noite',
    icon: '🎠',
    image: '/cards/historias-da-noite/hn_x404_common.jpg',
    stats: { str: 1, int: 2, agi: 1 } // Total: 4
  },

  // --- RARE (2) ---
  {
    id: 'hn_x501_rare',
    name: 'Caixa D\'água',
    description: 'Observadora silenciosa no topo do prédio mais antigo.',
    rarity: 'rare',
    collection: 'historias-da-noite',
    icon: '🏢',
    image: '/cards/historias-da-noite/hn_x501_rare.jpg',
    stats: { str: 5, int: 5, agi: 6 } // Total: 16
  },
  {
    id: 'hn_x502_rare',
    name: 'Atendente da Madrugada',
    description: 'Ele sabe quem você é pelo que você compra às 3 da manhã.',
    rarity: 'rare',
    collection: 'historias-da-noite',
    icon: '🏪',
    image: '/cards/historias-da-noite/hn_x502_rare.jpg',
    stats: { str: 3, int: 10, agi: 2 } // Total: 15
  },

  // --- EPIC (1) ---
  {
    id: 'hn_x601_epic',
    name: 'O Vigilante',
    description: 'Aquele que observa a cidade quando ninguém mais está olhando.',
    rarity: 'epic',
    collection: 'historias-da-noite',
    icon: '👁️',
    image: '/cards/historias-da-noite/hn_x601_epic.jpg',
    stats: { str: 8, int: 10, agi: 9 } // Total: 27
  }
];
