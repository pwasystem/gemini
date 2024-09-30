const fs = require('fs');
const https = require('https');
const http = require('http');
	
const systemInstruction = fileread('jig/w3css/template/instructions.txt');
const roleUser = fileread('jig/w3css/template/input/pwasystem.html');
const roleModel = fileread('jig/w3css/template/output/pwasystem.json');

const history =  [
      {
        role: "user",
        parts: [
          {text: roleUser},
        ],
      },
      {
        role: "model",
        parts: [
          {text: roleModel},
        ],
      },
    ];

//Controller
exports.run = async (data,func) => {	
	if(data.codesave){
		console.log(`save file: `+data.filesave);
		await saveFile(`html/${data.filesave}`,data.codesave);
		return `{"saved":"saved"}`;
		
	} else {
		let message;
		data.file = hash(data.file);
		data.project = hash(data.title);
		if (!fs.existsSync(`html/${data.project}/`))fs.mkdirSync(`html/${data.project}/`);
		data.archive = `html/${data.project}/${data.file}.html`;
		
		if(data.maker==`new`){
			//create message
			let template = await getTemplate(data.template); //get template
			message=`
You must create an original website for the company ${data.title}.
The company title is ${data.title}.
Use these informations to make texts to website: ${data.description}.
The project name id ${data.project}.
The file name is ${data.file}.
${(data.imageSend!=``?`You must use the list of images below on the website:\n${data.imageSend}\n`:``)}
The website must use the template below to create the website:
${template}
`;
		} else {
			//sugest changes
			message=`${data.change} in the code bellow.\n\n${data.code}\n`;
		}
		
		//get code
		var code = await func(message,systemInstruction,history);

		//process images
		if (data.imageSave=='true'){
			let imageUrl = data.imageSend.split('\n');
			await clearDirectory(`html/${data.project}/img/${data.file}`);
			for (let i in imageUrl){
				if(imageUrl[i].length>5){
					await downloadImage(imageUrl[i], `html/${data.project}/img/${data.file}/image${i}.jpg`);
					let regUrl = new RegExp(imageUrl[i],'g');
					code = code.replace(regUrl,`img/${data.file}/image${i}.jpg`);
				}
			}
		}
		
		//save file
		data.response=JSON.parse(normalize(code));
		await saveFile(data.archive,data.response.code);
		
		return code;
	}
}

function saveFile(archive, data){
	fs.writeFile(archive, data , err => {
		if (err) throw err;
		console.log(`${archive} has saved!`);
		return true;
	});
}

//read file
function fileread(filename){            
   var contents = fs.readFileSync(filename);
   return contents.toString();
}        

//normalize data
function normalize(data){
	return data.replace(/ \\ /g," \\ ");
}

//get template source
async function getTemplate(template){
	return new Promise((resolve, reject) => {
		https.get(`https://www.w3schools.com/w3css/tryw3css_templates_${template}.htm`,res => {	
			let html = '' ;
			res.on('data', d => html += d);
			res.on('end', () => resolve(html));	
		}).on('error',e => reject(e));
	});
}

//download images
function downloadImage (url, filename) {	
	let client = url.toString().indexOf("https") === 0 ? https : http;
	return new Promise((resolve, reject) => {
		client.get(url, (res) => {
			res.pipe(fs.createWriteStream(filename))
			.on('error', reject)
			.once('close', () => resolve(filename))
		})
	})
}

//clear dir
async function clearDirectory(dir) {
	fs.rmSync(dir, { recursive: true, force: true });
	fs.mkdirSync(dir , { recursive: true, force: true });
}

//hash
function hash(word){
	return word.normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).replace(/[^\w\s]/gi,``).replace(/\s/g,`-`).replace(/--/g,`-`).toLowerCase();
}