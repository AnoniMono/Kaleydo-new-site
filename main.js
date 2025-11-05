document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".main-nav ul");
  const animatedItems = document.querySelectorAll("[data-animate]");
  const parallaxElements = document.querySelectorAll("[data-parallax]");
  const heroSection = document.querySelector(".hero");
  const heroTitleBlock = document.querySelector(".hero-title-block");
  const introOverlay = document.querySelector(".logo-intro");

  const updateHeaderState = () => {
    if (!header) return;
    const threshold = 40;
    if (window.scrollY > threshold) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  const updateParallax = () => {
    if (!parallaxElements.length) return;
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.parallaxSpeed || "0.15");
      const rect = element.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const distanceFromCenter = elementCenter - viewportCenter;
      const y = distanceFromCenter * speed * -1;
      element.style.setProperty("--parallax-offset", `${y}px`);
    });
  };

  const triggerHeroReveal = () => {
    window.requestAnimationFrame(() => {
      heroTitleBlock?.classList.add("is-visible");
      header?.classList.add("is-visible");
    });
  };

  const startIntro = () => {
    if (!introOverlay) {
      triggerHeroReveal();
      return;
    }

    document.body.classList.add("intro-active");

    const logoPaths = introOverlay.querySelectorAll(".logo-path");
    logoPaths.forEach((path, index) => {
      const length = path.getTotalLength();
      path.style.setProperty("--path-length", length);
      const providedDelay = parseFloat(path.dataset.delay ?? "");
      const delay = Number.isFinite(providedDelay) ? providedDelay : index * 0.35;
      path.style.setProperty("--delay", `${delay}s`);
    });

    let introFallbackTimeout = 0;
    let hasFinishedIntro = false;

    const finalizeIntro = () => {
      if (hasFinishedIntro) return;
      hasFinishedIntro = true;
      window.clearTimeout(introFallbackTimeout);
      introOverlay.removeEventListener("transitionend", handleOverlayHidden);
      triggerHeroReveal();
      introOverlay.remove();
    };

    const handleOverlayHidden = event => {
      if (event.target === introOverlay && event.propertyName === "opacity") {
        finalizeIntro();
      }
    };

    introOverlay.addEventListener("transitionend", handleOverlayHidden);

    const removeIntro = () => {
      introOverlay.classList.add("is-hidden");
      document.body.classList.remove("intro-active");
      introFallbackTimeout = window.setTimeout(finalizeIntro, 900);
    };

    window.setTimeout(removeIntro, 4600);
  };

  updateHeaderState();
  updateParallax();
  startIntro();

  window.addEventListener("scroll", () => {
    updateHeaderState();
    window.requestAnimationFrame(updateParallax);
  });

  window.addEventListener("resize", () => {
    window.requestAnimationFrame(updateParallax);
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    animatedItems.forEach(item => observer.observe(item));
  } else {
    animatedItems.forEach(item => item.classList.add("is-visible"));
  }

  if (navToggle && navMenu) {
    const toggleMenu = () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navMenu.classList.toggle("open", !expanded);
    };

    navToggle.addEventListener("click", toggleMenu);

    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          navToggle.setAttribute("aria-expanded", "false");
          navMenu.classList.remove("open");
        }
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("open");
      }
    });
  }

  const portfolioItems = document.querySelectorAll(".portfolio-item[data-gallery]");
  const galleryModal = document.querySelector(".gallery-modal");
  const galleryViewport = galleryModal?.querySelector(".gallery-carousel__viewport");
  const galleryNext = galleryModal?.querySelector("[data-gallery-next]");
  const galleryPrev = galleryModal?.querySelector("[data-gallery-prev]");
  const galleryCloseTargets = galleryModal ? galleryModal.querySelectorAll("[data-gallery-close]") : null;

  const galleryData = {
    firenze: {
      title: "Matrimonio a Firenze",
      description: "Un matrimonio nel cuore di Firenze, tra luce dorata, dettagli sartoriali e regia musicale su misura.",
      slides: [
        {
          src: "Images/Events/Evento%201/568660828_18323575873209613_3967443500501919323_n.jpg",
          alt: "Brindisi degli sposi illuminato dal sole di Firenze",
          caption: "Ingresso degli sposi con luce naturale e scenografia floreale."
        },
        {
          src: "Images/Events/Evento%201/568506840_18323575864209613_1663151022277575307_n.jpg",
          alt: "Allestimento tavoli nelle logge storiche",
          caption: "Tavoli imperiali con texture materiche e luce calda diffusa."
        },
        {
          src: "Images/Events/Evento%201/569897109_18323575852209613_2990007683375818242_n.jpg",
          alt: "Dettaglio del tableau de mariage fiorentino",
          caption: "Tableau artigianale con calligrafia su misura e accenti floreali."
        }
      ]
    },
    montalcino: {
      title: "Luci a Montalcino",
      description: "Una notte a Montalcino tra architetture in pietra e light design immersivo per un viaggio enogastronomico.",
      slides: [
        {
          src: "Images/Events/Evento%203/503377116_18308992078209613_1388394577125175807_n.jpg",
          alt: "Facciata storica illuminata a Montalcino",
          caption: "Mapping architetturale che valorizza la pietra viva della location."
        },
        {
          src: "Images/Events/Evento%203/503798812_18308992087209613_4023240646835623318_n.jpg",
          alt: "Cortile con tavolo imperiale e luci calde",
          caption: "Dinner experience sotto un cielo di microluci e lanterne in vetro."
        },
        {
          src: "Images/Events/Evento%203/503559317_18308992036209613_8460787598444849679_n.jpg",
          alt: "Percorso luminoso tra filari e fiori",
          caption: "Percorso guidato da candele e installazioni luminose ambientali."
        }
      ]
    },
    candelabri: {
      title: "Candelabri sospesi",
      description: "Un set-up sospeso tra vetro, fiori e luce soffusa per un evento privato dal carattere scenografico.",
      slides: [
        {
          src: "Images/Events/Evento2/561072536_18321658858209613_7064260997167959602_n.jpg",
          alt: "Sala con candelabri sospesi e tavoli floreali",
          caption: "Candelabri sospesi a diversa altezza per una profondità teatrale."
        },
        {
          src: "Images/Events/Evento2/559637910_18321658861209613_5530674915714196519_n.jpg",
          alt: "Dettaglio floreale con cristalli in sospensione",
          caption: "Installazioni in cristallo e fiori pendenti per incorniciare la sala."
        }
      ]
    }
  };

  let activeGallery = null;
  let activeIndex = 0;
  let lastFocusedElement = null;

  const renderSlides = slides => {
    if (!galleryViewport) return;
    galleryViewport.innerHTML = slides
      .map(
        (slide, index) => `
          <div class="gallery-carousel__slide${index === 0 ? " is-active" : ""}" data-index="${index}">
            <img src="${slide.src}" alt="${slide.alt}" loading="lazy" />
          </div>
        `
      )
      .join("");
  };

  const updateActiveSlide = () => {
    if (!activeGallery || !galleryViewport) return;
    const slides = Array.from(galleryViewport.querySelectorAll(".gallery-carousel__slide"));
    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeIndex);
    });
  };

  const showSlide = delta => {
    if (!activeGallery) return;
    activeIndex = (activeIndex + delta + activeGallery.slides.length) % activeGallery.slides.length;
    updateActiveSlide();
  };

  const closeGallery = () => {
    if (!galleryModal || !galleryViewport) return;
    galleryModal.classList.remove("is-active");
    galleryModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    window.setTimeout(() => {
      galleryViewport.innerHTML = "";
    }, 350);
    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus({ preventScroll: true });
    }
  };

  const openGallery = (key, fallback) => {
    if (!galleryModal || !galleryViewport) return;
    const data = galleryData[key] ?? {
      title: fallback?.title ?? "Galleria",
      description: "",
      slides: fallback?.image
        ? [
            {
              src: fallback.image.src,
              alt: fallback.image.alt || fallback?.title || "Portfolio",
              caption: fallback?.title,
            },
          ]
        : [],
    };

    if (!data.slides.length) return;

    activeGallery = data;
    activeIndex = 0;
    lastFocusedElement = document.activeElement;

    renderSlides(data.slides);
    updateActiveSlide();

    const showNav = data.slides.length > 1;
    if (galleryNext) galleryNext.style.display = showNav ? "grid" : "none";
    if (galleryPrev) galleryPrev.style.display = showNav ? "grid" : "none";

    galleryModal.classList.add("is-active");
    galleryModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    window.setTimeout(() => {
      const closeButton = galleryModal.querySelector(".gallery-modal__close");
      closeButton?.focus({ preventScroll: true });
    }, 120);
  };

  const handleKeyNavigation = event => {
    if (!galleryModal?.classList.contains("is-active") || !activeGallery) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeGallery();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(-1);
    }
  };

  if (portfolioItems.length && galleryModal) {
    portfolioItems.forEach(item => {
      const handleOpen = () => {
        const key = item.dataset.gallery ?? "";
        const title = item.querySelector("figcaption")?.textContent?.trim() || item.getAttribute("aria-label") || "Galleria";
        const image = item.querySelector("img");
        openGallery(key, { title, image });
      };

      item.addEventListener("click", handleOpen);
      item.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpen();
        }
      });
    });

    if (galleryCloseTargets) {
      galleryCloseTargets.forEach(target => {
        target.addEventListener("click", () => {
          closeGallery();
        });
      });
    }

    galleryNext?.addEventListener("click", () => showSlide(1));
    galleryPrev?.addEventListener("click", () => showSlide(-1));

    galleryViewport?.addEventListener("click", () => {
      if (activeGallery && activeGallery.slides.length > 1) {
        showSlide(1);
      }
    });

    document.addEventListener("keydown", handleKeyNavigation);

    galleryModal.addEventListener("transitionend", event => {
      if (event.target === galleryModal && !galleryModal.classList.contains("is-active")) {
        activeGallery = null;
        activeIndex = 0;
      }
    });
  }
});

