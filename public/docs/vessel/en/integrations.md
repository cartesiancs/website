# Integrations

Integrations connect Vessel to systems you already run. Vessel currently ships three: **Home Assistant**, **ROS2** and **RTL-SDR**. Each one is set up with a short wizard and then gets its own view on the dashboard.

## Open the integrations page

Open **Settings ▸ Integration**. The **Integrations** page lists every integration with a status:

- **Connect** appears when the integration is not set up yet. It starts the setup wizard.
- **Configure** appears once it is connected. It opens the **Devices** page with the integration's settings entity selected, so you can change the address or token later.

When the wizard finishes, Vessel stores the connection details as a device with one bridge entity. The connection settings live in that entity's configuration.

| Integration | Device ID | Bridge entity | Stored settings |
| --- | --- | --- | --- |
| Home Assistant | `home_assistant` | `home_assistant.bridge` | `url`, `token` |
| ROS2 | `ros2_bridge` | `ros2.bridge` | `websocket_url` |
| RTL-SDR | `sdr_server` | `sdr.server` | `host`, `port` |

Connected integrations also appear in the dashboard menu next to **Dashboard**. Point to or click **Controls** in the sidebar and pick **Home Assistant**, **ROS2** or **RTL-SDR**.

## Home Assistant

The Home Assistant integration reads the live state of every entity in your Home Assistant instance and shows it in Vessel.

### Before you start

Create a long-lived access token in Home Assistant:

1. In Home Assistant, open your user profile.
2. Under **Long-lived access tokens**, create a token and give it a name such as `Vessel`.
3. Copy the token. Home Assistant shows it only once.

The Vessel server must be able to reach Home Assistant over the network, because the server makes the requests, not your browser.

### Connect Home Assistant

1. Open **Settings ▸ Integration** and click **Connect** next to **Home Assistant**.
2. In **Connect to Home Assistant**, enter the **HA URL**, for example `http://homeassistant.local:8123`. Do not add `/api`.
3. Click **Next**.
4. In **Provide Access Token**, paste the token into **Access Token**.
5. Click **Next**. Vessel saves the integration and shows **Connection Complete!**
6. Click **Finish**.

### The Home Assistant view

Open it from **Controls ▸ Home Assistant**. Each time the view opens, Vessel asks Home Assistant for the current state of all entities. Nothing is copied into Vessel's own entity list.

- Four summary cards: **Total Entities**, **Lights On** (`light.*` entities that are `on`), **Switches On** (`switch.*` entities that are `on`) and **Available Sensors** (`sensor.*` entities that are not `unavailable`).
- An **All Entities** table with **Entity ID**, **State**, **Attributes** and **Last Updated** for every Home Assistant entity.

If the URL or token is wrong, or Home Assistant cannot be reached, the view shows an **Error** message instead.

> [!WARNING]
> The access token is stored in plain text in the bridge entity's configuration. Any Vessel user who can open the **Devices** page can read it. Create a dedicated Home Assistant user for Vessel if you want to limit what the token can do.

## ROS 2

The ROS2 integration connects flows to a ROS 2 system through [rosbridge](https://github.com/RobotWebTools/rosbridge_suite), which exposes ROS topics and services over a WebSocket.

### Before you start

On the ROS 2 machine, install rosbridge and start its WebSocket server:

```bash
ros2 launch rosbridge_server rosbridge_websocket_launch.xml
```

rosbridge listens on port `9090` by default.

### Connect ROS 2

1. Open **Settings ▸ Integration** and click **Connect** next to **ROS2**.
2. The **Prerequisites** step reminds you to start `rosbridge_server`. Click **Next**.
3. In **Enter Bridge Address**, enter the **WebSocket URL**, for example `ws://192.168.1.50:9090`.
4. Click **Next**, then **Finish**.

### Use ROS 2 in flows

While the integration is connected, the flow editor's add menu has a **ROS2** group with two nodes:

- **Ext Ros2 Websocket On** receives messages from rosbridge and starts the flow for each one.
- **Ext Ros2 Websocket Send** sends its input to rosbridge.

Both are WebSocket nodes whose URL is fixed to `{:ros2_websocket_url}`. Vessel fills it in from the bridge entity when the flow starts, so changing the bridge URL takes effect the next time you start the flow. Messages use the [rosbridge protocol](https://github.com/RobotWebTools/rosbridge_suite/blob/ros2/ROSBRIDGE_PROTOCOL.md), which is JSON. See the [node reference](flow-nodes#ros2) for details.

The **Controls ▸ ROS2** view is a short status card with links to **Open flow** and **Integrations**.

## RTL-SDR

The RTL-SDR integration tunes a USB RTL-SDR receiver and plays FM audio from it in the browser. The receiver is reached through `rtl_tcp`, so it can be plugged into a different machine than the Vessel server.

### Before you start

On the machine with the receiver, start `rtl_tcp` so that it accepts connections from the network:

```bash
rtl_tcp -a 0.0.0.0
```

It listens on port `1234` unless you pass another port with `-p`.

### Connect RTL-SDR

1. Open **Settings ▸ Integration** and click **Connect** next to **RTL-SDR**.
2. Read the **RTL-SDR (rtl_tcp) Prerequisites** step and click **Next**.
3. In **Enter Server Host**, enter the **Host**, for example `192.168.1.100`. Use `127.0.0.1` if the receiver is on the Vessel machine.
4. Click **Next**.
5. In **Enter Server Port**, enter the **Port**. If you leave it empty, `1234` is used.
6. Click **Next**, then **Finish**.

### The RTL-SDR view

Open it from **Controls ▸ RTL-SDR**, or click **Open Panel** on the RTL-SDR entity card on the main dashboard.

| Card | What it does |
| --- | --- |
| **Tuner** | Enter a **Frequency (MHz)**, for example `100.0`, and click **Set** or press <kbd>Enter</kbd> |
| **Status** | Shows the **Sample Rate** (2.05 MSps), the **Audio Rate** once audio runs, and whether the **Stream** is **Active** or **Stopped** |
| **Audio Stream** | **Start Audio** begins FM-demodulated audio in the browser; **Stop** ends it |

The server connects to `rtl_tcp`, demodulates FM and streams 48 kHz audio to your browser over a WebSocket. FM is the only demodulation mode.

> [!NOTE]
> `rtl_tcp` serves one client at a time. Close other SDR programs that are connected to the same `rtl_tcp` server before you start audio in Vessel.

## Change or remove an integration

To change an address or token:

1. Open **Settings ▸ Integration** and click **Configure** next to the integration.
2. Vessel opens **Devices** with the bridge entity selected.
3. Open the entity's menu, choose **Edit** and update **Configuration (JSON)**, for example:

```json
{
  "url": "http://homeassistant.local:8123",
  "token": "your-new-token"
}
```

4. Click **Save Changes**.

To disconnect an integration, delete its bridge entity (`home_assistant.bridge`, `ros2.bridge` or `sdr.server`) on the **Devices** page, then delete its device if you no longer need it. The integration shows **Connect** again, and its dashboard view disappears from the menu.

## Related pages

```cards
Devices and entities | devices-and-entities | Where integration settings are stored.
Node reference | flow-nodes | The ROS2 nodes and the WebSocket nodes they build on.
Dashboards | dashboard | The dashboard menu and the main overview.
```
