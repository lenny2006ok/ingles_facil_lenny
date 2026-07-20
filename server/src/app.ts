import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';
import fastifyStatic from '@fastify/static';

// Carrega variáveis do arquivo .env
dotenv.config();

const app: FastifyInstance = fastify({ logger: true });

// Registrar CORS
app.register(cors, {
  origin: true, // permite qualquer origem em ambiente de desenvolvimento
});

// Servir arquivos estáticos do frontend compilados no diretório dist/ da raiz do projeto
app.register(fastifyStatic, {
  root: path.join(__dirname, '../../dist'),
  prefix: '/',
  wildcard: false,
});

// Registrar Swagger para auto-documentação das rotas
app.register(swagger, {
  swagger: {
    info: {
      title: 'InglesAsFácil API',
      description: 'API para a plataforma de aprendizado de inglês baseada em vídeos do YouTube',
      version: '1.0.0'
    },
    host: 'localhost:5000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
});

app.register(swaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  staticCSP: true,
  transformStaticCSP: (header) => header
});

// Rota de Health Check
app.get('/health', async (request, reply) => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

// Rota para buscar vídeos do YouTube com base no termo fornecido pelo usuário
app.get('/api/youtube/search', {
  schema: {
    description: 'Busca vídeos no YouTube com base em palavras-chave',
    tags: ['youtube'],
    querystring: {
      type: 'object',
      properties: {
        q: { type: 'string', description: 'Termo de busca em inglês' }
      },
      required: ['q']
    },
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            videoId: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            thumbnail: { type: 'string' },
            channelTitle: { type: 'string' },
            publishedAt: { type: 'string' }
          }
        }
      }
    }
  }
}, async (request: any, reply) => {
  const query = request.query.q || '';
  const apiKey = process.env.YOUTUBE_API_KEY || '';

  try {
    // Faz a chamada à API v3 de Busca do YouTube
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${query} english`, // Força buscar vídeos de inglês
        type: 'video',
        videoCaption: 'closedCaption', // preferencialmente vídeos com legenda
        maxResults: 12,
        key: apiKey
      }
    });

    const items = response.data.items || [];
    const formattedVideos = items.map((item: any) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));

    return formattedVideos;
  } catch (error: any) {
    app.log.error(error);
    reply.status(500).send({
      error: 'Erro ao buscar vídeos do YouTube',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

// Mock de dados para simular as tabelas do Drizzle ORM (cenas, séries, vocabulário e tentativas)
const MOCK_SERIES = [
  { id: 'friends', name: 'Friends', category: 'Everyday English' },
  { id: 'office', name: 'The Office', category: 'Business English' },
  { id: 'suits', name: 'Suits', category: 'Advanced/Legal English' },
  { id: 'breaking_bad', name: 'Breaking Bad', category: 'Slangs & Expressions' }
];

const MOCK_EPISODES = [
  { id: 'friends_s01e01', seriesId: 'friends', title: 'The One Where Monica Gets a Roommate' },
  { id: 'office_s01e01', seriesId: 'office', title: 'Pilot' },
  { id: 'suits_s01e01', seriesId: 'suits', title: 'Pilot Episode' }
];

const MOCK_SCENES = [
  {
    id: 'scene_1',
    episodeId: 'friends_s01e01',
    videoId: 'XSGBVzeBUVA',
    title: 'Monica presents Rachel to the group',
    startTime: '0:15',
    endTime: '1:30'
  },
  {
    id: 'scene_2',
    episodeId: 'office_s01e01',
    videoId: 'GRK_m77n83E',
    title: 'Michael Scott introduces Dunder Mifflin',
    startTime: '0:10',
    endTime: '1:00'
  }
];

const MOCK_VOCABULARY = [
  { word: 'Roommate', meaning: 'Colega de quarto', example: 'She is looking for a new roommate.' },
  { word: 'Dunderhead', meaning: 'Pessoa boba/estúpida', example: 'Don\'t be such a dunderhead!' },
  { word: 'Briefcase', meaning: 'Maleta/pasta de trabalho', example: 'He packed his briefcase with documents.' }
];

// Endpoint de catálogo (Series)
app.get('/api/series', async () => {
  return MOCK_SERIES;
});

// Endpoint de episódios por série
app.get('/api/episodes', async (request: any) => {
  const seriesId = request.query.seriesId;
  if (seriesId) {
    return MOCK_EPISODES.filter(e => e.seriesId === seriesId);
  }
  return MOCK_EPISODES;
});

// Endpoint de cenas por episódio
app.get('/api/scenes', async (request: any) => {
  const episodeId = request.query.episodeId;
  if (episodeId) {
    return MOCK_SCENES.filter(s => s.episodeId === episodeId);
  }
  return MOCK_SCENES;
});

// Endpoint de vocabulários sugeridos
app.get('/api/vocabulary', async () => {
  return MOCK_VOCABULARY;
});

// Endpoint para salvar progresso/tentativas de pronúncia do usuário
const userAttempts: any[] = [];
app.post('/api/pronunciation-attempts', async (request: any, reply) => {
  const { username, text, transcript, score, success } = request.body;
  const attempt = {
    id: `attempt_${Date.now()}`,
    username: username || 'Guest',
    text,
    transcript,
    score,
    success,
    createdAt: new Date().toISOString()
  };
  userAttempts.push(attempt);
  return { success: true, attempt };
});

app.get('/api/pronunciation-attempts', async (request: any) => {
  const username = request.query.username;
  if (username) {
    return userAttempts.filter(a => a.username === username);
  }
  return userAttempts;
});

// Suporte para SPA (Single Page Application) - Redireciona qualquer rota que não seja da API para o index.html do React
app.setNotFoundHandler((request, reply) => {
  if (request.url.startsWith('/api')) {
    reply.status(404).send({
      message: `Route ${request.method}:${request.url} not found`,
      error: 'Not Found',
      statusCode: 404
    });
    return;
  }
  reply.sendFile('index.html');
});

export default app;
