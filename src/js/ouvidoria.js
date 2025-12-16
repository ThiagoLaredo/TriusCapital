// ouvidoria.js - Arquivo específico para a página de ouvidoria
import MenuMobile from './modules/menu-mobile.js';
import HeaderScroll from './modules/header-scroll.js';
import LanguageSwitcher from './modules/languageSwitcher.js';
import OuvidoriaFormHandler from './modules/ouvidoriaFormHandler.js'; // Importação correta

import "../css/global.css";
import "../css/header.css";
import "../css/menu-mobile.css";
import "../css/componentes.css";
import "../css/cores.css";
import "../css/ouvidoria.css";

// Inicializar apenas os módulos necessários para ouvidoria
const menuMobile = new MenuMobile('[data-menu="logo"]', '[data-menu="button"]', '[data-menu="list"]', '[data-menu="contato-mobile"]', '[data-menu="linkedin"]');
menuMobile.init();

const headerScroll = new HeaderScroll('.header');
headerScroll.init();

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar o formulário de ouvidoria
  const ouvidoriaForm = document.getElementById('ouvidoria-form');
  if (ouvidoriaForm) {
    new OuvidoriaFormHandler('ouvidoria-form');
  }
  
  // Inicializar o LanguageSwitcher
  fetch('translations.json')
    .then(response => response.json())
    .then(translations => {
      const languageSwitcher = new LanguageSwitcher(translations);
  
      const btnEnglish = document.getElementById('switch-en');
      const btnPortuguese = document.getElementById('switch-pt');
  
      if (btnEnglish && btnPortuguese) {
        btnEnglish.addEventListener('click', () => {
          languageSwitcher.switchLanguage('en');
        });
  
        btnPortuguese.addEventListener('click', () => {
          languageSwitcher.switchLanguage('pt');
        });
      } else {
        console.error('Buttons not found');
      }
    })
    .catch(error => console.error('Erro ao carregar o arquivo de traduções:', error));
});