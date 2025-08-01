import "./style.css";
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

let test = createProject(props);
//console.log(test);
projects.push(test);

render(projects);
