export default class Project {
  constructor(name) {
    this.name = name;
    this.id = Date.now();
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  removeTodo(todoId) {
    const todoIndex = this.todos.findIndex((todo) => todo.id === todoId);
    this.todos.splice(todoIndex, 1);
  }

  findTodo(todoId) {
    const todoIndex = this.todos.findIndex((todo) => todo.id === todoId);
    return this.todos[todoIndex];
  }
}
