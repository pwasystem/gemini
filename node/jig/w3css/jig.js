const fs = require('fs');
const https = require('https');
const http = require('http');

class JIG {
	constructor (ai,data) {
		this.ai = ai;
		this.data = data;
	}
	
	async run(){
		let data = this.data;
		let ai = this.ai;
		if(data.codesave) {
			data.code = await this.codeSave(data);
		} else {
			data.file = this.hash(data.file);
			data.project = this.hash(data.title);
			if (!fs.existsSync(`html/${data.project}/`))fs.mkdirSync(`html/${data.project}/`);
			data.archive = `html/${data.project}/${data.file}.html`;			
			const message = data.maker==`new` ? await this.codeNew(data):this.codeChange(data);
			data.code = await ai.gemini(message);			
			if (data.imageSave=='true') data.code = await this.imageSave(data);
			data.code = data.code.replace('```html','').replace('```','');
			await this.saveFile(data.archive,data.code);
		}		
		return { 
			title : data.title,
			file : `${data.file}.html`,
			project : data.project,
			code : data.code
		};
	}
	
	async imageSave (data) {		
		let imageUrl = data.imageSend.split('\n');
		let code = data.code;
		await this.clearDirectory(`html/${data.project}/img/${data.file}`);
		for (let i in imageUrl){
			if(imageUrl[i].length>5){
				let ext = imageUrl[i].substr(imageUrl[i].lastIndexOf('.')+1);
				await this.downloadImage(imageUrl[i], `html/${data.project}/img/${data.file}/image${i}.${ext}`);
				let regUrl = new RegExp(imageUrl[i],'g');
				code = code.replace(regUrl,`img/${data.file}/image${i}.${ext}`);
			}
		}
		return code;
	}
	
	async codeNew(data) {
		let template = await this.getTemplate(data.template); //get template
		return `
				You must create an original website for the company ${data.title}.
				The company title is ${data.title}.
				Use these informations to make texts to website: ${data.description}.
				The project name id ${data.project}.
				The file name is ${data.file}.
				${(data.imageSend!=``?`You must use the list of images below on the website:\n${data.imageSend}\n`:``)}
				The website must use the template below to create the website:
				${template}
			`;	
	}
	
	codeChange(data){
		return `${data.change} in the filename ${data.file}, the code bellow.\n\n${data.code}\n`;
	}
	
	async codeSave(data){
		console.log(`save file: `+data.filesave);
		await this.saveFile(`html/${data.filesave}`,data.codesave);
		return `{"saved":"saved"}`;
		
	}
	
	normalize(data){
		return data.replace(/ \\ /g," \\ ");
	}
	
	saveFile(archive, content){
		fs.writeFile(archive, content , err => {
			if (err) throw err;
			console.log(`${archive} has saved!`);
			return true;
		});
	}
	
	//download image
	downloadImage (url, filename) {	
		let client = url.toString().indexOf("https") === 0 ? https : http;
		return new Promise((resolve, reject) => {
			client.get(url, (res) => {
				res.pipe(fs.createWriteStream(filename))
				.on('error', reject)
				.once('close', () => resolve(filename))
			})
		});
	}
	
	//make hash
	hash(word){
		return word.normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).replace(/[^\w\s]/gi,``).replace(/\s/g,`-`).replace(/--/g,`-`).toLowerCase();
	}
	
	//clear dir
	async clearDirectory(dir) {
		fs.rmSync(dir, { recursive: true, force: true });
		fs.mkdirSync(dir , { recursive: true, force: true });
	}
	
	//get template source
	async getTemplate(template){
		return new Promise((resolve, reject) => {
			https.get(`https://www.w3schools.com/w3css/tryw3css_templates_${template}.htm`,res => {	
				let html = '' ;
				res.on('data', d => html += d);
				res.on('end', () => resolve(html));	
			}).on('error',e => reject(e));
		});
	}
	
}

module.exports = JIG;