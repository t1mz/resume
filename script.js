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

// РАЗДЕЛЯЕМ LIGHTBOX И ГАЛЕРЕЮ
const lightbox = document.getElementById('galleryLightbox');
const lightboxImg = lightbox.querySelector('img');
const closeLightbox = document.querySelector('.close-lightbox');
const qualificationCards = document.querySelectorAll('.qualification-card');

const projectCarouselModal = document.getElementById('projectCarouselModal');
const projectCarousel = document.getElementById('projectCarousel');
const projectTitle = document.getElementById('projectTitle');
const demoBtns = document.querySelectorAll('.demo-btn');
const closeProjectModal = projectCarouselModal.querySelector('.close-modal');
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
let currentProjectIndex = 0;
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

// Открытие/закрытие мобильного меню
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    overlay.classList.add('active');
});

closeMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
});

// Открытие/закрытие модального окна "Подробнее"
moreAboutBtn.addEventListener('click', () => {
    aboutModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

closeModalBtn.addEventListener('click', () => {
    aboutModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Закрытие модального окна при клике вне его
window.addEventListener('click', (e) => {
    if (e.target === aboutModal) {
        aboutModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Навигация по разделам кнопками вверх/вниз
scrollUpBtn.addEventListener('click', () => {
    if (currentSection > 0) {
        currentSection--;
        scrollToSection(currentSection);
    }
});

scrollDownBtn.addEventListener('click', () => {
    if (currentSection < sections.length - 1) {
        currentSection++;
        scrollToSection(currentSection);
    }
});

scrollTopBtn.addEventListener('click', () => {
    currentSection = 0;
    scrollToSection(currentSection);
});

// Плавная прокрутка к разделу
function scrollToSection(index) {
    window.scrollTo({
        top: sections[index].offsetTop,
        behavior: 'smooth'
    });
    
    // Обновление активного пункта меню
    const targetId = `#${sections[index].id}`;
    updateActiveNav(targetId);
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
    if (current) {
        updateActiveNav(`#${current}`);
        
        // Обновление currentSection
        sections.forEach((section, index) => {
            if (section.id === current) {
                currentSection = index;
            }
        });
    }
});

// ========== ИСПРАВЛЕНИЕ: РАЗДЕЛЕНИЕ LIGHTBOX И ГАЛЕРЕИ ==========

// Простой lightbox для документов (квалификация/успехи) - БЕЗ КАРУСЕЛИ
qualificationCards.forEach(card => {
    card.addEventListener('click', () => {
        const imgSrc = card.getAttribute('data-img');
        
        // СКРЫВАЕМ КНОПКИ НАВИГАЦИИ ДЛЯ ДОКУМЕНТОВ
        const lightboxNav = lightbox.querySelector('.lightbox-nav');
        lightboxNav.style.display = 'none';
        
        lightboxImg.src = imgSrc;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

// Карусель проектов
demoBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const portfolioItem = this.closest('.portfolio-item');
        const title = portfolioItem.getAttribute('data-title');
        const images = JSON.parse(portfolioItem.getAttribute('data-imgs'));
        
        projectTitle.textContent = title;
        projectCarousel.innerHTML = '';
        
        images.forEach(img => {
            const slide = document.createElement('div');
            slide.className = 'project-slide';
            slide.innerHTML = `<img src="${img}" alt="${title}">`;
            projectCarousel.appendChild(slide);
        });
        
        currentProjectIndex = 0;
        updateProjectCarousel();
        
        projectCarouselModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

// Закрытие модального окна проектов
closeProjectModal.addEventListener('click', () => {
    projectCarouselModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

projectCarouselModal.addEventListener('click', (e) => {
    if (e.target === projectCarouselModal) {
        projectCarouselModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Навигация по карусели проектов
prevProjectBtn.addEventListener('click', () => {
    currentProjectIndex = (currentProjectIndex - 1 + projectCarousel.children.length) % projectCarousel.children.length;
    updateProjectCarousel();
});

nextProjectBtn.addEventListener('click', () => {
    currentProjectIndex = (currentProjectIndex + 1) % projectCarousel.children.length;
    updateProjectCarousel();
});

function updateProjectCarousel() {
    projectCarousel.style.transform = `translateX(-${currentProjectIndex * 100}%)`;
}



// ========== КАРУСЕЛЬ ФОТОГАЛЕРЕИ (ТОЛЬКО ДЛЯ РАЗДЕЛА ФОТО) ==========
function initPhotoCarousel() {
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
    prevPhotoBtn.addEventListener('click', () => {
        currentPhotoIndex = (currentPhotoIndex - 1 + slides.length) % slides.length;
        updatePhotoCarousel();
        resetPhotoInterval();
    });
    
    nextPhotoBtn.addEventListener('click', () => {
        currentPhotoIndex = (currentPhotoIndex + 1) % slides.length;
        updatePhotoCarousel();
        resetPhotoInterval();
    });
    
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
    startPhotoInterval();
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
    // ПОКАЗЫВАЕМ кнопки навигации для фотогалереи
    const lightboxNav = lightbox.querySelector('.lightbox-nav');
    lightboxNav.style.display = 'flex';
    
    lightboxImg.src = galleryImages[currentGalleryIndex];
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Закрытие галереи
function closeGallery() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Навигация по фотогалерее
function prevGalleryImage() {
    if (galleryImages.length > 0) {
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentGalleryIndex];
    }
}

function nextGalleryImage() {
    if (galleryImages.length > 0) {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
        lightboxImg.src = galleryImages[currentGalleryIndex];
    }
}

// Обработчики событий для галереи
prevGalleryBtn.addEventListener('click', prevGalleryImage);
nextGalleryBtn.addEventListener('click', nextGalleryImage);
closeLightbox.addEventListener('click', closeGallery);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeGallery();
    }
});

// Обработка клавиатуры для галереи
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
        // Навигация только если открыта фотогалерея (есть кнопки навигации)
        const lightboxNav = lightbox.querySelector('.lightbox-nav');
        const navVisible = lightboxNav.style.display !== 'none';
        
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

// Инициализация карусели фото и галереи после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    initPhotoCarousel();
    initGallery();
});
// ========== ДОБАВЬТЕ ЭТИ ФУНКЦИИ В КОНЕЦ ФАЙЛА ==========

// Создание счетчика фотографий
function createPhotoCounter(total) {
    const existingCounter = document.querySelector('.photo-counter');
    if (existingCounter) existingCounter.remove();
    
    const counter = document.createElement('div');
    counter.className = 'photo-counter';
    counter.textContent = `1 / ${total}`;
    document.querySelector('.photo-carousel').appendChild(counter);
}

// Обновление счетчика
function updatePhotoCounter() {
    const counter = document.querySelector('.photo-counter');
    const total = photoCarousel.querySelectorAll('.carousel-slide').length;
    if (counter) {
        counter.textContent = `${currentPhotoIndex + 1} / ${total}`;
    }
}

// Создание прогресс-бара
function createProgressBar() {
    const existingProgress = document.querySelector('.carousel-progress');
    if (existingProgress) existingProgress.remove();
    
    const progressBar = document.createElement('div');
    progressBar.className = 'carousel-progress';
    progressBar.style.width = '0%';
    document.querySelector('.photo-carousel').appendChild(progressBar);
}

// Обновление прогресс-бара
function updateProgressBar(progress) {
    const progressBar = document.querySelector('.carousel-progress');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

// Инициализация превью соседних фотографий
function initPhotoPreview() {
    const slides = photoCarousel.querySelectorAll('.carousel-slide');
    
    slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        if (!img) return;
        
        slide.setAttribute('data-index', index);
    });
}

// Обновление превью соседних фотографий
function updatePhotoPreview() {
    const slides = photoCarousel.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    
    if (totalSlides <= 1) return;
    
    const currentSlide = slides[currentPhotoIndex];
    const prevIndex = (currentPhotoIndex - 1 + totalSlides) % totalSlides;
    const nextIndex = (currentPhotoIndex + 1) % totalSlides;
    
    const prevImg = slides[prevIndex]?.querySelector('img');
    const nextImg = slides[nextIndex]?.querySelector('img');
    
    // Очищаем все превью
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Устанавливаем текущий слайд как активный
    currentSlide.classList.add('active');
    
    // Устанавливаем фоновые изображения для превью
    if (prevImg && nextImg) {
        updatePreviewStyles(prevImg.src, nextImg.src);
    }
}

// Обновление стилей превью
function updatePreviewStyles(prevImgSrc, nextImgSrc) {
    // Удаляем предыдущие стили
    const existingStyle = document.getElementById('dynamic-preview-styles');
    if (existingStyle) existingStyle.remove();
    
    // Создаем новые стили
    const style = document.createElement('style');
    style.id = 'dynamic-preview-styles';
    style.textContent = `
        .carousel-slide.active::before {
            background-image: url("${prevImgSrc}");
            background-size: cover;
            background-position: center;
        }
        .carousel-slide.active::after {
            background-image: url("${nextImgSrc}");
            background-size: cover;
            background-position: center;
        }
    `;
    document.head.appendChild(style);
}
// ========== ИСПРАВЛЕННЫЙ LIGHTBOX ДЛЯ ДОКУМЕНТОВ С ЗУМОМ ==========

// ========== ИСПРАВЛЕННЫЙ LIGHTBOX ДЛЯ ДОКУМЕНТОВ С ЗУМОМ ==========

// Простой lightbox для документов (квалификация/успехи) - БЕЗ КАРУСЕЛИ, НО С ЗУМОМ
qualificationCards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const imgSrc = card.getAttribute('data-img');
        const title = card.querySelector('.qualification-title').textContent;
        
        console.log('Открываем документ:', imgSrc, title); // Для отладки
        
        // СКРЫВАЕМ КНОПКИ НАВИГАЦИИ ДЛЯ ДОКУМЕНТОВ
        const lightboxNav = lightbox.querySelector('.lightbox-nav');
        if (lightboxNav) {
            lightboxNav.style.display = 'none';
        }
        
        // Получаем правильный элемент изображения
        const lightboxContent = lightbox.querySelector('.lightbox-content');
        const currentLightboxImg = lightboxContent.querySelector('img');
        
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

// НОВОЕ: Добавление кнопки сохранения
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

// НОВОЕ: Функция скачивания изображения (исправленная)
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

// ИСПРАВЛЕННОЕ: Добавление обработчика зума
function addZoomHandler(imgElement) {
    // Очищаем предыдущие обработчики событий
    const newImg = imgElement.cloneNode(true);
    imgElement.parentNode.replaceChild(newImg, imgElement);
    
    const ZOOM_LEVEL = 1.5; // Настройка уровня зума
    let isZoomed = false;
    let startX, startY, translateX = 0, translateY = 0;
    let isDragging = false;
    let isMouseDown = false; // НОВОЕ: отслеживаем состояние кнопки мыши
    let dragThreshold = 5; // Минимальное движение для считывания как перетаскивание
    let clickStartX, clickStartY;
    
    // ИСПРАВЛЕНО: Обработка нажатия мыши
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
    
    // ИСПРАВЛЕНО: Перетаскивание только при зажатой кнопке мыши
    const mouseMoveHandler = (e) => {
        if (!isMouseDown || !isZoomed) return;
        
        const deltaX = Math.abs(e.clientX - clickStartX);
        const deltaY = Math.abs(e.clientY - clickStartY);
        
        // Если движение больше порога И кнопка мыши зажата, считаем это перетаскиванием
        if ((deltaX > dragThreshold || deltaY > dragThreshold) && isMouseDown) {
            isDragging = true;
            
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            newImg.style.transform = `scale(${ZOOM_LEVEL}) translate(${translateX}px, ${translateY}px)`;
        }
    };
    
    // ИСПРАВЛЕНО: Обработка отпускания мыши
    const mouseUpHandler = (e) => {
        const deltaX = Math.abs(e.clientX - clickStartX);
        const deltaY = Math.abs(e.clientY - clickStartY);
        
        // Если это был клик (малое движение И не было перетаскивания), переключаем зум
        if (!isDragging && deltaX <= dragThreshold && deltaY <= dragThreshold && isMouseDown) {
            toggleZoom(e, newImg, ZOOM_LEVEL);
        }
        
        // Сбрасываем состояния
        isMouseDown = false;
        isDragging = false;
        
        if (isZoomed) {
            newImg.style.cursor = 'grab';
        }
    };
    
    // НОВОЕ: Функция переключения зума
    function toggleZoom(e, img, zoomLevel) {
        isZoomed = !isZoomed;
        
        if (isZoomed) {
            img.classList.add('zoomed');
            img.style.cursor = 'grab';
            
            // Центрируем зум на точке клика
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
    
    // НОВОЕ: Обработка покидания области изображения
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
            
            // Сохраняем текущий уровень зума при прокрутке колеса
            if (currentScale !== ZOOM_LEVEL) {
                newImg.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
            } else {
                newImg.style.transform = `scale(${ZOOM_LEVEL}) translate(${translateX}px, ${translateY}px)`;
            }
        }
        
        updateZoomIndicator(isZoomed);
    });
    
    // Touch события для мобильных устройств (исправлены)
    let touchStartDistance = 0;
    let initialScale = 1;
    let touchStartX, touchStartY;
    let isTouchDragging = false;
    
    newImg.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            // Pinch to zoom
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
            // Pinch to zoom
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
            
            // Если это был тап (малое движение), переключаем зум
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

// Закрытие lightbox (обновленное)
function closeGallery() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Очищаем зум и индикаторы
    const indicator = lightbox.querySelector('.zoom-indicator');
    if (indicator) indicator.remove();
    
    const info = lightbox.querySelector('.lightbox-info');
    if (info) info.remove();
    
    const saveButton = lightbox.querySelector('.save-button');
    if (saveButton) saveButton.remove();
    
    // Получаем текущее изображение
    const currentImg = lightbox.querySelector('.lightbox-content img');
    if (currentImg) {
        // Сбрасываем трансформации
        currentImg.classList.remove('zoomed');
        currentImg.style.transform = '';
        currentImg.style.cursor = '';
        currentImg.style.transformOrigin = '';
        
        // Удаляем обработчики событий
        if (currentImg._mouseMoveHandler) {
            document.removeEventListener('mousemove', currentImg._mouseMoveHandler);
        }
        if (currentImg._mouseUpHandler) {
            document.removeEventListener('mouseup', currentImg._mouseUpHandler);
        }
    }
}

// ========== РАСКРЫВАЮЩИЕСЯ КАРТОЧКИ ОПЫТА РАБОТЫ ==========

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

// Функция переключения состояния карточки
function toggleCard(card, shouldExpand) {
    const fullDetails = card.querySelector('.full-details');
    
    if (shouldExpand) {
        // Раскрываем карточку
        card.classList.add('expanded');
        
        // Плавная анимация появления
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
        card.classList.remove('expanded');
        
        // Сбрасываем стили анимации
        const elements = fullDetails.querySelectorAll('p, ul, .company-link');
        elements.forEach(el => {
            el.style.opacity = '';
            el.style.transform = '';
        });
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
    const icon = button.querySelector('i');
    const text = button.querySelector('.btn-text') || button.childNodes[button.childNodes.length - 1];
    
    if (isExpanded) {
        if (text.textContent) {
            text.textContent = ' Скрыть';
        } else {
            button.innerHTML = '<i class="fas fa-chevron-up"></i> Скрыть';
        }
    } else {
        if (text.textContent) {
            text.textContent = ' Подробнее';
        } else {
            button.innerHTML = '<i class="fas fa-chevron-down"></i> Подробнее';
        }
    }
}

// Добавляем глобальные функции для управления всеми карточками
window.expandAllCards = function() {
    expandableCards.forEach(card => {
        const button = card.querySelector('.timeline-expand-btn');
        toggleCard(card, true);
        updateButtonText(button, true);
    });
};

window.collapseAllCards = function() {
    expandableCards.forEach(card => {
        const button = card.querySelector('.timeline-expand-btn');
        toggleCard(card, false);
        updateButtonText(button, false);
    });
};

// Автоматическое раскрытие первой карточки (опционально)
// Раскомментируйте, если хотите, чтобы первая карточка была раскрыта по умолчанию
/*
document.addEventListener('DOMContentLoaded', () => {
    if (expandableCards.length > 0) {
        const firstCard = expandableCards[0];
        const firstButton = firstCard.querySelector('.timeline-expand-btn');
        
        setTimeout(() => {
            toggleCard(firstCard, true);
            updateButtonText(firstButton, true);
        }, 500);
    }
});
*/

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

// Инициализация стилей для элементов внутри скрытых деталей
document.addEventListener('DOMContentLoaded', () => {
    expandableCards.forEach(card => {
        const fullDetails = card.querySelector('.full-details');
        const elements = fullDetails.querySelectorAll('p, ul, .company-link');
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(10px)';
            el.style.transition = 'all 0.4s ease';
        });
    });
});