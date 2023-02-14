export default class Project {
  constructor(name) {
    this.name = name;
    this.id = Date.now().toString();
    this.todos = [];
  }

  _findTodoIndex(todoId) {
    return this.todos.findIndex((todo) => todo.id === todoId);
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  removeTodo(todoId) {
    const index = this._findTodoIndex(todoId);
    this.todos.splice(index, 1);
  }

  searchTodo(todoId) {
    const index = this._findTodoIndex(todoId);
    if (index > -1) {
      return this.todos[index];
    }
    return null;
  }

  renderHTML() {
    const element = `
    <li>
      <a href="#" data-projectid="${
        this.id
      }"><i class="fa-solid fa-list-check"></i>&nbsp;${this.name}</a>
        ${
          this.name !== 'Demo Project'
            ? `<button class="btn"><i data-projectid="${this.id}" class="fa-solid fa-delete-left"></i></button>
              <button class="btn"><i data-projectid="${this.id}" class="fa-solid fa-pen-to-square"></i></button>`
            : ``
        }
    </li>
    `;

    return element;
  }
}
