/**
 * dsh-todolist — 渲染错误边界：待办界面渲染崩溃时显示错误信息而不是白屏，
 * 便于快速定位问题（不再"没反应/消失"）。
 */
import { Component } from 'react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class TodoErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render(): ReactNode {
    if (this.state.error !== null) {
      return (
        <div className="me-panel">
          <div className="me-notice me-notice-error">
            待办界面渲染出错：{String(this.state.error?.message ?? this.state.error)}
          </div>
          <p className="me-muted">请把上面这行错误信息发给 AI 修复。</p>
        </div>
      )
    }
    return this.props.children
  }
}
