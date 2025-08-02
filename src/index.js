import "./style.css";
import { events } from "./events";
import User from "./user.js"
import createProject from "./project.js";
import render from "./screen.js";

const projects = [];

const user = new User("user");

const props = {
    user: 'user',
    title: 'title',
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
let test3 = new createProject(props2);
// let test4 = new createProject(props);
// let test5 = new createProject(props);
// let test6 = new createProject(props);
//console.log(test);
projects.push(test, test2, test3);//, test2, test3, test4, test5, test6);

render(projects);
