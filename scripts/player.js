'use strict'

//Парсер игроков из Xml через XMLHttpRequest

function PlayerParser() {
	var xmlhttp;
	if (window.XMLHttpRequest)
	{ // для IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	}
	else
	{ // для IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.open("GET","https://raw.githubusercontent.com/SNikita24/Coursework/main/players.xml",false);
	xmlhttp.overrideMimeType('application/xml');
	xmlhttp.send();
	var xmlDoc = xmlhttp.responseText;

	var parser = new DOMParser();
	return parser.parseFromString(xmlDoc, "application/xml");
}

//Поиск игрока по названию

function FindPlayerByName(name){
	for(var i = 0; i < players.length; i++) {
		if(players[i].getElementsByTagName("title")[0].textContent == name){
			return players[i];
		}
		
	}
}

var doc = PlayerParser();
var players = doc.getElementsByTagName("player");
var title = localStorage.getItem("title");
var player = FindPlayerByName(title);

//Размещение информации на веб-странице

title = player.getElementsByTagName("title")[0].textContent;
document.title += (" " + title);
document.getElementsByClassName("heading")[0].innerHTML = title;

var breadCrumbs = document.getElementsByClassName("bread_crumbs")[0];
breadCrumbs.getElementsByTagName("li")[2].innerHTML += (" " + title);
var gallery = document.getElementsByClassName("gallery")[0];
var imagesName = new Array();

for(var i = 0 ; i < player.getElementsByTagName("picture").length; i++){
	imagesName[i] = player.getElementsByTagName("picture")[i].textContent;
}

var images = new Array();
for(var i = 0; i < imagesName.length; i++){
	images[i] = document.createElement("img");
	images[i].setAttribute("src", "images/" + imagesName[i]);
	images[i].setAttribute("alt", imagesName[i]);
	images[i].setAttribute("title", title);
	gallery.appendChild(images[i]);
}

document.getElementById("address").innerHTML += (" " + player.getElementsByTagName("address")[0].textContent);
document.getElementById("time").innerHTML += (" " + player.getElementsByTagName("time")[0].textContent);
document.getElementById("phone").innerHTML += (" " + player.getElementsByTagName("number")[0].textContent);
document.getElementById("email").innerHTML += (" " + player.getElementsByTagName("email")[0].textContent);
document.getElementsByClassName("info")[0].innerHTML = player.getElementsByTagName("info")[0].textContent;