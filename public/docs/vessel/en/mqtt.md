# MQTT

MQTT is the simplest way to get sensor readings into Vessel. A device publishes a message to an MQTT broker, Vessel picks it up, stores it as the state of an entity and hands it to any running flow that listens on that topic. Flows can publish back to the broker to control devices.

## How Vessel uses MQTT

Vessel does not run a broker of its own. It connects as an MQTT client to a broker you run next to it, such as [Mosquitto](https://mosquitto.org/).

- At startup the server connects to the broker address in the `mqtt_broker_url` setting, with the client ID `rust-internal-client`.
- It subscribes to every topic (`#`), so it sees all messages on the broker.
- A message whose topic matches an entity's `state_topic` becomes that entity's new state.
- Every text message is also passed to running flows, where **Mqtt Subscribe** nodes can react to it.
- **Mqtt Publish** nodes in flows publish through the same connection.

```text
sensor ──publish──▶ broker ◀──subscribe #── Vessel ──▶ entity state, flows
actuator ◀─subscribe── broker ◀──publish── Vessel (Mqtt Publish node)
```

> [!NOTE]
> MQTT is turned off in a fresh installation. Until you enable it, Vessel does not connect to any broker, and MQTT nodes in flows do nothing.

## Set up a broker

Any MQTT 3.1.1 broker works. Vessel connects without a username, password or TLS, so the broker must accept anonymous connections from the Vessel server.

With Mosquitto 2, a minimal `mosquitto.conf` that accepts connections from your network looks like this:

```text
listener 1883
allow_anonymous true
```

Start it with:

```bash
mosquitto -c mosquitto.conf
```

> [!WARNING]
> `allow_anonymous true` lets anyone who can reach port 1883 publish and subscribe. Keep the broker on a trusted network, or bind it to `127.0.0.1` when every device runs on the same machine as Vessel.

## Connect Vessel to the broker

1. Sign in to Vessel and open **Settings ▸ Config**.
2. Find the `mqtt_broker_url` row. Its default value is `localhost:1883`.
3. Open the row's menu and choose **Edit**.
4. Set **Value** to your broker's address in the form `host:port`, for example `192.168.1.20:1883`. Do not add `mqtt://` or any other prefix.
5. Turn on **Enabled** and click **Save Changes**.
6. Restart the Vessel server. The setting is only read at startup.

When the connection works, the server log shows `MQTT Broker is enabled. Connecting to ...` followed by `Internal MQTT client connected and subscribed to all topics.` You can read the log in **Settings ▸ Log**.

> [!IMPORTANT]
> The value must be exactly `host:port`. If it is not, the server stops during startup with `Invalid broker address format`. To recover, start the server with `--debug`, which skips MQTT, fix the value, and start normally again. See [Server configuration](configuration#debug-mode).

The **Setup** page in the sidebar links its first step, **Enable MQTT & UDP**, to the same Config page.

> [!TIP]
> Only one client can use a given client ID at a time. If another program on the broker also connects as `rust-internal-client`, the two will keep disconnecting each other.

## Show MQTT data on an entity

To keep the latest value of a topic, create an entity for it. The full device and entity workflow is described in [Devices and entities](devices-and-entities).

1. Open **Devices** in the sidebar and select or create the device the sensor belongs to.
2. Click **New Entity**.
3. Enter an **Entity ID** and a **Friendly Name**.
4. Set **Platform (Protocol)** to **MQTT**.
5. Pick a **Type**, for example **TEXT** for a plain reading.
6. In **Configuration (JSON)**, set the topic the sensor publishes to:

```json
{
  "state_topic": "home/garage/temperature"
}
```

7. Click **Save**.

From now on, every message on `home/garage/temperature` replaces the entity's state. The entity card on the **Controls** dashboard updates live, and clicking the value opens its history. New and edited entities take effect immediately. You do not need to restart the server.

| Configuration key | What Vessel does with it |
| --- | --- |
| `state_topic` | Messages on this topic become the entity's state |
| `command_topic` | Also recognized. Messages on this topic update the entity's state in the same way |

## Publish a test message

With the broker running and MQTT enabled, publish a message from any machine that can reach the broker:

```bash
mosquitto_pub -h 192.168.1.20 -p 1883 -t home/garage/temperature -m "21.5"
```

The entity's card now shows `21.5`. To watch everything that passes through the broker, including what your flows publish:

```bash
mosquitto_sub -h 192.168.1.20 -p 1883 -t '#' -v
```

A device sends JSON the same way:

```bash
mosquitto_pub -h 192.168.1.20 -t home/garage/env -m '{"temperature":21.5,"humidity":40}'
```

The entity stores the whole message as its state. In a flow, **Mqtt Subscribe** turns it into a JSON object, and **Json Selector** can pick out a single field.

## Topics

Vessel does not reserve or require any topic names. You choose topics when you configure entities and flow nodes, and the same topic can feed an entity and several flows at once.

- Topics are matched exactly, character for character. `home/garage/temperature` does not match `home/garage/+` or `home/#`.
- Payloads must be valid UTF-8 text. Binary payloads are skipped and logged as `Received non-UTF8 payload`.
- Vessel subscribes with QoS 0.
- A common convention is `location/device/measurement`, for example `farm/barn/door`. Vessel works with any scheme.

## Use MQTT in flows

Two nodes in the **Communication** group of the flow editor work with MQTT. Their options are described in the [node reference](flow-nodes#mqtt-publish).

- **Mqtt Subscribe** is a trigger. It runs the flow every time a message arrives on its `topic`. Its `payload` output is the message parsed as JSON, or the plain text if it is not JSON.
- **Mqtt Publish** sends its `payload` input to its `topic`, with a QoS of `0`, `1` or `2` (default `1`) and an optional `retain` flag. Text is sent as-is; other values are sent as JSON.

A typical flow listens to one sensor and commands another device:

```text
Mqtt Subscribe (home/garage/temperature)
  → Logic Operator (operator ">", compared with 30 from a Set Variable node)
  → Branch
  → Mqtt Publish (home/garage/fan/set)
```

If MQTT is not enabled, **Mqtt Publish** logs a warning and sends nothing, and **Mqtt Subscribe** never fires.

## Other ways to send data

MQTT is one of several inputs. Devices that cannot speak MQTT can post states over HTTP with a device token, and audio and video arrive over RTP or RTSP. See [Devices and entities](devices-and-entities) and [Streams and recordings](streams-and-recordings).

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Log says `MQTT Broker is disabled by configuration.` | Turn on **Enabled** for `mqtt_broker_url` and restart |
| Log repeats `MQTT event loop error` | The broker is not reachable at that address, or it refuses anonymous clients |
| Entity stays at `N/A` | The `state_topic` does not exactly match the topic the device publishes to, or the platform is not **MQTT** |
| Flow does not react | The flow is not running, or the **Mqtt Subscribe** topic is not an exact match |

For more help, see [Troubleshooting and FAQ](troubleshooting).

## Related pages

```cards
Devices and entities | devices-and-entities | Create the entities that hold MQTT states.
Node reference | flow-nodes | Every option of Mqtt Publish and Mqtt Subscribe.
Server configuration | configuration | All settings, including mqtt_broker_url.
```
