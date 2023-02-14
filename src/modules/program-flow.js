import Project from './project';
import ProjectManger from './projects-manager';
import Todo from './todo';

const programFlow = (() => {
  const _saveToLocalStorage = () => {
    localStorage.setItem('projects', JSON.stringify(ProjectManger.projects));
  };

  const _getProjectsFromLocalStorage = () => {
    ProjectManger.projects = JSON.parse(localStorage.getItem('projects'));
  };

  const _findProjectIndex = (projectId) => {
    _getProjectsFromLocalStorage();
    return ProjectManger.projects.findIndex(
      (project) => project.id === projectId
    );
  };

  const _findTodoIndex = (projectIndex, todoId) => {
    _getProjectsFromLocalStorage();
    return ProjectManger.projects[projectIndex].todos.findIndex(
      (todo) => todo.id === todoId
    );
  };

  const loadProjects = () => {
    let localProjects = JSON.parse(localStorage.getItem('projects'));
    if (!localProjects) {
      const demoProject = new Project('Demo Project');
      ProjectManger.projects.push(demoProject);
      _saveToLocalStorage();
      localProjects = ProjectManger.projects;
    } else {
      ProjectManger.projects = localProjects;
    }
    return localProjects;
  };

  const addNewProject = (name) => {
    ProjectManger.projects.push(new Project(name));
    _saveToLocalStorage();
  };

  const deleteProject = (projectId) => {
    const index = _findProjectIndex(projectId);
    ProjectManger.projects.splice(index, 1);
    _saveToLocalStorage();
  };

  const getProjectName = (projectId) => {
    const projectIndex = _findProjectIndex(projectId);
    return ProjectManger.projects[projectIndex].name;
  };

  const updateProject = (name, projectId) => {
    const index = _findProjectIndex(projectId);
    ProjectManger.projects[index].name = name;
    _saveToLocalStorage();
  };

  const getProjectTodos = (projectId) => {
    const index = _findProjectIndex(projectId);
    return ProjectManger.projects[index].todos;
  };

  const getProjectIdForTodo = (todoId) => {
    let projectId;
    ProjectManger.projects.forEach((project) => {
      project.todos.forEach((todo) => {
        if (todo.id === todoId) {
          projectId = project.id;
        }
      });
    });
    return projectId;
  };

  const addNewTodo = (title, dueDate, description, priority, projectId) => {
    const todo = new Todo(title, dueDate, description, priority);
    const index = _findProjectIndex(projectId);
    ProjectManger.projects[index].todos.push(todo);
    _saveToLocalStorage();
  };

  const getTodo = (todoId, projectId) => {
    const projectIndex = _findProjectIndex(projectId);
    const todoIndex = _findTodoIndex(projectIndex, todoId);
    return ProjectManger.projects[projectIndex].todos[todoIndex];
  };

  const deleteTodo = (todoId, projectId) => {
    const projectIndex = _findProjectIndex(projectId);
    const todoIndex = _findTodoIndex(projectIndex, todoId);
    ProjectManger.projects[projectIndex].todos.splice(todoIndex, 1);
    _saveToLocalStorage();
  };

  const updateTodo = (
    title,
    dueDate,
    description,
    priority,
    projectId,
    todoId
  ) => {
    const projectIndex = _findProjectIndex(projectId);
    const todoIndex = _findTodoIndex(projectIndex, todoId);
    const todo = ProjectManger.projects[projectIndex].todos[todoIndex];
    todo.title = title;
    todo.dueDate = dueDate;
    todo.description = description;
    todo.priority = priority;
    _saveToLocalStorage();
  };

  const completeTodo = (todoId, projectId) => {
    const projectIndex = _findProjectIndex(projectId);
    const todoIndex = _findTodoIndex(projectIndex, todoId);
    const todo = ProjectManger.projects[projectIndex].todos[todoIndex];
    todo.completed = !todo.completed;
    _saveToLocalStorage();
  };

  return {
    loadProjects,
    addNewProject,
    deleteProject,
    getProjectName,
    getProjectIdForTodo,
    updateProject,
    getProjectTodos,
    addNewTodo,
    getTodo,
    deleteTodo,
    updateTodo,
    completeTodo,
  };
})();

export default programFlow;
