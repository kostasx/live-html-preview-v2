"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Constants = require("./Constants");
class Utilities {
    //returns true if an html document is open
    constructor() { }
    ;
    handleTextDocumentChange() {
        this.panel.webview.html = this.editor.document.getText();
    }
    checkDocumentIsHTML(showWarning) {
        let result = vscode.window.activeTextEditor.document.languageId.toLowerCase() === "html";
        if (!result && showWarning) {
            vscode.window.showInformationMessage(Constants.ErrorMessages.NO_HTML);
        }
        return result;
    }
    init(viewColumn) {
        let proceed = this.checkDocumentIsHTML(true);
        if (proceed) {
            // Create and show a new webview
            this.panel = vscode.window.createWebviewPanel('liveHTMLPreviewer', 'Live HTML Previewer', viewColumn, {
                // Enable scripts in the webview
                enableScripts: true
            });
            // And set its HTML content
            this.editor = vscode.window.activeTextEditor;
            let currentHTMLContent = this.editor.document.getText();
            this.panel.webview.html = currentHTMLContent;
            vscode.workspace.onDidChangeTextDocument(this.handleTextDocumentChange.bind(this));
            // this.panel.onDidDispose(
            //     () => { /* When the panel is closed... */ },
            //     null,
            //     context.subscriptions
            // );
        }
    }
}
exports.default = Utilities;
//# sourceMappingURL=Utilities.js.map