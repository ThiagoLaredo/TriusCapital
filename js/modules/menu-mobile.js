import outsideClick from "./outsideclick.js";

export default class MenuMobile {
  constructor(menuButton, menuList, events) {
    this.menuButton = document.querySelector(menuButton);
    this.menuList = document.querySelector(menuList);
    this.activeClass = "active";

    // define touchstart e click como argumento padrão
    // de events caso o usuário não define
    if (events === undefined) this.events = ["touchstart", "click"];
    else this.events = events;

    this.openMenu = this.openMenu.bind(this);
  }

 isMobile() {
    // Essa função verifica se o usuário está em um dispositivo móvel
    // Pode ser ajustada para usar uma verificação mais sofisticada
    return window.innerWidth <= 800; // Exemplo de breakpoint para mobile
  }

  openMenu(event) {
    event.preventDefault();
    this.menuList.classList.add(this.activeClass);
    this.menuButton.classList.add(this.activeClass);
    outsideClick(this.menuList, this.events, () => {
      this.menuList.classList.remove(this.activeClass);
      this.menuButton.classList.remove(this.activeClass);
    });
  }

  addMenuMobileEvents() {
    this.events.forEach((evento) =>
      this.menuButton.addEventListener(evento, this.openMenu)
    );
  }

  addLinkClickEvents() {
    const links = this.menuList.querySelectorAll('a'); // Seleciona todos os links no menu
    links.forEach(link => {
    link.addEventListener('click', (event) => {
      // Checa se está em um dispositivo móvel
      if (this.isMobile()) {
        event.preventDefault(); // Previne a navegação padrão apenas em dispositivos móveis
        this.menuList.classList.remove(this.activeClass); // Fecha o menu
        this.menuButton.classList.remove(this.activeClass); // Altera o botão do menu para o estado não ativo

         // Extrai o ID do href do link para mobile ou desktop
         const modifiedTargetId = `mobile-${link.getAttribute('href').substring(1)}`;
         const targetSection = document.getElementById(modifiedTargetId);

        if (targetSection) {
          // Calcula o offsetTop considerando a altura de um possível cabeçalho fixo
          const offsetTop = targetSection.offsetTop - (document.querySelector('.header')?.offsetHeight || 0);
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      } // Não é necessário um else, pois a navegação padrão do Swiper em desktop deve funcionar
    });
  });
}

  init() {
    if (this.menuButton && this.menuList) {
      this.addMenuMobileEvents();
      this.addLinkClickEvents(); 
    }
    return this;
  }
}


