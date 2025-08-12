import { taskMethods } from './taskMethods';
import { taskProperties } from './taskProperties';

export default class Task {
    constructor(user, parent, props) {

        for (let medium in taskProperties) {
            if (medium === 'input' || medium === 'select') {
                for (let type in taskProperties[medium]) {
                    taskProperties[medium][type].forEach((property) => {
                        this[property];
                    })
                }
            }
        }

        this.user = user;
        this.parent = parent;
        this.index;

        this.details = {};
        for (let key in props) {
            if (!((key === 'user') || (key === 'parent'))) {
                if (key === 'due') {
                    this.details[key] = new Date(props[key]);
                } else {
                    this.details[key] = props[key];
                }
            }
        }
        console.log(this.details);

        for (let key in taskMethods) {
            this[key] = taskMethods[key];
        }
    }

    // toJSONString() {
    //     let nonCircular = {};
    //
    //     for (let key in this) {
    //         if (key !== 'parent' && key !== 'render' && key !== 'details') {
    //             nonCircular[key] = `${this[key]}`;
    //         } else if (key === 'details') {
    //             nonCircular['details'] = JSON.stringify(this['details']);
    //         }
    //     }
    //     return JSON.stringify(nonCircular);
    // }
    //
    // setParent(parentNew) {
    //     this.parent = parentNew;
    // }
    //
    // getParent() {
    //     return this.parent;
    // }
    //
    // setRender(render, parentRender) {
    //     this.render = render;
    // }
    //
    // getDetails() {
    //     let detailsFiltered = {};
    //
    //     for (let key in this.details) {
    //         if (typeof this.details[key] !== 'object') {
    //             detailsFiltered[key] = this.details[key];
    //         }
    //     }
    //     return (detailsFiltered);
    // }
    //
    // editDetail(detailEdited) {
    //     for (let key in this.details) {
    //         if (key === detailEdited.className) {
    //             this.details[key] = detailEdited.firstChild.textContent;
    //             //console.log(this.details[key]);
    //         }
    //     }
    // }

    // function createSubTask(props) {
    //
    // }
    //
    // function removeSubTask(subTask) {
    //
    // }
}