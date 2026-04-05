const SESSION_KEY = "smartTaskManager.session.v2";
const TASKS_KEY_PREFIX = "smartTaskManager.tasks.v2.";
const SETTINGS_KEY_PREFIX = "smartTaskManager.settings.v2.";

const session = requireSession();
const TASKS_KEY = `${TASKS_KEY_PREFIX}${session.email}`;
const SETTINGS_KEY = `${SETTINGS_KEY_PREFIX}${session.email}`;

const nav = document.getElementById("mainNav");
const topbar = document.querySelector(".topbar");
const views = {
  dashboard: document.getElementById("view-dashboard"),
  tasks: document.getElementById("view-tasks"),
  add: document.getElementById("view-add"),
  calendar: document.getElementById("view-calendar"),
  analytics: document.getElementById("view-analytics"),
  settings: document.getElementById("view-settings")
};

const taskForm = document.getElementById("taskForm");
const taskIdInput = document.getElementById("taskId");
const titleInput = document.getElementById("taskTitle");
const descInput = document.getElementById("taskDescription");
const dueInput = document.getElementById("taskDueDate");
const priorityInput = document.getElementById("taskPriority");
const statusInput = document.getElementById("taskStatus");
const categoryInput = document.getElementById("taskCategory");
const tagsInput = document.getElementById("taskTags");
const notesInput = document.getElementById("taskNotes");
const linkInput = document.getElementById("taskLink");
const filesInput = document.getElementById("taskFiles");

const saveTaskBtn = document.getElementById("saveTaskBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formHeading = document.getElementById("formHeading");
const smartSuggestBtn = document.getElementById("smartSuggestBtn");
const quickAddBtn = document.getElementById("quickAddBtn");

const greetingText = document.getElementById("greetingText");
const topSubtitle = document.getElementById("topSubtitle");
const notifCount = document.getElementById("notifCount");
const notifBtn = document.getElementById("notifBtn");
const notificationPanel = document.getElementById("notificationPanel");
const notificationList = document.getElementById("notificationList");
const closeNotifBtn = document.getElementById("closeNotifBtn");
const logoutBtn = document.getElementById("logoutBtn");
const themeToggle = document.getElementById("themeToggle");

const todayCountEl = document.getElementById("todayCount");
const pendingCountEl = document.getElementById("pendingCount");
const completedCountEl = document.getElementById("completedCount");
const streakCountEl = document.getElementById("streakCount");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const todayDateLabel = document.getElementById("todayDateLabel");
const todayPlanList = document.getElementById("todayPlanList");
const todayEmpty = document.getElementById("todayEmpty");
const smartSuggestionList = document.getElementById("smartSuggestionList");

const searchInput = document.getElementById("searchInput");
const priorityFilter = document.getElementById("priorityFilter");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");
const deadlineFilter = document.getElementById("deadlineFilter");
const taskCardList = document.getElementById("taskCardList");
const taskListEmpty = document.getElementById("taskListEmpty");

const smartTimeSuggestion = document.getElementById("smartTimeSuggestion");
const smartEstimate = document.getElementById("smartEstimate");
const smartBreakdownList = document.getElementById("smartBreakdownList");

const monthLabel = document.getElementById("monthLabel");
const monthGrid = document.getElementById("monthGrid");
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");
const weekBoard = document.getElementById("weekBoard");

const dailyScore = document.getElementById("dailyScore");
const weeklyScore = document.getElementById("weeklyScore");
const pieChart = document.getElementById("pieChart");
const pieLabel = document.getElementById("pieLabel");
const barChart = document.getElementById("barChart");

const profileText = document.getElementById("profileText");
const profileForm = document.getElementById("profileForm");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profilePassword = document.getElementById("profilePassword");
const profileAge = document.getElementById("profileAge");
const profileImageDisplay = document.getElementById("profileImageDisplay");
const profileImageEditBtn = document.getElementById("profileImageEditBtn");
const profileImageDeleteBtn = document.getElementById("profileImageDeleteBtn");
const profileImageInput = document.getElementById("profileImageInput");
const profileFeedback = document.getElementById("profileFeedback");
const notifToggle = document.getElementById("notifToggle");
const themeSelect = document.getElementById("themeSelect");
const languageSelect = document.getElementById("languageSelect");

let currentView = "dashboard";
let monthCursor = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let selectedDate = toInputDate(new Date());
let tasks = loadTasks();
let settings = loadSettings();
let dragTaskId = null;

init();

function init() {
  applyTheme(settings.theme || "light");
  setGreeting();
  bindEvents();
  setDefaultDueDate();
  switchView(currentView);
  renderAll();
}

function requireSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    window.location.href = "login.html";
    throw new Error("Missing session");
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.email || !parsed.name) {
      window.location.href = "login.html";
      throw new Error("Invalid session");
    }
    return parsed;
  } catch {
    window.location.href = "login.html";
    throw new Error("Corrupt session");
  }
}

