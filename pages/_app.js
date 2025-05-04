import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="pageWrapper">
      <Component {...pageProps} />
    </div>
  );
}