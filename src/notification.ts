
import * as vscode from "vscode";
import { NotificationOptions } from "./types";

export const createNotification = (message: string, ...commands: vscode.Command[]) => {
  vscode.window
    .showInformationMessage(message, ...commands.map(item => item.title))
    .then(selection => {
      const command = commands.find(item => item.title === selection);
      if (command) {
        vscode.commands.executeCommand(command.command, command.arguments);
      }
    });
};
