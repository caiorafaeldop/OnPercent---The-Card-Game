import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promptsFile = path.join(__dirname, '../100_prompts.md');
const outputDir = path.join(__dirname, '../public/cards/historias-da-noite');

// Ensure dir exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Read prompts
const content = fs.readFileSync(promptsFile, 'utf8');
const chunks = content.split('###').slice(1);

const qualityBooster = ", upper body shot, flat 2D anime illustration, cel-shaded, (perfect anatomy:1.5), (only two arms:1.5), (only two legs:1.5), (symmetrical facial features:1.4), accurate hands, clean lines, purple night aesthetic, cinematic lighting, masterpiece, --no realistic, --no 3d, --no extra limbs, --no deformed";

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => {});
            reject(err);
        });
    });
};

const pollImage = async (prompt, filename) => {
    const seed = Math.floor(Math.random() * 1000000);
    const finalPrompt = encodeURIComponent(`${prompt} ${qualityBooster} --seed ${seed}`);
    const url = `https://image.pollinations.ai/prompt/${finalPrompt}?width=800&height=1200&nologo=true&model=flux`;
    
    console.log(`Downloading ${filename}...`);
    try {
        await downloadImage(url, filename);
        console.log(`✅ Saved ${filename}`);
    } catch (err) {
        console.error(`❌ Error ${filename}: ${err.message}`);
    }
};

(async () => {
    for (let i = 0; i < chunks.length; i++) {
        const cardIndex = i + 1;
        const imageId = `hn_card_${cardIndex.toString().padStart(2, '0')}`;
        const filename = path.join(outputDir, `${imageId}.jpg`);
        
        let shouldDownload = false;
        
        if (!fs.existsSync(filename)) {
            shouldDownload = true;
            console.log(`[MISSING] ${imageId}`);
        } else {
            const stats = fs.statSync(filename);
            if (stats.size < 200000) { // Re-download if smaller than 200KB (likely placeholder or corrupt)
                shouldDownload = true;
                console.log(`[LOW QUALITY] ${imageId} (${(stats.size/1024).toFixed(1)}KB)`);
            }
        }

        if (shouldDownload) {
            // Extract prompt
            const lines = chunks[i].trim().split('\n');
            let promptText = "";
            lines.forEach(line => {
                if (line.trim().startsWith('>')) promptText += line.replace('>', '').trim() + " ";
            });
            
            await pollImage(promptText, filename);
            // Brief pause to be nice to API
            await new Promise(r => setTimeout(r, 500));
        }
    }
    console.log("Fix complete.");
})();
