export default class Project {
  constructor(name) {
    this.name = name;
    this.id = Date.now().toString();
    this.todos = [];
  }
}
