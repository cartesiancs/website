/** @jsxImportSource @emotion/react */
import { useCallback } from "react";
import { css } from "@emotion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { create } from "zustand";

// How long the old page takes to fade out before the route changes. The nav
// bar times its own exit to finish within it.
export const LEAVE_MS = 450;
// How long the new page takes to fade in once it is on screen.
const ENTER_MS = 600;

const useCurtainStore = create<{ covered: boolean }>(() => ({
  covered: false,
}));

const curtainStyle = css({
  position: "fixed",
  inset: 0,
  // Just under the nav bar (100000), so its links stay visible while they
  // animate over the fade.
  zIndex: 99999,
  backgroundColor: "#0d0e0f",
});

// A sheet in the page background colour that hides the page while it changes.
export function PageCurtain() {
  const covered = useCurtainStore((state) => state.covered);

  return (
    <div
      aria-hidden
      css={curtainStyle}
      style={{
        opacity: covered ? 1 : 0,
        pointerEvents: covered ? "auto" : "none",
        transition: `opacity ${covered ? LEAVE_MS : ENTER_MS}ms ease`,
      }}
    />
  );
}

// Like navigate(), but fades the current page out first and the next one in
// after. onArrive runs once the new page is showing.
export function usePageTransition() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useCallback(
    (to: string, onArrive?: () => void) => {
      useCurtainStore.setState({ covered: true });

      window.setTimeout(() => {
        if (to === pathname) {
          // Same page: start it over from the top. ScrollToTop only runs
          // when the path changes.
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        } else {
          navigate(to);
        }
        useCurtainStore.setState({ covered: false });
        onArrive?.();
      }, LEAVE_MS);
    },
    [navigate, pathname]
  );
}
