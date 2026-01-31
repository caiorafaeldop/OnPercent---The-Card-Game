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
    { title: "Nazuna das Alturas", desc: "high-quality 2D digital anime art, beautiful girl with twin braided pigtails, sitting clearly on a water tower at night, visible two arms and two legs, exactly five fingers, symmetrical beautiful face, large detailed eyes, purple night sky, massive moon, cel-shaded illustration" },
    { title: "Kaito o Sedento", desc: "high-quality 2D digital anime art, handsome boy with messy hair, leaning on a neon blue vending machine, visible hands holding a soda can, exactly five fingers, symmetrical face, clear facial features, blue night alley, vibrant neon highlights, cel-shaded" },
    { title: "Akane a Veloz", desc: "high-quality 2D digital anime art, cheerful girl on a neon motorcycle, riding through a rainy city, visible two arms on handlebars, symmetrical face, happy expression, vibrant cyan and pink colors, wet pavement reflections, crisp linework" },
    { title: "Chef Hiro", desc: "high-quality 2D digital anime art, friendly chef with headband, cooking with dynamic fire in a wok, both arms and hands visible, exactly five fingers, symmetrical laughing face, night market background, glowing lanterns, rich colors" },
    { title: "Yuki a Insone", desc: "high-quality 2D digital anime art, beautiful girl with glasses sitting at a desk, symmetrical face, detailed eyes, sleeping peacefully, visible hands on books, cozy room, blue moonlight through window, soft lo-fi aesthetic" },
    { title: "Sora a Dançarina", desc: "high-quality 2D digital anime art, girl dancing on a skyscraper rooftop, full body view, clear two arms and two legs in a dynamic pose, symmetrical happy face, glowing neon city skyline far below, starry night, sharp outlines" },
    { title: "O Encantador de Gatos", desc: "high-quality 2D digital anime art, cool guy in trench coat squatting in an alleyway, visible hands petting a black cat, symmetrical attractive face, purple neon light reflections, wet floor, masterpiece 2D illustration" },
    { title: "Sato do Trem", desc: "high-quality 2D digital anime art, handsome man sleeping in a train seat, symmetrical face, peaceful expression, visible arms and hands resting, neon city lights outside the window, lo-fi purple night atmosphere" },
    { title: "Rivals de Neon", desc: "high-quality 2D digital anime art, boy and girl playing arcade game together, smiling, symmetrical faces, visible hands on buttons, vibrant screen light, colorful arcade background, clean cel-shaded style" },
    { title: "Gangue da Konbini", desc: "high-quality 2D digital anime art, three friends laughing outside a bright Japanese convenience store, visible limbs and hands holding ice cream, symmetrical faces, detailed night street, official anime art style" }
];

// Generate more to fill 100
for (let i = 11; i <= 100; i++) {
    const char = characters[i % characters.length];
    const theme = themes[i % themes.length];
    basePrompts.push({
        title: `Carta ${i}`,
        desc: `high-quality 2D digital anime art, ${char}, full view, standing in ${theme.tags}, (symmetrical body and limbs:1.3), (exactly five fingers on each hand:1.3), perfectly drawn face, clear eyes, vibrant neon night aesthetic, clean cel-shaded linework`
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
