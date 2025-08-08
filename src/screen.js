import clear from "./clear.js";
import css from "./css.js";
import { events } from "./events.js";
import { taskProperties } from "./taskProperties.js";
import { taskMethods } from "./taskMethods.js";

// functions here should only call each other in one direction, i.e., like they're called in index.js, so all can be exported and used individually if needed without re-rendering whole content/sidebar divs
// emit events and let index.js come back here to call the appropriate render function

// Also don't want to generate backend data here, i.e., don't want to call User, Task, Project classes here instead of in index.js (or in the classes themselves, e.g., Project creates a new Task)

const content = document.querySelector('#content');
const sidebar = document.querySelector('#sidebar');

function renderCreateTask(project, container) { // container is project
    const createTaskContainer = document.createElement('div');
    createTaskContainer.classList.add('createTaskContainer');

    taskProperties.forEach((property) => {
        const propContainer = document.createElement('div');

        const label = document.createElement('label');
        label.setAttribute('for', 'prop');
        label.textContent = `${property}:`.toUpperCase();

        const prop = document.createElement(`input`);
        prop.setAttribute('type', 'text');
        prop.classList.add('createTask');
        prop.classList.add(`${property}`.toLowerCase());

        propContainer.append(label, prop);
        createTaskContainer.append(propContainer);
    })

    const buttonSubmit = document.createElement('button');
    buttonSubmit.textContent = "Submit";
    buttonSubmit.addEventListener('click', (event) => {
        const data = {}

        let valid = true;
        const inputs = container.querySelectorAll('input.createTask');
        inputs.forEach((input) => {
            if (input.value !== "") {
                if (input.className.includes('error')) {
                    input.classList.toggle('error');
                }

                const inputClassNameTaskProperty = input.className.replace('createTask ', '');
                data[`${inputClassNameTaskProperty}`.toLowerCase()] = input.value;
            } else {
                if (!input.className.includes('error')) {
                    input.classList.toggle('error')
                }

                valid = false;
            }
        })

        if (valid) {
            const emitted = {};
            emitted['parentObj'] = project;
            emitted['data'] = data;

            events.emit('taskSubmitted', emitted);
        }
    })
    createTaskContainer.append(buttonSubmit);

    container.appendChild(createTaskContainer);
    //return(createTaskContainer);
}

function renderCreateProject(container) {
    const createProjectContainer = document.createElement("div");
    createProjectContainer.classList.add('createProjectContainer');

    const header = document.createElement('span');
    header.textContent = 'New Project:';
    createProjectContainer.append(header);

    taskProperties.forEach((property) => {
        const detailInputContainer = document.createElement('div');

        const label = document.createElement('label');
        label.setAttribute('for', 'detailInput');
        label.textContent = `${property}:`.toUpperCase();

        const detailInput = document.createElement(`input`);
        detailInput.setAttribute('type', 'text');
        detailInput.classList.add(`${property}`.toUpperCase());

        detailInputContainer.append(label, detailInput);
        createProjectContainer.append(detailInputContainer);
    })

    const buttonSubmit = document.createElement('button');
    buttonSubmit.textContent = "Submit";
    buttonSubmit.addEventListener('click', (event) => {
        const data = {}

        const inputs = container.querySelector('.createProjectContainer').querySelectorAll('input');
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
        toggle.checked = true;
        toggle.name = `${project.title}`;
        toggle.project = project;

        togglesOldOff.forEach((oldOff) => {
            if (toggle.project === oldOff.project) { // check if i dont need ID
                toggle.checked = false;
            }
        })

        toggle.addEventListener('change',(event) => {
            if (!toggle.checked) {
                project.render.remove();

                events.emit('projectToggledOff', project);
            } else {
                events.emit('projectToggledOn', project)

                renderProject(project, live); // needs to come after event so live can update and renderProject can use live to correctly position new render
            }
        })

        let label = document.createElement('label');
        label.textContent = `${project.title}`;
        label.htmlFor = `${project.title}`;
        toggleContainer.append(label);

        toggleContainer.append(toggle);

        projectsContainer.append(toggleContainer);
    })
    sidebar.appendChild(projectsContainer);

    renderCreateProject(sidebar);
}

