import axios from "axios";
import * as vscode from "vscode";
import type { DouyinVideo, DouyinVideosResponse } from "./types";

export const requestVideos = async (did: string): Promise<DouyinVideosResponse> => {
  const url = `https://www.iesdouyin.com/web/api/v2/aweme/post/?sec_uid=${did}`;
  return axios
    .get(url)
    .then(res => res.data);
};

export const getVideosFromResponse = (res: DouyinVideosResponse, nickname?: string): DouyinVideo[] => {
  return res.aweme_list.map(aweme => {
    const { aweme_id, author } = aweme;
    const videoId = aweme_id;
    const name = nickname || author.nickname;

    const message = `${name} 投稿了新抖音短视频`;
    const commands: vscode.Command[] = [{
      title: "前往视频",
      command: "vscode.open",
      arguments: [vscode.Uri.parse(`https://www.douyin.com/video/${aweme_id}`)]
    }];
    return { videoId, message, commands };
  });
};