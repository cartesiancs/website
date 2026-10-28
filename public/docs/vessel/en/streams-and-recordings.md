# Streams and recordings

Vessel takes live video and audio from cameras and microphones, plays it in the browser, and records it to files on the server. This page covers the two ways to get a stream into Vessel, how to watch it, and how to record and play back.

## How streams work

| Direction | Method | Media |
| --- | --- | --- |
| Into Vessel | **RTP over UDP**: the device pushes RTP packets to Vessel | H.264 video or Opus audio |
| Into Vessel | **RTSP**: Vessel connects to the camera and pulls its stream | H.264 video |
| To the browser | **WebRTC**, the default | Video and audio |
| To the browser | **HLS**, over plain HTTP | Video only |

Every stream belongs to an entity. The entity's platform says how the stream arrives, and its type, **VIDEO** or **AUDIO**, says what it carries. See [Devices and entities](devices-and-entities#entities).

Vessel does not re-encode. What the device sends is what the browser plays and what the recording contains, so the device must already produce H.264 or Opus.

> [!NOTE]
> The RTSP puller, recording and HLS all use GStreamer on the server machine. If the server is started with `--debug`, only the web server runs, and neither the RTP receiver nor the RTSP puller starts.

## Send RTP from a device

Use this for cameras, microphones and computers you control, such as a single-board computer running ffmpeg.

### Turn on the RTP receiver

The RTP receiver is off on a new server.

1. Open **Settings** and choose **Config**.
2. Find the `rtp_broker_port` row and choose **Edit** from its actions menu.
3. Check the **Value**. It is the address and UDP port to listen on, `0.0.0.0:5004` by default.
4. Turn on **Enabled** and click **Save Changes**.
5. Restart the Vessel server.

> [!IMPORTANT]
> Configuration changes only take effect after a restart. Make sure UDP port 5004, or the port you chose, is open in the server's firewall.

### Register the stream

