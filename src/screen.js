import clear from "./clear.js";
import css from "./css.js";
import { projects } from "./index.js";
import { events } from "./events.js";

export default (projects) => {
    projects.forEach((project) => {
        const projectRender = document.createElement('div');
        projectRender.classList.add('project');
        project.init(projectRender);

        const tasks = project.getAllTasks();
        tasks.forEach((task) => {
            const taskRender = document.createElement('div');
            taskRender.classList.add('task');
            task.init(taskRender, projectRender);

            const miniContainer = document.createElement('div');
            miniContainer.classList.add('miniContainer');

            const buttonDel = document.createElement('button');
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
            miniContainer.appendChild(buttonDel);

            // const info = task.info();
            // for (let key in info) {
            //     const detailRender = document.createElement('div');
            //     detailRender.classList.add(key);
            //     detailRender.textContent = info[key];
            //
            //     const buttonEdit = document.createElement('button');
            //     buttonEdit.textContent = "E";
            //     css(buttonEdit, {
            //         'margin-left': "1%",
            //     })
            //     buttonEdit.addEventListener('click', (event) => {
            //         const edited = event.target.closest('div');
            //         const valueNew = prompt("New Value:", `${edited.firstChild.textContent}`);
            //         if (valueNew !== null) {
            //             edited.childNodes.forEach((child) => {
            //                 if (child.nodeType === Node.TEXT_NODE) {
            //                     child.textContent = valueNew;
            //                 }
            //             })
            //             task.editDetail(edited)
            //             //events.emit('taskEdited', edited);
            //         }
            //     })
            //     detailRender.append(buttonEdit);
            //     taskRender.append(detailRender)document.createElement('div').textContent = info[key])
            // }

            // const miniContainer = document.createElement('div');
            // miniContainer.classList.add('miniContainer');
            miniContainer.append(document.createElement('span').textContent= task.title);
            // taskRender.append(miniContainer);

            //const buttonTitleEdit

            const buttonExpand = document.createElement('button');
            buttonExpand.textContent = "V";
            css(buttonExpand, {
                'margin-right': "1%",
            })
            buttonExpand.addEventListener('click', (event) => {
                const expanded = event.target.closest('.task');
                expanded.classList.toggle('expanded');

                buttonExpand.textContent === "V" ? buttonExpand.textContent = "^" : buttonExpand.textContent = "V";

                if (expanded.className.includes('expanded')) {
                    const maxContainer = document.createElement('div');
                    maxContainer.classList.add('maxContainer');

                    const info = task.getDetails();
                    for (let key in info) {
                        const detailRender = document.createElement('div');
                        detailRender.classList.add(key);
                        detailRender.textContent = info[key];

                        const buttonEdit = document.createElement('button');
                        buttonEdit.textContent = "E";
                        css(buttonEdit, {
                            'margin-left': "1%",
                        })
                        buttonEdit.addEventListener('click', (event) => {
                            const edited = event.target.closest('div');
                            const valueNew = prompt("New Value:", `${edited.firstChild.textContent}`);
                            if (valueNew !== null) {
                                edited.childNodes.forEach((child) => {
                                    if (child.nodeType === Node.TEXT_NODE) {
                                        child.textContent = valueNew;
                                    }
                                })
                                task.editDetail(edited)
                                //events.emit('taskEdited', edited);
                            }
                        })
                        detailRender.append(buttonEdit);
                        maxContainer.append(detailRender)//document.createElement('div').textContent = info[key])
                    }
                    taskRender.append(maxContainer);
                } else {
                    console.log(task.render);
                    task.render.querySelector('.maxContainer').remove();
                    //clear(task.querySelector('.maxContainer'));
                }
            })
            miniContainer.append(buttonExpand);
            taskRender.append(miniContainer);

            projectRender.appendChild(taskRender);
        })
        document.querySelector('#content').appendChild(projectRender);
    });
}
