'use strict';

//Класс игрок

function Player(title, picture, info, district, tag, cost) {
	this.title = title;
	this.picture = picture;
	this.district = district;
	this.tag = tag;
	this.cost = cost;
	var firstSpace = 290;
	for (let i = 290; i > 250; i--) {
		if(info[i] == ' ') {
			firstSpace = i;
			break;
		}
	}
	this.info = info.slice(0, firstSpace) + "...";
}

//Функция, получающая из локального хранилища индекс позиции и устанавливающая соответствующий району checkbox в состояние "выбрано"

function check() {
	var districts = document.getElementById("filters");
	var number = localStorage.getItem("district");
	if (number >= 0 && number < districts.location.length) {
		districts.location[number].checked = true;
	}
}

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

//Функция вывода экземпляра класса "Player" на страницу

function ToBlock(player) {
	var main = document.createElement("div");
	main.setAttribute("class", "player");
			
	var refTitle = document.createElement("a");
	refTitle.innerHTML = player.title;
	refTitle.setAttribute("class", "name");
	refTitle.setAttribute("href", "player.html");
	refTitle.setAttribute("target", "_blank");
	
	//При нажатии на ссылку записываем ее текст в локальное хранилище
	
	refTitle.onclick = function(Event) {
		localStorage.setItem("title", Event.currentTarget.innerHTML);
	}
	main.appendChild(refTitle);
			
	var divInfo = document.createElement("div");
	divInfo.setAttribute("class", "info");
			
	var hr = document.createElement("hr");
			
	var img = document.createElement("img");
	img.setAttribute("src", "images/" + player.picture);
	img.setAttribute("alt", player.picture);
	img.setAttribute("title", player.title);
			
	var span = document.createElement("span");
	span.setAttribute("class", "about");
	span.innerHTML = player.info;
			
	divInfo.appendChild(hr);
	divInfo.appendChild(img);
	divInfo.appendChild(span);
			
	main.appendChild(refTitle);
	main.appendChild(divInfo);
			
	document.getElementById("player-container").appendChild(main);
}

//Сброс формы и поискового запроса

function Reset() {
	localStorage.removeItem("whatToSearch");
	if (searchedPlayersByName != null) {
		searchedPlayersByName.length = 0;
	}
	
	for (let i = 0; i < document.getElementsByName("location").length; i++) {
		document.getElementsByName("location")[i].checked = false;
	}
	for (let i = 0; i < document.getElementsByName("subject").length; i++) {
		document.getElementsByName("subject")[i].checked = false;
	}
	
	//document.getElementsByName("location").forEach(district => district.checked = false);
	//document.getElementsByName("subject").forEach(subject => subject.checked = false);
	
	document.getElementsByName("cost")[0].checked = false;
	
	Filters();
}

//Фильтрация массива музеев по параметрам из формы

function Filters() {
	var searchedPlayers = new Array();
	var namesOfDistricts = new Array();
	var districts = document.getElementsByName("location");
	
	for (let i = 0, j = 0; i < districts.length; i++) {
		if (districts[i].checked) {
			namesOfDistricts[j] = districts[i].value;
			j++;
		}
	}

	var namesOfSubjects = new Array();
	var subjects = document.getElementsByName("subject");
	
	for (let i = 0, j = 0; i < subjects.length; i++) {
		if (subjects[i].checked) {
			namesOfSubjects[j] = subjects[i].value;
			j++;
		}
	}
	
	var IsFree = document.getElementsByName("cost")[0].checked;
	
	//Если есть непустой массив, отфильтрованный по поиску, работаем с ним
	
	if (searchedPlayersByName != null && searchedPlayersByName.length != 0) {
		var searchedPlayers = searchedPlayersByName.slice();
	}
	else {
		var searchedPlayers = players.slice();
	}	
	
	//Если элемент соответствует хотя бы одному параметру, добавляем в отфильтрованный массив
	
	if (namesOfDistricts.length != 0) {
	   searchedPlayers = searchedPlayers.filter(function(item) {
			for (let i = 0; i < namesOfDistricts.length; i++) {
				if (item.district == namesOfDistricts[i]) {
					return true;
				}
			}	
			return false;
		});
	
	}
	
	if(namesOfSubjects.length != 0){
		searchedPlayers = searchedPlayers.filter(function(item) {
			for (let i = 0; i < namesOfSubjects.length; i++) {
				if (item.tag == namesOfSubjects[i]) {
					return true;
				}
			}
			return false;
		});
	}
	
	
	//Сортировка игроков по заданному в select параметру
	
	switch (document.getElementsByTagName("select")[0].selectedIndex) {
		case 0: break;
		case 1: searchedPlayers.sort(function(a, b) {
			if (a.title < b.title) {
    			return -1;
  			}
  			if (a.title > b.title) {
    			return 1;
  			}
  			return 0;
		});
			break;
		case 2: searchedPlayers.sort(function(a, b) {
			return a.cost - b.cost;
		});
			break;
		default: break;
	}
	
	document.getElementById("player-container").innerHTML = "";
	
	if (searchedPlayers.length == 0) {
		document.getElementById("player-container").innerHTML = "Ничего не найдено!";
	}
	else {
		for (let i = 0; i < searchedPlayers.length; i++) {
			ToBlock(searchedPlayers[i]);
		}
	}
	
	
}

var doc = PlayerParser();
var players = [];

//Инициализация массива экземпляров игроков, получая поля для конструктора из XmlDOM

for (let i = 0; i < doc.getElementsByTagName("player").length; i++) {
	players[i] = new Player(doc.getElementsByTagName("player")[i].getElementsByTagName("title")[0].textContent,
							doc.getElementsByTagName("player")[i].getElementsByTagName("picture")[0].textContent,
							doc.getElementsByTagName("player")[i].getElementsByTagName("info")[0].textContent,
							doc.getElementsByTagName("player")[i].getElementsByTagName("district")[0].textContent,
							doc.getElementsByTagName("player")[i].getElementsByTagName("subjects")[0].textContent,
							doc.getElementsByTagName("player")[i].getElementsByTagName("cost")[0].textContent
							);
}

var searchRequest = localStorage.getItem("whatToSearch");

//Если передан поисковый запрос, ищем вхождение запроса в игроков

if(searchRequest != null && searchRequest.length != 0){
	var searchedPlayersByName = players.filter(function(item){
		var name = item.title.toLowerCase();
		var search = searchRequest.toLowerCase();
		//Объявление для IE (не поддерживает метод includes())
		if (!String.prototype.includes) {
  			String.prototype.includes = function(search, start) {
    			if (typeof start !== 'number') {
      				start = 0;
    			}
    
				if (start + search.length > this.length) {
					return false;
				} 
				else {
      				return this.indexOf(search, start) !== -1;
    			}
  			};
		}
		if(name.includes(search)){
			return true;
		}
		return false;
	});
	localStorage.removeItem("whatToSearch");
	if(searchedPlayersByName.length == 0){
		document.getElementById("player-container").innerHTML = "Ничего не найдено!";
	}
	else{
		for (var i = 0; i < searchedPlayersByName.length; i++) {
			ToBlock(searchedPlayersByName[i]);
		}
	}
}
else {
	for (var i = 0; i < players.length; i++) {
		ToBlock(players[i]);
	}
}



		