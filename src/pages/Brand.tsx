/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect } from "react";
import { ArrowDown } from "lucide-react";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";
import { FrameLines } from "../components/FrameLines";
import {
  LINE,
  MONO,
  MUTED,
  ServerSignature,
  SiteLink,
  TypedTitle,
  articleStyle,
  buttonStyle,
  dividerStyle,
  frameColumnStyle,
  headerStyle,
  hrStyle,
  iconCellStyle,
  linkStyle,
  listingHeadStyle,
  listingRowStyle,
  listingStyle,
  mainStyle,
  pageStyle,
  typed,
  useTyping,
} from "../components/EarlyWeb";

// The brand kit, laid out as a directory listing of downloadable files with
// a preview of each logo underneath.

type Asset = {
  // File name in public/brand.
  file: string;
  // Size in bytes, shown in the listing. Update it when the file changes.
  bytes: number;
  description: string;
  // What the preview's caption says about the format.
  format: string;
  // Transparent logos are previewed on a checkerboard.
  transparent: boolean;
  // How much of the preview the file fills, so a tightly cropped file shows
  // its logo at the same size as the padded ones.
  previewScale?: number;
};

const ASSETS: Asset[] = [
  {
    file: "cartesiancs-logo.svg",
    bytes: 540,
    description: "Logo, white, vector",
    format: "SVG · Vector · Transparent",
    transparent: true,
    // The SVG has no margin; the PNGs' logo spans 832 of their 1024 px.
    previewScale: 832 / 1024,
  },
  {
    file: "cartesiancs-logo.png",
    bytes: 10314,
    description: "Logo, white on transparent, 1024 × 1024",
    format: "PNG · 1024 × 1024 · Transparent",
    transparent: true,
  },
  {
    file: "cartesiancs-logo-on-black.png",
    bytes: 11284,
    description: "Logo on black, 1024 × 1024",
    format: "PNG · 1024 × 1024",
    transparent: false,
  },
];

// Every file above in one archive. Rebuild it when any of them changes:
//   cd public/brand && zip -X -j cartesiancs-brand.zip cartesiancs-logo*
const ARCHIVE = { file: "cartesiancs-brand.zip", bytes: 13667 };

const TITLE = "Index of /brand";

const brandPath = (file: string) => `/brand/${file}`;

// Apache's size column: bytes under 1K, then whole kilobytes.
function formatSize(bytes: number) {
  return bytes < 1024 ? String(bytes) : `${Math.round(bytes / 1024)}K`;
}

// Icon, Name, Size, Description; the description drops out on narrow screens.
const listingColumnsStyle = css({
  gridTemplateColumns: "5ch 30ch 5ch minmax(0, 1fr)",
  "> span:nth-of-type(3)": {
    textAlign: "right",
  },
  "@media (max-width: 640px)": {
    gridTemplateColumns: "5ch minmax(0, 1fr) 5ch",
  },
});

const downloadAllStyle = css({
  marginTop: "1.5rem",
});

const galleryHeaderStyle = css({
  paddingBottom: "3rem",
  "@media (max-width: 640px)": {
    paddingBottom: "2.5rem",
  },
});

// One cell per logo. The 1px gap shows the line colour behind the cells, so
// every cell keeps the same width.
const galleryStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "1px",
  backgroundColor: LINE,
  "@media (max-width: 760px)": {
    gridTemplateColumns: "minmax(0, 1fr)",
  },
});

const tileStyle = css({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  margin: 0,
  backgroundColor: "#0d0e0f",
});

const previewStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  aspectRatio: "1",
  padding: "18%",
  boxSizing: "border-box",
  "@media (max-width: 760px)": {
    padding: "22%",
  },
});

// The usual grey checkerboard for "nothing here", darkened for the page.
const checkerStyle = css({
  backgroundColor: "#141418",
  backgroundImage:
    "conic-gradient(#1c1c21 0 25%, transparent 0 50%, #1c1c21 0 75%, transparent 0)",
  backgroundSize: "24px 24px",
});

const previewImageStyle = css({
  display: "block",
  width: "100%",
  height: "auto",
});

// The logo on black carries its own square, so it gets a border to show
// its edge against the page.
const opaqueImageStyle = css({
  outline: "1px solid #2a2a30",
});

const captionStyle = css({
  padding: "1rem 1.5rem 1.5rem",
  borderTop: `1px solid ${LINE}`,
  fontFamily: MONO,
  fontSize: "0.75rem",
  lineHeight: 1.7,
  "@media (max-width: 640px)": {
    padding: "1rem 1rem 1.5rem",
  },
});

