import Task from './task.js';
import { events } from './events.js';

export default class Project {
    constructor(props) {
        this.user;
        this.title;
        this.date;
        this.description;
        this.priority;
        this.tasks = [];
        for (let key in props) {
            this[key] = props[key];
        }
        let test = new Task(props);
        this.tasks.push(test);
    }
    newTask(props) {
        let task = createTask(props);
        this.tasks.push(task);
        events.emit('taskCreated', task);
    }
    deleteTask(task) {
        console.log(task);
    }
    getAllTasks() {
        return this.tasks;
    }
    getTask(task) {
        return this.tasks[task];
    }

    // return {
    //     // user: user,
    //     // title: title,
    //     // date: date,
    //     // description: description,
    //     // priority: priority,
    //     // tasks: tasks,
    //     getAllTasks: getAllTasks,
    // }
}