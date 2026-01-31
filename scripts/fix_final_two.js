import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, '../public/cards/historias-da-noite');

const targets = [
    { 
        id: 'hn_002', 
        prompt: "anime boy leaning on blue vending machine at night, drinking soda, street lights, reflection, kaito character, comfortable hoodie, flat 2D anime style, cel-shaded, masterpiece, sharp focus, --nologo" 
    },
    { 
        id: 'hn_003', 
        prompt: "anime girl biker, pink and cyan hair, riding futuristic motorcycle at night, motion blur background, neon city lights, leather jacket, akane character, dynamic angle, flat 2D anime style, cel-shaded, masterpiece, --nologo" 
    }
];

const qualityBooster = ", cinematic lighting, crisp lines, 8k resolution, --model flux";

async function download(item) {
    const filename = path.join(outputDir, `${item.id}.jpg`);
    const seed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(item.prompt + qualityBooster)}?width=800&height=1200&seed=${seed}`;
    
    console.log(`Downloading replacement for ${item.id}...`);
    
    return new Promise((resolve) => {
        const file = fs.createWriteStream(filename);
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                 console.error(`❌ Failed ${item.id}: ${res.statusCode}`);
                 resolve();
                 return;
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✅ ${item.id}.jpg fixed!`);
                resolve();
            });
        }).on('error', (err) => {
            console.error(`❌ Error ${item.id}:`, err.message);
            resolve();
        });
    });
}

(async () => {
    for (const item of targets) {
        await download(item);
    }
})();
