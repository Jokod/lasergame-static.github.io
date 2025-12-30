/**
 * Gallery Carousel - Bootstrap 5.3
 * Gestion du carousel de la galerie photo
 */

(function() {
    'use strict';

    // Configuration du carousel
    const CAROUSEL_CONFIG = {
        interval: 3000,        // 3 secondes entre chaque slide
        wrap: true,            // Boucle infinie
        keyboard: true,        // Navigation au clavier
        pause: 'hover',        // Pause au survol
        touch: true,           // Activation du balayage tactile
        ride: 'carousel'       // Démarrage automatique
    };

    // Sélecteurs
    const SELECTORS = {
        carousel: '#galleryCarousel',
        indicators: '#galleryCarousel .carousel-indicators [data-bs-target]',
        controls: {
            prev: '#galleryCarousel .carousel-control-prev',
            next: '#galleryCarousel .carousel-control-next'
        }
    };

    /**
     * Initialise le carousel Bootstrap
     */
    function initCarousel() {
        const carouselElement = document.querySelector(SELECTORS.carousel);
        
        if (!carouselElement) {
            console.warn('Gallery Carousel: Élément carousel introuvable');
            return null;
        }

        // Vérifier que Bootstrap est disponible
        if (typeof bootstrap === 'undefined' || !bootstrap.Carousel) {
            console.error('Gallery Carousel: Bootstrap 5.3 est requis');
            return null;
        }

        // Détruire l'instance existante si elle existe
        const existingInstance = bootstrap.Carousel.getInstance(carouselElement);
        if (existingInstance) {
            existingInstance.dispose();
        }

        // Créer une nouvelle instance
        try {
            const carousel = new bootstrap.Carousel(carouselElement, CAROUSEL_CONFIG);
            
            // Événements personnalisés
            setupCarouselEvents(carouselElement, carousel);
            
            console.log('Gallery Carousel: Initialisé avec succès');
            return carousel;
        } catch (error) {
            console.error('Gallery Carousel: Erreur lors de l\'initialisation', error);
            return null;
        }
    }

    /**
     * Configure les événements personnalisés du carousel
     */
    function setupCarouselEvents(element, carousel) {
        // Événement slide changé
        element.addEventListener('slid.bs.carousel', function(event) {
            const activeIndex = event.to;
            updateActiveIndicator(activeIndex);
            
            // Optimisation: précharger l'image suivante
            preloadNextImage(activeIndex);
        });

        // Événement slide en cours de changement
        element.addEventListener('slide.bs.carousel', function(event) {
            // Animation personnalisée si nécessaire
            handleSlideTransition(event);
        });

        // Pause au survol (amélioration UX)
        element.addEventListener('mouseenter', function() {
            if (carousel && carousel._config.pause === 'hover') {
                carousel.pause();
            }
        });

        element.addEventListener('mouseleave', function() {
            if (carousel && carousel._config.pause === 'hover') {
                carousel.cycle();
            }
        });
    }

    /**
     * Met à jour l'indicateur actif
     */
    function updateActiveIndicator(activeIndex) {
        const indicators = document.querySelectorAll(SELECTORS.indicators);
        indicators.forEach((indicator, index) => {
            if (index === activeIndex) {
                indicator.classList.add('active');
                indicator.setAttribute('aria-current', 'true');
            } else {
                indicator.classList.remove('active');
                indicator.removeAttribute('aria-current');
            }
        });
    }

    /**
     * Précharge l'image suivante pour améliorer les performances
     */
    function preloadNextImage(currentIndex) {
        const items = document.querySelectorAll('#galleryCarousel .carousel-item');
        const nextIndex = (currentIndex + 1) % items.length;
        const nextItem = items[nextIndex];
        
        if (nextItem) {
            const img = nextItem.querySelector('img');
            if (img && !img.complete) {
                // Précharger l'image
                const preloadImg = new Image();
                preloadImg.src = img.src;
            }
        }
    }

    /**
     * Gère la transition entre les slides
     */
    function handleSlideTransition(event) {
        const currentItem = event.relatedTarget;
        const nextItem = event.target.querySelector('.carousel-item.active');
        
        // Ajouter une classe pour les animations personnalisées
        if (currentItem) {
            currentItem.classList.add('transitioning');
        }
        if (nextItem) {
            nextItem.classList.add('transitioning');
        }
    }

    /**
     * Améliore l'accessibilité du carousel
     */
    function enhanceAccessibility() {
        const carousel = document.querySelector(SELECTORS.carousel);
        if (!carousel) return;

        // Ajouter des attributs ARIA manquants
        const indicators = document.querySelectorAll(SELECTORS.indicators);
        indicators.forEach((indicator, index) => {
            if (!indicator.getAttribute('aria-label')) {
                indicator.setAttribute('aria-label', `Aller à la slide ${index + 1}`);
            }
        });

        // Améliorer les contrôles
        const prevControl = document.querySelector(SELECTORS.controls.prev);
        const nextControl = document.querySelector(SELECTORS.controls.next);
        
        if (prevControl && !prevControl.getAttribute('aria-label')) {
            prevControl.setAttribute('aria-label', 'Slide précédent');
        }
        
        if (nextControl && !nextControl.getAttribute('aria-label')) {
            nextControl.setAttribute('aria-label', 'Slide suivant');
        }
    }

    /**
     * Initialisation au chargement du DOM
     */
    function init() {
        // Attendre que le DOM soit complètement chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initCarousel();
                enhanceAccessibility();
            });
        } else {
            // DOM déjà chargé
            initCarousel();
            enhanceAccessibility();
        }
    }

    // Démarrer l'initialisation
    init();

})();
