const { Collection } = require('discord.js');
const { loadFiles } = require('../utils/loadFiles');
const logger = require('../utils/logger');
const config = require('../config');

// Limites de comandos por aplicação (global): 100 slash, 15 de usuário e 15 de mensagem.
const LIMITS = { 1: 100, 2: 15, 3: 15 };
const TYPE_NAMES = { 1: 'slash', 2: 'usuário', 3: 'mensagem' };

// Slash e menus de contexto podem ter o mesmo nome, então a chave inclui o tipo.
const commandKey = (type, name) => `${type}:${name}`;

module.exports = (client) => {
  client.commands = new Collection();
  client.commandArray = [];

  client.commandKey = commandKey;

  // Lê os arquivos de comando (recursivo) e guarda em client.commands.
  client.handleCommands = (dir) => {
    client.commands.clear();
    client.commandArray = [];

    for (const file of loadFiles(dir)) {
      let command;
      try {
        command = require(file);
      } catch (error) {
        logger.error(`Falha ao carregar o comando ${file}:`, error);
        continue;
      }

      if (typeof command?.data?.toJSON !== 'function' || typeof command.execute !== 'function') {
        logger.warn(`Comando ignorado (precisa de "data" e "execute"): ${file}`);
        continue;
      }

      const json = command.data.toJSON();
      const type = json.type ?? 1;
      const key = commandKey(type, json.name);

      if (client.commands.has(key)) {
        logger.warn(`Comando duplicado "${json.name}" ignorado: ${file}`);
        continue;
      }

      client.commands.set(key, command);
      client.commandArray.push(json);
    }

    for (const [type, limit] of Object.entries(LIMITS)) {
      const count = client.commandArray.filter((c) => (c.type ?? 1) === Number(type)).length;
      if (count > limit) {
        logger.warn(`Há ${count} comandos de ${TYPE_NAMES[type]}; o limite do Discord é ${limit}.`);
      }
    }
  };

  // Envia os comandos para o Discord (API v10). Com "devGuildId" no config.json, registra só
  // nesse servidor (atualiza na hora); sem ele, registra globalmente (pode levar um tempo).
  client.registerCommands = async () => {
    const { devGuildId } = config;

    try {
      if (devGuildId) await client.application.commands.set(client.commandArray, devGuildId);
      else await client.application.commands.set(client.commandArray);

      logger.success(
        `${client.commandArray.length} comando(s) registrado(s) ${
          devGuildId ? `no servidor ${devGuildId}` : 'globalmente'
        }.`,
      );
    } catch (error) {
      logger.error('Erro ao registrar os comandos:', error);
    }
  };
};
