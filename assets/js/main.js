// ============================================
// NAVIGATION
// ============================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
navToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Animate burger icon
    const spans = navToggle.querySelectorAll('span');
    if (navToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu?.classList.remove('active');
        navToggle?.classList.remove('active');
        
        // Reset burger icon
        const spans = navToggle?.querySelectorAll('span');
        spans?.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
        });
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navbar?.contains(e.target) && navMenu?.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle?.classList.remove('active');
        
        const spans = navToggle?.querySelectorAll('span');
        spans?.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
        });
    }
});

// ============================================
// DROPDOWN MENU
// ============================================
// Sur mobile, le dropdown est toujours visible, donc pas besoin de toggle
// Sur desktop, le dropdown fonctionne au survol (via CSS)

// Fermer le menu mobile quand on clique sur un lien du dropdown
document.querySelectorAll('.dropdown-link').forEach(link => {
    link.addEventListener('click', () => {
        // Fermer le menu mobile
        navMenu?.classList.remove('active');
        navToggle?.classList.remove('active');
        
        // Reset burger icon
        const spans = navToggle?.querySelectorAll('span');
        spans?.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
        });
    });
});

// Sur mobile, empêcher le comportement par défaut du lien "Formules" pour éviter la navigation
const navDropdown = document.querySelector('.nav-dropdown');
const dropdownToggle = navDropdown?.querySelector('.nav-link');

if (window.innerWidth <= 1000 && dropdownToggle) {
    dropdownToggle.addEventListener('click', (e) => {
        // Sur mobile, on ne veut pas naviguer vers #formules, juste afficher les liens
        // Les liens sont déjà visibles grâce au CSS, donc on peut laisser le comportement par défaut
        // ou empêcher la navigation si on veut garder le menu ouvert
        // Pour l'instant, on laisse le comportement par défaut pour permettre la navigation
    });
}

// ============================================
// SCROLL EFFECTS
// ============================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class to navbar
    if (currentScroll > 50) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#"
        if (href === '#') return;
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 140; // Account for fixed navbar + reservation banner
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// INTERSECTION OBSERVER - FADE IN ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px 100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Stop observing after animation
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
const animateOnScroll = document.querySelectorAll(`
    .activity-card,
    .pricing-card,
    .evg-card,
    .package-category,
    .contact-item,
    .contact-cta
`);

animateOnScroll.forEach((el, index) => {
    // Set initial state
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.3s ease-out ${index * 0.03}s, transform 0.3s ease-out ${index * 0.03}s`;
    
    // Start observing
    observer.observe(el);
});

// ============================================
// ACTIVE NAVIGATION LINK
// ============================================
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ============================================
// PRICING CARD HOVER EFFECTS
// ============================================
const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        // Add subtle scale effect
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    card.addEventListener('mousemove', function(e) {
        // Subtle tilt effect on hover
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.style.transform = `translateY(-5px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// ============================================
// ACTIVITY CARDS STAGGER ANIMATION
// ============================================
const activityCards = document.querySelectorAll('.activity-card');

const activityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 40);
            
            activityObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

activityCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    activityObserver.observe(card);
});

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================
function updateScrollProgress() {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    
    // Create progress bar if it doesn't exist
    let progressBar = document.getElementById('scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: ${scrolled}%;
            height: 3px;
            background: linear-gradient(90deg, #0089ff, #e51a21);
            z-index: 9999;
            transition: width 0.1s ease;
            pointer-events: none;
            box-shadow: 0 0 10px rgba(0, 137, 255, 0.6);
        `;
        document.body.appendChild(progressBar);
    }
    
    progressBar.style.width = `${scrolled}%`;
}

window.addEventListener('scroll', updateScrollProgress);
updateScrollProgress();

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            top: ${y}px;
            left: ${x}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to stylesheet
if (!document.getElementById('ripple-animation')) {
    const style = document.createElement('style');
    style.id = 'ripple-animation';
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// PARALLAX EFFECT ON HERO
// ============================================
const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    
    if (heroContent && scrolled < hero?.offsetHeight) {
        heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        heroContent.style.opacity = 1 - (scrolled / 800);
    }
});

// ============================================
// LAZY LOADING FOR FUTURE IMAGES
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// HANDLE EXTERNAL LINKS
// ============================================
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.setAttribute('rel', 'noopener noreferrer');
});

// ============================================
// KEYBOARD NAVIGATION ACCESSIBILITY
// ============================================
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle?.classList.remove('active');
        
        const spans = navToggle?.querySelectorAll('span');
        spans?.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
        });
    }
});

// ============================================
// CONSOLE BRANDING
// ============================================
console.log(
    '%c🎯 Laser Game Gap',
    'color: #00D9FF; font-size: 24px; font-weight: bold; font-family: Orbitron, monospace;'
);
console.log(
    '%cPrêt pour une expérience inoubliable ?',
    'color: #94A3B8; font-size: 14px;'
);
console.log(
    '%c📞 07.81.54.76.91',
    'color: #FFD700; font-size: 16px; font-weight: bold;'
);

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Debounce function for scroll events
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

// Apply debounce to expensive scroll operations
const debouncedHighlightNav = debounce(highlightNavigation, 100);
window.addEventListener('scroll', debouncedHighlightNav);

// ============================================
// FLOATING CTA BUTTON
// ============================================
const floatingCta = document.getElementById('floatingCta');
let lastScrollForCta = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Show/hide floating CTA based on scroll
    if (currentScroll > 500) {
        floatingCta?.classList.add('visible');
    } else {
        floatingCta?.classList.remove('visible');
    }
    
    lastScrollForCta = currentScroll;
});

// Add visible class style
if (floatingCta && !document.getElementById('floating-cta-style')) {
    const style = document.createElement('style');
    style.id = 'floating-cta-style';
    style.textContent = `
        .floating-cta {
            opacity: 0;
            transform: translateY(100px) scale(0.8);
            pointer-events: none;
        }
        .floating-cta.visible {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: all;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// ACCORDION
// ============================================
const accordionButtons = document.querySelectorAll('.accordion-button');

accordionButtons.forEach(button => {
    button.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const isActive = this.classList.contains('active');
        
        // Close all accordions
        accordionButtons.forEach(btn => {
            btn.classList.remove('active');
            const btnContent = btn.nextElementSibling;
            if (btnContent) {
                btnContent.style.maxHeight = null;
                btnContent.classList.remove('active');
            }
        });
        
        // Open clicked accordion if it was closed
        if (!isActive && content) {
            this.classList.add('active');
            content.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
});

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initial navigation highlight
    highlightNavigation();
    
    // Log initialization
    console.log('%c✓ Site initialized successfully', 'color: #00D9FF; font-weight: bold;');
});
