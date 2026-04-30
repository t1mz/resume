// Основные переменные
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a, .mobile-menu ul li a');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const overlay = document.querySelector('.overlay');
const closeMenuBtn = document.querySelector('.close-menu');
const scrollUpBtn = document.querySelector('.scroll-up');
const scrollDownBtn = document.querySelector('.scroll-down');
const scrollTopBtn = document.querySelector('.scroll-top');
const moreAboutBtn = document.getElementById('moreAboutBtn');
const aboutModal = document.getElementById('aboutModal');
const closeModalBtn = document.querySelector('.close-modal');

// ИСПРАВЛЕНО: Правильное объявление переменных lightbox
const lightbox = document.getElementById('galleryLightbox');
// УБИРАЕМ статическую ссылку на изображение - будем получать динамически
const closeLightbox = document.querySelector('.close-lightbox');
const qualificationCards = document.querySelectorAll('.qualification-card');

// ИСПРАВЛЕНО: Правильное объявление переменных карусели проектов
const projectCarouselModal = document.getElementById('projectCarouselModal');
const closeProjectModal = projectCarouselModal?.querySelector('.close-modal');
const projectCarousel = document.getElementById('projectCarousel');
const prevProjectBtn = document.querySelector('.prev-project-btn');
const nextProjectBtn = document.querySelector('.next-project-btn');

// Карусель фото
const photoCarousel = document.getElementById('photoCarousel');
const photoIndicators = document.getElementById('photoIndicators');
const prevPhotoBtn = document.querySelector('.prev-photo-btn');
const nextPhotoBtn = document.querySelector('.next-photo-btn');
const prevGalleryBtn = document.querySelector('.prev-gallery-btn');
const nextGalleryBtn = document.querySelector('.next-gallery-btn');

// Текущий активный раздел
let currentSection = 0;
let currentProjectIndex = 0; // ИСПРАВЛЕНО: Только одно объявление
let currentProjectSlides = [];
let currentPhotoIndex = 0;
let currentGalleryIndex = 0;
let galleryImages = [];
let photoInterval;

// Плавная прокрутка к якорю
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Закрываем мобильное меню, если открыто
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            
            // Прокрутка к разделу
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Обновление активного пункта меню
            updateActiveNav(targetId);
        }
    });
});

// Обновление активного пункта меню
function updateActiveNav(targetId) {
    navLinks.forEach(link => {
        link.classList.remove('nav-active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('nav-active');
        }
    });
}

// ИСПРАВЛЕНО: Проверяем существование элементов перед добавлением обработчиков
// Открытие/закрытие мобильного меню
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
    });
}

if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
    });
}

if (overlay) {
    overlay.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
    });
}

// Открытие/закрытие модального окна "Подробнее"
if (moreAboutBtn && aboutModal) {
    moreAboutBtn.addEventListener('click', () => {
        aboutModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
}

if (closeModalBtn && aboutModal) {
    // Основной обработчик уже добавлен в enhanceCloseButton()
    // Дополнительные действия, если нужны
}

// Закрытие модального окна при клике вне его
window.addEventListener('click', (e) => {
    if (aboutModal && e.target === aboutModal) {
        aboutModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// ИСПРАВЛЕНО: Проверяем существование кнопок навигации
// Навигация по разделам кнопками вверх/вниз
if (scrollUpBtn) {
    scrollUpBtn.addEventListener('click', () => {
        if (currentSection > 0) {
            currentSection--;
            scrollToSection(currentSection);
        }
    });
}

if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', () => {
        if (currentSection < sections.length - 1) {
            currentSection++;
            scrollToSection(currentSection);
        }
    });
}

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        currentSection = 0;
        scrollToSection(currentSection);
    });
}

// Плавная прокрутка к разделу
function scrollToSection(index) {
    if (sections[index]) {
        window.scrollTo({
            top: sections[index].offsetTop,
            behavior: 'smooth'
        });
        
        // Обновление активного пункта меню
        const targetId = `#${sections[index].id}`;
        updateActiveNav(targetId);

        // ДОБАВЬТЕ ЭТУ СТРОКУ:
        if (window.updateSectionProgress) {
            window.updateSectionProgress(index);
        }
    }
}

// Определение текущего раздела при прокрутке
window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    // Обновление активного пункта меню
    // Обновление currentSection
    sections.forEach((section, index) => {
        if (section.id === current) {
            currentSection = index;
            
            // ДОБАВЬТЕ ЭТУ СТРОКУ:
            if (window.updateSectionProgress) {
                window.updateSectionProgress(index);
            }
        }
    });
});

// ========== ИСПРАВЛЕНИЕ: РАЗДЕЛЕНИЕ LIGHTBOX И ГАЛЕРЕИ ==========

// ВОССТАНОВЛЕНО: Lightbox для документов с зумом и загрузкой
qualificationCards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const imgSrc = card.getAttribute('data-img');
        const title = card.querySelector('.qualification-title')?.textContent || 'Документ';
        
        if (!imgSrc || !lightbox) return;
        
        console.log('Открываем документ:', imgSrc, title); // Для отладки
        
        // СКРЫВАЕМ КНОПКИ НАВИГАЦИИ ДЛЯ ДОКУМЕНТОВ
        const lightboxNav = lightbox.querySelector('.lightbox-nav');
        if (lightboxNav) {
            lightboxNav.style.display = 'none';
        }
        
        // ИСПРАВЛЕНО: Получаем актуальную ссылку на изображение
        const lightboxContent = lightbox.querySelector('.lightbox-content');
        const currentLightboxImg = lightboxContent.querySelector('img');
        
        if (!currentLightboxImg) return;
        
        // Устанавливаем изображение
        currentLightboxImg.src = imgSrc;
        currentLightboxImg.alt = title;
        
        // Сбрасываем зум
        currentLightboxImg.classList.remove('zoomed');
        currentLightboxImg.style.transform = '';
        currentLightboxImg.style.cursor = 'zoom-in';
        currentLightboxImg.style.transformOrigin = '';
        
        // Добавляем информацию о документе
        addLightboxDocumentInfo(title);
        
        // Добавляем индикатор зума
        addZoomIndicator();
        
        // Добавляем кнопку сохранения
        addSaveButton(imgSrc, title);
        
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Добавляем обработчик зума
        addZoomHandler(currentLightboxImg);
    });
});

