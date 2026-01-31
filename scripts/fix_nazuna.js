import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetFile = path.join(__dirname, '../public/cards/historias-da-noite/hn_001.jpg');
const prompt = "nazuna nanakusa from call of the night, beautiful vampire girl with twin white braided pigtails, sitting on a high water tower at night, massive moon background, purple and blue night sky, neon lighting, flat 2D anime illustration, cel-shaded, masterpiece, high quality, accurate anatomy, symmetrical face";
const qualityBooster = ", cinematic lighting, crisp lines, 8k resolution, official art style --nologo --model flux";

const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + qualityBooster)}?width=800&height=1200&seed=${Math.floor(Math.random() * 1000000)}`;

console.log('Baixando imagem da Nazuna (hn_001)...');

const file = fs.createWriteStream(targetFile);
https.get(url, (response) => {
    if (response.statusCode !== 200) {
        console.error('Erro ao baixar:', response.statusCode);
        return;
    }
    response.pipe(file);
    file.on('finish', () => {
        file.close();
        console.log('✅ Nazuna (hn_001.jpg) salva com sucesso!');
    });
}).on('error', (err) => {
    fs.unlink(targetFile, () => {});
    console.error('Erro:', err.message);
});
