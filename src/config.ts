import * as vscode from "vscode";
import { Member } from "./types";

const CONFIGURATION_NAMESPACE = "asoulNotifications";

export const getMembers = () => vscode.workspace
  .getConfiguration(CONFIGURATION_NAMESPACE)
  .get<Member[]>("asoulMembers", []);

export const getBilibiliNewDynamicsNotificationsEnabled = () => vscode.workspace
  .getConfiguration(CONFIGURATION_NAMESPACE)
  .get("bilibiliNewDynamics.enabled", false);

export const getBilibiliNewDynamicsCronExpression = () => vscode.workspace
  .getConfiguration(CONFIGURATION_NAMESPACE)
  .get<string>("bilibiliNewDynamics.cron", "2 * * * *");

export const getBilibiliLiveStatusNotificationsEnabled = () => vscode.workspace
  .getConfiguration(CONFIGURATION_NAMESPACE)
  .get("bilibiliLiveStatus.enabled", false);

export const getBilibiliLiveStatusCronExpression = () => vscode.workspace
  .getConfiguration(CONFIGURATION_NAMESPACE)
  .get("bilibiliLiveStatus.cron", "3,18,33,48 * * * *");
