# Cutting and trimming

Most editing is cutting: removing the parts you do not want and putting the rest in order. This page covers every way to do that.

## Split a clip

Splitting cuts one clip into two at the playhead.

1. Click the clip to select it.
2. Move the playhead to where you want the cut.
3. Press <kbd>⌘</kbd> <kbd>D</kbd>, click **Split at playhead** in the toolbar, or choose **Clip ▸ Split at Playhead**.

Only **selected** clips are split. To cut several tracks at the same point, select all of their clips first (for example with <kbd>Shift</kbd> + click).

## Trim a clip

Trimming changes where a clip starts or ends.

1. Move the pointer over the left or right edge of a clip until the pointer changes.
2. Drag the edge.

A video or audio clip cannot be trimmed past the beginning or end of its source file, and an edge stops when it meets the neighbouring clip.

## Move a clip

| To | Do this |
| --- | --- |
| Move it earlier or later | Drag the middle of the clip left or right |
| Move it to another track | Press and hold the clip for a moment (or hold <kbd>Option</kbd>), then drag it up or down |
| Move it one track up or down | <kbd>↑</kbd> or <kbd>↓</kbd> |
| Cancel a drag | <kbd>Esc</kbd> while dragging |

A clip can only move to a track of the same kind, and a move that would overlap another clip is refused, so nothing gets covered by accident.

## Delete a clip

| To | Do this |
| --- | --- |
| Delete and leave a gap | Select it and press <kbd>Delete</kbd>, or right-click ▸ **Remove** |
| Delete and close the gap | Right-click ▸ **Remove and close gap**. Later clips on the same track slide left |

## Copy, cut and paste

| Action | Shortcut |
| --- | --- |
| Copy | <kbd>⌘</kbd> <kbd>C</kbd> |
| Cut | <kbd>⌘</kbd> <kbd>X</kbd> |
| Paste | <kbd>⌘</kbd> <kbd>V</kbd> |

Pasted clips land at the playhead, keep their spacing relative to each other, and go back on their original tracks when there is room. To duplicate a clip, copy it, move the playhead and paste.

## Merge clips

If you split a clip and change your mind, select the two neighbouring pieces and click **Merge clips** in the toolbar (or **Clip ▸ Merge Clips**). Only pieces that came from the same clip can be merged.

## Undo and redo

| Action | Shortcut |
| --- | --- |
| Undo | <kbd>⌘</kbd> <kbd>Z</kbd> |
| Redo | <kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>Z</kbd> |

Each action is one step: a whole drag, a paste of several clips, or a cut across tracks is undone in one go.

> [!TIP]
> Cutting a long interview by hand? [Automatic captions](auto-captions) can find and remove the silent gaps for you.
