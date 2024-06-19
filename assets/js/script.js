"use strict";

// Selectors
const modal = document.querySelector(".modal"),
  closeModalBtn = document.querySelector("#close-modal"),
  todoLists = document.querySelector(".todo-lists"),
  overlay = document.querySelector(".overlay"),
  editForm = document.querySelector("#edit-form"),
  todoForm = document.querySelector("#todo-form");

let editItemID;

// Check localStorage
let todos = JSON.parse(localStorage.getItem("lists"))
  ? JSON.parse(localStorage.getItem("lists"))
  : [];

if (todos.length) {
  showTodos();
}

// Todo time
function formatNum(num) {
  return num < 10 ? `0${num}` : num;
}

function getTime() {
  const now = new Date();
  const year = now.getFullYear();
  const day = formatNum(now.getDate());
  const hour = formatNum(now.getHours());
  const minutes = formatNum(now.getMinutes());
  const month = formatNum(now.getMonth() + 1);

  return `${hour}:${minutes}, ${day}.${month}.${year}`;
}
getTime();

// Show Todos
function showTodos() {
  const todos = JSON.parse(localStorage.getItem("lists"));
  todoLists.innerHTML = "";

  todos.forEach((todo, i) => {
    todoLists.innerHTML += `
        <div class="todo-list ${todo.completed ? "completed" : ""}">
            <div class="todo-content">
              <p class="task-text"> ${i + 1}. ${todo.text}</p>
              <p class="todo-date">${todo.date}</p>
            </div>
            <div class="todo-settings">
                <span onclick=(completeTodo(${i})) class="todo-completed"><i class="fa-solid fa-check"></i></span>
                <span onclick=(editTodo(${i})) class="todo-edit"><i class="fa-solid fa-pen-to-square"></i></span>
                <span onclick=(deleteTodo(${i})) class="todo-delete"><i class="fa-solid fa-trash"></i></span>
            </div>
        </div>
    `;
  });
}

// Show Error
function showMessage(where, message) {
  let textParent = document.querySelector(where);
  textParent.textContent = message;
  setTimeout(() => {
    textParent.textContent = "";
  }, 2500);
}

// Set Todo to localStorage
function setTodos() {
  localStorage.setItem("lists", JSON.stringify(todos));
}

// Add Todos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const todoText = todoForm["todo-text"].value.trim();

  if (todoText.length) {
    todos.push({ text: todoText, date: getTime(), completed: false });
    setTodos();
    showTodos();
  } else {
    showMessage(".error-message", "Please, enter some text...");
  }

  todoForm.reset();
});

// Delete Todo
function deleteTodo(id) {
  const deletedTodos = todos.filter((todo, i) => i !== id);
  todos = deletedTodos;
  setTodos();
  showTodos();
}

// Complete Todo
function completeTodo(id) {
  todos = todos.map((item, i) => {
    if (id === i) {
      return { ...item, completed: item.completed === true ? false : true };
    } else {
      return { ...item };
    }
  });

  todos.sort((a, b) => a.completed - b.completed);
  setTodos();
  showTodos();
}

// Edit Todo Modal
function openModal() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

document.addEventListener("keydown", (e) => {
  if (!modal.classList.contains("hidden") && e.key === "Escape") {
    closeModal();
  }
});

closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// Edit Todo
function editTodo(id) {
  if (editTodo) {
    openModal();
    editItemID = id;
  }

  editForm["edit-text"].value = todos[editItemID].text;
}

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const todoText = editForm["edit-text"].value.trim();

  if (todoText.length) {
    todos.splice(editItemID, 1, {
      text: todoText,
      date: getTime(),
      completed: false,
    });
    setTodos();
    showTodos();
    closeModal();
  } else {
    showMessage(".error-edit", "Please enter some text...");
  }

  editForm.reset();
});
