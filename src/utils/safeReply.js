const { MessageFlags } = require('discord.js');
const logger = require('./logger');

/**
 * Responde uma interação de forma segura (efêmera), sem lançar erro.
 * Usa followUp se a interação já foi respondida/adiada; senão, reply.
 * @param {import('discord.js').RepliableInteraction} interaction
 * @param {string} content
 */
async function safeReply(interaction, content) {
  const payload = { content, flags: MessageFlags.Ephemeral };

  try {
    if (interaction.deferred || interaction.replied) await interaction.followUp(payload);
    else await interaction.reply(payload);
  } catch (error) {
    logger.error('Não foi possível responder a interação:', error.message);
  }
}

module.exports = { safeReply };
