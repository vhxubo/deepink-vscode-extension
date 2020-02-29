import open = require('open');
import { window } from 'vscode';

export const opn = (url: string) => {
    open(url).catch(_ => {
        window.showErrorMessage(`Open browser failed!!`);
    });
};