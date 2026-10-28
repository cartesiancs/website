# Introduction

Vessel is open-source command and control (C2) software for physical sensors. You connect cameras, microphones, GPS units and other devices to one server, watch them live, and automate what happens next by drawing flows in a visual editor. Vessel is local-first and offline-first: the server, the database and the web interface all run on your own machine. It is free and licensed under Apache-2.0.

![The Vessel flow editor](img/flow.webp "A flow wired together in the flow editor.")

## Who it is for

Vessel is built for people who want to run their own monitoring and response system instead of renting one. Typical users are comfortable with a little DIY: a homeowner protecting a rural property, someone running a small farm or workshop, or a robotics and IoT tinkerer who wants one screen for every sensor.

Everything stays under your control. Data is stored in a SQLite file next to the server, and nothing needs a cloud account to work.

## What you can build

- **Connect sensors.** Bring in data over MQTT, HTTP, RTP over UDP and RTSP. Each sensor value becomes an entity with a live state and a history.
- **Automations.** Draw flows from nodes such as Interval, MQTT Subscribe, Branch, HTTP Request and MQTT Publish. Flows run on the server, not in your browser.
- **Live video and audio.** Receive RTP and RTSP streams and play them in the browser over WebRTC or HLS. Record streams and play them back later.
- **Detection.** Run a YOLO object detection node on a video stream inside a flow.
- **Your own nodes.** Write custom nodes as scripts when the built-in ones are not enough.
- **Maps.** Draw layers and features, import GeoJSON or KML, and see GPS entities on the map.
- **Dashboards.** Watch every entity on one screen, or build your own dashboards with buttons, flows and maps.
- **Integrations.** Connect Home Assistant, ROS 2 and RTL-SDR receivers.
- **AI assistant.** Ask the built-in assistant to explain or build flows for you.
- **Remote access.** Reach your server from outside your network through a tunnel.

![The Vessel map page](img/map.webp "Layers, features and entities on the map.")

## Where to start

```cards
Install Vessel | installation | Run the desktop app or build the server from source.
Quick start | quick-start | From a fresh server to a first working automation.
Core concepts | concepts | Devices, entities, flows and how data moves through Vessel.
The flow editor | flow | Build automations by connecting nodes.
```

## How these docs are organized

| Section | What it covers |
| --- | --- |
| Getting started | Installing Vessel, a first automation, and the ideas behind it |
| Flows | The flow editor, every built-in node, and writing custom nodes |
| Monitoring | Dashboards, the map, devices and entities, streams and recordings |
| Integrations | MQTT, and the Home Assistant, ROS 2 and SDR integrations |
| AI | The built-in AI assistant |
| Administration | Users and roles, server configuration, and remote access |
| Help | Troubleshooting and frequently asked questions |

> [!NOTE]
> Vessel is under active development. Some features may be unstable or change between releases. Vessel is intended for academic and research use, and you are responsible for how you use it with real devices.

## Getting help

- Start with [Troubleshooting and FAQ](troubleshooting) if something does not work.
- Report a bug or request a feature on [GitHub Issues](https://github.com/cartesiancs/vessel/issues).
- Read the source code on [GitHub](https://github.com/cartesiancs/vessel).
- See what is planned next on the [roadmap](https://cartesiancs.com/vessel/roadmap).
