# Mela Check Support Bot

## Structure
```
mela-check-bot/
├── package.json
├── .env.example      <- copy to .env and fill in
├── .gitignore
└── src/
    ├── index.js      <- starts the bot
    ├── config.js     <- reads and validates .env
    ├── messages.js   <- all bot texts
    ├── keyboards.js  <- all buttons/menus
    └── handlers.js   <- commands and button logic
```

## Run (PowerShell)
```
copy .env.example .env      # then edit .env
npm install
npm start
```
