function changeColor(value){
	var items = document.getElementsByTagName("*");
	for (var i = items.length; i--;){
		if(items[i].style.color){
			items[i].style.color = value;
		};		
		if(items[i].style.backgroundColor){
			items[i].style.backgroundColor = value;
		};
	};
}