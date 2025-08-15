import { projectMethods } from "./projectMethods.js";
import { projectProperties } from "./projectProperties.js";
import {taskProperties} from "./taskProperties";

export default class Project {
    constructor(user, props) {
        this.user = user;

        for (let medium in projectProperties) {
            if (medium === 'input' || medium === 'select') {
                for (let type in projectProperties[medium]) {
                    projectProperties[medium][type].forEach((property) => {
                        this[property];
                    })
                }
            }
        }

        this.index;

        this.tasks = [];

        for (let key in props) {
            if (!(key === 'user')) {
                if (key === 'due') {
                    this[key] = new Date(props[key]);
                } else {
                    this[key] = props[key];
                }
            }
        }

        let i = 0;
        projectProperties['select']['priority'].forEach((value) => {
            if (value === this.priority) {
                this.priority = i;
            }
            i++;
        })

        for (let key in projectMethods) {
            this[key] = projectMethods[key];
        }
    }
}