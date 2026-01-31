import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promptsFile = path.join(__dirname, '../100_prompts.md');
const outputFile = path.join(__dirname, '../services/cards/historia_da_noite_complete.ts');

const content = fs.readFileSync(promptsFile, 'utf8');
const lines = content.split('\n');

const cards = [];
let currentCard = null;

// Rarity distribution settings
const LEGENDARY_COUNT = 3; // First 3 special ones or random
const EPIC_COUNT = 7;
const RARE_COUNT = 25;
// Retaining Common for the rest

lines.forEach(line => {
    const titleMatch = line.match(/^### (\d+)\. (.+)/);
    if (titleMatch) {
        if (currentCard) cards.push(currentCard);
        
        const index = parseInt(titleMatch[1]);
        const name = titleMatch[2].trim();
        
        // Define rarity based on index logic for now to ensure good distribution
        let rarity = 'common';
        let stats = { str: 1, int: 1, agi: 1 };
        
        if (index <= 3) {
             rarity = 'legendary';
             stats = { str: 8, int: 8, agi: 9 };
        } else if (index <= 10) {
            rarity = 'epic';
            stats = { str: 6, int: 7, agi: 6 };
        } else if (index <= 35) {
            rarity = 'rare';
            stats = { str: 4, int: 4, agi: 5 };
        }

        currentCard = {
            id: `hn_card_${String(index).padStart(2, '0')}`,
            name: name,
            description: "Uma história da noite.", // Default, will try to capture lore
            rarity: rarity,
            collection: 'historias-da-noite',
            icon: '🌙', // Default icon
            image: `/cards/historias-da-noite/hn_card_${String(index).padStart(2, '0')}.jpg`,
            stats: stats
        };
    }

    const loreMatch = line.match(/\*\*Lore:\*\* "(.*)"/);
    if (loreMatch && currentCard) {
        currentCard.description = loreMatch[1];
    }
});
if (currentCard) cards.push(currentCard);

// Generate TypeScript content
const fileContent = `import { Collectible } from '../../types';

export const HISTORIA_DA_NOITE_COLLECTION: Collectible[] = ${JSON.stringify(cards, null, 2)};
`;

// Fix missing quotes on keys (JSON is strictly quoted, but TS object keys don't strictly need them, but JSON.stringify is valid JS/TS).
// However, JSON.stringify produces "key": "value". usage in TS is fine.

fs.writeFileSync(outputFile, fileContent);

console.log(`Successfully generated ${cards.length} card definitions in ${outputFile}`);
