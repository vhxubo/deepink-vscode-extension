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
            const label = element.label;
            let res_array: any[] | undefined;
            if (label === 'catalog' || label === 'search') {
                res_array = this.context.workspaceState.get('res_' + label);
            } else {
                res_array = Array(this.context.workspaceState.get('res_' + label));
            }
            if (res_array !== undefined) {
                return res_array.map(
                    (item: any, index) => new DebugItem(
                        JSON.stringify(item),
                        TreeItemCollapsibleState.None,
                        index,
                        {
                            command: 'deepInk.setIndex',
                            title: '',
                            arguments: [label, index]
                        }
                    )
                );
            }

        } else {
            return ['search', 'detail', 'catalog', 'chapter'].map(
                item => new DebugItem(
                    item,
                    TreeItemCollapsibleState.Collapsed
                )
            );
        }
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

}

export class DebugItem extends TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly index?: number,
        public readonly command?: vscode.Command

    ) {
        super(label, collapsibleState);
    }

    contextValue = (this.label === 'search') ? 'none' : (this.label === 'catalog' || this.label === 'detail' || this.label === 'chapter') ? 'post' : 'other';
}