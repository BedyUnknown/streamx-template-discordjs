// Carrega o .env (se existir) e o config.json, valida tudo e exporta um objeto imutável.
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const ROOT = join(__dirname, '..');

// Variáveis de ambiente: process.loadEnvFile existe no Node >= 20.12 / 21.7.
try {
  process.loadEnvFile(join(ROOT, '.env'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

// Tipos de atividade aceitos em "activityType" (config.json).
const ACTIVITY_TYPES = ['Playing', 'Streaming', 'Listening', 'Watching', 'Competing'];

const readJson = (file) => JSON.parse(readFileSync(join(ROOT, file), 'utf8'));

const raw = readJson('config.json');

const token = process.env.DISCORD_TOKEN?.trim();
if (!token) {
  throw new Error(
    'DISCORD_TOKEN não definido. Copie ".env.example" para ".env" e coloque o token do bot.',
  );
}

const activityType = raw.activityType || 'Playing';
if (!ACTIVITY_TYPES.includes(activityType)) {
  throw new Error(
    `config.json: "activityType" inválido ("${activityType}"). Use: ${ACTIVITY_TYPES.join(', ')}.`,
  );
}

module.exports = Object.freeze({
  token,
  textStatus: String(raw.textStatus ?? '').trim(),
  activityType,
  streamUrl: String(raw.streamUrl ?? '').trim(),
  description: String(raw.description ?? '').trim(),
  devGuildId: String(raw.devGuildId ?? '').trim(),
  timezone: raw.timezone || 'America/Sao_Paulo',
});
