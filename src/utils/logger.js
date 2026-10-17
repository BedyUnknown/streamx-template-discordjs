// Logger simples, sem dependências: [data] [nível] mensagem
const { timezone } = require('../config');

const formatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: timezone,
});

const stamp = () => formatter.format(new Date()).replace(',', '');

const make =
  (method, tag) =>
  (...args) =>
    console[method](`[${stamp()}] ${tag}`, ...args);

module.exports = {
  info: make('log', '[ℹ️ ]'),
  success: make('log', '[✅]'),
  warn: make('warn', '[⚠️ ]'),
  error: make('error', '[❌]'),
};
