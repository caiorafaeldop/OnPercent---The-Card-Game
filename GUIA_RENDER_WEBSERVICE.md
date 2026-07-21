# 🚀 Guia Oficial: Deploy Web Service Monolítico no Render (Frontend + Backend Hono + Neon DB)

## 🏢 Como funciona a Arquitetura Monolítica:
Nesta arquitetura, você precisa de **apenas 1 serviço no Render**:
- O servidor **Node.js (Hono)** roda o backend, processa todas as chamadas de API (`/api/*`), conecta no **Neon DB** e serve os arquivos estáticos do frontend React (`dist/`) na raiz `/`.

---

## 🛠️ Passo a Passo no Render

### **Passo 1: Criar o Web Service**
1. Acesse o [Render Dashboard](https://dashboard.render.com/).
2. Clique no botão **New +** e escolha **Web Service**.
3. Conecte seu repositório GitHub: `caiorafaeldop/OnPercent---The-Card-Game`.
4. Escolha a branch `main`.

---

### **Passo 2: Configurar o Serviço**

Preencha os campos conforme a tabela abaixo:

| Campo | Valor Exato |
|---|---|
| **Name** | `onpercent` (ou o nome que preferir) |
| **Region** | Oregon (US West) ou mais próxima |
| **Branch** | `main` |
| **Root Directory** | *(Deixe em branco)* |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

---

### **Passo 3: Configurar as Variáveis de Ambiente (Environment)**

Ainda na tela de criação ou na aba **Environment** do serviço, adicione:

1. **`DATABASE_URL`**
   - **Key:** `DATABASE_URL`
   - **Value:** `postgresql://seu_usuario:sua_senha@seu_host.neon.tech/neondb?sslmode=require` *(Insira a sua URL de conexão do Neon DB)*

2. **`API_KEY_HUGGING_FACE`**
   - **Key:** `API_KEY_HUGGING_FACE`
   - **Value:** `sua_chave_hugging_face_aqui` *(Insira sua API Key do Hugging Face)*

3. **`NODE_ENV`** (Opcional)
   - **Key:** `NODE_ENV`
   - **Value:** `production`


---

### **Passo 4: Finalizar Deploy**
- Clique em **Create Web Service**.
- O Render irá instalar as dependências, compilar o frontend React, compilar o backend TypeScript e iniciar o servidor único na porta atribuída.
- Ao acessar a URL gerada pelo Render (ex: `https://onpercent.onrender.com`), o app carregará completo com frontend + persistência no Neon DB!
