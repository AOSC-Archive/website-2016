// Run on Node.js

// Overall
var fs = require('fs');
var url = require('url');
var path = require('path');
var YAML = require('yamljs'); // npm install yamljs
var MD = require( "markdown" ).markdown; // npm install markdown


// Default
var siteSourceDir = __dirname;
// var siteSourceDir = '/Users/JoyNeop/Developer/AOSC/website-2015';
var config = YAML.parse(fs.readFileSync(siteSourceDir + '/config.yml').toString());


// Parse list of posts
function parseListOfPosts(listLang) {
	var rawListOfPosts = fs.readFileSync(siteSourceDir + '/source/' + listLang + '/list.json').toString();
	// console.log(JSON.parse(rawListOfPosts));
	return JSON.parse(rawListOfPosts);
};


// Filling out the template
function templateFill(articleIndex, lang) {
	var templateRawText = fs.readFileSync(siteSourceDir + '/template/article.html').toString();

	var replacedText = templateRawText;

	replacedText = replacedText.replace(/\{\{ meta\.copyright \}\}/ig, config.copyright);

	replacedText = replacedText.replace(/\{\{ article\.author \}\}/ig, parseListOfPosts(lang).list[articleIndex].Author);
	replacedText = replacedText.replace(/\{\{ article\.date \}\}/ig, parseListOfPosts(lang).list[articleIndex].Time);
	replacedText = replacedText.replace(/\{\{ article\.title \}\}/ig, parseListOfPosts(lang).list[articleIndex].Title);
	replacedText = replacedText.replace(/\{\{ article\.content \}\}/ig, MD.toHTML(fs.readFileSync(siteSourceDir + '/source/' + lang + '/' + articleIndex + '.md').toString()));

	if (articleIndex != 0) {
		replacedText = replacedText.replace(/\{\{ article\.prevTitle \}\}/ig, parseListOfPosts(lang).list[(articleIndex-1)].Title);
		replacedText = replacedText.replace(/\{\{ article\.prevURL \}\}/ig, lang + '/' + (articleIndex-1) + '.html');
		replacedText = replacedText.replace(/\{\{ article\.nextTitle \}\}/ig, '');
		replacedText = replacedText.replace(/\{\{ article\.nextURL \}\}/ig, '');
	};
	if (articleIndex != parseListOfPosts(lang).list.length - 1) {
		replacedText = replacedText.replace(/\{\{ article\.nextTitle \}\}/ig, parseListOfPosts(lang).list[(articleIndex+1)].Title);
		replacedText = replacedText.replace(/\{\{ article\.nextURL \}\}/ig, lang + '/' + (articleIndex+1) + '.html');
		replacedText = replacedText.replace(/\{\{ article\.prevTitle \}\}/ig, '');
		replacedText = replacedText.replace(/\{\{ article\.prevURL \}\}/ig, '');
	};

	replacedText = replacedText.replace(/\{\{ page\.title \}\}/ig, parseListOfPosts(lang).list[articleIndex].Title + '— AOSC News');
	replacedText = replacedText.replace(/\{\{ page\.h1 \}\}/ig, 'AOSC News');

	return replacedText;
};

// Generating RSS
function generateFeedOfLang(lang) {
	// TODO
};


// When I run this script
for (var i = 0; i < config.multiLang.length; i++) {
	var lang = config.multiLang[i];
	var postsIndex = parseListOfPosts(lang).list;
	for (var j = 0; j < postsIndex.length; j++) {
		var articleFileText = MD.parse(fs.readFileSync(siteSourceDir + '/source/' + lang + '/' + j + '.md').toString());
		fs.writeFileSync(siteSourceDir + '/product/' + lang + '/' + j + '.html', templateFill(j, lang));
	};
}

console.log("Completed.");