function bindEvents() {
  nav.addEventListener("click", onNavClick);
  taskForm.addEventListener("submit", onTaskSubmit);
  cancelEditBtn.addEventListener("click", resetForm);
  smartSuggestBtn.addEventListener("click", onSmartSuggest);
  quickAddBtn.addEventListener("click", () => switchView("add"));
  logoutBtn.addEventListener("click", logout);

  [searchInput, priorityFilter, statusFilter, categoryFilter, deadlineFilter].forEach((el) => {
    el.addEventListener("input", renderTaskListScreen);
    el.addEventListener("change", renderTaskListScreen);
  });

  prevMonthBtn.addEventListener("click", () => {
    monthCursor = new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1);
    renderCalendar();
  });


    nextMonthBtn.addEventListener("click", () => {
      monthCursor = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1);
      renderCalendar();
    });

    notifBtn.addEventListener("click", () => {
      notificationPanel.classList.toggle("hidden");
      renderNotificationPanel();
    });

    closeNotifBtn.addEventListener("click", () => {
      notificationPanel.classList.add("hidden");
    });

    // Close notification panel when clicking outside
    document.addEventListener("click", (event) => {
      if (!notifBtn.contains(event.target) && !notificationPanel.contains(event.target)) {
        notificationPanel.classList.add("hidden");
      }
    });

  notifToggle.addEventListener("change", () => {
    settings.notifications = notifToggle.checked;
    persistSettings();
    renderAll();
  });

  themeToggle.addEventListener("click", () => {
    settings.theme = settings.theme === "dark" ? "light" : "dark";
    themeSelect.value = settings.theme;
    applyTheme(settings.theme);
    persistSettings();
  });

  themeSelect.addEventListener("change", () => {
    settings.theme = themeSelect.value;
    applyTheme(settings.theme);
    persistSettings();
  });

  languageSelect.addEventListener("change", () => {
    settings.language = languageSelect.value;
    persistSettings();
  });

  // Profile event listeners
  profileForm.addEventListener("submit", onProfileSubmit);
  profileImageEditBtn.addEventListener("click", () => profileImageInput.click());
  profileImageDeleteBtn.addEventListener("click", onProfileImageDelete);
  profileImageInput.addEventListener("change", onProfileImageUpload);
}

function onNavClick(event) {
  const button = event.target.closest(".nav-btn");
  if (!button) {
    return;
  }

  switchView(button.dataset.view);
}

function switchView(viewName) {
  if (!views[viewName]) {
    return;
  }

  currentView = viewName;
  Object.entries(views).forEach(([key, section]) => {
    section.classList.toggle("hidden", key !== viewName);
  });

  const buttons = nav.querySelectorAll(".nav-btn");
  buttons.forEach((btn) => btn.classList.toggle("active", btn.dataset.view === viewName));

  if (topbar) {
    topbar.classList.toggle("hidden", viewName !== "dashboard");
  }

  // Load profile data when switching to settings
  if (viewName === "settings") {
    loadProfileData();
  }
}

