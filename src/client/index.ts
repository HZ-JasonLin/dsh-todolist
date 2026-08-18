/**
 * dsh-todolist — 独立待办看板（client 入口）。
 *
 * 注册两个入口：
 *   1. 对话页顶部「待办」Tab（conversation.view）
 *   2. 侧栏入口：有 better-sidebar 时注册其 Tab；没有时挂载独立 Today 抽屉
 * 数据全部走 /todolist/api（本插件自建服务端），使用独立存储。
 */
import { createElement } from 'react'
import type { Context } from 'cordis'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { Translate } from '@deepseek-ai/dsh-client-ui-slots'
import { TodoTabView } from './TodoTabView.tsx'
import { TodoView } from './TodoView.tsx'
import { TodoErrorBoundary } from './ErrorBoundary.tsx'
import { TodoSidebarFallback } from './TodoSidebarFallback.tsx'
import styles from './styles.css'
import dictZh from './dict-zh.json'
import dictEn from './dict-en.json'

interface BetterSidebarTabProps {
  scope: { sessionId: string }
}

interface BetterSidebarTabDescriptor {
  id: string
  title: () => string
  icon: (size: number) => unknown
  order: number
  single: boolean
  component: (props: BetterSidebarTabProps) => unknown
}

interface BetterSidebarHost {
  registerTab(descriptor: BetterSidebarTabDescriptor): () => void
}

/** 本插件拥有的 locale 命名空间。 */
const NS = 'todolist'

/** 基础字典 + 本插件补充键。 */
export const zh = {
  ...dictZh,
  'tab.title': '待办',
  'tab.title.pending': '待办 ({count})',
  'suggestions.title': 'AI 提议的待办（确认后写入；也可直接说"记住…"让我用 todolist 直写）',
  'suggestions.empty': '没有待确认的待办建议。',
  'suggestions.approve': '采纳',
  'suggestions.reject': '拒绝',
  'suggestions.approveAll': '全部采纳',
  'suggestions.approved': '已采纳并写入待办',
  'suggestions.rejected': '已拒绝',
  'suggestions.done': '操作完成',
  'todo.startShort': '开始',
  'todo.dueShort': '截止',
  'todo.fallback.open': '打开今日待办侧栏',
  'todo.fallback.close': '关闭今日待办侧栏',
  'todo.fallback.title': '今日待办',
  'todo.fallback.subtitle': '今天到期、逾期和周期任务',
}

export const en = {
  ...dictEn,
  'tab.title': 'Todos',
  'tab.title.pending': 'Todos ({count})',
  'suggestions.title': 'AI-proposed todos (approve to write; or just tell me “remember…” and I file them directly)',
  'suggestions.empty': 'No pending todo suggestions.',
  'suggestions.approve': 'Approve',
  'suggestions.reject': 'Reject',
  'suggestions.approveAll': 'Approve all',
  'suggestions.approved': 'Approved and written to todos',
  'suggestions.rejected': 'Rejected',
  'suggestions.done': 'Done',
  'todo.startShort': 'Start',
  'todo.dueShort': 'Due',
  'todo.fallback.open': 'Open Today todo sidebar',
  'todo.fallback.close': 'Close Today todo sidebar',
  'todo.fallback.title': 'Today',
  'todo.fallback.subtitle': 'Due today, overdue, and recurring tasks',
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'todolist': keyof typeof zh
  }
}

/** Cordis service injections. */
export const inject = ['slots', 'locale', 'conversation']

/** Badge poll interval (ms). */
const BADGE_POLL_MS = 30_000

/**
 * Client plugin body.
 */
