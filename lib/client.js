window.__ModuleLoader__.load({ id: "@hz-jasonlin/dsh-todolist", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  en: () => en,
  inject: () => inject,
  zh: () => zh
});
module.exports = __toCommonJS(client_exports);
var import_react6 = require("react");

// src/client/TodoTabView.tsx
var import_react4 = require("react");

// src/client/SuggestionsView.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function SuggestionsView(props) {
  const { t, onChanged } = props;
  const [entries, setEntries] = (0, import_react.useState)(null);
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [notice, setNotice] = (0, import_react.useState)(null);
  const load = (0, import_react.useCallback)(() => {
    setEntries(null);
    void fetch("/todolist/api/suggestions").then((res) => res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))).then((data) => setEntries(data.entries ?? [])).catch((error) => setNotice({ kind: "error", text: error.message }));
  }, []);
  (0, import_react.useEffect)(() => {
    load();
  }, [load]);
  const act = (id, action) => {
    if (busy) return;
    setBusy(true);
    void fetch("/todolist/api/suggestions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, id })
    }).then((res) => res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))).then((outcome) => {
      if (!outcome.ok) throw new Error(outcome.message);
      setNotice({ kind: "ok", text: action === "approve" ? t("suggestions.approved") : t("suggestions.rejected") });
      load();
      onChanged?.();
      window.dispatchEvent(new CustomEvent("todolist:badge-change"));
      if (action === "approve") window.dispatchEvent(new CustomEvent("todolist:changed"));
    }).catch((error) => setNotice({ kind: "error", text: error.message })).finally(() => setBusy(false));
  };
  const approveAll = () => {
    if (busy || entries === null || entries.length === 0) return;
    setBusy(true);
    void fetch("/todolist/api/suggestions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "approveAll" })
    }).then((res) => res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))).then((outcome) => {
      if (!outcome.ok) throw new Error(outcome.message);
      setNotice({ kind: "ok", text: outcome.message });
      load();
      onChanged?.();
      window.dispatchEvent(new CustomEvent("todolist:badge-change"));
      window.dispatchEvent(new CustomEvent("todolist:changed"));
    }).catch((error) => setNotice({ kind: "error", text: error.message })).finally(() => setBusy(false));
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "me-panel", children: [
    notice !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `me-notice me-notice-${notice.kind}`, children: notice.text }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "me-muted me-todo-help", children: t("suggestions.title") }),
    entries === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "me-muted", children: t("panel.loading") }) : entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "me-empty", children: t("suggestions.empty") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "me-proj-toolbar", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          className: "me-btn me-btn-primary",
          disabled: busy,
          onClick: approveAll,
          children: t("suggestions.approveAll")
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "me-list", children: entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "me-item me-todo-item", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "me-item-head", children: [
          entry.proj !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "me-badge me-badge-proj", children: entry.proj }),
          entry.who !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "me-badge me-badge-who", children: entry.who }),
          entry.quadrant !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `me-badge me-badge-quad me-badge-quad-${entry.quadrant}`, children: t(`todo.quadrant.${entry.quadrant}`) }),
          entry.due !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "me-badge me-badge-due", children: [
            t("todo.due"),
            " ",
            entry.due
          ] }),
          entry.repeat !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "me-badge me-badge-repeat", children: [
            "\u{1F504} ",
            entry.repeat
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "me-item-time", children: entry.createdAt })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "me-todo-text", children: entry.content }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "me-item-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              type: "button",
              className: "me-btn me-btn-primary",
              disabled: busy,
              onClick: () => act(entry.id, "approve"),
              children: t("suggestions.approve")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              type: "button",
              className: "me-btn me-btn-danger",
              disabled: busy,
              onClick: () => act(entry.id, "reject"),
              children: t("suggestions.reject")
            }
          )
        ] })
      ] }, entry.id)) })
    ] })
  ] });
}

