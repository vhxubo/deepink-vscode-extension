import { TreeDataProvider, TreeItem, TreeItemCollapsibleState, ProviderResult } from "vscode";
import * as vscode from "vscode";

export class DebugTreeViewProvider implements TreeDataProvider<DebugItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<DebugItem | undefined> = new vscode.EventEmitter<DebugItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<DebugItem | undefined> = this._onDidChangeTreeData.event;

    constructor(private context: vscode.ExtensionContext) { }
    getTreeItem(element: DebugItem): TreeItem | Thenable<TreeItem> {
        return element;
    }
    getChildren(element?: DebugItem | undefined): ProviderResult<DebugItem[]> {
        if (element) {
            let res_array = Array(this.context.workspaceState.get('res_search'));
            console.log(res_array[0]);
            return res_array[0].map(
                (item: any) => new DebugItem(
                    JSON.stringify(item),
                    item as string,
                    TreeItemCollapsibleState.None as TreeItemCollapsibleState
                )
            );

        } else {
            return ['search', 'detail', 'catalog', 'chapter'].map(
                item => new DebugItem(
                    item as string,
                    'debug',
                    TreeItemCollapsibleState.Collapsed as TreeItemCollapsibleState
                )
            );
        }
    }

}

export class DebugItem extends TreeItem {
    constructor(
        public readonly label: string,
        public type: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
    }

    contextValue = (this.type === 'debug') ? 'debug' : 'dependency';
}