import { Connector } from "../connect/Connector";
import { IDE } from "../project/ide";

export default function findActiveInspectorBridge() {
  return (
    Connector.getInstance().connectSession?.inspectorBridge ??
    IDE.getInstanceIfExists()?.project.deviceSession?.inspectorBridge
  );
}
