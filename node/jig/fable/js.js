jsrc(`model`,`https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet`);

async function archivesLoad() {
	let files = archives.files.length;
	if(files>0){
		viewResult.style.display=`none`;
		imageView.innerHTML='';
		for (i = 0; i < files; i++) {
			imageView.innerHTML += `<br>
			<figure style='position:relative'>
				<img class='w3-image' src='img/${archives.files[i].name}' name='${archives.files[i].name}' id='img${i}'>
				<figcaption style='position:absolute;bottom:0%;left:10%;right:10%;margin:8px' class='w3-small w3-white w3-opacity w3-left-align' id='fig${i}'></figcaption>
			</figure>`;
		}
		imageView.innerHTML+=`<br>`;
		let net;
		let images = [] ;
		viewAwait.style.display='block';
		net = await mobilenet.load();
		for(i=0; i<files; i++){
			let imgEl = document.getElementById(`img${i}`);
			let result = await net.classify(imgEl);
			images.push({
				name : document.getElementById(`img${i}`).name,
				descriptions: {
					high : {
						percent : parseInt(result[0].probability*100) ,
						description : result[0].className
					},
					medium : {
						percent : parseInt(result[1].probability*100) ,
						description : result[1].className
					},
					low : {
						percent : parseInt(result[2].probability*100) ,
						description : result[2].className
					}
				}
			});
			document.getElementById(`fig${i}`).innerHTML = `
			${parseInt(result[0].probability*100)}% ${result[0].className}<br>
			${parseInt(result[1].probability*100)}% ${result[1].className}<br>
			${parseInt(result[2].probability*100)}% ${result[2].className}`;
		}	
		viewAwait.style.display=`none`;
		viewResult.style.display=`block`;
		jsonText = JSON.stringify(images,null,`\t`);
		jsonView.innerText=jsonText;
		jsonHide.innerText=jsonText;
	}
}
function jsonCopy(){
	jsonHide.style.display=`block`;
	jsonHide.select();
	document.execCommand(`copy`);
	jsonHide.style.display=`none`;
	alert(`copied`);
}
