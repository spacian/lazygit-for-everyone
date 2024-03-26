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

export async function openLazygitCurrentFile(): Promise<void> {
    if (!(await focusActiveInstance())) {
        await newLazygitCurrentFile();
    }
    return;
}

export async function openLogCurrentFile(): Promise<void> {
    if (!(await focusActiveInstance())) {
        await newLogCurrentFile();
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
        return "cmd";
    }
    return "bash";
}

function buildCommand(command: string): string {
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

async function getRepositoryPathForFile(filepath: string): Promise<undefined | string> {
    const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git');
    if (gitExtension === undefined) {
        return undefined;
    }
    const git = gitExtension.exports.getAPI(1);
    const paths = git.repositories.map((item) => {return item.rootUri.fsPath;});
    while (filepath.length > 0) {
        let fp = filepath.split("\\");
        fp.pop();
        filepath = fp.join("\\");
        for (const path of paths) {
            if (filepath === path) {
                return path;
            }
        }
    }
    return undefined;
}

async function getRepositoryPathQuickPick(lazygit_specifier: string = ""): Promise<undefined | string> {
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
    options.sort((a, b) => {
        return a.description.split("\\").length - b.description.split("\\").length;
    })
    const pick = await vscode.window.showQuickPick(options, {
        title: "Choose repository for lazygit " + lazygit_specifier,
    });
    if (pick === undefined) {
        return undefined;
    }
    return pick.description;
}

async function newLazygit(): Promise<void> {
    const repository_path = await getRepositoryPathQuickPick();
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
    const filepath = vscode.window.activeTextEditor.document.fileName;
    const repository_path = await getRepositoryPathForFile(filepath);
    if (repository_path === undefined) {
        return;
    }
    const command = buildCommand(`lazygit -p ${repository_path} -f ${filepath}`);
    await execute(getShell(), command);
    return;
}

async function newLog(): Promise<void> {
    const repository_path = await getRepositoryPathQuickPick("log");
    if (repository_path === undefined) {
        return;
    }
    const command = buildCommand(`lazygit -p ${repository_path} -f ${repository_path}`);
    await execute(getShell(), command);
    return;
}

async function newLogCurrentFile(): Promise<void> {
    if (vscode.window.activeTextEditor == null) {
        return;
    }
    const filepath = vscode.window.activeTextEditor.document.fileName;
    const repository_path = await getRepositoryPathForFile(filepath);
    if (repository_path === undefined) {
        return;
    }
    const command = buildCommand(`lazygit -p ${repository_path} -f ${repository_path}`);
    await execute(getShell(), command);
    return;
}

async function newLazygitCurrentFile(): Promise<void> {
    if (vscode.window.activeTextEditor == null) {
        return;
    }
    const filepath = vscode.window.activeTextEditor.document.fileName;
    const repository_path = await getRepositoryPathForFile(filepath);
    if (repository_path === undefined) {
        return;
    }
    const command = buildCommand(`lazygit -p ${repository_path}`);
    await execute(getShell(), command);
    return;
}
