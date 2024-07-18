export default class LanguageSwitcher {
  constructor(translations) {
    this.translations = translations;
    this.currentLang = 'pt'; // Define o idioma padrão como português
  }

  switchLanguage(lang) {
    this.currentLang = lang;
    document.querySelectorAll("[data-translate]").forEach(elem => {
      const key = elem.getAttribute("data-translate");
      if (this.translations[lang][key]) {
        if (elem.tagName.toLowerCase() === 'input' || elem.tagName.toLowerCase() === 'textarea') {
          elem.placeholder = this.translations[lang][key];
        } else if (key === "endereco") {
          elem.innerHTML = this.translations[lang][key].replace(/\n/g, '<br>');
        } else {
          elem.textContent = this.translations[lang][key];
        }
      }
    });
  }
}