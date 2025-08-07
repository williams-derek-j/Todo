import clear from "./clear.js";
import css from "./css.js";
import makeID from "./makeID.js";
import { events } from "./events.js";
import { taskProperties } from "./taskProperties.js";

// functions here should only call each other in one direction, i.e., like they're called in index.js, so all can be exported and used individually if needed without re-rendering whole content/sidebar divs
// emit events and let index.js come back here to call the appropriate render function

// Also don't want to generate backend data here, i.e., don't want to call User, Task, Project classes here instead of in index.js (or in the classes themselves, e.g., Project creates a new Task)

const content = document.querySelector('#content');
const sidebar = document.querySelector('#sidebar');

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
        prop.classList.add(`${property}`.toLowerCase());

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

        let valid = true;
        const inputs = projectRender.querySelectorAll('input');
        inputs.forEach((input) => {
            if (input.value !== "") {
                if (input.className.includes('error')) {
                    input.classList.toggle('error');
                }

                data[`${input.className}`.toLowerCase()] = input.value;
            } else {
                if (!input.className.includes('error')) {
                    input.classList.toggle('error')
                }

                valid = false;
            }
        })

        if (valid) {
            console.log('taskEmitted');
            const emitted = {};
            emitted['parent'] = project;
            emitted['data'] = data;

            events.emit('taskSubmitted', emitted);
        }
    })
    createTaskContainer.append(buttonSubmit);

    project.render.appendChild(createTaskContainer);
    //return(createTaskContainer);
}

function renderCreateProject(container) {
    const createProjectContainer = document.createElement("div");
    createProjectContainer.classList.add('createProjectContainer');

    const header = document.createElement('span');
    header.textContent = 'New Project:';
    createProjectContainer.append(header);

    taskProperties.forEach((property) => {
        const container = document.createElement('div');

        const label = document.createElement('label');
        label.setAttribute('for', 'prop');
        label.textContent = `${property}:`.toUpperCase();

        const prop = document.createElement(`input`);
        prop.setAttribute('type', 'text');
        prop.classList.add(`${property}`.toUpperCase());

        container.append(label, prop);
        createProjectContainer.append(container);
    })

    const buttonSubmit = document.createElement('button');
    buttonSubmit.textContent = "Submit";
    css(buttonSubmit, {
        'align-self': 'stretch',
    })
    buttonSubmit.addEventListener('click', (event) => {
        const data = {}

        const inputs = sidebar.querySelector('.createProjectContainer').querySelectorAll('input');
        inputs.forEach((input) => {
            data[`${input.className}`.toLowerCase()] = input.value;
        })

        events.emit('projectSubmitted', data);
    })
    createProjectContainer.append(buttonSubmit);

    container.append(createProjectContainer);
    //return(createProjectContainer);
}

export function renderNav(projects, live) {
    const togglesOld = Array.from(sidebar.querySelectorAll('input')).filter((node) => {
        return node.type === 'checkbox';
    })
    const togglesOldOff = togglesOld.filter((toggle) => {
        return toggle.checked === false;
    })
    clear(sidebar);

    const projectsContainer = document.createElement("div");
    projectsContainer.classList.add('projectsContainer');

    projects.forEach((project) => {
        const toggleContainer = document.createElement('div');

        let toggle = document.createElement('input')
        toggle.type = 'checkbox';
        toggle.checked = 'checked';
        toggle.name = `${project.title}`;
        toggle.project = project;

        let test;
        togglesOldOff.forEach((oldOff) => {
            if (toggle.project.ID === oldOff.project.ID) {
                toggle.checked = false;

                console.log('oldsVV')
                console.log(live);
                // live = live.filter((alive) => {
                //     return alive !== toggle.project;
                // })
                console.log(live);
                console.log('olds^^')
            }
        })

        toggle.addEventListener('change',(event) => {
            if (!toggle.checked) { // this could just remove the project node from the content container rather than returning modified live array, but the else statement would have to include logic for rendering a new project and splicing it in correct position, requiring renderProject
                console.log('changeVV')
                console.log(live);
                live = live.filter((alive) => {
                    return alive !== toggle.project;
                })
                console.log(live);
                console.log('change^^^')
            } else {
                //live.push(toggle.project);
                live.splice(project.index, 0, project); // live will get re-rendered when event is emitted, bc index.js is listening and will call screen
            }
            //render(live);
            events.emit('projectToggled', live);
        })

        let label = document.createElement('label');
        label.textContent = `${project.title}`;
        css(label, {
            'htmlFor': `${project.title}`,
        })
        toggleContainer.append(label);

        toggleContainer.append(toggle);

        projectsContainer.append(toggleContainer);
    })
    sidebar.appendChild(projectsContainer);

    renderCreateProject(sidebar);

    return(live);
}

