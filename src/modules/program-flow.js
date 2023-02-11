import Project from './project';
import ProjectManger from './projects-manager';
import Todo from './todo';

const flow = (() => {
  const _addToLocalStorage = () => {
    localStorage.setItem('projects', JSON.stringify(ProjectManger.projects));
  };

  const _getProjectsFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('projects'));
  };

  const loadProjects = () => {
    let localProjects = JSON.parse(localStorage.getItem('projects'));
    if (!localProjects) {
      const demoProject = new Project('Demo Project');
      ProjectManger.projects.push(demoProject);
      _addToLocalStorage();
      localProjects = ProjectManger.projects;
    } else {
      ProjectManger.projects = localProjects;
    }
    return localProjects;
  };

  return {
    loadProjects,
  };
})();

export default flow;
