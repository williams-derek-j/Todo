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
        let test2 = new Task({user: "mike"});
        let test3 = new Task({user: "john"});
        this.tasks.push(test, test2, test3);
    }
    init(render) {
        this.render = render;

        //events.on('taskDeleted', this.deleteTask.bind(this));
    }
    newTask(props) {
        let task = createTask(props);
        this.tasks.push(task);
        events.emit('taskCreated', task);
    }
    deleteTask(taskDeleted) {
        if (taskDeleted.parentNode === this.render) {
            this.tasks = this.tasks.filter((task) => {
                return task.render !== taskDeleted;
            })
        }
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