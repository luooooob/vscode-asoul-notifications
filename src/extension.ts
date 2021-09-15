import * as cron from "node-cron";
import * as vscode from 'vscode';
import * as bilibiliLiveStatus from './bilibiliLiveStatus';
import * as bilibiliDynamics from './bilibiliDynamics';
import * as config from "./config";
import * as notification from './notification';

const activateBilibiliNewDynamicsNotifications = () => {
	const bilibiliNewDynamicsNotificationsTask = () => {
		console.log("new d task");
		config.getMembers().map(async member => {
			const res = await bilibiliDynamics.fetchDynamics(member.bid);
			const expires = Date.now() - 55 * 1000;
			bilibiliDynamics.getNewDynamicsFromResponse(res, expires)
				.map(dynamic => notification.createNotification(
					bilibiliDynamics.createNewDynamicNotificationOptions(dynamic)
				));
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
	const bilibiliLiveStatusNotificationsTask = () => {
		console.log("livestatus task");
		config.getMembers().map(async member => {
			const res = await bilibiliLiveStatus.requestLiveStatus(member.bid);
			const liveStatus = bilibiliLiveStatus.getLiveStatusFromResponse(res);
			if (liveStatus.isLive) {
				notification.createNotification(
					bilibiliLiveStatus.createLiveStatusNotificationOptions(liveStatus)
				);
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
	activateBilibiliNewDynamicsNotifications();
	activateBilibiliLiveStatusNotifications();
};

// this method is called when your extension is deactivated
export const deactivate = () => { };
