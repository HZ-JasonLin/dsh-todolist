/**
 * dsh-todolist — 待确认待办建议视图。
 *
 * 读 /todolist/api/suggestions（AI 用 todolist_suggest 提议的待办），
 * 采纳 → 写入待办存储；拒绝 → 丢弃。数据完全独立存储。
 */
import { useCallback, useEffect, useState } from 'react'
import type { Translate } from '@deepseek-ai/dsh-client-ui-slots'

/** 一条待确认建议。 */
interface SuggestionItem {
  id: string
  content: string
  proj: string | null
  who: string | null
  due: string | null
  quadrant: string | null
  repeat: string | null
  on: number | null
  createdAt: string
}

export interface SuggestionsViewProps {
  t: Translate
  /** 队列变化后的回调（顶部 tab 徽标刷新）。 */
  onChanged?: () => void
}

export function SuggestionsView(props: SuggestionsViewProps): JSX.Element {
  const { t, onChanged } = props
  const [entries, setEntries] = useState<SuggestionItem[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  const load = useCallback((): void => {
    setEntries(null)
    void fetch('/todolist/api/suggestions')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: { entries: SuggestionItem[] }) => setEntries(data.entries ?? []))
      .catch((error: Error) => setNotice({ kind: 'error', text: error.message }))
  }, [])

  useEffect(() => { load() }, [load])

  const act = (id: string, action: 'approve' | 'reject'): void => {
    if (busy) return
    setBusy(true)
    void fetch('/todolist/api/suggestions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action, id }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((outcome: { ok: boolean; message: string }) => {
        if (!outcome.ok) throw new Error(outcome.message)
        setNotice({ kind: 'ok', text: action === 'approve' ? t('suggestions.approved') : t('suggestions.rejected') })
        load()
        onChanged?.()
        window.dispatchEvent(new CustomEvent('todolist:badge-change'))
        if (action === 'approve') window.dispatchEvent(new CustomEvent('todolist:changed'))
      })
      .catch((error: Error) => setNotice({ kind: 'error', text: error.message }))
      .finally(() => setBusy(false))
  }

  /**
   * 全部采纳：交给后端一次原子完成（approveAll），避免逐条按旧下标
   * 操作时队列前移导致的张冠李戴。
   */
  const approveAll = (): void => {
    if (busy || entries === null || entries.length === 0) return
    setBusy(true)
    void fetch('/todolist/api/suggestions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'approveAll' }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((outcome: { ok: boolean; message: string }) => {
        if (!outcome.ok) throw new Error(outcome.message)
        setNotice({ kind: 'ok', text: outcome.message })
        load()
        onChanged?.()
        window.dispatchEvent(new CustomEvent('todolist:badge-change'))
        window.dispatchEvent(new CustomEvent('todolist:changed'))
      })
      .catch((error: Error) => setNotice({ kind: 'error', text: error.message }))
      .finally(() => setBusy(false))
  }

  return (
    <div className="me-panel">
      {notice !== null && (
        <div className={`me-notice me-notice-${notice.kind}`}>{notice.text}</div>
      )}
      <p className="me-muted me-todo-help">{t('suggestions.title')}</p>
      {entries === null ? (
        <p className="me-muted">{t('panel.loading')}</p>
      ) : entries.length === 0 ? (
        <p className="me-empty">{t('suggestions.empty')}</p>
      ) : (
        <>
          <div className="me-proj-toolbar">
            <button
              type="button"
              className="me-btn me-btn-primary"
              disabled={busy}
              onClick={approveAll}
            >
              {t('suggestions.approveAll')}
            </button>
          </div>
          <ul className="me-list">
            {entries.map((entry) => (
              <li key={entry.id} className="me-item me-todo-item">
                <div className="me-item-head">
                  {entry.proj !== null && <span className="me-badge me-badge-proj">{entry.proj}</span>}
                  {entry.who !== null && <span className="me-badge me-badge-who">{entry.who}</span>}
                  {entry.quadrant !== null && (
                    <span className={`me-badge me-badge-quad me-badge-quad-${entry.quadrant}`}>{t(`todo.quadrant.${entry.quadrant}`)}</span>
                  )}
                  {entry.due !== null && <span className="me-badge me-badge-due">{t('todo.due')} {entry.due}</span>}
                  {entry.repeat !== null && <span className="me-badge me-badge-repeat">🔄 {entry.repeat}</span>}
                  <span className="me-item-time">{entry.createdAt}</span>
                </div>
                <p className="me-todo-text">{entry.content}</p>
                <span className="me-item-actions">
                  <button
                    type="button"
                    className="me-btn me-btn-primary"
                    disabled={busy}
                    onClick={() => act(entry.id, 'approve')}
                  >
                    {t('suggestions.approve')}
                  </button>
                  <button
                    type="button"
                    className="me-btn me-btn-danger"
                    disabled={busy}
                    onClick={() => act(entry.id, 'reject')}
                  >
                    {t('suggestions.reject')}
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