async function onTaskSubmit(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  const dueDate = dueInput.value;

  if (!title || !dueDate) {
    return;
  }

  const attachments = await collectAttachments();

  const taskData = {
    title,
    description,
    dueDate,
    priority: priorityInput.value,
    status: statusInput.value,
    category: categoryInput.value,
    tags: splitTags(tagsInput.value),
    notes: notesInput.value.trim(),
    attachments,
    link: linkInput.value.trim(),
    steps: [...smartBreakdownList.querySelectorAll("li")].map((item) => item.textContent),
    estimatedMinutes: estimateMinutes(title, description, priorityInput.value),
    updatedAt: Date.now()
  };

  if (taskIdInput.value) {
    tasks = tasks.map((task) =>
      task.id === taskIdInput.value
        ? {
            ...task,
            ...taskData
          }
        : task
    );
  } else {
    tasks.push({
      id: crypto.randomUUID(),
      ...taskData,
      createdAt: Date.now(),
      completedAt: taskData.status === "Completed" ? Date.now() : null
    });
  }

  if (taskData.status === "Completed") {
    tasks = tasks.map((task) => (task.id === taskIdInput.value ? { ...task, completedAt: Date.now() } : task));
  }

  persistTasks();
  resetForm();
  switchView("tasks");
  renderAll();
}

function resetForm() {
  taskForm.reset();
  setDefaultDueDate();
  taskIdInput.value = "";
  smartBreakdownList.innerHTML = "";
  smartTimeSuggestion.textContent = "Suggested schedule appears here.";
  smartEstimate.textContent = "Estimated completion time appears here.";
  formHeading.textContent = "Add New Task";
  saveTaskBtn.textContent = "Save Task";
  cancelEditBtn.classList.add("hidden");
}

function setDefaultDueDate() {
  dueInput.value = toInputDate(new Date());
}

async function onSmartSuggest() {
  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  const dueDate = dueInput.value || toInputDate(new Date());
  const priority = priorityInput.value;

  const suggestion = suggestTimeSlot({ dueDate, priority });
  const estimate = estimateMinutes(title, description, priority);
  const breakdown = createBreakdown(title, description);

  smartTimeSuggestion.textContent = suggestion;
  smartEstimate.textContent = `Estimated completion time: ${estimate} minutes`;
  smartBreakdownList.innerHTML = "";
  breakdown.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    smartBreakdownList.appendChild(li);
  });
}

function createBreakdown(title, description) {
  const seed = `${title} ${description}`.toLowerCase();
  if (!seed.trim()) {
    return ["Define the objective", "Work in focused sprints", "Review and finalize"];
  }

  const steps = ["Understand requirements", "Execute core work", "Review output"];
  if (seed.includes("exam") || seed.includes("study")) {
    return ["Collect study resources", "Practice key problems", "Run a quick revision test"];
  }
  if (seed.includes("project") || seed.includes("assignment")) {
    return ["Break feature list", "Implement first milestone", "Test and polish"];
  }
  return steps;
}

function suggestTimeSlot(task) {
  const due = new Date(task.dueDate);
  const today = new Date();
  const diff = Math.ceil((stripTime(due) - stripTime(today)) / 86400000);
  const busyHour = 18;
  const rawCandidate = task.priority === "High" ? 17 : task.priority === "Medium" ? 18 : 20;
  const hourCandidate = rawCandidate === busyHour ? 20 : rawCandidate;

  if (rawCandidate === busyHour) {
    return "You are busy at 6 PM, try 8 PM.";
  }

  if (diff <= 0) {
    return `Deadline is today. Start at ${toHour(hourCandidate)} and finish in focused blocks.`;
  }

  if (diff <= 2 && task.priority === "High") {
    return `High priority and close deadline. Best slot: ${toHour(17)}.`;
  }

  return `Suggested slot: ${toHour(hourCandidate)} (balanced with your current plan).`;
}

function estimateMinutes(title, description, priority) {
  const words = `${title} ${description}`.trim().split(/\s+/).filter(Boolean).length;
  const base = 20 + words * 2;
  const multiplier = priority === "High" ? 1.4 : priority === "Medium" ? 1.1 : 0.9;
  return Math.max(20, Math.round(base * multiplier));
}

