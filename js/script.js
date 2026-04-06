// ===================================
// Image Slider Application
// ===================================

// Slider Configuration
const SLIDER_CONFIG = {
    autoplayInterval: 3000,
    transitionDuration: 500,
    swipeThreshold: 50
};

// Image Data
const IMAGES = [
    {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        title: 'Mountain Landscape',
        description: 'Breathtaking mountain views at sunrise'
    },
    {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop',
        title: 'Forest Path',
        description: 'Peaceful walk through nature'
    },
    {
        url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=800&fit=crop',
        title: 'Sunset Beach',
        description: 'Golden hour by the ocean'
    },
    {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        title: 'Desert Dunes',
        description: 'Vast desert landscape'
    },
    {
        url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&h=800&fit=crop',
        title: 'Alpine Lake',
        description: 'Crystal clear mountain lake'
    }
];

// Application State
const state = {
    currentSlide: 0,
    totalSlides: IMAGES.length,
    isAutoplay: false,
    autoplayTimer: null,
    progressTimer: null,
    transitionMode: 'slide', // 'slide' or 'fade'
    isFullscreen: false,
    touchStartX: 0,
    touchEndX: 0
};

// DOM Elements
const elements = {
    sliderWrapper: document.getElementById('sliderWrapper'),
    sliderContainer: document.getElementById('sliderContainer'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    sliderDots: document.getElementById('sliderDots'),
    currentSlide: document.getElementById('currentSlide'),
    totalSlides: document.getElementById('totalSlides'),
    autoplayBtn: document.getElementById('autoplayBtn'),
    transitionBtn: document.getElementById('transitionBtn'),
    fullscreenBtn: document.getElementById('fullscreenBtn'),
    thumbnailContainer: document.getElementById('thumbnailContainer'),
    imageTitle: document.getElementById('imageTitle'),
    imageDescription: document.getElementById('imageDescription'),
    progressBar: document.getElementById('progressBar'),
    progressFill: document.getElementById('progressFill')
};

// ===================================
// Initialize Slider
// ===================================
function initializeSlider() {
    console.log('Initializing Image Slider...');
    
    // Load images
    loadImages();
    
    // Create navigation dots
    createNavigationDots();
    
    // Create thumbnails
    createThumbnails();
    
    // Setup event listeners
    setupEventListeners();
    
    // Update UI
    updateSlidePosition();
    updateIndicators();
    updateImageInfo();
    
    // Set total slides
    elements.totalSlides.textContent = state.totalSlides;
}

// ===================================
// Load Images
// ===================================
function loadImages() {
    elements.sliderWrapper.innerHTML = '';
    
    IMAGES.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        if (index === 0) slide.classList.add('active');
        
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.title;
        img.loading = 'lazy';
        
        const caption = document.createElement('div');
        caption.className = 'slide-caption';
        caption.innerHTML = `
            <h3>${image.title}</h3>
            <p>${image.description}</p>
        `;
        
        slide.appendChild(img);
        slide.appendChild(caption);
        elements.sliderWrapper.appendChild(slide);
    });
}


// ===================================
// Create Navigation Dots
// ===================================
function createNavigationDots() {
    elements.sliderDots.innerHTML = '';
    
    for (let i = 0; i < state.totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        elements.sliderDots.appendChild(dot);
    }
}

// ===================================
// Create Thumbnails
// ===================================
function createThumbnails() {
    elements.thumbnailContainer.innerHTML = '';
    
    IMAGES.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        if (index === 0) thumbnail.classList.add('active');
        
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.title;
        
        thumbnail.appendChild(img);
        thumbnail.addEventListener('click', () => goToSlide(index));
        elements.thumbnailContainer.appendChild(thumbnail);
    });
}

// ===================================
// Setup Event Listeners
// ===================================
function setupEventListeners() {
    // Navigation buttons
    elements.prevBtn.addEventListener('click', previousSlide);
    elements.nextBtn.addEventListener('click', nextSlide);
    
    // Control buttons
    elements.autoplayBtn.addEventListener('click', toggleAutoplay);
    elements.transitionBtn.addEventListener('click', toggleTransitionMode);
    elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Touch events for swipe
    elements.sliderContainer.addEventListener('touchstart', handleTouchStart);
    elements.sliderContainer.addEventListener('touchmove', handleTouchMove);
    elements.sliderContainer.addEventListener('touchend', handleTouchEnd);
    
    // Pause autoplay on hover
    elements.sliderContainer.addEventListener('mouseenter', () => {
        if (state.isAutoplay) {
            stopAutoplay();
        }
    });
    
    elements.sliderContainer.addEventListener('mouseleave', () => {
        if (state.isAutoplay) {
            startAutoplay();
        }
    });
}

// ===================================
// Go To Slide
// ===================================
function goToSlide(index) {
    if (index < 0) {
        state.currentSlide = state.totalSlides - 1;
    } else if (index >= state.totalSlides) {
        state.currentSlide = 0;
    } else {
        state.currentSlide = index;
    }
    
    updateSlidePosition();
    updateIndicators();
    updateImageInfo();
    resetProgress();
}

// ===================================
// Next Slide
// ===================================
function nextSlide() {
    goToSlide(state.currentSlide + 1);
}

// ===================================
// Previous Slide
// ===================================
function previousSlide() {
    goToSlide(state.currentSlide - 1);
}

