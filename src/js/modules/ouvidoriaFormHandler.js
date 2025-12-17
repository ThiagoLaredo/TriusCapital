// modules/ouvidoriaFormHandler.js
export default class OuvidoriaFormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.selectedFiles = []; // Array para armazenar os arquivos selecionados
        
        if (this.form) {
            // Verificar se já existe uma div de resposta
            this.responseMessage = document.getElementById('ouvidoria-response-message');
            
            // Se não existir, criar uma nova
            if (!this.responseMessage) {
                this.responseMessage = document.createElement('div');
                this.responseMessage.id = 'ouvidoria-response-message';
                this.form.append(this.responseMessage);
            }
            
            // Criar container para lista de arquivos
            this.createFileListContainer();
            
            this.styleResponseMessage();
            this.addEventListeners();
            this.setupModal();
        }
    }

    createFileListContainer() {
        // Verificar se já existe o container
        this.fileListContainer = document.getElementById('file-list-container');
        
        if (!this.fileListContainer) {
            // Criar container
            this.fileListContainer = document.createElement('div');
            this.fileListContainer.id = 'file-list-container';
            this.fileListContainer.className = 'file-list-container';
            
            // Inserir após o file-info
            const fileUploadDiv = this.form.querySelector('.file-upload');
            if (fileUploadDiv) {
                fileUploadDiv.appendChild(this.fileListContainer);
            }
        }
    }

    addEventListeners() {
        this.form.addEventListener('submit', event => this.handleSubmit(event));
        
        // Adicionar listener para o input de arquivos
        const fileInput = document.getElementById('anexos');
        if (fileInput) {
            fileInput.addEventListener('change', event => this.handleFileSelect(event));
        }
    }

    handleFileSelect(event) {
        const files = Array.from(event.target.files);
        const maxSize = 5 * 1024 * 1024; // 5MB em bytes
        const allowedTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'txt'];
        
        // Limpar mensagens de erro anteriores
        this.clearFileErrors();
        
        // Verificar cada arquivo
        files.forEach(file => {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const fileSize = file.size;
            
            // Verificar tipo de arquivo
            if (!allowedTypes.includes(fileExtension)) {
                this.showFileError(`Tipo de arquivo não permitido: ${file.name}`);
                return;
            }
            
            // Verificar tamanho
            if (fileSize > maxSize) {
                this.showFileError(`Arquivo muito grande (${this.formatFileSize(fileSize)}): ${file.name}`);
                return;
            }
            
            // Verificar se o arquivo já existe na lista
            const fileExists = this.selectedFiles.some(
                existingFile => 
                    existingFile.name === file.name && 
                    existingFile.size === file.size &&
                    existingFile.lastModified === file.lastModified
            );
            
            if (!fileExists) {
                this.selectedFiles.push(file);
            }
        });
        
        // Atualizar a exibição da lista
        this.updateFileList();
        
        // Atualizar o input file com os arquivos restantes
        this.updateFileInput();
    }

    removeFile(index) {
        // Remover arquivo da lista
        this.selectedFiles.splice(index, 1);
        
        // Atualizar a exibição
        this.updateFileList();
        
        // Atualizar o input file
        this.updateFileInput();
        
        // Limpar mensagens de erro
        this.clearFileErrors();
    }

    updateFileList() {
        // Limpar container
        this.fileListContainer.innerHTML = '';
        
        if (this.selectedFiles.length === 0) {
            this.fileListContainer.style.display = 'none';
            return;
        }
        
        this.fileListContainer.style.display = 'block';
        
        // Adicionar cada arquivo à lista
        this.selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            // Obter ícone baseado na extensão
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const icon = this.getFileIcon(fileExtension);
            
            // Formatar tamanho do arquivo
            const fileSize = this.formatFileSize(file.size);
            
            fileItem.innerHTML = `
                <div class="file-info-container">
                    <div class="file-icon">${icon}</div>
                    <div class="file-details">
                        <div class="file-name" title="${file.name}">${file.name}</div>
                        <div class="file-size">${fileSize}</div>
                    </div>
                </div>
                <button type="button" class="remove-file-btn" data-index="${index}" title="Remover arquivo">
                    Remover
                </button>
            `;
            
            this.fileListContainer.appendChild(fileItem);
        });
        
        // Adicionar event listeners aos botões de remover
        const removeButtons = this.fileListContainer.querySelectorAll('.remove-file-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const index = parseInt(event.target.getAttribute('data-index'));
                this.removeFile(index);
            });
        });
    }

    updateFileInput() {
        const fileInput = document.getElementById('anexos');
        
        // Criar um novo DataTransfer para os arquivos
        const dataTransfer = new DataTransfer();
        
        // Adicionar todos os arquivos selecionados ao DataTransfer
        this.selectedFiles.forEach(file => {
            dataTransfer.items.add(file);
        });
        
        // Atribuir os arquivos ao input
        fileInput.files = dataTransfer.files;
        
        // Limpar o valor do input se não houver arquivos
        if (this.selectedFiles.length === 0) {
            fileInput.value = '';
        }
    }

    getFileIcon(extension) {
        const icons = {
            pdf: '📄',
            doc: '📝',
            docx: '📝',
            jpg: '🖼️',
            jpeg: '🖼️',
            png: '🖼️',
            txt: '📄'
        };
        
        return icons[extension] || '📎';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showFileError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
        errorDiv.style.padding = '5px';
        errorDiv.style.backgroundColor = '#f8d7da';
        errorDiv.style.borderRadius = '4px';
        
        this.fileListContainer.appendChild(errorDiv);
    }

    clearFileErrors() {
        const errorMessages = this.fileListContainer.querySelectorAll('.field-error-message');
        errorMessages.forEach(error => error.remove());
    }

    handleSubmit(event) {
        event.preventDefault();
        
        const titulo = document.getElementById('titulo');
        const descricao = document.getElementById('descricao');
        
        let isValid = true;
        
        // Limpar erros anteriores
        this.clearFileErrors();
        
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
        
        // Validar arquivos
        const maxSize = 5 * 1024 * 1024;
        if (this.selectedFiles.length > 0) {
            for (let file of this.selectedFiles) {
                if (file.size > maxSize) {
                    this.showFileError(`O arquivo ${file.name} excede 5MB`);
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
            this.responseMessage.style.display = 'none';
            
            const submitBtn = this.form.querySelector('.btn-submit');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Enviar Denúncia';
            }
            
            if (data.success) {
                this.showModalConfirmation(data.protocolo);
                this.form.reset();
                // Limpar também a lista de arquivos
                this.selectedFiles = [];
                this.updateFileList();
            } else {
                this.showResponseMessage(data.message || 'Erro ao enviar denúncia', 'error');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            this.responseMessage.style.display = 'none';
            
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
        const submitBtn = this.form.querySelector('.btn-submit');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Enviar Denúncia';
        }
        
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
}