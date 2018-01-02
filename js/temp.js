console.log("hello");
function myFunction() {
	var obj=`<input type="text" placeholder="Username" id="Username"><br>
	<input type="password" placeholder="password" id="password"><br>
	<input type="password" placeholder="confirm password" id="password_c"><br><br>
	<button onclick ="register()" id="reg">Submit</button><br><br>
	<button onclick ="first()" id="reg">Login</button>
	`;
	document.getElementById("log").innerHTML=obj;
}
function first() {
	var obj=`<input type="text" placeholder="Username" id="Username"> <br>
	<input type="password" placeholder="password" id="password"><br><br>
	<button id="login" onclick="login()">Submit</button><br><br>
	New here <br> <button onclick ="myFunction()" id="login">Click here</button><br><br>`;
	document.getElementById("log").innerHTML=obj;
}
setTimeout(first,1);
function login(){
	var username = document.getElementById("Username").value;
	var password = document.getElementById("password").value;
	console.log(password.length);
	console.log(username.length+"****");
	if (username.length>0) {
		if (password.length>0) {
			var x = new XMLHttpRequest();
			x.onreadystatechange = function(){
			    if(x.readyState === 4 && x.status === 200) {
			      // Optional callback for when request completes
			      var obj=JSON.parse(x.responseText);
			      
			      if(obj.code==200){
			      	location.href="/ui/temp2.html";
			      }else{
			      	alert(obj.msg);
			      }
			    }
			}
		    x.open('POST', '/login', true);
		    x.setRequestHeader('Content-Type', 'application/json');
		    x.send(JSON.stringify({username: username, password: password}));
		}else{alert("please enter password");}	 
	}else{alert("please enter username");}
}
function register(){
	var username = document.getElementById("Username").value;
	var password = document.getElementById("password").value;
	var p1 = document.getElementById("password_c").value;
	if (username.length>0) {
		if (password.length>0 || p1.length>0) {
			if (password==p1) {
				var x = new XMLHttpRequest();
			  	x.onreadystatechange = function(){
				    if(x.readyState === 4 && x.status === 200) {
				      // Optional callback for when request completes
				      var obj=JSON.parse(x.responseText);
				      
				      if(obj.code==200){
				      	location.href="/ui/temp2.html";
				      }else{
				      	alert(obj.msg);
				      }
				    }
			  	}
			    x.open('POST', '/register', true);
		        x.setRequestHeader('Content-Type', 'application/json');
		        x.send(JSON.stringify({username: username, password: password})); 
			}else{alert("password mismatch!!");}
		}else{alert("please enter password");}	 
	}else{alert("please enter username");}
}
