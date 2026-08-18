/**
 * dsh-todolist — 独立待办看板主视图。
 *
 * 项目制待办管理：未完成列表 + 列表/看板/日历/周/项目五视图 + 弹窗添加。
 * 支持项目/负责人/截止/时间跨度/周期/四象限/状态。
 * 数据来自本插件自建服务端 /todolist/api/todo（独立存储）。
 * 样式复用 styles.css 的 me-/mt- 前缀。
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, DragEvent, PointerEvent as ReactPointerEvent } from 'react'
import type { Translate } from '@deepseek-ai/dsh-client-ui-slots'

/**
 * 展示视图模式：
 * - list：纵向列表（默认）
 * - today：今日视图（今天到期/周期/长期任务进行中的单日卡片列表）
 * - calendar：月历（全部有日期事项统一为日期框内事件条）
 * - week：周视图（本周 7 天横排）
 * - project：横向项目看板（含已完成事项与项目列拖动排序）
 */
type TodoViewMode = 'list' | 'today' | 'calendar' | 'week' | 'project'

/** GET /api/todo 返回的单条待办。 */
interface TodoItem {
  id: string
  time: string
  /** 存储侧象限；null 表示未写 quadrant 标签。 */
  quadrant: string | null
  due: string | null
  status: string
  doneAt: string | null
  /** 项目归属（[proj: …] 标签）；null = 未归类。 */
  proj: string | null
  /** 负责人（[who: …] 标签）；null = 未指定。 */
  who: string | null
  /** 开始日期（[start: …]），与 due 组成时间跨度（日历按范围展示）。 */
  start: string | null
  /** 周期循环（[repeat: …]）：daily / weekly / monthly；null = 不重复。 */
  repeat: string | null
  /** 周期定点（[on: …]）：weekly=周几(1-7)、monthly=几号(1-31)。 */
  on: number | null
  /** 周期任务上次完成/推进日期。 */
  last: string | null
  /** 月历事件条与周视图卡片共用的垂直顺序。 */
  calendarOrder?: number
  text: string
}

/** Locale-bound props。 */
export interface TodoViewProps {
  t: Translate
  sessionId: string
  /** 入口形态：'full' = 顶部多视图（含视图切换）；'today' = 侧边栏纯今日视图。 */
  mode?: 'full' | 'today'
}

/** 已结束状态（完成/取消），快速视图中默认隐藏。 */
const DONE_STATUSES = new Set(['done', 'cancelled'])
/**
 * 跨重挂持久化的视图模式（模块级）。
 * badge 刷新等导致组件重挂时，恢复用户上次选的视图。
 */
let persistedViewMode: TodoViewMode | null = null
const PROJECT_ORDER_KEY = 'dsh-todolist:project-order'

function loadProjectOrder(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(PROJECT_ORDER_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : []
  } catch {
    return []
  }
}

