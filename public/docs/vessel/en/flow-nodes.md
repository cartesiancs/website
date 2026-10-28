# Node reference

This page lists every built-in node in the flow editor, grouped the way the add menu groups them. For each node you will find what it does, its ports, and the options you can set in its **Edit** panel.

Names in bold are the names in the add menu. The canvas shows the internal type in the node header, for example **Mqtt Publish** appears as `MQTT_PUBLISH`. Option names are listed exactly as the **Edit** panel shows them.

> [!NOTE]
> A **trigger** node waits for an outside event, such as a timer tick or an MQTT message, and runs every time it happens. All other nodes run when their inputs arrive. See [how data moves along edges](flow#how-data-moves-along-edges).

## Overview

| Group | Nodes |
| --- | --- |
| Default | Start, Log Message, Show Toast |
| Data | Set Variable, Set Variable With Exec, Type Converter, Rtp Stream In, Decode Opus, Gst Decoder |
| Logic | Calculation, Logic Operator, Interval, Branch, Json Selector, Json Modify |
| Communication | Http Request, Mqtt Publish, Mqtt Subscribe, Dashboard Event Listener, Websocket Send, Websocket On |
| AI/ML | Yolo Detect |
| ROS2 | Ext Ros2 Websocket On, Ext Ros2 Websocket Send (only while the ROS 2 integration is connected) |
| Custom Node | Your own script nodes (see [Custom nodes](custom-nodes)) |

Triggers: **Interval**, **Mqtt Subscribe**, **Dashboard Event Listener**, **Websocket On**, **Rtp Stream In** and **Gst Decoder**.

## Default

### Start

Runs once when the flow starts. Use it to kick off nodes that need an `exec` or `execution` input.

| Port | Direction | Value |
| --- | --- | --- |
| `out` | Output | `null` |

No options.

### Log Message

Prints whatever it receives to the [LOGS panel](flow#the-logs-panel). The line looks like `{"message": <value>}`.

| Port | Direction | Value |
| --- | --- | --- |
| `message` | Input | Any value |

No options, no outputs.

### Show Toast

Shows a toast notification in the browser tab that started the flow. Other tabs and other users do not see it.

| Port | Direction | Value |
| --- | --- | --- |
| `exec` | Input | Any value. Triggers the toast. |
| `out` | Output | The value received on `exec`, passed through |

| Option | Default | Description |
| --- | --- | --- |
| `level` | `info` | `info`, `success`, `warning` or `error` |
| `title` | empty | Optional title |
| `message` | empty | Toast text |
| `durationMs` | `4000` | How long the toast stays, in milliseconds |

## Data

### Set Variable

Outputs a fixed value you type in. Because it has no inputs, it runs once when the flow starts. In flows driven by **Mqtt Subscribe** or **Rtp Stream In**, it also runs again for every incoming message.

| Port | Direction | Value |
| --- | --- | --- |
| `out` | Output | The parsed value |

| Option | Default | Description |
| --- | --- | --- |
| `variableType` | `string` | `string`, `number`, `boolean` or `json` |
| `variable` | empty | The value. Its input field changes with `variableType`. |

Changing `variableType` resets `variable` to a default for that type: `0`, `false` or `{}`. If the text cannot be parsed as the chosen type, the node fails and the error appears in the LOGS panel.

### Set Variable With Exec

The same as **Set Variable**, but it waits for a value on its `exec` input before it outputs. Use it to emit a constant every time something else happens, such as an **Interval** tick.

| Port | Direction | Value |
| --- | --- | --- |
| `exec` | Input | Any value. Triggers the output. |
| `out` | Output | The parsed value |

Options are the same as **Set Variable**.

### Type Converter

Converts a value to another type.

| Port | Direction | Value |
| --- | --- | --- |
| `in` | Input | Any value |
| `out` | Output | The converted value |

| Option | Default | Description |
| --- | --- | --- |
| `targetType` | `string` | `string`, `number` or `boolean` |

How each conversion works:

- **string**: numbers and booleans become their text, `null` becomes `"null"`, objects and arrays become JSON text. Double quotes are removed from the result.
- **number**: numbers pass through, text is parsed as a number, `true` becomes `1` and `false` becomes `0`. Anything else fails.
- **boolean**: the text `true` (any case) becomes `true`, non-zero numbers become `true`. Everything else becomes `false`.

### Rtp Stream In

Trigger. Emits one event for every RTP packet of a stream that the server is receiving. See [Streams and recordings](streams-and-recordings).

| Port | Direction | Value |
| --- | --- | --- |
| `payload` | Output | The packet payload, Base64-encoded |
| `raw_packet` | Output | The whole RTP packet (header and payload), Base64-encoded |

| Option | Default | Description |
| --- | --- | --- |
| `topic` | `default/audio` | Topic of the stream to listen to |

The stream must already exist when the flow starts. Otherwise the trigger does not start and the error is written to the server log.

### Decode Opus

Decodes one Opus audio packet and measures its level. Connect it to the `payload` output of **Rtp Stream In** for an Opus audio stream.

| Port | Direction | Value |
| --- | --- | --- |
| `payload` | Input | Base64-encoded Opus packet |
| `info` | Output | An object with `decibels`, `duration_ms`, `sample_rate` and `channels` |

The packet is decoded as mono at 48,000 Hz. `decibels` is the RMS level in dBFS; silence reports `-120`. No options.

### Gst Decoder

Trigger. Decodes an H.264 RTP video stream into raw RGB frames with GStreamer and emits one event per decoded frame.

| Port | Direction | Value |
| --- | --- | --- |
| `frame` | Output | A frame reference: `{"type": "binary_pointer", "id", "width", "height"}` |

| Option | Default | Description |
| --- | --- | --- |
| `topic` | `go_video_stream_1` | Topic of the video stream to decode |

The frame itself stays in server memory; only a reference travels along the edge. Each frame can be read once, and frames nobody reads are dropped after one to two minutes. If the rest of the flow is slower than the video, frames are skipped. Its main use is feeding **Yolo Detect**.

> [!NOTE]
> The decoding pipeline uses GStreamer's `vtdec` element, Apple's VideoToolbox decoder, so this node needs a server running on macOS with GStreamer installed.

## Logic

### Calculation

Does arithmetic on two numbers.

| Port | Direction | Value |
| --- | --- | --- |
| `a` | Input | Number |
| `b` | Input | Number |
| `number` | Output | The result |

| Option | Default | Description |
| --- | --- | --- |
| `operatorCalc` | `+` | `+`, `-`, `/`, `*` or `%` |

Both inputs must be numbers. Text such as `"12"` fails; convert it first with **Type Converter**.

### Logic Operator

Combines or compares two values and outputs `true` or `false`.

| Port | Direction | Value |
| --- | --- | --- |
| `a` | Input | Boolean or number |
| `b` | Input | Boolean or number |
| `bool` | Output | `true` or `false` |

| Option | Default | Description |
| --- | --- | --- |
| `operator` | `AND` | `AND`, `OR`, `XOR`, `NAND`, `NOR`, `XNOR`, `>`, `<`, `==`, `!=`, `>=`, `<=` |

The logical operators accept booleans or numbers; any non-zero number counts as `true`. The comparison operators need numbers on both inputs.

### Interval

Trigger. Fires as soon as the flow starts and then repeatedly at a fixed interval.

| Port | Direction | Value |
| --- | --- | --- |
| `exec` | Output | `null` on every tick |

| Option | Default | Description |
| --- | --- | --- |
| `interval` | `10` | Number of units between ticks |
| `unit` | `seconds` | `milliseconds`, `seconds` or `minutes` |

### Branch

Routes a value down one of two paths.

| Port | Direction | Value |
| --- | --- | --- |
| `data` | Input | Any value |
| `condition` | Input | Must be a boolean |
| `true_output` | Output | `data`, when `condition` is `true` |
| `false_output` | Output | `data`, when `condition` is `false` |

Only one output fires each time. A `condition` that is not a real boolean, such as `1` or `"true"`, is an error. No options.

### Json Selector

Picks one value out of a JSON object.

| Port | Direction | Value |
| --- | --- | --- |
| `json` | Input | An object or array |
| `value` | Output | The selected value, or `null` if the path does not exist |

| Option | Default | Description |
| --- | --- | --- |
| `path` | `path.to.value` | Dot-separated path. Use numbers for array items, for example `readings.0.temp`. |

### Json Modify

Replaces one value inside a JSON object and outputs the whole object.

| Port | Direction | Value |
| --- | --- | --- |
| `json` | Input | The object to change |
| `data` | Input | The new value |
| `value` | Output | The changed object |

| Option | Default | Description |
| --- | --- | --- |
| `path` | `path.to.value` | Dot-separated path to the value to replace |

The path must already exist in the input. The node does not create new keys.

## Communication

### Http Request

Sends an HTTP request and outputs the response body.

| Port | Direction | Value |
| --- | --- | --- |
| `execution` | Input | Any value. Triggers the request. |
| `result` | Output | The response body, as text |

| Option | Default | Description |
| --- | --- | --- |
| `url` | empty | The full URL |
| `httpMethod` | `GET` | `GET`, `POST`, `DELETE` or `PUT` |

The request is sent without a body. A response with a status other than 2xx is an error. The body comes out as text, so a JSON response has to be parsed before **Json Selector** can read it, for example with a [custom node](custom-nodes).

### Mqtt Publish

Publishes a message to the MQTT broker Vessel is connected to. See [MQTT](mqtt).

| Port | Direction | Value |
| --- | --- | --- |
| `payload` | Input | Any value |

| Option | Default | Description |
| --- | --- | --- |
| `topic` | `default/topic` | Topic to publish to |
| `qos` | `1` | `0`, `1` or `2` |
| `retain` | `false` | Whether the broker keeps the message as the topic's retained message |

Text is published as-is; every other value is published as JSON. Each publish writes `"Publish MQTT Topic"` to the LOGS panel.

### Mqtt Subscribe

Trigger. Emits every message that arrives on one MQTT topic.

| Port | Direction | Value |
| --- | --- | --- |
| `payload` | Output | The message, parsed as JSON when possible, otherwise as text |

| Option | Default | Description |
| --- | --- | --- |
| `topic` | `default/topic` | The topic to listen to |

The topic must match exactly. Wildcards such as `+` and `#` are not expanded.

### Dashboard Event Listener

Trigger. Fires when a widget on a [dashboard](dashboard) sends an event with the same listener ID. On the canvas the node header reads **Dashboard** and the node shows its listener ID.

| Port | Direction | Value |
| --- | --- | --- |
| `payload` | Output | The event object |

| Option | Default | Description |
| --- | --- | --- |
| `listenerId` | `my-listener` | The ID to match. Use letters, digits, `_` and `-`, up to 128 characters. |

The event object contains `listener_id`, `event_id`, `occurred_at`, `dashboard_id`, `group_id`, `item_id`, `component_type`, `action`, `value` and `source_session_id`. The widget's value, for example a slider position, is in `value`; pick it out with **Json Selector**.

### Websocket Send

Opens a WebSocket connection, sends one text message, and closes the connection again.

| Port | Direction | Value |
| --- | --- | --- |
| `payload` | Input | Any value. Text is sent as-is, everything else as JSON. |

| Option | Default | Description |
| --- | --- | --- |
| `url` | `ws://localhost:6174` | WebSocket URL (`ws://` or `wss://`) |

### Websocket On

Trigger. Connects to a WebSocket server and emits every text message it receives.

| Port | Direction | Value |
| --- | --- | --- |
| `payload` | Output | The message, parsed as JSON when possible, otherwise as text |

| Option | Default | Description |
| --- | --- | --- |
| `url` | `ws://localhost:6174` | WebSocket URL to connect to |

If the connection fails or drops, the node retries every 5 seconds. Binary messages are ignored.

> [!TIP]
> The `url` of both WebSocket nodes can contain placeholders in the form `{:key}`. They are replaced with system configuration values when the flow starts. When the matching integrations are set up, `{:home_assistant_url}`, `{:home_assistant_token}`, `{:ros2_websocket_url}`, `{:sdr_host}` and `{:sdr_port}` are filled in automatically. See [Server configuration](configuration) and [Integrations](integrations).

## AI/ML

### Yolo Detect

Runs a YOLO object detection model on a video frame and outputs the objects it found. The model runs on the server's CPU through ONNX.

| Port | Direction | Value |
| --- | --- | --- |
| `frame` | Input | A frame reference from **Gst Decoder** |
| `detections` | Output | An array of detected objects |

| Option | Default | Description |
| --- | --- | --- |
| `model_path` | `assets/yolov8n.onnx` | Path to the ONNX model file on the server |
| `labels_path` | `assets/coco.names` | Path to a text file with one class name per line |
| `confidence_threshold` | `0.5` | Detections below this score are dropped |
| `nms_threshold` | `0.4` | Overlap threshold for removing duplicate boxes |
| `input_size` | `640` | The model's square input size in pixels |

Each detection looks like this. Box coordinates are in pixels of the original frame.

```json
{
  "class": "person",
  "confidence": 0.87,
  "box": { "x1": 112.4, "y1": 40.2, "x2": 298.0, "y2": 410.7 }
}
```

> [!IMPORTANT]
> Vessel does not ship a model. Put your ONNX file and labels file on the server and point `model_path` and `labels_path` at them; relative paths start from the server's working directory. The node expects a YOLOv8-style output layout. The input must come from **Gst Decoder**; other values are rejected.

## ROS2

These two nodes appear in the add menu only while the [ROS 2 integration](integrations) is connected. They are **Websocket On** and **Websocket Send** with the URL locked to `{:ros2_websocket_url}`, which is filled in from the ROS 2 bridge configuration.

| Node | Behaves like | Port |
| --- | --- | --- |
| **Ext Ros2 Websocket On** | Websocket On | `payload` (output) |
| **Ext Ros2 Websocket Send** | Websocket Send | `payload` (input) |

## Custom Node

Nodes you register yourself appear here, listed by their node type. For example, `_math_abs` appears as **Math Abs**. They run a [Rhai](https://rhai.rs) script on the server. See [Custom nodes](custom-nodes).

## Not in the add menu

The server also accepts a `DECODE_H264` node type. It takes a Base64-encoded RTP packet on `payload` and outputs an H.264 frame on `frame`, Base64-encoded. It is not offered in the add menu, and its output is not a frame reference, so it cannot feed **Yolo Detect**.

## Related pages

```cards
The flow editor | flow | Build, run and debug flows.
Custom nodes | custom-nodes | Add your own nodes with Rhai scripts.
MQTT | mqtt | Connecting Vessel to a broker, and topics.
Dashboards | dashboard | Send events from widgets to flows.
```
