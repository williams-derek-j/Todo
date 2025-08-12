import Task from './task.js';
import makeID from './makeID.js';

export default class Project {
    constructor(user, props) {
        this.user = user;

        this.title;
        this.description;
        this.due;
        this.priority;

        this.index;

        this.tasks = [];

        for (let key in props) {
            if (!(key === 'user')) {
                if (key === 'due') {
                    this[key] = new Date(props[key].value);
                } else {
                    this[key] = props[key];
                }
            }
        }
    }

    projectProperties = {
        'input': {
            'text': ['title','description'],
            'date': ['due'],
        },
        'select': {
            'priority': ['highest','high','medium','low','lowest'],
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

    createTask(user, props) {
        let task = new Task(user, this, props);

        task.index = this.tasks.length;

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