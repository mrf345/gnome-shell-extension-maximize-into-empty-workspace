const { Meta } = imports.gi
const Me = imports.misc.extensionUtils.getCurrentExtension()
const { Keybindings } = Me.imports.keybindings
const { Window, Workspace } = Me.imports.utils

const _managedWorkspaces = new Map()
const _managedWindows = new Map()
let _windowCreatedHandler, _windowDestroyedHandler

// eslint-disable-next-line no-unused-vars
function enable () {
  const existingWindowsKeys = Window.getAllKeys()
  const isExistingWindow = metaWindow => (
    !_managedWorkspaces.get(metaWindow.toString()) &&
    existingWindowsKeys.includes(metaWindow.toString())
  )

  // Enable navigation keybindings
  Keybindings.addAll(_managedWindows)

  // Move back to the last active workspace once a window is closed
  _windowDestroyedHandler = global.window_manager.connect('destroy', (wm, actor) => {
    const windowKey = actor.meta_window.toString()

    if (_managedWorkspaces.has(windowKey) && !isExistingWindow(actor.meta_window)) {
      const currentWorkspace = actor.meta_window.get_workspace()
      const windowPair = _managedWindows.get(windowKey)
      const windowPairWorkspace = windowPair && windowPair.get_workspace()
      const deleteAndReattachNode = () => {
        _managedWorkspaces.delete(windowKey)
        _managedWindows.delete(windowKey)

        if (windowPair) {
          for (const [k, v] of _managedWindows) {
            if (v.toString() === windowKey) {
              _managedWindows.set(k, windowPair)
              break
            }
          }
        }
      }

      if (Workspace.isOccupied(currentWorkspace)) return deleteAndReattachNode()

      let workspace = _managedWorkspaces.get(windowKey) || windowPairWorkspace

      if (workspace) {
        const workspaces = Workspace.getAll()
        const shouldResetWorkspace = (
          !workspaces.includes(workspace) || !Workspace.isOccupied(workspace)
        )

        if (shouldResetWorkspace) {
          const occupiedWorkspaces = [...workspaces].filter(Workspace.isOccupied)
          const workspaceSource = workspaces.length <= 1 || !occupiedWorkspaces.length
            ? workspaces
            : occupiedWorkspaces;

          [workspace] = workspaceSource.slice(-1)
        }

        deleteAndReattachNode()
        workspace.activate(global.get_current_time())
      }
    }
  })

  // Maximize the created window, and move it to the first empty workspace
  _windowCreatedHandler = global.display.connect('window-created', (d, metaWindow) => {
    if (Window.canMaximize(metaWindow) && !isExistingWindow(metaWindow)) {
      const lastEmptyWorkspaces = Workspace.getAll().reverse().find(Workspace.isEmpty)
      const windowKey = metaWindow.toString()
      const windowWorkspace = metaWindow.get_workspace()
      const workspaceWindow = windowWorkspace.list_windows().find(w => w !== metaWindow)

      _managedWorkspaces.set(windowKey, windowWorkspace)
      if (workspaceWindow) _managedWindows.set(windowKey, workspaceWindow)
      if (lastEmptyWorkspaces) {
        metaWindow.change_workspace(lastEmptyWorkspaces)
        lastEmptyWorkspaces.activate(global.get_current_time())
      } else {
        const lasWorkspaceIndex = global.workspace_manager.get_n_workspaces() - 1
        metaWindow.change_workspace_by_index(lasWorkspaceIndex, true)
        metaWindow.get_workspace().activate(global.get_current_time())
      }

      if (!Window.isMaximized(metaWindow)) metaWindow.maximize(Meta.MaximizeFlags.BOTH)
    }
  })
}

// eslint-disable-next-line no-unused-vars
function disable () {
  Keybindings.removeAll()
  global.window_manager.disconnect(_windowDestroyedHandler)
  global.display.disconnect(_windowCreatedHandler)
}
