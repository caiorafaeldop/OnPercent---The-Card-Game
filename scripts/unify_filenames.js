import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.join(__dirname, '../public/cards/historias-da-noite');

// 1. Get Inventory
const allFiles = fs.readdirSync(dir);
const standardFiles = []; // hn_001.jpg
const candidateFiles = []; // cotn_akira.jpg, hn_r_01.jpg, etc.

const standardRegex = /^hn_\d{3}\.jpg$/;

allFiles.forEach(f => {
    if (standardRegex.test(f)) {
        standardFiles.push(f);
    } else {
        candidateFiles.push(f);
    }
});

console.log(`Found ${standardFiles.length} standard files.`);
console.log(`Found ${candidateFiles.length} candidate files to rename.`);

// 2. Identify Gaps (1 to 118)
const gaps = [];
for (let i = 1; i <= 118; i++) {
    const id = `hn_${i.toString().padStart(3, '0')}.jpg`;
    if (!standardFiles.includes(id)) {
        gaps.push(id);
    }
}

console.log(`Found ${gaps.length} empty slots (gaps).`);

// 3. Rename Candidates to Fill Gaps
let renamedCount = 0;

candidateFiles.forEach((candidate, index) => {
    if (index < gaps.length) {
        const targetName = gaps[index];
        const oldPath = path.join(dir, candidate);
        const newPath = path.join(dir, targetName);
        
        fs.renameSync(oldPath, newPath);
        console.log(`RENAME: ${candidate} -> ${targetName}`);
        renamedCount++;
    } else {
        console.log(`SKIP: ${candidate} (No gaps left to fill)`);
    }
});

console.log(`Completed! Renamed ${renamedCount} files. Remaining gaps: ${gaps.length - renamedCount}`);
