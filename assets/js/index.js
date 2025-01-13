'use strict';

import { setClosedToOpen, setClosingToClosed, generateId, dropdownMenu } from "./functions.js";

const backdrop = document.querySelector('.backdrop');
const modal = document.querySelector('.modal');
const todoTitle = todoForm.querySelector("[name='todo_title']");
const todoDescription = todoForm.querySelector("[name='todo_description']");

function saveToLocalStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getFromLocalStorage() {
    const todos = localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
}

function addToDoList(todo) {
    const { _id, todoText, completed } = todo;

    const todoHTML = `
        <li class="todo_item ${completed ? "completed" : ""}" data-todo_id="${_id}">

            <label class="checkbox_label" aria-label="Toggle completed">
                <div class="checkbox">
                    <input type="checkbox" name="todo_check" ${completed ? "checked" : ""}>
                        <span class="checkbox_bg">
                            <span class="tick_1"></span>
                            <span class="tick_2"></span>
                        </span>
                </div>

                <p class="todo_title">${todoText}</p>
            </label>

            <div class="dropdown">
                <button type="button" class="btn_icon icon_dropdown" aria-label="Dropdown button">
                    <i class="icon_ellipsis-vertical-solid"></i>
                </button>

                <ul class="icon_dropdown_menu" data-position="bot_right" data-state="closed">

                    <li class="icon_dropdown_menu_item">
                        <button type="button" data-btn="todo_edit" aria-label="Edit button">
                            Edit
                        </button>
                    </li>

                    <li class="icon_dropdown_menu_item">
                        <button type="button" data-btn="todo_remove" aria-label="Remove button">
                            Remove
                        </button>
                    </li>

                </ul>
            </div>
        </li>
    `;

    const chatContainer = document.querySelector("#todo_lists");

    if (chatContainer) {
        chatContainer.insertAdjacentHTML("afterbegin", todoHTML);
    }
}

function renderTodos() {
    const todos = getFromLocalStorage();
    const chatContainer = document.querySelector("#todo_lists");
    chatContainer.innerHTML = '';

    for (const todo of todos) {
        addToDoList(todo);
    }

}

document.addEventListener('submit', function (e) {
    e.preventDefault();
    const todoForm = e.target.closest('#todoForm');
    if (todoForm) {
        const todoText = todoTitle.value.trim();

        if (todoText.length > 0) {
            const todos = getFromLocalStorage();

            const isEdit = todoForm.classList.contains('edit');
            if (isEdit) {
                const todoId = todoForm.getAttribute('data-edit_id');
                const todoIndex = todos.findIndex(todo => todo._id === todoId);

                if (todoIndex > -1) {
                    todos[todoIndex].todoText = todoText;

                    saveToLocalStorage(todos);
                    renderTodos();

                    todoForm.classList.remove('edit');
                    todoForm.removeAttribute('data-edit_id');
                    todoForm.querySelector('button').innerText = "Add task";
                    todoForm.reset();

                    setClosingToClosed(backdrop);
                    setClosingToClosed(modal);
                }
            } else {
                const todoObject = {
                    _id: generateId(),
                    todoText,
                    completed: false,
                    createdAt: Date.now()
                };

                todos.push(todoObject);
                saveToLocalStorage(todos);
                addToDoList(todoObject);

                todoForm.reset();
            }

        } else {
            console.log("The input cannot be blank!!!");
        }
    }
});

document.addEventListener('click', function (e) {
    const todos = getFromLocalStorage();
    const todoItem = e.target.closest('.todo_item');

    const completedButton = e.target.closest('[name="todo_check"]');
    if (completedButton && todoItem) {
        const todoId = todoItem.getAttribute('data-todo_id');
        const todoIndex = todos.findIndex(todo => todo._id === todoId);
        if (todoIndex > -1) {
            todos[todoIndex].completed = !todos[todoIndex].completed;
            saveToLocalStorage(todos);
            renderTodos();
        }
    }

    const editButton = e.target.closest('[data-btn="todo_edit"]');
    if (editButton && todoItem) {
        const todoId = todoItem.getAttribute('data-todo_id');
        const todoIndex = todos.findIndex(todo => todo._id === todoId);

        if (todoIndex > -1) {
            const todo = todos[todoIndex];

            todoTitle.value = todo.todoText;

            const todoForm = document.querySelector('#todoForm');
            todoForm.classList.add('edit');
            todoForm.setAttribute('data-edit_id', todoId);

            todoForm.querySelector('button').innerText = "Save";

            setClosedToOpen(backdrop);
            setClosedToOpen(modal);
        }
    }

    const removeButton = e.target.closest('[data-btn="todo_remove"]');
    if (removeButton && todoItem) {
        const todoId = todoItem.getAttribute('data-todo_id');
        const updatedTodos = todos.filter(todo => todo._id !== todoId);
        saveToLocalStorage(updatedTodos);
        renderTodos();
    }

    const newTask = e.target.closest('[data-btn="new_task"]');
    if (newTask) {
        const isActive = backdrop.getAttribute('data-state') === 'open';
        if (!isActive) {
            setClosedToOpen(backdrop);
            setClosedToOpen(modal);
        } else {
            const todoForm = document.querySelector('#todoForm');
            todoForm.classList.remove('edit');
            todoForm.removeAttribute('data-edit_id');
            todoForm.querySelector('button').innerText = "Add task";
            todoForm.reset();

            setClosingToClosed(backdrop);
            setClosingToClosed(modal);
        }
    }

    const iconDropdown = e.target.closest('.icon_dropdown');
    if (iconDropdown) {
        const buttonDropdown = iconDropdown.closest(".dropdown").querySelector(".icon_dropdown_menu");
        dropdownMenu(buttonDropdown);
    } else {
        const closeDropdown = document.querySelector(".icon_dropdown_menu[data-state='open']");
        if (closeDropdown) {
            dropdownMenu(closeDropdown);
        }
    }
});

renderTodos();