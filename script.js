/**
 * Manathos.com - Main JavaScript
 * Handles dynamic scrolling behavior, interaction observers, and UI flair.
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Navigation Scrolled State
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Intersection Observer for Scroll Animations
    // This looks for elements with .reveal-* classes and adds an .in-view class when they appear

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before the element enters
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the animation class
                entry.target.classList.add('in-view');
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to reveal
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-flip');
    revealElements.forEach(el => scrollObserver.observe(el));

    // 3. Optional: Add parity for mobile touch interactions on 3D cards
    // The CSS handles hover/focus flips, but we can ensure touch devices toggle states cleanly
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('click', function () {
            // For mobile flow: clicking toggles focus state which CSS handles
            this.focus();
        });
    });

    // 4. Parallax effect on mouse move for background orbs (subtle)
    const orbs = document.querySelectorAll('.glow-orb');

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const moveX = (x * speed) - (speed / 2);
            const moveY = (y * speed) - (speed / 2);

            // Apply slight transform alongside the looping CSS animation
            orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    // 5. Custom Cursor Logic
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    // Check if cursor elements exist (they won't on mobile view if CSS hides them, but good practice)
    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Direct mapping for the dot for instantaneous feel
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Animate the outline slightly slower for a dragging/smooth effect
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover expanding effect to all clickable elements
        const clickables = document.querySelectorAll('a, button, .project-card');

        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hovering');
                cursorOutline.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hovering');
                cursorOutline.classList.remove('hovering');
            });
        });
    }

    // 6. Media Carousel Logic (Phase 3.5)
    const carouselTrack = document.querySelector('.carousel-track');

    if (carouselTrack) {
        const slides = Array.from(carouselTrack.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const dotsNav = document.querySelector('.carousel-dots');
        const dots = Array.from(dotsNav.children);

        let currentIndex = 0;
        let autoPlayInterval;

        const updateCarousel = (index) => {
            // Remove active classes
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            // Add active class to current
            slides[index].classList.add('active');
            dots[index].classList.add('active');

            // Calculate transform to center the active slide
            // Slides are 80% wide with 10% margins. 
            // Sliding left by 100% moves exactly one slide width + margins.
            const slideWidth = slides[index].getBoundingClientRect().width;

            // Slide displacement
            carouselTrack.style.transform = `translateX(-${index * 100}%)`;
        };

        const moveToNextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel(currentIndex);
        };

        const moveToPrevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel(currentIndex);
        };

        // Event Listeners for buttons
        nextButton.addEventListener('click', () => {
            moveToNextSlide();
            resetAutoPlay();
        });

        prevButton.addEventListener('click', () => {
            moveToPrevSlide();
            resetAutoPlay();
        });

        // Event Listeners for dots
        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('.dot');
            if (!targetDot) return;

            const targetIndex = dots.findIndex(dot => dot === targetDot);
            currentIndex = targetIndex;
            updateCarousel(currentIndex);
            resetAutoPlay();
        });

        // Optional: Auto-play functionality
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(moveToNextSlide, 4000); // 4 seconds
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        const resetAutoPlay = () => {
            stopAutoPlay();
            startAutoPlay();
        };

        // Pause on hover
        const carouselContainer = document.querySelector('.carousel-container');
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);

        // Initialize display
        updateCarousel(currentIndex);
        startAutoPlay();
    }

    // 7. Back to Top Button Logic (Phase 5)
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
                // Remove hovering class if the button disappears while cursor is on it
                if (cursorDot && cursorOutline) {
                    cursorDot.classList.remove('hovering');
                    cursorOutline.classList.remove('hovering');
                }
            }
        });

        // Smooth scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Add to the custom cursor logic if active
        if (cursorDot && cursorOutline) {
            backToTopBtn.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hovering');
                cursorOutline.classList.add('hovering');
            });
            backToTopBtn.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hovering');
                cursorOutline.classList.remove('hovering');
            });
        }
    }

});
