# Quick start

This page takes you from a freshly installed server to a first working automation in eight steps. You will register a device and a text sensor, build a flow that publishes a message to that sensor every ten seconds, and watch the value arrive on the dashboard. It takes about fifteen minutes, and every step links to a page with more detail.

You need a running Vessel server (see [Installation](installation)) and an MQTT broker on the same machine. This guide uses [Mosquitto](https://mosquitto.org/).

## 1. Sign in

1. Open the web interface, for example `http://localhost:6174`, or open the desktop app.
2. Type the server address, for example `http://localhost:6174`, and click the arrow button. The desktop app fills this in for you.
3. Enter your **ID** and **Password** and click **Auth**.

The first time, use `admin` / `admin`. Vessel then asks you to choose a new password in **Update Admin Password**. [More about the first sign-in](installation#sign-in-for-the-first-time).

## 2. Start an MQTT broker

Vessel does not include an MQTT broker. It connects to one as a client, subscribes to every topic, and turns messages into sensor values.

On macOS:

```bash
brew install mosquitto
mosquitto
```

On Debian or Ubuntu:

```bash
sudo apt-get install -y mosquitto mosquitto-clients
```

Leave the broker running. Without a configuration file, Mosquitto listens on `localhost:1883` and accepts local connections without a password, which is what Vessel expects by default.

## 3. Connect Vessel to the broker

The MQTT connection is turned off on a new server. Turn it on:

1. In the sidebar, click **Settings**, then **Config**.
2. Find the row with the key `mqtt_broker_url`. Its value is `localhost:1883`.
3. Click the **⋯** button at the end of the row and choose **Edit**.
4. Turn on **Enabled** and click **Save Changes**.
5. Restart the server. In a terminal, press <kbd>Ctrl</kbd> <kbd>C</kbd> and start it again. In the desktop app, choose **Quit Vessel** from the menu bar icon and open Vessel again.

The server reads these settings only when it starts. After the restart, its log shows `Internal MQTT client connected and subscribed to all topics.` [More about server settings](configuration).

## 4. Create a device

A device is the physical thing you are connecting, such as a Raspberry Pi or a camera.

1. In the sidebar, click **Devices**.
2. Click **New Device**.
3. In **Create New Device**, type `quickstart` as the **Device ID** and `Quick start` as the **Name**. **Manufacturer** and **Model** are optional.
4. Click **Save**.

The device appears in the **Devices** table. [More about devices](devices-and-entities).

## 5. Add a sensor to the device

An entity is one value or stream that a device provides. Each entity has a state that Vessel keeps up to date.

1. Click the `quickstart` row in the **Devices** table to select it. The **Entities** card now belongs to this device.
2. Click **New Entity**.
3. The **Entity ID** already starts with `quickstart-`. Complete it as `quickstart-greeting`. The **Friendly Name** fills in as `Quickstart Greeting`.
4. Set **Platform (Protocol)** to **MQTT** and **Type** to **TEXT**.
5. In **Configuration (JSON)**, enter the topic this sensor listens to:

   ```json
   { "state_topic": "vessel/quickstart/greeting" }
   ```

6. Click **Save**.

From now on, every message published to `vessel/quickstart/greeting` becomes this entity's state. The topic has to match exactly.

> [!TIP]
> You can test the sensor before building a flow. Run `mosquitto_pub -h localhost -t vessel/quickstart/greeting -m hello` and look at the dashboard in step 8.

## 6. Build a flow

Now build a flow that publishes a greeting every ten seconds.

1. In the sidebar, click **Flow**.
2. Click **+** next to **Flows**, type `Quick start` as the **Name**, and click **Create**.
3. Click the add button (the square with a plus) on the right side of the canvas and add three nodes:
   - **Logic ▸ Interval**
   - **Data ▸ Set Variable With Exec**
   - **Communication ▸ Mqtt Publish**
4. Each node shows its type in its header. Click **Edit Variable** on the `SET_VARIABLE_WITH_EXEC` node. Type `Hello from Vessel` as the `variable`, keep `variableType` at `string`, and click **Save Changes**.
5. Click the topic label `default/topic` on the `MQTT_PUBLISH` node. Change `topic` to `vessel/quickstart/greeting` and click **Save Changes**.
6. Connect the nodes by dragging from an output port to an input port:
   - `INTERVAL` output `exec` to `SET_VARIABLE_WITH_EXEC` input `exec`.
   - `SET_VARIABLE_WITH_EXEC` output `out` to `MQTT_PUBLISH` input `payload`.

The `INTERVAL` node fires every `10` `seconds` by default. Click **Interval 10** on the node if you want a different period. [More about the flow editor](flow) and [every node](flow-nodes).

![A flow in the flow editor](img/flow-2.webp "Nodes are connected from an output port on the right of one node to an input port on the left of the next.")

## 7. Run the flow

1. Click the play button at the top right of the page. Vessel saves the flow and starts it on the server.
2. The play button turns into a red stop button while the flow runs.
3. The **LOGS** panel opens at the bottom of the canvas and shows `Publish MQTT Topic` each time the flow publishes.

The flow runs on the server, so it keeps going after you close the browser tab.

## 8. Watch the result on the dashboard

1. In the sidebar, click **Controls**.
2. Find the **Quickstart Greeting** card. It shows `Hello from Vessel`, the platform `MQTT`, and the time of the last update.
3. Wait ten seconds. The time updates each time the flow publishes.
4. Click the value to open the entity's state history.

![The dashboard](img/dashboard.webp "Each entity card shows the latest state, the platform and the time of the last update.")

To stop the automation, go back to **Flow** and click the red stop button. [More about dashboards](dashboard).

## What to try next

- Replace the Interval node with **Mqtt Subscribe** to react to messages from a real device.
- Add a **Branch** or **Logic Operator** node to act only when a value crosses a threshold.
- Build your own dashboard with buttons and flow controls.
- Toggle the [AI assistant](ai-assistant) with <kbd>⌘</kbd> <kbd>K</kbd> (<kbd>Ctrl</kbd> <kbd>K</kbd> on Linux) and ask it about the flow you have open.

```cards
Core concepts | concepts | How devices, entities, flows and integrations fit together.
Node reference | flow-nodes | What every built-in node does.
MQTT | mqtt | Topics, payloads and how Vessel uses the broker.
```
