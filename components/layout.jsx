export default function Layout({ children }) {
  return (
    <>
      <nav style={{ padding: '1rem', display: 'flex', gap: '1.5rem', fontWeight: 'bold' }}>
        <a href="/">Sketch</a>
        <a href="/being">BEING</a>
        <a href="/superbeing">SUPERBEING</a>
        <a href="/lightwork">LightWork</a>
      </nav>
      <main>{children}</main>
    </>
  );
}