export function renderTask(task, tasksContainer) {
    const taskRender = document.createElement('div');
    taskRender.classList.add('task');
    taskRender.setAttribute('draggable', 'true');
    task.setRender(taskRender);

    const miniContainer = document.createElement('div');
    miniContainer.classList.add('miniContainer');

    const buttonDel = document.createElement('button');
    buttonDel.textContent = "X";
    buttonDel.addEventListener('click',(event) => {
        const deleted = event.target.closest('.task');

        deleted.parentNode.removeChild(deleted);

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

    taskRender.addEventListener('dragstart', (event) => {

        let taskNonCircular = task.toJSONString();

        event.dataTransfer.clearData('text');
        event.dataTransfer.setData('text', `${taskNonCircular}`)
    })

    tasksContainer.append(taskRender);
    // return(taskRender);
}

export function renderAllTasks(project, container) {
    const tasksContainerOld = container.querySelector('.tasksContainer');
    clear(container.getElementsByClassName('tasksContainer'))

    const tasksContainerNew = document.createElement('div');
    tasksContainerNew.classList.add('tasksContainer');

    const tasks = project.getAllTasks();
    tasks.forEach((task) => {

        renderTask(task, tasksContainerNew);
    })

    if (tasksContainerOld) {
        tasksContainerOld.replaceWith(tasksContainerNew);
    } else {
        container.appendChild(tasksContainerNew);
    }
}

export function renderProject(project, live) {
    let reRender = false;
    let nextRender;

    if (project.render) {
        if (project.render.parentNode) {
            nextRender = project.render.parentNode.children[Number(project.index) + 1];

            project.render.remove();

            reRender = true;
        } else { // for projects that were toggled back on
            for (let i = 0; i < live.length; i++) {
                if (live[i] === project) {
                    if (live[i + 1]) {
                        nextRender = live[i + 1].render;

                        reRender = true;
                    }
                }
            }
        }
    }

    const projectRender = document.createElement('div');
    projectRender.classList.add('project');
    project.setRender(projectRender);

    const buttonDel = document.createElement('button');
    buttonDel.textContent = "X";
    buttonDel.addEventListener('click',(event) => {
        const confirmed = confirm('Are you sure?')

        if (confirmed) {
            const deleted = event.target.closest('.project');
            deleted.parentNode.removeChild(deleted);

            events.emit('projectDeleted', project);
        }
    })
    projectRender.appendChild(buttonDel);

    renderAllTasks(project, projectRender);

    renderCreateTask(project, projectRender);

    projectRender.addEventListener('dragover', (event) => {
        event.preventDefault();
    })

    projectRender.addEventListener('drop', (event) => {
        event.preventDefault();

        let dropped = JSON.parse(event.dataTransfer.getData('text'));
        console.log(dropped);
        console.log(dropped.details);
        dropped.details = JSON.parse(dropped.details);
        console.log(dropped.details);
        //event.dataTransfer.clearData('text');

        for (let key in taskMethods) {
            dropped[`${key}`] = taskMethods[key];
        }
        dropped.setParent(project);
        dropped.parent = (project);
        console.log('droppedV')
        console.log(dropped);
        console.log('dropped^')

        let emitted = {
            task: dropped,
            targetObj: project,
        }
        events.emit('taskTransferred', emitted);
    })

    if (reRender) {
        content.insertBefore(projectRender, nextRender);
    } else {
        content.appendChild(projectRender);
    }
}

export function renderAllProjects(projects) {
    projects.forEach((project) => {
        renderProject(project);
    });
}

export function refreshProjects(projects) {
    clear(content);

    renderAllProjects(projects);

    // projects.forEach((project) => {
    //     //renderProject(project); -- doesn't work, needs to have parentNode
    //
    //     const projectRender = document.createElement('div');
    //     projectRender.classList.add('project');
    //     project.setRender(projectRender);
    //
    //     const buttonDel = document.createElement('button');
    //     buttonDel.textContent = "X";
    //     css(buttonDel, {
    //         'align-self': 'flex-end'
    //     })
    //     buttonDel.addEventListener('click',(event) => {
    //         const confirmed = confirm('Are you sure?')
    //
    //         if (confirmed) {
    //             const deleted = event.target.closest('.project');
    //             deleted.parentNode.removeChild(deleted);
    //
    //             events.emit('projectDeleted', project);
    //         }
    //     })
    //     projectRender.appendChild(buttonDel);
    //
    //     renderAllTasks(project);
    //     // const tasksContainer = renderAllTasks(project);
    //     // projectRender.appendChild(tasksContainer);
    //
    //     renderCreateTask(project);
    //     // const createTaskRender = renderCreateTask(project);
    //     // projectRender.appendChild(createTaskRender);
    //
    //     document.querySelector('#content').appendChild(projectRender);
    // });
}
