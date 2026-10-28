# Troubleshooting and FAQ

This page lists the problems people run into most often, what causes them, and how to fix them. Start with the server log: most problems leave a clear message there.

## Where to find logs

- **In the terminal.** The server prints its log to the terminal it was started from.
- **On disk.** The server also writes a daily log file into the `log/` folder of its working directory.
- **In the web interface.** Open **Settings ▸ Log** to read the server log files from the browser.
- **In the desktop app.** Logs are in `~/Library/Application Support/com.vessel.desktop/log/`. `sidecar.log` records when the built-in server was started and stopped.

For more detail, set the `RUST_LOG` environment variable before starting the server, for example `RUST_LOG=debug`. The default level is `info`.

## Building from source

### GStreamer or GLib is not found

The build stops while compiling a crate such as `gstreamer-sys` or `glib-sys` with a `pkg-config` error saying a system library like `gstreamer-1.0` or `glib-2.0` was not found.

Install the development packages and `pkg-config`:

```bash
# macOS
brew install gstreamer glib pkg-config

# Debian or Ubuntu
sudo apt-get install -y pkg-config libglib2.0-dev \
  libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev
```

### Linking fails with "library 'gobject-2.0' not found" on macOS

This happens after Homebrew upgrades GLib. The GStreamer and GLib `-sys` crates remember the old Homebrew path from an earlier build, so only the final link step fails. Rebuild those crates so they look up the new path:

```bash
for p in glib-sys gobject-sys gio-sys gstreamer-sys gstreamer-base-sys gstreamer-app-sys; do
  cargo clean -p $p
done
cargo build -p server
```

### The build fails on CMake or Opus

The Opus audio codec is compiled from source during the build and needs CMake and a C compiler. Install `cmake` (and `build-essential` on Debian or Ubuntu) and build again.

### "folder ... apps/client/dist/ does not exist"

The server embeds the web interface at compile time, so `apps/client/dist` must exist before the first `cargo` build. Build the client first:

```bash
npm install
npm run client:build
```

### The client build cannot resolve `@vessel/capsule-client`

The client depends on the `@vessel/capsule-client` package in `packages/`, which has to be compiled first. `npm run client:build` does both in the right order. Running `npm run build` inside `apps/client` on a fresh clone skips that step.

### The first build fails without internet access

On the first build, Cargo downloads crates and a prebuilt ONNX Runtime used by the detection node. Build once with internet access. Later builds use the cache.

## Starting the server

### ".env file not found in DEV mode"

A debug build (`npm run server` or `cargo run -p server`) reads its settings from a `.env` file and stops if there is none. Create one in the repository root:

```bash
cp .env.example .env
```

### "Failed to load configuration"

The server could not read all three settings: the JWT secret, the listen address and the database URL.

- In a debug build, make sure your `.env` has `JWT_SECRET`, `DATABASE_URL` and `LISTEN_ADDRESS`. The file `apps/server/.env.example` only contains `DATABASE_URL` and is not enough to start the server. Copy the `.env.example` from the repository root instead.
- In a release build, check that `config.toml` in the working folder has `jwt_secret`, `listen_address` and `database_url`. If you delete `config.toml`, the server writes a new one with defaults, including a new random JWT secret.

See [Server configuration](configuration) for the format of both files.

### Port 6174 is already in use

Only one program can listen on a port. If another Vessel server or another program already uses `6174`, the web interface does not answer on that port, or you reach the other program instead.

1. Find out what uses the port:

   ```bash
   lsof -i :6174
   ```

2. Stop that program, or give Vessel another port. Change `LISTEN_ADDRESS` in `.env` (debug build) or `listen_address` in `config.toml` (release build), for example to `0.0.0.0:6175`, and restart.

In the desktop app, choose **Server Settings…** from the menu bar icon, enter another **Port** and click **Save & Restart**. If the port cannot be used, the app reports that it failed to bind and keeps the old address.

### The server exits right after starting because of a bad setting

Settings such as `mqtt_broker_url` are stored in the database and read at startup. If one has an invalid value, for example an MQTT address that is not in `host:port` form, the server stops with an error such as `Invalid broker address format`.

1. Start the server in debug mode. Only the web server starts, without MQTT, RTP or RTSP:

   ```bash
   # from the repository
   cargo run -p server -- --debug

   # or with a release binary
   ./server --debug
   ```

2. Sign in and open **Settings ▸ Config**.
3. Fix or disable the setting, then restart the server without `--debug`.

### The database or migrations fail

The server creates the SQLite database and applies all migrations by itself on every start. You do not need `diesel_cli`.

- **The database cannot be opened.** Check that the folder in `database_url` (or `DATABASE_URL`) exists and that the server can write to it. A relative path is relative to the folder the server is started from.
- **"Running database migrations..." is followed by an error.** The server stops. Restore a backup of the database, or move the file away to start with an empty one. Back up the database before you upgrade Vessel so you can always go back.
- **Two servers share one file.** Run only one Vessel server per database file.

The database runs in WAL mode, so you may see `database.db-wal` and `database.db-shm` next to `database.db`. To back up, stop the server and copy all three files together.

### The desktop app says it cannot reach the local server

The sign-in screen shows "Could not reach the local Vessel server" with **Retry** and **Server Settings** buttons.

