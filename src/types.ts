import type { Command } from "vscode";

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

export type DouyinUser = {
  nickname?: string
  douyinId: number
};

export interface DouyinVideosResponse {
  aweme_list: {
    aweme_id: string
    desc: string
    author: {
      nickname: string
    }
  }[]
};

export type DouyinVideo = {
  name: string
  videoId: bigint
  desc: string
};
