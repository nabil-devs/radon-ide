import vscode from "vscode";
import { Logger } from "../../Logger";
import { screenshotToolExec } from "./toolExecutors";
import { invokeToolCall } from "../shared/api";
import { textToToolResponse } from "./utils";

const PLACEHOLDER_ID = "1234";

interface LibraryDescriptionToolArgs {
  library_npm_name: string;
}

export class LibraryDescriptionTool
  implements vscode.LanguageModelTool<LibraryDescriptionToolArgs>
{
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<LibraryDescriptionToolArgs>,
    token: vscode.CancellationToken
  ): Promise<vscode.LanguageModelToolResult> {
    Logger.error("MCP Called LibraryDescriptionTool", token);
    try {
      return await invokeToolCall("get_library_description", options.input, PLACEHOLDER_ID);
    } catch (error) {
      // TODO: Add / Use AuthorizationError error class
      // TODO: Pretty errors for unauthorized users
      // TODO: Disable tools for users with no license
      return textToToolResponse(String(error));
    }
  }
}

interface QueryDocumentationToolArgs {
  text: string;
}

export class QueryDocumentationTool
  implements vscode.LanguageModelTool<QueryDocumentationToolArgs>
{
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<QueryDocumentationToolArgs>,
    token: vscode.CancellationToken
  ): Promise<vscode.LanguageModelToolResult> {
    Logger.error("MCP Called QueryDocumentationTool", token);
    try {
      return await invokeToolCall("query_documentation", options.input, PLACEHOLDER_ID);
    } catch (error) {
      // TODO: Add / Use AuthorizationError error class
      // TODO: Pretty errors for unauthorized users
      // TODO: Disable tools for users with no license
      return textToToolResponse(String(error));
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ViewScreenshotToolArgs {}

export class ViewScreenshotTool implements vscode.LanguageModelTool<ViewScreenshotToolArgs> {
  async invoke(): Promise<vscode.LanguageModelToolResult> {
    // NOTE: Image outputs are not supported by static tool definitions.
    // ref: https://github.com/microsoft/vscode/issues/245104
    return await screenshotToolExec();
  }
}
