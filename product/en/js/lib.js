window.bamboo = {};

bamboo.currentChapterNumber = Number(window.location.href.match(/chapter-[0-9]*\.html/)[0].match(/[0-9]+/)[0]);

bamboo.wget = function (url) {
	var x = new XMLHttpRequest();
	x.open("GET", url, false);
	x.send();
	return x.responseText;
};

bamboo.json = function (url) {
	return JSON.parse(bamboo.wget(url));
};

bamboo.detectEdgesOfBook = function () {
	var chapters = bamboo.json("meta/chapters.json");
	document.getElementById("nav-prev").href = "chapter-" + (bamboo.currentChapterNumber - 1) + ".html";
	document.getElementById("nav-next").href = "chapter-" + (bamboo.currentChapterNumber + 1) + ".html";
	document.getElementById("nav-prev-span").innerHTML = "<span class=\"num\">Back</span><span class=\"chapter-title\">" + chapters[(bamboo.currentChapterNumber - 1)] + "</span>";
	document.getElementById("nav-next-span").innerHTML = "<span class=\"num\">Next</span><span class=\"chapter-title\">" + chapters[(bamboo.currentChapterNumber + 1)] + "</span>";
	if (bamboo.currentChapterNumber == 0) {
		document.getElementById("nav-prev").remove();
	} else if (bamboo.currentChapterNumber == chapters.length - 1) {
		document.getElementById("nav-next").remove();
	}
};