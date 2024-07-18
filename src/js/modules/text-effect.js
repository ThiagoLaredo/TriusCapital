export default class ConsoleTextEffect {
  constructor(elemento, texto, velocidade, onComplete) {
    if (!elemento.hasAttribute('data-typing-started')) {
      elemento.setAttribute('data-typing-started', 'true');
      this.elemento = elemento;
      this.texto = texto;
      this.velocidade = velocidade;
      this.onComplete = onComplete;
      this.i = 0;
      this.digitar();
    } else {
      console.warn('Tentativa de reiniciar a digitação no mesmo elemento.');
    }
  }

  digitar() {
    if (this.i < this.texto.length) {
      this.elemento.innerHTML += this.texto.charAt(this.i);
      this.i++;
      setTimeout(() => this.digitar(), this.velocidade);
    } else if (this.onComplete) {
      this.onComplete();
    }
  }
}