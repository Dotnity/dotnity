/**
 * Dotnity - Modern Website JavaScript
 * Client-side functionality for static pages
 * Features: filtering, form validation, scroll animations, navbar effects
 */

// ================================================
// INITIALIZATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    initPortfolioFiltering();
    initSmoothScroll();
    initScrollAnimations();
    initFormValidation();
    initNavbarScroll();
    setActiveNavLink();
    initOffcanvasGuard();
    console.log('✓ Dotnity website initialized');
});

// Ensure offcanvas is never left open on desktop and closes on resize
function initOffcanvasGuard() {
    const offcanvasEl = document.querySelector('.offcanvas');

    function enforceClosed() {
        if (window.innerWidth >= 1024) {
            if (offcanvasEl) {
                if (typeof bootstrap !== 'undefined') {
                    try {
                        const bsOff = bootstrap.Offcanvas.getInstance(offcanvasEl) || new bootstrap.Offcanvas(offcanvasEl);
                        bsOff.hide();
                    } catch (e) {
                        offcanvasEl.classList.remove('show');
                        offcanvasEl.style.visibility = 'hidden';
                    }
                } else {
                    offcanvasEl.classList.remove('show');
                    offcanvasEl.style.visibility = 'hidden';
                }
            }
        }
    }

    enforceClosed();

    window.addEventListener('resize', () => {
        enforceClosed();
    });
}

// ================================================
// PORTFOLIO FILTERING (Work Page)
// ================================================

function initPortfolioFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('[data-category]');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedFilter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter and animate projects
            projectItems.forEach(item => {
                const categories = item.getAttribute('data-category').split(' ');
                const shouldShow = selectedFilter === 'all' || categories.includes(selectedFilter);

                if (shouldShow) {
                    item.style.display = 'block';
                    // Trigger reflow to restart animation
                    void item.offsetWidth;
                    item.style.animation = 'fadeIn 0.5s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ================================================
// SMOOTH SCROLL BEHAVIOR
// ================================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ================================================
// NAVBAR SCROLL EFFECT
// ================================================

function initNavbarScroll() {
    const navbar = document.querySelector('nav.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // Active link styling
    window.addEventListener('scroll', updateActiveNavLink);
}

// ================================================
// SCROLL REVEAL ANIMATIONS
// ================================================

function initScrollAnimations() {
    // Use Intersection Observer API for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const elementsToAnimate = document.querySelectorAll(
        '.card, [data-category], .feature-item, .social-link'
    );

    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(element);
    });
}

// ================================================
// FORM VALIDATION & HANDLING
// ================================================

function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Form validation
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const requiredFields = this.querySelectorAll('[required]');
        let isValid = true;
        const formData = {};

        requiredFields.forEach(field => {
            const value = field.value.trim();
            if (!value) {
                isValid = false;
                setFieldError(field, true);
            } else {
                setFieldError(field, false);
                formData[field.name] = value;
            }
        });

        if (isValid) {
            handleFormSubmit(contactForm);
        }
    });

    // Remove error class on input
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('focus', function() {
            setFieldError(this, false);
        });

        field.addEventListener('change', function() {
            if (this.hasAttribute('required') && this.value.trim()) {
                setFieldError(this, false);
            }
        });
    });
}

function setFieldError(field, hasError) {
    if (hasError) {
        field.style.borderColor = 'var(--color-error)';
        field.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
    } else {
        field.style.borderColor = 'var(--color-gray-300)';
        field.style.backgroundColor = 'var(--color-white)';
    }
}

function handleFormSubmit(form) {
    // Since this is a static site, show success message
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="bi bi-check-circle"></i> Sending...';

    // Simulate sending (in a real app, this would send data to a server)
    setTimeout(() => {
        submitButton.innerHTML = '<i class="bi bi-check-circle"></i> Message Sent!';
        submitButton.style.backgroundColor = 'var(--color-success)';

        // Show success notification
        showNotification('Thank you! We\'ll get back to you soon.', 'success');

        // Reset form
        setTimeout(() => {
            form.reset();
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
            submitButton.style.backgroundColor = '';
        }, 2000);
    }, 1500);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--color-success)' : 'var(--color-info)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ================================================
// ACTIVE NAVIGATION LINK
// ================================================

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('a.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const isActive = (href === currentPage) || (currentPage === '' && href === 'index.html');

        if (isActive) {
            link.style.color = 'var(--color-primary)';
        } else {
            link.style.color = '';
        }
    });
}

// ================================================
// MOBILE MENU CLOSE
// ================================================

function initMobileMenuClose() {
    // Bootstrap offcanvas links will auto-close via Bootstrap JS; no custom mobile panel handling required
}

// Mobile panel toggle (custom implementation)
function initMobilePanelToggle() {
    // Replaced by Bootstrap's collapse/offcanvas behavior; custom panel toggle removed.
}

// ================================================
// BACK TO TOP BUTTON
// ================================================

function initBackToTop() {
    const backToTopBtn = document.createElement('a');
    backToTopBtn.id = 'back-to-top';
    backToTopBtn.href = '#';
    backToTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
        color: white;
        border-radius: 50%;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        z-index: 999;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        transition: all var(--transition-fast);
    `;

    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    backToTopBtn.addEventListener('mouseenter', () => {
        backToTopBtn.style.transform = 'translateY(-5px)';
    });

    backToTopBtn.addEventListener('mouseleave', () => {
        backToTopBtn.style.transform = 'translateY(0)';
    });
}

// Initialize back to top button when page has enough content
if (document.body.scrollHeight > window.innerHeight * 2) {
    initBackToTop();
}

// ================================================
// PAGE LOAD ANIMATION
// ================================================

window.addEventListener('load', () => {
    document.body.style.animation = 'fadeIn 0.5s ease-out';
});

// ================================================
// UTILITY: Check for reduced motion preference
// ================================================

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Respect user's motion preferences
if (prefersReducedMotion()) {
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-normal', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
}

// ================================================
// DEBUG & MONITORING
// ================================================

// Performance monitoring
window.addEventListener('load', () => {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`✓ Page fully loaded in ${pageLoadTime}ms`);
    }
});

// Console branding
console.log('%c🚀 Dotnity', 'font-size: 20px; font-weight: bold; color: #6a0dad;');
console.log('%cBuilding beautiful, scalable web solutions', 'color: #9b5de5; font-size: 14px;');
