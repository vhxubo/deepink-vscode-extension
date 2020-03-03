import * as vscode from 'vscode';
import * as JSONFormatter from '../utils/jsonFormatter';
// 目前使用的持久化方法占用较高！先凑活用着
// js 暂未加限制,需要分离 css，js到独立文件
// 增加代码高亮
export class DebugView {
	constructor(
		protected context: vscode.ExtensionContext
	) {
	};

	static show(json: object, category: string) {
		const panel = vscode.window.createWebviewPanel('debugView', `${category} Result`, vscode.ViewColumn.Two, { enableScripts: true, retainContextWhenHidden: true });
		panel.webview.html = this.getWebviewContent();
		const formatter = JSONFormatter.jsonToHTML(json);
		panel.webview.postMessage({ formatJson: formatter });
	}

	private static getWebviewContent() {
		return `
			  <!DOCTYPE html>
			  <html lang="en">
			  <head>
				  <meta charset="UTF-8">
				  <meta name="viewport" content="width=device-width, initial-scale=1.0">
				  <title>Debug View</title>
				  <style>
				  li {
					  list-style: none;
				  }
				  ul {
					padding-inline-start: 20px;
				}
			  </style>
			  </head>
			  <body>
				  <div id="root">Guimi</div>
				  <script>
                    const root = document.getElementById('root');
                    window.addEventListener('message', event => {
                        const message = event.data;
						root.innerHTML = message.formatJson;
					});
                </script>
			  </body>
			  </html>
		  `;
	}
}