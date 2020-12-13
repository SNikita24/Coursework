'use strict';

//Класс музей

function Museum(title, picture, info, district, tag, cost) {
	this.title = title;
	this.picture = picture;
	this.district = district;
	this.tag = tag;
	this.cost = cost;
	var firstSpace = 270;
	for (let i = 270; i > 250; i--) {
		if(info[i] == ' ') {
			firstSpace = i;
			break;
		}
	}
	this.info = info.slice(0, firstSpace) + "...";
}

//Функция, получающая из локального хранилища индекс района и устанавливающая соответствующий району checkbox в состояние "выбрано"

function check() {
	var districts = document.getElementById("filters");
	var number = localStorage.getItem("district");
	if (number >= 0 && number < districts.location.length) {
		districts.location[number].checked = true;
	}
}

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

//Функция вывода экземпляра класса "Музей" на страницу

function ToBlock(museum) {
	var main = document.createElement("div");
	main.setAttribute("class", "museum");
			
	var refTitle = document.createElement("a");
	refTitle.innerHTML = museum.title;
	refTitle.setAttribute("class", "name");
	refTitle.setAttribute("href", "museum.html");
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
	img.setAttribute("src", "images/" + museum.picture);
	img.setAttribute("alt", museum.picture);
	img.setAttribute("title", museum.title);
			
	var span = document.createElement("span");
	span.setAttribute("class", "about");
	span.innerHTML = museum.info;
			
	divInfo.appendChild(hr);
	divInfo.appendChild(img);
	divInfo.appendChild(span);
			
	main.appendChild(refTitle);
	main.appendChild(divInfo);
			
	document.getElementById("museum-container").appendChild(main);
}

//Сброс формы и поискового запроса

function Reset() {
	localStorage.removeItem("whatToSearch");
	if (searchedMuseumsByName != null) {
		searchedMuseumsByName.length = 0;
	}
	
	for (let i = 0; i < document.getElementsByName("location").length; i++) {
		document.getElementsByName("location")[i].checked = false;
	}
	for (let i = 0; i < document.getElementsByName("subject").length; i++) {
		document.getElementsByName("subject")[i].checked = false;
	}
	/*
	document.getElementsByName("location").forEach(district => district.checked = false);
	document.getElementsByName("subject").forEach(subject => subject.checked = false);
	*/
	document.getElementsByName("cost")[0].checked = false;
	
	Filters();
}

//Фильтрация массива музеев по параметрам из формы

function Filters() {
	var searchedMuseums = new Array();
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
	
	if (searchedMuseumsByName != null && searchedMuseumsByName.length != 0) {
		var searchedMuseums = searchedMuseumsByName.slice();
	}
	else {
		var searchedMuseums = museums.slice();
	}	
	
	//Если элемент соответствует хотя бы одному параметру, добавляем в отфильтрованный массив
	
	if (namesOfDistricts.length != 0) {
	   searchedMuseums = searchedMuseums.filter(function(item) {
			for (let i = 0; i < namesOfDistricts.length; i++) {
				if (item.district == namesOfDistricts[i]) {
					return true;
				}
			}	
			return false;
		});
	
	}
	
	if(namesOfSubjects.length != 0){
		searchedMuseums = searchedMuseums.filter(function(item) {
			for (let i = 0; i < namesOfSubjects.length; i++) {
				if (item.tag == namesOfSubjects[i]) {
					return true;
				}
			}
			return false;
		});
	}
	
	if (IsFree) {
		searchedMuseums = searchedMuseums.filter(function(item) {
			if (item.cost == 0) {
				return true;
			}
		});
	}
	
	//Сортировка музеев по заданному в select параметру
	
	switch (document.getElementsByTagName("select")[0].selectedIndex) {
		case 0: break;
		case 1: searchedMuseums.sort(function(a, b) {
			if (a.title < b.title) {
    			return -1;
  			}
  			if (a.title > b.title) {
    			return 1;
  			}
  			return 0;
		});
			break;
		case 2: searchedMuseums.sort(function(a, b) {
			return a.cost - b.cost;
		});
			break;
		default: break;
	}
	
	document.getElementById("museum-container").innerHTML = "";
	
	if (searchedMuseums.length == 0) {
		document.getElementById("museum-container").innerHTML = "Ничего не найдено!";
	}
	else {
		for (let i = 0; i < searchedMuseums.length; i++) {
			ToBlock(searchedMuseums[i]);
		}
	}
	
	
}

var doc = MuseumParser();
var museums = [];

//Инициализация массива экземпляров муззеев, получая поля для конструктора из XmlDOM

for (let i = 0; i < doc.getElementsByTagName("museum").length; i++) {
	museums[i] = new Museum(doc.getElementsByTagName("museum")[i].getElementsByTagName("title")[0].textContent,
							doc.getElementsByTagName("museum")[i].getElementsByTagName("picture")[0].textContent,
							doc.getElementsByTagName("museum")[i].getElementsByTagName("info")[0].textContent,
							doc.getElementsByTagName("museum")[i].getElementsByTagName("district")[0].textContent,
							doc.getElementsByTagName("museum")[i].getElementsByTagName("subjects")[0].textContent,
							doc.getElementsByTagName("museum")[i].getElementsByTagName("cost")[0].textContent
							);
}

var searchRequest = localStorage.getItem("whatToSearch");

//Если передан поисковый запрос, ищем вхождение запроса в названия музеев

if(searchRequest != null && searchRequest.length != 0){
	var searchedMuseumsByName = museums.filter(function(item){
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
	if(searchedMuseumsByName.length == 0){
		document.getElementById("museum-container").innerHTML = "Ничего не найдено!";
	}
	else{
		for (var i = 0; i < searchedMuseumsByName.length; i++) {
			ToBlock(searchedMuseumsByName[i]);
		}
	}
}
else {
	for (var i = 0; i < museums.length; i++) {
		ToBlock(museums[i]);
	}
}



		