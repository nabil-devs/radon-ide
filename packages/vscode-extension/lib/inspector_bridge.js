const agent = require("./react_devtools_agent");

const messageListeners = [];

const inspectorBridge = {
  sendMessage: (message) => {
    agent.postMessage(message);
  },
  addMessageListener: (listener) => {
    messageListeners.push(listener);
  },
  removeMessageListener: (listener) => {
    messageListeners.splice(messageListeners.indexOf(listener), 1);
  },
};

agent.onmessage = (message) => {
  console.log("XBRIDGE ONMESSAGE", message);
  if (message.data) {
    messageListeners.forEach((listener) => listener(message.data));
  }
};

module.exports = inspectorBridge;
