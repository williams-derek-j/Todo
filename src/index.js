import "./style.css";
import css from "./css.js";
import { events } from "./events";
import User from "./user.js"
import createProject from "./project.js";
import render from "./screen.js";

const sidebar = document.querySelector('#sidebar');

const projects = [];
let live = [];

const user = new User("user");

const props = {
    user: 'user',
    title: 'titletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitle',
    description: 'description',
    priority: 'priority',
}
const props2 = {
    user: 'user2',
    title: 'title2',
    description: 'description2',
    priority: 'priority2',
}
const props3 = {
    user: 'user3',
    title: 'title3',
    description: 'description3',
    priority: 'priority3',
}

let test = new createProject(props);
//test.init();
let test2 = new createProject(props2);
let test3 = new createProject(props3);
// let test4 = new createProject(props);
// let test5 = new createProject(props);
// let test6 = new createProject(props);

projects.push(test, test2, test3);//, test2, test3, test4, test5, test6);
live.push(test, test2, test3);

projects.forEach((project) => { // can put this in screen.js
    const toggleContainer = document.createElement('div');

    let toggle = document.createElement('input')
    toggle.type = 'checkbox';
    toggle.checked = 'checked';
    toggle.name = `${project.title}`;
    toggle.project = project;
    toggle.addEventListener('change',(event) => {
        if (!toggle.checked) {
            live = live.filter((alive) => {
                return alive !== toggle.project;
            })
        } else {
            live.push(toggle.project);
        }
        render(live);
    })

    let label = document.createElement('label');
    label.textContent = `${project.title}`;
    css(label, {
        'htmlFor': `${project.title}`,
    })
    toggleContainer.append(label);
    toggleContainer.append(toggle);
    sidebar.appendChild(toggleContainer);
})

render(projects);

function render2() {
    render(live);
}

events.on('taskSubmitted', render2);
