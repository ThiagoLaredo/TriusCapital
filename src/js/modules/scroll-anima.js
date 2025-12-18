import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

export default class ScrollAnima {
  constructor(sectionsSelector) {
    this.sections = document.querySelectorAll('.swiper-slide');
    this.animateSections = this.animateSections.bind(this);
    this.animateMapScroll = this.animateMapScroll.bind(this); 
    this.animateNumbersScroll = this.animateNumbersScroll.bind(this); 
  }

  isMobile() {
    return window.innerWidth <= 768;
  }

  animateSections() {
      this.sections.forEach(section => {
          const elements = section.querySelectorAll('.slide-content-position');
          if (elements.length > 0) {
              gsap.fromTo(elements, 
                  { y: -30, opacity: 0 }, 
                  {
                      y: 0, 
                      opacity: 1, 
                      duration: 0., // Mais rápido
                      stagger: 0.05, // Menos intervalo
                      ease: "power3.out", // Aceleração mais agressiva
                      scrollTrigger: {
                          trigger: section,
                          start: "top 70%", // Ajuste do ponto de ativação
                          end: "bottom 20%",
                          toggleActions: "play none none none",
                          markers: false,
                      },
                  }       
              );
          }
      }); 
  }

  animateMapScroll() {
    const sectionMapa = document.querySelector('.svg-container'); // Assume que você tenha um ID específico para a seção que contém o mapa
    
    if (sectionMapa) {
      ScrollTrigger.create({
        trigger: sectionMapa,
        start: "top 90%",
        onEnter: () => { // Quando a seção do mapa entra na visão
          const mapaSVG = sectionMapa.querySelector('svg');
          const paises = ['DO', 'GT', 'Unitedstates', 'EC', 'BR', 'Chile', 'Argentina', 'Angola', 'SN', 'ES', 'PT','Indonesia'];

          if (mapaSVG) {
            paises.forEach((pais, index) => {
              let seletor = mapaSVG.querySelector(`.${pais}`) ? `.${pais}` : `#${pais}`;
              gsap.to(seletor, {
                fill: '#4E7A9B',
                delay: index * 0.2, // Ajuste o delay conforme necessário
                duration: 1,
              });
            });
          }
        }
      });
    }
  }

  animateNumbersScroll() {
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
          scrollTrigger: {
            trigger: element,
            start: "top 80%", // Inicia a animação quando o elemento está 80% visível na viewport
            toggleActions: "play none none none" // Play na entrada, nenhuma ação nas outras transições
          },
          innerHTML: 1000000000, // Define o valor final da animação
          duration: duration, // Define a duração da animação
          ease: "none", // Define a facilidade da animação
          onUpdate: function () {
            // Durante a animação, atualiza o texto do elemento
            const val = Math.round(this.targets()[0].innerHTML);
            // Se o valor for maior ou igual a 1000000000, define como "+ 1 BI"
            if (val >= 1000000000) {
              element.innerHTML = "+ 3 BI";
            } else {
              // Caso contrário, atualiza o texto com o valor atual formatado
              element.innerHTML = "+ " + val.toLocaleString();
            }
          },
          onComplete: function () {
            // Quando a animação termina, garante que o texto é "+ 1 BI"
            element.innerHTML = "+ 3 BI";
            // Marca o elemento como animado
            element.setAttribute('data-animated', 'true');
          },
          snap: { innerHTML: 100000 } // Define o incremento para o valor durante a animação
        });
      } else {
        // Animação normal para outros números
        gsap.fromTo(element,
          {
            innerHTML: 0
          }, // Valor inicial
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
            },
            scrollTrigger: {
              trigger: element,
              start: "top 80%", // Inicia a animação quando o elemento está 80% visível na viewport
              toggleActions: "play none none none" // Play na entrada, nenhuma ação nas outras transições
            }
          });
      }
    });
  }

  
  init() {
    if (this.sections.length) {
      if (this.isMobile()) {
        this.animateSections();
        this.animateMapScroll();
        this.animateNumbersScroll();
      }    }
    return this;
  }
}
