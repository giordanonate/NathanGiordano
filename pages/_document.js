import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap" rel="stylesheet" />
        <script type="application/ld+json">{`
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://nathangiordano.com/#person",
      "name": "Nathan Giordano",
      "alternateName": "Nate Giordano",
      "jobTitle": "Artist, Motion Designer, 3D Visual Director",
      "description": "Nathan Giordano is an artist, motion designer, and 3D visual director based in Chattanooga, Tennessee. Founder of LightWork visual design studio. His personal work spans fine art, illustration, screen printing, painting, photography, digital art, and 3D sculpture.",
      "url": "https://nathangiordano.com",
      "email": "nate@lightwork.art",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Chattanooga",
        "addressRegion": "TN",
        "addressCountry": "US"
      },
      "sameAs": [
        "https://lightwork.art",
        "https://instagram.com/nategiordano",
        "https://twitter.com/nategio"
      ],
      "knowsAbout": [
        "Motion Design", "3D Art", "Figurative Sculpture", "Screen Printing",
        "Illustration", "Painting", "Photography", "Cinema 4D", "After Effects",
        "AI Art", "Visual Direction", "Brand Film"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://nathangiordano.com/#website",
      "url": "https://nathangiordano.com",
      "name": "Nathan Giordano",
      "description": "Personal catalog of work by Nathan Giordano — artist, motion designer, and 3D visual director based in Chattanooga, TN. Spanning 2D, 3D, photography, painting, drawing, and animation.",
      "publisher": { "@id": "https://nathangiordano.com/#person" }
    }
  ]
}
`}</script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
