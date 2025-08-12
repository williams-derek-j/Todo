export const taskMethods = {
    toJSONString: function() {
        const nonCircular = {};

        for (let key in this) {
            if (key !== 'parent' && key !== 'render' && key !== 'details') {
                if (typeof this[key] !== 'object' && typeof this[key] !== 'function') {
                    nonCircular[key] = `${this[key]}`;
                }
            } else if (key === 'details') {
                nonCircular['details'] = JSON.stringify(this['details']);
            }
        }
        console.log('nonCircularTask', nonCircular);
        return JSON.stringify(nonCircular);
    },

    setParent: function(parentNew) {
        this.parent = parentNew;
    },

    getParent: function() {
        return this.parent;
    },

    setRender: function(render, parentRender) {
        this.render = render;
    },

    getDetails: function() {
        const detailsFiltered = {};

        for (let key in this.details) {
            if (typeof this.details[key] !== 'object') {
                detailsFiltered[key] = this.details[key];
            } else {
                if (key === 'due') {
                    detailsFiltered[key] = this.details[key].toDateString();
                }
            }
        }
        return (detailsFiltered);
    },

    editDetail: function(detailEdited) {
        for (let key in this.details) {
            if (key === detailEdited.className) {
                if (detailEdited.className === 'due') {
                    this.details[key] = new Date(detailEdited) // detailEdited.something
                }
                this.details[key] = detailEdited.firstChild.textContent;
                //console.log(this.details[key]);
            }
        }
    },
}
