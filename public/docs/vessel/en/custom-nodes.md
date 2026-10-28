# Custom nodes

When no built-in node does what you need, write your own. A custom node is a short [Rhai](https://rhai.rs) script stored on the Vessel server, plus a small definition that tells the flow editor which ports the node has. Once registered, it appears in the add menu like any other node.

## How a custom node works

A custom node has two parts:

- **A script file** in the server's code workspace. It defines a function `main(inputs)` that receives the node's input values and returns its output values.
- **A registry entry** that gives the node a type name starting with `_`, lists its input and output ports, and points to the script file.

When the flow runs, the server calls `main` every time the node's inputs are ready:

1. `inputs` is a map from input port name to the value that arrived on that port.
2. Your script returns a map from output port name to value.
3. Each returned key that matches an output port is sent along that port's edges. Keys that match no port are ignored.

```rust
fn main(inputs) {
    let a = if "a" in inputs { inputs.a } else { 0 };
    let b = if "b" in inputs { inputs.b } else { 0 };
    #{ sum: a + b }
}
```

Rhai looks a lot like JavaScript and Rust. `#{ ... }` is an object map. The [Rhai book](https://rhai.rs/book/) covers the language.

## Turn on the code workspace

Script files live in the server's code workspace. It is off by default.

1. Open **Settings** ▸ **Services**.
2. Under **Code workspace**, turn on **Code service**.
3. **Code** now appears in the sidebar under **Services**.

The **Code** page is a file browser and editor for the server's `storage` folder. Scripts refer to this folder as `{:code}`, so a file named `c_to_f.rhai` at the top level has the path `{:code}/c_to_f.rhai`.

## Build a node step by step

This example converts a temperature from Celsius to Fahrenheit. It has one input, `celsius`, and one output, `fahrenheit`.

### 1. Write the script

1. Open **Code** from the sidebar.
2. Next to **Project**, click the new file button and name the file `c_to_f.rhai`. Click **Create**.
3. Select the file, paste the script below, and click **Save**.

```rust
fn main(inputs) {
    let c = if "celsius" in inputs { inputs.celsius } else { 0.0 };
    #{ fahrenheit: c * 9.0 / 5.0 + 32.0 }
}
```

### 2. Register the node

1. Open a flow in the [flow editor](flow).
2. In the canvas toolbar, click the custom node button (the blocks icon, last in the column). **Custom Node Registry** opens.
3. Click **Add New Node**.
4. In **Node Type (ID)**, type `_c_to_f`. The leading underscore is added for you if you leave it out.
5. In **Data (JSON)**, paste the definition below.
6. Click **Create Node**.

```json
{
  "connectors": [
    { "id": "id", "name": "celsius", "type": "in" },
    { "id": "id", "name": "fahrenheit", "type": "out" }
  ],
  "nodeType": "_c_to_f",
  "data": { "path": "{:code}/c_to_f.rhai" },
  "dataType": { "path": "FIXED_STRING" }
}
```

| Field | Meaning |
| --- | --- |
| `connectors` | The ports, top to bottom. `type` is `in` or `out`, and `name` is the key your script reads or returns. Keep `id` as `"id"`; real IDs are generated when the node is placed. |
| `nodeType` | The same value as **Node Type (ID)**. |
| `data.path` | The script file. `{:code}` stands for the code workspace folder. |
| `dataType` | How `data` fields appear in the node's **Edit** panel. `FIXED_STRING` shows the path read-only. |

### 3. Use it in a flow

1. Click the add button and open **Custom Node**. The node is listed by its type, so `_c_to_f` appears as **C To F**.
2. Add a **Set Variable** node. Set `variableType` to `number` and `variable` to `21.5`.
3. Add a **Log Message** node.
4. Connect **Set Variable** `out` to **C To F** `celsius`, and **C To F** `fahrenheit` to **Log Message** `message`.
5. Click Run. The **LOGS** panel shows `{"message":70.7}`.

## Writing scripts

### Inputs

- Only inputs that are connected and have received a value are in `inputs`. Check with `"name" in inputs` before reading, as in the examples above.
- Values arrive as Rhai types: JSON numbers become integers or floats, JSON objects become maps, arrays become arrays, text becomes strings. Integers and floats can be mixed in arithmetic.
- Read a value with `inputs.name`, or `inputs["name"]` if the name has unusual characters.

### Outputs

- `main` must return an object map. Returning anything else is an error.
- Return only the outputs you want to fire. A port whose key is missing sends nothing, so nodes connected to it do not run. This is an easy way to filter values.

```rust
fn main(inputs) {
    let v = if "value" in inputs { inputs.value } else { 0 };
    if v > 100 {
        #{ high: v }
    } else {
        #{ normal: v }
    }
}
```

### Built-in helpers

On top of the standard Rhai library, Vessel adds:

| Function | Returns |
| --- | --- |
| `epoch_ms()` | The current time in milliseconds since 1970 |
| `rand_float()` and the other functions of the `rhai-rand` package | Random numbers |
| `parse_json(text)` | Rhai's standard JSON parser, useful after **Http Request** |

### Things to know

- The script file is read again every time the node runs. Save a change in the **Code** page and the next run uses it; you do not need to restart the flow.
- A node keeps no state between runs. To count or accumulate, feed the previous value back in through an input.
- Script errors, a missing file, or a result that is not a map are written to the server log, not to the **LOGS** panel. Look under **Settings** ▸ **Log** when a custom node seems to do nothing.

## Manage registered nodes

Open **Custom Node Registry** from the canvas toolbar:

- The edit button opens the definition. **Node Type (ID)** cannot be changed; edit **Data (JSON)** and click **Save Changes**.
- The trash button deletes the node type after you confirm with **Continue**.

> [!IMPORTANT]
> A node on the canvas keeps a copy of its ports and script path from the moment you added it. After changing `connectors` or `path` in the registry, delete the node from your flow and add it again.

## Presets

**Add from Preset** lists ready-made node definitions. Filter by category, then click **Register** for one node or **Register All** for the whole list or category.

| Category | Presets |
| --- | --- |
| Math | Absolute Value, Clamp, Round, Power, Square Root, Minimum, Maximum, Map Range |
| String | Concatenate, To Uppercase, To Lowercase, Trim, String Length, Contains, Replace, Split, Substring, Reverse String |
| Array | Array Length, Array Push, Array Reverse, Array Join, Array Sort, Array Sum, Array Average |
| Random | Random Number, Random Range, Random Boolean, Random Choice |
| Data Utility | Passthrough, Timestamp, Template, To JSON String, Parse JSON |
| Counter | Counter, Accumulator |

> [!WARNING]
> Registering a preset adds only its definition. Each preset expects a script file at the top level of the code workspace, such as `{:code}/math_abs.rhai`. If that file is missing, the node fails when it runs. Place a preset node and open its **Edit** panel to see the file it expects in `path`.

> [!NOTE]
> The Vessel repository contains a `packages/custom-node-utils` folder with Python examples. The current server runs custom nodes as Rhai scripts only; it does not execute Python files.

## Related pages

```cards
Node reference | flow-nodes | Every built-in node and its ports.
The flow editor | flow | Add, connect and run nodes.
Troubleshooting and FAQ | troubleshooting | What to check when a flow misbehaves.
```
