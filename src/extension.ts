import * as vscode from 'vscode';
import { DebugService } from './service/debugService';
import { DebugTreeViewProvider } from './view/debugTreeViewProvider';
import { opn } from './utils/urlTools';

export function activate(context: vscode.ExtensionContext) {

	const debugService = new DebugService(context);

	context.subscriptions.push(
		vscode.commands.registerCommand('deepInk.setHost', () => debugService.setHost()),
		vscode.commands.registerCommand('deepInk.setKey', () => debugService.setKey()),
		vscode.commands.registerCommand('deepInk.debug', () => debugService.debug()),
		vscode.commands.registerCommand('deepInk.debugAuto', () => debugService.debugAuto()),
		vscode.commands.registerCommand('deepInk.debugRank', () => debugService.debugRank()),
		vscode.commands.registerCommand('deepInk.debugSearch', () => debugService.debugSearch()),
		vscode.commands.registerCommand('deepInk.debugDetail', () => debugService.debugDetail()),
		vscode.commands.registerCommand('deepInk.debugCatalog', () => debugService.debugCatalog()),
		vscode.commands.registerCommand('deepInk.debugChapter', () => debugService.debugChapter()),
		vscode.commands.registerCommand('deepInk.install', () => debugService.install()),
		vscode.commands.registerCommand('deepInk.openJsoup', () => opn('https://try.jsoup.org')),
		vscode.commands.registerCommand('deepInk.openJsonpath', () => opn('https://jsonpath.com/'))
	);
	const debugTreeView = new DebugTreeViewProvider(context);
	vscode.window.registerTreeDataProvider('deepink-debug', debugTreeView);
}

export function deactivate() { }
