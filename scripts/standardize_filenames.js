import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HISTORIA_DA_NOITE_COLLECTION } from '../services/cards/master_collection';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cardsDir = path.join(__dirname, '../public');
const outputFile = path.join(__dirname, '../services/cards/master_collection.ts');

const newCollection = [];

console.log(`Starting standardization of ${HISTORIA_DA_NOITE_COLLECTION.length} cards...`);

HISTORIA_DA_NOITE_COLLECTION.forEach((card, index) => {
    // 1. Define New Standard ID and Filename
    // Format: hn_001, hn_002, etc.
    const newId = `hn_${(index + 1).toString().padStart(3, '0')}`;
    const newFilename = `${newId}.jpg`;
    const newRelativePath = `/cards/historias-da-noite/${newFilename}`;
    const fullNewPath = path.join(cardsDir, newRelativePath);

    // 2. Locate Old File
    const oldRelativePath = card.image;
    const fullOldPath = path.join(cardsDir, oldRelativePath);

    // 3. Rename File
    try {
        if (fs.existsSync(fullOldPath)) {
            // Only rename if source exists (and isn't already the target)
            if (fullOldPath !== fullNewPath) {
                fs.renameSync(fullOldPath, fullNewPath);
                console.log(`Renamed: ${path.basename(fullOldPath)} -> ${newFilename}`);
            } else {
                console.log(`Skipped (Already named): ${newFilename}`);
            }
        } else {
            // If old file is missing, we still update the reference so the 'fix_images' script can fill it later if needed
            // OR we check if the new file ALREADY exists (maybe from a previous run)
            if (fs.existsSync(fullNewPath)) {
                console.log(`Target exists, updating ref: ${newFilename}`);
            } else {
                console.warn(`WARNING: Source image missing: ${oldRelativePath}`);
            }
        }
    } catch (err) {
        console.error(`Error renaming ${oldRelativePath}:`, err);
    }

    // 4. Update Card Object
    newCollection.push({
        ...card,
        id: newId,
        image: newRelativePath
    });
});

// 5. Save Updated Collection
const fileContent = `import { Collectible } from '../../types';

export const HISTORIA_DA_NOITE_COLLECTION: Collectible[] = ${JSON.stringify(newCollection, null, 2)};
`;

fs.writeFileSync(outputFile, fileContent);
console.log('✅ Collection and filenames standardized successfully!');
