import { useSelectedDeviceSessionState } from "../hooks/selectedSession";
import { useProject } from "../providers/ProjectProvider";
import { ButtonOption, IconButtonWithOptions } from "./IconButtonWithOptions";
import { use$ } from "@legendapp/state/react";
import { useStore } from "../providers/storeProvider";
import RecordingIcon from "./icons/RecordingIcon";
import ReplayIcon from "./icons/ReplayIcon";

export function ScreenshotButton({ disabled }: { disabled: boolean }) {
  const { project } = useProject();
  const selectedDeviceSessionState = useSelectedDeviceSessionState();

  const isRecording = use$(selectedDeviceSessionState.screenCapture.isRecording);

  function toggleRecording() {
    try {
      project.toggleRecording();
    } catch (e) {
      if (isRecording) {
        project.showDismissableError("Failed to capture recording");
      }
    }
  }

  const options: Array<ButtonOption> = [
    [
      <>
        <span className="codicon codicon-device-camera" />
        Save screenshot
      </>,
      () => project.captureScreenshot({}),
    ],
    [
      <>
        <span className="codicon codicon-clippy" />
        Screenshot to clipboard
      </>,
      () => project.captureScreenshot({ saveToClipboad: true }),
    ],
    [
      <>
        <RecordingIcon />
        Record screen
      </>,
      () => toggleRecording(),
    ],
  ];

  const store$ = useStore();
  const deviceSettings = use$(store$.workspaceConfiguration.deviceSettings);
  const showReplayButton = deviceSettings.replaysEnabled && !isRecording;
  if (showReplayButton) {
    async function handleReplay() {
      try {
        await project.captureReplay();
      } catch (e) {
        project.showDismissableError("Failed to capture replay");
      }
    }
    options.push([
      <>
        <ReplayIcon />
        Replay few last seconds
      </>,
      () => handleReplay(),
    ]);
  }

  return (
    <IconButtonWithOptions
      className={isRecording ? "button-recording-on" : ""}
      onClick={isRecording ? () => toggleRecording() : () => project.captureScreenshot({})}
      tooltip={{
        label: "Save screenshot",
        side: "bottom",
      }}
      data-testid="top-bar-screenshot-button"
      disabled={disabled}
      options={isRecording ? undefined : options}>
      {isRecording ? <RecordingView /> : <span className="codicon codicon-device-camera" />}
    </IconButtonWithOptions>
  );
}

function RecordingView() {
  const selectedDeviceSessionState = useSelectedDeviceSessionState();
  const recordingTime = use$(selectedDeviceSessionState.screenCapture.recordingTime) ?? 0;

  const recordingTimeFormat = `${Math.floor(recordingTime / 60)}:${(recordingTime % 60)
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="recording-rec-indicator">
      <div className="recording-rec-dot" />
      <span>{recordingTimeFormat}</span>
    </div>
  );
}