async function collectAttachments() {
  const out = [];
  const link = linkInput.value.trim();
  if (link) {
    out.push({
      type: "link",
      name: "External Link",
      value: link
    });
  }

  const files = Array.from(filesInput.files || []);
  for (const file of files) {
    const value = await fileToDataUrl(file);
    out.push({
      type: "file",
      name: file.name,
      value
    });
  }

  return out;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

function renderAll() {
  renderDashboard();
  renderTaskListScreen();
  renderCalendar();
  renderWeeklyBoard();
  renderAnalytics();
  renderSettings();
  renderNotifications();
}

function renderDashboard() {
  const now = new Date();
  const today = toInputDate(now);
  const todayTasks = tasks.filter((task) => task.dueDate === today);
  const pending = tasks.filter((task) => task.status !== "Completed");
  const completed = tasks.filter((task) => task.status === "Completed");
  const percent = tasks.length === 0 ? 0 : Math.round((completed.length / tasks.length) * 100);

  todayCountEl.textContent = String(todayTasks.length);
  pendingCountEl.textContent = String(pending.length);
  completedCountEl.textContent = String(completed.length);
  streakCountEl.textContent = `${calculateStreak()} days`;
  progressFill.style.width = `${percent}%`;
  progressText.textContent = `${percent}% completed`;

  todayDateLabel.textContent = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  const plan = getTodaysPlan();
  todayPlanList.innerHTML = "";
  plan.forEach((task) => {
    const li = document.createElement("li");
    const slot = task.plannedTime || suggestTimeSlot(task).replace("Suggested slot: ", "");
    li.textContent = `${task.title} - ${task.priority} - ${slot}`;
    todayPlanList.appendChild(li);
  });

  todayEmpty.classList.toggle("hidden", plan.length > 0);

  smartSuggestionList.innerHTML = "";
  getSmartSuggestions().forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    smartSuggestionList.appendChild(li);
  });
}

function getTodaysPlan() {
  const today = toInputDate(new Date());
  return tasks
    .filter((task) => task.status !== "Completed" && task.dueDate <= today)
    .sort(sortByPriorityThenDate)
    .slice(0, 5);
}

function getSmartSuggestions() {
  const pending = tasks.filter((task) => task.status !== "Completed");
  const highPending = pending.filter((task) => task.priority === "High");

  const suggestions = [];
  if (highPending.length > 0) {
    suggestions.push(`Focus mode: Start with ${highPending[0].title} for 45 minutes.`);
  }

  if (pending.length > 3) {
    suggestions.push("You have a heavy queue. Try batching similar category tasks.");
  }

  const inProgress = pending.filter((task) => task.status === "In Progress");
  if (inProgress.length > 0) {
    suggestions.push(`Finish in-progress task first: ${inProgress[0].title}.`);
  }

  if (suggestions.length === 0) {
    suggestions.push("Great pace. Keep your momentum with one short focus sprint.");
  }

  return suggestions;
}

function renderTaskListScreen() {
  const filtered = filterTasks();
  taskCardList.innerHTML = "";

  filtered.forEach((task) => {
    const card = document.createElement("article");
    card.className = "task-card";
    card.dataset.id = task.id;

    const tags = task.tags.length > 0 ? `Tags: ${task.tags.join(", ")}` : "Tags: None";
    const attachments = task.attachments.length;
    const attachmentSummary =
      attachments === 0
        ? "None"
        : task.attachments
            .map((item) => (item.type === "link" ? "Link" : item.name))
            .slice(0, 3)
            .join(", ");

    card.innerHTML = `
      <div class="task-top">
        <div>
          <p class="task-title">${escapeHtml(task.title)}</p>
          <p class="hint">Due ${task.dueDate} | ${escapeHtml(task.category)} | ${escapeHtml(task.status)}</p>
        </div>
        <div class="pill-row">
          <span class="pill ${task.priority}">${task.priority}</span>
        </div>
      </div>
      <p class="hint">${escapeHtml(task.description || "No description")}</p>
      <p class="hint">${escapeHtml(tags)}</p>
      <p class="hint">Notes: ${escapeHtml(task.notes || "None")}</p>
      <p class="hint">Attachments: ${attachments} (${escapeHtml(attachmentSummary)})</p>
      <div class="task-actions">
        <button class="btn btn-secondary" data-action="edit" data-id="${task.id}" type="button">Edit</button>
        <button class="btn btn-ghost" data-action="progress" data-id="${task.id}" type="button">In Progress</button>
        <button class="btn btn-primary" data-action="complete" data-id="${task.id}" type="button">Complete</button>
        <button class="btn" data-action="delete" data-id="${task.id}" type="button">Delete</button>
      </div>
    `;

    card.addEventListener("click", onTaskAction);
    bindSwipe(card, task.id);
    taskCardList.appendChild(card);
  });

  taskListEmpty.classList.toggle("hidden", filtered.length > 0);
}

