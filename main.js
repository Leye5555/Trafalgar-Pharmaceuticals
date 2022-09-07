const prev = document.querySelector('.prev'),
  next = document.querySelector('.next'),
  dots = document.querySelectorAll('.dot'),
  reviewScroll = document.querySelector('.reviews-scroll'),
  reviewsWrap = document.querySelector('.reviews-scroll-items'),
  reviewAll = document.querySelectorAll('.reviews-scroll-item'),
  reviewsItem = document.querySelector('.reviews-scroll-item');
let currentSlide = window.sessionStorage.getItem('currentSlide') || 'slide-1';

// toggle color schemes
const colorSchemeBtn = document.getElementById('toggleMode');
let { mode } = colorSchemeBtn.dataset;
if (
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
) {
  // dark mode
  mode = 'light';
} else if (
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: light)').matches
) {
  // dark mode
  mode = 'dark';
}

const lightBg = getComputedStyle(document.documentElement).getPropertyValue(
  '--light-mode-bg-clr'
);
const darkBg = getComputedStyle(document.documentElement).getPropertyValue(
  '--dark-mode-bg-clr'
);
const lightClr = getComputedStyle(document.documentElement).getPropertyValue(
  '--light-clr'
);
const darkClr = getComputedStyle(document.documentElement).getPropertyValue(
  '--dark-clr'
);
const lightTxt = getComputedStyle(document.documentElement).getPropertyValue(
  '--sec-clr'
);
const lightTxt100 = getComputedStyle(document.documentElement).getPropertyValue(
  '--sec-clr100'
);
const darkTxt = getComputedStyle(document.documentElement).getPropertyValue(
  '--light-clr'
);
colorSchemeBtn.addEventListener('click', handleLightMode);

function handleLightMode(e) {
  let { mode } = e.target.dataset;
  if (!mode) return;

  if (
    mode === 'light' ||
    (window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches)
  ) {
    document.documentElement.style.setProperty('--theme-bg-clr', lightBg);
    document.documentElement.style.setProperty('--theme-clr', lightClr);
    document.documentElement.style.setProperty('--theme-font-clr', lightTxt);
    document.documentElement.style.setProperty(
      '--theme-font-clr100',
      lightTxt100
    );
  } else if (
    mode === 'dark' ||
    (window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.style.setProperty('--theme-bg-clr', darkBg);
    document.documentElement.style.setProperty('--theme-clr', darkClr);
    document.documentElement.style.setProperty('--theme-font-clr', darkTxt);
  }
  mode = mode === 'light' ? 'dark' : 'light';
  e.target.setAttribute('data-mode', mode);
  e.target.style.backgroundImage =
    mode === 'light'
      ? "url('./assets/light-mode.png')"
      : "url('./assets/dark-mode.png')";
}

let interval = setInterval(() => {
  currentSlide = Number(currentSlide.split('-')[1]);
  if (currentSlide >= 4) currentSlide = 1;
  currentSlide++;
  // handleScroll(currentSlide, scrollDistance);
  window.sessionStorage.setItem('currentSlide', `slide-${currentSlide}`);
  currentSlide = `slide-${currentSlide}`;
}, 5000);

prev.addEventListener('click', handleControl);
next.addEventListener('click', handleControl);
dots.forEach((each) => {
  each.addEventListener('click', handleControl);
});

function handleControl(e) {
  handleLightMode(e);
  window.clearInterval(interval);
  currentSlide = window.sessionStorage.getItem('currentSlide');
  const btn = e.target;
  if (btn.getAttribute('data-slide'))
    currentSlide = btn.getAttribute('data-slide');

  if (!currentSlide) return;
  currentSlide = Number(currentSlide.split('-')[1]);

  if (btn.getAttribute('data-name') === 'prev' && currentSlide >= 2)
    currentSlide--;
  else if (btn.getAttribute('data-name') === 'next' && currentSlide <= 3)
    currentSlide++;
  else if (btn.getAttribute('data-name') === 'prev' && currentSlide <= 1)
    currentSlide = 4;
  else if (btn.getAttribute('data-name') === 'next' && currentSlide >= 4)
    currentSlide = 1;

  window.sessionStorage.setItem('currentSlide', `slide-${currentSlide}`);
  currentSlide = `slide-${currentSlide}`;

  interval = setInterval(() => {
    currentSlide = Number(currentSlide.split('-')[1]);
    if (currentSlide > 3) currentSlide = 0;
    currentSlide++;
    console.log('test');
    window.sessionStorage.setItem('currentSlide', `slide-${currentSlide}`);
    currentSlide = `slide-${currentSlide}`;
  }, 5000);

  const opts = {
    root: reviewScroll,
    rootMargin: '0px',
    threshold: 0.75,
  };

  const cbf = (entries, observer) => {
    entries.forEach((entry) => {
      console.log(entry);
      let distance = 0,
        speed = 0.1;
      if (entry.isIntersecting) {
        currentSlide = entry.target.dataset.slide;
        let timeOut = undefined;

        console.log(entry.boundingClientRect.width);
      }
    });
  };

  const observer = new IntersectionObserver(cbf, opts);
  const totalDistance = reviewsWrap.getBoundingClientRect().width;
  reviewAll.forEach((element) => {
    observer.observe(element);
  });
}
