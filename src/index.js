import "./style.css";
import User from "./user.js"
import Project from "./project.js";
import { events } from "./events";
import { renderNav, renderProject, renderTask, renderAllTasks, refreshProjects } from "./screen.js";

const user = new User("user");

let projects = [];
let live = [];

renderNav(projects);

function taskSubmitted(emitted) {
    const task = emitted.parentObj.createTask(emitted.data.user, emitted.data.title, emitted.data);

    renderTask(task, task.parent.render.querySelector('.tasksContainer'))
}

function taskDeleted(task) {

    task.parent.deleteTask(task);
}

function taskEdited(emitted) {
    emitted.task.editDetail(emitted.detailRender);
}

function taskTransferred(emitted) {

    let created = emitted.targetObj.createTask(emitted.task.user, emitted.task.title, emitted.task.getDetails());

    renderTask(created, emitted.targetObj.render.querySelector('.tasksContainer'));
}

function projectSubmitted(data) {
    const created = new Project(data.user, data.title, data);
    created.index = projects.length;

    projects.push(created);
    live.push(created);

    renderProject(created);
    renderNav(projects, live);
}

function projectToggledOn(project) {
    live.splice(project.index, 0, project);
    live.sort((
        function(a, b) {
            if (a.index > b.index) {
                return 1;
            } else {
                return -1;
            }
        }
    ))
    renderProject(project, live);
}

function projectToggledOff(project) {
    project.render.remove();

    live = live.filter((alive) => {
        return alive !== project;
    })
}

function projectDeleted(deleted) {
    projects = projects.filter((project) => { // DOM node for project gets deleted upon click event, & emits projectDeleted event, so now remove project on backend
        return project !== deleted;
    })
    live = live.filter((project) => {
        return project !== deleted;
    })

    renderNav(projects, live) // only need to call renderNav because we are /deleting/ a project, therefore not requiring re-rendering/refreshing, unlike creating/toggling on a project
}

events.on('taskSubmitted', taskSubmitted);
events.on('taskDeleted', taskDeleted);
events.on('taskEdited', taskEdited);
events.on('taskTransferred', taskTransferred);
events.on('projectSubmitted', projectSubmitted);
events.on('projectToggledOn', projectToggledOn);
events.on('projectToggledOff', projectToggledOff);
events.on('projectDeleted', projectDeleted);
