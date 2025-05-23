import { DebugSession } from "../debugging/DebugSession";
import { Metro } from "../project/metro";
import { Disposable } from "vscode";
import { ToolsManager } from "../project/tools";
import { BaseInspectorBridge } from "../project/bridge";
import { ToolsDelegate } from "../project/tools";
import { ToolsState } from "../common/Project";

export interface ConnectSessionDelegate {
  onSessionTerminated: () => void;
}

class DebugSessionInspectorBridge extends BaseInspectorBridge {
  constructor(private readonly debugSession: DebugSession) {
    super();
  }

  onBindingCalled(event: any) {
    const { name, payload } = event.body as { name: string; payload: string };
    if (name === "__radon_binding") {
      const { type, data } = JSON.parse(payload);
      this.emitEvent(type, data);
    }
  }

  protected send(message: any) {
    this.debugSession.postMessage(message);
  }
}

export default class ConnectSession implements ToolsDelegate, Disposable {
  private debugSession: DebugSession;
  private inspectorBridge: DebugSessionInspectorBridge;
  public toolsManager: ToolsManager;

  public get port() {
    return this.metro.port;
  }

  constructor(
    private readonly metro: Metro,
    private readonly delegate: ConnectSessionDelegate
  ) {
    this.debugSession = new DebugSession({
      onDebugSessionTerminated: () => {
        this.delegate.onSessionTerminated();
      },
      onBindingCalled: (event: any) => {
        this.inspectorBridge.onBindingCalled(event);
      },
    });
    this.inspectorBridge = new DebugSessionInspectorBridge(this.debugSession);
    this.toolsManager = new ToolsManager(this.inspectorBridge, this);
  }

  public async start(websocketAddress: string) {
    const isUsingNewDebugger = this.metro.isUsingNewDebugger;
    if (!isUsingNewDebugger) {
      throw new Error("Auto-connect is only supported for the new React Native debugger");
    }
    const success = await this.debugSession.startJSDebugSession({
      websocketAddress,
      displayDebuggerOverlay: true,
      isUsingNewDebugger,
      expoPreludeLineCount: this.metro.expoPreludeLineCount,
      sourceMapPathOverrides: this.metro.sourceMapPathOverrides,
    });
    if (success) {
      this.toolsManager.activate();
    }
    return success;
  }

  onToolsStateChange(toolsState: ToolsState) {
    // ???
    console.log("onToolsStateChange", toolsState);
  }

  dispose() {
    this.debugSession.dispose();
  }
}
