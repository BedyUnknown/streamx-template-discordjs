const { loadFiles } = require('../utils/loadFiles');
const { join } = require('node:path');
const logger = require('../utils/logger');

// Carrega todos os eventos de src/events (recursivo).
// Cada arquivo exporta: { name, once?, execute(...args, client) }
module.exports = (client) => {
  let total = 0;

  for (const file of loadFiles(join(__dirname, '..', 'events'))) {
    let event;
    try {
      event = require(file);
    } catch (error) {
      logger.error(`Falha ao carregar o evento ${file}:`, error);
      continue;
    }

    if (!event?.name || typeof event.execute !== 'function') {
      logger.warn(`Evento ignorado (precisa de "name" e "execute"): ${file}`);
      continue;
    }

    const listener = async (...args) => {
      try {
        await event.execute(...args, client);
      } catch (error) {
        logger.error(`Erro no evento "${event.name}":`, error);
      }
    };

    if (event.once) client.once(event.name, listener);
    else client.on(event.name, listener);
    total++;
  }

  logger.info(`${total} evento(s) carregado(s).`);
};
