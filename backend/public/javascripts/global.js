function deleteUser(event, id){
	event.preventDefault();
	var confirmation = confirm("Nutzer wirklich loeschen?");

	if (confirmation === true){
		$.ajax({
			type: 'DELETE',
			url: '/users/deletuser/' + id
		}).done(function(response){
			if (response.msg === ''){

			} else {
				alert('Error' + response.msg);
			};
		});
	} else {
		return false;
	};
};

function addUser(event){
	event.preventDefault();
};