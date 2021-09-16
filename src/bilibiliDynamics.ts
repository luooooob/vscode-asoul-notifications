import * as vscode from "vscode";
import axios from "axios";
import type { BilibiliDynamic, BilibiliDynamicsResponse, NotificationOptions } from "./types";
import type { Command } from "vscode";

export const fetchDynamics = (bid: number): Promise<BilibiliDynamicsResponse> => {
  const url = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?host_uid=${bid}`;
  return axios
    .get(url)
    .then(res => res.data);
};

export const getNewDynamicsFromResponse = (res: BilibiliDynamicsResponse, nickname: string, lastDynamicId: bigint, expires: number): BilibiliDynamic[] => {
  return res.data.cards
    .filter(card => card.desc.timestamp * 1000 > expires)
    .filter(card => BigInt(card.desc.dynamic_id_str) > lastDynamicId)
    .map(card => {
      const typeValue = card.desc.type;
      const isVideo = typeValue === 8 || typeValue === 16;
      const isArticle = typeValue === 64;
      return {
        name: nickname,
        timestamp: card.desc.timestamp,
        type: isVideo ? "video" : isArticle ? "article" : "others",
        dynamicId: BigInt(card.desc.dynamic_id_str),
        dynamicUrl: `https://t.bilibili.com/${card.desc.dynamic_id_str}`
      };
    });
};

// export const filterBilibiliNewDynamics = (dynamics: BilibiliDynamic[], lastDynamicId: bigint, expires: number): BilibiliDynamic[] => {
//   return dynamics
//     .filter(dynamic => dynamic.dynamicId > lastDynamicId)
//     .filter(dynamic => dynamic.timestamp * 1000 > expires);
// };

export const createNewDynamicNotificationOptions = (dynamic: BilibiliDynamic): NotificationOptions => {
  const makeMessage = () => {
    switch (dynamic.type) {
      case "video": return `${dynamic.name}投稿了新视频`;
      case "article": return `${dynamic.name}投稿了新专栏`;
      case "others": return `${dynamic.name}有了新动态`;
      default: return `${dynamic.name}有了新动态`;
    };
  };
  const message = makeMessage();
  const commands: Command[] = [{
    title: "前往动态",
    command: "vscode.open",
    arguments: [vscode.Uri.parse(dynamic.dynamicUrl)]
  }];
  return [message, ...commands];
};
