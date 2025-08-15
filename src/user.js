import { userMethods } from "./userMethods.js";

export default class User {
    constructor(name) {
        this.name = name;
        this.projects = [];

        for (let key in userMethods) {
            this[key] = userMethods[key];
        }
    }
}