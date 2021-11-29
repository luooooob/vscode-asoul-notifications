import axios from "axios"
import * as vscode from "vscode"
import type { BilibiliDynamic, BilibiliDynamicsResponse, RequstOptions } from "./types"

export const requestDynamics = async (bid: number): Promise<BilibiliDynamicsResponse> => {
  const url = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?host_uid=${bid}`
  return axios
    .get(url)
    .then(res => res.data)
}

export const getDynamicsFromResponse = (res: BilibiliDynamicsResponse, nickname?: string): BilibiliDynamic[] => {
  return res.data.cards.map(card => {
    const { type, dynamic_id_str, user_profile } = card.desc
    const dynamicId = dynamic_id_str

    const { uname } = user_profile.info
    const name = nickname ?? uname
    const isVideo = type === 8 || type === 16
    const isArticle = type === 64
    const message = isVideo
      ? `${name}投稿了新视频`
      : isArticle
        ? `${name}投稿了新专栏`
        : `${name}有了新动态`

    const commands: vscode.Command[] = [{
      title: "前往动态",
      command: "vscode.open",
      arguments: [vscode.Uri.parse(`https://t.bilibili.com/${dynamic_id_str}`)]
    }]
    return { dynamicId, message, commands }
  })
}
