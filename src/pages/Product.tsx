/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Link } from "react-router-dom";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";
import { FrameLines } from "../components/FrameLines";

type ProductItem = {
  name: string;
  // Internal routes start with "/"; anything else opens in a new tab.
  href: string;
};

const PRODUCTS: ProductItem[] = [
  { name: "landlink.sh", href: "https://landlink.sh/" },
  { name: "CartCut", href: "/cartcut" },
  { name: "map3d", href: "https://github.com/cartesiancs/map3d" },
];

const pageStyle = css({
  width: "100%",
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
});

// Fills the space above the footer so the frame lines reach it.
const mainStyle = css({
  position: "relative",
  isolation: "isolate",
  flex: 1,
  width: "100%",
});

// Same column and type as the About page's body copy.
const columnStyle = css({
  width: "100%",
  maxWidth: "600px",
  margin: "0 auto",
  padding: "8rem 1rem 6rem",
  boxSizing: "border-box",
});

// Sized like the About page's section headings.
const titleStyle = css({
  margin: "0 0 1em",
  fontSize: "1.17em",
  fontWeight: 700,
});

const listStyle = css({
  listStyle: "none",
  margin: 0,
  padding: 0,
});

function ProductLink({ item }: { item: ProductItem }) {
  if (item.href.startsWith("/")) {
    return <Link to={item.href}>{item.name}</Link>;
  }
  return (
    <a href={item.href} target="_blank" rel="noreferrer">
      {item.name}
    </a>
  );
}

export function Product() {
  return (
    <div css={pageStyle}>
      <TopNavBar />

      <main css={mainStyle}>
        <FrameLines />

        <div css={columnStyle}>
          <h1 css={titleStyle}>products</h1>
          <ul css={listStyle}>
            {PRODUCTS.map((item) => (
              <li key={item.name}>
                <p>
                  <ProductLink item={item} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