export function apply(ctx: Context): void {
  const t = ctx.locale.bind(NS) as unknown as Translate

  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'todolist: dictionaries')

  ctx.effect(() => {
    if (typeof document === 'undefined') return () => {}
    const tags = Array.from(document.querySelectorAll<HTMLStyleElement>('style[data-todolist-css], style[data-plugin="dsh-todolist"]'))
    const tag = document.createElement('style')
    tag.dataset.todolistCss = '1'
    tag.dataset.plugin = 'dsh-todolist'
    tag.textContent = styles
    for (const stale of tags) stale.remove()
    document.head.appendChild(tag)
    return () => {
      if (tag.parentNode !== null) tag.remove()
    }
  }, 'todolist: stylesheet')

  // —— 对话页顶部 Tab（conversation.view，order 30 = 原待办入口位置）——
  let badgeCount = 0
  let disposeTopTab: (() => void) | undefined

  const registerTopTab = (): void => {
    disposeTopTab?.()
    disposeTopTab = ctx.slots.inject('conversation.view', () =>
      ctx.slots.register({
        name: 'conversation.view',
        id: 'todolist-hub',
        order: 30,
        label: () => (badgeCount > 0 ? t('tab.title.pending', { count: badgeCount }) : t('tab.title')),
      }, (props) => TodoTabView({ ...props, t })))
  }
  registerTopTab()

  const refreshBadge = (): void => {
    void fetch('/todolist/api/suggestions')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: { entries?: unknown[] }) => {
        const next = data.entries?.length ?? 0
        if (next !== badgeCount) {
          badgeCount = next
          // 计数变化 → 重注册 Tab 让 label 重求值
          registerTopTab()
        }
      })
      .catch(() => { /* badge 尽力而为 */ })
  }
  refreshBadge()
  const badgeTimer = window.setInterval(refreshBadge, BADGE_POLL_MS)

  // —— 侧栏宿主让渡：better-sidebar 存在时注册 Tab，否则挂载独立 Today 抽屉。——
  let hostSynced = false
  let activeHost: BetterSidebarHost | undefined
  let disposeSidebarTab: (() => void) | undefined
  let disposeFallbackSlot: (() => void) | undefined

  const unmountFallback = (): void => {
    disposeFallbackSlot?.()
    disposeFallbackSlot = undefined
  }

  const mountFallback = (): void => {
    if (disposeFallbackSlot !== undefined) return
    disposeFallbackSlot = ctx.slots.inject('conversation.session.header.utilities', () =>
      ctx.slots.register({
        name: 'conversation.session.header.utilities',
        id: 'todolist-fallback-sidebar',
        order: 90,
      }, () => createElement(TodoSidebarFallback, { t })),
    )
  }

  const registerSidebarTab = (host: BetterSidebarHost): void => {
    disposeSidebarTab = host.registerTab({
      id: 'todolist',
      title: () => t('tab.title'),
      icon: (size: number) => createElement('svg', { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' },
        createElement('rect', { x: 1.8, y: 1.8, width: 12.4, height: 12.4, rx: 2.4 }),
        createElement('path', { d: 'M4.8 8.3 7 10.5 11.2 5.7' }),
      ),
      order: 90,
      single: true,
      component: (props: BetterSidebarTabProps) => createElement(TodoErrorBoundary, null,
        createElement(TodoView, { t, sessionId: props.scope.sessionId, mode: 'today' })),
    })
  }

  const syncSidebarHost = (): void => {
    const nextHost = ctx.get('betterSidebar') as BetterSidebarHost | undefined
    if (hostSynced && nextHost === activeHost) return
    hostSynced = true
    disposeSidebarTab?.()
    disposeSidebarTab = undefined
    activeHost = nextHost
    if (nextHost !== undefined) {
      unmountFallback()
      try {
        registerSidebarTab(nextHost)
      } catch (error) {
        activeHost = undefined
        console.warn('[dsh-todolist] better-sidebar tab 注册失败，改用内置 Today 侧栏：', error)
        mountFallback()
      }
    } else {
      mountFallback()
    }
  }

  syncSidebarHost()
  const hostTimer = window.setInterval(syncSidebarHost, 1_000)

  ctx.effect(() => () => {
    window.clearInterval(badgeTimer)
    window.clearInterval(hostTimer)
    disposeTopTab?.()
    disposeSidebarTab?.()
    unmountFallback()
  }, 'todolist: cleanup')
}
