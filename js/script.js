// --- 1. LIGHT/DARK MODE ---
const themeToggle = document.getElementById("theme-toggle");
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

// --- 2. GREETING & CLOCK ---
function updateClock() {
  const now = new Date();
  document.getElementById("time-display").textContent = now.toLocaleTimeString("en-US", { hour12: false });
  document.getElementById("date-display").textContent = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const hour = now.getHours();
  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  // Custom name challenge
  document.getElementById("greeting-message").textContent = `${greeting}, Handika`;
}
setInterval(updateClock, 1000);
updateClock();

// --- 3. FOCUS TIMER ---
let timerInterval;
let timeLeft = 25 * 60; // 25 minutes
const timerDisplay = document.getElementById("timer");

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

document.getElementById("start-btn").addEventListener("click", () => {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        alert("Focus session complete!");
      }
    }, 1000);
  }
});

document.getElementById("stop-btn").addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
});

document.getElementById("reset-btn").addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timeLeft = 25 * 60;
  updateTimerDisplay();
});

// --- 4. TO-DO LIST ---
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <div>
                <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${index})">
                <span class="${task.completed ? "completed" : ""}">${task.text}</span>
            </div>
            <div>
                <button onclick="editTask(${index})" class="btn secondary" style="padding: 4px 8px; font-size: 0.8rem;">Edit</button>
                <button onclick="deleteTask(${index})" class="btn danger" style="padding: 4px 8px; font-size: 0.8rem;">Delete</button>
            </div>
        `;
    taskList.appendChild(li);
  });
}

document.getElementById("add-task-btn").addEventListener("click", () => {
  const input = document.getElementById("task-input");
  const text = input.value.trim();

  if (text) {
    // Prevent duplicate tasks challenge
    if (tasks.some((t) => t.text.toLowerCase() === text.toLowerCase())) {
      alert("Task already exists!");
      return;
    }
    tasks.push({ text, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    input.value = "";
    renderTasks();
  }
});

window.toggleTask = (index) => {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
};

window.editTask = (index) => {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
};

window.deleteTask = (index) => {
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
};

// --- 5. QUICK LINKS ---
let links = JSON.parse(localStorage.getItem("links")) || [];

function renderLinks() {
  const container = document.getElementById("links-container");
  container.innerHTML = "";
  links.forEach((link, index) => {
    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank";
    a.className = "link-item";
    a.innerHTML = `${link.name} <button class="delete-link" onclick="event.preventDefault(); deleteLink(${index})">×</button>`;
    container.appendChild(a);
  });
}

document.getElementById("add-link-btn").addEventListener("click", () => {
  const nameInput = document.getElementById("link-name");
  const urlInput = document.getElementById("link-url");
  if (nameInput.value && urlInput.value) {
    links.push({ name: nameInput.value, url: urlInput.value });
    localStorage.setItem("links", JSON.stringify(links));
    nameInput.value = "";
    urlInput.value = "";
    renderLinks();
  }
});

window.deleteLink = (index) => {
  links.splice(index, 1);
  localStorage.setItem("links", JSON.stringify(links));
  renderLinks();
};

// Initial Render
renderTasks();
renderLinks();
