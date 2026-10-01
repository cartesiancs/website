# Saving and Auto Save

A CartCut project is saved as a single `.ngt` file. This page explains how to save and open projects, how CartCut finds your media, and how Auto Save protects unsaved work.

## Save a project

1. Press <kbd>⌘</kbd> <kbd>S</kbd> or choose **File ▸ Save Project**.
2. The first time, pick a name and a folder, then click **Save**.
3. A **Saved** message appears, and the window title changes to show the file's path.

After that, <kbd>⌘</kbd> <kbd>S</kbd> saves to the same file without asking.

To save a copy under a new name, use **File ▸ Save Project As…** (<kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>S</kbd>).

## Open a project

1. Press <kbd>⌘</kbd> <kbd>O</kbd> or choose **File ▸ Open Project…**.
2. Choose a `.ngt` file.

If the project you have open has unsaved changes, CartCut asks you to save it first. This protects you from losing work by accident.

## Where your media lives

A `.ngt` file stores your edit, not your video files. It remembers where each file is on your computer.

- **Do not move or rename media** after adding it to a project. If you do, opening the project shows *N media files could not be found.*
- **Keep a project's media in the same folder as the `.ngt` file** (or a folder inside it). CartCut then also remembers the files relative to the project, so you can move or copy the whole folder to another Mac and it still opens.

> [!TIP]
> A tidy layout: one folder per video, containing the `.ngt` file and a `media` folder with all your clips.

## Auto Save

Auto Save quietly keeps a recovery copy of unsaved work, in case CartCut or your Mac stops unexpectedly.

- It writes about 5 seconds after you stop editing, and at least once a minute while you keep editing.
- It keeps one recovery point per project, not a history.
- When you save with <kbd>⌘</kbd> <kbd>S</kbd>, that project's recovery point is deleted, because it is no longer needed.
- Recovery points nobody uses are cleaned up after 14 days.

Auto Save never overwrites your `.ngt` file. Only <kbd>⌘</kbd> <kbd>S</kbd> does that.

### Recover unsaved work

1. Open CartCut. It starts with an empty project, which is exactly what recovery needs.
2. Open the **File ▸ Auto Save** menu. Each entry shows the project name and when it was written, newest first.
3. Choose the entry you want.
4. The edit is restored, and a message says when the copy was written. The window title shows **Recovered** and **unsaved**.
5. Press <kbd>⌘</kbd> <kbd>S</kbd>. CartCut asks for a new location, so your original file stays untouched until you decide.

If the **Auto Save** menu is greyed out, there is nothing to recover: everything has been saved.

> [!NOTE]
> Recovery only runs on an empty, saved project, because it replaces everything on the timeline. If you have an edit open, save it first.

## Quitting

If you quit with unsaved changes, CartCut asks *Are you sure you want to exit the program?* Choose **No** to go back and save.
