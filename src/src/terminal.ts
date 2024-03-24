import * as vscode from "vscode";
import { version } from "os";
import { API as GitAPI, GitExtension, APIState } from '../typings/git';

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
    await vscode.commands.executeCommand("workbench.action.closePanel");
    const terminal = vscode.window.createTerminal("lazygit", "powershell");
    console.log(version());
    terminal.sendText("lazygit; exit");
    terminal.show();
    await vscode.commands.executeCommand("workbench.action.terminal.moveToEditor");
    await vscode.commands.executeCommand("workbench.action.terminal.focus");
    // if (vscode.window.terminals.length > 0) {
    //     await vscode.commands.executeCommand("workbench.action.togglePanel");
    // }
    return;
}

async function newLazygitInstanceFileHistory(): Promise<void> {
    if (vscode.window.activeTextEditor == null) {
        return;
    }
    const filepath = vscode.window.activeTextEditor.document.fileName
    await vscode.commands.executeCommand("workbench.action.closePanel");
    const terminal = vscode.window.createTerminal("lazygit", "powershell");
    console.log(version())
    terminal.sendText(`lazygit -f ${filepath}; exit`);
    terminal.show();
    await vscode.commands.executeCommand("workbench.action.terminal.moveToEditor");
    await vscode.commands.executeCommand("workbench.action.terminal.focus");
    // if (vscode.window.terminals.length > 0) {
    //     await vscode.commands.executeCommand("workbench.action.togglePanel");
    // }
    return;
}
class GitRepositoryQP implements vscode.QuickPickItem {
    label: string;
    description: string;

    constructor(name: string, description: string = "") {
        this.label = name;
        this.description = description;
    }
}

// in your code assuming you have a list of items that you map to this object

async function newLazygitInstanceLog(): Promise<void> {
    if (vscode.window.activeTextEditor == null) {
        return;
    }
    // https://stackoverflow.com/questions/45171300/read-current-git-branch-natively-using-vscode-extension
    // https://stackoverflow.com/questions/46511595/how-to-access-the-api-for-git-in-visual-studio-code
    const path = "";
    const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git')!.exports;
    const git = gitExtension.getAPI(1);
    const rep = git.repositories.at(0);
    const options = git.repositories.map((item) => {
        return new GitRepositoryQP(
        item.rootUri.fsPath.split("\\").pop()!.split("/").pop()!,
        item.rootUri.fsPath,
        );
    });

    const pick = await vscode.window.showQuickPick(options, {
        title: "Choose repository for lazygit log",
        canPickMany: false,
    });
    if (pick == undefined) {
        return;
    }
    await vscode.commands.executeCommand("workbench.action.closePanel");
    const terminal = vscode.window.createTerminal("lazygit", "powershell");
    terminal.sendText(`lazygit -f ${pick.description}; exit`);
    await vscode.commands.executeCommand("workbench.action.terminal.moveToEditor");
    await vscode.commands.executeCommand("workbench.action.terminal.focus");
    console.log(version());
    terminal.show();
    // if (vscode.window.terminals.length > 0) {
    //     await vscode.commands.executeCommand("workbench.action.togglePanel");
    // }
    return;
}