function bindSwipe(card, id) {
  let startX = 0;

  card.addEventListener("touchstart", (event) => {
    startX = event.changedTouches[0].clientX;
  });

  card.addEventListener("touchend", (event) => {
    const endX = event.changedTouches[0].clientX;
    const delta = endX - startX;

    if (delta > 70) {
      markStatus(id, "Completed");
      renderAll();
      return;
    }

    if (delta < -70) {
      removeTask(id);
      renderAll();
    }
  });
}

function onTaskAction(event) {
  const btn = event.target.closest("button[data-action]");
  if (!btn) {
    return;
  }

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (action === "edit") {
    editTask(id);
    return;
  }

  if (action === "complete") {
    markStatus(id, "Completed");
    renderAll();
    return;
  }

  if (action === "progress") {
    markStatus(id, "In Progress");
    renderAll();
    return;
  }

  if (action === "delete") {
    removeTask(id);
    renderAll();
  }
}

function editTask(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) {
    return;
  }

  switchView("add");
  formHeading.textContent = "Edit Task";
  saveTaskBtn.textContent = "Update Task";
  cancelEditBtn.classList.remove("hidden");

  taskIdInput.value = task.id;
  titleInput.value = task.title;
  descInput.value = task.description;
  dueInput.value = task.dueDate;
  priorityInput.value = task.priority;
  statusInput.value = task.status;
  categoryInput.value = task.category;
  tagsInput.value = task.tags.join(", ");
  notesInput.value = task.notes;
  linkInput.value = task.link || "";

  smartBreakdownList.innerHTML = "";
  (task.steps || []).forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    smartBreakdownList.appendChild(li);
  });

  smartEstimate.textContent = `Estimated completion time: ${task.estimatedMinutes || estimateMinutes(task.title, task.description, task.priority)} minutes`;
  smartTimeSuggestion.textContent = suggestTimeSlot(task);
}

function removeTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  persistTasks();
}

function markStatus(id, status) {
  tasks = tasks.map((task) => {
    if (task.id !== id) {
      return task;
    }

    return {
      ...task,
      status,
      completedAt: status === "Completed" ? Date.now() : task.completedAt,
      updatedAt: Date.now()
    };
  });

  persistTasks();
}

function filterTasks() {
  const query = searchInput.value.trim().toLowerCase();
  const priority = priorityFilter.value;
  const status = statusFilter.value;
  const category = categoryFilter.value;
  const deadline = deadlineFilter.value;
  const today = toInputDate(new Date());
  const weekEnd = toInputDate(addDays(new Date(), 7));

  return tasks
    .filter((task) => {
      const inText = `${task.title} ${task.description} ${task.notes} ${task.tags.join(" ")}`.toLowerCase();
      if (query && !inText.includes(query)) {
        return false;
      }

      if (priority !== "all" && task.priority !== priority) {
        return false;
      }

      if (status !== "all" && task.status !== status) {
        return false;
      }

      if (category !== "all" && task.category !== category) {
        return false;
      }

      if (deadline === "today" && task.dueDate !== today) {
        return false;
      }

      if (deadline === "week" && !(task.dueDate >= today && task.dueDate <= weekEnd)) {
        return false;
      }

      if (deadline === "overdue" && !(task.dueDate < today && task.status !== "Completed")) {
        return false;
      }

      return true;
    })
    .sort(sortByPriorityThenDate);
}

