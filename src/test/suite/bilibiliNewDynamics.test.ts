import * as assert from 'assert';
// import {
//   fetchDynamics,
//   getNewDynamicsFromResponse,
// } from '../../bilibiliDynamics';
import { BilibiliDynamic, BilibiliDynamicsResponse } from '../../types';

suite('BilibiliNewDynamics Functions Test Suite', () => {

  // test('Test fetchBilibiliDynamics', async () => {
  //   const res = await fetchDynamics(672328094);
  //   const cards = res.data?.cards;
  //   assert(cards);
  //   assert(cards.length > 0);
  //   assert(BigInt(cards[0].desc.dynamic_id_str) > 0);
  //   assert(typeof cards[0].desc.timestamp === "number");
  //   assert(typeof cards[0].desc.user_profile.info.uid === "number");
  //   assert(typeof cards[0].desc.user_profile.info.uname === "string");
  // });

  // test('Test getNewBilibiliDynamicsFromResponse', async () => {
  //   const res: BilibiliDynamicsResponse = {
  //     data: {
  //       cards: [{
  //         desc: {
  //           dynamic_id_str: "569453517462599026",
  //           timestamp: 1600052300,
  //           type: 1,
  //           user_profile: {
  //             info: {
  //               uid: 672346917,
  //               uname: "向晚大魔王"
  //             }
  //           }
  //         }
  //       }, {
  //         desc: {
  //           dynamic_id_str: "569453517462599025",
  //           timestamp: 1600042300,
  //           type: 8,
  //           user_profile: {
  //             info: {
  //               uid: 672346917,
  //               uname: "向晚大魔王"
  //             }
  //           }
  //         }
  //       }, {
  //         desc: {
  //           dynamic_id_str: "569453517462599024",
  //           timestamp: 1600032300,
  //           type: 16,
  //           user_profile: {
  //             info: {
  //               uid: 672346917,
  //               uname: "向晚大魔王"
  //             }
  //           }
  //         }
  //       }, {
  //         desc: {
  //           dynamic_id_str: "569453517462599020",
  //           timestamp: 1600022300,
  //           type: 64,
  //           user_profile: {
  //             info: {
  //               uid: 672346917,
  //               uname: "向晚大魔王"
  //             }
  //           }
  //         }
  //       }]
  //     }
  //   };

  //   const dynamics = getNewDynamicsFromResponse(res, "向晚今天吃什么", 0n, 1600032300000);

  //   assert.strictEqual(dynamics.length, 2);
  //   assert.strictEqual(dynamics[0].name, "向晚今天吃什么");
  //   assert.strictEqual(dynamics[0].timestamp, 1600052300);
  //   assert.strictEqual(dynamics[0].dynamicId, 569453517462599026n);
  //   assert.strictEqual(dynamics[0].dynamicUrl, "https://t.bilibili.com/569453517462599026");
  // });
});
