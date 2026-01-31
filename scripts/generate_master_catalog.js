import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BATCH_ORIGINAL_18 } from '../services/cards/batch_original_18';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promptsFile = path.join(__dirname, '../100_prompts.md');
const outputFile = path.join(__dirname, '../services/cards/master_collection.ts');

// --- 1. THE CREATIVE ENGINE ---
// Keyword mappings to generate Title/Description templates
const dictionary = [
    { keys: ['rain', 'umbrella', 'wet'], title: ['Reflexos da Chuva', 'Guarda-Chuva Solitário', 'Tempestade de Neon', 'Lágrimas do Céu'], desc: ['A chuva lava tudo, menos as memórias.', 'O som da água acalma a alma inquieta.', 'Sob o guarda-chuva, um mundo particular.'] },
    { keys: ['motorcycle', 'bike', 'vehicle'], title: ['Cavaleiro de Neon', 'Rota de Fuga', 'Velocidade Noturna', 'Entrega Expressa'], desc: ['Correndo contra o tempo e as luzes.', 'O motor ruge em harmonia com a cidade.', 'Nenhum destino é longe demais à noite.'] },
    { keys: ['cat', 'kitten', 'pet'], title: ['Guardião dos Becos', 'Gato de Neon', 'Observador Silencioso', 'Amigo Noturno'], desc: ['Nenhum segredo escapa aos seus olhos brilhantes.', 'Um companheiro fiel nas ruas solitárias.', 'O verdadeiro dono da cidade.'] },
    { keys: ['vending', 'machine', 'soda'], title: ['Luz da Máquina', 'Pausa para o Café', 'Oásis Urbano', 'Energia Enlatada'], desc: ['O zumbido elétrico é a música da noite.', 'Um momento de paz iluminado pelo neon.', 'Combustível para quem não dorme.'] },
    { keys: ['train', 'metro', 'subway'], title: ['Último Vagão', 'Viagem sem Fim', 'Trilhos do Destino', 'Passageiro da Noite'], desc: ['O balanço do trem nina os insones.', 'Para onde vamos quando o mundo dorme?', 'Estações passam como sonhos.'] },
    { keys: ['food', 'ramen', 'eating', 'chef'], title: ['Sabor da Noite', 'Banquete Noturno', 'Chef das Sombras', 'Conforto na Tigela'], desc: ['O calor da comida aquece o coração frio.', 'Sabores que só existem depois da meia-noite.', 'A melhor refeição é aquela compartilhada.'] },
    { keys: ['game', 'arcade', 'playing'], title: ['Jogador Nº 1', 'High Score', 'Desafio Pixelado', 'Realidade Virtual'], desc: ['Na tela, a vida é mais colorida.', 'Vencendo monstros digitais e reais.', 'Apenas mais uma ficha para a eternidade.'] },
    { keys: ['couple', 'love', 'together'], title: ['Romance de Neon', 'Promessa Noturna', 'Dois Mundos', 'Encontro Marcado'], desc: ['Mãos dadas sob luzes artificiais.', 'O amor floresce no asfalto molhado.', 'Juntos contra a escuridão.'] },
    { keys: ['studying', 'book', 'reading'], title: ['Estudante da Madrugada', 'Biblioteca Silenciosa', 'Saber Oculto', 'Página Virada'], desc: ['O conhecimento não tem horário.', 'Palavras dançam à luz da luminária.', 'Estudando os segredos do universo.'] },
    { keys: ['music', 'guitar', 'headphones'], title: ['Melodia da Noite', 'Ritmo Urbano', 'Show Solitário', 'Fones de Ouvido'], desc: ['A trilha sonora perfeita para a insônia.', 'Notas que ecoam pelos becos vazios.', 'Música alta, mundo mudo.'] },
    { keys: ['sword', 'weapon', 'katana'], title: ['Lâmina Oculta', 'Guerreira Urbana', 'Corte de Luz', 'Defensora'], desc: ['Afiada como o vento da meia-noite.', 'Protegendo o que restou da honra.', 'Aço e neon, uma dança mortal.'] },
    { keys: ['moon', 'sky'], title: ['Filha da Lua', 'Luar Eterno', 'Céu Púrpura', 'Olhar Celeste'], desc: ['A lua é a única testemunha.', 'Olhando para cima, esquecemos o chão.', 'A noite é um manto de estrelas.'] }
];

const defaultThemes = {
    title: ['Habitante da Noite', 'Sombra Passageira', 'Luz Distante', 'Alma Urbana', 'Espectro de Neon'],
    desc: ['Caminhando sem destino pelas ruas iluminadas.', 'A cidade nunca dorme, e nós também não.', 'Procurando algo que talvez não exista.', 'Apenas mais uma história na multidão.']
};

