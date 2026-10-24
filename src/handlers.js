const config = require('./config');
const store = require('./store');
const messages = require('./messages');
const { mainMenu, backMenu, linkMenu, languageMenu } = require('./keyboards');

// Pages that only show text + a "Main Menu" button
const INFO_PAGES = ['about', 'verify', 'faq', 'troubleshoot'];

// Pages that show text + an external link button
const LINK_PAGES = {
  support: { label: 'messageSupport', url: () => config.supportUrl },
  app: { label: 'openApp', url: () => config.appUrl },
  community: { label: 'joinCommunity', url: () => config.communityUrl }
};

const getLang = (ctx) => (ctx.from ? store.getLanguage(ctx.from.id) : null);

const askLanguage = (ctx) =>
  ctx.reply(messages.languagePrompt, { reply_markup: languageMenu() });

// Runs `action(lang, m)` for users who picked a language; otherwise asks first.
function withLang(action) {
  return async (ctx) => {
    if (ctx.callbackQuery) await ctx.answerCallbackQuery();
    const lang = getLang(ctx);
    if (!lang) return askLanguage(ctx);
    return action(ctx, lang, messages[lang]);
  };
}

function registerHandlers(bot) {
  // ---- Commands ----
  bot.command('start', withLang((ctx, lang, m) =>
    ctx.reply(m.welcome, { reply_markup: mainMenu(lang) })
  ));

  bot.command('help', withLang((ctx, lang, m) =>
    ctx.reply(m.help, { reply_markup: mainMenu(lang) })
  ));

  bot.command('about', withLang((ctx, lang, m) =>
    ctx.reply(m.about, { reply_markup: backMenu(lang) })
  ));

  bot.command('language', (ctx) => askLanguage(ctx));

  // ---- Language selection ----
  bot.callbackQuery('language', async (ctx) => {
    await ctx.answerCallbackQuery();
    await askLanguage(ctx);
  });

  bot.callbackQuery(/^lang:(en|am)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const lang = ctx.match[1];
    store.setLanguage(ctx.from.id, lang);
    await ctx.reply(messages[lang].languageSet);
    await ctx.reply(messages[lang].welcome, { reply_markup: mainMenu(lang) });
  });

  // ---- Menu buttons ----
  bot.callbackQuery('home', withLang((ctx, lang, m) =>
    ctx.reply(m.welcome, { reply_markup: mainMenu(lang) })
  ));

  for (const page of INFO_PAGES) {
    bot.callbackQuery(page, withLang((ctx, lang, m) =>
      ctx.reply(m[page], { reply_markup: backMenu(lang) })
    ));
  }

  for (const [page, { label, url }] of Object.entries(LINK_PAGES)) {
    bot.callbackQuery(page, withLang((ctx, lang, m) => {
      const link = url();

      if (!link) {
        const note =
          page === 'support'
            ? m.support + m.supportNotConfigured
            : m.notConfigured;
        return ctx.reply(note, { reply_markup: backMenu(lang) });
      }

      return ctx.reply(m[page], {
        reply_markup: linkMenu(lang, m.buttons[label], link)
      });
    }));
  }

  // Unknown buttons
  bot.on('callback_query:data', withLang((ctx, lang, m) =>
    ctx.reply(m.unknownButton, { reply_markup: mainMenu(lang) })
  ));

  // ---- Any other text message ----
  bot.on('message:text', withLang((ctx, lang, m) =>
    ctx.reply(m.fallback, { reply_markup: mainMenu(lang) })
  ));
}

module.exports = { registerHandlers };
