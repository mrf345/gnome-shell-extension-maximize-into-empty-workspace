const { Gio } = imports.gi
const Me = imports.misc.extensionUtils.getCurrentExtension()

// eslint-disable-next-line no-unused-vars, no-var
var Window = {
  isMaximized: w => w && w.maximized_vertically && w.maximized_horizontally,
  canMaximize: w => w && w.can_maximize() && w.can_minimize(),
  getAllKeys: () => global.get_window_actors().map(a => a.meta_window.toString()),
  getAll: () => global.get_window_actors().map(a => a.meta_window),
  doesExist: function (w) { return w && this.getAllKeys().includes(w.toString()) }
}

// eslint-disable-next-line no-unused-vars, no-var
var Workspace = {
  isOccupied: w => w && !!w.list_windows().length,
  isEmpty: w => w && !w.list_windows().length,
  getAll: () => {
    let i = -1

    return Array(global.workspace_manager.get_n_workspaces()).fill()
      .map(() => global.workspace_manager.get_workspace_by_index(++i))
  }
}

// eslint-disable-next-line no-unused-vars, no-var
var getSettings = (schemaKey = 'org.gnome.shell.extensions.maximize-into-empty-workspace') => {
  const schemaSource = Gio.SettingsSchemaSource.new_from_directory(
    Me.dir.get_child('schemas').get_path(),
    Gio.SettingsSchemaSource.get_default(),
    false
  )
  const schemaObj = schemaSource.lookup(schemaKey, true)

  if (!schemaObj) throw new Error(`Schema not found "${schemaKey}"`)
  return new Gio.Settings({ settings_schema: schemaObj })
}
