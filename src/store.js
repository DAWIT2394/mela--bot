// Remembers each user's language in a small JSON file.
const fs = require('fs');
const path = require('path');

const FILE =
  process.env.DATA_FILE || path.join(__dirname, '..', 'data', 'users.json');

let data = {};
try {
  data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
} catch {
  data = {};
}

function getLanguage(userId) {
  return data[userId] || null;
}

function setLanguage(userId, lang) {
  data[userId] = lang;
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(data));
  } catch (error) {
    console.error('Could not save language:', error.message);
  }
}

module.exports = { getLanguage, setLanguage };
