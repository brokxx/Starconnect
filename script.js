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
        menu.querySelectorAll('.sub-open').forEach(function(el) {
            el.classList.remove('sub-open');
        });
    }

    // Hamburger toggle
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (menu.classList.contains('open')) {
            closeNav();
        } else {
            openNav();
        }
    });

    // Close on overlay tap
    overlay.addEventListener('click', closeNav);

    // ONLY intercept lang-toggle (globe icon). Everything else navigates naturally.
    // The nav auto-resets to closed state on each new page load.
    var langToggle = menu.querySelector('.lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var parent = langToggle.parentElement;
            parent.classList.toggle('sub-open');
        });
    }

    // Reset on resize to desktop
    window.addEventListener('resize', function() {
        if (!isMobile()) {
            closeNav();
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

    var delay = 2400;
    var fallback = 4500;

    if (document.readyState === 'complete') {
        setTimeout(hide, delay);
    } else {
        window.addEventListener('load', function() {
            setTimeout(hide, delay);
        });
        // Safety fallback if load never fires
        setTimeout(hide, fallback);
    }
})();

// ===== MOBILE PACKAGES ACCORDION =====
(function() {
    var cards = document.querySelectorAll('.package-grid .package-card');
    if (!cards.length) return;

    function isMobile() { return window.innerWidth <= 778; }

    cards.forEach(function(card, idx) {
        card.addEventListener('click', function(e) {
            if (!isMobile()) return;
            // Don't toggle if a link inside was clicked
            if (e.target.closest('a')) return;
            card.classList.toggle('pkg-open');
        });
    });

    function openAll() {
        if (!isMobile()) return;
        cards.forEach(function(c) { c.classList.add('pkg-open'); });
    }

    openAll();
    // Re-open on bfcache restore (back/forward navigation)
    window.addEventListener('pageshow', openAll);
})();

// ===== MOBILE LANG SWITCHER =====
(function() {
    var wrapper = document.querySelector('.mobile-lang');
    if (!wrapper) return;
    var btn = wrapper.querySelector('.mobile-lang-btn');
    var current = wrapper.querySelector('.mobile-lang-current');

    // Toggle dropdown
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!wrapper.contains(e.target)) {
            wrapper.classList.remove('open');
        }
    });

    // Close on selection (i18n.js handles language change)
    wrapper.querySelectorAll('.lang-option').forEach(function(opt) {
        opt.addEventListener('click', function() {
            setTimeout(function() { wrapper.classList.remove('open'); }, 50);
        });
    });

    // Update current label based on stored language
    function updateLabel() {
        var lang = (localStorage.getItem('starconnect_lang') || 'en').toUpperCase();
        if (current) current.textContent = lang;
    }
    updateLabel();
    // Re-run after a short delay for when i18n sets the lang
    setTimeout(updateLabel, 100);
    // Listen to storage changes
    window.addEventListener('storage', updateLabel);
})();

// ===== SHINY TEXT (section titles) =====
(function() {
    var selectors = [
        '.section-title',
        '.starlink-hero-title',
        '.package-showcase-title',
        '.careers-slogan .grad',
        '.hero-content h1'
    ];
    selectors.forEach(function(sel) {
        document.querySelectorAll(sel).forEach(function(el) {
            el.classList.add('shiny-text');
        });
    });
})();

// ===== BORDER GLOW (package cards + showcase panels) =====
(function() {
    var cards = document.querySelectorAll('.package-card, .package-showcase-visual');
    if (!cards.length) return;
    // Skip on touch devices
    if (!window.matchMedia('(hover: hover)').matches) return;

    function getCenter(el) {
        var r = el.getBoundingClientRect();
        return [r.width / 2, r.height / 2];
    }

    function getEdgeProximity(el, x, y) {
        var c = getCenter(el);
        var dx = x - c[0];
        var dy = y - c[1];
        var kx = dx !== 0 ? c[0] / Math.abs(dx) : Infinity;
        var ky = dy !== 0 ? c[1] / Math.abs(dy) : Infinity;
        return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    }

    function getCursorAngle(el, x, y) {
        var c = getCenter(el);
        var dx = x - c[0];
        var dy = y - c[1];
        if (dx === 0 && dy === 0) return 0;
        var deg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        return deg < 0 ? deg + 360 : deg;
    }

    cards.forEach(function(card) {
        card.addEventListener('pointermove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var edge = getEdgeProximity(card, x, y);
            var angle = getCursorAngle(card, x, y);
            card.style.setProperty('--edge-proximity', (edge * 100).toFixed(2));
            card.style.setProperty('--cursor-angle', angle.toFixed(2) + 'deg');
        });
    });
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

// ===== HERO PARALLAX (home only, desktop only) =====
(function() {
    if (!document.body.classList.contains('home')) return;
    // Disable on mobile/tablet: scroll listener and per-frame transforms
    // tank performance and aren't worth it on touch devices.
    if (window.innerWidth < 779) return;
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
