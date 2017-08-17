//Pointer
function $(Obj){return document.getElementById(Obj)}
//Ajax
function loadDoc(file) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("main").innerHTML=this.responseText;
		}
	};
	xhttp.open("GET", file, true);
	xhttp.send();
}
window.onpopstate = function(event){
	loadDoc(location.hash.substr(1)+'.html')
};
if(location.reload){
	if(!location.hash)location.hash='#inicio'
	loadDoc(location.hash.substr(1)+'.html')
}