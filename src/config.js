require('dotenv').config();

const DEFAULT_APP_URL =
  'https://play.google.com/store/apps/details?id=com.dave.melacheck_app';

const clean = (value) => (value || '').trim();
const isHttps = (url) => /^https:\/\/\S+$/i.test(url);

const token = clean(process.env.TELEGRAM_BOT_TOKEN);
if (!token) {
  throw new Error('Missing TELEGRAM_BOT_TOKEN in .env');
}

const supportUsername = clean(process.env.SUPPORT_USERNAME).replace(/^@/, '');
const appUrl = clean(process.env.APP_URL);
const communityUrl = clean(process.env.COMMUNITY_URL);

module.exports = {
  token,
  supportUrl: /^[a-zA-Z0-9_]{5,32}$/.test(supportUsername)
    ? `https://t.me/${supportUsername}`
    : null,
  // Falls back to the official Google Play link if APP_URL is not set
  appUrl: isHttps(appUrl) ? appUrl : DEFAULT_APP_URL,
  communityUrl: isHttps(communityUrl) ? communityUrl : null
};
