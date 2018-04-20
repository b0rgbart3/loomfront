var Resource = function (type) {
    this.type = type;
    
}

Resource.prototype.post = function() {
    console.log('Resource of type: ' + this.type + ' is posting itself.');
}

module.exports = Resource;

