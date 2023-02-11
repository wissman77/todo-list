export default class ProjectManager {
  static projects = [];

  static addProject(project) {
    this.projects.push(project);
  }

  static removeProject(projectId) {
    const projectIndex = this.projects.findIndex(
      (project) => project.id === projectId
    );
    this.projects.splice(projectIndex, 1);
  }

  static findProject(projectId) {
    const projectIndex = this.projects.findIndex(
      (project) => project.id === projectId
    );
    return this.projects[projectIndex];
  }
}
