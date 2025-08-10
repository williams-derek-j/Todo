export const taskMethods = {
    toJSONString: function() {
    const nonCircular = this;

    //console.log(this.parent);
    nonCircular.parent = null; //JSON.stringify(this.parent.toJSONString());

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
        let details = {};

        for (let key in this.details) {
            if (typeof this.details[key] !== 'object') {
                details[key] = this.details[key];
            }
        }
        return (details);
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