1. Click **Retry**. The built-in server can take a few seconds to start the first time.
2. If it still fails, click **Server Settings** and check the host and port. Another program may be using the port.
3. Check `sidecar.log` and the server log in `~/Library/Application Support/com.vessel.desktop/log/`.

## Signing in

### The sign-in screen cannot connect to the server

After you click the arrow button, an error appears instead of the **ID** and **Password** fields, for example "Failed to connect to the server." or a browser message such as "Failed to fetch".

- Include the scheme and the port, for example `http://localhost:6174`. Only `http` and `https` addresses are accepted.
- Make sure the server is running. Open `http://localhost:6174/info` in a browser. A Vessel server answers with a short JSON message that contains `"id":"vessel-server"`.
- When you connect from another machine, use the server's network address instead of `localhost`, and check that a firewall allows the port.

### "Wrong ID or password."

- The first account is `admin`. Its starting password is `admin` until you change it in **Update Admin Password**.
- IDs and passwords are case sensitive.
- If several Vessel servers are involved, check that you are connecting to the right one. Each has its own database and its own accounts.

### I forgot the admin password

Vessel has no password reset command. If another account can still sign in and manage users, change the password from **Settings ▸ Users**. Otherwise, the server creates a fresh `admin` / `admin` account only when no user named `admin` exists, which in practice means starting with a new database. Starting with a new database loses all devices, flows and dashboards stored in the old one.

### I am signed out after a while

The server issues a short-lived access token (15 minutes) and a refresh token (30 days). The client renews the access token in the background. After 30 days without renewal, or if the refresh token is removed on the server, sign in again.

## MQTT

### Entities never receive MQTT values

Work through these checks in order:

1. **The connection is enabled.** On a new server, `mqtt_broker_url` is disabled. Enable it under **Settings ▸ Config** and restart the server. The log says `MQTT Broker is disabled by configuration.` while it is off.
2. **The broker is running and reachable** at the address in `mqtt_broker_url` (default `localhost:1883`). If the server cannot connect, the log repeats `MQTT event loop error` every second.
3. **The broker allows the connection.** Vessel connects without a username or password, so the broker must accept anonymous clients from the server's address.
4. **The topic matches exactly.** The entity's **Configuration (JSON)** needs a `state_topic`, and the message topic has to be identical. Wildcards such as `+` and `#` are not matched.
5. **The payload is text.** Messages that are not valid UTF-8 are skipped with a warning in the log.

You can test the path from a terminal with Mosquitto's client:

```bash
mosquitto_pub -h localhost -t your/state/topic -m hello
```

See [MQTT](mqtt) for more.

### Mqtt Publish nodes do nothing

If the server log shows `MQTT client is not available, cannot publish message.`, the MQTT connection was not enabled when the server started. Enable `mqtt_broker_url`, restart the server, and run the flow again.

## Flows

### Clicking the play button shows "WebSocket is not connected or no flow is selected."

The browser has no WebSocket connection to the server, so it cannot start or stop the flow. Reload the page and check that the server is still running.

### A flow runs but a node never fires

Open the **LOGS** panel at the bottom of the canvas. It shows `Executing flow...` when the flow starts and the messages that nodes send while it runs. Check that every input of the node is connected, and that each input port has only one incoming edge. See [The flow editor](flow).

## Streams

### RTP streams from devices do not arrive

The RTP receiver is disabled on a new server. Enable `rtp_broker_port` (default `0.0.0.0:5004`) under **Settings ▸ Config** and restart the server. The log says `RTP Receiver is disabled by configuration.` while it is off. RTP uses UDP, so allow UDP on that port in your firewall, and publish it with `-p 5004:5004/udp` if you run Vessel in Docker.

### RTSP cameras do not play

- The entity needs the **RTSP** platform and an `rtsp_url` in its configuration.
- The server uses GStreamer to pull RTSP. On Linux, install the runtime plugins `gstreamer1.0-plugins-good` and `gstreamer1.0-plugins-bad`.
- Make sure the camera URL works from the server machine, not only from your computer.

See [Streams and recordings](streams-and-recordings).

## FAQ

### Do I need an internet connection?

No. Vessel is local-first and offline-first. The server, database and web interface all run on your machine. Only the first build from source needs internet access to download dependencies.

### Does Vessel include an MQTT broker?

No. Vessel connects to an MQTT broker as a client. Run a broker such as [Mosquitto](https://mosquitto.org/) next to it.

### Which port does Vessel use?

`6174` for the web interface, the REST API and the WebSocket. The optional RTP receiver uses UDP port `5004`. See [Installation](installation#network-ports).

### Where is my data stored?

In the folder the server runs in: `database.db` for devices, entities, flows and settings, plus `config.toml`, `storage/`, `recordings/`, `hls/` and `log/`. The desktop app uses `~/Library/Application Support/com.vessel.desktop`.

### Do I have to restart the server after changing a setting?

Yes, for everything under **Settings ▸ Config** and for `config.toml` or `.env`. The server reads them only when it starts.

### Can I reach my server from outside my network?

Yes. See [Remote access](remote-access).

### Is there a Windows or Intel Mac desktop app?

The published desktop app is for Apple silicon Macs. On other systems, [build the server from source](installation#build-from-source).

### Where do I report a bug?

Open an issue on [GitHub](https://github.com/cartesiancs/vessel/issues). Include the server log and the steps that lead to the problem.
