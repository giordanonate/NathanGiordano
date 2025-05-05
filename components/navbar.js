import { useRouter } from 'next/router';
import styles from './navbar.module.css';
import { triggerFadeReload } from '../lib/triggerFadeReload';

export default function Navbar() {
  const router = useRouter();

  const handleNav = (target) => {
    if (router.pathname === target) {
      triggerFadeReload(); // same page, reload with fade
    } else {
      router.push(target); // different page
    }
  };

  return (
    <nav className={styles.nav}>
      <img
        src="/assets/nav/home-1.png"
        alt="Home"
        onClick={() => handleNav('/')}
      />
      <img
        src="/assets/nav/sketch-1.png"
        alt="Sketchbook"
        onClick={() => handleNav('/sketchbook')}
      />
      <img
        src="/assets/nav/being-1.png"
        alt="BEING"
        onClick={() => handleNav('/being')}
      />
      <img
        src="/assets/nav/superbeing-1.png"
        alt="SUPERBEING"
        onClick={() => handleNav('/superbeing')}
      />
      <a
        href="https://lightwork.art"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="/assets/nav/lightwork-1.png"
          alt="Light Work"
        />
      </a>
    </nav>
  );
}
