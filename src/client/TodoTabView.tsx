/**
 * dsh-todolist — 对话页顶部待办 Tab（conversation.view 入口）。
 *
 * 两个子 tab：
 *   「待办」：主界面（TodoView，未完成列表 + 五视图 + 弹窗添加）；
 *   「待确认待办建议」：AI 用 todolist_suggest 提议的待办（SuggestionsView）。
 * 子 tab 徽标显示待确认数（30s 轮询 + todolist:badge-change 事件即时刷新）。
 */
import { useEffect, useState } from 'react'
import type { ConvViewProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { Translate } from '@deepseek-ai/dsh-client-ui-slots'
import { SuggestionsView } from './SuggestionsView.tsx'
import { TodoView } from './TodoView.tsx'
import { TodoErrorBoundary } from './ErrorBoundary.tsx'

/** 顶部 Tab 的两个子功能。 */
type TodoTabFeature = 'todo' | 'suggestions'

/** Locale-bound props（namespace：todolist）。 */
export interface TodoTabViewProps {
  t: Translate
}

/** 跨重挂持久化的子 tab 选择。 */
let persistedFeature: TodoTabFeature | null = null

export function TodoTabView(props: ConvViewProps & TodoTabViewProps): JSX.Element {
  const { sessionId, t } = props
  const [feature, setFeature] = useState<TodoTabFeature>(persistedFeature ?? 'todo')
  const [suggestionsCount, setSuggestionsCount] = useState(0)

  useEffect(() => { persistedFeature = feature }, [feature])

  /** 拉取待确认建议数（尽力而为）。 */
  const poll = (): void => {
    void fetch('/todolist/api/suggestions')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: { entries?: unknown[] }) => setSuggestionsCount(data.entries?.length ?? 0))
      .catch(() => { /* 徽标尽力而为；功能不受影响 */ })
  }

  useEffect(() => {
    poll()
    const timer = window.setInterval(poll, 30_000)
    const onChange = (): void => poll()
    window.addEventListener('todolist:badge-change', onChange)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('todolist:badge-change', onChange)
    }
  }, [])

  return (
    <div className="mt-panel">
      <div className="mt-file-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={feature === 'todo'}
          className={feature === 'todo' ? 'mt-file-tab mt-file-tab-active' : 'mt-file-tab'}
          onClick={() => setFeature('todo')}
        >
          {t('todosTab.feature.todo')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={feature === 'suggestions'}
          className={feature === 'suggestions' ? 'mt-file-tab mt-file-tab-active' : 'mt-file-tab'}
          onClick={() => setFeature('suggestions')}
        >
          {t('todosTab.feature.todoSuggestions')}
          {suggestionsCount > 0 && <span className="mt-feature-count">{suggestionsCount}</span>}
        </button>
      </div>
      {feature === 'todo' ? (
        <TodoErrorBoundary>
          <TodoView t={t} sessionId={String(sessionId)} />
        </TodoErrorBoundary>
      ) : (
        <SuggestionsView
          t={t}
          onChanged={() => {
            poll()
            window.dispatchEvent(new CustomEvent('todolist:badge-change'))
          }}
        />
      )}
    </div>
  )
}
