import "./style.css";
import { events } from "./events";
import User from "./user.js"
import Project from "./project.js";
import { renderProject, renderNav, refreshProjects, renderAllTasks } from "./screen.js";

// const props = {
//     user: 'user',
//     title: 'titletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitle',
//     description: 'description',
//     priority: 'priority',
//     index: '0',
// }
// const props2 = {
//     user: 'user2',
//     title: 'title2',
//     description: 'description2',
//     priority: 'priority2',
//     index: '1',
// }
// const props3 = {
//     user: 'user3',
//     title: 'title3',
//     description: 'description3',
//     priority: 'priority3',
//     index: '2',
// }

// let test = new createProject(props.user, props.title, props);
// let test2 = new createProject(props2.user, props2.title, props2);
// let test3 = new createProject(props3.user, props3.title, props3);
//
const user = new User("user");
//
let projects = [];
let live = [];
//
// projects.push(test, test2, test3);//, test2, test3, test4, test5, test6);
// live.push(test, test2, test3);
//
live = renderNav(projects, live);
//
// renderAllProjects(projects);

function taskSubmitted(emitted) {
    emitted.parent.createTask(emitted.data.user, emitted.data.title, emitted.parent, emitted.data);

    console.log(emitted.data);
    console.log(emitted.parent);
    renderAllTasks(emitted.parent);
    // const tasksContainer = renderAllTasks(emitted.parent)
    // emitted.parent.render.append(tasksContainer);
}

function taskSubmittedError(inputNode) {

    inputNode.classList.toggle('error')
}

function taskDeleted(task) {
    task.parent.deleteTask(task);
    //emitted.project.deleteTask(emitted.task)
}

function taskEdited(emitted) {
    emitted.task.editDetail(emitted.taskRender);
}

function projectSubmitted(data) {
    const created = new Project(data.user, data.title, data);
    created.index = projects.length;

    projects.push(created);
    live.push(created);

    renderProject(created);
    renderNav(projects, live);
}

function projectToggled(live) { // project toggle (checkbox) has listener that calls function to add or remove said project from array of displayed projects, returns modified array
    refreshProjects(live);
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
events.on('taskSubmittedError', taskSubmittedError);
events.on('taskDeleted', taskDeleted);
events.on('taskEdited', taskEdited);
events.on('projectSubmitted', projectSubmitted);
events.on('projectToggled', projectToggled);
events.on('projectDeleted', projectDeleted);
