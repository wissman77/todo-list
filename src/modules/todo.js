import { endOfYesterday, format, isBefore } from 'date-fns';
import ProjectManager from './projects-manager';

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

  renderHTML() {
    const element = `
    <div class="todo-container">
      <div class="todo-body ${this.completed ? `completed"` : ``}">
        <input type="checkbox" ${
          this.completed ? `checked` : ``
        } data-todoid="${this.id}" />
        <p class="todo-title">${this.title}</p>
        <p class="todo-description">${this.description}</p>
        <div class="todo-duedate ${format(new Date(this.dueDate), 'dd-MM-yyyy')}
          ${
            isBefore(new Date(this.dueDate), endOfYesterday()) ? `expired` : ``
          }">
          ${format(new Date(this.dueDate), 'dd-MM-yyyy')}
          ${
            isBefore(new Date(this.dueDate), endOfYesterday()) ? ` Expired` : ``
          }
        </div>
        <p class="todo-project-name">${ProjectManager.getProjectName(
          this.id
        )}</p>
      </div>
      <div class="actions">
        <i class="fa-solid fa-flag ${this.priority}" title="${
      this.priority
    }"></i>
        <i class="fa-solid fa-pen-to-square" data-todoid="${this.id}"></i>
        <i class="fa-solid fa-trash danger" data-todoid="${this.id}"></i>
      </div>
    </div>
    `;

    return element;
  }
}
