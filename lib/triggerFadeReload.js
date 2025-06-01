export function triggerFadeReload(router) {
  const fade = document.querySelector('.pageFade');
  document.body.classList.add('reloading');

  if (fade) {
    fade.style.opacity = '1';
    fade.style.pointerEvents = 'all';
    fade.style.transition = 'none';

    void fade.offsetWidth;

    fade.style.transition = 'opacity 1.1s ease-out';
    fade.style.opacity = '0';

    setTimeout(() => {
      router.replace(router.asPath);
    }, 100);
  } else {
    router.replace(router.asPath);
  }
}
