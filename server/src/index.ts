import app from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

const start = async () => {
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 Servidor Fastify rodando na porta ${PORT}`);
    console.log(`📖 Documentação Swagger disponível em http://localhost:${PORT}/documentation`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
