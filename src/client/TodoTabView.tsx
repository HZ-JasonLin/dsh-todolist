/**
 * dsh-todolist — 对话页顶部待办 Tab（conversation.view 入口）。
 * 直接渲染主待办工作区（TodoView：未完成列表 + 五视图 + 弹窗添加）。
 */
import type { ConvViewProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { Translate } from '@deepseek-ai/dsh-client-ui-slots'
import { TodoView } from './TodoView.tsx'
import { TodoErrorBoundary } from './ErrorBoundary.tsx'

/** Locale-bound props（namespace：todolist）。 */
export interface TodoTabViewProps {
  t: Translate
}

/** 对话页顶部的主待办工作区。 */
export function TodoTabView(props: ConvViewProps & TodoTabViewProps): JSX.Element {
  const { sessionId, t } = props
  return (
    <div className="mt-panel">
      <TodoErrorBoundary>
        <TodoView t={t} sessionId={String(sessionId)} />
      </TodoErrorBoundary>
    </div>
  )
}
