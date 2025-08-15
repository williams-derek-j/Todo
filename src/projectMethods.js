import Task from "./task.js";

export const projectMethods = {
    toJSONString: function() {
        const nonCircular = {};

        for (let key in this) {
            if (key !== 'render' && key !== 'tasks') {
                if (typeof this[key] !== 'object' && typeof this[key] !== 'function') {
                    nonCircular[key] = `${this[key]}`;
                }
            } else if (key === 'tasks') {
                nonCircular['tasks'] = [];
                this[key].forEach((task) => {
                    nonCircular['tasks'].push(task.toJSONString());
                })
                nonCircular['tasks'] = JSON.stringify(nonCircular['tasks']);
            }
        }
        return JSON.stringify(nonCircular);
    },

    setRender: function(render) {
        this.render = render;
    },

    createTask: function(user, props) {
        let task = new Task(user, this, props);

        task.index = this.tasks.length;

        this.tasks.push(task);

        return(task);
    },

    deleteTask: function(deleted) {
        this.tasks = this.tasks.filter((task) => {
            return task !== deleted;
        })

        this.tasks.forEach((task) => {
            if (task.index > deleted.index) {
                task.index--;
            }
        })
    },

    getAllTasks: function() {
        return this.tasks;
    },
}