/** @jsxImportSource @emotion/react */
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { css, keyframes } from "@emotion/react";
import { ArrowRight } from "lucide-react";
import { LEAVE_MS, usePageTransition } from "./PageTransition";

const navBarStyle = css({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  zIndex: 100000,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  padding: "1rem 1rem 0",
  transition: "opacity 0.4s ease, transform 0.4s ease, visibility 0.4s",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(13, 14, 15, 0.72)",
    backdropFilter: "blur(12px)",
    // Inverted gradient: opaque at the top (mask fully applied, blur visible),
    // fading to transparent at the bottom.
    WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
    maskImage: "linear-gradient(to bottom, black, transparent)",
    zIndex: -1,
  },
  // Extra gradient layer that fades in while the dropdown is open, so the
  // panel sits on a noticeably deeper falloff instead of bare page content.
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(10, 11, 12, 0.98) 0%, rgba(10, 11, 12, 0.94) 45%, rgba(10, 11, 12, 0.6) 80%, rgba(10, 11, 12, 0) 100%)",
    opacity: 0,
    pointerEvents: "none",
    transition: "opacity 0.45s ease",
    zIndex: -1,
  },
});

const navBarOpenStyle = css({
  "&::after": {
    opacity: 1,
  },
});

const navBarHiddenStyle = css({
  opacity: 0,
  transform: "translateY(-100%)",
  visibility: "hidden",
  pointerEvents: "none",
});

const navListStyle = css({
  display: "flex",
  zIndex: 100000,
  paddingBottom: "1rem",
});

const navItemStyle = css({
  margin: "0 0.5rem",
  fontSize: "0.9rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  transition: "color 0.3s ease",
  zIndex: 100000,
  color: "#bfbfc7",
  "@media (max-width: 600px)": {
    fontSize: "0.8rem",
    margin: "0 0rem",
  },
  ":hover": {
    color: "#ffffff",
  },
  ":hover svg": {
    opacity: 1,
    transform: "translateX(0)",
  },
});

const navItemActiveStyle = css({
  color: "#ffffff",
});

// The items drop in one after another when a page opens, and rise out the
// same way when leaving for another page.
const ITEM_ENTER_STAGGER_MS = 70;
const ITEM_LEAVE_MS = 300;
// Spread so the last item is gone right as the page changes.
const ITEM_LEAVE_STAGGER_MS = (LEAVE_MS - ITEM_LEAVE_MS) / 3;

const itemEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
`;

const itemLeave = keyframes`
  to {
    opacity: 0;
    transform: translateY(-12px);
  }