// src/client/TodoView.tsx
var import_react2 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var DONE_STATUSES = /* @__PURE__ */ new Set(["done", "cancelled"]);
var persistedViewMode = null;
var PROJECT_ORDER_KEY = "dsh-todolist:project-order";
function loadProjectOrder() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PROJECT_ORDER_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
  } catch {
    return [];
  }
}
async function api(path, init) {
  const res = await fetch(`/todolist${path}`, {
    headers: { "content-type": "application/json" },
    ...init
  });
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  const obj = body;
  if (!res.ok) throw new Error(obj?.message ?? obj?.error ?? `HTTP ${res.status}`);
  if (obj !== null && obj.ok === false) throw new Error(obj.message ?? "\u64CD\u4F5C\u5931\u8D25");
  return body;
}
function quadrantLabel(t, quadrant) {
  if (quadrant === null) return t("todo.quadrant.none");
  return t(`todo.quadrant.${quadrant}`);
}
function statusLabel(t, status) {
  const key = `todo.status.${status}`;
  const label = t(key);
  return label === key ? status : label;
}
var PROJ_COLORS = ["#4f8df7", "#d66b78", "#e4a83a", "#62b77b", "#9a7ac5", "#5ba9a0", "#d18a57", "#6f9bcf", "#8d9aa5"];
var CALENDAR_COLORS = [
  { fill: "#B9D6FF", text: "#2878D4" },
  { fill: "#BCEFC2", text: "#2D9B4B" },
  { fill: "#FFC0C4", text: "#D64550" },
  { fill: "#FFE3A8", text: "#B87900" },
  { fill: "#AEE6E1", text: "#168E87" },
  { fill: "#D8C5FF", text: "#7650C9" },
  { fill: "#FFD0A8", text: "#C66A14" },
  { fill: "#BFD8FF", text: "#3D73C9" },
  { fill: "#A9E5D8", text: "#248D78" }
];
function taskColor(item) {
  const seed = item.id || item.text;
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = h * 31 + seed.charCodeAt(i) >>> 0;
  return PROJ_COLORS[h % PROJ_COLORS.length];
}
function calendarColor(item) {
  const seed = item.id || item.text;
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = h * 31 + seed.charCodeAt(i) >>> 0;
  return CALENDAR_COLORS[h % CALENDAR_COLORS.length] ?? CALENDAR_COLORS[0];
}
function diffDays(due, today) {
  const [y1, m1, d1] = due.split("-").map(Number);
  const [y2, m2, d2] = today.split("-").map(Number);
  return Math.round((new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime()) / 864e5);
}
function monthKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function shiftMonth(key, delta) {
  const [y, m] = key.split("-").map(Number);
  return monthKey(new Date(y, m - 1 + delta, 1));
}
function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function gridDays(key) {
  const [y, m] = key.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const start = new Date(first);
  start.setDate(1 - (first.getDay() + 6) % 7);
  const days = [];
  for (let i = 0; i < 42; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}
function shiftDays(key, delta) {
  const [y, m, d] = key.split("-").map(Number);
  return dateKey(new Date(y, m - 1, d + delta));
}
function weekStartOf(key) {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - (dt.getDay() + 6) % 7);
  return dateKey(dt);
}
function fmtDate(key) {
  if (!key) return null;
  const [, m, d] = key.split("-");
  return `${m}\u6708${d}\u65E5`;
}
function repeatDayMatches(item, d) {
  const key = dateKey(d);
  const createdDay = item.time.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(createdDay) && key < createdDay) return false;
  if (item.last === key) return false;
  if (item.repeat === "daily") return true;
  if (item.repeat === "weekly") return item.on !== null && d.getDay() === item.on % 7;
  if (item.repeat === "monthly") return item.on !== null && d.getDate() === item.on;
  return false;
}
function compareCalendarItems(a, b) {
  const orderOf = (item) => typeof item.calendarOrder === "number" && Number.isFinite(item.calendarOrder) ? item.calendarOrder : Number.MAX_SAFE_INTEGER;
  const byOrder = orderOf(a) - orderOf(b);
  if (byOrder !== 0) return byOrder;
  const byDone = Number(DONE_STATUSES.has(a.status)) - Number(DONE_STATUSES.has(b.status));
  if (byDone !== 0) return byDone;
  return String(a.time).localeCompare(String(b.time)) || a.id.localeCompare(b.id);
}
var RANGE_DRAFT_ID = "__range-draft__";
var MAX_MONTH_LANES = 5;
function orderedRange(a, b) {
  return a <= b ? { start: a, end: b } : { start: b, end: a };
}
function createRangeDraftItem(draft) {
  return {
    id: RANGE_DRAFT_ID,
    time: "",
    quadrant: null,
    due: draft.end,
    status: "pending",
    doneAt: null,
    proj: null,
    who: null,
    start: draft.start,
    repeat: null,
    on: null,
    last: null,
    calendarOrder: -1,
    text: "\u65B0\u5F85\u529E"
  };
}
function buildSpanSegments(items, days, displayDayOf) {
  if (days.length === 0) return [];
  const dayKeys = days.map(dateKey);
  const firstVisible = dayKeys[0];
  const lastVisible = dayKeys[dayKeys.length - 1];
  const weekCount = Math.ceil(days.length / 7);
  const occurrences = [];
  for (const item of items) {
    const displayDay = displayDayOf?.(item) ?? null;
    if (displayDay !== null) {
      if (displayDay < firstVisible || displayDay > lastVisible) continue;
      occurrences.push({
        item,
        occurrenceKey: `${item.id}@display-${displayDay}`,
        actualStart: displayDay,
        actualEnd: displayDay,
        visibleStart: displayDay,
        visibleEnd: displayDay
      });
      continue;
    }
    if (item.repeat !== null) {
      days.forEach((day, index) => {
        if (!repeatDayMatches(item, day)) return;
        const key = dayKeys[index];
        occurrences.push({
          item,
          occurrenceKey: `${item.id}@${key}`,
          actualStart: key,
          actualEnd: key,
          visibleStart: key,
          visibleEnd: key
        });
      });
      continue;
    }
    const actualStart = item.start ?? item.due;
    const actualEnd = item.due ?? item.start;
    if (actualStart === null || actualEnd === null) continue;
    const range = orderedRange(actualStart, actualEnd);
    const visibleStart = range.start < firstVisible ? firstVisible : range.start;
    const visibleEnd = range.end > lastVisible ? lastVisible : range.end;
    if (visibleStart > visibleEnd) continue;
    occurrences.push({
      item,
      occurrenceKey: item.id,
      actualStart: range.start,
      actualEnd: range.end,
      visibleStart,
      visibleEnd
    });
  }
  occurrences.sort((a, b) => {
    const byOrder = compareCalendarItems(a.item, b.item);
    if (byOrder !== 0) return byOrder;
    const byStart = a.visibleStart.localeCompare(b.visibleStart);
    if (byStart !== 0) return byStart;
    const byEnd = b.visibleEnd.localeCompare(a.visibleEnd);
    if (byEnd !== 0) return byEnd;
    return a.occurrenceKey.localeCompare(b.occurrenceKey);
  });
  const rows = Array.from({ length: weekCount }, () => []);
  for (const occurrence of occurrences) {
    const startIndex = dayKeys.indexOf(occurrence.visibleStart);
    const endIndex = dayKeys.indexOf(occurrence.visibleEnd);
    if (startIndex < 0 || endIndex < startIndex) continue;
    const firstWeek = Math.floor(startIndex / 7);
    const lastWeek = Math.floor(endIndex / 7);
    for (let week = firstWeek; week <= lastWeek; week += 1) {
      const segmentStart = Math.max(startIndex, week * 7);
      const segmentEnd = Math.min(endIndex, week * 7 + 6);
      rows[week].push({
        item: occurrence.item,
        occurrenceKey: occurrence.occurrenceKey,
        startIndex: segmentStart,
        endIndex: segmentEnd,
        lane: 0,
        continuesBefore: occurrence.actualStart < dayKeys[segmentStart],
        continuesAfter: occurrence.actualEnd > dayKeys[segmentEnd]
      });
    }
  }
  for (const segments of rows) {
    const rangeSegments = segments.filter((s) => s.continuesBefore || s.continuesAfter);
    const daySegments = segments.filter((s) => !(s.continuesBefore || s.continuesAfter));
    const ordered = (list) => [...list].sort((a, b) => {
      const byOrder = compareCalendarItems(a.item, b.item);
      if (byOrder !== 0) return byOrder;
      return a.startIndex - b.startIndex || b.endIndex - a.endIndex;
    });
    const rangeOrdered = ordered(rangeSegments);
    const rangeLaneEnds = [];
    for (const segment of rangeOrdered) {
      let lane = rangeLaneEnds.findIndex((end) => end < segment.startIndex);
      if (lane === -1) {
        lane = rangeLaneEnds.length;
        rangeLaneEnds.push(segment.endIndex);
      } else {
        rangeLaneEnds[lane] = segment.endIndex;
      }
      segment.lane = lane;
    }
    const rangeMaxLane = rangeLaneEnds.length - 1;
    const dayOrdered = ordered(daySegments);
    const colLaneEnds = Array.from({ length: 7 }, () => []);
    for (const segment of dayOrdered) {
      const col = segment.startIndex % 7;
      const ends = colLaneEnds[col];
      let lane = ends.findIndex((end) => end < segment.startIndex);
      if (lane === -1) {
        lane = ends.length;
        ends.push(segment.endIndex);
      } else {
        ends[lane] = segment.endIndex;
      }
      segment.lane = lane + rangeMaxLane + 1;
    }
  }
  return rows;
}
function TodoView(props) {
  const { t, sessionId, mode = "full" } = props;
  const isTodayOnly = mode === "today";
  const [items, setItems] = (0, import_react2.useState)(null);
  const [statusFilter, setStatusFilter] = (0, import_react2.useState)(() => isTodayOnly ? "active" : "all");
  const [quadFilter, setQuadFilter] = (0, import_react2.useState)("all");
  const [viewMode, setViewMode] = (0, import_react2.useState)(() => persistedViewMode !== null && persistedViewMode !== "board" ? persistedViewMode : "list");
  const [calendarAnchor, setCalendarAnchor] = (0, import_react2.useState)(() => dateKey(/* @__PURE__ */ new Date()));
  const [selectedDay, setSelectedDay] = (0, import_react2.useState)(null);
  const calMonth = calendarAnchor.slice(0, 7);
  const weekStart = weekStartOf(calendarAnchor);
  const [rangeDraft, setRangeDraft] = (0, import_react2.useState)(null);
  const rangeGestureRef = (0, import_react2.useRef)(null);
  const suppressCalendarClickRef = (0, import_react2.useRef)(false);
  const [draggingSpanId, setDraggingSpanId] = (0, import_react2.useState)(null);
  const [spanDrop, setSpanDrop] = (0, import_react2.useState)(null);
  const draggingSpanIdRef = (0, import_react2.useRef)(null);
  const [projectOrder, setProjectOrder] = (0, import_react2.useState)(loadProjectOrder);
  const [draggingProject, setDraggingProject] = (0, import_react2.useState)(null);
  const [projectDrop, setProjectDrop] = (0, import_react2.useState)(null);
  const [projectFilter, setProjectFilter] = (0, import_react2.useState)("");
  const [modalOpen, setModalOpen] = (0, import_react2.useState)(false);
  const [modalEditId, setModalEditId] = (0, import_react2.useState)(null);
  const [mContent, setMContent] = (0, import_react2.useState)("");
  const [mProj, setMProj] = (0, import_react2.useState)("");
  const [mWho, setMWho] = (0, import_react2.useState)("");
  const [mStart, setMStart] = (0, import_react2.useState)("");
  const [mDue, setMDue] = (0, import_react2.useState)("");
  const [mRepeat, setMRepeat] = (0, import_react2.useState)("");
  const [mOn, setMOn] = (0, import_react2.useState)("");
  const [mQuad, setMQuad] = (0, import_react2.useState)("");
  const [mStatus, setMStatus] = (0, import_react2.useState)("pending");
  const [mDateTarget, setMDateTarget] = (0, import_react2.useState)(null);
  const [mDateCal, setMDateCal] = (0, import_react2.useState)(() => monthKey(/* @__PURE__ */ new Date()));
  const [busy, setBusy] = (0, import_react2.useState)(false);
  const [notice, setNotice] = (0, import_react2.useState)(null);
  (0, import_react2.useEffect)(() => {
    persistedViewMode = viewMode;
  }, [viewMode]);
  const load = (0, import_react2.useCallback)(() => {
    setItems(null);
    void api("/api/todo?all=1").then((res) => {
      setItems(res.items);
    }).catch((error) => setNotice({ kind: "error", text: error.message }));
  }, []);
  (0, import_react2.useEffect)(() => {
    load();
  }, [load]);
  const notifyChanged = () => {
    window.dispatchEvent(new CustomEvent("todolist:changed"));
  };
  (0, import_react2.useEffect)(() => {
    const onChange = () => load();
    window.addEventListener("todolist:changed", onChange);
    return () => window.removeEventListener("todolist:changed", onChange);
  }, [load]);
  const flash = (text) => {
    setNotice({ kind: "ok", text });
    window.setTimeout(() => {
      setNotice((current) => current?.text === text ? null : current);
    }, 3e3);
  };
  const openAddModal = (day = "") => {
    setModalEditId(null);
    setMContent("");
    setMProj(projectFilter);
    setMWho("");
    setMStart("");
    setMDue(day);
    setMRepeat("");
    setMOn("");
    setMQuad("");
    setMStatus("pending");
    setMDateTarget(null);
    setMDateCal(day !== "" ? day.slice(0, 7) : monthKey(/* @__PURE__ */ new Date()));
    setModalOpen(true);
  };
  const openEditModal = (item) => {
    setModalEditId(item.id);
    setMContent(item.text);
    setMProj(item.proj?.trim() ?? "");
    setMWho(item.who ?? "");
    setMStart(item.start ?? "");
    setMDue(item.due ?? "");
    setMRepeat(item.repeat ?? "");
    setMOn(item.on !== null ? String(item.on) : "");
    setMQuad(item.quadrant ?? "");
    setMStatus(item.status);
    setMDateTarget(null);
    setMDateCal((item.due ?? item.start ?? today).slice(0, 7));
    setModalOpen(true);
  };
  const openAddWithDay = (day) => openAddModal(day);
  const openAddForProject = (project) => {
    openAddModal();
    setMProj(project);
  };
  const openAddWithRange = (start, end) => {
    openAddModal(end);
    setMStart(start === end ? "" : start);
    setMDue(end);
    setRangeDraft(null);
  };
  const dayAtPoint = (clientX, clientY, source) => {
    const selector = source === "calendar" ? ".me-cal-cell[data-calendar-day]" : ".me-week-date-head[data-calendar-day], .me-week-column[data-calendar-day]";
    const candidates = Array.from(document.querySelectorAll(selector));
    for (const candidate of candidates) {
      const rect = candidate.getBoundingClientRect();
      if (clientX >= rect.left && clientX < rect.right && clientY >= rect.top && clientY < rect.bottom) {
        return candidate.dataset.calendarDay ?? null;
      }
    }
    return null;
  };
  const cancelRangeGesture = (pointerId) => {
    const gesture = rangeGestureRef.current;
    if (gesture === null || pointerId !== void 0 && gesture.pointerId !== pointerId) return;
    window.clearTimeout(gesture.timer);
    rangeGestureRef.current = null;
    setRangeDraft(null);
    if (gesture.capture.hasPointerCapture(gesture.pointerId)) {
      try {
        gesture.capture.releasePointerCapture(gesture.pointerId);
      } catch {
      }
    }
  };
  const beginRangeGesture = (day, source, event) => {
    const interactive = event.target.closest(".me-cal-cell-select, .me-cal-cell-add, .me-week-column-add, .me-week-event, .me-calendar-span, .me-calendar-more");
    if (!event.isPrimary || event.button !== 0 || interactive !== null && interactive !== event.currentTarget) return;
    if (rangeGestureRef.current !== null) {
      cancelRangeGesture();
      return;
    }
    const capture = event.currentTarget;
    capture.setPointerCapture(event.pointerId);
    const gesture = {
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
        const current = rangeGestureRef.current;
        if (current === null || current.pointerId !== event.pointerId) return;
        current.active = true;
        const range = orderedRange(current.anchor, current.current);
        setRangeDraft({ ...range, source: current.source });
      }, 280)
    };
    rangeGestureRef.current = gesture;
  };
  const moveRangeGesture = (event) => {
    const gesture = rangeGestureRef.current;
    if (gesture === null || gesture.pointerId !== event.pointerId) return;
    if (!gesture.active) {
      const distance = Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY);
      const threshold = gesture.pointerType === "touch" ? 10 : 7;
      if (distance > threshold) cancelRangeGesture(event.pointerId);
      return;
    }
    event.preventDefault();
    const day = dayAtPoint(event.clientX, event.clientY, gesture.source);
    if (day === null || day === gesture.current) return;
    gesture.current = day;
    const range = orderedRange(gesture.anchor, day);
    setRangeDraft({ ...range, source: gesture.source });
  };
  const finishRangeGesture = (event, cancelled = false) => {
    const gesture = rangeGestureRef.current;
    if (gesture === null || gesture.pointerId !== event.pointerId) return;
    window.clearTimeout(gesture.timer);
    const finalDay = cancelled ? null : dayAtPoint(event.clientX, event.clientY, gesture.source);
    const active = gesture.active;
    const anchor = gesture.anchor;
    rangeGestureRef.current = null;
    if (gesture.capture.hasPointerCapture(event.pointerId)) {
      try {
        gesture.capture.releasePointerCapture(event.pointerId);
      } catch {
      }
    }
    if (!active || finalDay === null) {
      setRangeDraft(null);
      return;
    }
    const range = orderedRange(anchor, finalDay);
    suppressCalendarClickRef.current = true;
    window.setTimeout(() => {
      suppressCalendarClickRef.current = false;
    }, 0);
    openAddWithRange(range.start, range.end);
  };
  const selectCalendarDay = (day) => {
    if (suppressCalendarClickRef.current) return;
    setCalendarAnchor(day);
    setSelectedDay(day);
  };
  const spanAtPoint = (clientX, clientY, root) => {
    if (root === null) return null;
    const rootRect = root.getBoundingClientRect();
    if (clientX < rootRect.left || clientX > rootRect.right || clientY < rootRect.top || clientY > rootRect.bottom) return null;
    let scope = root;
    if (root.classList.contains("me-cal-span-layer")) {
      const rows = Array.from(root.parentElement?.querySelectorAll(".me-cal-row") ?? []);
      const hit = rows.find((row) => {
        const rect = row.getBoundingClientRect();
        return clientY >= rect.top && clientY < rect.bottom;
      });
      if (hit !== void 0) scope = hit;
    }
    const spans = Array.from(scope.querySelectorAll(".me-calendar-span, .me-week-event"));
    const covering = spans.filter((span) => {
      const rect = span.getBoundingClientRect();
      return clientX >= rect.left && clientX <= rect.right;
    });
    const pool = covering.length > 0 ? covering : spans;
    let best = null;
    let bestDist = Number.POSITIVE_INFINITY;
    for (const span of pool) {
      const rect = span.getBoundingClientRect();
      const dist = Math.abs(clientY - (rect.top + rect.height / 2));
      if (dist < bestDist) {
        bestDist = dist;
        best = span;
      }
    }
    return best;
  };
  const resolveSpanDrop = (event, root) => {
    const span = spanAtPoint(event.clientX, event.clientY, root);
    if (span === null) return null;
    const targetId = span.dataset.todoId ?? "";
    const segmentKey = span.dataset.segmentKey ?? "";
    if (targetId === "") return null;
    const rect = span.getBoundingClientRect();
    const position = event.clientY < rect.top + rect.height / 2 ? "before" : "after";
    return { targetId, segmentKey, position };
  };
  const startSpanDrag = (event, item) => {
    if (item.id === RANGE_DRAFT_ID) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", item.id);
    draggingSpanIdRef.current = item.id;
    setDraggingSpanId(item.id);
    setSpanDrop(null);
  };
  const overSpanContainer = (event, source) => {
    const sourceId = draggingSpanIdRef.current ?? draggingSpanId ?? event.dataTransfer.getData("text/plain");
    if (sourceId === "" || busy) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const hit = resolveSpanDrop(event, event.currentTarget);
    if (hit === null) {
      setSpanDrop((current) => current === null || current.id !== sourceId ? current : null);
      return;
    }
    if (hit.targetId === sourceId) return;
    setSpanDrop((current) => current !== null && current.key === hit.segmentKey && current.position === hit.position ? current : { key: hit.segmentKey, id: hit.targetId, position: hit.position });
  };
  const dropSpanContainer = (event) => {
    event.preventDefault();
    const sourceId = draggingSpanIdRef.current ?? draggingSpanId ?? event.dataTransfer.getData("text/plain");
    const hit = resolveSpanDrop(event, event.currentTarget);
    draggingSpanIdRef.current = null;
    setDraggingSpanId(null);
    setSpanDrop(null);
    if (sourceId === "" || hit === null || hit.targetId === sourceId || busy) return;
    setBusy(true);
    void api("/api/todo", {
      method: "POST",
      body: JSON.stringify({ sessionId, action: "reorder", id: sourceId, targetId: hit.targetId, position: hit.position })
    }).then(() => {
      notifyChanged();
      flash(t("todo.updated"));
    }).catch((error) => {
      setNotice({ kind: "error", text: error.message });
    }).finally(() => setBusy(false));
  };
  const endSpanDrag = () => {
    draggingSpanIdRef.current = null;
    setDraggingSpanId(null);
    setSpanDrop(null);
  };
  (0, import_react2.useEffect)(() => {
    const handleBlur = () => cancelRangeGesture();
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("blur", handleBlur);
      cancelRangeGesture();
    };
  }, []);
  (0, import_react2.useEffect)(() => {
    cancelRangeGesture();
    endSpanDrag();
  }, [viewMode]);
  const submitModal = () => {
    const content = mContent.trim();
    if (content === "" || busy) return;
    setBusy(true);
    const projInput = mProj.trim();
    const fallbackProj = projectFilter !== "" ? projectFilter : void 0;
    let dueVal = mRepeat !== "" ? void 0 : mDue === "" ? void 0 : mDue;
    let startVal = mRepeat !== "" ? void 0 : mStart === "" ? void 0 : mStart;
    if (startVal !== void 0 && dueVal !== void 0 && startVal > dueVal) {
      const swap = startVal;
      startVal = dueVal;
      dueVal = swap;
    }
    const payload = {
      sessionId,
      action: modalEditId === null ? "add" : "update",
      ...modalEditId === null ? {} : { id: modalEditId, status: mStatus },
      content,
      quadrant: modalEditId === null ? mQuad === "" ? void 0 : mQuad : mQuad,
      due: dueVal,
      start: startVal,
      proj: projInput === "" ? modalEditId === null ? fallbackProj : "" : projInput,
      who: mWho === "" ? void 0 : mWho,
      repeat: mRepeat === "" ? void 0 : mRepeat,
      on: mRepeat === "weekly" || mRepeat === "monthly" ? mOn === "" ? void 0 : mOn : void 0
    };
    void api("/api/todo", {
      method: "POST",
      body: JSON.stringify(payload)
    }).then(() => {
      setModalOpen(false);
      setModalEditId(null);
      setMContent("");
      setMProj("");
      setMWho("");
      setMStart("");
      setMDue("");
      setMRepeat("");
      setMOn("");
      setMQuad("");
      setMStatus("pending");
      notifyChanged();
      flash(t(modalEditId === null ? "todo.added" : "todo.updated"));
    }).catch((error) => {
      setNotice({ kind: "error", text: error.message });
    }).finally(() => setBusy(false));
  };
  const toggleDone = (item) => {
    if (busy) return;
    setBusy(true);
    const done = !DONE_STATUSES.has(item.status);
    void api("/api/todo", {
      method: "POST",
      body: JSON.stringify({
        sessionId,
        action: done ? "done" : "update",
        id: item.id,
        status: "pending"
      })
    }).then((res) => {
      notifyChanged();
      flash(res?.message?.includes("\u5468\u671F") ? res.message : done ? t("todo.done") : t("todo.undone"));
    }).catch((error) => {
      setNotice({ kind: "error", text: error.message });
    }).finally(() => setBusy(false));
  };
  const removeTodo = (item) => {
    if (busy) return;
    const snippet = item.text.split("\n")[0].slice(0, 40);
    if (!window.confirm(t("todo.deleteConfirm", { snippet }))) return;
    setBusy(true);
    void api("/api/todo", {
      method: "POST",
      body: JSON.stringify({ sessionId, action: "remove", id: item.id })
    }).then(() => {
      notifyChanged();
      flash(t("todo.deleted"));
    }).catch((error) => {
      setNotice({ kind: "error", text: error.message });
    }).finally(() => setBusy(false));
  };
  const now = /* @__PURE__ */ new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const scopeItems = (items ?? []).filter((item) => projectFilter === "" || item.proj === projectFilter);
  const projOptions = Array.from(new Set(
    (items ?? []).map((item) => item.proj?.trim() ?? "").filter((project) => project !== "")
  )).sort((a, b) => a.localeCompare(b));
  const projOptionKey = projOptions.join("\0");
  (0, import_react2.useEffect)(() => {
    if (items !== null && projectFilter !== "" && !projOptions.includes(projectFilter)) setProjectFilter("");
  }, [items, projectFilter, projOptionKey]);
  const timeDisplayDay = (item) => {
    if (item.status === "done" && item.doneAt !== null) return item.doneAt.slice(0, 10);
    if (item.due !== null && item.due < today && !DONE_STATUSES.has(item.status)) return today;
    return null;
  };
  const timeVisible = scopeItems.filter((item) => {
    if (quadFilter === "none" && item.quadrant !== null) return false;
    if (quadFilter !== "all" && quadFilter !== "none" && item.quadrant !== quadFilter) return false;
    return true;
  });
  const dayBuckets = (list, minDay, maxDay) => {
    const buckets = /* @__PURE__ */ new Map();
    const inRange = (day) => (minDay === void 0 || day >= minDay) && (maxDay === void 0 || day <= maxDay);
    const put = (day, item) => {
      if (!inRange(day)) return;
      const arr = buckets.get(day) ?? [];
      if (!arr.includes(item)) {
        arr.push(item);
        buckets.set(day, arr);
      }
    };
    for (const item of list) {
      const displayDay = timeDisplayDay(item);
      if (displayDay !== null) {
        put(displayDay, item);
        continue;
      }
      if (item.repeat !== null) continue;
      if (item.start !== null && item.due !== null) {
        const range = orderedRange(item.start, item.due);
        let day = minDay !== void 0 && range.start < minDay ? minDay : range.start;
        const end = maxDay !== void 0 && range.end > maxDay ? maxDay : range.end;
        while (day <= end) {
          put(day, item);
          day = shiftDays(day, 1);
        }
      } else if (item.due !== null) {
        put(item.due, item);
      } else if (item.start !== null) {
        put(item.start, item);
      }
    }
    return buckets;
  };
  const visible = scopeItems.filter((item) => {
    if (statusFilter === "active" && DONE_STATUSES.has(item.status)) return false;
    if (statusFilter === "done" && !DONE_STATUSES.has(item.status)) return false;
    if (quadFilter === "none" && item.quadrant !== null) return false;
    if (quadFilter !== "all" && quadFilter !== "none" && item.quadrant !== quadFilter) return false;
    return true;
  });
  const repeatText = (item) => {
    if (item.repeat === "weekly") return item.on !== null ? `${t("todo.repeat.weekly")}\xB7${t(`todo.weekday.${item.on}`)}` : t("todo.repeat.weekly");
    if (item.repeat === "monthly") return item.on !== null ? `${t("todo.repeat.monthly")}\xB7${item.on}\u53F7` : t("todo.repeat.monthly");
    if (item.repeat === "daily") return t("todo.repeat.daily");
    return item.repeat ?? "";
  };
  const renderMetaBadges = (item, opts) => {
    const done = DONE_STATUSES.has(item.status);
    const overdue = item.due !== null && item.due < today && !done;
    const isRange = item.repeat === null && item.start !== null && item.due !== null && item.start < item.due;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      opts?.showQuad === true && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: `me-badge me-badge-quad me-badge-quad-${item.quadrant ?? "none"}`, children: quadrantLabel(t, item.quadrant) }),
      !opts?.todayCompact && isRange && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: `me-badge me-badge-range${overdue ? " me-badge-overdue" : ""}`, children: [
        item.start,
        " \u2192 ",
        item.due
      ] }),
      !opts?.todayCompact && !isRange && item.repeat === null && item.due !== null && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: `me-badge ${overdue ? "me-badge-overdue" : "me-badge-due"}`, children: overdue ? `${t("todo.overdue")} ${item.due}` : `${t("todo.due")} ${item.due}` }),
      !opts?.todayCompact && item.repeat === null && item.start !== null && item.due === null && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "me-badge me-badge-range", children: [
        t("todo.startShort"),
        " ",
        item.start
      ] }),
      item.proj !== null && !opts?.todayCompact && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-badge me-badge-proj", children: item.proj }),
      item.who !== null && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-badge me-badge-who", children: item.who }),
      item.repeat !== null && !opts?.todayCompact && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "me-badge me-badge-repeat", children: [
        "\u{1F504} ",
        repeatText(item)
      ] }),
      !opts?.todayCompact && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: `me-badge me-badge-status me-badge-status-${item.status}`, children: statusLabel(t, item.status) })
    ] });
  };
  const renderActions = (item) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "me-item-actions", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "me-btn", disabled: busy, onClick: () => openEditModal(item), children: t("todo.edit") }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "me-btn me-btn-danger", disabled: busy, onClick: () => removeTodo(item), children: t("memoryTab.delete") })
  ] });
  const renderCard = (item) => {
    const done = DONE_STATUSES.has(item.status);
    const titleLine = item.text.split("\n")[0] || item.text;
    const color = taskColor(item);
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "article",
      {
        className: `me-todo-card${done ? " me-todo-card--done" : ""}`,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-todo-card-bar", style: { background: color } }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-todo-card-main", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-todo-card-head", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "button",
                {
                  type: "button",
                  className: `me-todo-check${done ? " me-todo-check--done" : ""}`,
                  disabled: busy,
                  onClick: () => toggleDone(item),
                  title: done ? t("todo.undone") : t("todo.done"),
                  children: done ? "\u2713" : ""
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-todo-card-text", children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "me-todo-card-title", title: item.text, children: titleLine }),
                item.text.includes("\n") && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "me-todo-card-body", children: item.text.slice(titleLine.length).trim() })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-todo-card-meta", children: renderMetaBadges(item) }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-todo-card-foot", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-item-time", children: item.time }),
              renderActions(item)
            ] })
          ] })
        ]
      },
      item.id
    );
  };
  const renderCalendar = () => {
    const grid = gridDays(calMonth);
    const firstDay = dateKey(grid[0]);
    const lastDay = dateKey(grid[grid.length - 1]);
    const buckets = dayBuckets(timeVisible, firstDay, lastDay);
    for (const item of timeVisible) {
      if (item.repeat === null || timeDisplayDay(item) !== null) continue;
      for (const day of grid) {
        if (!repeatDayMatches(item, day)) continue;
        const key = dateKey(day);
        const entries = buckets.get(key) ?? [];
        if (!entries.includes(item)) buckets.set(key, [...entries, item]);
      }
    }
    const dayItems = (day) => [...buckets.get(day) ?? []].sort(compareCalendarItems);
    const calendarSpanItems = rangeDraft?.source === "calendar" ? [...timeVisible, createRangeDraftItem(rangeDraft)] : timeVisible;
    const spanRows = buildSpanSegments(calendarSpanItems, grid, timeDisplayDay);
    const weeks = Array.from({ length: 6 }, (_, index) => grid.slice(index * 7, index * 7 + 7));
    const selectedItems = selectedDay !== null ? dayItems(selectedDay) : [];
    const [curY, curM] = calMonth.split("-").map(Number);
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-cal", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-cal-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-cal-nav", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "me-btn me-icon-btn", title: t("todo.calendar.prev"), onClick: () => {
            setCalendarAnchor(`${shiftMonth(calMonth, -1)}-01`);
            setSelectedDay(null);
          }, children: "\u2039" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "me-btn me-icon-btn", title: t("todo.calendar.next"), onClick: () => {
            setCalendarAnchor(`${shiftMonth(calMonth, 1)}-01`);
            setSelectedDay(null);
          }, children: "\u203A" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "me-btn", onClick: () => {
            setCalendarAnchor(today);
            setSelectedDay(today);
          }, children: t("todo.calendar.today") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "me-cal-title", children: [
          curY,
          "\u5E74",
          curM,
          "\u6708"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-calendar-scroll", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-calendar-surface", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-cal-weekdays", children: ["\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u65E5"].map((weekday) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-cal-weekday", children: weekday }, weekday)) }),
        weeks.map((week, weekIndex) => {
          const segments = spanRows[weekIndex] ?? [];
          const visibleSegments = segments.filter((segment) => segment.lane < MAX_MONTH_LANES);
          const hiddenSegments = segments.filter((segment) => segment.lane >= MAX_MONTH_LANES);
          const laneCount = visibleSegments.reduce((max, segment) => Math.max(max, segment.lane + 1), 0);
          const rowStyle = { "--me-span-lanes": Math.max(laneCount, hiddenSegments.length > 0 ? 1 : 0) };
          const hiddenDay = hiddenSegments.length > 0 ? dateKey(grid[Math.min(...hiddenSegments.map((segment) => segment.startIndex))]) : null;
          return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-cal-row", style: rowStyle, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-cal-days", children: week.map((day) => {
              const key = dateKey(day);
              const inMonth = monthKey(day) === calMonth;
              const overdue = dayItems(key).some((item) => !DONE_STATUSES.has(item.status) && item.due !== null && item.due < today);
              return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "div",
                {
                  role: "gridcell",
                  className: [
                    "me-cal-cell",
                    inMonth ? "" : "me-cal-cell--out",
                    key === today ? "me-cal-cell--today" : "",
                    key === selectedDay ? "me-cal-cell--selected" : "",
                    overdue ? "me-cal-cell--overdue" : "",
                    rangeDraft?.source === "calendar" && key >= rangeDraft.start && key <= rangeDraft.end ? "me-cal-cell--range-drag" : ""
                  ].filter(Boolean).join(" "),
                  "data-calendar-day": key,
                  onPointerDown: (event) => beginRangeGesture(key, "calendar", event),
                  onPointerMove: moveRangeGesture,
                  onPointerUp: (event) => finishRangeGesture(event),
                  onPointerCancel: (event) => finishRangeGesture(event, true),
                  onLostPointerCapture: (event) => cancelRangeGesture(event.pointerId),
                  children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-cal-cell-head", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                      "button",
                      {
                        type: "button",
                        className: "me-cal-cell-select",
                        "aria-label": key,
                        onClick: () => selectCalendarDay(key),
                        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-cal-cell-date", children: day.getDate() })
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                      "button",
                      {
                        type: "button",
                        className: "me-cal-cell-add",
                        title: t("todo.add"),
                        onClick: () => openAddWithDay(key),
                        children: "\uFF0B"
                      }
                    )
                  ] })
                },
                key
              );
            }) }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
              "div",
              {
                className: "me-cal-span-layer",
                onDragOver: (event) => overSpanContainer(event, "calendar"),
                onDrop: dropSpanContainer,
                children: [
                  visibleSegments.map((segment) => {
                    const segmentKey = `${segment.occurrenceKey}-${segment.startIndex}`;
                    const item = segment.item;
                    const range = item.start !== null && item.due !== null && item.start < item.due;
                    const schedule = item.repeat !== null ? repeatText(item) : range ? `${fmtDate(item.start)} \u2192 ${fmtDate(item.due)}` : item.due !== null ? `\u622A\u6B62 ${fmtDate(item.due)}` : item.start !== null ? `\u5F00\u59CB ${fmtDate(item.start)}` : "";
                    const spanPalette = segment.item.id === RANGE_DRAFT_ID ? void 0 : calendarColor(item);
                    const style = {
                      gridColumn: `${segment.startIndex % 7 + 1} / ${segment.endIndex % 7 + 2}`,
                      "--me-span-lane": segment.lane,
                      ...spanPalette !== void 0 ? {
                        "--me-span-fill": spanPalette.text,
                        "--me-span-bg": spanPalette.fill
                      } : {}
                    };
                    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                      "button",
                      {
                        type: "button",
                        className: [
                          "me-calendar-span",
                          segment.continuesBefore ? "me-calendar-span--before" : "",
                          segment.continuesAfter ? "me-calendar-span--after" : "",
                          DONE_STATUSES.has(segment.item.status) ? "me-calendar-span--done" : "",
                          segment.item.id === RANGE_DRAFT_ID ? "me-calendar-span--draft" : "",
                          draggingSpanId === segment.item.id ? "me-calendar-span--dragging" : "",
                          spanDrop?.key === segmentKey ? `me-calendar-span--drop-${spanDrop.position}` : ""
                        ].filter(Boolean).join(" "),
                        style,
                        "data-todo-id": segment.item.id,
                        "data-segment-key": segmentKey,
                        title: `${item.text}${schedule !== "" ? `
${schedule}` : ""}`,
                        draggable: segment.item.id !== RANGE_DRAFT_ID,
                        onDragStart: (event) => startSpanDrag(event, segment.item),
                        onDragEnd: endSpanDrag,
                        onClick: (event) => {
                          if (segment.item.id === RANGE_DRAFT_ID) return;
                          const row = event.currentTarget.closest(".me-cal-row");
                          const cells = row === null ? [] : Array.from(row.querySelectorAll(".me-cal-cell[data-calendar-day]"));
                          const clicked = cells.find((cell) => {
                            const rect = cell.getBoundingClientRect();
                            return event.clientX >= rect.left && event.clientX < rect.right;
                          });
                          selectCalendarDay(clicked?.dataset.calendarDay ?? dateKey(grid[segment.startIndex]));
                        },
                        children: [
                          segment.continuesBefore ? "\u2039 " : "",
                          segment.item.text.split("\n")[0],
                          segment.continuesAfter ? " \u203A" : "",
                          item.due !== null && !DONE_STATUSES.has(item.status) && item.due < today && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "me-calendar-span-delay", children: [
                            "\u5EF6\u671F",
                            -diffDays(item.due, today),
                            "\u5929"
                          ] })
                        ]
                      },
                      segmentKey
                    );
                  }),
                  hiddenSegments.length > 0 && hiddenDay !== null && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                    "button",
                    {
                      type: "button",
                      className: "me-calendar-more",
                      "aria-label": `\u5C55\u5F00${hiddenDay}\u7684${hiddenSegments.length}\u9879\u5F85\u529E`,
                      onPointerDown: (event) => event.stopPropagation(),
                      onClick: (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        selectCalendarDay(hiddenDay);
                      },
                      children: [
                        "+",
                        hiddenSegments.length
                      ]
                    }
                  )
                ]
              }
            )
          ] }, dateKey(week[0]));
        })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-cal-detail", children: selectedDay === null ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "me-muted", children: t("todo.calendar.pick") }) : selectedItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "me-muted", children: [
        t("todo.calendar.emptyDay"),
        "\uFF08",
        selectedDay,
        "\uFF09"
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "me-cal-detail-title", children: [
          t("todo.calendar.day"),
          " ",
          selectedDay
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-calendar-detail-list", children: selectedItems.map((item) => renderCard(item)) })
      ] }) })
    ] });
  };
  const renderWeek = () => {
    const anchor = weekStart;
    const [year, month, day] = anchor.split("-").map(Number);
    const base = new Date(year, month - 1, day);
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(base);
      date.setDate(base.getDate() + index);
      return date;
    });
    const last = days[6];
    const lastKey = dateKey(last);
    const detailBuckets = dayBuckets(timeVisible, anchor, lastKey);
    for (const item of timeVisible) {
      if (item.repeat === null || timeDisplayDay(item) !== null) continue;
      for (const date of days) {
        if (!repeatDayMatches(item, date)) continue;
        const key = dateKey(date);
        const entries = detailBuckets.get(key) ?? [];
        if (!entries.includes(item)) detailBuckets.set(key, [...entries, item]);
      }
    }
    const sortCalendarCards = (list) => [...list].sort(compareCalendarItems);
    const dayItems = (key) => sortCalendarCards(detailBuckets.get(key) ?? []);
    const cardBuckets = /* @__PURE__ */ new Map();
    const putCard = (key, item) => {
      if (key < anchor || key > lastKey) return;
      const entries = cardBuckets.get(key) ?? [];
      if (!entries.includes(item)) cardBuckets.set(key, [...entries, item]);
    };
    const cardSource = rangeDraft?.source === "week" ? [...timeVisible, createRangeDraftItem(rangeDraft)] : timeVisible;
    for (const item of cardSource) {
      const displayDay = timeDisplayDay(item);
      if (displayDay !== null) {
        putCard(displayDay, item);
        continue;
      }
      if (item.repeat !== null) {
        days.forEach((date) => {
          if (repeatDayMatches(item, date)) putCard(dateKey(date), item);
        });
        continue;
      }
      const actualStart = item.start ?? item.due;
      const actualEnd = item.due ?? item.start;
      if (actualStart === null || actualEnd === null) continue;
      const range = orderedRange(actualStart, actualEnd);
      if (range.end < anchor || range.start > lastKey) continue;
      if (!DONE_STATUSES.has(item.status) && range.start < range.end) {
        let displayDay2 = range.start < anchor ? anchor : range.start;
        const displayEnd = range.end > lastKey ? lastKey : range.end;
        while (displayDay2 <= displayEnd) {
          putCard(displayDay2, item);
          displayDay2 = shiftDays(displayDay2, 1);
        }
      } else {
        putCard(range.start < anchor ? anchor : range.start, item);
      }
    }
    const weekCards = (key) => sortCalendarCards(cardBuckets.get(key) ?? []);
    const selectedItems = selectedDay !== null ? dayItems(selectedDay) : [];
    const weekLabel = `${month}\u6708${day}\u65E5 - ${last.getMonth() + 1}\u6708${last.getDate()}\u65E5`;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-week", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-cal-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-cal-nav", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "me-btn me-icon-btn", title: t("todo.week.prev"), onClick: () => {
            setCalendarAnchor(shiftDays(anchor, -7));
            setSelectedDay(null);
          }, children: "\u2039" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "me-btn me-icon-btn", title: t("todo.week.next"), onClick: () => {
            setCalendarAnchor(shiftDays(anchor, 7));
            setSelectedDay(null);
          }, children: "\u203A" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "me-btn", onClick: () => {
            setCalendarAnchor(today);
            setSelectedDay(today);
          }, children: t("todo.week.today") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-cal-title", children: weekLabel })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-calendar-scroll", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-week-surface", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-week-headers", children: days.map((date, index) => {
          const key = dateKey(date);
          return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "button",
            {
              type: "button",
              className: `me-week-date-head${key === today ? " me-week-date-head--today" : ""}${key === selectedDay ? " me-week-date-head--selected" : ""}${rangeDraft?.source === "week" && key >= rangeDraft.start && key <= rangeDraft.end ? " me-cal-cell--range-drag" : ""}`,
              "data-calendar-day": key,
              onPointerDown: (event) => beginRangeGesture(key, "week", event),
              onPointerMove: moveRangeGesture,
              onPointerUp: (event) => finishRangeGesture(event),
              onPointerCancel: (event) => finishRangeGesture(event, true),
              onLostPointerCapture: (event) => cancelRangeGesture(event.pointerId),
              onClick: () => selectCalendarDay(key),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: ["\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u65E5"][index] }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: date.getDate() })
              ]
            },
            key
          );
        }) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "div",
          {
            className: "me-week-columns",
            onDragOver: (event) => overSpanContainer(event, "week"),
            onDrop: dropSpanContainer,
            children: days.map((date) => {
              const key = dateKey(date);
              const cards = weekCards(key);
              return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                "section",
                {
                  className: `me-week-column${key === today ? " me-week-column--today" : ""}${rangeDraft?.source === "week" && key >= rangeDraft.start && key <= rangeDraft.end ? " me-cal-cell--range-drag" : ""}`,
                  "data-calendar-day": key,
                  onPointerDown: (event) => beginRangeGesture(key, "week", event),
                  onPointerMove: moveRangeGesture,
                  onPointerUp: (event) => finishRangeGesture(event),
                  onPointerCancel: (event) => finishRangeGesture(event, true),
                  onLostPointerCapture: (event) => cancelRangeGesture(event.pointerId),
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "me-week-column-add", title: t("todo.add"), onClick: () => openAddWithDay(key), children: "\uFF0B" }),
                    cards.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-week-empty", children: " " }) : cards.map((item) => {
                      const cardKey = `week-${key}-${item.id}`;
                      const isRange = item.repeat === null && item.start !== null && item.due !== null && item.start < item.due;
                      const schedule = item.id === RANGE_DRAFT_ID && rangeDraft !== null ? `${fmtDate(rangeDraft.start)} \u2192 ${fmtDate(rangeDraft.end)}` : isRange ? `${fmtDate(item.start)} \u2192 ${fmtDate(item.due)}` : item.repeat !== null ? repeatText(item) : item.due !== null ? `\u622A\u6B62 ${fmtDate(item.due)}` : item.start !== null ? `\u5F00\u59CB ${fmtDate(item.start)}` : "";
                      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                        "button",
                        {
                          type: "button",
                          className: [
                            "me-week-event",
                            isRange ? "me-week-event--range" : "",
                            DONE_STATUSES.has(item.status) ? "me-week-event--done" : "",
                            item.id === RANGE_DRAFT_ID ? "me-week-event--draft" : "",
                            draggingSpanId === item.id ? "me-week-event--dragging" : "",
                            spanDrop?.key === cardKey ? `me-calendar-span--drop-${spanDrop.position}` : ""
                          ].filter(Boolean).join(" "),
                          style: { "--me-week-accent": taskColor(item) },
                          "data-todo-id": item.id,
                          "data-segment-key": cardKey,
                          title: item.text,
                          draggable: item.id !== RANGE_DRAFT_ID,
                          onDragStart: (event) => startSpanDrag(event, item),
                          onDragEnd: endSpanDrag,
                          onClick: () => {
                            if (item.id !== RANGE_DRAFT_ID) selectCalendarDay(key);
                          },
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-cal-event-dot" }),
                            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-week-event-title", children: item.text.split("\n")[0] }),
                            (item.proj !== null || item.who !== null) && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "me-week-event-meta", children: [
                              item.proj !== null && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: item.proj }),
                              item.who !== null && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: item.who })
                            ] }),
                            schedule !== "" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-week-event-schedule", children: schedule }),
                            item.due !== null && !DONE_STATUSES.has(item.status) && item.due < today && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "me-week-cell-delay", children: [
                              "\u5EF6\u671F",
                              -diffDays(item.due, today),
                              "\u5929"
                            ] })
                          ]
                        },
                        cardKey
                      );
                    })
                  ]
                },
                key
              );
            })
          }
        )
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-cal-detail", children: selectedDay === null ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "me-muted", children: t("todo.calendar.pick") }) : selectedItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "me-muted", children: [
        t("todo.calendar.emptyDay"),
        "\uFF08",
        selectedDay,
        "\uFF09"
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "me-cal-detail-title", children: [
          t("todo.calendar.day"),
          " ",
          selectedDay
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-calendar-detail-list", children: selectedItems.map((item) => renderCard(item)) })
      ] }) })
    ] });
  };
  const renderProject = () => {
    const list = scopeItems.filter((item) => {
      if (quadFilter === "none" && item.quadrant !== null) return false;
      if (quadFilter !== "all" && quadFilter !== "none" && item.quadrant !== quadFilter) return false;
      return true;
    });
    const groups = /* @__PURE__ */ new Map();
    for (const item of list) {
      const key = item.proj ?? "";
      const entries = groups.get(key) ?? [];
      entries.push(item);
      groups.set(key, entries);
    }
    const sortKey = (item) => {
      if (DONE_STATUSES.has(item.status)) return "9";
      if (item.due !== null && item.due < today) return "0";
      return item.due ?? "9999-99-99";
    };
    for (const entries of groups.values()) {
      entries.sort((a, b) => {
        const byDate = sortKey(a).localeCompare(sortKey(b));
        return byDate !== 0 ? byDate : String(a.time).localeCompare(String(b.time));
      });
    }
    const sourceKeys = Array.from(new Set((items ?? []).map((item) => item.proj ?? "")));
    const availableKeys = Array.from(new Set(sourceKeys.filter((key) => key !== "")));
    const orderedKeys = [
      ...projectOrder.filter((key) => availableKeys.includes(key)),
      ...availableKeys.filter((key) => !projectOrder.includes(key)).sort((a, b) => {
        if (a === "") return 1;
        if (b === "") return -1;
        return a.localeCompare(b);
      })
    ];
    const keys = projectFilter !== "" ? [projectFilter] : orderedKeys;
    const moveProject = (targetKey, position) => {
      if (draggingProject === null || draggingProject === targetKey) return;
      const next = keys.filter((key) => key !== draggingProject);
      const targetIndex = next.indexOf(targetKey);
      next.splice(targetIndex + (position === "after" ? 1 : 0), 0, draggingProject);
      setProjectOrder(next);
      window.localStorage.setItem(PROJECT_ORDER_KEY, JSON.stringify(next));
    };
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-proj", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-proj-board", role: "region", "aria-label": t("todo.view.project"), tabIndex: 0, children: keys.map((key) => {
      const entries = groups.get(key) ?? [];
      const doneCount = entries.filter((item) => DONE_STATUSES.has(item.status)).length;
      const projectName = key === "" ? t("todo.project.none") : key;
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "section",
        {
          className: [
            "me-proj-group",
            draggingProject === key ? "me-proj-group--dragging" : "",
            projectDrop?.key === key ? `me-proj-group--drop-${projectDrop.position}` : ""
          ].filter(Boolean).join(" "),
          onDragOver: (event) => {
            if (draggingProject === null || draggingProject === key) return;
            event.preventDefault();
            const rect = event.currentTarget.getBoundingClientRect();
            setProjectDrop({ key, position: event.clientX < rect.left + rect.width / 2 ? "before" : "after" });
          },
          onDrop: (event) => {
            event.preventDefault();
            if (projectDrop?.key === key) moveProject(key, projectDrop.position);
            setDraggingProject(null);
            setProjectDrop(null);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
              "header",
              {
                className: "me-proj-head",
                draggable: projectFilter === "",
                title: projectFilter === "" ? "\u62D6\u52A8\u8C03\u6574\u9879\u76EE\u987A\u5E8F" : void 0,
                onDragStart: (event) => {
                  setDraggingProject(key);
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", key);
                },
                onDragEnd: () => {
                  setDraggingProject(null);
                  setProjectDrop(null);
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-proj-heading", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-proj-title", children: projectName }),
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "me-proj-count", children: [
                      doneCount,
                      "/",
                      entries.length
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                    "button",
                    {
                      type: "button",
                      className: "me-btn me-icon-btn me-proj-head-add",
                      title: `${t("todo.add")} \xB7 ${projectName}`,
                      "aria-label": `${t("todo.add")} \xB7 ${projectName}`,
                      draggable: false,
                      onPointerDown: (event) => event.stopPropagation(),
                      onClick: (event) => {
                        event.stopPropagation();
                        openAddForProject(key);
                      },
                      children: "\uFF0B"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-proj-body", children: entries.map((item) => renderCard(item)) }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
              "button",
              {
                type: "button",
                className: "me-proj-add",
                onClick: () => openAddForProject(key),
                children: [
                  "\uFF0B ",
                  t("todo.add")
                ]
              }
            )
          ]
        },
        key === "" ? "__none__" : key
      );
    }) }) });
  };
  const renderList = () => {
    if (visible.length === 0) {
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "me-empty", children: t("todo.empty") });
    }
    const ordered = [...visible].sort((a, b) => {
      const byDone = Number(DONE_STATUSES.has(a.status)) - Number(DONE_STATUSES.has(b.status));
      if (byDone !== 0) return byDone;
      return compareCalendarItems(a, b);
    });
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("ul", { className: "me-list", children: ordered.map((item) => {
      const done = DONE_STATUSES.has(item.status);
      const overdue = item.due !== null && item.due < today && !done;
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("li", { className: `me-item me-todo-item me-todo-item--list${done ? " me-todo-item--done" : ""}`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "span",
          {
            className: "me-todo-item-color",
            style: { "--me-task-color": taskColor(item) },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-todo-item-content", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-todo-item-title-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "button",
              {
                type: "button",
                className: `me-todo-check${done ? " me-todo-check--done" : ""}`,
                disabled: busy,
                onClick: () => toggleDone(item),
                title: done ? t("todo.undone") : t("todo.done"),
                children: done ? "\u2713" : ""
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "me-todo-text", children: [
              item.text.split("\n")[0] || item.text,
              item.due !== null && !done && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: `me-todo-days${overdue ? " me-todo-days--overdue" : ""}`, children: overdue ? `\u5EF6\u671F${-diffDays(item.due, today)}\u5929` : `\u5269\u4F59${diffDays(item.due, today)}\u5929` })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-item-meta", children: [
            renderMetaBadges(item, { showQuad: true }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-item-time", children: item.time }),
            renderActions(item)
          ] })
        ] })
      ] }, item.id);
    }) });
  };
  const renderToday = () => {
    const nowDate = /* @__PURE__ */ new Date();
    const todayList = timeVisible.filter((item) => {
      if (item.status === "done") return item.doneAt?.slice(0, 10) === today;
      if (item.status === "cancelled") return false;
      if (item.repeat !== null) return repeatDayMatches(item, nowDate);
      if (item.due !== null && item.due < today) return true;
      if (item.due === today) return true;
      if (item.start !== null && item.due !== null) return item.start <= today && today <= item.due;
      if (item.start === today) return true;
      return false;
    });
    const rank = (item) => {
      if (item.status === "done") return 4;
      if (item.due !== null && item.due < today) return 0;
      if (item.due === today) return 1;
      if (item.repeat !== null) return 2;
      return 3;
    };
    todayList.sort((a, b) => {
      const r = rank(a) - rank(b);
      if (r !== 0) return r;
      const byOrder = compareCalendarItems(a, b);
      if (byOrder !== 0) return byOrder;
      return String(a.due ?? "").localeCompare(String(b.due ?? ""));
    });
    const overdueCount = todayList.filter((item) => item.status !== "done" && item.due !== null && item.due < today).length;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: `me-today${isTodayOnly ? " me-today--sidebar" : " me-today--full"}`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-today-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-today-title", children: t("todo.view.today") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-today-date", children: today }),
        overdueCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "me-today-overdue", children: [
          t("todo.overdue"),
          " ",
          overdueCount
        ] }),
        isTodayOnly && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "me-btn me-btn-primary me-add-btn", onClick: () => openAddWithDay(today), children: t("todo.addNew") })
      ] }),
      todayList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "me-empty", children: t("todo.today.empty") }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-today-list", children: todayList.map((item) => {
        const done = DONE_STATUSES.has(item.status);
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "article",
          {
            className: `me-week-event me-week-event--today${done ? " me-week-event--done" : ""}`,
            style: { "--me-week-accent": taskColor(item) },
            children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "button",
                {
                  type: "button",
                  className: `me-todo-check${done ? " me-todo-check--done" : ""}`,
                  disabled: busy,
                  onClick: () => toggleDone(item),
                  title: done ? t("todo.undone") : t("todo.done"),
                  children: done ? "\u2713" : ""
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "me-week-event-title", children: [
                item.text.split("\n")[0],
                item.due !== null && !done && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: `me-todo-days${item.due < today ? " me-todo-days--overdue" : ""}`, children: item.due < today ? `\u5EF6\u671F${-diffDays(item.due, today)}\u5929` : `\u5269\u4F59${diffDays(item.due, today)}\u5929` })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "me-week-event-meta", children: [
                renderMetaBadges(item, { todayCompact: true }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "me-badge me-badge-due", children: [
                  "\u65F6\u95F4 ",
                  item.due ?? item.start ?? "\u672A\u8BBE\u7F6E"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-week-event-foot", children: !isTodayOnly && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "me-week-event-actions", children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "me-btn", disabled: busy, onClick: () => openEditModal(item), children: t("todo.edit") }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "me-btn me-btn-danger", disabled: busy, onClick: () => removeTodo(item), children: t("memoryTab.delete") })
              ] }) })
            ] })
          },
          item.id
        );
      }) })
    ] });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-panel", children: [
    notice !== null && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: `me-notice me-notice-${notice.kind}`, children: notice.text }),
    !isTodayOnly && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-tabs", role: "tablist", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": projectFilter === "",
            className: projectFilter === "" ? "me-tab me-tab-active" : "me-tab",
            onClick: () => setProjectFilter(""),
            children: t("todo.track.all")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { className: "me-tab-proj", title: t("todo.project.switch"), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
          "select",
          {
            value: projectFilter,
            onChange: (event) => {
              const value = event.target.value;
              setProjectFilter(value);
              if (value !== "") setViewMode("project");
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "", children: t("todo.project.all") }),
              projOptions.map((p) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: p, children: p }, p))
            ]
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-tabs-spacer" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            type: "button",
            className: "me-btn me-btn-primary me-add-btn",
            onClick: () => openAddModal(),
            children: t("todo.addNew")
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-todo-filters", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "me-todo-filter", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: t("todo.filterStatus") }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("select", { value: statusFilter, onChange: (event) => setStatusFilter(event.target.value), children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "active", children: t("todo.status.active") }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "all", children: t("todo.all") }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "done", children: t("todo.status.done") })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "me-todo-filter", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: t("todo.filterQuadrant") }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("select", { value: quadFilter, onChange: (event) => setQuadFilter(event.target.value), children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "all", children: t("todo.all") }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "q1", children: t("todo.quadrant.q1") }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "q2", children: t("todo.quadrant.q2") }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "q3", children: t("todo.quadrant.q3") }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "q4", children: t("todo.quadrant.q4") }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "none", children: t("todo.quadrant.none") })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-todo-view-switch", role: "group", "aria-label": t("todo.view.mode"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              type: "button",
              className: viewMode === "list" ? "me-todo-view-btn me-todo-view-btn-active" : "me-todo-view-btn",
              "aria-pressed": viewMode === "list",
              onClick: () => setViewMode("list"),
              children: t("todo.view.list")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              type: "button",
              className: viewMode === "today" ? "me-todo-view-btn me-todo-view-btn-active" : "me-todo-view-btn",
              "aria-pressed": viewMode === "today",
              onClick: () => setViewMode("today"),
              children: t("todo.view.today")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              type: "button",
              className: viewMode === "calendar" ? "me-todo-view-btn me-todo-view-btn-active" : "me-todo-view-btn",
              "aria-pressed": viewMode === "calendar",
              onClick: () => setViewMode("calendar"),
              children: t("todo.view.calendar")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              type: "button",
              className: viewMode === "week" ? "me-todo-view-btn me-todo-view-btn-active" : "me-todo-view-btn",
              "aria-pressed": viewMode === "week",
              onClick: () => setViewMode("week"),
              children: t("todo.view.week")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              type: "button",
              className: viewMode === "project" ? "me-todo-view-btn me-todo-view-btn-active" : "me-todo-view-btn",
              "aria-pressed": viewMode === "project",
              onClick: () => setViewMode("project"),
              children: t("todo.view.project")
            }
          )
        ] })
      ] })
    ] }),
    items === null ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "me-muted", children: t("panel.loading") }) : isTodayOnly ? renderToday() : viewMode === "today" ? renderToday() : viewMode === "calendar" ? renderCalendar() : viewMode === "week" ? renderWeek() : viewMode === "project" ? renderProject() : renderList(),
    modalOpen && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-modal", onClick: () => setModalOpen(false), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "div",
      {
        className: "me-modal-box",
        role: "dialog",
        "aria-label": t("todo.addModal.title"),
        onClick: (event) => event.stopPropagation(),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h4", { className: "me-modal-title", children: modalEditId === null ? t("todo.addModal.title") : t("todo.edit") }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "textarea",
            {
              className: "me-modal-content",
              rows: 2,
              value: mContent,
              placeholder: t("todo.addPlaceholder"),
              autoFocus: true,
              onChange: (event) => setMContent(event.target.value)
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-modal-field-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-modal-field-label", children: "\u9879\u76EE" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "input",
              {
                type: "text",
                className: "me-modal-input",
                list: "me-proj-options",
                value: mProj,
                placeholder: t("todo.projPlaceholder"),
                onChange: (event) => setMProj(event.target.value)
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("datalist", { id: "me-proj-options", children: projOptions.map((p) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: p }, p)) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-modal-field-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-modal-field-label", children: "\u8D1F\u8D23\u4EBA" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "input",
              {
                type: "text",
                className: "me-modal-input",
                value: mWho,
                placeholder: t("todo.whoPlaceholder"),
                onChange: (event) => setMWho(event.target.value)
              }
            )
          ] }),
          mRepeat === "" && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-modal-field-row me-modal-date-field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-modal-field-label", children: "\u65F6\u95F4" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-modal-date-range", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                "button",
                {
                  type: "button",
                  className: `me-modal-time${mDateTarget === "start" ? " me-modal-time--active" : ""}`,
                  onClick: () => {
                    setMDateCal((mStart || mDue || today).slice(0, 7));
                    setMDateTarget("start");
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: t("todo.startShort") }),
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: fmtDate(mStart) ?? "\u672A\u8BBE\u7F6E" })
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-modal-date-arrow", children: "\u2192" }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                "button",
                {
                  type: "button",
                  className: `me-modal-time${mDateTarget === "due" ? " me-modal-time--active" : ""}`,
                  onClick: () => {
                    setMDateCal((mDue || mStart || today).slice(0, 7));
                    setMDateTarget("due");
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: t("todo.dueShort") }),
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: fmtDate(mDue) ?? "\u672A\u8BBE\u7F6E" })
                  ]
                }
              )
            ] })
          ] }),
          mDateTarget !== null && mRepeat === "" && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-modal-dates", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-modal-dates-head", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "me-btn", onClick: () => setMDateCal((k) => shiftMonth(k, -1)), children: "\u2039" }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "me-modal-dates-title", children: [
                mDateCal.split("-")[0],
                "\u5E74",
                Number(mDateCal.split("-")[1]),
                "\u6708"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "me-btn", onClick: () => setMDateCal((k) => shiftMonth(k, 1)), children: "\u203A" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-modal-dates-grid", children: [
              ["\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u65E5"].map((w) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-modal-dates-week", children: w }, w)),
              gridDays(mDateCal).map((d) => {
                const key = dateKey(d);
                const selected = key === mStart || key === mDue;
                const inRange = mStart !== "" && mDue !== "" && key > mStart && key < mDue;
                return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "button",
                  {
                    type: "button",
                    className: [
                      "me-modal-dates-day",
                      selected ? "me-modal-dates-day--sel" : "",
                      inRange ? "me-modal-dates-day--range" : "",
                      monthKey(d) !== mDateCal ? "me-modal-dates-day--out" : "",
                      key === today ? "me-modal-dates-day--today" : ""
                    ].filter(Boolean).join(" "),
                    onClick: () => {
                      if (mDateTarget === "start") {
                        setMStart(key);
                        if (mDue !== "" && key > mDue) setMDue(key);
                      } else {
                        setMDue(key);
                        if (mStart !== "" && key < mStart) setMStart(key);
                      }
                      setMDateTarget(null);
                    },
                    children: d.getDate()
                  },
                  key
                );
              })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-modal-dates-foot", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "button",
                {
                  type: "button",
                  className: "me-btn",
                  onClick: () => {
                    if (mDateTarget === "start") setMStart("");
                    else setMDue("");
                  },
                  children: "\u6E05\u9664\u65E5\u671F"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "button",
                {
                  type: "button",
                  className: "me-btn",
                  onClick: () => {
                    if (mDateTarget === "start") setMStart(today);
                    else setMDue(today);
                    setMDateTarget(null);
                  },
                  children: "\u9009\u62E9\u4ECA\u5929"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-modal-field-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-modal-field-label", children: t("todo.repeat") }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
              "select",
              {
                value: mRepeat,
                onChange: (event) => {
                  setMRepeat(event.target.value);
                  setMOn("");
                  setMStart("");
                  setMDue("");
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "", children: t("todo.repeat.none") }),
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "daily", children: t("todo.repeat.daily") }),
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "weekly", children: t("todo.repeat.weekly") }),
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "monthly", children: t("todo.repeat.monthly") })
                ]
              }
            ),
            mRepeat === "weekly" && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
              "select",
              {
                value: mOn,
                onChange: (event) => setMOn(event.target.value),
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "", children: t("todo.repeat.weekday") }),
                  [1, 2, 3, 4, 5, 6, 7].map((n) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: n, children: t(`todo.weekday.${n}`) }, n))
                ]
              }
            ),
            mRepeat === "monthly" && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
              "select",
              {
                value: mOn,
                onChange: (event) => setMOn(event.target.value),
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "", children: t("todo.repeat.monthDay") }),
                  Array.from({ length: 31 }, (_, i) => i + 1).map((n) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("option", { value: n, children: [
                    n,
                    "\u53F7"
                  ] }, n))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-modal-foot", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "button",
              {
                type: "button",
                className: "me-btn",
                onClick: () => setModalOpen(false),
                children: t("todo.cancel")
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "button",
              {
                type: "button",
                className: "me-btn me-btn-primary",
                disabled: busy || mContent.trim() === "",
                onClick: submitModal,
                children: t("todo.add")
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}

// src/client/ErrorBoundary.tsx
var import_react3 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var TodoErrorBoundary = class extends import_react3.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error !== null) {
      return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "me-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "me-notice me-notice-error", children: [
          "\u5F85\u529E\u754C\u9762\u6E32\u67D3\u51FA\u9519\uFF1A",
          String(this.state.error?.message ?? this.state.error)
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "me-muted", children: "\u8BF7\u628A\u4E0A\u9762\u8FD9\u884C\u9519\u8BEF\u4FE1\u606F\u53D1\u7ED9 AI \u4FEE\u590D\u3002" })
      ] });
    }
    return this.props.children;
  }
};

