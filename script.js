// ===== HERO SLIDER =====
(function() {
    var slides = document.querySelectorAll('.slide');
    var dots = document.querySelectorAll('.dot');
    var prevBtn = document.querySelector('.slider-arrow.prev');
    var nextBtn = document.querySelector('.slider-arrow.next');
    if (!slides.length) return;

    var current = 0;
    var autoPlay;

    function goTo(index) {
        slides[current].classList.remove('active');
        if (dots[current]) dots[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        if (dots[current]) dots[current].classList.add('active');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoPlay() {
        autoPlay = setInterval(next, 3000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlay);
        startAutoPlay();
    }

    if (prevBtn) prevBtn.addEventListener('click', function() { prev(); resetAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { next(); resetAutoPlay(); });

    dots.forEach(function(dot, i) {
        dot.addEventListener('click', function() { goTo(i); resetAutoPlay(); });
    });

    // Touch swipe
    var touchStartX = 0;
    var slider = document.querySelector('.hero-slider');
    if (slider) {
        slider.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        slider.addEventListener('touchend', function(e) {
            var diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? next() : prev();
                resetAutoPlay();
            }
        });
    }

    startAutoPlay();
})();

// ===== MOBILE SIDE NAV =====
(function() {
    var toggle = document.querySelector('.mobile-toggle');
    var menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    // Create overlay
    var overlay = document.createElement('div');
    overlay.className = 'sidenav-overlay';
    document.body.appendChild(overlay);

    function isMobile() {
        return window.innerWidth <= 778;
    }

    function openNav() {
        menu.classList.add('open');
        toggle.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        menu.classList.remove('open');
        toggle.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Hamburger toggle
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        menu.classList.contains('open') ? closeNav() : openNav();
    });

    // Close on overlay tap
    overlay.addEventListener('click', closeNav);

    // Dropdown parents: toggle sub-menu on mobile, allow navigation on desktop
    var dropdownLinks = menu.querySelectorAll('.has-dropdown > a');
    dropdownLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            if (!isMobile()) return; // desktop: let the link navigate normally

            e.preventDefault();
            var parent = this.parentElement;

            // Close other open submenus
            menu.querySelectorAll('.has-dropdown.sub-open').forEach(function(el) {
                if (el !== parent) el.classList.remove('sub-open');
            });

            parent.classList.toggle('sub-open');
        });
    });

    // Sub-links & normal links: close nav on mobile after click
    menu.querySelectorAll('.dropdown a, .nav-menu > li:not(.has-dropdown) > a').forEach(function(link) {
        link.addEventListener('click', function() {
            if (isMobile()) {
                closeNav();
            }
        });
    });

    // Reset on resize to desktop
    window.addEventListener('resize', function() {
        if (!isMobile()) {
            closeNav();
            menu.querySelectorAll('.sub-open').forEach(function(el) {
                el.classList.remove('sub-open');
            });
        }
    });
})();

// ===== HIGHLIGHT TABS =====
(function() {
    var tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            tab.classList.add('active');
        });
    });
})();

// ===== HEADER SCROLL EFFECT (home page only) =====
(function() {
    if (!document.body.classList.contains('home')) return;
    var header = document.querySelector('.main-header');
    if (!header) return;

    // Show header after a tiny scroll (50px)
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
})();

// ===== PRELOADER (home only) =====
(function() {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Lock scroll while preloader is visible
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Total animation: ~2.6s. Hide at 2.4s, remove at 3.0s.
    function hide() {
        preloader.classList.add('preloader-hide');
        setTimeout(function() {
            preloader.classList.add('preloader-removed');
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        }, 700);
    }

    if (document.readyState === 'complete') {
        setTimeout(hide, 2400);
    } else {
        window.addEventListener('load', function() {
            setTimeout(hide, 2400);
        });
        // Safety fallback if load never fires
        setTimeout(hide, 4500);
    }
})();

// ===== SCROLL REVEAL ANIMATIONS =====
(function() {
    // Elements that reveal themselves (single element animations)
    var singleSelectors = [
        '.section-title',
        '.section-title-left',
        '.section-lead',
        '.promise-content',
        '.visual-block',
        '.comparison-wrapper',
        '.careers-slogan',
        '.tender-notes',
        '.tender-contact',
        '.contact-grid',
        '.service-block',
        '.about-text',
        '.about-image',
        '.package-showcase-visual',
        '.package-showcase-content'
    ];

    // Grids whose children should reveal in sequence (staggered)
    var staggerSelectors = [
        '.package-grid',
        '.pillars-grid',
        '.stats-row',
        '.posts-grid',
        '.hero-stats',
        '.hero-ctas',
        '.timeline'
    ];

    function addClass(el, cls) { el.classList.add(cls); }

    singleSelectors.forEach(function(sel) {
        document.querySelectorAll(sel).forEach(function(el) {
            addClass(el, 'reveal');
        });
    });

    staggerSelectors.forEach(function(sel) {
        document.querySelectorAll(sel).forEach(function(el) {
            addClass(el, 'reveal-stagger');
        });
    });

    // Hero content should be visible immediately (no reveal on load)
    var heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.querySelectorAll('.reveal, .reveal-stagger').forEach(function(el) {
            el.classList.remove('reveal', 'reveal-stagger');
        });
    }

    // Intersection Observer
    if (!('IntersectionObserver' in window)) {
        // Fallback: show everything
        document.querySelectorAll('.reveal, .reveal-stagger').forEach(function(el) {
            el.classList.add('is-visible');
        });
        return;
    }

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.12
    });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function(el) {
        observer.observe(el);
    });
})();

// ===== HERO PARALLAX (home only) =====
(function() {
    if (!document.body.classList.contains('home')) return;
    var slide = document.querySelector('.hero-slider .slide');
    var heroContent = document.querySelector('.hero-content');
    if (!slide) return;

    var ticking = false;
    function updateParallax() {
        var y = window.scrollY;
        var translate = Math.min(y * 0.35, 200);
        slide.style.transform = 'translate3d(0, ' + translate + 'px, 0)';
        if (heroContent) {
            heroContent.style.opacity = Math.max(1 - y / 500, 0);
            heroContent.style.transform = 'translate3d(0, ' + (y * 0.2) + 'px, 0)';
        }
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
})();
