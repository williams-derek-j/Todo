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
        let task = new Task(user, title, props);

        this.tasks.push(task);

        //events.emit('taskCreated', task);
        return(task);
    }

    deleteTask(taskDeleted) {
        if (taskDeleted.parentNode.parentNode === this.render) { // should probably remove this, no longer serves a purpose and introduces point of failure if the dom hierarchy changes
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
}