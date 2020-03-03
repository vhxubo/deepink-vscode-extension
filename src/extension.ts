import * as vscode from 'vscode';
import { DebugService } from './service/debugService';
import { DebugTreeViewProvider, DebugItem } from './view/debugTreeViewProvider';
import { opn } from './utils/urlTools';
import { SettingTreeViewProvider } from './view/settingTreeViewProvider';

export function activate(context: vscode.ExtensionContext) {

	const debugService = new DebugService(context);
	const debugTreeView = new DebugTreeViewProvider(context);
	vscode.window.registerTreeDataProvider('deepink-debug', debugTreeView);

	const settingTreeView = new SettingTreeViewProvider(context);
	vscode.window.registerTreeDataProvider('deepink-setting', settingTreeView);

	context.subscriptions.push(
		vscode.commands.registerCommand('deepInk.setHost', () => debugService.setHost()),
		vscode.commands.registerCommand('deepInk.setKey', () => debugService.setKey()),
		vscode.commands.registerCommand('deepInk.debug', () => debugService.debug()),
		vscode.commands.registerCommand('deepInk.debugAuto', () => debugService.debugGet('auto')),
		vscode.commands.registerCommand('deepInk.debugRank', () => debugService.debugGet('rank')),
		vscode.commands.registerCommand('deepInk.debugSearch', () => debugService.debugGet('search')),
		vscode.commands.registerCommand('deepInk.debugDetail', () => debugService.debugDetail()),
		vscode.commands.registerCommand('deepInk.debugCatalog', () => debugService.debugCatalog()),
		vscode.commands.registerCommand('deepInk.debugChapter', () => debugService.debugChapter()),
		vscode.commands.registerCommand('deepInk.install', () => debugService.install()),
		vscode.commands.registerCommand('deepInk.openJsoup', () => opn('https://try.jsoup.org')),
		vscode.commands.registerCommand('deepInk.openJsonpath', () => opn('https://jsonpath.com/')),
		vscode.commands.registerCommand('deepInk.refresh', () => debugTreeView.refresh()),
		vscode.commands.registerCommand('deepInk.debugNext', (node: DebugItem) => { debugTreeView.refresh(); debugService.debugNext(node.label); }),
		vscode.commands.registerCommand('deepInk.setIndex', (label, index) => debugService.setIndex(label, index))
	);


}

export function deactivate() { }
