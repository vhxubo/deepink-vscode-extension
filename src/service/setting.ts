import * as vscode from "vscode";
import * as axios from "axios";

export class Setting {
    private settingHost: string | undefined = vscode.workspace.getConfiguration().get('awesomeDeepInk.host');
    private settingKey: string | undefined = vscode.workspace.getConfiguration().get('awesomeDeepInk.key');

    constructor(
        protected context: vscode.ExtensionContext
    ) {

    }

    setHost(host?: string) {
        if (host !== undefined) {
            vscode.workspace.getConfiguration().update('awesomeDeepInk.host', host, true);
            this.settingHost = vscode.workspace.getConfiguration().get('awesomeDeepInk.host');
            return;
        }
        let value = 'http://192.168.1.112:8888';
        if (this.settingHost !== undefined) { value = this.settingHost; }
        vscode.window.showInputBox({
            ignoreFocusOut: true,
            password: false,
            prompt: "输入厚墨投屏显示的完整连接。",
            value: value
        }).then((host: any) => {
            if (host !== undefined) {
                vscode.workspace.getConfiguration().update('awesomeDeepInk.host', host, true);
                this.settingHost = host;
                axios.default.get(host + '/api/user').then((response) => {
                    vscode.window.showInformationMessage(`${response.data.name}，欢迎回来！`);
                }).catch((error => {
                    vscode.window.showErrorMessage('连接 ' + this.settingHost + ' 失败！\n' + error);
                }));
            }
        });
    }

    setKey(key?: string) {
        if (key !== undefined) {
            vscode.workspace.getConfiguration().update('awesomeDeepInk.key', key, true);
            this.settingKey = vscode.workspace.getConfiguration().get('awesomeDeepInk.key');
            return;
        }
        let value = '剑来';
        if (this.settingKey !== undefined) { value = this.settingKey; }
        vscode.window.showInputBox({
            ignoreFocusOut: true,
            password: false,
            prompt: "输入搜索关键词。",
            value: value
        }).then((key: any) => {
            if (key !== undefined) {
                vscode.workspace.getConfiguration().update('awesomeDeepInk.key', key, true);
                this.settingKey = key;
            }
        });
    }

}