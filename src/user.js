import { userMethods } from "./userMethods";

export default class User {
    constructor(name) {
        this.name = name;
        this.projects = [];

        for (let key in userMethods) {
            this[key] = userMethods[key];
        }
    }

    // toJSONString() {
    //     const nonCircular = {};
    //
    //     for (let key in this) {
    //         if (key !== 'render' && key !== 'projects') {
    //             nonCircular[key] = `${this[key]}`;
    //         } else if (key === 'projects') {
    //             nonCircular['projects'] = [];
    //
    //             this[key].forEach((project) => {
    //                 nonCircular['projects'].push(project.toJSONString());
    //             })
    //             nonCircular['projects'] = JSON.stringify(this['projects']);
    //         }
    //     }
    //     return JSON.stringify(nonCircular);
    // }
}