# Remote access

Vessel runs on one machine, but you can use it from any phone, tablet or computer that can reach that machine. This page explains how to open Vessel from other devices on your network, how to reach it from outside with a tunnel, and how to keep it secure while you do.

## How clients reach the server

Everything goes through one port. The Vessel server serves the web client, the API and the live WebSocket connection on its listen address, `0.0.0.0:6174` by default. A browser on another device only needs to open that address.

| Port | Protocol | Used for | Needed by |
| --- | --- | --- | --- |
| `6174` | TCP | Web client, API, live updates | Every browser and the desktop app |
| `5004` | UDP | RTP audio and video, when `rtp_broker_port` is enabled | Devices that stream over RTP |
| Your broker's port, usually `1883` | TCP | MQTT, when `mqtt_broker_url` is enabled | Devices that publish over MQTT. The broker listens on it, not Vessel |

## Use Vessel on your local network

1. Make sure the server listens on all interfaces. With the default `listen_address = "0.0.0.0:6174"` it already does. See [Server configuration](configuration#listen-address).
2. Find the server machine's local IP address. On macOS, run `ipconfig getifaddr en0`. On Linux, run `hostname -I`.
3. Allow incoming connections on port 6174 in the machine's firewall.
4. On the other device, open `http://<server-ip>:6174`, for example `http://192.168.1.20:6174`.
5. On the sign-in screen, enter the same address as the server and click the arrow to connect.
6. Enter your **ID** and **Password**, then click **Auth**.

The browser remembers recent server addresses, so next time you can pick it from the list under the address field.

> [!TIP]
> To make the server reachable only from the machine it runs on, set `listen_address` to `127.0.0.1:6174` and restart it.

### The desktop app

The desktop app starts its own copy of the server in the background, listening on `0.0.0.0:6174` unless you change it. Closing the window only hides it; the server keeps running, and the Vessel tray icon stays available.

The tray menu shows **Server: Running** with the address, and has **Server Settings…**, **Hide Vessel** or **Show Vessel**, and **Quit Vessel**. To change where the server listens:

1. Choose **Server Settings…** from the tray menu.
2. Under **Host**, pick **0.0.0.0 (LAN / external access)**, **127.0.0.1 (this machine only)** or **Custom host…** and type an address.
3. Set the **Port**.
4. Click **Save & Restart**.

The app writes the address to its `config.toml` and restarts the server. If the new address cannot be used, for example because the port is taken, it goes back to the previous one and shows the error. Other devices then connect to `http://<computer-ip>:<port>` as described above.

### Networks page

**Settings ▸ Networks** shows whether the browser you are using is online, as **Internet**. **LoRa Network**, **BLE** and **Zigbee** are listed as **Coming Soon**. The page does not change how the server listens.

## Tunnel

A tunnel lets you reach Vessel from the internet without opening ports on your router. The Vessel server opens an outgoing WebSocket connection to a tunnel server, and the tunnel server forwards web requests from a public address back through that connection to your local Vessel.

```text
browser ──HTTPS──▶ tunnel server ◀──outgoing WebSocket── Vessel server ──▶ http://127.0.0.1:6174
```

### Start a tunnel

1. Open **Settings ▸ Account** and, under **Vessel Cloud**, click **Sign in with Google**. Vessel passes your Vessel Cloud session to the tunnel server when it connects.
2. Open **Settings ▸ Services** and find the **Tunnel** card.
3. Check **Tunnel server URL (wss://…/agent)**. The default is `wss://agent.tunnel.cartesiancs.com/agent`.
4. Check **Local target URL**. The default is `http://127.0.0.1:6174`. If you changed the listen port, change it here too.
5. Turn on **Tunnel Connection**.
6. When the connection is up, **Session** shows a session ID. Click **Copy tunnel URL** to copy the public address, in the form `https://<session-id>.tunnel.cartesiancs.com/auth`.
7. Open that address on another device and sign in with your Vessel account. If the sign-in screen asks for a server, enter the tunnel address without `/auth`.

To end remote access, turn off **Tunnel Connection**. Click **Refresh status** to read the tunnel's current state from the server again.

### Things to know

- Only one tunnel runs at a time.
- The tunnel is not saved. After the server restarts, turn **Tunnel Connection** on again. You will get a new session ID and a new address.
- The server URL and target URL cannot be edited while the tunnel is on. Turn it off first.
- You can enter the address of another tunnel server, but **Copy tunnel URL** always builds a `tunnel.cartesiancs.com` address.

### Video over a tunnel or the internet

Live video plays over WebRTC by default, and WebRTC sends media on its own connection, not through the tunnel. If video does not play from outside your network:

- Issue TURN relay credentials in **Settings ▸ Account ▸ TURN Server ▸ Issue TURN Credentials**. The card appears after you sign in with **Vessel Cloud**. Vessel saves them in `turn_server_config` and uses them for new connections.
- Or switch **Settings ▸ Services ▸ Default stream mode** to **HLS**, which delivers video over normal web requests.

See [Streams and recordings](streams-and-recordings) for more on the two playback modes.

## Security checklist

Vessel controls physical devices, so treat access to it as access to your home or site.

- **Change the admin password.** Vessel asks for this the first time you sign in as `admin`. Never leave a user named `admin` with the password `admin`. See [Users and roles](users-and-roles#the-admin-account).
- **Give each person their own account** with a strong password. Roles are not enforced yet, so every account has full access. Only create accounts for people you trust.
- **Keep the JWT secret private.** Do not commit `config.toml` or `.env`, and replace the example secret from `.env.example`. See [Server configuration](configuration#jwt-secret).
- **Expose as little as possible.** Use `127.0.0.1` as the listen host when you do not need access from other devices, and allow port 6174 in your firewall only from networks you trust. Vessel serves plain HTTP without TLS, so do not forward port 6174 on your router; use a tunnel instead.
- **Turn the tunnel off when you do not need it.** Anyone with the tunnel address can reach your sign-in screen.
- **Protect your MQTT broker.** Vessel connects to it without a password, so keep the broker on a trusted network. Anyone who can publish to it can change entity states and trigger flows.
- **Treat stored tokens as secrets.** Integration tokens, such as the Home Assistant access token, are stored in entity configurations that every signed-in user can read.
- **Log out on shared devices.** **Log out** in the sidebar user menu revokes that session on the server.

## Related pages

```cards
Server configuration | configuration | Listen address, JWT secret and files.
Users and roles | users-and-roles | Accounts, passwords and sessions.
Streams and recordings | streams-and-recordings | WebRTC and HLS playback.
Troubleshooting and FAQ | troubleshooting | Connection problems and fixes.
```
