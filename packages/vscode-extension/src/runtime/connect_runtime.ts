import "./cdp_binding_agent";
import inspectorBridge from "../../lib/inspector_bridge";
import { setup } from "../../lib/network";

setup();

inspectorBridge.sendMessage({
  type: "devtoolPluginsChanged",
  data: {
    plugins: ["network"],
  },
});
