

function initSwiper(selector, config) {
  const element = document.querySelector(selector);
  if (element) {
    return new Swiper(selector, config);
  }
  return null;
}

//слайдер на главной
const swiper1 = {
  direction: "horizontal",
  spaceBetween: 30,
  loop: true,
  speed: 700,
  slidesPerView:3.5,
  autoWidth: true,
  autoplay: {
  	delay: 5000,
  },
};
if (document.querySelector(".partner .swiper")) {
  initSwiper(".partner .swiper", swiper1);
}
