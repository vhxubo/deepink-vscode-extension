import * as vscode from "vscode";
import { StatusBar } from "../utils/statusBar";
import * as axios from "axios";
import { DebugView } from '../view/debugView';

export const DEBUG_API = {
    debug: '/dev/debug',
    auto: '/dev/debug/auto',
    search: '/dev/debug/search',
    rank: '/dev/debug/rank',
    detail: '/dev/debug/detail',
    catalog: '/dev/debug/catalog',
    chapter: '/dev/debug/chapter',
    install: '/dev/install',
};

export class DebugService {
    private debugStatusBar: StatusBar;
    private settingHost: string | undefined;
    private settingKey: string | undefined;

    constructor(
        protected context: vscode.ExtensionContext
    ) {
        this.debugStatusBar = new StatusBar();
        this.settingHost = vscode.workspace.getConfiguration().get('awesomeDeepInk.host');
        this.settingKey = vscode.workspace.getConfiguration().get('awesomeDeepInk.key');
    }

    getJson() {
        let editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
            vscode.window.showErrorMessage('未读取到相应文件，请使用 Vscode 打开书源文件后执行！');
            return undefined;
        }
        let document = editor.document;
        let json = document.getText();
        return json;
    }

    getDebugInfo(category: string) {
        let debugURL: string;
        let debugRes: string = '';
        switch (category) {
            case 'auto':
                debugURL = DEBUG_API.auto;
                break;
            case 'install':
                debugURL = DEBUG_API.install;
                break;
            case 'search':
                debugURL = DEBUG_API.search;
                debugRes = 'res_search';
                break;
            case 'rank':
                debugURL = DEBUG_API.rank;
                break;
            case 'detail':
                debugURL = DEBUG_API.detail;
                debugRes = 'res_detail';
                break;
            case 'catalog':
                debugURL = DEBUG_API.catalog;
                debugRes = 'res_catalog';
                break;
            case 'chapter':
                debugURL = DEBUG_API.chapter;
                debugRes = 'res_chapter';
                break;
            default:
                debugURL = DEBUG_API.debug;
                debugRes = '';
                break;
        }
        return [debugURL, debugRes];
    }

    debug() {
        let json = this.getJson();
        if (json !== undefined) {
            this.debugStatusBar.show();
            let url = this.settingHost + DEBUG_API['debug'];
            this.debugStatusBar.show();
            axios.default.post(url, json)
                .then((response) => {
                    vscode.window.showInformationMessage(response.data.message);
                }
                ).catch(() => {
                    vscode.window.showErrorMessage('连接失败！');
                }
                );
            this.debugStatusBar.hide();
        }
    }

    debugGet(category: string) {
        const debugInfo = this.getDebugInfo(category);
        const debugURL = this.settingHost + debugInfo[0];
        const debugRes = debugInfo[1];
        const json = this.getJson();
        if (json !== undefined) {
            this.debugStatusBar.show();
            let url = this.settingHost + DEBUG_API['debug'];
            axios.default.post(url, json)
                .then((response) => {
                    vscode.window.showInformationMessage(response.data.message);
                    axios.default.get(debugURL, {
                        params: {
                            key: this.settingKey
                        }
                    }).then((response) => {
                        if (response.data.message) {
                            vscode.window.showInformationMessage(response.data.message);
                        } else {
                            DebugView.show(response.data, category);
                            if (category === 'search') {
                                const res_array: any[] = response.data;
                                this.context.workspaceState.update(debugRes, res_array);
                            } else {
                                this.context.workspaceState.update(debugRes, response.data);
                            }
                        }
                    }).catch(() => {
                        vscode.window.showErrorMessage('发生错误！');
                    });
                }
                ).catch(() => {
                    vscode.window.showErrorMessage('连接失败！');
                }
                );
            this.debugStatusBar.hide();
        }
    }

    debugPost(category: string, params: any) {
        const debugInfo = this.getDebugInfo(category);
        const debugURL = this.settingHost + debugInfo[0];
        const debugRes = debugInfo[1];
        this.debugStatusBar.show();
        axios.default.post(debugURL, params)
            .then(response => {
                if (response.data.message) {
                    vscode.window.showInformationMessage(response.data.message);
                } else {
                    DebugView.show(response.data, category);
                    if (category === 'catalog') {
                        const res_array: any[] = response.data;
                        this.context.workspaceState.update(debugRes, res_array);
                    } else {
                        this.context.workspaceState.update(debugRes, response.data);
                    }
                }
            }).catch((error => {
                vscode.window.showErrorMessage(error);
            }));
        this.debugStatusBar.hide();
    }

    install() {
        let params = this.getJson();
        this.debugPost('install', params);
    }

    debugNext(category: string, params: any) {
        let catalogNext = 'detail';
        params = JSON.stringify(params);
        switch (category) {
            case 'search':
                catalogNext = 'detail';
                break;
            case 'detail':
                catalogNext = 'catalog';
                break;
            case 'catalog':
                catalogNext = 'chapter';
                break;
            case 'chapter':
                catalogNext = 'install';
                params = this.getJson();
                break;
            default:
                break;
        }
        if (params !== undefined) {
            this.debugPost(catalogNext, params);
        }
    }
}