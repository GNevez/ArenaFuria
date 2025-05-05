# 🎮 FURIA Arena - Landing Page & Telegram Bot

Este projeto foi desenvolvido como parte de um processo seletivo para a **FURIA E-Sports**. Trata-se de uma **Landing Page** com sistema de login e cadastro, integração com APIs de jogos, quizzes interativos, e um bot do Telegram que envia notificações aos usuários.

---

## ✨ Funcionalidades

### 🌐 Landing Page

- Sistema de login e cadastro com autenticação JWT
- Dashboard com quizzes interativos ("Qual o seu nível de FURIA?")
- Integração com a Twitch API para listar streamers online
- Integração com a Steam API para coletar informações de jogos
- Exibição de informações sobre jogos do dia e jogadores da FURIA

### 🤖 Bot do Telegram

- Notificações de jogos da FURIA
- Notificações de streamers online
- Atualizações diárias para os usuários

---

## 🧠 Tecnologias Utilizadas

- **Frontend:** React, Next.js
- **Backend:** Node.js, TypeScript
- **Bot:** Telegram Bot API
- **Banco de dados:** MySQL

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
git clone https://github.com/seu-usuario/nome-do-projeto.git
cd nome-do-projeto
```

**2. Instale as dependências**
```
npm install
```
**3. Configure o .env**
Crie um arquivo .env.local e preencha com as variáveis listadas acima.

**4. Inicie a landing page**
```
npm run dev
```
**5. Inicie o bot**
```
cd bot
npm run dev
```

### 👤 Sobre o Desenvolvedor
**Guilherme Neves M Ferraz**
**📧 guilhermemferraz@hotmail.com**
**🔗 LinkedIn: *https://www.linkedin.com/in/guilherme-neves-a749052a2/***

## 🏁 Considerações Finais
Este projeto foi desenvolvido com foco em performance, integração com APIs populares e uma experiência interativa para os fãs da FURIA E-Sports. Espero que gostem!

