(() => {
    const gallery = document.getElementById("galleryTrack");
    const dotsContainer = document.getElementById("galleryDots");

    if (!gallery || !dotsContainer) return;

    const slides = Array.from(gallery.querySelectorAll(".gallery-slide"));
    const previousButton = document.querySelector(".gallery-prev");
    const nextButton = document.querySelector(".gallery-next");
    let currentIndex = 0;

    function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        const slide = slides[currentIndex];

        gallery.scrollTo({
            left: slide.offsetLeft - gallery.offsetLeft -
                (gallery.clientWidth - slide.clientWidth) / 2,
            behavior: "smooth"
        });

        Array.from(dotsContainer.children).forEach((dot, dotIndex) => {
            const active = dotIndex === currentIndex;
            dot.classList.toggle("active", active);
            dot.setAttribute("aria-current", active ? "true" : "false");
        });
    }

    slides.forEach((slide, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "gallery-dot";
        dot.setAttribute("aria-label", `Ver imagen ${index + 1}`);
        dot.addEventListener("click", () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    previousButton?.addEventListener("click", () => goToSlide(currentIndex - 1));
    nextButton?.addEventListener("click", () => goToSlide(currentIndex + 1));

    // Permite usar las flechas del teclado cuando el carrusel tiene el foco.
    gallery.tabIndex = 0;
    gallery.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") goToSlide(currentIndex - 1);
        if (event.key === "ArrowRight") goToSlide(currentIndex + 1);
    });

    // Actualiza el indicador al desplazar manualmente en pantalla táctil.
    let scrollTimeout;
    gallery.addEventListener("scroll", () => {
        window.clearTimeout(scrollTimeout);
        scrollTimeout = window.setTimeout(() => {
            const center = gallery.scrollLeft + gallery.clientWidth / 2;
            let nearest = 0;
            let distance = Infinity;

            slides.forEach((slide, index) => {
                const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
                const difference = Math.abs(center - slideCenter);
                if (difference < distance) {
                    distance = difference;
                    nearest = index;
                }
            });

            currentIndex = nearest;
            Array.from(dotsContainer.children).forEach((dot, index) => {
                const active = index === currentIndex;
                dot.classList.toggle("active", active);
                dot.setAttribute("aria-current", active ? "true" : "false");
            });
        }, 90);
    }, { passive: true });

    goToSlide(0);
})();
