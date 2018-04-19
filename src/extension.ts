'use strict';

import * as vscode from 'vscode';
import * as clipboardy from 'clipboardy';
import * as path from 'path';
import * as ui from './ui';
import * as pastery from './pastery';

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('vscode-pastery.upload', () => {

        let editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
            vscode.window.showErrorMessage("There is no active text buffer.");
            return;
        }

        let selection = editor.selection;

        let content = editor.document.getText();
        if (!selection.isEmpty) {
            content = editor.document.getText(selection);
        }

        let filename = editor.document.fileName;

        var config = vscode.workspace.getConfiguration('vscode-pastery');

        let p:Thenable<void> = Promise.resolve();

        // Ask for the api key if not defined
        if(config.get("api-key") === undefined || config.get("api-key") === "") {
            p = ui.promptApiKey()
            .then(key => config.update("api-key", key, vscode.ConfigurationTarget.Global));
        }

        // We know at this point that an api-key is defined thanks to the prompt
        let apiKey = config.get("api-key") as string;

        // Prompt the paste expiration delay
        p.then(() => ui.promptExpDelay())
        // Prompt the paste title
        .then(minutes =>
            ui.promptTitle(path.basename(filename))
            .then(title => {
                // Bundle the prompted data
                return {minutes: minutes, title: title};
            })
        )
        .then(userInputs => pastery.upload(apiKey, userInputs.minutes, userInputs.title, content))
        .then((url) => {
            clipboardy.write(url)
            .then(() =>
                vscode.window.showInformationMessage("Paste url copied to clipboard."))
            .catch((error:string) =>
                vscode.window.showErrorMessage("An error occurred when accessing the clipboard: " + error));
        }, error => {
            vscode.window.showErrorMessage(error.message || error);
        });
    });

    context.subscriptions.push(disposable);
}