// src/client/TodoTabView.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var persistedFeature = null;
function TodoTabView(props) {
  const { sessionId, t } = props;
  const [feature, setFeature] = (0, import_react4.useState)(persistedFeature ?? "todo");
  const [suggestionsCount, setSuggestionsCount] = (0, import_react4.useState)(0);
  (0, import_react4.useEffect)(() => {
    persistedFeature = feature;
  }, [feature]);
  const poll = () => {
    void fetch("/todolist/api/suggestions").then((res) => res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))).then((data) => setSuggestionsCount(data.entries?.length ?? 0)).catch(() => {
    });
  };
  (0, import_react4.useEffect)(() => {
    poll();
    const timer = window.setInterval(poll, 3e4);
    const onChange = () => poll();
    window.addEventListener("todolist:badge-change", onChange);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("todolist:badge-change", onChange);
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "mt-panel", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "mt-file-tabs", role: "tablist", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": feature === "todo",
          className: feature === "todo" ? "mt-file-tab mt-file-tab-active" : "mt-file-tab",
          onClick: () => setFeature("todo"),
          children: t("todosTab.feature.todo")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": feature === "suggestions",
          className: feature === "suggestions" ? "mt-file-tab mt-file-tab-active" : "mt-file-tab",
          onClick: () => setFeature("suggestions"),
          children: [
            t("todosTab.feature.todoSuggestions"),
            suggestionsCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "mt-feature-count", children: suggestionsCount })
          ]
        }
      )
    ] }),
    feature === "todo" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TodoErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TodoView, { t, sessionId: String(sessionId) }) }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      SuggestionsView,
      {
        t,
        onChanged: () => {
          poll();
          window.dispatchEvent(new CustomEvent("todolist:badge-change"));
        }
      }
    )
  ] });
}

// src/client/TodoSidebarFallback.tsx
var import_react5 = require("react");
var import_react_dom = require("react-dom");
var import_jsx_runtime5 = require("react/jsx-runtime");
var STORAGE_KEY = "dsh-todolist:fallback-sidebar";
var MIN_WIDTH = 280;
var DEFAULT_WIDTH = 360;
function panelIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("rect", { x: "1.5", y: "2", width: "13", height: "12", rx: "2.5", stroke: "currentColor", strokeWidth: "1.5" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("rect", { x: "10.5", y: "3.25", width: "2.75", height: "9.5", rx: "1", fill: "currentColor", stroke: "none" })
  ] });
}
function readWidth() {
  try {
    const value = Number(window.localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(value) && value >= MIN_WIDTH ? value : DEFAULT_WIDTH;
  } catch {
    return DEFAULT_WIDTH;
  }
}
function clampWidth(width) {
  return Math.min(Math.max(MIN_WIDTH, Math.round(width)), Math.max(MIN_WIDTH, window.innerWidth));
}
function TodoSidebarFallback({ t }) {
  const [open, setOpen] = (0, import_react5.useState)(false);
  const [width, setWidth] = (0, import_react5.useState)(DEFAULT_WIDTH);
  const [dragging, setDragging] = (0, import_react5.useState)(false);
  const [mounted, setMounted] = (0, import_react5.useState)(false);
  const drag = (0, import_react5.useRef)({ startX: 0, startWidth: DEFAULT_WIDTH });
  const panelRef = (0, import_react5.useRef)(null);
  (0, import_react5.useEffect)(() => {
    setMounted(true);
    setWidth(readWidth());
    return () => setMounted(false);
  }, []);
  (0, import_react5.useEffect)(() => {
    const root = document.documentElement;
    const appRoot = document.querySelector("#root");
    const narrow = window.innerWidth < 768;
    const nextWidth = open && !narrow ? `${width}px` : "0px";
    root.style.setProperty("--dsh-todolist-sidebar-width", nextWidth);
    appRoot?.style.setProperty("margin-right", nextWidth, "important");
    return () => {
      root.style.removeProperty("--dsh-todolist-sidebar-width");
      appRoot?.style.removeProperty("margin-right");
    };
  }, [open, width]);
  (0, import_react5.useEffect)(() => {
    if (dragging) document.body.setAttribute("data-dsh-todolist-dragging", "");
    else document.body.removeAttribute("data-dsh-todolist-dragging");
    return () => document.body.removeAttribute("data-dsh-todolist-dragging");
  }, [dragging]);
  (0, import_react5.useEffect)(() => {
    if (open) document.body.removeAttribute("data-dsh-todolist-fallback-collapsed");
    else document.body.setAttribute("data-dsh-todolist-fallback-collapsed", "");
    return () => document.body.removeAttribute("data-dsh-todolist-fallback-collapsed");
  }, [open]);
  (0, import_react5.useEffect)(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);
  const startResize = (event) => {
    if (window.innerWidth < 768) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { startX: event.clientX, startWidth: width };
    setDragging(true);
  };
  const moveResize = (event) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const next = clampWidth(drag.current.startWidth + drag.current.startX - event.clientX);
    panelRef.current?.style.setProperty("width", `${next}px`);
    document.documentElement.style.setProperty("--dsh-todolist-sidebar-width", `${next}px`);
    document.querySelector("#root")?.style.setProperty("margin-right", `${next}px`, "important");
  };
  const endResize = (event) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    const next = clampWidth(drag.current.startWidth + drag.current.startX - event.clientX);
    setWidth(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
    }
    setDragging(false);
  };
  if (!mounted) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "button",
      {
        type: "button",
        className: "todo-fallback-toggle-button",
        "aria-label": open ? t("todo.fallback.close") : t("todo.fallback.open"),
        "aria-expanded": open,
        onClick: () => setOpen((value) => !value),
        children: panelIcon()
      }
    ),
    (0, import_react_dom.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
        "aside",
        {
          ref: panelRef,
          className: open ? "todo-fallback-panel todo-fallback-panel--open" : "todo-fallback-panel todo-fallback-panel--hidden",
          "data-dragging": dragging || void 0,
          "aria-hidden": !open,
          "aria-label": t("todo.fallback.title"),
          style: { width: window.innerWidth < 768 ? "100vw" : width },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              "div",
              {
                className: dragging ? "todo-fallback-resize todo-fallback-resize--active" : "todo-fallback-resize",
                onPointerDown: startResize,
                onPointerMove: moveResize,
                onPointerUp: endResize
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "todo-fallback-panel-body", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TodoErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TodoView, { t, sessionId: "fallback", mode: "today" }) }) })
          ]
        }
      ),
      document.body
    )
  ] });
}