// ИСПРАВЛЕНО: Проверяем существование элементов карусели проектов
// Закрытие модального окна проектов
if (closeProjectModal && projectCarouselModal) {
    closeProjectModal.addEventListener('click', () => {
        projectCarouselModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

if (projectCarouselModal) {
    projectCarouselModal.addEventListener('click', (e) => {
        if (e.target === projectCarouselModal) {
            projectCarouselModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Навигация по карусели проектов
if (prevProjectBtn) {
    prevProjectBtn.addEventListener('click', () => {
        if (projectCarousel && projectCarousel.children.length > 0) {
            currentProjectIndex = (currentProjectIndex - 1 + projectCarousel.children.length) % projectCarousel.children.length;
            updateProjectCarousel();
        }
    });
}

if (nextProjectBtn) {
    nextProjectBtn.addEventListener('click', () => {
        if (projectCarousel && projectCarousel.children.length > 0) {
            currentProjectIndex = (currentProjectIndex + 1) % projectCarousel.children.length;
            updateProjectCarousel();
        }
    });
}

function updateProjectCarousel() {
    if (projectCarousel) {
        projectCarousel.style.transform = `translateX(-${currentProjectIndex * 100}%)`;
    }
}

// ========== КАРУСЕЛЬ ФОТОГАЛЕРЕИ (ТОЛЬКО ДЛЯ РАЗДЕЛА ФОТО) ==========
function initPhotoCarousel() {
    if (!photoCarousel || !photoIndicators) return;
    
    const slides = photoCarousel.querySelectorAll('.carousel-slide');
    
    // Создаем индикаторы
    photoIndicators.innerHTML = '';
    slides.forEach((slide, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'carousel-indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => {
            currentPhotoIndex = index;
            updatePhotoCarousel();
        });
        photoIndicators.appendChild(indicator);
    });
    
    // Обновление карусели
    function updatePhotoCarousel() {
        if (!photoCarousel) return;
        
        photoCarousel.style.transform = `translateX(-${currentPhotoIndex * 100}%)`;
        
        // Обновляем активный индикатор
        document.querySelectorAll('.carousel-indicator').forEach((indicator, i) => {
            if (i === currentPhotoIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Кнопки навигации
    if (prevPhotoBtn) {
        prevPhotoBtn.addEventListener('click', () => {
            currentPhotoIndex = (currentPhotoIndex - 1 + slides.length) % slides.length;
            updatePhotoCarousel();
            resetPhotoInterval();
        });
    }
    
    if (nextPhotoBtn) {
        nextPhotoBtn.addEventListener('click', () => {
            currentPhotoIndex = (currentPhotoIndex + 1) % slides.length;
            updatePhotoCarousel();
            resetPhotoInterval();
        });
    }
    
    // Автоматическая прокрутка
    function startPhotoInterval() {
        photoInterval = setInterval(() => {
            currentPhotoIndex = (currentPhotoIndex + 1) % slides.length;
            updatePhotoCarousel();
        }, 5000);
    }
    
    function resetPhotoInterval() {
        clearInterval(photoInterval);
        startPhotoInterval();
    }
    
    // Запускаем автоматическую прокрутку
    if (slides.length > 0) {
        startPhotoInterval();
    }
}

// ========== ГАЛЕРЕЯ ФОТОГРАФИЙ (ПРИ КЛИКЕ НА ФОТО) ==========
function initGallery() {
    // ТОЛЬКО изображения из фотогалереи, НЕ из других разделов
    const carouselImages = document.querySelectorAll('#photos .carousel-img img');
    galleryImages = Array.from(carouselImages).map(img => img.src);
    
    // Добавляем обработчики клика ТОЛЬКО на изображения в фотогалерее
    carouselImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentGalleryIndex = index;
            openPhotoGallery();
        });
    });
}

// Открытие галереи ФОТОГРАФИЙ (с навигацией)
function openPhotoGallery() {
    if (!lightbox) return;
    
    // ПОКАЗЫВАЕМ кнопки навигации для фотогалереи
    const lightboxNav = lightbox.querySelector('.lightbox-nav');
    if (lightboxNav) {
        lightboxNav.style.display = 'flex';
    }
    
    // ИСПРАВЛЕНО: Получаем актуальную ссылку на изображение
    const currentLightboxImg = lightbox.querySelector('.lightbox-content img');
    if (!currentLightboxImg) return;
    
    // ИСПРАВЛЕНО: Очищаем все элементы от предыдущего просмотра документов
    cleanupDocumentElements();
    
    // Устанавливаем изображение из фотогалереи
    currentLightboxImg.src = galleryImages[currentGalleryIndex];
    currentLightboxImg.alt = 'Фотография';
    
    // Сбрасываем все стили зума для фотогалереи
    currentLightboxImg.classList.remove('zoomed');
    currentLightboxImg.style.transform = '';
    currentLightboxImg.style.cursor = '';
    currentLightboxImg.style.transformOrigin = '';
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// НОВАЯ ФУНКЦИЯ: Очистка элементов от просмотра документов
function cleanupDocumentElements() {
    // Удаляем индикатор зума
    const indicator = lightbox.querySelector('.zoom-indicator');
    if (indicator) indicator.remove();
    
    // Удаляем информацию о документе
    const info = lightbox.querySelector('.lightbox-info');
    if (info) info.remove();
    
    // Удаляем кнопку сохранения
    const saveButton = lightbox.querySelector('.save-button');
    if (saveButton) saveButton.remove();
}

// Закрытие галереи (обновленное)
function closeGallery() {
    if (!lightbox) return;
    
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Очищаем все элементы (зум, индикаторы, кнопки)
    cleanupDocumentElements();
    
    // Получаем текущее изображение и сбрасываем все его стили
    const currentImg = lightbox.querySelector('.lightbox-content img');
    if (currentImg) {
        // Сбрасываем трансформации
        currentImg.classList.remove('zoomed');
        currentImg.style.transform = '';
        currentImg.style.cursor = '';
        currentImg.style.transformOrigin = '';
        currentImg.alt = '';
        
        // Удаляем обработчики событий зума (если есть)
        if (currentImg._mouseMoveHandler) {
            document.removeEventListener('mousemove', currentImg._mouseMoveHandler);
        }
        if (currentImg._mouseUpHandler) {
            document.removeEventListener('mouseup', currentImg._mouseUpHandler);
        }
        
        // Очищаем ссылки на обработчики
        currentImg._mouseMoveHandler = null;
        currentImg._mouseUpHandler = null;
    }
}

// ========== ФУНКЦИИ ДЛЯ ЗУМА И ЗАГРУЗКИ ДОКУМЕНТОВ ==========

// Добавление информации о документе в lightbox
function addLightboxDocumentInfo(title) {
    // Удаляем существующую информацию
    const existingInfo = lightbox.querySelector('.lightbox-info');
    if (existingInfo) existingInfo.remove();
    
    // Создаем новую информацию
    const info = document.createElement('div');
    info.className = 'lightbox-info';
    info.textContent = title;
    
    lightbox.querySelector('.lightbox-content').appendChild(info);
}

// Добавление индикатора зума
function addZoomIndicator() {
    // Удаляем существующий индикатор
    const existingIndicator = lightbox.querySelector('.zoom-indicator');
    if (existingIndicator) existingIndicator.remove();
    
    // Создаем новый индикатор
    const indicator = document.createElement('div');
    indicator.className = 'zoom-indicator';
    indicator.textContent = 'Кликните для увеличения';
    
    lightbox.appendChild(indicator);
}

// Добавление кнопки сохранения
function addSaveButton(imgSrc, title) {
    // Удаляем существующую кнопку
    const existingButton = lightbox.querySelector('.save-button');
    if (existingButton) existingButton.remove();
    
    // Создаем кнопку сохранения
    const saveButton = document.createElement('button');
    saveButton.className = 'save-button';
    saveButton.innerHTML = '<i class="fas fa-download"></i>';
    saveButton.title = 'Сохранить документ';
    
    saveButton.addEventListener('click', (e) => {
        e.stopPropagation();
        downloadImage(imgSrc, title);
    });
    
    lightbox.appendChild(saveButton);
}

// Функция скачивания изображения
async function downloadImage(imgSrc, title) {
    try {
        // Получаем изображение как blob
        const response = await fetch(imgSrc);
        const blob = await response.blob();
        
        // Создаем URL для blob
        const url = window.URL.createObjectURL(blob);
        
        // Создаем временную ссылку для скачивания
        const link = document.createElement('a');
        link.href = url;
        
        // Генерируем имя файла
        const fileName = title.replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '').replace(/\s+/g, '_') + '.jpg';
        link.download = fileName;
        
        // Принудительно скачиваем файл
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Освобождаем память
        window.URL.revokeObjectURL(url);
        
        console.log('Файл скачан:', fileName);
    } catch (error) {
        console.error('Ошибка при скачивании:', error);
        
        // Fallback - открываем в новой вкладке
        const link = document.createElement('a');
        link.href = imgSrc;
        link.target = '_blank';
        link.download = title.replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '').replace(/\s+/g, '_') + '.jpg';
        link.click();
    }
}

// Обновление индикатора зума
function updateZoomIndicator(isZoomed) {
    const indicator = lightbox.querySelector('.zoom-indicator');
    if (indicator) {
        indicator.textContent = isZoomed ? 'Кликните для уменьшения' : 'Кликните для увеличения';
    }
}

// Добавление обработчика зума
function addZoomHandler(imgElement) {
    // Очищаем предыдущие обработчики событий
    const newImg = imgElement.cloneNode(true);
    imgElement.parentNode.replaceChild(newImg, imgElement);
    
    const ZOOM_LEVEL = 1.5; // Настройка уровня зума
    let isZoomed = false;
    let startX, startY, translateX = 0, translateY = 0;
    let isDragging = false;
    let isMouseDown = false;
    let dragThreshold = 5;
    let clickStartX, clickStartY;
    
    // Обработка нажатия мыши
    newImg.addEventListener('mousedown', (e) => {
        clickStartX = e.clientX;
        clickStartY = e.clientY;
        isMouseDown = true;
        isDragging = false;
        
        if (isZoomed) {
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            newImg.style.cursor = 'grabbing';
        }
        e.preventDefault();
    });
    
    // Перетаскивание
    const mouseMoveHandler = (e) => {
        if (!isMouseDown || !isZoomed) return;
        
        const deltaX = Math.abs(e.clientX - clickStartX);
        const deltaY = Math.abs(e.clientY - clickStartY);
        
        if ((deltaX > dragThreshold || deltaY > dragThreshold) && isMouseDown) {
            isDragging = true;
            
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            newImg.style.transform = `scale(${ZOOM_LEVEL}) translate(${translateX}px, ${translateY}px)`;
        }
    };
    
    // Обработка отпускания мыши
    const mouseUpHandler = (e) => {
        const deltaX = Math.abs(e.clientX - clickStartX);
        const deltaY = Math.abs(e.clientY - clickStartY);
        
        if (!isDragging && deltaX <= dragThreshold && deltaY <= dragThreshold && isMouseDown) {
            toggleZoom(e, newImg, ZOOM_LEVEL);
        }
        
        isMouseDown = false;
        isDragging = false;
        
        if (isZoomed) {
            newImg.style.cursor = 'grab';
        }
    };
    
    // Функция переключения зума
    function toggleZoom(e, img, zoomLevel) {
        isZoomed = !isZoomed;
        
        if (isZoomed) {
            img.classList.add('zoomed');
            img.style.cursor = 'grab';
            
            const rect = img.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            translateX = (centerX - x) * 0.3;
            translateY = (centerY - y) * 0.3;
            
            img.style.transformOrigin = `${x}px ${y}px`;
            img.style.transform = `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
        } else {
            img.classList.remove('zoomed');
            img.style.cursor = 'zoom-in';
            img.style.transform = 'scale(1)';
            img.style.transformOrigin = 'center';
            translateX = 0;
            translateY = 0;
        }
        
        updateZoomIndicator(isZoomed);
    }
    
    // Обработка покидания области изображения
    newImg.addEventListener('mouseleave', () => {
        if (isDragging) {
            isMouseDown = false;
            isDragging = false;
            if (isZoomed) {
                newImg.style.cursor = 'grab';
            }
        }
    });
    
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    
    // Колесо мыши для зума
    newImg.addEventListener('wheel', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        let currentScale = isZoomed ? ZOOM_LEVEL : 1;
        currentScale += delta;
        currentScale = Math.max(1, Math.min(3, currentScale));
        
        if (currentScale <= 1) {
            isZoomed = false;
            newImg.classList.remove('zoomed');
            newImg.style.cursor = 'zoom-in';
            newImg.style.transform = 'scale(1)';
            translateX = 0;
            translateY = 0;
        } else {
            isZoomed = true;
            newImg.classList.add('zoomed');
            newImg.style.cursor = 'grab';
            
            if (currentScale !== ZOOM_LEVEL) {
                newImg.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
            } else {
                newImg.style.transform = `scale(${ZOOM_LEVEL}) translate(${translateX}px, ${translateY}px)`;
            }
        }
        
        updateZoomIndicator(isZoomed);
    });
    
    // Touch события для мобильных устройств
    let touchStartDistance = 0;
    let initialScale = 1;
    let touchStartX, touchStartY;
    let isTouchDragging = false;
    
    newImg.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            touchStartDistance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            initialScale = isZoomed ? ZOOM_LEVEL : 1;
        } else if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isTouchDragging = false;
            
            if (isZoomed) {
                startX = e.touches[0].clientX - translateX;
                startY = e.touches[0].clientY - translateY;
            }
        }
        e.preventDefault();
    });
    
    newImg.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            const touchDistance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            
            const scale = Math.max(1, Math.min(3, (touchDistance / touchStartDistance) * initialScale));
            
            if (scale <= 1) {
                isZoomed = false;
                newImg.classList.remove('zoomed');
                newImg.style.transform = 'scale(1)';
                translateX = 0;
                translateY = 0;
            } else {
                isZoomed = true;
                newImg.classList.add('zoomed');
                newImg.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
            }
        } else if (e.touches.length === 1 && isZoomed) {
            const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
            const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
            
            if (deltaX > dragThreshold || deltaY > dragThreshold) {
                isTouchDragging = true;
                translateX = e.touches[0].clientX - startX;
                translateY = e.touches[0].clientY - startY;
                newImg.style.transform = `scale(${ZOOM_LEVEL}) translate(${translateX}px, ${translateY}px)`;
            }
        }
        e.preventDefault();
    });
    
    newImg.addEventListener('touchend', (e) => {
        if (e.touches.length === 0) {
            const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartX);
            const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);
            
            if (!isTouchDragging && deltaX <= dragThreshold && deltaY <= dragThreshold) {
                const fakeEvent = {
                    clientX: e.changedTouches[0].clientX,
                    clientY: e.changedTouches[0].clientY
                };
                toggleZoom(fakeEvent, newImg, ZOOM_LEVEL);
            }
        }
        
        isTouchDragging = false;
        updateZoomIndicator(isZoomed);
        e.preventDefault();
    });
    
    // Сохраняем ссылки на обработчики для возможности их удаления
    newImg._mouseMoveHandler = mouseMoveHandler;
    newImg._mouseUpHandler = mouseUpHandler;
}

// Навигация по фотогалерее
function prevGalleryImage() {
    if (galleryImages.length > 0) {
        // ИСПРАВЛЕНО: Получаем актуальную ссылку на изображение
        const currentLightboxImg = lightbox.querySelector('.lightbox-content img');
        if (!currentLightboxImg) return;
        
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
        currentLightboxImg.src = galleryImages[currentGalleryIndex];
    }
}

function nextGalleryImage() {
    if (galleryImages.length > 0) {
        // ИСПРАВЛЕНО: Получаем актуальную ссылку на изображение
        const currentLightboxImg = lightbox.querySelector('.lightbox-content img');
        if (!currentLightboxImg) return;
        
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
        currentLightboxImg.src = galleryImages[currentGalleryIndex];
    }
}

// ИСПРАВЛЕНО: Проверяем существование элементов перед добавлением обработчиков
// Обработчики событий для галереи
if (prevGalleryBtn) {
    prevGalleryBtn.addEventListener('click', prevGalleryImage);
}

if (nextGalleryBtn) {
    nextGalleryBtn.addEventListener('click', nextGalleryImage);
}

if (closeLightbox) {
    closeLightbox.addEventListener('click', closeGallery);
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeGallery();
        }
    });
}

// Обработка клавиатуры для галереи
document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.style.display === 'flex') {
        // Навигация только если открыта фотогалерея (есть кнопки навигации)
        const lightboxNav = lightbox.querySelector('.lightbox-nav');
        const navVisible = lightboxNav && lightboxNav.style.display !== 'none';
        
        if (navVisible) {
            if (e.key === 'ArrowLeft') {
                prevGalleryImage();
            } else if (e.key === 'ArrowRight') {
                nextGalleryImage();
            }
        }
        
        if (e.key === 'Escape') {
            closeGallery();
        }
    }
});

// Инициализация активного пункта меню
updateActiveNav('#home');

// Анимированный фон
document.addEventListener('scroll', function() {
    const scrollPercentage = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const hue = 20 + scrollPercentage * 20;
    document.body.style.background = `linear-gradient(135deg, hsl(${hue}, 100%, 95%) 0%, hsl(${hue + 20}, 100%, 90%) 100%)`;
});

// ИСПРАВЛЕНО: Основная инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    initPhotoCarousel();
    initGallery();
    initPortfolioNew();
    initAchievementBadges();
    initTimelineCards(); // ДОБАВЛЕНО: Инициализация карточек timeline
});

// ========== ОБНОВЛЕННОЕ ПОРТФОЛИО И КАРУСЕЛЬ ПРОЕКТОВ ==========

// ИСПРАВЛЕНО: Упрощенная инициализация портфолио
function initPortfolioNew() {
    const demoBtns = document.querySelectorAll('.demo-btn');
    
    // Добавляем обработчики для кнопок демонстрации
    demoBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openProjectCarouselNew(this);
        });
    });
}

// Открытие карусели проекта (обновленная функция)
function openProjectCarouselNew(button) {
    if (!projectCarouselModal || !projectCarousel) return;
    
    const portfolioItem = button.closest('.portfolio-item');
    const title = portfolioItem.getAttribute('data-title');
    const images = portfolioItem.getAttribute('data-imgs');
    
    const projectTitle = document.getElementById('projectTitle');
    
    if (!title || !images || !projectTitle) {
        console.warn('Не найдены данные проекта или элементы карусели');
        return;
    }
    
    try {
        const imageArray = JSON.parse(images);
        
        // Устанавливаем заголовок
        projectTitle.textContent = title;
        
        // Очищаем карусель
        projectCarousel.innerHTML = '';
        
        // Добавляем слайды
        imageArray.forEach((img, index) => {
            const slide = document.createElement('div');
            slide.className = 'project-slide';
            slide.innerHTML = `
                <img src="${img}" alt="${title} - Скриншот ${index + 1}" 
                     onerror="this.src='https://via.placeholder.com/800x600/CCCCCC/FFFFFF?text=Изображение+недоступно'">
            `;
            projectCarousel.appendChild(slide);
        });
        
        // Сбрасываем индекс и обновляем карусель
        currentProjectIndex = 0;
        updateProjectCarousel();
        
        // Показываем модальное окно
        projectCarouselModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
    } catch (error) {
        console.error('Ошибка при парсинге изображений:', error);
    }
}

// Инициализация значков достижений
function initAchievementBadges() {
    const badges = document.querySelectorAll('.achievement-badge');
    
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', () => {
            badge.style.animationPlayState = 'paused';
            badge.style.transform = 'scale(1.1)';
        });
        
        badge.addEventListener('mouseleave', () => {
            badge.style.animationPlayState = 'running';
            badge.style.transform = 'scale(1)';
        });
    });
}

// ========== ИСПРАВЛЕННЫЕ РАСКРЫВАЮЩИЕСЯ КАРТОЧКИ ОПЫТА РАБОТЫ ==========

function initTimelineCards() {
    // Получаем все раскрывающиеся карточки
    const expandableCards = document.querySelectorAll('.expandable-card');
    const expandButtons = document.querySelectorAll('.timeline-expand-btn');

    // Обработчики для кнопок раскрытия
    expandButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Предотвращаем всплытие события
            
            const card = this.closest('.timeline-item');
            const isExpanded = card.classList.contains('expanded');
            
            toggleCard(card, !isExpanded);
            updateButtonText(this, !isExpanded);
        });
    });

    // Обработчики для клика по всей карточке (опционально)
    expandableCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Проверяем, что клик не по кнопке или ссылке
            if (e.target.closest('.timeline-expand-btn') || e.target.closest('.company-link')) {
                return;
            }
            
            const isExpanded = this.classList.contains('expanded');
            const button = this.querySelector('.timeline-expand-btn');
            
            toggleCard(this, !isExpanded);
            updateButtonText(button, !isExpanded);
        });
    });
}

// ИСПРАВЛЕННАЯ функция переключения состояния карточки с сохранением ширины на мобильных
function toggleCard(card, shouldExpand) {
    const fullDetails = card.querySelector('.full-details');
    
    if (shouldExpand) {
        // Раскрываем карточку
        card.classList.add('expanded');
        
        // ИСПРАВЛЕНО: НЕ изменяем стили ширины на мобильных устройствах
        const isMobile = window.innerWidth <= 992;
        
        if (!isMobile) {
            // На десктопе можем применять градиентный фон
            const timelineContent = card.querySelector('.timeline-content');
            timelineContent.style.background = 'linear-gradient(135deg, rgba(255, 107, 53, 0.03) 0%, rgba(255, 255, 255, 0.8) 100%)';
        }
        // На мобильных НЕ применяем никаких дополнительных стилей к .timeline-content
        
        // НОВОЕ: Рассчитываем реальную высоту содержимого
        fullDetails.style.maxHeight = 'none';
        fullDetails.style.overflow = 'visible';
        const realHeight = fullDetails.scrollHeight;
        
        // Временно возвращаем стили для анимации
        fullDetails.style.maxHeight = '0';
        fullDetails.style.overflow = 'hidden';
        
        // Принудительный reflow для применения стилей
        fullDetails.offsetHeight;
        
        // Запускаем анимацию до реальной высоты
        fullDetails.style.maxHeight = realHeight + 'px';
        fullDetails.style.opacity = '1';
        fullDetails.style.marginTop = '20px';
        
        // После завершения анимации убираем ограничения
        setTimeout(() => {
            if (card.classList.contains('expanded')) {
                fullDetails.style.maxHeight = 'none';
                fullDetails.style.overflow = 'visible';
            }
        }, 600);
        
        // Плавная анимация появления элементов
        setTimeout(() => {
            const elements = fullDetails.querySelectorAll('p, ul, .company-link');
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 100);
        
    } else {
        // Скрываем карточку
        const currentHeight = fullDetails.scrollHeight;
        
        // Устанавливаем текущую высоту для плавной анимации
        fullDetails.style.maxHeight = currentHeight + 'px';
        fullDetails.style.overflow = 'hidden';
        
        // Принудительный reflow
        fullDetails.offsetHeight;
        
        // Анимируем к нулевой высоте
        fullDetails.style.maxHeight = '0';
        fullDetails.style.opacity = '0';
        fullDetails.style.marginTop = '0';
        
        // Убираем класс expanded и сбрасываем стили после завершения анимации
        setTimeout(() => {
            card.classList.remove('expanded');
            
            // ИСПРАВЛЕНО: Сбрасываем только те стили, которые мы добавляли
            const timelineContent = card.querySelector('.timeline-content');
            const isMobile = window.innerWidth <= 992;
            
            if (!isMobile) {
                // На десктопе убираем градиент
                timelineContent.style.background = '';
            }
            // На мобильных НЕ трогаем стили ширины
            
            // Сбрасываем стили анимации элементов
            const elements = fullDetails.querySelectorAll('p, ul, .company-link');
            elements.forEach(el => {
                el.style.opacity = '';
                el.style.transform = '';
            });
        }, 600);
    }
    
    // Плавная прокрутка к карточке при раскрытии
    if (shouldExpand) {
        setTimeout(() => {
            card.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 300);
    }
}

// Функция обновления текста кнопки
function updateButtonText(button, isExpanded) {
    if (!button) return;
    
    const icon = button.querySelector('i');
    
    if (isExpanded) {
        button.innerHTML = '<i class="fas fa-chevron-up"></i> Скрыть';
    } else {
        button.innerHTML = '<i class="fas fa-chevron-down"></i> Подробнее';
    }
}

// Добавляем глобальные функции для управления всеми карточками
window.expandAllCards = function() {
    const expandableCards = document.querySelectorAll('.expandable-card');
    expandableCards.forEach(card => {
        const button = card.querySelector('.timeline-expand-btn');
        toggleCard(card, true);
        updateButtonText(button, true);
    });
};

window.collapseAllCards = function() {
    const expandableCards = document.querySelectorAll('.expandable-card');
    expandableCards.forEach(card => {
        const button = card.querySelector('.timeline-expand-btn');
        toggleCard(card, false);
        updateButtonText(button, false);
    });
};

// Клавиатурная навигация (опционально)
document.addEventListener('keydown', (e) => {
    // Ctrl + E - раскрыть все карточки
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        window.expandAllCards();
    }
    
    // Ctrl + R - скрыть все карточки
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        window.collapseAllCards();
    }
});

// ===== УЛУЧШЕННАЯ ОБРАБОТКА TOUCH-СОБЫТИЙ ДЛЯ МОБИЛЬНЫХ =====

// Функция для улучшенной обработки кнопки закрытия модального окна
function enhanceCloseButton() {
    const closeButtons = document.querySelectorAll('.close-modal');
    
    closeButtons.forEach(button => {
        // Добавляем обработчики для всех типов событий
        
        // Стандартный клик (работает на всех устройствах)
        button.addEventListener('click', handleModalClose);
        
        // Touch события для мобильных устройств
        button.addEventListener('touchstart', handleTouchStart, { passive: false });
        button.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        // Keyboard события для доступности
        button.addEventListener('keydown', handleKeyDown);
    });
}

// Переменные для отслеживания touch-событий
let touchStartTime = 0;
let touchStartTarget = null;

function handleTouchStart(e) {
    touchStartTime = Date.now();
    touchStartTarget = e.target;
    
    // Добавляем визуальную обратную связь
    e.target.style.transform = 'scale(0.95)';
    e.target.style.background = 'rgba(0, 0, 0, 0.2)';
}

function handleTouchEnd(e) {
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTime;
    
    // Убираем визуальную обратную связь
    setTimeout(() => {
        e.target.style.transform = '';
        e.target.style.background = '';
    }, 100);
    
    // Проверяем, что это был быстрый тап на том же элементе
    if (touchDuration < 500 && e.target === touchStartTarget) {
        e.preventDefault();
        e.stopPropagation();
        handleModalClose(e);
    }
}

function handleKeyDown(e) {
    // Обработка Enter и Space для доступности
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleModalClose(e);
    }
}

function handleModalClose(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Находим родительское модальное окно
    const modal = e.target.closest('.modal');
    
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Специальная обработка для lightbox
        if (modal.id === 'galleryLightbox') {
            closeGallery();
        }
        
        // Специальная обработка для карусели проектов
        if (modal.id === 'projectCarouselModal') {
            // Дополнительная логика, если нужна
        }
        
        console.log('Модальное окно закрыто:', modal.id);
    }
}

// Функция для предотвращения случайного закрытия при скролле
function preventAccidentalClose() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.addEventListener('touchmove', (e) => {
            // Разрешаем скролл внутри модального окна
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent && modalContent.contains(e.target)) {
                // Не препятствуем скроллу внутри контента
                return;
            }
        }, { passive: true });
    });
}

// Улучшенная функция для определения мобильного устройства
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0);
}

// Добавление дополнительных стилей для мобильных устройств
function addMobileStyles() {
    if (isMobileDevice()) {
        const style = document.createElement('style');
        style.textContent = `
            .modal-content {
                /* Дополнительные отступы для мобильных */
                padding: 60px 20px 20px 20px;
                max-height: 95vh;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }
            
            .close-modal {
                /* Улучшенная видимость на мобильных */
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
            }
            
            /* Увеличенная область тапа */
            .close-modal::after {
                content: '';
                position: absolute;
                top: -15px;
                left: -15px;
                right: -15px;
                bottom: -15px;
                background: transparent;
                border-radius: 50%;
            }
        `;
        document.head.appendChild(style);
    }
}

// Инициализация улучшений при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    enhanceCloseButton();
    preventAccidentalClose();
    addMobileStyles();
    
    console.log('Улучшения для мобильных устройств загружены');
});

// Дополнительная инициализация после загрузки динамического контента
function reinitializeCloseButtons() {
    enhanceCloseButton();
}

// Экспорт функции для использования в основном скрипте
window.reinitializeCloseButtons = reinitializeCloseButtons;

// Ленивая загрузка изображений
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      imageObserver.unobserve(img);
    }
  });
});

// ===== ИСПРАВЛЕННАЯ КРУГОВАЯ ДИАГРАММА - СОВМЕСТИМОСТЬ С СУЩЕСТВУЮЩИМ КОДОМ =====

class SectionProgressTracker {
    constructor() {
        this.sections = [
            { id: 'home', name: 'Главная' },
            { id: 'about', name: 'Обо мне' },
            { id: 'experience', name: 'Опыт работы' },
            { id: 'qualification', name: 'Квалификация' },
            { id: 'portfolio', name: 'Портфолио' },
            { id: 'photos', name: 'Фотогалерея' },
            { id: 'contact', name: 'Контакты' },
            { id: 'resume', name: 'Резюме' }
        ];
        
        this.currentSection = 0;
        this.totalSections = this.sections.length;
        this.circumference = 2 * Math.PI * 25;
        
        // Элементы DOM
        this.progressCircle = document.querySelector('.progress-ring-circle');
        this.progressText = document.querySelector('.progress-text');
        this.progressIndicator = document.getElementById('sectionProgress');
        this.tooltip = document.querySelector('.progress-tooltip');
        
        this.init();
    }
    
    init() {
        if (!this.progressCircle) {
            console.warn('Элементы круговой диаграммы не найдены');
            return;
        }
        
        // Настройка SVG
        this.progressCircle.style.strokeDasharray = this.circumference;
        this.progressCircle.style.strokeDashoffset = this.circumference;
        
        this.updateProgress();
        this.bindEvents();
        
        console.log('📊 Трекер прогресса инициализирован');
    }
    
    updateProgress() {
        if (!this.progressCircle) return;
        
        const progress = ((this.currentSection + 1) / this.totalSections) * 100;
        const offset = this.circumference - (progress / 100) * this.circumference;
        
        // Анимация круга
        this.progressCircle.style.strokeDashoffset = offset;
        
        // Обновление текста
        if (this.progressText) {
            const currentSpan = this.progressText.querySelector('.current');
            const totalSpan = this.progressText.querySelector('.total');
            
            if (currentSpan) currentSpan.textContent = this.currentSection + 1;
            if (totalSpan) totalSpan.textContent = this.totalSections;
        }
        
        // Обновление tooltip
        this.updateTooltip();
        
        // Анимация обновления
        if (this.progressIndicator) {
            this.progressIndicator.classList.add('updating');
            setTimeout(() => {
                this.progressIndicator.classList.remove('updating');
            }, 600);
            
            // Эффект завершения при 100%
            if (progress === 100) {
                setTimeout(() => {
                    this.progressIndicator.classList.add('completed');
                    console.log('🎉 Все разделы просмотрены!');
                }, 800);
            } else {
                this.progressIndicator.classList.remove('completed');
            }
        }
    }
    
    updateTooltip() {
        if (!this.tooltip) return;
        
        const currentSectionData = this.sections[this.currentSection];
        const progress = ((this.currentSection + 1) / this.totalSections) * 100;
        
        const nameSpan = this.tooltip.querySelector('.section-name');
        const progressSpan = this.tooltip.querySelector('.section-progress');
        
        if (nameSpan) nameSpan.textContent = currentSectionData.name;
        if (progressSpan) progressSpan.textContent = Math.round(progress) + '%';
    }
    
    detectCurrentSection() {
        const sectionElements = document.querySelectorAll('section');
        let newCurrentSection = 0;
        
        sectionElements.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 3 && rect.bottom > window.innerHeight / 3) {
                newCurrentSection = index;
            }
        });
        
        // Обновляем только если раздел изменился
        if (newCurrentSection !== this.currentSection) {
            this.currentSection = newCurrentSection;
            this.updateProgress();
        }
    }
    
    bindEvents() {
        // Отслеживание скролла - НЕ МЕШАЕМ существующему коду
        let scrollTimeout;
        const originalScrollHandler = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.detectCurrentSection();
            }, 100);
        };
        
        window.addEventListener('scroll', originalScrollHandler);
        
        // НЕ ТРОГАЕМ существующие обработчики кнопок!
        // Они должны работать как раньше
        
        // Клик по диаграмме - только для быстрого перехода
        if (this.progressIndicator) {
            this.progressIndicator.addEventListener('click', (e) => {
                e.stopPropagation();
                // Переход к следующему разделу
                const nextIndex = (this.currentSection + 1) % this.totalSections;
                this.goToSection(nextIndex);
            });
        }
    }
    
    // Метод для программного перехода к разделу
    goToSection(sectionIndex) {
        if (sectionIndex < 0 || sectionIndex >= this.totalSections) return;
        
        const targetId = this.sections[sectionIndex].id;
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Используем существующую функцию скролла если она есть
            if (typeof scrollToSection === 'function') {
                scrollToSection(sectionIndex);
            } else {
                // Fallback
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
            
            // Обновляем текущий раздел
            this.currentSection = sectionIndex;
            this.updateProgress();
        }
    }
}

// Глобальная переменная для доступа из других частей кода
let sectionProgressTracker = null;

// Инициализация ПОСЛЕ загрузки всего остального кода
function initProgressTracker() {
    // Ждем чтобы убедиться что все элементы созданы
    setTimeout(() => {
        if (!sectionProgressTracker) {
            sectionProgressTracker = new SectionProgressTracker();
            
            // Интеграция с существующей системой навигации
            const originalCurrentSection = window.currentSection || 0;
            if (sectionProgressTracker && originalCurrentSection !== undefined) {
                sectionProgressTracker.currentSection = originalCurrentSection;
                sectionProgressTracker.updateProgress();
            }
        }
    }, 500);
}

// Функция для обновления прогресса извне (для интеграции)
function updateSectionProgress(sectionIndex) {
    if (sectionProgressTracker && sectionIndex !== undefined) {
        sectionProgressTracker.currentSection = sectionIndex;
        sectionProgressTracker.updateProgress();
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', initProgressTracker);
window.addEventListener('load', initProgressTracker);

// Экспорт для использования в существующем коде
window.updateSectionProgress = updateSectionProgress;
window.sectionProgressTracker = sectionProgressTracker;

// ===== ИСПРАВЛЕННАЯ СИСТЕМА ТЕМНОЙ ТЕМЫ =====

class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.toggleButton = document.getElementById('themeToggle');
        this.mobileToggleButton = document.getElementById('mobileThemeToggle');
        this.storageKey = 'timofey-website-theme';
        
        this.init();
    }
    
    init() {
        // Ждем полной загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeTheme();
            });
        } else {
            this.initializeTheme();
        }
    }
    
    initializeTheme() {
        // Загружаем сохраненную тему или определяем системную
        this.loadTheme();
        
        // Привязываем обработчики событий
        this.bindEvents();
        
        // Обновляем состояние переключателей
        this.updateToggleStates();
        
        console.log('🎨 Система тем инициализирована:', this.currentTheme);
    }
    
    loadTheme() {
        // Проверяем сохраненную тему
        const savedTheme = localStorage.getItem(this.storageKey);
        
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else {
            // Определяем системную тему
            this.currentTheme = this.getSystemTheme();
        }
        
        this.applyTheme(this.currentTheme);
    }
    
    getSystemTheme() {
        // Проверяем системные настройки пользователя
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    applyTheme(theme) {
        // Применяем тему к корневому элементу
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        
        this.currentTheme = theme;
        
        // Сохраняем в localStorage
        localStorage.setItem(this.storageKey, theme);
        
        // Обновляем meta тег для мобильных браузеров
        this.updateMetaThemeColor(theme);
        
        // Уведомляем другие компоненты об изменении темы
        this.dispatchThemeChangeEvent(theme);
    }
    
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = theme === 'dark' ? '#1A1A1A' : '#FFFFFF';
    }
    
    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themeChanged', {
            detail: { theme }
        });
        window.dispatchEvent(event);
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.updateToggleStates();
        
        // Добавляем небольшую анимацию
        this.animateThemeChange();
        
        console.log('🎨 Тема изменена на:', newTheme);
    }
    
    updateToggleStates() {
        const isDark = this.currentTheme === 'dark';
        
        // Обновляем десктопный переключатель
        if (this.toggleButton) {
            this.toggleButton.classList.toggle('active', isDark);
        }
        
        // Обновляем мобильный переключатель
        if (this.mobileToggleButton) {
            this.mobileToggleButton.classList.toggle('active', isDark);
        }
        
        // Обновляем иконки
        this.updateThemeIcons(isDark);
    }
    
    updateThemeIcons(isDark) {
        const icons = document.querySelectorAll('.theme-icon');
        
        icons.forEach(icon => {
            if (isDark) {
                icon.className = 'theme-icon fas fa-moon';
            } else {
                icon.className = 'theme-icon fas fa-sun';
            }
        });
    }
    
    animateThemeChange() {
        // Добавляем эффект мигания при смене темы
        document.body.style.transition = 'all 0.3s ease';
        
        // Небольшая задержка для плавности
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    bindEvents() {
        // Десктопный переключатель
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
        
        // Мобильный переключатель
        if (this.mobileToggleButton) {
            this.mobileToggleButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });
        }
        
        // Отслеживаем изменения системной темы
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Для старых браузеров
            if (mediaQuery.addListener) {
                mediaQuery.addListener((e) => {
                    this.handleSystemThemeChange(e);
                });
            } else {
                // Для новых браузеров
                mediaQuery.addEventListener('change', (e) => {
                    this.handleSystemThemeChange(e);
                });
            }
        }
        
        // Горячие клавиши
        document.addEventListener('keydown', (e) => {
            // Ctrl + Shift + D для переключения темы
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
    
    handleSystemThemeChange(e) {
        // Автоматически переключаем тему при изменении системной темы
        // (только если пользователь не выбрал тему вручную)
        if (!localStorage.getItem(this.storageKey)) {
            const newTheme = e.matches ? 'dark' : 'light';
            this.applyTheme(newTheme);
            this.updateToggleStates();
        }
    }
    
    // Публичные методы для управления извне
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
            this.updateToggleStates();
        }
    }
    
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    // Автоматическое переключение по времени (опционально)
    enableAutoTheme() {
        const hour = new Date().getHours();
        const autoTheme = (hour >= 18 || hour <= 6) ? 'dark' : 'light';
        
        if (this.currentTheme !== autoTheme) {
            this.setTheme(autoTheme);
            console.log('🌅 Автоматическое переключение темы на:', autoTheme);
        }
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ ТЕМ =====
let themeManager;

// ЗАМЕНИТЕ СУЩЕСТВУЮЩИЙ КОД ИНИЦИАЛИЗАЦИИ ТЕМЫ НА ЭТОТ:
function initializeThemeSystem() {
    themeManager = new ThemeManager();
    
    // Экспортируем в глобальную область для отладки
    window.themeManager = themeManager;
}

// Инициализируем систему тем при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeThemeSystem);
} else {
    initializeThemeSystem();
}

// ===== ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ =====

// Функция для получения текущей темы (для использования в других скриптах)
function getCurrentTheme() {
    return themeManager ? themeManager.getCurrentTheme() : 'light';
}

// Функция для программного переключения темы
function toggleTheme() {
    if (themeManager) {
        themeManager.toggleTheme();
    }
}

// Функция для установки конкретной темы
function setTheme(theme) {
    if (themeManager) {
        themeManager.setTheme(theme);
    }
}

// Слушатель изменений темы для других компонентов
window.addEventListener('themeChanged', (e) => {
    console.log('🎨 Тема изменена на:', e.detail.theme);
    
    // Здесь можно добавить дополнительную логику
    // например, обновление цветов диаграмм, карт и т.д.
    
    // Обновляем круговую диаграмму прогресса если она существует
    if (window.sectionProgressTracker) {
        const progressCircle = document.querySelector('.progress-ring-circle');
        if (progressCircle && e.detail.theme === 'dark') {
            // Можно изменить цвета диаграммы для темной темы
            progressCircle.style.stroke = '#FF8C5A';
        } else if (progressCircle) {
            progressCircle.style.stroke = 'url(#progressGradient)';
        }
    }
});

// Экспорт функций для глобального использования
window.getCurrentTheme = getCurrentTheme;
window.toggleTheme = toggleTheme;
window.setTheme = setTheme;

// ===== ИСПРАВЛЕНИЯ ДЛЯ СОВМЕСТИМОСТИ =====

// Убеждаемся, что старый код темы не конфликтует
document.addEventListener('DOMContentLoaded', () => {
    // Удаляем дублирующие обработчики если они есть
    const oldThemeToggles = document.querySelectorAll('[id*="theme"]:not(#themeToggle):not(#mobileThemeToggle)');
    oldThemeToggles.forEach(toggle => {
        if (toggle.id !== 'themeToggle' && toggle.id !== 'mobileThemeToggle') {
            toggle.remove();
        }
    });
    
    // Проверяем что переключатели находятся в правильных местах
    const desktopToggle = document.getElementById('themeToggle');
    const mobileToggle = document.getElementById('mobileThemeToggle');
    
    if (!desktopToggle) {
        console.warn('⚠️ Десктопный переключатель темы не найден. Проверьте HTML структуру.');
    }
    
    if (!mobileToggle) {
        console.warn('⚠️ Мобильный переключатель темы не найден. Проверьте HTML структуру.');
    }
    
    // Убеждаемся что header-controls находится в header, а не в мобильном меню
    const headerControls = document.querySelector('.header-controls');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (headerControls && mobileMenu && mobileMenu.contains(headerControls)) {
        console.warn('⚠️ header-controls находится в мобильном меню. Переместите его в header.');
    }
});

// ===== ДОПОЛНИТЕЛЬНЫЕ ИСПРАВЛЕНИЯ ДЛЯ ТЕМНОЙ ТЕМЫ =====

// Функция для принудительного обновления всех цветов
function forceThemeUpdate() {
    if (!themeManager) return;
    
    const currentTheme = themeManager.getCurrentTheme();
    
    // Принудительно применяем тему заново
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    // Обновляем все переключатели
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(toggle => {
        toggle.classList.toggle('active', currentTheme === 'dark');
    });
    
    // Обновляем иконки
    const icons = document.querySelectorAll('.theme-icon');
    icons.forEach(icon => {
        if (currentTheme === 'dark') {
            icon.className = 'theme-icon fas fa-moon';
        } else {
            icon.className = 'theme-icon fas fa-sun';
        }
    });
    
    console.log('🔄 Принудительное обновление темы:', currentTheme);
}

// Функция для диагностики проблем с темой
function diagnoseThemeIssues() {
    console.group('🔍 Диагностика темной темы');
    
    // Проверяем переключатели
    const desktopToggle = document.getElementById('themeToggle');
    const mobileToggle = document.getElementById('mobileThemeToggle');
    
    console.log('Десктопный переключатель:', desktopToggle ? '✅ Найден' : '❌ Не найден');
    console.log('Мобильный переключатель:', mobileToggle ? '✅ Найден' : '❌ Не найден');
    
    // Проверяем текущую тему
    const currentTheme = document.documentElement.getAttribute('data-theme');
    console.log('Текущая тема:', currentTheme || 'light');
    
    // Проверяем CSS переменные
    const computedStyles = getComputedStyle(document.documentElement);
    const primaryColor = computedStyles.getPropertyValue('--primary-color').trim();
    const textColor = computedStyles.getPropertyValue('--text-color').trim();
    const bgColor = computedStyles.getPropertyValue('--bg-color').trim();
    
    console.log('CSS переменные:');
    console.log('  --primary-color:', primaryColor);
    console.log('  --text-color:', textColor);
    console.log('  --bg-color:', bgColor);
    
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('timofey-website-theme');
    console.log('Сохраненная тема:', savedTheme);
    
    // Проверяем менеджер тем
    console.log('Менеджер тем:', themeManager ? '✅ Инициализирован' : '❌ Не инициализирован');
    
    console.groupEnd();
}

// Экспортируем утилиты для отладки
window.forceThemeUpdate = forceThemeUpdate;
window.diagnoseThemeIssues = diagnoseThemeIssues;

// ===== АВТОМАТИЧЕСКАЯ ДИАГНОСТИКА ПРИ РАЗРАБОТКЕ =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Запускаем диагностику через 2 секунды после загрузки (только в разработке)
    setTimeout(() => {
        console.log('🔧 Режим разработки: запуск автоматической диагностики');
        diagnoseThemeIssues();
    }, 2000);
}

// ===== ФИЛЬТРЫ КВАЛИФИКАЦИИ И ПОРТФОЛИО =====

const RECENT_QUAL_COUNT = 5;
const RECENT_PORTFOLIO_COUNT = 6;

function initCategoryFilters() {
    setupFilterSection(
        'qualFilterTabs',
        '#qualificationsGrid .qualification-card',
        RECENT_QUAL_COUNT
    );
    setupFilterSection(
        'portfolioFilterTabs',
        '#portfolioGrid .portfolio-item',
        RECENT_PORTFOLIO_COUNT
    );
}

function setupFilterSection(tabsId, itemsSelector, recentCount) {
    const tabs = document.getElementById(tabsId);
    if (!tabs) return;

    const getItems = () => Array.from(document.querySelectorAll(itemsSelector));

    function applyFilter(filter) {
        const items = getItems();
        items.forEach(item => item.classList.remove('filter-hidden'));

        if (filter === 'all') return;

        if (filter === 'recent') {
            // показываем последние recentCount по порядку в DOM
            const visible = items.slice(-recentCount);
            items.forEach(item => {
                if (!visible.includes(item)) item.classList.add('filter-hidden');
            });
            return;
        }

        items.forEach(item => {
            const cats = (item.dataset.category || '').split(' ');
            if (!cats.includes(filter)) item.classList.add('filter-hidden');
        });
    }

    // применяем начальный фильтр "recent"
    applyFilter('recent');

    tabs.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        tabs.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        applyFilter(btn.dataset.filter);
    });
}

document.addEventListener('DOMContentLoaded', initCategoryFilters);

/* ПРЕЛОАДЕР */
window.addEventListener('load', function() {
    document.body.style.overflow = 'hidden';
    setTimeout(startSearchPreloader, 100);
});

function startSearchPreloader() {
    const progressCircle = document.getElementById('progressCircle');
    const progressPercent = document.getElementById('progressPercent');
    const searchTitle = document.getElementById('searchTitle');
    const searchStatus = document.getElementById('searchStatus');
    const searchDetails = document.getElementById('searchDetails');
    const foundMessage = document.getElementById('foundMessage');
    const specialistName = document.getElementById('specialistName');
    const preloader = document.getElementById('preloader');
    
    if (!preloader) return;
    
    let progress = 0;
    const circumference = 2 * Math.PI * 65;
    
    searchTitle.textContent = 'Загрузка...';
    searchStatus.innerHTML = 'Поиск IT-специалистов<span class="search-dots"></span>';
    
    const phases = [
        { progress: 15, detail: 'Сканирование профилей...' },
        { progress: 30, detail: 'Анализ навыков...' },
        { progress: 50, detail: 'Анализ компетенций...' },
        { progress: 70, detail: 'Проверка опыта...' },
        { progress: 85, detail: 'Оценка стажа работы...' },
        { progress: 100, detail: 'Анализ достижений...' }
    ];
    
    let currentPhase = 0;
    let detailsList = [];
    
    const interval = setInterval(() => {
        progress += Math.random() * 1.5 + 0.8;
        
        if (progress >= 90 && !preloader.classList.contains('almost-done')) {
            preloader.classList.add('almost-done');
        }
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            showFoundSpecialist();
        }
        
        const offset = circumference - (progress / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
        progressPercent.textContent = Math.round(progress) + '%';
        
        if (currentPhase < phases.length && progress >= phases[currentPhase].progress) {
            const phase = phases[currentPhase];
            detailsList.push(phase.detail);
            searchDetails.innerHTML = detailsList.join('<br>');
            currentPhase++;
        }
        
    }, 100);
    
    function showFoundSpecialist() {
        setTimeout(() => {
            searchTitle.textContent = 'Готово!';
            searchStatus.innerHTML = 'Идеальное совпадение!';
            searchDetails.style.display = 'none';
            
            setTimeout(() => {
                foundMessage.classList.add('show');
                
                setTimeout(() => {
                    specialistName.classList.add('show');
                    createParticles();
                    
                    setTimeout(() => {
                        preloader.classList.add('hidden');
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                        document.body.style.overflow = 'auto';
                        
                        setTimeout(() => {
                            if (preloader.parentNode) {
                                preloader.parentNode.removeChild(preloader);
                            }
                        }, 1200);
                    }, 1000);
                }, 600);
                
            }, 100);
        }, 200);
    }
    
    function createParticles() {
        const particles = document.getElementById('particles');
        if (!particles) return;
        
        particles.classList.add('show');
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 2 + 's';
                particles.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 3000);
            }, i * 100);
        }
    }
}