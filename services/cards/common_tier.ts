export interface Card {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  collection: string;
}

export const commonCards: Card[] = [
  {
    id: 'hn_c_01',
    name: 'Banco de Praça Solitário',
    description: 'Um banco de madeira vazio sob a luz vacilante de um poste. Testemunha silenciosa de muitas histórias.',
    image: '/cards/historias-da-noite/hn_c_01.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_02',
    name: 'Lata Esquecida',
    description: 'Uma lata de refrigerante amassada rolando pelo asfalto úmido. O som da cidade que nunca dorme.',
    image: '/cards/historias-da-noite/hn_c_02.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_03',
    name: 'Poste Piscando',
    description: 'A luz que falha, mas insiste em iluminar o beco escuro. Atraindo insetos noturnos.',
    image: '/cards/historias-da-noite/hn_c_03.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_04',
    name: 'Guarda-chuva Transparente',
    description: 'Esquecido na esquina em uma noite chuvosa. Reflete as luzes da cidade em suas gotas.',
    image: '/cards/historias-da-noite/hn_c_04.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_05',
    name: 'Gato da Meia-Noite',
    description: 'Um gato de rua preto com olhos brilhantes, observando tudo do alto do muro.',
    image: '/cards/historias-da-noite/hn_c_05.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_06',
    name: 'Janela Insone',
    description: 'A única luz acesa em um prédio escuro às 3 da manhã. Alguém estuda, trabalha ou sonha.',
    image: '/cards/historias-da-noite/hn_c_06.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_07',
    name: 'Bicicleta Encostada',
    description: 'Esperando seu dono do lado de fora da loja de conveniência.',
    image: '/cards/historias-da-noite/hn_c_07.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_08',
    name: 'Lixeira Urbana',
    description: 'Transbordando de vestígios da vida cotidiana. Beleza no caos.',
    image: '/cards/historias-da-noite/hn_c_08.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_09',
    name: 'Telefone Público',
    description: 'Uma relíquia de tempos passados, ainda de pé na esquina silenciosa.',
    image: '/cards/historias-da-noite/hn_c_09.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_10',
    name: 'Vending Machine',
    description: 'O brilho suave de uma máquina de venda automática na escuridão. Oásis noturno.',
    image: '/cards/historias-da-noite/hn_c_10.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_11',
    name: 'Ponto de Ônibus',
    description: 'Vazio, apenas com os horários rasgados colados no vidro.',
    image: '/cards/historias-da-noite/hn_c_11.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_12',
    name: 'Reflexo na Poça',
    description: 'O mundo invertido em uma poça d\'água após a chuva.',
    image: '/cards/historias-da-noite/hn_c_12.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_13',
    name: 'Placa Neon',
    description: 'Zumbindo baixinho, anunciando que está "ABERTO" para ninguém em particular.',
    image: '/cards/historias-da-noite/hn_c_13.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_14',
    name: 'Fones Esquecidos',
    description: 'Fones de ouvido emaranhados deixados em um banco. Que música tocava?',
    image: '/cards/historias-da-noite/hn_c_14.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_15',
    name: 'Tênis no Fio',
    description: 'Um par de tênis pendurado nos fios de eletricidade. Uma marca permanente no céu.',
    image: '/cards/historias-da-noite/hn_c_15.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_16',
    name: 'Saco Voando',
    description: 'Dançando ao vento como um fantasma urbano moderno.',
    image: '/cards/historias-da-noite/hn_c_16.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_17',
    name: 'Semáforo em Alerta',
    description: 'Piscando em amarelo intermitente para ruas desertas.',
    image: '/cards/historias-da-noite/hn_c_17.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_18',
    name: 'Carro Estacionado',
    description: 'Motor desligado, mas as luzes internas acesas. Alguém esperando.',
    image: '/cards/historias-da-noite/hn_c_18.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_19',
    name: 'Dança da Mariposa',
    description: 'Hipnotizada pela luz artificial, em um ciclo eterno.',
    image: '/cards/historias-da-noite/hn_c_19.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_20',
    name: 'Boca de Lobo',
    description: 'Vapor subindo lentamente em uma noite fria.',
    image: '/cards/historias-da-noite/hn_c_20.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_21',
    name: 'Grafite Fresco',
    description: 'Tinta ainda úmida em uma parede de tijolos. Arte anônima.',
    image: '/cards/historias-da-noite/hn_c_21.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_22',
    name: 'Café da Noite',
    description: 'Um copo de papel solitário deixado no parapeito.',
    image: '/cards/historias-da-noite/hn_c_22.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_23',
    name: 'Notícias de Ontem',
    description: 'Uma pilha de jornais amarrados esperando a coleta.',
    image: '/cards/historias-da-noite/hn_c_23.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_24',
    name: 'Olho Eletrônico',
    description: 'Câmera de segurança com seu LED vermelho, observando o nada.',
    image: '/cards/historias-da-noite/hn_c_24.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_25',
    name: 'Grades Fechadas',
    description: 'Portão de ferro fechado de uma loja. O dia acabou.',
    image: '/cards/historias-da-noite/hn_c_25.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_26',
    name: 'Jardim de Varanda',
    description: 'Um único vaso de planta tentando sobreviver na selva de pedra.',
    image: '/cards/historias-da-noite/hn_c_26.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_27',
    name: 'Rádio Estático',
    description: 'Um rádio antigo captando frequências perdidas.',
    image: '/cards/historias-da-noite/hn_c_27.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  },
  {
    id: 'hn_c_28',
    name: 'Luva Perdida',
    description: 'Uma única luva de lã caída na calçada. Onde está o par?',
    image: '/cards/historias-da-noite/hn_c_28.jpg',
    rarity: 'Common',
    collection: 'historias-da-noite'
  }
];
