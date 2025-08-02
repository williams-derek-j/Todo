import css from "./css.js";
import { projects } from "./index.js";
import { events } from "./events.js";

export default (projects) => {
    projects.forEach((project) => {
        let projectRender = document.createElement('div');
        projectRender.classList.add('project');
        project.init(projectRender);

        let tasks = project.getAllTasks();
        tasks.forEach((task) => {
            let taskRender = document.createElement('div');
            taskRender.classList.add('task');
            task.init(taskRender, projectRender);

            let buttonDel = document.createElement('button');
            buttonDel.textContent = "X";
            css(buttonDel, {
                'margin-right': "1%",
            })
            buttonDel.addEventListener('click',(event) => {
                const deleted = event.target.closest('.task');
                project.deleteTask(deleted);
                deleted.parentNode.removeChild(deleted);
                //events.emit('taskDeleted', deleted);
            })
            taskRender.appendChild(buttonDel);

            let info = task.info();
            for (let key in info) {
                let detailRender = document.createElement('div');
                detailRender.classList.add(key);
                detailRender.textContent = info[key];

                let buttonEdit = document.createElement('button');
                buttonEdit.textContent = "E";
                css(buttonEdit, {
                    'margin-right': "1%",
                })
                buttonEdit.addEventListener('click', (event) => {
                    const edited = event.target.closest('div');
                    let valueNew = prompt("New Value:", `${edited.firstChild.textContent}`);
                    if (valueNew !== null) {
                        edited.childNodes.forEach((child) => {
                            if (child.nodeType === Node.TEXT_NODE) {
                                child.textContent = valueNew;
                            }
                        })
                        task.editTask(edited)
                        //events.emit('taskEdited', edited);
                    }
                })
                detailRender.append(buttonEdit);
                taskRender.append(detailRender)//document.createElement('div').textContent = info[key])
            }
            projectRender.appendChild(taskRender);
        })
        document.querySelector('#content').appendChild(projectRender);
    });
}
