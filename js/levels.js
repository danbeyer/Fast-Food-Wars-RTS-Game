function level(name) {
    this.active = false;
    this.name = name;
}

level.prototype = {
    update: function()
}

var playground = {
        start : function () {
        this.canvas.width = 100%;
        this.canvas.height = 100%;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas,document.body.childNodes[0]);
    }
}

function addEntities () {
    entities = [];
    //add stuff here later
    //for i in units, etc.
}

