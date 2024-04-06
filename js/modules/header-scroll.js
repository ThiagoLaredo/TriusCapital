export default class HeaderScroll {
  constructor(headerSelector) {
    this.header = document.querySelector(headerSelector);
    this.lastScrollTop = 0;
    this.scrollThreshold = 50; // ou qualquer valor que faça sentido para o seu site
  }

  handleScroll() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Adiciona a classe se o scroll passou o threshold definido
    if (currentScrollTop > this.scrollThreshold) {
      this.header.classList.add('header-scrolled');
    } 

    // Remove a classe apenas se o scrollTop for 0 (topo da página)
    if (currentScrollTop === 0) {
      this.header.classList.remove('header-scrolled');
    }
  }


  init() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }
}




