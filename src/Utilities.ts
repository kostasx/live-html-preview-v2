"use strict"
import * as vscode from 'vscode';
import * as Constants from './Constants'

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
        this.panel.webview.html = `<html>
                        <head>
                            <script src="https://bogdan-lyashenko.github.io/js-code-to-svg-flowchart/dist/js2flowchart.js"></script>
                            <style>body { background-color: white; color: black; }</style>
                        </head>
                        <body>
                            <h1>JavaScript FlowChart</h1>
                            <div>
                                <p id="svgImage"></p>
                            </div>
                            <script>
                                const code = \`${currentJSContent}\`;
                                const createFlowTreeBuilder = js2flowchart.createFlowTreeBuilder;
                                const createSVGRender = js2flowchart.createSVGRender;
                                const flowTreeBuilder = createFlowTreeBuilder();
                                const svgRender = createSVGRender();
                                const flowTree = flowTreeBuilder.build( code );
                                const shapesTree = svgRender.buildShapesTree(flowTree);
                                const svg = shapesTree.print();
                                document.getElementById('svgImage').innerHTML = svg;                    
                            </script>
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