import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import type { Translate } from '@deepseek-ai/dsh-client-ui-slots'
import { TodoView } from './TodoView.tsx'
import { TodoErrorBoundary } from './ErrorBoundary.tsx'

interface TodoSidebarFallbackProps {
  t: Translate
}

const STORAGE_KEY = 'dsh-todolist:fallback-sidebar'
const MIN_WIDTH = 280
const DEFAULT_WIDTH = 360

function panelIcon(): JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="2" width="13" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10.5" y="3.25" width="2.75" height="9.5" rx="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function readWidth(): number {
  try {
    const value = Number(window.localStorage.getItem(STORAGE_KEY))
    return Number.isFinite(value) && value >= MIN_WIDTH ? value : DEFAULT_WIDTH
  } catch {
    return DEFAULT_WIDTH
  }
}

function clampWidth(width: number): number {
  return Math.min(Math.max(MIN_WIDTH, Math.round(width)), Math.max(MIN_WIDTH, window.innerWidth))
}

/** Better-sidebar-style single Today panel used when the host plugin is absent. */
export function TodoSidebarFallback({ t }: TodoSidebarFallbackProps): JSX.Element | null {
  const [open, setOpen] = useState(false)
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [dragging, setDragging] = useState(false)
  const [mounted, setMounted] = useState(false)
  const drag = useRef({ startX: 0, startWidth: DEFAULT_WIDTH })
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMounted(true)
    setWidth(readWidth())
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const appRoot = document.querySelector<HTMLElement>('#root')
    const narrow = window.innerWidth < 768
    const nextWidth = open && !narrow ? `${width}px` : '0px'
    root.style.setProperty('--dsh-todolist-sidebar-width', nextWidth)
    appRoot?.style.setProperty('margin-right', nextWidth, 'important')
    return () => {
      root.style.removeProperty('--dsh-todolist-sidebar-width')
      appRoot?.style.removeProperty('margin-right')
    }
  }, [open, width])

  useEffect(() => {
    if (dragging) document.body.setAttribute('data-dsh-todolist-dragging', '')
    else document.body.removeAttribute('data-dsh-todolist-dragging')
    return () => document.body.removeAttribute('data-dsh-todolist-dragging')
  }, [dragging])

  useEffect(() => {
    if (open) document.body.removeAttribute('data-dsh-todolist-fallback-collapsed')
    else document.body.setAttribute('data-dsh-todolist-fallback-collapsed', '')
    return () => document.body.removeAttribute('data-dsh-todolist-fallback-collapsed')
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const startResize = (event: PointerEvent<HTMLDivElement>): void => {
    if (window.innerWidth < 768) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { startX: event.clientX, startWidth: width }
    setDragging(true)
  }

  const moveResize = (event: PointerEvent<HTMLDivElement>): void => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    const next = clampWidth(drag.current.startWidth + drag.current.startX - event.clientX)
    panelRef.current?.style.setProperty('width', `${next}px`)
    document.documentElement.style.setProperty('--dsh-todolist-sidebar-width', `${next}px`)
    document.querySelector<HTMLElement>('#root')?.style.setProperty('margin-right', `${next}px`, 'important')
  }

  const endResize = (event: PointerEvent<HTMLDivElement>): void => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    const next = clampWidth(drag.current.startWidth + drag.current.startX - event.clientX)
    setWidth(next)
    try { window.localStorage.setItem(STORAGE_KEY, String(next)) } catch { /* storage is optional */ }
    setDragging(false)
  }

  if (!mounted) return null

  return (
    <>
      <button
        type="button"
        className="todo-fallback-toggle-button"
        aria-label={open ? t('todo.fallback.close') : t('todo.fallback.open')}
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
      >
        {panelIcon()}
      </button>
      {createPortal(
        <aside
          ref={panelRef}
          className={open ? 'todo-fallback-panel todo-fallback-panel--open' : 'todo-fallback-panel todo-fallback-panel--hidden'}
          data-dragging={dragging || undefined}
          aria-hidden={!open}
          aria-label={t('todo.fallback.title')}
          style={{ width: window.innerWidth < 768 ? '100vw' : width }}
        >
          <div
            className={dragging ? 'todo-fallback-resize todo-fallback-resize--active' : 'todo-fallback-resize'}
            onPointerDown={startResize}
            onPointerMove={moveResize}
            onPointerUp={endResize}
          />
          <div className="todo-fallback-panel-body">
            <TodoErrorBoundary>
              <TodoView t={t} sessionId="fallback" mode="today" />
            </TodoErrorBoundary>
          </div>
        </aside>,
        document.body,
      )}
    </>
  )
}
