# Screen recording

CartCut's screen recorder captures your screen or a single window, optionally with your camera and microphone, and drops the result straight onto the timeline. With **Auto Zoom** on, it also zooms in smoothly wherever you clicked, so tutorials and demos are easy to follow without editing.

## Open the recorder

1. Open **Utilities** (the sliders icon) and click **Screen Recorder**.
2. A recorder icon appears in the macOS menu bar at the top of the screen, labelled **CartCut Recorder**. All of the recorder's controls are in its menu.

## Set up a recording

Click the recorder icon in the menu bar to see these options:

| Menu | Choices |
| --- | --- |
| **Screen** | Each display, then each open window. Choose what to record |
| **Camera** | **None**, or a camera to show in a bubble |
| **Microphone** | **None**, or a microphone to record your voice |
| **System Audio** | Records the computer's own sound. Available on Windows only |
| **Bubble** | Camera bubble size (Small, Medium, Large), corner and shape (Circle or Rounded Rectangle) |
| **Quality** | 720p, 1080p or Native (sharpest); 15, 30 or 60 fps |
| **Auto Zoom** | On (default) or Off |
| **Drawing Mode** | Lets you draw on the screen while recording |
| **Open Recordings Folder** | Shows where recordings are saved |
| **Close Recorder** | Removes the recorder from the menu bar |

The defaults are Native quality at 30 fps, Auto Zoom on, and no camera or microphone.

## Record

1. Choose **Start Recording**. A 3, 2, 1 countdown appears, then recording begins.
2. Do what you want to show. Click normally; with Auto Zoom on, every click becomes a zoom.
3. While recording, the menu offers **Pause** / **Resume**, **Stop Recording** and **Discard Recording**.
4. Choose **Stop Recording**.

### Draw on screen

Turn on **Drawing Mode** from the recorder menu to draw over your screen while you talk. A toolbar offers pen colors and **Erase**. Click **Done**, press <kbd>Esc</kbd>, or turn Drawing Mode off in the menu to stop drawing. Drawings are recorded into the video.

## After you stop

A dialog in the editor shows CartCut finishing the file, reading where the pointer went, planning the zooms, and adding the clip to the timeline. **Skip the zoom** leaves the recording without zooms.

When it finishes, the recording is placed at the **playhead**, fitted to your project's frame, and a message says how many zooms were added.

- Zooms are ordinary **Size** and **Position** keyframes on the clip, so you can adjust or delete any of them. See [Keyframe animation](keyframes).
- The camera bubble and drawings are part of the picture; your microphone is part of the clip's sound.
- The file itself is saved in **Movies ▸ Cartcut Recordings** in your home folder.

## Permissions

The first time you record, macOS asks to allow CartCut to record the screen.

1. Open **System Settings ▸ Privacy & Security ▸ Screen & System Audio Recording** (called **Screen Recording** on older versions of macOS).
2. Turn on **CartCut**.
3. Quit and reopen CartCut.

If **Start Recording** is greyed out with *No screen is available to capture*, or recordings come out black, this permission is missing. Camera and microphone are asked for the first time you choose them.

> [!NOTE]
> Click detection for Auto Zoom works on macOS. CartCut records only where and when you click, never what you type.

## The simple recorder

**Utilities ▸ Record** is an older, simpler recorder that opens as a tab over the preview: choose a screen, then **record** and **stop**. It has no zooms, camera or drawing. The result is also placed at the playhead.
