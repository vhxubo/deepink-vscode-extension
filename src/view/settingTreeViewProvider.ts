import { TreeDataProvider, TreeItem, TreeItemCollapsibleState, ProviderResult } from "vscode";
import * as vscode from "vscode";

export class SettingTreeViewProvider implements TreeDataProvider<SettingItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<SettingItem | undefined> = new vscode.EventEmitter<SettingItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<SettingItem | undefined> = this._onDidChangeTreeData.event;
    private settingHost: string | undefined;
    private settingKey: string | undefined;

    constructor(private context: vscode.ExtensionContext) {
        this.settingHost = vscode.workspace.getConfiguration().get('awesomeDeepInk.host');
        this.settingKey = vscode.workspace.getConfiguration().get('awesomeDeepInk.key');
    }
    getTreeItem(element: SettingItem): TreeItem | Thenable<TreeItem> {
        return element;
    }
    getChildren(element?: SettingItem | undefined): ProviderResult<SettingItem[]> {
        if (element) {
            if (element.label === 'Now') {
                return [this.settingHost, this.settingKey].map(
                    item => new SettingItem(
                        (item === undefined) ? '' : item,
                        TreeItemCollapsibleState.None,
                        {
                            command: (item?.indexOf('http') === 0) ? 'deepInk.setHost' : 'deepInk.setKey',
                            title: '',
                            arguments: []
                        }
                    )
                );
            } else if (element.label === 'Host') {
                return ['http://192.168.0.102:8888', 'http://192.168.43.1:8888'].map(
                    item => new SettingItem(
                        (item === undefined) ? '' : item,
                        TreeItemCollapsibleState.None,
                        {
                            command: 'deepInk.setHost',
                            title: '',
                            arguments: [item]
                        }
                    )
                );
            } else if (element.label === 'Key') {
                return ['剑来', '孟子', '小姨子'].map(
                    item => new SettingItem(
                        (item === undefined) ? '' : item,
                        TreeItemCollapsibleState.None,
                        {
                            command: 'deepInk.setKey',
                            title: '',
                            arguments: [item]
                        }
                    )
                );
            }
        }
        else {
            return ['Now', 'Host', 'Key'].map(
                item => new SettingItem(
                    item,
                    (item === 'Now') ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.Collapsed
                )
            );
        }
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

}

export class SettingItem extends TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command

    ) {
        super(label, collapsibleState);
    }

    contextValue = 'setting';
}