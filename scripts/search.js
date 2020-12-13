//Функция поиска игрока по Фамилии
function Search() {
	var whatToSearch = document.getElementsByName("input1")[0].value;
	localStorage.setItem("whatToSearch", whatToSearch);
	localStorage.setItem("district", null);
	window.location.href = "catalog.html";
}