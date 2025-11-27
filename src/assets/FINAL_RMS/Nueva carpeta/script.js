
var swiper = new Swiper(".proyectosSwiper", {
    slidesPerView: 3,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 2000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        992: { slidesPerView: 3 }
    }
});
    var swiper = new Swiper(".mySwiper", {
    slidesPerView: 5,        // cuántos logos visibles
    spaceBetween: 30,
    loop: true,
    centeredSlides: false,
    autoplay: {
        delay: 2000,           // 3 segundos
        disableOnInteraction: false,
    },
    breakpoints: {
        320:  { slidesPerView: 2 },
        480:  { slidesPerView: 3 },
        768:  { slidesPerView: 4 },
        1024: { slidesPerView: 5 }
    }
    });
    var swiper = new Swiper(".productosSwiper", {
    slidesPerView: 4,          // 4 columnas como tu ejemplo
    spaceBetween: 0,
    loop: true,
    autoplay: {
        delay: 2000,           // Cambia cada 2.5 segundos
        disableOnInteraction: false,
    },
    speed: 800,                 // transición suave
});
const carousel = document.getElementById('heroCarousel');

carousel.addEventListener('slide.bs.carousel', function (event) {
  const nextSlide = event.relatedTarget;
  const bgImage = nextSlide.getAttribute('data-bg');

  nextSlide.style.setProperty('--bg-image', `url(${bgImage})`);
});

// Inicializar fondo del primer slide
document.querySelectorAll('.carousel-item').forEach(item => {
  const bg = item.getAttribute('data-bg');
  item.style.setProperty('--bg-image', `url(${bg})`);
});
document.querySelectorAll('.carousel-item').forEach(item => {
  const bg = item.getAttribute('data-bg');
  item.style.setProperty('--bg-image', `url('${bg}')`);
});