// src/client/styles.css
var styles_default = "/**\n * dsh-todolist panel styles \u2014 DSH design tokens, `me-` prefix.\n * Colors come exclusively from --dsw-alias-* / --dsw-static-* tokens so the\n * panel follows the light/dark theme automatically (no hardcoded colors).\n */\n\n/* ---------- Root ---------- */\n\n.me-panel {\n  height: 100%;\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n  overflow-y: auto;\n  padding: 4px 2px 28px;\n  font-family: var(--dsw-font-family, inherit);\n  color: var(--dsw-alias-label-primary);\n}\n\n/* Inside the session memory tab: the panel is a sub-view, not a full-height\n   settings column \u2014 cap its height so the tab never grows the page. */\n.mt-panel .me-panel {\n  height: auto;\n  max-height: 62vh;\n}\n\n/* ---------- Notice bar (success / error) ---------- */\n\n.me-notice {\n  flex: none;\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  padding: 8px 12px;\n  border-radius: 8px;\n  font-size: 12px;\n  line-height: 1.5;\n}\n\n.me-notice::before {\n  content: '';\n  flex: none;\n  width: 6px;\n  height: 6px;\n  margin-top: 6px;\n  border-radius: 50%;\n}\n\n.me-notice-ok {\n  color: var(--dsw-alias-state-success-primary);\n  background: var(--dsw-alias-state-success-tertiary);\n  border: 1px solid var(--dsw-alias-state-success-primary);\n}\n.me-notice-ok::before {\n  background: var(--dsw-alias-state-success-primary);\n}\n\n.me-notice-error {\n  color: var(--dsw-alias-state-error-primary);\n  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent);\n  border: 1px solid var(--dsw-alias-state-error-secondary);\n}\n.me-notice-error::before {\n  background: var(--dsw-alias-state-error-primary);\n}\n\n/* \u8B66\u544A\u63D0\u793A\uFF08\u672A\u6DF1\u5EA6\u6D4B\u8BD5\u7B49\u9700\u8981\u7528\u6237\u77E5\u60C5\u7684\u573A\u666F\uFF09 */\n.me-notice-warn {\n  color: var(--dsw-alias-state-warning-primary, #b8860b);\n  background: color-mix(in srgb, #b8860b 10%, transparent);\n  border: 1px solid color-mix(in srgb, #b8860b 40%, transparent);\n}\n.me-notice-warn::before {\n  background: var(--dsw-alias-state-warning-primary, #b8860b);\n}\n\n/* ---------- Section cards ---------- */\n\n.me-block {\n  flex: none;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  padding: 14px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 12px;\n  background: var(--dsw-alias-bg-layer-1);\n}\n\n.me-block-head {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.me-heading {\n  margin: 0;\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-count {\n  flex: none;\n  min-width: 18px;\n  box-sizing: border-box;\n  padding: 1px 6px;\n  border-radius: 9px;\n  font-size: 11px;\n  line-height: 16px;\n  text-align: center;\n  color: var(--dsw-alias-state-business-primary);\n  background: var(--dsw-alias-state-business-tertiary);\n}\n\n.me-help {\n  margin: -4px 0 0;\n  font-size: 12px;\n  line-height: 1.5;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.me-muted {\n  margin: 0;\n  padding: 8px 0;\n  font-size: 12px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n/* Friendly empty state */\n.me-empty {\n  margin: 0;\n  padding: 22px 12px;\n  border: 1px dashed var(--dsw-alias-border-l3);\n  border-radius: 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  text-align: center;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n/* ---------- Suggestion list (own scroll area) ---------- */\n\n.me-list {\n  margin: 0;\n  padding: 0 2px 0 0;\n  list-style: none;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  max-height: 380px;\n  overflow-y: auto;\n}\n\n.me-item {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  padding: 10px 12px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 10px;\n  background: var(--dsw-alias-bg-base);\n  transition: border-color 120ms ease;\n}\n\n.me-item:hover {\n  border-color: var(--dsw-alias-border-l3);\n}\n\n.me-item-head {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 0;\n}\n\n.me-badge {\n  flex: none;\n  max-width: 45%;\n  padding: 1px 8px;\n  border-radius: 9px;\n  font-size: 10px;\n  line-height: 16px;\n  font-weight: 600;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: var(--dsw-alias-state-business-primary);\n  background: var(--dsw-alias-state-business-tertiary);\n}\n\n.me-badge-hits {\n  color: var(--dsw-alias-state-warn-primary);\n  background: var(--dsw-alias-state-warn-tertiary);\n}\n\n/* \u5F85\u786E\u8BA4\u5EFA\u8BAE\u7684\u76EE\u6807\u5FBD\u6807\uFF1A\u6309\u8F68\u7740\u8272\uFF0C\u9192\u76EE\u533A\u5206\u8981\u5199\u5165\u54EA\u7C7B\u8BB0\u5FC6 */\n.me-badge-suggest {\n  border: 1px solid transparent;\n  font-size: 11px;\n  line-height: 18px;\n  padding: 1px 10px;\n}\n\n.me-badge-suggest-memory {\n  color: var(--dsw-static-blue-5, #3b82f6);\n  background: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 16%, transparent);\n  border-color: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 45%, transparent);\n}\n\n.me-badge-suggest-user {\n  color: var(--dsw-static-green-5, #16a34a);\n  background: color-mix(in srgb, var(--dsw-static-green-5, #16a34a) 16%, transparent);\n  border-color: color-mix(in srgb, var(--dsw-static-green-5, #16a34a) 45%, transparent);\n}\n\n.me-badge-suggest-key {\n  color: var(--dsw-static-amber-6, #d97706);\n  background: color-mix(in srgb, var(--dsw-static-amber-5, #f59e0b) 18%, transparent);\n  border-color: color-mix(in srgb, var(--dsw-static-amber-5, #f59e0b) 48%, transparent);\n}\n\n.me-badge-suggest-todo {\n  color: var(--dsw-static-purple-5, #9333ea);\n  background: color-mix(in srgb, var(--dsw-static-purple-5, #9333ea) 16%, transparent);\n  border-color: color-mix(in srgb, var(--dsw-static-purple-5, #9333ea) 45%, transparent);\n}\n\n/* \u9879\u76EE\u7EA7\u5EFA\u8BAE\u7684\u6765\u6E90\u9879\u76EE\u5FBD\u6807\uFF08key / todo-project\uFF09\uFF1A\u4E2D\u6027\u8272 + \u865A\u7EBF\u8FB9\u6846\uFF0C\n   \u89C6\u89C9\u4E0A\u533A\u522B\u4E8E\"\u5199\u5165\u54EA\u7C7B\u8BB0\u5FC6\"\u7684\u5F69\u8272\u76EE\u6807\u5FBD\u6807\u2014\u2014\u5B83\u6807\u6CE8\u7684\u662F\"\u54EA\u4E2A\u9879\u76EE\"\u3002 */\n.me-badge-project {\n  color: var(--dsw-alias-label-secondary);\n  background: var(--dsw-alias-bg-layer-2);\n  border: 1px dashed var(--dsw-alias-border-l3);\n  max-width: 40%;\n}\n\n/* \u91C7\u7EB3\u76EE\u6807\u9009\u62E9\u4E0B\u62C9\uFF08\u9ED8\u8BA4=AI \u63A8\u8350\u8F68\uFF0C\u53EF\u6539\u5206\u7C7B\uFF09 */\n.me-pick-target {\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 6px;\n  padding: 2px 6px;\n  font-size: 11px;\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n}\n\n/* \u4F7F\u7528\u6307\u5357\u9762\u677F */\n.me-guide {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n\n.me-guide-row {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 8px 10px;\n  border: 1px solid var(--dsw-alias-border-l2, rgba(128, 128, 128, 0.25));\n  border-radius: 8px;\n  background: var(--dsw-alias-bg-l2, rgba(128, 128, 128, 0.06));\n}\n\n.me-guide-icon {\n  flex: none;\n  font-size: 16px;\n  line-height: 20px;\n}\n\n.me-guide-body {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  min-width: 0;\n}\n\n.me-guide-body strong {\n  font-size: 12px;\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-guide-body span {\n  font-size: 12px;\n  line-height: 1.55;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.me-guide-sub {\n  margin: 14px 0 6px;\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-guide-tips {\n  margin: 0;\n  padding-left: 18px;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  font-size: 12px;\n  line-height: 1.55;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.me-guide-loop {\n  margin: 12px 0 0;\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--dsw-static-blue-5, #3b82f6);\n}\n\n.me-item-time {\n  flex: 1;\n  min-width: 0;\n  font-size: 11px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.me-item-actions {\n  flex: none;\n  display: flex;\n  gap: 6px;\n}\n\n.me-item-reason {\n  margin: 0;\n  padding-left: 8px;\n  border-left: 2px solid var(--dsw-alias-border-l3);\n  font-size: 11px;\n  line-height: 1.5;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n/* Bulk actions: separated from the list by a hairline */\n.me-bulk {\n  display: flex;\n  gap: 8px;\n  padding-top: 10px;\n  border-top: 1px solid var(--dsw-alias-border-l1);\n}\n\n/* ---------- Buttons ---------- */\n\n.me-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  height: 26px;\n  padding: 0 10px;\n  border: 1px solid var(--dsw-alias-border-l3);\n  border-radius: 6px;\n  background: transparent;\n  color: var(--dsw-alias-label-primary);\n  font: inherit;\n  font-size: 12px;\n  white-space: nowrap;\n  cursor: pointer;\n  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;\n}\n\n.me-btn:hover:not(:disabled) {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.me-btn:active:not(:disabled) {\n  background: var(--dsw-alias-interactive-bg-active);\n}\n\n.me-btn:disabled {\n  opacity: 0.5;\n  cursor: default;\n}\n\n.me-btn-archive {\n  border-color: var(--dsw-alias-border-l3);\n  color: var(--dsw-alias-label-secondary);\n}\n\n.me-btn-archive:hover:not(:disabled) {\n  border-color: var(--dsw-alias-interactive-fg-default);\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-archive-list {\n  max-height: 320px;\n  overflow-y: auto;\n}\n\n.me-archive-content {\n  margin: 0;\n  padding: 10px 12px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 8px;\n  background: var(--dsw-alias-bg-layer-1);\n  font: inherit;\n  font-size: 12px;\n  line-height: 1.6;\n  white-space: pre-wrap;\n  word-break: break-word;\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-btn-ok {\n  color: var(--dsw-alias-state-success-primary);\n  border-color: var(--dsw-alias-state-success-primary);\n}\n.me-btn-ok:hover:not(:disabled) {\n  background: var(--dsw-alias-state-success-tertiary);\n}\n\n.me-btn-danger {\n  color: var(--dsw-alias-state-error-primary);\n}\n.me-btn-danger:hover:not(:disabled) {\n  background: var(--dsw-alias-interactive-bg-hover-danger);\n  border-color: var(--dsw-alias-state-error-secondary);\n}\n\n.me-btn-primary {\n  border-color: transparent;\n  background: var(--dsw-alias-button-primary-fill);\n  color: var(--dsw-alias-label-primary-inverted);\n  font-weight: 600;\n}\n.me-btn-primary:hover:not(:disabled) {\n  background: var(--dsw-alias-button-primary-hover);\n}\n.me-btn-primary:disabled {\n  background: var(--dsw-alias-button-primary-dimmed);\n}\n\n.me-btn:focus-visible,\n.me-switch:focus-visible,\n.me-input:focus-visible,\n.me-select:focus-visible {\n  outline: 2px solid var(--dsw-alias-state-business-primary);\n  outline-offset: 1px;\n}\n\n/* ---------- Config form ---------- */\n\n.me-form {\n  display: flex;\n  flex-direction: column;\n}\n\n/* Visual grouping: value rows vs. toggle rows, hairline between groups */\n.me-group {\n  display: flex;\n  flex-direction: column;\n}\n.me-group + .me-group {\n  margin-top: 8px;\n  padding-top: 4px;\n  border-top: 1px solid var(--dsw-alias-border-l1);\n}\n\n.me-field {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 7px 2px;\n  font-size: 13px;\n  color: var(--dsw-alias-label-primary);\n  cursor: pointer;\n}\n\n.me-field-label {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.me-field-hint {\n  font-style: normal;\n  font-size: 11px;\n  line-height: 1.4;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n/* \u6B21\u7EA7\u5F00\u5173\u884C\uFF08\u5B50\u529F\u80FD\u5F00\u5173\uFF0C\u5982 ws-coord \u7684\u5FEB\u7167/\u786C\u62E6\u622A\uFF09\uFF1A\u7F29\u8FDB + \u5F31\u5316\uFF0C\n   \u89C6\u89C9\u4E0A\u4E0E\u4E3B\u5F00\u5173\uFF08\u6A21\u5757\u603B\u5F00\u5173\uFF09\u533A\u5206 */\n.me-field-sub {\n  padding-left: 18px;\n  border-left: 2px solid var(--dsw-alias-border-l2);\n  margin-left: 2px;\n}\n\n/* \u88AB\u7981\u7528\u7684\u5F00\u5173\uFF08\u5982\u5E7F\u64AD\u5173\u65F6 ws-coord \u603B\u5F00\u5173\u4E0D\u53EF\u70B9\uFF09\uFF1A\u5F31\u5316\u63D0\u793A */\n.me-switch:disabled {\n  opacity: 0.4;\n  cursor: not-allowed;\n}\n\n/* Toggle switch (accent when on) */\n.me-switch {\n  appearance: none;\n  flex: none;\n  position: relative;\n  width: 36px;\n  height: 20px;\n  margin: 0;\n  border: 1px solid var(--dsw-alias-border-l3);\n  border-radius: 10px;\n  background: var(--dsw-alias-interactive-bg-active);\n  cursor: pointer;\n  transition: background-color 150ms ease, border-color 150ms ease;\n}\n\n.me-switch::after {\n  content: '';\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  width: 14px;\n  height: 14px;\n  border-radius: 50%;\n  background: var(--dsw-static-neutral-00);\n  transition: transform 150ms ease;\n}\n\n.me-switch:hover {\n  border-color: var(--dsw-alias-border-l4);\n}\n\n.me-switch:checked {\n  border-color: var(--dsw-alias-state-business-primary);\n  background: var(--dsw-alias-state-business-primary);\n}\n\n.me-switch:checked::after {\n  transform: translateX(16px);\n}\n\n/* Number / select inputs, right-aligned and uniform width */\n.me-input,\n.me-select {\n  flex: none;\n  width: 120px;\n  height: 28px;\n  box-sizing: border-box;\n  padding: 0 8px;\n  border: 1px solid var(--dsw-alias-border-l3);\n  border-radius: 6px;\n  outline: none;\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n  font: inherit;\n  font-size: 12px;\n  transition: border-color 120ms ease;\n}\n\n.me-input:hover,\n.me-select:hover {\n  border-color: var(--dsw-alias-border-l4);\n}\n\n.me-select {\n  cursor: pointer;\n}\n\n.me-actions {\n  display: flex;\n  /* 2026-08-14 \u7528\u6237\u53CD\u9988\uFF1A\u4FDD\u5B58\u6309\u94AE\u5C45\u4E2D\u5BF9\u9F50 */\n  justify-content: center;\n  gap: 8px;\n  margin-top: 8px;\n  padding-top: 12px;\n  border-top: 1px solid var(--dsw-alias-border-l1);\n}\n\n/* \u914D\u7F6E\u4FDD\u5B58\u6309\u94AE\u52A0\u5927\uFF082026-08-14 \u7528\u6237\u53CD\u9988\uFF1A\u5927\u4E00\u70B9\u66F4\u9192\u76EE\uFF09 */\n.me-actions .me-btn {\n  font-size: 14px;\n  padding: 9px 32px;\n  border-radius: 8px;\n}\n\n/* ---------- Open-files button grid ---------- */\n\n.me-reveal-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));\n  gap: 8px;\n}\n\n.me-btn-reveal {\n  justify-content: flex-start;\n  height: 30px;\n  padding: 0 10px;\n  color: var(--dsw-alias-label-secondary);\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.me-btn-reveal:hover:not(:disabled) {\n  color: var(--dsw-alias-label-primary);\n  border-color: var(--dsw-alias-state-business-primary);\n}\n\n/* ---------- Scrollbars (token-driven, fall back to border color) ---------- */\n\n.me-panel::-webkit-scrollbar,\n.me-list::-webkit-scrollbar {\n  width: 8px;\n}\n\n.me-panel::-webkit-scrollbar-thumb,\n.me-list::-webkit-scrollbar-thumb {\n  border-radius: 4px;\n  background: var(--dsw-alias-scrollbar-bg-l1, var(--dsw-alias-border-l3));\n}\n\n.me-panel::-webkit-scrollbar-thumb:hover,\n.me-list::-webkit-scrollbar-thumb:hover {\n  background: var(--dsw-alias-scrollbar-hover-l1, var(--dsw-alias-border-l4));\n}\n\n.me-panel::-webkit-scrollbar-track,\n.me-list::-webkit-scrollbar-track {\n  background: transparent;\n}\n\n/* ---- memory tab (conversation.view) ---- */\n.mt-panel {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  padding: 6px 12px 12px;\n  overflow-y: auto;\n  height: 100%;\n  box-sizing: border-box;\n}\n\n.mt-notice {\n  padding: 8px 12px;\n  border-radius: 8px;\n  font-size: 12px;\n  line-height: 1.5;\n}\n\n.mt-notice-ok {\n  color: var(--dsw-alias-state-success-primary);\n  background: var(--dsw-alias-state-success-tertiary);\n}\n\n.mt-notice-error {\n  color: var(--dsw-alias-state-error-primary);\n  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent);\n  border: 1px solid var(--dsw-alias-state-error-secondary);\n}\n\n.mt-cwd {\n  margin: 0;\n  font-size: 11px;\n  color: var(--dsw-alias-label-tertiary);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.mt-muted {\n  margin: 0;\n  font-size: 12px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.mt-list {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n\n.mt-card {\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 12px;\n  padding: 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  background: var(--dsw-alias-bg-layer-1);\n}\n\n.mt-card-head {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 0;\n}\n\n/* \u6BCF\u4E2A\u6587\u4EF6\u9875\u7B7E\u9876\u90E8\u7684\u4E00\u884C\u5C0F\u5B57\u8BF4\u660E\uFF08\u4F5C\u7528\u4E0E\u673A\u5236\uFF09 */\n.mt-card-desc {\n  margin: 0;\n  font-size: 11px;\n  line-height: 1.5;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.mt-card-title {\n  flex: none;\n  font-size: 13px;\n  font-weight: 600;\n}\n\n.mt-badge {\n  flex: none;\n  padding: 1px 8px;\n  border-radius: 9px;\n  font-size: 10px;\n  line-height: 16px;\n  font-weight: 600;\n}\n\n.mt-badge-ro {\n  color: var(--dsw-alias-label-secondary);\n  background: var(--dsw-alias-interactive-bg-active);\n}\n\n.mt-card-path {\n  flex: 1;\n  min-width: 0;\n  font-size: 11px;\n  color: var(--dsw-alias-label-tertiary);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  direction: rtl;\n  text-align: left;\n}\n\n.mt-card-actions {\n  flex: none;\n}\n\n.mt-btn {\n  padding: 3px 10px;\n  border-radius: 6px;\n  border: 1px solid var(--dsw-alias-border-l3);\n  background: transparent;\n  color: var(--dsw-alias-label-primary);\n  font-size: 12px;\n  cursor: pointer;\n}\n\n.mt-btn:disabled {\n  opacity: 0.5;\n  cursor: default;\n}\n\n/* ---- manual project KEY add box ---- */\n\n/* Branch-scope line in the KEY add box and in the per-entry scope editor. */\n.mt-key-scope {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 4px 12px;\n}\n\n.mt-key-scope-label {\n  font-size: 11px;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.mt-scope-opt {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 12px;\n  cursor: pointer;\n}\n\n.mt-scope-opt input {\n  margin: 0;\n  accent-color: var(--dsw-alias-state-business-primary);\n}\n\n.mt-scope-all-hint {\n  font-style: normal;\n  font-size: 10px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n/* Per-entry branch-scope badge (click to edit). */\n.mt-entry-branch {\n  flex: none;\n  max-width: 45%;\n  padding: 1px 8px;\n  border: 1px solid var(--dsw-alias-border-l3);\n  border-radius: 9px;\n  background: transparent;\n  font-size: 10px;\n  line-height: 16px;\n  font-weight: 600;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: var(--dsw-alias-state-business-primary);\n  cursor: pointer;\n}\n\n.mt-entry-branch:hover {\n  border-color: var(--dsw-alias-interactive-fg-default);\n  background: var(--dsw-alias-interactive-bg-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\n.mt-entry-branch-all {\n  color: var(--dsw-alias-label-secondary);\n  font-weight: 500;\n}\n\n/* Static source-branch tag on daily/project log entries (not clickable). */\n.mt-entry-branch-tag {\n  color: var(--dsw-alias-state-success-primary);\n  cursor: default;\n  border-style: dashed;\n}\n\n/* \u300C\u4EC5 DSH\u300D\u6807\u8BB0\u5FBD\u7AE0\uFF1A\u8BE5\u6761\u76EE\u53EA\u6CE8\u5165 DSH \u81EA\u8EAB\uFF0C\u6CE8\u5165\u5916\u90E8\u6267\u884C\u5668\uFF08COI\uFF09\u65F6\u8DF3\u8FC7\u3002 */\n.mt-entry-dsh-only {\n  flex: none;\n  padding: 1px 8px;\n  border: 1px solid var(--dsw-alias-state-warning-border, var(--dsw-alias-border-l3));\n  border-radius: 9px;\n  background: transparent;\n  font-size: 10px;\n  line-height: 16px;\n  font-weight: 600;\n  white-space: nowrap;\n  color: var(--dsw-alias-state-warning-fg, var(--dsw-alias-state-business-primary));\n}\n\n/* \u300C\u4EC5 DSH\u300Dtoggle \u6309\u94AE\u7684\u5DF2\u6807\u8BB0\u6FC0\u6D3B\u6001\uFF08\u9AD8\u4EAE\u533A\u5206\u5DF2\u6253\u6807\uFF09\u3002 */\n.mt-entry-dsh-on {\n  border-color: var(--dsw-alias-state-warning-border, var(--dsw-alias-border-l3)) !important;\n  color: var(--dsw-alias-state-warning-fg, var(--dsw-alias-state-business-primary)) !important;\n  font-weight: 600;\n}\n\n/* key \u624B\u52A8\u6DFB\u52A0\u6846\u7684\u300C\u4EC5 DSH\u300D\u52FE\u9009\u3002 */\n.mt-key-dsh-opt {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 11px;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  user-select: none;\n}\n\n/* Inline scope editor panel under a KEY entry. */\n.mt-scope {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 4px 12px;\n  padding: 8px 10px;\n  border: 1px dashed var(--dsw-alias-border-l4);\n  border-radius: 8px;\n  background: var(--dsw-alias-bg-base);\n}\n\n.mt-scope-actions {\n  margin-left: auto;\n  display: flex;\n  gap: 6px;\n}\n\n/* Current-branch suffix on the KEY tab description line. */\n.mt-card-desc-branch {\n  color: var(--dsw-alias-state-business-primary);\n  font-weight: 600;\n}\n\n.mt-key-add {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  padding: 10px;\n  margin-bottom: 10px;\n  border: 1px dashed var(--dsw-alias-border-l4);\n  border-radius: 8px;\n  background: var(--dsw-alias-bg-base);\n}\n\n.mt-key-input {\n  box-sizing: border-box;\n  width: 100%;\n  padding: 8px 10px;\n  border: 1px solid var(--dsw-alias-border-l3);\n  border-radius: 8px;\n  outline: none;\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n  font: inherit;\n  font-size: 12px;\n  line-height: 1.5;\n  resize: vertical;\n  transition: border-color 120ms ease;\n}\n\n.mt-key-input:hover {\n  border-color: var(--dsw-alias-border-l4);\n}\n\n.mt-key-input:focus-visible {\n  outline: 2px solid var(--dsw-alias-state-business-primary);\n  outline-offset: 1px;\n}\n\n.mt-key-input::placeholder {\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.mt-key-add-foot {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.mt-key-help {\n  font-size: 11px;\n  line-height: 1.5;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.mt-btn-primary {\n  flex: none;\n  border-color: var(--dsw-alias-state-business-primary);\n  background: var(--dsw-alias-state-business-primary);\n  color: var(--dsw-alias-label-on-primary, #fff);\n  font-weight: 600;\n}\n\n.mt-btn-primary:hover:not(:disabled) {\n  filter: brightness(1.1);\n}\n\n.mt-content {\n  margin: 0;\n  padding: 10px;\n  border-radius: 8px;\n  background: var(--dsw-alias-bg-base);\n  border: 1px solid var(--dsw-alias-border-l3);\n  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;\n  font-size: 12px;\n  line-height: 1.6;\n  white-space: pre-wrap;\n  word-break: break-word;\n  max-height: 320px;\n  overflow-y: auto;\n}\n\n\n.mt-warning {\n  margin: 0;\n  font-size: 11px;\n  line-height: 1.5;\n  color: var(--dsw-alias-state-warn-primary);\n}\n\n/* ---- memory tab toolbar (view toggle + search) ---- */\n\n.mt-file-tabs {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 2px;\n  padding: 0;\n  border-bottom: 1px solid var(--dsw-alias-interactive-bg-hover);\n  margin-bottom: 10px;\n}\n\n.mt-file-tab {\n  appearance: none;\n  height: 32px;\n  padding: 0 12px;\n  border: none;\n  border-radius: 6px 6px 0 0;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  font: inherit;\n  font-size: 13px;\n  cursor: pointer;\n  transition: background-color 120ms ease, color 120ms ease;\n}\n\n.mt-file-tab:hover:not(.mt-file-tab-active) {\n  background: var(--dsw-alias-interactive-bg-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\n.mt-file-tab-active,\n.mt-file-tab-active:hover {\n  background: var(--dsw-alias-interactive-bg-active);\n  color: var(--dsw-alias-brand-primary);\n  font-weight: 600;\n}\n\n/* Vertical divider between the feature tabs and the file tabs. */\n.mt-tab-sep {\n  flex: none;\n  align-self: center;\n  width: 1px;\n  height: 16px;\n  margin: 0 4px;\n  background: var(--dsw-alias-border-l3);\n}\n\n/* Pending-count badge inside a feature tab (e.g. \u5F85\u786E\u8BA4\u8BB0\u5FC6\u5EFA\u8BAE (2)). */\n.mt-feature-count {\n  display: inline-block;\n  min-width: 14px;\n  margin-left: 6px;\n  padding: 0 4px;\n  border-radius: 8px;\n  font-size: 10px;\n  line-height: 16px;\n  text-align: center;\n  font-weight: 700;\n  color: var(--dsw-alias-label-on-primary, #fff);\n  background: var(--dsw-alias-state-error-primary);\n}\n\n.mt-toolbar {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  flex-wrap: wrap;\n}\n\n/* Segmented \u7F8E\u89C2/\u7EAF\u6587\u672C toggle */\n.mt-view-toggle {\n  flex: none;\n  display: inline-flex;\n  padding: 2px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 8px;\n  background: var(--dsw-alias-bg-base);\n}\n\n.mt-view-btn {\n  padding: 3px 12px;\n  border: none;\n  border-radius: 6px;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  font: inherit;\n  font-size: 12px;\n  white-space: nowrap;\n  cursor: pointer;\n  transition: background-color 120ms ease, color 120ms ease;\n}\n\n.mt-view-btn:hover {\n  color: var(--dsw-alias-label-primary);\n}\n\n.mt-view-btn-active,\n.mt-view-btn-active:hover {\n  background: var(--dsw-alias-interactive-bg-active);\n  color: var(--dsw-alias-label-primary);\n  font-weight: 600;\n}\n\n.mt-view-btn:focus-visible,\n.mt-search:focus-visible {\n  outline: 2px solid var(--dsw-alias-state-business-primary);\n  outline-offset: 1px;\n}\n\n.mt-search {\n  flex: 1;\n  min-width: 160px;\n  height: 28px;\n  box-sizing: border-box;\n  padding: 0 10px;\n  border: 1px solid var(--dsw-alias-border-l3);\n  border-radius: 8px;\n  outline: none;\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n  font: inherit;\n  font-size: 12px;\n  transition: border-color 120ms ease;\n}\n\n.mt-search:hover {\n  border-color: var(--dsw-alias-border-l4);\n}\n\n.mt-search::placeholder {\n  color: var(--dsw-alias-label-tertiary);\n}\n\n/* Search hit count badge in the card head */\n.mt-badge-count {\n  color: var(--dsw-alias-state-business-primary);\n  background: var(--dsw-alias-state-business-tertiary);\n}\n\n/* Friendly empty state (no search results) */\n.mt-empty {\n  margin: 0;\n  padding: 22px 12px;\n  border: 1px dashed var(--dsw-alias-border-l3);\n  border-radius: 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  text-align: center;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n/* ---- pretty view: \xA7 entry cards ---- */\n\n.mt-entries {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  max-height: 320px;\n  overflow-y: auto;\n}\n\n.mt-entry {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  padding: 10px 12px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 10px;\n  background: var(--dsw-alias-bg-base);\n  transition: border-color 120ms ease, background-color 120ms ease;\n}\n\n.mt-entry:hover {\n  border-color: var(--dsw-alias-border-l3);\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.mt-entry-head {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  min-width: 0;\n}\n\n.mt-entry-time {\n  flex: none;\n  padding: 1px 8px;\n  border-radius: 9px;\n  font-size: 10px;\n  line-height: 16px;\n  font-weight: 600;\n  font-variant-numeric: tabular-nums;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-interactive-bg-active);\n}\n\n.mt-entry-tag {\n  flex: none;\n  max-width: 60%;\n  padding: 1px 8px;\n  border-radius: 9px;\n  font-size: 10px;\n  line-height: 16px;\n  font-weight: 600;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: var(--dsw-alias-state-business-primary);\n  background: var(--dsw-alias-state-business-tertiary);\n}\n\n/* Per-entry action buttons (pretty view): right-aligned group. */\n.mt-entry-ops {\n  flex: none;\n  margin-left: auto;\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n\n/* Neutral action (archive / promote back). */\n.mt-entry-op {\n  padding: 1px 8px;\n  font-size: 11px;\n  line-height: 16px;\n  border-color: transparent;\n  color: var(--dsw-alias-label-secondary);\n  opacity: 0.8;\n}\n\n.mt-entry-op:hover:not(:disabled) {\n  opacity: 1;\n  border-color: var(--dsw-alias-border-l3);\n  color: var(--dsw-alias-label-primary);\n}\n\n/* Per-entry delete button (pretty view): danger tint. */\n.mt-entry-del {\n  padding: 1px 8px;\n  font-size: 11px;\n  line-height: 16px;\n  border-color: transparent;\n  color: var(--dsw-alias-state-error-primary);\n  opacity: 0.7;\n}\n\n.mt-entry-del:hover:not(:disabled) {\n  opacity: 1;\n  background: var(--dsw-alias-interactive-bg-hover-danger);\n  border-color: var(--dsw-alias-state-error-secondary);\n}\n\n.mt-entry-text {\n  margin: 0;\n  font-size: 12px;\n  line-height: 1.6;\n  white-space: pre-wrap;\n  word-break: break-word;\n  color: var(--dsw-alias-label-primary);\n}\n\n/* \u6761\u76EE\u6B63\u6587\u7F16\u8F91\u6846\uFF08\u7F8E\u89C2\u89C6\u56FE\u300C\u7F16\u8F91\u300D\uFF09\uFF1A\u53EA\u6539\u5185\u5BB9\uFF0C\u6807\u8BB0\u7A0B\u5E8F\u7EF4\u62A4 */\n.mt-entry-edit {\n  margin-top: 6px;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n\n.mt-item-edit {\n  width: 100%;\n  box-sizing: border-box;\n  border: 1px solid var(--dsw-alias-border-l, rgba(128, 128, 128, 0.3));\n  border-radius: 6px;\n  padding: 6px 8px;\n  font-size: 12px;\n  line-height: 1.5;\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n  resize: vertical;\n  min-height: 56px;\n}\n\n.mt-item-edit:focus-visible {\n  outline: 2px solid var(--dsw-static-blue-6, #2563eb);\n  outline-offset: 1px;\n}\n\n.mt-entry-edit-row {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n\n.mt-entry-edit-hint {\n  flex: 1 1 auto;\n  font-size: 11px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n/* Entry list scrollbar (token-driven, fall back to border color) */\n.mt-entries::-webkit-scrollbar {\n  width: 8px;\n}\n\n.mt-entries::-webkit-scrollbar-thumb {\n  border-radius: 4px;\n  background: var(--dsw-alias-scrollbar-bg-l1, var(--dsw-alias-border-l3));\n}\n\n.mt-entries::-webkit-scrollbar-thumb:hover {\n  background: var(--dsw-alias-scrollbar-hover-l1, var(--dsw-alias-border-l4));\n}\n\n.mt-entries::-webkit-scrollbar-track {\n  background: transparent;\n}\n\n/* \u5206\u9875\u5668\uFF08\u7F8E\u89C2\u89C6\u56FE\u5927\u6587\u4EF6\u5206\u9875\uFF0C2026-08-10\uFF09 */\n.mt-pager {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  margin-top: 10px;\n  padding-top: 10px;\n  border-top: 1px solid var(--dsw-alias-border-l2, rgba(128, 128, 128, 0.2));\n}\n\n.mt-pager-info {\n  font-size: 12px;\n  color: var(--dsw-alias-label-secondary, rgba(128, 128, 128, 0.85));\n}\n\n/* ---------- Todo sub-tab ---------- */\n\n.me-tabs {\n  flex: none;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n\n.me-tab {\n  border: 1px solid var(--dsw-alias-border-l, rgba(128, 128, 128, 0.3));\n  border-radius: 6px;\n  padding: 4px 12px;\n  font-size: 12px;\n  color: var(--dsw-alias-label-secondary);\n  background: transparent;\n  cursor: pointer;\n}\n\n.me-tab:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.me-tab-active {\n  color: var(--dsw-alias-label-primary);\n  border-color: var(--dsw-alias-brand-primary);\n  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent);\n}\n\n.me-todo-add {\n  flex: none;\n  display: flex;\n  gap: 8px;\n  align-items: center;\n}\n\n.me-todo-input {\n  flex: 1;\n  min-width: 0;\n  border: 1px solid var(--dsw-alias-border-l, rgba(128, 128, 128, 0.3));\n  border-radius: 6px;\n  padding: 6px 10px;\n  font-size: 12px;\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-todo-select,\n.me-todo-date,\n.me-todo-filters select {\n  border: 1px solid var(--dsw-alias-border-l, rgba(128, 128, 128, 0.3));\n  border-radius: 6px;\n  padding: 5px 8px;\n  font-size: 12px;\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-todo-filters {\n  flex: none;\n  display: flex;\n  gap: 16px;\n  align-items: center;\n}\n\n.me-todo-filter {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.me-todo-filter-check {\n  cursor: pointer;\n  user-select: none;\n}\n\n.me-todo-filter-check input {\n  accent-color: var(--dsw-static-blue-5, #3b82f6);\n}\n\n/* \u8FC7\u5F80 daily \u5F85\u529E\u7684\u5206\u7EC4\u6807\u9898\uFF08\u5982 8\u67085\u65E5\uFF09 */\n.me-todo-day {\n  list-style: none;\n  margin: 10px 0 2px;\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--dsw-alias-label-secondary);\n  border-bottom: 1px dashed var(--dsw-alias-border-l, rgba(128, 128, 128, 0.3));\n  padding-bottom: 2px;\n}\n\n.me-badge-day {\n  color: var(--dsw-static-amber-7, #b45309);\n  background: color-mix(in srgb, var(--dsw-static-amber-5, #f59e0b) 14%, transparent);\n  border: 1px solid color-mix(in srgb, var(--dsw-static-amber-5, #f59e0b) 40%, transparent);\n}\n\n.me-todo-item--done .me-todo-text {\n  opacity: 0.55;\n  text-decoration: line-through;\n}\n\n.me-todo-text {\n  margin: 4px 0 0;\n  font-size: 13px;\n  line-height: 1.5;\n  white-space: pre-wrap;\n  word-break: break-word;\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-badge-quad {\n  border: 1px solid transparent;\n}\n\n.me-badge-quad-q1 {\n  color: var(--dsw-static-red-5, #e5484d);\n  background: color-mix(in srgb, var(--dsw-static-red-5, #e5484d) 14%, transparent);\n  border-color: color-mix(in srgb, var(--dsw-static-red-5, #e5484d) 40%, transparent);\n}\n\n.me-badge-quad-q2 {\n  color: var(--dsw-static-blue-5, #3b82f6);\n  background: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 14%, transparent);\n  border-color: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 40%, transparent);\n}\n\n.me-badge-quad-q3 {\n  color: var(--dsw-static-amber-5, #f59e0b);\n  background: color-mix(in srgb, var(--dsw-static-amber-5, #f59e0b) 14%, transparent);\n  border-color: color-mix(in srgb, var(--dsw-static-amber-5, #f59e0b) 40%, transparent);\n}\n\n.me-badge-quad-q4 {\n  color: var(--dsw-static-neutral-5, #8b8d98);\n  background: color-mix(in srgb, var(--dsw-static-neutral-5, #8b8d98) 14%, transparent);\n  border-color: color-mix(in srgb, var(--dsw-static-neutral-5, #8b8d98) 40%, transparent);\n}\n\n.me-badge-quad-none {\n  color: var(--dsw-alias-label-tertiary);\n  background: transparent;\n  border-color: var(--dsw-alias-border-l, rgba(128, 128, 128, 0.3));\n}\n\n.me-badge-overdue {\n  color: var(--dsw-static-red-5, #e5484d);\n  background: color-mix(in srgb, var(--dsw-static-red-5, #e5484d) 12%, transparent);\n}\n\n.me-badge-due {\n  color: var(--dsw-static-amber-5, #f59e0b);\n  background: color-mix(in srgb, var(--dsw-static-amber-5, #f59e0b) 12%, transparent);\n}\n\n.me-todo-help {\n  font-size: 11px;\n  line-height: 1.6;\n  color: var(--dsw-alias-label-tertiary);\n  margin: 0;\n}\n\n/* ---------- \u5F85\u529E\uFF1A\u5217\u8868 / \u770B\u677F \u89C6\u56FE\u5207\u6362\uFF08\u5206\u6BB5\u63A7\u4EF6\uFF09 ---------- */\n\n.me-todo-view-switch {\n  display: inline-flex;\n  margin-left: auto;\n  border: 1px solid var(--dsw-alias-border-l, rgba(128, 128, 128, 0.3));\n  border-radius: 8px;\n  overflow: hidden;\n  flex: none;\n}\n\n.me-todo-view-btn {\n  appearance: none;\n  border: none;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n  padding: 4px 12px;\n  cursor: pointer;\n  line-height: 1.4;\n}\n\n.me-todo-view-btn:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-todo-view-btn-active {\n  color: var(--dsw-alias-label-primary);\n  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent);\n  font-weight: 600;\n}\n\n/* ---------- \u5F85\u529E\uFF1A\u56DB\u8C61\u9650\u770B\u677F ----------\n * 2\xD72 \u5BAB\u683C\uFF1B\u6BCF\u4E2A\u8C61\u9650\u7528\u4E0D\u540C\u8272\u76F8\u63CF\u8FB9/\u6807\u9898\u70B9\u7F00\uFF0C\u989C\u8272\u5168\u90E8\u8D70\n * --dsw-static-* / --dsw-alias-* token\uFF0C\u6DF1\u6D45\u8272\u81EA\u9002\u5E94\u3002\n */\n\n.me-todo-board {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: minmax(160px, 1fr) minmax(160px, 1fr);\n  gap: 10px;\n  flex: none;\n  min-height: 320px;\n  max-height: 52vh;\n}\n\n/* \u7A84\u5C4F\uFF1A\u56DB\u8C61\u9650\u6539\u4E3A\u5355\u5217\u5806\u53E0\uFF0C\u907F\u514D\u5361\u7247\u88AB\u6324\u6241 */\n@media (max-width: 720px) {\n  .me-todo-board {\n    grid-template-columns: 1fr;\n    grid-template-rows: none;\n    max-height: none;\n  }\n}\n\n.me-todo-quad {\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n  border-radius: 12px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-layer-1);\n  overflow: hidden;\n}\n\n/* \u8C61\u9650\u8272\u5E26\uFF1A\u9876\u90E8\u7EC6\u7EBF + \u6807\u9898\u8272\uFF0C\u4E0E\u5217\u8868\u5FBD\u6807\u914D\u8272\u4E00\u81F4 */\n.me-todo-quad-q1 {\n  border-color: color-mix(in srgb, var(--dsw-static-red-5, #e5484d) 45%, var(--dsw-alias-border-l2));\n  box-shadow: inset 0 3px 0 0 color-mix(in srgb, var(--dsw-static-red-5, #e5484d) 70%, transparent);\n}\n.me-todo-quad-q2 {\n  border-color: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 45%, var(--dsw-alias-border-l2));\n  box-shadow: inset 0 3px 0 0 color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 70%, transparent);\n}\n.me-todo-quad-q3 {\n  border-color: color-mix(in srgb, var(--dsw-static-amber-5, #f59e0b) 45%, var(--dsw-alias-border-l2));\n  box-shadow: inset 0 3px 0 0 color-mix(in srgb, var(--dsw-static-amber-5, #f59e0b) 70%, transparent);\n}\n.me-todo-quad-q4 {\n  border-color: color-mix(in srgb, var(--dsw-static-neutral-5, #8b8d98) 45%, var(--dsw-alias-border-l2));\n  box-shadow: inset 0 3px 0 0 color-mix(in srgb, var(--dsw-static-neutral-5, #8b8d98) 55%, transparent);\n}\n\n.me-todo-quad-head {\n  flex: none;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  padding: 8px 10px 6px;\n}\n\n.me-todo-quad-title {\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-todo-quad-q1 .me-todo-quad-title { color: var(--dsw-static-red-5, #e5484d); }\n.me-todo-quad-q2 .me-todo-quad-title { color: var(--dsw-static-blue-5, #3b82f6); }\n.me-todo-quad-q3 .me-todo-quad-title { color: var(--dsw-static-amber-6, #d97706); }\n.me-todo-quad-q4 .me-todo-quad-title { color: var(--dsw-static-neutral-5, #8b8d98); }\n\n.me-todo-quad-count {\n  flex: none;\n  min-width: 18px;\n  box-sizing: border-box;\n  padding: 1px 6px;\n  border-radius: 9px;\n  font-size: 11px;\n  line-height: 16px;\n  text-align: center;\n  color: var(--dsw-alias-label-secondary);\n  background: color-mix(in srgb, var(--dsw-alias-label-secondary) 12%, transparent);\n}\n\n.me-todo-quad-body {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  padding: 4px 8px 10px;\n}\n\n.me-todo-quad-empty {\n  margin: 12px 4px;\n  padding: 16px 8px;\n  text-align: center;\n  font-size: 12px;\n  line-height: 1.5;\n  color: var(--dsw-alias-label-tertiary);\n  border: 1px dashed var(--dsw-alias-border-l, rgba(128, 128, 128, 0.3));\n  border-radius: 8px;\n  background: color-mix(in srgb, var(--dsw-alias-bg-base) 60%, transparent);\n}\n\n/* \u770B\u677F\u5361\u7247\uFF1A\u5DE6\u4FA7\u4EFB\u52A1\u8272\u6761 + \u6807\u9898/\u5143\u4FE1\u606F/\u64CD\u4F5C\u4E09\u6BB5\u7ED3\u6784\u3002 */\n.me-todo-card {\n  display: flex;\n  align-items: stretch;\n  gap: 0;\n  padding: 0;\n  border-radius: 10px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-base);\n  overflow: hidden;\n  transition: border-color 120ms ease, box-shadow 120ms ease;\n}\n\n.me-todo-card:hover {\n  border-color: var(--dsw-alias-border-l3);\n  box-shadow: 0 1px 4px color-mix(in srgb, var(--dsw-alias-label-primary) 6%, transparent);\n}\n\n.me-todo-card-bar {\n  flex: none;\n  width: 4px;\n  align-self: stretch;\n}\n\n.me-todo-card-main {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  padding: 8px 10px;\n}\n\n.me-todo-card-head {\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  min-width: 0;\n}\n\n.me-todo-card-text {\n  flex: 1;\n  min-width: 0;\n}\n\n.me-todo-card--done {\n  background: var(--dsw-alias-interactive-bg-active);\n  border-color: var(--dsw-alias-border-l2);\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.me-todo-card--done .me-todo-card-title {\n  text-decoration: line-through;\n}\n\n.me-todo-card-meta {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 4px;\n  min-width: 0;\n}\n\n.me-todo-card-title {\n  margin: 0;\n  font-size: 13px;\n  font-weight: 500;\n  line-height: 1.4;\n  color: var(--dsw-alias-label-primary);\n  word-break: break-word;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n.me-todo-card-body {\n  margin: 0;\n  font-size: 11px;\n  line-height: 1.45;\n  color: var(--dsw-alias-label-tertiary);\n  white-space: pre-wrap;\n  word-break: break-word;\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n.me-todo-card-foot {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 6px;\n  margin-top: 2px;\n}\n\n.me-todo-card-foot .me-item-actions {\n  display: inline-flex;\n  flex-wrap: wrap;\n  gap: 4px;\n}\n\n.me-todo-card-foot .me-btn {\n  font-size: 11px;\n  padding: 2px 8px;\n}\n\n/* \u72B6\u6001\u5FBD\u6807\uFF08\u5217\u8868 + \u770B\u677F\u5171\u7528\uFF09\uFF1B\u53EF\u70B9\u51FB\u5207\u6362\u72B6\u6001 */\n.me-badge-status {\n  appearance: none;\n  cursor: pointer;\n  border: 1px solid transparent;\n  font-family: inherit;\n}\n\n.me-badge-status:disabled {\n  cursor: not-allowed;\n  opacity: 0.6;\n}\n\n.me-badge-status:hover:not(:disabled) {\n  filter: brightness(1.05);\n}\n\n.me-badge-status-pending {\n  color: var(--dsw-alias-label-secondary);\n  background: color-mix(in srgb, var(--dsw-alias-label-secondary) 12%, transparent);\n  border-color: color-mix(in srgb, var(--dsw-alias-label-secondary) 30%, transparent);\n}\n\n.me-badge-status-doing {\n  color: var(--dsw-static-blue-5, #3b82f6);\n  background: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 14%, transparent);\n  border-color: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 40%, transparent);\n}\n\n.me-badge-status-done {\n  color: var(--dsw-static-green-5, #16a34a);\n  background: color-mix(in srgb, var(--dsw-static-green-5, #16a34a) 14%, transparent);\n  border-color: color-mix(in srgb, var(--dsw-static-green-5, #16a34a) 40%, transparent);\n}\n\n.me-badge-status-blocked {\n  color: var(--dsw-static-red-5, #e5484d);\n  background: color-mix(in srgb, var(--dsw-static-red-5, #e5484d) 14%, transparent);\n  border-color: color-mix(in srgb, var(--dsw-static-red-5, #e5484d) 40%, transparent);\n}\n\n.me-badge-status-cancelled {\n  color: var(--dsw-static-neutral-5, #8b8d98);\n  background: color-mix(in srgb, var(--dsw-static-neutral-5, #8b8d98) 14%, transparent);\n  border-color: color-mix(in srgb, var(--dsw-static-neutral-5, #8b8d98) 35%, transparent);\n  text-decoration: line-through;\n}\n\n/* \u4F1A\u8BDD\u5934\u90E8\u300C\u590D\u5236\u4F1A\u8BDD ID\u300D\u6309\u94AE\uFF08conversation.session.header.actions \u63D2\u69FD\uFF09\u3002\n   \u5C0F\u5C3A\u5BF8\u5E7D\u7075\u6309\u94AE\uFF1A\u8DDF\u968F DSH \u4E3B\u9898 token\uFF0C\u9F20\u6807\u60AC\u505C\u52A0\u6DF1\u3002 */\n.me-copy-session-id {\n  appearance: none;\n  border: 1px solid var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.35));\n  border-radius: 6px;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary, inherit);\n  font-size: 12px;\n  line-height: 1;\n  padding: 4px 8px;\n  cursor: pointer;\n  white-space: nowrap;\n}\n.me-copy-session-id:hover {\n  border-color: var(--dsw-alias-interactive-bg-active, rgba(128, 128, 128, 0.6));\n  color: var(--dsw-alias-label-primary, inherit);\n}\n\n/* \u4F1A\u8BDD\u522B\u540D\u6309\u94AE\uFF08header actions\uFF0C\u590D\u5236\u4F1A\u8BDD ID \u6309\u94AE\u65C1\uFF09\uFF1A\u5185\u8054\u7F16\u8F91\u533A */\n.me-alias-wrap {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n}\n\n.me-alias-editor {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n}\n\n.me-alias-input {\n  width: 110px;\n  appearance: none;\n  border: 1px solid var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.35));\n  border-radius: 6px;\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n  font-size: 12px;\n  padding: 3px 6px;\n  outline: none;\n}\n\n.me-alias-input:focus {\n  border-color: var(--dsw-alias-state-accent-primary, #4c8dff);\n}\n\n.me-alias-notice {\n  font-size: 11px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n/* ---- \u6A21\u578B\u8BBE\u7F6E Tab\uFF08models-hub\uFF09----\n * mt-models-* \u524D\u7F00\uFF0Ctoken \u4E0E\u98CE\u683C\u4E0E\u73B0\u6709 mt- \u7C7B\u4E00\u81F4\uFF08\u4E0D\u81EA\u5EFA\u6837\u5F0F\u4F53\u7CFB\uFF09\u3002\n * \u8868\u683C + \u884C\u5185\u914D\u7F6E\uFF08\u542F\u7528\u5F00\u5173 / \u601D\u8003\u7B49\u7EA7\u6807\u7B7E\u4E0E\u7F16\u8F91\u5668 / \u5907\u6CE8\u8F93\u5165\uFF09\u3002 */\n\n/* \u8868\u683C\u6EDA\u52A8\u5BB9\u5668\uFF08\u8868\u683C\u53EF\u80FD\u8D85\u51FA\u9762\u677F\u9AD8\u5EA6\uFF09\u3002 */\n.mt-models-scroll {\n  flex: 1;\n  min-height: 0;\n  overflow: auto;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 10px;\n  background: var(--dsw-alias-bg-base);\n}\n\n.mt-models-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 12px;\n}\n\n.mt-models-cell {\n  padding: 6px 10px;\n  border-bottom: 1px solid var(--dsw-alias-interactive-bg-hover);\n  vertical-align: top;\n  text-align: left;\n  color: var(--dsw-alias-label-primary);\n}\n\n.mt-models-table thead .mt-models-cell {\n  position: sticky;\n  top: 0;\n  z-index: 1;\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-secondary);\n  font-size: 11px;\n  font-weight: 600;\n  white-space: nowrap;\n}\n\n.mt-models-table tbody .mt-models-row:last-child .mt-models-cell {\n  border-bottom: none;\n}\n\n/* \u7981\u7528\u884C\uFF1A\u6574\u884C\u964D\u900F\u660E + \u540D\u79F0\u5212\u7EBF\u5F31\u5316\u3002 */\n.mt-models-row-muted .mt-models-cell {\n  opacity: 0.55;\n}\n\n.mt-models-col-enable {\n  width: 44px;\n}\n\n.mt-models-col-capacity {\n  width: 96px;\n  white-space: nowrap;\n}\n\n.mt-models-col-reasoning {\n  min-width: 180px;\n}\n\n.mt-models-provider {\n  font-weight: 600;\n}\n\n.mt-models-tag {\n  display: inline-block;\n  margin: 1px 4px 1px 0;\n  padding: 0 7px;\n  border-radius: 9px;\n  font-size: 10px;\n  line-height: 17px;\n  white-space: nowrap;\n  color: var(--dsw-alias-label-secondary);\n  background: var(--dsw-alias-interactive-bg-active);\n}\n\n.mt-models-tag-rec {\n  color: var(--dsw-alias-state-business-primary);\n  background: var(--dsw-alias-state-business-tertiary);\n}\n\n.mt-models-tag-dormant {\n  margin-left: 4px;\n  color: var(--dsw-alias-state-warning-primary);\n  background: var(--dsw-alias-state-warning-tertiary);\n}\n\n.mt-models-model {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n  min-width: 0;\n}\n\n.mt-models-model-name {\n  font-weight: 600;\n}\n\n.mt-models-model-id {\n  font-size: 11px;\n  color: var(--dsw-alias-label-tertiary);\n  word-break: break-all;\n}\n\n.mt-models-capacity {\n  font-variant-numeric: tabular-nums;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.mt-models-muted-cell {\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.mt-models-levels {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 2px;\n  margin-bottom: 2px;\n}\n\n.mt-models-level-none {\n  font-size: 11px;\n  color: var(--dsw-alias-state-error-primary);\n}\n\n.mt-models-level-more {\n  font-size: 10px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.mt-models-link {\n  appearance: none;\n  padding: 0;\n  border: none;\n  background: transparent;\n  color: var(--dsw-alias-state-accent-primary, #4c8dff);\n  font: inherit;\n  font-size: 11px;\n  cursor: pointer;\n}\n\n.mt-models-link:hover {\n  text-decoration: underline;\n}\n\n.mt-models-link-danger {\n  color: var(--dsw-alias-state-error-primary);\n}\n\n.mt-models-note {\n  width: 100%;\n  min-width: 140px;\n  box-sizing: border-box;\n  padding: 3px 8px;\n  border: 1px solid transparent;\n  border-radius: 6px;\n  outline: none;\n  background: transparent;\n  color: var(--dsw-alias-label-primary);\n  font: inherit;\n  font-size: 12px;\n  transition: border-color 120ms ease, background-color 120ms ease;\n}\n\n.mt-models-note:hover {\n  border-color: var(--dsw-alias-border-l3);\n}\n\n.mt-models-note:focus {\n  border-color: var(--dsw-alias-state-accent-primary, #4c8dff);\n  background: var(--dsw-alias-bg-base);\n}\n\n.mt-models-note::placeholder {\n  color: var(--dsw-alias-label-tertiary);\n}\n\n/* \u5C55\u5F00\u7684\u601D\u8003\u7B49\u7EA7\u7F16\u8F91\u5668\uFF08\u5360\u6574\u884C\uFF09\u3002 */\n.mt-models-expanded {\n  padding: 10px 12px;\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.mt-models-editor {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n\n.mt-models-editor-title {\n  font-size: 11px;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.mt-models-editor-levels {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n\n.mt-models-editor-level {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 12px;\n  cursor: pointer;\n}\n\n.mt-models-editor-level-name {\n  font-weight: 600;\n}\n\n.mt-models-editor-level-id {\n  font-size: 11px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.mt-models-editor-add {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 8px;\n}\n\n.mt-models-editor-add .mt-search {\n  flex: 0 1 180px;\n}\n\n.mt-models-editor-actions {\n  display: flex;\n  gap: 8px;\n}\n\n.mt-models-toggle-label {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 12px;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  white-space: nowrap;\n}\n\n/* \u601D\u8003\u5173\u95ED\u6807\u8BB0\uFF08\u6A21\u578B\u8BBE\u7F6E\u8868\u683C\u884C\u5185\uFF09\u3002 */\n.mt-models-tag-off {\n  color: var(--dsw-alias-state-error-primary);\n  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent);\n}\n\n/* \u63A8\u8350\u7B49\u7EA7\u4E0B\u62C9\uFF08\u601D\u8003\u7B49\u7EA7\u7F16\u8F91\u5668\u5185\uFF09\u3002 */\n.mt-models-select {\n  appearance: none;\n  max-width: 260px;\n  padding: 3px 24px 3px 8px;\n  border: 1px solid var(--dsw-alias-border-l3);\n  border-radius: 6px;\n  outline: none;\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n  font: inherit;\n  font-size: 12px;\n  cursor: pointer;\n}\n\n.mt-models-select:disabled {\n  opacity: 0.5;\n  cursor: default;\n}\n\n.mt-models-editor-label {\n  flex: none;\n  font-size: 12px;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.mt-models-editor-hint {\n  font-size: 11px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n/* \u7248\u672C\u68C0\u6D4B\u300C\u53D1\u5E03\u8BF4\u660E\u300D\uFF1A\u4FDD\u7559\u6362\u884C\uFF08tag \u9644\u6CE8\u591A\u884C\u5C55\u793A\uFF0CCodeX \u590D\u5BA1 P1-8\uFF09\u3002 */\n.me-notes-pre {\n  white-space: pre-wrap;\n  word-break: break-word;\n}\n\n/* \u2014\u2014 \u5F85\u529E\u65E5\u5386\u89C6\u56FE\uFF08me-cal-*\uFF09\u2014\u2014 */\n.me-cal {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  padding: 2px 0 10px;\n}\n\n.me-cal-head {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.me-cal-title {\n  flex: 1;\n  text-align: center;\n  font-size: 14px;\n  font-weight: 600;\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-cal-grid {\n  display: grid;\n  grid-template-columns: repeat(7, 1fr);\n  gap: 4px;\n}\n\n.me-cal-week {\n  margin-bottom: 2px;\n}\n\n.me-cal-weekday {\n  text-align: center;\n  font-size: 11px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.me-cal-cell {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  min-height: 58px;\n  padding: 4px;\n  border-radius: 8px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-base);\n  cursor: pointer;\n  text-align: left;\n  font: inherit;\n  transition: border-color 120ms ease, background 120ms ease;\n}\n\n.me-cal-cell:hover {\n  border-color: var(--dsw-alias-border-l3);\n}\n\n.me-cal-cell--out {\n  opacity: 0.45;\n}\n\n.me-cal-cell--today {\n  border-color: var(--dsw-static-blue-6, #2563eb);\n  box-shadow: inset 0 0 0 1px var(--dsw-static-blue-6, #2563eb);\n}\n\n.me-cal-cell--selected {\n  border-color: var(--dsw-static-blue-6, #2563eb);\n  background: color-mix(in srgb, var(--dsw-static-blue-6, #2563eb) 10%, var(--dsw-alias-bg-base));\n}\n\n.me-cal-cell--overdue .me-cal-cell-date {\n  color: var(--dsw-static-red-5, #e5484d);\n  font-weight: 700;\n}\n\n.me-cal-cell-date {\n  font-size: 12px;\n  line-height: 1.2;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.me-cal-cell-items {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  overflow: hidden;\n}\n\n.me-cal-cell-item {\n  font-size: 10px;\n  line-height: 1.25;\n  color: var(--dsw-alias-label-primary);\n  background: color-mix(in srgb, var(--dsw-alias-bg-elevated, var(--dsw-alias-bg-base)) 80%, var(--dsw-alias-border-l2));\n  border-radius: 4px;\n  padding: 1px 3px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.me-cal-cell-item--done {\n  opacity: 0.55;\n  text-decoration: line-through;\n}\n\n.me-cal-cell-more {\n  font-size: 10px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.me-cal-detail {\n  border-top: 1px dashed var(--dsw-alias-border-l, rgba(128, 128, 128, 0.3));\n  padding-top: 10px;\n}\n\n.me-cal-detail-title {\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--dsw-alias-label-primary);\n  margin-bottom: 8px;\n}\n\n/* \u2014\u2014 \u5F85\u529E\u5468\u89C6\u56FE\uFF08me-week-*\uFF09\u2014\u2014 */\n.me-week {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  padding: 2px 0 10px;\n}\n\n.me-week-grid {\n  display: grid;\n  grid-template-columns: repeat(7, 1fr);\n  gap: 4px;\n}\n\n.me-week-cell {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  min-height: 96px;\n  padding: 4px;\n  border-radius: 8px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-base);\n  cursor: pointer;\n  text-align: left;\n  font: inherit;\n  transition: border-color 120ms ease;\n}\n\n.me-week-cell:hover {\n  border-color: var(--dsw-alias-border-l3);\n}\n\n.me-week-cell--today {\n  border-color: var(--dsw-static-blue-6, #2563eb);\n  box-shadow: inset 0 0 0 1px var(--dsw-static-blue-6, #2563eb);\n}\n\n.me-week-cell--selected {\n  border-color: var(--dsw-static-blue-6, #2563eb);\n  background: color-mix(in srgb, var(--dsw-static-blue-6, #2563eb) 10%, var(--dsw-alias-bg-base));\n}\n\n.me-week-cell--overdue .me-week-cell-date {\n  color: var(--dsw-static-red-5, #e5484d);\n  font-weight: 700;\n}\n\n.me-week-cell-head {\n  display: flex;\n  align-items: baseline;\n  gap: 4px;\n}\n\n.me-week-cell-weekday {\n  font-size: 11px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.me-week-cell-date {\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-week-cell-items {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  overflow: hidden;\n}\n\n.me-week-cell-item {\n  font-size: 10px;\n  line-height: 1.25;\n  color: var(--dsw-alias-label-primary);\n  background: color-mix(in srgb, var(--dsw-alias-bg-elevated, var(--dsw-alias-bg-base)) 80%, var(--dsw-alias-border-l2));\n  border-radius: 4px;\n  padding: 1px 3px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.me-week-cell-item--done {\n  opacity: 0.55;\n  text-decoration: line-through;\n}\n\n/* \u2014\u2014 \u5F85\u529E\u9879\u76EE\u89C6\u56FE\uFF08me-proj-*\uFF09\u2014\u2014 */\n.me-proj {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  padding: 2px 0 10px;\n}\n\n.me-proj-toolbar {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.me-proj-group {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 10px;\n  padding: 8px;\n  background: color-mix(in srgb, var(--dsw-alias-bg-base) 70%, transparent);\n}\n\n.me-proj-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n}\n\n.me-proj-title {\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-proj-count {\n  font-size: 11px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.me-proj-body {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n\n/* \u2014\u2014 \u9879\u76EE / \u8D1F\u8D23\u4EBA\u5FBD\u6807 \u2014\u2014 */\n.me-badge-proj {\n  background: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 14%, transparent);\n  color: var(--dsw-static-blue-5, #3b82f6);\n}\n\n.me-badge-who {\n  background: color-mix(in srgb, var(--dsw-static-green-6, #46a758) 14%, transparent);\n  color: var(--dsw-static-green-6, #46a758);\n}\n\n/* \u89C6\u56FE\u5207\u6362 5 \u4E2A\u6309\u94AE\u5141\u8BB8\u6362\u884C */\n.me-todo-view-switch {\n  flex-wrap: wrap;\n}\n\n/* \u2014\u2014 \u9875\u7B7E\u884C\u7684\u9879\u76EE\u5207\u6362\u4E0B\u62C9 \u2014\u2014 */\n.me-tab-proj {\n  display: inline-flex;\n  align-items: center;\n  gap: 2px;\n  margin-left: 4px;\n  font-size: 12px;\n  vertical-align: middle;\n}\n\n.me-tab-proj-icon {\n  font-size: 11px;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.me-tab-proj select {\n  font-size: 11px;\n  max-width: 110px;\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 6px;\n  padding: 2px 4px;\n  cursor: pointer;\n}\n\n.me-tab-proj select:hover {\n  border-color: var(--dsw-alias-border-l3);\n}\n\n/* \u9876\u680F\u53F3\u4FA7\u7A7A\u9699 + \u6DFB\u52A0\u6309\u94AE */\n.me-tabs-spacer {\n  flex: 1;\n}\n\n.me-add-btn {\n  margin-left: 6px;\n  font-weight: 600;\n}\n\n/* \u2014\u2014 \u6DFB\u52A0\u5F85\u529E\u5F39\u7A97\uFF08me-modal-*\uFF09\u2014\u2014 */\n.me-modal {\n  position: fixed;\n  inset: 0;\n  z-index: 1000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: color-mix(in srgb, #000 35%, transparent);\n  padding: 16px;\n}\n\n.me-modal-box {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  width: 100%;\n  max-width: 420px;\n  max-height: 86vh;\n  overflow-y: auto;\n  padding: 14px;\n  border-radius: 12px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-base);\n  box-shadow: 0 8px 32px color-mix(in srgb, #000 25%, transparent);\n}\n\n.me-modal-title {\n  margin: 0;\n  font-size: 14px;\n  font-weight: 600;\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-modal-content {\n  min-height: 56px;\n  resize: vertical;\n  font: inherit;\n  font-size: 13px;\n  padding: 8px;\n  border-radius: 8px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-modal-content:focus {\n  outline: none;\n  border-color: var(--dsw-static-blue-6, #2563eb);\n}\n\n.me-modal-row {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n\n.me-modal-row select,\n.me-modal-row input[type='date'] {\n  flex: 1;\n  min-width: 0;\n  font-size: 12px;\n  padding: 5px 6px;\n  border-radius: 6px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-modal-input {\n  flex: 1;\n  min-width: 0;\n  font-size: 12px;\n  padding: 5px 6px;\n  border-radius: 6px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-modal-hint {\n  font-size: 11px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n/* \u2014\u2014 \u521B\u5EFA\u5F39\u7A97\u5B57\u6BB5\u884C\uFF08\u65E5\u4E8B\u6E05\u5F0F\uFF09\u2014\u2014 */\n.me-modal-field-row {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 0;\n}\n\n.me-modal-field-row select {\n  max-width: 140px;\n  font-size: 12px;\n  padding: 5px 6px;\n  border-radius: 6px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-modal-field-label {\n  flex: none;\n  width: 44px;\n  font-size: 12px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.me-modal-time {\n  flex: 1;\n  min-width: 0;\n  text-align: left;\n  font-size: 12px;\n  padding: 6px 8px;\n  border-radius: 6px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n  cursor: pointer;\n}\n\n.me-modal-time:hover {\n  border-color: var(--dsw-static-blue-6, #2563eb);\n}\n\n/* \u2014\u2014 \u65F6\u95F4\u9009\u62E9\u5668\u6708\u5386\u9762\u677F \u2014\u2014 */\n.me-modal-dates {\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 10px;\n  padding: 8px;\n  background: var(--dsw-alias-bg-base);\n}\n\n.me-modal-dates-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 6px;\n}\n\n.me-modal-dates-title {\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-modal-dates-grid {\n  display: grid;\n  grid-template-columns: repeat(7, 1fr);\n  gap: 2px;\n}\n\n.me-modal-dates-week {\n  text-align: center;\n  font-size: 11px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.me-modal-dates-day {\n  font: inherit;\n  font-size: 12px;\n  padding: 3px 0;\n  border-radius: 6px;\n  border: 1px solid transparent;\n  background: transparent;\n  color: var(--dsw-alias-label-primary);\n  cursor: pointer;\n  text-align: center;\n}\n\n.me-modal-dates-day:hover {\n  background: var(--dsw-alias-bg-elevated, var(--dsw-alias-bg-base));\n}\n\n.me-modal-dates-day--today {\n  border-color: var(--dsw-static-blue-6, #2563eb);\n}\n\n.me-modal-dates-day--sel {\n  background: var(--dsw-static-blue-6, #2563eb);\n  color: #fff;\n  font-weight: 600;\n}\n\n.me-modal-dates-foot {\n  display: flex;\n  justify-content: space-between;\n  margin-top: 8px;\n}\n\n.me-modal-foot {\n  display: flex;\n  justify-content: flex-end;\n  gap: 8px;\n}\n\n/* \u2014\u2014 \u5468\u671F / \u65F6\u95F4\u8DE8\u5EA6\u5FBD\u6807 \u2014\u2014 */\n.me-badge-repeat {\n  background: color-mix(in srgb, var(--dsw-static-purple-5, #8e4ec6) 14%, transparent);\n  color: var(--dsw-static-purple-5, #8e4ec6);\n}\n\n.me-badge-range {\n  background: color-mix(in srgb, var(--dsw-static-amber-6, #d97706) 14%, transparent);\n  color: var(--dsw-static-amber-6, #d97706);\n}\n\n/* \u2014\u2014 \u65E5\u671F\u8F93\u5165\u53EF\u89C1\u6807\u7B7E \u2014\u2014 */\n.me-modal-date {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  flex: 1;\n  min-width: 0;\n}\n\n.me-modal-date span {\n  font-size: 10px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n/* \u2014\u2014 \u65F6\u95F4\u8DE8\u5EA6\u957F\u6761\uFF08\u65E5\u5386/\u5468\u89C6\u56FE\u8272\u5E26\uFF09\u2014\u2014 */\n.me-cal-cell--span {\n  background: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 16%, transparent);\n}\n\n.me-week-cell--span {\n  background: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 16%, transparent);\n}\n\n.me-cal-cell-span-title {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.me-cal-cell-item--span {\n  background: var(--dsw-static-blue-6, #2563eb);\n  color: #fff;\n}\n\n.me-week-cell-item--span {\n  background: var(--dsw-static-blue-6, #2563eb);\n  color: #fff;\n}\n\n/* \u2014\u2014 \u8272\u5E26\u6EA2\u51FA\u5EF6\u4F38\uFF08\u8FDE\u8D77\u683C\u5B50\u7F1D\u9699\uFF0C\u8BA9\u957F\u6761\u8FDE\u7EED\u8DE8\u8FC7\u8D77\u70B9\u6846\uFF09\u2014\u2014 */\n.me-cal-cell {\n  position: relative;\n}\n\n.me-week-cell {\n  position: relative;\n}\n\n.me-cal-cell-bleed,\n.me-week-cell-bleed {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  width: 5px;\n  background: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 16%, transparent);\n  pointer-events: none;\n  z-index: 2;\n}\n\n.me-cal-cell-bleed-left,\n.me-week-cell-bleed-left {\n  left: -5px;\n}\n\n.me-cal-cell-bleed-right,\n.me-week-cell-bleed-right {\n  right: -5px;\n}\n\n.me-cal-cell-bleed-both,\n.me-week-cell-bleed-both {\n  left: -5px;\n  right: -5px;\n  width: auto;\n}\n\n/* \u2014\u2014 \u4ECA\u5929\u300C\u4ECA\u300D\u6807\u8BB0\uFF08\u65E5\u4E8B\u6E05\u5F0F\uFF09\u2014\u2014 */\n.me-cal-cell-today-mark {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 16px;\n  height: 16px;\n  margin-left: 3px;\n  padding: 0 4px;\n  border-radius: 8px;\n  background: var(--dsw-static-red-6, #e5484d);\n  color: #fff;\n  font-size: 10px;\n  font-weight: 600;\n  line-height: 1;\n  vertical-align: 1px;\n}\n\n/* \u2014\u2014 \u683C\u5B50\u5FEB\u6377\u521B\u5EFA\u300C\uFF0B\u300D\uFF08hover \u663E\u793A\uFF09\u2014\u2014 */\n.me-cal-cell-add,\n.me-week-cell-add {\n  position: absolute;\n  top: 3px;\n  right: 3px;\n  z-index: 3;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background: var(--dsw-static-blue-5, #3b82f6);\n  color: #fff;\n  font-size: 11px;\n  line-height: 16px;\n  text-align: center;\n  cursor: pointer;\n  opacity: 0;\n  transition: opacity 120ms ease;\n  pointer-events: auto;\n}\n\n.me-cal-cell:hover .me-cal-cell-add,\n.me-week-cell:hover .me-week-cell-add {\n  opacity: 1;\n}\n\n.me-cal-cell-add:hover,\n.me-week-cell-add:hover {\n  background: var(--dsw-static-blue-6, #2563eb);\n}\n\n.me-week-cell-add {\n  position: static;\n  margin-left: auto;\n}\n\n/* \u2014\u2014 \u53F3\u4E0B\u60AC\u6D6E\u6DFB\u52A0\u6309\u94AE\uFF08\u65E5\u4E8B\u6E05\u5F0F FAB\uFF09\u2014\u2014 */\n.me-fab {\n  position: fixed;\n  right: 28px;\n  bottom: 28px;\n  z-index: 500;\n  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  border: none;\n  background: var(--dsw-static-red-6, #ff5967);\n  color: #fff;\n  font-size: 22px;\n  line-height: 1;\n  cursor: pointer;\n  box-shadow: 0 4px 14px color-mix(in srgb, #ff5967 45%, transparent);\n  transition: transform 120ms ease, box-shadow 120ms ease;\n}\n\n.me-fab:hover {\n  transform: scale(1.06);\n  box-shadow: 0 6px 18px color-mix(in srgb, #ff5967 55%, transparent);\n}\n\n/* ========== \u65E5\u4E8B\u6E05\u8BBE\u8BA1\u4EE4\u724C\u5BF9\u9F50\uFF08\u7B2C\u4E09\u8F6E\uFF09 ========== */\n.me-panel {\n  --todo-primary: #1c69ff;\n  --todo-text-main: #1d212a;\n  --todo-text-aux: #86909d;\n  --todo-bg-soft: #f7f9fb;\n  --todo-radius: 8px;\n}\n\n/* \u5217\u8868\u4E0E\u5EFA\u8BAE\u5171\u7528\u5143\u4FE1\u606F\u884C\uFF1B\u5177\u4F53\u4EFB\u52A1\u6807\u9898\u5E03\u5C40\u5728\u6700\u7EC8\u5217\u8868\u89C4\u5219\u4E2D\u5B9A\u4E49\u3002 */\n.me-item-meta {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 4px;\n  margin-top: 3px;\n}\n\n/* \u56DB\u8C61\u9650\u5BAB\u683C\u6807\u9898\u8272\u6761\uFF084px \xD7 18px\uFF0C\u65E5\u4E8B\u6E05 quad title\uFF09 */\n.me-todo-quad-bar {\n  flex: none;\n  width: 4px;\n  height: 18px;\n  border-radius: 2px;\n}\n\n/* \u4ECA\u5929\u683C\u5B50\uFF1A\u6DE1\u5E95 #f7f9fb + \u65E5\u671F\u53D8\u84DD\uFF08\u65E5\u4E8B\u6E05\uFF09 */\n.me-cal-cell--today {\n  background: var(--todo-bg-soft, #f7f9fb);\n  box-shadow: none;\n}\n\n.me-week-cell--today {\n  background: var(--todo-bg-soft, #f7f9fb);\n}\n\n.me-cal-cell--today .me-cal-cell-date,\n.me-week-cell--today .me-week-cell-date {\n  color: var(--todo-primary, #1c69ff);\n  font-weight: 600;\n}\n\n/* \u4E3B\u8272\u4E0E\u5706\u89D2\u5BF9\u9F50 */\n.me-fab {\n  background: var(--todo-primary, #1c69ff);\n  box-shadow: 0 4px 14px rgba(28, 105, 255, 0.35);\n}\n\n/* ============================================================\n * DeepSeek Harness Desktop / Codex \u5F0F\u4E2D\u6027 UI \u8986\u76D6\uFF08\u8FFD\u52A0\u5C42\uFF09\n * \u8986\u76D6\u65E7\u300C\u65E5\u4E8B\u6E05\u300D\u786C\u7F16\u7801\u6837\u5F0F\uFF1B\u989C\u8272\u4E00\u5F8B\u8D70 DSW token\uFF0C\u6697\u8272\u81EA\u9002\u5E94\uFF0C\n * \u4E0D\u5F15\u5165\u65B0\u7684 #fff \u767D\u5E95 / \u767D\u5B57\u786C\u7F16\u7801\u3002\n * ============================================================ */\n\n/* ---------- \u9762\u677F\uFF1A\u81EA\u7136\u9AD8\u5EA6 + \u547C\u5438\u95F4\u8DDD ---------- */\n.me-panel {\n  height: auto;\n  min-height: 0;\n  gap: 14px;\n  padding: 8px 6px 32px;\n}\n\n/* \u4F1A\u8BDD\u8BB0\u5FC6 Tab \u5185\uFF1A\u5F7B\u5E95\u653E\u5F00\u9AD8\u5EA6\uFF0C\u4EA4\u7ED9\u5916\u5C42\u6EDA\u52A8\uFF0C\u4E0D\u4E8C\u6B21\u622A\u65AD */\n.mt-panel .me-panel {\n  max-height: none;\n  height: auto;\n}\n\n/* \u65E7\u65E5\u4E8B\u6E05\u81EA\u5B9A\u4E49\u53D8\u91CF \u2192 DSH token\uFF08\u515C\u4F4F\u65E7\u89C4\u5219\u91CC\u7684\u5F15\u7528\uFF09 */\n.me-panel {\n  --todo-primary: var(--dsw-alias-state-business-primary);\n  --todo-text-main: var(--dsw-alias-label-primary);\n  --todo-text-aux: var(--dsw-alias-label-secondary);\n  --todo-bg-soft: color-mix(in srgb, var(--dsw-alias-state-business-primary) 8%, var(--dsw-alias-bg-layer-1));\n}\n\n/* ---------- \u5DE5\u5177\u680F\uFF1A\u6E05\u6670\u3001\u53EF\u6362\u884C ---------- */\n.me-tabs {\n  flex-wrap: wrap;\n  gap: 8px;\n  align-items: center;\n}\n\n.me-todo-filters {\n  flex-wrap: wrap;\n  gap: 8px 16px;\n}\n\n.me-todo-view-switch {\n  flex-wrap: wrap;\n  margin-left: auto;\n}\n\n/* ---------- \u6309\u94AE / \u9009\u6846 / \u8F93\u5165\uFF1A\u7EDF\u4E00 DSH token ---------- */\n.me-tab,\n.me-todo-input,\n.me-todo-select,\n.me-todo-date,\n.me-todo-filters select,\n.me-modal-row select,\n.me-modal-row input[type='date'],\n.me-modal-input,\n.me-modal-time,\n.me-modal-content,\n.me-tab-proj select {\n  border-color: var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-tab:hover,\n.me-todo-input:hover,\n.me-todo-select:hover,\n.me-todo-date:hover {\n  border-color: var(--dsw-alias-border-l3);\n}\n\n.me-tab-active {\n  border-color: var(--dsw-alias-state-business-primary);\n  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent);\n  color: var(--dsw-alias-label-primary);\n}\n\n/* \u52FE\u9009\u6846 / \u590D\u9009\u6846\uFF1A\u4E3B\u8272 token */\n.me-todo-filter-check input,\n.me-scope-opt input {\n  accent-color: var(--dsw-alias-state-business-primary);\n}\n\n/* ---------- \u5217\u8868\u4EFB\u52A1\u884C & \u770B\u677F\u5361\u7247\uFF1A\u4E2D\u6027\u5361\u7247 ---------- */\n.me-todo-item {\n  transition: border-color 120ms ease, background-color 120ms ease;\n}\n\n/* Remaining and overdue labels share typography; only the warning color changes. */\n.me-todo-days,\n.me-week-cell-delay {\n  margin-left: 8px;\n  font-size: 12px;\n  font-weight: 600;\n  line-height: 1.45;\n  white-space: nowrap;\n  color: var(--dsw-alias-state-business-primary);\n}\n\n.me-todo-days--overdue,\n.me-week-cell-delay {\n  color: var(--dsw-alias-state-error-primary) !important;\n}\n\n/* ---------- \u884C\u5185\u64CD\u4F5C\uFF1A\u9ED8\u8BA4\u4F4E\u900F\u660E\uFF0Chover / focus \u663E\u73B0 ---------- */\n.me-todo-item .me-item-actions,\n.me-todo-card-foot .me-item-actions {\n  opacity: 0.35;\n  transition: opacity 120ms ease;\n}\n\n.me-todo-item:hover .me-item-actions,\n.me-todo-card:hover .me-item-actions,\n.me-todo-item:focus-within .me-item-actions,\n.me-todo-card:focus-within .me-item-actions {\n  opacity: 1;\n}\n\n/* ---------- \u5FBD\u6807\u5F31\u5316\uFF1A\u53BB\u5F69\u8272\uFF0C\u7EDF\u4E00\u4E3A\u6B21\u7EA7\u4E2D\u6027 ---------- */\n.me-badge,\n.me-badge-day,\n.me-badge-quad,\n.me-badge-quad-q1,\n.me-badge-quad-q2,\n.me-badge-quad-q3,\n.me-badge-quad-q4,\n.me-badge-quad-none,\n.me-badge-status,\n.me-badge-status-pending,\n.me-badge-status-doing,\n.me-badge-status-done,\n.me-badge-status-blocked,\n.me-badge-status-cancelled,\n.me-badge-proj,\n.me-badge-who,\n.me-badge-repeat,\n.me-badge-range,\n.me-badge-overdue,\n.me-badge-due {\n  color: var(--dsw-alias-label-secondary);\n  background: var(--dsw-alias-interactive-bg-active);\n  border-color: transparent;\n}\n\n/* ---------- \u770B\u677F\uFF1A\u4E0D\u622A\u65AD\u9AD8\u5EA6 ---------- */\n.me-todo-board {\n  max-height: none;\n  min-height: 0;\n  grid-template-rows: minmax(140px, auto) minmax(140px, auto);\n}\n\n@media (max-width: 720px) {\n  .me-todo-board {\n    grid-template-rows: none;\n  }\n}\n\n/* ---------- \u65E5\u5386 / \u5468 / \u9879\u76EE\u89C6\u56FE\uFF1A\u7EDF\u4E00 token ---------- */\n.me-cal-cell,\n.me-week-cell,\n.me-proj-group {\n  background: var(--dsw-alias-bg-layer-1);\n  border-color: var(--dsw-alias-border-l2);\n}\n\n.me-cal-cell:hover,\n.me-week-cell:hover {\n  border-color: var(--dsw-alias-border-l3);\n}\n\n.me-cal-cell--today,\n.me-week-cell--today {\n  background: var(--todo-bg-soft, color-mix(in srgb, var(--dsw-alias-state-business-primary) 8%, var(--dsw-alias-bg-layer-1)));\n  box-shadow: inset 0 0 0 1px var(--dsw-alias-state-business-primary);\n}\n\n.me-cal-cell--today .me-cal-cell-date,\n.me-week-cell--today .me-week-cell-date {\n  color: var(--dsw-alias-state-business-primary);\n}\n\n/* ---------- Modal\uFF1A\u906E\u7F69 token\u3001\u66F4\u5BBD\u66F4\u5E72\u51C0 ---------- */\n.me-modal {\n  background: color-mix(in srgb, #000 45%, transparent);\n  backdrop-filter: blur(3px);\n}\n\n.me-modal-box {\n  max-width: 520px;\n  max-height: 88vh;\n  padding: 18px;\n  border-color: var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-layer-1);\n  box-shadow: 0 12px 40px color-mix(in srgb, #000 30%, transparent);\n}\n\n.me-modal-title {\n  color: var(--dsw-alias-label-primary);\n}\n\n/* \u9009\u4E2D\u65E5\u671F / \u4ECA\u6807\u8BB0 / \u5FEB\u6377\uFF0B / \u52FE\u9009\u5706\u70B9\uFF1A\u767D\u5B57\u6539 on-primary token */\n.me-modal-dates-day--sel,\n.me-cal-cell-today-mark,\n.me-cal-cell-add,\n.me-week-cell-add,\n.me-todo-check {\n  color: var(--dsw-alias-label-on-primary, var(--dsw-static-neutral-00));\n}\n\n.me-modal-dates-day--sel {\n  background: var(--dsw-alias-state-business-primary);\n}\n\n.me-cal-cell-add,\n.me-week-cell-add {\n  background: var(--dsw-alias-state-business-primary);\n}\n\n.me-cal-cell-add:hover,\n.me-week-cell-add:hover {\n  background: var(--dsw-alias-state-business-primary);\n}\n\n.me-cal-cell-item--span,\n.me-week-cell-item--span {\n  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 85%, transparent);\n  color: var(--dsw-alias-label-on-primary, var(--dsw-static-neutral-00));\n}\n\n/* ---------- FAB\uFF1A\u684C\u9762\u9690\u85CF\uFF0C\u7A84\u5C4F\u624D\u663E\u793A\u5C0F\u5C3A\u5BF8 ---------- */\n.me-fab {\n  display: none;\n}\n\n@media (max-width: 640px) {\n  .me-fab {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 40px;\n    height: 40px;\n    right: 16px;\n    bottom: 16px;\n    font-size: 18px;\n    background: var(--dsw-alias-state-business-primary);\n    color: var(--dsw-alias-label-on-primary, var(--dsw-static-neutral-00));\n    box-shadow: 0 4px 14px color-mix(in srgb, var(--dsw-alias-state-business-primary) 35%, transparent);\n  }\n\n  .me-fab:hover {\n    background: var(--dsw-alias-state-business-primary);\n    box-shadow: 0 6px 18px color-mix(in srgb, var(--dsw-alias-state-business-primary) 45%, transparent);\n  }\n}\n\n/* ---------- \u54CD\u5E94\u5F0F\u5DE5\u5177\u680F ---------- */\n@media (max-width: 720px) {\n  .me-todo-filters {\n    width: 100%;\n    justify-content: flex-start;\n  }\n\n  .me-todo-view-switch {\n    width: 100%;\n    margin-left: 0;\n  }\n\n  .me-todo-view-btn {\n    flex: 1;\n    text-align: center;\n  }\n\n  .me-todo-add {\n    flex-wrap: wrap;\n    width: 100%;\n  }\n\n  .me-todo-input {\n    flex: 1 1 100%;\n  }\n}\n\n/* ============================================================\n * DSH / Codex Calendar surface\n * The component supplies the grid coordinates and lane variables;\n * this layer owns geometry, scrolling, and theme-safe presentation.\n * ============================================================ */\n\n.me-panel {\n  --me-blue: var(--dsw-alias-state-business-primary, var(--dsw-static-blue-6, #2563eb));\n  --me-blue-strong: var(--dsw-static-blue-6, #2563eb);\n  --me-blue-soft: color-mix(in srgb, var(--me-blue) 10%, var(--dsw-alias-bg-layer-1));\n  --me-blue-muted: color-mix(in srgb, var(--me-blue) 14%, var(--dsw-alias-bg-layer-1));\n  --me-span-track-height: 20px;\n  --me-span-height: 16px;\n  --me-span-track-padding: 2px;\n  --me-span-fill: var(--me-blue-strong);\n  --me-span-color: var(--dsw-alias-label-on-primary, var(--dsw-static-neutral-00, #fff));\n  --me-span-preview-fill: color-mix(in srgb, var(--me-span-fill) 24%, transparent);\n  --me-span-drag-fill: color-mix(in srgb, var(--me-span-fill) 72%, var(--dsw-alias-bg-layer-1));\n  --me-span-drop-color: var(--me-blue-strong);\n  --me-span-done-fill: var(--dsw-alias-label-tertiary);\n  --me-span-done-color: var(--dsw-alias-bg-base);\n  --me-span-radius: 4px;\n}\n\n/* Keep narrow-pane overflow inside each toolbar instead of widening the panel. */\n.me-tabs,\n.me-todo-filters {\n  width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  flex-wrap: nowrap;\n  overflow-x: auto;\n  scrollbar-width: thin;\n  padding-bottom: 2px;\n}\n\n.me-tabs > *,\n.me-todo-filters > * {\n  flex: none;\n  white-space: nowrap;\n}\n\n.me-tabs-spacer {\n  flex: 1 1 0%;\n}\n\n.me-todo-view-switch {\n  flex: none;\n  margin-left: auto;\n  flex-wrap: nowrap;\n}\n\n.me-todo-view-btn {\n  flex: none;\n  white-space: nowrap;\n}\n\n/* Completion is a square control with an explicit border in every theme. */\n.me-todo-check {\n  appearance: none;\n  flex: 0 0 18px;\n  width: 18px;\n  height: 18px;\n  box-sizing: border-box;\n  margin: 2px 0 0;\n  padding: 0;\n  border: 1.5px solid var(--me-blue-strong);\n  border-radius: 4px;\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-on-primary, var(--dsw-static-neutral-00, #fff));\n  font-size: 12px;\n  font-weight: 700;\n  line-height: 16px;\n  text-align: center;\n  cursor: pointer;\n  opacity: 1;\n}\n\n.me-todo-check:hover:not(:disabled) {\n  background: var(--me-blue-muted);\n  border-color: var(--me-blue-strong);\n}\n\n.me-todo-check:focus-visible {\n  outline: 2px solid var(--me-blue-strong);\n  outline-offset: 2px;\n}\n\n.me-todo-check--done,\n.me-todo-check--done:hover:not(:disabled) {\n  border-color: var(--me-blue-strong);\n  background: var(--me-blue-strong);\n  color: var(--dsw-alias-label-on-primary, var(--dsw-static-neutral-00, #fff));\n}\n\n/* Success/completion meanings use the same blue family; red and amber remain semantic. */\n.me-btn-ok,\n.me-badge-status-done,\n.me-todo-days,\n.me-notice-ok {\n  color: var(--me-blue-strong);\n}\n\n.me-btn-ok {\n  border-color: var(--me-blue-strong);\n}\n\n.me-btn-ok:hover:not(:disabled),\n.me-notice-ok {\n  background: var(--me-blue-muted);\n}\n\n.me-notice-ok {\n  border-color: var(--me-blue-strong);\n}\n\n.me-notice-ok::before {\n  background: var(--me-blue-strong);\n}\n\n.me-badge-status-done {\n  background: color-mix(in srgb, var(--me-blue-strong) 14%, transparent);\n  border-color: color-mix(in srgb, var(--me-blue-strong) 40%, transparent);\n}\n\n.me-todo-days {\n  color: var(--me-blue-strong);\n}\n\n.me-badge-who {\n  background: color-mix(in srgb, var(--me-blue-strong) 14%, transparent);\n  color: var(--me-blue-strong);\n}\n\n/* Calendar root and navigation. */\n.me-calendar-scroll {\n  width: 100%;\n  min-width: 0;\n  overflow-x: auto;\n  overflow-y: visible;\n  scrollbar-width: thin;\n  overscroll-behavior-x: contain;\n}\n\n.me-calendar-surface,\n.me-week-surface {\n  min-width: 720px;\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-cal-nav {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  flex: none;\n}\n\n.me-icon-btn {\n  width: 28px;\n  min-width: 28px;\n  height: 28px;\n  padding: 0;\n  font-size: 18px;\n  line-height: 1;\n}\n\n.me-cal-head {\n  width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  align-items: center;\n  gap: 12px;\n  overflow-x: auto;\n  scrollbar-width: thin;\n}\n\n.me-cal-head > * {\n  flex: none;\n  white-space: nowrap;\n}\n\n.me-cal-head > .me-cal-title {\n  flex: 1 0 140px;\n  min-width: 140px;\n}\n\n/* Monthly grid: each week is one stacked date row with a spanning event layer. */\n.me-cal-weekdays,\n.me-cal-days,\n.me-cal-span-layer {\n  display: grid;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  column-gap: 4px;\n}\n\n.me-cal-weekdays {\n  min-height: 28px;\n  align-items: center;\n  border-bottom: 1px solid var(--dsw-alias-border-l2);\n}\n\n.me-cal-weekday {\n  min-width: 0;\n  text-align: center;\n  font-size: 11px;\n  font-weight: 600;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.me-cal-row {\n  --me-cal-date-head-height: 30px;\n  --me-cal-row-bottom-padding: 6px;\n  --me-cal-row-min-height: max(\n    84px,\n    calc(\n      var(--me-cal-date-head-height)\n      + (var(--me-span-lanes, 0) * var(--me-span-track-height))\n      + var(--me-cal-row-bottom-padding)\n    )\n  );\n  position: relative;\n  isolation: isolate;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr);\n  grid-template-rows: minmax(var(--me-cal-row-min-height), auto);\n  min-height: var(--me-cal-row-min-height);\n  overflow: hidden;\n  border-bottom: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-layer-1);\n}\n\n.me-cal-days,\n.me-cal-span-layer {\n  grid-area: 1 / 1;\n  width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n}\n\n.me-cal-days {\n  position: relative;\n  z-index: 1;\n  min-height: var(--me-cal-row-min-height);\n  align-items: stretch;\n}\n\n.me-cal-cell {\n  min-width: 0;\n  min-height: var(--me-cal-row-min-height);\n  margin: 0;\n  padding: 6px 6px 5px;\n  border-width: 0 1px 0 0;\n  border-radius: 0;\n  background: var(--dsw-alias-bg-layer-1);\n}\n\n.me-cal-cell:last-child {\n  border-right: 0;\n}\n\n.me-cal-cell:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n  border-color: var(--dsw-alias-border-l2);\n}\n\n.me-cal-cell--out {\n  opacity: 0.42;\n}\n\n.me-cal-cell--today,\n.me-cal-cell--selected {\n  background: var(--me-blue-soft);\n}\n\n.me-cal-cell--today .me-cal-cell-date {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  background: var(--me-blue-strong);\n  color: var(--dsw-alias-label-on-primary, var(--dsw-static-neutral-00, #fff));\n}\n\n.me-cal-cell-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  min-height: 22px;\n}\n\n.me-cal-cell-select {\n  min-width: 24px;\n  height: 24px;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  border-radius: 4px;\n  background: transparent;\n  color: inherit;\n  font: inherit;\n  text-align: center;\n  cursor: pointer;\n}\n\n.me-cal-cell-select:hover,\n.me-cal-cell-select:focus-visible {\n  background: var(--me-blue-muted);\n  outline: none;\n}\n\n.me-cal-cell-date {\n  font-size: 12px;\n  font-weight: 600;\n  line-height: 22px;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.me-cal-cell-add {\n  position: static;\n  display: inline-flex;\n  flex: 0 0 18px;\n  align-items: center;\n  justify-content: center;\n  width: 18px;\n  height: 18px;\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 4px;\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 14px;\n  line-height: 1;\n  text-align: center;\n  opacity: 0;\n}\n\n.me-cal-cell:hover .me-cal-cell-add,\n.me-cal-cell:focus-within .me-cal-cell-add {\n  opacity: 1;\n}\n\n.me-cal-cell-add:hover {\n  background: var(--me-blue-muted);\n  border-color: var(--me-blue-strong);\n  color: var(--me-blue-strong);\n}\n\n.me-cal-cell-items {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  min-width: 0;\n  margin-top: 5px;\n}\n\n.me-cal-cell-item {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n  gap: 4px;\n  padding: 2px 4px;\n  border-radius: 3px;\n  background: var(--dsw-alias-interactive-bg-active);\n  color: var(--dsw-alias-label-primary);\n  font-size: 10px;\n  line-height: 14px;\n}\n\n.me-cal-cell-item--done {\n  opacity: 0.55;\n  text-decoration: line-through;\n}\n\n.me-cal-event-dot {\n  flex: 0 0 5px;\n  width: 5px;\n  height: 5px;\n  border-radius: 50%;\n  background: var(--me-blue-strong);\n}\n\n.me-cal-cell-more {\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 10px;\n  line-height: 14px;\n}\n\n/* The monthly event layer stays in the date row and grows it through lane tracks. */\n.me-cal-span-layer {\n  grid-area: 1 / 1;\n  position: relative;\n  z-index: 2;\n  min-height: var(--me-cal-row-min-height);\n  align-items: start;\n  grid-template-rows: repeat(var(--me-span-lanes, 0), var(--me-span-track-height));\n  padding: var(--me-cal-date-head-height) 0 var(--me-cal-row-bottom-padding);\n  pointer-events: none;\n}\n\n.me-calendar-span {\n  grid-row: calc(var(--me-span-lane, 0) + 1);\n  align-self: center;\n  min-width: 0;\n  height: var(--me-span-height);\n  box-sizing: border-box;\n  margin: 0 3px;\n  padding: 1px 8px;\n  overflow: hidden;\n  border: 0;\n  border-radius: var(--me-span-radius);\n  background: color-mix(in srgb, var(--me-span-fill, var(--me-blue-strong)) 16%, var(--dsw-alias-bg-base));\n  color: color-mix(in srgb, var(--me-span-fill, var(--me-blue-strong)) 80%, var(--dsw-alias-label-primary));\n  font: inherit;\n  font-size: 11px;\n  font-weight: 600;\n  line-height: 16px;\n  text-align: left;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  pointer-events: auto;\n  cursor: pointer;\n}\n\n.me-calendar-span-delay {\n  flex: none;\n  margin-left: 6px;\n  color: var(--dsw-static-red-5, #e5484d);\n  font-size: 10px;\n  font-weight: 600;\n}\n\n.me-calendar-span::before,\n.me-calendar-span::after {\n  content: none;\n}\n\n.me-calendar-span--before {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n  opacity: 0.82;\n}\n\n.me-calendar-span--after {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n  opacity: 0.82;\n}\n\n.me-calendar-span--done {\n  background: var(--me-span-done-fill);\n  color: var(--me-span-done-color);\n  text-decoration: line-through;\n}\n\n/* macOS-calendar style overflow entry: sits in the last visible lane, right side. */\n.me-calendar-more {\n  grid-column: 1 / -1;\n  grid-row: calc(var(--me-span-lanes, 0));\n  justify-self: end;\n  align-self: center;\n  margin: 0 3px;\n  padding: 0 8px;\n  border: 0;\n  border-radius: var(--me-span-radius);\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  font: inherit;\n  font-size: 10px;\n  line-height: 16px;\n  cursor: pointer;\n  pointer-events: auto;\n}\n\n.me-calendar-more:hover,\n.me-calendar-more:focus-visible {\n  background: var(--me-blue-muted);\n  color: var(--me-blue-strong);\n  outline: none;\n}\n\n.me-calendar-detail-list {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n\n/* Weekly surface: fixed seven columns inside an overflow container. */\n.me-week-surface {\n  overflow: hidden;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 6px;\n  background: var(--dsw-alias-bg-layer-1);\n}\n\n.me-week-headers,\n.me-week-columns {\n  display: grid;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  column-gap: 0;\n}\n\n.me-week-headers {\n  border-bottom: 1px solid var(--dsw-alias-border-l2);\n}\n\n.me-week-date-head {\n  position: relative;\n  min-width: 0;\n  min-height: 54px;\n  padding: 8px 6px 6px;\n  border: 0;\n  border-right: 1px solid var(--dsw-alias-border-l2);\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  font: inherit;\n  text-align: center;\n  cursor: pointer;\n}\n\n.me-week-date-head:last-child {\n  border-right: 0;\n}\n\n.me-week-date-head span {\n  display: block;\n  font-size: 11px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.me-week-date-head strong {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 26px;\n  height: 26px;\n  margin-top: 3px;\n  border-radius: 50%;\n  font-size: 15px;\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-week-date-head:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.me-week-date-head--today strong {\n  background: var(--me-blue-strong);\n  color: var(--dsw-alias-label-on-primary, var(--dsw-static-neutral-00, #fff));\n}\n\n.me-week-date-head--selected {\n  background: var(--me-blue-soft);\n}\n\n/* Week view is day-card based; the legacy full-week strip is intentionally retired. */\n.me-week-all-day,\n.me-week-span-layer {\n  display: none;\n}\n\n.me-week-columns {\n  min-height: 128px;\n  align-items: stretch;\n}\n\n.me-week-column {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  min-width: 0;\n  min-height: 128px;\n  padding: 8px 5px;\n  border-right: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-layer-1);\n}\n\n.me-week-column:last-child {\n  border-right: 0;\n}\n\n.me-week-column--today {\n  background: var(--me-blue-soft);\n}\n\n.me-week-column-add {\n  align-self: flex-end;\n  width: 18px;\n  height: 18px;\n  margin: -3px -2px 0 0;\n  padding: 0;\n  border: 0;\n  border-radius: 4px;\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 14px;\n  line-height: 18px;\n  opacity: 0;\n  cursor: pointer;\n}\n\n.me-week-column:hover .me-week-column-add,\n.me-week-column:focus-within .me-week-column-add {\n  opacity: 1;\n}\n\n.me-week-column-add:hover {\n  background: var(--me-blue-muted);\n  color: var(--me-blue-strong);\n}\n\n.me-week-event {\n  --me-span-drop-color: var(--me-week-accent, var(--me-blue-strong));\n  position: relative;\n  display: grid;\n  grid-template-columns: 6px minmax(0, 1fr);\n  grid-auto-rows: min-content;\n  align-items: start;\n  gap: 3px 6px;\n  width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  padding: 6px 7px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-left: 3px solid var(--me-week-accent, var(--me-blue-strong));\n  border-radius: 5px;\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n  box-shadow: 0 1px 2px color-mix(in srgb, var(--dsw-alias-label-primary) 8%, transparent);\n  font: inherit;\n  font-size: 12px;\n  line-height: 16px;\n  text-align: left;\n  cursor: pointer;\n  touch-action: auto;\n}\n\n.me-week-event:hover,\n.me-week-event:focus-visible {\n  border-color: color-mix(in srgb, var(--me-week-accent, var(--me-blue-strong)) 46%, var(--dsw-alias-border-l2));\n  border-left-color: var(--me-week-accent, var(--me-blue-strong));\n  background: color-mix(in srgb, var(--me-week-accent, var(--me-blue-strong)) 7%, var(--dsw-alias-bg-base));\n  outline: none;\n}\n\n.me-week-event .me-cal-event-dot {\n  grid-column: 1;\n  grid-row: 1;\n  align-self: center;\n  margin-top: 4px;\n  background: var(--me-week-accent, var(--me-blue-strong));\n}\n\n.me-week-event--range {\n  background: color-mix(in srgb, var(--me-week-accent, var(--me-blue-strong)) 5%, var(--dsw-alias-bg-base));\n}\n\n.me-week-event--draft {\n  border-style: dashed;\n  border-color: var(--me-week-accent, var(--me-blue-strong));\n  background: color-mix(in srgb, var(--me-week-accent, var(--me-blue-strong)) 10%, var(--dsw-alias-bg-base));\n  opacity: 0.68;\n  pointer-events: none;\n}\n\n.me-week-event--dragging,\n.me-week-event--dragging:hover {\n  z-index: 4;\n  border-color: var(--me-week-accent, var(--me-blue-strong));\n  background: color-mix(in srgb, var(--me-week-accent, var(--me-blue-strong)) 12%, var(--dsw-alias-bg-base));\n  box-shadow: 0 3px 10px color-mix(in srgb, var(--me-week-accent, var(--me-blue-strong)) 22%, transparent);\n  cursor: grabbing;\n  touch-action: none;\n  opacity: 0.8;\n}\n\n.me-week-event--done {\n  background: var(--dsw-alias-interactive-bg-active);\n  border-color: var(--dsw-alias-border-l2);\n  color: var(--dsw-alias-label-tertiary);\n  opacity: 1;\n}\n\n.me-week-event--done .me-week-event-title {\n  text-decoration: line-through;\n}\n\n.me-week-event-title {\n  grid-column: 2;\n  min-width: 0;\n  overflow: hidden;\n  color: var(--dsw-alias-label-primary);\n  font-size: 13px;\n  font-weight: 600;\n  line-height: 1.4;\n  overflow-wrap: anywhere;\n  white-space: normal;\n}\n\n.me-week-event-meta {\n  grid-column: 2;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 2px 5px;\n  min-width: 0;\n  margin: 0;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n  line-height: 1.4;\n  overflow-wrap: anywhere;\n}\n\n.me-week-event-meta:empty {\n  display: none;\n}\n\n.me-week-event-meta > span {\n  min-width: 0;\n  max-width: 100%;\n  overflow-wrap: anywhere;\n}\n\n.me-week-event-meta > span + span::before {\n  content: '\xB7';\n  margin-right: 5px;\n  color: var(--dsw-alias-border-l3);\n}\n\n/* Today badges are boxed labels; separators would look like stray symbols. */\n.me-today .me-week-event-meta > span + span::before,\n.me-today .me-week-event-meta .me-badge + .me-badge::before {\n  content: none;\n  margin-right: 0;\n}\n\n.me-week-event-schedule,\n.me-week-event .me-week-cell-delay {\n  grid-column: 2;\n  display: block;\n  min-width: 0;\n  margin: 0;\n  overflow-wrap: anywhere;\n  white-space: normal;\n}\n\n.me-week-event-schedule {\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n  line-height: 1.4;\n  font-variant-numeric: tabular-nums;\n}\n\n.me-week-event--range .me-week-event-schedule {\n  color: color-mix(in srgb, var(--me-week-accent, var(--me-blue-strong)) 72%, var(--dsw-alias-label-primary));\n}\n\n.me-week-event .me-week-cell-delay {\n  color: var(--dsw-alias-state-error-primary);\n}\n\n/* \u4ECA\u65E5\u89C6\u56FE\u5361\u7247\uFF1A\u590D\u7528\u5468\u89C6\u56FE\u4FE1\u606F\u5361\u7247\u7ED3\u6784\uFF0C\u4F46\u7B2C\u4E00\u5217\u653E\u5B8C\u6210\u52FE\u9009\u6846\uFF08\u66FF\u4EE3\u5706\u70B9\uFF09\u3002 */\n.me-week-event--today {\n  grid-template-columns: 18px minmax(0, 1fr);\n  cursor: default;\n}\n\n.me-week-event--today .me-todo-check {\n  grid-column: 1;\n  grid-row: 1;\n  align-self: start;\n  margin-top: 1px;\n}\n\n.me-week-event--today .me-week-event-title {\n  grid-column: 2;\n}\n\n.me-week-event--today .me-week-event-meta,\n.me-week-event--today .me-week-event-schedule,\n.me-week-event--today .me-week-cell-delay {\n  grid-column: 2;\n}\n\n/* Completed items in the Today sidebar are deliberately subdued. */\n.me-week-event--today.me-week-event--done {\n  background: color-mix(in srgb, var(--dsw-alias-bg-layer-2) 82%, var(--dsw-alias-label-tertiary));\n  border-color: var(--dsw-alias-border-l2);\n  color: var(--dsw-alias-label-tertiary);\n  opacity: 0.58;\n}\n\n.me-week-event--today.me-week-event--done .me-week-event-title,\n.me-week-event--today.me-week-event--done .me-week-event-meta,\n.me-week-event--today.me-week-event--done .me-week-event-schedule,\n.me-week-event--today.me-week-event--done .me-week-cell-delay {\n  color: var(--dsw-alias-label-tertiary);\n  text-decoration: line-through;\n}\n\n.me-week-event--today.me-week-event--done .me-todo-check {\n  border-color: var(--dsw-alias-label-tertiary);\n  background: var(--dsw-alias-label-tertiary);\n}\n\n.me-week-empty {\n  flex: 1;\n  min-height: 48px;\n}\n\n/* Narrow panes scroll the calendar at a stable width instead of collapsing text. */\n@media (max-width: 720px) {\n  .me-calendar-scroll {\n    margin-inline: -2px;\n    padding-inline: 2px;\n  }\n\n  .me-calendar-surface,\n  .me-week-surface {\n    min-width: 680px;\n  }\n\n  .me-cal-head {\n    padding-bottom: 2px;\n  }\n}\n\n@media (hover: none), (pointer: coarse) {\n  .me-cal-cell-add,\n  .me-week-column-add {\n    opacity: 1;\n  }\n}\n\n/* ============================================================\n * Calendar drag interaction states\n * These classes are state hooks supplied by the calendar controller.\n * ============================================================ */\n\n/* A pending range is a visual preview only and must not intercept input. */\n.me-calendar-span--draft {\n  border: 1px dashed var(--me-span-drop-color);\n  background: var(--me-span-preview-fill);\n  color: var(--me-span-drop-color);\n  opacity: 0.58;\n  pointer-events: none;\n}\n\n/* Keep native desktop dragging without blocking ordinary touch scrolling. */\n.me-calendar-span,\n.me-calendar-span--dragging {\n  cursor: grab;\n}\n\n.me-calendar-span {\n  touch-action: auto;\n}\n\n.me-calendar-span--dragging {\n  cursor: grabbing;\n  touch-action: none;\n  z-index: 4;\n  opacity: 0.82;\n  border: 1px solid color-mix(in srgb, var(--me-span-fill) 72%, transparent);\n  background: var(--me-span-drag-fill);\n  box-shadow: 0 2px 8px color-mix(in srgb, var(--me-span-fill) 26%, transparent);\n}\n\n.me-calendar-span--dragging,\n.me-calendar-span--dragging:hover {\n  cursor: grabbing;\n}\n\n/* Drop target guides: before = upper insertion line, after = lower line. */\n.me-calendar-span--drop-before,\n.me-calendar-span--drop-after {\n  position: relative;\n}\n\n.me-calendar-span--drop-before::before,\n.me-calendar-span--drop-after::after {\n  content: '';\n  position: absolute;\n  left: 0;\n  right: 0;\n  z-index: 5;\n  height: 2px;\n  border-radius: 1px;\n  background: var(--me-span-drop-color);\n  pointer-events: none;\n}\n\n.me-calendar-span--drop-before::before {\n  top: -1px;\n  box-shadow: 0 0 0 1px color-mix(in srgb, var(--me-span-drop-color) 22%, transparent);\n}\n\n.me-calendar-span--drop-after::after {\n  bottom: -1px;\n  box-shadow: 0 0 0 1px color-mix(in srgb, var(--me-span-drop-color) 22%, transparent);\n}\n\n/* Date surfaces scroll normally until the range gesture becomes active. */\n.me-cal-cell,\n.me-week-date-head,\n.me-week-column {\n  touch-action: pan-x pan-y;\n}\n\n/* The selected drag range keeps the day cell visibly in the active target state. */\n.me-cal-cell--range-drag {\n  touch-action: none;\n  background: color-mix(in srgb, var(--me-blue-strong) 14%, var(--dsw-alias-bg-layer-1));\n  box-shadow: inset 0 0 0 2px var(--me-blue-strong);\n}\n\n.me-cal-cell--range-drag .me-cal-cell-date {\n  color: var(--me-blue-strong);\n  font-weight: 700;\n}\n\n.me-cal-cell--range-drag::after {\n  content: '';\n  position: absolute;\n  inset: 3px;\n  border: 1px dashed color-mix(in srgb, var(--me-blue-strong) 68%, transparent);\n  border-radius: 3px;\n  pointer-events: none;\n}\n\n/* ============================================================\n * \u4ECA\u65E5\u89C6\u56FE\uFF08\u4FA7\u8FB9\u680F\u7EAF\u4ECA\u65E5 + \u9876\u90E8\u591A\u89C6\u56FE\u4E2D\u7684\u300C\u4ECA\u65E5\u300D\uFF09\n * \u5355\u65E5\u4EFB\u52A1\u5361\u7247\u5217\u8868\uFF1A\u6807\u9898 + \u9879\u76EE/\u8D1F\u8D23\u4EBA + \u8D77\u6B62/\u5468\u671F + \u903E\u671F\u3002\n * ============================================================ */\n.me-today {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  min-width: 0;\n}\n\n.me-today-head {\n  display: flex;\n  align-items: baseline;\n  flex-wrap: wrap;\n  gap: 6px 10px;\n  min-width: 0;\n}\n\n.me-today-title {\n  font-size: 15px;\n  font-weight: 700;\n  color: var(--dsw-alias-label-primary);\n}\n\n.me-today-date {\n  font-size: 12px;\n  color: var(--dsw-alias-label-secondary);\n  font-variant-numeric: tabular-nums;\n}\n\n.me-today-overdue {\n  font-size: 11px;\n  font-weight: 600;\n  color: var(--dsw-alias-state-error-primary);\n}\n\n.me-today-head .me-add-btn {\n  margin-left: auto;\n}\n\n.me-today-list {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  min-width: 0;\n}\n\n/* ============================================================\n * Final macOS-style todo visual system\n * One neutral surface language; project colors are accents only.\n * ============================================================ */\n.me-panel {\n  --todo-ui-card: color-mix(in srgb, var(--dsw-alias-bg-base) 94%, var(--dsw-alias-bg-layer-1));\n  --todo-ui-card-hover: color-mix(in srgb, var(--dsw-alias-bg-base) 88%, var(--dsw-alias-interactive-bg-hover));\n  --todo-ui-border: var(--dsw-alias-border-l2);\n  --todo-ui-border-strong: var(--dsw-alias-border-l3);\n  --todo-ui-radius: 8px;\n  --todo-ui-control-radius: 6px;\n  gap: 12px;\n  padding: 8px 4px 24px;\n  font-size: 13px;\n  line-height: 1.45;\n}\n\n/* Toolbars remain unframed and compact, like native macOS controls. */\n.me-tabs,\n.me-todo-filters,\n.me-cal-head,\n.me-proj-toolbar,\n.me-today-head {\n  gap: 8px;\n  padding-inline: 4px;\n}\n\n.me-todo-view-switch {\n  gap: 2px;\n  padding: 2px;\n  overflow: visible;\n  border-color: var(--todo-ui-border);\n  border-radius: 8px;\n  background: var(--dsw-alias-bg-layer-2);\n}\n\n.me-todo-view-btn {\n  min-height: 26px;\n  padding: 3px 10px;\n  border-radius: var(--todo-ui-control-radius);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.me-todo-view-btn-active {\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n  box-shadow: 0 1px 2px color-mix(in srgb, var(--dsw-alias-label-primary) 10%, transparent);\n}\n\n.me-btn,\n.me-tab,\n.me-todo-filters select,\n.me-tab-proj select {\n  min-height: 28px;\n  border-radius: var(--todo-ui-control-radius);\n  font-size: 12px;\n  letter-spacing: 0;\n}\n\n.me-btn {\n  border-color: var(--todo-ui-border);\n  background: var(--dsw-alias-bg-base);\n  box-shadow: none;\n}\n\n.me-btn:hover:not(:disabled) {\n  border-color: var(--todo-ui-border-strong);\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.me-btn-primary {\n  border-color: var(--dsw-alias-state-business-primary);\n  background: var(--dsw-alias-state-business-primary);\n  color: var(--dsw-alias-label-on-primary, var(--dsw-static-neutral-00, #fff));\n}\n\n.me-icon-btn {\n  width: 28px;\n  min-width: 28px;\n  padding: 0;\n}\n\n/* One card language for list, project, week and today. */\n.me-todo-item,\n.me-todo-card,\n.me-week-event {\n  border: 1px solid var(--todo-ui-border);\n  border-radius: var(--todo-ui-radius);\n  background: var(--todo-ui-card);\n  box-shadow: none;\n}\n\n.me-todo-item:hover,\n.me-todo-card:hover,\n.me-week-event:hover,\n.me-week-event:focus-visible {\n  border-color: var(--todo-ui-border-strong);\n  background: var(--todo-ui-card-hover);\n  box-shadow: none;\n}\n\n.me-todo-card-bar {\n  width: 3px;\n}\n\n.me-todo-card-main {\n  gap: 6px;\n  padding: 9px 10px;\n}\n\n.me-todo-card-head {\n  gap: 8px;\n}\n\n.me-todo-text,\n.me-todo-card-title,\n.me-week-event-title {\n  font-size: 14px;\n  font-weight: 600;\n  line-height: 1.45;\n  letter-spacing: 0;\n}\n\n.me-todo-card-body,\n.me-todo-card-meta,\n.me-item-meta,\n.me-week-event-meta,\n.me-week-event-schedule,\n.me-proj-count,\n.me-today-date {\n  font-size: 12px;\n  line-height: 1.45;\n}\n\n.me-todo-card-meta,\n.me-item-meta,\n.me-week-event-meta {\n  color: var(--dsw-alias-label-secondary);\n}\n\n.me-item-time {\n  font-size: 11px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.me-badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  min-height: 19px;\n  padding: 1px 7px;\n  border-radius: 5px;\n  font-size: 11px;\n  font-weight: 500;\n  line-height: 1.2;\n  letter-spacing: 0;\n  text-align: center;\n  vertical-align: middle;\n}\n\n.me-todo-card-foot {\n  margin-top: 0;\n  gap: 8px;\n}\n\n.me-todo-card-foot .me-btn {\n  min-height: 24px;\n  padding: 2px 7px;\n  font-size: 11px;\n}\n\n/* Week and Today share the same information card. */\n.me-week-event {\n  grid-template-columns: 7px minmax(0, 1fr);\n  gap: 4px 8px;\n  padding: 8px 9px;\n  border-left: 3px solid var(--me-week-accent, var(--me-blue-strong));\n  background: var(--todo-ui-card);\n  font-size: 12px;\n  line-height: 1.45;\n}\n\n.me-week-event:hover,\n.me-week-event:focus-visible {\n  background: var(--todo-ui-card-hover);\n}\n\n.me-week-event .me-cal-event-dot {\n  width: 6px;\n  height: 6px;\n  margin-top: 6px;\n}\n\n.me-week-event-title {\n  font-size: 14px;\n}\n\n.me-week-event-meta,\n.me-week-event-schedule,\n.me-week-event .me-week-cell-delay {\n  font-size: 12px;\n}\n\n.me-week-event--today {\n  grid-template-columns: 18px minmax(0, 1fr) auto;\n  grid-template-rows: auto auto;\n  align-items: center;\n}\n\n/* Today cards keep the list's compact information hierarchy. */\n.me-week-event--today .me-week-event-title {\n  grid-column: 2;\n  grid-row: 1;\n  min-width: 0;\n}\n\n.me-week-event--today .me-week-event-meta {\n  grid-column: 2;\n  grid-row: 2;\n  min-width: 0;\n}\n\n.me-week-event--today .me-week-event-foot {\n  display: contents;\n}\n\n.me-week-event--today .me-week-event-foot-info {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 2px 5px;\n  min-width: 0;\n  flex: 1 1 auto;\n}\n\n.me-week-event--today .me-week-event-actions {\n  grid-column: 3;\n  grid-row: 1 / span 2;\n  display: flex;\n  align-self: center;\n  gap: 6px;\n  flex-shrink: 0;\n}\n\n.me-week-event--today .me-week-event-actions .me-btn {\n  min-height: 24px;\n  padding: 2px 8px;\n  font-size: 11px;\n  white-space: nowrap;\n}\n\n.me-today {\n  gap: 10px;\n  padding: 0;\n}\n\n/* Sidebar Today uses a dedicated narrow-card layout. */\n.me-today--sidebar .me-today-list {\n  gap: 6px;\n}\n\n.me-today--sidebar .me-week-event--today {\n  grid-template-columns: 16px minmax(0, 1fr);\n  grid-template-rows: auto auto auto;\n  gap: 4px 7px;\n  padding: 8px 8px 7px;\n  border-left-width: 3px;\n}\n\n.me-today--sidebar .me-week-event--today .me-todo-check {\n  width: 16px;\n  height: 16px;\n  min-width: 16px;\n  margin-top: 1px;\n}\n\n.me-today--sidebar .me-week-event--today .me-week-event-title {\n  grid-column: 2;\n  grid-row: 1;\n  min-width: 0;\n  font-size: 13px;\n  line-height: 1.4;\n}\n\n.me-today--sidebar .me-week-event--today .me-week-event-meta {\n  grid-column: 2;\n  grid-row: 2;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 3px;\n  min-width: 0;\n}\n\n.me-today--sidebar .me-week-event--today .me-week-event-foot {\n  display: contents;\n}\n\n.me-today--sidebar .me-week-event--today .me-week-event-foot-info {\n  display: none;\n}\n\n.me-today--sidebar .me-week-event--today .me-week-event-actions {\n  grid-column: 2;\n  grid-row: 3;\n  justify-self: end;\n  align-self: center;\n  gap: 4px;\n  min-width: 0;\n}\n\n.me-today--sidebar .me-week-event--today .me-week-event-actions .me-btn {\n  min-height: 22px;\n  padding: 1px 6px;\n  font-size: 10px;\n  line-height: 18px;\n}\n\n.me-today--sidebar .me-week-event--today .me-badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  max-width: 100%;\n  min-height: 18px;\n  padding-inline: 5px;\n  font-size: 10px;\n  line-height: 1.15;\n  text-align: center;\n}\n\n/* Both Today views use the same centered time badge. */\n.me-today .me-badge-due {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  text-align: center;\n  line-height: 1.2;\n  vertical-align: middle;\n}\n\n.me-today--sidebar .me-week-event--today .me-todo-days--overdue {\n  color: var(--dsw-alias-state-error-primary);\n  font-weight: 600;\n}\n\n.me-today-head {\n  min-height: 30px;\n  align-items: center;\n}\n\n.me-cal-title,\n.me-week .me-cal-title {\n  grid-column: 2;\n  min-width: 0;\n  text-align: center;\n  font-size: 16px;\n  font-weight: 650;\n  letter-spacing: 0;\n}\n\n.me-cal-head {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  align-items: center;\n  gap: 12px;\n  overflow: visible;\n}\n\n.me-cal-head > .me-cal-nav {\n  grid-column: 1;\n  justify-self: start;\n}\n\n.me-cal-head > .me-cal-title {\n  grid-column: 2;\n  grid-row: 1;\n  width: auto;\n  min-width: max-content;\n  flex: none;\n}\n\n.me-cal-cell-head {\n  position: relative;\n  display: block;\n  min-height: 22px;\n}\n\n.me-cal-cell-head .me-cal-cell-select {\n  display: block;\n  width: max-content;\n}\n\n.me-cal-cell-head .me-cal-cell-add {\n  position: absolute;\n  top: 2px;\n  right: 2px;\n  margin: 0;\n}\n\n.me-today-list {\n  gap: 8px;\n}\n\n/* Calendar uses low-saturation project color instead of solid blocks. */\n.me-calendar-span {\n  height: 18px;\n  padding: 0 7px;\n  border: 1px solid color-mix(in srgb, var(--me-span-fill, var(--me-blue-strong)) 22%, var(--todo-ui-border));\n  border-radius: 5px;\n  background: var(--me-span-bg, color-mix(in srgb, var(--me-span-fill, var(--me-blue-strong)) 10%, var(--dsw-alias-bg-base)));\n  color: var(--me-span-fill, var(--dsw-alias-label-primary));\n  box-shadow: inset 2px 0 0 var(--me-span-fill, var(--me-blue-strong));\n  font-size: 11px;\n  font-weight: 600;\n  line-height: 16px;\n}\n\n.me-calendar-span:hover,\n.me-calendar-span:focus-visible {\n  border-color: color-mix(in srgb, var(--me-span-fill, var(--me-blue-strong)) 36%, var(--todo-ui-border));\n  background: var(--me-span-bg, color-mix(in srgb, var(--me-span-fill, var(--me-blue-strong)) 15%, var(--dsw-alias-bg-base)));\n  outline: none;\n}\n\n.me-calendar-span--before,\n.me-calendar-span--after {\n  opacity: 1;\n}\n\n.me-calendar-span--draft {\n  border: 1px dashed var(--me-span-drop-color);\n  background: var(--me-span-preview-fill);\n  color: var(--me-span-drop-color);\n  box-shadow: none;\n}\n\n.me-calendar-span--dragging,\n.me-calendar-span--dragging:hover {\n  background: var(--me-span-drag-fill);\n  color: var(--dsw-alias-label-primary);\n  box-shadow: inset 2px 0 0 var(--me-span-fill), 0 2px 6px color-mix(in srgb, var(--me-span-fill) 18%, transparent);\n}\n\n.me-calendar-span--done {\n  border-color: var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-interactive-bg-active);\n  color: var(--dsw-alias-label-tertiary);\n  box-shadow: none;\n  opacity: 1;\n  text-decoration: line-through;\n}\n\n.me-calendar-more {\n  min-height: 18px;\n  padding: 0 6px;\n  border-radius: 5px;\n  font-size: 11px;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.me-cal-weekday,\n.me-cal-cell-date,\n.me-week-date-head span {\n  font-size: 12px;\n}\n\n.me-week-date-head strong {\n  font-size: 15px;\n}\n\n/* Group surfaces are quiet; individual tasks carry the visual weight. */\n.me-proj-group {\n  border-color: var(--todo-ui-border);\n  border-radius: var(--todo-ui-radius);\n  background: transparent;\n  box-shadow: none;\n}\n\n.me-proj-head {\n  padding-bottom: 6px;\n  border-bottom: 1px solid var(--todo-ui-border);\n}\n\n.me-proj-title {\n  font-size: 14px;\n  font-weight: 650;\n}\n\n/* List cards have one title row (checkbox + title) and one metadata row. */\n.me-item.me-todo-item--list {\n  position: relative;\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n  flex: none;\n  padding: 10px 12px 9px 16px;\n  overflow: hidden;\n}\n\n.me-todo-item-color {\n  position: absolute;\n  inset: 1px auto 1px 0;\n  width: 4px;\n  border-radius: 7px 0 0 7px;\n  background: var(--me-task-color, var(--me-blue-strong));\n  pointer-events: none;\n}\n\n.me-todo-item--done .me-todo-item-color {\n  background: var(--dsw-alias-label-tertiary);\n}\n\n.me-todo-item-content {\n  display: flex;\n  flex-direction: column;\n  gap: 7px;\n  min-width: 0;\n}\n\n.me-todo-item-title-row {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  min-width: 0;\n}\n\n.me-todo-item-title-row .me-todo-check {\n  margin-top: 2px;\n}\n\n.me-todo-item-title-row .me-todo-text {\n  flex: 1 1 auto;\n  min-width: 0;\n  margin: 0;\n}\n\n.me-todo-item--list .me-item-meta {\n  margin-top: 0;\n  padding-left: 28px;\n}\n\n/* Project view is a horizontal board: stable columns, native horizontal scroll. */\n.me-proj {\n  min-width: 0;\n  gap: 10px;\n  padding-bottom: 4px;\n}\n\n.me-proj-board {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  align-items: flex-start;\n  gap: 14px;\n  width: 100%;\n  min-width: 0;\n  padding: 2px 4px 14px;\n  overflow-x: auto;\n  overflow-y: hidden;\n  box-sizing: border-box;\n  scrollbar-width: thin;\n  overscroll-behavior-inline: contain;\n  scroll-snap-type: x proximity;\n}\n\n.me-proj-board:focus-visible {\n  outline: 2px solid var(--dsw-alias-state-business-primary);\n  outline-offset: 2px;\n}\n\n.me-proj-board .me-proj-group {\n  flex: 0 0 320px !important;\n  width: 320px;\n  min-width: 320px;\n  max-width: 320px;\n  min-height: 180px;\n  max-height: none;\n  padding: 10px;\n  gap: 10px;\n  overflow: visible;\n  border: 1px solid var(--todo-ui-border);\n  border-radius: 8px;\n  background: var(--dsw-alias-bg-layer-1);\n  scroll-snap-align: start;\n  box-sizing: border-box;\n}\n\n.me-proj-board .me-proj-head {\n  position: sticky;\n  top: -10px;\n  z-index: 3;\n  min-height: 34px;\n  padding: 10px 0 8px;\n  background: var(--dsw-alias-bg-layer-1);\n  cursor: grab;\n  user-select: none;\n}\n\n.me-proj-board .me-proj-head:active {\n  cursor: grabbing;\n}\n\n.me-proj-group--dragging {\n  opacity: 0.45;\n}\n\n.me-proj-group--drop-before {\n  box-shadow: -4px 0 0 var(--dsw-alias-state-business-primary);\n}\n\n.me-proj-group--drop-after {\n  box-shadow: 4px 0 0 var(--dsw-alias-state-business-primary);\n}\n\n.me-proj-heading {\n  display: flex;\n  align-items: baseline;\n  min-width: 0;\n  gap: 6px;\n}\n\n.me-proj-heading .me-proj-title {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.me-proj-heading .me-proj-count {\n  flex: none;\n}\n\n.me-proj-head-add {\n  flex: none;\n  border: 0;\n  background: transparent;\n}\n\n.me-proj-board .me-proj-body {\n  gap: 8px;\n}\n\n.me-proj-board .me-todo-card {\n  width: 100%;\n  box-sizing: border-box;\n}\n\n.me-proj-add {\n  flex: none;\n  width: 100%;\n  min-height: 34px;\n  padding: 6px 10px;\n  border: 1px dashed var(--dsw-alias-border-l2);\n  border-radius: 6px;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  font: inherit;\n  font-size: 12px;\n  text-align: left;\n  cursor: pointer;\n}\n\n.me-proj-add:hover,\n.me-proj-add:focus-visible {\n  border-color: var(--dsw-alias-state-business-primary);\n  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 8%, transparent);\n  color: var(--dsw-alias-state-business-primary);\n  outline: none;\n}\n\n@media (max-width: 720px) {\n  .me-proj-board .me-proj-group {\n    flex: 0 0 min(84vw, 320px);\n    width: min(84vw, 320px);\n    min-width: min(84vw, 280px);\n  }\n}\n\n/* Standalone Today panel: mirrors better-sidebar's right workbench chrome.\n * NOTE: no unconditional `#root { margin-right }` rule here \u2014 that would\n * override dsh-better-sidebar's own layout push. The fallback pushes #root\n * via inline style (setProperty !important) from the component instead. */\n.todo-fallback-toggle-button {\n  appearance: none;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  min-width: 28px;\n  padding: 0;\n  border: 0;\n  border-radius: 50%;\n  box-shadow: none;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  transition: background var(--ds-transition-duration-slow) var(--ds-ease-in-out), color var(--ds-transition-duration-slow) var(--ds-ease-in-out);\n}\n\n.todo-fallback-toggle-button:hover,\n.todo-fallback-toggle-button:focus-visible {\n  background: var(--dsw-alias-interactive-bg-hover);\n  color: var(--dsw-alias-label-primary);\n  outline: none;\n}\n\n.todo-fallback-panel {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 2147482999;\n  display: flex;\n  flex-direction: column;\n  min-width: 280px;\n  border-left: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-specific-sidebar-fill, var(--dsw-alias-bg-base));\n  transform: translateX(0);\n  transition: transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), width var(--ds-transition-duration-slow) var(--ds-ease-in-out);\n}\n\n.todo-fallback-panel--hidden {\n  pointer-events: none;\n  visibility: hidden;\n  transform: translateX(102%);\n  transition: transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), width var(--ds-transition-duration-slow) var(--ds-ease-in-out), visibility 0s linear var(--ds-transition-duration-slow);\n}\n\n.todo-fallback-panel[data-dragging] {\n  transition: none;\n}\n\n.todo-fallback-resize {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: -4px;\n  z-index: 2;\n  width: 8px;\n  cursor: col-resize;\n  touch-action: none;\n}\n\n.todo-fallback-resize--active {\n  background: var(--dsw-alias-interactive-bg-hover-accent);\n}\n\n.todo-fallback-panel-body {\n  display: flex;\n  flex: 1;\n  min-width: 0;\n  min-height: 0;\n  overflow: auto;\n  padding: 8px;\n}\n\n.todo-fallback-panel-body .me-panel {\n  width: 100%;\n  height: auto;\n  min-height: 100%;\n  padding: 0;\n}\n\n.todo-fallback-panel-body .me-today--sidebar {\n  max-width: none;\n}\n\nbody[data-dsh-todolist-dragging] #root {\n  transition: none;\n}\n\n@media (max-width: 767px) {\n  .todo-fallback-panel {\n    width: 100vw !important;\n    min-width: 0;\n  }\n\n  .todo-fallback-resize {\n    display: none;\n  }\n}\n";

