
export type Member = {
  nickname: string,
  bid: number,
  did: string
};

export type NotificationOptions = {
  message: string
  items: {
    text: string
    action: () => void
  }[]
};

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
  name: string
  isLive: boolean
  liveroomUrl: string
};