function renderCalendar() {
  monthGrid.innerHTML = "";

  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  monthLabel.textContent = monthCursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1);
  const startShift = firstDay.getDay();
  const startDate = new Date(year, month, 1 - startShift);

  for (let i = 0; i < 42; i += 1) {
    const cellDate = addDays(startDate, i);
    const cellKey = toInputDate(cellDate);
    const dayTasks = tasks.filter((task) => task.dueDate === cellKey);

    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "day-cell";
    if (cellDate.getMonth() !== month) {
      cell.classList.add("off");
    }
    if (cellKey === selectedDate) {
      cell.classList.add("active");
    }

    const dots = dayTasks
      .slice(0, 3)
      .map((task) => `<span class="dot ${task.priority.toLowerCase()}"></span>`)
      .join("");

    cell.innerHTML = `
      <strong>${cellDate.getDate()}</strong>
      <div class="dot-row">${dots}</div>
      <span class="hint">${dayTasks.length} task</span>
    `;

    cell.addEventListener("click", () => {
      selectedDate = cellKey;
      renderCalendar();
      renderWeeklyBoard();
    });

    monthGrid.appendChild(cell);
  }
}

function renderWeeklyBoard() {
  weekBoard.innerHTML = "";

  const selected = new Date(selectedDate);
  const start = addDays(selected, -selected.getDay());

  for (let i = 0; i < 7; i += 1) {
    const date = addDays(start, i);
    const key = toInputDate(date);
    const colTasks = tasks.filter((task) => task.dueDate === key && task.status !== "Completed").sort(sortByPriorityThenDate);

    const col = document.createElement("div");
    col.className = "week-col";
    col.dataset.date = key;

    col.innerHTML = `<strong>${date.toLocaleDateString(undefined, { weekday: "short", day: "numeric" })}</strong>`;

    colTasks.forEach((task) => {
      const item = document.createElement("div");
      item.className = `week-task ${task.priority}`;
      item.draggable = true;
      item.dataset.id = task.id;
      item.textContent = task.title;

      item.addEventListener("dragstart", () => {
        dragTaskId = task.id;
      });

      col.appendChild(item);
    });

    bindDropZone(col);
    weekBoard.appendChild(col);
  }
}

function bindDropZone(col) {
  col.addEventListener("dragover", (event) => {
    event.preventDefault();
    col.classList.add("over");
  });

  col.addEventListener("dragleave", () => {
    col.classList.remove("over");
  });

  col.addEventListener("drop", (event) => {
    event.preventDefault();
    col.classList.remove("over");
    if (!dragTaskId) {
      return;
    }

    const targetDate = col.dataset.date;
    tasks = tasks.map((task) => (task.id === dragTaskId ? { ...task, dueDate: targetDate, updatedAt: Date.now() } : task));
    dragTaskId = null;
    persistTasks();
    renderAll();
  });
}

