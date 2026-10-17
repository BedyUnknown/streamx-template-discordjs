// Bancos de dados (wio.db - JSON). O arquivo só é criado quando este módulo é importado:
//   const db = require('../../databases');
//   db.configs.set('chave', 'valor');
const { JsonDatabase } = require('wio.db');
const { join } = require('node:path');

const dbConfigs = new JsonDatabase({
  databasePath: join(__dirname, 'dbConfigs.json'),
});

module.exports = {
  configs: dbConfigs,
};
