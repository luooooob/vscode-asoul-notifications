import * as vscode from "vscode";
import type { BilibiliDynamic, BilibiliDynamicsResponse, BilibiliFilterNewDynamicsOptions, NotificationOptions, RequstOptions } from "./types";


// export const fetchDynamics = (bid: number): Promise<BilibiliDynamicsResponse> => {
//   const url = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?host_uid=${bid}`;
//   return axios
//     .get(url)
//     .then(res => res.data);
// };

export const makeDynamicsRequstOptions = (bid: number): RequstOptions => ({
  url: `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?host_uid=${bid}`
});

export const getDynamicsFromResponse = (res: BilibiliDynamicsResponse, nickname?: string): BilibiliDynamic[] => {
  return res.data.cards.map(card => {
    const { type, timestamp, dynamic_id_str, user_profile } = card.desc;
    const { uname } = user_profile.info;
    const name = nickname || uname;

    const isVideo = type === 8 || type === 16;
    const isArticle = type === 64;
    const message = isVideo
      ? `${name}投稿了新视频`
      : isArticle
        ? `${name}投稿了新专栏`
        : `${name}有了新动态`;

    const dynamicId = BigInt(dynamic_id_str);
    const dynamicUrl = `https://t.bilibili.com/${dynamicId}`;
    return { name, dynamicId, timestamp, message, dynamicUrl };
  });
};


export const filterNewDynamics = (dynamics: BilibiliDynamic[], lastDynamicId: bigint, now: number): BilibiliDynamic[] => {
  const expireTime = now - 120 * 1000;
  return dynamics
    .filter(({ timestamp }) => timestamp * 1000 > expireTime)
    .filter(({ dynamicId }) => dynamicId > lastDynamicId);
};

export const createNewDynamicNotification = (dynamic: BilibiliDynamic) => {
  vscode.window
    .showInformationMessage(dynamic.message, "前往动态")
    .then(selection => {
      if (selection === "前往动态") {
        vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(dynamic.dynamicUrl));
      }
    });
};


// ({
//   message: dynamic.message,
//   commands: [{
//     title: "前往动态",
//     command: "vscode.open",
//     arguments: [vscode.Uri.parse(dynamic.dynamicUrl)]
//   }]
// });

// export const getNewDynamicsFromResponse = (res: BilibiliDynamicsResponse, nickname: string, lastDynamicId: bigint, expires: number): BilibiliDynamic[] => {
//   return res.data.cards
//     .filter(card => card.desc.timestamp * 1000 > expires)
//     .filter(card => BigInt(card.desc.dynamic_id_str) > lastDynamicId)
//     .map(card => {
//       const typeValue = card.desc.type;
//       const isVideo = typeValue === 8 || typeValue === 16;
//       const isArticle = typeValue === 64;
//       return {
//         name: nickname,
//         timestamp: card.desc.timestamp,
//         type: isVideo ? "video" : isArticle ? "article" : "others",
//         dynamicId: BigInt(card.desc.dynamic_id_str),
//         dynamicUrl: `https://t.bilibili.com/${card.desc.dynamic_id_str}`
//       };
//     });
// };

// export const filterBilibiliNewDynamics = (dynamics: BilibiliDynamic[], lastDynamicId: bigint, expires: number): BilibiliDynamic[] => {
//   return dynamics
//     .filter(dynamic => dynamic.dynamicId > lastDynamicId)
//     .filter(dynamic => dynamic.timestamp * 1000 > expires);
// };

// export const createNewDynamicNotificationOptions = (dynamic: BilibiliDynamic): NotificationOptions => {
//   const makeMessage = () => {
//     switch (dynamic.type) {
//       case "video": return `${dynamic.name}投稿了新视频`;
//       case "article": return `${dynamic.name}投稿了新专栏`;
//       case "others": return `${dynamic.name}有了新动态`;
//       default: return `${dynamic.name}有了新动态`;
//     };
//   };
//   const message = makeMessage();
//   const commands: Command[] = [{
//     title: "前往动态",
//     command: "vscode.open",
//     arguments: [vscode.Uri.parse(dynamic.dynamicUrl)]
//   }];
//   return [message, ...commands];
// };
