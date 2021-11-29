import * as cron from "node-cron"
import * as vscode from "vscode"
import * as bilibiliLiveStatus from "./bilibiliLiveStatus"
import * as bilibiliDynamics from "./bilibiliDynamics"
import * as douyinVideos from "./douyinVideos"
import type { AsoulMember, BilibiliUser, DouyinUser } from "./types"
import { createNotification } from "./notification"

// this method is called when your extension is activated
export const activate = (context: vscode.ExtensionContext) => {
  const configuration = vscode.workspace.getConfiguration("asoulNotifications")
  const asoulMembers = configuration.get<AsoulMember[]>("asoulMembers", [])

  const bilibiliDynamicsNotificationsEnabled = configuration.get("bilibiliDynamics.enabled", false)
  const bilibiliLiveStatusNotificationsEnabled = configuration.get("bilibiliLiveStatus.enabled", false)
  const douyinVideosNotificationsEnabled = configuration.get("douyinVideos.enabled", false)

  const bilibiliDynamicsCronExpression = "*/2 * * * *"
  const bilibiliLiveStatusCronExpression = "*/2 * * * *"
  const douyinVideosCronExpression = "*/2 * * * *"

  const bilibiliUsers: BilibiliUser[] = asoulMembers
    .reduce((users, { bilibiliId, nickname }) => {
      return bilibiliId
        ? [...users, { nickname, bilibiliId }]
        : users
    }, [] as BilibiliUser[])

  const douyinUsers: DouyinUser[] = asoulMembers
    .reduce((users, { douyinId, nickname }) => {
      return douyinId
        ? [...users, { nickname, douyinId }]
        : users

    }, [] as DouyinUser[])

  const bilibiliDynamicsNotificationsTask = cron.schedule(bilibiliDynamicsCronExpression, () => {
    bilibiliUsers.map(async ({ bilibiliId, nickname }) => {
      try {
        const oldDynamicIdsKey = `old-dynamic-ids-${bilibiliId}`
        const res = await bilibiliDynamics.requestDynamics(bilibiliId)
        const oldDynamicIds = context.globalState.get<string[]>(oldDynamicIdsKey) ?? []
        const newDynamics = bilibiliDynamics
          .getDynamicsFromResponse(res, nickname)
          .filter(({ dynamicId }) => oldDynamicIds.length > 0 && !oldDynamicIds.includes(dynamicId))
        newDynamics.forEach(({ message, commands }) => createNotification(message, ...commands))
        const newDynamicIds = newDynamics.map(({ dynamicId }) => dynamicId)
        context.globalState.update(oldDynamicIdsKey, [...oldDynamicIds, ...newDynamicIds])
      } catch (err) {
        console.log(err)
      }
    })
  }, { scheduled: false })

  if (bilibiliDynamicsNotificationsEnabled) {
    bilibiliDynamicsNotificationsTask.start()
  }

  const statusBarItems = bilibiliUsers.map(user => vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left))

  const bilibiliLiveStatusNotificationsTask = cron.schedule(bilibiliLiveStatusCronExpression, () => {
    bilibiliUsers.map(async ({ bilibiliId, nickname }, index) => {
      const res = await bilibiliLiveStatus.requestLiveStatus(bilibiliId)
      const liveStatus = bilibiliLiveStatus.getLiveStatusFromResponse(res, nickname)
      bilibiliLiveStatus.displayStatusBar(statusBarItems[index], liveStatus)
    })
  }, { scheduled: false })

  if (bilibiliLiveStatusNotificationsEnabled) {
    bilibiliLiveStatusNotificationsTask.start()
  }

  const douyinVideosNotificationsTask = cron.schedule(douyinVideosCronExpression, () => {
    douyinUsers.map(async ({ douyinId, nickname }) => {
      try {
        const oldVideoIdsKey = `old-video-ids-${douyinId}`
        const res = await douyinVideos.requestVideos(douyinId)
        const oldVideoIds = context.globalState.get<string[]>(oldVideoIdsKey) ?? []
        const newVideos = douyinVideos
          .getVideosFromResponse(res, nickname)
          .filter(({ videoId }) => oldVideoIds.length > 0 && !oldVideoIds.includes(videoId))
        newVideos.forEach(({ message, commands }) => createNotification(message, ...commands))
        const newVideoIds = newVideos.map(({ videoId }) => videoId)
        context.globalState.update(oldVideoIdsKey, [...oldVideoIds, ...newVideoIds])
      } catch (err) {
        console.log(err)
      }
    })
  }, { scheduled: false })

  if (douyinVideosNotificationsEnabled) {
    douyinVideosNotificationsTask.start()
  }

  vscode.workspace.onDidChangeConfiguration(ds => {
    if (ds.affectsConfiguration("asoulNotifications")) {
      vscode.window
        .showInformationMessage("A-SOUL 提醒小助手的配置需要在 VS Code 重启之后生效", "立即重启")
        .then(selection => {
          if (selection === "立即重启") {
            vscode.commands.executeCommand("workbench.action.reloadWindow")
          }
        })
    }
  })
}

// this method is called when your extension is deactivated
export const deactivate = () => { }
