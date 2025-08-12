import "./style.css";
import sort from "./sort.js";
import User from "./user.js"
import Project from "./project.js";
import { events } from "./events";
import { renderNav, renderProject, renderTask } from "./screen.js";

const user = new User("user");

let projects = [];
let live = [];

renderNav(projects);

function taskSubmitted(emitted) {
    console.log("taskSubmitted", emitted);

    const task = emitted.parentObj.createTask(emitted.data.user, emitted.data);

    renderTask(task, task.parent.render.querySelector('.tasksContainer'))
}

function taskDeleted(task) {
    console.log("taskDeleted", task);

    task.parent.deleteTask(task);
}

function taskEdited(emitted) {
    console.log("taskEdited", emitted);

    emitted.task.editDetail(emitted.detailRender);
}

function taskTransferred(emitted) {
    console.log("taskTransferred", emitted);

    let created = emitted.targetObj.createTask(emitted.task.user, emitted.task.getDetails());

    renderTask(created, emitted.targetObj.render.querySelector('.tasksContainer'));
}

function projectSubmitted(data) {
    console.log("projectSubmitted", data);

    const created = new Project(data.user, data);
    created.index = projects.length;

    projects.push(created);
    live.push(created);

    renderProject(created);
    renderNav(projects, live);
}

function projectToggledOn(toggled) {
    console.log("projectToggledOn ", toggled);

    live.splice(toggled.index, 0, toggled);
    live = sort(live, 'index');

    renderProject(toggled, live);
}

function projectToggledOff(toggled) {
    console.log("projectToggledOff", toggled);
    // project.render.remove();

    live = live.filter((project) => {
        return project !== toggled;
    })
}

function projectDeleted(deleted) {
    console.log("projectDeleted", deleted);

    projects = projects.filter((project) => { // DOM node for project gets deleted upon click event, & emits projectDeleted event, so now remove project on backend
        return project !== deleted;
    })
    live = live.filter((project) => {
        return project !== deleted;
    })
    projects.forEach((project) => {
        if (project.index > deleted.index) {
            project.index--;
        }
    })

    renderNav(projects, live)
}

events.on('taskSubmitted', taskSubmitted);
events.on('taskDeleted', taskDeleted);
events.on('taskEdited', taskEdited);
events.on('taskTransferred', taskTransferred);
events.on('projectSubmitted', projectSubmitted);
events.on('projectToggledOn', projectToggledOn);
events.on('projectToggledOff', projectToggledOff);
events.on('projectDeleted', projectDeleted);
