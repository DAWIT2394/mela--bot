const { InlineKeyboard } = require('grammy');
const messages = require('./messages');

function mainMenu(lang) {
  const b = messages[lang].buttons;
  return new InlineKeyboard()
    .text(b.about, 'about')
    .text(b.verify, 'verify')
    .row()
    .text(b.faq, 'faq')
    .text(b.troubleshoot, 'troubleshoot')
    .row()
    .text(b.support, 'support')
    .row()
    .text(b.app, 'app')
    .text(b.community, 'community')
    .row()
    .text(b.language, 'language');
}

function backMenu(lang) {
  return new InlineKeyboard().text(messages[lang].buttons.home, 'home');
}

function linkMenu(lang, label, url) {
  return new InlineKeyboard()
    .url(label, url)
    .row()
    .text(messages[lang].buttons.home, 'home');
}

function languageMenu() {
  return new InlineKeyboard()
    .text('🇬🇧 English', 'lang:en')
    .text('🇪🇹 አማርኛ', 'lang:am');
}

module.exports = { mainMenu, backMenu, linkMenu, languageMenu };
