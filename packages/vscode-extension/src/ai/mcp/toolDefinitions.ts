import vscode from "vscode";
import { Logger } from "../../Logger";

interface LibraryDescriptionToolArgs {
  library_npm_name: string;
}

export class LibraryDescriptionTool
  implements vscode.LanguageModelTool<LibraryDescriptionToolArgs>
{
  invoke(
    options: vscode.LanguageModelToolInvocationOptions<LibraryDescriptionToolArgs>,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.LanguageModelToolResult> {
    Logger.error("MCP Called LibraryDescriptionTool");
    return { content: [] };
  }
}

interface QueryDocumentationToolArgs {
  text: string;
}

export class QueryDocumentationTool
  implements vscode.LanguageModelTool<QueryDocumentationToolArgs>
{
  invoke(
    options: vscode.LanguageModelToolInvocationOptions<QueryDocumentationToolArgs>,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.LanguageModelToolResult> {
    Logger.error("MCP Called QueryDocumentationTool");
    return { content: [] };
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ViewScreenshotToolArgs {}

export class ViewScreenshotTool implements vscode.LanguageModelTool<ViewScreenshotToolArgs> {
  invoke(
    options: vscode.LanguageModelToolInvocationOptions<ViewScreenshotToolArgs>,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.LanguageModelToolResult> {
    Logger.error("MCP Called ViewScreenshotTool");
    return { content: [] };
  }
}
