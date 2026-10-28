# AI assistant

The assistant is a chat panel built into Vessel. On the Flow page it can draw and edit flows for you from a plain-language description. Anywhere else it answers questions and analyzes images, including frames captured from your cameras.

The assistant runs through **Capsule**, the AI relay service for Vessel. Images you send are encrypted on your device before they leave it.

## Before you start

The assistant needs three things:

- **A Vessel Cloud account.** Open **Settings** ▸ **Account** and click **Sign in with Google** under **Vessel Cloud**.
- **A Pro subscription** for that account. See [pricing](https://cartesiancs.com/vessel/pricing).
- **A Capsule server URL.** Your build of Vessel comes with a default, shown under the field. You only need to change it to use a different Capsule server (see [Use a different Capsule server](ai-assistant#use-a-different-capsule-server)).

Vessel itself works without an account. Signing in is only needed for cloud features such as the assistant.

## Open the assistant

Press <kbd>⌘</kbd> <kbd>K</kbd> on macOS or <kbd>Ctrl</kbd> <kbd>K</kbd> on Windows and Linux, from any page. The **Assistant** panel slides in from the right. Press the same keys again, or click **×**, to close it.

- Type a message and press <kbd>Enter</kbd> to send. <kbd>Shift</kbd> <kbd>Enter</kbd> starts a new line.
- Answers stream in as they are written.
- The trash button (**Clear conversation**) empties the chat and starts over.

On a phone, the assistant opens as a full-height sheet titled **AI Assistant**.

## Build flows with the assistant

When the [flow editor](flow) is open, the assistant can change the flow on the canvas.

1. Open **Flow** and select a flow, or create a new one.
2. Press <kbd>⌘</kbd> <kbd>K</kbd> and describe what you want, for example: "Every 5 seconds, publish the text ping to the topic devices/heartbeat."
3. While the assistant works, its message shows **Generating flow...**.
4. The new or changed nodes appear on the canvas. The message lists each change it made, followed by a short summary.
5. Check the result, adjust node options if needed, then press Run to save and start the flow.

> [!IMPORTANT]
> The assistant only edits the canvas. Its changes count as unsaved until you press Run, and it cannot run, stop or save flows itself. If you switch flows without running, Vessel warns that the changes will be lost.

What the assistant can do to a flow:

| Action | What happens |
| --- | --- |
| Generate a flow | Replaces every node and edge on the canvas with a new graph |
| Add nodes | Adds nodes next to the existing ones |
| Add edges | Connects existing ports. Edges that point at a missing port, run from an input, or already exist are skipped and reported. |
| Remove nodes | Deletes nodes together with their edges |
| Update a node | Changes a node's options, such as a topic or an interval |

With each message, the assistant receives the list of built-in node types with their ports and default options, the nodes and edges currently on the canvas, and the names of your flows. It does not know about your [custom nodes](custom-nodes) and does not see live data, logs or device states.

Useful requests:

- "Build a flow that logs every MQTT message on sensors/temperature."
- "Add a Show Toast after the HTTP request that says Request finished."
- "Change the interval to 500 milliseconds."
- "Remove the unused Log Message nodes."

> [!TIP]
> Be specific about topics, URLs and intervals. Ask for one change at a time when you refine an existing flow, so each result is easy to check. The assistant's node list also includes two types the server cannot run, `CONDITION` and `LOOP`. If one shows up on the canvas, ask for **Branch** or **Logic Operator** instead.

## Analyze images

You can send an image with your question.

1. Click **Attach image** (the picture button next to the text box).
2. Choose an image file of 20 MB or less. A preview appears above the text box.
3. Type a question, or send it without text to get a general description.

To ask about a live camera, open the **⋮** menu on a video stream's card on the dashboard and choose **Analyze Frame**. Vessel captures the current frame, attaches it, and opens the assistant. The menu item is available while the stream is playing.

Messages with an image are answered as a normal chat, so the assistant does not edit flows in the same message.

## Limits and messages

| Message in the chat | What it means |
| --- | --- |
| Please sign in to continue. | You are not signed in to Vessel Cloud, or your session expired. Sign in under **Settings** ▸ **Account**. |
| Pro subscription required. | Your account has no active Pro subscription. |
| Daily usage limit reached. Please try again tomorrow. | You have used today's quota of requests or tokens. |
| Image is too large. Please use an image under 20MB. | The image exceeded the size limit. |

Each request carries the conversation so far. Capsule accepts up to 50 earlier messages and 100,000 characters of history. If a long conversation starts failing, clear it and start a new one.

## How Capsule protects your data

Capsule is the service between the Vessel app and the AI model. It checks your sign-in and subscription, forwards your request to the model, and streams the answer back.

Images are protected with public-key encryption, so only the Capsule server can open them:

1. Capsule publishes a public key. The matching private key exists only in the server's memory; it is never written to disk.
2. For every image, your browser creates a fresh one-time key pair and combines it with Capsule's public key (X25519 key exchange, then HKDF-SHA256) to get a secret key that only your browser and Capsule can compute.
3. The image is encrypted with that key using XChaCha20-Poly1305, an authenticated cipher that also detects tampering. The one-time keys are wiped right after.
4. Capsule decrypts the image in memory, passes it to the model, and wipes the decrypted data from memory once the request is finished.

Capsule also limits how long a key is useful. Its key pair is replaced every 24 hours by default, and the old key is kept for 5 more minutes so requests already on their way still work.

### What is and is not encrypted this way

| Data | How it travels |
| --- | --- |
| Images | End-to-end encrypted from your browser to Capsule, as described above |
| Your messages and the conversation history | Sent in the request body over your connection to Capsule. Use an `https://` Capsule URL so this is encrypted in transit. |
| On the Flow page: node types, your current flow graph and your flow names | Sent with every message, the same way as your messages |

Capsule must read your request to answer it. It sends the decrypted content to OpenAI's API to generate the reply, so your messages and images are processed by that model provider.

### What is stored

- **In Vessel:** the conversation lives only in the open browser tab. Reloading the page or clicking **Clear conversation** erases it. Nothing is saved on your Vessel server.
- **In Capsule:** for each request, Capsule records your user ID, the date, the number of requests, the number of input and output tokens, and whether an image was included. This is used for subscription checks and daily limits. Its logs record sizes and counts, such as the message length, not the text itself.

> [!WARNING]
> Anything you type, and anything visible in an image you send, leaves your network. Do not paste passwords, tokens or other secrets into the chat, and check camera frames before you send them.

## Use a different Capsule server

1. Open **Settings** ▸ **Account**.
2. Under **Capsule Server**, enter the address in **Capsule Server URL**.
3. Click **Save**.

The setting is stored in this browser only. The Capsule service is open source and lives in the `apps/capsule` folder of the [Vessel repository](https://github.com/cartesiancs/vessel), with a Dockerfile. Running your own needs an OpenAI API key and a Supabase project for sign-in, subscription checks and usage tracking. More about the hosted service is on the [Capsule page](https://cartesiancs.com/vessel/capsule).

## Related pages

```cards
The flow editor | flow | Review and run what the assistant built.
Node reference | flow-nodes | What each node the assistant uses does.
Devices and entities | devices-and-entities | Add the cameras you want to analyze.
```
