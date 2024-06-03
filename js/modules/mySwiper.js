import gsap from 'gsap';

export default class MySwiper {
  constructor() {
    this.swiper = null;
    this.currentSlideIndex = 0; // Inicializa com 0 ou o slide inicial desejado

    document.addEventListener('DOMContentLoaded', () => {
      // Adiciona um ouvinte de evento para redimensionamento da janela
      window.addEventListener('resize', this.handleResize.bind(this));
      this.handleResize();
      this.carregamentoImagemIntro();
      this.carregamentoImagemQuemSomos();
    });
  }

  isMobile() {
    return window.innerWidth <= 768;
  }

  handleResize() {
  if (this.isMobile()) {
    if (this.swiper) {
      this.destroySwiper();
      // Aplica o estado padrão do cabeçalho para mobile, independentemente do slide
      this.updateHeaderAndApplyClasses(-1); // Passa um valor específico que indica modo mobile
    }
  } else {
    if (!this.swiper) {
      this.initializeSwiper();
      this.updateHeaderAndApplyClasses(this.currentSlideIndex);
    }
  }
  }

  swiperInit() {
  // Usando setTimeout para garantir que o Swiper esteja completamente inicializado
    setTimeout(() => {
      if (this.swiper) {
        this.initialVisibility();
        // Agora estamos seguros para acessar this.swiper.realIndex
        this.updateHeaderAndApplyClasses(this.swiper.realIndex);
        // Anima o conteúdo do slide inicial
        const initialSlide = this.swiper.slides[this.swiper.activeIndex];
        this.animateContentIn(initialSlide);
        this.animateMap();
        this.animateSVG(initialSlide);
        console.log('Iniciando animação dos números na inicialização');
        this.animateNumbers(); // Garante que os números sejam animados na inicialização
      }
    }, 0); // Um atraso de 0 ms é suficiente para colocar esta chamada no fim da fila do event loop
  }

  initializeSwiper() {
    this.swiper = new Swiper(".mySwiper", {
      direction: "vertical",
      speed: 1000,
      mousewheel: true,
      preventClicks: false,
      preventClicksPropagation: false,
      autoHeight: false,
      hashNavigation: {
      watchState: true,
      },
       on: {
        init: () => {
          this.swiperInit(); // Assume que swiperInit já faz o que está no método bind(this)
          // this.checkSlideForSwiper2(); // Adiciona a chamada aqui
        },
        slideChange: () => {
          this.slideChange(); 
        },
             
        slideChangeTransitionStart: () => {
          // Certifique-se de que o swiper está inicializado e o slide ativo está disponível
          if (this.swiper && this.swiper.slides && this.swiper.activeIndex !== undefined) {
            const activeSlide = this.swiper.slides[this.swiper.activeIndex];
            this.animateContentIn(activeSlide);
   
            // Verifique se o slide atual contém o mapa
            if (activeSlide.querySelector('svg')) { // Ajuste o seletor conforme necessário
              this.animateMap();
            }
            // Especificamente anima o SVG dentro da 'svg-background' se existir
            if (activeSlide.querySelector('.svg-quemsomos svg')) {
              this.animateSVG(activeSlide);
            }
          }
        },
      
        // Evento chamado quando a transição termina
        slideChangeTransitionEnd: () => {
          // Animação de entrada para o novo slide
          if (this.swiper && this.swiper.slides && this.swiper.activeIndex !== undefined) {
            const activeSlide = this.swiper.slides[this.swiper.activeIndex];
            if (activeSlide.datahash === 'quemsomos' || activeSlide.dataset.hash === 'quemsomos') {
              this.animateNumbers();
            }
          }
        }     
      },
    });
  }

  initialVisibility() {
    const pagination = document.querySelector('.swiper-pagination');
    if (pagination) pagination.style.display = 'none';

    // Assumindo que você possa determinar o slide inicial aqui ou usar this.swiper.realIndex
    let initialSlideIndex = this.swiper ? this.swiper.realIndex : 0;
    this.updateHeaderAndApplyClasses(initialSlideIndex);
  } 

  animateContentIn(slide) {
    if (this.isMobile()) {
      return;
    }
    console.log('Iniciando animação de conteúdo');
    const commonElements = slide.querySelectorAll('h2, h3, p, li, .destaque__institucional, .quem-somos, .destaque__quem-somos, .servico, img, svg, #contact-form');
    if (commonElements.length > 0) {
      gsap.fromTo(commonElements,
        { y: -30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.2,
          ease: "power1.out",
        onComplete: () => {
          if (!this.isMobile()) {
            this.animateMap();
          }
          console.log('Conteúdo animado');
          // this.animateNumbers();
        }
      }     
      );
    }
  }
    
