const { readdirSync, existsSync } = require('node:fs');
const { join } = require('node:path');

/**
 * Lista, de forma recursiva, todos os arquivos .js de uma pasta.
 * Retorna caminhos absolutos em ordem alfabética (resultado previsível).
 * @param {string} dir Caminho absoluto da pasta.
 * @returns {string[]}
 */
function loadFiles(dir) {
  if (!existsSync(dir)) return [];

  const files = [];
  const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...loadFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(fullPath);
  }

  return files;
}

module.exports = { loadFiles };
