const { main: Main } = imports.ui
const { Shell, Meta } = imports.gi
const Me = imports.misc.extensionUtils.getCurrentExtension()
const { getSettings, Window } = Me.imports.utils

// eslint-disable-next-line no-unused-vars
const Keybindings = {
  handlers: {},

  addAll: function (managedWindows) {
    const settings = getSettings()
    const mode = Shell.ActionMode.OVERVIEW | Shell.ActionMode.NORMAL
    const flag = Meta.KeyBindingFlags.NONE

    for (const [key, handler] of Object.entries(this.handlers)) {
      Main.wm.addKeybinding(
        key, settings, flag, mode,
        () => handler(managedWindows)
      )
    }
  },

  removeAll: function () {
    Object.keys(this.handlers).forEach(k => Main.wm.removeKeybinding(k))
  }
}

Keybindings.handlers['move-up-short-cut'] = managedWindows => {
  const currentWorkspace = global.workspace_manager.get_active_workspace()
  const windowKey = currentWorkspace.list_windows()
    .map(w => w.toString())
    .find(k => managedWindows.has(k))

  if (windowKey) {
    const parentWindow = managedWindows.get(windowKey)

    if (Window.doesExist(parentWindow)) {
      parentWindow.get_workspace().activate(global.get_current_time())
    }
  }
}

Keybindings.handlers['move-down-short-cut'] = managedWindows => {
  const currentWorkspace = global.workspace_manager.get_active_workspace()
  const currentKeys = currentWorkspace.list_windows().map(w => w.toString())
  const [childKey] = Array.from(managedWindows.entries())
    .reverse()
    .find(([_, w]) => currentKeys.includes(w.toString())) || [0]

  if (childKey) {
    const childWindow = Window.getAll().find(w => w.toString() === childKey)

    if (childWindow) childWindow.get_workspace().activate(global.get_current_time())
  }
}
