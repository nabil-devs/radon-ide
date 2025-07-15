import "./cdp_binding_agent";
import inspectorBridge from "../../lib/inspector_bridge";
import { setup } from "../../lib/network";

const devtoolPlugins = new Set();
globalThis.__RNIDE_register_dev_plugin = (name: string) => {
  devtoolPlugins.add(name);
  inspectorBridge.sendMessage({
    type: "devtoolPluginsChanged",
    data: {
      plugins: Array.from(devtoolPlugins.values()),
    },
  });
};

setup();
