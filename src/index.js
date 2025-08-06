import "./style.css";
import css from "./css.js";
import { events } from "./events";
import User from "./user.js"
import Project from "./project.js";
import createProject from "./project.js";
import { renderAllProjects, renderProject, renderNav } from "./screen.js";

const props = {
    user: 'user',
    title: 'titletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitle',
    description: 'description',
    priority: 'priority',
    index: '0',
}
const props2 = {
    user: 'user2',
    title: 'title2',
    description: 'description2',
    priority: 'priority2',
    index: '1',
}
const props3 = {
    user: 'user3',
    title: 'title3',
    description: 'description3',
    priority: 'priority3',
    index: '2',
}

let test = new createProject(props.user, props.title, props);
let test2 = new createProject(props2.user, props2.title, props2);
let test3 = new createProject(props3.user, props3.title, props3);

const user = new User("user");

const projects = [];
let live = [];

projects.push(test, test2, test3);//, test2, test3, test4, test5, test6);
live.push(test, test2, test3);

live = renderNav(projects, live);

renderAllProjects(projects);

function taskSubmitted(emitted) {
    emitted.project.createTask(emitted.data.user, emitted.data.title, emitted.data);

    renderProject(emitted.project);
}

function taskDeleted(emitted) {
    emitted.project.deleteTask(emitted.task)
}

function taskEdited(emitted) {
    emitted.task.editDetail(emitted.taskRender);
}

function projectSubmitted(data) {
    const created = new Project(data.user, data.title, data);
    created.index = projects.length;

    projects.push(created);
    live.push(created);

    renderAllProjects(live);
    renderNav(projects, live);
}

function projectToggled(live) { // project toggle (checkbox) has listener that calls function to add or remove said project from array of displayed projects, returns modified array
    renderAllProjects(live);
}

events.on('taskSubmitted', taskSubmitted);
events.on('taskDeleted', taskDeleted);
events.on('taskEdited', taskEdited);
events.on('projectSubmitted', projectSubmitted);
events.on('projectToggled', projectToggled)
