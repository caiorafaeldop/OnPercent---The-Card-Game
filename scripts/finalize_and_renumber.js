import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HISTORIA_DA_NOITE_COLLECTION } from '../services/cards/master_collection';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.join(__dirname, '../public/cards/historias-da-noite');
const outputFile = path.join(__dirname, '../services/cards/master_collection.ts');

// 1. Get current files on disk
const files = fs.readdirSync(dir).filter(f => /^hn_\d{3}\.jpg$/.test(f));
files.sort(); // Should be 001...070, then 101...118

console.log(`Found ${files.length} valid card images.`);

const finalCollection = [];

// 2. Process Files Sequentially
files.forEach((filename, index) => {
    // Current state
    const currentId = filename.replace('.jpg', ''); // e.g., hn_101
    const fullPathCurrent = path.join(dir, filename);

    // New ideal state
    const newIndex = index + 1;
    const newId = `hn_${newIndex.toString().padStart(3, '0')}`;
    const newFilename = `${newId}.jpg`;
    const fullPathNew = path.join(dir, newFilename);

    // Rename on disk if needed
    if (filename !== newFilename) {
        fs.renameSync(fullPathCurrent, fullPathNew);
        console.log(`Renamed Disk: ${filename} -> ${newFilename}`);
    }

    // Find the matching card data
    // We try to find the card that currently points to this image OR has this ID
    let cardData = HISTORIA_DA_NOITE_COLLECTION.find(c => c.id === currentId);
    
    // If not found by ID (maybe ID changed?), try image path ending
    if (!cardData) {
        cardData = HISTORIA_DA_NOITE_COLLECTION.find(c => c.image.endsWith(filename));
    }

    if (cardData) {
        // Create updated card object
        finalCollection.push({
            ...cardData,
            id: newId,
            image: `/cards/historias-da-noite/${newFilename}`
        });
    } else {
        // Fallback if data is missing (shouldn't happen for these)
        console.warn(`Warning: No metadata found for ${filename}. Creating generic.`);
        finalCollection.push({
            id: newId,
            name: `Carta ${newId}`,
            description: "Uma história da noite.",
            rarity: "common",
            collection: "historias-da-noite",
            icon: "🌙",
            image: `/cards/historias-da-noite/${newFilename}`,
            stats: { str: 1, int: 1, agi: 1 }
        });
    }
});

// 3. Write final TS file
const tsContent = `import { Collectible } from '../../types';

export const HISTORIA_DA_NOITE_COLLECTION: Collectible[] = ${JSON.stringify(finalCollection, null, 2)};
`;

fs.writeFileSync(outputFile, tsContent);
console.log(`✅ Finalized Collection: ${finalCollection.length} cards (hn_001 to hn_${finalCollection.length.toString().padStart(3, '0')}).`);
