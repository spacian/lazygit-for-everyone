import * as vscode from "vscode";
import { version } from "os";

export async function openLazygit(): Promise<void> {
  if (!(await focusActiveLazygitInstance())) {
    await newLazygitInstance();
  }
  return;
}

export async function openLazygitFileHistory(): Promise<void> {
  if (!(await focusActiveLazygitInstance())) {
    await newLazygitInstanceFileHistory();
  }
  return;
}

export async function openLazygitLog(): Promise<void> {
  if (!(await focusActiveLazygitInstance())) {
    await newLazygitInstanceLog();
  }
  return;
}

async function focusActiveLazygitInstance(): Promise<boolean> {
  for (const openTerminal of vscode.window.terminals) {
    if (openTerminal.name === "lazygit") {
      openTerminal.show();
      return true;
    }
  }
  return false;
}

async function newLazygitInstance(): Promise<void> {
  const terminal = vscode.window.createTerminal("lazygit", "powershell");
  console.log(version());
  terminal.sendText("lazygit; exit");
  terminal.show();
  await vscode.commands.executeCommand("workbench.action.terminal.moveToEditor");
  await vscode.commands.executeCommand("workbench.action.terminal.focus");
  if (vscode.window.terminals.length > 0) {
    await vscode.commands.executeCommand("workbench.action.togglePanel");
  }
  return;
}

async function newLazygitInstanceFileHistory(): Promise<void> {
    if (vscode.window.activeTextEditor == null) {
        return;
    }
    const filepath = vscode.window.activeTextEditor.document.fileName
    const terminal = vscode.window.createTerminal("lazygit", "powershell");
    console.log(version())
    terminal.sendText(`lazygit -f ${filepath}; exit`);
    terminal.show();
    await vscode.commands.executeCommand("workbench.action.terminal.moveToEditor");
    await vscode.commands.executeCommand("workbench.action.terminal.focus");
    if (vscode.window.terminals.length > 0) {
      await vscode.commands.executeCommand("workbench.action.togglePanel");
    }
    return;
}


async function newLazygitInstanceLog(): Promise<void> {
    if (vscode.window.activeTextEditor == null) {
        return;
    }
    const terminal = vscode.window.createTerminal("lazygit", "powershell");
    // https://stackoverflow.com/questions/45171300/read-current-git-branch-natively-using-vscode-extension
    // https://stackoverflow.com/questions/46511595/how-to-access-the-api-for-git-in-visual-studio-code
    const path = "";
    terminal.sendText(`lazygit -f ${path}; exit`);
    await vscode.commands.executeCommand("workbench.action.terminal.moveToEditor");
    await vscode.commands.executeCommand("workbench.action.terminal.focus");
    console.log(version());
    terminal.show();
    if (vscode.window.terminals.length > 0) {
      await vscode.commands.executeCommand("workbench.action.togglePanel");
    }
    return;
}
