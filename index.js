// Import libs
const fs = require('fs');
const path = require('path');
const Telegraf = require('telegraf');
const MySQLSession = require('telegraf-session-mysql');
const winston = require('winston');

// If you use heroku, you will need some webhooks
// https://github.com/telegraf/telegraf/issues/44
const express = require('express');
const app = express();

if (fs.existsSync(path.join(__dirname, '.env'))) {
  require('dotenv').config();
}

// logger
const transports = [];
if(process.env.NODE_ENV === 'development') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}
if(process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      format: winston.format.simple(),
      filename: path.join(__dirname, 'error.log'),
      level: 'error'
    })
  );
  transports.push(
    new winston.transports.File({
      format: winston.format.simple(),
      filename: 'bot.log',
      level: 'info'
    })
  );
}

const logger = winston.createLogger({transports: transports});

//configure telegram bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// configure session
const session = new MySQLSession({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_USER_PWD,
  database: process.env.MYSQL_USER_DB
});

// use webhook with express
// avoid crashes
app.use(bot.webhookCallback(`/bot${process.env.BOT_TOKEN}`));

// use tmp and persistent session middleware
bot.use(session.middleware());

// check session middleware
const setup = require('./lib/session');
bot.on('text', setup(session, logger));

// Register logger middleware
const botLogger = require('./lib/logger');
bot.use(botLogger(logger));

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
    "Brasil.io: https://brasil.io/dataset/covid19"
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
  logger.error(`Ooops, encountered an error for ${ctx.updateType}`, err)
})
// -----------
// Express app
// -----------
app.get('/', (req, res) => {
  logger.info("GET /");
  res.send('Hello World! Bot running!');
});


app.listen(process.env.PORT || 3000, () => {
  logger.info(`Server running on port ${process.env.PORT || 3000}`);
  logger.info(`Bot starting: ${new Date()}`);
  bot.launch();
});

