const { Bot } = require('grammy');
const config = require('./config');
const { registerHandlers } = require('./handlers');

const bot = new Bot(config.token);

registerHandlers(bot);

bot.catch((err) => {
  console.error('Bot error:', err.error?.message || err.message);
});

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());

console.log('Mela Check Support Bot is starting...');

bot.start({
  onStart: (info) => console.log(`Bot connected successfully: @${info.username}`)
});
