import * as cron from "node-cron";
import * as vscode from 'vscode';
import * as bilibiliLiveStatus from './bilibiliLiveStatus';
import * as bilibiliDynamics from './bilibiliDynamics';
import { request } from './request';
import { AsoulMember, BilibiliDynamicsResponse, BilibiliLiveStatusResponse, BilibiliUser } from "./types";
import * as bilibili from "./bilibili";

// this method is called when your extension is activated
export const activate = (context: vscode.ExtensionContext) => {
	const configuration = vscode.workspace.getConfiguration("asoulNotifications");
	const asoulMembers = configuration.get<AsoulMember[]>("asoulMembers", []);
	const bilibiliNewDynamicsNotificationsEnabled = configuration.get("bilibiliNewDynamics.enabled", false);
	const bilibiliLiveStatusNotificationsEnabled = configuration.get("bilibiliLiveStatus.enabled", false);

	const bilibiliNewDynamicsCronExpression = "* * * * *";
	const bilibiliLiveStatusCronExpression = "* * * * *";

	const bilibiliUsers: BilibiliUser[] = bilibili.filterBilibiliUsers(asoulMembers);

	const bilibiliNewDynamicsNotificationsTask = cron.schedule(bilibiliNewDynamicsCronExpression, () => {
		bilibiliUsers.map(async user => {
			const lastDynamicIdKey = `last-dynamic-id-${user.bilibiliId}`;
			const res = await request<BilibiliDynamicsResponse>(bilibiliDynamics.makeDynamicsRequstOptions(user.bilibiliId));
			const lastDynamicId = context.globalState.get<bigint>(lastDynamicIdKey) || 0n;
			const dynamics = bilibiliDynamics.getDynamicsFromResponse(res, user.nickname);
			const newDynamics = bilibiliDynamics.filterNewDynamics(dynamics, lastDynamicId, Date.now());
			newDynamics.forEach(dynamic => {
				bilibiliDynamics.createNewDynamicNotification(dynamic);
				context.globalState.update(lastDynamicIdKey, dynamic.dynamicId);
			});
		});
	}, { scheduled: false });

	if (bilibiliNewDynamicsNotificationsEnabled) {
		bilibiliNewDynamicsNotificationsTask.start();

	}

	const statusBarItems = bilibiliUsers.map(user => vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left));

	const bilibiliLiveStatusNotificationsTask = cron.schedule(bilibiliLiveStatusCronExpression, () => {
		bilibiliUsers.map(async (user, index) => {
			const res = await request<BilibiliLiveStatusResponse>(bilibiliLiveStatus.makeLiveStatusRequstOptions(user.bilibiliId));
			const liveStatus = bilibiliLiveStatus.getLiveStatusFromResponse(res, user.nickname);
			bilibiliLiveStatus.displayStatusBar(statusBarItems[index], liveStatus);
		});
	}, { scheduled: false });

	if (bilibiliLiveStatusNotificationsEnabled) {
		bilibiliLiveStatusNotificationsTask.start();
	}

	vscode.workspace.onDidChangeConfiguration(() => {
		vscode.window
			.showInformationMessage("A-SOUL 提醒小助手的配置需要在 VS Code 重启之后生效", "立即重启")
			.then(selection => {
				if (selection === "立即重启") {
					vscode.commands.executeCommand("workbench.action.reloadWindow");
				}
			});
	});
};

// this method is called when your extension is deactivated
export const deactivate = () => { };
