# Awesome DeepInk

一款支持厚墨书源可视化调试的插件，需要配合`厚墨`的投屏功能（发现 -> 设置 -> 投屏）。

TODO 状态提示
TODO 代码优化，解耦
TODO 树形框刷新，下一页

## 功能

- **代码片段**

  在 .json 文件中键入 `deepInkBook`，可获得基础书源模板

  ![deepInkBook](https://github.com/chimisgo)

- **代码规范**

  - 字段悬浮提示
  - 字段补全
  - 验证字段格式
  - 强制要求填写必填项

  ![schema](https://github.com/chimisgo)

  schema 可独立于该插件使用，在 .json 中添加如下字段即可

  ```json
  "$schema": "https://raw.githubusercontent.com/vhxubo/NBSR/master/schema.json"
  ```

- **快捷工具**

- **设置**

- **调试**

  - 设置书源

    调用厚墨接口，将**当前活动编辑器文本**设置为书源，设置的书源对全部 API 有效

    联调、排行榜、搜索会自动调用

  - 联调

    一键调试搜索 -> 详情 -> 目录 -> 正文

  - 排行榜

  - 搜索

  - 详情

  - 目录

  - 正文

  - 安装

## 命令行

| 命令行                    | 功能                                                 |
| ------------------------- | ---------------------------------------------------- |
| DeepInk: Set Host         | 设置投屏连接                                         |
| DeepInk: Set Search Key   | 设置搜索关键词                                       |
| DeepInk: Debug Set Source | 设置书源                                             |
| DeepInk: Debug Auto       | 联调                                                 |
| DeepInk: Debug Rank       | 排行榜                                               |
| DeepInk: Debug Search     | 搜索                                                 |
| DeepInk: Install          | 安装                                                 |
| DeepInk: Open Jsoup       | 使用默认浏览器打开 [Jsoup](https://try.jsoup.org/)   |
| DeepInk: Open Jsonpath    | 使用默认浏览器打开 [Jsonpath](https://jsonpath.com/) |

## 配置项

| 名称                  | 默认值                      | 描述               |
| --------------------- | --------------------------- | ------------------ |
| `awesomeDeepInk.host` | <http://192.168.1.112:8888> | 厚墨投屏的完整链接 |
| `awesomeDeepInk.key`  | 剑来                        | 测试的搜索关键词   |

## 更新日志

请查看 [CHANGELOG](https://github.com/chimisgo)

---

ICON 由 [chimisgo](https://github.com/chimisgo) 提供
