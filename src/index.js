import './styles.css';

import { endOfYesterday, isBefore } from 'date-fns';
import ProjectManager from './modules/projects-manager';
import manageLocalStorage from './modules/storage-manager';
import todoListIcon from './to-do-list.png';

// IIFE for DOM manipulation
((doc) => {
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

  // project container
  const projectContainer = doc.querySelector('.projects');
  const projectNameHeader = doc.querySelector('.project-name');
  const todosList = doc.querySelector('.todos-list');

  // filtering elements
  const categoriesElements = doc.querySelectorAll('.main-menu ul li a');

  // variables to track the currnt project category and todo by id
  let currentProjectIdOrCategory = '';
  let currentTodoId = '';

  categoriesElements.forEach((categoryElement) => {
    categoryElement.addEventListener('click', (e) => {
      const category = e.target.className;
      currentProjectIdOrCategory = category;
      projectNameHeader.textContent =
        category[0].toUpperCase() + category.substring(1);
      doc.querySelector('.add-todo').style.display = 'none';
      renderTodosForCurrentProjectOrCategory();
    });
  });

  // Load all projects and render
  window.addEventListener('load', () => {
    manageLocalStorage.loadProjects();
    renderAllProjectsAndEvents();
    // choose default project
    currentProjectIdOrCategory = ProjectManager.projects[0].id;
    renderTodosForCurrentProjectOrCategory();
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

  // change elements for new project form
  function enterNewProjectMode() {
    projectFormHeader.textContent = 'Add New Project';
    projectNameInput.value = '';
    projectButton.innerHTML =
      '<i class="fa-solid fa-folder-plus"></i> Add Project';
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

  // change elements for edit project form
  function enterEditProjectMode() {
    projectFormHeader.textContent = 'Edit Project Form';
    projectButton.innerHTML =
      '<i class="fa-solid fa-square-pen"></i> Edit Project';
    projectNameInput.value = ProjectManager.getProjectNameById(
      currentProjectIdOrCategory
    );
  }

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

  function renderAllProjectsAndEvents() {
    projectContainer.innerHTML = '';

    // renders the project using renderHTML method
    ProjectManager.projects.forEach((project) => {
      const projectLI = project.renderHTML();
      projectContainer.insertAdjacentHTML('beforeend', projectLI);
    });

    // adding events when project clicked to render its todos
    const allProjects = projectContainer.querySelectorAll('li a');
    allProjects.forEach((projectNode) => {
      projectNode.addEventListener('click', (e) => {
        doc.querySelector('.add-todo').style.display = 'block';
        // Show all todos for a project
        currentProjectIdOrCategory = e.target.getAttribute('data-projectid');
        projectNameHeader.textContent = ProjectManager.getProjectNameById(
          currentProjectIdOrCategory
        );
        renderTodosForCurrentProjectOrCategory();
      });
    });

    // adding event to delete a project
    const allProjectDeleteButtons =
      projectContainer.querySelectorAll('i.fa-delete-left');
    console.log(allProjectDeleteButtons);
    allProjectDeleteButtons.forEach((deleteButtonNode) => {
      deleteButtonNode.addEventListener('click', (e) => {
        const projectId = e.target.getAttribute('data-projectid');
        ProjectManager.removeProject(projectId);
        renderAllProjectsAndEvents();
      });
    });

    // adding event to edit project name
    const allProjecEditButtons =
      projectContainer.querySelectorAll('i.fa-pen-to-square');
    console.log(allProjecEditButtons);
    allProjecEditButtons.forEach((editButtonNode) => {
      editButtonNode.addEventListener('click', (e) => {
        // Edit method
        currentProjectIdOrCategory = e.target.getAttribute('data-projectid');
        enterEditProjectMode();
        projectModal.style.display = 'block';
        renderAllProjectsAndEvents();
      });
    });
  }

  // renders todos by the choosen category of a specific project by its id
  function renderTodosForCurrentProjectOrCategory() {
    let todos;
    switch (currentProjectIdOrCategory) {
      case 'all':
        todos = ProjectManager.getAllTodos();
        break;
      case 'today':
        todos = ProjectManager.getTodayTodos();
        break;
      case 'week':
        todos = ProjectManager.getTodosForWeek();
        break;
      case 'urgent':
        todos = ProjectManager.getUrgentTodos();
        break;
      case 'completed':
        todos = ProjectManager.getCompletedTodos();
        break;
      default:
        todos = ProjectManager.getTodosByProjectId(currentProjectIdOrCategory);
        break;
    }

    renderTodos(todos);
  }

  // renders the todos - generic
  function renderTodos(todos) {
    todosList.innerHTML = '';

    // renders todos using renderHTML method
    todos.forEach((todo) => {
      const div = todo.renderHTML();
      todosList.insertAdjacentHTML('beforeend', div);
    });

    // add events to check the checkbox and change the status of the todo
    const allCheckboxes = todosList.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('click', (e) => {
        const todoIndex = e.target.getAttribute('data-todoid');
        ProjectManager.toggleCompelteTodo(todoIndex);
        e.target.parentElement.classList.toggle('completed');
      });
    });

    // add event for editing the todo
    const allEditTodoButtons = todosList.querySelectorAll('i.fa-pen-to-square');
    allEditTodoButtons.forEach((editButtonNode) => {
      editButtonNode.addEventListener('click', (e) => {
        const todoId = e.target.getAttribute('data-todoid');
        enterEditTodoMode(todoId);
        todoModal.style.display = 'block';
      });
    });

    // add event to delete a todo
    const allDeleteTodoButtons = todosList.querySelectorAll('i.fa-trash');
    allDeleteTodoButtons.forEach((deleteButtonNode) => {
      deleteButtonNode.addEventListener('click', (e) => {
        const todoId = e.target.getAttribute('data-todoid');
        ProjectManager.removeTodo(todoId);
        renderTodosForCurrentProjectOrCategory();
      });
    });
  }

  // handler for add or edit project form submition
  projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (projectButton.textContent.includes('Add')) {
      if (!projectNameInput.value) {
        alert('Please enter a name for the project');
        return;
      }
      ProjectManager.addPrject(projectNameInput.value);
    } else {
      ProjectManager.updateProjectName(
        projectNameInput.value,
        currentProjectIdOrCategory
      );
    }
    hideModalAndResetProjectForm();
    renderAllProjectsAndEvents();
  });

  // change elements for edit todo form
  function enterEditTodoMode(todoId) {
    const todo = ProjectManager.getTodo(todoId);
    currentTodoId = todoId;
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

    const projectId = currentProjectIdOrCategory;
    const todoId = currentTodoId;

    if (todoButton.textContent.includes('Add')) {
      // check if dueDate is in the past
      if (isBefore(new Date(dueDateInput.value), endOfYesterday())) {
        alert('please choose present or a future date!');
        return;
      }
      ProjectManager.addTodo(
        titleInput.value,
        new Date(dueDateInput.value),
        descriptionInput.value,
        priorityInput.value,
        projectId
      );
    } else {
      ProjectManager.updateTodo(
        titleInput.value,
        new Date(dueDateInput.value),
        descriptionInput.value,
        priorityInput.value,
        todoId
      );
    }
    hideModalAndReseTodoForm();
    renderTodosForCurrentProjectOrCategory();
  });

  // add fivicon
  function addFivicon() {
    const link = doc.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = todoListIcon;
    doc.head.appendChild(link);
  }

  addFivicon();
})(document);
