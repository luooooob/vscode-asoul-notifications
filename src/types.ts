import type { Command } from "vscode";

export type Member = {
  nickname: string,
  bilibiliId?: number,
  bilibiliLiveroomId?: number,
  douyinId?: string
};

export type VscodeCommand = Command;
export type NotificationOptions = [string, ...VscodeCommand[]];

export interface BilibiliDynamicsResponse {
  readonly data: {
    cards: {
      desc: {
        dynamic_id_str: string
        timestamp: number
        type: number
        user_profile: {
          info: {
            uid: number
            uname: string
          }
        }
      }
    }[]
  }
}

export type BilibiliDynamicType = "video" | "article" | "others";

export type BilibiliDynamic = {
  name: string
  timestamp: number
  type: BilibiliDynamicType
  dynamicId: bigint
  dynamicUrl: string
};

export interface BilibiliLiveStatusResponse {
  readonly data: {
    name: string
    live_room: {
      liveStatus: 0 | 1,
      url: string
    }
  }
}

export type BilibiliLiveStatus = {
  isLive: boolean
};
