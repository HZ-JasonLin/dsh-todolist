# @hz-jasonlin/dsh-todolist

An independent todo board plugin for DeepSeek Harness.

独立待办看板插件，为 DeepSeek Harness（DSH）提供完整的待办管理能力。

## Features / 功能

- 对话页顶部「待办」Tab，提供列表、今日、日历、周视图和项目视图
- **全视图点击即编辑**：列表行、今日卡片、日历/周任务条、项目看板卡片点击直接打开编辑弹窗；勾选框单独承担完成/恢复；编辑弹窗内提供「删除」（二次确认弹窗，避免误触）
- **日历 / 周视图拖动**：
  - 拖动任务条到其他日期 → 修改日期（单日任务改期、跨度任务整体平移；落点格高亮提示）
  - 拖动任务条到其他任务条上方/下方 → 调整排序（持久化）
  - 长按空白日期后跨格拖动 → 快速创建跨度任务
  - 每天最多展示 5 条泳道，超出折叠为「+N」，点击就地展开 / 收起
- **今日视图拖动排序**：顶部「今日」与侧边栏「今日」卡片可拖动排序并持久保存；未手动排序前保持智能顺序（逾期 → 今日到期 → 周期 → 进行中）
- **统一的指针与拖拽视觉**：悬停一律点击指针，拖动中才是拖动指针；任务拖动使用紧凑拖影，并屏蔽宿主（better-sidebar）的分栏落区遮罩
- 横向项目看板，支持项目列拖动排序；可以直接在项目列中添加任务，并自动预填所属项目
- 项目筛选和项目看板完全由任务的 `proj` 数据驱动：新建任务时出现的项目会自动成为筛选选项
- 任务完成状态记录 `doneAt`，日历和周视图按实际完成日期显示
- 未完成的逾期任务自动显示到今天，并标注延期天数
- 当天日期以蓝色圆圈 + 白字高亮
- AI 工具：`todolist` 用于直接管理已确认待办，`todolist_suggest` 用于提交待确认建议
- 可选接入 `dsh-better-sidebar`，在其原生右侧栏提供「今日」Tab
- 未安装 `dsh-better-sidebar` 时，提供独立的 Today 侧栏：按钮挂载到 DSH 原生 session header utilities，与 Session log 共用同一控制行；侧栏支持展开、收起、拖拽调宽和宽度持久化
- 使用独立的本地存储，不依赖其他插件

## Installation / 安装

插件已发布到 npm，推荐直接用 DSH 插件 CLI 安装：

```powershell
dsh plugin --profile web add @hz-jasonlin/dsh-todolist
```

也可以从 GitHub 安装：

```powershell
dsh plugin --profile web add github:HZ-JasonLin/dsh-todolist
```

从源码构建（仅开发环境）：

```powershell
git clone https://github.com/HZ-JasonLin/dsh-todolist.git
cd dsh-todolist
npm install

# 构建客户端 bundle
$env:DSH_SOURCE="<your-dsh-esbuild-environment>"   # 仅当本地构建环境需要时
node scripts/build.mjs
```

插件可以独立使用，不要求安装 `dsh-better-sidebar`。只安装 `@hz-jasonlin/dsh-todolist` 时，顶部「待办」Tab 和完整待办功能仍然可用，同时会启用独立的 Today 侧栏。

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
