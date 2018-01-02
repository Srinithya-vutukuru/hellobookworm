console.log("hello register");
function myFunction() {
	var username = document.getElementById("Username").value;
	var password = document.getElementById("password").value;
	var p1 = document.getElementById("c_password").value;
	if (password==p1) {
		var x = new XMLHttpRequest();
	  x.onreadystatechange = function(){
	    if(x.readyState === 4 && x.status === 200) {
	      // Optional callback for when request completes
	      console.log(x.responseText+"***");
	     // location.href="/";
	    }
	  }
	    x.open('POST', '/register', true);
        x.setRequestHeader('Content-Type', 'application/json');
        x.send(JSON.stringify({username: username, password: password})); 
	}
	
}
function newfn(argument) {
	// body...
	
}
