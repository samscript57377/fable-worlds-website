(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const header = document.getElementById('site-header');
    const setHeaderState = () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    };
    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });

    const heroBg = document.querySelector('.hero-bg');
    const logoStage = document.querySelector('.logo-stage');
    const home = document.getElementById('home');

    const logoMotion = { parallaxY: 0, tiltX: 0, tiltY: 0 };
    const applyLogoTransform = () => {
        if (!logoStage) return;
        logoStage.style.transform =
            `translateY(${logoMotion.parallaxY}px) rotateX(${logoMotion.tiltX}deg) rotateY(${logoMotion.tiltY}deg)`;
    };

    if (!prefersReduced && heroBg) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                heroBg.style.transform = `scale(1.08) translateY(${y * 0.18}px)`;
                logoMotion.parallaxY = y * -0.08;
                applyLogoTransform();
            }
        }, { passive: true });
    }

    if (!prefersReduced && window.matchMedia('(pointer: fine)').matches && logoStage) {
        home.addEventListener('mousemove', (e) => {
            const rect = home.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width - 0.5;
            const relY = (e.clientY - rect.top) / rect.height - 0.5;
            logoMotion.tiltX = relY * -8;
            logoMotion.tiltY = relX * 8;
            applyLogoTransform();
        });
        home.addEventListener('mouseleave', () => {
            logoMotion.tiltX = 0;
            logoMotion.tiltY = 0;
            applyLogoTransform();
        });
    }

    const emberField = document.getElementById('embers');
    if (emberField && !prefersReduced) {
        const EMBER_COUNT = 22;
        for (let i = 0; i < EMBER_COUNT; i++) {
            const el = document.createElement('span');
            el.className = 'ember-particle';
            const size = 2 + Math.random() * 4;
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
            el.style.left = `${Math.random() * 100}%`;
            el.style.setProperty('--drift', `${(Math.random() - 0.5) * 120}px`);
            el.style.animationDuration = `${8 + Math.random() * 10}s`;
            el.style.animationDelay = `${Math.random() * 14}s`;
            emberField.appendChild(el);
        }
    }

    const revealTargets = document.querySelectorAll('.reveal-on-scroll');
    const featherDivider = document.querySelector('.feather-divider');

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealTargets.forEach((el) => io.observe(el));

        if (featherDivider) {
            const featherIO = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        featherDivider.classList.add('in-view');
                        featherIO.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });
            featherIO.observe(featherDivider);
        }
    } else {
        revealTargets.forEach((el) => el.classList.add('is-visible'));
        if (featherDivider) featherDivider.classList.add('in-view');
    }

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
            }
        });
    });
})();