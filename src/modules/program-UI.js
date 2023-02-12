import programFlow from './program-flow';

const programUI = (doc) => {
  const addProjectBtn = doc.querySelector('.add-project');
  const projectModal = doc.querySelector('.project-modal');
  const addTodoBtn = doc.querySelector('.add-todo');
  const todoModal = doc.querySelector('.todo-modal');
  const todoCloseBtn = doc.querySelector('.close-todo');
  const projectCloseBtn = doc.querySelector('.project-close');
  const projectForm = doc.querySelector('#project');
  const todoForm = doc.querySelector('#todo');

  addProjectBtn.addEventListener(
    'click',
    () => (projectModal.style.display = 'block')
  );

  projectCloseBtn.addEventListener('click', () => {
    projectModal.style.display = 'none';
    projectForm.reset();
  });

  addTodoBtn.addEventListener('click', () => {
    todoModal.style.display = 'block';
  });

  todoCloseBtn.addEventListener('click', () => {
    todoModal.style.display = 'none';
    todoForm.reset();
  });
};

export default programUI;
