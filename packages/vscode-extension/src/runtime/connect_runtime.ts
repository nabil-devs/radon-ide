import "./cdp_binding_agent";
import inspectorBridge from "../../lib/inspector_bridge";
import { setup } from "../../lib/network";
import { broadcastQueryClient } from "../../lib/plugins/react-query-devtools";

const devtoolPlugins = new Set();
globalThis.__RNIDE_register_dev_plugin = (name) => {
  devtoolPlugins.add(name);
  inspectorBridge.sendMessage({
    type: "devtoolPluginsChanged",
    data: {
      plugins: Array.from(devtoolPlugins.values()),
    },
  });
};

setup();

if (globalThis.__RNIDE_queryClient) {
  broadcastQueryClient(globalThis.__RNIDE_queryClient);
}
