import {
  CancellationToken,
  ExtensionContext,
  Uri,
  WebviewView,
  WebviewViewProvider,
  WebviewViewResolveContext,
} from "vscode";
import { NETWORK_PLUGIN_ID, NetworkPlugin } from "./network-plugin";
import { reportToolOpened, reportToolVisibilityChanged } from "../../project/tools";
import { generateWebviewContent } from "../../panels/webviewContentGenerator";
import { PREVIEW_NETWORK_NAME, PREVIEW_NETWORK_PATH } from "../../webview/utilities/constants";
import findActivePlugin from "../findActivePlugin";

export class NetworkDevtoolsWebviewProvider implements WebviewViewProvider {
  constructor(private readonly context: ExtensionContext) {}
  public resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext,
    token: CancellationToken
  ): void {
    reportToolOpened(NETWORK_PLUGIN_ID);
    const webview = webviewView.webview;
    webview.options = {
      enableScripts: true,
      localResourceRoots: [
        Uri.joinPath(this.context.extensionUri, "dist"),
        Uri.joinPath(this.context.extensionUri, "node_modules"),
      ],
    };

    const networkPlugin = findActivePlugin<NetworkPlugin>(NETWORK_PLUGIN_ID);
    const wsPort = networkPlugin?.websocketPort;
    if (!wsPort) {
      throw new Error("Couldn't retrieve websocket port from network plugin");
    }

    webviewView.onDidChangeVisibility(() =>
      reportToolVisibilityChanged(NETWORK_PLUGIN_ID, webviewView.visible)
    );

    webview.html = generateWebviewContent(
      this.context,
      webviewView.webview,
      this.context.extensionUri,
      PREVIEW_NETWORK_NAME,
      PREVIEW_NETWORK_PATH,
      `localhost:${wsPort}`
    );
  }
}
