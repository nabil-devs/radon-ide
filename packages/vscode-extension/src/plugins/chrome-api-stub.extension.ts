type Callback<Args extends unknown[], Return = void> = (...args: Args) => Return;

class ChromeEvent<Args extends unknown[]> {
  private listeners: Callback<Args>[] = [];

  public addListener(listener: Callback<Args>) {
    this.listeners.push(listener);
  }

  public removeListener(listener: Callback<Args>) {
    const idx = this.listeners.indexOf(listener);
    if (idx !== -1) {
      this.listeners.splice(idx, 1);
    }
  }

  public emit(...args: Args) {
    this.listeners.slice().forEach((listener) => listener(...args));
  }
}

const eventsStub = {
  addListener() {},
  removeListener() {},
};

interface Sender {
  tab: {
    id: string;
  };
}

interface Port {
  name: string;
  postMessage: (message: unknown) => void;
  onMessage: {
    addListener: (listener: (message: unknown) => void) => void;
    removeListener: (listener: (message: unknown) => void) => void;
  };
  onDisconnect: {
    addListener: (listener: () => void) => void;
    removeListener: (listener: () => void) => void;
  };
  sender: Sender;
}

const connectEvent = new ChromeEvent<[Port]>();
export function addConnection(port: Port) {
  connectEvent.emit(port);
}

const messageEvent = new ChromeEvent<[unknown, Sender]>();
export function postMessage(request: unknown, sender: Sender) {
  messageEvent.emit(request, sender);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const chrome = {
  action: {
    enable() {},
    disable() {},
    setIcon() {},
  },
  commands: {
    onCommand: eventsStub,
    getAll(cb: unknown) {},
  },
  contextMenus: {
    create() {},
    removeAll() {},
    onClicked: eventsStub,
  },
  notifications: {
    clear() {},
    create() {},
    onClicked: eventsStub,
  },
  runtime: {
    onInstalled: eventsStub,
    openOptionsPage() {},
    onConnect: connectEvent,
    onMessage: messageEvent,
    onConnectExternal: eventsStub,
    onMessageExternal: eventsStub,
    id: "chrome-stub-runtime",
  },
  storage: {
    onChanged: eventsStub,
    local: {
      set() {},
      get(defaults: unknown, cb: (data: unknown) => void) {
        cb(defaults);
      },
    },
  },
  windows: {
    create() {},
    update() {},
  },
};
