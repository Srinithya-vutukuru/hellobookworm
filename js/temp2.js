console.log("hello");
function create() {
	user();
	var a=`Please enter your Penname &nbsp;<input type="text" id="penname" placeholder="Penname" required>`;
	var d=`<button onclick="opener()">Browse...</button>`;
	var e=`<textarea rows="18" cols="120" id="txt" required></textarea>`;
	var f=`<button onclick="submition()">Publish...</button>`;
	document.getElementById("cre").innerHTML=d;
	document.getElementById("left").innerHTML=`<input type="text" id="book" placeholder="Title" required>`;
	document.getElementById("middle").innerHTML="";
	document.getElementById("para").innerHTML=a+`<br><br>`+e+`<br><br>`+f;
	document.getElementById("suppress").innerHTML=`<div id="quote"><div id="a"></div><div id="b"></div></div>`;
	quote();
}
function opener() {
	user();
	document.getElementById("cre").innerHTML=`<button onclick="create()">Become a writer</button>`;
	document.getElementById("left").innerHTML=`<input type="text" id="search" placeholder="Search" size="40%">`;
	document.getElementById("middle").innerHTML=`<img onclick="search(0)" src="../images/search.svg" height="75%" width="100%">`;
	story(0);
}
setTimeout(opener,0);
function user(){
	var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                //console.log(this.responseText);
                //console.log(document.getElementById('author2').innerHTML)
                document.getElementById("author2").innerHTML=this.responseText+"!!";
            } else {
                location.href="/ui/temp.html";
            }
        }
    };
    request.open('POST', '/check-login', true);
    request.send(null);
}
function logout() {
	user();
	var x = new XMLHttpRequest();
	x.onreadystatechange = function(){
	    if(x.readyState === 4 && x.status === 200) {
	      // Optional callback for when request completes
	      var obj = JSON.parse(x.responseText);
	      if(obj.code==200)
	      	alert(obj.msg);
	      }
	      location.href="/ui/temp.html";
	}
    x.open('POST', '/logout', true);
    x.send(null);
}
function submition(){
	user();
	var p ='\\'+'\"';
	var pen = document.getElementById("penname").value;
	pen=(pen.replace(/"/g,p));
	var t = document.getElementById("book").value;
	t=(t.replace(/"/g,p));
	var content= document.getElementById("txt").value;
	content=(content.replace(/"/g,p));
	//console.log(content);
	if(t.length>0){
		if (content.length>0) {
			var x = new XMLHttpRequest();
		  	x.onreadystatechange = function(){
			    if(x.readyState === 4 && x.status === 200) {
			      var obj=JSON.parse(x.responseText);
			      console.log(obj.code);
			      if(obj.code==200){
			      	opener();
			      }else{
			      	alert(obj.msg);
			      }
			    }
		  	}
		    x.open('POST', '/publish', true);
	        x.setRequestHeader('Content-Type', 'application/json');
	        x.send(JSON.stringify({pen:pen, title:t, content:content})); 
		}else{alert("Ooops you forgot your story!!!!");}
	}else{alert("Ooops you forgot your Title!!!!");}
}
var k=0;
var lis=[];var conten=[];var tim=[];var des=[];
function prevbt() {
	console.log("prevbt");
	k=k*0
	lis=[];conten=[];tim=[];des=[];
	story(0);
}

function story(z){
	user();
	console.log("started");
	var x = new XMLHttpRequest();
	x.onreadystatechange = function(){
	    if(x.readyState === 4 && x.status === 200) {
	      var obj = JSON.parse(this.responseText);
	      if(obj.code==200){
	      	//alert(obj.msg);
		    var tit=``; 
		      for(var i=0;i<(obj.msg1).length;i++){
		      	lis[i]=obj.msg1[i].titile;
		      	tit+=`<li onclick=li(`+i+`)>`+obj.msg1[i].titile+`</li>`;
		      	conten[i]=obj.msg1[i].content;
		      	tim[i]=obj.msg2[i].date;
		      }
		      for(var j=0;j<conten.length;j++){
			      var n = conten[j].indexOf(".");
			      var m = conten[j].indexOf(".",n+1);
			      //console.log(" "+n+" "+m+" "+conten[i].substring(0, m+1));
			      des[j]=conten[j].substring(0, m+1) + " ......" ;
		  	  }
		      document.getElementById("suppress").innerHTML=`<div id="bottom_mid"><ul>`+tit+`</ul></div>`;
		      if(z==0){
		      	k=0;
		      	//console.log(lis);
		      	document.getElementById("para").innerHTML=`
		      	<div id = "para1" onclick="li(`+0+`)"><div id="title">`+lis[0]+`</div><div id="time">`+tim[0]+`</div><div id="content">`+des[0]+`</div></div>
				<div id = "para2" onclick="li(`+1+`)"><div id="title2">`+lis[1]+`</div><div id="time2">`+tim[1]+`</div><div id="content2">`+des[1]+`</div></div>
				<div id = "para3" onclick="li(`+2+`)"><div id="title3">`+lis[2]+`</div><div id="time3">`+tim[2]+`</div><div id="content3">`+des[2]+`</div></div>
				<p href="#" onclick="story(1)" id="next">NEXT  >>></p>`;
			  }else if(z==1){
			  	k=k+3;
			  	l=k+1;
			  	c=k+2;
			  	if(k==lis.length-1){
			  		document.getElementById("para").innerHTML=`
			  		<div id = "para1" onclick="li(`+k+`)" ><div id="title">`+lis[k]+`</div><div id="time">`+tim[k]+`</div><div id="content">`+des[k]+`</div></div>
			  		<p href="#" onclick="prevbt()" id="next"><<< PREV</p>`;
			  	}else if(k==lis.length-2){
			  		console.log(k);
			  		document.getElementById("para").innerHTML=`
			  		<div id = "para1" onclick="li(`+k+`)"><div id="title">`+lis[k]+`</div><div id="time">`+tim[k]+`</div><div id="content">`+des[k]+`</div></div>
			  		<div id = "para2" onclick="li(`+l+`)"><div id="title2">`+lis[k+1]+`</div><div id="time2">`+tim[k+1]+`</div><div id="content2">`+des[k+1]+`</div></div>
			  		<p href="#" onclick="prevbt()" id="next"><<< PREV</p>`;
			  	}else if(k==lis.length-3){
			  		document.getElementById("para").innerHTML=`
			  		<div id = "para1" onclick="li(`+k+`)"><div id="title">`+lis[k]+`</div><div id="time">`+tim[k]+`</div><div id="content">`+des[k]+`</div></div>
			  		<div id = "para2" onclick="li(`+l+`)"><div id="title2">`+lis[k+1]+`</div><div id="time2">`+tim[k+1]+`</div><div id="content2">`+des[k+1]+`</div></div>
			  		<div id = "para3" onclick="li(`+c+`)"><div id="title3">`+lis[k+2]+`</div><div id="time3">`+tim[k+2]+`</div><div id="content3">`+des[k+2]+`</div></div>
			  		<p href="#" onclick="prevbt()" id="next"><<< PREV</p>`;
			  	}else{
			  		document.getElementById("para").innerHTML=`
			      	<div id = "para1" onclick="li(`+k+`)"><div id="title">`+lis[k]+`</div><div id="time">`+tim[k]+`</div><div id="content">`+des[k]+`</div></div>
					<div id = "para2" onclick="li(`+l+`)"><div id="title2">`+lis[k+1]+`</div><div id="time2">`+tim[k+1]+`</div><div id="content2">`+des[k+1]+`</div></div>
					<div id = "para3" onclick="li(`+c+`)"><div id="title3">`+lis[k+2]+`</div><div id="time3">`+tim[k+2]+`</div><div id="content3">`+des[k+2]+`</div></div>
					<p href="#" onclick="story(1)" id="next">NEXT  >>></p>`;
			  	}  
			  }
	      }
		}
	}
    x.open('POST', '/story', true);
    x.send(null);
}
function li(id) {
	user();
	console.log(id);
	document.getElementById("para").innerHTML=`<div id = "para4"><div id="title4">`+lis[id]+`</div><div id="time4">`+tim[id]+`</div><div id="content4">`+conten[id]+`</div></div>
	<p href="#" onclick="prevbt()" id="next">BACK <<</p>`;
}
function quote() {
	user();
	var x = new XMLHttpRequest();
	x.onreadystatechange = function(){
	    if(x.readyState === 4 && x.status === 200) {
	      // Optional callback for when request completes
	      var obj = JSON.parse(x.responseText);
	      if(obj.code==200){
	      	console.log(obj.msg);
	      	var quote=[];
	      	var arthr=[];
	      	for(var i=0;i<obj.msg.length;i++){
	      		quote[i]=obj.msg[i].quote;
	      		arthr[i]=obj.msg[i].author;
	      	}
	      	var rand=Math.floor((Math.random() * 20) + 1);
	      	document.getElementById("a").innerHTML=quote[rand-1];
	      	document.getElementById("b").innerHTML=arthr[rand-1];
	      }
	    }
	}
    x.open('POST', '/quote', true);
    x.send(null);
}
var n=0;
var bc=[];
function search(z) {
	user();
	if(z==0){
		var m=0;n=0;
		var a = document.getElementById("search").value;
		console.log(a);
		for (var i = 0; i < lis.length; i++) {
			if((lis[i].toLowerCase()).indexOf(a.toLowerCase()) != -1){
				bc[m]=i;m++;
				console.log(lis[0]);
			}
		}
	}
	console.log(bc.length);
	if (bc.length>0) {
	  	if(bc.length-n-1==0){
	  		document.getElementById("para").innerHTML=`
	  		<div id = "para1" onclick="li(`+bc[n]+`)"><div id="title">`+lis[bc[n]]+`</div><div id="time">`+tim[bc[n]]+`</div><div id="content">`+des[bc[n]]+`</div></div>
	  		<p href="#" onclick="story(0)" id="next"><<< PREV</p>`;
	  	}else if(bc.length-n-2==0){
	  		document.getElementById("para").innerHTML=`
	  		<div id = "para1" onclick="li(`+bc[n]+`)"><div id="title">`+lis[bc[n]]+`</div><div id="time">`+tim[bc[n]]+`</div><div id="content">`+des[bc[n]]+`</div></div>
	  		<div id = "para2" onclick="li(`+bc[n+1]+`)"><div id="title2">`+lis[bc[n+1]]+`</div><div id="time2">`+tim[bc[n+1]]+`</div><div id="content2">`+des[bc[n+1]]+`</div></div>
	  		<p href="#" onclick="story(0)" id="next"><<< PREV</p>`;
	  	}else if(bc.length-n-3==0){
	  		document.getElementById("para").innerHTML=`
	  		<div id = "para1" onclick="li(`+bc[n]+`)"><div id="title">`+lis[bc[n]]+`</div><div id="time">`+tim[bc[n]]+`</div><div id="content">`+des[bc[n]]+`</div></div>
	  		<div id = "para2" onclick="li(`+bc[n+1]+`)"><div id="title2">`+lis[bc[n+1]]+`</div><div id="time2">`+tim[bc[n+1]]+`</div><div id="content2">`+des[bc[n+1]]+`</div></div>
	  		<div id = "para3" onclick="li(`+bc[n+2]+`)"><div id="title3">`+lis[bc[n+2]]+`</div><div id="time3">`+tim[bc[n+2]]+`</div><div id="content3">`+des[bc[n+2]]+`</div></div>
	  		<p href="#" onclick="story(0)" id="next"><<< PREV</p>`;
	  	}else{
	  		document.getElementById("para").innerHTML=`
	      	<div id = "para1" onclick="li(`+bc[n]+`)"><div id="title">`+lis[bc[n]]+`</div><div id="time">`+tim[bc[n]]+`</div><div id="content">`+des[bc[n]]+`</div></div>
			<div id = "para2" onclick="li(`+bc[n+1]+`)"><div id="title2">`+lis[bc[n+1]]+`</div><div id="time2">`+tim[bc[n+1]]+`</div><div id="content2">`+des[bc[n+1]]+`</div></div>
			<div id = "para3" onclick="li(`+bc[n+2]+`)"><div id="title3">`+lis[bc[n+2]]+`</div><div id="time3">`+tim[bc[n+2]]+`</div><div id="content3">`+des[bc[n+2]]+`</div></div>
			<p href="#" onclick="search(1)" id="next">NEXT  >>></p>`;n=n+3;
	  	}  
	} 
}
window.onbeforeunload = function (e) {
    e = e || window.event;

    // For IE and Firefox prior to version 4
    if (e) {
        e.returnValue = 'Sure?';
    }
    // For Safari
    return 'Sure?';
};

//window.onbeforeunload = logout();
