/* =========================================================
   ANUBHAV — CREATIVE PORTFOLIO
   FINAL CLEAN JAVASCRIPT

   - Fast loader that does not wait for below-the-fold media
   - Existing HTML/grid/layout preserved
   - Category filters fixed
   - Image/video descriptions in lightboxes
   - Motion + Social autoplay
   - Image + video lightboxes
   - Scroll reveal + existing interactions
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const loader = document.getElementById("loader");
    const loadingBar = document.getElementById("loadingBar");
    const loadingNumber = document.getElementById("loadingNumber");

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.querySelector(".theme-icon");

    const menuButton = document.getElementById("menuButton");
    const nav = document.getElementById("nav");

    const character = document.querySelector(".character-card");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const scrollProgress = document.getElementById("scrollProgress");
    const cursorGlow = document.getElementById("cursorGlow");
    let scrollFrame = 0;

    function updateScrollProgress() {

        if (!scrollProgress) {
            return;
        }

        const documentHeight =
            document.documentElement.scrollHeight - window.innerHeight;
        const progress = documentHeight > 0
            ? (window.scrollY / documentHeight) * 100
            : 0;

        scrollProgress.style.setProperty(
            "--scroll-progress",
            `${Math.min(100, Math.max(0, progress))}%`
        );
    }

    function requestScrollUpdate() {

        if (scrollFrame) {
            return;
        }

        scrollFrame = requestAnimationFrame(() => {
            scrollFrame = 0;
            updateScrollProgress();

            if (!reducedMotion && cursorGlow) {
                document.addEventListener("pointermove", event => {
                    if (event.pointerType !== "mouse") return;
                    cursorGlow.style.setProperty("--cursor-x", `${event.clientX}px`);
                    cursorGlow.style.setProperty("--cursor-y", `${event.clientY}px`);
                }, { passive: true });
            }
        });
    }

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate, { passive: true });
    updateScrollProgress();


    /* =====================================================
       PAGE LOADER — MINIMUM 2 SECONDS
    ===================================================== */

    body.classList.add("loading");

    let progress = 0;
    let loaderFinished = false;

    const loaderStartTime = Date.now();

    const loadingInterval = setInterval(() => {

        if (progress >= 100) {
            clearInterval(loadingInterval);
            return;
        }

        if (progress < 65) {
            progress += Math.random() * 1.8;
        } else if (progress < 85) {
            progress += Math.random() * 0.9;
        } else if (progress < 95) {
            progress += Math.random() * 0.45;
        } else {
            progress += 0.2;
        }

        progress = Math.min(progress, 100);

        if (loadingBar) {
            loadingBar.style.width = `${progress}%`;
        }

        if (loadingNumber) {
            loadingNumber.textContent = `${Math.floor(progress)}%`;
        }

    }, 50);


    function hideLoader() {

        if (loaderFinished) {
            return;
        }

        loaderFinished = true;
        clearInterval(loadingInterval);

        if (loadingBar) {
            loadingBar.style.width = "100%";
        }

        if (loadingNumber) {
            loadingNumber.textContent = "100%";
        }

        setTimeout(() => {

            if (loader) {
                loader.classList.add("hide");
            }

            body.classList.remove("loading");

        }, 350);

    }


    function finishLoader() {

        const elapsed = Date.now() - loaderStartTime;
        const remaining = Math.max(0, 600 - elapsed);

        setTimeout(hideLoader, remaining);

    }


    // Do not wait for every portfolio asset before revealing the page.
    requestAnimationFrame(finishLoader);


    /* Absolute safety fallback — only if loading gets stuck. */
    setTimeout(() => {

        if (!loaderFinished) {
            hideLoader();
        }

    }, 4000);


    /* =====================================================
       DARK / LIGHT MODE
    ===================================================== */

    function setTheme(theme) {

        const isDark = theme === "dark";

        body.classList.toggle("dark-mode", isDark);

        if (themeIcon) {
            themeIcon.textContent = isDark ? "☀" : "☾";
        }

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-pressed",
                String(isDark)
            );

            themeToggle.setAttribute(
                "aria-label",
                isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );
        }

        localStorage.setItem("portfolio-theme", theme);
    }


    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
    } else {

        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        setTheme(prefersDark ? "dark" : "light");
    }


    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            const isDark = body.classList.contains("dark-mode");
            setTheme(isDark ? "light" : "dark");

        });
    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    function closeMenu() {

        if (nav) {
            nav.classList.remove("mobile-open");
        }

        if (menuButton) {
            menuButton.classList.remove("open");
            menuButton.classList.remove("active");
            menuButton.setAttribute("aria-expanded", "false");
        }

        body.classList.remove("menu-open");
    }


    if (menuButton && nav) {

        menuButton.addEventListener("click", () => {

            const open = nav.classList.toggle("mobile-open");

            menuButton.classList.toggle("open", open);
            menuButton.classList.toggle("active", open);
            menuButton.setAttribute("aria-expanded", String(open));

            body.classList.toggle("menu-open", open);

        });

    }


    if (nav) {

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

    }


    window.addEventListener("resize", () => {

        if (window.innerWidth > 800) {
            closeMenu();
        }

    }, { passive: true });


    /* =====================================================
       HERO CHARACTER MOUSE MOTION
    ===================================================== */

    const desktopPointer = window.matchMedia(
        "(min-width: 901px) and (pointer: fine)"
    );

    if (character && !reducedMotion) {

        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        window.addEventListener("mousemove", event => {

            if (!desktopPointer.matches) {
                return;
            }

            targetX = (
                event.clientX / window.innerWidth - 0.5
            ) * 12;

            targetY = (
                event.clientY / window.innerHeight - 0.5
            ) * 8;

        }, { passive: true });


        function animateCharacter() {

            currentX += (targetX - currentX) * 0.06;
            currentY += (targetY - currentY) * 0.06;

            if (desktopPointer.matches) {
                character.style.transform =
                    `translate3d(${currentX}px, ${currentY}px, 0)`;
            }

            requestAnimationFrame(animateCharacter);
        }

        animateCharacter();
    }


    /* =====================================================
       SERVICE → PORTFOLIO SCROLL
       Existing IDs preserved.
    ===================================================== */

    function connectService(serviceId, portfolioId) {

        const service = document.getElementById(serviceId);
        const portfolio = document.getElementById(portfolioId);

        if (!service || !portfolio) {
            return;
        }

        service.style.cursor = "pointer";

        service.addEventListener("click", event => {

            event.preventDefault();

            portfolio.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start"
            });

        });
    }


    connectService("posterService", "posterPortfolio");
    connectService("logoService", "logoPortfolio");
    connectService("magazineService", "magazinePortfolio");
    connectService("brandCampaignService", "brandCampaignPortfolio");
    connectService("motionService", "motionPortfolio");
    connectService("socialMediaService", "socialPortfolio");


    /* =====================================================
       CATEGORY FILTERS
       Poster / Logo / Motion
    ===================================================== */

    function setupFilter(filterSelector, itemSelector) {

        const filters = document.querySelectorAll(filterSelector);
        const items = document.querySelectorAll(itemSelector);

        if (!filters.length || !items.length) {
            return;
        }

        filters.forEach(filter => {

            filter.addEventListener("click", () => {

                const category = filter.dataset.filter || "all";

                filters.forEach(button => {
                    button.classList.toggle(
                        "active",
                        button === filter
                    );
                });

                items.forEach(item => {

                    const itemCategory =
                        item.dataset.category || "";

                    const shouldShow =
                        category === "all" ||
                        category === itemCategory;

                    item.classList.toggle(
                        "hidden",
                        !shouldShow
                    );

                    if (shouldShow && !reducedMotion) {
                        item.animate(
                            [
                                {
                                    opacity: 0,
                                    transform: "translateY(14px)"
                                },
                                {
                                    opacity: 1,
                                    transform: "translateY(0)"
                                }
                            ],
                            {
                                duration: 420,
                                easing: "cubic-bezier(.22,1,.36,1)",
                                fill: "both"
                            }
                        );
                    }

                });

            });
        });
    }


    setupFilter(".poster-filter", ".poster-project");
    setupFilter(".logo-filter", ".logo-project");
    setupFilter(".motion-filter", ".motion-card");


    /* =====================================================
       DESCRIPTION HELPERS
    ===================================================== */

    function cleanText(value) {
        return (value || "")
            .replace(/\s+/g, " ")
            .trim();
    }


    function getCardDescription(item) {

        if (!item) {
            return {
                title: "",
                description: ""
            };
        }

        const titleElement = item.querySelector(
            ".poster-info h3, " +
            ".logo-info h3, " +
            ".magazine-project-title h3, " +
            ".brand-info h3, " +
            ".motion-info h3, " +
            ".social-info h3, " +
            "h3"
        );

        const descriptionElement = item.querySelector(
            ".poster-info > div > p, " +
            ".logo-info > div > p, " +
            ".magazine-project-title p, " +
            ".brand-info p, " +
            ".motion-info > p, " +
            ".social-info > p"
        );

        return {
            title: cleanText(titleElement?.textContent),
            description: cleanText(descriptionElement?.textContent)
        };
    }


    function setLightboxCaption(titleElement, descriptionElement, item) {

        if (!titleElement && !descriptionElement) {
            return;
        }

        const content = getCardDescription(item);

        if (titleElement) {
            titleElement.textContent = content.title;
        }

        if (descriptionElement) {
            descriptionElement.textContent = content.description;
        }
    }


    /* =====================================================
       IMAGE LIGHTBOX SYSTEM
    ===================================================== */

    function setupImageLightbox({
        itemSelector,
        imageSelector,
        lightboxId,
        lightboxImageId,
        closeId,
        titleId,
        descriptionId
    }) {

        const items = document.querySelectorAll(itemSelector);
        const lightbox = document.getElementById(lightboxId);
        const lightboxImage = document.getElementById(lightboxImageId);
        const closeButton = document.getElementById(closeId);
        const titleElement = document.getElementById(titleId);
        const descriptionElement = document.getElementById(descriptionId);

        if (!items.length || !lightbox || !lightboxImage) {
            return;
        }


        function openLightbox(image, item) {

            if (!image) {
                return;
            }

            lightboxImage.src =
                image.currentSrc || image.src;

            lightboxImage.alt =
                image.alt || "Portfolio Preview";

            setLightboxCaption(
                titleElement,
                descriptionElement,
                item
            );

            lightbox.classList.add("active");
            body.style.overflow = "hidden";
        }


        function closeLightbox() {

            lightbox.classList.remove("active");
            body.style.overflow = "";

            setTimeout(() => {

                if (!lightbox.classList.contains("active")) {

                    lightboxImage.removeAttribute("src");

                    if (titleElement) {
                        titleElement.textContent = "";
                    }

                    if (descriptionElement) {
                        descriptionElement.textContent = "";
                    }
                }

            }, 300);
        }


        items.forEach(item => {

            item.addEventListener("click", event => {

                if (event.target.closest("button, a")) {
                    return;
                }

                const image = item.querySelector(imageSelector);
                openLightbox(image, item);
            });
        });


        if (closeButton) {
            closeButton.addEventListener("click", closeLightbox);
        }


        lightbox.addEventListener("click", event => {

            if (event.target === lightbox) {
                closeLightbox();
            }

        });


        document.addEventListener("keydown", event => {

            if (
                event.key === "Escape" &&
                lightbox.classList.contains("active")
            ) {
                closeLightbox();
            }

        });

    }


    setupImageLightbox({
        itemSelector: ".poster-project",
        imageSelector: "img",
        lightboxId: "posterLightbox",
        lightboxImageId: "lightboxImage",
        closeId: "lightboxClose",
        titleId: "posterLightboxTitle",
        descriptionId: "posterLightboxDescription"
    });


    setupImageLightbox({
        itemSelector: ".logo-project",
        imageSelector: "img",
        lightboxId: "logoLightbox",
        lightboxImageId: "logoLightboxImage",
        closeId: "logoLightboxClose",
        titleId: "logoLightboxTitle",
        descriptionId: "logoLightboxDescription"
    });


    setupImageLightbox({
        itemSelector: "#magazinePortfolio .magazine-image",
        imageSelector: "img",
        lightboxId: "magazineLightbox",
        lightboxImageId: "magazineLightboxImage",
        closeId: "magazineLightboxClose",
        titleId: "magazineLightboxTitle",
        descriptionId: "magazineLightboxDescription"
    });


    setupImageLightbox({
        itemSelector: ".brand-card",
        imageSelector: ".brand-image img",
        lightboxId: "brandLightbox",
        lightboxImageId: "brandLightboxImage",
        closeId: "brandLightboxClose",
        titleId: "brandLightboxTitle",
        descriptionId: "brandLightboxDescription"
    });


    /* =====================================================
       VIDEO SOURCE HELPER
    ===================================================== */

    const VIDEO_ASSET_BASE_URL =
        "https://github.com/Anubhav180407/anubhav-portfolio/releases/download/video-assets-v1/";

    const VIDEO_ASSET_NAMES = {
        "MOTION REEL.mp4": "MOTION.REEL.mp4",
        "MOTION REEL 2.mp4": "MOTION.REEL.2.mp4",
        "MOTION REEL 3.mp4": "MOTION.REEL.3.mp4",
        "free fire logo.mp4": "free.fire.logo.mp4",
        "lv_0_20260914194831.mp4": "lv_0_20260914194831.mp4",
        "Marketing (1).mp4": "Marketing.1.mp4",
        "animation4.mp4": "animation4.mp4",
        "spiderman.mp4": "spiderman.mp4",
        "Truth is - Iron Man Edit _ Aura Farming _ Sempero (slowed) _ _marvel _ironman(1080P_HD).mp4":
            "Truth.is.-.Iron.Man.Edit._.Aura.Farming._.Sempero.slowed._._marvel._ironman.1080P_HD.mp4",
        "ffvedio.mp4": "ffvedio.mp4",
        "Majboor - Aankhon Aankhon Ka Masla (Freefire Edit)❤️_nefoli _freefire _fyp _freefireedit _majboor(MP4).mp4":
            "Majboor.-.Aankhon.Aankhon.Ka.Masla.Freefire.Edit._nefoli._freefire._fyp._freefireedit._majboor.MP4.mp4"
    };


    function resolveVideoSource(source) {
        const assetName = VIDEO_ASSET_NAMES[source];

        if (!assetName) {
            throw new Error(`No hosted video asset is configured for "${source}".`);
        }

        return new URL(encodeURIComponent(assetName), VIDEO_ASSET_BASE_URL).href;
    }


    function getVideoSource(video) {

        if (!video) {
            return "";
        }

        if (video.currentSrc) {
            return video.currentSrc;
        }

        if (video.getAttribute("src")) {
            return video.getAttribute("src");
        }

        if (video.dataset.src) {
            return resolveVideoSource(video.dataset.src);
        }

        const source = video.querySelector("source");

        if (source) {
            return source.src || source.getAttribute("src") || "";
        }

        return "";
    }


    /* =====================================================
       AUTOPLAY VIDEO PREVIEWS NEAR THE VIEWPORT
    ===================================================== */

    const previewVideos = document.querySelectorAll(
        ".motion-card video, .social-video-card video"
    );

    function loadPreviewVideo(video) {

        if (!video || video.src || !video.dataset.src) {
            return;
        }

        video.src = resolveVideoSource(video.dataset.src);
        video.load();
    }

    if ("IntersectionObserver" in window) {

        const videoObserver = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    loadPreviewVideo(entry.target);
                    entry.target.play().catch(() => {});
                } else {
                    entry.target.pause();
                }

            });

        }, { rootMargin: "100px 0px", threshold: 0.15 });

        previewVideos.forEach(video => videoObserver.observe(video));

    } else {
        previewVideos.forEach(video => {
            loadPreviewVideo(video);
            video.play().catch(() => {});
        });
    }


    /* =====================================================
       MOTION VIDEO LIGHTBOX
    ===================================================== */

    const motionLightbox =
        document.getElementById("motionLightbox");

    const motionLightboxVideo =
        document.getElementById("motionLightboxVideo");

    const motionLightboxClose =
        document.getElementById("motionLightboxClose");

    const motionLightboxTitle =
        document.getElementById("motionLightboxTitle");

    const motionLightboxDescription =
        document.getElementById("motionLightboxDescription");


    function openMotionLightbox(video, card) {

        if (
            !motionLightbox ||
            !motionLightboxVideo ||
            !video
        ) {
            return;
        }

        const source = getVideoSource(video);

        if (!source) {
            return;
        }

        motionLightboxVideo.src = source;
        motionLightboxVideo.preload = "auto";
        motionLightboxVideo.muted = false;
        motionLightboxVideo.volume = 1;
        motionLightboxVideo.loop = true;
        motionLightboxVideo.controls = true;

        setLightboxCaption(
            motionLightboxTitle,
            motionLightboxDescription,
            card
        );

        motionLightbox.classList.add("active");
        body.style.overflow = "hidden";

        motionLightboxVideo.addEventListener(
            "canplay",
            () => motionLightboxVideo.play().catch(() => {}),
            { once: true }
        );
    }


    function closeMotionLightbox() {

        if (!motionLightbox) {
            return;
        }

        motionLightbox.classList.remove("active");

        if (motionLightboxVideo) {
            motionLightboxVideo.pause();
            motionLightboxVideo.removeAttribute("src");
            motionLightboxVideo.load();
        }

        if (motionLightboxTitle) {
            motionLightboxTitle.textContent = "";
        }

        if (motionLightboxDescription) {
            motionLightboxDescription.textContent = "";
        }

        body.style.overflow = "";
    }


    document.querySelectorAll(".motion-card").forEach(card => {

        const viewButton = card.querySelector(".motion-view");
        const video = card.querySelector("video");

        if (viewButton && video) {

            viewButton.addEventListener("click", event => {

                event.preventDefault();
                event.stopPropagation();

                openMotionLightbox(video, card);
            });
        }
    });


    if (motionLightboxClose) {
        motionLightboxClose.addEventListener(
            "click",
            closeMotionLightbox
        );
    }


    if (motionLightbox) {

        motionLightbox.addEventListener("click", event => {

            if (event.target === motionLightbox) {
                closeMotionLightbox();
            }

        });
    }


    /* =====================================================
       SOCIAL MEDIA VIDEO LIGHTBOX
    ===================================================== */

    const socialLightbox =
        document.getElementById("socialLightbox");

    const socialLightboxVideo =
        document.getElementById("socialLightboxVideo");

    const socialLightboxClose =
        document.getElementById("socialLightboxClose");

    const socialLightboxTitle =
        document.getElementById("socialLightboxTitle");

    const socialLightboxDescription =
        document.getElementById("socialLightboxDescription");


    function openSocialLightbox(video, card) {

        if (
            !socialLightbox ||
            !socialLightboxVideo ||
            !video
        ) {
            return;
        }

        const source = getVideoSource(video);

        if (!source) {
            return;
        }

        socialLightboxVideo.src = source;
        socialLightboxVideo.preload = "auto";
        socialLightboxVideo.muted = false;
        socialLightboxVideo.volume = 1;
        socialLightboxVideo.loop = true;
        socialLightboxVideo.controls = true;

        setLightboxCaption(
            socialLightboxTitle,
            socialLightboxDescription,
            card
        );

        socialLightbox.classList.add("active");
        body.style.overflow = "hidden";

        socialLightboxVideo.addEventListener(
            "canplay",
            () => socialLightboxVideo.play().catch(() => {}),
            { once: true }
        );
    }


    function closeSocialLightbox() {

        if (!socialLightbox) {
            return;
        }

        socialLightbox.classList.remove("active");

        if (socialLightboxVideo) {
            socialLightboxVideo.pause();
            socialLightboxVideo.removeAttribute("src");
            socialLightboxVideo.load();
        }

        if (socialLightboxTitle) {
            socialLightboxTitle.textContent = "";
        }

        if (socialLightboxDescription) {
            socialLightboxDescription.textContent = "";
        }

        body.style.overflow = "";
    }


    document.querySelectorAll(".social-video-card").forEach(card => {

        const viewButton = card.querySelector(".social-view");
        const video =
            card.querySelector(".social-preview") ||
            card.querySelector("video");

        if (viewButton && video) {

            viewButton.addEventListener("click", event => {

                event.preventDefault();
                event.stopPropagation();

                openSocialLightbox(video, card);
            });
        }
    });


    if (socialLightboxClose) {
        socialLightboxClose.addEventListener(
            "click",
            closeSocialLightbox
        );
    }


    if (socialLightbox) {

        socialLightbox.addEventListener("click", event => {

            if (event.target === socialLightbox) {
                closeSocialLightbox();
            }

        });
    }


    /* =====================================================
       ESCAPE — CLOSE VIDEO LIGHTBOXES
    ===================================================== */

    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") {
            return;
        }

        if (
            motionLightbox &&
            motionLightbox.classList.contains("active")
        ) {
            closeMotionLightbox();
        }

        if (
            socialLightbox &&
            socialLightbox.classList.contains("active")
        ) {
            closeSocialLightbox();
        }
    });


    /* =====================================================
       AUTOPLAY PORTFOLIO VIDEOS
    ===================================================== */

    const portfolioVideos = document.querySelectorAll(
        ".motion-card video, .social-video-card video"
    );


    portfolioVideos.forEach(video => {

        video.muted = true;
        video.loop = true;
        video.playsInline = true;

        video.setAttribute("muted", "");
        video.setAttribute("loop", "");
        video.setAttribute("playsinline", "");


        const playVideo = () => {
            if (!video.paused) {
                return;
            }
            video.play().catch(() => {});
        };


        if (video.readyState >= 2) {
            playVideo();
        } else {
            video.addEventListener(
                "loadeddata",
                playVideo,
                { once: true }
            );
        }


        if ("IntersectionObserver" in window) {

            const videoObserver =
                new IntersectionObserver(entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {
                            playVideo();
                        } else if (!document.hidden) {
                            video.pause();
                        }

                    });

                }, {
                    threshold: 0.15
                });

            videoObserver.observe(video);
        }

    });


    /* =====================================================
       VIDEO HOVER PLAY
    ===================================================== */

    if (!reducedMotion) {

        document.querySelectorAll(
            ".motion-video-wrap, .social-video"
        ).forEach(wrapper => {

            const video = wrapper.querySelector("video");

            if (!video) {
                return;
            }

            wrapper.addEventListener("mouseenter", () => {
                video.play().catch(() => {});
            });

            wrapper.addEventListener("mouseleave", () => {
                if (video.paused) {
                    video.play().catch(() => {});
                }
            });

        });
    }


    /* =====================================================
       PORTFOLIO SCROLL REVEAL
    ===================================================== */

    const animatedItems = document.querySelectorAll(
        `
        .poster-project,
        .logo-project,
        .magazine-project,
        .brand-card,
        .motion-card,
        .social-video-card
        `
    );


    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("motion-visible");

                        revealObserver.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );


        animatedItems.forEach((item, index) => {

            if (!reducedMotion) {
                item.style.transitionDelay =
                    `${(index % 4) * 70}ms`;
            }

            revealObserver.observe(item);
        });

    } else {

        animatedItems.forEach(item => {
            item.classList.add("motion-visible");
        });
    }


    /* =====================================================
       SMOOTH ANCHOR LINKS
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const id = link.getAttribute("href");

            if (!id || id === "#") {
                return;
            }

            let target;

            try {
                target = document.querySelector(id);
            } catch {
                return;
            }

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start"
            });

            closeMenu();
        });

    });


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll("#nav a");

    function updateActiveNav() {

        const position = window.scrollY + 220;
        let current = "";

        sections.forEach(section => {

            if (position >= section.offsetTop) {
                current = section.id;
            }

        });

        navLinks.forEach(link => {

            const href = link.getAttribute("href");

            link.classList.toggle(
                "active",
                href === `#${current}`
            );

        });
    }


    window.addEventListener(
        "scroll",
        updateActiveNav,
        { passive: true }
    );

    updateActiveNav();


    /* =====================================================
       PAGE VISIBILITY
    ===================================================== */

    document.addEventListener("visibilitychange", () => {

        if (!document.hidden) {
            return;
        }

        portfolioVideos.forEach(video => {
            video.pause();
        });

        if (motionLightboxVideo) {
            motionLightboxVideo.pause();
        }

        if (socialLightboxVideo) {
            socialLightboxVideo.pause();
        }
    });


    /* =====================================================
       ADVANCED PORTFOLIO MOTION
       Adds varied movement without changing layout.
    ===================================================== */

    if (!reducedMotion) {

        const motionCards = document.querySelectorAll(
            ".poster-project, .logo-project, .magazine-project, .brand-card, .motion-card, .social-video-card"
        );

        motionCards.forEach((card, index) => {
            card.classList.add("portfolio-motion-item");

            const pattern = index % 4;
            if (pattern === 1) card.style.setProperty("--reveal-x", "-34px");
            if (pattern === 2) card.style.setProperty("--reveal-x", "34px");
            if (pattern === 3) card.style.setProperty("--reveal-y", "48px");
            card.style.setProperty("--card-delay", `${(index % 4) * 90}ms`);
        });

        const motionRevealObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("motion-visible");
                    motionRevealObserver.unobserve(entry.target);
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -45px 0px" }
        );

        motionCards.forEach(card => motionRevealObserver.observe(card));

        /* Subtle pointer tilt — only the hovered media moves, never the grid. */
        document.querySelectorAll(
            ".poster-image, .logo-image, .magazine-image, .brand-image, .motion-video-wrap, .social-video"
        ).forEach(media => {
            media.addEventListener("pointermove", event => {
                if (event.pointerType !== "mouse") return;

                const rect = media.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - .5;
                const y = (event.clientY - rect.top) / rect.height - .5;

                media.style.setProperty("--mx", `${(-x * 5).toFixed(2)}deg`);
                media.style.setProperty("--my", `${(y * 5).toFixed(2)}deg`);
                media.style.setProperty("--shine-x", `${((x + .5) * 100).toFixed(1)}%`);
                media.style.setProperty("--shine-y", `${((y + .5) * 100).toFixed(1)}%`);
            });

            media.addEventListener("pointerleave", () => {
                media.style.setProperty("--mx", "0deg");
                media.style.setProperty("--my", "0deg");
                media.style.setProperty("--shine-x", "50%");
                media.style.setProperty("--shine-y", "50%");
            });
        });

        /* Gentle parallax for portfolio headings while scrolling. */
        const animatedHeadings = document.querySelectorAll(
            ".poster-heading, .logo-heading, .magazine-heading, .brand-heading, .motion-heading, .social-heading"
        );

        const updateHeadingMotion = () => {
            animatedHeadings.forEach(heading => {
                const rect = heading.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > window.innerHeight) return;

                const distance = (rect.top - window.innerHeight * .35) * -0.025;
                heading.style.setProperty("--heading-y", `${Math.max(-8, Math.min(8, distance))}px`);
            });
        };

        window.addEventListener("scroll", updateHeadingMotion, { passive: true });
        updateHeadingMotion();

        const hero = document.getElementById("home");
        const heroVisual = document.querySelector(".hero-right");

        if (hero && heroVisual) {
            hero.addEventListener("pointermove", event => {
                if (event.pointerType !== "mouse") return;

                const rect = hero.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - .5;
                const y = (event.clientY - rect.top) / rect.height - .5;

                heroVisual.style.setProperty("--hero-x", `${(x * 16).toFixed(2)}px`);
                heroVisual.style.setProperty("--hero-y", `${(y * 12).toFixed(2)}px`);
                heroVisual.style.setProperty("--hero-rotate-y", `${(x * 5).toFixed(2)}deg`);
                heroVisual.style.setProperty("--hero-rotate-x", `${(-y * 5).toFixed(2)}deg`);
                heroVisual.style.setProperty("--hero-light-x", `${((x + .5) * 100).toFixed(1)}%`);
                heroVisual.style.setProperty("--hero-light-y", `${((y + .5) * 100).toFixed(1)}%`);
            });

            hero.addEventListener("pointerleave", () => {
                heroVisual.style.setProperty("--hero-x", "0px");
                heroVisual.style.setProperty("--hero-y", "0px");
                heroVisual.style.setProperty("--hero-rotate-y", "0deg");
                heroVisual.style.setProperty("--hero-rotate-x", "0deg");
                heroVisual.style.setProperty("--hero-light-x", "50%");
                heroVisual.style.setProperty("--hero-light-y", "42%");
            });
        }

        document.querySelectorAll(
            ".button-primary, .button-text, .email-button, .motion-view, .social-view, .brand-view"
        ).forEach(button => {
            button.addEventListener("pointermove", event => {
                if (event.pointerType !== "mouse") return;

                const rect = button.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - .5;
                const y = (event.clientY - rect.top) / rect.height - .5;

                button.style.setProperty("--magnetic-x", `${(x * 8).toFixed(2)}px`);
                button.style.setProperty("--magnetic-y", `${(y * 6).toFixed(2)}px`);
            });

            button.addEventListener("pointerleave", () => {
                button.style.setProperty("--magnetic-x", "0px");
                button.style.setProperty("--magnetic-y", "0px");
            });
        });
    }


    /* =====================================================
       FINAL LOG
    ===================================================== */

    console.log(
        "✓ Anubhav Creative Portfolio loaded successfully."
    );

});
