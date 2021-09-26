# A-SOUL 提醒小助手

[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/luooooob/vscode-asoul-notifications?include_prereleases&label=Visual%20Studio%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=JiangYan.asoul-notifications)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/jiangyan.asoul-notifications)](https://marketplace.visualstudio.com/items?itemName=JiangYan.asoul-notifications)
[![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/jiangyan.asoul-notifications)](https://marketplace.visualstudio.com/items?itemName=JiangYan.asoul-notifications)

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/luooooob/vscode-asoul-notifications/CI)](https://github.com/luooooob/vscode-asoul-notifications/actions/workflows/ci.yml)
[![GitHub top language](https://img.shields.io/github/languages/top/luooooob/vscode-asoul-notifications)](https://github.com/luooooob/vscode-asoul-notifications)
[![GitHub](https://img.shields.io/github/license/luooooob/vscode-asoul-notifications)](https://github.com/luooooob/vscode-asoul-notifications/blob/master/LICENSE)

> 

## 功能

- ### Bilibili 新动态提醒

![新动态提醒1](./images/notifications-1.png)

![新动态提醒2](./images/notifications-2.png)

- ### 抖音新视频提醒

![新动态提醒2](./images/notifications-2.png)

- ### 正在直播提醒(点击前往直播间)

![正在直播提醒1](./images/live-status-1.png)

![正在直播提醒2](./images/live-status-2.png)

## 设置

- `asoulNotifications.asoulMembers`
  
  ```json
  [
    {
      "nickname": "向晚",
      "bilibiliId": 672346917,
      "douyinId": "MS4wLjABAAAAxCiIYlaaKaMz_J1QaIAmHGgc3bTerIpgTzZjm0na8w5t2KTPrCz4bm_5M5EMPy92"
    },
    {
      "nickname": "拉姐",
      "bilibiliId": 672353429,
      "douyinId": "MS4wLjABAAAA5ZrIrbgva_HMeHuNn64goOD2XYnk4ItSypgRHlbSh1c"
    },

    // ...

  ]
  ```

  一个数组, 记录所有成员的 bilibili 和抖音的 id 以及自定义昵称. 可以自行添加更多项(不推荐添加太多，本插件采用轮询 Bilibili 和抖音公开接口的方式工作, 如果任务太多可能会被gank). 三个键都是可选的, 如果没有`bilibiliId` 或 `douyinId`, 则没有该平台的相关功能, 如果没有`nickname`, 会默认使用该平台的昵称.

- `asoulNotifications.bilibiliLiveStatus.enabled`

  打开/关闭正在直播提醒

- `asoulNotifications.bilibiliDynamics.enabled`

  打开/关闭新动态提醒
- `asoulNotifications.douyinVideos.enabled`

  打开/关闭抖音新视频提醒

注意: 所有选项的更改都需要重启 VS Code 才能生效.

## 反馈

插件正在开发中, 可能会出现不稳定的现象, 任何任何 bug 或建议可以通过 [issue](https://github.com/luooooob/vscode-asoul-notifications/issues/new) 反馈, 关于本插件的功能有更好的想法和建议也欢迎告知
