import { isThisWeek, isToday } from 'date-fns';
import { th } from 'date-fns/locale';
import Project from './project';
import manageLocalStorage from './storage-manager';
import Todo from './todo';

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

  static updateProjectName(newName, projectId) {
    const projectIndex = this._findProjectIndex(projectId);
    this.projects[projectIndex].updateName(newName);
    this.saveData();
  }

  static getProjectNameById(projectId) {
    const projectIndex = this._findProjectIndex(projectId);
    return this.projects[projectIndex].name;
  }

  static addTodo(titile, dueDate, description, priority, projectId) {
    const projectIndex = this._findProjectIndex(projectId);
    const todo = new Todo(titile, dueDate, description, priority);
    this.projects[projectIndex].addTodo(todo);
    this.saveData();
  }

  static removeTodo(todoId) {
    const projectIndex =
      this._findProjectIndexAndTodoIndex(todoId).projectIndex;
    this.projects[projectIndex].removeTodo(todoId);
    this.saveData();
  }

  static getTodo(todoId) {
    const projectIndex =
      this._findProjectIndexAndTodoIndex(todoId).projectIndex;
    const todoIndex = this._findProjectIndexAndTodoIndex(todoId).todoIndex;
    return this.projects[projectIndex].todos[todoIndex];
  }

  static updateTodo(newTitle, newDueDate, newDescription, newPriority, todoId) {
    const projectIndex =
      this._findProjectIndexAndTodoIndex(todoId).projectIndex;
    const todoIndex = this._findProjectIndexAndTodoIndex(todoId).todoIndex;
    const todoToUpdate = this.projects[projectIndex].todos[todoIndex];
    todoToUpdate.update(newTitle, newDueDate, newDescription, newPriority);
    this.saveData();
  }

  static getTodosByProjectId(projectId) {
    const projectIndex = this._findProjectIndex(projectId);
    return this.projects[projectIndex].todos;
  }

  // varius method for
  static getAllTodos() {
    const allTodos = [];
    for (const project of this.projects) {
      for (const todo of project.todos) {
        allTodos.push(todo);
      }
    }
    return allTodos;
  }

  static getTodayTodos() {
    const todayTodos = [];
    for (const project of this.projects) {
      for (const todo of project.todos) {
        if (isToday(new Date(todo.dueDate))) {
          todayTodos.push(todo);
        }
      }
    }

    return todayTodos;
  }

  static getTodosForWeek() {
    const weekTodos = [];
    for (const project of this.projects) {
      for (const todo of project.todos) {
        if (isThisWeek(new Date(todo.dueDate))) {
          weekTodos.push(todo);
        }
      }
    }
    return weekTodos;
  }

  static getUrgentTodos() {
    const urgentTodos = [];
    for (const project of this.projects) {
      for (const todo of project.todos) {
        if (todo.priority === 'high') {
          urgentTodos.push(todo);
        }
      }
    }
    return urgentTodos;
  }

  static getCompletedTodos() {
    const completedTodos = [];
    for (const project of this.projects) {
      for (const todo of project.todos) {
        if (todo.completed) {
          completedTodos.push(todo);
        }
      }
    }
    return completedTodos;
  }

  static toggleCompelteTodo(todoId) {
    const projectIndex =
      this._findProjectIndexAndTodoIndex(todoId).projectIndex;
    const todoIndex = this._findProjectIndexAndTodoIndex(todoId).todoIndex;
    this.projects[projectIndex].todos[todoIndex].toggleComplete();
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
      project.todos.forEach((todo) => {
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
