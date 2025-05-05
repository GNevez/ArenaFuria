# 🎮 FURIA Arena - Landing Page & Telegram Bot

Este projeto foi desenvolvido como parte de um processo seletivo para a FURIA E-Sports. A aplicação é uma Landing Page interativa com funcionalidades de login e cadastro, integração com APIs de jogos (como Twitch e Steam), quizzes personalizados para descobrir o "Nível de Fúria" do usuário, e um bot do Telegram que envia notificações aos jogadores sobre jogos da FURIA, streamers online e muito mais.

A aplicação busca proporcionar uma experiência dinâmica para os fãs da FURIA, conectando-os a conteúdo de seus jogos e jogadores preferidos, além de interagir diretamente com a comunidade.
---

## ✨ Funcionalidades

### 🌐 Landing Page

- Sistema de login e cadastro com autenticação JWT
- Mantimento de login via *Cookies*
- Dashboard com quizzes interativos ("Qual o seu nível de FURIA?")
- Integração com a Twitch API para listar streamers online
- Integração com a Steam API para coletar informações de jogos
- Exibição de informações sobre jogos do dia e jogadores da FURIA
- Know your fan

## 🧠 Tecnologias Utilizadas

- **Frontend:** React, Next.js
- **Backend:** Node.js, TypeScript
- **Bot:** Telegram Bot API
- **Auth:** JWT e Cookies
- **Estilização:** Tailwind
- **Banco de dados:** MySQL
- **Deploy:** Vercel
---

## 🛠️ Scripts

### 📦 Landing Page

```json
"scripts": {
  "dev": "next dev",
  "build": "npx next build",
  "start": "next start",
  "lint": "next lint"
}
```
### 🤖 Bot

```
"scripts": {
  "start": "ts-node src/index.ts",
  "bot": "ts-node src/index.ts",
  "api": "nodemon src/api.ts",
  "dev": "concurrently \"npm run bot\" \"npm run api\"",
  "build": "tsc"
}
```

## 🧠  Variaveis de Ambiente

```
# Frontend
NEXT_PUBLIC_ENCRYPTION_KEY=
NEXT_PUBLIC_BASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=

# Backend
BOT_API_URL=
STEAM_API_KEY=
TWITCH_CLIENT_ID=
TWITCH_CLIENT_SECRET=
TWITCH_REDIRECT_URI=
DB_PASSWORD=

# Google Credentials
GOOGLE_PROJECT_ID=
GOOGLE_PRIVATE_KEY_ID=
GOOGLE_PRIVATE_KEY=
GOOGLE_CLIENT_EMAIL=
GOOGLE_CLIENT_ID=
GOOGLE_AUTH_URI=
GOOGLE_TOKEN_URI=
GOOGLE_AUTH_PROVIDER_CERT_URL=
GOOGLE_CLIENT_CERT_URL=
```

## 🧪 Como Rodar 
**1. Clone o repositório**
```
git clone https://github.com/GNevez/ArenaFuria.git
cd ArenaFuria
```

**2. Instale as dependências**
```
npm install
```
**3. Configure o .env**

Crie um arquivo .env e preencha com as variáveis listadas acima.

**4. Importe o SQL no seu banco de dados**

Crie um schema com nome **arena_furia** e importe o arquivo `arena_furia.sql` para dentro do schema e incie seu banco de dados

**5. Inicie o projeto**
```
npm run dev
```

### 👤 Desenvolvedor
**Guilherme Neves M Ferraz**
**📧 guilhermemferraz@hotmail.com**
**🔗 LinkedIn: *https://www.linkedin.com/in/guilherme-neves-a749052a2/***

