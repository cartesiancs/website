# Troubleshooting and FAQ

## Common problems

### My clip does not show in the preview

- **Is a clip on a higher track covering it?** The top track is in front. Hide tracks one at a time with their eye button to find out.
- **Is its track hidden?** A track with its eye turned off is invisible in the preview and the export.
- **Is it past the end?** Clips to the right of the red line are outside the project. Raise **Duration** in [Project settings](project-settings).
- **Is it off the frame?** Check its **Position** and **Size**. A video added to a project with a different resolution may sit partly outside the frame.

### The exported video is too long, too short, or ends in black

The export is always exactly as long as **Settings ▸ Canvas ▸ Duration**. Set it to the length of your edit.

### "N media files could not be found"

The project's media was moved, renamed or deleted after it was added. Put the files back where they were. Next time, keep media in the same folder as the `.ngt` file so the folder can be moved as a whole. See [Saving and Auto Save](saving-and-autosave#where-your-media-lives).

### Playback stutters

Heavy footage, such as 4K, high frame rate or Retina screen recordings, can be too much to decode in real time. Create proxies with **Utilities ▸ Proxy Media**. Exports still use the originals. See [Proxy Media](utilities#proxy-media).

### I cannot edit the timeline

If the Automatic Caption panel is open, the timeline is locked until you click **Apply** or close the panel. The track menus show a padlock while this is the case.

If keyboard shortcuts do nothing, check that the **padlock** in the preview toolbar (**Lock keyboard shortcuts**) is not turned on.

### On-device captions are greyed out

On-device transcription needs macOS 26 or later. On older versions, add an OpenAI API key in the ⚡ panel's **OpenAI API** tab and use **OpenAI**. See [Automatic captions](auto-captions).

### Screen recordings are black, or Start Recording is greyed out

CartCut does not have permission to record the screen. Turn it on in **System Settings ▸ Privacy & Security**, then quit and reopen CartCut. See [Screen recording](screen-recording#permissions).

### The text I added is not visible

Make sure the text track is **above** the video track. Use the track's **⋮ ▸ Move up**.

### Export fails

Read the error message. If it mentions FFmpeg, choose **About ▸ Setting ▸ Reinstall FFmpeg**. If another export is running, wait for it to finish.

### I lost unsaved work

Open **File ▸ Auto Save**. If a recovery point is listed, choose it. See [Recover unsaved work](saving-and-autosave#recover-unsaved-work).

## Frequently asked questions

### Is CartCut really free?

Yes. There is no subscription, no watermark and no account. CartCut is open source under the MIT license.

### Does CartCut run on Windows or Linux?

Prebuilt downloads are currently macOS only. CartCut can be built from source on Windows and Linux; see the [repository](https://github.com/cartesiancs/cartcut).

### Does my footage get uploaded anywhere?

No. Editing, exporting and on-device captions all happen on your Mac. Media leaves your computer only if you choose OpenAI transcription, or if you connect an AI assistant and ask it to work with your project.

### Can I open my project on another Mac?

Yes. Copy the project folder, including the `.ngt` file and the media inside it, and open the `.ngt` file there. Templates and extensions used by the project need to be installed on that Mac too.

### What frame rate should I use?

Match your footage if you can: 24 or 25 for a film look, 30 for most phone and web video, 60 for smooth motion and screen recordings.

### How do I report a bug or ask for a feature?

Open an issue on [GitHub](https://github.com/cartesiancs/cartcut/issues), or click **?** at the bottom right of the CartCut window and choose **Report Bug**. Bug reports, feature requests and pull requests are all welcome.
