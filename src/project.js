import Task from './task.js';
import { events } from './events.js';

export default class Project {
    constructor(user, title, props) {
        this.user = user;
        this.title = title;
        this.date;
        this.description;
        this.priority;
        this.index;
        this.tasks = [];
        for (let key in props) {
            this[key] = props[key];
        }
        let test = new Task('user','title',props);
        let test2 = new Task('user2','title2',props);
        let test3 = new Task('user3','title3',props);
        this.tasks.push(test, test2, test3);
    }
    setRender(render) {
        this.render = render;

        //events.on('taskDeleted', this.deleteTask.bind(this));
    }
    createTask(user, title, props) {
        console.log(user, title)
        let task = new Task(user, title, props);
        this.tasks.push(task);
        //events.emit('taskCreated', task);
        return(task);
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