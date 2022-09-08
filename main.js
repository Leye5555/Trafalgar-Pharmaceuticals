window.sessionStorage.setItem('currentSlide', 'slide-1');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const reviews = document.querySelector('.reviews-carousel');
const container = document.querySelector('.container');
const dots = document.querySelectorAll('.dot');
const reviewScroll = document.querySelector('.reviews-scroll-items');
const totalScrollDistance = reviewScroll.getBoundingClientRect().width;
const reviewAll = document.querySelectorAll('.reviews-scroll-item');
const reviewsItem = document.querySelector('.reviews-scroll-item');
const fixedDistance = reviewsItem.getBoundingClientRect().width;
console.log(fixedDistance);
const SPEED = 0.5;
let timeDelay = null;
let touchDelay = null;
const TOTAL_SLIDES = 4;
let currentSlide = 1;
let distance = 0;
let start;
let animationId = '';

// toggle color schemes
const colorSchemeBtn = document.getElementById('toggleMode');
let { mode } = colorSchemeBtn.dataset;
if (
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
) {
  // dark mode
  mode = 'light';
  colorSchemeBtn.setAttribute('data-mode', mode);
} else if (
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: light)').matches
) {
  // dark mode
  mode = 'dark';
  colorSchemeBtn.setAttribute('data-mode', mode);
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
const lightShadow = getComputedStyle(document.documentElement).getPropertyValue(
  '--light-shadow-clr'
);
const darkShadow = getComputedStyle(document.documentElement).getPropertyValue(
  '--dark-shadow-clr'
);

colorSchemeBtn.addEventListener('click', handleLightMode);

function handleLightMode(e) {
  let { mode } = e.target.dataset;
  if (!mode) return;

  if (mode === 'light') {
    document.documentElement.style.setProperty('--theme-bg-clr', lightBg);
    document.documentElement.style.setProperty('--theme-clr', lightClr);
    document.documentElement.style.setProperty('--theme-font-clr', lightTxt);
    document.documentElement.style.setProperty(
      '--theme-font-clr100',
      lightTxt100
    );
    document.documentElement.style.setProperty(
      '--theme-shadow-clr',
      darkShadow
    );
  } else if (mode === 'dark') {
    document.documentElement.style.setProperty('--theme-bg-clr', darkBg);
    document.documentElement.style.setProperty('--theme-clr', darkClr);
    document.documentElement.style.setProperty('--theme-font-clr', darkTxt);
    document.documentElement.style.setProperty(
      '--theme-shadow-clr',
      lightShadow
    );
  }
  mode = mode === 'light' ? 'dark' : 'light';
  e.target.setAttribute('data-mode', mode);
  e.target.style.backgroundImage =
    mode === 'light'
      ? "url('./assets/light-mode.png')"
      : "url('./assets/dark-mode.png')";
}
// end of color schemes

// start of carousel
prev.addEventListener('click', handleControl);
next.addEventListener('click', handleControl);
dots.forEach((each) => {
  each.addEventListener('click', handleControl);
});

function handleControl(e) {
  window.cancelAnimationFrame(animationId);
  currentSlide = window.sessionStorage.getItem('currentSlide');
  window.sessionStorage.setItem('animeState', 'paused');
  if (!timeDelay) {
    console.log('delay');
    timeDelay = setTimeout(() => {
      window.sessionStorage.setItem('animeState', 'play');
      animationId = increment();
      timeDelay = null;
    }, 5000);
  }

  const btn = e.target;
  if (btn.getAttribute('data-slide'))
    currentSlide = btn.getAttribute('data-slide');

  if (!currentSlide) return;
  currentSlide = Number(currentSlide.split('-')[1]);
  console.log(currentSlide);
  if (btn.getAttribute('data-name') === 'prev' && currentSlide > 1) {
    currentSlide--;
  } else if (btn.getAttribute('data-name') === 'next' && currentSlide <= 3) {
    currentSlide++;
  } else if (btn.getAttribute('data-name') === 'prev' && currentSlide < 2) {
    currentSlide = 4;
  } else if (btn.getAttribute('data-name') === 'next' && currentSlide >= 4) {
    currentSlide = 1;
  }

  window.sessionStorage.setItem('currentSlide', `slide-${currentSlide}`);
}

function increment(timeStamp) {
  const animeState = window.sessionStorage.getItem('animeState');
  if (animeState === null || animeState === 'paused') return;
  if (start === undefined) start = timeStamp;
  const totalDistance = Math.round(fixedDistance * TOTAL_SLIDES);
  const timeElapsed = timeStamp - start;
  reviewScroll.scrollLeft = distance + SPEED * timeElapsed;
  let currentDistance = Math.round(fixedDistance * currentSlide);
  console.log('still running');
  if (reviewScroll.scrollLeft >= currentDistance) {
    console.log('done');
    currentSlide++;
    window.sessionStorage.setItem('currentSlide', `slide-${currentSlide}`);
    console.log(currentSlide);
    window.cancelAnimationFrame(animationId);
    setTimeout(() => {
      start = undefined;
      distance = distance + SPEED * timeElapsed;
      window.requestAnimationFrame(increment);
    }, 5000);
    return;
  }
  if (reviewScroll.scrollLeft >= totalDistance - fixedDistance) {
    window.cancelAnimationFrame(animationId);
    currentSlide = 1;
    window.sessionStorage.setItem('currentSlide', `slide-${currentSlide}`);
    setTimeout(() => {
      start = undefined;
      reviewScroll.scrollLeft = 0;
      distance = 0;
    }, 2000);
    setTimeout(() => window.requestAnimationFrame(increment), 5000);
    return;
  }

  window.requestAnimationFrame(increment);
}

const opts = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
};

const cbf = (entries, observer) => {
  entries.forEach((entry) => {
    console.log(entry.isIntersecting);
    if (entry.isIntersecting) {
      window.sessionStorage.setItem('animeState', 'play');
      animationId = increment();
    } else {
      window.cancelAnimationFrame(animationId);
      window.sessionStorage.setItem('animeState', 'paused');
    }
  });
};

const observer = new IntersectionObserver(cbf, opts);
observer.observe(reviews);

/// touch scroll
reviewScroll.addEventListener('touchmove', () => {
  window.cancelAnimationFrame(animationId);
  window.sessionStorage.setItem('animeState', 'paused');
  if (!touchDelay) {
    console.log('touch delay');
    touchDelay = setTimeout(() => {
      window.sessionStorage.setItem('animeState', 'play');
      animationId = increment();
      touchDelay = null;
    }, 5000);
  }
});