  animateNumbers() {
    // Seleciona todos os elementos com a classe 'numero'
    const numberElements = document.querySelectorAll('.numero');

    // Para cada elemento 'numero' encontrado
    numberElements.forEach(element => {
      
      // Obtém o valor final do atributo 'data-end-value' do elemento
      const endValue = parseInt(element.getAttribute('data-end-value'), 10);
      // Verifica se o valor final é igual a 1000 (indicando 1 BI)
      const isBillion = endValue === 1000;
      // Define a duração da animação, 10 segundos para 1 BI e 5 segundos para os demais
      const duration = isBillion ? 3 : 5;

      if (isBillion) {
        // Animação personalizada para o número 1 BI
        const milestones = [0, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000000];
        const totalMilestones = milestones.length;
        const timePerMilestone = duration / totalMilestones;

        // Cria uma animação GSAP para o elemento
        gsap.to(element, {
          innerHTML: 1000000000, // Define o valor final da animação
          duration: duration, // Define a duração da animação
          ease: "none", // Define a facilidade da animação
          onUpdate: function () {
            // Durante a animação, atualiza o texto do elemento
            const val = Math.round(this.targets()[0].innerHTML);
            // Se o valor for maior ou igual a 1000000000, define como "+ 1 BI"
            if (val >= 1000000000) {
              element.innerHTML = "+ 1 BI";
            } else {
              // Caso contrário, atualiza o texto com o valor atual formatado
              element.innerHTML = "+ " + val.toLocaleString();
            }
          },
          onComplete: function () {
            // Quando a animação termina, garante que o texto é "+ 1 BI"
            element.innerHTML = "+ 1 BI";
            // Marca o elemento como animado
            element.setAttribute('data-animated', 'true');
          },
          snap: { innerHTML: 100000 } // Define o incremento para o valor durante a animação
        });
      } else {
        // Animação normal para outros números
        gsap.fromTo(element, 
          { innerHTML: 0 }, // Valor inicial
          { 
            innerHTML: endValue, // Valor final
            duration: duration, // Duração da animação
            ease: "power2.out", // Facilidade da animação
            snap: { innerHTML: 1 }, // Define o incremento para o valor durante a animação
            onUpdate: function () {
              // Durante a animação, atualiza o texto do elemento
              element.innerHTML = "+ " + Math.round(this.targets()[0].innerHTML);
            },
            onComplete: function () {
              // Quando a animação termina, garante que o texto é o valor final
              element.innerHTML = "+ " + endValue;
              // Marca o elemento como animado
              element.setAttribute('data-animated', 'true');
            }
          });
      }
    });
  }
   
  animateMap() {
    const slideMapa = this.swiper.slides[this.swiper.activeIndex];
    console.log(slideMapa);
    const mapaSVG = slideMapa.querySelector('svg'); // Selecione o SVG pelo elemento específico
    console.log(mapaSVG);
    const paises = ['DO', 'GT', 'Unitedstates', 'EC', 'BR', 'Chile', 'Argentina', 'Angola', 'SN', 'ES', 'PT','Indonesia']; // Exemplo de classes/ids

    if (mapaSVG) {

      paises.forEach((pais, index) => {
        let seletor = mapaSVG.querySelector(`.${pais}`) ? `.${pais}` : `#${pais}`;
        // Resetar as propriedades para os estados iniciais aqui, se necessário
        gsap.set(seletor, { fill: '#ececec' }); // Substitua 'cor_inicial' pela cor original dos países
      });
      // Adiciona um delay inicial antes de começar a animação dos países
      gsap.delayedCall(2, () => {
        paises.forEach((pais, index) => {
          // Verifica se o elemento é class ou id e ajusta o seletor
          let seletor = mapaSVG.querySelector(`.${pais}`) ? `.${pais}` : `#${pais}`;
          gsap.to(seletor, {
            fill: '#4E7A9B',
            delay: index * 0.3, // Mantém o delay existente entre as animações dos países
            duration: 1,
          });
        });
      });
    }
  }

