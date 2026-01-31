import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import { HISTORIA_DA_NOITE_COLLECTION } from '../services/cards/master_collection';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promptsFile = path.join(__dirname, '../100_prompts.md');
const outputDir = path.join(__dirname, '../public/cards/historias-da-noite');

// Ensure dir exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Read prompts to have them handy
const content = fs.readFileSync(promptsFile, 'utf8');
const chunks = content.split('###').slice(1);
const promptsMap = new Map(); // Index (1-based) -> Prompt Text

chunks.forEach((chunk, i) => {
    const lines = chunk.trim().split('\n');
    let promptText = "";
    lines.forEach(line => {
        if (line.trim().startsWith('>')) promptText += line.replace('>', '').trim() + " ";
    });
    promptsMap.set(i + 1, promptText);
});

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
    
    console.log(`Downloading for ${path.basename(filename)}...`);
    try {
        await downloadImage(url, filename);
        console.log(`✅ Saved ${path.basename(filename)}`);
    } catch (err) {
        console.error(`❌ Error ${filename}: ${err.message}`);
    }
};

(async () => {
    console.log(`Checking ${HISTORIA_DA_NOITE_COLLECTION.length} cards...`);

    for (let i = 0; i < HISTORIA_DA_NOITE_COLLECTION.length; i++) {
        const card = HISTORIA_DA_NOITE_COLLECTION[i];
        
        // Ensure paths are correct relative to public
        // card.image might be '/cards/historias-da-noite/hn_001.jpg'
        // We need 'public/cards/historias-da-noite/hn_001.jpg' (or whatever outputDir is)
        
        const relativePath = card.image.replace('/cards/historias-da-noite/', '');
        const filename = path.join(outputDir, relativePath);
        
        let shouldDownload = false;
        
        if (!fs.existsSync(filename)) {
            shouldDownload = true;
            console.log(`[MISSING] ${card.name} (${relativePath})`);
        } else {
            const stats = fs.statSync(filename);
            if (stats.size < 150000) { // < 150KB is suspicious
                shouldDownload = true;
                console.log(`[LOW QUALITY] ${card.name} (${relativePath}) - ${(stats.size/1024).toFixed(1)}KB`);
            }
        }

        if (shouldDownload) {
            // How do we get the prompt? 
            // The card ID is hn_001. This implies it corresponds to Prompt Index 1.
            // hn_118 corresponds to... well, the original 18 don't correspond to prompts 101-118 directly, they have their own logic?
            // Actually, master_collection generated 1-100 from prompts, then appended 18 originals.
            // So hn_001 to hn_100 map directly to Prompts 1-100.
            
            // Extract Number from ID: hn_042 -> 42
            const idNum = parseInt(card.id.replace('hn_', ''), 10);
            
            let promptText = "";
            
            if (idNum <= 100) {
                promptText = promptsMap.get(idNum) || card.description; // Fallback to description
            } else {
                // For the original 18 (IDs 101+ now renamed?), we should use their description + visual style keywords
                promptText = `${card.name}, ${card.description}, anime style, night scene`;
            }

            await pollImage(promptText, filename);
            // Brief pause
            await new Promise(r => setTimeout(r, 600));
        }
    }
    console.log("Fix complete.");
})();
