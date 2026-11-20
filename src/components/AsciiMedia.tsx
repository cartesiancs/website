/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useRef } from "react";

// Darkest to brightest, the same glyph ramp as the About hero's ASCII art.
const RAMP =
  " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

// Glyph colours from dim to bright, sampled from the About hero.
const BANDS = [
  "#26405c",
  "#335c8a",
  "#4a7db5",
  "#7ba6cf",
  "#b9d3df",
  "#eef2f2",
];

const MONO =
  'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';

// Width of one glyph cell in CSS pixels; rows are taller than they are wide.
const CELL_W = 4;
const CELL_RATIO = 1.7;

// The scan that first draws the picture runs left to right, with a band of
// random glyphs at its leading edge.
const SCAN_MS = 1100;
const SCAN_EDGE = 12;

// Redraw rate for video and the pointer shimmer. The scan runs at full rate.
const FRAME_MS = 1000 / 30;

// Radius around the pointer, in CSS pixels, where glyphs brighten and flicker.
const LENS_PX = 56;

export type AsciiSource = {
  src: string;
  kind: "image" | "video";
  // Light pictures (a white map) are flipped so their background stays empty.
  // "auto" flips only the frames that are mostly light, for videos that cut
  // between dark and white scenes.
  invert?: boolean | "auto";
  // Crops in further than the box needs, e.g. 1.5 keeps two thirds.
  zoom?: number;
  // Unsharp mask strength. Lifts edges in soft, low-contrast pictures.
  sharpen?: number;
  // The luminance drawn as the dimmest and the brightest glyph.
  levels?: [number, number];
  // Which part of the picture survives the crop to the box, 0-1 on each axis.
  focus?: [number, number];
};

type AsciiMediaProps = {
  source: AsciiSource;
  // The box's width divided by its height.
  aspect: number;
  // Nothing is drawn until this turns true; then the scan runs once.
  start: boolean;
  label: string;
};

const boxStyle = css({
  position: "relative",
  width: "100%",
  overflow: "hidden",
});

const canvasStyle = css({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  display: "block",
});

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

type Engine = { start: () => void; stop: () => void };

