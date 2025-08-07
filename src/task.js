import { events } from './events';

export default class Task {
    constructor(user, title, parent, props) {
        this.user = user;
        this.title = title;
        this.parent = parent;

        // this.date;
        // this.description;
        // this.priority;

        this.details = {};
        for (let key in props) {
            if (!((key === 'user') || (key === 'title'))) {
                this.details[key] = props[key];
            }
        }
    }

    setRender(render, parentRender) {
        this.render = render;
    }

    // function createSubTask(props) {
    //     //
    // }
    //
    // function removeSubTask(subTask) {
    //     //
    // }

    getDetails() {
        let details = {};

        for (let key in this.details) {
            if (typeof this.details[key] !== 'object') {
                details[key] = this.details[key];
            }
        }
        return (details);
    }

    editDetail(detailEdited) {
        for (let key in this.details) {
            if (key === detailEdited.className) {
                this.details[key] = detailEdited.firstChild.textContent;
                //console.log(this.details[key]);
            }
        }
    }

    setRenderParent(parentNew) {
        this.renderParent = parentNew;
    }
}