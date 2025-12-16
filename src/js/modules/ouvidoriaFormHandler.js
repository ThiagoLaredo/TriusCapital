// modules/ouvidoriaFormHandler.js
export default class OuvidoriaFormHandler {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (this.form) {
      // Verificar se já existe uma div de resposta
      this.responseMessage = document.getElementById('ouvidoria-response-message');
      
      // Se não existir, criar uma nova
      if (!this.responseMessage) {
        this.responseMessage = document.createElement('div');
        this.responseMessage.id = 'ouvidoria-response-message';
        this.form.append(this.responseMessage);
      }
      
      this.styleResponseMessage();
      this.addEventListeners();
      this.setupModal();
    }
  }

  addEventListeners() {
    this.form.addEventListener('submit', event => this.handleSubmit(event));
  }

  setupModal() {
    this.modal = document.getElementById('modal-confirmacao');
    if (this.modal) {
      this.modalOverlay = this.modal.querySelector('.modal-overlay');
      this.modalClose = this.modal.querySelector('.modal-close');
      this.modalCloseBtn = document.getElementById('modal-close-btn');

      const closeModal = () => {
        this.modal.style.display = 'none';
      };

      if (this.modalClose) {
        this.modalClose.addEventListener('click', closeModal);
      }
      if (this.modalCloseBtn) {
        this.modalCloseBtn.addEventListener('click', closeModal);
      }
      if (this.modalOverlay) {
        this.modalOverlay.addEventListener('click', closeModal);
      }
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    
    const titulo = document.getElementById('titulo');
    const descricao = document.getElementById('descricao');
    
    let isValid = true;
    
    if (!titulo.value.trim()) {
      this.showFieldError(titulo, 'Título é obrigatório');
      isValid = false;
    } else {
      this.clearFieldError(titulo);
    }
    
    if (!descricao.value.trim()) {
      this.showFieldError(descricao, 'Descrição é obrigatória');
      isValid = false;
    } else {
      this.clearFieldError(descricao);
    }
    
    const anexosInput = document.getElementById('anexos');
    if (anexosInput.files.length > 0) {
      for (let file of anexosInput.files) {
        if (file.size > 5 * 1024 * 1024) {
          this.showFieldError(anexosInput, `O arquivo ${file.name} excede 5MB`);
          isValid = false;
          break;
        }
      }
    }
    
    if (!isValid) return;
    
    this.enviarDenuncia();
  }

  showFieldError(element, message) {
    this.clearFieldError(element);
    element.classList.add('error');
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '12px';
    errorElement.style.marginTop = '5px';
    element.parentNode.appendChild(errorElement);
  }

  clearFieldError(element) {
    element.classList.remove('error');
    const existingError = element.parentNode.querySelector('.field-error-message');
    if (existingError) {
      existingError.remove();
    }
  }

 enviarDenuncia() {
  const formData = new FormData(this.form);
  
  this.showLoadingIndicator();
  
  fetch('./enviar-ouvidoria.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    // Esconder mensagem de "Enviando"
    this.responseMessage.style.display = 'none';
    
    // Reativar botão
    const submitBtn = this.form.querySelector('.btn-submit');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar Denúncia';
    }
    
    if (data.success) {
      this.showModalConfirmation(data.protocolo);
      this.form.reset();
    } else {
      this.showResponseMessage(data.message || 'Erro ao enviar denúncia', 'error');
    }
  })
  .catch(error => {
    console.error('Erro:', error);
    // Esconder mensagem de "Enviando"
    this.responseMessage.style.display = 'none';
    
    // Reativar botão
    const submitBtn = this.form.querySelector('.btn-submit');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar Denúncia';
    }
    
    this.showResponseMessage('Erro na comunicação com o servidor', 'error');
  });
}

  showLoadingIndicator() {
    const submitBtn = this.form.querySelector('.btn-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando...';
    }
    
    this.responseMessage.textContent = 'Enviando sua denúncia...';
    this.responseMessage.style.display = 'block';
    this.responseMessage.style.backgroundColor = '#f0f0f0';
    this.responseMessage.style.color = '#333';
  }

  showResponseMessage(message, type) {
    // Reativar botão primeiro
    const submitBtn = this.form.querySelector('.btn-submit');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar Denúncia';
    }
    
    this.responseMessage.textContent = message;
    this.responseMessage.style.display = 'block';
    this.responseMessage.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    this.responseMessage.style.color = type === 'success' ? '#155724' : '#721c24';
    this.responseMessage.style.border = type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
    this.responseMessage.style.padding = '10px';
    this.responseMessage.style.marginTop = '15px';
    this.responseMessage.style.borderRadius = '4px';
    
    setTimeout(() => {
      this.responseMessage.style.display = 'none';
    }, 5000);
  }

  showModalConfirmation(protocolo) {
    // Reativar botão
    const submitBtn = this.form.querySelector('.btn-submit');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar Denúncia';
    }
    
    // Esconder mensagem de "Enviando"
    this.responseMessage.style.display = 'none';
    
    const protocolElement = document.getElementById('protocol-number');
    if (protocolElement && protocolo) {
      protocolElement.textContent = protocolo;
    }
    
    if (this.modal) {
      this.modal.style.display = 'block';
    }
  }

  styleResponseMessage() {
    this.responseMessage.style.marginTop = '15px';
    this.responseMessage.style.padding = '10px';
    this.responseMessage.style.borderRadius = '4px';
    this.responseMessage.style.display = 'none';
  }
}