# Devices and entities

Everything Vessel monitors is described by devices and entities. A **device** is a physical thing, such as a drone, a weather station or a camera. An **entity** is one value or stream that device produces, such as its position, its temperature or its video feed. This page shows how to create both, how state is stored, and how a real device authenticates and sends data.

## How they fit together

| | Device | Entity |
| --- | --- | --- |
| Represents | A piece of hardware | One reading or stream from that hardware |
| Identified by | A **Device ID** you choose, such as `drone-01` | An **Entity ID** you choose, such as `drone-01-gps` |
| Holds | Name, manufacturer, model, and an access token | Platform, type, configuration, and a history of states |
| Shown on | The Devices page | Dashboards, the map, flows |

One device can have many entities. A drone might have a GPS entity, a battery entity and a video entity, all under the same device.

## The Devices page

Open it with **Devices** in the sidebar, under **Devices**. The page has two cards side by side:

- **Devices** lists every device. Click a row to select it.
- **Entities** lists the entities of the selected device. It stays empty until you select a device.

## Devices

### Create a device

1. On the **Devices** card, click **New Device**.
2. Enter a **Device ID** and, if you like, the other fields described below.
3. Click **Save**.

| Field | Meaning |
| --- | --- |
| **Device ID** | Required. The name the hardware identifies itself with, so keep it short and stable |
| **Name** | The name shown in lists |
| **Manufacturer (optional)** | For your reference |
| **Model (optional)** | For your reference |

### Edit or delete a device

Click **⋯** at the end of the device's row:

- **Edit** changes the Device ID, name, manufacturer and model. Click **Save Changes**.
- **Key** manages the device's access token. See [Device tokens](#device-tokens).
- **Delete** removes the device after you confirm. The confirmation warns that the device and all its entities are deleted permanently.

> [!WARNING]
> If you change a device's **Device ID**, the hardware must send the new ID from then on. Requests with the old ID are rejected.

## Entities

### Create an entity

1. Select a device on the **Devices** card.
2. On the **Entities** card, click **New Entity**.
3. Fill in the fields described below.
4. Click **Save**.

