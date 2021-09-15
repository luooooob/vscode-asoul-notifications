import * as vscode from "vscode";
import axios from "axios";
import {
  BilibiliLiveStatusResponse,
  BilibiliLiveStatus,
  NotificationOptions,
} from "./types";

export const requestLiveStatus = (bid: number): Promise<BilibiliLiveStatusResponse> => {
  const url = `https://api.bilibili.com/x/space/acc/info?mid=${bid}`;
  return axios
    .get(url)
    .then(res => res.data);
};

export const getLiveStatusFromResponse = (res: BilibiliLiveStatusResponse): BilibiliLiveStatus => {
  const { name, live_room } = res.data;
  const { liveStatus, url } = live_room;
  const isLive = liveStatus === 1;
  const liveroomUrl = url;
  return { name, isLive, liveroomUrl };
};

export const createLiveStatusNotificationOptions = (liveStatus: BilibiliLiveStatus): NotificationOptions => {
  const message = `在？你为什么不看直播？`;
  const items = [{
    text: `${liveStatus.name}直播间`,
    action: () => vscode.env.openExternal(vscode.Uri.parse(liveStatus.liveroomUrl))
  }];
  return { message, items };
};
