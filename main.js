// Ponto de entrada do bot.
const { join } = require('node:path');

// Valida .env + config.json antes de tudo (falha com mensagem clara).
let config;
try {
  config = require('./src/config');
} catch (error) {
  console.error(`[❌] Configuração inválida: ${error.message}`);
  process.exit(1);
}

const { Client, GatewayIntentBits } = require('discord.js');
const logger = require('./src/utils/logger');
const { loadFiles } = require('./src/utils/loadFiles');

// Intents: só o necessário. Para slash commands, "Guilds" basta.
// Intents privilegiados (GuildMembers, GuildPresences, MessageContent) precisam estar ativados
// no Developer Portal e, a partir de 10.000 usuários, exigem aprovação do Discord.
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    // GatewayIntentBits.GuildMessages,
    // GatewayIntentBits.GuildMembers, // privilegiado
    // GatewayIntentBits.MessageContent, // privilegiado
    // GatewayIntentBits.DirectMessages,
  ],
});

// Permite importar o client em outros arquivos: const client = require('../../main');
module.exports = client;

// Carrega os handlers (src/handler/*.js). Cada um recebe o client.
for (const file of loadFiles(join(__dirname, 'src', 'handler'))) {
  require(file)(client);
}

// Lê os comandos (src/commands/**/*.js). O registro na API acontece no evento clientReady.
client.handleCommands(join(__dirname, 'src', 'commands'));

// --- Tratamento global de erros ---------------------------------------------------------------
process.on('unhandledRejection', (reason) => {
  logger.error('Promise rejeitada sem tratamento:', reason);
});

// Após uma exceção não capturada o processo pode estar em estado inconsistente:
// registra e encerra. Use PM2, systemd ou Docker (restart) para reiniciar automaticamente.
process.on('uncaughtException', (error) => {
  logger.error('Exceção não capturada:', error);
  process.exit(1);
});

// --- Encerramento limpo -----------------------------------------------------------------------
const shutdown = async (signal) => {
  logger.info(`${signal} recebido. Encerrando...`);
  await client.destroy();
  process.exit(0);
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// --- Login ------------------------------------------------------------------------------------
client.login(config.token).catch((error) => {
  logger.error('Falha ao fazer login (token inválido ou intents não habilitados?):', error.message);
  process.exit(1);
});
