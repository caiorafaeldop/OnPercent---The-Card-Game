import { pool, isDatabaseMode } from './db.js';

export interface DevotionalSeed {
  id: string;
  theme: string;
  verseReference: string;
  verseText: string;
  reflectionPrompt: string;
}

export const INITIAL_DEVOTIONALS: DevotionalSeed[] = [
  {
    id: 'dev-1',
    theme: 'Amar o Próximo',
    verseReference: '1 João 4:11',
    verseText: 'Amados, visto que Deus nos amou de tal maneira, nós também devemos amar-nos uns aos outros.',
    reflectionPrompt: 'Como podemos demonstrar esse amor de forma prática nas pequenas atitudes do nosso dia a dia?'
  },
  {
    id: 'dev-2',
    theme: 'União & Aliança no Casal',
    verseReference: 'Eclesiastes 4:12',
    verseText: 'Um homem sozinho pode ser vencido, mas dois conseguem defender-se. O cordão de três dobras não se rompe com facilidade.',
    reflectionPrompt: 'De que forma colocamos Deus como o terceiro elo da nossa aliança nas decisões de hoje?'
  },
  {
    id: 'dev-3',
    theme: 'Paz & Confiança',
    verseReference: 'Filipenses 4:6-7',
    verseText: 'Não andem ansiosos por coisa alguma, mas em tudo, pela oração e supirações, com ação de graças, apresentem seus pedidos a Deus. E a paz de Deus guardará os seus corações.',
    reflectionPrompt: 'Existe alguma preocupação que precisamos entregar juntos em oração agora?'
  },
  {
    id: 'dev-4',
    theme: 'Sabedoria & Discernimento',
    verseReference: 'Tiago 1:5',
    verseText: 'Se algum de vocês tem falta de sabedoria, peça-a a Deus, que a todos dá livremente e de boa vontade; e lhe será dada.',
    reflectionPrompt: 'Em qual decisão do nosso futuro precisamos buscar mais a direção do Senhor?'
  },
  {
    id: 'dev-5',
    theme: 'Graça & Perdão',
    verseReference: 'Colossenses 3:13',
    verseText: 'Suportem-se uns aos outros e perdoem-se mutuamente, caso alguém tenha queixa contra outro. Como o Senhor os perdoou, perdoem também vocês.',
    reflectionPrompt: 'Como o exercício diário do perdão e da paciência fortalece a nossa caminhada?'
  },
  {
    id: 'dev-6',
    theme: 'Fruto do Espírito & Paciência',
    verseReference: 'Gálatas 5:22-23',
    verseText: 'Mas o fruto do Espírito é: amor, alegria, paz, paciência, amabilidade, bondade, fidelidade, mansidão e domínio próprio.',
    reflectionPrompt: 'Qual dessas virtudes do Espírito queremos cultivar com mais atenção nesta semana?'
  },
  {
    id: 'dev-7',
    theme: 'Paciência & Calma no Lar',
    verseReference: 'Provérbios 15:1',
    verseText: 'A resposta branda desvia o furor, mas a palavra dura suscita a ira.',
    reflectionPrompt: 'Como responder com mansidão e amor nos momentos de cansaço ou correria?'
  },
  {
    id: 'dev-8',
    theme: 'Fidelidade & Lealdade',
    verseReference: 'Provérbios 3:3-4',
    verseText: 'Não permita que o amor e a fidelidade o abandonem; ative-os ao redor do seu pescoço, escreva-os na tábua do seu coração.',
    reflectionPrompt: 'De que maneira honramos nossa fidelidade um ao outro nas escolhas diárias?'
  },
  {
    id: 'dev-9',
    theme: 'Fé & Perseverança',
    verseReference: 'Hebreus 11:1',
    verseText: 'Ora, a fé é a certeza de coisas que se esperam, a convicção de fatos que se não vêem.',
    reflectionPrompt: 'O que estamos esperando em fé que podemos consagrar juntos ao Senhor hoje?'
  },
  {
    id: 'dev-10',
    theme: 'Serviço & Humildade',
    verseReference: 'Marcos 10:45',
    verseText: 'Pois nem mesmo o Filho do homem veio para ser servido, mas para servir e dar a sua vida em resgate por muitos.',
    reflectionPrompt: 'Como podemos servir com amor um ao outro dentro de casa hoje?'
  },
  {
    id: 'dev-11',
    theme: 'Gratidão no Coração',
    verseReference: '1 Tessalonicenses 5:18',
    verseText: 'Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.',
    reflectionPrompt: 'Quais são as três maiores bênçãos da nossa caminhada pelas quais agradecemos a Deus hoje?'
  },
  {
    id: 'dev-12',
    theme: 'Renovação da Mente',
    verseReference: 'Romanos 12:2',
    verseText: 'E não vos conformeis com este século, mas transformai-vos pela renovação da vossa mente.',
    reflectionPrompt: 'Como filtramos nossos pensamentos e conversas para edificar o nosso lar?'
  },
  {
    id: 'dev-13',
    theme: 'Proteção & Refúgio Divino',
    verseReference: 'Salmo 91:1-2',
    verseText: 'Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará. Direi do Senhor: Ele é o meu refúgio e a minha fortaleza.',
    reflectionPrompt: 'Como colocar a nossa vida e o nosso futuro debaixo da proteção do Pai?'
  },
  {
    id: 'dev-14',
    theme: 'Alegria no Senhor',
    verseReference: 'Neemias 8:10',
    verseText: 'A alegria do Senhor é a vossa força.',
    reflectionPrompt: 'O que traz alegria leve e sincera para a nossa convivência e como cultivar mais esse riso juntos?'
  },
  {
    id: 'dev-15',
    theme: 'Verdade & Transparência',
    verseReference: 'Efésios 4:25',
    verseText: 'Por isso, deixando a mentira, fale cada um a verdade com o seu próximo, porque somos membros uns dos outros.',
    reflectionPrompt: 'Como a transparência total fortalece a nossa confiança diária?'
  },
  {
    id: 'dev-16',
    theme: 'Esperança & Futuro',
    verseReference: 'Jeremias 29:11',
    verseText: 'Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.',
    reflectionPrompt: 'Quais são os sonhos do nosso futuro que entregamos com paz nas mãos de Deus?'
  },
  {
    id: 'dev-17',
    theme: 'Oração em Todo Tempo',
    verseReference: '1 Tessalonicenses 5:17',
    verseText: 'Orai sem cessar.',
    reflectionPrompt: 'Como transformar nossos momentos normais do dia em breves orações de comunhão com Deus?'
  },
  {
    id: 'dev-18',
    theme: 'Gentileza & Compaixão',
    verseReference: 'Efésios 4:32',
    verseText: 'Antes, sede uns para com os outros benignos, compassivos, perdoando-vos uns aos outros, como também Deus vos perdoou em Cristo.',
    reflectionPrompt: 'Qual pequeno gesto de gentileza podemos fazer surpresa um para o outro hoje?'
  },
  {
    id: 'dev-19',
    theme: 'Generosidade & Compartilhar',
    verseReference: 'Hebreus 13:16',
    verseText: 'Não se esqueçam de fazer o bem e de compartilhar com os outros, pois de tais sacrifícios Deus se agrada.',
    reflectionPrompt: 'Como podemos abençoar a vida de alguém ao nosso redor como casal?'
  },
  {
    id: 'dev-20',
    theme: 'Luz no Mundo',
    verseReference: 'Mateus 5:16',
    verseText: 'Assim resplandeça a vossa luz diante dos homens, para que vejam as vossas boas obras e glorifiquem a vosso Pai, que está nos céus.',
    reflectionPrompt: 'Como o nosso testemunho de amor e respeito pode inspirar as pessoas à nossa volta?'
  },
  {
    id: 'dev-21',
    theme: 'Descanso & Cuidado Divino',
    verseReference: 'Mateus 11:28',
    verseText: 'Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.',
    reflectionPrompt: 'Como podemos desacelerar a rotina e encontrar descanso em Deus juntos hoje?'
  }
];


export async function seedDevotionals() {
  if (!isDatabaseMode || !pool) return;

  try {
    const client = await pool.connect();
    try {
      for (const dev of INITIAL_DEVOTIONALS) {
        await client.query(
          `INSERT INTO devotionals (id, theme, verse_reference, verse_text, reflection_prompt)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO NOTHING`,
          [dev.id, dev.theme, dev.verseReference, dev.verseText, dev.reflectionPrompt]
        );
      }
      console.log('Devotional biblical seeds successfully verified / inserted.');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Failed to seed devotionals:', err);
  }
}
