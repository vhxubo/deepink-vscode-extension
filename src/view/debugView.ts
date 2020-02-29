import * as vscode from 'vscode';
import * as JSONFormatter from '../utils/jsonFormatter';
// 目前使用的持久化方法占用较高！先凑活用着
// js 暂未加限制,需要分离 css，js到独立文件
// 增加代码高亮
export class DebugView {
	constructor(
		protected context: vscode.ExtensionContext
	) {
	}

	public static show(json: object) {
		const panel = vscode.window.createWebviewPanel('debugView', '返回结果', vscode.ViewColumn.Three, { enableScripts: true, retainContextWhenHidden: true });
		panel.webview.html = this.getWebviewContent();
		const formatter = JSONFormatter.jsonToHTML(json);
		console.log(formatter);
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
				.info{
					color:red;
					-webkit-user-select: none;
            		-moz-user-select: none;
            		-ms-user-select: none;
            		user-select: none;
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

						let ul = document.getElementsByClassName("array")[0];
						let li = document.getElementsByTagName("li");
						let arrays = Array.from(document.querySelectorAll('li'));
			
						ul.addEventListener('click', function (e) {
							let item = e.target;
							let index = arrays.indexOf(item);
							console.log(li[index].innerText.replace('},', '}').replace('点击->',''));
						});
					});

					
                </script>
			  </body>
			  </html>
		  `;
	}
}