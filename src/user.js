export default class User {
    constructor(name) {
        this.name = name;

        const storedUserData = localStorage.getItem(name)
        if (storedUserData) {
            this.data = storedUserData;
        } else {
            this.data = [];
        }
    }
}