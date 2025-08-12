export const taskMethods = {
    toJSONString: function() {
        let nonCircular = {};

        for (let key in this) {
            if (key !== 'parent' && key !== 'render' && key !== 'details') {
                nonCircular[key] = `${this[key]}`;
            } else if (key === 'details') {
                nonCircular['details'] = JSON.stringify(this['details']);
            }
        }
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
        let detailsFiltered = {};

        for (let key in this.details) {
            if (typeof this.details[key] !== 'object') {
                detailsFiltered[key] = this.details[key];
            }
        }
        return (detailsFiltered);
    },

    editDetail: function(detailEdited) {
        for (let key in this.details) {
            if (key === detailEdited.className) {
                this.details[key] = detailEdited.firstChild.textContent;
                //console.log(this.details[key]);
            }
        }
    },
}
