import * as vscode from 'vscode';
import { openLazygit, openFileHistory, openLog, openLogCurrentFile, openLazygitCurrentFile } from './src/terminal';


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
  let disposable_lazygit_log_current_file = vscode.commands.registerCommand(
    "lazygit.log_repository_current_file",
    openLogCurrentFile
  );
  let disposable_lazygit_current_file = vscode.commands.registerCommand(
    "lazygit.lazygit_repository_current_file",
    openLazygitCurrentFile
  );
  context.subscriptions.push(disposable_lazygit);
  context.subscriptions.push(disposable_lazygit_log);
  context.subscriptions.push(disposable_lazygit_file_history);
  context.subscriptions.push(disposable_lazygit_log_current_file);
  context.subscriptions.push(disposable_lazygit_current_file);
}

export function deactivate() {}
