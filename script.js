// Находим интерактивные элементы один раз после загрузки HTML.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
const navigationLinks = document.querySelectorAll('.nav a');
const contactForm = document.querySelector('#contact-form');
const successMessage = document.querySelector('.form-success');
const header = document.querySelector('.header');

// Включаем деликатное появление смысловых блоков только при наличии JavaScript.
document.documentElement.classList.add('js-enabled');
const revealElements = document.querySelectorAll(
  '.section-heading, .service-card, .project-card, .about__visual, .about__content, blockquote, .advantage-card, .about-project, .company-story__layout, .guarantee__layout, .price-list li, .process-list li, .contact-form'
);
revealElements.forEach((element) => element.classList.add('reveal'));

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

// После начала прокрутки усиливаем фон и тень закреплённой шапки.
const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Открываем и закрываем мобильное меню, одновременно обновляя ARIA-атрибут.
menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  menuButton.classList.toggle('is-active', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  document.body.classList.toggle('menu-open', isOpen);
});

// После выбора раздела закрываем мобильное меню, чтобы показать содержимое страницы.
navigationLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('is-open');
    menuButton.classList.remove('is-active');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
    document.body.classList.remove('menu-open');
  });
});

// Escape закрывает полноэкранное меню и возвращает фокус на кнопку.
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !navigation?.classList.contains('is-open')) return;
  navigation.classList.remove('is-open');
  menuButton.classList.remove('is-active');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  document.body.classList.remove('menu-open');
  menuButton.focus();
});

// Браузер сам выполняет плавный переход по якорю благодаря scroll-behavior в CSS.
// Здесь дополнительно переводим фокус на первое поле формы для удобства клавиатуры.
document.querySelectorAll('.js-calc-button').forEach((button) => {
  button.addEventListener('click', () => {
    if (contactForm) window.setTimeout(() => contactForm.elements.name.focus({ preventScroll: true }), 650);
  });
});

// Имитируем успешную отправку без сервера: очищаем поля и показываем заданный текст.
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  successMessage.classList.add('is-visible');
  contactForm.reset();
});

// Фильтрация портфолио без перезагрузки страницы.
const filterButtons = document.querySelectorAll('.portfolio-filters button');
const portfolioCards = document.querySelectorAll('.portfolio-card');
const filterStatus = document.querySelector('.filter-status');
if (filterButtons.length) {
  filterButtons[0].classList.add('is-active');
  filterButtons[0].setAttribute('aria-pressed', 'true');
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    let visible = 0;
    filterButtons.forEach((item) => {
      item.classList.toggle('is-active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    portfolioCards.forEach((card) => {
      const show = filter === 'Все' || card.dataset.category === filter;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (filterStatus) filterStatus.textContent = `Показано проектов: ${visible}`;
  }));
}

// Доступная модальная галерея с клавиатурной навигацией.
const galleryButtons = [...document.querySelectorAll('.gallery__item')];
const lightbox = document.querySelector('.lightbox');
if (lightbox && galleryButtons.length) {
  const lightboxImage = lightbox.querySelector('img');
  const counter = lightbox.querySelector('.lightbox__counter');
  let currentImage = 0;
  let returnFocus;
  const showImage = (index) => {
    currentImage = (index + galleryButtons.length) % galleryButtons.length;
    const source = galleryButtons[currentImage];
    lightboxImage.src = source.dataset.full;
    lightboxImage.alt = source.querySelector('img').alt;
    counter.textContent = `${currentImage + 1} / ${galleryButtons.length}`;
  };
  const openLightbox = (index, trigger) => {
    returnFocus = trigger;
    showImage(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    lightbox.querySelector('.lightbox__close').focus();
  };
  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    document.body.classList.remove('menu-open');
    returnFocus?.focus();
  };
  galleryButtons.forEach((button, index) => button.addEventListener('click', () => openLightbox(index, button)));
  lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox__prev').addEventListener('click', () => showImage(currentImage - 1));
  lightbox.querySelector('.lightbox__next').addEventListener('click', () => showImage(currentImage + 1));
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showImage(currentImage - 1);
    if (event.key === 'ArrowRight') showImage(currentImage + 1);
  });
}
