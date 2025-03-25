export function enableReactDevtoolProfiler(devtoolsAgent, payload) {
  devtoolsAgent._bridge.addListener("RNIDE_reactDevtoolsRequest", handleDevtoolsRequest);

  function handleDevtoolsRequest(data) {
    if (data.method === "startProfiling") {
      console.log("startProfiling", data);
      devtoolsAgent._bridge.send("startProfiling");
    } else if (data.method === "stopProfiling") {
      console.log("stopProfiling", data);
      devtoolsAgent._bridge.send("stopProfiling");
    }
    console.log("testData");

    devtoolsAgent._bridge.addListener("operations", handleOperations);
    devtoolsAgent._bridge.addListener("profilingData", handleProfilingData);
    devtoolsAgent._bridge.addListener("environmentNames", handleEnvironmentNames);
  }

  function handleOperations(operations) {
    console.log("handleOperations");
    console.log("operations", operations);
    sendProfilingData(operations);
  }

  function handleProfilingData(profilingData) {
    console.log("handleProfilingData");
    console.log("profilingData", profilingData);
    sendProfilingData(profilingData);
  }

  function handleEnvironmentNames(environmentNames) {
    console.log("handleEnvironmentNames");
    console.log("environmentNames", environmentNames);
    sendProfilingData(environment);
  }

  function sendProfilingData(data) {
    devtoolsAgent._bridge.send("RNIDE_reactDevtoolsProfilingData", data);
  }
}
