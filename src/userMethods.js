export const userMethods = {
    toJSONString: function() {
        const nonCircular = {};

        for (let key in this) {
            if (key !== 'render' && key !== 'projects') {
                if (typeof this[key] !== 'object' && typeof this[key] !== 'function') {
                    nonCircular[key] = `${this[key]}`;
                }
            } else if (key === 'projects') {
                nonCircular['projects'] = [];

                this[key].forEach((project) => {
                    nonCircular['projects'].push(project.toJSONString());
                })
                nonCircular['projects'] = JSON.stringify(nonCircular['projects']);
            }
        }
        return JSON.stringify(nonCircular);
    }
}