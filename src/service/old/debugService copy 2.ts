// import * as vscode from "vscode";
// import { StatusBar } from "../utils/statusBar";
// import * as axios from "axios";
// import { DebugView } from '../view/debugView';

// export const DEBUG_API = {
//     debug: '/dev/debug',
//     auto: '/dev/debug/auto',
//     search: '/dev/debug/search',
//     rank: '/dev/debug/rank',
//     detail: '/dev/debug/detail',
//     catalog: '/dev/debug/catalog',
//     chapter: '/dev/debug/chapter',
//     install: '/dev/install',
// };

// export const enum DEBUG_CATEGORY {
//     'search',
//     'rank',
//     'detail',
//     'catalog',
//     'chapter',
// }

// export class DebugService {
//     private debugStatusBar: StatusBar;
//     private settingHost: string | undefined;
//     private settingKey: string | undefined;
//     private searchIndex: number | undefined;
//     private catalogIndex: number | undefined;

//     constructor(
//         protected context: vscode.ExtensionContext
//     ) {
//         this.debugStatusBar = new StatusBar();
//         this.settingHost = vscode.workspace.getConfiguration().get('awesomeDeepInk.host');
//         this.settingKey = vscode.workspace.getConfiguration().get('awesomeDeepInk.key');
//         this.searchIndex = Number(vscode.workspace.getConfiguration().get('awesomeDeepInk.searchIndex'));
//         this.catalogIndex = Number(vscode.workspace.getConfiguration().get('awesomeDeepInk.catalogIndex'));
//     }

//     setHost() {
//         let value = 'http://192.168.1.112:8888';
//         if (this.settingHost !== undefined) { value = this.settingHost; }
//         vscode.window.showInputBox({
//             ignoreFocusOut: true,
//             password: false,
//             prompt: "输入厚墨投屏显示的完整连接。",
//             value: value
//         }).then((host: any) => {
//             if (host !== undefined || host.trim() !== '') {
//                 vscode.workspace.getConfiguration().update('awesomeDeepInk.host', host, true);
//                 this.settingHost = host;
//                 axios.default.get(host + '/api/user').then((response) => {
//                     vscode.window.showInformationMessage(`${response.data.name}，欢迎回来！`);
//                 }).catch((error => {
//                     vscode.window.showErrorMessage('连接 ' + this.settingHost + ' 失败！\n' + error);
//                 }));
//             }
//         });
//     }

//     setIndex(label: string, index: number) {
//         if (index !== undefined && (label === 'search' || label === 'catalog')) {
//             vscode.workspace.getConfiguration().update('awesomeDeepInk.' + label + 'Index', index, true);
//         }

//     }

//     setKey() {
//         let value = '剑来';
//         if (this.settingKey !== undefined) { value = this.settingKey; }
//         vscode.window.showInputBox({
//             ignoreFocusOut: true,
//             password: false,
//             prompt: "输入搜索关键词。",
//             value: value
//         }).then((key: any) => {
//             if (key !== undefined || key.trim() !== '') {
//                 vscode.workspace.getConfiguration().update('awesomeDeepInk.key', key, true);
//                 this.settingKey = key;
//             }
//         });
//     }

//     getJson() {
//         let editor = vscode.window.activeTextEditor;
//         if (editor === undefined) {
//             vscode.window.showErrorMessage('未读取到相应文件，请使用 Vscode 打开书源文件后执行！');
//             return undefined;
//         }
//         let document = editor.document;
//         let json = document.getText();
//         return json;
//     }

//     getDebugInfo(category: string) {
//         let debugURL: string;
//         let debugRes: string = '';
//         switch (category) {
//             case 'auto':
//                 debugURL = DEBUG_API.auto;
//                 break;
//             case 'install':
//                 debugURL = DEBUG_API.install;
//                 break;
//             case 'search':
//                 debugURL = DEBUG_API.search;
//                 debugRes = 'res_search';
//                 break;
//             case 'rank':
//                 debugURL = DEBUG_API.rank;
//                 break;
//             case 'detail':
//                 debugURL = DEBUG_API.detail;
//                 debugRes = 'res_detail';
//                 break;
//             case 'catalog':
//                 debugURL = DEBUG_API.catalog;
//                 debugRes = 'res_catalog';
//                 break;
//             case 'chapter':
//                 debugURL = DEBUG_API.chapter;
//                 debugRes = 'res_chapter';
//                 break;
//             default:
//                 debugURL = DEBUG_API.debug;
//                 debugRes = '';
//                 break;
//         }
//         return [debugURL, debugRes];
//     }

//     debug() {
//         let json = this.getJson();
//         if (json !== undefined) {
//             this.debugStatusBar.show();
//             let url = this.settingHost + DEBUG_API['debug'];
//             this.debugStatusBar.show();
//             axios.default.post(url, json)
//                 .then((response) => {
//                     vscode.window.showInformationMessage(response.data.message);
//                 }
//                 ).catch(() => {
//                     vscode.window.showErrorMessage('连接失败！');
//                 }
//                 );
//             this.debugStatusBar.hide();
//         }
//     }

