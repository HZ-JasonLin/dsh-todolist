# dsh-todolist

An independent todo board plugin for DeepSeek Harness.

独立待办看板插件，为 DeepSeek Harness（DSH）提供完整的待办管理能力。

## Features / 功能

- 对话页顶部「待办」Tab，提供列表、今日、日历、周视图和项目视图
- 横向项目看板，支持项目列拖动排序
- 可以直接在项目列中添加任务，并自动预填所属项目
- 项目筛选和项目看板完全由任务的 `proj` 数据驱动：新建任务时出现的项目会自动成为筛选选项
- 任务完成状态记录 `doneAt`，日历和周视图按实际完成日期显示
- 未完成的逾期任务自动显示到今天，并标注延期天数
- AI 工具：`todolist` 用于直接管理已确认待办，`todolist_suggest` 用于提交待确认建议
- 可选接入 `dsh-better-sidebar`，在其原生右侧栏提供「今日」Tab
- 未安装 `dsh-better-sidebar` 时，提供独立的 Today 侧栏：按钮挂载到 DSH 原生 session header utilities，与 Session log 共用同一控制行；侧栏支持展开、收起、拖拽调宽和宽度持久化
- 使用独立的本地存储，不依赖其他插件

## Installation / 安装

```powershell
# 从源码构建并安装（推荐开发环境）
git clone <repository-url>
cd dsh-todolist
npm install

# 构建客户端 bundle
$env:DSH_SOURCE="<your-dsh-esbuild-environment>"   # 仅当本地构建环境需要时
node scripts/build.mjs
```

发布后也可以通过 DSH 插件 CLI 安装：

```powershell
dsh plugin --profile web add github:<repository-url>
```

插件可以独立使用，不要求安装 `dsh-better-sidebar`。只安装 `dsh-todolist` 时，顶部「待办」Tab 和完整待办功能仍然可用，同时会启用独立的 Today 侧栏。

如果同时安装了 `dsh-better-sidebar`，fallback 会自动停用，插件改为向 better-sidebar 注册原生「今日」Tab。这是自动让渡机制，不会出现两个侧栏入口。

## 待确认待办管理 / Pending Suggestions

`todolist_suggest` 用于 AI 自己提出、需要用户确认的待办建议。建议会进入「待确认待办管理」Tab，用户可以选择「采纳」或「拒绝」。

当用户明确说“记住……”或“我要做……”时，应使用普通 `todolist` 工具直接写入待办，因为用户本人就是确认者。这种情况下不会进入待确认队列。

因此，如果没有使用过 `todolist_suggest`，「待确认待办管理」显示为空是正常的，并不代表功能失效。

## 数据存储 / Storage

服务端会将数据存储在 DSH 配置的数据目录中：

- `todo-data/todos.json`
- `todo-data/suggestions.json`

运行时数据位于本仓库之外，不会被提交到 Git。

## 开发构建 / Development Build

```powershell
# 仅当本地构建环境需要时设置 DSH_SOURCE
$env:DSH_SOURCE="<your-dsh-esbuild-environment>"
node scripts/build.mjs
```

构建产物写入 `lib/client.js`。

## License / 许可证

MIT
