import { Disposable } from "vscode";

export interface RadonInspectorBridgeEvents {
  appReady: [];
  navigationChanged: [{ displayName: string; id: string }];
  fastRefreshStarted: [];
  fastRefreshComplete: [];
  openPreviewResult: [{ previewId: string; error?: string }];
  inspectData: [{ id: number }];
  devtoolPluginsChanged: [{ plugins: string[] }];
  rendersReported: [any];
  pluginMessage: [{ pluginId: string; type: string; data: any }];
  isProfilingReact: [boolean];
}

export interface RadonInspectorBridge {
  sendPluginMessage(scope: string, type: string, data: any): void;
  sendInspectRequest(x: number, y: number, id: number, requestStack: boolean): void;
  sendOpenNavigationRequest(id: string): void;
  sendOpenPreviewRequest(previewId: string): void;
  sendShowStorybookStoryRequest(componentTitle: string, storyName: string): void;
  onEvent<K extends keyof RadonInspectorBridgeEvents>(
    event: K,
    listener: (...payload: RadonInspectorBridgeEvents[K]) => void
  ): Disposable;
}

export type RadonInspectorEventName = keyof RadonInspectorBridgeEvents;
