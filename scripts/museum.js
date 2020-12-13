'use strict'

//Парсер музеев из Xml через XMLHttpRequest

function MuseumParser() {
	var xmlhttp;
	if (window.XMLHttpRequest)
	{ // для IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	}
	else
	{ // для IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.open("GET","https://raw.githubusercontent.com/Vladislav2147/Vladislav2147.github.io/master/museums.xml",false);
	xmlhttp.overrideMimeType('application/xml');
	xmlhttp.send();
	var xmlDoc = xmlhttp.responseText;

	var parser = new DOMParser();
	return parser.parseFromString(xmlDoc, "application/xml");
}

//Поиск музея по названию

function FindMuseumByName(name){
	for(var i = 0; i < museums.length; i++) {
		if(museums[i].getElementsByTagName("title")[0].textContent == name){
			return museums[i];
		}
		
	}
}

var doc = MuseumParser();
var museums = doc.getElementsByTagName("museum");
var title = localStorage.getItem("title");
var museum = FindMuseumByName(title);

//Размещение информации на веб-странице

title = museum.getElementsByTagName("title")[0].textContent;
document.title += (" " + title);
document.getElementsByClassName("heading")[0].innerHTML = title;

var breadCrumbs = document.getElementsByClassName("bread_crumbs")[0];
breadCrumbs.getElementsByTagName("li")[2].innerHTML += (" " + title);
var gallery = document.getElementsByClassName("gallery")[0];
var imagesName = new Array();

for(var i = 0 ; i < museum.getElementsByTagName("picture").length; i++){
	imagesName[i] = museum.getElementsByTagName("picture")[i].textContent;
}

var images = new Array();
for(var i = 0; i < imagesName.length; i++){
	images[i] = document.createElement("img");
	images[i].setAttribute("src", "images/" + imagesName[i]);
	images[i].setAttribute("alt", imagesName[i]);
	images[i].setAttribute("title", title);
	gallery.appendChild(images[i]);
}

document.getElementById("address").innerHTML += (" " + museum.getElementsByTagName("address")[0].textContent);
document.getElementById("time").innerHTML += (" " + museum.getElementsByTagName("time")[0].textContent);
document.getElementById("phone").innerHTML += (" " + museum.getElementsByTagName("number")[0].textContent);
document.getElementById("email").innerHTML += (" " + museum.getElementsByTagName("email")[0].textContent);
if (museum.getElementsByTagName("cost")[0].textContent == 0) {
	document.getElementById("cost").innerHTML += " Бесплатно";
}
else {
	document.getElementById("cost").innerHTML += (" " + museum.getElementsByTagName("cost")[0].textContent);
}
document.getElementsByClassName("info")[0].innerHTML = museum.getElementsByTagName("info")[0].textContent;