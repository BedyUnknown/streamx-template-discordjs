const { ActivityType, Events } = require('discord.js');
const config = require('../../config');
const logger = require('../../utils/logger');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    logger.success(`${client.user.tag} está online!`);

    // Presença (status + atividade). Sem "textStatus", o bot fica só online.
    const presence = { status: 'online', activities: [] };

    if (config.textStatus) {
      const type = ActivityType[config.activityType];
      const activity = { name: config.textStatus, type };

      if (type === ActivityType.Streaming) {
        if (config.streamUrl) activity.url = config.streamUrl;
        else {
          // Streaming exige uma URL válida (Twitch/YouTube); sem ela, usa "Playing".
          logger.warn('activityType "Streaming" sem "streamUrl"; usando "Playing".');
          activity.type = ActivityType.Playing;
        }
      }

      presence.activities.push(activity);
    }

    client.user.setPresence(presence);

    // Atualiza a descrição do app (aba "About Me") somente se houver texto e ele for diferente.
    if (config.description) {
      try {
        const app = await client.application.fetch();
        if (app.description !== config.description) {
          await client.application.edit({ description: config.description });
        }
      } catch (error) {
        logger.error('Erro ao atualizar a descrição da aplicação:', error.message);
      }
    }

    await client.registerCommands();
  },
};
