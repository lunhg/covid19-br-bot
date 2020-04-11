// Import libs
const fs = require('fs');
const path = require('path');
const Telegraf = require('telegraf');
const MySQLSession = require('telegraf-session-mysql');

// If you use heroku, you will need some webhooks
// https://github.com/telegraf/telegraf/issues/44
const express = require('express');
const app = express();

if (fs.existsSync(path.join(__dirname, '.env'))) {
  require('dotenv').config();
}

// configure session
const session = new MySQLSession({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_USER_PWD,
  database: process.env.MYSQL_USER_DB
});


//configure telegram bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// use webhook with express
// avoid crashes
app.use(bot.webhookCallback(`/bot${process.env.BOT_TOKEN}`));

// use tmp and persistent session middleware
bot.use(session.middleware());

// check session middleware
const TelegrafLogger = require('./lib/logger');
const logger = new TelegrafLogger({
  format: '[%now] @%uid: %msg'
});
bot.use(logger.middleware());

// -----
// Start
// -----
const start = require('./commands/start');
bot.command('start', start());

// -----
// Ajuda
// -----
const help = require('./commands/help');
bot.command('help', help());

// ------
// Whoami
// ------
bot.command('/whoami', (ctx) => {
  ctx.reply("Eu sou um robô com o intuito de auxiliar a população a se informar e a informar, afim de combatermos este patógeno.");
});

// -----
// Fonts
// -----
bot.command('/fontes', (ctx) => {
  const msg = [
    "Conjunto de dados:: https://brasil.io/dataset/covid19",
    "Código-fonte: https://github.com/lunhg/covid19-br-bot",
    "Falhas e sugestões: https://github.com/lunhg/covid19-br-bot/issues"
  ];
  ctx.reply(msg.join("\n"));
});

// ------
// Estado
// ------
const uf = require('./commands/uf');
bot.command('/uf', uf(session, logger));

// ------
// Cidade
// ------
const cidade = require('./commands/cidade');
bot.command('/cidade', cidade(session, logger));

// ------
// Casos
// ------
const casos = require('./commands/casos');
bot.command('/casos', casos(session, logger));

bot.catch((err, ctx) => {
  logger.logger.error(err)
});

// -----------
// Express app
// -----------
app.get('/', (req, res) => {
  res.send('Hello World! Bot running!');
});


app.listen(process.env.PORT || 3000, () => {
  bot.launch();
});

