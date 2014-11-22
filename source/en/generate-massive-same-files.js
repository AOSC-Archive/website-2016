var fs = require('fs');
var url = require('url');
var path = require('path');

var text = fs.readFileSync(__dirname + '/0.md').toString();
for (var i = 1; i < 115; i++) {
	fs.writeFileSync(__dirname + '/' + i + '.md', text);
};