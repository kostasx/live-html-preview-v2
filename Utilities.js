"use strict";
var vscode = require('vscode');
var Constants = require('./Constants');
var Utilities = (function () {

    function updateWebview( content ) {

        return content;
      
    }

    function handleTextDocumentChange( panel, editor ){

        panel.webview.html = updateWebview( editor.document.getText() );

    }

    //returns true if an html document is open
    function Utilities() {
    }
    ;
    Utilities.prototype.checkDocumentIsHTML = function (showWarning) {
        var result = vscode.window.activeTextEditor.document.languageId.toLowerCase() === "html";
        if (!result && showWarning) {
            vscode.window.showInformationMessage(Constants.ErrorMessages.NO_HTML);
        }
        return result;
    };
    // Utilities.prototype.init = function (viewColumn, context, previewUri) {
    Utilities.prototype.init = function (viewColumn) { // Kx
        var proceed = this.checkDocumentIsHTML(true);
        if (proceed) {

            // Create and show a new webview
            const panel = vscode.window.createWebviewPanel(
                'liveHTMLPreviewer', // Identifies the type of the webview. Used internally
                'Live HTML Previewer', // Title of the panel displayed to the user
                viewColumn,   // ViewColumn.One, Editor column to show the new webview panel in.
                {
                    // Enable scripts in the webview
                    enableScripts: true
                } 
            );

            // And set its HTML content
            let editor = vscode.window.activeTextEditor;
            let currentHTMLContent = editor.document.getText();
            panel.webview.html = updateWebview( currentHTMLContent );

            vscode.workspace.onDidChangeTextDocument( handleTextDocumentChange.bind( null, panel, editor ) );

            // panel.onDidDispose(
            //     () => { /* When the panel is closed... */ },
            //     null,
            //     context.subscriptions
            // );
        }
    };
    return Utilities;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Utilities;
//# sourceMappingURL=Utilities.js.map