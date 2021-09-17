import type { Command } from "vscode";

export type NotificationOptions = {
  message: string
  commands: Command[]
};

export type RequstOptions = {
  url: string
};

export type AsoulMember = {
  nickname?: string,
  bilibiliId?: number,
  douyinId?: string
};

export type BilibiliUser = {
  nickname?: string
  bilibiliId: number
};

export interface BilibiliDynamicsResponse {
  data: {
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

export type BilibiliDynamic = {
  name: string
  timestamp: number
  message: string
  dynamicId: bigint
  dynamicUrl: string
};

export type BilibiliFilterNewDynamicsOptions = {
  lastDynamicId: bigint
  now: number
};


export interface BilibiliLiveStatusResponse {
  data: {
    name: string
    live_room: {
      liveStatus: 0 | 1,
      url: string
    }
  }
}

export type BilibiliLiveStatus = {
  name: string
} & ({
  isLive: false
} | {
  isLive: true,
  url: string
});
