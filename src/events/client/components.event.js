const { Events } = require('discord.js');
// const { minhaFuncao } = require('../../functions/index');
const logger = require('../../utils/logger');
const { safeReply } = require('../../utils/safeReply');

// Roteia botões, selects e modais pelo customId.
module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isMessageComponent() && !interaction.isModalSubmit()) return;

    const { customId } = interaction;

    try {
      // botões
      if (interaction.isButton()) {
        // if (customId === 'seuIdAqui') return await minhaFuncao(interaction, client);
      }

      // modais
      if (interaction.isModalSubmit()) {
        // if (customId.startsWith('seuIdAqui')) return await minhaFuncao(interaction, client);
      }

      // menus de seleção (string, usuário, cargo, canal, mencionável)
      if (interaction.isAnySelectMenu()) {
        // if (customId.endsWith('seuIdAqui')) return await minhaFuncao(interaction, client);
      }
    } catch (error) {
      logger.error(`Erro no componente "${interaction.customId}":`, error);
      await safeReply(interaction, '❌ Ocorreu um erro ao processar esta ação.');
    }
  },
};
