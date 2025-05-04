import Link from 'next/link';
import styles from './navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href="/">
        <img src="/assets/nav/home-1.png" alt="Home" />
      </Link>
      <Link href="/sketchbook">
        <img src="/assets/nav/sketch-1.png" alt="Sketchbook" />
      </Link>
      <Link href="/being">
        <img src="/assets/nav/being-1.png" alt="BEING" />
      </Link>
      <Link href="/superbeing">
        <img src="/assets/nav/superbeing-1.png" alt="SUPERBEING" />
      </Link>
      <a
        href="https://lightwork.art"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/assets/nav/lightwork-1.png" alt="Light Work" />
      </a>
    </nav>
  );
}
