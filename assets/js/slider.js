// Infinite Image Slider with Mouse Drag
class InfiniteSlider {
    constructor(sliderElement) {
        this.slider = sliderElement;
        this.track = sliderElement.querySelector('.slider-track');
        this.items = Array.from(this.track.children);
        
        // État du drag
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = 0;
        this.currentIndex = 0;
        
        // Animation automatique
        this.autoScrollSpeed = 0.5; // pixels par frame
        this.isAutoScrolling = true;
        
        this.init();
    }
    
    init() {
        // Dupliquer les items pour créer l'effet infini
        this.duplicateItems();
        
        // Calculer les dimensions
        this.updateDimensions();
        
        // Ajouter les event listeners
        this.addEventListeners();
        
        // Démarrer l'animation
        this.animate();
    }
    
    duplicateItems() {
        // Dupliquer les items 3 fois pour un défilement fluide
        const itemsHTML = this.track.innerHTML;
        this.track.innerHTML = itemsHTML + itemsHTML + itemsHTML;
        this.items = Array.from(this.track.children);
    }
    
    updateDimensions() {
        this.itemWidth = this.items[0].offsetWidth + parseInt(getComputedStyle(this.items[0]).marginRight);
        this.totalWidth = this.itemWidth * this.items.length;
        this.singleSetWidth = this.totalWidth / 3;
    }
    
    addEventListeners() {
        // Mouse events
        this.slider.addEventListener('mousedown', this.dragStart.bind(this));
        this.slider.addEventListener('mouseup', this.dragEnd.bind(this));
        this.slider.addEventListener('mouseleave', this.dragEnd.bind(this));
        this.slider.addEventListener('mousemove', this.drag.bind(this));
        
        // Touch events
        this.slider.addEventListener('touchstart', this.dragStart.bind(this));
        this.slider.addEventListener('touchend', this.dragEnd.bind(this));
        this.slider.addEventListener('touchmove', this.drag.bind(this));
        
        // Empêcher le comportement par défaut du drag
        this.slider.addEventListener('dragstart', (e) => e.preventDefault());
        
        // Pause au survol
        this.slider.addEventListener('mouseenter', () => {
            this.isAutoScrolling = false;
        });
        
        this.slider.addEventListener('mouseleave', () => {
            if (!this.isDragging) {
                this.isAutoScrolling = true;
            }
        });
        
        // Recalculer les dimensions au resize
        window.addEventListener('resize', () => {
            this.updateDimensions();
        });
    }
    
    dragStart(event) {
        this.isDragging = true;
        this.isAutoScrolling = false;
        this.startPos = this.getPositionX(event);
        this.slider.style.cursor = 'grabbing';
        
        // Désactiver la sélection de texte
        this.slider.style.userSelect = 'none';
    }
    
    drag(event) {
        if (!this.isDragging) return;
        
        const currentPosition = this.getPositionX(event);
        const diff = currentPosition - this.startPos;
        this.currentTranslate = this.prevTranslate + diff;
    }
    
    dragEnd() {
        this.isDragging = false;
        this.prevTranslate = this.currentTranslate;
        this.slider.style.cursor = 'grab';
        this.slider.style.userSelect = '';
        
        // Réactiver le défilement auto après un court délai
        setTimeout(() => {
            if (!this.isDragging) {
                this.isAutoScrolling = true;
            }
        }, 1000);
    }
    
    getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
    
    animate() {
        if (!this.isDragging && this.isAutoScrolling) {
            this.currentTranslate -= this.autoScrollSpeed;
            this.prevTranslate = this.currentTranslate;
        }
        
        // Réinitialiser la position quand on atteint la fin du premier set
        if (Math.abs(this.currentTranslate) >= this.singleSetWidth) {
            this.currentTranslate = this.currentTranslate % this.singleSetWidth;
            this.prevTranslate = this.currentTranslate;
        }
        
        // Réinitialiser la position si on va trop à droite (drag vers la droite)
        if (this.currentTranslate > 0) {
            this.currentTranslate = -this.singleSetWidth + (this.currentTranslate % this.singleSetWidth);
            this.prevTranslate = this.currentTranslate;
        }
        
        this.setSliderPosition();
        requestAnimationFrame(() => this.animate());
    }
    
    setSliderPosition() {
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    }
}

// Initialiser le slider quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    const sliderElement = document.getElementById('infiniteSlider');
    if (sliderElement) {
        new InfiniteSlider(sliderElement);
    }
});