// ===================================
// Update Slide Position
// ===================================
function updateSlidePosition() {
    if (state.transitionMode === 'slide') {
        const offset = -state.currentSlide * 100;
        elements.sliderWrapper.style.transform = `translateX(${offset}%)`;
    } else {
        // Fade mode
        const slides = elements.sliderWrapper.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === state.currentSlide);
        });
    }
}


// ===================================
// Update Indicators
// ===================================
function updateIndicators() {
    // Update counter
    elements.currentSlide.textContent = state.currentSlide + 1;
    
    // Update dots
    const dots = elements.sliderDots.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === state.currentSlide);
    });
    
    // Update thumbnails
    const thumbnails = elements.thumbnailContainer.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.classList.toggle('active', index === state.currentSlide);
    });
}

// ===================================
// Update Image Info
// ===================================
function updateImageInfo() {
    const currentImage = IMAGES[state.currentSlide];
    elements.imageTitle.textContent = currentImage.title;
    elements.imageDescription.textContent = currentImage.description;
}

// ===================================
// Keyboard Navigation
// ===================================
function handleKeyboardNavigation(event) {
    if (event.key === 'ArrowLeft') {
        previousSlide();
    } else if (event.key === 'ArrowRight') {
        nextSlide();
    } else if (event.key === 'Escape' && state.isFullscreen) {
        toggleFullscreen();
    }
}

// ===================================
// Touch Events for Swipe
// ===================================
function handleTouchStart(event) {
    state.touchStartX = event.touches[0].clientX;
}

function handleTouchMove(event) {
    state.touchEndX = event.touches[0].clientX;
}

function handleTouchEnd() {
    const swipeDistance = state.touchStartX - state.touchEndX;
    
    if (Math.abs(swipeDistance) > SLIDER_CONFIG.swipeThreshold) {
        if (swipeDistance > 0) {
            nextSlide();
        } else {
            previousSlide();
        }
    }
}

// ===================================
// Autoplay Functions
// ===================================
function toggleAutoplay() {
    state.isAutoplay = !state.isAutoplay;
    
    if (state.isAutoplay) {
        startAutoplay();
        elements.autoplayBtn.classList.add('active');
        elements.autoplayBtn.querySelector('.control-icon').textContent = '⏸️';
    } else {
        stopAutoplay();
        elements.autoplayBtn.classList.remove('active');
        elements.autoplayBtn.querySelector('.control-icon').textContent = '▶️';
    }
}

function startAutoplay() {
    stopAutoplay(); // Clear any existing timer
    
    state.autoplayTimer = setInterval(() => {
        nextSlide();
    }, SLIDER_CONFIG.autoplayInterval);
    
    startProgress();
}

function stopAutoplay() {
    if (state.autoplayTimer) {
        clearInterval(state.autoplayTimer);
        state.autoplayTimer = null;
    }
    stopProgress();
}

// ===================================
// Progress Bar
// ===================================
function startProgress() {
    stopProgress();
    elements.progressFill.style.width = '0%';
    
    let progress = 0;
    const increment = 100 / (SLIDER_CONFIG.autoplayInterval / 100);
    
    state.progressTimer = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
            progress = 100;
        }
        elements.progressFill.style.width = `${progress}%`;
    }, 100);
}

function stopProgress() {
    if (state.progressTimer) {
        clearInterval(state.progressTimer);
        state.progressTimer = null;
    }
}

function resetProgress() {
    if (state.isAutoplay) {
        startProgress();
    }
}


// ===================================
// Toggle Transition Mode
// ===================================
function toggleTransitionMode() {
    state.transitionMode = state.transitionMode === 'slide' ? 'fade' : 'slide';
    
    if (state.transitionMode === 'fade') {
        elements.sliderWrapper.classList.add('fade-mode');
        elements.sliderWrapper.style.transform = 'translateX(0)';
        elements.transitionBtn.classList.add('active');
        elements.transitionBtn.querySelector('.control-text').textContent = 'Fade';
    } else {
        elements.sliderWrapper.classList.remove('fade-mode');
        elements.transitionBtn.classList.remove('active');
        elements.transitionBtn.querySelector('.control-text').textContent = 'Slide';
    }
    
    updateSlidePosition();
}

// ===================================
// Toggle Fullscreen
// ===================================
function toggleFullscreen() {
    state.isFullscreen = !state.isFullscreen;
    
    if (state.isFullscreen) {
        elements.sliderContainer.classList.add('fullscreen');
        elements.fullscreenBtn.classList.add('active');
        elements.fullscreenBtn.querySelector('.control-icon').textContent = '⛶';
        
        // Request fullscreen API
        if (elements.sliderContainer.requestFullscreen) {
            elements.sliderContainer.requestFullscreen();
        } else if (elements.sliderContainer.webkitRequestFullscreen) {
            elements.sliderContainer.webkitRequestFullscreen();
        } else if (elements.sliderContainer.msRequestFullscreen) {
            elements.sliderContainer.msRequestFullscreen();
        }
    } else {
        elements.sliderContainer.classList.remove('fullscreen');
        elements.fullscreenBtn.classList.remove('active');
        elements.fullscreenBtn.querySelector('.control-icon').textContent = '⛶';
        
        // Exit fullscreen API
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// Handle fullscreen change events
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        state.isFullscreen = false;
        elements.sliderContainer.classList.remove('fullscreen');
        elements.fullscreenBtn.classList.remove('active');
    }
}

// ===================================
// Initialize on DOM Load
// ===================================
document.addEventListener('DOMContentLoaded', initializeSlider);

// ===================================
// Utility Functions
// ===================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    updateSlidePosition();
}, 250));
