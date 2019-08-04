"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Utilities_1 = require("./Utilities");
const Constants = require("./Constants");
class StatusBarItem {
    constructor(utilities) {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        this.statusBarItem.command = "extension.sidePreview";
        this.statusBarItem.tooltip = Constants.ExtensionConstants.STATUS_BAR_HTML_TOOLTIP;
        this.utilities = utilities && utilities || new Utilities_1.default();
    }
    updateStatusbar() {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            this.statusBarItem.hide();
            return;
        }
        // Update status if an HTML file:
        if (this.utilities.checkDocumentIsHTML(false)) {
            this.statusBarItem.text = Constants.ExtensionConstants.STATUS_BAR_HTML_TEXT;
            this.statusBarItem.command = "extension.sidePreview";
            this.statusBarItem.show();
            // Update status if a JS file:
        }
        else if (this.utilities.getDocumentType() === "javascript") {
            this.statusBarItem.text = Constants.ExtensionConstants.STATUS_BAR_JS_TEXT;
            this.statusBarItem.command = "extension.sideJSFlowChart";
            this.statusBarItem.show();
        }
        else {
            this.statusBarItem.hide();
        }
    }
}
exports.default = StatusBarItem;
//# sourceMappingURL=StatusBarItem.js.map