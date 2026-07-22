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
