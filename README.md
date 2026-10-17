# Discord Bot Template

Template simples e organizado para criar bots de Discord com **JavaScript** e **discord.js v14**.

## Recursos

- Slash commands, menus de contexto (usuário e mensagem) e autocomplete
- Roteamento de botões, selects e modais por `customId`
- Carregamento automático de comandos e eventos, inclusive em subpastas
- Tratamento de erros: o bot não cai e o usuário recebe uma resposta
- Logger com data e hora, e encerramento limpo (`SIGINT` / `SIGTERM`)
- Banco de dados JSON opcional com [wio.db](https://www.npmjs.com/package/wio.db)

## Requisitos

- [Node.js](https://nodejs.org) 22.12 ou superior
- Um bot criado no [Discord Developer Portal](https://discord.com/developers/applications)

## Instalação

```bash
git clone <url-do-repositorio>
cd <pasta-do-repositorio>
npm install
```

Crie o arquivo `.env` a partir do exemplo e preencha o token:

```bash
cp .env.example .env
```

```env
DISCORD_TOKEN=seu_token_aqui
```

Inicie o bot:

```bash
npm start
```

Para convidar o bot, gere o link em **OAuth2 → URL Generator** com os scopes `bot` e `applications.commands`.

## Configuração

As opções ficam em `config.json`:

| Chave          | Descrição                                                                  |
| -------------- | -------------------------------------------------------------------------- |
| `textStatus`   | Texto da atividade do bot. Vazio = sem atividade.                          |
| `activityType` | `Playing`, `Streaming`, `Listening`, `Watching` ou `Competing`.            |
| `streamUrl`    | Link da Twitch/YouTube. Obrigatório quando `activityType` é `Streaming`.   |
| `description`  | Descrição do aplicativo. Vazio = não altera.                               |
| `devGuildId`   | ID de um servidor de testes. Com ele, os comandos são registrados só lá.   |
| `timezone`     | Fuso horário dos logs. Padrão: `America/Sao_Paulo`.                        |

O token **nunca** vai no `config.json`; use sempre o `.env`.

## Estrutura

```
main.js                 Ponto de entrada
config.json             Configurações
databases/              Bancos de dados (wio.db)
src/
├── commands/           Comandos (aceita subpastas)
├── events/             Eventos (aceita subpastas)
├── functions/          Lógica reutilizável
├── handler/            Carregadores de comandos e eventos
└── utils/              Logger e utilitários
```

## Criando um comando

1. Copie `src/commands/template/template.txt` para `src/commands/<pasta>/<nome>.js`.
2. Ajuste o nome, a descrição e a lógica em `execute`.
3. Reinicie o bot. Os comandos são registrados automaticamente ao iniciar.

A lógica pode ficar em `src/functions/`: use `src/functions/template/template.txt` como base
e exporte a função em `src/functions/index.js`.

## Botões, selects e modais

Adicione a rota em `src/events/client/components.event.js`:

```js
if (customId === 'meuBotao') return await minhaFuncao(interaction, client);
```

## Intents

Por padrão o bot usa apenas `Guilds`, suficiente para slash commands. Intents privilegiados
(`MessageContent`, `GuildMembers`, `GuildPresences`) devem ser ativados no Developer Portal e
habilitados em `main.js`. Apps com 10.000 usuários ou mais precisam de aprovação do Discord.

## Scripts

| Comando       | Descrição                         |
| ------------- | --------------------------------- |
| `npm start`   | Inicia o bot                      |
| `npm run dev` | Inicia com reinício automático    |

## Licença

MIT
