# ⚡ Protocolo "Flash": Criando Coleções de Cartas Rapidamente

Este documento resume o aprendizado da coleção "Histórias da Noite" e estabelece o novo padrão ouro para criar coleções futuras sem bugs, sem arquivos perdidos e com nomes criativos.

## 🧠 Aprendizados Chave (O que não fazer)

1.  **NUNCA misture origens de arquivos:** Começamos com `cotn_`, misturamos com `hn_card_` e terminamos com `hn_`. **Solução:** Definir um prefixo ÚNICO (ex: `cyb_` para Cyberpunk) e usar apenas numeração sequencial (`cyb_001` a `cyb_100`).
2.  **Zero Tolerância com Arquivos Vazios:** Tivemos cartas "fantasmas" de 0 bytes. **Solução:** O script de geração deve verificar o tamanho do arquivo imediatamente após baixar. Se < 1kb, tentar de novo na hora.
3.  **Geração ≠ Metadata:** Tentar criar o JSON da carta *antes* de ter a imagem gera inconsistência. **Solução:** Primeiro gera-se as 100 imagens. Depois, um script escaneia a pasta e gera o arquivo `.ts`.

---

## 🚀 O Workflow "Fast Track" (Passo a Passo)

Para a próxima coleção (ex: "Samurais do Espaço", prefixo `sam`), siga este roteiro exato:

### Passo 1: O Arquivo de Prompts (`100_prompts.md`)
Crie um arquivo markdown simples. Não precisa de JSON, apenas texto.
O Agente deve gerar 100 linhas criativas focadas no visual.

**Formato:**
```markdown
### 1
Samurai cyborg meditating in zero gravity, neon katana, cherry blossoms floating in space...
### 2
Mecha-shogun shouting orders, holographic armor, red laser eyes...
```

### Passo 2: O Script "Gerador Blindado"
Não use scripts manuais. Use este template de script (Node.js) que já inclui validação de erro 429 e checagem de tamanho.

```javascript
// scripts/generate_collection_sam.js
const prefix = "sam"; // <--- MUDE ISSO
const collectionPath = "public/cards/samurais-do-espaco"; // <--- MUDE ISSO
// ... lógica de loop que baixa de 1 a 100 ...
// ... se falhar, espera 5s e tenta de novo ...
```

### Passo 3: O "Motor Criativo" (Metadata)
Em vez de escrever nomes à mão ("Carta 01"), rodamos o script de catalogação.
Ele lê o prompt em inglês ("Samurai... zero gravity") e usa um dicionário interno para criar o título em PT-BR:
*   `Sword` + `Space` = "Lâmina Estelar"
*   `Armor` + `Red` = "Vanguarda Carmesim"

Isso garante que **100% das cartas tenham nomes épicos sem esforço manual.**

### Passo 4: O "Xerife" (Auditoria)
Antes de colocar no jogo, rodamos o `verify_integrity.js`.
*   Ele verifica se existem arquivos de `sam_001.jpg` a `sam_100.jpg`.
*   Se algum tiver 0 bytes, ele deleta e manda baixar de novo.
*   Ele remove qualquer arquivo "intruso" da pasta.

---

## 🛠️ Comandos Prontos para a Próxima Vez

Quando você pedir a próxima coleção, eu (o Agente) farei exatamente isso:

1.  **Criar pasta:** `mkdir public/cards/[tema]`
2.  **Gerar Prompts:** Crio `[tema]_prompts.md` com 100 ideias.
3.  **Rodar Geração:** `node scripts/factory_generate.js [tema] [path_dos_prompts]`
4.  **Rodar Catalogação:** `node scripts/factory_catalog.js [tema]` (Isso cria o arquivo `.ts` final).
5.  **Audit:** `node scripts/factory_audit.js [tema]`

**Resultado:** Uma nova coleção pronta em < 20 minutos, totalmente padronizada.
