import clear from "./clear.js";
import css from "./css.js";
import { projects } from "./index.js";
import { events } from "./events.js";
import { taskProperties } from "./taskProperties.js";

const content = document.querySelector('#content');

function renderTask(project, task) {
    const projectRender = project.render;

    const taskRender = document.createElement('div');
    taskRender.classList.add('task');
    task.setRender(taskRender, projectRender);

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

    miniContainer.append(document.createElement('span').textContent = task.title);

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
            task.render.querySelector('.maxContainer').remove();
        }
    })
    miniContainer.append(buttonExpand);
    taskRender.append(miniContainer);

    return(taskRender);
}

function renderAllTasks(project) {
    const projectRender = project.render;
    clear(projectRender.getElementsByClassName('tasksContainer')) // don't understand why this works, doesn't exist the first time this is run

    const tasksContainer = document.createElement('div');
    tasksContainer.classList.add('tasksContainer');

    const tasks = project.getAllTasks();
    tasks.forEach((task) => {

        const taskRender = renderTask(project, task);

        tasksContainer.append(taskRender);
    })
    return(tasksContainer);
}

function renderCreateTask(project) {
    const projectRender = project.render;

    const createTaskContainer = document.createElement('div');
    createTaskContainer.classList.add('createTaskContainer');

    taskProperties.forEach((property) => {
        const container = document.createElement('div');

        const label = document.createElement('label');
        label.setAttribute('for', 'prop');
        label.textContent = `${property}:`.toUpperCase();

        const prop = document.createElement(`input`);
        prop.setAttribute('type', 'text');
        prop.classList.add(`${property}`.toUpperCase());

        container.append(label, prop);
        createTaskContainer.append(container);
    })

    const buttonSubmit = document.createElement('button');
    buttonSubmit.textContent = "Submit";
    css(buttonSubmit, {
        'align-self': 'stretch',
    })
    buttonSubmit.addEventListener('click', (event) => {
        const data = {}
        const inputs = projectRender.querySelectorAll('input');
        inputs.forEach((input) => {
            data[`${input.className}`.toLowerCase()] = input.value;
        })
        const task = project.createTask(data.user, data.title, data);
        //const taskRender = renderTask(project, task);
        //render(project);
        events.emit('taskSubmitted', data);
    })
    createTaskContainer.append(buttonSubmit);

    return(createTaskContainer);
}

export default function render(projects) {
    clear(content);

    projects.forEach((project) => {
        const projectRender = document.createElement('div');
        projectRender.classList.add('project');
        project.setRender(projectRender);

        const tasksContainer = renderAllTasks(project);
        projectRender.appendChild(tasksContainer);

        const createTaskRender = renderCreateTask(project);
        projectRender.appendChild(createTaskRender);

        document.querySelector('#content').appendChild(projectRender);
    });
}
