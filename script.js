// Находим интерактивные элементы один раз после загрузки HTML.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
const navigationLinks = document.querySelectorAll('.nav a');
const contactForm = document.querySelector('#contact-form');
const successMessage = document.querySelector('.form-success');
const header = document.querySelector('.header');

// После начала прокрутки усиливаем фон и тень закреплённой шапки.
const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Открываем и закрываем мобильное меню, одновременно обновляя ARIA-атрибут.
menuButton.addEventListener('click', () => {
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

// Браузер сам выполняет плавный переход по якорю благодаря scroll-behavior в CSS.
// Здесь дополнительно переводим фокус на первое поле формы для удобства клавиатуры.
document.querySelectorAll('.js-calc-button').forEach((button) => {
  button.addEventListener('click', () => {
    window.setTimeout(() => contactForm.elements.name.focus({ preventScroll: true }), 650);
  });
});

// Имитируем успешную отправку без сервера: очищаем поля и показываем заданный текст.
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  successMessage.classList.add('is-visible');
  contactForm.reset();
});