// src/client/dict-zh.json
var dict_zh_default = {
  "todosTab.label": "\u5F85\u529E",
  "todosTab.label.pending": "\u{1F534} \u5F85\u529E ({count})",
  "todosTab.feature.todoSuggestions": "\u5F85\u786E\u8BA4\u5F85\u529E\u7BA1\u7406",
  "todosTab.feature.todo": "\u5F85\u529E",
  "todo.track.all": "\u5168\u90E8",
  "todo.track": "\u5F85\u529E\u8F68",
  "todo.track.work": "\u5DE5\u4F5C",
  "todo.track.project": "\u672C\u9879\u76EE",
  "todo.track.daily": "\u4ECA\u65E5",
  "todo.track.past": "\u8FC7\u5F80",
  "todo.projectHint": "\u5F53\u524D\u4F1A\u8BDD\u65E0\u5DE5\u4F5C\u76EE\u5F55\uFF0C\u9879\u76EE\u5F85\u529E\u4E0D\u53EF\u7528\u3002",
  "todo.help": "\u672A\u5B8C\u6210\u4E8B\u9879\u7EDF\u4E00\u5728\u8FD9\u91CC\u7BA1\u7406\uFF1A\u6253\u5F00\u5373\u672A\u5B8C\u6210\u5217\u8868\uFF1B\u89C6\u56FE\u53EF\u5207\u6362 \u5217\u8868/\u770B\u677F/\u65E5\u5386/\u5468/\u9879\u76EE\uFF1B\u9876\u90E8\u300C\u6240\u6709\u300D\u770B\u5168\u76D8\u3001\u300C\u9879\u76EE\u25BE\u300D\u6309\u5DF2\u6709\u4EFB\u52A1\u9879\u76EE\u8FC7\u6EE4\uFF1B\u300C\uFF0B \u6DFB\u52A0\u300D\u5F39\u7A97\u5F55\u5165\u3002\u5468\u671F\u4EFB\u52A1\uFF08\u6BCF\u5929/\u6BCF\u5468/\u6BCF\u6708\uFF09\u5B8C\u6210\u540E\u81EA\u52A8\u63A8\u8FDB\u5230\u4E0B\u4E00\u671F\uFF1B\u6709\u5F00\u59CB+\u622A\u6B62\u7684\u4EFB\u52A1\u5728\u65E5\u5386\u4E0A\u6309\u65F6\u95F4\u8DE8\u5EA6\u663E\u793A\u3002\u4E5F\u53EF\u4EE5\u76F4\u63A5\u5BF9\u6211\u8BF4\u201C\u5E2E\u6211\u52A0\u4E2A\u5F85\u529E\u2026\u201D\u2014\u2014AI \u4F1A\u6309\u9879\u76EE/\u8D1F\u8D23\u4EBA/\u5468\u671F\u5199\u5165\u3002",
  "todo.addPlaceholder": "\u8981\u505A\u4EC0\u4E48\uFF1F\uFF08\u53EF\u591A\u884C\uFF09",
  "todo.add": "\u6DFB\u52A0",
  "todo.added": "\u5DF2\u6DFB\u52A0\u5F85\u529E",
  "todo.addNew": "\uFF0B \u6DFB\u52A0",
  "todo.addModal.title": "\u6DFB\u52A0\u5F85\u529E",
  "todo.addModal.hint": "\u9879\u76EE\u4F1A\u6309\u4EFB\u52A1\u6570\u636E\u81EA\u52A8\u5F62\u6210\u7B5B\u9009\u9009\u9879\uFF1B\u5468\u671F\u4EFB\u52A1\u5B8C\u6210\u81EA\u52A8\u63A8\u8FDB\u4E0B\u4E00\u671F",
  "todo.start": "\u5F00\u59CB\u65E5\u671F\uFF08\u4E0E\u622A\u6B62\u7EC4\u6210\u65F6\u95F4\u8DE8\u5EA6\uFF09",
  "todo.repeat": "\u5468\u671F",
  "todo.repeat.none": "\u4E0D\u91CD\u590D",
  "todo.repeat.daily": "\u6BCF\u5929",
  "todo.repeat.weekly": "\u6BCF\u5468",
  "todo.repeat.monthly": "\u6BCF\u6708",
  "todo.repeat.weekday": "\u6BCF\u5468\u51E0",
  "todo.repeat.monthDay": "\u6BCF\u6708\u51E0\u53F7",
  "todo.weekday.1": "\u5468\u4E00",
  "todo.weekday.2": "\u5468\u4E8C",
  "todo.weekday.3": "\u5468\u4E09",
  "todo.weekday.4": "\u5468\u56DB",
  "todo.weekday.5": "\u5468\u4E94",
  "todo.weekday.6": "\u5468\u516D",
  "todo.weekday.7": "\u5468\u65E5",
  "todo.done": "\u5B8C\u6210",
  "todo.undone": "\u6062\u590D",
  "todo.edit": "\u7F16\u8F91",
  "todo.save": "\u4FDD\u5B58",
  "todo.cancel": "\u53D6\u6D88",
  "todo.updated": "\u5DF2\u66F4\u65B0",
  "todo.deleted": "\u5DF2\u5220\u9664",
  "todo.deleteConfirm": "\u786E\u5B9A\u5220\u9664\u8FD9\u6761\u5F85\u529E\uFF1F\u5220\u9664\u540E\u4E0D\u53EF\u6062\u590D\u3002\n\n{snippet}",
  "todo.due": "\u622A\u6B62",
  "todo.overdue": "\u903E\u671F",
  "todo.all": "\u5168\u90E8",
  "todo.filterStatus": "\u72B6\u6001",
  "todo.filterQuadrant": "\u8C61\u9650",
  "todo.status.active": "\u672A\u5B8C\u6210",
  "todo.status.pending": "\u5F85\u529E",
  "todo.status.doing": "\u8FDB\u884C\u4E2D",
  "todo.status.done": "\u5DF2\u5B8C\u6210",
  "todo.status.blocked": "\u53D7\u963B",
  "todo.status.cancelled": "\u5DF2\u53D6\u6D88",
  "todo.quadrant": "\u56DB\u8C61\u9650",
  "todo.quadrant.none": "\u672A\u5206\u7C7B",
  "todo.quadrant.q1": "\u91CD\u8981\u7D27\u6025",
  "todo.quadrant.q2": "\u91CD\u8981\u4E0D\u7D27\u6025",
  "todo.quadrant.q3": "\u7D27\u6025\u4E0D\u91CD\u8981",
  "todo.quadrant.q4": "\u4E0D\u91CD\u8981\u4E0D\u7D27\u6025",
  "todo.empty": "\uFF08\u6682\u65E0\u5F85\u529E\uFF0C\u6DFB\u52A0\u4E00\u6761\u5427\uFF09",
  "todo.view.mode": "\u89C6\u56FE",
  "todo.view.list": "\u5217\u8868",
  "todo.view.today": "\u4ECA\u65E5",
  "todo.view.calendar": "\u65E5\u5386",
  "todo.today.empty": "\u4ECA\u5929\u6CA1\u6709\u5F85\u529E\uFF0C\u6DFB\u52A0\u4E00\u6761\u5427",
  "todo.calendar.prev": "\u4E0A\u6708",
  "todo.calendar.next": "\u4E0B\u6708",
  "todo.calendar.today": "\u56DE\u5230\u672C\u6708",
  "todo.calendar.pick": "\u70B9\u51FB\u65E5\u671F\u67E5\u770B\u5F53\u5929\u5F85\u529E\uFF08\u6709\u622A\u6B62\u65E5\u671F\u7684\u5F85\u529E\u4F1A\u51FA\u73B0\u5728\u65E5\u5386\u683C\u5B50\u91CC\uFF09",
  "todo.calendar.emptyDay": "\u8FD9\u5929\u6CA1\u6709\u5F85\u529E",
  "todo.calendar.day": "\u5F85\u529E\uFF1A",
  "todo.view.week": "\u5468",
  "todo.view.project": "\u9879\u76EE",
  "todo.week.prev": "\u4E0A\u5468",
  "todo.week.next": "\u4E0B\u5468",
  "todo.week.today": "\u672C\u5468",
  "todo.project.filterWho": "\u8D1F\u8D23\u4EBA",
  "todo.project.allWho": "\u5168\u90E8",
  "todo.project.none": "\u672A\u5F52\u7C7B",
  "todo.project.placeholder": "\u5207\u6362\u9879\u76EE\u2026",
  "todo.project.all": "\u5168\u90E8\u9879\u76EE",
  "todo.project.switch": "\u6309\u9879\u76EE\u5207\u6362\uFF1A\u9009\u4E2D\u540E\u5168\u5C40\u8FC7\u6EE4\u5230\u8BE5\u9879\u76EE\uFF0C\u5E76\u81EA\u52A8\u8FDB\u5165\u9879\u76EE\u89C6\u56FE\uFF1B\u9009\u9879\u6765\u81EA\u5DF2\u6709\u4EFB\u52A1\u7684\u9879\u76EE\u5B57\u6BB5",
  "todo.projPlaceholder": "\u9879\u76EE\uFF08\u5982 \u54C1\u724C\u3001\u8FD0\u8425\u3001\u4E2A\u4EBA\uFF09",
  "todo.whoPlaceholder": "\u8D1F\u8D23\u4EBA\uFF08\u5982\u8BBE\u8BA1\u5E08\u3001\u7A0B\u5E8F\u5458\uFF09",
  "todo.board.empty": "\u6B64\u8C61\u9650\u6682\u65E0\u5F85\u529E",
  "todo.board.cycleStatus": "\u70B9\u51FB\u5207\u6362\u72B6\u6001",
  "memoryTab.delete": "\u5220\u9664",
  "panel.todoSuggestions.title": "\u5F85\u786E\u8BA4\u5F85\u529E\u5EFA\u8BAE",
  "panel.todoSuggestions.empty": "\u6CA1\u6709\u5F85\u786E\u8BA4\u7684\u5F85\u529E\u5EFA\u8BAE\u3002",
  "panel.todoSuggestions.help": "\u540E\u53F0\u5BA1\u67E5\u4EA7\u51FA\u7684\u5F85\u529E\u5EFA\u8BAE\uFF1A\u91C7\u7EB3\u540E\u5199\u5165\u5BF9\u5E94\u5F85\u529E\u8F68\uFF08\u5F85\u529E\u4E0D\u80FD\u53D8\u6210\u8BB0\u5FC6\uFF09\uFF1B\u5F52\u6863\u4FDD\u7559\u5907\u67E5\uFF1B\u62D2\u7EDD\u4E22\u5F03\u3002",
  "panel.loading": "\u52A0\u8F7D\u4E2D\u2026"
};

