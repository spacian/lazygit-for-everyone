import * as vscode from 'vscode';
import { openLazygit, openFileHistory, openLog } from './src/terminal';


export function activate(context: vscode.ExtensionContext) {
  let disposable_lazygit = vscode.commands.registerCommand(
    "lazygit.lazygit",
    openLazygit
  );
  let disposable_lazygit_log = vscode.commands.registerCommand(
    "lazygit.log",
    openLog
  );
  let disposable_lazygit_file_history = vscode.commands.registerCommand(
    "lazygit.file_history",
    openFileHistory
  );
  context.subscriptions.push(disposable_lazygit);
  context.subscriptions.push(disposable_lazygit_log);
  context.subscriptions.push(disposable_lazygit_file_history);
}

export function deactivate() {}
