import { Collectible } from '../../types';

export const BATCH_ORIGINAL_18: Collectible[] = [
  // --- EPIC (3) ---
  {
    id: 'hn_e_hacker',
    name: 'Hacker do Submundo',
    description: 'Deus em sua própria realidade digital, invisível nas ruas físicas.',
    rarity: 'epic',
    collection: 'historias-da-noite',
    icon: '💻',
    image: '/cards/historias-da-noite/hn_e_hacker.jpg',
    stats: { str: 2, int: 10, agi: 5 }
  },
  {
    id: 'hn_e_train',
    name: 'O Último Trem Fantasma',
    description: 'Passa pontualmente às 04:44. Dizem que leva para outra dimensão.',
    rarity: 'epic',
    collection: 'historias-da-noite',
    icon: '🚃',
    image: '/cards/historias-da-noite/hn_e_train.jpg',
    stats: { str: 8, int: 4, agi: 9 }
  },
  {
    id: 'hn_e_festival',
    name: 'Festival Noturno Secreto',
    description: 'Lanternas flutuantes em um santuário que não aparece no mapa.',
    rarity: 'epic',
    collection: 'historias-da-noite',
    icon: '🏮',
    image: '/cards/historias-da-noite/hn_e_festival.jpg',
    stats: { str: 4, int: 8, agi: 7 }
  },

  // --- RARE (5) ---
  {
    id: 'hn_r_skater',
    name: 'Skatista Solitário',
    description: 'O estacionamento vazio é seu palco e templo.',
    rarity: 'rare',
    collection: 'historias-da-noite',
    icon: '🛹',
    image: '/cards/historias-da-noite/hn_r_skater.jpg',
    stats: { str: 4, int: 3, agi: 9 }
  },
  {
    id: 'hn_r_busker',
    name: 'Saxofonista da Ponte',
    description: 'Toca jazz para o rio e para os fantasmas da cidade.',
    rarity: 'rare',
    collection: 'historias-da-noite',
    icon: '🎷',
    image: '/cards/historias-da-noite/hn_r_busker.jpg',
    stats: { str: 3, int: 8, agi: 4 }
  },
  {
    id: 'hn_r_window',
    name: 'A Janela Iluminada',
    description: 'Uma única luz acesa em um prédio de apartamentos. Quem está acordado?',
    rarity: 'rare',
    collection: 'historias-da-noite',
    icon: '🪟',
    image: '/cards/historias-da-noite/hn_r_window.jpg',
    stats: { str: 1, int: 9, agi: 1 }
  },
  {
    id: 'hn_r_fox',
    name: 'Raposa Urbana',
    description: 'Um relance de natureza selvagem no concreto.',
    rarity: 'rare',
    collection: 'historias-da-noite',
    icon: '🦊',
    image: '/cards/historias-da-noite/hn_r_fox.jpg',
    stats: { str: 2, int: 5, agi: 10 }
  },
  {
    id: 'hn_r_drone',
    name: 'Drone de Entrega Silencioso',
    description: 'Zumbindo suavemente com pacotes de origem duvidosa.',
    rarity: 'rare',
    collection: 'historias-da-noite',
    icon: '🛸',
    image: '/cards/historias-da-noite/hn_r_drone.jpg',
    stats: { str: 1, int: 7, agi: 8 }
  },

  // --- COMMON (10) ---
  {
    id: 'hn_c_umbrella',
    name: 'Guarda-Chuva Esquecido',
    description: 'Plástico transparente, abandonado sob a chuva fina.',
    rarity: 'common',
    collection: 'historias-da-noite',
    icon: '☂️',
    image: '/cards/historias-da-noite/hn_c_umbrella.jpg',
    stats: { str: 0, int: 1, agi: 1 }
  },
  {
    id: 'hn_c_ramen',
    name: 'Cup Noodles às 4AM',
    description: 'O combustível dos insones e programadores.',
    rarity: 'common',
    collection: 'historias-da-noite',
    icon: '🍜',
    image: '/cards/historias-da-noite/hn_c_ramen.jpg',
    stats: { str: 1, int: 2, agi: 0 }
  },
  {
    id: 'hn_c_taxi',
    name: 'Taxista Noturno',
    description: 'Fumando um cigarro enquanto espera a próxima corrida.',
    rarity: 'common',
    collection: 'historias-da-noite',
    icon: '🚕',
    image: '/cards/historias-da-noite/hn_c_taxi.jpg',
    stats: { str: 2, int: 2, agi: 4 }
  },
  {
    id: 'hn_c_open24h',
    name: 'Sinal Aberto 24h',
    description: 'Neon zumbindo. A promessa de café e abrigo.',
    rarity: 'common',
    collection: 'historias-da-noite',
    icon: '🏪',
    image: '/cards/historias-da-noite/hn_c_open24h.jpg',
    stats: { str: 0, int: 0, agi: 0 }
  },
  {
    id: 'hn_c_owl',
    name: 'Coruja no Fio',
    description: 'Vigiando a rua vazia do alto.',
    rarity: 'common',
    collection: 'historias-da-noite',
    icon: '🦉',
    image: '/cards/historias-da-noite/hn_c_owl.jpg',
    stats: { str: 1, int: 3, agi: 3 }
  },
  {
    id: 'hn_c_bike',
    name: 'Bicicleta Acorrentada',
    description: 'Esquecida no poste há dias, talvez meses.',
    rarity: 'common',
    collection: 'historias-da-noite',
    icon: '🚲',
    image: '/cards/historias-da-noite/hn_c_bike.jpg',
    stats: { str: 2, int: 0, agi: 0 }
  },
  {
    id: 'hn_c_trash',
    name: 'Saco de Lixo Misterioso',
    description: 'O que será que tem dentro? Melhor não saber.',
    rarity: 'common',
    collection: 'historias-da-noite',
    icon: '🗑️',
    image: '/cards/historias-da-noite/hn_c_trash.jpg',
    stats: { str: 1, int: 0, agi: 1 }
  },
  {
    id: 'hn_c_phone',
    name: 'Orelhão Tocando',
    description: 'Quem estaria ligando a esta hora em uma cabine vazia?',
    rarity: 'common',
    collection: 'historias-da-noite',
    icon: '☎️',
    image: '/cards/historias-da-noite/hn_c_phone.jpg',
    stats: { str: 0, int: 2, agi: 0 }
  },
  {
    id: 'hn_c_graffiti',
    name: 'Grafite Ainda Fresco',
    description: 'O artista acabou de sair correndo.',
    rarity: 'common',
    collection: 'historias-da-noite',
    icon: '🎨',
    image: '/cards/historias-da-noite/hn_c_graffiti.jpg',
    stats: { str: 1, int: 3, agi: 2 }
  },
  {
    id: 'hn_c_manga',
    name: 'Lendo Mangá em Pé',
    description: 'Aproveitando o ar condicionado da loja de conveniência.',
    rarity: 'common',
    collection: 'historias-da-noite',
    icon: '📖',
    image: '/cards/historias-da-noite/hn_c_manga.jpg',
    stats: { str: 0, int: 3, agi: 0 }
  }
];
