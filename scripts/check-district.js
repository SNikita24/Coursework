//Передача индекса позиции из выпадающего меню в локальное хранилище
'use strict';
function send(district) {
	localStorage.setItem("district", district);
}