function renderAnalytics() {
  const today = toInputDate(new Date());
  const weekStart = toInputDate(addDays(new Date(), -6));

  const completed = tasks.filter((task) => task.status === "Completed");
  const pending = tasks.filter((task) => task.status !== "Completed");

  const dailyTasks = tasks.filter((task) => task.dueDate === today);
  const dailyDone = dailyTasks.filter((task) => task.status === "Completed");
  const dailyPct = dailyTasks.length === 0 ? 0 : Math.round((dailyDone.length / dailyTasks.length) * 100);

  const weeklyTasks = tasks.filter((task) => task.dueDate >= weekStart && task.dueDate <= today);
  const weeklyDone = weeklyTasks.filter((task) => task.status === "Completed");
  const weeklyPct = weeklyTasks.length === 0 ? 0 : Math.round((weeklyDone.length / weeklyTasks.length) * 100);

  dailyScore.textContent = `${dailyPct}%`;
  weeklyScore.textContent = `${weeklyPct}%`;

  const total = Math.max(1, completed.length + pending.length);
  const doneAngle = Math.round((completed.length / total) * 360);
function renderNotificationPanel() {
  const today = toInputDate(new Date());
  const overdueTasks = tasks.filter((task) => task.status !== "Completed" && task.dueDate < today);
  const dueTodayTasks = tasks.filter((task) => task.status !== "Completed" && task.dueDate === today);
  const allNotifications = [...dueTodayTasks, ...overdueTasks];

  if (allNotifications.length === 0) {
    notificationList.innerHTML = '<div class="notification-empty">✓ All caught up! No pending tasks.</div>';
    return;
  }

  notificationList.innerHTML = allNotifications.map((task) => {
    const isOverdue = task.dueDate < today;
    const type = isOverdue ? "overdue" : "due-today";
    const typeLabel = isOverdue ? "🔴 Overdue" : "🟡 Due Today";
    
    return `
      <div class="notification-item ${type}" data-task-id="${task.id}">
        <p class="notification-item-title">${escapeHtml(task.title)}</p>
        <p class="notification-item-meta">${typeLabel} • ${task.dueDate}</p>
      </div>
    `;
  }).join("");

  // Add click handlers to notification items
  notificationList.querySelectorAll(".notification-item").forEach((item) => {
    item.addEventListener("click", () => {
      const taskId = item.dataset.taskId;
      notificationPanel.classList.add("hidden");
      switchView("tasks");
      // Highlight the task (optional - you could scroll to it)
      setTimeout(() => {
        const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskCard) {
          taskCard.scrollIntoView({ behavior: "smooth", block: "center" });
          taskCard.classList.add("highlight");
          setTimeout(() => taskCard.classList.remove("highlight"), 2000);
        }
      }, 0);
    });
  });
}
  pieChart.style.background = `conic-gradient(var(--accent) 0deg ${doneAngle}deg, var(--warning) ${doneAngle}deg 360deg)`;
  pieLabel.textContent = `Completed: ${completed.length} | Pending: ${pending.length}`;

  renderBarChart();
}

function renderBarChart() {
  barChart.innerHTML = "";

  const days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = addDays(new Date(), -i);
    const key = toInputDate(d);
    const count = tasks.filter((task) => task.dueDate === key).length;
    days.push({
      label: d.toLocaleDateString(undefined, { weekday: "short" }),
      count
    });
  }

  const max = Math.max(1, ...days.map((d) => d.count));

  days.forEach((item) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    const pct = Math.round((item.count / max) * 100);

    row.innerHTML = `
      <span class="hint">${item.label}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      <strong>${item.count}</strong>
    `;

    barChart.appendChild(row);
  });
}

function renderSettings() {
  profileText.textContent = `${session.name} (${session.email})`;
  notifToggle.checked = Boolean(settings.notifications);
  themeSelect.value = settings.theme || "light";
  languageSelect.value = settings.language || "English";
}

function renderNotifications() {
  const today = toInputDate(new Date());
  const overdue = tasks.filter((task) => task.status !== "Completed" && task.dueDate < today).length;
  const dueToday = tasks.filter((task) => task.status !== "Completed" && task.dueDate === today).length;
  const count = overdue + dueToday;

  notifCount.textContent = String(count);

  if (!settings.notifications) {
    topSubtitle.textContent = "Notifications are disabled in settings.";
    return;
  }

  if (count === 0) {
    topSubtitle.textContent = "All clear. No urgent reminders right now.";
  } else {
    topSubtitle.textContent = `${count} reminder(s): check Today's Plan and prioritize.`;
  }
}

