import { events } from './events';

export default class Task {
    constructor(user, title, parent, props) {
        this.user = user;
        this.title = title;
        this.parent = parent;

        this.index;
        // this.date;
        // this.description;
        // this.priority;

        this.details = {};
        for (let key in props) {
            if (!((key === 'user') || (key === 'title') || (key === 'parent'))) {
                this.details[key] = props[key];
            }
        }
    }

    toJSONString() {
        let nonCircular = {};

        for (let key in this) {
            if (key !== 'parent' && key !== 'render' && key !== 'details') {
                nonCircular[key] = `${this[key]}`;
            } else if (key === 'details') {
                console.log(this.details);
                nonCircular['details'] = JSON.stringify(this['details']);
            }
        }
        // console.log('nonCirc VV')
        // console.log(nonCircular);
        // console.log('nonCirc &&&');

        // nonCircular = this;
        // nonCircular.parent = null;

        return JSON.stringify(nonCircular);
    }

    setParent(parentNew) {
        this.parent = parentNew;
    }

    getParent() {
        return this.parent;
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
        let detailsFiltered = {};

        for (let key in this.details) {
            if (typeof this.details[key] !== 'object') {
                detailsFiltered[key] = this.details[key];
            }
        }
        return (detailsFiltered);
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