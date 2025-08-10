import Task from './task.js';
import makeID from './makeID.js';

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
    }

    // toJSONString() {
    //     const nonCircular = this;
    //
    //     nonCircular.tasks = JSON.stringify(this.tasks)
    //
    //     return nonCircular;
    // }

    setRender(render) {
        this.render = render;
    }

    createTask(user, title, props) {
        let task = new Task(user, title, this, props);

        this.tasks.push(task);

        return(task);
    }

    deleteTask(deleted) {
        this.tasks = this.tasks.filter((task) => {
            return task !== deleted;
        })
    }

    getAllTasks() {
        return this.tasks;
    }
}