  animateSVG(slide) {
    const paths = slide.querySelectorAll('.cls-2');

    paths.forEach(path => {
      if (path instanceof SVGPathElement) {  // Verificação para garantir que o elemento é um SVGPathElement
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        gsap.set(path, { fill: "none" });  // Define explicitamente o preenchimento inicial

        // Animação para "desenhar" o caminho
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 5,
          ease: "none",  // Uso de easing linear
      
        });
      } else {
        console.error('Elemento não é um SVGPathElement:', path);
      }
    });
  }

  destroySwiper() {
    // Verifica se o Swiper existe antes de tentar destruí-lo
    if (this.swiper !== null) {
      this.swiper.destroy(true, true);
      this.swiper = null; // Reseta a referência do Swiper
    }
  }

  slideChange() {
     // Verifica se o Swiper está definido e inicializado corretamente antes de tentar acessar suas propriedades
     if (!this.swiper || typeof this.swiper.realIndex === 'undefined') {
      console.log("Swiper não inicializado.");
      return; // Sai do método se o Swiper não estiver inicializado
  }

     // Atualiza currentSlideIndex aqui
     this.currentSlideIndex = this.swiper.realIndex;

    // Primeiro, verifica se o Swiper está definido e inicializado corretamente.
    if (!this.swiper || typeof this.swiper.realIndex === 'undefined') {
        console.log("Swiper não inicializado.");
        return; // Sai do método se o Swiper não estiver inicializado
    }

    const currentSlideIndex = this.swiper.realIndex;

    // Atualiza a visibilidade e classes do cabeçalho baseado no slide atual
    this.updateHeaderAndApplyClasses(currentSlideIndex);

    const pagination = document.querySelector('.swiper-pagination');

    // Atualiza a visibilidade do menu lateral e da paginação
    const displayStyle = currentSlideIndex >= 1 ? 'flex' : 'none';
    if (pagination) pagination.style.display = displayStyle;

    // Aplica a classe 'menu-white' no slide 4 ou 6
    const shouldApplyMenuWhite = [4, 6].includes(currentSlideIndex);
    if (pagination) pagination.classList.toggle('menu-white', shouldApplyMenuWhite);

    // Remove 'active' class de todos os itens do menu
    document.querySelectorAll('.project-menu-item').forEach(menuItem => {
        menuItem.classList.remove('active');
    });

    // Ativa o item do menu correspondente ao slide atual
  this.activateCurrentMenuItem(currentSlideIndex);
  this.updateHeaderAndApplyClasses(this.currentSlideIndex);
  }

  updateHeaderAndApplyClasses(currentSlideIndex) {
    const header = document.querySelector('.header');
    const headerMenu = document.querySelector('.header_menu');
    const logo = document.querySelector('a > img'); // Assumindo que o logo é o primeiro <img> dentro de um <a>
    const menuLinks = document.querySelectorAll('.menu a');
  
    // Caminhos para os logos
    const originalLogoSrc = "./img/logo.svg";
    const reducedLogoSrc = "./img/logo-reduzido.svg";
  
    // Captura o estado atual antes de modificar
    const initialState = {
      headerClass: header.classList.contains('dark'),
      headerMenuClass: headerMenu.classList.contains('dark') || headerMenu.classList.contains('minimal'),
      logoSrc: logo.src,
      logoClass: logo.classList.contains('minimal'),
      menuLinksClass: Array.from(menuLinks).map(link => link.classList.contains('minimal') || link.classList.contains('dark')),
    };
  
    // Função para comparar os estados e decidir sobre animações
    const applyAnimationsIfNeeded = (newState) => {
      if (newState.headerClass !== initialState.headerClass ||
          newState.headerMenuClass !== initialState.headerMenuClass ||
          newState.logoSrc !== initialState.logoSrc ||
          newState.logoClass !== initialState.logoClass ||
          !newState.menuLinksClass.every((value, index) => value === initialState.menuLinksClass[index]) ||
          newState.menuButtonClass !== initialState.menuButtonClass) {
        // Animação de opacidade para transição, excluindo menuButton
        gsap.fromTo([header, headerMenu, logo, menuLinks], 
                    { opacity: 0 },
                    { duration: 0.5, opacity: 1 });
      }
    };
    
    // Resetando classes para evitar conflitos
    header.classList.remove('dark');
    headerMenu.classList.remove('minimal', 'dark');
    logo.classList.remove('minimal');
    menuLinks.forEach(link => link.classList.remove('minimal', 'dark'));
  
    if (currentSlideIndex === -1 || this.isMobile()) {
        logo.src = originalLogoSrc; // Usar o logo original
    } else {
        if (currentSlideIndex >= 1) {
            headerMenu.classList.add('minimal');
            logo.src = reducedLogoSrc;
            logo.classList.add('minimal');
            menuLinks.forEach(link => link.classList.add('minimal'));
        } else {
            logo.src = originalLogoSrc;
        }
  
        if ([1, 2, 5].includes(currentSlideIndex)) {
            header.classList.add('dark');
            headerMenu.classList.add('dark');
            menuLinks.forEach(link => link.classList.add('dark'));
        }
    }
  
    // Captura o novo estado após modificações
    const newState = {
      headerClass: header.classList.contains('dark'),
      headerMenuClass: headerMenu.classList.contains('dark') || headerMenu.classList.contains('minimal'),
      logoSrc: logo.src,
      logoClass: logo.classList.contains('minimal'),
      menuLinksClass: Array.from(menuLinks).map(link => link.classList.contains('minimal') || link.classList.contains('dark')),
    };
  
    // Aplica animações se houver mudanças reais
    applyAnimationsIfNeeded(newState);
  }
  
  checkIfQuemSomosSlide(slide) {
    return window.location.hash === '#quemsomos' || slide.hash === 'quemsomos';
  }

  activateCurrentMenuItem(currentSlideIndex) {
    // Se o índice do slide atual for válido
    const currentSlide = this.swiper.slides[currentSlideIndex];
    if (currentSlide) {
        // Obtém o valor do hash do slide atual
        let currentSlideHash = currentSlide.getAttribute('data-hash');
        // Encontra o item de menu correspondente e adiciona a classe 'active'
        let correspondingMenuItem = document.querySelector(`.project-menu-item[href="#${currentSlideHash}"]`);
        if (correspondingMenuItem) {
            correspondingMenuItem.classList.add('active');
        }
    }
  }

  // async carregamentoImagemIntro() {
  //   const img = document.getElementById("bg-img-intro");
  //   const slide = document.querySelector('.swiper-slide.intro');
  
  //   console.log("Tentando carregar a imagem intro:", img.src);
  
  //   try {
  //     await fetch(img.src, { method: 'HEAD' });
  //     img.addEventListener("load", function() {
  //       console.log("Imagem intro carregada com sucesso:", img.src);
  //       slide.style.backgroundImage = `linear-gradient(var(--secondary65), var(--secondary65)), url(${img.src})`;
  //     });
  
  //     // Trigger the load event if the image is already cached
  //     if (img.complete) {
  //       img.dispatchEvent(new Event('load'));
  //     }
  //   } catch (error) {
  //     console.error("Erro ao carregar a imagem intro:", img.src);
  //   }
  // }
  
  // async carregamentoImagemQuemSomos() {
  //   const img = document.getElementById("bg-img-quemsomos");
  //   const slide = document.getElementById("mobile-quemsomos");
  
  //   console.log("Tentando carregar a imagem de quem somos:", img.src);
  
  //   try {
  //     await fetch(img.src, { method: 'HEAD' });
  //     img.addEventListener("load", function() {
  //       console.log("Imagem de quem somos carregada com sucesso:", img.src);
  //       slide.style.backgroundImage = `linear-gradient(var(--primary45), var(--primary45)), url(${img.src})`;
  //     });
  
  //     // Trigger the load event if the image is already cached
  //     if (img.complete) {
  //       img.dispatchEvent(new Event('load'));
  //     }
  //   } catch (error) {
  //     console.error("Erro ao carregar a imagem de quem somos:", img.src);
  //   }
  // }

  carregamentoImagemIntro() {
    const img = document.getElementById("bg-img-intro");
    const slide = document.querySelector('.swiper-slide.intro');
  
    console.log("Tentando carregar a imagem intro:", img.src);
  
    img.addEventListener("load", function() {
      console.log("Imagem intro carregada com sucesso:", img.src);
      slide.style.backgroundImage = `linear-gradient(var(--secondary65), var(--secondary65)), url(${img.src})`;
    });
  
    img.addEventListener("error", function() {
      console.error("Erro ao carregar a imagem intro:", img.src);
    });
  
    // Trigger the load event if the image is already cached
    if (img.complete) {
      img.dispatchEvent(new Event('load'));
    }
  }
  
  carregamentoImagemQuemSomos() {
    const img = document.getElementById("bg-img-quemsomos");
    const slide = document.getElementById("mobile-quemsomos");
  
    console.log("Tentando carregar a imagem de quem somos:", img.src);
  
    img.addEventListener("load", function() {
      console.log("Imagem de quem somos carregada com sucesso:", img.src);
      slide.style.backgroundImage = `linear-gradient(var(--primary45), var(--primary45)), url(${img.src})`;
    });
  
    img.addEventListener("error", function() {
      console.error("Erro ao carregar a imagem de quem somos:", img.src);
    });
  
    // Trigger the load event if the image is already cached
    if (img.complete) {
      img.dispatchEvent(new Event('load'));
    }
  }
}





