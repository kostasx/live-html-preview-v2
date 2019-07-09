'use strict';
import * as vscode from 'vscode';
import * as Constants from './Constants'
import Utilities from './Utilities'
import StatusBarItem from './StatusBarItem'
const opn = require('opn');

export function activate(context: vscode.ExtensionContext) {

    let statusBarItem = new StatusBarItem();
    statusBarItem.updateStatusbar();
    let utilities = new Utilities();
    // Subscribe so that the statusBarItem gets updated
    let disposableStatusBar = vscode.window.onDidChangeActiveTextEditor(statusBarItem.updateStatusbar, statusBarItem, context.subscriptions);
    let previewUri = vscode.Uri.parse(Constants.ExtensionConstants.PREVIEW_URI);
    // Register the commands that are provided to the user
    let disposableSidePreview = vscode.commands.registerCommand('extension.sidePreview', () => {

        utilities.initHTMLPreview(vscode.ViewColumn.Two);

    });
    let disposableStandalonePreview = vscode.commands.registerCommand('extension.fullPreview', () => {

        utilities.initHTMLPreview(vscode.ViewColumn.One);

    });

    let disposableInBrowser = vscode.commands.registerCommand("extension.inBrowser", () => {

        if (utilities.checkDocumentIsHTML(true)) {
            opn(vscode.window.activeTextEditor.document.fileName);
        }
    })
    // push to subscriptions list so that they are disposed automatically
    context.subscriptions.push(disposableSidePreview);
    context.subscriptions.push(disposableStandalonePreview);
    context.subscriptions.push(disposableInBrowser);
}

// This method is called when extension is deactivated
export function deactivate() {

}