function generateCreativeData(promptText, index) {
    const lowerPrompt = promptText.toLowerCase();
    
    // Check specific known IDs first (The "Famous 10")
    if (index === 1) return { name: "Nazuna das Alturas", desc: "A vampira que observa a cidade do alto de sua torre de água. A noite é seu domínio e liberdade." };
    if (index === 2) return { name: "Kaito o Sedento", desc: "Sempre encostado naquela vending machine azul. Dizem que ele nunca comprou nada, apenas observa." };
    if (index === 3) return { name: "Akane a Veloz", desc: "Um borrão ciano e rosa nas ruas chuvosas. Ninguém pega essa motoqueira." };
    if (index === 4) return { name: "Chef Hiro", desc: "O mestre das chamas da madrugada. Seu wok conta histórias que os clientes esquecem pela manhã." };
    if (index === 5) return { name: "Yuki a Insone", desc: "Estudando enquanto o mundo sonha. A luz azul da janela é sua única companhia." };
    if (index === 6) return { name: "Sora a Dançarina", desc: "Ela dança no topo do mundo, onde o ar é rarefeito e a música é o vento." };
    if (index === 7) return { name: "O Encantador", desc: "Os gatos de rua o seguem como um rei silencioso. Ele fala a língua dos becos." };
    if (index === 8) return { name: "Sato do Trem", desc: "O passageiro perpétuo. Dorme em Shinjuku, acorda em Shibuya, e repete." };
    if (index === 9) return { name: "Rivals de Neon", desc: "A disputa pelo maior placar nunca termina. O arcade é o campo de batalha deles." };
    if (index === 10) return { name: "Gangue da Konbini", desc: "Sorvete às 3 da manhã com os melhores amigos. Momentos que valem mais que ouro." };

    // General Logic
    for (const entry of dictionary) {
        if (entry.keys.some(k => lowerPrompt.includes(k))) {
            const t = entry.title[Math.floor(Math.random() * entry.title.length)];
            const d = entry.desc[Math.floor(Math.random() * entry.desc.length)];
            // Add a slight randomization to titles to avoid duplicates based on index
            return { name: `${t}`, desc: d };
        }
    }

    // Default
    const defaultT = defaultThemes.title[index % defaultThemes.title.length];
    const defaultD = defaultThemes.desc[index % defaultThemes.desc.length];
    return { name: `${defaultT}`, desc: defaultD };
}

// --- 2. PROCESSING ---

const content = fs.readFileSync(promptsFile, 'utf8');
const chunks = content.split('###').slice(1); // Skip header

const masterCollection = [];

// Track used names to ensure uniqueness
const usedNames = new Set();
// Add existing names from BATCH_ORIGINAL_18 to usedNames
BATCH_ORIGINAL_18.forEach(c => usedNames.add(c.name));

chunks.forEach((chunk, i) => {
    const cardIndex = i + 1;
    const lines = chunk.trim().split('\n');
    let promptText = "";
    
    // Extract prompt text
    lines.forEach(line => {
        if (line.trim().startsWith('>')) {
            promptText += line.replace('>', '').trim() + " ";
        }
    });

    const creative = generateCreativeData(promptText, cardIndex);
    
    // Uniqueness Enforcer
    let finalName = creative.name;
    if (usedNames.has(finalName)) {
        finalName = `${finalName} ${['I', 'II', 'III', 'IV', 'V'][cardIndex % 5]}`; // Add suffix if duplicate
    }
    usedNames.add(finalName);

    // Rarity Logic (Simple distribution)
    let rarity = 'common';
    if (cardIndex <= 3) rarity = 'legendary';
    else if (cardIndex <= 10) rarity = 'epic';
    else if (cardIndex <= 35) rarity = 'rare';

    // Image Path (Standardized)
    // Map hn_card_01 to hn_card_01.jpg
    const imageId = `hn_card_${cardIndex.toString().padStart(2, '0')}`;
    const imagePath = `/cards/historias-da-noite/${imageId}.jpg`;

    // Stats (Randomized slightly based on rarity)
    const baseStat = rarity === 'legendary' ? 8 : rarity === 'epic' ? 6 : rarity === 'rare' ? 4 : 1;
    const stats = {
        str: Math.max(0, baseStat + Math.floor(Math.random() * 3) - 1),
        int: Math.max(0, baseStat + Math.floor(Math.random() * 3) - 1),
        agi: Math.max(0, baseStat + Math.floor(Math.random() * 3) - 1)
    };

    masterCollection.push({
        id: imageId,
        name: finalName,
        description: creative.desc,
        rarity: rarity,
        collection: 'historias-da-noite',
        icon: '🌙', // Default icon, can be smarter but this is fine
        image: imagePath,
        stats: stats
    });
});

// --- 3. MERGING ---
// We append the BATCH_ORIGINAL_18 (The "Handmade" ones) to the end.
// Total cards = 100 (from generation) + 18 (handcrafted) = 118.
const finalCollection = [...masterCollection, ...BATCH_ORIGINAL_18];

// --- 4. OUTPUT ---
const tsContent = `import { Collectible } from '../../types';

export const HISTORIA_DA_NOITE_COLLECTION: Collectible[] = ${JSON.stringify(finalCollection, null, 2)};
`;

fs.writeFileSync(outputFile, tsContent);
console.log(`✅ Master Collection Generated with ${finalCollection.length} cards.`);
