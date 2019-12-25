"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Constants = require("./Constants");
const js2flowchart = require("js2flowchart");
class Utilities {
    //returns true if an html document is open
    constructor() { }
    ;
    handleTextDocumentChange(disableWebViewStyling) {
        let currentHTMLContent = this.editor.document.getText();
        // Disable default WebView Styling (body.vscode-dark, etc.)
        if (disableWebViewStyling) {
            currentHTMLContent = currentHTMLContent.replace("<head>", "<head><style>body{background-color:white;}</style>");
            currentHTMLContent = currentHTMLContent.replace("</body>", "<script>document.querySelector('style#_defaultStyles').remove();</script></body>");
        }
        this.panel.webview.html = currentHTMLContent;
    }
    updateJSFlowChart() {
        this.editor = vscode.window.activeTextEditor;
        let currentJSContent = this.editor.document.getText();
        let svg = js2flowchart.convertCodeToSvg(currentJSContent);
        this.panel.webview.html = `<html>
                        <head>
                            <style>body { background-color: white; color: black; }</style>
                        </head>
                        <body>
                            <h1>JavaScript FlowChart</h1>
                            <div>${svg}</div>
                        </body>
                    </html>`;
    }
    getDocumentType() {
        let languageId = vscode.window.activeTextEditor.document.languageId.toLowerCase();
        return languageId;
    }
    checkDocumentIsHTML(showWarning) {
        let result = this.getDocumentType() === "html";
        if (!result && showWarning) {
            vscode.window.showInformationMessage(Constants.ErrorMessages.NO_HTML);
        }
        return result;
    }
    initJSFlowChart(viewColumn) {
        if (this.getDocumentType() === "javascript") {
            // Create and show a new webview
            this.panel = vscode.window.createWebviewPanel('liveHTMLPreviewerFlowChart', 'Live JS FlowChart', viewColumn, {
                // Enable scripts in the webview
                enableScripts: true
            });
            this.updateJSFlowChart();
            vscode.workspace.onDidChangeTextDocument(this.updateJSFlowChart.bind(this));
        }
    }
    initHTMLPreview(viewColumn) {
        let proceed = this.checkDocumentIsHTML(true);
        if (proceed) {
            // Create and show a new webview
            this.panel = vscode.window.createWebviewPanel('liveHTMLPreviewer', 'Live HTML Previewer', viewColumn, {
                // Enable scripts in the webview
                enableScripts: true
            });
            // const onDiskPath = vscode.Uri.file(path.join(
            //     __dirname, 'styles.css'));
            // const webSrc = onDiskPath.with({ scheme: 'vscode-resource' });
            const configurationNode = vscode.workspace.getConfiguration(`vscode.liveHtmlPreviewerV2`);
            const disableWebViewStyling = configurationNode.get("disableWebViewStyling", false);
            // And set its HTML content
            this.editor = vscode.window.activeTextEditor;
            this.handleTextDocumentChange.call(this, disableWebViewStyling);
            vscode.workspace.onDidChangeTextDocument(this.handleTextDocumentChange.bind(this, disableWebViewStyling));
            /****** WORK IN PROGRESS: Parse HTML for local resources: *****/
            // REFERENCES: https://github.com/microsoft/vscode-extension-samples/blob/master/webview-sample/src/extension.ts#L163
            /*
            let rx = /<\s*link[^>]*\s*href=["|']([a-zA-Z0-9-\/\.]*)["|']\s*.*?\/?>/gm;
            let match;
            let output = "";
            while ( match = rx.exec( currentHTMLContent ) ){
                output += match[1] + "\r\n" ;
            }
            vscode.window.showInformationMessage( output );
            */
            /****** WORK IN PROGRESS: Parse HTML for local resources: *****/
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