import { endOfYesterday, format, isBefore } from 'date-fns';
import programFlow from './program-flow';

const programUI = ((doc) => {
  // modals elements
  const addProjectBtn = doc.querySelector('.add-project');
  const projectModal = doc.querySelector('.project-modal');
  const addTodoBtn = doc.querySelector('.add-todo');
  const todoModal = doc.querySelector('.todo-modal');
  const todoCloseBtn = doc.querySelector('.close-todo');
  const projectCloseBtn = doc.querySelector('.project-close');
  const projectForm = doc.querySelector('#project');
  const todoForm = doc.querySelector('#todo');

  // todoForm Form Elements
  const todoButton = todoForm.querySelector('button');
  const todoHeader = todoForm.querySelector('h2');
  const titleInput = todoForm.querySelector('#todo-title');
  const dueDateInput = todoForm.querySelector('#due-date');
  const descriptionInput = todoForm.querySelector('#description');
  const priorityInput = todoForm.querySelector('#priority');

  // addProject Form Elements
  const projectFormHeader = projectForm.querySelector('h2');
  const projectButton = projectForm.querySelector('button');
  const projectNameInput = projectForm.querySelector('input');

  let currentProjectId = '';
  let currentTodoId = '';

  // Load all projects and render
  window.addEventListener('load', () => {
    renderAllProjects();
    renderTodosForSpecificProject(currentProjectId);
  });

  // add new project click event
  addProjectBtn.addEventListener('click', () => {
    enterNewProjectMode();
    projectModal.style.display = 'block';
  });

  // close model add or edit project
  projectCloseBtn.addEventListener('click', hideModalAndResetProjectForm);

  // add new todo click event
  addTodoBtn.addEventListener('click', () => {
    enterNewTodoMode();
    todoModal.style.display = 'block';
  });

  // close moodal add or edit todo
  todoCloseBtn.addEventListener('click', hideModalAndReseTodoForm);

  // handler for add or edit project form submition
  projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (projectButton.textContent.includes('Add')) {
      if (!projectNameInput.value) {
        alert('Please enter a name for the project');
        return;
      }
      programFlow.addNewProject(projectNameInput.value);
    } else {
      programFlow.updateProject(projectNameInput.value, currentProjectId);
    }
    hideModalAndResetProjectForm();
    renderAllProjects();
  });

  // change elements for new project form
  function enterNewProjectMode() {
    projectFormHeader.textContent = 'Add New Project';
    projectNameInput.value = '';
    projectButton.innerHTML =
      '<i class="fa-solid fa-folder-plus"></i> Add Project';
  }

  // change elements for edit project form
  function enterEditProjectMode(id) {
    projectFormHeader.textContent = 'Edit Project Form';
    projectButton.innerHTML =
      '<i class="fa-solid fa-square-pen"></i> Edit Project';
    projectNameInput.value = programFlow.getProjectName(id);
  }

  // change elements for new todo form
  function enterNewTodoMode() {
    todoHeader.textContent = 'Add Todo Form';
    todoButton.innerHTML = '<i class="fa-solid fa-square-plus"></i> Add Todo';
    titleInput.value = '';
    dueDateInput.valueAsDate = new Date();
    descriptionInput.value = '';
    priorityInput.value = 'low';
  }

  // change elements for edit todo form
  function enterEditTodoMode(todoId, projectId) {
    currentTodoId = todoId;
    currentProjectId = projectId;

    const todo = programFlow.getTodo(todoId, projectId);

    todoHeader.textContent = 'Edit Todo Form';
    todoButton.innerHTML =
      '<i class="fa-solid fa-pen-to-square"></i> Edit Todo';
    titleInput.value = todo.title;
    dueDateInput.valueAsDate = new Date(todo.dueDate);
    descriptionInput.value = todo.description;
    priorityInput.value = todo.priority;
  }

  // handler for add or edit todo submition
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const projectId = currentProjectId;
    const todoId = currentTodoId;

    // check if dueDate is in the past
    if (isBefore(new Date(dueDateInput.value), endOfYesterday())) {
      alert('please choose present or a future date!');
      return;
    }

    if (todoButton.textContent.includes('Add')) {
      programFlow.addNewTodo(
        titleInput.value,
        new Date(dueDateInput.value),
        descriptionInput.value,
        priorityInput.value,
        projectId
      );
    } else {
      programFlow.updateTodo(
        titleInput.value,
        new Date(dueDateInput.value),
        descriptionInput.value,
        priorityInput.value,
        projectId,
        todoId
      );
    }
    hideModalAndReseTodoForm();
    renderTodosForSpecificProject(projectId);
  });

  // hide modal and reset project form when it closed
  function hideModalAndResetProjectForm() {
    projectModal.style.display = 'none';
    projectForm.reset();
  }

  // hide modal and reset todo form when it closed
  function hideModalAndReseTodoForm() {
    todoModal.style.display = 'none';
    todoForm.reset();
  }

  // render all projects form local storage by building a list
  function renderAllProjects() {
    const projectUL = doc.querySelector('.projects');
    projectUL.innerHTML = '';
    const projects = programFlow.loadProjects();
    currentProjectId = projects[0].id;

    projects.forEach((project) => {
      const projectLI = doc.createElement('li');
      const anchor = doc.createElement('a');
      anchor.href = '#';
      anchor.setAttribute('data-projectid', project.id);
      anchor.addEventListener(
        'click',
        renderTodosForSpecificProject.bind(anchor, project.id)
      );
      anchor.innerHTML = `<i class="fa-solid fa-list-check"></i>&nbsp;${project.name}`;
      projectLI.appendChild(anchor);
      if (project.name !== 'Demo Project') {
        const deleteProjectBtn = doc.createElement('button');
        deleteProjectBtn.innerHTML = `<i data-projectid="${project.id}" class="fa-solid fa-delete-left"></i>`;
        deleteProjectBtn.classList.add('btn');
        deleteProjectBtn.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-projectid');
          programFlow.deleteProject(id);
          renderAllProjects();
        });
        projectLI.appendChild(deleteProjectBtn);

        const editProjectBtn = doc.createElement('button');
        editProjectBtn.classList.add('btn');
        editProjectBtn.innerHTML = `<i data-projectid="${project.id}" class="fa-solid fa-pen-to-square"></i>`;
        editProjectBtn.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-projectid');
          enterEditProjectMode(id);
          projectModal.style.display = 'block';
        });
        projectLI.appendChild(editProjectBtn);
      }
      projectUL.appendChild(projectLI);
    });
  }

  // changes the header for project name and renders project's todos
  function renderTodosForSpecificProject(projectId) {
    const projectName = doc.querySelector('.project-name');
    currentProjectId = projectId;
    projectName.textContent = programFlow.getProjectName(currentProjectId);
    const todos = programFlow.getProjectTodos(currentProjectId);
    renderTodos(todos);
  }

  // render todos and add event for edit and delete todo and marking as complete
  function renderTodos(todos) {
    const todosList = doc.querySelector('.todos-list');
    todosList.innerHTML = '';
    todos.forEach((todo) => {
      console.log(todo);
      const projectId = programFlow.getProjectIdForTodo(todo.id);

      const container = doc.createElement('div');
      container.classList.add('todo-container');
      todosList.appendChild(container);

      const todoBody = doc.createElement('div');
      todoBody.classList.add('todo-body');
      container.appendChild(todoBody);

      const completed = renderCheckbox(todo.completed);
      completed.addEventListener(
        'click',
        toggleTodoStatus.bind(completed, todo.id, projectId)
      );
      todoBody.appendChild(completed);
      if (todo.completed) todoBody.classList.add('completed');

      const titlePara = doc.createElement('p');
      titlePara.classList.add('todo-title');
      titlePara.textContent = todo.title;
      todoBody.appendChild(titlePara);

      const descriptionPara = doc.createElement('p');
      descriptionPara.classList.add('todo-description');
      descriptionPara.textContent = todo.description;
      todoBody.appendChild(descriptionPara);

      const dueDatePara = doc.createElement('div');
      dueDatePara.classList.add('todo-duedate');
      dueDatePara.textContent = format(new Date(todo.dueDate), 'dd-MM-yyyy');
      todoBody.appendChild(dueDatePara);

      const projectNamePara = doc.createElement('p');
      projectNamePara.classList.add('todo-project-name');
      projectNamePara.textContent = programFlow.getProjectName(projectId);
      todoBody.appendChild(projectNamePara);

      const actions = doc.createElement('div');
      actions.classList.add('actions');
      container.appendChild(actions);

      const priorityFlag = doc.createElement('i');
      priorityFlag.classList.add('fa-solid', 'fa-flag');
      priorityFlag.classList.add(todo.priority);
      priorityFlag.title = todo.priority;
      actions.appendChild(priorityFlag);

      const editTodoFlag = doc.createElement('i');
      editTodoFlag.classList.add('fa-solid', 'fa-pen-to-square');
      editTodoFlag.addEventListener('click', () => {
        enterEditTodoMode(todo.id, projectId);
        todoModal.style.display = 'block';
      });
      actions.appendChild(editTodoFlag);

      const deleteTodoFlag = doc.createElement('i');
      deleteTodoFlag.classList.add('fa-solid', 'fa-trash', 'danger');
      deleteTodoFlag.addEventListener(
        'click',
        deleteTodo.bind(this, todo.id, projectId)
      );
      actions.appendChild(deleteTodoFlag);

      todosList.appendChild(container);
    });
  }

  // renders the checkbox for todo completed or not
  function renderCheckbox(status) {
    const checkbox = doc.createElement('input');
    checkbox.type = 'checkbox';
    if (status) {
      checkbox.checked = true;
    }
    return checkbox;
  }

  // change status of todo as completed or not
  function toggleTodoStatus(todoId, projectId) {
    programFlow.completeTodo(todoId, projectId);
    this.parentElement.classList.toggle('completed');
  }

  // delete todo from localstorage and render all todos again
  function deleteTodo(todoId, projectId) {
    programFlow.deleteTodo(todoId, projectId);
    renderTodosForSpecificProject(projectId);
  }
})(document);

export default programUI;