const captionNameStyle = css({
  overflowWrap: "anywhere",
});

const captionFormatStyle = css({
  color: MUTED,
});

const signatureStyle = css({
  paddingTop: "1.25rem",
});

export function Brand() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Brand | cartesiancs";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const typedChars = useTyping(TITLE);
  const shown = typedChars >= TITLE.length;

  // Every line below the title types in after the one before it, in page
  // order.
  let count = 0;
  const line = () => typed(shown, count++);
  const head = line();
  const topRule = line();
  const up = line();
  const rows = ASSETS.map(() => line());
  const archiveRow = line();
  const bottomRule = line();
  const downloadAll = line();
  const tiles = ASSETS.map(() => line());
  const signature = line();

  const rowCss = [listingRowStyle, listingColumnsStyle];

  return (
    <div css={pageStyle}>
      <TopNavBar />

      <main css={mainStyle}>
        <FrameLines />

        <header css={[frameColumnStyle, headerStyle, galleryHeaderStyle]}>
          <TypedTitle text={TITLE} count={typedChars} />

          <div css={listingStyle} role="table" aria-label="Brand files">
            <div
              css={[...rowCss, listingHeadStyle, head.css]}
              style={head.style}
              role="row"
            >
              <span role="columnheader" aria-label="Type" />
              <span role="columnheader">Name</span>
              <span role="columnheader">Size</span>
              <span role="columnheader" className="wide">
                Description
              </span>
            </div>
            <hr css={[hrStyle, topRule.css]} style={topRule.style} />

            <div css={[...rowCss, up.css]} style={up.style} role="row">
              <span css={iconCellStyle} role="cell">
                [UP]
              </span>
              <span role="cell">
                <SiteLink href="/" css={linkStyle}>
                  Parent Directory
                </SiteLink>
              </span>
              <span role="cell">-</span>
              <span role="cell" className="wide" />
            </div>

            {ASSETS.map((asset, index) => (
              <div
                key={asset.file}
                css={[...rowCss, rows[index].css]}
                style={rows[index].style}
                role="row"
              >
                <span css={iconCellStyle} role="cell">
                  [IMG]
                </span>
                <span role="cell">
                  <a css={linkStyle} href={brandPath(asset.file)} download>
                    {asset.file}
                  </a>
                </span>
                <span role="cell">{formatSize(asset.bytes)}</span>
                <span role="cell" className="wide">
                  {asset.description}
                </span>
              </div>
            ))}

            <div
              css={[...rowCss, archiveRow.css]}
              style={archiveRow.style}
              role="row"
            >
              <span css={iconCellStyle} role="cell">
                [CMP]
              </span>
              <span role="cell">
                <a css={linkStyle} href={brandPath(ARCHIVE.file)} download>
                  {ARCHIVE.file}
                </a>
              </span>
              <span role="cell">{formatSize(ARCHIVE.bytes)}</span>
              <span role="cell" className="wide">
                All of the above
              </span>
            </div>

            <hr css={[hrStyle, bottomRule.css]} style={bottomRule.style} />
          </div>

          <div css={[downloadAllStyle, downloadAll.css]} style={downloadAll.style}>
            <a css={buttonStyle} href={brandPath(ARCHIVE.file)} download>
              Download all
              <ArrowDown />
            </a>
          </div>
        </header>

        <div css={dividerStyle} aria-hidden="true" />
        <section
          css={[frameColumnStyle, galleryStyle]}
          aria-label="Logo previews"
        >
          {ASSETS.map((asset, index) => (
            <figure
              key={asset.file}
              css={[tileStyle, tiles[index].css]}
              style={tiles[index].style}
            >
              <div css={[previewStyle, asset.transparent && checkerStyle]}>
                <img
                  css={[
                    previewImageStyle,
                    !asset.transparent && opaqueImageStyle,
                  ]}
                  src={brandPath(asset.file)}
                  alt={asset.description}
                  width={1024}
                  height={1024}
                  style={
                    asset.previewScale
                      ? { width: `${asset.previewScale * 100}%` }
                      : undefined
                  }
                />
              </div>
              <figcaption css={captionStyle}>
                <div css={captionNameStyle}>
                  <a css={linkStyle} href={brandPath(asset.file)} download>
                    {asset.file}
                  </a>
                </div>
                <div css={captionFormatStyle}>{asset.format}</div>
              </figcaption>
            </figure>
          ))}
        </section>
        <div css={dividerStyle} aria-hidden="true" />

        <div css={signature.css} style={signature.style}>
          <ServerSignature css={signatureStyle} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