Before sending packets, the device asks Vessel for an SSRC, the number that identifies its RTP stream. The device needs a [device token](devices-and-entities#device-tokens).

```bash
curl -X POST http://192.168.1.10:6174/api/streams/register \
  -H "Authorization: Bearer YOUR_DEVICE_TOKEN" \
  -H "X-Device-Id: cam-01" \
  -H "Content-Type: application/json" \
  -d '{"topic": "cam-01-front", "media_type": "video"}'
```

- `topic` is a name you choose for the stream. You will use it again in the entity.
- `media_type` is `video` or `audio`.

The response contains the SSRC to use:

```json
{ "ssrc": 1183920471, "rtp_port": 5004 }
```

Each registration returns a new SSRC. Packets are matched to the stream by SSRC alone, so packets with any other SSRC are ignored.

> [!NOTE]
> `rtp_port` always reports `5004`. If you changed the receiver's port in `rtp_broker_port`, send to the port you configured.

### Send the packets

Send RTP over UDP to the server's address and the receiver port, using the SSRC from the registration. Any dynamic payload type works.

- **Video** must be H.264. Baseline profile works best with WebRTC playback in browsers.
- **Audio** must be Opus at 48 kHz.

With ffmpeg, video from a file looks like this:

```bash
ffmpeg -re -stream_loop -1 -i sample.mp4 -an \
  -c:v libx264 -profile:v baseline -pix_fmt yuv420p \
  -preset ultrafast -tune zerolatency -g 30 \
  -payload_type 102 -ssrc 1183920471 \
  -f rtp rtp://192.168.1.10:5004
```

And Opus audio:

```bash
ffmpeg -re -i input.wav -vn -ar 48000 -ac 1 -c:a libopus -b:a 64k \
  -payload_type 96 -ssrc 1183920471 \
  -f rtp rtp://192.168.1.10:5004
```

The repository's `example/golang` folder has complete programs that register a stream and start ffmpeg for a video file, an audio file and a live microphone.

### Create the entity

The entity tells Vessel which stream to show. Its `state_topic` must be the topic you registered:

```json
{ "state_topic": "cam-01-front" }
```

1. On the **Devices** page, select the device and click **New Entity**.
2. Set **Platform (Protocol)** to **RTP over UDP** and **Type** to **VIDEO** or **AUDIO**.
3. Paste the configuration above into **Configuration (JSON)**, with your topic.
4. Click **Save**.

The entity's card now appears on the main dashboard with a **Play Video** or **Play Audio** button.

> [!WARNING]
> If Vessel receives no packets on a stream for 10 seconds, the stream is marked offline and dropped. Register again to get a new SSRC before you resume sending. A device that restarts should always register again first.

## Pull an RTSP camera

Use this for IP cameras that offer an RTSP address. Vessel connects to the camera itself, so the camera needs no token. The entity's configuration holds the camera's address:

```json
{ "rtsp_url": "rtsp://192.168.1.50:554/stream1" }
```

1. On the **Devices** page, create a device for the camera, select it, and click **New Entity**.
2. Set **Platform (Protocol)** to **RTSP** and **Type** to **VIDEO**.
3. Paste the configuration above into **Configuration (JSON)**, with your camera's address.
4. Click **Save**.

Vessel starts pulling the stream as soon as the entity is saved. If the connection fails, it tries again every 5 seconds. Only the camera's H.264 video is taken; any audio track is ignored.

For RTSP entities, the stream's topic is the RTSP address itself. That is the name you will see in the recordings list.

## Watch live streams

On a stream card, on the main dashboard, on a dynamic dashboard or in a map marker's panel, click **Play Video** or **Play Audio**.

- Video plays muted, with the browser's usual controls.
- Audio plays with a level meter.
- Under the player, the card shows **Online** when packets are arriving and **Offline** when they are not. The status refreshes every 5 seconds.

A browser can play up to 4 video streams and 2 audio streams at once over WebRTC. When the limit is reached, further play buttons show **(Limited)** and are disabled.

### WebRTC and HLS

Vessel can deliver live video to the browser in two ways. The choice applies to every video player in the app.

1. Open **Settings** and choose **Services**.
2. Under **Live streaming**, set **Default stream mode** to **WebRTC** or **HLS**.

| Mode | How it works | Notes |
| --- | --- | --- |
| **WebRTC** | A direct real-time connection between the server and the browser | Lowest delay. Used for audio in both modes |
| **HLS** | The server cuts the video into segments of about 2 seconds that the browser downloads over HTTP | Adds a few seconds of delay. Video only. The button reads **Play Video (HLS)** |

The server stops producing HLS segments for a stream about a minute after the last viewer leaves.

> [!TIP]
> WebRTC uses a public STUN server to find a path between browser and server. If you watch from outside the server's network and video never starts, see [Remote access](remote-access), or switch to **HLS**.

### Analyze a frame

While a video is playing over WebRTC, open the card's **⋮** menu and choose **Analyze Frame**. Vessel captures the current frame and opens the [AI assistant](ai-assistant) with the image attached, ready for your question.

## Record a stream

1. Make sure the stream is online.
2. On its card, open the **⋮** menu and choose **Start Recording**.
3. When you are done, open the same menu and choose **Stop Recording**. A pulsing red dot marks a recording in progress.

Recording happens on the server. It keeps going if you close the browser, until someone stops it from a card or from the Recordings page. Each topic can have one recording at a time.

> [!NOTE]
> If a recording is stopped before any packets arrive, it is marked **Failed**. If the server shuts down while recording, the unfinished recording is marked `abandoned` the next time the server starts.

## Browse and play recordings

Open **Recordings** in the sidebar, under **Devices**. The **Recording History** table lists every recording:

| Column | Shows |
| --- | --- |
| **Topic** | The stream's topic, or the RTSP address |
| **Type** | `video` or `audio` |
| **Duration** | Length of the recording |
| **Size** | File size |
| **Status** | **Recording**, **Completed**, **Failed**, or `abandoned` |
| **Recorded At** | When the recording started |
| **Actions** | Play, stop or delete |

Click the refresh button at the top right to reload the list.

In the **Actions** column:

- **▶** plays a completed recording.
- **■** stops a recording that is still running.
- The trash button deletes a recording and its file after you confirm. A running recording cannot be deleted.

### The player

Video recordings open in a player with play, pause and stop buttons, a strip of thumbnails taken from the video, and a time ruler. Click the thumbnail strip or the ruler to jump to that point.

Audio recordings show a waveform instead of thumbnails. Click the waveform to jump.

Below the player, the dialog shows the recording's duration, size and type.

## Where recordings are stored

Recordings are saved as Matroska (`.mkv`) files under the `recordings` folder in the server's working directory, sorted into folders by date:

```text
recordings/2026/10/28/recording_cam-01-front_091502.mkv
```

The file name is the topic followed by the start time in UTC, as hours, minutes and seconds. Characters that are not allowed in file names, such as `/` and `:`, become `_`, and the topic part is cut to 50 characters.

The files contain the original H.264 or Opus stream, so you can copy them off the server and open them in any player that supports Matroska. Deleting a recording in Vessel also deletes its file.

## Related pages

```cards
Devices and entities | devices-and-entities | Create devices, entities and device tokens.
Dashboards | dashboard | Put stream cards on a dynamic dashboard.
Server configuration | configuration | All server settings, including rtp_broker_port.
Troubleshooting and FAQ | troubleshooting | What to check when a stream does not play.
```
