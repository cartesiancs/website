# Server configuration

Vessel is configured in two layers. A small startup file sets the three things the server needs before it can start: the JWT secret, the listen address and the database file. Everything else is stored in the database and edited from **Settings** in the app.

## Where settings come from

| Source | Used by | Holds |
| --- | --- | --- |
| `config.toml` | Release builds: the compiled `server` binary, Docker and the desktop app | `jwt_secret`, `listen_address`, `database_url` |
| `.env` | Development builds started with `npm run server` or `cargo run` | The same three values as environment variables |
| System configurations | Every build, stored in the database | MQTT, RTP, TURN, Code workspace and streaming settings |
| `RUST_LOG` environment variable | Every build | Log level |

A release build never reads `.env`, and a development build never reads `config.toml`.

## Startup settings

### config.toml

A release build reads `config.toml` from its working directory. If the file does not exist, the server creates one on first start with a random 32-character secret:

```toml
jwt_secret = "generated-random-secret"
listen_address = "0.0.0.0:6174"
database_url = "database.db"
```

| Key | Default | What it does |
| --- | --- | --- |
| `jwt_secret` | Random, generated on first start | Signs the access tokens of signed-in users and the tokens for HLS video |
| `listen_address` | `0.0.0.0:6174` | Address and port of the web server, API and built-in web client, as `host:port` |
| `database_url` | `database.db` | Path to the SQLite database file, relative to the working directory |

All three keys are required. If you write the file yourself, include every key. Restart the server after you change it.

### .env for development

A development build loads a `.env` file from the directory you start it in, or from a parent directory, and then reads the settings from environment variables. Without a `.env` file it stops with `.env file not found in DEV mode`. Start from the example in the repository root:

```bash
cp .env.example .env
```

```bash
JWT_SECRET="your-very-secret-and-long-key"
DATABASE_URL=./database.db
LISTEN_ADDRESS=0.0.0.0:6174
```

| Variable | Matches |
| --- | --- |
| `JWT_SECRET` | `jwt_secret` |
| `LISTEN_ADDRESS` | `listen_address` |
| `DATABASE_URL` | `database_url` |

### JWT secret

The secret proves that a token was issued by your server. Anyone who knows it can create tokens that the server accepts.

- Use a long random value. The generated one is 32 letters and digits.
- Never commit `config.toml` or `.env` to a public repository, and never paste the secret into issues or chats.
- Replace the example value from `.env.example` before anyone else can reach a development server.

