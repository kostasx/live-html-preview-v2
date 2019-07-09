'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Constants = require("./Constants");
const Utilities_1 = require("./Utilities");
const StatusBarItem_1 = require("./StatusBarItem");
const opn = require('opn');
function activate(context) {
    let statusBarItem = new StatusBarItem_1.default();
    statusBarItem.updateStatusbar();
    let utilities = new Utilities_1.default();
    // Subscribe so that the statusBarItem gets updated
    let disposableStatusBar = vscode.window.onDidChangeActiveTextEditor(statusBarItem.updateStatusbar, statusBarItem, context.subscriptions);
    let previewUri = vscode.Uri.parse(Constants.ExtensionConstants.PREVIEW_URI);
    // Register the commands that are provided to the user
    let disposableSideJSFlowChart = vscode.commands.registerCommand('extension.sideJSFlowChart', () => {
        utilities.initJSFlowChart(vscode.ViewColumn.Two);
    });
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
    });
    // push to subscriptions list so that they are disposed automatically
    // HTML Preview:
    context.subscriptions.push(disposableSidePreview);
    context.subscriptions.push(disposableStandalonePreview);
    context.subscriptions.push(disposableInBrowser);
    // JS FlowChart:
    context.subscriptions.push(disposableSideJSFlowChart);
}
exports.activate = activate;
// This method is called when extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map