/** @jsxImportSource @emotion/react */

import type { ReactNode } from "react";
import { css } from "@emotion/react";
import Markdown, { type ReactRenderer } from "marked-react";
import { SpeakButton } from "./SpeakButton";

// marked-react prints inline HTML as plain text, so the markdown docs use a
// `<speak src="..." />` tag to place a pronunciation button instead.
const SPEAK_TAG = /^<speak\s+src="([^"]+)"\s*\/?>$/;

const renderer = {
  html(this: ReactRenderer, html: ReactNode) {
    const match =
      typeof html === "string" ? html.trim().match(SPEAK_TAG) : null;
    if (!match) return html;
    return <SpeakButton key={`speak-${this.elementId}`} src={match[1]} />;
  },
};

export function MarkdownContent({ content }: { content?: string }) {
  return (
    <div
      css={css({
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100%",
        width: "100%",
      })}
    >
      <div
        css={css({
          display: "flex",
          padding: "1rem",
          maxWidth: "600px",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          paddingTop: "2rem",
          gap: "1rem",
          width: "100%",
        })}
      >
        <div
          css={css({
            paddingTop: "1.5rem",
            minHeight: "100%",
            padding: "1rem",
          })}
        >
          <Markdown renderer={renderer}>{content}</Markdown>
        </div>
      </div>
    </div>
  );
}
