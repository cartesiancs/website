# Installation

Vessel is one server program. It stores everything in a SQLite database, serves the web interface, and talks to your devices. You can run it in three ways: as the macOS desktop app, by building it from source, or in Docker. This page covers all three, then walks you through your first sign-in.

## Choose a way to run Vessel

| Option | Best for | What you need |
| --- | --- | --- |
| Desktop app | Trying Vessel on a Mac | A Mac with Apple silicon and macOS 11 or later |
| Build from source | Servers, Linux machines, development | Rust, Node.js, GStreamer and a few build tools |
| Docker | Running the server in a container | Docker. See the note in [Docker](#docker) first |

## Desktop app (macOS)

The desktop app bundles the Vessel server and the web interface into one Mac app. The server starts in the background when you open the app.

1. Open the [releases page](https://github.com/cartesiancs/vessel/releases) and download the latest `.dmg` file, for example `Vessel_0.2.0_aarch64.dmg`.
2. Open the `.dmg` and drag **Vessel** into your Applications folder.
3. Open **Vessel**. The sign-in screen shows **Connecting to local server...** while the built-in server starts.
4. When the **ID** and **Password** fields appear, continue with [Sign in for the first time](#sign-in-for-the-first-time).

The build on the releases page is for Apple silicon (`aarch64`) Macs. On other systems, build from source.

### The menu bar icon

Vessel adds an icon to the macOS menu bar. Its menu has:

- **Hide Vessel** / **Show Vessel** to hide or show the window.
- **Server: Running** or **Server: Stopped**, followed by the address the server listens on.
- **Server Settings…** to change the server's host and port.
- **Quit Vessel** to stop the server and quit.

Closing the window only hides it. The server keeps running until you choose **Quit Vessel**.

### Change the port

The desktop server listens on port `6174` by default.

1. Choose **Server Settings…** from the menu bar icon.
2. Under **Server Address**, pick a **Host** and type a **Port** between 1 and 65535.
3. Click **Save & Restart**. If the new address cannot be used, Vessel shows an error and keeps the old one.

### Where the desktop app keeps its data

The desktop server runs in the app's data folder, `~/Library/Application Support/com.vessel.desktop`. It creates `config.toml`, `database.db` and a `log/` folder there on first launch. Back up this folder to keep your devices, flows and dashboards.

## Build from source

Building from source gives you a single `server` binary with the web interface embedded in it. The repository's build scripts use macOS and Ubuntu.

### Requirements

| Tool | Why it is needed |
| --- | --- |
| [Rust](https://www.rust-lang.org/tools/install) (stable) and Cargo | Builds the server |
| [Node.js](https://nodejs.org/) 20.19 or later (or 22.12 or later) and npm | Builds the web interface |
| [GStreamer](https://gstreamer.freedesktop.org/) development libraries, GLib and `pkg-config` | Video decoding and streaming |
| CMake and a C compiler | Builds the Opus audio codec |
| Internet access on the first build | Cargo downloads crates and the ONNX Runtime used for detection |
| An MQTT broker such as [Mosquitto](https://mosquitto.org/) (optional) | Only if your devices use MQTT. Vessel connects to a broker, it does not include one |

You do not need `diesel_cli`. The server creates the database and runs its migrations by itself every time it starts.

### Install the system packages

On macOS with Homebrew:

```bash
brew install gstreamer glib pkg-config cmake
```

On Debian or Ubuntu:

```bash
sudo apt-get update
sudo apt-get install -y build-essential cmake pkg-config libglib2.0-dev \
  libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev
```

To pull RTSP cameras, the server also needs the GStreamer "good" and "bad" plugin sets at runtime. On Debian or Ubuntu, install `gstreamer1.0-plugins-good` and `gstreamer1.0-plugins-bad`.

### Get the code and build the web interface

1. Clone the repository and install the npm workspaces:

   ```bash
   git clone https://github.com/cartesiancs/vessel.git
   cd vessel
   npm install
   ```

2. Build the web interface. This builds the `@vessel/capsule-client` package first, then the client, into `apps/client/dist`:

   ```bash
   npm run client:build
   ```

> [!IMPORTANT]
> Build the client before the first `cargo` build. The server embeds `apps/client/dist` at compile time and refuses to compile if that folder does not exist.

### Run in development mode

A debug build reads its settings from a `.env` file. Run these commands from the repository root:

1. Copy the example file:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and replace `JWT_SECRET` with a long random string. The file looks like this:

   ```bash
   JWT_SECRET="your-very-secret-and-long-key"
   DATABASE_URL=./database.db
   LISTEN_ADDRESS=0.0.0.0:6174
   ```

3. Start the server:

   ```bash
   npm run server
   ```

4. Wait for `Server starting, press Ctrl-C to stop.` in the terminal, then open `http://localhost:6174`.

To work on the web interface with live reload, run `npm run client` in a second terminal. The Vite dev server opens on `http://localhost:5175` and connects to the server you enter on the sign-in screen.

> [!TIP]
> Start the server with `cargo run -p server -- --debug` to run only the web server, without MQTT, RTP or RTSP. This is useful when a bad setting stops the server from starting. See [Troubleshooting](troubleshooting).

### Build a release binary

1. Build the server in release mode from the repository root:

   ```bash
   npm run build
   ```

   The release build runs `npm run build` in `apps/client` for you and embeds the result. The binary is written to `target/release/server`.

2. Create a folder for Vessel's data and start the server from inside it:

   ```bash
   mkdir -p ~/vessel-data
   cd ~/vessel-data
   /path/to/vessel/target/release/server
   ```

3. Open `http://localhost:6174`.

A release build does not read `.env`. It reads `config.toml` from the folder you start it in. If there is no `config.toml`, it writes one with a random JWT secret and these defaults:

```toml
jwt_secret = "<random 32 characters>"
listen_address = "0.0.0.0:6174"
database_url = "database.db"
```

The server also creates `database.db`, `log/`, `storage/`, `recordings/` and `hls/` in that folder, so always start it from the same place. See [Server configuration](configuration) for every setting.

You can also run the release build straight from the repository with `npm run server:prod`. It then uses the repository root as its data folder.

## Docker

The repository has a `Dockerfile` that builds the release server inside a Rust image and starts it.

```bash
docker build -t server .
docker run -p 0.0.0.0:6174:6174 server:latest
```

> [!WARNING]
> The `Dockerfile` predates the `packages/` folder that the web interface now depends on, and it does not copy that folder into the image. If the image build fails while building the client, build from source instead.

Keep these points in mind when you use the container:

- The server runs in `/app/target/release` inside the container and keeps `config.toml` and `database.db` there. They are lost when you remove the container.
- Only port `6174` is published by the command above. Publish `5004/udp` as well if you turn on the RTP receiver.
- Inside the container, `localhost` is the container itself. Point the MQTT broker setting at an address the container can reach.

## Network ports

| Port | Protocol | Used for | Default state |
| --- | --- | --- | --- |
| `6174` | TCP | Web interface, REST API (`/api`), WebSocket (`/signal`) | On |
| `5004` | UDP | RTP receiver for audio and video from devices | Off until you enable `rtp_broker_port` |
| `1883` | TCP | Your MQTT broker. Vessel connects to it as a client | Off until you enable `mqtt_broker_url` |

The RTP and MQTT settings live in the database, not in `config.toml`. Change them under **Settings ▸ Config**, then restart the server. See [Server configuration](configuration).

## Sign in for the first time

On first start, the server creates one administrator account:

| Field | Value |
| --- | --- |
| ID | `admin` |
| Password | `admin` |

1. Open the web interface, for example `http://localhost:6174`. You land on the sign-in screen.
2. Type the server address, including `http://` and the port, for example `http://localhost:6174`, and click the arrow button. The desktop app skips this step.
3. Enter `admin` as the **ID** and `admin` as the **Password**, then click **Auth**.
4. Vessel opens **Update Admin Password** because the default password is in use. You cannot close this dialog until you choose a new password.
5. Type the new password in **New password** and **Confirm new password**, then click **Update password**. It cannot be `admin` again.
6. Vessel signs you in with the new password and opens the dashboard.

> [!WARNING]
> Change the default password before you make the server reachable from other machines. The server listens on all network interfaces (`0.0.0.0`) by default.

The sign-in screen remembers the last five server addresses you connected to, so next time you can click one instead of typing it.

## Next steps

```cards
Quick start | quick-start | Connect a sensor and build your first automation.
Core concepts | concepts | Learn how devices, entities and flows fit together.
Server configuration | configuration | Every setting in config.toml and the Config page.
```
