# Comandos Exatos para Rodar no Render

## Configuração do Serviço Web Static Site

### 1. Criar um novo Static Site no Render
- Conecte seu repositório GitHub: `caiorafaeldop/OnPercent---The-Card-Game`
- Branch: `main` (ou a branch que você quer deployar)

### 2. Configurações de Build

No painel do Render, configure os seguintes comandos:

**Build Command:**
```bash
npm install && npm run build
```

**Publish Directory:**
```
dist
```

### 3. Variáveis de Ambiente (Opcional)

Se você quiser usar a API do Gemini, adicione:
- Nome: `GEMINI_API_KEY`
- Valor: Sua chave da API Gemini

**Nota:** A variável de ambiente não é necessária para o app funcionar básicamente, apenas para recursos que usam IA.

### 4. Deploy

Após salvar as configurações, o Render irá:
1. Instalar as dependências com `npm install`
2. Fazer o build da aplicação com `npm run build`
3. Servir os arquivos estáticos da pasta `dist`

## Resolução do Problema

O bug acontecia porque:
- A aplicação estava usando `import maps` com CDN (esm.sh) no HTML
- Isso não funcionava corretamente em produção
- Tailwind CSS estava sendo carregado via CDN, que pode ser bloqueado

### Correções Aplicadas:
1. ✅ Adicionado script de entry point no index.html: `<script type="module" src="/index.tsx"></script>`
2. ✅ Removido import maps do index.html
3. ✅ Instalado Tailwind CSS como dependência: `tailwindcss@^3.4.19`
4. ✅ Criado arquivo `index.css` com diretivas do Tailwind
5. ✅ Configurado PostCSS e Tailwind (`postcss.config.js` e `tailwind.config.js`)
6. ✅ Importado CSS no entry point (`index.tsx`)
7. ✅ Removido Tailwind CDN do HTML

Agora o Vite faz o bundle correto de todos os assets (JS + CSS) e a aplicação funciona perfeitamente em produção!
