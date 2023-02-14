import Project from './project';
import ProjectManger from './projects-manager';
import Todo from './todo';

const manageLocalStorage = (() => {
  const assignObjects = () => {
    ProjectManger.projects.forEach((project) => {
      Object.setPrototypeOf(project, Project.prototype);
      project.todos.forEach((todo) => {
        Object.setPrototypeOf(todo, Todo.prototype);
      });
    });
  };
  const saveToLocalStorage = () => {
    localStorage.setItem('projects', JSON.stringify(ProjectManger.projects));
  };

  const getProjectsFromLocalStorage = () => {
    return (ProjectManger.projects =
      JSON.parse(localStorage.getItem('projects')) || []);
  };

  const loadProjects = () => {
    if (getProjectsFromLocalStorage().length === 0) {
      const demoProject = new Project('Demo Project');
      ProjectManger.projects.push(demoProject);
      assignObjects();
      saveToLocalStorage();
    } else {
      ProjectManger.projects = getProjectsFromLocalStorage();
      assignObjects();
    }
  };

  return {
    loadProjects,
    saveToLocalStorage,
  };
})();

export default manageLocalStorage;
