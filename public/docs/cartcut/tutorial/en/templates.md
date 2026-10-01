# Templates

A template is a whole edit packed into one reusable clip. Make an intro, a lower third or a social post once, then reuse it with different footage and text by filling in its slots.

Templates are `.cttpl` files. Each one contains the edit and the media it needs.

## The Templates tab

Open the **Templates** tab (the grid icon with a plus, last in the sidebar).

![The Templates tab](img/templates-tab.webp "No templates are installed yet.")

| Control | What it does |
| --- | --- |
| Search templates | Find a template by name |
| Import (upload button) | Install a `.cttpl` file |
| Show the templates folder | Reveal where installed templates are kept |

Installed templates are listed under **Templates**, **From Extensions** and **My Templates**. Hover over one of your own templates to see a delete button.

## Use a template

1. Move the playhead to where the template should go.
2. Click its tile (or drag it onto the timeline). It becomes a single **template clip**.
3. Select the template clip. The options panel shows **Transform** and **Slots**.
4. Fill in the slots:
   - **Media slot**: click it and choose a file. The scissors slider sets which part of the file is used. **×** empties the slot.
   - **Text slot**: type the new text.

You can move, resize and animate the template clip like any other clip.

> [!NOTE]
> A project stores which template a clip uses, not a copy of it. If you open the project on a computer that does not have the template installed, the clip shows nothing and the options panel says it is not installed. Import the `.cttpl` file there too.

## Make your own template

1. Build the edit in a project, as you would any video.
2. For every clip that should be swappable, right-click it and choose **Mark replaceable**. (**Unmark replaceable** undoes it.)
3. Move the playhead to a frame that represents the template well. It becomes the thumbnail.
4. Open **Utilities** (the sliders icon) and click **Export Template**.
5. Choose a name and save.

Keep in mind:

- Effect and transition clips do not render inside a template. CartCut warns you how many there are before exporting.
- A template cannot contain another template.
