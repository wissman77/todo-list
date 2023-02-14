import Project from './project';
import manageLocalStorage from './storage-manager';

export default class ProjectManager {
  static projects = [];

  static addPrject(projectName) {
    const project = new Project(projectName);
    this.projects.push(project);
    this.saveData();
  }

  static removeProject(projectId) {
    const projectIndex = this._findProjectIndex(projectId);
    this.projects.splice(projectIndex, 1);
    this.saveData();
  }

  static addTodo(todo, projectId) {
    const projectIndex = this._findProjectIndex(projectId);
    this.projects[projectIndex].addTodo(todo);
    this.saveData();
  }

  static removeTodo(todoId) {
    const projectIndex =
      this._findProjectIndexAndTodoIndex(todoId).projectIndex;
    this.projects[projectIndex].removeTodo(todoId);
    this.saveData();
  }

  static updateTodo(todo) {
    const projectIndex = this._findProjectIndexAndTodoIndex(
      todo.id
    ).projectIndex;
    const todoIndex = this._findProjectIndexAndTodoIndex(todo.id).todoIndex;
    const todoToUpdate = this.projects[projectIndex].todos[todoIndex];
    todoToUpdate.update(todo);
    this.saveData();
  }

  static _findTodoIndex(todoId) {
    return this._findProjectIndexAndTodoIndex(todoId).todoIndex;
  }

  static _findProjectIndexAndTodoIndex(todoId) {
    let projectIndex = 0;
    let todoIndex = 0;
    for (let i = 0; i < this.projects.length; i++) {
      for (let j = 0; j < this.projects[i].todos.length; j++) {
        if (this.projects[i].todos[j].id === todoId) {
          projectIndex = i;
          todoIndex = j;
          break;
        }
      }
    }
    return { projectIndex, todoIndex };
  }

  static _findProjectIndex(projectId) {
    return this.projects.findIndex((project) => project.id === projectId);
  }

  static getProjectName(todoId) {
    let projectName = '';
    this.projects.forEach((project) => {
      project.forEach((todo) => {
        if (todo.id === todoId) {
          projectName = project.name;
        }
      });
    });
    return projectName;
  }

  static saveData() {
    manageLocalStorage.saveToLocalStorage();
  }
}
