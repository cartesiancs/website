/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";
import { FrameLines } from "../components/FrameLines";
import {
  ServerSignature,
  SiteLink,
  TypedTitle,
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

// A bare directory listing of the open positions, in the same early web
// dress as the Product page but without the pictures.

type Role = {
  // The role's page is /career/<slug>.
  slug: string;
  team: string;
  type: string;
  location: string;
};

const ROLES: Role[] = [
  {
    slug: "product-engineer",
    team: "Engineering",
    type: "Full-time",
    location: "Remote",
  },
];

const TITLE = "Index of /career";

// Name, Team, Type, Location; team and type drop out on narrow screens.
const listingColumnsStyle = css({
  gridTemplateColumns: "5ch 18ch 12ch 10ch minmax(0, 1fr)",
  "@media (max-width: 640px)": {
    gridTemplateColumns: "5ch 18ch minmax(0, 1fr)",
  },
});

// The signature sits right under the listing, as on an Apache index.
const listingHeaderStyle = css({
  paddingBottom: 0,
  "@media (max-width: 640px)": {
    paddingBottom: 0,
  },
});

const signatureStyle = css({
  paddingTop: "0.5rem",
  paddingBottom: "12rem",
  "@media (max-width: 640px)": {
    paddingTop: "0.5rem",
    paddingBottom: "8rem",
  },
});

export function Career() {
  const typedChars = useTyping(TITLE);
  const shown = typedChars >= TITLE.length;
  const row = (index: number) => typed(shown, index);
  const rowCss = [listingRowStyle, listingColumnsStyle];
  const last = 3 + ROLES.length;

  return (
    <div css={pageStyle}>
      <TopNavBar />

      <main css={mainStyle}>
        <FrameLines />

        <header css={[frameColumnStyle, headerStyle, listingHeaderStyle]}>
          <TypedTitle text={TITLE} count={typedChars} />

          <div css={listingStyle} role="table" aria-label="Open positions">
            <div
              css={[...rowCss, listingHeadStyle, row(0).css]}
              style={row(0).style}
              role="row"
            >
              <span role="columnheader" aria-label="Type" />
              <span role="columnheader">Name</span>
              <span role="columnheader" className="wide">
                Team
              </span>
              <span role="columnheader" className="wide">
                Type
              </span>
              <span role="columnheader">Location</span>
            </div>
            <hr css={[hrStyle, row(1).css]} style={row(1).style} />

            <div css={[...rowCss, row(2).css]} style={row(2).style} role="row">
              <span css={iconCellStyle} role="cell">
                [UP]
              </span>
              <span role="cell">
                <SiteLink href="/" css={linkStyle}>
                  Parent Directory
                </SiteLink>
              </span>
              <span role="cell" className="wide" />
              <span role="cell" className="wide" />
              <span role="cell" />
            </div>
            {ROLES.map((role, index) => (
              <div
                key={role.slug}
                css={[...rowCss, row(3 + index).css]}
                style={row(3 + index).style}
                role="row"
              >
                <span css={iconCellStyle} role="cell">
                  [DIR]
                </span>
                <span role="cell">
                  <SiteLink href={`/career/${role.slug}`} css={linkStyle}>
                    {role.slug}/
                  </SiteLink>
                </span>
                <span role="cell" className="wide">
                  {role.team}
                </span>
                <span role="cell" className="wide">
                  {role.type}
                </span>
                <span role="cell">{role.location}</span>
              </div>
            ))}
            <hr css={[hrStyle, row(last).css]} style={row(last).style} />
          </div>
        </header>

        <div css={row(last + 1).css} style={row(last + 1).style}>
          <ServerSignature css={signatureStyle} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
