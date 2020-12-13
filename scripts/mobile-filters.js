//Скрипт выпадающего меню фильтров для мобильных устройств
var IsFall = false;
function Fall() {
	if(!IsFall) {
		document.getElementById('filters').style.height = 'auto';
		IsFall = true;
	}
	else {
		document.getElementById('filters').style.height = '0px';
		IsFall = false;
	}
}