export function renderTask(task, tasksContainer) {
    const taskRender = document.createElement('div');
    taskRender.classList.add('task');
    task.setRender(taskRender);

    const miniContainer = document.createElement('div');
    miniContainer.classList.add('miniContainer');

    const buttonDel = document.createElement('button');
    buttonDel.textContent = "X";
    buttonDel.addEventListener('click',(event) => {
        const deleted = event.target.closest('.task');

        deleted.parentNode.removeChild(deleted);

        // const emitted = {}
        // emitted['project'] = project;
        // emitted['task'] = task;

        events.emit('taskDeleted', task);
    })
    miniContainer.appendChild(buttonDel);

    miniContainer.append(document.createElement('span').textContent = task.title);

    const buttonExpand = document.createElement('button');
    buttonExpand.textContent = "V";
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
                buttonEdit.addEventListener('click', (event) => {
                    const edited = event.target.closest('div');

                    const valueNew = prompt("New Value:", `${edited.firstChild.textContent}`);
                    if (valueNew !== null) {
                        edited.childNodes.forEach((child) => {
                            if (child.nodeType === Node.TEXT_NODE) {
                                child.textContent = valueNew;
                            }
                        })
                        const emitted = {}
                        emitted['task'] = task;
                        emitted['detailRender'] = edited;

                        events.emit('taskEdited', emitted);
                        //task.editDetail(edited) -- emit instead to keep this cleaner, i.e., don't edit backend from file meant to control frontend
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

    tasksContainer.append(taskRender);
    // return(taskRender);
}

export function renderAllTasks(project) {
    const tasksContainerOld = project.render.querySelector('.tasksContainer');
    clear(project.render.getElementsByClassName('tasksContainer'))

    const tasksContainerNew = document.createElement('div');
    tasksContainerNew.classList.add('tasksContainer');

    const tasks = project.getAllTasks();
    tasks.forEach((task) => {

        renderTask(task, tasksContainerNew);
        // const taskRender = renderTask(task);
        //
        // tasksContainer.append(taskRender);
    })

    if (tasksContainerOld) {
        tasksContainerOld.replaceWith(tasksContainerNew);
    } else {
        project.render.appendChild(tasksContainerNew);
    }
    //return(tasksContainer);
}

export function renderProject(project) {
    let reRender = false;
    let nextRender;

    if (project.render) {
        nextRender = project.render.parentNode.children[Number(project.index) + 1];

        project.render.remove();

        reRender = true;
    }

    const projectRender = document.createElement('div');
    projectRender.classList.add('project');
    project.setRender(projectRender);

    const buttonDel = document.createElement('button');
    buttonDel.textContent = "X";
    css(buttonDel, {
        'align-self': 'flex-end'
    })
    buttonDel.addEventListener('click',(event) => {
        const confirmed = confirm('Are you sure?')

        if (confirmed) {
            const deleted = event.target.closest('.project');
            deleted.parentNode.removeChild(deleted);

            events.emit('projectDeleted', project);
        }
    })
    projectRender.appendChild(buttonDel);

    renderAllTasks(project);
    // const tasksContainer = renderAllTasks(project);
    // projectRender.appendChild(tasksContainer);

    renderCreateTask(project);
    // const createTaskRender = renderCreateTask(project);
    // projectRender.appendChild(createTaskRender);

    if (reRender) {
        document.querySelector('#content').insertBefore(projectRender, nextRender);
    } else {
        document.querySelector('#content').appendChild(projectRender);
    }
}

export function renderAllProjects(projects) {
    projects.forEach((project) => {
        renderProject(project);
    });
}

export function refreshProjects(projects) {
    clear(content);

    projects.forEach((project) => {
        //renderProject(project); -- doesn't work, needs to have parentNode

        const projectRender = document.createElement('div');
        projectRender.classList.add('project');
        project.setRender(projectRender);

        const buttonDel = document.createElement('button');
        buttonDel.textContent = "X";
        css(buttonDel, {
            'align-self': 'flex-end'
        })
        buttonDel.addEventListener('click',(event) => {
            const confirmed = confirm('Are you sure?')

            if (confirmed) {
                const deleted = event.target.closest('.project');
                deleted.parentNode.removeChild(deleted);

                events.emit('projectDeleted', project);
            }
        })
        projectRender.appendChild(buttonDel);

        renderAllTasks(project);
        // const tasksContainer = renderAllTasks(project);
        // projectRender.appendChild(tasksContainer);

        renderCreateTask(project);
        // const createTaskRender = renderCreateTask(project);
        // projectRender.appendChild(createTaskRender);

        document.querySelector('#content').appendChild(projectRender);
    });
}
