import { StatusBarAlignment, StatusBarItem, window } from 'vscode';

export class StatusBar {
    private readonly debugStatus: StatusBarItem;

    public constructor() {
        this.debugStatus = window.createStatusBarItem(StatusBarAlignment.Left);
    }

    public dispose() {
        this.debugStatus.dispose();
    }

    public show() {
        this.debugStatus.text = `$(sync~spin) Waiting`;
        this.debugStatus.tooltip = '调试书源中~';
        this.debugStatus.show();
    }

    public hide() {
        this.debugStatus.hide();
    }
}