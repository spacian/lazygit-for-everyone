import * as vscode from "vscode";
import { version } from "os";
import { API as GitAPI, GitExtension, APIState } from '../typings/git';

export async function openLazygit(): Promise<void> {
    if (!(await focusActiveInstance())) {
        await newLazygit();
    }
    return;
}

export async function openFileHistory(): Promise<void> {
    if (!(await focusActiveInstance())) {
        await newFileHistory();
    }
    return;
}

export async function openLog(): Promise<void> {
    if (!(await focusActiveInstance())) {
        await newLog();
    }
    return;
}

class GitRepositoryQP implements vscode.QuickPickItem {
    label: string;
    description: string;

    constructor(name: string, description: string) {
        this.label = name;
        this.description = description;
    }
};

function getShell(): string {
    if (version().includes("Windows")) {
        return "powershell";
    }
    return "bash";
}

function buildCommand(command: string): string {
    if (version().includes("Windows")) {
        return command + " ; exit";
    }
    return command + " && exit";
}

async function focusActiveInstance(): Promise<boolean> {
    for (const openTerminal of vscode.window.terminals) {
      if (openTerminal.name === "lazygit") {
          openTerminal.show();
          return true;
        }
    }
    return false;
}

async function execute(shell: string, command: string): Promise<void> {
    const terminal = vscode.window.createTerminal("lazygit", shell);
    terminal.show();
    await vscode.commands.executeCommand("workbench.action.terminal.focus");
    await vscode.commands.executeCommand("workbench.action.terminal.moveToEditor");
    await vscode.commands.executeCommand("workbench.action.closePanel");
    terminal.sendText(command);
    return;
}

async function getRepositoryPath(lazygit_specifier: string = ""): Promise<undefined|string> {
    const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git');
    if (gitExtension === undefined) {
        return undefined;
    }
    const git = gitExtension.exports.getAPI(1);
    const options = git.repositories.map((item) => {
        return new GitRepositoryQP(
        item.rootUri.fsPath.split("\\").pop()!.split("/").pop()!,
        item.rootUri.fsPath,
        );
    });
    if (options.length === 0) {
        return undefined;
    }
    if (options.length === 1) {
        return options[0].description;
    }
    const pick = await vscode.window.showQuickPick(options, {
        title: "Choose repository for lazygit " + lazygit_specifier,
    });
    if (pick === undefined) {
        return undefined;
    }
    return pick.description;
}

async function newLazygit(): Promise<void> {
    const repository_path = await getRepositoryPath();
    if (repository_path === undefined) {
        return;
    }
    const command = buildCommand(`lazygit -p ${repository_path}`);
    await execute(getShell(), command);
    return;
}

async function newFileHistory(): Promise<void> {
    if (vscode.window.activeTextEditor == null) {
        return;
    }
    const repository_path = await getRepositoryPath();
    if (repository_path === undefined) {
        return;
    }
    const filepath = vscode.window.activeTextEditor.document.fileName;
    const command = buildCommand(`lazygit -p ${repository_path} -f ${filepath}`);
    await execute(getShell(), command);
    return;
}

async function newLog(): Promise<void> {
    const repository_path = await getRepositoryPath("log");
    if (repository_path === undefined) {
        return;
    }
    const command = buildCommand(`lazygit -f ${repository_path}`);
    await execute(getShell(), command);
    return;
}