// src/client/dict-en.json
var dict_en_default = {
  "todosTab.label": "Todos",
  "todosTab.label.pending": "\u{1F534} Todos ({count})",
  "todosTab.feature.todoSuggestions": "Todo suggestions",
  "todosTab.feature.todo": "Todos",
  "todo.track.all": "All",
  "todo.track": "Track",
  "todo.track.work": "Work",
  "todo.track.project": "This project",
  "todo.track.daily": "Today",
  "todo.track.past": "Past",
  "todo.projectHint": "No working directory for this session \u2014 project todos unavailable.",
  "todo.help": "Unfinished todos in one place: the home view is the todo list; switch views via List / Board / Calendar / Week / Projects. \u201CAll\u201D shows everything, and the project dropdown is built from project values already used by tasks. \u201C+ Add\u201D opens a dialog. Recurring tasks (daily/weekly/monthly) auto-advance to the next due date when done; tasks with a start+due date span the calendar.",
  "todo.addPlaceholder": "What needs to be done? (multi-line ok)",
  "todo.add": "Add",
  "todo.added": "Todo added",
  "todo.addNew": "+ Add",
  "todo.addModal.title": "Add todo",
  "todo.addModal.hint": "Project filter options are generated from task data; recurring todos auto-advance when done",
  "todo.start": "Start date (with due forms a time span)",
  "todo.repeat": "Repeat",
  "todo.repeat.none": "None",
  "todo.repeat.daily": "Daily",
  "todo.repeat.weekly": "Weekly",
  "todo.repeat.monthly": "Monthly",
  "todo.repeat.weekday": "Day of week",
  "todo.repeat.monthDay": "Day of month",
  "todo.weekday.1": "Mon",
  "todo.weekday.2": "Tue",
  "todo.weekday.3": "Wed",
  "todo.weekday.4": "Thu",
  "todo.weekday.5": "Fri",
  "todo.weekday.6": "Sat",
  "todo.weekday.7": "Sun",
  "todo.done": "Done",
  "todo.undone": "Restore",
  "todo.edit": "Edit",
  "todo.save": "Save",
  "todo.cancel": "Cancel",
  "todo.updated": "Updated",
  "todo.deleted": "Deleted",
  "todo.deleteConfirm": "Delete this todo? This cannot be undone.\n\n{snippet}",
  "todo.due": "Due",
  "todo.overdue": "Overdue",
  "todo.all": "All",
  "todo.filterStatus": "Status",
  "todo.filterQuadrant": "Quadrant",
  "todo.status.active": "Active",
  "todo.status.pending": "Pending",
  "todo.status.doing": "Doing",
  "todo.status.done": "Done",
  "todo.status.blocked": "Blocked",
  "todo.status.cancelled": "Cancelled",
  "todo.quadrant": "Quadrant",
  "todo.quadrant.none": "Unclassified",
  "todo.quadrant.q1": "Important & urgent",
  "todo.quadrant.q2": "Important, not urgent",
  "todo.quadrant.q3": "Urgent, not important",
  "todo.quadrant.q4": "Neither",
  "todo.empty": "(No todos yet \u2014 add one)",
  "todo.view.mode": "View",
  "todo.view.list": "List",
  "todo.view.today": "Today",
  "todo.view.calendar": "Calendar",
  "todo.today.empty": "Nothing due today \u2014 add one",
  "todo.calendar.prev": "Prev month",
  "todo.calendar.next": "Next month",
  "todo.calendar.today": "This month",
  "todo.calendar.pick": "Pick a date to see that dayu2019s todos (todos with a due date appear on the calendar)",
  "todo.calendar.emptyDay": "No todos on this day",
  "todo.calendar.day": "Todos: ",
  "todo.view.week": "Week",
  "todo.view.project": "Projects",
  "todo.week.prev": "Prev week",
  "todo.week.next": "Next week",
  "todo.week.today": "This week",
  "todo.project.filterWho": "Owner",
  "todo.project.allWho": "All",
  "todo.project.none": "Uncategorized",
  "todo.project.placeholder": "Switch project\u2026",
  "todo.project.all": "All projects",
  "todo.project.switch": "Filter by project: scopes every view to that project and opens the project view; options come from project values already used by tasks",
  "todo.projPlaceholder": "Project (e.g. brand/ops)",
  "todo.whoPlaceholder": "Owner (e.g. name)",
  "todo.board.empty": "No todos in this quadrant",
  "todo.board.cycleStatus": "Click to cycle status",
  "memoryTab.delete": "Delete",
  "panel.todoSuggestions.title": "Pending todo suggestions",
  "panel.todoSuggestions.empty": "No pending todo suggestions.",
  "panel.todoSuggestions.help": "Todo suggestions from the background review: approve writes into the matching todo track (a todo stays a todo); archive keeps aside; reject drops.",
  "panel.loading": "Loading\u2026"
};

