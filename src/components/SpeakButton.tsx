/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import { AudioLines, Volume2 } from "lucide-react";

const buttonStyle = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "1.5rem",
  height: "1.5rem",
  margin: "0 0.1rem 0 0.35rem",
  padding: 0,
  verticalAlign: "middle",
  border: "1px solid rgb(36, 36, 43)",
  borderRadius: "6px",
  backgroundColor: "transparent",
  color: "#bfbfc7",
  cursor: "pointer",
  transition:
    "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease",
  ":hover": {
    borderColor: "rgb(70, 70, 80)",
    color: "#ffffff",
  },
  '&[data-playing="true"]': {
    borderColor: "rgb(70, 70, 80)",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    color: "#ffffff",
  },
  "& svg": {
    width: "14px",
    height: "14px",
  },
});

type SpeakButtonProps = {
  src: string;
  label?: string;
};

export function SpeakButton({
  src,
  label = "Play pronunciation",
}: SpeakButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  // Stop the clip if the page unmounts while it is still playing.
  useEffect(() => () => audioRef.current?.pause(), []);

  const handleClick = () => {
    // Created on first click so the clip is only downloaded when requested.
    if (!audioRef.current) {
      const audio = new Audio(src);
      audio.addEventListener("playing", () => setPlaying(true));
      audio.addEventListener("pause", () => setPlaying(false));
      audio.addEventListener("ended", () => setPlaying(false));
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.play().catch(() => setPlaying(false));
  };

  return (
    <button
      type="button"
      css={buttonStyle}
      data-playing={playing}
      onClick={handleClick}
      aria-label={label}
      title={label}
    >
      {playing ? <AudioLines /> : <Volume2 />}
    </button>
  );
}
