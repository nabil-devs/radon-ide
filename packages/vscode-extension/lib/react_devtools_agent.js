const agent = (() => {
  let devtoolsAgent = undefined;
  let messageQueue = [];

  const agent = {
    postMessage: (message) => {
      if (devtoolsAgent) {
        devtoolsAgent._bridge.send("RNIDE_message", message);
      } else {
        messageQueue.push(message);
      }
    },
    onmessage: undefined,
  };

  const setDevtoolsAgent = (agent) => {
    if (!agent) {
      return;
    }
    devtoolsAgent = agent;
    devtoolsAgent._bridge.addListener("RNIDE_message", (message) => {
      console.log("XAGENT ONMESSAGE", message);
      if (agent.onmessage) {
        agent.onmessage({ data: message });
      }
    });
    const messages = messageQueue;
    messageQueue = [];
    messages.forEach((message) => {
      devtoolsAgent._bridge.send("RNIDE_message", message);
    });
  };

  const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (hook.reactDevtoolsAgent) {
    setDevtoolsAgent(hook.devtoolsAgent);
  } else {
    hook.on("react-devtools", setDevtoolsAgent);
  }

  return agent;
})();

globalThis.__radon_agent = agent;

module.exports = agent;