//     debugGet(category: string) {
//         const debugInfo = this.getDebugInfo(category);
//         const debugURL = this.settingHost + debugInfo[0];
//         const debugRes = debugInfo[1];
//         const json = this.getJson();
//         if (json !== undefined) {
//             this.debugStatusBar.show();
//             let url = this.settingHost + DEBUG_API['debug'];
//             axios.default.post(url, json)
//                 .then((response) => {
//                     vscode.window.showInformationMessage(response.data.message);
//                     axios.default.get(debugURL, {
//                         params: {
//                             key: this.settingKey
//                         }
//                     }).then((response) => {
//                         if (response.data.message) {
//                             vscode.window.showInformationMessage(response.data.message);
//                         } else {
//                             DebugView.show(response.data, category);
//                             if (category === 'search') {
//                                 const res_array: any[] = response.data;
//                                 this.context.workspaceState.update(debugRes, res_array);
//                             } else {
//                                 this.context.workspaceState.update(debugRes, response.data);
//                             }
//                         }
//                     }).catch(() => {
//                         vscode.window.showErrorMessage('发生错误！');
//                     });
//                 }
//                 ).catch(() => {
//                     vscode.window.showErrorMessage('连接失败！');
//                 }
//                 );
//             this.debugStatusBar.hide();
//         }
//     }

//     debugPostt(category: string, params: any) {
//         const debugInfo = this.getDebugInfo(category);
//         const debugURL = this.settingHost + debugInfo[0];
//         const debugRes = debugInfo[1];
//         this.debugStatusBar.show();
//         axios.default.post(debugURL, params)
//             .then(response => {
//                 if (response.data.message) {
//                     vscode.window.showInformationMessage(response.data.message);
//                 } else {
//                     DebugView.show(response.data, category);
//                     if (category === 'catalog') {
//                         const res_array: any[] = response.data;
//                         this.context.workspaceState.update(debugRes, res_array);
//                     } else {
//                         this.context.workspaceState.update(debugRes, response.data);
//                     }
//                 }
//             }).catch((error => {
//                 vscode.window.showErrorMessage(error);
//             }));
//         this.debugStatusBar.hide();
//     }


//     private debugPost(url: string, params: any) {
//         this.debugStatusBar.show();
//         axios.default.post(this.settingHost + url, params)
//             .then(response => {
//                 if (response.data.message) {
//                     vscode.window.showInformationMessage(response.data.message);
//                 } else {
//                     DebugView.show(response.data, 'post');
//                 }
//             }).catch((error => {
//                 vscode.window.showErrorMessage(error);
//             }));
//         this.debugStatusBar.hide();
//     }

//     async debugDetail() {
//         const url = '/dev/debug/detail';
//         let params = await vscode.env.clipboard.readText();
//         vscode.window.showInputBox({
//             ignoreFocusOut: true,
//             password: false,
//             prompt: "输入搜索的一个结果。",
//             value: params
//         }).then((params: any) => {
//             if (params !== undefined || params.trim() !== '') {
//                 this.debugPost(url, params);
//             }
//         });
//     }

//     async debugCatalog() {
//         const url = '/dev/debug/catalog';
//         let params = await vscode.env.clipboard.readText();
//         vscode.window.showInputBox({
//             ignoreFocusOut: true,
//             password: false,
//             prompt: "输入详情结果。",
//             value: params
//         }).then((params: any) => {
//             if (params !== undefined || params.trim() !== '') {
//                 this.debugPost(url, params);
//             }
//         });
//     }

//     async debugChapter() {
//         const url = '/dev/debug/chapter';
//         let params = await vscode.env.clipboard.readText();
//         vscode.window.showInputBox({
//             ignoreFocusOut: true,
//             password: false,
//             prompt: "输入目录的一个结果。",
//             value: params
//         }).then((params: any) => {
//             if (params !== undefined || params.trim() !== '') {
//                 this.debugPost(url, params);
//             }
//         });
//     }

//     install() {
//         const url = '/dev/install';
//         let params = this.getJson();
//         this.debugPost(url, params);
//     }

//     debugNext(label: string) {
//         let res_array: any[] | undefined;
//         let res_index = 0;
//         switch (label) {
//             case 'detail':
//                 res_array = this.context.workspaceState.get('res_search');
//                 res_index = (this.searchIndex === undefined) ? 0 : this.searchIndex;
//                 break;
//             case 'catalog':
//                 res_array = Array(this.context.workspaceState.get('res_detail'));
//                 break;
//             case 'chapter':
//                 res_array = this.context.workspaceState.get('res_catalog');
//                 res_index = (this.catalogIndex === undefined) ? 0 : this.catalogIndex;
//                 break;
//             default:
//                 res_index = 0;
//                 break;
//         }
//         if (res_array !== undefined) {
//             this.debugPostt(label, JSON.stringify(res_array[res_index]));
//         }
//     }

//     debugMore(category: string, json: any) {
//         this.debugPostt(category, json);
//     }
// }