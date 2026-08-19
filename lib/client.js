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
function dayDelta(from, to) {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  return Math.round((new Date(ty, tm - 1, td).getTime() - new Date(fy, fm - 1, fd).getTime()) / 864e5);
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
  const [spanDateDrop, setSpanDateDrop] = (0, import_react2.useState)(null);
  const [expandedRow, setExpandedRow] = (0, import_react2.useState)(null);
  const dragAnchorRef = (0, import_react2.useRef)(null);
  const [projectOrder, setProjectOrder] = (0, import_react2.useState)(loadProjectOrder);
  const [draggingProject, setDraggingProject] = (0, import_react2.useState)(null);
  const [projectDrop, setProjectDrop] = (0, import_react2.useState)(null);
  const [projectFilter, setProjectFilter] = (0, import_react2.useState)("");
  const [modalOpen, setModalOpen] = (0, import_react2.useState)(false);
  const [modalEditId, setModalEditId] = (0, import_react2.useState)(null);
  const [confirmOpen, setConfirmOpen] = (0, import_react2.useState)(false);
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
    setConfirmOpen(false);
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
    setConfirmOpen(false);
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
  const dayAtPointInRoot = (clientX, clientY, source, root) => {
    const selector = source === "calendar" ? ".me-cal-cell[data-calendar-day]" : source === "week" ? ".me-week-date-head[data-calendar-day], .me-week-column[data-calendar-day]" : "";
    if (selector === "") return null;
    const candidates = Array.from(root.querySelectorAll(selector));
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
  const spanAtPoint = (clientX, clientY, root, maxDistance = 14) => {
    if (root === null) return null;
    const rootRect = root.getBoundingClientRect();
    if (clientX < rootRect.left || clientX > rootRect.right || clientY < rootRect.top || clientY > rootRect.bottom) return null;
    let scope = root;
    if (root.classList.contains("me-cal-span-layer") || root.classList.contains("me-cal-row")) {
      let hitRow = root.classList.contains("me-cal-row") ? root : null;
      if (hitRow === null) {
        const rows = Array.from(root.parentElement?.querySelectorAll(".me-cal-row") ?? []);
        hitRow = rows.find((row) => {
          const rect = row.getBoundingClientRect();
          return clientY >= rect.top && clientY < rect.bottom;
        }) ?? null;
      }
      if (hitRow !== null) scope = hitRow;
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
    if (bestDist > maxDistance) return null;
    return best;
  };
  const resolveSpanDrop = (event, root, maxDistance = 14) => {
    const span = spanAtPoint(event.clientX, event.clientY, root, maxDistance);
    if (span === null) return null;
    const targetId = span.dataset.todoId ?? "";
    const segmentKey = span.dataset.segmentKey ?? "";
    if (targetId === "") return null;
    const rect = span.getBoundingClientRect();
    const position = event.clientY < rect.top + rect.height / 2 ? "before" : "after";
    return { targetId, segmentKey, position };
  };
  const startSpanDrag = (event, item, anchorDay) => {
    if (item.id === RANGE_DRAFT_ID) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", item.id);
    const ghost = document.createElement("div");
    ghost.textContent = item.text.split("\n")[0];
    ghost.style.cssText = [
      "position: fixed",
      "top: -1000px",
      "left: 0",
      "max-width: 240px",
      "padding: 4px 10px",
      "border-radius: 6px",
      "background: #2563eb",
      "color: #ffffff",
      "font: 600 12px/1.5 system-ui, sans-serif",
      "white-space: nowrap",
      "overflow: hidden",
      "text-overflow: ellipsis",
      "box-shadow: 0 2px 10px rgba(37, 99, 235, 0.4)"
    ].join(";");
    document.body.appendChild(ghost);
    event.dataTransfer.setDragImage(ghost, 10, 12);
    window.setTimeout(() => ghost.remove(), 0);
    draggingSpanIdRef.current = item.id;
    dragAnchorRef.current = { id: item.id, day: anchorDay };
    setDraggingSpanId(item.id);
    setSpanDrop(null);
    setSpanDateDrop(null);
  };
  const overSpanContainer = (event, source) => {
    const sourceId = draggingSpanIdRef.current ?? draggingSpanId ?? event.dataTransfer.getData("text/plain");
    if (sourceId === "" || busy) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    const hit = resolveSpanDrop(event, event.currentTarget, source === "calendar" ? 12 : 18);
    if (hit !== null && hit.targetId !== sourceId) {
      setSpanDrop((current) => current !== null && current.key === hit.segmentKey && current.position === hit.position ? current : { key: hit.segmentKey, id: hit.targetId, position: hit.position });
      setSpanDateDrop(null);
      return;
    }
    setSpanDrop(null);
    if (hit !== null && hit.targetId === sourceId) {
      setSpanDateDrop(null);
      return;
    }
    if (source === "today") {
      setSpanDateDrop(null);
      return;
    }
    const day = dayAtPointInRoot(event.clientX, event.clientY, source, event.currentTarget);
    setSpanDateDrop((current) => current !== null && current.day === day && current.source === source ? current : day !== null ? { day, source } : null);
  };
  const dropSpanContainer = (event, source) => {
    event.preventDefault();
    event.stopPropagation();
    const sourceId = draggingSpanIdRef.current ?? draggingSpanId ?? event.dataTransfer.getData("text/plain");
    const hit = resolveSpanDrop(event, event.currentTarget, source === "calendar" ? 12 : 18);
    const day = source === "today" ? null : dayAtPointInRoot(event.clientX, event.clientY, source, event.currentTarget);
    const anchorDay = dragAnchorRef.current?.day;
    draggingSpanIdRef.current = null;
    dragAnchorRef.current = null;
    setDraggingSpanId(null);
    setSpanDrop(null);
    setSpanDateDrop(null);
    if (sourceId === "" || busy) return;
    suppressCalendarClickRef.current = true;
    window.setTimeout(() => {
      suppressCalendarClickRef.current = false;
    }, 0);
    if (hit !== null && hit.targetId !== sourceId) {
      if (source === "today") {
        const orderedIds = todayList.map((entry) => entry.id);
        const srcIndex = orderedIds.indexOf(sourceId);
        if (srcIndex !== -1) orderedIds.splice(srcIndex, 1);
        const targetIndex = orderedIds.indexOf(hit.targetId);
        if (targetIndex === -1) return;
        orderedIds.splice(targetIndex + (hit.position === "after" ? 1 : 0), 0, sourceId);
        const moves = [];
        for (let i = 1; i < orderedIds.length; i += 1) {
          moves.push({ id: orderedIds[i], targetId: orderedIds[i - 1], position: "after" });
        }
        if (moves.length === 0) return;
        setBusy(true);
        const applyMoves = async () => {
          for (const move of moves) {
            await api("/api/todo", {
              method: "POST",
              body: JSON.stringify({ sessionId, action: "reorder", id: move.id, targetId: move.targetId, position: move.position })
            });
          }
        };
        void applyMoves().then(() => {
          notifyChanged();
          flash(t("todo.updated"));
        }).catch((error) => {
          setNotice({ kind: "error", text: error.message });
        }).finally(() => setBusy(false));
        return;
      }
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
      return;
    }
    if (day === null) return;
    const item = (items ?? []).find((entry) => entry.id === sourceId);
    if (item === void 0) return;
    moveItemToDay(item, day, anchorDay);
  };
  const moveItemToDay = (item, targetDay, anchor) => {
    if (item.repeat !== null) {
      flash(t("todo.repeat.noDateDrag"));
      return;
    }
    if (DONE_STATUSES.has(item.status)) {
      flash(t("todo.done.noDateDrag"));
      return;
    }
    let startPatch;
    let duePatch;
    if (item.start !== null && item.due !== null) {
      const delta = anchor !== void 0 ? dayDelta(anchor, targetDay) : 0;
      startPatch = shiftDays(item.start, delta);
      duePatch = shiftDays(item.due, delta);
    } else if (item.due !== null) {
      duePatch = targetDay;
    } else if (item.start !== null) {
      startPatch = targetDay;
    } else {
      return;
    }
    if ((startPatch ?? null) === item.start && (duePatch ?? null) === item.due) return;
    setBusy(true);
    void api("/api/todo", {
      method: "POST",
      body: JSON.stringify({ sessionId, action: "update", id: item.id, start: startPatch, due: duePatch })
    }).then(() => {
      notifyChanged();
      flash(`${t("todo.movedTo")} ${fmtDate(targetDay)}`);
    }).catch((error) => {
      setNotice({ kind: "error", text: error.message });
    }).finally(() => setBusy(false));
  };
  const endSpanDrag = () => {
    draggingSpanIdRef.current = null;
    dragAnchorRef.current = null;
    setDraggingSpanId(null);
    setSpanDrop(null);
    setSpanDateDrop(null);
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
    if (!modalOpen) return;
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      if (confirmOpen) {
        setConfirmOpen(false);
        return;
      }
      if (mDateTarget !== null) {
        setMDateTarget(null);
        return;
      }
      setModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen, confirmOpen, mDateTarget]);
  (0, import_react2.useEffect)(() => {
    const shieldDrag = (event) => {
      if (draggingSpanIdRef.current === null) return;
      const target = event.target;
      if (target === null || target.closest(".me-panel") !== null) return;
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener("dragover", shieldDrag, true);
    window.addEventListener("drop", shieldDrag, true);
    return () => {
      window.removeEventListener("dragover", shieldDrag, true);
      window.removeEventListener("drop", shieldDrag, true);
    };
  }, []);
  (0, import_react2.useEffect)(() => {
    cancelRangeGesture();
    endSpanDrag();
    setExpandedRow(null);
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
  const confirmDeleteNow = () => {
    if (modalEditId === null || busy) return;
    const item = (items ?? []).find((entry) => entry.id === modalEditId);
    if (item === void 0) return;
    setBusy(true);
    void api("/api/todo", {
      method: "POST",
      body: JSON.stringify({ sessionId, action: "remove", id: item.id })
    }).then(() => {
      setConfirmOpen(false);
      setModalOpen(false);
      setModalEditId(null);
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
  const todaySource = timeVisible.filter((item) => {
    if (item.status === "done") return item.doneAt?.slice(0, 10) === today;
    if (item.status === "cancelled") return false;
    if (item.repeat !== null) return repeatDayMatches(item, /* @__PURE__ */ new Date());
    if (item.due !== null && item.due < today) return true;
    if (item.due === today) return true;
    if (item.start !== null && item.due !== null) return item.start <= today && today <= item.due;
    if (item.start === today) return true;
    return false;
  });
  const todayManualOrder = (() => {
    const byTime = [...todaySource].sort((a, b) => String(a.time).localeCompare(String(b.time)) || a.id.localeCompare(b.id));
    return !byTime.every((item, index) => index === 0 || (item.calendarOrder ?? Number.MAX_SAFE_INTEGER) >= (byTime[index - 1].calendarOrder ?? Number.MAX_SAFE_INTEGER));
  })();
  const todayRank = (item) => {
    if (item.status === "done") return 4;
    if (item.due !== null && item.due < today) return 0;
    if (item.due === today) return 1;
    if (item.repeat !== null) return 2;
    return 3;
  };
  const todayList = [...todaySource].sort((a, b) => {
    if (!todayManualOrder) {
      const r = todayRank(a) - todayRank(b);
      if (r !== 0) return r;
    }
    const byOrder = compareCalendarItems(a, b);
    if (byOrder !== 0) return byOrder;
    return String(a.due ?? "").localeCompare(String(b.due ?? ""));
  });
  const todayOverdueCount = todayList.filter((item) => item.status !== "done" && item.due !== null && item.due < today).length;
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
  const renderCard = (item) => {
    const done = DONE_STATUSES.has(item.status);
    const titleLine = item.text.split("\n")[0] || item.text;
    const color = taskColor(item);
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "article",
      {
        className: `me-todo-card${done ? " me-todo-card--done" : ""}`,
        onClick: () => openEditModal(item),
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
                  onClick: (event) => {
                    event.stopPropagation();
                    toggleDone(item);
                  },
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
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-todo-card-foot", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-item-time", children: item.time }) })
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
            setExpandedRow(null);
          }, children: "\u2039" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "me-btn me-icon-btn", title: t("todo.calendar.next"), onClick: () => {
            setCalendarAnchor(`${shiftMonth(calMonth, 1)}-01`);
            setSelectedDay(null);
            setExpandedRow(null);
          }, children: "\u203A" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "me-btn", onClick: () => {
            setCalendarAnchor(today);
            setSelectedDay(today);
            setExpandedRow(null);
          }, children: t("todo.calendar.today") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "me-cal-title", children: [
          curY,
          "\u5E74",
          curM,
          "\u6708"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-calendar-scroll", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "div",
        {
          className: "me-calendar-surface",
          onDragOver: (event) => {
            event.preventDefault();
            event.stopPropagation();
          },
          onDrop: (event) => {
            event.preventDefault();
            event.stopPropagation();
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-cal-weekdays", children: ["\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u65E5"].map((weekday) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-cal-weekday", children: weekday }, weekday)) }),
            weeks.map((week, weekIndex) => {
              const segments = spanRows[weekIndex] ?? [];
              const rowKey = dateKey(week[0]);
              const isExpanded = expandedRow === rowKey;
              const laneLimit = isExpanded ? Number.MAX_SAFE_INTEGER : MAX_MONTH_LANES;
              const overflowSegments = segments.filter((segment) => segment.lane >= MAX_MONTH_LANES);
              const visibleSegments = segments.filter((segment) => segment.lane < laneLimit);
              const hiddenSegments = segments.filter((segment) => segment.lane >= laneLimit);
              const laneCount = visibleSegments.reduce((max, segment) => Math.max(max, segment.lane + 1), 0);
              const hiddenDay = overflowSegments.length > 0 ? dateKey(grid[Math.min(...overflowSegments.map((segment) => segment.startIndex))]) : null;
              const hiddenCol = overflowSegments.length > 0 ? Math.min(...overflowSegments.map((segment) => segment.startIndex)) % 7 : -1;
              const rowStyle = {
                "--me-span-lanes": Math.max(laneCount, hiddenSegments.length > 0 ? 1 : 0) + (isExpanded || hiddenSegments.length > 0 ? 1 : 0)
              };
              return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                "div",
                {
                  className: "me-cal-row",
                  style: rowStyle,
                  onDragOver: (event) => overSpanContainer(event, "calendar"),
                  onDrop: (event) => dropSpanContainer(event, "calendar"),
                  children: [
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
                            rangeDraft?.source === "calendar" && key >= rangeDraft.start && key <= rangeDraft.end ? "me-cal-cell--range-drag" : "",
                            spanDateDrop !== null && spanDateDrop.source === "calendar" && spanDateDrop.day === key ? "me-cal-cell--drop-day" : ""
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
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-cal-span-layer", children: [
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
                            onDragStart: (event) => startSpanDrag(event, segment.item, dateKey(grid[segment.startIndex])),
                            onDragEnd: endSpanDrag,
                            onClick: () => {
                              if (segment.item.id === RANGE_DRAFT_ID || suppressCalendarClickRef.current) return;
                              openEditModal(segment.item);
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
                      hiddenSegments.length > 0 && hiddenDay !== null && hiddenCol >= 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                        "button",
                        {
                          type: "button",
                          className: "me-calendar-more",
                          "aria-label": `\u5C55\u5F00${hiddenDay}\u7684${hiddenSegments.length}\u9879\u5F85\u529E`,
                          style: { gridColumn: `${hiddenCol + 1}`, gridRow: laneCount + 1 },
                          onPointerDown: (event) => event.stopPropagation(),
                          onClick: (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setExpandedRow(rowKey);
                          },
                          children: [
                            "+",
                            hiddenSegments.length
                          ]
                        }
                      ),
                      isExpanded && overflowSegments.length > 0 && hiddenDay !== null && hiddenCol >= 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                        "button",
                        {
                          type: "button",
                          className: "me-calendar-more",
                          "aria-label": t("todo.calendar.collapse"),
                          style: { gridColumn: `${hiddenCol + 1}`, gridRow: laneCount + 1 },
                          onPointerDown: (event) => event.stopPropagation(),
                          onClick: (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setExpandedRow(null);
                          },
                          children: t("todo.calendar.collapse")
                        }
                      )
                    ] })
                  ]
                },
                rowKey
              );
            })
          ]
        }
      ) }),
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
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-calendar-scroll", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "div",
        {
          className: "me-week-surface",
          onDragOver: (event) => overSpanContainer(event, "week"),
          onDrop: (event) => dropSpanContainer(event, "week"),
          children: [
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
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-week-columns", children: days.map((date) => {
              const key = dateKey(date);
              const cards = weekCards(key);
              return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                "section",
                {
                  className: [
                    "me-week-column",
                    key === today ? "me-week-column--today" : "",
                    rangeDraft?.source === "week" && key >= rangeDraft.start && key <= rangeDraft.end ? "me-cal-cell--range-drag" : "",
                    spanDateDrop !== null && spanDateDrop.source === "week" && spanDateDrop.day === key ? "me-week-column--drop-day" : ""
                  ].filter(Boolean).join(" "),
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
                          onDragStart: (event) => startSpanDrag(event, item, key),
                          onDragEnd: endSpanDrag,
                          onClick: () => {
                            if (item.id !== RANGE_DRAFT_ID && !suppressCalendarClickRef.current) openEditModal(item);
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
            }) })
          ]
        }
      ) }),
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
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "li",
        {
          className: `me-item me-todo-item me-todo-item--list${done ? " me-todo-item--done" : ""}`,
          onClick: () => openEditModal(item),
          children: [
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
                    onClick: (event) => {
                      event.stopPropagation();
                      toggleDone(item);
                    },
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
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-item-time", children: item.time })
              ] })
            ] })
          ]
        },
        item.id
      );
    }) });
  };
  const renderToday = () => {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "div",
      {
        className: `me-today${isTodayOnly ? " me-today--sidebar" : " me-today--full"}`,
        onDragOver: (event) => {
          event.preventDefault();
          event.stopPropagation();
        },
        onDrop: (event) => {
          event.preventDefault();
          event.stopPropagation();
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-today-head", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-today-title", children: t("todo.view.today") }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-today-date", children: today }),
            todayOverdueCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "me-today-overdue", children: [
              t("todo.overdue"),
              " ",
              todayOverdueCount
            ] }),
            isTodayOnly && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "me-btn me-btn-primary me-add-btn", onClick: () => openAddWithDay(today), children: t("todo.addNew") })
          ] }),
          todayList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "me-empty", children: t("todo.today.empty") }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "div",
            {
              className: "me-today-list",
              onDragOver: (event) => overSpanContainer(event, "today"),
              onDrop: (event) => dropSpanContainer(event, "today"),
              children: todayList.map((item) => {
                const done = DONE_STATUSES.has(item.status);
                return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "article",
                  {
                    className: [
                      "me-week-event",
                      "me-week-event--today",
                      done ? "me-week-event--done" : "",
                      draggingSpanId === item.id ? "me-week-event--dragging" : "",
                      spanDrop?.key === `today-${item.id}` ? `me-calendar-span--drop-${spanDrop.position}` : ""
                    ].filter(Boolean).join(" "),
                    style: { "--me-week-accent": taskColor(item) },
                    "data-todo-id": item.id,
                    "data-segment-key": `today-${item.id}`,
                    title: t("todo.dragReorderHint"),
                    draggable: true,
                    onDragStart: (event) => startSpanDrag(event, item, today),
                    onDragEnd: endSpanDrag,
                    onClick: () => {
                      if (!suppressCalendarClickRef.current) openEditModal(item);
                    },
                    children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                        "button",
                        {
                          type: "button",
                          className: `me-todo-check${done ? " me-todo-check--done" : ""}`,
                          disabled: busy,
                          onClick: (event) => {
                            event.stopPropagation();
                            toggleDone(item);
                          },
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
                      ] })
                    ] })
                  },
                  item.id
                );
              })
            }
          )
        ]
      }
    );
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: `me-panel${rangeDraft !== null ? " me-panel--range-dragging" : ""}`, children: [
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
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-modal-foot-spacer" }),
            modalEditId !== null && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "button",
              {
                type: "button",
                className: "me-btn me-btn-danger",
                disabled: busy,
                onClick: () => setConfirmOpen(true),
                children: t("memoryTab.delete")
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "button",
              {
                type: "button",
                className: "me-btn me-btn-primary",
                disabled: busy || mContent.trim() === "",
                onClick: submitModal,
                children: modalEditId === null ? t("todo.add") : t("todo.save")
              }
            )
          ] })
        ]
      }
    ) }),
    modalOpen && confirmOpen && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "me-modal me-modal-confirm", onClick: () => setConfirmOpen(false), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "div",
      {
        className: "me-modal-box me-modal-box-confirm",
        role: "alertdialog",
        "aria-label": t("todo.deleteConfirmTitle"),
        onClick: (event) => event.stopPropagation(),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h4", { className: "me-modal-title", children: t("todo.deleteConfirmTitle") }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "me-modal-confirm-text", children: [
            t("todo.deleteConfirmText"),
            (() => {
              const item = (items ?? []).find((entry) => entry.id === modalEditId);
              return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: item === void 0 ? "" : `\u300C${item.text.split("\n")[0].slice(0, 40)}\u300D` });
            })()
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "me-modal-foot", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "me-modal-foot-spacer" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "me-btn", onClick: () => setConfirmOpen(false), children: t("todo.cancel") }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "me-btn me-btn-danger", disabled: busy, onClick: confirmDeleteNow, children: t("todo.deleteConfirmOk") })
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
var styles_default = `/**
 * dsh-todolist panel styles \u2014 DSH design tokens, \`me-\` prefix.
 * Colors come exclusively from --dsw-alias-* / --dsw-static-* tokens so the
 * panel follows the light/dark theme automatically (no hardcoded colors).
 */

/* ---------- Root ---------- */

.me-panel {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  padding: 4px 2px 28px;
  font-family: var(--dsw-font-family, inherit);
  color: var(--dsw-alias-label-primary);
}

/* Inside the session memory tab: the panel is a sub-view, not a full-height
   settings column \u2014 cap its height so the tab never grows the page. */
.mt-panel .me-panel {
  height: auto;
  max-height: 62vh;
}

/* ---------- Notice bar (success / error) ---------- */

.me-notice {
  flex: none;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.5;
}

.me-notice::before {
  content: '';
  flex: none;
  width: 6px;
  height: 6px;
  margin-top: 6px;
  border-radius: 50%;
}

.me-notice-ok {
  color: var(--dsw-alias-state-success-primary);
  background: var(--dsw-alias-state-success-tertiary);
  border: 1px solid var(--dsw-alias-state-success-primary);
}
.me-notice-ok::before {
  background: var(--dsw-alias-state-success-primary);
}

.me-notice-error {
  color: var(--dsw-alias-state-error-primary);
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent);
  border: 1px solid var(--dsw-alias-state-error-secondary);
}
.me-notice-error::before {
  background: var(--dsw-alias-state-error-primary);
}

/* \u8B66\u544A\u63D0\u793A\uFF08\u672A\u6DF1\u5EA6\u6D4B\u8BD5\u7B49\u9700\u8981\u7528\u6237\u77E5\u60C5\u7684\u573A\u666F\uFF09 */
.me-notice-warn {
  color: var(--dsw-alias-state-warning-primary, #b8860b);
  background: color-mix(in srgb, #b8860b 10%, transparent);
  border: 1px solid color-mix(in srgb, #b8860b 40%, transparent);
}
.me-notice-warn::before {
  background: var(--dsw-alias-state-warning-primary, #b8860b);
}

/* ---------- Section cards ---------- */

.me-block {
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1);
}

.me-block-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.me-heading {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}

.me-count {
  flex: none;
  min-width: 18px;
  box-sizing: border-box;
  padding: 1px 6px;
  border-radius: 9px;
  font-size: 11px;
  line-height: 16px;
  text-align: center;
  color: var(--dsw-alias-state-business-primary);
  background: var(--dsw-alias-state-business-tertiary);
}

.me-help {
  margin: -4px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--dsw-alias-label-tertiary);
}

.me-muted {
  margin: 0;
  padding: 8px 0;
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary);
}

/* Friendly empty state */
.me-empty {
  margin: 0;
  padding: 22px 12px;
  border: 1px dashed var(--dsw-alias-border-l3);
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
  color: var(--dsw-alias-label-tertiary);
}

/* ---------- Suggestion list (own scroll area) ---------- */

.me-list {
  margin: 0;
  padding: 0 2px 0 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 380px;
  overflow-y: auto;
}

.me-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: var(--dsw-alias-bg-base);
  transition: border-color 120ms ease;
}

.me-item:hover {
  border-color: var(--dsw-alias-border-l3);
}

.me-item-head {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.me-badge {
  flex: none;
  max-width: 45%;
  padding: 1px 8px;
  border-radius: 9px;
  font-size: 10px;
  line-height: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--dsw-alias-state-business-primary);
  background: var(--dsw-alias-state-business-tertiary);
}

.me-badge-hits {
  color: var(--dsw-alias-state-warn-primary);
  background: var(--dsw-alias-state-warn-tertiary);
}

/* \u5F85\u786E\u8BA4\u5EFA\u8BAE\u7684\u76EE\u6807\u5FBD\u6807\uFF1A\u6309\u8F68\u7740\u8272\uFF0C\u9192\u76EE\u533A\u5206\u8981\u5199\u5165\u54EA\u7C7B\u8BB0\u5FC6 */
.me-badge-suggest {
  border: 1px solid transparent;
  font-size: 11px;
  line-height: 18px;
  padding: 1px 10px;
}

.me-badge-suggest-memory {
  color: var(--dsw-static-blue-5, #3b82f6);
  background: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 16%, transparent);
  border-color: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 45%, transparent);
}

.me-badge-suggest-user {
  color: var(--dsw-static-green-5, #16a34a);
  background: color-mix(in srgb, var(--dsw-static-green-5, #16a34a) 16%, transparent);
  border-color: color-mix(in srgb, var(--dsw-static-green-5, #16a34a) 45%, transparent);
}

.me-badge-suggest-key {
  color: var(--dsw-static-amber-6, #d97706);
  background: color-mix(in srgb, var(--dsw-static-amber-5, #f59e0b) 18%, transparent);
  border-color: color-mix(in srgb, var(--dsw-static-amber-5, #f59e0b) 48%, transparent);
}

.me-badge-suggest-todo {
  color: var(--dsw-static-purple-5, #9333ea);
  background: color-mix(in srgb, var(--dsw-static-purple-5, #9333ea) 16%, transparent);
  border-color: color-mix(in srgb, var(--dsw-static-purple-5, #9333ea) 45%, transparent);
}

/* \u9879\u76EE\u7EA7\u5EFA\u8BAE\u7684\u6765\u6E90\u9879\u76EE\u5FBD\u6807\uFF08key / todo-project\uFF09\uFF1A\u4E2D\u6027\u8272 + \u865A\u7EBF\u8FB9\u6846\uFF0C
   \u89C6\u89C9\u4E0A\u533A\u522B\u4E8E"\u5199\u5165\u54EA\u7C7B\u8BB0\u5FC6"\u7684\u5F69\u8272\u76EE\u6807\u5FBD\u6807\u2014\u2014\u5B83\u6807\u6CE8\u7684\u662F"\u54EA\u4E2A\u9879\u76EE"\u3002 */
.me-badge-project {
  color: var(--dsw-alias-label-secondary);
  background: var(--dsw-alias-bg-layer-2);
  border: 1px dashed var(--dsw-alias-border-l3);
  max-width: 40%;
}

/* \u91C7\u7EB3\u76EE\u6807\u9009\u62E9\u4E0B\u62C9\uFF08\u9ED8\u8BA4=AI \u63A8\u8350\u8F68\uFF0C\u53EF\u6539\u5206\u7C7B\uFF09 */
.me-pick-target {
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  padding: 2px 6px;
  font-size: 11px;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
}

/* \u4F7F\u7528\u6307\u5357\u9762\u677F */
.me-guide {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.me-guide-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 8px 10px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(128, 128, 128, 0.25));
  border-radius: 8px;
  background: var(--dsw-alias-bg-l2, rgba(128, 128, 128, 0.06));
}

.me-guide-icon {
  flex: none;
  font-size: 16px;
  line-height: 20px;
}

.me-guide-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.me-guide-body strong {
  font-size: 12px;
  color: var(--dsw-alias-label-primary);
}

.me-guide-body span {
  font-size: 12px;
  line-height: 1.55;
  color: var(--dsw-alias-label-secondary);
}

.me-guide-sub {
  margin: 14px 0 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}

.me-guide-tips {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  line-height: 1.55;
  color: var(--dsw-alias-label-secondary);
}

.me-guide-loop {
  margin: 12px 0 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--dsw-static-blue-5, #3b82f6);
}

.me-item-time {
  flex: 1;
  min-width: 0;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--dsw-alias-label-tertiary);
}

.me-item-actions {
  flex: none;
  display: flex;
  gap: 6px;
}

.me-item-reason {
  margin: 0;
  padding-left: 8px;
  border-left: 2px solid var(--dsw-alias-border-l3);
  font-size: 11px;
  line-height: 1.5;
  color: var(--dsw-alias-label-tertiary);
}

/* Bulk actions: separated from the list by a hairline */
.me-bulk {
  display: flex;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid var(--dsw-alias-border-l1);
}

/* ---------- Buttons ---------- */

.me-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  padding: 0 10px;
  border: 1px solid var(--dsw-alias-border-l3);
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
}

.me-btn:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}

.me-btn:active:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-active);
}

.me-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.me-btn-archive {
  border-color: var(--dsw-alias-border-l3);
  color: var(--dsw-alias-label-secondary);
}

.me-btn-archive:hover:not(:disabled) {
  border-color: var(--dsw-alias-interactive-fg-default);
  color: var(--dsw-alias-label-primary);
}

.me-archive-list {
  max-height: 320px;
  overflow-y: auto;
}

.me-archive-content {
  margin: 0;
  padding: 10px 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  font: inherit;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--dsw-alias-label-primary);
}

.me-btn-ok {
  color: var(--dsw-alias-state-success-primary);
  border-color: var(--dsw-alias-state-success-primary);
}
.me-btn-ok:hover:not(:disabled) {
  background: var(--dsw-alias-state-success-tertiary);
}

.me-btn-danger {
  color: var(--dsw-alias-state-error-primary);
}
.me-btn-danger:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover-danger);
  border-color: var(--dsw-alias-state-error-secondary);
}

.me-btn-primary {
  border-color: transparent;
  background: var(--dsw-alias-button-primary-fill);
  color: var(--dsw-alias-label-primary-inverted);
  font-weight: 600;
}
.me-btn-primary:hover:not(:disabled) {
  background: var(--dsw-alias-button-primary-hover);
}
.me-btn-primary:disabled {
  background: var(--dsw-alias-button-primary-dimmed);
}

.me-btn:focus-visible,
.me-switch:focus-visible,
.me-input:focus-visible,
.me-select:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 1px;
}

/* ---------- Config form ---------- */

.me-form {
  display: flex;
  flex-direction: column;
}

/* Visual grouping: value rows vs. toggle rows, hairline between groups */
.me-group {
  display: flex;
  flex-direction: column;
}
.me-group + .me-group {
  margin-top: 8px;
  padding-top: 4px;
  border-top: 1px solid var(--dsw-alias-border-l1);
}

.me-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 2px;
  font-size: 13px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
}

.me-field-label {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.me-field-hint {
  font-style: normal;
  font-size: 11px;
  line-height: 1.4;
  color: var(--dsw-alias-label-tertiary);
}

/* \u6B21\u7EA7\u5F00\u5173\u884C\uFF08\u5B50\u529F\u80FD\u5F00\u5173\uFF0C\u5982 ws-coord \u7684\u5FEB\u7167/\u786C\u62E6\u622A\uFF09\uFF1A\u7F29\u8FDB + \u5F31\u5316\uFF0C
   \u89C6\u89C9\u4E0A\u4E0E\u4E3B\u5F00\u5173\uFF08\u6A21\u5757\u603B\u5F00\u5173\uFF09\u533A\u5206 */
.me-field-sub {
  padding-left: 18px;
  border-left: 2px solid var(--dsw-alias-border-l2);
  margin-left: 2px;
}

/* \u88AB\u7981\u7528\u7684\u5F00\u5173\uFF08\u5982\u5E7F\u64AD\u5173\u65F6 ws-coord \u603B\u5F00\u5173\u4E0D\u53EF\u70B9\uFF09\uFF1A\u5F31\u5316\u63D0\u793A */
.me-switch:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Toggle switch (accent when on) */
.me-switch {
  appearance: none;
  flex: none;
  position: relative;
  width: 36px;
  height: 20px;
  margin: 0;
  border: 1px solid var(--dsw-alias-border-l3);
  border-radius: 10px;
  background: var(--dsw-alias-interactive-bg-active);
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease;
}

.me-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--dsw-static-neutral-00);
  transition: transform 150ms ease;
}

.me-switch:hover {
  border-color: var(--dsw-alias-border-l4);
}

.me-switch:checked {
  border-color: var(--dsw-alias-state-business-primary);
  background: var(--dsw-alias-state-business-primary);
}

.me-switch:checked::after {
  transform: translateX(16px);
}

/* Number / select inputs, right-aligned and uniform width */
.me-input,
.me-select {
  flex: none;
  width: 120px;
  height: 28px;
  box-sizing: border-box;
  padding: 0 8px;
  border: 1px solid var(--dsw-alias-border-l3);
  border-radius: 6px;
  outline: none;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  transition: border-color 120ms ease;
}

.me-input:hover,
.me-select:hover {
  border-color: var(--dsw-alias-border-l4);
}

.me-select {
  cursor: pointer;
}

.me-actions {
  display: flex;
  /* 2026-08-14 \u7528\u6237\u53CD\u9988\uFF1A\u4FDD\u5B58\u6309\u94AE\u5C45\u4E2D\u5BF9\u9F50 */
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--dsw-alias-border-l1);
}

/* \u914D\u7F6E\u4FDD\u5B58\u6309\u94AE\u52A0\u5927\uFF082026-08-14 \u7528\u6237\u53CD\u9988\uFF1A\u5927\u4E00\u70B9\u66F4\u9192\u76EE\uFF09 */
.me-actions .me-btn {
  font-size: 14px;
  padding: 9px 32px;
  border-radius: 8px;
}

/* ---------- Open-files button grid ---------- */

.me-reveal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
  gap: 8px;
}

.me-btn-reveal {
  justify-content: flex-start;
  height: 30px;
  padding: 0 10px;
  color: var(--dsw-alias-label-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
}

.me-btn-reveal:hover:not(:disabled) {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-state-business-primary);
}

/* ---------- Scrollbars (token-driven, fall back to border color) ---------- */

.me-panel::-webkit-scrollbar,
.me-list::-webkit-scrollbar {
  width: 8px;
}

.me-panel::-webkit-scrollbar-thumb,
.me-list::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: var(--dsw-alias-scrollbar-bg-l1, var(--dsw-alias-border-l3));
}

.me-panel::-webkit-scrollbar-thumb:hover,
.me-list::-webkit-scrollbar-thumb:hover {
  background: var(--dsw-alias-scrollbar-hover-l1, var(--dsw-alias-border-l4));
}

.me-panel::-webkit-scrollbar-track,
.me-list::-webkit-scrollbar-track {
  background: transparent;
}

/* ---- memory tab (conversation.view) ---- */
.mt-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 6px 12px 12px;
  overflow-y: auto;
  height: 100%;
  box-sizing: border-box;
}

.mt-notice {
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.5;
}

.mt-notice-ok {
  color: var(--dsw-alias-state-success-primary);
  background: var(--dsw-alias-state-success-tertiary);
}

.mt-notice-error {
  color: var(--dsw-alias-state-error-primary);
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent);
  border: 1px solid var(--dsw-alias-state-error-secondary);
}

.mt-cwd {
  margin: 0;
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mt-muted {
  margin: 0;
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary);
}

.mt-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mt-card {
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--dsw-alias-bg-layer-1);
}

.mt-card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

/* \u6BCF\u4E2A\u6587\u4EF6\u9875\u7B7E\u9876\u90E8\u7684\u4E00\u884C\u5C0F\u5B57\u8BF4\u660E\uFF08\u4F5C\u7528\u4E0E\u673A\u5236\uFF09 */
.mt-card-desc {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  color: var(--dsw-alias-label-secondary);
}

.mt-card-title {
  flex: none;
  font-size: 13px;
  font-weight: 600;
}

.mt-badge {
  flex: none;
  padding: 1px 8px;
  border-radius: 9px;
  font-size: 10px;
  line-height: 16px;
  font-weight: 600;
}

.mt-badge-ro {
  color: var(--dsw-alias-label-secondary);
  background: var(--dsw-alias-interactive-bg-active);
}

.mt-card-path {
  flex: 1;
  min-width: 0;
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
}

.mt-card-actions {
  flex: none;
}

.mt-btn {
  padding: 3px 10px;
  border-radius: 6px;
  border: 1px solid var(--dsw-alias-border-l3);
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  cursor: pointer;
}

.mt-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

/* ---- manual project KEY add box ---- */

/* Branch-scope line in the KEY add box and in the per-entry scope editor. */
.mt-key-scope {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 12px;
}

.mt-key-scope-label {
  font-size: 11px;
  color: var(--dsw-alias-label-secondary);
}

.mt-scope-opt {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  cursor: pointer;
}

.mt-scope-opt input {
  margin: 0;
  accent-color: var(--dsw-alias-state-business-primary);
}

.mt-scope-all-hint {
  font-style: normal;
  font-size: 10px;
  color: var(--dsw-alias-label-tertiary);
}

/* Per-entry branch-scope badge (click to edit). */
.mt-entry-branch {
  flex: none;
  max-width: 45%;
  padding: 1px 8px;
  border: 1px solid var(--dsw-alias-border-l3);
  border-radius: 9px;
  background: transparent;
  font-size: 10px;
  line-height: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--dsw-alias-state-business-primary);
  cursor: pointer;
}

.mt-entry-branch:hover {
  border-color: var(--dsw-alias-interactive-fg-default);
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}

.mt-entry-branch-all {
  color: var(--dsw-alias-label-secondary);
  font-weight: 500;
}

/* Static source-branch tag on daily/project log entries (not clickable). */
.mt-entry-branch-tag {
  color: var(--dsw-alias-state-success-primary);
  cursor: default;
  border-style: dashed;
}

/* \u300C\u4EC5 DSH\u300D\u6807\u8BB0\u5FBD\u7AE0\uFF1A\u8BE5\u6761\u76EE\u53EA\u6CE8\u5165 DSH \u81EA\u8EAB\uFF0C\u6CE8\u5165\u5916\u90E8\u6267\u884C\u5668\uFF08COI\uFF09\u65F6\u8DF3\u8FC7\u3002 */
.mt-entry-dsh-only {
  flex: none;
  padding: 1px 8px;
  border: 1px solid var(--dsw-alias-state-warning-border, var(--dsw-alias-border-l3));
  border-radius: 9px;
  background: transparent;
  font-size: 10px;
  line-height: 16px;
  font-weight: 600;
  white-space: nowrap;
  color: var(--dsw-alias-state-warning-fg, var(--dsw-alias-state-business-primary));
}

/* \u300C\u4EC5 DSH\u300Dtoggle \u6309\u94AE\u7684\u5DF2\u6807\u8BB0\u6FC0\u6D3B\u6001\uFF08\u9AD8\u4EAE\u533A\u5206\u5DF2\u6253\u6807\uFF09\u3002 */
.mt-entry-dsh-on {
  border-color: var(--dsw-alias-state-warning-border, var(--dsw-alias-border-l3)) !important;
  color: var(--dsw-alias-state-warning-fg, var(--dsw-alias-state-business-primary)) !important;
  font-weight: 600;
}

/* key \u624B\u52A8\u6DFB\u52A0\u6846\u7684\u300C\u4EC5 DSH\u300D\u52FE\u9009\u3002 */
.mt-key-dsh-opt {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  user-select: none;
}

/* Inline scope editor panel under a KEY entry. */
.mt-scope {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 12px;
  padding: 8px 10px;
  border: 1px dashed var(--dsw-alias-border-l4);
  border-radius: 8px;
  background: var(--dsw-alias-bg-base);
}

.mt-scope-actions {
  margin-left: auto;
  display: flex;
  gap: 6px;
}

/* Current-branch suffix on the KEY tab description line. */
.mt-card-desc-branch {
  color: var(--dsw-alias-state-business-primary);
  font-weight: 600;
}

.mt-key-add {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px dashed var(--dsw-alias-border-l4);
  border-radius: 8px;
  background: var(--dsw-alias-bg-base);
}

.mt-key-input {
  box-sizing: border-box;
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--dsw-alias-border-l3);
  border-radius: 8px;
  outline: none;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 120ms ease;
}

.mt-key-input:hover {
  border-color: var(--dsw-alias-border-l4);
}

.mt-key-input:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 1px;
}

.mt-key-input::placeholder {
  color: var(--dsw-alias-label-tertiary);
}

.mt-key-add-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.mt-key-help {
  font-size: 11px;
  line-height: 1.5;
  color: var(--dsw-alias-label-secondary);
}

.mt-btn-primary {
  flex: none;
  border-color: var(--dsw-alias-state-business-primary);
  background: var(--dsw-alias-state-business-primary);
  color: var(--dsw-alias-label-on-primary, #fff);
  font-weight: 600;
}

.mt-btn-primary:hover:not(:disabled) {
  filter: brightness(1.1);
}

.mt-content {
  margin: 0;
  padding: 10px;
  border-radius: 8px;
  background: var(--dsw-alias-bg-base);
  border: 1px solid var(--dsw-alias-border-l3);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 320px;
  overflow-y: auto;
}


.mt-warning {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  color: var(--dsw-alias-state-warn-primary);
}

/* ---- memory tab toolbar (view toggle + search) ---- */

.mt-file-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  padding: 0;
  border-bottom: 1px solid var(--dsw-alias-interactive-bg-hover);
  margin-bottom: 10px;
}

.mt-file-tab {
  appearance: none;
  height: 32px;
  padding: 0 12px;
  border: none;
  border-radius: 6px 6px 0 0;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease;
}

.mt-file-tab:hover:not(.mt-file-tab-active) {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}

.mt-file-tab-active,
.mt-file-tab-active:hover {
  background: var(--dsw-alias-interactive-bg-active);
  color: var(--dsw-alias-brand-primary);
  font-weight: 600;
}

/* Vertical divider between the feature tabs and the file tabs. */
.mt-tab-sep {
  flex: none;
  align-self: center;
  width: 1px;
  height: 16px;
  margin: 0 4px;
  background: var(--dsw-alias-border-l3);
}

/* Pending-count badge inside a feature tab (e.g. \u5F85\u786E\u8BA4\u8BB0\u5FC6\u5EFA\u8BAE (2)). */
.mt-feature-count {
  display: inline-block;
  min-width: 14px;
  margin-left: 6px;
  padding: 0 4px;
  border-radius: 8px;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
  font-weight: 700;
  color: var(--dsw-alias-label-on-primary, #fff);
  background: var(--dsw-alias-state-error-primary);
}

.mt-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* Segmented \u7F8E\u89C2/\u7EAF\u6587\u672C toggle */
.mt-view-toggle {
  flex: none;
  display: inline-flex;
  padding: 2px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-bg-base);
}

.mt-view-btn {
  padding: 3px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease;
}

.mt-view-btn:hover {
  color: var(--dsw-alias-label-primary);
}

.mt-view-btn-active,
.mt-view-btn-active:hover {
  background: var(--dsw-alias-interactive-bg-active);
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
}

.mt-view-btn:focus-visible,
.mt-search:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 1px;
}

.mt-search {
  flex: 1;
  min-width: 160px;
  height: 28px;
  box-sizing: border-box;
  padding: 0 10px;
  border: 1px solid var(--dsw-alias-border-l3);
  border-radius: 8px;
  outline: none;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  transition: border-color 120ms ease;
}

.mt-search:hover {
  border-color: var(--dsw-alias-border-l4);
}

.mt-search::placeholder {
  color: var(--dsw-alias-label-tertiary);
}

/* Search hit count badge in the card head */
.mt-badge-count {
  color: var(--dsw-alias-state-business-primary);
  background: var(--dsw-alias-state-business-tertiary);
}

/* Friendly empty state (no search results) */
.mt-empty {
  margin: 0;
  padding: 22px 12px;
  border: 1px dashed var(--dsw-alias-border-l3);
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
  color: var(--dsw-alias-label-tertiary);
}

/* ---- pretty view: \xA7 entry cards ---- */

.mt-entries {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 320px;
  overflow-y: auto;
}

.mt-entry {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: var(--dsw-alias-bg-base);
  transition: border-color 120ms ease, background-color 120ms ease;
}

.mt-entry:hover {
  border-color: var(--dsw-alias-border-l3);
  background: var(--dsw-alias-interactive-bg-hover);
}

.mt-entry-head {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.mt-entry-time {
  flex: none;
  padding: 1px 8px;
  border-radius: 9px;
  font-size: 10px;
  line-height: 16px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-active);
}

.mt-entry-tag {
  flex: none;
  max-width: 60%;
  padding: 1px 8px;
  border-radius: 9px;
  font-size: 10px;
  line-height: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--dsw-alias-state-business-primary);
  background: var(--dsw-alias-state-business-tertiary);
}

/* Per-entry action buttons (pretty view): right-aligned group. */
.mt-entry-ops {
  flex: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Neutral action (archive / promote back). */
.mt-entry-op {
  padding: 1px 8px;
  font-size: 11px;
  line-height: 16px;
  border-color: transparent;
  color: var(--dsw-alias-label-secondary);
  opacity: 0.8;
}

.mt-entry-op:hover:not(:disabled) {
  opacity: 1;
  border-color: var(--dsw-alias-border-l3);
  color: var(--dsw-alias-label-primary);
}

/* Per-entry delete button (pretty view): danger tint. */
.mt-entry-del {
  padding: 1px 8px;
  font-size: 11px;
  line-height: 16px;
  border-color: transparent;
  color: var(--dsw-alias-state-error-primary);
  opacity: 0.7;
}

.mt-entry-del:hover:not(:disabled) {
  opacity: 1;
  background: var(--dsw-alias-interactive-bg-hover-danger);
  border-color: var(--dsw-alias-state-error-secondary);
}

.mt-entry-text {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--dsw-alias-label-primary);
}

/* \u6761\u76EE\u6B63\u6587\u7F16\u8F91\u6846\uFF08\u7F8E\u89C2\u89C6\u56FE\u300C\u7F16\u8F91\u300D\uFF09\uFF1A\u53EA\u6539\u5185\u5BB9\uFF0C\u6807\u8BB0\u7A0B\u5E8F\u7EF4\u62A4 */
.mt-entry-edit {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mt-item-edit {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-l, rgba(128, 128, 128, 0.3));
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 12px;
  line-height: 1.5;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  resize: vertical;
  min-height: 56px;
}

.mt-item-edit:focus-visible {
  outline: 2px solid var(--dsw-static-blue-6, #2563eb);
  outline-offset: 1px;
}

.mt-entry-edit-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.mt-entry-edit-hint {
  flex: 1 1 auto;
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
}

/* Entry list scrollbar (token-driven, fall back to border color) */
.mt-entries::-webkit-scrollbar {
  width: 8px;
}

.mt-entries::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: var(--dsw-alias-scrollbar-bg-l1, var(--dsw-alias-border-l3));
}

.mt-entries::-webkit-scrollbar-thumb:hover {
  background: var(--dsw-alias-scrollbar-hover-l1, var(--dsw-alias-border-l4));
}

.mt-entries::-webkit-scrollbar-track {
  background: transparent;
}

/* \u5206\u9875\u5668\uFF08\u7F8E\u89C2\u89C6\u56FE\u5927\u6587\u4EF6\u5206\u9875\uFF0C2026-08-10\uFF09 */
.mt-pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--dsw-alias-border-l2, rgba(128, 128, 128, 0.2));
}

.mt-pager-info {
  font-size: 12px;
  color: var(--dsw-alias-label-secondary, rgba(128, 128, 128, 0.85));
}

/* ---------- Todo sub-tab ---------- */

.me-tabs {
  flex: none;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.me-tab {
  border: 1px solid var(--dsw-alias-border-l, rgba(128, 128, 128, 0.3));
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
  background: transparent;
  cursor: pointer;
}

.me-tab:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}

.me-tab-active {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-brand-primary);
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent);
}

.me-todo-add {
  flex: none;
  display: flex;
  gap: 8px;
  align-items: center;
}

.me-todo-input {
  flex: 1;
  min-width: 0;
  border: 1px solid var(--dsw-alias-border-l, rgba(128, 128, 128, 0.3));
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
}

.me-todo-select,
.me-todo-date,
.me-todo-filters select {
  border: 1px solid var(--dsw-alias-border-l, rgba(128, 128, 128, 0.3));
  border-radius: 6px;
  padding: 5px 8px;
  font-size: 12px;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
}

.me-todo-filters {
  flex: none;
  display: flex;
  gap: 16px;
  align-items: center;
}

.me-todo-filter {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
}

.me-todo-filter-check {
  cursor: pointer;
  user-select: none;
}

.me-todo-filter-check input {
  accent-color: var(--dsw-static-blue-5, #3b82f6);
}

/* \u8FC7\u5F80 daily \u5F85\u529E\u7684\u5206\u7EC4\u6807\u9898\uFF08\u5982 8\u67085\u65E5\uFF09 */
.me-todo-day {
  list-style: none;
  margin: 10px 0 2px;
  font-size: 12px;
  font-weight: 600;
  color: var(--dsw-alias-label-secondary);
  border-bottom: 1px dashed var(--dsw-alias-border-l, rgba(128, 128, 128, 0.3));
  padding-bottom: 2px;
}

.me-badge-day {
  color: var(--dsw-static-amber-7, #b45309);
  background: color-mix(in srgb, var(--dsw-static-amber-5, #f59e0b) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--dsw-static-amber-5, #f59e0b) 40%, transparent);
}

.me-todo-item--done .me-todo-text {
  opacity: 0.55;
  text-decoration: line-through;
}

.me-todo-text {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--dsw-alias-label-primary);
}

.me-badge-quad {
  border: 1px solid transparent;
}

.me-badge-quad-q1 {
  color: var(--dsw-static-red-5, #e5484d);
  background: color-mix(in srgb, var(--dsw-static-red-5, #e5484d) 14%, transparent);
  border-color: color-mix(in srgb, var(--dsw-static-red-5, #e5484d) 40%, transparent);
}

.me-badge-quad-q2 {
  color: var(--dsw-static-blue-5, #3b82f6);
  background: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 14%, transparent);
  border-color: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 40%, transparent);
}

.me-badge-quad-q3 {
  color: var(--dsw-static-amber-5, #f59e0b);
  background: color-mix(in srgb, var(--dsw-static-amber-5, #f59e0b) 14%, transparent);
  border-color: color-mix(in srgb, var(--dsw-static-amber-5, #f59e0b) 40%, transparent);
}

.me-badge-quad-q4 {
  color: var(--dsw-static-neutral-5, #8b8d98);
  background: color-mix(in srgb, var(--dsw-static-neutral-5, #8b8d98) 14%, transparent);
  border-color: color-mix(in srgb, var(--dsw-static-neutral-5, #8b8d98) 40%, transparent);
}

.me-badge-quad-none {
  color: var(--dsw-alias-label-tertiary);
  background: transparent;
  border-color: var(--dsw-alias-border-l, rgba(128, 128, 128, 0.3));
}

.me-badge-overdue {
  color: var(--dsw-static-red-5, #e5484d);
  background: color-mix(in srgb, var(--dsw-static-red-5, #e5484d) 12%, transparent);
}

.me-badge-due {
  color: var(--dsw-static-amber-5, #f59e0b);
  background: color-mix(in srgb, var(--dsw-static-amber-5, #f59e0b) 12%, transparent);
}

.me-todo-help {
  font-size: 11px;
  line-height: 1.6;
  color: var(--dsw-alias-label-tertiary);
  margin: 0;
}

/* ---------- \u5F85\u529E\uFF1A\u5217\u8868 / \u770B\u677F \u89C6\u56FE\u5207\u6362\uFF08\u5206\u6BB5\u63A7\u4EF6\uFF09 ---------- */

.me-todo-view-switch {
  display: inline-flex;
  margin-left: auto;
  border: 1px solid var(--dsw-alias-border-l, rgba(128, 128, 128, 0.3));
  border-radius: 8px;
  overflow: hidden;
  flex: none;
}

.me-todo-view-btn {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  padding: 4px 12px;
  cursor: pointer;
  line-height: 1.4;
}

.me-todo-view-btn:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}

.me-todo-view-btn-active {
  color: var(--dsw-alias-label-primary);
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent);
  font-weight: 600;
}

/* ---------- \u5F85\u529E\uFF1A\u56DB\u8C61\u9650\u770B\u677F ----------
 * 2\xD72 \u5BAB\u683C\uFF1B\u6BCF\u4E2A\u8C61\u9650\u7528\u4E0D\u540C\u8272\u76F8\u63CF\u8FB9/\u6807\u9898\u70B9\u7F00\uFF0C\u989C\u8272\u5168\u90E8\u8D70
 * --dsw-static-* / --dsw-alias-* token\uFF0C\u6DF1\u6D45\u8272\u81EA\u9002\u5E94\u3002
 */

.me-todo-board {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: minmax(160px, 1fr) minmax(160px, 1fr);
  gap: 10px;
  flex: none;
  min-height: 320px;
  max-height: 52vh;
}

/* \u7A84\u5C4F\uFF1A\u56DB\u8C61\u9650\u6539\u4E3A\u5355\u5217\u5806\u53E0\uFF0C\u907F\u514D\u5361\u7247\u88AB\u6324\u6241 */
@media (max-width: 720px) {
  .me-todo-board {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    max-height: none;
  }
}

.me-todo-quad {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-radius: 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-1);
  overflow: hidden;
}

/* \u8C61\u9650\u8272\u5E26\uFF1A\u9876\u90E8\u7EC6\u7EBF + \u6807\u9898\u8272\uFF0C\u4E0E\u5217\u8868\u5FBD\u6807\u914D\u8272\u4E00\u81F4 */
.me-todo-quad-q1 {
  border-color: color-mix(in srgb, var(--dsw-static-red-5, #e5484d) 45%, var(--dsw-alias-border-l2));
  box-shadow: inset 0 3px 0 0 color-mix(in srgb, var(--dsw-static-red-5, #e5484d) 70%, transparent);
}
.me-todo-quad-q2 {
  border-color: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 45%, var(--dsw-alias-border-l2));
  box-shadow: inset 0 3px 0 0 color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 70%, transparent);
}
.me-todo-quad-q3 {
  border-color: color-mix(in srgb, var(--dsw-static-amber-5, #f59e0b) 45%, var(--dsw-alias-border-l2));
  box-shadow: inset 0 3px 0 0 color-mix(in srgb, var(--dsw-static-amber-5, #f59e0b) 70%, transparent);
}
.me-todo-quad-q4 {
  border-color: color-mix(in srgb, var(--dsw-static-neutral-5, #8b8d98) 45%, var(--dsw-alias-border-l2));
  box-shadow: inset 0 3px 0 0 color-mix(in srgb, var(--dsw-static-neutral-5, #8b8d98) 55%, transparent);
}

.me-todo-quad-head {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px 6px;
}

.me-todo-quad-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}

.me-todo-quad-q1 .me-todo-quad-title { color: var(--dsw-static-red-5, #e5484d); }
.me-todo-quad-q2 .me-todo-quad-title { color: var(--dsw-static-blue-5, #3b82f6); }
.me-todo-quad-q3 .me-todo-quad-title { color: var(--dsw-static-amber-6, #d97706); }
.me-todo-quad-q4 .me-todo-quad-title { color: var(--dsw-static-neutral-5, #8b8d98); }

.me-todo-quad-count {
  flex: none;
  min-width: 18px;
  box-sizing: border-box;
  padding: 1px 6px;
  border-radius: 9px;
  font-size: 11px;
  line-height: 16px;
  text-align: center;
  color: var(--dsw-alias-label-secondary);
  background: color-mix(in srgb, var(--dsw-alias-label-secondary) 12%, transparent);
}

.me-todo-quad-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 8px 10px;
}

.me-todo-quad-empty {
  margin: 12px 4px;
  padding: 16px 8px;
  text-align: center;
  font-size: 12px;
  line-height: 1.5;
  color: var(--dsw-alias-label-tertiary);
  border: 1px dashed var(--dsw-alias-border-l, rgba(128, 128, 128, 0.3));
  border-radius: 8px;
  background: color-mix(in srgb, var(--dsw-alias-bg-base) 60%, transparent);
}

/* \u770B\u677F\u5361\u7247\uFF1A\u5DE6\u4FA7\u4EFB\u52A1\u8272\u6761 + \u6807\u9898/\u5143\u4FE1\u606F/\u64CD\u4F5C\u4E09\u6BB5\u7ED3\u6784\u3002 */
.me-todo-card {
  display: flex;
  align-items: stretch;
  gap: 0;
  padding: 0;
  border-radius: 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
  overflow: hidden;
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

.me-todo-card:hover {
  border-color: var(--dsw-alias-border-l3);
  box-shadow: 0 1px 4px color-mix(in srgb, var(--dsw-alias-label-primary) 6%, transparent);
}

.me-todo-card-bar {
  flex: none;
  width: 4px;
  align-self: stretch;
}

.me-todo-card-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 10px;
}

.me-todo-card-head {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
}

.me-todo-card-text {
  flex: 1;
  min-width: 0;
}

.me-todo-card--done {
  background: var(--dsw-alias-interactive-bg-active);
  border-color: var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-tertiary);
}

.me-todo-card--done .me-todo-card-title {
  text-decoration: line-through;
}

.me-todo-card-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.me-todo-card-title {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--dsw-alias-label-primary);
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.me-todo-card-body {
  margin: 0;
  font-size: 11px;
  line-height: 1.45;
  color: var(--dsw-alias-label-tertiary);
  white-space: pre-wrap;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.me-todo-card-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-top: 2px;
}

.me-todo-card-foot .me-item-actions {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
}

.me-todo-card-foot .me-btn {
  font-size: 11px;
  padding: 2px 8px;
}

/* \u72B6\u6001\u5FBD\u6807\uFF08\u5217\u8868 + \u770B\u677F\u5171\u7528\uFF09\uFF1B\u53EF\u70B9\u51FB\u5207\u6362\u72B6\u6001 */
.me-badge-status {
  appearance: none;
  cursor: pointer;
  border: 1px solid transparent;
  font-family: inherit;
}

.me-badge-status:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.me-badge-status:hover:not(:disabled) {
  filter: brightness(1.05);
}

.me-badge-status-pending {
  color: var(--dsw-alias-label-secondary);
  background: color-mix(in srgb, var(--dsw-alias-label-secondary) 12%, transparent);
  border-color: color-mix(in srgb, var(--dsw-alias-label-secondary) 30%, transparent);
}

.me-badge-status-doing {
  color: var(--dsw-static-blue-5, #3b82f6);
  background: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 14%, transparent);
  border-color: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 40%, transparent);
}

.me-badge-status-done {
  color: var(--dsw-static-green-5, #16a34a);
  background: color-mix(in srgb, var(--dsw-static-green-5, #16a34a) 14%, transparent);
  border-color: color-mix(in srgb, var(--dsw-static-green-5, #16a34a) 40%, transparent);
}

.me-badge-status-blocked {
  color: var(--dsw-static-red-5, #e5484d);
  background: color-mix(in srgb, var(--dsw-static-red-5, #e5484d) 14%, transparent);
  border-color: color-mix(in srgb, var(--dsw-static-red-5, #e5484d) 40%, transparent);
}

.me-badge-status-cancelled {
  color: var(--dsw-static-neutral-5, #8b8d98);
  background: color-mix(in srgb, var(--dsw-static-neutral-5, #8b8d98) 14%, transparent);
  border-color: color-mix(in srgb, var(--dsw-static-neutral-5, #8b8d98) 35%, transparent);
  text-decoration: line-through;
}

/* \u4F1A\u8BDD\u5934\u90E8\u300C\u590D\u5236\u4F1A\u8BDD ID\u300D\u6309\u94AE\uFF08conversation.session.header.actions \u63D2\u69FD\uFF09\u3002
   \u5C0F\u5C3A\u5BF8\u5E7D\u7075\u6309\u94AE\uFF1A\u8DDF\u968F DSH \u4E3B\u9898 token\uFF0C\u9F20\u6807\u60AC\u505C\u52A0\u6DF1\u3002 */
.me-copy-session-id {
  appearance: none;
  border: 1px solid var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.35));
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary, inherit);
  font-size: 12px;
  line-height: 1;
  padding: 4px 8px;
  cursor: pointer;
  white-space: nowrap;
}
.me-copy-session-id:hover {
  border-color: var(--dsw-alias-interactive-bg-active, rgba(128, 128, 128, 0.6));
  color: var(--dsw-alias-label-primary, inherit);
}

/* \u4F1A\u8BDD\u522B\u540D\u6309\u94AE\uFF08header actions\uFF0C\u590D\u5236\u4F1A\u8BDD ID \u6309\u94AE\u65C1\uFF09\uFF1A\u5185\u8054\u7F16\u8F91\u533A */
.me-alias-wrap {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.me-alias-editor {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.me-alias-input {
  width: 110px;
  appearance: none;
  border: 1px solid var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.35));
  border-radius: 6px;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  padding: 3px 6px;
  outline: none;
}

.me-alias-input:focus {
  border-color: var(--dsw-alias-state-accent-primary, #4c8dff);
}

.me-alias-notice {
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
}

/* ---- \u6A21\u578B\u8BBE\u7F6E Tab\uFF08models-hub\uFF09----
 * mt-models-* \u524D\u7F00\uFF0Ctoken \u4E0E\u98CE\u683C\u4E0E\u73B0\u6709 mt- \u7C7B\u4E00\u81F4\uFF08\u4E0D\u81EA\u5EFA\u6837\u5F0F\u4F53\u7CFB\uFF09\u3002
 * \u8868\u683C + \u884C\u5185\u914D\u7F6E\uFF08\u542F\u7528\u5F00\u5173 / \u601D\u8003\u7B49\u7EA7\u6807\u7B7E\u4E0E\u7F16\u8F91\u5668 / \u5907\u6CE8\u8F93\u5165\uFF09\u3002 */

/* \u8868\u683C\u6EDA\u52A8\u5BB9\u5668\uFF08\u8868\u683C\u53EF\u80FD\u8D85\u51FA\u9762\u677F\u9AD8\u5EA6\uFF09\u3002 */
.mt-models-scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: var(--dsw-alias-bg-base);
}

.mt-models-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.mt-models-cell {
  padding: 6px 10px;
  border-bottom: 1px solid var(--dsw-alias-interactive-bg-hover);
  vertical-align: top;
  text-align: left;
  color: var(--dsw-alias-label-primary);
}

.mt-models-table thead .mt-models-cell {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.mt-models-table tbody .mt-models-row:last-child .mt-models-cell {
  border-bottom: none;
}

/* \u7981\u7528\u884C\uFF1A\u6574\u884C\u964D\u900F\u660E + \u540D\u79F0\u5212\u7EBF\u5F31\u5316\u3002 */
.mt-models-row-muted .mt-models-cell {
  opacity: 0.55;
}

.mt-models-col-enable {
  width: 44px;
}

.mt-models-col-capacity {
  width: 96px;
  white-space: nowrap;
}

.mt-models-col-reasoning {
  min-width: 180px;
}

.mt-models-provider {
  font-weight: 600;
}

.mt-models-tag {
  display: inline-block;
  margin: 1px 4px 1px 0;
  padding: 0 7px;
  border-radius: 9px;
  font-size: 10px;
  line-height: 17px;
  white-space: nowrap;
  color: var(--dsw-alias-label-secondary);
  background: var(--dsw-alias-interactive-bg-active);
}

.mt-models-tag-rec {
  color: var(--dsw-alias-state-business-primary);
  background: var(--dsw-alias-state-business-tertiary);
}

.mt-models-tag-dormant {
  margin-left: 4px;
  color: var(--dsw-alias-state-warning-primary);
  background: var(--dsw-alias-state-warning-tertiary);
}

.mt-models-model {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.mt-models-model-name {
  font-weight: 600;
}

.mt-models-model-id {
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
  word-break: break-all;
}

.mt-models-capacity {
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-secondary);
}

.mt-models-muted-cell {
  color: var(--dsw-alias-label-tertiary);
}

.mt-models-levels {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  margin-bottom: 2px;
}

.mt-models-level-none {
  font-size: 11px;
  color: var(--dsw-alias-state-error-primary);
}

.mt-models-level-more {
  font-size: 10px;
  color: var(--dsw-alias-label-tertiary);
}

.mt-models-link {
  appearance: none;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--dsw-alias-state-accent-primary, #4c8dff);
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}

.mt-models-link:hover {
  text-decoration: underline;
}

.mt-models-link-danger {
  color: var(--dsw-alias-state-error-primary);
}

.mt-models-note {
  width: 100%;
  min-width: 140px;
  box-sizing: border-box;
  padding: 3px 8px;
  border: 1px solid transparent;
  border-radius: 6px;
  outline: none;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  transition: border-color 120ms ease, background-color 120ms ease;
}

.mt-models-note:hover {
  border-color: var(--dsw-alias-border-l3);
}

.mt-models-note:focus {
  border-color: var(--dsw-alias-state-accent-primary, #4c8dff);
  background: var(--dsw-alias-bg-base);
}

.mt-models-note::placeholder {
  color: var(--dsw-alias-label-tertiary);
}

/* \u5C55\u5F00\u7684\u601D\u8003\u7B49\u7EA7\u7F16\u8F91\u5668\uFF08\u5360\u6574\u884C\uFF09\u3002 */
.mt-models-expanded {
  padding: 10px 12px;
  background: var(--dsw-alias-interactive-bg-hover);
}

.mt-models-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mt-models-editor-title {
  font-size: 11px;
  color: var(--dsw-alias-label-secondary);
}

.mt-models-editor-levels {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mt-models-editor-level {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  cursor: pointer;
}

.mt-models-editor-level-name {
  font-weight: 600;
}

.mt-models-editor-level-id {
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
}

.mt-models-editor-add {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.mt-models-editor-add .mt-search {
  flex: 0 1 180px;
}

.mt-models-editor-actions {
  display: flex;
  gap: 8px;
}

.mt-models-toggle-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  white-space: nowrap;
}

/* \u601D\u8003\u5173\u95ED\u6807\u8BB0\uFF08\u6A21\u578B\u8BBE\u7F6E\u8868\u683C\u884C\u5185\uFF09\u3002 */
.mt-models-tag-off {
  color: var(--dsw-alias-state-error-primary);
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent);
}

/* \u63A8\u8350\u7B49\u7EA7\u4E0B\u62C9\uFF08\u601D\u8003\u7B49\u7EA7\u7F16\u8F91\u5668\u5185\uFF09\u3002 */
.mt-models-select {
  appearance: none;
  max-width: 260px;
  padding: 3px 24px 3px 8px;
  border: 1px solid var(--dsw-alias-border-l3);
  border-radius: 6px;
  outline: none;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}

.mt-models-select:disabled {
  opacity: 0.5;
  cursor: default;
}

.mt-models-editor-label {
  flex: none;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
}

.mt-models-editor-hint {
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
}

/* \u7248\u672C\u68C0\u6D4B\u300C\u53D1\u5E03\u8BF4\u660E\u300D\uFF1A\u4FDD\u7559\u6362\u884C\uFF08tag \u9644\u6CE8\u591A\u884C\u5C55\u793A\uFF0CCodeX \u590D\u5BA1 P1-8\uFF09\u3002 */
.me-notes-pre {
  white-space: pre-wrap;
  word-break: break-word;
}

/* \u2014\u2014 \u5F85\u529E\u65E5\u5386\u89C6\u56FE\uFF08me-cal-*\uFF09\u2014\u2014 */
.me-cal {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 2px 0 10px;
}

.me-cal-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.me-cal-title {
  flex: 1;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}

.me-cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.me-cal-week {
  margin-bottom: 2px;
}

.me-cal-weekday {
  text-align: center;
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
}

.me-cal-cell {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-height: 58px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
  cursor: pointer;
  text-align: left;
  font: inherit;
  transition: border-color 120ms ease, background 120ms ease;
}

.me-cal-cell:hover {
  border-color: var(--dsw-alias-border-l3);
}

.me-cal-cell--out {
  opacity: 0.45;
}

.me-cal-cell--today {
  border-color: var(--dsw-static-blue-6, #2563eb);
  box-shadow: inset 0 0 0 1px var(--dsw-static-blue-6, #2563eb);
}

.me-cal-cell--selected {
  border-color: var(--dsw-static-blue-6, #2563eb);
  background: color-mix(in srgb, var(--dsw-static-blue-6, #2563eb) 10%, var(--dsw-alias-bg-base));
}

.me-cal-cell--overdue .me-cal-cell-date {
  color: var(--dsw-static-red-5, #e5484d);
  font-weight: 700;
}

.me-cal-cell-date {
  font-size: 12px;
  line-height: 1.2;
  color: var(--dsw-alias-label-secondary);
}

.me-cal-cell-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.me-cal-cell-item {
  font-size: 10px;
  line-height: 1.25;
  color: var(--dsw-alias-label-primary);
  background: color-mix(in srgb, var(--dsw-alias-bg-elevated, var(--dsw-alias-bg-base)) 80%, var(--dsw-alias-border-l2));
  border-radius: 4px;
  padding: 1px 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.me-cal-cell-item--done {
  opacity: 0.55;
  text-decoration: line-through;
}

.me-cal-cell-more {
  font-size: 10px;
  color: var(--dsw-alias-label-tertiary);
}

.me-cal-detail {
  border-top: 1px dashed var(--dsw-alias-border-l, rgba(128, 128, 128, 0.3));
  padding-top: 10px;
}

.me-cal-detail-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
  margin-bottom: 8px;
}

/* \u2014\u2014 \u5F85\u529E\u5468\u89C6\u56FE\uFF08me-week-*\uFF09\u2014\u2014 */
.me-week {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 2px 0 10px;
}

.me-week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.me-week-cell {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-height: 96px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
  cursor: pointer;
  text-align: left;
  font: inherit;
  transition: border-color 120ms ease;
}

.me-week-cell:hover {
  border-color: var(--dsw-alias-border-l3);
}

.me-week-cell--today {
  border-color: var(--dsw-static-blue-6, #2563eb);
  box-shadow: inset 0 0 0 1px var(--dsw-static-blue-6, #2563eb);
}

.me-week-cell--selected {
  border-color: var(--dsw-static-blue-6, #2563eb);
  background: color-mix(in srgb, var(--dsw-static-blue-6, #2563eb) 10%, var(--dsw-alias-bg-base));
}

.me-week-cell--overdue .me-week-cell-date {
  color: var(--dsw-static-red-5, #e5484d);
  font-weight: 700;
}

.me-week-cell-head {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.me-week-cell-weekday {
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
}

.me-week-cell-date {
  font-size: 13px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}

.me-week-cell-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.me-week-cell-item {
  font-size: 10px;
  line-height: 1.25;
  color: var(--dsw-alias-label-primary);
  background: color-mix(in srgb, var(--dsw-alias-bg-elevated, var(--dsw-alias-bg-base)) 80%, var(--dsw-alias-border-l2));
  border-radius: 4px;
  padding: 1px 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.me-week-cell-item--done {
  opacity: 0.55;
  text-decoration: line-through;
}

/* \u2014\u2014 \u5F85\u529E\u9879\u76EE\u89C6\u56FE\uFF08me-proj-*\uFF09\u2014\u2014 */
.me-proj {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 2px 0 10px;
}

.me-proj-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.me-proj-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  padding: 8px;
  background: color-mix(in srgb, var(--dsw-alias-bg-base) 70%, transparent);
}

.me-proj-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.me-proj-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}

.me-proj-count {
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
}

.me-proj-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* \u2014\u2014 \u9879\u76EE / \u8D1F\u8D23\u4EBA\u5FBD\u6807 \u2014\u2014 */
.me-badge-proj {
  background: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 14%, transparent);
  color: var(--dsw-static-blue-5, #3b82f6);
}

.me-badge-who {
  background: color-mix(in srgb, var(--dsw-static-green-6, #46a758) 14%, transparent);
  color: var(--dsw-static-green-6, #46a758);
}

/* \u89C6\u56FE\u5207\u6362 5 \u4E2A\u6309\u94AE\u5141\u8BB8\u6362\u884C */
.me-todo-view-switch {
  flex-wrap: wrap;
}

/* \u2014\u2014 \u9875\u7B7E\u884C\u7684\u9879\u76EE\u5207\u6362\u4E0B\u62C9 \u2014\u2014 */
.me-tab-proj {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-left: 4px;
  font-size: 12px;
  vertical-align: middle;
}

.me-tab-proj-icon {
  font-size: 11px;
  color: var(--dsw-alias-label-secondary);
}

.me-tab-proj select {
  font-size: 11px;
  max-width: 110px;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  padding: 2px 4px;
  cursor: pointer;
}

.me-tab-proj select:hover {
  border-color: var(--dsw-alias-border-l3);
}

/* \u9876\u680F\u53F3\u4FA7\u7A7A\u9699 + \u6DFB\u52A0\u6309\u94AE */
.me-tabs-spacer {
  flex: 1;
}

.me-add-btn {
  margin-left: 6px;
  font-weight: 600;
}

/* \u2014\u2014 \u6DFB\u52A0\u5F85\u529E\u5F39\u7A97\uFF08me-modal-*\uFF09\u2014\u2014 */
.me-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, #000 35%, transparent);
  padding: 16px;
}

.me-modal-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 420px;
  max-height: 86vh;
  overflow-y: auto;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
  box-shadow: 0 8px 32px color-mix(in srgb, #000 25%, transparent);
}

.me-modal-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}

.me-modal-content {
  min-height: 56px;
  resize: vertical;
  font: inherit;
  font-size: 13px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
}

.me-modal-content:focus {
  outline: none;
  border-color: var(--dsw-static-blue-6, #2563eb);
}

.me-modal-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.me-modal-row select,
.me-modal-row input[type='date'] {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  padding: 5px 6px;
  border-radius: 6px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
}

.me-modal-input {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  padding: 5px 6px;
  border-radius: 6px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
}

.me-modal-hint {
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
}

/* \u2014\u2014 \u521B\u5EFA\u5F39\u7A97\u5B57\u6BB5\u884C\uFF08\u65E5\u4E8B\u6E05\u5F0F\uFF09\u2014\u2014 */
.me-modal-field-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.me-modal-field-row select {
  max-width: 140px;
  font-size: 12px;
  padding: 5px 6px;
  border-radius: 6px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
}

.me-modal-field-label {
  flex: none;
  width: 44px;
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary);
}

.me-modal-time {
  flex: 1;
  min-width: 0;
  text-align: left;
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
}

.me-modal-time:hover {
  border-color: var(--dsw-static-blue-6, #2563eb);
}

/* \u2014\u2014 \u65F6\u95F4\u9009\u62E9\u5668\u6708\u5386\u9762\u677F \u2014\u2014 */
.me-modal-dates {
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  padding: 8px;
  background: var(--dsw-alias-bg-base);
}

.me-modal-dates-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.me-modal-dates-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}

.me-modal-dates-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.me-modal-dates-week {
  text-align: center;
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
}

.me-modal-dates-day {
  font: inherit;
  font-size: 12px;
  padding: 3px 0;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  text-align: center;
}

.me-modal-dates-day:hover {
  background: var(--dsw-alias-bg-elevated, var(--dsw-alias-bg-base));
}

.me-modal-dates-day--today {
  border-color: var(--dsw-static-blue-6, #2563eb);
}

.me-modal-dates-day--sel {
  background: var(--dsw-static-blue-6, #2563eb);
  color: #fff;
  font-weight: 600;
}

.me-modal-dates-foot {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.me-modal-foot {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* \u2014\u2014 \u5468\u671F / \u65F6\u95F4\u8DE8\u5EA6\u5FBD\u6807 \u2014\u2014 */
.me-badge-repeat {
  background: color-mix(in srgb, var(--dsw-static-purple-5, #8e4ec6) 14%, transparent);
  color: var(--dsw-static-purple-5, #8e4ec6);
}

.me-badge-range {
  background: color-mix(in srgb, var(--dsw-static-amber-6, #d97706) 14%, transparent);
  color: var(--dsw-static-amber-6, #d97706);
}

/* \u2014\u2014 \u65E5\u671F\u8F93\u5165\u53EF\u89C1\u6807\u7B7E \u2014\u2014 */
.me-modal-date {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.me-modal-date span {
  font-size: 10px;
  color: var(--dsw-alias-label-tertiary);
}

/* \u2014\u2014 \u65F6\u95F4\u8DE8\u5EA6\u957F\u6761\uFF08\u65E5\u5386/\u5468\u89C6\u56FE\u8272\u5E26\uFF09\u2014\u2014 */
.me-cal-cell--span {
  background: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 16%, transparent);
}

.me-week-cell--span {
  background: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 16%, transparent);
}

.me-cal-cell-span-title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.me-cal-cell-item--span {
  background: var(--dsw-static-blue-6, #2563eb);
  color: #fff;
}

.me-week-cell-item--span {
  background: var(--dsw-static-blue-6, #2563eb);
  color: #fff;
}

/* \u2014\u2014 \u8272\u5E26\u6EA2\u51FA\u5EF6\u4F38\uFF08\u8FDE\u8D77\u683C\u5B50\u7F1D\u9699\uFF0C\u8BA9\u957F\u6761\u8FDE\u7EED\u8DE8\u8FC7\u8D77\u70B9\u6846\uFF09\u2014\u2014 */
.me-cal-cell {
  position: relative;
}

.me-week-cell {
  position: relative;
}

.me-cal-cell-bleed,
.me-week-cell-bleed {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 5px;
  background: color-mix(in srgb, var(--dsw-static-blue-5, #3b82f6) 16%, transparent);
  pointer-events: none;
  z-index: 2;
}

.me-cal-cell-bleed-left,
.me-week-cell-bleed-left {
  left: -5px;
}

.me-cal-cell-bleed-right,
.me-week-cell-bleed-right {
  right: -5px;
}

.me-cal-cell-bleed-both,
.me-week-cell-bleed-both {
  left: -5px;
  right: -5px;
  width: auto;
}

/* \u2014\u2014 \u4ECA\u5929\u300C\u4ECA\u300D\u6807\u8BB0\uFF08\u65E5\u4E8B\u6E05\u5F0F\uFF09\u2014\u2014 */
.me-cal-cell-today-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  margin-left: 3px;
  padding: 0 4px;
  border-radius: 8px;
  background: var(--dsw-static-red-6, #e5484d);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  vertical-align: 1px;
}

/* \u2014\u2014 \u683C\u5B50\u5FEB\u6377\u521B\u5EFA\u300C\uFF0B\u300D\uFF08hover \u663E\u793A\uFF09\u2014\u2014 */
.me-cal-cell-add,
.me-week-cell-add {
  position: absolute;
  top: 3px;
  right: 3px;
  z-index: 3;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--dsw-static-blue-5, #3b82f6);
  color: #fff;
  font-size: 11px;
  line-height: 16px;
  text-align: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 120ms ease;
  pointer-events: auto;
}

.me-cal-cell:hover .me-cal-cell-add,
.me-week-cell:hover .me-week-cell-add {
  opacity: 1;
}

.me-cal-cell-add:hover,
.me-week-cell-add:hover {
  background: var(--dsw-static-blue-6, #2563eb);
}

.me-week-cell-add {
  position: static;
  margin-left: auto;
}

/* \u2014\u2014 \u53F3\u4E0B\u60AC\u6D6E\u6DFB\u52A0\u6309\u94AE\uFF08\u65E5\u4E8B\u6E05\u5F0F FAB\uFF09\u2014\u2014 */
.me-fab {
  position: fixed;
  right: 28px;
  bottom: 28px;
  z-index: 500;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: var(--dsw-static-red-6, #ff5967);
  color: #fff;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 4px 14px color-mix(in srgb, #ff5967 45%, transparent);
  transition: transform 120ms ease, box-shadow 120ms ease;
}

.me-fab:hover {
  transform: scale(1.06);
  box-shadow: 0 6px 18px color-mix(in srgb, #ff5967 55%, transparent);
}

/* ========== \u65E5\u4E8B\u6E05\u8BBE\u8BA1\u4EE4\u724C\u5BF9\u9F50\uFF08\u7B2C\u4E09\u8F6E\uFF09 ========== */
.me-panel {
  --todo-primary: #1c69ff;
  --todo-text-main: #1d212a;
  --todo-text-aux: #86909d;
  --todo-bg-soft: #f7f9fb;
  --todo-radius: 8px;
}

/* \u5217\u8868\u4E0E\u5EFA\u8BAE\u5171\u7528\u5143\u4FE1\u606F\u884C\uFF1B\u5177\u4F53\u4EFB\u52A1\u6807\u9898\u5E03\u5C40\u5728\u6700\u7EC8\u5217\u8868\u89C4\u5219\u4E2D\u5B9A\u4E49\u3002 */
.me-item-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin-top: 3px;
}

/* \u56DB\u8C61\u9650\u5BAB\u683C\u6807\u9898\u8272\u6761\uFF084px \xD7 18px\uFF0C\u65E5\u4E8B\u6E05 quad title\uFF09 */
.me-todo-quad-bar {
  flex: none;
  width: 4px;
  height: 18px;
  border-radius: 2px;
}

/* \u4ECA\u5929\u683C\u5B50\uFF1A\u6DE1\u5E95 #f7f9fb + \u65E5\u671F\u53D8\u84DD\uFF08\u65E5\u4E8B\u6E05\uFF09 */
.me-cal-cell--today {
  background: var(--todo-bg-soft, #f7f9fb);
  box-shadow: none;
}

.me-week-cell--today {
  background: var(--todo-bg-soft, #f7f9fb);
}

.me-cal-cell--today .me-cal-cell-date,
.me-week-cell--today .me-week-cell-date {
  color: var(--todo-primary, #1c69ff);
  font-weight: 600;
}

/* \u4E3B\u8272\u4E0E\u5706\u89D2\u5BF9\u9F50 */
.me-fab {
  background: var(--todo-primary, #1c69ff);
  box-shadow: 0 4px 14px rgba(28, 105, 255, 0.35);
}

/* ============================================================
 * DeepSeek Harness Desktop / Codex \u5F0F\u4E2D\u6027 UI \u8986\u76D6\uFF08\u8FFD\u52A0\u5C42\uFF09
 * \u8986\u76D6\u65E7\u300C\u65E5\u4E8B\u6E05\u300D\u786C\u7F16\u7801\u6837\u5F0F\uFF1B\u989C\u8272\u4E00\u5F8B\u8D70 DSW token\uFF0C\u6697\u8272\u81EA\u9002\u5E94\uFF0C
 * \u4E0D\u5F15\u5165\u65B0\u7684 #fff \u767D\u5E95 / \u767D\u5B57\u786C\u7F16\u7801\u3002
 * ============================================================ */

/* ---------- \u9762\u677F\uFF1A\u81EA\u7136\u9AD8\u5EA6 + \u547C\u5438\u95F4\u8DDD ---------- */
.me-panel {
  height: auto;
  min-height: 0;
  gap: 14px;
  padding: 8px 6px 32px;
}

/* \u4F1A\u8BDD\u8BB0\u5FC6 Tab \u5185\uFF1A\u5F7B\u5E95\u653E\u5F00\u9AD8\u5EA6\uFF0C\u4EA4\u7ED9\u5916\u5C42\u6EDA\u52A8\uFF0C\u4E0D\u4E8C\u6B21\u622A\u65AD */
.mt-panel .me-panel {
  max-height: none;
  height: auto;
}

/* \u65E7\u65E5\u4E8B\u6E05\u81EA\u5B9A\u4E49\u53D8\u91CF \u2192 DSH token\uFF08\u515C\u4F4F\u65E7\u89C4\u5219\u91CC\u7684\u5F15\u7528\uFF09 */
.me-panel {
  --todo-primary: var(--dsw-alias-state-business-primary);
  --todo-text-main: var(--dsw-alias-label-primary);
  --todo-text-aux: var(--dsw-alias-label-secondary);
  --todo-bg-soft: color-mix(in srgb, var(--dsw-alias-state-business-primary) 8%, var(--dsw-alias-bg-layer-1));
}

/* ---------- \u5DE5\u5177\u680F\uFF1A\u6E05\u6670\u3001\u53EF\u6362\u884C ---------- */
.me-tabs {
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.me-todo-filters {
  flex-wrap: wrap;
  gap: 8px 16px;
}

.me-todo-view-switch {
  flex-wrap: wrap;
  margin-left: auto;
}

/* ---------- \u6309\u94AE / \u9009\u6846 / \u8F93\u5165\uFF1A\u7EDF\u4E00 DSH token ---------- */
.me-tab,
.me-todo-input,
.me-todo-select,
.me-todo-date,
.me-todo-filters select,
.me-modal-row select,
.me-modal-row input[type='date'],
.me-modal-input,
.me-modal-time,
.me-modal-content,
.me-tab-proj select {
  border-color: var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
}

.me-tab:hover,
.me-todo-input:hover,
.me-todo-select:hover,
.me-todo-date:hover {
  border-color: var(--dsw-alias-border-l3);
}

.me-tab-active {
  border-color: var(--dsw-alias-state-business-primary);
  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent);
  color: var(--dsw-alias-label-primary);
}

/* \u52FE\u9009\u6846 / \u590D\u9009\u6846\uFF1A\u4E3B\u8272 token */
.me-todo-filter-check input,
.me-scope-opt input {
  accent-color: var(--dsw-alias-state-business-primary);
}

/* ---------- \u5217\u8868\u4EFB\u52A1\u884C & \u770B\u677F\u5361\u7247\uFF1A\u4E2D\u6027\u5361\u7247 ---------- */
.me-todo-item {
  transition: border-color 120ms ease, background-color 120ms ease;
}

/* Remaining and overdue labels share typography; only the warning color changes. */
.me-todo-days,
.me-week-cell-delay {
  margin-left: 8px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.45;
  white-space: nowrap;
  color: var(--dsw-alias-state-business-primary);
}

.me-todo-days--overdue,
.me-week-cell-delay {
  color: var(--dsw-alias-state-error-primary) !important;
}

/* ---------- \u884C\u5185\u64CD\u4F5C\uFF1A\u9ED8\u8BA4\u4F4E\u900F\u660E\uFF0Chover / focus \u663E\u73B0 ---------- */
.me-todo-item .me-item-actions,
.me-todo-card-foot .me-item-actions {
  opacity: 0.35;
  transition: opacity 120ms ease;
}

.me-todo-item:hover .me-item-actions,
.me-todo-card:hover .me-item-actions,
.me-todo-item:focus-within .me-item-actions,
.me-todo-card:focus-within .me-item-actions {
  opacity: 1;
}

/* ---------- \u5FBD\u6807\u5F31\u5316\uFF1A\u53BB\u5F69\u8272\uFF0C\u7EDF\u4E00\u4E3A\u6B21\u7EA7\u4E2D\u6027 ---------- */
.me-badge,
.me-badge-day,
.me-badge-quad,
.me-badge-quad-q1,
.me-badge-quad-q2,
.me-badge-quad-q3,
.me-badge-quad-q4,
.me-badge-quad-none,
.me-badge-status,
.me-badge-status-pending,
.me-badge-status-doing,
.me-badge-status-done,
.me-badge-status-blocked,
.me-badge-status-cancelled,
.me-badge-proj,
.me-badge-who,
.me-badge-repeat,
.me-badge-range,
.me-badge-overdue,
.me-badge-due {
  color: var(--dsw-alias-label-secondary);
  background: var(--dsw-alias-interactive-bg-active);
  border-color: transparent;
}

/* ---------- \u770B\u677F\uFF1A\u4E0D\u622A\u65AD\u9AD8\u5EA6 ---------- */
.me-todo-board {
  max-height: none;
  min-height: 0;
  grid-template-rows: minmax(140px, auto) minmax(140px, auto);
}

@media (max-width: 720px) {
  .me-todo-board {
    grid-template-rows: none;
  }
}

/* ---------- \u65E5\u5386 / \u5468 / \u9879\u76EE\u89C6\u56FE\uFF1A\u7EDF\u4E00 token ---------- */
.me-cal-cell,
.me-week-cell,
.me-proj-group {
  background: var(--dsw-alias-bg-layer-1);
  border-color: var(--dsw-alias-border-l2);
}

.me-cal-cell:hover,
.me-week-cell:hover {
  border-color: var(--dsw-alias-border-l3);
}

.me-cal-cell--today,
.me-week-cell--today {
  background: var(--todo-bg-soft, color-mix(in srgb, var(--dsw-alias-state-business-primary) 8%, var(--dsw-alias-bg-layer-1)));
  box-shadow: inset 0 0 0 1px var(--dsw-alias-state-business-primary);
}

.me-cal-cell--today .me-cal-cell-date,
.me-week-cell--today .me-week-cell-date {
  color: var(--dsw-alias-state-business-primary);
}

/* ---------- Modal\uFF1A\u906E\u7F69 token\u3001\u66F4\u5BBD\u66F4\u5E72\u51C0 ---------- */
.me-modal {
  background: color-mix(in srgb, #000 45%, transparent);
  backdrop-filter: blur(3px);
}

.me-modal-box {
  max-width: 520px;
  max-height: 88vh;
  padding: 18px;
  border-color: var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-1);
  box-shadow: 0 12px 40px color-mix(in srgb, #000 30%, transparent);
}

.me-modal-title {
  color: var(--dsw-alias-label-primary);
}

/* \u9009\u4E2D\u65E5\u671F / \u4ECA\u6807\u8BB0 / \u5FEB\u6377\uFF0B / \u52FE\u9009\u5706\u70B9\uFF1A\u767D\u5B57\u6539 on-primary token */
.me-modal-dates-day--sel,
.me-cal-cell-today-mark,
.me-cal-cell-add,
.me-week-cell-add,
.me-todo-check {
  color: var(--dsw-alias-label-on-primary, var(--dsw-static-neutral-00));
}

.me-modal-dates-day--sel {
  background: var(--dsw-alias-state-business-primary);
}

.me-cal-cell-add,
.me-week-cell-add {
  background: var(--dsw-alias-state-business-primary);
}

.me-cal-cell-add:hover,
.me-week-cell-add:hover {
  background: var(--dsw-alias-state-business-primary);
}

.me-cal-cell-item--span,
.me-week-cell-item--span {
  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 85%, transparent);
  color: var(--dsw-alias-label-on-primary, var(--dsw-static-neutral-00));
}

/* ---------- FAB\uFF1A\u684C\u9762\u9690\u85CF\uFF0C\u7A84\u5C4F\u624D\u663E\u793A\u5C0F\u5C3A\u5BF8 ---------- */
.me-fab {
  display: none;
}

@media (max-width: 640px) {
  .me-fab {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    right: 16px;
    bottom: 16px;
    font-size: 18px;
    background: var(--dsw-alias-state-business-primary);
    color: var(--dsw-alias-label-on-primary, var(--dsw-static-neutral-00));
    box-shadow: 0 4px 14px color-mix(in srgb, var(--dsw-alias-state-business-primary) 35%, transparent);
  }

  .me-fab:hover {
    background: var(--dsw-alias-state-business-primary);
    box-shadow: 0 6px 18px color-mix(in srgb, var(--dsw-alias-state-business-primary) 45%, transparent);
  }
}

/* ---------- \u54CD\u5E94\u5F0F\u5DE5\u5177\u680F ---------- */
@media (max-width: 720px) {
  .me-todo-filters {
    width: 100%;
    justify-content: flex-start;
  }

  .me-todo-view-switch {
    width: 100%;
    margin-left: 0;
  }

  .me-todo-view-btn {
    flex: 1;
    text-align: center;
  }

  .me-todo-add {
    flex-wrap: wrap;
    width: 100%;
  }

  .me-todo-input {
    flex: 1 1 100%;
  }
}

/* ============================================================
 * DSH / Codex Calendar surface
 * The component supplies the grid coordinates and lane variables;
 * this layer owns geometry, scrolling, and theme-safe presentation.
 * ============================================================ */

.me-panel {
  --me-blue: var(--dsw-alias-state-business-primary, var(--dsw-static-blue-6, #2563eb));
  --me-blue-strong: var(--dsw-static-blue-6, #2563eb);
  --me-blue-soft: color-mix(in srgb, var(--me-blue) 10%, var(--dsw-alias-bg-layer-1));
  --me-blue-muted: color-mix(in srgb, var(--me-blue) 14%, var(--dsw-alias-bg-layer-1));
  --me-span-track-height: 20px;
  --me-span-height: 16px;
  --me-span-track-padding: 2px;
  --me-span-fill: var(--me-blue-strong);
  --me-span-color: var(--dsw-alias-label-on-primary, var(--dsw-static-neutral-00, #fff));
  --me-span-preview-fill: color-mix(in srgb, var(--me-span-fill) 24%, transparent);
  --me-span-drag-fill: color-mix(in srgb, var(--me-span-fill) 72%, var(--dsw-alias-bg-layer-1));
  --me-span-drop-color: var(--me-blue-strong);
  --me-span-done-fill: var(--dsw-alias-label-tertiary);
  --me-span-done-color: var(--dsw-alias-bg-base);
  --me-span-radius: 4px;
}

/* Keep narrow-pane overflow inside each toolbar instead of widening the panel. */
.me-tabs,
.me-todo-filters {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: thin;
  padding-bottom: 2px;
}

.me-tabs > *,
.me-todo-filters > * {
  flex: none;
  white-space: nowrap;
}

.me-tabs-spacer {
  flex: 1 1 0%;
}

.me-todo-view-switch {
  flex: none;
  margin-left: auto;
  flex-wrap: nowrap;
}

.me-todo-view-btn {
  flex: none;
  white-space: nowrap;
}

/* Completion is a square control with an explicit border in every theme. */
.me-todo-check {
  appearance: none;
  flex: 0 0 18px;
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  margin: 2px 0 0;
  padding: 0;
  border: 1.5px solid var(--me-blue-strong);
  border-radius: 4px;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-on-primary, var(--dsw-static-neutral-00, #fff));
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
  cursor: pointer;
  opacity: 1;
}

.me-todo-check:hover:not(:disabled) {
  background: var(--me-blue-muted);
  border-color: var(--me-blue-strong);
}

.me-todo-check:focus-visible {
  outline: 2px solid var(--me-blue-strong);
  outline-offset: 2px;
}

.me-todo-check--done,
.me-todo-check--done:hover:not(:disabled) {
  border-color: var(--me-blue-strong);
  background: var(--me-blue-strong);
  color: var(--dsw-alias-label-on-primary, var(--dsw-static-neutral-00, #fff));
}

/* Success/completion meanings use the same blue family; red and amber remain semantic. */
.me-btn-ok,
.me-badge-status-done,
.me-todo-days,
.me-notice-ok {
  color: var(--me-blue-strong);
}

.me-btn-ok {
  border-color: var(--me-blue-strong);
}

.me-btn-ok:hover:not(:disabled),
.me-notice-ok {
  background: var(--me-blue-muted);
}

.me-notice-ok {
  border-color: var(--me-blue-strong);
}

.me-notice-ok::before {
  background: var(--me-blue-strong);
}

.me-badge-status-done {
  background: color-mix(in srgb, var(--me-blue-strong) 14%, transparent);
  border-color: color-mix(in srgb, var(--me-blue-strong) 40%, transparent);
}

.me-todo-days {
  color: var(--me-blue-strong);
}

.me-badge-who {
  background: color-mix(in srgb, var(--me-blue-strong) 14%, transparent);
  color: var(--me-blue-strong);
}

/* Calendar root and navigation. */
.me-calendar-scroll {
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: visible;
  scrollbar-width: thin;
  overscroll-behavior-x: contain;
}

.me-calendar-surface,
.me-week-surface {
  min-width: 720px;
  color: var(--dsw-alias-label-primary);
}

.me-cal-nav {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
}

.me-icon-btn {
  width: 28px;
  min-width: 28px;
  height: 28px;
  padding: 0;
  font-size: 18px;
  line-height: 1;
}

.me-cal-head {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  align-items: center;
  gap: 12px;
  overflow-x: auto;
  scrollbar-width: thin;
}

.me-cal-head > * {
  flex: none;
  white-space: nowrap;
}

.me-cal-head > .me-cal-title {
  flex: 1 0 140px;
  min-width: 140px;
}

/* Monthly grid: each week is one stacked date row with a spanning event layer. */
.me-cal-weekdays,
.me-cal-days,
.me-cal-span-layer {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  column-gap: 4px;
}

.me-cal-weekdays {
  min-height: 28px;
  align-items: center;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}

.me-cal-weekday {
  min-width: 0;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: var(--dsw-alias-label-tertiary);
}

.me-cal-row {
  --me-cal-date-head-height: 30px;
  --me-cal-row-bottom-padding: 6px;
  --me-cal-row-min-height: max(
    84px,
    calc(
      var(--me-cal-date-head-height)
      + (var(--me-span-lanes, 0) * var(--me-span-track-height))
      + var(--me-cal-row-bottom-padding)
    )
  );
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(var(--me-cal-row-min-height), auto);
  min-height: var(--me-cal-row-min-height);
  overflow: hidden;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-1);
}

.me-cal-days,
.me-cal-span-layer {
  grid-area: 1 / 1;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.me-cal-days {
  position: relative;
  z-index: 1;
  min-height: var(--me-cal-row-min-height);
  align-items: stretch;
}

.me-cal-cell {
  min-width: 0;
  min-height: var(--me-cal-row-min-height);
  margin: 0;
  padding: 6px 6px 5px;
  border-width: 0 1px 0 0;
  border-radius: 0;
  background: var(--dsw-alias-bg-layer-1);
}

.me-cal-cell:last-child {
  border-right: 0;
}

.me-cal-cell:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  border-color: var(--dsw-alias-border-l2);
}

.me-cal-cell--out {
  opacity: 0.42;
}

.me-cal-cell--today,
.me-cal-cell--selected {
  background: var(--me-blue-soft);
}

.me-cal-cell--today .me-cal-cell-date {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--me-blue-strong);
  color: var(--dsw-alias-label-on-primary, var(--dsw-static-neutral-00, #fff));
}

.me-cal-cell-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 22px;
}

.me-cal-cell-select {
  min-width: 24px;
  height: 24px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: center;
  cursor: pointer;
}

.me-cal-cell-select:hover,
.me-cal-cell-select:focus-visible {
  background: var(--me-blue-muted);
  outline: none;
}

.me-cal-cell-date {
  font-size: 12px;
  font-weight: 600;
  line-height: 22px;
  color: var(--dsw-alias-label-secondary);
}

.me-cal-cell-add {
  position: static;
  display: inline-flex;
  flex: 0 0 18px;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 4px;
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  font-size: 14px;
  line-height: 1;
  text-align: center;
  opacity: 0;
}

.me-cal-cell:hover .me-cal-cell-add,
.me-cal-cell:focus-within .me-cal-cell-add {
  opacity: 1;
}

.me-cal-cell-add:hover {
  background: var(--me-blue-muted);
  border-color: var(--me-blue-strong);
  color: var(--me-blue-strong);
}

.me-cal-cell-items {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  margin-top: 5px;
}

.me-cal-cell-item {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 4px;
  padding: 2px 4px;
  border-radius: 3px;
  background: var(--dsw-alias-interactive-bg-active);
  color: var(--dsw-alias-label-primary);
  font-size: 10px;
  line-height: 14px;
}

.me-cal-cell-item--done {
  opacity: 0.55;
  text-decoration: line-through;
}

.me-cal-event-dot {
  flex: 0 0 5px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--me-blue-strong);
}

.me-cal-cell-more {
  color: var(--dsw-alias-label-tertiary);
  font-size: 10px;
  line-height: 14px;
}

/* The monthly event layer stays in the date row and grows it through lane tracks. */
.me-cal-span-layer {
  grid-area: 1 / 1;
  position: relative;
  z-index: 2;
  min-height: var(--me-cal-row-min-height);
  align-items: start;
  grid-template-rows: repeat(var(--me-span-lanes, 0), var(--me-span-track-height));
  padding: var(--me-cal-date-head-height) 0 var(--me-cal-row-bottom-padding);
  pointer-events: none;
}

.me-calendar-span {
  grid-row: calc(var(--me-span-lane, 0) + 1);
  align-self: center;
  min-width: 0;
  height: var(--me-span-height);
  box-sizing: border-box;
  margin: 0 3px;
  padding: 1px 8px;
  overflow: hidden;
  border: 0;
  border-radius: var(--me-span-radius);
  background: color-mix(in srgb, var(--me-span-fill, var(--me-blue-strong)) 16%, var(--dsw-alias-bg-base));
  color: color-mix(in srgb, var(--me-span-fill, var(--me-blue-strong)) 80%, var(--dsw-alias-label-primary));
  font: inherit;
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  pointer-events: auto;
  cursor: pointer;
}

.me-calendar-span-delay {
  flex: none;
  margin-left: 6px;
  color: var(--dsw-static-red-5, #e5484d);
  font-size: 10px;
  font-weight: 600;
}

.me-calendar-span::before,
.me-calendar-span::after {
  content: none;
}

.me-calendar-span--before {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  opacity: 0.82;
}

.me-calendar-span--after {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  opacity: 0.82;
}

.me-calendar-span--done {
  background: var(--me-span-done-fill);
  color: var(--me-span-done-color);
  text-decoration: line-through;
}

/* macOS-calendar style overflow entry: sits in the last visible lane, right side. */
.me-calendar-more {
  grid-column: 1 / -1;
  grid-row: calc(var(--me-span-lanes, 0));
  justify-self: end;
  align-self: center;
  margin: 0 3px;
  padding: 0 8px;
  border: 0;
  border-radius: var(--me-span-radius);
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 10px;
  line-height: 16px;
  cursor: pointer;
  pointer-events: auto;
}

.me-calendar-more:hover,
.me-calendar-more:focus-visible {
  background: var(--me-blue-muted);
  color: var(--me-blue-strong);
  outline: none;
}

.me-calendar-detail-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Weekly surface: fixed seven columns inside an overflow container. */
.me-week-surface {
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-1);
}

.me-week-headers,
.me-week-columns {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  column-gap: 0;
}

.me-week-headers {
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}

.me-week-date-head {
  position: relative;
  min-width: 0;
  min-height: 54px;
  padding: 8px 6px 6px;
  border: 0;
  border-right: 1px solid var(--dsw-alias-border-l2);
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  text-align: center;
  cursor: pointer;
}

.me-week-date-head:last-child {
  border-right: 0;
}

.me-week-date-head span {
  display: block;
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
}

.me-week-date-head strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  margin-top: 3px;
  border-radius: 50%;
  font-size: 15px;
  color: var(--dsw-alias-label-primary);
}

.me-week-date-head:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}

.me-week-date-head--today strong {
  background: var(--me-blue-strong);
  color: var(--dsw-alias-label-on-primary, var(--dsw-static-neutral-00, #fff));
}

.me-week-date-head--selected {
  background: var(--me-blue-soft);
}

/* Week view is day-card based; the legacy full-week strip is intentionally retired. */
.me-week-all-day,
.me-week-span-layer {
  display: none;
}

.me-week-columns {
  min-height: 128px;
  align-items: stretch;
}

.me-week-column {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  min-height: 128px;
  padding: 8px 5px;
  border-right: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-1);
}

.me-week-column:last-child {
  border-right: 0;
}

.me-week-column--today {
  background: var(--me-blue-soft);
}

.me-week-column-add {
  align-self: flex-end;
  width: 18px;
  height: 18px;
  margin: -3px -2px 0 0;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  font-size: 14px;
  line-height: 18px;
  opacity: 0;
  cursor: pointer;
}

.me-week-column:hover .me-week-column-add,
.me-week-column:focus-within .me-week-column-add {
  opacity: 1;
}

.me-week-column-add:hover {
  background: var(--me-blue-muted);
  color: var(--me-blue-strong);
}

.me-week-event {
  --me-span-drop-color: var(--me-week-accent, var(--me-blue-strong));
  position: relative;
  display: grid;
  grid-template-columns: 6px minmax(0, 1fr);
  grid-auto-rows: min-content;
  align-items: start;
  gap: 3px 6px;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 6px 7px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-left: 3px solid var(--me-week-accent, var(--me-blue-strong));
  border-radius: 5px;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  box-shadow: 0 1px 2px color-mix(in srgb, var(--dsw-alias-label-primary) 8%, transparent);
  font: inherit;
  font-size: 12px;
  line-height: 16px;
  text-align: left;
  cursor: pointer;
  touch-action: auto;
}

.me-week-event:hover,
.me-week-event:focus-visible {
  border-color: color-mix(in srgb, var(--me-week-accent, var(--me-blue-strong)) 46%, var(--dsw-alias-border-l2));
  border-left-color: var(--me-week-accent, var(--me-blue-strong));
  background: color-mix(in srgb, var(--me-week-accent, var(--me-blue-strong)) 7%, var(--dsw-alias-bg-base));
  outline: none;
}

.me-week-event .me-cal-event-dot {
  grid-column: 1;
  grid-row: 1;
  align-self: center;
  margin-top: 4px;
  background: var(--me-week-accent, var(--me-blue-strong));
}

.me-week-event--range {
  background: color-mix(in srgb, var(--me-week-accent, var(--me-blue-strong)) 5%, var(--dsw-alias-bg-base));
}

.me-week-event--draft {
  border-style: dashed;
  border-color: var(--me-week-accent, var(--me-blue-strong));
  background: color-mix(in srgb, var(--me-week-accent, var(--me-blue-strong)) 10%, var(--dsw-alias-bg-base));
  opacity: 0.68;
  pointer-events: none;
}

.me-week-event--dragging,
.me-week-event--dragging:hover {
  z-index: 4;
  opacity: 1;
  border-color: var(--me-blue-strong, #2563eb);
  border-left-color: var(--me-blue-strong, #2563eb);
  background: var(--dsw-alias-bg-base);
  box-shadow: 0 3px 10px color-mix(in srgb, var(--me-blue-strong, #2563eb) 25%, transparent);
  cursor: grabbing;
  touch-action: none;
}

.me-week-event--done {
  background: var(--dsw-alias-interactive-bg-active);
  border-color: var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-tertiary);
  opacity: 1;
}

.me-week-event--done .me-week-event-title {
  text-decoration: line-through;
}

.me-week-event-title {
  grid-column: 2;
  min-width: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  overflow-wrap: anywhere;
  white-space: normal;
}

.me-week-event-meta {
  grid-column: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 2px 5px;
  min-width: 0;
  margin: 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.me-week-event-meta:empty {
  display: none;
}

.me-week-event-meta > span {
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
}

.me-week-event-meta > span + span::before {
  content: '\xB7';
  margin-right: 5px;
  color: var(--dsw-alias-border-l3);
}

/* Today badges are boxed labels; separators would look like stray symbols. */
.me-today .me-week-event-meta > span + span::before,
.me-today .me-week-event-meta .me-badge + .me-badge::before {
  content: none;
  margin-right: 0;
}

.me-week-event-schedule,
.me-week-event .me-week-cell-delay {
  grid-column: 2;
  display: block;
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
  white-space: normal;
}

.me-week-event-schedule {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 1.4;
  font-variant-numeric: tabular-nums;
}

.me-week-event--range .me-week-event-schedule {
  color: color-mix(in srgb, var(--me-week-accent, var(--me-blue-strong)) 72%, var(--dsw-alias-label-primary));
}

.me-week-event .me-week-cell-delay {
  color: var(--dsw-alias-state-error-primary);
}

/* \u4ECA\u65E5\u89C6\u56FE\u5361\u7247\uFF1A\u590D\u7528\u5468\u89C6\u56FE\u4FE1\u606F\u5361\u7247\u7ED3\u6784\uFF0C\u4F46\u7B2C\u4E00\u5217\u653E\u5B8C\u6210\u52FE\u9009\u6846\uFF08\u66FF\u4EE3\u5706\u70B9\uFF09\u3002 */
.me-week-event--today {
  grid-template-columns: 18px minmax(0, 1fr);
  cursor: pointer;
}

.me-week-event--today .me-todo-check {
  grid-column: 1;
  grid-row: 1;
  align-self: start;
  margin-top: 1px;
}

.me-week-event--today .me-week-event-title {
  grid-column: 2;
}

.me-week-event--today .me-week-event-meta,
.me-week-event--today .me-week-event-schedule,
.me-week-event--today .me-week-cell-delay {
  grid-column: 2;
}

/* Completed items in the Today sidebar are deliberately subdued. */
.me-week-event--today.me-week-event--done {
  background: color-mix(in srgb, var(--dsw-alias-bg-layer-2) 82%, var(--dsw-alias-label-tertiary));
  border-color: var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-tertiary);
  opacity: 0.58;
}

.me-week-event--today.me-week-event--done .me-week-event-title,
.me-week-event--today.me-week-event--done .me-week-event-meta,
.me-week-event--today.me-week-event--done .me-week-event-schedule,
.me-week-event--today.me-week-event--done .me-week-cell-delay {
  color: var(--dsw-alias-label-tertiary);
  text-decoration: line-through;
}

.me-week-event--today.me-week-event--done .me-todo-check {
  border-color: var(--dsw-alias-label-tertiary);
  background: var(--dsw-alias-label-tertiary);
}

.me-week-empty {
  flex: 1;
  min-height: 48px;
}

/* Narrow panes scroll the calendar at a stable width instead of collapsing text. */
@media (max-width: 720px) {
  .me-calendar-scroll {
    margin-inline: -2px;
    padding-inline: 2px;
  }

  .me-calendar-surface,
  .me-week-surface {
    min-width: 680px;
  }

  .me-cal-head {
    padding-bottom: 2px;
  }
}

@media (hover: none), (pointer: coarse) {
  .me-cal-cell-add,
  .me-week-column-add {
    opacity: 1;
  }
}

/* ============================================================
 * Calendar drag interaction states
 * These classes are state hooks supplied by the calendar controller.
 * ============================================================ */

/* A pending range is a visual preview only and must not intercept input. */
.me-calendar-span--draft {
  border: 1px dashed var(--me-span-drop-color);
  background: var(--me-span-preview-fill);
  color: var(--me-span-drop-color);
  opacity: 0.58;
  pointer-events: none;
}

/* Keep native desktop dragging without blocking ordinary touch scrolling.
   \u6307\u9488\u7EDF\u4E00\uFF1A\u60AC\u505C\u4E00\u5F8B\u300C\u70B9\u51FB\u300D\u6307\u9488\uFF08cursor: pointer\uFF09\uFF0C\u53EA\u6709\u62D6\u52A8\u4E2D\u7684\u5143\u7D20
   \u624D\u5207\u6362\u6210\u300C\u62D6\u52A8\u300D\u6307\u9488\uFF08grabbing\uFF09\u3002 */
.me-calendar-span {
  cursor: pointer;
  touch-action: auto;
}

.me-calendar-span--dragging {
  cursor: grabbing;
  touch-action: none;
  z-index: 4;
  opacity: 0.82;
  border: 1px solid color-mix(in srgb, var(--me-span-fill) 72%, transparent);
  background: var(--me-span-drag-fill);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--me-span-fill) 26%, transparent);
}

.me-calendar-span--dragging,
.me-calendar-span--dragging:hover {
  cursor: grabbing;
}

/* Drop target guides: before = upper insertion line, after = lower line.
   \u56FA\u5B9A\u84DD\u8272\u5B9E\u7EBF\uFF08\u4E0D\u968F\u4EFB\u52A1\u8272\u53D8\u5316\uFF09\uFF0C\u6E05\u6670\u8868\u8FBE"\u63D2\u5165\u5230\u8FD9\u91CC"\u3002 */
.me-calendar-span--drop-before,
.me-calendar-span--drop-after {
  position: relative;
}

.me-calendar-span--drop-before::before,
.me-calendar-span--drop-after::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  z-index: 5;
  height: 3px;
  border-radius: 2px;
  background: var(--me-blue-strong, #2563eb);
  pointer-events: none;
}

.me-calendar-span--drop-before::before {
  top: -2px;
}

.me-calendar-span--drop-after::after {
  bottom: -2px;
}

/* Date surfaces scroll normally until the range gesture becomes active. */
.me-cal-cell,
.me-week-date-head,
.me-week-column {
  touch-action: pan-x pan-y;
}

/* The selected drag range keeps the day cell visibly in the active target state. */
.me-cal-cell--range-drag {
  touch-action: none;
  background: color-mix(in srgb, var(--me-blue-strong) 14%, var(--dsw-alias-bg-layer-1));
  box-shadow: inset 0 0 0 2px var(--me-blue-strong);
}

.me-cal-cell--range-drag .me-cal-cell-date {
  color: var(--me-blue-strong);
  font-weight: 700;
}

.me-cal-cell--range-drag::after {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px dashed color-mix(in srgb, var(--me-blue-strong) 68%, transparent);
  border-radius: 3px;
  pointer-events: none;
}

/* ============================================================
 * \u4ECA\u65E5\u89C6\u56FE\uFF08\u4FA7\u8FB9\u680F\u7EAF\u4ECA\u65E5 + \u9876\u90E8\u591A\u89C6\u56FE\u4E2D\u7684\u300C\u4ECA\u65E5\u300D\uFF09
 * \u5355\u65E5\u4EFB\u52A1\u5361\u7247\u5217\u8868\uFF1A\u6807\u9898 + \u9879\u76EE/\u8D1F\u8D23\u4EBA + \u8D77\u6B62/\u5468\u671F + \u903E\u671F\u3002
 * ============================================================ */
.me-today {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.me-today-head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px 10px;
  min-width: 0;
}

.me-today-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--dsw-alias-label-primary);
}

.me-today-date {
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
  font-variant-numeric: tabular-nums;
}

.me-today-overdue {
  font-size: 11px;
  font-weight: 600;
  color: var(--dsw-alias-state-error-primary);
}

.me-today-head .me-add-btn {
  margin-left: auto;
}

.me-today-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

/* ============================================================
 * Final macOS-style todo visual system
 * One neutral surface language; project colors are accents only.
 * ============================================================ */
.me-panel {
  --todo-ui-card: color-mix(in srgb, var(--dsw-alias-bg-base) 94%, var(--dsw-alias-bg-layer-1));
  --todo-ui-card-hover: color-mix(in srgb, var(--dsw-alias-bg-base) 88%, var(--dsw-alias-interactive-bg-hover));
  --todo-ui-border: var(--dsw-alias-border-l2);
  --todo-ui-border-strong: var(--dsw-alias-border-l3);
  --todo-ui-radius: 8px;
  --todo-ui-control-radius: 6px;
  gap: 12px;
  padding: 8px 4px 24px;
  font-size: 13px;
  line-height: 1.45;
}

/* Toolbars remain unframed and compact, like native macOS controls. */
.me-tabs,
.me-todo-filters,
.me-cal-head,
.me-proj-toolbar,
.me-today-head {
  gap: 8px;
  padding-inline: 4px;
}

.me-todo-view-switch {
  gap: 2px;
  padding: 2px;
  overflow: visible;
  border-color: var(--todo-ui-border);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-2);
}

.me-todo-view-btn {
  min-height: 26px;
  padding: 3px 10px;
  border-radius: var(--todo-ui-control-radius);
  font-size: 12px;
  line-height: 18px;
}

.me-todo-view-btn-active {
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  box-shadow: 0 1px 2px color-mix(in srgb, var(--dsw-alias-label-primary) 10%, transparent);
}

.me-btn,
.me-tab,
.me-todo-filters select,
.me-tab-proj select {
  min-height: 28px;
  border-radius: var(--todo-ui-control-radius);
  font-size: 12px;
  letter-spacing: 0;
}

.me-btn {
  border-color: var(--todo-ui-border);
  background: var(--dsw-alias-bg-base);
  box-shadow: none;
}

.me-btn:hover:not(:disabled) {
  border-color: var(--todo-ui-border-strong);
  background: var(--dsw-alias-interactive-bg-hover);
}

.me-btn-primary {
  border-color: var(--dsw-alias-state-business-primary);
  background: var(--dsw-alias-state-business-primary);
  color: var(--dsw-alias-label-on-primary, var(--dsw-static-neutral-00, #fff));
}

.me-icon-btn {
  width: 28px;
  min-width: 28px;
  padding: 0;
}

/* One card language for list, project, week and today. */
.me-todo-item,
.me-todo-card,
.me-week-event {
  border: 1px solid var(--todo-ui-border);
  border-radius: var(--todo-ui-radius);
  background: var(--todo-ui-card);
  box-shadow: none;
}

.me-todo-item:hover,
.me-todo-card:hover,
.me-week-event:hover,
.me-week-event:focus-visible {
  border-color: var(--todo-ui-border-strong);
  background: var(--todo-ui-card-hover);
  box-shadow: none;
}

.me-todo-card-bar {
  width: 3px;
}

.me-todo-card-main {
  gap: 6px;
  padding: 9px 10px;
}

.me-todo-card-head {
  gap: 8px;
}

.me-todo-text,
.me-todo-card-title,
.me-week-event-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.45;
  letter-spacing: 0;
}

.me-todo-card-body,
.me-todo-card-meta,
.me-item-meta,
.me-week-event-meta,
.me-week-event-schedule,
.me-proj-count,
.me-today-date {
  font-size: 12px;
  line-height: 1.45;
}

.me-todo-card-meta,
.me-item-meta,
.me-week-event-meta {
  color: var(--dsw-alias-label-secondary);
}

.me-item-time {
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
}

.me-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 19px;
  padding: 1px 7px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0;
  text-align: center;
  vertical-align: middle;
}

.me-todo-card-foot {
  margin-top: 0;
  gap: 8px;
}

.me-todo-card-foot .me-btn {
  min-height: 24px;
  padding: 2px 7px;
  font-size: 11px;
}

/* Week and Today share the same information card. */
.me-week-event {
  grid-template-columns: 7px minmax(0, 1fr);
  gap: 4px 8px;
  padding: 8px 9px;
  border-left: 3px solid var(--me-week-accent, var(--me-blue-strong));
  background: var(--todo-ui-card);
  font-size: 12px;
  line-height: 1.45;
}

.me-week-event:hover,
.me-week-event:focus-visible {
  background: var(--todo-ui-card-hover);
}

.me-week-event .me-cal-event-dot {
  width: 6px;
  height: 6px;
  margin-top: 6px;
}

.me-week-event-title {
  font-size: 14px;
}

.me-week-event-meta,
.me-week-event-schedule,
.me-week-event .me-week-cell-delay {
  font-size: 12px;
}

.me-week-event--today {
  grid-template-columns: 18px minmax(0, 1fr) auto;
  grid-template-rows: auto auto;
  align-items: center;
}

/* Today cards keep the list's compact information hierarchy. */
.me-week-event--today .me-week-event-title {
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
}

.me-week-event--today .me-week-event-meta {
  grid-column: 2;
  grid-row: 2;
  min-width: 0;
}

.me-week-event--today .me-week-event-foot {
  display: contents;
}

.me-week-event--today .me-week-event-foot-info {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 2px 5px;
  min-width: 0;
  flex: 1 1 auto;
}

.me-week-event--today .me-week-event-actions {
  grid-column: 3;
  grid-row: 1 / span 2;
  display: flex;
  align-self: center;
  gap: 6px;
  flex-shrink: 0;
}

.me-week-event--today .me-week-event-actions .me-btn {
  min-height: 24px;
  padding: 2px 8px;
  font-size: 11px;
  white-space: nowrap;
}

.me-today {
  gap: 10px;
  padding: 0;
}

/* Sidebar Today uses a dedicated narrow-card layout. */
.me-today--sidebar .me-today-list {
  gap: 6px;
}

.me-today--sidebar .me-week-event--today {
  grid-template-columns: 16px minmax(0, 1fr);
  grid-template-rows: auto auto auto;
  gap: 4px 7px;
  padding: 8px 8px 7px;
  border-left-width: 3px;
}

.me-today--sidebar .me-week-event--today .me-todo-check {
  width: 16px;
  height: 16px;
  min-width: 16px;
  margin-top: 1px;
}

.me-today--sidebar .me-week-event--today .me-week-event-title {
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
  font-size: 13px;
  line-height: 1.4;
}

.me-today--sidebar .me-week-event--today .me-week-event-meta {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  min-width: 0;
}

.me-today--sidebar .me-week-event--today .me-week-event-foot {
  display: contents;
}

.me-today--sidebar .me-week-event--today .me-week-event-foot-info {
  display: none;
}

.me-today--sidebar .me-week-event--today .me-week-event-actions {
  grid-column: 2;
  grid-row: 3;
  justify-self: end;
  align-self: center;
  gap: 4px;
  min-width: 0;
}

.me-today--sidebar .me-week-event--today .me-week-event-actions .me-btn {
  min-height: 22px;
  padding: 1px 6px;
  font-size: 10px;
  line-height: 18px;
}

.me-today--sidebar .me-week-event--today .me-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  max-width: 100%;
  min-height: 18px;
  padding-inline: 5px;
  font-size: 10px;
  line-height: 1.15;
  text-align: center;
}

/* Both Today views use the same centered time badge. */
.me-today .me-badge-due {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  text-align: center;
  line-height: 1.2;
  vertical-align: middle;
}

.me-today--sidebar .me-week-event--today .me-todo-days--overdue {
  color: var(--dsw-alias-state-error-primary);
  font-weight: 600;
}

.me-today-head {
  min-height: 30px;
  align-items: center;
}

.me-cal-title,
.me-week .me-cal-title {
  grid-column: 2;
  min-width: 0;
  text-align: center;
  font-size: 16px;
  font-weight: 650;
  letter-spacing: 0;
}

.me-cal-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  overflow: visible;
}

.me-cal-head > .me-cal-nav {
  grid-column: 1;
  justify-self: start;
}

.me-cal-head > .me-cal-title {
  grid-column: 2;
  grid-row: 1;
  width: auto;
  min-width: max-content;
  flex: none;
}

.me-cal-cell-head {
  position: relative;
  display: block;
  min-height: 22px;
}

.me-cal-cell-head .me-cal-cell-select {
  display: block;
  width: max-content;
}

.me-cal-cell-head .me-cal-cell-add {
  position: absolute;
  top: 2px;
  right: 2px;
  margin: 0;
}

.me-today-list {
  gap: 8px;
}

/* Calendar uses low-saturation project color instead of solid blocks. */
.me-calendar-span {
  height: 18px;
  padding: 0 7px;
  border: 1px solid color-mix(in srgb, var(--me-span-fill, var(--me-blue-strong)) 22%, var(--todo-ui-border));
  border-radius: 5px;
  background: var(--me-span-bg, color-mix(in srgb, var(--me-span-fill, var(--me-blue-strong)) 10%, var(--dsw-alias-bg-base)));
  color: var(--me-span-fill, var(--dsw-alias-label-primary));
  box-shadow: inset 2px 0 0 var(--me-span-fill, var(--me-blue-strong));
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
}

.me-calendar-span:hover,
.me-calendar-span:focus-visible {
  border-color: color-mix(in srgb, var(--me-span-fill, var(--me-blue-strong)) 36%, var(--todo-ui-border));
  background: var(--me-span-bg, color-mix(in srgb, var(--me-span-fill, var(--me-blue-strong)) 15%, var(--dsw-alias-bg-base)));
  outline: none;
}

.me-calendar-span--before,
.me-calendar-span--after {
  opacity: 1;
}

.me-calendar-span--draft {
  border: 1px dashed var(--me-span-drop-color);
  background: var(--me-span-preview-fill);
  color: var(--me-span-drop-color);
  box-shadow: none;
}

.me-calendar-span--dragging,
.me-calendar-span--dragging:hover {
  background: var(--me-span-drag-fill);
  color: var(--dsw-alias-label-primary);
  box-shadow: inset 2px 0 0 var(--me-span-fill), 0 2px 6px color-mix(in srgb, var(--me-span-fill) 18%, transparent);
}

.me-calendar-span--done {
  border-color: var(--dsw-alias-border-l2);
  background: var(--dsw-alias-interactive-bg-active);
  color: var(--dsw-alias-label-tertiary);
  box-shadow: none;
  opacity: 1;
  text-decoration: line-through;
}

.me-calendar-more {
  min-height: 18px;
  padding: 0 6px;
  border-radius: 5px;
  font-size: 11px;
  color: var(--dsw-alias-label-secondary);
}

.me-cal-weekday,
.me-cal-cell-date,
.me-week-date-head span {
  font-size: 12px;
}

.me-week-date-head strong {
  font-size: 15px;
}

/* Group surfaces are quiet; individual tasks carry the visual weight. */
.me-proj-group {
  border-color: var(--todo-ui-border);
  border-radius: var(--todo-ui-radius);
  background: transparent;
  box-shadow: none;
}

.me-proj-head {
  padding-bottom: 6px;
  border-bottom: 1px solid var(--todo-ui-border);
}

.me-proj-title {
  font-size: 14px;
  font-weight: 650;
}

/* List cards have one title row (checkbox + title) and one metadata row. */
.me-item.me-todo-item--list {
  position: relative;
  display: block;
  width: 100%;
  box-sizing: border-box;
  flex: none;
  padding: 10px 12px 9px 16px;
  overflow: hidden;
}

.me-todo-item-color {
  position: absolute;
  inset: 1px auto 1px 0;
  width: 4px;
  border-radius: 7px 0 0 7px;
  background: var(--me-task-color, var(--me-blue-strong));
  pointer-events: none;
}

.me-todo-item--done .me-todo-item-color {
  background: var(--dsw-alias-label-tertiary);
}

.me-todo-item-content {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.me-todo-item-title-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
}

.me-todo-item-title-row .me-todo-check {
  margin-top: 2px;
}

.me-todo-item-title-row .me-todo-text {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
}

.me-todo-item--list .me-item-meta {
  margin-top: 0;
  padding-left: 28px;
}

/* Project view is a horizontal board: stable columns, native horizontal scroll. */
.me-proj {
  min-width: 0;
  gap: 10px;
  padding-bottom: 4px;
}

.me-proj-board {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
  gap: 14px;
  width: 100%;
  min-width: 0;
  padding: 2px 4px 14px;
  overflow-x: auto;
  overflow-y: hidden;
  box-sizing: border-box;
  scrollbar-width: thin;
  overscroll-behavior-inline: contain;
  scroll-snap-type: x proximity;
}

.me-proj-board:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 2px;
}

.me-proj-board .me-proj-group {
  flex: 0 0 320px !important;
  width: 320px;
  min-width: 320px;
  max-width: 320px;
  min-height: 180px;
  max-height: none;
  padding: 10px;
  gap: 10px;
  overflow: visible;
  border: 1px solid var(--todo-ui-border);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  scroll-snap-align: start;
  box-sizing: border-box;
}

.me-proj-board .me-proj-head {
  position: sticky;
  top: -10px;
  z-index: 3;
  min-height: 34px;
  padding: 10px 0 8px;
  background: var(--dsw-alias-bg-layer-1);
  cursor: pointer;
  user-select: none;
}

.me-proj-board .me-proj-head:active {
  cursor: grabbing;
}

.me-proj-group--dragging {
  opacity: 0.45;
}

.me-proj-group--drop-before {
  box-shadow: -4px 0 0 var(--dsw-alias-state-business-primary);
}

.me-proj-group--drop-after {
  box-shadow: 4px 0 0 var(--dsw-alias-state-business-primary);
}

.me-proj-heading {
  display: flex;
  align-items: baseline;
  min-width: 0;
  gap: 6px;
}

.me-proj-heading .me-proj-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.me-proj-heading .me-proj-count {
  flex: none;
}

.me-proj-head-add {
  flex: none;
  border: 0;
  background: transparent;
}

.me-proj-board .me-proj-body {
  gap: 8px;
}

.me-proj-board .me-todo-card {
  width: 100%;
  box-sizing: border-box;
}

.me-proj-add {
  flex: none;
  width: 100%;
  min-height: 34px;
  padding: 6px 10px;
  border: 1px dashed var(--dsw-alias-border-l2);
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
}

.me-proj-add:hover,
.me-proj-add:focus-visible {
  border-color: var(--dsw-alias-state-business-primary);
  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 8%, transparent);
  color: var(--dsw-alias-state-business-primary);
  outline: none;
}

@media (max-width: 720px) {
  .me-proj-board .me-proj-group {
    flex: 0 0 min(84vw, 320px);
    width: min(84vw, 320px);
    min-width: min(84vw, 280px);
  }
}

/* Standalone Today panel: mirrors better-sidebar's right workbench chrome.
 * NOTE: no unconditional \`#root { margin-right }\` rule here \u2014 that would
 * override dsh-better-sidebar's own layout push. The fallback pushes #root
 * via inline style (setProperty !important) from the component instead. */
.todo-fallback-toggle-button {
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  min-width: 28px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  box-shadow: none;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  transition: background var(--ds-transition-duration-slow) var(--ds-ease-in-out), color var(--ds-transition-duration-slow) var(--ds-ease-in-out);
}

.todo-fallback-toggle-button:hover,
.todo-fallback-toggle-button:focus-visible {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
  outline: none;
}

.todo-fallback-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 2147482999;
  display: flex;
  flex-direction: column;
  min-width: 280px;
  border-left: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-specific-sidebar-fill, var(--dsw-alias-bg-base));
  transform: translateX(0);
  transition: transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), width var(--ds-transition-duration-slow) var(--ds-ease-in-out);
}

.todo-fallback-panel--hidden {
  pointer-events: none;
  visibility: hidden;
  transform: translateX(102%);
  transition: transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), width var(--ds-transition-duration-slow) var(--ds-ease-in-out), visibility 0s linear var(--ds-transition-duration-slow);
}

.todo-fallback-panel[data-dragging] {
  transition: none;
}

.todo-fallback-resize {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -4px;
  z-index: 2;
  width: 8px;
  cursor: col-resize;
  touch-action: none;
}

.todo-fallback-resize--active {
  background: var(--dsw-alias-interactive-bg-hover-accent);
}

.todo-fallback-panel-body {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  padding: 8px;
}

.todo-fallback-panel-body .me-panel {
  width: 100%;
  height: auto;
  min-height: 100%;
  padding: 0;
}

.todo-fallback-panel-body .me-today--sidebar {
  max-width: none;
}

body[data-dsh-todolist-dragging] #root {
  transition: none;
}

@media (max-width: 767px) {
  .todo-fallback-panel {
    width: 100vw !important;
    min-width: 0;
  }

  .todo-fallback-resize {
    display: none;
  }
}

/* ============================================================
 * \u65E5\u5386\u4EA4\u4E92\u589E\u5F3A\uFF082026-08-19 \u7528\u6237\u53CD\u9988\uFF09
 * 1) \u4ECA\u5929\u65E5\u671F\u5706\uFF1A\u6570\u5B57\u6052\u4E3A\u767D\u5B57\uFF0C\u8986\u76D6\u300C\u903E\u671F\u7EA2\u5B57\u300D\uFF08\u52A0\u7C7B\u63D0\u9AD8\u4F18\u5148\u7EA7\uFF0C
 *    \u4EFB\u4F55\u6E90\u7801\u987A\u5E8F\u90FD\u8D62\uFF09\uFF0C\u5706\u5708\u4FDD\u6301\u84DD\u5E95\u3002
 * 2) \u6298\u53E0\u5165\u53E3\u300C+N / \u6536\u8D77\u300D\u843D\u5728\u6EA2\u51FA\u65E5\u671F\u6240\u5728\u5217\uFF08\u4E0D\u518D\u6A2A\u8DE8\u6574\u884C\u8D34\u5230\u6700\u53F3\u5217\uFF09\uFF0C
 *    \u5355\u72EC\u5360\u4E00\u884C\u8F68\u9053\u907F\u514D\u538B\u4F4F\u6700\u540E\u4E00\u6761\u4EFB\u52A1\u3002
 * 3) \u62D6\u52A8\u4EFB\u52A1\u6539\u65E5\u671F\u65F6\u7684\u843D\u70B9\u683C\u9AD8\u4EAE\u3002
 * ============================================================ */

.me-cal-cell--today.me-cal-cell--overdue .me-cal-cell-date,
.me-cal-cell--today.me-cal-cell--selected .me-cal-cell-date,
.me-cal-cell--today .me-cal-cell-date {
  background: var(--me-blue-strong, var(--dsw-static-blue-6, #2563eb));
  color: var(--dsw-alias-label-on-primary, var(--dsw-static-neutral-00, #fff));
}

.me-calendar-more {
  grid-column: auto;
  justify-self: start;
  align-self: center;
  background: var(--dsw-alias-interactive-bg-active, rgba(128, 128, 128, 0.12));
  border: 1px solid var(--dsw-alias-border-l2, rgba(128, 128, 128, 0.25));
}

.me-calendar-more:hover,
.me-calendar-more:focus-visible {
  background: var(--me-blue-muted);
  border-color: var(--me-blue-strong);
  color: var(--me-blue-strong);
  outline: none;
}

.me-cal-cell--drop-day {
  outline: 2px dashed var(--me-blue-strong, #2563eb);
  outline-offset: -3px;
  background: var(--me-blue-muted);
}

.me-week-column--drop-day {
  outline: 2px dashed var(--me-blue-strong, #2563eb);
  outline-offset: -3px;
  background: color-mix(in srgb, var(--me-blue-strong, #2563eb) 8%, var(--dsw-alias-bg-layer-1));
}

/* \u6307\u9488\u884C\u4E3A\uFF08\u7528\u6237\u53CD\u9988\uFF09\uFF1A\u60AC\u505C\u4E00\u5F8B\u70B9\u51FB\u6307\u9488\uFF0C\u53EA\u6709\u957F\u6309\u62D6\u65E5\u671F/\u62D6\u4EFB\u52A1\u65F6\u624D\u662F\u62D6\u52A8\u6307\u9488 */
.me-week-column {
  cursor: pointer;
}

.me-panel--range-dragging .me-cal-cell,
.me-panel--range-dragging .me-week-column,
.me-panel--range-dragging .me-week-date-head,
.me-panel--range-dragging .me-cal-cell-date,
.me-calendar-span--dragging,
.me-calendar-span--dragging:hover,
.me-week-event--dragging,
.me-week-event--dragging:hover {
  cursor: grabbing;
}

/* \u5217\u8868\u884C / \u770B\u677F\u5361\u7247\uFF1A\u6574\u884C\u70B9\u51FB\u76F4\u63A5\u7F16\u8F91\uFF08\u7528\u6237\u53CD\u9988\uFF1A\u53BB\u6389\u884C\u5185\u7F16\u8F91/\u5220\u9664\u6309\u94AE\uFF09\u3002 */
.me-todo-item,
.me-todo-card {
  cursor: pointer;
}

/* \u5220\u9664\u4E8C\u6B21\u786E\u8BA4\u5F39\u7A97\uFF1A\u53E0\u5728\u7F16\u8F91\u5F39\u7A97\u4E4B\u4E0A\uFF08\u66F4\u9AD8 z-index\uFF09\uFF0C\u5C0F\u5C3A\u5BF8\u5C45\u4E2D\u3002 */
.me-modal-confirm {
  z-index: 1100;
}

.me-modal-box-confirm {
  max-width: 400px;
}

.me-modal-confirm-text {
  margin: 4px 0 8px;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 1.6;
  word-break: break-all;
}

.me-modal-confirm-text strong {
  color: var(--dsw-alias-label-primary);
}

.me-modal-foot-spacer {
  flex: 1;
}
`;

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
  "todo.deleteConfirmTitle": "\u5220\u9664\u5F85\u529E",
  "todo.deleteConfirmText": "\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u6761\u5F85\u529E\u5417\uFF1F\u5220\u9664\u540E\u4E0D\u53EF\u6062\u590D\uFF1A",
  "todo.deleteConfirmOk": "\u786E\u8BA4\u5220\u9664",
  "todo.movedTo": "\u5DF2\u79FB\u52A8\u5230",
  "todo.dragReorderHint": "\u6309\u4F4F\u62D6\u52A8\uFF0C\u653E\u5230\u5176\u4ED6\u4EFB\u52A1\u4E0A\u53EF\u8C03\u6574\u987A\u5E8F",
  "todo.repeat.noDateDrag": "\u5468\u671F\u4EFB\u52A1\u8BF7\u5728\u7F16\u8F91\u91CC\u4FEE\u6539\u65E5\u671F",
  "todo.done.noDateDrag": "\u5DF2\u5B8C\u6210\u4EFB\u52A1\u8BF7\u5728\u7F16\u8F91\u91CC\u4FEE\u6539\u65E5\u671F",
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
  "todo.calendar.pick": "\u70B9\u51FB\u65E5\u671F\u67E5\u770B\u5F53\u5929\u5F85\u529E\uFF1B\u70B9\u51FB\u4EFB\u52A1\u6761\u76F4\u63A5\u7F16\u8F91\uFF1B\u628A\u4EFB\u52A1\u62D6\u5230\u5176\u4ED6\u65E5\u671F\u6539\u671F\uFF0C\u62D6\u5230\u5176\u4ED6\u4EFB\u52A1\u6761\u4E0A\u6392\u5E8F",
  "todo.calendar.collapse": "\u6536\u8D77",
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
  "todo.deleteConfirmTitle": "Delete todo",
  "todo.deleteConfirmText": "Delete this todo? This cannot be undone: ",
  "todo.deleteConfirmOk": "Delete",
  "todo.dragReorderHint": "Hold and drag onto another task to reorder",
  "todo.repeat.noDateDrag": "Recurring tasks can't be moved by dragging \u2014 edit the schedule instead",
  "todo.done.noDateDrag": "Completed tasks can't be moved by dragging \u2014 edit instead",
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
  "todo.calendar.pick": "Click a day to see its todos; click a task bar to edit it; drag a task onto another day to reschedule, or onto another bar to reorder",
  "todo.calendar.collapse": "Collapse",
  "todo.movedTo": "Moved to",
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
