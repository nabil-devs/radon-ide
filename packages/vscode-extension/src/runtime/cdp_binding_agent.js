const agent = {
  postMessage: (message) => {
    globalThis.__radon_binding(JSON.stringify(message));
  },
  onmessage: undefined,
};

globalThis.__radon_dispatch = (message) => {
  if (agent.onmessage) {
    agent.onmessage(message);
  }
};

globalThis.__radon_agent = agent;

export default agent;
