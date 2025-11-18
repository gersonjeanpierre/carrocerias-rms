var swiper = new Swiper(".proyectosSwiper", {
    slidesPerView: 3,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 3000,
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
    slidesPerView: 5,       
    spaceBetween: 30,
    loop: true,
    centeredSlides: false,
    autoplay: {
        delay: 2000,           
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
    slidesPerView: 4,         
    spaceBetween: 0,
    loop: true,
    autoplay: {
        delay: 3000,           
        disableOnInteraction: false,
    },
    speed: 800,                 
});
