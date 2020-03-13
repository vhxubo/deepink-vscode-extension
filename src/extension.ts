import * as vscode from 'vscode';
import { DebugService } from './service/debugService';
import { DebugTreeViewProvider, DebugItem } from './view/debugTreeViewProvider';
import { opn } from './utils/urlTools';
import { SettingTreeViewProvider } from './view/settingTreeViewProvider';
import { Setting } from './service/setting';

export function activate(context: vscode.ExtensionContext) {

	const debugService = new DebugService(context);
	const debugTreeView = new DebugTreeViewProvider(context);
	vscode.window.registerTreeDataProvider('deepink-debug', debugTreeView);

	const settingTreeView = new SettingTreeViewProvider(context);
	vscode.window.registerTreeDataProvider('deepink-setting', settingTreeView);

	const setting = new Setting(context);

	context.subscriptions.push(
		vscode.commands.registerCommand('deepInk.setHost', (host) => setting.setHost(host)),
		vscode.commands.registerCommand('deepInk.setKey', (key) => setting.setKey(key)),
		vscode.commands.registerCommand('deepInk.debug', () => debugService.debug()),
		vscode.commands.registerCommand('deepInk.debugAuto', () => debugService.debugGet('auto')),
		vscode.commands.registerCommand('deepInk.debugRank', () => debugService.debugGet('rank')),
		vscode.commands.registerCommand('deepInk.debugSearch', () => debugService.debugGet('search')),
		vscode.commands.registerCommand('deepInk.install', () => debugService.install()),
		vscode.commands.registerCommand('deepInk.openJsoup', () => opn('https://try.jsoup.org')),
		vscode.commands.registerCommand('deepInk.openJsonpath', () => opn('https://jsonpath.com/')),
		vscode.commands.registerCommand('deepInk.refresh', (node: DebugItem) => debugTreeView.refresh(node)),
		vscode.commands.registerCommand('deepInk.debugNext', (category, json) => debugService.debugNext(category, json)),
	);

}

export function deactivate() { }
