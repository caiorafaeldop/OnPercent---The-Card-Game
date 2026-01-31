import fs from 'fs';
import path from 'path';

const themes = [
    { name: "Neon Street", tags: "vibrant neon city, glowing signs, wet asphalt" },
    { name: "Rooftop View", tags: "skyscraper rooftop, massive moon, city skyline below" },
    { name: "Cozy Interior", tags: "warm lamp light, lofi aesthetic, detailed room background" },
    { name: "Action Scene", tags: "dynamic pose, motion blur, magical particles, neon trails" },
    { name: "Rainy Night", tags: "heavy rain, puddles, reflections of neon lights, atmospheric" }
];

const characters = [
    "beautiful girl with pigtails", "handsome boy with messy hair", "cool girl with techwear",
    "mysterious figure in trench coat", "cute girl with oversized hoodie", "handsome guy with glasses",
    "cyberpunk girl with glowing accessories", "lofi girl studying", "ninja-style character in neon",
    "happy group of teenagers laughing"
];

const basePrompts = [
    { title: "Nazuna das Alturas", desc: "Call of the Night anime style, beautiful vampire girl with twin braids sitting on a water tower, giant moon, purple night, symmetrical face, detailed eyes, cel shaded" },
    { title: "Kaito o Sedento", desc: "Call of the Night anime style, handsome boy leaning on a neon blue vending machine, night alley, symmetrical face, soda can, cel shaded" },
    { title: "Akane a Veloz", desc: "Call of the Night anime style, beautiful girl on a neon motorcycle, rainy city, cyan and pink lights, symmetrical face, cel shaded" },
    { title: "Chef Hiro", desc: "Call of the Night anime style, friendly chef cooking with fire, outdoor night market, glowing lanterns, symmetrical face, cel shaded" },
    { title: "Yuki a Insone", desc: "Call of the Night anime style, beautiful girl sleeping at a desk, moon through window, blue moonlight, cozy lamp, symmetrical face, cel shaded" },
    { title: "Sora a Dançarina", desc: "Call of the Night anime style, girl dancing on a rooftop, 360 neon city view, dynamic pose, symmetrical happy face, cel shaded" },
    { title: "O Encantador de Gatos", desc: "Call of the Night anime style, guy in alley talking to black cat with glowing eyes, symmetrical face, pink/purple light, cel shaded" },
    { title: "Sato do Trem", desc: "Call of the Night anime style, handsome man sleeping in a train, neon city window, purple lighting, symmetrical face, cel shaded" },
    { title: "Rivals de Neon", desc: "Call of the Night anime style, boy and girl playing arcade, laughing, symmetrical faces, red/blue light, cel shaded" },
    { title: "Gangue da Konbini", desc: "Call of the Night anime style, friends outside convenience store, ice cream, symmetrical faces, night environment, cel shaded" }
];

// Generate more to fill 100
for (let i = 11; i <= 100; i++) {
    const char = characters[i % characters.length];
    const theme = themes[i % themes.length];
    basePrompts.push({
        title: `Carta ${i}`,
        desc: `Call of the Night anime style, ${char} in ${theme.tags}, symmetrical beautiful face, cel shaded, vibrant colors, 8k`
    });
}

let mdContent = "# 100 Prompts Ultra-Detalhados - Coleção \"Histórias da Noite\" 🌙✨\n\n";

basePrompts.forEach((p, i) => {
    mdContent += `### ${(i + 1).toString().padStart(2, '0')}. ${p.title}\n`;
    mdContent += `*   **Lore:** "A noite é apenas o começo."\n`;
    mdContent += `*   **Prompt Ultra-Detalhado:**\n`;
    mdContent += `    > ${p.desc}\n\n`;
});

fs.writeFileSync('100_prompts.md', mdContent);
console.log('✅ 100_prompts.md gerado com sucesso!');
