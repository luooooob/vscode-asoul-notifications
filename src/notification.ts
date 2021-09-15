
import * as vscode from "vscode";
import { NotificationOptions } from "./types";


export const createNotification = ({ message, items }: NotificationOptions) => {
  vscode.window
    .showInformationMessage(message, ...items.map(item => item.text))
    .then(selection => {
      const selectedItem = items.find(item => item.text === selection);
      if (selectedItem) {
        selectedItem.action();
      }
    });
};