If you change the secret, existing access tokens stop working. Browsers that are signed in get a new access token with their refresh token, so changing the secret alone does not sign anyone out. See [Sign-in sessions](users-and-roles#sign-in-sessions).

### Listen address

`0.0.0.0:6174` accepts connections on every network interface, so other devices on your network can open Vessel. Use `127.0.0.1:6174` to allow only the machine Vessel runs on, or change the port if 6174 is taken. See [Remote access](remote-access).

## Debug mode

Start the server with the `--debug` argument to run only the web server and the flow engine:

```bash
./server --debug
```

During development, pass it after `--`:

```bash
cargo run -p server -- --debug
```

In debug mode the server does not connect to MQTT and does not start the RTP receiver, the RTSP puller or the stream status checker. Use it when a wrong system configuration, such as a malformed `mqtt_broker_url`, stops the server from starting. Fix the value in **Settings ▸ Config**, then start the server normally.

## System configurations

System configurations are key-value rows in the database. Open **Settings ▸ Config** to see them in the **Configurations** table, with **Key**, **Value** and **Status** (**Enabled** or **Disabled**).

The server creates these rows on first start. All of them start **Disabled**.

| Key | Default value | When enabled | Applies |
| --- | --- | --- | --- |
| `mqtt_broker_url` | `localhost:1883` | Connects to the MQTT broker at this `host:port`. See [MQTT](mqtt) | After a restart |
| `rtp_broker_port` | `0.0.0.0:5004` | Listens for RTP audio and video on this UDP address. See [Streams and recordings](streams-and-recordings) | After a restart |
| `turn_server_config` | Example JSON | Uses the TURN servers in this JSON for WebRTC video. Otherwise Vessel uses the public STUN server `stun:stun.l.google.com:19302` | On the next stream connection |
| `code_service_enabled` | `1` | Turns on the **Code** workspace and its file storage. Only the **Enabled** switch matters | Immediately |
| `default_stream_mode` | `webrtc` | The value picks how live video plays: `webrtc` or `http` (HLS) | Immediately |

You rarely edit the last three by hand:

- `turn_server_config` is filled in by **Issue TURN Credentials** in **Settings ▸ Account**. That card appears after you sign in with **Vessel Cloud**.
- `code_service_enabled` follows the **Code service** switch in **Settings ▸ Services**.
- `default_stream_mode` follows **Default stream mode** (**WebRTC** or **HLS**) in **Settings ▸ Services**. It is read from the value, whether or not the row is enabled.

### Edit a configuration

1. Open **Settings ▸ Config**.
2. Open the menu at the end of the row and choose **Edit**.
3. Change **Value** or **Description**, and turn **Enabled** on or off.
4. Click **Save Changes**.
5. Restart the server if the table above says so.

> [!WARNING]
> A wrong value can stop the server from starting, for example an `mqtt_broker_url` that is not `host:port`. If that happens, start the server in [debug mode](#debug-mode) and fix it.

### Add your own configuration

Click **Add Configuration**, enter a **Key** and a **Value**, and click **Save**. Flow nodes that take a WebSocket URL replace a placeholder such as `{:my_key}` with the value of the configuration named `my_key`. Configurations are loaded when the server starts, so restart it before a flow can use a new key.

## Settings pages

**Settings** in the sidebar lists every settings page.

| Page | Description in the app | What you do there |
| --- | --- | --- |
| **Account** | Vessel Cloud, Capsule Server, TURN credentials | Sign in to **Vessel Cloud** with Google, set the **Capsule Server URL** for the [AI assistant](ai-assistant), and issue TURN credentials |
| **Services** | Code workspace, Tunnel | Turn the **Code service** on or off, choose the **Default stream mode**, and start a [tunnel](remote-access#tunnel) |
| **Users** | Manage users and roles | See [Users and roles](users-and-roles) |
| **Networks** | Network interface status | Shows whether the browser is online. **LoRa Network**, **BLE** and **Zigbee** are marked **Coming Soon** |
| **Integration** | Home Assistant, ROS2, RTL-SDR | See [Integrations](integrations) |
| **Log** | Server logs | Read the server's log files |
| **Config** | System configurations | Edit the system configurations described above |

## Database

Vessel stores users, devices, entities and their history, flows, dashboards and settings in one SQLite file, `database.db` by default. The server opens it in WAL mode, so you will also see `database.db-wal` and `database.db-shm` next to it while it runs.

Migrations are built into the server and run automatically on every start. After the migrations, the server:

- creates the `admin` user if no user with that name exists,
- creates any missing default system configurations,
- creates any missing permissions,
- deletes expired refresh tokens.

You do not need the Diesel CLI to run Vessel. It is only needed when you develop new migrations.

> [!TIP]
> To back up Vessel, stop the server and copy `database.db`, `config.toml` and the `storage` and `recordings` folders. Copying a running database can give you an incomplete file.

## Files in the working directory

The server keeps all of its data relative to the directory it runs in.

| Path | Contents |
| --- | --- |
| `config.toml` | Startup settings of a release build |
| `database.db` | The database, or the path set in `database_url` |
| `log/` | Log files, one per day |
| `storage/` | Files of the **Code** workspace. Map layers are kept in `storage/maps` |
| `recordings/` | Stream recordings |

The desktop app runs the server in its app data folder. On macOS that is `~/Library/Application Support/com.vessel.desktop`, which also holds `log/sidecar.log` with the server's console output.

The Docker image runs the server in `/app/target/release`, so its database and `config.toml` live inside the container. Mount a volume there if the data must survive a new container.

## Logs

The server writes logs to the console and to `log/app.log.YYYY-MM-DD`, starting a new file each day.

To read them in the app, open **Settings ▸ Log**. The **Logs** list shows the files, newest first. Click one to show its last 3000 lines, with the newest line at the top.

The default level is `info`. Set `RUST_LOG` to change it:

```bash
RUST_LOG=debug ./server
```

## Related pages

```cards
Installation | installation | Build and start the server.
Remote access | remote-access | Listen address, tunnel and security.
MQTT | mqtt | Connect a broker with mqtt_broker_url.
Troubleshooting and FAQ | troubleshooting | Startup errors and their fixes.
```
