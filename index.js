const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const filterAllButton = document.getElementById("filter-all");
const filterActiveButton = document.getElementById("filter-active");
const filterCompletedButton = document.getElementById("filter-completed");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const taskText = taskInput.value.trim();

  if (taskText !== "") {
    const task = {
      text: taskText,
      completed: false,
    };

    tasks.push(task);
    taskInput.value = "";
    saveTasksToLocalstorage();
    renderTasks();
  }
});

filterAllButton.addEventListener("click", function () {
  renderTasks("all");
});

filterActiveButton.addEventListener("click", function () {
  renderTasks("active");
});

filterCompletedButton.addEventListener("click", function () {
  renderTasks("completed");
});

searchButton.addEventListener("click", function () {
  const searchKeyword = searchInput.value.trim().toLowerCase();
  renderTasks("all", searchKeyword);
});

function renderTasks(filter = "all", searchKeyword = "") {
  // Clear the task list
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  let totalTasks = 0;
  let completedTasks = 0;

  tasks.forEach((task, index) => {
    const taskText = task.text.toLowerCase();
    const isActive = filter === "active" && !task.completed;
    const isCompleted = filter === "completed" && task.completed;
    const isAll = filter === "all";
    const shouldDisplayTask =
      (isActive || isCompleted || isAll) &&
      (searchKeyword === "" || taskText.includes(searchKeyword));

    if (shouldDisplayTask) {
      const listItem = document.createElement("li");
      const flexContainer = createFlexContainer(index, task, taskText);
      listItem.appendChild(flexContainer);

      taskList.appendChild(listItem);
      totalTasks++;
      if (task.completed) {
        completedTasks++;
      }
    }

    const taskCount = document.getElementById("task-count");
    taskCount.textContent = `Total tasks: ${totalTasks} | Completed tasks: ${completedTasks}`;
  });
}

function createFlexContainer(index, task, taskText) {
  const flexContainer = document.createElement("div");
  flexContainer.classList.add(
    "flex",
    "items-center",
    "justify-between",
    "p-1",
    "bg-white",
    "border-0",
    "rounded",
    "shadow-sm",
    "mb-2"
  );

  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = `task-${index}`;
  input.classList.add("form-checkbox", "h-4", "w-4", "text-blue-500");
  input.checked = task.completed;

  const label = document.createElement("label");
  label.htmlFor = `task-${index}`;
  label.classList.add("text-m");
  if (task.completed) {
    label.classList.add("line-through", "text-gray-400");
  } else {
    label.classList.add("text-gray-700");
  }

  label.textContent = task.text;

  const buttonContainer = document.createElement("div");

  const editButton = createEditButton(index);
  const deleteButton = createDeleteButton(index);

  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);

  flexContainer.appendChild(createFlexItem([input, label]));
  flexContainer.appendChild(buttonContainer);

  input.addEventListener("change", function () {
    task.completed = !task.completed;
    saveTasksToLocalstorage();
    renderTasks();
  });

  return flexContainer;
}

function createFlexItem(children) {
  const flexItem = document.createElement("div");
  flexItem.classList.add("flex", "items-center", "space-x-2");
  children.forEach((child) => flexItem.appendChild(child));
  return flexItem;
}

function createEditButton(index) {
  const editButton = document.createElement("button");
  editButton.classList.add(
    "edit-button",
    "bg-yellow-500",
    "text-white",
    "hover:bg-yellow-600",
    "p-1",
    "rounded",
    "mr-1"
  );
  editButton.setAttribute("data-index", index);
  editButton.innerHTML = '<i class="fas fa-edit"></i>';

  editButton.addEventListener("click", function () {
    const newText = prompt("Edit the task:", tasks[index].text);
    if (newText !== null) {
      tasks[index].text = newText;
      saveTasksToLocalstorage();
      renderTasks();
    }
  });

  return editButton;
}

function createDeleteButton(index) {
  const deleteButton = document.createElement("button");
  deleteButton.classList.add(
    "delete-button",
    "bg-rose-600",
    "text-white",
    "hover:bg-rose-700",
    "p-1",
    "rounded"
  );
  deleteButton.setAttribute("data-index", index);
  deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';

  deleteButton.addEventListener("click", function () {
    tasks.splice(index, 1);
    saveTasksToLocalstorage();
    renderTasks();
  });

  return deleteButton;
}

function saveTasksToLocalstorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

renderTasks();
