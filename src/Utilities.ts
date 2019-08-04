"use strict"
import * as vscode from 'vscode';
import * as Constants from './Constants'
import * as js2flowchart from "js2flowchart";

export default class Utilities {

    panel: any;
    editor: any;

    //returns true if an html document is open
    constructor() { };

    handleTextDocumentChange() {

        this.panel.webview.html = this.editor.document.getText();

    }

    updateJSFlowChart() {

        this.editor = vscode.window.activeTextEditor;
        let currentJSContent = this.editor.document.getText();
        let svg = js2flowchart.convertCodeToSvg( currentJSContent );
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

    getDocumentType(): string {
        let languageId = vscode.window.activeTextEditor.document.languageId.toLowerCase();
        return languageId;
    }

    checkDocumentIsHTML(showWarning: boolean): boolean {
        let result = this.getDocumentType() === "html";
        if (!result && showWarning) {
            vscode.window.showInformationMessage(Constants.ErrorMessages.NO_HTML);
        }
        return result;
    }

    initJSFlowChart(viewColumn: number) {

        if (this.getDocumentType() === "javascript") {

            // Create and show a new webview
            this.panel = vscode.window.createWebviewPanel(
                'liveHTMLPreviewerFlowChart',
                'Live JS FlowChart',
                viewColumn,
                {
                    // Enable scripts in the webview
                    enableScripts: true
                }
            );

            this.updateJSFlowChart();
            vscode.workspace.onDidChangeTextDocument(this.updateJSFlowChart.bind(this));

        }
    }

    initHTMLPreview(viewColumn: number) {
        let proceed = this.checkDocumentIsHTML(true);
        if (proceed) {

            // Create and show a new webview
            this.panel = vscode.window.createWebviewPanel(
                'liveHTMLPreviewer',
                'Live HTML Previewer',
                viewColumn,
                {
                    // Enable scripts in the webview
                    enableScripts: true
                }
            );

            // And set its HTML content
            this.editor = vscode.window.activeTextEditor;
            let currentHTMLContent = this.editor.document.getText();

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