/** 统一请求宿主 API（/todolist 前缀）；非 2xx 或业务失败（ok:false）均抛错。 */
async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/todolist${path}`, {
    headers: { 'content-type': 'application/json' },
    ...init,
  })
  let body: unknown = null
  try {
    body = await res.json()
  } catch {
    body = null
  }
  const obj = body as { ok?: boolean; message?: string; error?: string } | null
  if (!res.ok) throw new Error(obj?.message ?? obj?.error ?? `HTTP ${res.status}`)
  // 后端业务失败（找不到 id、字段不合法等）统一以 4xx 返回；双保险再查 ok 字段
  if (obj !== null && obj.ok === false) throw new Error(obj.message ?? '操作失败')
  return body as T
}

/** 象限文案（q1..q4）；null = 未分类。 */
function quadrantLabel(t: Translate, quadrant: string | null): string {
  if (quadrant === null) return t('todo.quadrant.none')
  return t(`todo.quadrant.${quadrant}`)
}

/** 状态文案键：pending / doing / done / blocked / cancelled。 */
function statusLabel(t: Translate, status: string): string {
  const key = `todo.status.${status}`
  const label = t(key)
  // 未知状态时 locale 可能回落为 key 本身，直接展示原始 status
  return label === key ? status : label
}

/** 项目分类色板；仅用于区分项目，不承载完成/成功语义。 */
const PROJ_COLORS = ['#4f8df7', '#d66b78', '#e4a83a', '#62b77b', '#9a7ac5', '#5ba9a0', '#d18a57', '#6f9bcf', '#8d9aa5']
const CALENDAR_COLORS = [
  { fill: '#B9D6FF', text: '#2878D4' },
  { fill: '#BCEFC2', text: '#2D9B4B' },
  { fill: '#FFC0C4', text: '#D64550' },
  { fill: '#FFE3A8', text: '#B87900' },
  { fill: '#AEE6E1', text: '#168E87' },
  { fill: '#D8C5FF', text: '#7650C9' },
  { fill: '#FFD0A8', text: '#C66A14' },
  { fill: '#BFD8FF', text: '#3D73C9' },
  { fill: '#A9E5D8', text: '#248D78' },
]

/** 项目 → 固定颜色（哈希取色板，同项目同色；未归类用灰）。 */
function projColor(proj: string | null): string {
  if (!proj) return '#8a8e91'
  let h = 0
  for (let i = 0; i < proj.length; i += 1) h = (h * 31 + proj.charCodeAt(i)) >>> 0
  return PROJ_COLORS[h % PROJ_COLORS.length]
}

function taskColor(item: TodoItem): string {
  const seed = item.id || item.text
  let h = 0
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return PROJ_COLORS[h % PROJ_COLORS.length]
}

function calendarColor(item: TodoItem): { fill: string; text: string } {
  const seed = item.id || item.text
  let h = 0
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return CALENDAR_COLORS[h % CALENDAR_COLORS.length] ?? CALENDAR_COLORS[0]
}

/** due 相对 today 的逾期天数（负数=还有几天）。 */
function diffDays(due: string, today: string): number {
  const [y1, m1, d1] = due.split('-').map(Number)
  const [y2, m2, d2] = today.split('-').map(Number)
  return Math.round((new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime()) / 86400000)
}

/** 'YYYY-MM' 月份键（本地时区）。 */
function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** 月份键 ±N 月。 */
function shiftMonth(key: string, delta: number): string {
  const [y, m] = key.split('-').map(Number)
  return monthKey(new Date(y, m - 1 + delta, 1))
}

/** 'YYYY-MM-DD' 日期键（本地时区）。 */
function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** 某月日历网格：周一起始、6 行 42 格（含前后月补齐格）。 */
function gridDays(key: string): Date[] {
  const [y, m] = key.split('-').map(Number)
  const first = new Date(y, m - 1, 1)
  const start = new Date(first)
  start.setDate(1 - ((first.getDay() + 6) % 7))
  const days: Date[] = []
  for (let i = 0; i < 42; i += 1) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push(d)
  }
  return days
}

/** 'YYYY-MM-DD' 日期键 ±N 天。 */
function shiftDays(key: string, delta: number): string {
  const [y, m, d] = key.split('-').map(Number)
  return dateKey(new Date(y, m - 1, d + delta))
}

/** 日期键所在周的周一日期键（周一为一周起点）。 */
function weekStartOf(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() - ((dt.getDay() + 6) % 7))
  return dateKey(dt)
}

/** 'YYYY-MM-DD' → 'MM月DD日'（日事清时间字段格式；空返回 null）。 */
function fmtDate(key: string | null | undefined): string | null {
  if (!key) return null
  const [, m, d] = key.split('-')
  return `${m}月${d}日`
}

/** 周期任务在某日期是否出现；创建日前不回填，已完成的当期不重复显示。 */
function repeatDayMatches(item: TodoItem, d: Date): boolean {
  const key = dateKey(d)
  const createdDay = item.time.slice(0, 10)
  if (/^\d{4}-\d{2}-\d{2}$/.test(createdDay) && key < createdDay) return false
  if (item.last === key) return false
  if (item.repeat === 'daily') return true
  if (item.repeat === 'weekly') return item.on !== null && d.getDay() === (item.on % 7)
  if (item.repeat === 'monthly') return item.on !== null && d.getDate() === item.on
  return false
}

/** 月历/周视图共同的事项顺序：持久化 calendarOrder 优先，旧数据稳定回退。 */
function compareCalendarItems(a: TodoItem, b: TodoItem): number {
  const orderOf = (item: TodoItem): number => (
    typeof item.calendarOrder === 'number' && Number.isFinite(item.calendarOrder)
      ? item.calendarOrder
      : Number.MAX_SAFE_INTEGER
  )
  const byOrder = orderOf(a) - orderOf(b)
  if (byOrder !== 0) return byOrder
  const byDone = Number(DONE_STATUSES.has(a.status)) - Number(DONE_STATUSES.has(b.status))
  if (byDone !== 0) return byDone
  return String(a.time).localeCompare(String(b.time)) || a.id.localeCompare(b.id)
}

/** 月历统一事件段；单日占一列，长期任务跨列，每段严格落在同一周内。 */
interface CalendarSpanSegment {
  item: TodoItem
  occurrenceKey: string
  startIndex: number
  endIndex: number
  lane: number
  continuesBefore: boolean
  continuesAfter: boolean
}

interface RangeDraft {
  start: string
  end: string
  source: 'calendar' | 'week'
}

interface RangeGesture {
  pointerId: number
  pointerType: string
  startX: number
  startY: number
  anchor: string
  current: string
  source: RangeDraft['source']
  active: boolean
  timer: number
  capture: HTMLElement
}

const RANGE_DRAFT_ID = '__range-draft__'

/** 月历每行最多渲染的泳道数；超出部分折叠为行底「+N」入口（macOS 日历式）。 */
const MAX_MONTH_LANES = 5

function orderedRange(a: string, b: string): { start: string; end: string } {
  return a <= b ? { start: a, end: b } : { start: b, end: a }
}

function createRangeDraftItem(draft: RangeDraft): TodoItem {
  return {
    id: RANGE_DRAFT_ID,
    time: '',
    quadrant: null,
    due: draft.end,
    status: 'pending',
    doneAt: null,
    proj: null,
    who: null,
    start: draft.start,
    repeat: null,
    on: null,
    last: null,
    calendarOrder: -1,
    text: '新待办',
  }
}

/**
 * 把全部日历事项转换成同一种事件段：单日事项占一列，长期事项跨列，
 * 周期任务按可见日期展开为单日实例。每段严格落在同一周内，再按共享
 * calendarOrder 稳定分配泳道；月历因此不再维护另一套“格内小卡片”。
 */
function buildSpanSegments(
  items: TodoItem[],
  days: Date[],
  displayDayOf?: (item: TodoItem) => string | null,
): CalendarSpanSegment[][] {
  if (days.length === 0) return []
  const dayKeys = days.map(dateKey)
  const firstVisible = dayKeys[0]
  const lastVisible = dayKeys[dayKeys.length - 1]
  const weekCount = Math.ceil(days.length / 7)
  const occurrences: Array<{
    item: TodoItem
    occurrenceKey: string
    actualStart: string
    actualEnd: string
    visibleStart: string
    visibleEnd: string
  }> = []

  for (const item of items) {
    const displayDay = displayDayOf?.(item) ?? null
    if (displayDay !== null) {
      if (displayDay < firstVisible || displayDay > lastVisible) continue
      occurrences.push({
        item,
        occurrenceKey: `${item.id}@display-${displayDay}`,
        actualStart: displayDay,
        actualEnd: displayDay,
        visibleStart: displayDay,
        visibleEnd: displayDay,
      })
      continue
    }
    if (item.repeat !== null) {
      days.forEach((day, index) => {
        if (!repeatDayMatches(item, day)) return
        const key = dayKeys[index]
        occurrences.push({
          item,
          occurrenceKey: `${item.id}@${key}`,
          actualStart: key,
          actualEnd: key,
          visibleStart: key,
          visibleEnd: key,
        })
      })
      continue
    }

    const actualStart = item.start ?? item.due
    const actualEnd = item.due ?? item.start
    if (actualStart === null || actualEnd === null) continue
    const range = orderedRange(actualStart, actualEnd)
    const visibleStart = range.start < firstVisible ? firstVisible : range.start
    const visibleEnd = range.end > lastVisible ? lastVisible : range.end
    if (visibleStart > visibleEnd) continue
    occurrences.push({
      item,
      occurrenceKey: item.id,
      actualStart: range.start,
      actualEnd: range.end,
      visibleStart,
      visibleEnd,
    })
  }

  // Occurrences are collected once; lane assignment is performed per week row
  // in the shared user order so each row reads top-to-bottom in that order and
  // uses the minimum lanes for its actual concurrency.
  occurrences.sort((a, b) => {
    const byOrder = compareCalendarItems(a.item, b.item)
    if (byOrder !== 0) return byOrder
    const byStart = a.visibleStart.localeCompare(b.visibleStart)
    if (byStart !== 0) return byStart
    const byEnd = b.visibleEnd.localeCompare(a.visibleEnd)
    if (byEnd !== 0) return byEnd
    return a.occurrenceKey.localeCompare(b.occurrenceKey)
  })

  const rows: CalendarSpanSegment[][] = Array.from({ length: weekCount }, () => [])
  for (const occurrence of occurrences) {
    const startIndex = dayKeys.indexOf(occurrence.visibleStart)
    const endIndex = dayKeys.indexOf(occurrence.visibleEnd)
    if (startIndex < 0 || endIndex < startIndex) continue
    const firstWeek = Math.floor(startIndex / 7)
    const lastWeek = Math.floor(endIndex / 7)
    for (let week = firstWeek; week <= lastWeek; week += 1) {
      const segmentStart = Math.max(startIndex, week * 7)
      const segmentEnd = Math.min(endIndex, week * 7 + 6)
      rows[week].push({
        item: occurrence.item,
        occurrenceKey: occurrence.occurrenceKey,
        startIndex: segmentStart,
        endIndex: segmentEnd,
        lane: 0,
        continuesBefore: occurrence.actualStart < dayKeys[segmentStart],
        continuesAfter: occurrence.actualEnd > dayKeys[segmentEnd],
      })
    }
  }

  // 两组泳道（macOS 日历语义）：
  // 1) 跨天段（长条）整行按 order 贪心，从 lane0 起；
  // 2) 单日段在每列内独立按 order 堆叠，整体偏移到跨天段之下。
  for (const segments of rows) {
    const rangeSegments = segments.filter((s) => s.continuesBefore || s.continuesAfter)
    const daySegments = segments.filter((s) => !(s.continuesBefore || s.continuesAfter))
    const ordered = (list: CalendarSpanSegment[]): CalendarSpanSegment[] => [...list].sort((a, b) => {
      const byOrder = compareCalendarItems(a.item, b.item)
      if (byOrder !== 0) return byOrder
      return (a.startIndex - b.startIndex) || (b.endIndex - a.endIndex)
    })

    // 跨天段：整行贪心
    const rangeOrdered = ordered(rangeSegments)
    const rangeLaneEnds: number[] = []
    for (const segment of rangeOrdered) {
      let lane = rangeLaneEnds.findIndex((end) => end < segment.startIndex)
      if (lane === -1) {
        lane = rangeLaneEnds.length
        rangeLaneEnds.push(segment.endIndex)
      } else {
        rangeLaneEnds[lane] = segment.endIndex
      }
      segment.lane = lane
    }
    const rangeMaxLane = rangeLaneEnds.length - 1

    // 单日段：每列独立贪心，偏移到跨天段之下
    const dayOrdered = ordered(daySegments)
    const colLaneEnds: number[][] = Array.from({ length: 7 }, () => [])
    for (const segment of dayOrdered) {
      const col = segment.startIndex % 7
      const ends = colLaneEnds[col]
      let lane = ends.findIndex((end) => end < segment.startIndex)
      if (lane === -1) {
        lane = ends.length
        ends.push(segment.endIndex)
      } else {
        ends[lane] = segment.endIndex
      }
      segment.lane = lane + rangeMaxLane + 1
    }
  }

  return rows
}

/**
 * 待办主视图：轨页签、筛选栏、快速添加、列表 / 四象限看板。
 * 每次变更后重新 load 当前轨数据。
 */
export function TodoView(props: TodoViewProps): JSX.Element {
  const { t, sessionId, mode = 'full' } = props
  const isTodayOnly = mode === 'today'
  const [items, setItems] = useState<TodoItem[] | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'done'>(() => isTodayOnly ? 'active' : 'all')
  const [quadFilter, setQuadFilter] = useState<string>('all')
  /** 列表 / 今日 / 日历 / 周 / 项目视图切换（默认列表；跨重挂用模块级持久化）。 */
  const [viewMode, setViewMode] = useState<TodoViewMode>(() => (
    persistedViewMode !== null && persistedViewMode !== 'board'
      ? persistedViewMode
      : 'list'
  ))
  /** 月历与周视图共用日期锚点；两个视图始终呈现同一日期上下文。 */
  const [calendarAnchor, setCalendarAnchor] = useState<string>(() => dateKey(new Date()))
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const calMonth = calendarAnchor.slice(0, 7)
  const weekStart = weekStartOf(calendarAnchor)
  /** 月历 / 周视图共用的拖动创建预览与任务垂直排序状态。 */
  const [rangeDraft, setRangeDraft] = useState<RangeDraft | null>(null)
  const rangeGestureRef = useRef<RangeGesture | null>(null)
  const suppressCalendarClickRef = useRef(false)
  const [draggingSpanId, setDraggingSpanId] = useState<string | null>(null)
  const [spanDrop, setSpanDrop] = useState<{ key: string; id: string; position: 'before' | 'after' } | null>(null)
  /** 拖动源 id 的同步镜像：dragover 高频触发，不能依赖异步 state。 */
  const draggingSpanIdRef = useRef<string | null>(null)
  /** 项目看板列顺序：拖动后写入 localStorage，刷新仍保持。 */
  const [projectOrder, setProjectOrder] = useState<string[]>(loadProjectOrder)
  const [draggingProject, setDraggingProject] = useState<string | null>(null)
  const [projectDrop, setProjectDrop] = useState<{ key: string; position: 'before' | 'after' } | null>(null)
  /** 页签行的项目切换（'' = 全部项目；非空时全局按项目过滤）。 */
  const [projectFilter, setProjectFilter] = useState('')
  /** 添加弹窗：开关 + 表单草稿。 */
  const [modalOpen, setModalOpen] = useState(false)
  const [modalEditId, setModalEditId] = useState<string | null>(null)
  const [mContent, setMContent] = useState('')
  const [mProj, setMProj] = useState('')
  const [mWho, setMWho] = useState('')
  const [mStart, setMStart] = useState('')
  const [mDue, setMDue] = useState('')
  const [mRepeat, setMRepeat] = useState('')
  const [mOn, setMOn] = useState('')
  const [mQuad, setMQuad] = useState('')
  const [mStatus, setMStatus] = useState('pending')
  /** 添加弹窗的时间选择器：目标字段（start/due）+ 月历月份。 */
  const [mDateTarget, setMDateTarget] = useState<'start' | 'due' | null>(null)
  const [mDateCal, setMDateCal] = useState<string>(() => monthKey(new Date()))
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  // 视图模式跨重挂持久化
  useEffect(() => {
    persistedViewMode = viewMode
  }, [viewMode])

  const load = useCallback((): void => {
    setItems(null)
    // 后端 list 仅支持 all 参数；状态/象限/项目筛选均在前端完成
    void api<{ items: TodoItem[] }>('/api/todo?all=1')
      .then((res) => {
        setItems(res.items)
      })
      .catch((error: Error) => setNotice({ kind: 'error', text: error.message }))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  /** 数据变更后广播，让顶部 Tab 与侧边栏 Tab 等所有已挂载 TodoView 同步刷新。 */
  const notifyChanged = (): void => {
    window.dispatchEvent(new CustomEvent('todolist:changed'))
  }

  useEffect(() => {
    const onChange = (): void => load()
    window.addEventListener('todolist:changed', onChange)
    return () => window.removeEventListener('todolist:changed', onChange)
  }, [load])

  /** 短暂成功提示。 */
  const flash = (text: string): void => {
    setNotice({ kind: 'ok', text })
    window.setTimeout(() => {
      setNotice((current) => (current?.text === text ? null : current))
    }, 3000)
  }

  /** 打开添加弹窗；从日历进入时预填所点日期为结束日期。 */
  const openAddModal = (day = ''): void => {
    setModalEditId(null)
    setMContent('')
    setMProj(projectFilter)
    setMWho('')
    setMStart('')
    setMDue(day)
    setMRepeat('')
    setMOn('')
    setMQuad('')
    setMStatus('pending')
    setMDateTarget(null)
    setMDateCal(day !== '' ? day.slice(0, 7) : monthKey(new Date()))
    setModalOpen(true)
  }

  const openEditModal = (item: TodoItem): void => {
    setModalEditId(item.id)
    setMContent(item.text)
    setMProj(item.proj?.trim() ?? '')
    setMWho(item.who ?? '')
    setMStart(item.start ?? '')
    setMDue(item.due ?? '')
    setMRepeat(item.repeat ?? '')
    setMOn(item.on !== null ? String(item.on) : '')
    setMQuad(item.quadrant ?? '')
    setMStatus(item.status)
    setMDateTarget(null)
    setMDateCal((item.due ?? item.start ?? today).slice(0, 7))
    setModalOpen(true)
  }

  const openAddWithDay = (day: string): void => openAddModal(day)

  /** 从项目看板添加任务：复用添加弹窗并预填所属项目。 */
  const openAddForProject = (project: string): void => {
    openAddModal()
    setMProj(project)
  }

  const openAddWithRange = (start: string, end: string): void => {
    openAddModal(end)
    setMStart(start === end ? '' : start)
    setMDue(end)
    setRangeDraft(null)
  }

  /** Resolve a pointer position against the actual date-column geometry.
   * Event bars sit in a sibling overlay, so DOM ancestry alone cannot identify
   * the date cell underneath them. */
  const dayAtPoint = (clientX: number, clientY: number, source: RangeDraft['source']): string | null => {
    const selector = source === 'calendar'
      ? '.me-cal-cell[data-calendar-day]'
      : '.me-week-date-head[data-calendar-day], .me-week-column[data-calendar-day]'
    const candidates = Array.from(document.querySelectorAll<HTMLElement>(selector))
    for (const candidate of candidates) {
      const rect = candidate.getBoundingClientRect()
      if (clientX >= rect.left && clientX < rect.right && clientY >= rect.top && clientY < rect.bottom) {
        return candidate.dataset.calendarDay ?? null
      }
    }
    return null
  }

  const cancelRangeGesture = (pointerId?: number): void => {
    const gesture = rangeGestureRef.current
    if (gesture === null || (pointerId !== undefined && gesture.pointerId !== pointerId)) return
    window.clearTimeout(gesture.timer)
    rangeGestureRef.current = null
    setRangeDraft(null)
    if (gesture.capture.hasPointerCapture(gesture.pointerId)) {
      try {
        gesture.capture.releasePointerCapture(gesture.pointerId)
      } catch {
        // The browser may have released capture before React delivers cleanup.
      }
    }
  }

  /** 月历 / 周视图共用：长按空白日期后跨格拖动，松手预填添加弹窗。 */
  const beginRangeGesture = (day: string, source: RangeDraft['source'], event: ReactPointerEvent<HTMLElement>): void => {
    const interactive = (event.target as HTMLElement).closest('.me-cal-cell-select, .me-cal-cell-add, .me-week-column-add, .me-week-event, .me-calendar-span, .me-calendar-more')
    if (!event.isPrimary || event.button !== 0 || (interactive !== null && interactive !== event.currentTarget)) return
    if (rangeGestureRef.current !== null) {
      cancelRangeGesture()
      return
    }
    const capture = event.currentTarget
    capture.setPointerCapture(event.pointerId)
    const gesture: RangeGesture = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      startX: event.clientX,
      startY: event.clientY,
      anchor: day,
      current: day,
      source,
      active: false,
      capture,
      timer: window.setTimeout(() => {
        const current = rangeGestureRef.current
        if (current === null || current.pointerId !== event.pointerId) return
        current.active = true
        const range = orderedRange(current.anchor, current.current)
        setRangeDraft({ ...range, source: current.source })
      }, 280),
    }
    rangeGestureRef.current = gesture
  }

  const moveRangeGesture = (event: ReactPointerEvent<HTMLElement>): void => {
    const gesture = rangeGestureRef.current
    if (gesture === null || gesture.pointerId !== event.pointerId) return
    if (!gesture.active) {
      const distance = Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY)
      const threshold = gesture.pointerType === 'touch' ? 10 : 7
      if (distance > threshold) cancelRangeGesture(event.pointerId)
      return
    }
    event.preventDefault()
    const day = dayAtPoint(event.clientX, event.clientY, gesture.source)
    if (day === null || day === gesture.current) return
    gesture.current = day
    const range = orderedRange(gesture.anchor, day)
    setRangeDraft({ ...range, source: gesture.source })
  }

  const finishRangeGesture = (event: ReactPointerEvent<HTMLElement>, cancelled = false): void => {
    const gesture = rangeGestureRef.current
    if (gesture === null || gesture.pointerId !== event.pointerId) return
    window.clearTimeout(gesture.timer)
    const finalDay = cancelled ? null : dayAtPoint(event.clientX, event.clientY, gesture.source)
    const active = gesture.active
    const anchor = gesture.anchor
    rangeGestureRef.current = null
    if (gesture.capture.hasPointerCapture(event.pointerId)) {
      try {
        gesture.capture.releasePointerCapture(event.pointerId)
      } catch {
        // Capture can already be gone after pointercancel/lostpointercapture.
      }
    }
    if (!active || finalDay === null) {
      setRangeDraft(null)
      return
    }
    const range = orderedRange(anchor, finalDay)
    suppressCalendarClickRef.current = true
    window.setTimeout(() => { suppressCalendarClickRef.current = false }, 0)
    openAddWithRange(range.start, range.end)
  }

  const selectCalendarDay = (day: string): void => {
    if (suppressCalendarClickRef.current) return
    setCalendarAnchor(day)
    setSelectedDay(day)
  }

  /** Find the span/card closest to a pointer position inside a container.
   * During an HTML5 drag the dragged element is excluded from hit testing, so
   * candidates are compared by vertical center distance. For the month grid the
   * row that actually contains the pointer wins, so cross-week drags anchor
   * inside the row under the cursor instead of a distant row. */
  const spanAtPoint = (clientX: number, clientY: number, root: HTMLElement | null): HTMLElement | null => {
    if (root === null) return null
    const rootRect = root.getBoundingClientRect()
    if (clientX < rootRect.left || clientX > rootRect.right || clientY < rootRect.top || clientY > rootRect.bottom) return null
    // Month: constrain the candidate set to the week row under the pointer.
    // Week: the whole column container is the candidate set.
    let scope: HTMLElement = root
    if (root.classList.contains('me-cal-span-layer')) {
      const rows = Array.from(root.parentElement?.querySelectorAll<HTMLElement>('.me-cal-row') ?? [])
      const hit = rows.find((row) => {
        const rect = row.getBoundingClientRect()
        return clientY >= rect.top && clientY < rect.bottom
      })
      if (hit !== undefined) scope = hit
    }
    const spans = Array.from(scope.querySelectorAll<HTMLElement>('.me-calendar-span, .me-week-event'))
    // Prefer spans whose column band covers the pointer x; fall back to vertical center.
    const covering = spans.filter((span) => {
      const rect = span.getBoundingClientRect()
      return clientX >= rect.left && clientX <= rect.right
    })
    const pool = covering.length > 0 ? covering : spans
    let best: HTMLElement | null = null
    let bestDist = Number.POSITIVE_INFINITY
    for (const span of pool) {
      const rect = span.getBoundingClientRect()
      const dist = Math.abs(clientY - (rect.top + rect.height / 2))
      if (dist < bestDist) {
        bestDist = dist
        best = span
      }
    }
    return best
  }

  /** Resolve a drop against the closest span under the pointer. */
  const resolveSpanDrop = (event: DragEvent<HTMLElement>, root: HTMLElement | null): { targetId: string; segmentKey: string; position: 'before' | 'after' } | null => {
    const span = spanAtPoint(event.clientX, event.clientY, root)
    if (span === null) return null
    const targetId = span.dataset.todoId ?? ''
    const segmentKey = span.dataset.segmentKey ?? ''
    if (targetId === '') return null
    const rect = span.getBoundingClientRect()
    const position = event.clientY < rect.top + rect.height / 2 ? 'before' : 'after'
    return { targetId, segmentKey, position }
  }

  const startSpanDrag = (event: DragEvent<HTMLButtonElement>, item: TodoItem): void => {
    if (item.id === RANGE_DRAFT_ID) {
      event.preventDefault()
      return
    }
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', item.id)
    draggingSpanIdRef.current = item.id
    setDraggingSpanId(item.id)
    setSpanDrop(null)
  }

  /** Container-level dragover: the source row/column is the drop zone, and the
   * closest span under the pointer decides the insertion anchor. */
  const overSpanContainer = (event: DragEvent<HTMLDivElement | HTMLElement>, source: 'calendar' | 'week'): void => {
    const sourceId = draggingSpanIdRef.current ?? draggingSpanId ?? event.dataTransfer.getData('text/plain')
    if (sourceId === '' || busy) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    const hit = resolveSpanDrop(event, event.currentTarget)
    if (hit === null) {
      setSpanDrop((current) => (current === null || current.id !== sourceId ? current : null))
      return
    }
    if (hit.targetId === sourceId) return
    setSpanDrop((current) => (
      current !== null && current.key === hit.segmentKey && current.position === hit.position ? current : { key: hit.segmentKey, id: hit.targetId, position: hit.position }
    ))
  }

  /** Container-level drop: reorder against the closest span under the pointer. */
  const dropSpanContainer = (event: DragEvent<HTMLDivElement | HTMLElement>): void => {
    event.preventDefault()
    const sourceId = draggingSpanIdRef.current ?? draggingSpanId ?? event.dataTransfer.getData('text/plain')
    const hit = resolveSpanDrop(event, event.currentTarget)
    draggingSpanIdRef.current = null
    setDraggingSpanId(null)
    setSpanDrop(null)
    if (sourceId === '' || hit === null || hit.targetId === sourceId || busy) return
    setBusy(true)
    void api<{ ok: boolean }>('/api/todo', {
      method: 'POST',
      body: JSON.stringify({ sessionId, action: 'reorder', id: sourceId, targetId: hit.targetId, position: hit.position }),
    }).then(() => {
      notifyChanged()
      flash(t('todo.updated'))
    }).catch((error: Error) => {
      setNotice({ kind: 'error', text: error.message })
    }).finally(() => setBusy(false))
  }

  /** Legacy per-span handlers removed; all drop resolution happens at container level. */

  const endSpanDrag = (): void => {
    draggingSpanIdRef.current = null
    setDraggingSpanId(null)
    setSpanDrop(null)
  }

  useEffect(() => {
    const handleBlur = (): void => cancelRangeGesture()
    window.addEventListener('blur', handleBlur)
    return () => {
      window.removeEventListener('blur', handleBlur)
      cancelRangeGesture()
    }
  }, [])

  useEffect(() => {
    cancelRangeGesture()
    endSpanDrag()
  }, [viewMode])

  /** 弹窗提交新增或编辑；两种动作共用同一套字段。 */
  const submitModal = (): void => {
    const content = mContent.trim()
    if (content === '' || busy) return
    setBusy(true)
    const projInput = mProj.trim()
    const fallbackProj = projectFilter !== '' ? projectFilter : undefined
    let dueVal = mRepeat !== '' ? undefined : (mDue === '' ? undefined : mDue)
    let startVal = mRepeat !== '' ? undefined : (mStart === '' ? undefined : mStart)
    if (startVal !== undefined && dueVal !== undefined && startVal > dueVal) {
      const swap = startVal
      startVal = dueVal
      dueVal = swap
    }
    const payload = {
      sessionId,
      action: modalEditId === null ? 'add' : 'update',
      ...(modalEditId === null ? {} : { id: modalEditId, status: mStatus }),
      content,
      quadrant: modalEditId === null ? (mQuad === '' ? undefined : mQuad) : mQuad,
      due: dueVal,
      start: startVal,
      proj: projInput === ''
        ? (modalEditId === null ? fallbackProj : '')
        : projInput,
      who: mWho === '' ? undefined : mWho,
      repeat: mRepeat === '' ? undefined : mRepeat,
      on: (mRepeat === 'weekly' || mRepeat === 'monthly') ? (mOn === '' ? undefined : mOn) : undefined,
    }
    void api<{ ok: boolean }>('/api/todo', {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then(() => {
      setModalOpen(false)
      setModalEditId(null)
      setMContent('')
      setMProj('')
      setMWho('')
      setMStart('')
      setMDue('')
      setMRepeat('')
      setMOn('')
      setMQuad('')
      setMStatus('pending')
      notifyChanged()
      flash(t(modalEditId === null ? 'todo.added' : 'todo.updated'))
    }).catch((error: Error) => {
      setNotice({ kind: 'error', text: error.message })
    }).finally(() => setBusy(false))
  }

  /** 完成 / 恢复（列表与看板共用）。 */
  const toggleDone = (item: TodoItem): void => {
    if (busy) return
    setBusy(true)
    const done = !DONE_STATUSES.has(item.status)
    void api<{ ok: boolean }>('/api/todo', {
      method: 'POST',
      body: JSON.stringify({
        sessionId,
        action: done ? 'done' : 'update',
        id: item.id,
        status: 'pending',
      }),
    }).then((res: { message?: string }) => {
      notifyChanged()
      // 周期任务完成会推进到下一期，服务端返回提示；普通任务显示完成/恢复
      flash(res?.message?.includes('周期') ? res.message : (done ? t('todo.done') : t('todo.undone')))
    }).catch((error: Error) => {
      setNotice({ kind: 'error', text: error.message })
    }).finally(() => setBusy(false))
  }

  /** 删除（确认后；列表与看板共用）。 */
  const removeTodo = (item: TodoItem): void => {
    if (busy) return
    const snippet = item.text.split('\n')[0].slice(0, 40)
    if (!window.confirm(t('todo.deleteConfirm', { snippet }))) return
    setBusy(true)
    void api<{ ok: boolean }>('/api/todo', {
      method: 'POST',
      body: JSON.stringify({ sessionId, action: 'remove', id: item.id }),
    }).then(() => {
      notifyChanged()
      flash(t('todo.deleted'))
    }).catch((error: Error) => {
      setNotice({ kind: 'error', text: error.message })
    }).finally(() => setBusy(false))
  }

  /** 今天（本地时区），用于逾期标红。不能 toISOString——那是 UTC 日期，
   *  东八区晚上本地已过零点时 UTC 仍是前一天，「今天」的截止会被误标成
   *  逾期（稳定版复审 P0-9）。 */
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  /** 项目筛选后的待办集（projectFilter='' = 全部；否则直接匹配任务的 proj 值）。 */
  const scopeItems = (items ?? []).filter((item) => projectFilter === '' || item.proj === projectFilter)
  /** 项目选项完全来自任务数据中的非空 proj 值。 */
  const projOptions = Array.from(new Set(
    (items ?? [])
      .map((item) => item.proj?.trim() ?? '')
      .filter((project): project is string => project !== ''),
  )).sort((a, b) => a.localeCompare(b))
  const projOptionKey = projOptions.join('\u0000')

  // 数据加载完成后再清理已不存在的筛选，避免 load() 的 null 过渡误清选择。
  useEffect(() => {
    if (items !== null && projectFilter !== '' && !projOptions.includes(projectFilter)) setProjectFilter('')
  }, [items, projectFilter, projOptionKey])

  /** 时间视图中的单日投影：完成任务落在完成日，逾期未完成任务落在今天。 */
  const timeDisplayDay = (item: TodoItem): string | null => {
    if (item.status === 'done' && item.doneAt !== null) return item.doneAt.slice(0, 10)
    if (item.due !== null && item.due < today && !DONE_STATUSES.has(item.status)) return today
    return null
  }

  /** 时间视图独立于状态筛选，始终包含完成事项；仍响应项目与象限筛选。 */
  const timeVisible = scopeItems.filter((item) => {
    if (quadFilter === 'none' && item.quadrant !== null) return false
    if (quadFilter !== 'all' && quadFilter !== 'none' && item.quadrant !== quadFilter) return false
    return true
  })

  /** 按日期分桶：完成任务投影到完成日，逾期未完成任务投影到今天。 */
  const dayBuckets = (list: TodoItem[], minDay?: string, maxDay?: string): Map<string, TodoItem[]> => {
    const buckets = new Map<string, TodoItem[]>()
    const inRange = (day: string): boolean => (minDay === undefined || day >= minDay) && (maxDay === undefined || day <= maxDay)
    const put = (day: string, item: TodoItem): void => {
      if (!inRange(day)) return
      const arr = buckets.get(day) ?? []
      if (!arr.includes(item)) {
        arr.push(item)
        buckets.set(day, arr)
      }
    }
    for (const item of list) {
      const displayDay = timeDisplayDay(item)
      if (displayDay !== null) {
        put(displayDay, item)
        continue
      }
      if (item.repeat !== null) continue
      if (item.start !== null && item.due !== null) {
        const range = orderedRange(item.start, item.due)
        let day = minDay !== undefined && range.start < minDay ? minDay : range.start
        const end = maxDay !== undefined && range.end > maxDay ? maxDay : range.end
        while (day <= end) {
          put(day, item)
          day = shiftDays(day, 1)
        }
      } else if (item.due !== null) {
        put(item.due, item)
      } else if (item.start !== null) {
        put(item.start, item)
      }
    }
    return buckets
  }

  /** 前端筛选：状态（active=未完成全部状态）+ 象限 + 项目（scopeItems 已按项目过滤）。 */
  const visible = scopeItems.filter((item) => {
    if (statusFilter === 'active' && DONE_STATUSES.has(item.status)) return false
    if (statusFilter === 'done' && !DONE_STATUSES.has(item.status)) return false
    if (quadFilter === 'none' && item.quadrant !== null) return false
    if (quadFilter !== 'all' && quadFilter !== 'none' && item.quadrant !== quadFilter) return false
    return true
  })

  /** 周期文案（含定点：每周·周二 / 每月·15号）。 */
  const repeatText = (item: TodoItem): string => {
    if (item.repeat === 'weekly') return item.on !== null ? `${t('todo.repeat.weekly')}·${t(`todo.weekday.${item.on}`)}` : t('todo.repeat.weekly')
    if (item.repeat === 'monthly') return item.on !== null ? `${t('todo.repeat.monthly')}·${item.on}号` : t('todo.repeat.monthly')
    if (item.repeat === 'daily') return t('todo.repeat.daily')
    return item.repeat ?? ''
  }

  /** 渲染单条卡片的元信息徽标区（日期区间只出现一次，避免重复截止信息）。 */
  const renderMetaBadges = (item: TodoItem, opts?: { showQuad?: boolean; todayCompact?: boolean }): JSX.Element => {
    const done = DONE_STATUSES.has(item.status)
    const overdue = item.due !== null && item.due < today && !done
    const isRange = item.repeat === null && item.start !== null && item.due !== null && item.start < item.due
    return (
      <>
        {opts?.showQuad === true && (
          <span className={`me-badge me-badge-quad me-badge-quad-${item.quadrant ?? 'none'}`}>
            {quadrantLabel(t, item.quadrant)}
          </span>
        )}
        {!opts?.todayCompact && isRange && (
          <span className={`me-badge me-badge-range${overdue ? ' me-badge-overdue' : ''}`}>
            {item.start} → {item.due}
          </span>
        )}
        {!opts?.todayCompact && !isRange && item.repeat === null && item.due !== null && (
          <span className={`me-badge ${overdue ? 'me-badge-overdue' : 'me-badge-due'}`}>
            {overdue ? `${t('todo.overdue')} ${item.due}` : `${t('todo.due')} ${item.due}`}
          </span>
        )}
        {!opts?.todayCompact && item.repeat === null && item.start !== null && item.due === null && (
          <span className="me-badge me-badge-range">{t('todo.startShort')} {item.start}</span>
        )}
        {item.proj !== null && !opts?.todayCompact && <span className="me-badge me-badge-proj">{item.proj}</span>}
        {item.who !== null && <span className="me-badge me-badge-who">{item.who}</span>}
        {item.repeat !== null && !opts?.todayCompact && (
          <span className="me-badge me-badge-repeat">🔄 {repeatText(item)}</span>
        )}
        {!opts?.todayCompact && <span className={`me-badge me-badge-status me-badge-status-${item.status}`}>
          {statusLabel(t, item.status)}
        </span>}
      </>
    )
  }

  /** 渲染编辑/删除操作；完成/恢复统一由卡片左侧勾选框承担。 */
  const renderActions = (item: TodoItem): JSX.Element => (
    <span className="me-item-actions">
      <button type="button" className="me-btn" disabled={busy} onClick={() => openEditModal(item)}>
        {t('todo.edit')}
      </button>
      <button type="button" className="me-btn me-btn-danger" disabled={busy} onClick={() => removeTodo(item)}>
        {t('memoryTab.delete')}
      </button>
    </span>
  )

  /** 看板单张卡片。 */
  const renderCard = (item: TodoItem): JSX.Element => {
    const done = DONE_STATUSES.has(item.status)
    // 标题取首行，过长截断；完整内容在编辑或 title 悬停可见
    const titleLine = item.text.split('\n')[0] || item.text
    const color = taskColor(item)
    return (
      <article
        key={item.id}
        className={`me-todo-card${done ? ' me-todo-card--done' : ''}`}
      >
        {/* 日事清式：左侧项目色竖条 */}
        <span className="me-todo-card-bar" style={{ background: color }} />
        <div className="me-todo-card-main">
          <div className="me-todo-card-head">
            {/* 勾选圆点：点击完成/恢复（颜色由 CSS token 控制，深浅色自适应） */}
            <button
              type="button"
              className={`me-todo-check${done ? ' me-todo-check--done' : ''}`}
              disabled={busy}
              onClick={() => toggleDone(item)}
              title={done ? t('todo.undone') : t('todo.done')}
            >
              {done ? '✓' : ''}
            </button>
            <div className="me-todo-card-text">
                <p className="me-todo-card-title" title={item.text}>
                  {titleLine}
                </p>
                {item.text.includes('\n') && (
                  <p className="me-todo-card-body">{item.text.slice(titleLine.length).trim()}</p>
                )}
              </div>
          </div>
          <div className="me-todo-card-meta">
            {renderMetaBadges(item)}
          </div>
          <div className="me-todo-card-foot">
            <span className="me-item-time">{item.time}</span>
            {renderActions(item)}
          </div>
        </div>
      </article>
    )
  }

  /** 月历：单日、周期和长期任务统一进入日期框内的条状事件泳道。 */
  const renderCalendar = (): JSX.Element => {
    const grid = gridDays(calMonth)
    const firstDay = dateKey(grid[0])
    const lastDay = dateKey(grid[grid.length - 1])
    const buckets = dayBuckets(timeVisible, firstDay, lastDay)
    for (const item of timeVisible) {
      if (item.repeat === null || timeDisplayDay(item) !== null) continue
      for (const day of grid) {
        if (!repeatDayMatches(item, day)) continue
        const key = dateKey(day)
        const entries = buckets.get(key) ?? []
        if (!entries.includes(item)) buckets.set(key, [...entries, item])
      }
    }
    const dayItems = (day: string): TodoItem[] => (
      [...(buckets.get(day) ?? [])].sort(compareCalendarItems)
    )
    const calendarSpanItems = rangeDraft?.source === 'calendar'
      ? [...timeVisible, createRangeDraftItem(rangeDraft)]
      : timeVisible
    const spanRows = buildSpanSegments(calendarSpanItems, grid, timeDisplayDay)
    const weeks = Array.from({ length: 6 }, (_, index) => grid.slice(index * 7, index * 7 + 7))
    const selectedItems = selectedDay !== null ? dayItems(selectedDay) : []
    const [curY, curM] = calMonth.split('-').map(Number)

    return (
      <div className="me-cal">
        <div className="me-cal-head">
          <div className="me-cal-nav">
            <button type="button" className="me-btn me-icon-btn" title={t('todo.calendar.prev')} onClick={() => {
              setCalendarAnchor(`${shiftMonth(calMonth, -1)}-01`)
              setSelectedDay(null)
            }}>‹</button>
            <button type="button" className="me-btn me-icon-btn" title={t('todo.calendar.next')} onClick={() => {
              setCalendarAnchor(`${shiftMonth(calMonth, 1)}-01`)
              setSelectedDay(null)
            }}>›</button>
            <button type="button" className="me-btn" onClick={() => {
              setCalendarAnchor(today)
              setSelectedDay(today)
            }}>{t('todo.calendar.today')}</button>
          </div>
          <span className="me-cal-title">{curY}年{curM}月</span>
        </div>
        <div className="me-calendar-scroll">
          <div className="me-calendar-surface">
            <div className="me-cal-weekdays">
              {['一', '二', '三', '四', '五', '六', '日'].map((weekday) => (
                <span key={weekday} className="me-cal-weekday">{weekday}</span>
              ))}
            </div>
            {weeks.map((week, weekIndex) => {
              const segments = spanRows[weekIndex] ?? []
              // 折叠超出可见泳道的段：整行最多 MAX_MONTH_LANES 条泳道；
              // 但某条跨列长条若从更高泳道开始，仍保留（该行高由可见段决定）。
              const visibleSegments = segments.filter((segment) => segment.lane < MAX_MONTH_LANES)
              const hiddenSegments = segments.filter((segment) => segment.lane >= MAX_MONTH_LANES)
              const laneCount = visibleSegments.reduce((max, segment) => Math.max(max, segment.lane + 1), 0)
              const rowStyle = { '--me-span-lanes': Math.max(laneCount, hiddenSegments.length > 0 ? 1 : 0) } as CSSProperties
              // 折叠入口固定指向这一行最早的折叠日期，避免按跨度覆盖数量
              // 把 17 日的隐藏任务错误指向后续日期。
              const hiddenDay = hiddenSegments.length > 0
                ? dateKey(grid[Math.min(...hiddenSegments.map((segment) => segment.startIndex))])
                : null
              return (
                <div key={dateKey(week[0])} className="me-cal-row" style={rowStyle}>
                  <div className="me-cal-days">
                    {week.map((day) => {
                      const key = dateKey(day)
                      const inMonth = monthKey(day) === calMonth
                      const overdue = dayItems(key).some((item) => !DONE_STATUSES.has(item.status) && item.due !== null && item.due < today)
                      return (
                        <div
                          key={key}
                          role="gridcell"
                          className={[
                            'me-cal-cell',
                            inMonth ? '' : 'me-cal-cell--out',
                            key === today ? 'me-cal-cell--today' : '',
                            key === selectedDay ? 'me-cal-cell--selected' : '',
                            overdue ? 'me-cal-cell--overdue' : '',
                            rangeDraft?.source === 'calendar' && key >= rangeDraft.start && key <= rangeDraft.end ? 'me-cal-cell--range-drag' : '',
                          ].filter(Boolean).join(' ')}
                          data-calendar-day={key}
                          onPointerDown={(event) => beginRangeGesture(key, 'calendar', event)}
                          onPointerMove={moveRangeGesture}
                          onPointerUp={(event) => finishRangeGesture(event)}
                          onPointerCancel={(event) => finishRangeGesture(event, true)}
                          onLostPointerCapture={(event) => cancelRangeGesture(event.pointerId)}
                        >
                          <div className="me-cal-cell-head">
                            <button
                              type="button"
                              className="me-cal-cell-select"
                              aria-label={key}
                              onClick={() => selectCalendarDay(key)}
                            >
                              <span className="me-cal-cell-date">{day.getDate()}</span>
                            </button>
                            <button
                              type="button"
                              className="me-cal-cell-add"
                              title={t('todo.add')}
                              onClick={() => openAddWithDay(key)}
                            >＋</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div
                    className="me-cal-span-layer"
                    onDragOver={(event) => overSpanContainer(event, 'calendar')}
                    onDrop={dropSpanContainer}
                  >
                    {visibleSegments.map((segment) => {
                      const segmentKey = `${segment.occurrenceKey}-${segment.startIndex}`
                      const item = segment.item
                      const range = item.start !== null && item.due !== null && item.start < item.due
                      const schedule = item.repeat !== null
                        ? repeatText(item)
                        : range
                          ? `${fmtDate(item.start)} → ${fmtDate(item.due)}`
                          : item.due !== null
                            ? `截止 ${fmtDate(item.due)}`
                            : item.start !== null ? `开始 ${fmtDate(item.start)}` : ''
                      const spanPalette = segment.item.id === RANGE_DRAFT_ID ? undefined : calendarColor(item)
                      const style = {
                        gridColumn: `${(segment.startIndex % 7) + 1} / ${(segment.endIndex % 7) + 2}`,
                        '--me-span-lane': segment.lane,
                        ...(spanPalette !== undefined ? {
                          '--me-span-fill': spanPalette.text,
                          '--me-span-bg': spanPalette.fill,
                        } : {}),
                      } as CSSProperties
                      return (
                        <button
                          key={segmentKey}
                          type="button"
                          className={[
                            'me-calendar-span',
                            segment.continuesBefore ? 'me-calendar-span--before' : '',
                            segment.continuesAfter ? 'me-calendar-span--after' : '',
                            DONE_STATUSES.has(segment.item.status) ? 'me-calendar-span--done' : '',
                            segment.item.id === RANGE_DRAFT_ID ? 'me-calendar-span--draft' : '',
                            draggingSpanId === segment.item.id ? 'me-calendar-span--dragging' : '',
                            spanDrop?.key === segmentKey ? `me-calendar-span--drop-${spanDrop.position}` : '',
                          ].filter(Boolean).join(' ')}
                          style={style}
                          data-todo-id={segment.item.id}
                          data-segment-key={segmentKey}
                          title={`${item.text}${schedule !== '' ? `\n${schedule}` : ''}`}
                          draggable={segment.item.id !== RANGE_DRAFT_ID}
                          onDragStart={(event) => startSpanDrag(event, segment.item)}
                          onDragEnd={endSpanDrag}
                          onClick={(event) => {
                            if (segment.item.id === RANGE_DRAFT_ID) return
                            const row = event.currentTarget.closest<HTMLElement>('.me-cal-row')
                            const cells = row === null
                              ? []
                              : Array.from(row.querySelectorAll<HTMLElement>('.me-cal-cell[data-calendar-day]'))
                            const clicked = cells.find((cell) => {
                              const rect = cell.getBoundingClientRect()
                              return event.clientX >= rect.left && event.clientX < rect.right
                            })
                            selectCalendarDay(clicked?.dataset.calendarDay ?? dateKey(grid[segment.startIndex]))
                          }}
                        >
                          {segment.continuesBefore ? '‹ ' : ''}{segment.item.text.split('\n')[0]}{segment.continuesAfter ? ' ›' : ''}
                          {item.due !== null && !DONE_STATUSES.has(item.status) && item.due < today && (
                            <span className="me-calendar-span-delay">延期{-diffDays(item.due, today)}天</span>
                          )}
                        </button>
                      )
                    })}
                    {hiddenSegments.length > 0 && hiddenDay !== null && (
                      <button
                        type="button"
                        className="me-calendar-more"
                        aria-label={`展开${hiddenDay}的${hiddenSegments.length}项待办`}
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          selectCalendarDay(hiddenDay)
                        }}
                      >+{hiddenSegments.length}</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="me-cal-detail">
          {selectedDay === null ? (
            <p className="me-muted">{t('todo.calendar.pick')}</p>
          ) : selectedItems.length === 0 ? (
            <p className="me-muted">{t('todo.calendar.emptyDay')}（{selectedDay}）</p>
          ) : (
            <>
              <p className="me-cal-detail-title">{t('todo.calendar.day')} {selectedDay}</p>
              <div className="me-calendar-detail-list">
                {selectedItems.map((item) => renderCard(item))}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  /** 周视图：保留高信息密度卡片；长期任务每周只在首次覆盖日出现一次。 */
  const renderWeek = (): JSX.Element => {
    const anchor = weekStart
    const [year, month, day] = anchor.split('-').map(Number)
    const base = new Date(year, month - 1, day)
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(base)
      date.setDate(base.getDate() + index)
      return date
    })
    const last = days[6]
    const lastKey = dateKey(last)
    const detailBuckets = dayBuckets(timeVisible, anchor, lastKey)
    for (const item of timeVisible) {
      if (item.repeat === null || timeDisplayDay(item) !== null) continue
      for (const date of days) {
        if (!repeatDayMatches(item, date)) continue
        const key = dateKey(date)
        const entries = detailBuckets.get(key) ?? []
        if (!entries.includes(item)) detailBuckets.set(key, [...entries, item])
      }
    }
    const sortCalendarCards = (list: TodoItem[]): TodoItem[] => [...list].sort(compareCalendarItems)
    const dayItems = (key: string): TodoItem[] => sortCalendarCards(detailBuckets.get(key) ?? [])

    const cardBuckets = new Map<string, TodoItem[]>()
    const putCard = (key: string, item: TodoItem): void => {
      if (key < anchor || key > lastKey) return
      const entries = cardBuckets.get(key) ?? []
      if (!entries.includes(item)) cardBuckets.set(key, [...entries, item])
    }
    const cardSource = rangeDraft?.source === 'week'
      ? [...timeVisible, createRangeDraftItem(rangeDraft)]
      : timeVisible
    for (const item of cardSource) {
      const displayDay = timeDisplayDay(item)
      if (displayDay !== null) {
        putCard(displayDay, item)
        continue
      }
      if (item.repeat !== null) {
        days.forEach((date) => {
          if (repeatDayMatches(item, date)) putCard(dateKey(date), item)
        })
        continue
      }
      const actualStart = item.start ?? item.due
      const actualEnd = item.due ?? item.start
      if (actualStart === null || actualEnd === null) continue
      const range = orderedRange(actualStart, actualEnd)
      if (range.end < anchor || range.start > lastKey) continue
      if (!DONE_STATUSES.has(item.status) && range.start < range.end) {
        let displayDay = range.start < anchor ? anchor : range.start
        const displayEnd = range.end > lastKey ? lastKey : range.end
        while (displayDay <= displayEnd) {
          putCard(displayDay, item)
          displayDay = shiftDays(displayDay, 1)
        }
      } else {
        putCard(range.start < anchor ? anchor : range.start, item)
      }
    }
    const weekCards = (key: string): TodoItem[] => sortCalendarCards(cardBuckets.get(key) ?? [])
    const selectedItems = selectedDay !== null ? dayItems(selectedDay) : []
    const weekLabel = `${month}月${day}日 - ${last.getMonth() + 1}月${last.getDate()}日`

    return (
      <div className="me-week">
        <div className="me-cal-head">
          <div className="me-cal-nav">
            <button type="button" className="me-btn me-icon-btn" title={t('todo.week.prev')} onClick={() => {
              setCalendarAnchor(shiftDays(anchor, -7))
              setSelectedDay(null)
            }}>‹</button>
            <button type="button" className="me-btn me-icon-btn" title={t('todo.week.next')} onClick={() => {
              setCalendarAnchor(shiftDays(anchor, 7))
              setSelectedDay(null)
            }}>›</button>
            <button type="button" className="me-btn" onClick={() => {
              setCalendarAnchor(today)
              setSelectedDay(today)
            }}>{t('todo.week.today')}</button>
          </div>
          <span className="me-cal-title">{weekLabel}</span>
        </div>
        <div className="me-calendar-scroll">
          <div className="me-week-surface">
            <div className="me-week-headers">
              {days.map((date, index) => {
                const key = dateKey(date)
                return (
                  <button
                    key={key}
                    type="button"
                    className={`me-week-date-head${key === today ? ' me-week-date-head--today' : ''}${key === selectedDay ? ' me-week-date-head--selected' : ''}${rangeDraft?.source === 'week' && key >= rangeDraft.start && key <= rangeDraft.end ? ' me-cal-cell--range-drag' : ''}`}
                    data-calendar-day={key}
                    onPointerDown={(event) => beginRangeGesture(key, 'week', event)}
                    onPointerMove={moveRangeGesture}
                    onPointerUp={(event) => finishRangeGesture(event)}
                    onPointerCancel={(event) => finishRangeGesture(event, true)}
                    onLostPointerCapture={(event) => cancelRangeGesture(event.pointerId)}
                    onClick={() => selectCalendarDay(key)}
                  >
                    <span>{['一', '二', '三', '四', '五', '六', '日'][index]}</span>
                    <strong>{date.getDate()}</strong>
                  </button>
                )
              })}
            </div>
            <div
              className="me-week-columns"
              onDragOver={(event) => overSpanContainer(event, 'week')}
              onDrop={dropSpanContainer}
            >
              {days.map((date) => {
                const key = dateKey(date)
                const cards = weekCards(key)
                return (
                  <section
                    key={key}
                    className={`me-week-column${key === today ? ' me-week-column--today' : ''}${rangeDraft?.source === 'week' && key >= rangeDraft.start && key <= rangeDraft.end ? ' me-cal-cell--range-drag' : ''}`}
                    data-calendar-day={key}
                    onPointerDown={(event) => beginRangeGesture(key, 'week', event)}
                    onPointerMove={moveRangeGesture}
                    onPointerUp={(event) => finishRangeGesture(event)}
                    onPointerCancel={(event) => finishRangeGesture(event, true)}
                    onLostPointerCapture={(event) => cancelRangeGesture(event.pointerId)}
                  >
                    <button type="button" className="me-week-column-add" title={t('todo.add')} onClick={() => openAddWithDay(key)}>＋</button>
                    {cards.length === 0 ? (
                      <span className="me-week-empty"> </span>
                    ) : cards.map((item) => {
                      const cardKey = `week-${key}-${item.id}`
                      const isRange = item.repeat === null && item.start !== null && item.due !== null && item.start < item.due
                      const schedule = item.id === RANGE_DRAFT_ID && rangeDraft !== null
                        ? `${fmtDate(rangeDraft.start)} → ${fmtDate(rangeDraft.end)}`
                        : isRange
                          ? `${fmtDate(item.start)} → ${fmtDate(item.due)}`
                          : item.repeat !== null
                            ? repeatText(item)
                            : item.due !== null
                              ? `截止 ${fmtDate(item.due)}`
                              : item.start !== null ? `开始 ${fmtDate(item.start)}` : ''
                      return (
                        <button
                          key={cardKey}
                          type="button"
                          className={[
                            'me-week-event',
                            isRange ? 'me-week-event--range' : '',
                            DONE_STATUSES.has(item.status) ? 'me-week-event--done' : '',
                            item.id === RANGE_DRAFT_ID ? 'me-week-event--draft' : '',
                            draggingSpanId === item.id ? 'me-week-event--dragging' : '',
                            spanDrop?.key === cardKey ? `me-calendar-span--drop-${spanDrop.position}` : '',
                          ].filter(Boolean).join(' ')}
                          style={{ '--me-week-accent': taskColor(item) } as CSSProperties}
                          data-todo-id={item.id}
                          data-segment-key={cardKey}
                          title={item.text}
                          draggable={item.id !== RANGE_DRAFT_ID}
                          onDragStart={(event) => startSpanDrag(event, item)}
                          onDragEnd={endSpanDrag}
                          onClick={() => {
                            if (item.id !== RANGE_DRAFT_ID) selectCalendarDay(key)
                          }}
                        >
                          <span className="me-cal-event-dot" />
                          <span className="me-week-event-title">{item.text.split('\n')[0]}</span>
                          {(item.proj !== null || item.who !== null) && (
                            <span className="me-week-event-meta">
                              {item.proj !== null && <span>{item.proj}</span>}
                              {item.who !== null && <span>{item.who}</span>}
                            </span>
                          )}
                          {schedule !== '' && <span className="me-week-event-schedule">{schedule}</span>}
                          {item.due !== null && !DONE_STATUSES.has(item.status) && item.due < today && (
                            <span className="me-week-cell-delay">延期{-diffDays(item.due, today)}天</span>
                          )}
                        </button>
                      )
                    })}
                  </section>
                )
              })}
            </div>
          </div>
        </div>
        <div className="me-cal-detail">
          {selectedDay === null ? (
            <p className="me-muted">{t('todo.calendar.pick')}</p>
          ) : selectedItems.length === 0 ? (
            <p className="me-muted">{t('todo.calendar.emptyDay')}（{selectedDay}）</p>
          ) : (
            <>
              <p className="me-cal-detail-title">{t('todo.calendar.day')} {selectedDay}</p>
              <div className="me-calendar-detail-list">{selectedItems.map((item) => renderCard(item))}</div>
            </>
          )}
        </div>
      </div>
    )
  }

  /** 项目视图：固定宽度的横向项目列，每列可直接创建所属项目任务。 */
  const renderProject = (): JSX.Element => {
    // 项目看板始终包含已完成事项；只沿用项目和象限筛选，不受状态筛选影响。
    const list = scopeItems.filter((item) => {
      if (quadFilter === 'none' && item.quadrant !== null) return false
      if (quadFilter !== 'all' && quadFilter !== 'none' && item.quadrant !== quadFilter) return false
      return true
    })
    const groups = new Map<string, TodoItem[]>()
    for (const item of list) {
      const key = item.proj ?? ''
      const entries = groups.get(key) ?? []
      entries.push(item)
      groups.set(key, entries)
    }
    const sortKey = (item: TodoItem): string => {
      if (DONE_STATUSES.has(item.status)) return '9'
      if (item.due !== null && item.due < today) return '0'
      return item.due ?? '9999-99-99'
    }
    for (const entries of groups.values()) {
      entries.sort((a, b) => {
        const byDate = sortKey(a).localeCompare(sortKey(b))
        return byDate !== 0 ? byDate : String(a.time).localeCompare(String(b.time))
      })
    }

    const sourceKeys = Array.from(new Set((items ?? []).map((item) => item.proj ?? '')))
    const availableKeys = Array.from(new Set(sourceKeys.filter((key) => key !== '')))
    const orderedKeys = [
      ...projectOrder.filter((key) => availableKeys.includes(key)),
      ...availableKeys.filter((key) => !projectOrder.includes(key)).sort((a, b) => {
        if (a === '') return 1
        if (b === '') return -1
        return a.localeCompare(b)
      }),
    ]
    const keys = projectFilter !== '' ? [projectFilter] : orderedKeys

    const moveProject = (targetKey: string, position: 'before' | 'after'): void => {
      if (draggingProject === null || draggingProject === targetKey) return
      const next = keys.filter((key) => key !== draggingProject)
      const targetIndex = next.indexOf(targetKey)
      next.splice(targetIndex + (position === 'after' ? 1 : 0), 0, draggingProject)
      setProjectOrder(next)
      window.localStorage.setItem(PROJECT_ORDER_KEY, JSON.stringify(next))
    }

    return (
      <div className="me-proj">
        <div className="me-proj-board" role="region" aria-label={t('todo.view.project')} tabIndex={0}>
          {keys.map((key) => {
            const entries = groups.get(key) ?? []
            const doneCount = entries.filter((item) => DONE_STATUSES.has(item.status)).length
            const projectName = key === '' ? t('todo.project.none') : key
            return (
              <section
                key={key === '' ? '__none__' : key}
                className={[
                  'me-proj-group',
                  draggingProject === key ? 'me-proj-group--dragging' : '',
                  projectDrop?.key === key ? `me-proj-group--drop-${projectDrop.position}` : '',
                ].filter(Boolean).join(' ')}
                onDragOver={(event) => {
                  if (draggingProject === null || draggingProject === key) return
                  event.preventDefault()
                  const rect = event.currentTarget.getBoundingClientRect()
                  setProjectDrop({ key, position: event.clientX < rect.left + rect.width / 2 ? 'before' : 'after' })
                }}
                onDrop={(event) => {
                  event.preventDefault()
                  if (projectDrop?.key === key) moveProject(key, projectDrop.position)
                  setDraggingProject(null)
                  setProjectDrop(null)
                }}
              >
                <header
                  className="me-proj-head"
                  draggable={projectFilter === ''}
                  title={projectFilter === '' ? '拖动调整项目顺序' : undefined}
                  onDragStart={(event) => {
                    setDraggingProject(key)
                    event.dataTransfer.effectAllowed = 'move'
                    event.dataTransfer.setData('text/plain', key)
                  }}
                  onDragEnd={() => {
                    setDraggingProject(null)
                    setProjectDrop(null)
                  }}
                >
                  <div className="me-proj-heading">
                    <span className="me-proj-title">{projectName}</span>
                    <span className="me-proj-count">{doneCount}/{entries.length}</span>
                  </div>
                  <button
                    type="button"
                    className="me-btn me-icon-btn me-proj-head-add"
                    title={`${t('todo.add')} · ${projectName}`}
                    aria-label={`${t('todo.add')} · ${projectName}`}
                    draggable={false}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation()
                      openAddForProject(key)
                    }}
                  >＋</button>
                </header>
                <div className="me-proj-body">
                  {entries.map((item) => renderCard(item))}
                </div>
                <button
                  type="button"
                  className="me-proj-add"
                  onClick={() => openAddForProject(key)}
                >＋ {t('todo.add')}</button>
              </section>
            )
          })}
        </div>
      </div>
    )
  }

  /** 列表主体（原逻辑）。 */
  const renderList = (): JSX.Element => {
    if (visible.length === 0) {
      return (
        <p className="me-empty">{t('todo.empty')}</p>
      )
    }
    const ordered = [...visible].sort((a, b) => {
      const byDone = Number(DONE_STATUSES.has(a.status)) - Number(DONE_STATUSES.has(b.status))
      if (byDone !== 0) return byDone
      return compareCalendarItems(a, b)
    })
    return (
      <ul className="me-list">
        {ordered.map((item) => {
          const done = DONE_STATUSES.has(item.status)
          const overdue = item.due !== null && item.due < today && !done
          return (
            <li key={item.id} className={`me-item me-todo-item me-todo-item--list${done ? ' me-todo-item--done' : ''}`}>
              <span
                className="me-todo-item-color"
                style={{ '--me-task-color': taskColor(item) } as CSSProperties}
                aria-hidden="true"
              />
              <div className="me-todo-item-content">
                <div className="me-todo-item-title-row">
                  <button
                    type="button"
                    className={`me-todo-check${done ? ' me-todo-check--done' : ''}`}
                    disabled={busy}
                    onClick={() => toggleDone(item)}
                    title={done ? t('todo.undone') : t('todo.done')}
                  >
                    {done ? '✓' : ''}
                  </button>
                  <p className="me-todo-text">
                    {item.text.split('\n')[0] || item.text}
                    {item.due !== null && !done && (
                      <span className={`me-todo-days${overdue ? ' me-todo-days--overdue' : ''}`}>
                        {overdue ? `延期${-diffDays(item.due, today)}天` : `剩余${diffDays(item.due, today)}天`}
                      </span>
                    )}
                  </p>
                </div>
                <div className="me-item-meta">
                  {renderMetaBadges(item, { showQuad: true })}
                  <span className="me-item-time">{item.time}</span>
                  {renderActions(item)}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  /** 今日视图：今天要处理的任务（逾期 + 今天到期 + 今天周期 + 长期任务进行中）。 */
  const renderToday = (): JSX.Element => {
    const nowDate = new Date()
    const todayList = timeVisible.filter((item) => {
      if (item.status === 'done') return item.doneAt?.slice(0, 10) === today
      if (item.status === 'cancelled') return false
      if (item.repeat !== null) return repeatDayMatches(item, nowDate)
      if (item.due !== null && item.due < today) return true
      if (item.due === today) return true
      if (item.start !== null && item.due !== null) return item.start <= today && today <= item.due
      if (item.start === today) return true
      return false
    })
    const rank = (item: TodoItem): number => {
      if (item.status === 'done') return 4
      if (item.due !== null && item.due < today) return 0
      if (item.due === today) return 1
      if (item.repeat !== null) return 2
      return 3
    }
    todayList.sort((a, b) => {
      const r = rank(a) - rank(b)
      if (r !== 0) return r
      const byOrder = compareCalendarItems(a, b)
      if (byOrder !== 0) return byOrder
      return String(a.due ?? '').localeCompare(String(b.due ?? ''))
    })
    const overdueCount = todayList.filter((item) => item.status !== 'done' && item.due !== null && item.due < today).length

    return (
      <div className={`me-today${isTodayOnly ? ' me-today--sidebar' : ' me-today--full'}`}>
        <div className="me-today-head">
          <span className="me-today-title">{t('todo.view.today')}</span>
          <span className="me-today-date">{today}</span>
          {overdueCount > 0 && <span className="me-today-overdue">{t('todo.overdue')} {overdueCount}</span>}
          {isTodayOnly && (
            <button type="button" className="me-btn me-btn-primary me-add-btn" onClick={() => openAddWithDay(today)}>
              {t('todo.addNew')}
            </button>
          )}
        </div>
        {todayList.length === 0 ? (
          <p className="me-empty">{t('todo.today.empty')}</p>
        ) : (
          <div className="me-today-list">
            {todayList.map((item) => {
              const done = DONE_STATUSES.has(item.status)
              return (
                <article
                  key={item.id}
                  className={`me-week-event me-week-event--today${done ? ' me-week-event--done' : ''}`}
                  style={{ '--me-week-accent': taskColor(item) } as CSSProperties}
                >
                  <>
                      <button
                        type="button"
                        className={`me-todo-check${done ? ' me-todo-check--done' : ''}`}
                        disabled={busy}
                        onClick={() => toggleDone(item)}
                        title={done ? t('todo.undone') : t('todo.done')}
                      >
                        {done ? '✓' : ''}
                      </button>
                      <span className="me-week-event-title">
                        {item.text.split('\n')[0]}
                        {item.due !== null && !done && (
                          <span className={`me-todo-days${item.due < today ? ' me-todo-days--overdue' : ''}`}>
                            {item.due < today ? `延期${-diffDays(item.due, today)}天` : `剩余${diffDays(item.due, today)}天`}
                          </span>
                        )}
                      </span>
                      <span className="me-week-event-meta">
                        {renderMetaBadges(item, { todayCompact: true })}
                        <span className="me-badge me-badge-due">时间 {item.due ?? item.start ?? '未设置'}</span>
                      </span>
                      <div className="me-week-event-foot">
                        {!isTodayOnly && (
                          <span className="me-week-event-actions">
                            <button type="button" className="me-btn" disabled={busy} onClick={() => openEditModal(item)}>
                              {t('todo.edit')}
                            </button>
                            <button type="button" className="me-btn me-btn-danger" disabled={busy} onClick={() => removeTodo(item)}>
                              {t('memoryTab.delete')}
                            </button>
                          </span>
                        )}
                      </div>
                    </>
                </article>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="me-panel">
      {notice !== null && (
        <div className={`me-notice me-notice-${notice.kind}`}>{notice.text}</div>
      )}
      {!isTodayOnly && (
      <>
      {/* 顶栏：所有 + 数据驱动的项目切换 + 添加按钮 */}
      <div className="me-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={projectFilter === ''}
          className={projectFilter === '' ? 'me-tab me-tab-active' : 'me-tab'}
          onClick={() => setProjectFilter('')}
        >
          {t('todo.track.all')}
        </button>
        <label className="me-tab-proj" title={t('todo.project.switch')}>
          <select
            value={projectFilter}
            onChange={(event) => {
              const value = event.target.value
              setProjectFilter(value)
              if (value !== '') setViewMode('project')
            }}
          >
            <option value="">{t('todo.project.all')}</option>
            {projOptions.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <span className="me-tabs-spacer" />
        <button
          type="button"
          className="me-btn me-btn-primary me-add-btn"
          onClick={() => openAddModal()}
        >
          {t('todo.addNew')}
        </button>
      </div>
      {/* 筛选 + 列表/今日/日历/周/项目视图切换 */}
      <div className="me-todo-filters">
        <label className="me-todo-filter">
          <span>{t('todo.filterStatus')}</span>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | 'active' | 'done')}>
            <option value="active">{t('todo.status.active')}</option>
            <option value="all">{t('todo.all')}</option>
            <option value="done">{t('todo.status.done')}</option>
          </select>
        </label>
        <label className="me-todo-filter">
          <span>{t('todo.filterQuadrant')}</span>
          <select value={quadFilter} onChange={(event) => setQuadFilter(event.target.value)}>
            <option value="all">{t('todo.all')}</option>
            <option value="q1">{t('todo.quadrant.q1')}</option>
            <option value="q2">{t('todo.quadrant.q2')}</option>
            <option value="q3">{t('todo.quadrant.q3')}</option>
            <option value="q4">{t('todo.quadrant.q4')}</option>
            <option value="none">{t('todo.quadrant.none')}</option>
          </select>
        </label>
        {/* 分段控件：列表 / 看板 */}
        <div className="me-todo-view-switch" role="group" aria-label={t('todo.view.mode')}>
          <button
            type="button"
            className={viewMode === 'list' ? 'me-todo-view-btn me-todo-view-btn-active' : 'me-todo-view-btn'}
            aria-pressed={viewMode === 'list'}
            onClick={() => setViewMode('list')}
          >
            {t('todo.view.list')}
          </button>
          <button
            type="button"
            className={viewMode === 'today' ? 'me-todo-view-btn me-todo-view-btn-active' : 'me-todo-view-btn'}
            aria-pressed={viewMode === 'today'}
            onClick={() => setViewMode('today')}
          >
            {t('todo.view.today')}
          </button>
          <button
            type="button"
            className={viewMode === 'calendar' ? 'me-todo-view-btn me-todo-view-btn-active' : 'me-todo-view-btn'}
            aria-pressed={viewMode === 'calendar'}
            onClick={() => setViewMode('calendar')}
          >
            {t('todo.view.calendar')}
          </button>
          <button
            type="button"
            className={viewMode === 'week' ? 'me-todo-view-btn me-todo-view-btn-active' : 'me-todo-view-btn'}
            aria-pressed={viewMode === 'week'}
            onClick={() => setViewMode('week')}
          >
            {t('todo.view.week')}
          </button>
          <button
            type="button"
            className={viewMode === 'project' ? 'me-todo-view-btn me-todo-view-btn-active' : 'me-todo-view-btn'}
            aria-pressed={viewMode === 'project'}
            onClick={() => setViewMode('project')}
          >
            {t('todo.view.project')}
          </button>
        </div>
      </div>
      </>
      )}
      {/* 内容区：加载中 / 列表 / 今日 / 日历 / 周 / 项目 */}
      {items === null ? (
        <p className="me-muted">{t('panel.loading')}</p>
      ) : isTodayOnly ? (
        renderToday()
      ) : viewMode === 'today' ? (
        renderToday()
      ) : viewMode === 'calendar' ? (
        renderCalendar()
      ) : viewMode === 'week' ? (
        renderWeek()
      ) : viewMode === 'project' ? (
        renderProject()
      ) : (
        renderList()
      )}
      {/* 添加待办弹窗 */}
      {modalOpen && (
        <div className="me-modal" onClick={() => setModalOpen(false)}>
          <div
            className="me-modal-box"
            role="dialog"
            aria-label={t('todo.addModal.title')}
            onClick={(event) => event.stopPropagation()}
          >
            <h4 className="me-modal-title">{modalEditId === null ? t('todo.addModal.title') : t('todo.edit')}</h4>
            {/* 任务标题大输入 */}
            <textarea
              className="me-modal-content"
              rows={2}
              value={mContent}
              placeholder={t('todo.addPlaceholder')}
              autoFocus
              onChange={(event) => setMContent(event.target.value)}
            />
            {/* 字段行：项目 / 执行人 */}
            <div className="me-modal-field-row">
              <span className="me-modal-field-label">项目</span>
              <input
                type="text"
                className="me-modal-input"
                list="me-proj-options"
                value={mProj}
                placeholder={t('todo.projPlaceholder')}
                onChange={(event) => setMProj(event.target.value)}
              />
              <datalist id="me-proj-options">
                {projOptions.map((p) => <option key={p} value={p} />)}
              </datalist>
            </div>
            <div className="me-modal-field-row">
              <span className="me-modal-field-label">负责人</span>
              <input
                type="text"
                className="me-modal-input"
                value={mWho}
                placeholder={t('todo.whoPlaceholder')}
                onChange={(event) => setMWho(event.target.value)}
              />
            </div>
            {/* 开始 / 结束日期分别可选；两端齐全时构成闭区间。 */}
            {mRepeat === '' && (
              <div className="me-modal-field-row me-modal-date-field">
                <span className="me-modal-field-label">时间</span>
                <div className="me-modal-date-range">
                  <button
                    type="button"
                    className={`me-modal-time${mDateTarget === 'start' ? ' me-modal-time--active' : ''}`}
                    onClick={() => {
                      setMDateCal((mStart || mDue || today).slice(0, 7))
                      setMDateTarget('start')
                    }}
                  >
                    <span>{t('todo.startShort')}</span>
                    <strong>{fmtDate(mStart) ?? '未设置'}</strong>
                  </button>
                  <span className="me-modal-date-arrow">→</span>
                  <button
                    type="button"
                    className={`me-modal-time${mDateTarget === 'due' ? ' me-modal-time--active' : ''}`}
                    onClick={() => {
                      setMDateCal((mDue || mStart || today).slice(0, 7))
                      setMDateTarget('due')
                    }}
                  >
                    <span>{t('todo.dueShort')}</span>
                    <strong>{fmtDate(mDue) ?? '未设置'}</strong>
                  </button>
                </div>
              </div>
            )}
            {/* 时间选择器：月历面板 */}
            {mDateTarget !== null && mRepeat === '' && (
              <div className="me-modal-dates">
                <div className="me-modal-dates-head">
                  <button type="button" className="me-btn" onClick={() => setMDateCal((k) => shiftMonth(k, -1))}>‹</button>
                  <span className="me-modal-dates-title">{mDateCal.split('-')[0]}年{Number(mDateCal.split('-')[1])}月</span>
                  <button type="button" className="me-btn" onClick={() => setMDateCal((k) => shiftMonth(k, 1))}>›</button>
                </div>
                <div className="me-modal-dates-grid">
                  {['一', '二', '三', '四', '五', '六', '日'].map((w) => (
                    <span key={w} className="me-modal-dates-week">{w}</span>
                  ))}
                  {gridDays(mDateCal).map((d) => {
                    const key = dateKey(d)
                    const selected = key === mStart || key === mDue
                    const inRange = mStart !== '' && mDue !== '' && key > mStart && key < mDue
                    return (
                      <button
                        key={key}
                        type="button"
                        className={[
                          'me-modal-dates-day',
                          selected ? 'me-modal-dates-day--sel' : '',
                          inRange ? 'me-modal-dates-day--range' : '',
                          monthKey(d) !== mDateCal ? 'me-modal-dates-day--out' : '',
                          key === today ? 'me-modal-dates-day--today' : '',
                        ].filter(Boolean).join(' ')}
                        onClick={() => {
                          if (mDateTarget === 'start') {
                            setMStart(key)
                            if (mDue !== '' && key > mDue) setMDue(key)
                          } else {
                            setMDue(key)
                            if (mStart !== '' && key < mStart) setMStart(key)
                          }
                          setMDateTarget(null)
                        }}
                      >
                        {d.getDate()}
                      </button>
                    )
                  })}
                </div>
                <div className="me-modal-dates-foot">
                  <button
                    type="button"
                    className="me-btn"
                    onClick={() => {
                      if (mDateTarget === 'start') setMStart('')
                      else setMDue('')
                    }}
                  >清除日期</button>
                  <button
                    type="button"
                    className="me-btn"
                    onClick={() => {
                      if (mDateTarget === 'start') setMStart(today)
                      else setMDue(today)
                      setMDateTarget(null)
                    }}
                  >选择今天</button>
                </div>
              </div>
            )}
            {/* 周期 */}
            <div className="me-modal-field-row">
              <span className="me-modal-field-label">{t('todo.repeat')}</span>
              <select
                value={mRepeat}
                onChange={(event) => {
                  setMRepeat(event.target.value)
                  setMOn('')
                  // 周期任务不留固定日期
                  setMStart('')
                  setMDue('')
                }}
              >
                <option value="">{t('todo.repeat.none')}</option>
                <option value="daily">{t('todo.repeat.daily')}</option>
                <option value="weekly">{t('todo.repeat.weekly')}</option>
                <option value="monthly">{t('todo.repeat.monthly')}</option>
              </select>
              {mRepeat === 'weekly' && (
                <select
                  value={mOn}
                  onChange={(event) => setMOn(event.target.value)}
                >
                  <option value="">{t('todo.repeat.weekday')}</option>
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <option key={n} value={n}>{t(`todo.weekday.${n}`)}</option>
                  ))}
                </select>
              )}
              {mRepeat === 'monthly' && (
                <select
                  value={mOn}
                  onChange={(event) => setMOn(event.target.value)}
                >
                  <option value="">{t('todo.repeat.monthDay')}</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}号</option>
                  ))}
                </select>
              )}
            </div>
            <div className="me-modal-foot">
              <button
                type="button"
                className="me-btn"
                onClick={() => setModalOpen(false)}
              >
                {t('todo.cancel')}
              </button>
              <button
                type="button"
                className="me-btn me-btn-primary"
                disabled={busy || mContent.trim() === ''}
                onClick={submitModal}
              >
                {t('todo.add')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
