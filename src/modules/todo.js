export default class Todo {
  constructor(title, dueDate, description, priority) {
    this.title = title;
    this.dueDate = dueDate;
    this.description = description;
    this.priority = priority;
    this.completed = false;
    this.id = Date.now().toString();
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  update(newTitle, newDueDate, newDescription, newPriority) {
    this.title = newTitle;
    this.dueDate = newDueDate;
    this.description - newDescription;
    this.priority = newPriority;
  }
}
