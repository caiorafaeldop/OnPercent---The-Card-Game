import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Fix para __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurações
const PROMPTS_FILE = path.join(__dirname, '../100_prompts.md');
const OUTPUT_DIR = path.join(__dirname, '../public/cards/historias-da-noite/');

// Cria o diretório se não existir
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(OUTPUT_DIR, filename);
        
        // PROTEÇÃO: Se a imagem já existe, não baixa de novo (preserva as artes boas)
        if (fs.existsSync(filePath)) {
            console.log(`⏩ Pulando: ${filename} (Já existe)`);
            return resolve();
        }

        https.get(url, (res) => {
            if (res.statusCode === 200) {
                // Tenta detectar se é uma imagem real ou erro pelo tamanho (placeholders de erro são muito pequenos)
                const fileStream = fs.createWriteStream(filePath);
                res.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    
                    // Validação básica de tamanho: se a imagem tiver menos de 10KB, provavelmente é erro
                    const stats = fs.statSync(filePath);
                    if (stats.size < 10000) {
                        fs.unlinkSync(filePath); // Deleta o arquivo se for pequeno demais/erro
                        return reject(new Error(`Imagem muito pequena (${stats.size}b), provavelmente erro de limite.`));
                    }

                    console.log(`✅ Salvo: ${filename}`);
                    resolve();
                });
            } else {
                reject(new Error(`Falha ao baixar ${filename}: Status ${res.statusCode}`));
            }
        }).on('error', reject);
    });
}

async function run() {
    console.log('🚀 Iniciando download das imagens...');
    
    if (!fs.existsSync(PROMPTS_FILE)) {
        console.error(`❌ Erro: Arquivo ${PROMPTS_FILE} não encontrado.`);
        process.exit(1);
    }

    const content = fs.readFileSync(PROMPTS_FILE, 'utf-8');
    
    // Regex global para encontrar todos os blocos de card
    // Captura o número no ID e o conteúdo do prompt no bloco de citação
    // O modificador 's' permite que o '.' pegue quebras de linha
    const cardRegex = /### (\d+)\..*?> (.*?)(?=\n###|\n---|$(?![\w\W]))/gs;
    
    let match;
    let count = 0;

    while ((match = cardRegex.exec(content)) !== null) {
        const id = match[1].padStart(2, '0');
        let rawPrompt = match[2].trim().replace(/\n/g, ' '); 
        
        rawPrompt = rawPrompt.replace(/^Prompt Ultra-Detalhado:\s*/i, '');

        // BOOSTER DE SEGURANÇA ANATÔMICA: Focado em evitar membros extras e garantir estilo 2D
        const qualityBooster = ", upper body shot, flat 2D anime illustration, cel-shaded, (perfect anatomy:1.5), (only two arms:1.5), (only two legs:1.5), (symmetrical facial features:1.4), accurate hands, clean lines, purple night aesthetic, cinematic lighting, masterpiece, --no realistic, --no 3d, --no extra limbs, --no deformed";
        const finalPrompt = rawPrompt + qualityBooster;

        const cleanPrompt = encodeURIComponent(finalPrompt);
        
        // Usando o modelo 'flux' com um Seed aleatório para dar variedade
        const seed = Math.floor(Math.random() * 9999999);
        const url = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=1024&model=flux&nologo=true&seed=${seed}`;
        
        const filename = `hn_card_${id}.jpg`;
        
        try {
            await downloadImage(url, filename);
            count++;
        } catch (err) {
            console.error(`❌ Erro no ID ${id}:`, err.message);
        }
        
        // Delay amigável
        await new Promise(r => setTimeout(r, 1000));
    }
    
    if (count === 0) {
        console.log('⚠️ Nenhuma carta encontrada com a formatação "### XX." e "> Prompt". Verifique o arquivo markdown.');
    } else {
        console.log(`\n✨ Processo finalizado! ${count} imagens processadas.`);
    }
}

run().catch(err => console.error('💥 Erro fatal:', err));
