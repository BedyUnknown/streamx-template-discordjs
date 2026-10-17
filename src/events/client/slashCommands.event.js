const { Events } = require('discord.js');
const logger = require('../../utils/logger');
const { safeReply } = require('../../utils/safeReply');

// Executa slash commands, menus de contexto (usuário/mensagem) e autocomplete.
module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    const isCommand = interaction.isChatInputCommand() || interaction.isContextMenuCommand();
    if (!isCommand && !interaction.isAutocomplete()) return;

    const command = client.commands.get(
      client.commandKey(interaction.commandType, interaction.commandName),
    );

    if (!command) {
      logger.error(`Nenhum comando correspondente a "${interaction.commandName}" foi encontrado.`);
      if (isCommand) await safeReply(interaction, '❌ Este comando não está mais disponível.');
      return;
    }

    try {
      if (interaction.isAutocomplete()) {
        await command.autocomplete?.(interaction, client);
        return;
      }

      await command.execute(interaction, client);
    } catch (error) {
      logger.error(`Erro ao executar "${interaction.commandName}":`, error);
      if (isCommand) await safeReply(interaction, '❌ Ocorreu um erro ao executar este comando.');
    }
  },
};
