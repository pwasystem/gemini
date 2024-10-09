function start(){	
	loadFile('json/menu.json',menu);
}
async function loadFile(url,callback) {
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`Response status: ${response.status}`);
		const text = await response.text();
		callback(text);
	} catch (error) {
		console.error(error.message);
	}
}

function htm(text){
	main.innerHTML=text;
}

function js(text){
	if(document.jd)jd.remove();
	jd=document.createElement('script');
	document.head.insertBefore(jd,document.head.lastChild);
	jd.id='JS';
	jd.src=`data:text/javascript;base64,${btoa(unescape(encodeURIComponent(text)))}`;
}

function jsrc(module,src){
	const id = module;
	if(document.getElementById(module))document.getElementById(module).remove();
	module=document.createElement('script');
	document.head.insertBefore(module,document.head.lastChild);
	module.id=id;
	module.src=src;
}

function json(text){
	let j = JSON.parse(text);
	for(x in j){
		let obj = document.getElementById(x);
		if(obj)obj.value!='undefined'?obj.value=j[x]:obj.innerHTML=j[x];
	}
}

function menu(t){
	let m = '';
	let j = JSON.parse(t);
	for(x in j) m += `<li><a onclick="loadJig('${x}')">${j[x]}</a></li>`;
	nav.innerHTML = m;
}
function loadJig(jig){
	css.href='jig/'+jig+'/css.css';
	loadFile('jig/'+jig+'/index.html',htm);
	loadFile('jig/'+jig+'/js.js',js);
}
function sendForm(sender,disable,callback){
	const url = sender.action.split('/');
	const action = `${sender.action}`;
	const json = {};
	const formData = new FormData(sender);
	for (const [key, value] of formData.entries()) json[key] = value;
	disable(true);
	fetch(action, {
		method: 'POST',
		headers : {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(json)
	}).then(response => {
		return response.json();
	}).then(data => {
		callback(data);
		disable(false);
	}).catch(error => {
		callback({"error":'Server error'});
		disable(false);
	});
	return false;
}