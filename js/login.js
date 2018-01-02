console.log("hello login");
function myFunction() {
	var username = document.getElementById("Username").value;
	var password = document.getElementById("password").value;
	var x = new XMLHttpRequest();
	x.onreadystatechange = function(){
	    if(x.readyState === 4 && x.status === 200) {
	      // Optional callback for when request completes
	      var obj=JSON.parse(x.responseText);
	      
	      if(obj.code==200){
	      	location.href="/ui/screen2.html";
	      }else{
	      	alert(obj.msg);
	      	//location.href="/ui/login.html";
	      }
	    }
	}
    x.open('POST', '/login', true);
    x.setRequestHeader('Content-Type', 'application/json');
    x.send(JSON.stringify({username: username, password: password})); 

}
