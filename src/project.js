import createTask from './task.js';

export default (props) => {
    console.log(props);
    console.log(this);
    for (let key in props) {
        this[key] = props[key];
    }
    console.log(this);
    console.log(props);
    let user = props.user;
    let title = props.title;
    let date = new Date(props.date);
    let description = props.description;
    let priority = props.priority;
    let tasks;
    (props.tasks === true) ? tasks = props.tasks : tasks = [createTask({user: 'user'})];

    function newTask(props) {
        if (props.title) {
            let task = createTask(props);
            tasks.push(task);
        } else {
            let task = createTask();
            tasks.push(task);
        }
    }

    function removeTask(task) {
        //
    }

    function getAllTasks() {
        return tasks;
    }

    function getTask(task) {
        return tasks[task];
    }

    return {
        getAllTasks
    }
}