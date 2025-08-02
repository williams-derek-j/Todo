import { events } from './events';

export default class Task {
    constructor(props) {
        for (let key in props) {
            this[key] = props[key];
        }
    }

    init(render, parentRender) {
        this.render = render;
        this.renderParent = parentRender;

        //events.on('taskEdited', this.editTask.bind(this));
    }

    // function createSubTask(props) {
    //     //
    // }
    //
    // function removeSubTask(subTask) {
    //     //
    // }

    description(newDescription) {
         this.description = newDescription;
    }

    info() {
        let info = {};

        for (let key in this) {
            if (typeof this[key] !== 'object') {
                info[key] = this[key];
            }
        }
        return (info);
    }

    editDetail(detailEdited) {
        if (detailEdited.parentNode === this.render) {
            for (let key in this) {
                if (key === detailEdited.className) {
                    this[key] = detailEdited.firstChild.textContent;
                }
            }
        }
    }

    setParent(parentNew) {
        this.renderParent = parentNew;
    }

    getParent() {
        return this.renderParent;
    }
}