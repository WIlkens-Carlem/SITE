document.addEventListener('DOMContentLoaded', function() {
    // Elementos de personalização
    const backgroundColorPicker = document.getElementById('background-color');
    const textColorPicker = document.getElementById('text-color');
    const siteTitleInput = document.getElementById('site-title-input');
    const siteDescriptionInput = document.getElementById('site-description-input');
    const savePersonalizationButton = document.getElementById('save-personalization');
    const settingsButton = document.getElementById('settings-button');
    const personalizationPanel = document.querySelector('.personalization-panel');
    const siteTitle = document.getElementById('site-title');
    const siteDescription = document.getElementById('site-description');
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const uploadButton = document.getElementById('upload-button');
    const gallery = document.getElementById('gallery');
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');

    // Carregar configurações salvas
    loadSavedSettings();

    // Eventos de personalização
    savePersonalizationButton.addEventListener('click', savePersonalization);
    backgroundColorPicker.addEventListener('input', updatePreview);
    textColorPicker.addEventListener('input', updatePreview);
    siteTitleInput.addEventListener('input', updatePreview);
    siteDescriptionInput.addEventListener('input', updatePreview);
    
    // Evento do botão de configurações
    settingsButton.addEventListener('click', function() {
        if (personalizationPanel.style.display === 'none') {
            personalizationPanel.style.display = 'block';
        } else {
            personalizationPanel.style.display = 'none';
        }
    });

    // Eventos de upload
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);
    uploadButton.addEventListener('click', processUpload);

    // Eventos de visualização da galeria
    gridViewBtn.addEventListener('click', () => changeGalleryView('grid'));
    listViewBtn.addEventListener('click', () => changeGalleryView('list'));

    // Eventos do lightbox
    closeLightbox.addEventListener('click', () => lightbox.style.display = 'none');

    // Carregar galeria do armazenamento local
    loadGallery();

    // Funções de personalização
    function updatePreview() {
        document.body.style.backgroundColor = backgroundColorPicker.value;
        document.body.style.color = textColorPicker.value;
        
        if (siteTitleInput.value) {
            siteTitle.textContent = siteTitleInput.value;
        }
        
        if (siteDescriptionInput.value) {
            siteDescription.textContent = siteDescriptionInput.value;
        }
    }

    function savePersonalization() {
        const settings = {
            backgroundColor: backgroundColorPicker.value,
            textColor: textColorPicker.value,
            siteTitle: siteTitleInput.value || 'Nosso Álbum Digital',
            siteDescription: siteDescriptionInput.value || 'Um lugar especial para nossas memórias'
        };
        
        localStorage.setItem('siteSettings', JSON.stringify(settings));
        showNotification('Configurações salvas com sucesso!');
    }

    function loadSavedSettings() {
        const savedSettings = localStorage.getItem('siteSettings');
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            backgroundColorPicker.value = settings.backgroundColor;
            textColorPicker.value = settings.textColor;
            siteTitleInput.value = settings.siteTitle;
            siteDescriptionInput.value = settings.siteDescription;
            
            document.body.style.backgroundColor = settings.backgroundColor;
            document.body.style.color = settings.textColor;
            siteTitle.textContent = settings.siteTitle;
            siteDescription.textContent = settings.siteDescription;
        }
    }

    // Funções de upload
    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('dragover');
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        handleFiles(files);
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length === 0) return;
        
        // Limpar seleção anterior
        fileInput.value = '';
        
        // Mostrar prévia dos arquivos selecionados
        showFilePreviews(files);
    }

    function showFilePreviews(files) {
        // Aqui você pode implementar uma prévia dos arquivos selecionados
        // Por simplicidade, apenas mostramos quantos arquivos foram selecionados
        showNotification(`${files.length} arquivo(s) selecionado(s). Clique em "Fazer Upload" para adicionar à galeria.`);
        
        // Armazenar arquivos para upload
        window.filesToUpload = files;
    }

    function processUpload() {
        const files = window.filesToUpload;
        
        if (!files || files.length === 0) {
            showNotification('Selecione arquivos para fazer upload', 'error');
            return;
        }
        
        // Processar cada arquivo
        Array.from(files).forEach(file => {
            // Verificar se é imagem ou vídeo
            if (!file.type.match('image.*') && !file.type.match('video.*')) {
                showNotification('Apenas imagens e vídeos são permitidos', 'error');
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const mediaData = {
                    id: Date.now() + Math.random().toString(36).substr(2, 9),
                    name: file.name,
                    type: file.type.match('image.*') ? 'image' : 'video',
                    src: e.target.result,
                    date: new Date().toISOString(),
                    description: ''
                };
                
                // Salvar no armazenamento local
                saveMediaToStorage(mediaData);
                
                // Adicionar à galeria
                addMediaToGallery(mediaData);
            };
            
            reader.readAsDataURL(file);
        });
        
        // Limpar seleção
        window.filesToUpload = null;
        showNotification('Upload concluído com sucesso!');
    }

    function saveMediaToStorage(mediaData) {
        let savedMedia = localStorage.getItem('galleryMedia');
        
        if (savedMedia) {
            savedMedia = JSON.parse(savedMedia);
            savedMedia.push(mediaData);
        } else {
            savedMedia = [mediaData];
        }
        
        localStorage.setItem('galleryMedia', JSON.stringify(savedMedia));
    }

    // Funções da galeria
    function loadGallery() {
        const savedMedia = localStorage.getItem('galleryMedia');
        
        if (savedMedia) {
            const mediaItems = JSON.parse(savedMedia);
            
            // Limpar galeria atual
            gallery.innerHTML = '';
            
            // Adicionar itens à galeria
            mediaItems.forEach(item => {
                addMediaToGallery(item);
            });
        }
    }

    function addMediaToGallery(mediaData) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.dataset.id = mediaData.id;
        
        if (mediaData.type === 'image') {
            const img = document.createElement('img');
            img.src = mediaData.src;
            img.alt = mediaData.name;
            galleryItem.appendChild(img);
        } else {
            const video = document.createElement('video');
            video.src = mediaData.src;
            video.setAttribute('muted', 'true');
            
            // Adicionar thumbnail para vídeo
            video.addEventListener('loadeddata', function() {
                video.currentTime = 1; // Capturar frame do segundo 1
            });
            
            galleryItem.appendChild(video);
            
            // Adicionar ícone de play
            const playIcon = document.createElement('div');
            playIcon.className = 'play-icon';
            playIcon.innerHTML = '<i class="fas fa-play"></i>';
            galleryItem.appendChild(playIcon);
        }
        
        // Adicionar informações
        const itemInfo = document.createElement('div');
        itemInfo.className = 'gallery-item-info';
        
        const itemName = document.createElement('h3');
        itemName.textContent = mediaData.name;
        itemInfo.appendChild(itemName);
        
        const itemDate = document.createElement('p');
        itemDate.textContent = new Date(mediaData.date).toLocaleDateString();
        itemInfo.appendChild(itemDate);
        
        galleryItem.appendChild(itemInfo);
        
        // Adicionar evento de clique para abrir lightbox
        galleryItem.addEventListener('click', () => openLightbox(mediaData));
        
        // Adicionar à galeria
        gallery.appendChild(galleryItem);
    }

    function changeGalleryView(viewType) {
        if (viewType === 'grid') {
            gallery.classList.remove('list-view');
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        } else {
            gallery.classList.add('list-view');
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        }
        
        // Salvar preferência
        localStorage.setItem('galleryView', viewType);
    }

    function openLightbox(mediaData) {
        if (mediaData.type === 'image') {
            lightboxImg.src = mediaData.src;
            lightboxImg.style.display = 'block';
            lightboxVideo.style.display = 'none';
        } else {
            lightboxVideo.src = mediaData.src;
            lightboxVideo.style.display = 'block';
            lightboxImg.style.display = 'none';
        }
        
        lightboxCaption.textContent = mediaData.name;
        lightbox.style.display = 'flex';
    }

    // Função de notificação
    function showNotification(message, type = 'success') {
        // Verificar se já existe uma notificação
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Definir tipo e mensagem
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Mostrar notificação
        notification.style.display = 'block';
        
        // Esconder após 3 segundos
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    // Adicionar estilos CSS para notificações
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            display: none;
            animation: slideIn 0.3s ease-out;
        }
        
        .notification.success {
            background-color: #28a745;
        }
        
        .notification.error {
            background-color: #dc3545;
        }
        
        .notification.info {
            background-color: #17a2b8;
        }
        
        @keyframes slideIn {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .upload-area.dragover {
            background-color: rgba(106, 17, 203, 0.1);
            border-color: #2575fc;
        }
        
        .play-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            background: rgba(0, 0, 0, 0.5);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(notificationStyles);
});