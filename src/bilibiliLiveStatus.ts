import * as vscode from "vscode";
import axios from "axios";
import {
  BilibiliLiveStatusResponse,
  BilibiliLiveStatus,
  NotificationOptions,
} from "./types";

export const makeLiveStatusRequstOptions = (bid: number) => ({
  url: `https://api.bilibili.com/x/space/acc/info?mid=${bid}`
});

export const getLiveStatusFromResponse = (res: BilibiliLiveStatusResponse, nickname: string | undefined): BilibiliLiveStatus => {
  const name = nickname || res.data.name;
  const isLive = res.data.live_room.liveStatus === 1;
  if (isLive) {
    const url = res.data.live_room.url;
    return { name, isLive, url };
  }
  return { name, isLive };
};

export const displayStatusBar = (statusBarItem: vscode.StatusBarItem, liveStatus: BilibiliLiveStatus) => {
  if (liveStatus.isLive) {
    statusBarItem.text = `--${liveStatus.name}正在直播--`;
    statusBarItem.tooltip = "前往直播间";
    statusBarItem.command = {
      title: "To Liveroom",
      command: 'vscode.open',
      arguments: [vscode.Uri.parse(liveStatus.url)]
    };
    statusBarItem.show();
  } else {
    statusBarItem.hide();
  }
};



// export const getLiveroomUrl = (id: number) => {
//   return `https://live.bilibili.com/${id}`;
// };

// export const createLiveStatusNotificationOptions = (liveStatus: BilibiliLiveStatus): NotificationOptions => {
//   const message = `在？你为什么不看直播？`;
//   const commands: vscode.Command[] = [{
//     title: `${liveStatus.name}直播间`,
//     command: "vscode.open",
//     arguments: [liveStatus.liveroomUrl]
//   }];
//   return [ message, ...commands];
// };
