console.log("hello");
function myFunction() {
	console.log("screen2");
	var x = new XMLHttpRequest();
	x.onreadystatechange = function(){
	    if(x.readyState === 4 && x.status === 200) {
	      // Optional callback for when request completes
	      if(x.responseText=="error"){
	      	alert("please login to continue!!");
	      	location.href="/ui/login.html";
	      }
	      console.log(x.responseText+"***");
	      document.getElementById("user").innerHTML="HELLO "+x.responseText+"!!";
	    }
	}
    x.open('POST', '/check-login', true);
    x.send(null);
}
setTimeout(myFunction, 2);
function logfn() {
	// body...
	var x = new XMLHttpRequest();
	x.onreadystatechange = function(){
	    if(x.readyState === 4 && x.status === 200) {
	      // Optional callback for when request completes
	      var obj = JSON.parse(x.responseText);
	      if(obj.code==200)
	      	alert(obj.msg);
	      }
	      location.href="/";
	}
    x.open('POST', '/logout', true);
    x.send(null);
}