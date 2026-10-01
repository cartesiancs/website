# Project settings

Every project has a canvas: its size, frame rate, length and background color. You set them in **Settings ▸ Canvas**, the first thing you see when CartCut opens.

![The Canvas settings](img/settings-canvas.webp "Settings ▸ Canvas.")

## Duration

**Duration** is the length of the finished video, in minutes (**m**) and seconds (**s**).

- The exported video is always exactly this long, no matter where your clips end.
- The red vertical line on the timeline marks the end. Clips past it are not exported.
- Duration does not grow by itself when you add clips. If your edit gets longer, raise it here.

> [!TIP]
> If your export ends early or has black at the end, the Duration is the first thing to check.

## Frame (frame rate)

**Frame** is how many pictures per second the video has, in **fps**. New projects use 60 fps.

- Any whole number from 1 to 240 works. Common choices are 24 (cinematic), 25, 30, 50, 60 and 120.
- A decimal rate such as 29.97 is rounded to the nearest whole number.
- Changing the frame rate never moves your clips. It only changes the grid that edits snap to.
- The current rate is shown at the bottom left of the window.

## Background

**Background** is the color shown wherever no clip covers the canvas. Click the color bar to pick a new one. The default is black.

## Resolution

**Resolution** is the size of the canvas in pixels. The two boxes are **height first, then width**: a 16:9 HD video reads `1080` and `1920`.

The four tiles below set common sizes in one click:

| Tile | Size | Good for |
| --- | --- | --- |
| 16:9 FHD | 1920 × 1080 | YouTube, presentations |
| 16:9 4K | 3840 × 2160 | High-resolution delivery |
| 1:1 Square | 1080 × 1080 | Feed posts |
| 9:16 Mobile | 1080 × 1920 | Shorts, Reels, TikTok |

> [!WARNING]
> Choose the resolution before you start editing. A clip keeps its own position and size when the canvas changes, so after switching from 16:9 to 9:16 you will need to move and resize clips to fit the new frame. See [Position, size and rotation](transform).

## Changing numbers quickly

Every number box in CartCut can be changed two ways:

- **Drag** the number left or right to scrub it.
- **Click** it, type a value and press <kbd>Return</kbd>.

## Where export settings live

The **Export** tab next to **Canvas** holds the video format and quality. It is covered in [Exporting a video](export).
