import { StatusBarAlignment, StatusBarItem, window } from 'vscode';

export class StatusBar {
    private readonly debugStatus: StatusBarItem;

    constructor() {
        this.debugStatus = window.createStatusBarItem(StatusBarAlignment.Left);
    }

    dispose() {
        this.debugStatus.dispose();
    }

    show() {
        this.debugStatus.text = `$(sync~spin) Waiting`;
        this.debugStatus.tooltip = '调试书源中~';
        this.debugStatus.show();
    }

    hide() {
        this.debugStatus.hide();
    }
}