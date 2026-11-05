
(() => {
    const gallery = document.getElementById("galleryTrack");
    const dotsContainer = document.getElementById("galleryDots");

    if (!gallery || !dotsContainer) return;

    const slides = Array.from(
        gallery.querySelectorAll(".gallery-slide")
    );

    const previousButton = document.querySelector(".gallery-prev");
    const nextButton = document.querySelector(".gallery-next");

    if (!slides.length) return;

    let currentIndex = 0;
    let scrollTimeout;

    // Crear indicadores
    dotsContainer.innerHTML = "";

    slides.forEach((slide, index) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "gallery-dot";
        dot.setAttribute("aria-label", `Ver imagen ${index + 1}`);

        dot.addEventListener("click", () => {
            goToSlide(index);
        });

        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    // Actualizar indicador activo
    function updateDots() {
        dots.forEach((dot, index) => {
            const active = index === currentIndex;

            dot.classList.toggle("active", active);

            dot.setAttribute(
                "aria-current",
                active ? "true" : "false"
            );
        });
    }

    // Centrar imagen seleccionada
    function goToSlide(index) {
        currentIndex =
            (index + slides.length) % slides.length;

        const slide = slides[currentIndex];

        const galleryRect = gallery.getBoundingClientRect();
        const slideRect = slide.getBoundingClientRect();

        const position =
            slideRect.left -
            galleryRect.left +
            gallery.scrollLeft -
            (gallery.clientWidth - slide.clientWidth) / 2;

        gallery.scrollTo({
            left: position,
            behavior: "smooth"
        });

        updateDots();
    }

    // Botones anterior y siguiente
    previousButton?.addEventListener("click", () => {
        goToSlide(currentIndex - 1);
    });

    nextButton?.addEventListener("click", () => {
        goToSlide(currentIndex + 1);
    });

    // Navegación con teclado
    gallery.tabIndex = 0;

    gallery.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            goToSlide(currentIndex - 1);
        }

        if (event.key === "ArrowRight") {
            goToSlide(currentIndex + 1);
        }
    });

    // Detectar desplazamiento manual
    gallery.addEventListener("scroll", () => {
        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            const center =
                gallery.scrollLeft + gallery.clientWidth / 2;

            let nearest = 0;
            let minDistance = Infinity;

            slides.forEach((slide, index) => {
                const slideCenter =
                    slide.offsetLeft + slide.clientWidth / 2;

                const distance = Math.abs(center - slideCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    nearest = index;
                }
            });

            currentIndex = nearest;
            updateDots();

        }, 100);

    }, { passive: true });

    // Mostrar primera imagen
    goToSlide(0);

    // Reajustar al cambiar el tamaño de pantalla
    window.addEventListener("resize", () => {
        goToSlide(currentIndex);
    });

})();
