import { taskMethods } from './taskMethods.js';
import { taskProperties } from './taskProperties.js';

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

        let i = 0;
        taskProperties['select']['priority'].forEach((value) => {
            if (value === this.details.priority) {
                this.details.priority = i;
            }
            i++;
        })

        for (let key in taskMethods) {
            this[key] = taskMethods[key];
        }
    }
}