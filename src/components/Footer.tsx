/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import type { ReactNode } from "react";
import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const BORDER = "rgb(36, 36, 43)";
const MUTED = "#8a8a8f";
const TEXT = "#e6e6eb";

const footerStyle = css({
  width: "100%",
  backgroundColor: "#0d0e0f",
  color: TEXT,
  borderTop: `1px solid ${BORDER}`,
  // Clips the full-width divider line below.
  overflow: "hidden",
});

const frameStyle = css({
  position: "relative",
  maxWidth: "1024px",
  margin: "0 auto",
  boxSizing: "border-box",
  background:
    "radial-gradient(35% 80% at 15% 0%, rgba(255, 255, 255, 0.1), transparent)",
  "@media (min-width: 1024px)": {
    borderLeft: `1px solid ${BORDER}`,
    borderRight: `1px solid ${BORDER}`,
  },
});

const gridStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
  gap: "1.5rem",
  padding: "1rem",
});

const brandStyle = css({
  gridColumn: "span 6",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  paddingTop: "1.25rem",
  "@media (min-width: 768px)": {
    gridColumn: "span 4",
  },
});

const brandNameStyle = css({
  width: "max-content",
  fontSize: "1.1rem",
  lineHeight: "1.25rem",
  fontWeight: 600,
  letterSpacing: "-0.01em",
  color: "#ffffff",
  textDecoration: "none",
});

const brandTextStyle = css({
  margin: 0,
  maxWidth: "24rem",
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
  fontWeight: 400,
  color: MUTED,
  textWrap: "balance",
});

const socialRowStyle = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
});

const socialButtonStyle = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "2.25rem",
  height: "2.25rem",
  boxSizing: "border-box",
  borderRadius: "0.5rem",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  backgroundColor: "rgba(255, 255, 255, 0.045)",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  color: TEXT,
  transition: "background-color 0.2s ease, color 0.2s ease",
  svg: {
    width: "1rem",
    height: "1rem",
  },
  ":hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    color: "#ffffff",
  },
  ":focus-visible": {
    outline: "none",
    borderColor: "#737373",
    boxShadow: "0 0 0 3px rgba(115, 115, 115, 0.5)",
  },
});

const columnStyle = css({
  gridColumn: "span 3",
  width: "100%",
  "@media (min-width: 768px)": {
    gridColumn: "span 1",
  },
});

const columnTitleStyle = css({
  display: "block",
  margin: 0,
  fontSize: "0.75rem",
  lineHeight: "1rem",
  fontWeight: 400,
  color: MUTED,
});

const linkListStyle = css({
  marginTop: "0.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

const linkStyle = css({
  width: "max-content",
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
  color: TEXT,
  textDecoration: "none",
  ":hover": {
    textDecoration: "underline",
  },
});

// A 1px line that runs past the frame's side borders to both screen edges.
const dividerStyle = css({
  position: "relative",
  height: "1px",
  "::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "50%",
    width: "100vw",
    height: "1px",
    transform: "translateX(-50%)",
    backgroundColor: BORDER,
  },
});

const bottomStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  padding: "1rem 0",
});

const copyrightStyle = css({
  margin: 0,
  textAlign: "center",
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
  fontWeight: 300,
  color: MUTED,
});

type FooterLink = {
  title: string;
  href: string;
  external?: boolean;
};

const company: FooterLink[] = [
  { title: "About", href: "/" },
  { title: "Product", href: "/product" },
  { title: "Fleet", href: "/fleet" },
  { title: "Career", href: "/career" },
  { title: "Sponsors", href: "/sponsors" },
  { title: "Contact", href: "mailto:info@cartesiancs.com" },
];

const writing: FooterLink[] = [
  { title: "Blog", href: "https://blog.cartesiancs.com/", external: true },
];

const columns = [
  { title: "Company", links: company },
  { title: "Writing", links: writing },
];

const socialLinks: { title: string; href: string; icon: ReactNode }[] = [
  { title: "GitHub", href: "https://github.com/cartesiancs", icon: <FaGithub /> },
  {
    title: "LinkedIn",
    href: "https://www.linkedin.com/company/cartesiancs",
    icon: <FaLinkedinIn />,
  },
  { title: "X", href: "https://x.com/cartesiancs", icon: <FaXTwitter /> },
  {
    title: "YouTube",
    href: "https://www.youtube.com/@cartesiancs",
    icon: <FaYoutube />,
  },
  {
    title: "Instagram",
    href: "https://www.instagram.com/cartesinc",
    icon: <FaInstagram />,
  },
];

function Footer() {
  return (
    <footer css={footerStyle}>
      <div css={frameStyle}>
        <div css={gridStyle}>
          <div css={brandStyle}>
            <a css={brandNameStyle} href="/">
              cartesiancs
            </a>
            <p css={brandTextStyle}>to explore strange new worlds.</p>
            <div css={socialRowStyle}>
              {socialLinks.map(({ title, href, icon }) => (
                <a
                  key={title}
                  css={socialButtonStyle}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={title}
                  title={title}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {columns.map(({ title, links }) => (
            <div key={title} css={columnStyle}>
              <span css={columnTitleStyle}>{title}</span>
              <div css={linkListStyle}>
                {links.map((link) => (
                  <a
                    key={link.title}
                    css={linkStyle}
                    href={link.href}
                    {...(link.external && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div css={dividerStyle} aria-hidden="true" />

        <div css={bottomStyle}>
          <p css={copyrightStyle}>
            &copy; {new Date().getFullYear()} cartesiancs
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
