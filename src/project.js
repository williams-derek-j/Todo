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

        //this.ID = makeID(12);

        this.tasks = [];
        for (let key in props) {
            this[key] = props[key];
        }

        // let test = new Task('user','title',props);
        // let test2 = new Task('user2','title2',props);
        // let test3 = new Task('user3','title3',props);
        // this.tasks.push(test, test2, test3);
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
        console.log(task);

        this.tasks.push(task);

        return(task);
    }

    deleteTask(deleted) {
        this.tasks = this.tasks.filter((task) => {
            return task !== deleted;
        })
    }

    addTask(task) {
        task.parent = this;
        this.tasks.push(task);
    }

    getAllTasks() {
        return this.tasks;
    }

    getTask(task) {
        return this.tasks[task];
    }
}