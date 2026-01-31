import { HISTORIA_DA_NOITE_COLLECTION } from '../services/cards/historia_da_noite_complete';
import { BATCH_ORIGINAL_18 } from '../services/cards/batch_original_18';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputFile = path.join(__dirname, '../services/cards/historia_da_noite_merged.ts');

// Strategy:
// 1. Keep the first 10 generated cards (Nazuna, Kaito, etc.) as they are high quality.
// 2. Insert the 18 handcrafted cards (Hacker, Train, Ramen, etc.) from BATCH_ORIGINAL_18.
// 3. Fill the rest of the slots (up to 100) with the generated 'Carta X' if needed, BUT rename them to something more thematic if possible, or leave them as placeholders but ensuring valid image paths.

// The issue is IDs.
// Generated: hn_card_01 ... hn_card_100
// Original: hn_e_hacker, hn_c_ramen, etc.

// We will map:
// hn_card_01 to hn_card_10 (The 10 unique prompts) -> Keep these.
// Then append the 18 Originals.
// Then fill the rest with the generic generated ones, but skipping IDs that might clash or just appending.

const finalCollection = [];

// 1. Add the 10 Prime Cards (ID 01-10)
const primeCards = HISTORIA_DA_NOITE_COLLECTION.slice(0, 10);
finalCollection.push(...primeCards);

// 2. Add the 18 Originals (Preserving their IDs and Data)
// We need to ensure their images exist. The user said "vc inventou alguma merda pra bagunçar" because they likely want the Old cards to assume the New images or vice versa?
// Actually, the user said "apareceu carta 81... QUE MERDA É CARTA 81".
// This means the user HATED seeing "Carta 81" generic names.
// They want the new images to be collectible features.

// Solution:
// We have 100 images: hn_card_01.jpg to hn_card_100.jpg.
// We have ~28 defined cards (10 new prompts + 18 original batch).
// We have ~72 undefined cards (Carta 11 to Carta 100).

// We will Assign collecting the 18 originals to specific image slots if they don't have one, or keep their existing image paths if they work.
// The user likely wants the *new* 100 images to be the cards.

// Let's REWRITE the "Carta 11" ... "Carta 100" with better names based on the 100_prompts tags if possible, OR just hide them for now?
// No, the user said "99 é um numero muito bom". They want 99 cards.

// Let's Generate thematic names for 11-100 based on their visual description in the prompt file?
// The prompt file has: "Carta 11: handsome boy..."
// We can auto-generate names like "Shadow Boy", "Neon Walker" etc based on simple keywords?
// Or better: Just use "Memória da Noite #XX" instead of "Carta XX".

const betterNamedCollection = HISTORIA_DA_NOITE_COLLECTION.map(c => {
    if (c.name.startsWith('Carta ')) {
        const num = c.name.split(' ')[1];
        return {
            ...c,
            name: `Fragmento Noturno #${num}`,
            description: "Um vislumbre de uma noite eterna. Colecione para revelar o mistério."
        };
    }
    return c;
});

// Now, MERGE the BATCH_ORIGINAL_18 into this.
// We will add them as EXTRA cards? Or replace the "Fragmento" slots?
// The user wants 99 cards total likely.
// Let's replace Fragmento 11-28 with the 18 originals, updating their image paths to use the new hn_card_XX images so everything looks uniform?
// Or keep their old IDs?
// User said: "JA HAVIAM CARTAS ANTES... E AGR TEM CARTAS COM O NOME... hn_card_02 a hn_card_59... vc só tinha que adicionar elas"

// So we keep BATCH_ORIGINAL_18 AS IS.
// And we ADD the new ones (hn_card_01...99) as NEW collectibles.
// BUT avoid duplicates.
// The first 10 prompts (Nazuna etc) might collide if we are not careful.

// Let's just CONCATENATE everything into a massive pool.
// 1. BATCH_ORIGINAL_18 (The old favorites)
// 2. HISTORIA_DA_NOITE_COLLECTION (The new visual gallery)

// This results in ~118 cards. That's fine. More content.

const merged = [
    ...BATCH_ORIGINAL_18,
    ...betterNamedCollection
];

const fileContent = `import { Collectible } from '../../types';

export const HISTORIA_DA_NOITE_MERGED: Collectible[] = ${JSON.stringify(merged, null, 2)};
`;

fs.writeFileSync(outputFile, fileContent);
