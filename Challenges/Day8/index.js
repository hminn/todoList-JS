// <⚠️ DONT DELETE THIS ⚠️>
// import "styles.css";
// <⚠️ /DONT DELETE THIS ⚠️>

const pendingList = document.querySelector(".js-pList"),
  finishedList = document.querySelector(".js-fList"),
  taskForm = document.querySelector(".js-form"),
  taskInput = taskForm.querySelector("input");

const PENDING_LS = "PENDING";
const FINISHED_LS = "FINISHED";
const UNDO_ICON = "far fa-meh";
const DONE_ICON = "far fa-laugh-squint";

let pending = [];
let finished = [];

function moveTask(event) {
  const btn = event.target;
  const li = btn.parentNode;
  if (li.parentNode.className === "js-pList") {
    deleteTask(event);
    paintFinished(li);
  } else {
    deleteTask(event);
    paintPending(li);
  }
}

function deleteTask(event) {
  where = event.target.parentNode.parentNode.className;
  if (where === "js-pList") {
    const btn = event.target;
    const li = btn.parentNode;
    pendingList.removeChild(li);
    const cleanTask = pending.filter(function(toDo) {
      return toDo.id !== li.id;
    });
    pending = cleanTask;
    savePending();
  } else {
    const btn = event.target;
    const li = btn.parentNode;
    finishedList.removeChild(li);
    const cleanTask = finished.filter(function(toDo) {
      return toDo.id !== li.id;
    });
    finished = cleanTask;
    saveFinished();
  }
}

function savePending() {
  localStorage.setItem(PENDING_LS, JSON.stringify(pending));
}
function saveFinished() {
  localStorage.setItem(FINISHED_LS, JSON.stringify(finished));
}

function paintTask(text, where) {
  const icon = document.createElement("i");
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const moveBtn = document.createElement("button");
  const span = document.createElement("span");

  delBtn.innerText = "❌";
  delBtn.addEventListener("click", deleteTask);
  moveBtn.innerText = "✅";
  moveBtn.addEventListener("click", moveTask);
  span.innerText = text;

  li.appendChild(icon);
  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(moveBtn);

  if (where === "pending") {
    paintPending(li);
  } else {
    paintFinished(li);
  }
}

function paintPending(li) {
  li.children[0].className = UNDO_ICON;
  pendingList.appendChild(li);
  li.id = pending.length + 1;
  text = li.children[1].textContent;
  const pendingObj = {
    text: text,
    id: li.id
  };
  pending.push(pendingObj);
  savePending();
}

function paintFinished(li) {
  li.children[0].className = DONE_ICON;
  finishedList.appendChild(li);
  li.id = finished.length + 1;
  text = li.children[1].textContent;
  const finishedObj = {
    text: text,
    id: li.id
  };
  finished.push(finishedObj);
  saveFinished();
}

function handleSubmit(event) {
  event.preventDefault();
  const currentValue = taskInput.value;
  paintTask(currentValue, "pending");
  taskInput.value = "";
}

function loadPending() {
  const loadedTask = localStorage.getItem(PENDING_LS);
  if (loadedTask !== null) {
    const parsedTasks = JSON.parse(loadedTask);
    parsedTasks.forEach(function(task) {
      paintTask(task.text, "pending");
    });
  }
}

function loadFinished() {
  const loadedTask = localStorage.getItem(FINISHED_LS);
  if (loadedTask !== null) {
    const parsedTasks = JSON.parse(loadedTask);
    parsedTasks.forEach(function(task) {
      paintTask(task.text, "", null);
    });
  }
}

function init() {
  loadPending();
  loadFinished();
  taskForm.addEventListener("submit", handleSubmit);
}

init();