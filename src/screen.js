import css from "./css.js";
//import projects from "./index.js";
import { events } from "./events.js";

export default (projects) => {
    console.log(projects);
    projects.forEach((project) => {
        let projectRender = document.createElement('div');
        projectRender.classList.add('project');

        let tasks = project.getAllTasks();
        tasks.forEach((task) => {
            let taskRender = document.createElement('div');
            taskRender.classList.add('task');

            let buttonClose = document.createElement('button');
            buttonClose.textContent = "X";
            css(buttonClose, {
                'margin-right': "1%",
            })
            buttonClose.addEventListener('click',(event) => {
                const deleted = event.target.closest('.task');
                events.emit('taskDeleted', deleted);
                deleted.parentNode.removeChild(deleted);
            })
            taskRender.appendChild(buttonClose);

            let info = task.info();
            console.log(info);
            for (let key in info) {
                let detailRender = document.createElement('div');
                detailRender.classList.add(key);
                detailRender.textContent = info[key];
                css(detailRender, {

                })
                taskRender.append(detailRender)//document.createElement('div').textContent = info[key])
            }
            projectRender.appendChild(taskRender);
        })
        document.querySelector('#content').appendChild(projectRender);
    });
}
