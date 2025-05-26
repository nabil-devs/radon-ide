export function register(pluginName) {
  globalThis.__RNIDE_register_dev_plugin && globalThis.__RNIDE_register_dev_plugin(pluginName);
}
