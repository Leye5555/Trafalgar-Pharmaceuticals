const prev = document.querySelector('.prev'),
  next = document.querySelector('.next'),
  dots = document.querySelectorAll('.dot'),
  reviewScroll = document.querySelector('.reviews-scroll'),
  reviewsWrap = document.querySelector('.reviews-scroll-items'),
  reviewAll = document.querySelectorAll('.reviews-scroll-item'),
  reviewsItem = document.querySelector('.reviews-scroll-item');
let currentSlide = window.sessionStorage.getItem('currentSlide') || 'slide-1';
const lightBg = getComputedStyle(document.documentElement).getPropertyValue(
  '--light-mode-bg-clr'
);
let darkBg = getComputedStyle(document.documentElement).getPropertyValue(
  '--dark-mode-bg-clr'
);
let lightTxt = getComputedStyle(document.documentElement).getPropertyValue(
  '--light-clr'
);
let darkTxt = getComputedStyle(document.documentElement).getPropertyValue(
  '--dark-clr'
);

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

const handleLightMode = (e) => {
  let { mode } = e.target.dataset;
  console.log(mode);
  if (!mode) return;

  if (mode === 'light') {
    document.documentElement.style.setProperty('--light-mode-bg-clr', darkBg);
    document.documentElement.style.setProperty('--dark-clr', lightTxt);
  } else if (mode === 'dark') {
    document.documentElement.style.setProperty('--light-mode-bg-clr', lightBg);
    document.documentElement.style.setProperty('--dark-clr', darkTxt);
  }
  mode = mode === 'light' ? 'dark' : 'light';
  e.target.setAttribute('data-mode', mode);
};

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
