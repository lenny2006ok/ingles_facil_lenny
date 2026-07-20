# InglesAsFácil — ingles_facil_lenny

Plataforma interativa para o aprendizado de inglês baseada em vídeos do YouTube, focando em contextualização por meio de cenas autênticas, prática de pronúncia com reconhecimento de voz e um catálogo de conteúdo interativo.

## 🚀 Funcionalidades

- **Navegação por Catálogo (Browse):** Descubra tópicos, séries e expressões comuns.
- **Busca de Vídeos Dinâmica:** Encontre qualquer vídeo do YouTube em tempo real usando termos de busca em inglês.
- **Visualizador de Vídeo Avançado (Watch):** Assista aos vídeos integrados com um laboratório de pronúncia e painel de vocabulário.
- **Laboratório de Pronúncia (PronunciationLab):** Pratique frases em inglês usando a Web Speech API para receber feedback e pontuação instantâneos em português!
- **Autenticação Simples:** Sistema de cadastro e login integrado de forma simples usando `localStorage`.
- **Backend Fastify:** Integração segura com a API oficial do YouTube.

## 📂 Estrutura do Projeto

```text
/
├── package.json         # Configuração geral do frontend e scripts
├── tsconfig.json        # Configuração TypeScript do Frontend
├── vite.config.ts       # Configuração do Vite
├── src/                 # Código do Frontend (React + TypeScript)
│   ├── App.tsx          # Componente principal do app
│   ├── main.tsx         # Ponto de entrada
│   ├── index.css        # Estilos globais CSS
│   ├── router/          # Configuração de rotas (React Router)
│   ├── components/      # Componentes globais reutilizáveis
│   ├── features/        # Funcionalidades (auth, pronunciation)
│   └── pages/           # Páginas principais da aplicação
└── server/              # Código do Backend (Fastify + TypeScript)
    ├── package.json     # Dependências e scripts do backend
    ├── tsconfig.json    # Configuração do TypeScript do backend
    └── src/             # Código-fonte do backend
```

## 🛠️ Instalação e Execução

### Pré-requisitos
- **Node.js** (v20 ou superior recomendado)
- **NPM**

### Inicializando o Backend

```bash
cd server
npm install
npm run dev
```

O servidor iniciará na porta `5000` (ou na definida no `.env`).

### Inicializando o Frontend

Abra um novo terminal na raiz do projeto e execute:

```bash
npm install
npm run dev
```

O frontend abrirá localmente (geralmente em `http://localhost:5173`).

## 🧑‍💻 Tecnologias Utilizadas

- **Frontend:** React 19, TypeScript, Vite, React Router v7, Lucide React (ícones), CSS nativo modernizado.
- **Backend:** Fastify, TypeScript, Axios (integração YouTube API).
- **APIs do Navegador:** Web Speech API (SpeechRecognition) para avaliação inteligente de pronúncia.

## 📝 Regras de Desenvolvimento (Baseado nos docs oficiais)
- Manter a interface amigável, moderna, acessível e 100% em **Português do Brasil (PT-BR)**.
- O componente de pronúncia deve ser interativo e dar feedbacks claros de cores (Verde, Amarelo e Vermelho) baseando-se no reconhecimento de fala.
- Evolução incremental e limpa do código.
