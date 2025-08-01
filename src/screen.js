//import projects from "./index.js";

export default (projects) => {
    console.log(projects);
    projects.forEach((project) => {
        let projectRender = document.createElement('div');

        let tasks = project.getAllTasks();
        tasks.forEach((task) => {
            let taskRender = document.createElement('div');

            let info = task.info();
            console.log(info);
            for (let key in info) {
                taskRender.append(document.createElement('div').textContent = info[key])
            }
            projectRender.appendChild(taskRender);
        })
        document.querySelector('#content').appendChild(projectRender);
    });
}
