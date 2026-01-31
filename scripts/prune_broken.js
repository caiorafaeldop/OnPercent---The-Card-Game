import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HISTORIA_DA_NOITE_COLLECTION } from '../services/cards/master_collection';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../public');
const outputFile = path.join(__dirname, '../services/cards/master_collection.ts');

console.log(`Analyzing ${HISTORIA_DA_NOITE_COLLECTION.length} cards for integrity...`);

const validCollection = HISTORIA_DA_NOITE_COLLECTION.filter(card => {
    // Construct absolute path
    // card.image is like "/cards/historias-da-noite/hn_001.jpg"
    const relativePath = card.image.startsWith('/') ? card.image.slice(1) : card.image;
    const fullPath = path.join(publicDir, relativePath);

    try {
        if (!fs.existsSync(fullPath)) {
            console.log(`❌ Removing ${card.id}: Image missing (${card.image})`);
            return false;
        }

        const stats = fs.statSync(fullPath);
        if (stats.size === 0) {
            console.log(`❌ Removing ${card.id}: Image is 0 bytes`);
            return false;
        }

        return true;
    } catch (err) {
        console.error(`Error checking ${card.id}:`, err);
        return false;
    }
});

const fileContent = `import { Collectible } from '../../types';

export const HISTORIA_DA_NOITE_COLLECTION: Collectible[] = ${JSON.stringify(validCollection, null, 2)};
`;

fs.writeFileSync(outputFile, fileContent);
console.log(`✅ Pruning Complete. New Count: ${validCollection.length} cards (Original: ${HISTORIA_DA_NOITE_COLLECTION.length}).`);
