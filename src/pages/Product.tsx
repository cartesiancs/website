/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";

const SCRIPT_FONT = '"Playball", "Snell Roundhand", cursive';

type ProductItem = {
  name: string;
  // Internal routes start with "/"; anything else opens in a new tab.
  href: string;
  video?: string;
  image?: string;
};

const PRODUCTS: ProductItem[] = [
  { name: "Landlink", href: "https://landlink.sh/", video: "/v-landlink.mp4" },
  { name: "CartCut", href: "/cartcut", image: "/i-nugget.webp" },
  {
    name: "Map3d",
    href: "https://github.com/cartesiancs/map3d",
    image: "/i-map3d.webp",
  },
];

const pageStyle = css({
  width: "100%",
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
});

const mainStyle = css({
  flex: 1,
  width: "100%",
  // 1342px card row plus the side padding.
  maxWidth: "calc(1342px + 4rem)",
  margin: "0 auto",
  padding: "7.5rem 2rem 8rem",
  boxSizing: "border-box",
  "@media (max-width: 600px)": {
    padding: "4.5rem 1rem 5rem",
  },
});

const titleStyle = css({
  margin: 0,
  fontFamily: SCRIPT_FONT,
  fontWeight: 400,
  fontSize: "clamp(3.5rem, 14vw, 6rem)",
  lineHeight: 1.25,
  color: "#ffffff",
  textAlign: "center",
});

const gridStyle = css({
  marginTop: "5.75rem",
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "clamp(1.25rem, 3.5vw, 3.3rem)",
  "@media (max-width: 900px)": {
    gridTemplateColumns: "minmax(0, 1fr)",
    maxWidth: "460px",
    margin: "3rem auto 0",
  },
});

const cardStyle = css({
  position: "relative",
  display: "block",
  aspectRatio: "412 / 423",
  borderRadius: "34px",
  border: "3px solid #2e2f34",
  backgroundColor: "#101012",
  overflow: "hidden",
  textDecoration: "none",
  // Keeps the rounded corners clipping the media in Safari while it scales.
  isolation: "isolate",
  transition: "border-color 0.3s ease",
  ":hover, :focus-visible": {
    borderColor: "#4a4b52",
  },
  ":hover .product-media, :focus-visible .product-media": {
    transform: "scale(1.04)",
  },
  ":focus-visible": {
    outline: "2px solid #d9dae1",
    outlineOffset: "3px",
  },
});

const mediaStyle = css({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  display: "block",
  transition: "transform 0.6s ease",
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
});

// Stills are filled with background-image instead of <img> so a missing asset
// falls back to the dark card rather than a broken image.
const stillStyle = css({
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

const overlayStyle = css({
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to top, rgba(16, 16, 18, 0.85) 0%, rgba(16, 16, 18, 0.35) 35%, rgba(16, 16, 18, 0) 60%)",
});

const nameStyle = css({
  position: "absolute",
  left: "40px",
  bottom: "40px",
  margin: 0,
  fontSize: "clamp(1.75rem, 2.7vw, 2.5rem)",
  fontWeight: 800,
  lineHeight: 1.2,
  color: "#d9dae1",
  "@media (max-width: 900px)": {
    left: "32px",
    bottom: "32px",
    fontSize: "2rem",
  },
});

function CardLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("/")) {
    return (
      <Link css={cardStyle} to={href}>
        {children}
      </Link>
    );
  }
  return (
    <a css={cardStyle} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function ProductCard({ item }: { item: ProductItem }) {
  return (
    <CardLink href={item.href}>
      {item.video ? (
        <video
          className="product-media"
          css={mediaStyle}
          src={item.video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      ) : (
        <div
          className="product-media"
          css={[mediaStyle, stillStyle]}
          style={{ backgroundImage: `url("${item.image}")` }}
        />
      )}
      <div css={overlayStyle} />
      <h2 css={nameStyle}>{item.name}</h2>
    </CardLink>
  );
}

export function Product() {
  return (
    <div css={pageStyle}>
      <TopNavBar />

      <main css={mainStyle}>
        <h1 css={titleStyle}>Products</h1>
        <div css={gridStyle}>
          {PRODUCTS.map((item) => (
            <ProductCard key={item.name} item={item} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
