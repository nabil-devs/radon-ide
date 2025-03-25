import http, { Server } from "http";
import { spawn } from "child_process";
import path from "path";
import { commands, Disposable, window } from "vscode";
import { WebSocketServer, WebSocket } from "ws";
import { Logger } from "../../Logger";
import { extensionContext } from "../../utilities/extensionContext";
import { ReactDevtoolsWebviewProvider } from "./ReactDevtoolsWebviewProvider";
import { ToolKey, ToolPlugin } from "../../project/tools";
import { Devtools } from "../../project/devtools";

export const REACT_DEVTOOLS_PLUGIN_ID = "react-devtools";

function startViteServer(onReady: () => void) {
  const process = spawn("npm", ["run", "watch:react-devtools-webview"], {
    cwd: path.join(__dirname, ".."),
    shell: true,
  });

  process.stdout.on("data", (data) => {
    const output = data.toString();

    if (output.includes("ready in") || output.includes("Local:")) {
      onReady();
    }
  });

  process.stderr.on("data", (data) => {
    Logger.error("ERROR:", data.toString());
  });

  process.on("close", (code) => {
    Logger.debug(`Process exited with code ${code}`);
  });
}

let initialized = false;
function initialize() {
  if (initialized) {
    return;
  }
  Logger.debug("Initializing React Devtools tool");

  startViteServer(() => {
    initialized = true;
    extensionContext.subscriptions.push(
      window.registerWebviewViewProvider(
        `RNIDE.Tool.ReactDevTools.view`,
        new ReactDevtoolsWebviewProvider(extensionContext),
        { webviewOptions: { retainContextWhenHidden: true } }
      )
    );
  });
}

class ReactDevtoolsWebsocketBackend implements Disposable {
  private server: Server;
  private sessions: Set<WebSocket> = new Set();

  constructor(private readonly devtools: Devtools) {
    this.server = http.createServer(() => {});
    const wss = new WebSocketServer({ server: this.server });

    wss.on("connection", (ws) => {
      this.sessions.add(ws);

      ws.on("message", (message) => {
        try {
          const payload = JSON.parse(message.toString());
          console.log("REACT_DEV_PLUGIN: payload", payload);
          this.devtools.send("RNIDE_reactDevtoolsRequest", payload);
        } catch (e) {
          console.error("Network CDP invalid message format:", e);
        }
      });

      ws.on("close", () => {
        this.sessions.delete(ws);
      });
    });
  }

  public get port() {
    const address = this.server.address();
    Logger.debug("Server address:", address);

    if (address && typeof address === "object") {
      return address.port;
    }
    throw new Error("Server address is not available");
  }

  public async start() {
    // if server is already started, we return immediately
    if (this.server.listening) {
      return;
    }
    return new Promise<void>((resolve) => {
      this.server.listen(0, () => {
        resolve();
      });
    });
  }

  public broadcast(profilingData: string) {
    Logger.debug("Broadcasting profiling data to all sessions", profilingData);

    this.sessions.forEach((ws) => {
      ws.send(profilingData);
    });
  }

  public dispose() {
    this.server.close();
  }
}

export class ReactDevtoolsPlugin implements ToolPlugin {
  public readonly id: ToolKey = REACT_DEVTOOLS_PLUGIN_ID;
  public readonly label = "React Devtools";

  public available = false;
  public readonly persist = true;

  private readonly websocketBackend;

  constructor(private readonly devtools: Devtools) {
    this.websocketBackend = new ReactDevtoolsWebsocketBackend(devtools);
    initialize();
  }

  public get websocketPort() {
    return this.websocketBackend.port;
  }

  public activate() {
    this.websocketBackend.start().then(() => {
      commands.executeCommand("setContext", "RNIDE.Tool.ReactDevTools.available", true);
      this.devtools.addListener(this.devtoolsListener);
      this.devtools.send("startProfiling");
      // this.devtools.send("RNIDE_enableReactDevtoolProfiler", { enable: true });
    });
  }

  devtoolsListener = (event: string, payload: any) => {
    console.log("React Devtools plugin received event:", event, payload);
    if (event === "RNIDE_reactDevtoolsMessage") {
      this.websocketBackend.broadcast(payload);
    } else if (event === "RNIDE_appReady") {
      this.devtools.send("RNIDE_enableReactDevtoolProfiler", { enable: true });
    }
  };

  deactivate(): void {
    this.devtools.removeListener(this.devtoolsListener);
    // this.devtools.send("stopProfiling");
    this.devtools.send("RNIDE_enableReactDevtoolProfiler", { enable: false });
    commands.executeCommand("setContext", "RNIDE.Tool.ReactDevTools.available", false);
  }

  openTool(): void {
    commands.executeCommand("RNIDE.Tool.ReactDevTools.view.focus");
  }

  dispose() {
    this.devtools.removeListener(this.devtoolsListener);
  }
}
