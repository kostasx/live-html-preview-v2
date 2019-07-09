"use strict"
import * as vscode from 'vscode'
import Utilities from "./Utilities"
import * as Constants from './Constants'

export default class StatusBarItem {

    statusBarItem: vscode.StatusBarItem;
    utilities: Utilities;

    constructor(utilities?: Utilities) {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        this.statusBarItem.command = "extension.sidePreview";
        this.statusBarItem.tooltip = Constants.ExtensionConstants.STATUS_BAR_HTML_TOOLTIP;
        this.utilities = utilities && utilities || new Utilities();
    }

    updateStatusbar() {

        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            this.statusBarItem.hide();
            return;
        }
        // Only update status if an HTML file
        if ( this.utilities.checkDocumentIsHTML(false) ) {

            this.statusBarItem.text = Constants.ExtensionConstants.STATUS_BAR_HTML_TEXT;
            this.statusBarItem.show();

        } else if ( this.utilities.getDocumentType() === "javascript" ){

            this.statusBarItem.text = Constants.ExtensionConstants.STATUS_BAR_JS_TEXT;
            this.statusBarItem.show();

        } else {

            this.statusBarItem.hide();

        }
    }
}