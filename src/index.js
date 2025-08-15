import "./style.css";
import { events } from "./events.js";
import clear from "./clear.js";
import sort from "./sort.js";
import User from "./user.js"
import Project from "./project.js";
import { renderNav, renderTask, renderAllTasks, renderProject, refreshProjects, renderCreateUser } from "./screen.js";
import { taskMethods } from "./taskMethods.js";
import { projectMethods } from "./projectMethods.js";
import { userMethods } from "./userMethods.js";

let user;
let live;

renderCreateUser(document.querySelector('#sidebar'));

function taskSubmitted(submitted) {
    console.log("taskSubmitted", submitted);

    const task = submitted.parentObj.createTask(submitted.data.user, submitted.data);

    localStorage.setItem(user.name, user.toJSONString());

    renderTask(task, task.parent.render.querySelector('.tasksContainer'))
}

function taskDeleted(task) {
    console.log("taskDeleted", task);

    task.parent.deleteTask(task);

    localStorage.setItem(user.name, user.toJSONString());
}

function taskEdited(edited) {
    console.log("taskEdited", edited);

    edited.task.editDetail(edited.detailRender);

    localStorage.setItem(user.name, user.toJSONString());
}

function taskTransferred(transferred) {
    console.log("taskTransferred", transferred);

    let created = transferred.targetObj.createTask(transferred.task.user, transferred.task.getDetails());

    localStorage.setItem(user.name, user.toJSONString());

    renderTask(created, transferred.targetObj.render.querySelector('.tasksContainer'));
}

function tasksSorted(emitted) {
    console.log("tasksSorted", emitted);

    const sortBy = emitted.event.target.value;
    let tasks = emitted.project.getAllTasks();

    tasks = sort(tasks, sortBy);
    emitted.project.tasks = tasks;

    renderAllTasks(emitted.project, emitted.project.render);
}

function projectSubmitted(submitted) {
    console.log("projectSubmitted", submitted);

    const created = new Project(submitted.user, submitted);
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
            if (!Array.isArray(projectsParsed)) {   // parsing a stringified list with one (1) stringified object seems to return the parsed object by itself rather than a parsed list containing stringified object
                const temp = projectsParsed;
                projectsParsed = [].push(temp);
            }
            user.projects = [];

            projectsParsed.forEach((project) => {
                if (typeof project === 'string') {
                    project = JSON.parse(project); // comment below won't make sense now that I've added this line to check if project is parsed already
                }

                let tasksParsed = JSON.parse(project.tasks);
                if (!Array.isArray(tasksParsed)) { // parsing a stringified list with one (1) stringified object seems to return the parsed object by itself rather than a parsed list containing stringified object
                    const temp = tasksParsed;
                    tasksParsed = []
                    tasksParsed.push(temp); // [].push(temp) didn't work here
                }
                project.tasks = [];

                tasksParsed.forEach((task) => {
                    if (typeof task === 'string') { // check if task is parsed already -- idk why, parsing is weird and I don't understand how/why its output varies -- presumably when parsing a lit w/ one stringified object, the object gets extracted and parsed by itself rather than just the array containing it, and then I push it into a new temp array that replaces the parsed array -- but if this is the case, why is projectsParsed above different?
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

    live = user.projects;

    refreshProjects(user.projects);
    renderNav(user.projects, live);
}

function userDeleted(username) {
    console.log('userDeleted', username);

    if (user.name === username) {
        user = '';
        live = [];

        clear(sidebar);
        clear(content);

        renderCreateUser(sidebar);
    }
}

events.on('taskSubmitted', taskSubmitted);
events.on('taskDeleted', taskDeleted);
events.on('taskEdited', taskEdited);
events.on('taskTransferred', taskTransferred);
events.on('tasksSorted', tasksSorted);
events.on('projectSubmitted', projectSubmitted);
events.on('projectToggledOn', projectToggledOn);
events.on('projectToggledOff', projectToggledOff);
events.on('projectDeleted', projectDeleted);
events.on('userSubmitted', userSubmitted);
events.on('userDeleted', userDeleted);