function createEngine(
  box: HTMLDivElement,
  canvas: HTMLCanvasElement,
  source: AsciiSource,
): Engine {
  const ctx = canvas.getContext("2d")!;
  const sampler = document.createElement("canvas");
  const sctx = sampler.getContext("2d", { willReadFrequently: true })!;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [lo, hi] = source.levels ?? [0, 1];
  const [focusX, focusY] = source.focus ?? [0.5, 0.5];
  const zoom = source.zoom ?? 1;
  const sharpen = source.sharpen ?? 0;

  let media: HTMLImageElement | HTMLVideoElement | null = null;
  let ready = false;
  let wanted = false;
  let started = false;
  let visible = false;
  let disposed = false;

  let width = 0;
  let height = 0;
  let cols = 0;
  let rows = 0;
  let cellH = 0;
  let originX = 0;
  let originY = 0;
  let lum = new Float32Array(0);
  let blurred = new Float32Array(0);
  // One row of glyph codes per colour band, joined into a string per draw.
  let bandRows: Uint16Array[] = [];

  let scanStart = 0;
  let lastFrame = 0;
  let raf = 0;
  let pointer: { x: number; y: number } | null = null;

  const layout = () => {
    width = box.clientWidth;
    height = box.clientHeight;
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Size the font so one glyph's advance is exactly one cell, whichever
    // monospace face the system picks.
    ctx.font = `100px ${MONO}`;
    const advance = ctx.measureText("M").width / 100 || 0.6;
    const fontSize = CELL_W / advance;
    cellH = CELL_W * CELL_RATIO;
    cols = Math.floor(width / CELL_W);
    rows = Math.floor(height / cellH);
    originX = (width - cols * CELL_W) / 2;
    originY = (height - rows * cellH) / 2;
    ctx.font = `${fontSize}px ${MONO}`;
    ctx.textBaseline = "middle";

    sampler.width = cols;
    sampler.height = rows;
    lum = new Float32Array(cols * rows);
    blurred = new Float32Array(cols * rows);
    bandRows = BANDS.map(() => new Uint16Array(cols));
    sample();
  };

  // Reads the picture's brightness into one value per cell, cropped to the
  // box like object-fit: cover.
  const sample = () => {
    if (!ready || !media || !cols || !rows) return;
    const mw =
      media instanceof HTMLVideoElement ? media.videoWidth : media.naturalWidth;
    const mh =
      media instanceof HTMLVideoElement
        ? media.videoHeight
        : media.naturalHeight;
    if (!mw || !mh) return;

    const boxAspect = (cols * CELL_W) / (rows * cellH);
    let sw = mw;
    let sh = mw / boxAspect;
    if (sh > mh) {
      sh = mh;
      sw = mh * boxAspect;
    }
    sw /= zoom;
    sh /= zoom;
    sctx.imageSmoothingQuality = "high";
    sctx.clearRect(0, 0, cols, rows);
    sctx.drawImage(
      media,
      (mw - sw) * focusX,
      (mh - sh) * focusY,
      sw,
      sh,
      0,
      0,
      cols,
      rows,
    );
    const data = sctx.getImageData(0, 0, cols, rows).data;
    let total = 0;
    for (let i = 0; i < lum.length; i++) {
      const p = i * 4;
      lum[i] =
        (0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2]) / 255;
      total += lum[i];
    }
    const invert =
      source.invert === "auto"
        ? total / lum.length > 0.5
        : Boolean(source.invert);
    for (let i = 0; i < lum.length; i++) {
      const alpha = data[i * 4 + 3] / 255;
      lum[i] = (invert ? 1 - lum[i] : lum[i]) * alpha;
    }

    if (sharpen) {
      // 3x3 box blur, then push each cell away from its neighbourhood.
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let sum = 0;
          let n = 0;
          for (let y = Math.max(0, r - 1); y <= Math.min(rows - 1, r + 1); y++) {
            for (let x = Math.max(0, c - 1); x <= Math.min(cols - 1, c + 1); x++) {
              sum += lum[y * cols + x];
              n++;
            }
          }
          blurred[r * cols + c] = sum / n;
        }
      }
      for (let i = 0; i < lum.length; i++) {
        lum[i] += sharpen * (lum[i] - blurred[i]);
      }
    }

    for (let i = 0; i < lum.length; i++) {
      const l = (lum[i] - lo) / (hi - lo);
      lum[i] = l < 0 ? 0 : l > 1 ? 1 : l;
    }
  };

  const draw = (now: number) => {
    ctx.clearRect(0, 0, width, height);
    if (!started || !cols) return;

    const progress = reduce
      ? 1
      : Math.min(1, Math.max(0, (now - scanStart) / SCAN_MS));
    // The edge travels past the last column so the noise band clears it.
    const front = easeInOut(progress) * (cols + SCAN_EDGE);
    const lens = pointer && !reduce ? pointer : null;
    const last = RAMP.length - 1;

    for (let r = 0; r < rows; r++) {
      for (const row of bandRows) row.fill(32);
      const used = new Array(BANDS.length).fill(false);
      const y = originY + (r + 0.5) * cellH;

      for (let c = 0; c < cols; c++) {
        if (c >= front) break;
        let l = lum[r * cols + c];
        let random = false;

        if (c >= front - SCAN_EDGE) {
          l = 0.45 + Math.random() * 0.55;
          random = true;
        } else if (lens) {
          const dx = originX + (c + 0.5) * CELL_W - lens.x;
          const dy = y - lens.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LENS_PX) {
            const k = 1 - d / LENS_PX;
            l = Math.min(1, l + k * 0.45);
            random = Math.random() < k * 0.5;
          }
        }

        if (l < 0.03) continue;
        const glyph = random
          ? 1 + Math.floor(Math.random() * last)
          : Math.round(l * last);
        if (glyph === 0) continue;
        const band = Math.min(BANDS.length - 1, Math.floor(l * BANDS.length));
        bandRows[band][c] = RAMP.charCodeAt(glyph);
        used[band] = true;
      }

      for (let b = 0; b < BANDS.length; b++) {
        if (!used[b]) continue;
        ctx.fillStyle = BANDS[b];
        ctx.fillText(
          String.fromCharCode.apply(null, bandRows[b] as unknown as number[]),
          originX,
          y,
        );
      }
    }
  };

  const tick = (now: number) => {
    raf = 0;
    if (disposed || !visible || !started) return;
    const scanning = !reduce && now - scanStart < SCAN_MS + 50;
    const video = media instanceof HTMLVideoElement && !reduce;
    const moving = scanning || video || pointer !== null;

    if (scanning || now - lastFrame >= FRAME_MS) {
      if (video) sample();
      draw(now);
      lastFrame = now;
    }
    if (moving) raf = requestAnimationFrame(tick);
  };

  const kick = () => {
    if (!raf && visible && started && !disposed) {
      raf = requestAnimationFrame(tick);
    }
  };

  const begin = () => {
    if (started || !ready || !wanted) return;
    started = true;
    scanStart = performance.now();
    if (media instanceof HTMLVideoElement && !reduce && visible) {
      media.play().catch(() => {});
    }
    if (reduce) draw(scanStart);
    kick();
  };

  const onReady = () => {
    if (disposed) return;
    ready = true;
    sample();
    begin();
  };

  if (source.kind === "video") {
    const video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    if (reduce) {
      // It never plays, so show a frame from a little way in rather than
      // the first one, which is often blank.
      video.addEventListener(
        "loadedmetadata",
        () => {
          video.addEventListener("seeked", onReady, { once: true });
          video.currentTime = Math.min(video.duration * 0.25, 5);
        },
        { once: true },
      );
    } else {
      video.addEventListener("loadeddata", onReady, { once: true });
    }
    video.src = source.src;
    // A detached video only fetches once asked to.
    video.load();
    media = video;
  } else {
    const image = new Image();
    image.decoding = "async";
    image.src = source.src;
    image
      .decode()
      .then(onReady)
      .catch(() => {});
    media = image;
  }

  const resizeObserver = new ResizeObserver(() => {
    layout();
    draw(performance.now());
  });
  resizeObserver.observe(box);

  // Only spend frames (and video decoding) while the box is on screen.
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (media instanceof HTMLVideoElement && started && !reduce) {
      if (visible) media.play().catch(() => {});
      else media.pause();
    }
    kick();
  });
  intersectionObserver.observe(box);

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const rect = box.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    kick();
  };
  const onPointerLeave = () => {
    pointer = null;
    // One more frame to put the glyphs under the lens back.
    lastFrame = 0;
    kick();
  };
  box.addEventListener("pointermove", onPointerMove);
  box.addEventListener("pointerleave", onPointerLeave);

  return {
    start() {
      wanted = true;
      begin();
    },
    stop() {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      box.removeEventListener("pointermove", onPointerMove);
      box.removeEventListener("pointerleave", onPointerLeave);
      if (media instanceof HTMLVideoElement) {
        media.pause();
        media.removeAttribute("src");
        media.load();
      }
    },
  };
}

// Draws a picture or a looping video as coloured ASCII glyphs, like the About
// hero. It scans in from the left once `start` turns true, and glyphs near the
// mouse brighten and flicker.
export function AsciiMedia({ source, aspect, start, label }: AsciiMediaProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);

  useEffect(() => {
    const engine = createEngine(boxRef.current!, canvasRef.current!, source);
    engineRef.current = engine;
    return () => {
      engine.stop();
      engineRef.current = null;
    };
    // The source objects are module constants, so the src identifies them.
  }, [source.src]);

  useEffect(() => {
    if (start) engineRef.current?.start();
  }, [start]);

  return (
    <div ref={boxRef} css={boxStyle} style={{ aspectRatio: String(aspect) }}>
      <canvas ref={canvasRef} css={canvasStyle} role="img" aria-label={label} />
    </div>
  );
}
