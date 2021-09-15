import * as assert from 'assert';
import {
  requestLiveStatus, getLiveStatusFromResponse,
} from '../../bilibiliLiveStatus';
import type { BilibiliLiveStatusResponse } from "../../types";

suite('BilibiliLiveStatus Functions Test Suite', () => {

  test('Test fetchBilibiliLiveStatus', async () => {
    const res = await requestLiveStatus(672328094);
    const { name, live_room } = res.data;
    const { liveStatus, url } = live_room;

    assert(name.length > 1);
    assert(liveStatus === 1 || liveStatus === 0);
    assert(url.startsWith("https"));
  });

  test('Test getBilibiliLiveStatusFromResponse', async () => {
    const res: BilibiliLiveStatusResponse = {
      data: {
        name: "嘉然今天吃什么",
        live_room: {
          liveStatus: 1,
          url: "https://live.bilibili.com/22637261"
        }
      }
    };

    const parseResult = getLiveStatusFromResponse(res);
    assert.strictEqual(parseResult.name, "嘉然今天吃什么");
    assert.strictEqual(parseResult.isLive, true);
    assert.strictEqual(parseResult.liveroomUrl, "https://live.bilibili.com/22637261");
  });
});
