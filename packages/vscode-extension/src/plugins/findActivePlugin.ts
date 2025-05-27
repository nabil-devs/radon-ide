import { Connector } from "../connect/Connector";
import { IDE } from "../project/ide";
import { ToolPlugin } from "../project/tools";
import { ToolKey } from "../project/tools";

export default function findActivePlugin<T extends ToolPlugin>(pluginId: ToolKey): T | undefined {
  return (
    (Connector.getInstance().connectSession?.toolsManager?.getPlugin(pluginId) as T | undefined) ??
    (IDE.getInstanceIfExists()?.project.deviceSession?.getPlugin(pluginId) as T | undefined)
  );
}
