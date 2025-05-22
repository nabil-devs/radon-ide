const agent = (() => {
  const agent = {
    postMessage: (message) => {
      globalThis.__radon_binding(JSON.stringify(message));
    },
    onmessage: undefined,
  };

  globalThis.__radon_dispatch = (data) => {
    if (agent.onmessage) {
      agent.onmessage({ data });
    }
  };

  return agent;
})();

globalThis.__radon_agent = agent;

setTimeout(() => {
  // console.log("World", globalThis.__r, globalThis.__radon_binding);
  agent.onmessage = (message) => {
    console.log("MESSAGE", message);
  };
  agent.postMessage({
    type: "ping",
  });
}, 2000);
