<h1 style='display: inline-block;'>maximize-into-empty-workspace</h1>
<a href="https://standardjs.com" style='display: inline-block;'>
    <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide">
</a>


Gnome shell extension to open windows maximized in the first empty workspace, and adds couple of keybindings to help navigating through them by keeping track of which workspace each window originated from.


#### Features
- creates maximized windows and moves them to empty workspaces
- moves back to the original workspace (if possible) once the new window is closed
- keeps track of the stack of windows created and help navigating up (`Ctrl + Alt + Page Up`) or down (`Ctrl + Alt + Page Down`) the stack
- multiple windows could be created from the same workspace, a new window and its descendants will take precedence. once it is and its descendants are closed the older stack is restored

#### Development

| Command       | Description                                                                                |
|---------------|--------------------------------------------------------------------------------------------|
| `make test`   | copies the extension content to gnome's extensions folder, restart gnome, and display logs |
| `make lint`   | runs `standardJS` style check                                                              |
| `make format` | formats the code                                                                           |
| `make build`  | compiles the schema, and zips the extension                                                |
