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
    { title: "Nazuna das Alturas", desc: "beautiful girl with twin braids sitting on a water tower, giant moon behind, purple night sky, symmetrical face, detailed eyes, masterful lighting" },
    { title: "Kaito o Sedento", desc: "handsome boy leaning on a glowing blue vending machine, night alleyway, symmetrical face, holding a soda can, soft light reflections" },
    { title: "Akane a Veloz", desc: "beautiful delivery girl on a neon motorcycle, rainy city, motion blur, cyan and pink reflections, symmetrical face, happy expression" },
    { title: "Chef Hiro", desc: "friendly chef cooking with fire in a wok, outdoor night market, orange flames, glowing lanterns, symmetrical face, detailed focus" },
    { title: "Yuki a Insone", desc: "beautiful girl sleeping at a desk with books, massive moon through window, blue moonlight, cozy warm lamp, symmetrical face" },
    { title: "Sora a Dançarina", desc: "girl dancing on a rooftop edge, vast 360 neon city view, dynamic pose, symmetrical happy face, glowing bokeh lights" },
    { title: "O Encantador de Gatos", desc: "guy squatting in a dark neon alleyway talking to a black cat with glowing eyes, symmetrical face, pink and purple light, masterpiece" },
    { title: "Sato do Trem", desc: "handsome man sleeping in a train, blurred neon city through window, soft purple lighting, symmetrical peaceful face" },
    { title: "Rivals de Neon", desc: "boy and girl playing arcade game, laughing, symmetrical expressive faces, red/blue screen light reflections, detailed eyes" },
    { title: "Gangue da Konbini", desc: "group of friends laughing outside a bright convenience store, holding ice cream, symmetrical faces, detailed night environment" }
];

// Generate more to fill 100
for (let i = 11; i <= 100; i++) {
    const char = characters[i % characters.length];
    const theme = themes[i % themes.length];
    basePrompts.push({
        title: `Carta ${i}`,
        desc: `${char} in ${theme.tags}, symmetrical beautiful face, detailed eyes, ${i % 2 === 0 ? 'smiling happily' : 'focused and cool'}, high quality anime style, masterpiece, clean lines, 8k`
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
