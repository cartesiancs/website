/** @jsxImportSource @emotion/react */
import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { css, keyframes } from "@emotion/react";

// Time between one word starting to appear and the next.
const STEP_MS = 12;

// Only the starting frame is defined, so each word settles on its own
// styles and the finished page looks exactly as it would without the effect.
const writeIn = keyframes`
  from {
    opacity: 0;
    filter: blur(6px);
  }
`;

const pieceStyle = css({
  animation: `${writeIn} 0.9s ease-out backwards`,
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
});

function reveal(node: ReactNode, next: () => number): ReactNode {
  return Children.map(node, (child) => {
    if (typeof child === "string") {
      return child.split(/(\s+)/).map((part) =>
        part.trim() === "" ? (
          part
        ) : (
          <span css={pieceStyle} style={{ animationDelay: `${next()}ms` }}>
            {part}
          </span>
        ),
      );
    }

    if (!isValidElement(child)) return child;

    // Tags with text inside are opened up so their words appear one by one.
    const element = child as ReactElement<{ children?: ReactNode }>;
    const isContainer =
      typeof element.type === "string" || element.type === Fragment;
    if (isContainer && element.props.children != null) {
      return cloneElement(
        element,
        undefined,
        reveal(element.props.children, next),
      );
    }

    // Images, buttons and other components appear as a single piece.
    return (
      <span css={pieceStyle} style={{ animationDelay: `${next()}ms` }}>
        {element}
      </span>
    );
  });
}

// Fades its text in word by word, as if it were being written out.
export function TextReveal({ children }: { children: ReactNode }) {
  let index = 0;
  return <>{reveal(children, () => index++ * STEP_MS)}</>;
}
