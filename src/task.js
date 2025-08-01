export default class Task {
    constructor(props) {
        for (let key in props) {
            this[key] = props[key];
        }
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
            info[key] = this[key];
        }

        return (info);
    }
}