// middleware/i18n.js
const i18n = require("i18next");
const i18nMiddleware = require("i18next-http-middleware");

i18n.use(i18nMiddleware.LanguageDetector).init({
  resources: {
    en: {
      translation: {
        /* English translations */
      },
    },
    // Add translations for other languages
  },
});

module.exports = i18nMiddleware.handle(i18n);