// src/client/index.ts
var NS = "todolist";
var zh = {
  ...dict_zh_default,
  "tab.title": "\u5F85\u529E",
  "tab.title.pending": "\u5F85\u529E ({count})",
  "suggestions.title": 'AI \u63D0\u8BAE\u7684\u5F85\u529E\uFF08\u786E\u8BA4\u540E\u5199\u5165\uFF1B\u4E5F\u53EF\u76F4\u63A5\u8BF4"\u8BB0\u4F4F\u2026"\u8BA9\u6211\u7528 todolist \u76F4\u5199\uFF09',
  "suggestions.empty": "\u6CA1\u6709\u5F85\u786E\u8BA4\u7684\u5F85\u529E\u5EFA\u8BAE\u3002",
  "suggestions.approve": "\u91C7\u7EB3",
  "suggestions.reject": "\u62D2\u7EDD",
  "suggestions.approveAll": "\u5168\u90E8\u91C7\u7EB3",
  "suggestions.approved": "\u5DF2\u91C7\u7EB3\u5E76\u5199\u5165\u5F85\u529E",
  "suggestions.rejected": "\u5DF2\u62D2\u7EDD",
  "suggestions.done": "\u64CD\u4F5C\u5B8C\u6210",
  "todo.startShort": "\u5F00\u59CB",
  "todo.dueShort": "\u622A\u6B62",
  "todo.fallback.open": "\u6253\u5F00\u4ECA\u65E5\u5F85\u529E\u4FA7\u680F",
  "todo.fallback.close": "\u5173\u95ED\u4ECA\u65E5\u5F85\u529E\u4FA7\u680F",
  "todo.fallback.title": "\u4ECA\u65E5\u5F85\u529E",
  "todo.fallback.subtitle": "\u4ECA\u5929\u5230\u671F\u3001\u903E\u671F\u548C\u5468\u671F\u4EFB\u52A1"
};
var en = {
  ...dict_en_default,
  "tab.title": "Todos",
  "tab.title.pending": "Todos ({count})",
  "suggestions.title": "AI-proposed todos (approve to write; or just tell me \u201Cremember\u2026\u201D and I file them directly)",
  "suggestions.empty": "No pending todo suggestions.",
  "suggestions.approve": "Approve",
  "suggestions.reject": "Reject",
  "suggestions.approveAll": "Approve all",
  "suggestions.approved": "Approved and written to todos",
  "suggestions.rejected": "Rejected",
  "suggestions.done": "Done",
  "todo.startShort": "Start",
  "todo.dueShort": "Due",
  "todo.fallback.open": "Open Today todo sidebar",
  "todo.fallback.close": "Close Today todo sidebar",
  "todo.fallback.title": "Today",
  "todo.fallback.subtitle": "Due today, overdue, and recurring tasks"
};
var inject = ["slots", "locale", "conversation"];
var BADGE_POLL_MS = 3e4;
function apply(ctx) {
  const t = ctx.locale.bind(NS);
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "todolist: dictionaries");
  ctx.effect(() => {
    if (typeof document === "undefined") return () => {
    };
    const tags = Array.from(document.querySelectorAll('style[data-todolist-css], style[data-plugin="dsh-todolist"]'));
    const tag = document.createElement("style");
    tag.dataset.todolistCss = "1";
    tag.dataset.plugin = "dsh-todolist";
    tag.textContent = styles_default;
    for (const stale of tags) stale.remove();
    document.head.appendChild(tag);
    return () => {
      if (tag.parentNode !== null) tag.remove();
    };
  }, "todolist: stylesheet");
  let badgeCount = 0;
  let disposeTopTab;
  const registerTopTab = () => {
    disposeTopTab?.();
    disposeTopTab = ctx.slots.inject("conversation.view", () => ctx.slots.register({
      name: "conversation.view",
      id: "todolist-hub",
      order: 30,
      label: () => badgeCount > 0 ? t("tab.title.pending", { count: badgeCount }) : t("tab.title")
    }, (props) => TodoTabView({ ...props, t })));
  };
  registerTopTab();
  const refreshBadge = () => {
    void fetch("/todolist/api/suggestions").then((res) => res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))).then((data) => {
      const next = data.entries?.length ?? 0;
      if (next !== badgeCount) {
        badgeCount = next;
        registerTopTab();
      }
    }).catch(() => {
    });
  };
  refreshBadge();
  const badgeTimer = window.setInterval(refreshBadge, BADGE_POLL_MS);
  let hostSynced = false;
  let activeHost;
  let disposeSidebarTab;
  let disposeFallbackSlot;
  const unmountFallback = () => {
    disposeFallbackSlot?.();
    disposeFallbackSlot = void 0;
  };
  const mountFallback = () => {
    if (disposeFallbackSlot !== void 0) return;
    disposeFallbackSlot = ctx.slots.inject(
      "conversation.session.header.utilities",
      () => ctx.slots.register({
        name: "conversation.session.header.utilities",
        id: "todolist-fallback-sidebar",
        order: 90
      }, () => (0, import_react6.createElement)(TodoSidebarFallback, { t }))
    );
  };
  const registerSidebarTab = (host) => {
    disposeSidebarTab = host.registerTab({
      id: "todolist",
      title: () => t("tab.title"),
      icon: (size) => (0, import_react6.createElement)(
        "svg",
        { width: size, height: size, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" },
        (0, import_react6.createElement)("rect", { x: 1.8, y: 1.8, width: 12.4, height: 12.4, rx: 2.4 }),
        (0, import_react6.createElement)("path", { d: "M4.8 8.3 7 10.5 11.2 5.7" })
      ),
      order: 90,
      single: true,
      component: (props) => (0, import_react6.createElement)(
        TodoErrorBoundary,
        null,
        (0, import_react6.createElement)(TodoView, { t, sessionId: props.scope.sessionId, mode: "today" })
      )
    });
  };
  const syncSidebarHost = () => {
    const nextHost = ctx.get("betterSidebar");
    if (hostSynced && nextHost === activeHost) return;
    hostSynced = true;
    disposeSidebarTab?.();
    disposeSidebarTab = void 0;
    activeHost = nextHost;
    if (nextHost !== void 0) {
      unmountFallback();
      try {
        registerSidebarTab(nextHost);
      } catch (error) {
        activeHost = void 0;
        console.warn("[dsh-todolist] better-sidebar tab \u6CE8\u518C\u5931\u8D25\uFF0C\u6539\u7528\u5185\u7F6E Today \u4FA7\u680F\uFF1A", error);
        mountFallback();
      }
    } else {
      mountFallback();
    }
  };
  syncSidebarHost();
  const hostTimer = window.setInterval(syncSidebarHost, 1e3);
  ctx.effect(() => () => {
    window.clearInterval(badgeTimer);
    window.clearInterval(hostTimer);
    disposeTopTab?.();
    disposeSidebarTab?.();
    unmountFallback();
  }, "todolist: cleanup");
}
return module.exports; } });
