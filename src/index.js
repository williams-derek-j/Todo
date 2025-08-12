import "./style.css";
import sort from "./sort.js";
import User from "./user.js"
import Project from "./project.js";
import { events } from "./events";
import { renderNav, renderTask, renderProject, refreshProjects, renderCreateUser } from "./screen.js";
import { taskMethods } from "./taskMethods";
import { projectMethods } from "./projectMethods.js";
import { userMethods } from "./userMethods.js";

let user;
let live;

//renderNav(projects);
renderCreateUser(document.querySelector('#sidebar'));

function taskSubmitted(emitted) {
    console.log("taskSubmitted", emitted);

    const task = emitted.parentObj.createTask(emitted.data.user, emitted.data);

    localStorage.setItem(user.name, user.toJSONString());

    renderTask(task, task.parent.render.querySelector('.tasksContainer'))
}

function taskDeleted(task) {
    console.log("taskDeleted", task);

    task.parent.deleteTask(task);

    localStorage.setItem(user.name, user.toJSONString());
}

function taskEdited(emitted) {
    console.log("taskEdited", emitted);

    emitted.task.editDetail(emitted.detailRender);

    localStorage.setItem(user.name, user.toJSONString());
}

function taskTransferred(emitted) {
    console.log("taskTransferred", emitted);

    let created = emitted.targetObj.createTask(emitted.task.user, emitted.task.getDetails());

    localStorage.setItem(user.name, user.toJSONString());

    renderTask(created, emitted.targetObj.render.querySelector('.tasksContainer'));
}

function projectSubmitted(data) {
    console.log("projectSubmitted", data);

    const created = new Project(data.user, data);
    created.index = user.projects.length;

    user.projects.push(created);
    live.push(created);

    localStorage.setItem(user.name, user.toJSONString());

    renderProject(created);
    renderNav(user.projects, live);
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

    user.projects = user.projects.filter((project) => { // DOM node for project gets deleted upon click event, & emits projectDeleted event, so now remove project on backend
        return project !== deleted;
    })
    live = live.filter((project) => {
        return project !== deleted;
    })
    user.projects.forEach((project) => {
        if (project.index > deleted.index) {
            project.index--;
        }
    })

    localStorage.setItem(user.name, user.toJSONString());

    renderNav(user.projects, live)
}

function userSubmitted(username) {
    console.log("userSubmitted", username);

    if (user) {
        if (user.name === username) {
            return;
        }
    }
    user = localStorage.getItem(username);

    if (user) {
        user = JSON.parse(user);

        if (user.projects.length > 0) {
            let projectsParsed = JSON.parse(user.projects);
            if (!Array.isArray(projectsParsed)) {   // parsing a list with one (1) stringified object seems to return the parsed object by itself rather than a parsed list containing object
                const temp = projectsParsed;
                projectsParsed = [].push(temp);
            }

            user.projects = [];

            projectsParsed.forEach((project) => {
                project = JSON.parse(project);

                let tasksParsed = JSON.parse(project.tasks);
                if (!Array.isArray(tasksParsed)) { // parsing a list with one (1) stringified object seems to return the parsed object by itself rather than a parsed list containing object
                    const temp = tasksParsed;
                    tasksParsed = []
                    tasksParsed.push(temp);
                }
                project.tasks = [];

                tasksParsed.forEach((task) => {
                    if (typeof task === 'string') { // check if tasks are parsed already
                        task = JSON.parse(task);
                    }

                    task.details = JSON.parse(task.details);

                    for (let key in taskMethods) {
                        task[`${key}`] = taskMethods[key];
                    }
                    project.tasks.push(task);
                })
                for (let key in projectMethods) {
                    project[`${key}`] = projectMethods[key];
                }

                user.projects.push(project);
            })
        }
        for (let key in userMethods) {
            user[`${key}`] = userMethods[key];
        }
        localStorage.setItem(username, user.toJSONString());

    } else {
        user = new User(username);
        localStorage.setItem(username, user.toJSONString());
    }

    live = [];

    refreshProjects(user.projects);
    renderNav(user.projects, live);
}

events.on('taskSubmitted', taskSubmitted);
events.on('taskDeleted', taskDeleted);
events.on('taskEdited', taskEdited);
events.on('taskTransferred', taskTransferred);
events.on('projectSubmitted', projectSubmitted);
events.on('projectToggledOn', projectToggledOn);
events.on('projectToggledOff', projectToggledOff);
events.on('projectDeleted', projectDeleted);
events.on('userSubmitted', userSubmitted);
