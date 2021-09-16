import * as cron from "node-cron";
import * as vscode from 'vscode';
import * as bilibiliLiveStatus from './bilibiliLiveStatus';
import * as bilibiliDynamics from './bilibiliDynamics';
import * as config from "./config";
import * as notification from './notification';
import { Member } from "./types";

// this method is called when your extension is activated
export const activate = (context: vscode.ExtensionContext) => {
	const configuration = vscode.workspace.getConfiguration("asoulNotifications");
	const asoulMembers = configuration.get<Member[]>("asoulMembers", []);
	const bilibiliNewDynamicsNotificationsEnabled = configuration.get("bilibiliNewDynamics.enabled", false);
	const bilibiliNewDynamicsCronExpression = configuration.get<string>("bilibiliNewDynamics.cron", "2 * * * *");
	const bilibiliLiveStatusNotificationsEnabled = configuration.get("bilibiliLiveStatus.enabled", false);
	const bilibiliLiveStatusCronExpression = configuration.get("bilibiliLiveStatus.cron", "2 * * * *");

	if (bilibiliNewDynamicsNotificationsEnabled) {
		const members = asoulMembers.filter(member => member.bilibiliId);

		cron.schedule(bilibiliNewDynamicsCronExpression, () => {
			members.map(async member => {
				if (!member.bilibiliId) { return; }
				const res = await bilibiliDynamics.fetchDynamics(member.bilibiliId);
				const lastDynamicId = context.globalState.get<bigint>(`last-dynamic-id-${member.bilibiliId}`) || 0n;
				const expires = Date.now() - 120 * 1000;
				bilibiliDynamics.getNewDynamicsFromResponse(res, member.nickname, lastDynamicId, expires)
					.forEach(dynamic => {
						notification.createNotification(...bilibiliDynamics.createNewDynamicNotificationOptions(dynamic));
						context.globalState.update(`last-dynamic-id-${member.bilibiliId}`, dynamic.dynamicId);
					});
			});
		});
	}


	if (bilibiliLiveStatusNotificationsEnabled) {
		const members = asoulMembers.filter(member => member.bilibiliId && member.bilibiliLiveroomId);
		const statusBarItems = members.map(member => {
			if (!member.bilibiliLiveroomId) { return; }
			return vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
		});

		cron.schedule(bilibiliLiveStatusCronExpression, () => {
			members.map(async (member, index) => {
				if (!(member.bilibiliId && member.bilibiliLiveroomId)) { return; }
				const res = await bilibiliLiveStatus.requestLiveStatus(member.bilibiliId);
				const liveStatus = bilibiliLiveStatus.getLiveStatusFromResponse(res);
				const statusBarItem = statusBarItems[index];
				if (!statusBarItem) { return; }
				const liveroomUrl = bilibiliLiveStatus.getLiveroomUrl(member.bilibiliLiveroomId);
				statusBarItem.text = `--${member.nickname}正在直播中--`;
				statusBarItem.command = {
					title: "To Liveroom",
					command: 'vscode.open',
					arguments: [vscode.Uri.parse(liveroomUrl)]
				};
				if (liveStatus.isLive) {
					statusBarItem.show();
				} else {
					statusBarItem.hide();
				}

			});
		});
	}

	vscode.workspace.onDidChangeConfiguration(() => {
		notification.createNotification("此项配置会在重启 VS Code 之后生效", {
			title: "立即重启",
			command: "workbench.action.reloadWindow",
			arguments: []
		});
	});
};

// this method is called when your extension is deactivated
export const deactivate = () => { };
