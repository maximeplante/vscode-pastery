'use strict';

import * as vscode from 'vscode';

export function promptApiKey() {
    return vscode.window.showInputBox({
        placeHolder: "Pastery API Key",
        prompt: "Visit your account page at https://www.pastery.net/account/",
    }).then(key => {
        if (key === undefined || key === "") {
            throw new Error("Cancelled on api key input.");
        }
        return key as string;
    });
}

export function promptExpDelay() {
    var expirations = [
        {name: "1 Day", minutes: 1440},
        {name: "10 Minutes", minutes: 10},
        {name: "1 Hour", minutes: 60},
        {name: "1 Week", minutes: 10080},
        {name: "2 Weeks", minutes: 20160},
        {name: "1 Month", minutes: 43800},
        {name: "Never", minutes: 0}
    ];

    return vscode.window.showQuickPick(expirations.map((e) => e.name), {
        placeHolder: "Paste expiration delay",
    }).then(delay => {
        if (delay === undefined || delay === "") {
            throw new Error("Cancelled on delay input.");
        }
        var time = expirations.find(exp => exp.name === delay);
        if (time === undefined) {
            throw new Error("Invalid delay");
        }
        return time.minutes;
    });
}

export function promptTitle(defaultTitle: string) {
    return vscode.window.showInputBox({
        prompt: "Paste title",
        value: defaultTitle,
    }).then(title => {
        if (!title) {
            throw new Error("Cancelled on title choice.");
        }
        return title || "";
    });
}
