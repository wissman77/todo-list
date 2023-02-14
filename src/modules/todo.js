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
    // const container = document.createElement('div');
    // container.classList.add('todo-container');

    // const todoBody = document.createElement('div');
    // todoBody.classList.add('todo-body');
    // container.appendChild(todoBody);

    // const completed = this.renderCheckbox();
    // completed.addEventListener('click', () => {
    //   this.completed();
    //   this.parentElement.classList.toggle('completed');
    // });
    // todoBody.appendChild(completed);
    // if (this.completed) todoBody.classList.add('completed');

    // const titlePara = document.createElement('p');
    // titlePara.classList.add('todo-title');
    // titlePara.textContent = this.title;
    // todoBody.appendChild(titlePara);

    // const descriptionPara = document.createElement('p');
    // descriptionPara.classList.add('todo-description');
    // descriptionPara.textContent = this.description;
    // todoBody.appendChild(descriptionPara);

    // const dueDatePara = document.createElement('div');
    // dueDatePara.classList.add('todo-duedate');
    // dueDatePara.textContent = format(new Date(this.dueDate), 'dd-MM-yyyy');
    // todoBody.appendChild(dueDatePara);
    // if (isBefore(new Date(this.dueDate), endOfYesterday())) {
    //   dueDatePara.classList.add('expired');
    //   dueDatePara.textContent += ' Expired';
    // }

    // const projectNamePara = document.createElement('p');
    // projectNamePara.classList.add('todo-project-name');
    // projectNamePara.textContent = ProjectManager.getProjectName(this.id);
    // todoBody.appendChild(projectNamePara);

    // const actions = document.createElement('div');
    // actions.classList.add('actions');
    // container.appendChild(actions);

    // const priorityFlag = document.createElement('i');
    // priorityFlag.classList.add('fa-solid', 'fa-flag');
    // priorityFlag.classList.add(this.priority);
    // priorityFlag.title = this.priority;
    // actions.appendChild(priorityFlag);

    // const editTodoFlag = document.createElement('i');
    // editTodoFlag.classList.add('fa-solid', 'fa-pen-to-square');
    // editTodoFlag.setAttribute('data-todoid', this.id);
    // // editTodoFlag.addEventListener('click', () => {
    // //   enterEditTodoMode(todo.id, projectId);
    // //   todoModal.style.display = 'block';
    // // });
    // actions.appendChild(editTodoFlag);

    // const deleteTodoFlag = document.createElement('i');
    // deleteTodoFlag.classList.add('fa-solid', 'fa-trash', 'danger');
    // deleteTodoFlag.setAttribute('data-todoid', this.id);
    // // deleteTodoFlag.addEventListener(
    // //   'click',
    // //   deleteTodo.bind(this, todo.id, projectId)
    // // );
    // actions.appendChild(deleteTodoFlag);

    // todosList.appendChild(container);

    // // return the container for todo object
    // return container;
  }

  renderCheckbox() {
    const checkbox = doc.createElement('input');
    checkbox.type = 'checkbox';
    if (this.completed) {
      checkbox.checked = true;
    }
    return checkbox;
  }
}
