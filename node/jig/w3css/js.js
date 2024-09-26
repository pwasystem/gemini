//disable and enable form itens
main.disable = make => {
	if (make==true) {
		w3cssView.style = 'display:none';
		w3cssLoad.style = 'display:block';
		w3cssResponse.style = 'display:block';
	} else {		
		w3cssView.style = 'display:block';
		w3cssLoad.style = 'display:none';
	}
	genereter.disabled=make;
}

//process json data
main.callback = data => {
	linkPage.innerHTML = 'View page' + title.value;
	archive.value=`${data.project}/${data.file}`;
	code.value=data.code;
	changeman.style.display='block';
	source.style.display='block';
	btnExtra.style.display='block';
	let message = `<p>The ${data.title} page was created successfully!</p><button type='button' class='w3-button w3-green w3-round w3-center' onclick="w3cssResponse.style.display='none';main.viewHTML()"> 모 View page ${data.title}</button>`;
	if(data.error)message = `<p class="w3-text-red w3-xxlarge">Server error</p>`;
	w3cssView.innerHTML=`<span onclick="w3cssResponse.style.display='none'" class="w3-button w3-round w3-white w3-card w3-display-topright" style="right:10px;top:6px">&times;</span>${message}`;
}

//update image
main.imageUpdate = () => {
	imageSend.innerHTML = imageList.innerText;
}
//add image
main.imageAddList = () => {
	if (imageAdd.value!=''){
		imageList.innerHTML += "\n<li onclick='main.imageDel(this)' class='w3-tiny link' title='Click to delete'>"+imageAdd.value+"</li>";
		imageAdd.value='';
	}
	main.imageUpdate();
}
//remove image
main.imageDel = element => {
	imageList.removeChild(element);
	main.imageUpdate();
}

//show template image
main.templateImage = template => {
	let imageURL = new Array();
	imageURL['coming_soon'] = 'comingsoon';
	imageURL['dark_portfolio'] = 'dark_icon';
	imageURL['bw_portfolio'] = 'bw_port';
	imageURL['restaurant_modal'] = 'modal_restaurant';
	imageURL['start_page'] = 'startpage';
	imageURL['streetart'] = 'art';
	imageURL['black'] = 'demosite';
	imageURL['red'] = 'demosite';
	imageURL['teal'] = 'demosite';
	templateView.src='https://www.w3schools.com/w3css/img_temp_'+(imageURL[template]?imageURL[template]:template)+'.jpg';
}
//control save image
main.imageSaveStatus = () => {
	imageSave.value=imageSave.checked?'true':'false';
	imageAdd.pattern=imageSave.checked?'^(http|https)?:\/\/.*\.(jpg|jpeg|gif|webp|png)$':'^(https?:\/\/)([^:]+)(:\d*)?(\/.*)?$';
	reg = new RegExp(imageAdd.pattern);
	list=imageList.children;
	for(let i in list){
		if(list[i].type==''){
			url = list[i].innerText;
			list[i].style.color = reg.test(list[i].innerText) ? 'black':'red'
		}
	}
}
//view created in new tab
main.viewHTML = () => {
	let pageViewer = window.open(archive.value,title.value,'popup=false');
}

//recrette page
main.recreate = () => {
	changeman.style.display='none';
	generator.style.display='block';
}

//save page
main.saving = make => {
	if (make==true) {
		w3cssView.style = 'display:none';
		w3cssLoad.style = 'display:block';
		w3cssResponse.style = 'display:block';
	} else {		
		w3cssView.style = 'display:block';
		w3cssLoad.style = 'display:none';
	}
}

main.saved = () => {
	w3cssView.innerHTML=`<span onclick="w3cssResponse.style.display='none'" class="w3-button w3-round w3-white w3-card w3-display-topright" style="right:10px;top:6px">&times;</span><p>The ${title.value} page was saved successfully!</p><button type='button' class='w3-button w3-green w3-round w3-center' onclick="w3cssResponse.style.display='none';main.viewHTML()"> 모 View page ${title.value}</button>`;
}

main.save = () =>{
	codesave.value=code.value;
	filesave.value=archive.value;
	sendForm(saver,main.saving,main.saved);
}