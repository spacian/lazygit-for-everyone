import * as vscode from 'vscode';
import { openLazygit, openLazygitFileHistory, openLazygitLog } from './src/terminal';


export function activate(context: vscode.ExtensionContext) {
  let disposable_lazygit = vscode.commands.registerCommand(
    "lazygit-powershell.lazygit",
    openLazygit
  );
  let disposable_lazygit_log = vscode.commands.registerCommand(
    "lazygit-powershell.lazygit_log",
    openLazygitLog
  );
  let disposable_lazygit_file_history = vscode.commands.registerCommand(
    "lazygit-powershell.lazygit_file_history",
    openLazygitFileHistory
  );
  context.subscriptions.push(disposable_lazygit);
  context.subscriptions.push(disposable_lazygit_log);
  context.subscriptions.push(disposable_lazygit_file_history);
}

export function deactivate() {}
