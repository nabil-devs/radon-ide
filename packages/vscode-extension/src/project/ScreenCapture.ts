import { Disposable, env } from "vscode";
import { MultimediaData, ScreenCaptureState } from "../common/State";
import { ApplicationContext } from "./ApplicationContext";
import { StateManager } from "./StateManager";
import { DeviceBase } from "../devices/DeviceBase";
import { disposeAll } from "../utilities/disposables";
import { saveMultimedia } from "../utilities/saveMultimedia";
import { CaptureScreenshotOptions } from "../common/Project";
import { exec } from "../utilities/subprocess";
import { Platform } from "../utilities/platform";

const MAX_RECORDING_TIME_SEC = 10 * 60; // 10 minutes

export class ScreenCapture implements Disposable {
  private disposables: Disposable[] = [];
  private recordingTimeout: NodeJS.Timeout | undefined = undefined;
  private recordingTimer: NodeJS.Timeout | undefined = undefined;

  constructor(
    private stateManager: StateManager<ScreenCaptureState>,
    private device: DeviceBase,
    private applicationContext: ApplicationContext
  ) {
    this.disposables.push(
      new Disposable(() => {
        if (this.recordingTimeout || this.recordingTimer) {
          this.stopRecording();
        }
      })
    );

    this.disposables.push(this.stateManager);
  }

  public startRecording(): void {
    this.stateManager.updateState({ isRecording: true, recordingTime: 0 });

    this.device.startRecording();

    this.recordingTimer = setInterval(() => {
      const recordingTime = this.stateManager.getState().recordingTime;
      this.stateManager.updateState({
        recordingTime: recordingTime + 1,
      });
    }, 1000);

    this.recordingTimeout = setTimeout(() => {
      this.stopRecording();
    }, MAX_RECORDING_TIME_SEC * 1000);
  }

  public async captureAndStopRecording() {
    const recording = await this.stopRecording();
    await this.saveMultimedia(recording);
  }

  public async toggleRecording() {
    if (this.recordingTimeout) {
      this.captureAndStopRecording();
    } else {
      this.startRecording();
    }
  }

  public async captureReplay() {
    const replayData = await this.device.captureReplay(
      this.applicationContext.workspaceConfiguration.deviceSettings.deviceRotation
    );
    this.stateManager.updateState({ replayData });
  }

  public async captureScreenshot(options: CaptureScreenshotOptions) {
    const screenshot = await this.device.captureScreenshot(
      this.applicationContext.workspaceConfiguration.deviceSettings.deviceRotation
    );
    if (options.saveToClipboard) {
      await this.saveToClipboard(screenshot);
    } else {
      await this.saveMultimedia(screenshot);
    }
  }

  public async getScreenshot() {
    return this.device.captureScreenshot(
      this.applicationContext.workspaceConfiguration.deviceSettings.deviceRotation
    );
  }

  private async saveMultimedia(multimediaData: MultimediaData) {
    const defaultPath =
      this.applicationContext.workspaceConfiguration.general.defaultMultimediaSavingLocation;
    return saveMultimedia(multimediaData, defaultPath ?? undefined);
  }

  private async saveToClipboard(multimediaData: MultimediaData) {
    try {
      // Use platform-specific clipboard commands to copy the image file
      const filePath = multimediaData.tempFileLocation;

      if (Platform.isMacOS) {
        // macOS: Use pbcopy with image data
        await exec("osascript", [
          "-e",
          `set the clipboard to (read (POSIX file "${filePath}") as «class PNGf»)`,
        ]);
      } else if (Platform.isWindows) {
        // Windows: Use PowerShell to copy image to clipboard
        await exec("powershell", [
          "-Command",
          `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Clipboard]::SetImage([System.Drawing.Image]::FromFile('${filePath}'))`,
        ]);
      } else if (Platform.isLinux) {
        // Linux: Use xclip to copy image to clipboard
        await exec("xclip", ["-selection", "clipboard", "-t", "image/png", "-i", filePath]);
      } else {
        throw new Error("Unsupported platform for clipboard operations");
      }

      // Show success message
      this.applicationContext.editorBindings.showToast("Screenshot copied to clipboard", 2000);
    } catch (error) {
      console.error("Failed to copy screenshot to clipboard:", error);
      this.applicationContext.editorBindings.showToast(
        "Failed to copy screenshot to clipboard",
        2000
      );
      throw error;
    }
  }

  private async stopRecording() {
    clearTimeout(this.recordingTimeout);
    clearInterval(this.recordingTimer);

    this.recordingTimeout = undefined;
    this.recordingTimer = undefined;

    this.stateManager.updateState({ isRecording: false, recordingTime: 0 });

    return this.device.captureAndStopRecording(
      this.applicationContext.workspaceConfiguration.deviceSettings.deviceRotation
    );
  }

  public dispose() {
    disposeAll(this.disposables);
  }
}
