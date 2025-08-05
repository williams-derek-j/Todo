import { events } from './events';

export default class Task {
    constructor(user, title, props) {
        this.user = user;
        this.title = title;
        // this.date;
        // this.description;
        // this.priority;
        this.details = {};
        console.log(props)
        for (let key in props) {
            console.log(key)
            //console.log(key);
            this.details[key] = props[key];
            //console.log(this.details)
        }
    }

    setRender(render, parentRender) {
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
        } // if (detailEdited.parentNode.parentNode === this.render) {
    }

    setParent(parentNew) {
        this.renderParent = parentNew;
    }

    getParent() {
        return this.renderParent;
    }
}