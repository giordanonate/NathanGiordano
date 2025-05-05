export function triggerFadeReload() {
  const fade = document.querySelector('.pageFade');
  if (fade) {
    fade.style.opacity = '1';
    fade.style.pointerEvents = 'all';
    fade.style.transition = 'none';

    // Force repaint
    void fade.offsetWidth;

    fade.style.transition = 'opacity 1.1s ease-out';
    fade.style.opacity = '0';

    setTimeout(() => {
      window.location.reload();
    }, 50);
  } else {
    window.location.reload();
  }
}
