document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".main-nav ul");
  const heroVideo = document.querySelector(".hero-video");
  const animatedItems = document.querySelectorAll("[data-animate]");

  const updateHeaderState = () => {
    if (!header) return;
    const threshold = 40;
    if (window.scrollY > threshold) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  const handleParallax = () => {
    if (!heroVideo) return;
    const offset = window.scrollY * -0.15;
    heroVideo.style.setProperty("--parallax-offset", `${offset}px`);
  };

  updateHeaderState();
  handleParallax();

  window.addEventListener("scroll", () => {
    updateHeaderState();
    window.requestAnimationFrame(handleParallax);
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
});