function calculateStreak() {
  const doneDays = new Set(
    tasks
      .filter((task) => task.status === "Completed" && task.completedAt)
      .map((task) => toInputDate(new Date(task.completedAt)))
  );

  let streak = 0;
  let cursor = new Date();

  while (doneDays.has(toInputDate(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function setGreeting() {
  const hour = new Date().getHours();
  const firstName = session.name.trim().split(/\s+/)[0] || session.name;

  let part = "Good Evening";
  if (hour < 12) {
    part = "Good Morning";
  } else if (hour < 17) {
    part = "Good Afternoon";
  }

  greetingText.textContent = `${part}, ${firstName}!`;
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "login.html";
}

function splitTags(input) {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function sortByPriorityThenDate(a, b) {
  const rank = { High: 0, Medium: 1, Low: 2 };
  if (rank[a.priority] !== rank[b.priority]) {
    return rank[a.priority] - rank[b.priority];
  }
  return a.dueDate.localeCompare(b.dueDate);
}

function loadTasks() {
  const raw = localStorage.getItem(TASKS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((task) => ({
      ...task,
      tags: Array.isArray(task.tags) ? task.tags : [],
      attachments: Array.isArray(task.attachments) ? task.attachments : [],
      steps: Array.isArray(task.steps) ? task.steps : []
    }));
  } catch {
    return [];
  }
}

function persistTasks() {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function loadSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY);
  const defaults = {
    notifications: true,
    theme: "light",
    language: "English"
  };

  if (!raw) {
    return defaults;
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      ...defaults,
      ...parsed
    };
  } catch {
    return defaults;
  }
}

function persistSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Profile Management Functions
function loadProfileData() {
  const users = JSON.parse(localStorage.getItem("smartTaskManager.users.v2") || "[]");
  const user = users.find((u) => u.email === session.email);

  if (user) {
    profileName.value = user.name || "";
    profileEmail.value = user.email || "";
    profilePassword.value = user.password || "";
    profileAge.value = user.age || "";
  }

  loadProfileImage();
}

function loadProfileImage() {
  const imageKey = `smartTaskManager.profileImage.${session.email}`;
  const imageData = localStorage.getItem(imageKey);
  if (imageData) {
    profileImageDisplay.src = imageData;
  }
}

function saveProfileImage(imageData) {
  const imageKey = `smartTaskManager.profileImage.${session.email}`;
  localStorage.setItem(imageKey, imageData);
  profileImageDisplay.src = imageData;
}

function deleteProfileImage() {
  const imageKey = `smartTaskManager.profileImage.${session.email}`;
  localStorage.removeItem(imageKey);
  // Reset to default SVG
  profileImageDisplay.src =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23e0e0e0' width='200' height='200'/%3E%3Ccircle cx='100' cy='70' r='35' fill='%23999'/%3E%3Cpath d='M50 180 Q50 140 100 140 Q150 140 150 180' fill='%23999'/%3E%3C/svg%3E";
}

function onProfileSubmit(event) {
  event.preventDefault();

  const users = JSON.parse(localStorage.getItem("smartTaskManager.users.v2") || "[]");
  const userIndex = users.findIndex((u) => u.email === session.email);

  if (userIndex === -1) {
    showProfileFeedback("User not found.", true);
    return;
  }

  const name = profileName.value.trim();
  const password = profilePassword.value.trim();
  const age = profileAge.value.trim();

  if (!name || !password) {
    showProfileFeedback("Name and password are required.", true);
    return;
  }

  // Update user data
  users[userIndex].name = name;
  users[userIndex].password = password;
  users[userIndex].age = age ? parseInt(age) : null;

  localStorage.setItem("smartTaskManager.users.v2", JSON.stringify(users));

  // Update session name
  session.name = name;
  localStorage.setItem("smartTaskManager.session.v2", JSON.stringify(session));

  showProfileFeedback("Profile updated successfully!", false);
  setGreeting();
}

function onProfileImageUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    showProfileFeedback("Image file is too large. Maximum 2MB allowed.", true);
    return;
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    showProfileFeedback("Please select a valid image file.", true);
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    saveProfileImage(e.target.result);
    showProfileFeedback("Profile image uploaded successfully!", false);
  };
  reader.onerror = () => {
    showProfileFeedback("Error reading file. Please try again.", true);
  };
  reader.readAsDataURL(file);

  // Reset file input
  profileImageInput.value = "";
}

function onProfileImageDelete() {
  if (confirm("Are you sure you want to delete your profile image?")) {
    deleteProfileImage();
    showProfileFeedback("Profile image deleted.", false);
  }
}

function showProfileFeedback(message, isError) {
  profileFeedback.textContent = message;
  profileFeedback.className = isError ? "profile-feedback error" : "profile-feedback success";

  // Auto-clear feedback after 4 seconds
  setTimeout(() => {
    profileFeedback.textContent = "";
    profileFeedback.className = "profile-feedback";
  }, 4000);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode";
}

function toInputDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toHour(hour24) {
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = ((hour24 + 11) % 12) + 1;
  return `${hour12}:00 ${suffix}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
