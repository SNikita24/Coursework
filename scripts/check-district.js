//Передача индекса района из выпадающего меню в локальное хранилище
'use strict';
function send(district) {
	localStorage.setItem("district", district);
}