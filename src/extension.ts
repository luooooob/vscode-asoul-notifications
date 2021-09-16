import * as cron from "node-cron";
import * as vscode from 'vscode';
import * as bilibiliLiveStatus from './bilibiliLiveStatus';
import * as bilibiliDynamics from './bilibiliDynamics';
import * as config from "./config";
import * as notification from './notification';

const activateBilibiliNewDynamicsNotifications = (context: vscode.ExtensionContext) => {
	const bilibiliNewDynamicsNotificationsTask = () => {
		config.getMembers()
			.filter(member => member.bilibiliId)
			.map(async member => {
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
	};

	const bilibiliNewDynamicsNotificationsTaskSchedule = cron.schedule(
		config.getBilibiliNewDynamicsCronExpression(),
		bilibiliNewDynamicsNotificationsTask,
		{ scheduled: false }
	);

	if (config.getBilibiliNewDynamicsNotificationsEnabled()) {
		bilibiliNewDynamicsNotificationsTaskSchedule.start();
	}

	vscode.workspace.onDidChangeConfiguration(() => {
		bilibiliNewDynamicsNotificationsTaskSchedule.stop();
		if (config.getBilibiliNewDynamicsNotificationsEnabled()) {
			bilibiliNewDynamicsNotificationsTaskSchedule.start();
		}
	});
};

const activateBilibiliLiveStatusNotifications = () => {
	const statusBarItems = config.getMembers()
		.filter(member => member.bilibiliId && member.bilibiliLiveroomId)
		.map(member => {
			if (!member.bilibiliLiveroomId) { return; }
			return vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
		});

	const bilibiliLiveStatusNotificationsTask = () => {
		config.getMembers()
			.filter(member => member.bilibiliId && member.bilibiliLiveroomId)
			.map(async (member, index) => {
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
	};

	const bilibiliLiveStatusNotificationsTaskSchedule = cron.schedule(
		config.getBilibiliLiveStatusCronExpression(),
		bilibiliLiveStatusNotificationsTask,
		{ scheduled: false }
	);

	if (config.getBilibiliLiveStatusNotificationsEnabled()) {
		bilibiliLiveStatusNotificationsTaskSchedule.start();
	}

	vscode.workspace.onDidChangeConfiguration(() => {
		bilibiliLiveStatusNotificationsTaskSchedule.stop();
		if (config.getBilibiliLiveStatusNotificationsEnabled()) {
			bilibiliLiveStatusNotificationsTaskSchedule.start();
		}
	});
};


// this method is called when your extension is activated
export const activate = (context: vscode.ExtensionContext) => {
	activateBilibiliNewDynamicsNotifications(context);
	activateBilibiliLiveStatusNotifications();
};

// this method is called when your extension is deactivated
export const deactivate = () => { };