| Field | Meaning |
| --- | --- |
| **Entity ID** | Required. It starts filled in with the device ID and a hyphen, such as `drone-01-`. Spaces become hyphens as you type |
| **Friendly Name** | The label on cards. It is generated from the Entity ID as you type, and you can overwrite it |
| **Platform (Protocol)** | How the data arrives. See [Platforms](#platforms) |
| **Type** | What kind of data it is. See [Types](#types) |
| **Configuration (JSON)** | Platform settings, such as the topic to listen on. See [Configuration](#configuration) |

If the configuration is not valid JSON, Vessel shows *Invalid JSON format. Please check the syntax.* and does not save.

### Platforms

| Platform in the menu | Data arrives by |
| --- | --- |
| **MQTT** | Messages on an MQTT topic |
| **RTP over UDP** | RTP packets the device pushes to Vessel |
| **RTSP** | Vessel pulling video from an RTSP camera |
| **HTTP** | The device posting values to Vessel's HTTP API |

Entities created by [integrations](integrations), such as Home Assistant, ROS 2 or RTL-SDR, use their own platforms and are set up for you.

### Types

| Type | Use it for | Effect |
| --- | --- | --- |
| **NONE** | Anything that needs no special handling | Shown as a plain value card |
| **TEXT** | Text or numeric readings | Shown as a plain value card |
| **GPS** | Positions | Shown as a marker on the [Map](map#entities-on-the-map) |
| **VIDEO** | Video streams | Shown with a **Play Video** button |
| **AUDIO** | Audio streams | Shown with a **Play Audio** button |

**VIDEO** gets a player card with the **RTP over UDP** and **RTSP** platforms, and **AUDIO** with **RTP over UDP**.

### Configuration

The configuration is a JSON object. Vessel reads these keys:

| Key | Used by | Meaning |
| --- | --- | --- |
| `state_topic` | **MQTT**, **HTTP**, **RTP over UDP** | The topic this entity listens on |
| `rtsp_url` | **RTSP** | The camera's RTSP address |

For example, an HTTP temperature entity:

```json
{
  "state_topic": "station-01-temperature"
}
```

An RTSP camera:

```json
{
  "rtsp_url": "rtsp://192.168.1.50:554/stream1"
}
```

### Edit or delete an entity

Click **⋯** at the end of the entity's row:

- **Edit** opens the same fields as when you created it. Click **Save Changes**.
- **Delete** removes the entity after you confirm. This cannot be undone.

Topic changes take effect immediately. You do not need to restart the server.

## State

An entity's **state** is its latest value, stored as text. A thermometer's state might be `21.4`, a GPS entity's `lat=37.5665,lng=126.9780`. Every update is saved with the time it arrived, and the time it last changed to a different value.

When a new state arrives, Vessel pushes it to every open dashboard, so cards update without a reload.

> [!NOTE]
> A card only updates live once its entity has at least one state. When an entity receives its very first value, reload the page to see it.

### State history

On a plain value card, click the value. A panel opens with:

- **First** and **Last**: when the oldest and newest states arrived.
- **Changes**: how many states are stored.
- A timeline with one dot per state. Hover over a dot to see its value and time.
- A list of every state, newest first.

Vessel keeps every state it receives. Each update is stored, even if the value did not change.

## Device tokens

A device proves who it is with an access token. Each device has at most one active token. Vessel stores only a hash of it, so the token itself is shown once, when it is issued.

### Issue a token

1. On the **Devices** card, click **⋯** on the device's row and choose **Key**.
2. In the **Access Token** dialog, click **Issue Token**.
3. Copy the token with the copy button and store it on the device.
4. Click **I have copied the token**.

> [!IMPORTANT]
> The token cannot be shown again. If you lose it, issue a new one.

### Re-issue or revoke a token

When a device has a token, the **Access Token** dialog shows *Token is active* and when it was created.

- **Re-issue** creates a new token and replaces the old one. The old token stops working at once.
- **Revoke** deletes the token after you confirm. The device can no longer send data until you issue a new one.

### Authenticate a request

A device sends two headers with every HTTP request:

| Header | Value |
| --- | --- |
| `Authorization` | `Bearer <token>` |
| `X-Device-Id` | The device's **Device ID** |

Vessel looks up the device by its ID and checks the token against that device's stored hash. If either is wrong, or the device has no active token, the request is rejected.

## Sending data from a device

How a device sends data depends on the entity's platform. In the examples below, Vessel runs on `192.168.1.10` on its default port, `6174`.

### Over HTTP

Use an entity with platform **HTTP** and a `state_topic`. The device posts the new state to `/api/states/` followed by that topic:

```bash
curl -X POST http://192.168.1.10:6174/api/states/station-01-temperature \
  -H "Authorization: Bearer YOUR_DEVICE_TOKEN" \
  -H "X-Device-Id: station-01" \
  -H "Content-Type: application/json" \
  -d '{"state": "21.4"}'
```

The body is a JSON object with one field, `state`, which must be a string. Send numbers as text, such as `"21.4"`.

> [!TIP]
> Vessel answers `200` with `{"status":"true"}` even when no HTTP entity uses that topic. If a value does not appear, check that the topic in the URL matches the entity's `state_topic` exactly.

### Over MQTT

Use an entity with platform **MQTT** and a `state_topic`. Vessel's MQTT client subscribes to every topic on the broker it is connected to, and each message on that topic becomes the entity's new state. The payload is stored as text, so it must be valid UTF-8.

Device tokens are not used for MQTT. Access is controlled by the broker. See [MQTT](mqtt) for connecting Vessel to a broker.

### Video and audio

Cameras and microphones use the **RTP over UDP** or **RTSP** platforms. RTP devices register with their token first, then push packets. RTSP cameras need no token, because Vessel connects to them. Both are covered step by step in [Streams and recordings](streams-and-recordings).

## GPS entities

To put a device on the map, create an entity with type **GPS** and a platform that suits the device, for example **HTTP** with a `state_topic`. Then have the device send states that contain `lat=` and `lng=` with decimal degrees:

```bash
curl -X POST http://192.168.1.10:6174/api/states/drone-01-gps \
  -H "Authorization: Bearer YOUR_DEVICE_TOKEN" \
  -H "X-Device-Id: drone-01" \
  -H "Content-Type: application/json" \
  -d '{"state": "lat=37.5665,lng=126.9780"}'
```

The marker appears the next time the [Map](map#entities-on-the-map) page opens.

## Related pages

```cards
Streams and recordings | streams-and-recordings | Connect cameras and microphones.
MQTT | mqtt | Send entity states over MQTT.
Dashboards | dashboard | See entity cards and state history.
Map | map | See GPS entities as markers.
```