`;

const navItemEnterStyle = css({
  animation: `${itemEnter} 0.6s cubic-bezier(0.22, 1, 0.36, 1) backwards`,
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
});

const navItemLeaveStyle = css({
  animation: `${itemLeave} ${ITEM_LEAVE_MS}ms ease-in forwards`,
  pointerEvents: "none",
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
});

const arrowIconStyle = css({
  marginLeft: "0.25rem",
  opacity: 0,
  transform: "translateX(-5px)",
  transition: "opacity 0.3s ease, transform 0.3s ease",
  width: "16px",
  height: "16px",
  zIndex: 100000,
});

// grid-template-rows 0fr -> 1fr animates the panel height without hardcoding it.
const panelWrapperStyle = css({
  display: "grid",
  gridTemplateRows: "0fr",
  width: "100%",
  transition: "grid-template-rows 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
  zIndex: 100000,
});

const panelWrapperOpenStyle = css({
  gridTemplateRows: "1fr",
});

const panelInnerStyle = css({
  overflow: "hidden",
  minHeight: 0,
});

const panelContentStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "0.55rem",
  padding: "0 0 1.75rem",
});

const panelLinkStyle = css({
  fontSize: "0.9rem",
  lineHeight: 1.2,
  color: "#8f8f99",
  textDecoration: "none",
  opacity: 0,
  transform: "translateX(-14px)",
  transition:
    "opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), color 0.25s ease",
  ":hover": {
    color: "#ffffff",
  },
  "@media (max-width: 600px)": {
    fontSize: "0.8rem",
  },
});

const panelLinkVisibleStyle = css({
  opacity: 1,
  transform: "translateX(0)",
});

type DropdownLink = {
  name: string;
  link: string;
  external?: boolean;
};

type NavItem = {
  name: string;
  link?: string;
  items?: DropdownLink[];
};

const productItems: DropdownLink[] = [
  { name: "Landlink", link: "https://landlink.sh/", external: true },
  { name: "CartCut", link: "/cartcut" },
  {
    name: "Map3d",
    link: "https://github.com/cartesiancs/map3d",
    external: true,
  },
];

const socialItems: DropdownLink[] = [
  { name: "GitHub", link: "https://github.com/cartesiancs", external: true },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/company/cartesiancs",
    external: true,
  },
];

const navItems: NavItem[] = [
  { name: "Home", link: "/" },
  { name: "Product", link: "/product", items: productItems },
  { name: "Career", link: "/career" },
  { name: "Social", items: socialItems },
];

const SCROLL_THRESHOLD = 8;

const TopNavBar = () => {
  const [visible, setVisible] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [panelOffset, setPanelOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const transitionTo = usePageTransition();
  const lastScrollY = useRef(0);
  const barRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const lastMenu = useRef<string | null>(null);
  if (openMenu) lastMenu.current = openMenu;
  // Keeps the links mounted while the panel collapses, so the closing
  // animation has something to shrink instead of emptying instantly.
  const displayedMenu = openMenu ?? lastMenu.current;
  const openItems =
    navItems.find((item) => item.name === displayedMenu)?.items ?? [];

  // The nav row is centred, so an item's x position depends on the viewport
  // width; measure the open one and indent the panel to line up underneath.
  const measurePanelOffset = useCallback(() => {
    const panel = panelRef.current;
    const trigger = openMenu ? itemRefs.current[openMenu] : null;
    if (!panel || !trigger) return;
    setPanelOffset(
      trigger.getBoundingClientRect().left - panel.getBoundingClientRect().left
    );
  }, [openMenu]);

  useLayoutEffect(() => {
    measurePanelOffset();
    window.addEventListener("resize", measurePanelOffset);
    return () => window.removeEventListener("resize", measurePanelOffset);
  }, [measurePanelOffset]);

  // Links remount when the menu switches, so they start hidden and are only
  // flipped to visible on the next frame; otherwise there is nothing to ease.
  useEffect(() => {
    if (!openMenu) {
      setRevealed(false);
      return;
    }
    setRevealed(false);
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setRevealed(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [openMenu]);

  // Hover cannot open a menu on touch devices, so those get tap-to-toggle.
  useEffect(() => {
    const query = window.matchMedia("(max-width: 600px), (hover: none)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // There is no mouseleave to close a tapped-open menu; watch for a tap
  // outside the bar instead.
  useEffect(() => {
    if (!isMobile || !openMenu) return;
    const onPointerDown = (event: PointerEvent) => {
      const bar = barRef.current;
      if (bar && !bar.contains(event.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isMobile, openMenu]);

  useEffect(() => {
    // App.css sets height:100% + overflow-x:hidden on body, which can make
    // <body> the scroll container instead of the window.
    const getScrollTop = () =>
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    lastScrollY.current = getScrollTop();
    let ticking = false;

    const update = () => {
      ticking = false;
      const currentY = getScrollTop();
      const delta = currentY - lastScrollY.current;

      if (Math.abs(delta) < SCROLL_THRESHOLD) return;

      // Always keep it visible at the very top of the page
      setVisible(currentY <= 0 || delta < 0);
      lastScrollY.current = currentY;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    // Scroll events do not bubble, so listen in the capture phase to catch
    // scrolling on window / documentElement / body alike.
    const options = { capture: true, passive: true } as const;
    window.addEventListener("scroll", onScroll, options);
    return () => window.removeEventListener("scroll", onScroll, options);
  }, []);

  // The panel would otherwise stay open behind a bar that slid out of view.
  useEffect(() => {
    if (!visible) setOpenMenu(null);
  }, [visible]);

  const goTo = (link: string) => {
    if (leaving) return;
    setOpenMenu(null);
    setLeaving(true);
    // The next page brings its own nav bar, so this only matters when the
    // bar stays mounted (same page): the items drop back in.
    transitionTo(link, () => setLeaving(false));
  };

  return (
    <div
      ref={barRef}
      css={[
        navBarStyle,
        openMenu && navBarOpenStyle,
        !visible && navBarHiddenStyle,
      ]}
      onMouseLeave={() => {
        if (!isMobile) setOpenMenu(null);
      }}
    >
      <div css={navListStyle}>
        {navItems.map((item, index) => (
          <div
            key={item.name}
            ref={(node) => {
              itemRefs.current[item.name] = node;
            }}
            css={[
              navItemStyle,
              openMenu === item.name && navItemActiveStyle,
              leaving ? navItemLeaveStyle : navItemEnterStyle,
            ]}
            style={{
              animationDelay: `${
                index * (leaving ? ITEM_LEAVE_STAGGER_MS : ITEM_ENTER_STAGGER_MS)
              }ms`,
            }}
            onMouseEnter={() => {
              if (!isMobile) setOpenMenu(item.items ? item.name : null);
            }}
            onClick={() => {
              // On touch, an item with a page of its own goes straight there;
              // only a menu-only item (Social) toggles its list open.
              if (isMobile && item.items && !item.link) {
                setOpenMenu(openMenu === item.name ? null : item.name);
                return;
              }
              if (item.link) goTo(item.link);
            }}
          >
            {item.name}
            <ArrowRight css={arrowIconStyle} />
          </div>
        ))}
      </div>

      <div
        ref={panelRef}
        css={[panelWrapperStyle, openMenu && panelWrapperOpenStyle]}
      >
        <div css={panelInnerStyle}>
          <div css={panelContentStyle} style={{ paddingLeft: panelOffset }}>
            {openItems.map((link, index) => (
              <a
                key={link.name}
                css={[panelLinkStyle, revealed && panelLinkVisibleStyle]}
                style={{
                  transitionDelay: revealed ? `${index * 70}ms` : "0ms",
                }}
                href={link.link}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                tabIndex={openMenu ? 0 : -1}
                aria-hidden={!openMenu}
                onClick={(event) => {
                  // Modified clicks still open a new tab as usual.
                  const modified =
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey;
                  if (link.external || modified) return;
                  event.preventDefault();
                  goTo(link.link);
                }}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavBar;
