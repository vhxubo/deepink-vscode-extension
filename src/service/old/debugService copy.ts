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

// export class DebugService {
//     private debugStatusBar: StatusBar;
//     private settingHost: string | undefined;
//     private settingKey: string | undefined;

//     constructor(
//         protected context: vscode.ExtensionContext
//     ) {
//         this.debugStatusBar = new StatusBar();
//         this.settingHost = vscode.workspace.getConfiguration().get('awesomeDeepInk.host');
//         this.settingKey = vscode.workspace.getConfiguration().get('awesomeDeepInk.key');
//     }

//     public async debug() {
//         let editor = vscode.window.activeTextEditor;
//         if (editor === undefined) {
//             vscode.window.showErrorMessage('未读取到相应文件，请使用 Vscode 打开书源文件后执行！');
//             this.debugStatusBar.hide();
//             return;
//         }
//         let document = editor.document;
//         let json = document.getText();
//         let url = this.settingHost + DEBUG_API['debug'];
//         console.info(url);
//         this.debugStatusBar.show();
//         try {
//             let response = await axios.default.post(url, json);
//             vscode.window.showInformationMessage(response.data.message);

//         } catch (error) {
//             vscode.window.showErrorMessage('连接失败！');
//         }
//         this.debugStatusBar.hide();
//     }

//     public setHost() {
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
//                 axios.default.get(host).then(() => {
//                     vscode.window.showInformationMessage('厚墨书源开发者，欢迎回来！');
//                 }).catch((error => {
//                     vscode.window.showErrorMessage('连接 ' + this.settingHost + ' 失败！\n' + error);
//                 }));
//             }
//         });
//     }

//     public setKey() {
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

//     /**
//      * debugGet
//      */
//     public async debugGet(url: string) {
//         this.debugStatusBar.show();
//         try {
//             let response = await axios.default.get(this.settingHost + url, {
//                 params: {
//                     key: this.settingKey
//                 }
//             });
//             if (response.data.message) {
//                 vscode.window.showInformationMessage(response.data.message);
//             } else {
//                 DebugView.show(response.data,'');
//                 let res_array: any = [];
//                 response.data.forEach((element: any) => {
//                     res_array.push(element);
//                 });
//                 this.context.workspaceState.update('res_search', res_array);
//             }
//         }
//         catch (error) {
//             vscode.window.showErrorMessage('连接失败！');
//         }
//         this.debugStatusBar.hide();
//     }

//     public debugPost(url: string, params: any) {
//         this.debugStatusBar.show();
//         axios.default.post(this.settingHost + url, params)
//             .then(response => {
//                 if (response.data.message) {
//                     vscode.window.showInformationMessage(response.data.message);
//                 } else {
//                     DebugView.show(response.data,'');
//                 }
//             }).catch((error => {
//                 vscode.window.showErrorMessage(error);
//             }));
//         this.debugStatusBar.hide();
//     }

//     /**
//      * name
//      */
//     public debugAuto() {
//         const url = '/dev/debug/auto';
//         this.debug();
//         this.debugGet(url);
//     }

//     /**
//      * name
//      */
//     public debugSearch() {
//         const url = '/dev/debug/search';
//         this.debug();
//         this.debugGet(url);
//     }

//     /**
//      * name
//      */
//     public debugRank() {
//         const url = '/dev/debug/rank';
//         this.debug();
//         this.debugGet(url);
//     }

//     public async debugDetail() {
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

//     public async debugCatalog() {
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

//     public async debugChapter() {
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

//     public install() {
//         const url = '/dev/install';
//         let editor = vscode.window.activeTextEditor;
//         if (editor === undefined) {
//             vscode.window.showErrorMessage('未读取到相应文件，请使用 Vscode 打开书源文件后执行！');
//             this.debugStatusBar.hide();
//             return;
//         }
//         let document = editor.document;
//         let params = document.getText();
//         this.debugPost(url, params);
//     }

// }