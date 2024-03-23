import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "lazygit-powershell" is now active!');
	let disposable = vscode.commands.registerCommand('lazygit-powershell.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from lazygit-powershell!');
	});
	context.subscriptions.push(disposable);
}
export function deactivate() {}
