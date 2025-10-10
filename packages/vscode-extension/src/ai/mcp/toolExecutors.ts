import { readFileSync } from "fs";

import { IDE } from "../../project/ide";
import { pngToToolContent, textToToolContent, textToToolResponse } from "./utils";
import { TextContent, ToolResponse } from "./models";
import { Output } from "../../common/OutputChannel";
import { DevicePlatform } from "../../common/State";

const DEVICE_OFF_MESSAGE =
  "The development viewport device is likely turned off.\n" +
  "Please turn on the Radon IDE emulator before proceeding.";

export async function sendTouchToolExec(): Promise<ToolResponse> {
  const project = IDE.getInstanceIfExists()?.project;

  if (!project?.deviceSession) {
    return textToToolResponse("Could not perform touch!\n" + DEVICE_OFF_MESSAGE);
  }

  project.dispatchTouches([{ xRatio: 0.5, yRatio: 0.5 }], "Down");
  project.dispatchTouches([{ xRatio: 0.5, yRatio: 0.5 }], "Up");

  // Return screenshot to display resonse, could also return state diffs, rerenders, etc?
  // There are a lot of options for comparing the new screen to the previous one, the AI has to get solid feedback.
  return textToToolResponse("foo");
}

export async function screenshotToolExec(): Promise<ToolResponse> {
  const project = IDE.getInstanceIfExists()?.project;

  if (!project?.deviceSession) {
    return textToToolResponse("Could not capture a screenshot!\n" + DEVICE_OFF_MESSAGE);
  }

  const screenshot = await project.getScreenshot();

  const contents = readFileSync(screenshot.tempFileLocation, { encoding: "base64" });

  return {
    content: [pngToToolContent(contents)],
  };
}

export async function readLogsToolExec(): Promise<ToolResponse> {
  const ideInstance = IDE.getInstanceIfExists();

  const registry = ideInstance?.outputChannelRegistry;
  const session = ideInstance?.project.deviceSession;

  if (!registry || !session) {
    return textToToolResponse("Radon IDE hasn't produced any logs yet. " + DEVICE_OFF_MESSAGE);
  }

  const isAndroid = session.platform === DevicePlatform.Android;

  const buildLogs = registry.getOrCreateOutputChannel(
    isAndroid ? Output.BuildAndroid : Output.BuildIos
  );

  const packageManagerLogs = registry.getOrCreateOutputChannel(Output.PackageManager);

  const metroLogs = registry.getOrCreateOutputChannel(Output.MetroBundler);

  const deviceLogs = registry.getOrCreateOutputChannel(
    isAndroid ? Output.AndroidDevice : Output.IosDevice
  );

  const combinedLogsContent: TextContent[] = [];

  if (!buildLogs.isEmpty()) {
    const rawLogs = ["=== BUILD PROCESS LOGS ===\n\n", ...buildLogs.readAll()];
    combinedLogsContent.push(textToToolContent(rawLogs.join("")));
  }

  if (!packageManagerLogs.isEmpty()) {
    const rawLogs = ["=== JS PACKAGER LOGS ===\n\n", ...packageManagerLogs.readAll()];
    combinedLogsContent.push(textToToolContent(rawLogs.join("")));
  }

  if (!metroLogs.isEmpty()) {
    const rawLogs = ["=== METRO LOGS ===\n\n", ...metroLogs.readAll()];
    combinedLogsContent.push(textToToolContent(rawLogs.join("")));
  }

  if (!deviceLogs.isEmpty()) {
    const rawLogs = ["=== APPLICATION LOGS ===\n\n", ...deviceLogs.readAll()];
    combinedLogsContent.push(textToToolContent(rawLogs.join("")));
  }

  if (session.previewReady) {
    const screenshot = await session.getScreenshot();
    const contents = readFileSync(screenshot.tempFileLocation, { encoding: "base64" });

    return {
      content: [...combinedLogsContent, pngToToolContent(contents)],
    };
  }

  return {
    content: combinedLogsContent,
  };
}
