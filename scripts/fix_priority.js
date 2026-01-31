import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, '../public/cards/historias-da-noite');

const priorityCards = [
    { id: 'hn_001', prompt: "nazuna nanakusa from call of the night, beautiful vampire girl with twin white braided pigtails, sitting on a high water tower at night, massive moon background, purple and blue night sky, neon lighting, flat 2D anime illustration, cel-shaded" },
    { id: 'hn_018', prompt: "beautiful anime girl with futuristic techwear, looking at viewer, vibrant neon city background, night time, (symmetrical face:1.2), perfect anatomy, flat 2D anime style, clean lines" },
    { id: 'hn_023', prompt: "cool anime boy with cat ears hoodie, mysterious look, standing in a rainy neon alley, puddles, (symmetrical face:1.2), perfect anatomy, flat 2D anime style, clean lines" }
];

const qualityBooster = ", cinematic lighting, crisp lines, masterpiece, --nologo --model flux";

async function download(id, prompt) {
    const filename = path.join(outputDir, `${id}.jpg`);
    const seed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + qualityBooster)}?width=800&height=1200&seed=${seed}`;
    
    return new Promise((resolve) => {
        const file = fs.createWriteStream(filename);
        https.get(url, (res) => {
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✅ ${id} baixado.`);
                resolve();
            });
        }).on('error', (err) => {
            console.error(`❌ Erro em ${id}:`, err.message);
            resolve();
        });
    });
}

(async () => {
    console.log('--- Iniciando Reparo Prioritário ---');
    for (const card of priorityCards) {
        await download(card.id, card.prompt);
    }
    console.log('--- Reparo Prioritário Concluído ---');
})();
